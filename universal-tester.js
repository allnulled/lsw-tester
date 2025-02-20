(function (factory) {
    const mod = factory();
    if (typeof window !== 'undefined') {
        window['UniversalTester'] = mod;
        window['describe'] = mod.describe;
    }
    if (typeof global !== 'undefined') {
        global['UniversalTester'] = mod;
        global['describe'] = mod.describe;
    }
    if (typeof module !== 'undefined') {
        module.exports = mod;
    }
})(function () {

    const runQueue = async function (queue, errorHandler, it) {
        Iterating_tests:
        for (const test of queue) {
            try {
                await test();
            } catch (err) {
                await it.state.onError(err);
                if (errorHandler) {
                    try {
                        await errorHandler(err);
                    } catch (stopExecutionFailure) {
                        console.error("Execution halted due to:", stopExecutionFailure);
                        break Iterating_tests; // Interrumpir la ejecución de la cola
                    }
                } else {
                    console.error(err);
                }
            }
        }
    };
    const print = function (message, color = false) {
        if (typeof global !== "undefined") {
            if (color === "green") {
                console.log(`\x1b[32m${message}\x1b[0m`);
            } else if (color === "red") {
                console.log(`\x1b[31m${message}\x1b[0m`);
            } else {
                console.log(message);
            }
        } else {
            console.log(message);
        }
    };

    const describe = function (description, callback) {
        const queue = [];
        const state = {
            finished: false,
            onFailure: null,
            onError: null,
            tests: {},
            onlyActivated: false
        };
        const getStateReport = function (last = 0, nonStringified = false) {
            if (!last) {
                let report = "";
                report = JSON.stringify(state, null, 2);
                return report;
            } else {
                let report = "";
                state.passed = Object.keys(state.tests).filter(label => state.tests[label].state === "passed");
                state.failed = Object.keys(state.tests).filter(label => state.tests[label].state === "failed");
                if (nonStringified) {
                    return state;
                }
                report = JSON.stringify(state, null, 2);
                return report;
            }
        };
        const updateDOM = function () {
            Only_on_browsers:
            if (typeof window !== "undefined") {
                const matchedElements = Array.from(document.querySelectorAll("[data-test]")).filter(el => el.getAttribute("data-test") === description);
                if (matchedElements.length === 0) {
                    break Only_on_browsers;
                }
                const matchedElement = matchedElements[0];
                matchedElement.textContent = getStateReport(1);
            }
        };
        const updateUI = (is_on = "pass", force_on_nodejs = false, itModified = false, description = false) => {
            try {
                const is_starting_suite = is_on === "begin";
                const is_starting = is_on === "start";
                const is_passing = is_on === "pass";
                const is_failing = is_on === "fail";
                const is_finished = is_on === "finish";
                const is_none = !is_starting_suite && !is_starting && !is_passing && !is_failing && !is_finished;
                if(is_none) {
                    throw new Error("Situation not managed error 1");
                }
                if (is_finished) {
                    state.finished = true;
                }
                On_both_browser_and_nodejs:
                if (itModified) {
                    const mark = itModified.state === "passed" ? "✔" : "✘";
                    if (mark === "✘") {
                        print(`  [${mark}] ${description} [${itModified.took_milliseconds}ms]`, "red");
                    } else {
                        print(`  [${mark}] ${description} [${itModified.took_milliseconds}ms]`, "green");
                    }
                } else if (is_finished) {
                    const r = getStateReport(1, 1);
                    if (r.failed.length) {
                        print(`[✘] Failed ${r.failed.length} check(s) on:`, "red");
                        r.failed.map((id, index) => {
                            return {
                                index: index + 1,
                                test: id,
                                error: r.tests[id].error
                            }
                        }).forEach(info => {
                            const { error, index } = info;
                            print(`  [✘] Fail ${index} on: «${info.test}» | ${error.name}: ${error.message}`, "red");
                            console.log(error);
                        });
                        console.log();
                    } else {
                        print(`[✔] All tests were passed successfully`, "green");
                    }
                } else if (is_starting_suite) {
                    print(`[!] Starting: ${description}`, "green");
                }
            } catch (error) {
                console.error(error);
            } finally {
                updateDOM();
            }
        };
        const startTest = (label) => {
            state.tests[label] = { state: "started", started_at: new Date() };
            return updateUI("start");
        };
        const passTest = (label, output) => {
            Object.assign(state.tests[label], { state: "passed", output, took_milliseconds: (new Date()) - state.tests[label].started_at });
            return updateUI("pass", 1, state.tests[label], label);
        };
        const failTest = async (label, error) => {
            if(typeof(error) === "object" && (error instanceof describe.SilencedError)) {
                // Llamamos al onError igualmente, pero no al onFailure:
                await it.state.onError(error);
                passTest(label, { name: error.name, message: error.message });
                return false;
            }
            Object.assign(state.tests[label], { state: "failed", error, took_milliseconds: (new Date()) - state.tests[label].started_at });
            updateUI("fail", 1, state.tests[label], label);
            return true;
        };
        const it = (label, callback, type = "normal") => {
            queue.push(async () => {
                if (type === "never") return; // Nunca ejecutar "never"
                if (state.onlyActivated && type !== "only" && type !== "always") return; // Prioridad de only/always
                let timeoutId;
                const context = {
                    queue,
                    state,
                    timeout(ms) {
                        return new Promise((_, reject) => {
                            timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms);
                        });
                    }
                };
                try {
                    startTest(label);
                    const result = await callback.call(context);
                    passTest(label, result);
                } catch (err) {
                    const trulyFailed = await failTest(label, err);
                    if(trulyFailed === true) {
                        throw err; // Re-lanzar el error para que runQueue lo capture
                    }
                } finally {
                    clearTimeout(timeoutId); // Limpiar el timeout al finalizar
                }
            });
            if (type === "only") state.onlyActivated = true;
        };

        it.always = (label, fn) => it(label, fn, "always");
        it.never = (label, fn) => it(label, fn, "never");
        it.normally = (label, fn) => it(label, fn, "normal");
        it.only = (label, fn) => it(label, fn, "only");

        it.onFailure = (callback) => {
            state.onFailure = (error) => {
                callback(error); // Configurar el manejador de fracaso de test
                return error;
            };
        };

        it.onError = (callback) => {
            state.onError = (error) => {
                callback(error); // Configurar el manejador de errores
                return error;
            };
        };

        it.describe = describe;
        it.state = state;

        const context = { it };

        callback.call(context, context.it);
        updateUI("begin", 0, 0, description);

        return runQueue(queue, state.onFailure, it).finally(() => {
            updateUI("finish");
        });
    };

    describe.SilencedError = class extends Error {};

    return { describe };
});
