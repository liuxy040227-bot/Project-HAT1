/*
====================================================
Project-HAT
她和他们

Version : Alpha 0.1.1
Developer : 66
====================================================
*/

"use strict";

const Game = {

    version: "0.1.1",

    currentScene: "boot",

    init() {

        console.log(`Project-HAT ${this.version}`);

        this.Scene.init();

    },

    Scene: {

        init() {

            this.bind();

            this.open("boot");

        },

        bind() {

            document
                .getElementById("enterBtn")
                ?.addEventListener("click", () => {

                    this.open("statement");

                });

            document
                .getElementById("statementNext")
                ?.addEventListener("click", () => {

                    this.open("author");

                });

            document
                .getElementById("authorNext")
                ?.addEventListener("click", () => {

                    Game.start();

                });

        },

        open(id) {

            document
                .querySelectorAll(".page")
                .forEach(page => {

                    page.classList.remove("active");

                });

            const page = document.getElementById(id);

            if (page) {

                page.classList.add("active");

                Game.currentScene = id;

            }

        }

    },

    UI: {

        message(text) {

            console.log(text);

        }

    },

    Audio: {

        play(name) {

            console.log("Play:", name);

        }

    },

    Storage: {

        save() {

            console.log("Save");

        },

        load() {

            console.log("Load");

        }

    },

    start() {

        alert("欢迎来到《她和他们》！\n\nAlpha 0.1.1");

    }

};

window.addEventListener("DOMContentLoaded", () => {

    Game.init();

});