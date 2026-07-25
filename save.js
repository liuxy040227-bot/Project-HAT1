/*!
 * Project-HAT
 * File: save.js
 * Version: Alpha 0.1.3
 * Date: 2026-07-26
 * Author: 66
 *
 * 存档系统
 */

"use strict";

const SaveManager = (() => {

    const SAVE_KEY = "Project-HAT-Save";
    const AUTO_SAVE_KEY = "Project-HAT-AutoSave";
    const SAVE_VERSION = "Alpha 0.1.3";

    function buildData() {

        return {

            version: SAVE_VERSION,

            time: Date.now(),

            engine: window.HAT ? JSON.parse(JSON.stringify(HAT.state)) : {},

            characters: window.HAT ? JSON.parse(JSON.stringify(HAT.characters)) : {},

            scene: window.SceneManager && SceneManager.current()
                ? SceneManager.current().id
                : null

        };

    }

    function save(slot = SAVE_KEY) {

        try {

            const data = buildData();

            localStorage.setItem(
                slot,
                JSON.stringify(data)
            );

            document.dispatchEvent(new CustomEvent("save:success", {
                detail: data
            }));

            return true;

        } catch (e) {

            console.error(e);

            return false;

        }

    }

    function autoSave() {

        return save(AUTO_SAVE_KEY);

    }

    function load(slot = SAVE_KEY) {

        try {

            const raw = localStorage.getItem(slot);

            if (!raw) return false;

            const data = JSON.parse(raw);

            if (window.HAT) {

                Object.assign(HAT.state, data.engine || {});

                if (data.characters) {

                    Object.keys(data.characters).forEach(name => {

                        if (HAT.characters[name]) {

                            Object.assign(
                                HAT.characters[name],
                                data.characters[name]
                            );

                        }

                    });

                }

            }

            if (
                window.SceneManager &&
                data.scene &&
                SceneManager.exists(data.scene)
            ) {

                SceneManager.enter(data.scene);

            }

            document.dispatchEvent(new CustomEvent("save:loaded", {
                detail: data
            }));

            return true;

        } catch (e) {

            console.error(e);

            return false;

        }

    }

    function loadAuto() {

        return load(AUTO_SAVE_KEY);

    }

    function hasSave(slot = SAVE_KEY) {

        return localStorage.getItem(slot) !== null;

    }

    function remove(slot = SAVE_KEY) {

        localStorage.removeItem(slot);

    }

    function clearAll() {

        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem(AUTO_SAVE_KEY);

    }

    function exportSave() {

        const raw = localStorage.getItem(SAVE_KEY);

        if (!raw) return null;

        const blob = new Blob(
            [raw],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download =
            "Project-HAT-" +
            Date.now() +
            ".json";

        document.body.appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(url);

    }

    function importSave(file, callback) {

        const reader = new FileReader();

        reader.onload = function () {

            try {

                JSON.parse(reader.result);

                localStorage.setItem(
                    SAVE_KEY,
                    reader.result
                );

                if (callback) {

                    callback(true);

                }

            } catch (e) {

                console.error(e);

                if (callback) {

                    callback(false);

                }

            }

        };

        reader.readAsText(file);

    }

    function getInfo(slot = SAVE_KEY) {

        const raw = localStorage.getItem(slot);

        if (!raw) return null;

        try {

            const data = JSON.parse(raw);

            return {

                version: data.version,

                time: data.time,

                scene: data.scene

            };

        } catch {

            return null;

        }

    }

    return {

        save,
        load,

        autoSave,
        loadAuto,

        hasSave,

        remove,

        clearAll,

        exportSave,

        importSave,

        getInfo

    };

})();

window.SaveManager = SaveManager;