/*!
 * Project-HAT
 * File: dialog.js
 * Version: Alpha 0.1.3
 * Date: 2026-07-26
 * Author: 66
 */

"use strict";

const DialogManager = (() => {

    const dialogs = {};

    let current = null;
    let index = 0;
    let running = false;

    const ui = {

        box: null,
        name: null,
        text: null,
        options: null

    };

    function init() {

        ui.box = document.getElementById("dialog-box");
        ui.name = document.getElementById("dialog-name");
        ui.text = document.getElementById("dialog-text");
        ui.options = document.getElementById("dialog-options");

        if (!ui.box) {

            createUI();

        }

    }

    function createUI() {

        const box = document.createElement("div");

        box.id = "dialog-box";

        box.style.position = "fixed";
        box.style.left = "50%";
        box.style.bottom = "30px";
        box.style.transform = "translateX(-50%)";
        box.style.width = "90%";
        box.style.maxWidth = "900px";
        box.style.background = "rgba(255,255,255,.65)";
        box.style.backdropFilter = "blur(20px)";
        box.style.borderRadius = "24px";
        box.style.padding = "22px";
        box.style.boxShadow = "0 10px 35px rgba(0,0,0,.18)";
        box.style.display = "none";
        box.style.zIndex = "9999";

        const name = document.createElement("div");

        name.id = "dialog-name";
        name.style.fontWeight = "bold";
        name.style.fontSize = "20px";
        name.style.marginBottom = "12px";

        const text = document.createElement("div");

        text.id = "dialog-text";
        text.style.lineHeight = "1.8";
        text.style.minHeight = "80px";
        text.style.whiteSpace = "pre-wrap";

        const options = document.createElement("div");

        options.id = "dialog-options";
        options.style.marginTop = "18px";
        options.style.display = "flex";
        options.style.flexWrap = "wrap";
        options.style.gap = "10px";

        box.appendChild(name);
        box.appendChild(text);
        box.appendChild(options);

        document.body.appendChild(box);

        ui.box = box;
        ui.name = name;
        ui.text = text;
        ui.options = options;

    }

    function register(id, data) {

        dialogs[id] = data;

    }

    function exists(id) {

        return !!dialogs[id];

    }

    function get(id) {

        return dialogs[id] || null;

    }

    function start(id) {

        if (!exists(id)) return false;

        current = dialogs[id];
        index = 0;
        running = true;

        ui.box.style.display = "block";

        render();

        return true;

    }
        function render() {

        if (!running || !current) return;

        if (index >= current.length) {

            finish();
            return;

        }

        const node = current[index];

        ui.name.textContent = node.name || "";

        ui.text.textContent = node.text || "";

        ui.options.innerHTML = "";

        if (node.onShow instanceof Function) {

            node.onShow(node);

        }

        if (Array.isArray(node.options) && node.options.length > 0) {

            node.options.forEach(option => {

                const button = document.createElement("button");

                button.textContent = option.text || "继续";

                button.onclick = () => {

                    if (option.action instanceof Function) {

                        option.action();

                    }

                    if (typeof option.next === "number") {

                        index = option.next;

                    } else {

                        index++;

                    }

                    render();

                };

                ui.options.appendChild(button);

            });

            return;

        }

        const nextButton = document.createElement("button");

        nextButton.textContent = "继续";

        nextButton.onclick = next;

        ui.options.appendChild(nextButton);

    }

    function next() {

        if (!running) return;

        index++;

        render();

    }

    function finish() {

        running = false;

        current = null;

        index = 0;

        ui.box.style.display = "none";

        ui.options.innerHTML = "";

        ui.name.textContent = "";

        ui.text.textContent = "";

        document.dispatchEvent(

            new CustomEvent("dialog:end")

        );

    }

    function close() {

        finish();

    }

    function isRunning() {

        return running;

    }

    function currentDialog() {

        return current;

    }

    function currentIndex() {

        return index;

    }
        function add(id, node) {

        if (!dialogs[id]) {

            dialogs[id] = [];

        }

        dialogs[id].push(node);

    }

    function remove(id) {

        if (!dialogs[id]) return;

        delete dialogs[id];

    }

    function clear() {

        Object.keys(dialogs).forEach(id => {

            delete dialogs[id];

        });

    }

    function list() {

        return Object.keys(dialogs);

    }

    document.addEventListener("keydown", e => {

        if (!running) return;

        if (e.key === " " || e.key === "Enter") {

            const hasChoice =
                current &&
                current[index] &&
                Array.isArray(current[index].options) &&
                current[index].options.length > 0;

            if (!hasChoice) {

                next();

            }

        }

        if (e.key === "Escape") {

            close();

        }

    });

    init();

    register("demo", [

        {

            name: "系统",

            text: "欢迎来到《她和他们》。"

        },

        {

            name: "系统",

            text: "新的大学生活即将开始。"

        },

        {

            name: "系统",

            text: "祝你拥有一段难忘的旅程。"

        }

    ]);

    if (window.HAT && HAT.log instanceof Function) {

        HAT.log("Dialog Ready");

    }
        document.addEventListener("scene:change", e => {

        if (!e.detail) return;

        if (running) {

            close();

        }

    });

    window.addEventListener("hat:load", () => {

        if (running) {

            close();

        }

    });

    window.addEventListener("hat:save", () => {

        if (window.HAT && HAT.log instanceof Function) {

            HAT.log("Dialog Auto Saved");

        }

    });

    return {

        init,

        register,

        add,

        remove,

        clear,

        list,

        exists,

        get,

        start,

        next,

        close,

        finish,

        render,

        isRunning,

        currentDialog,

        currentIndex

    };

})();

window.DialogManager = DialogManager;
