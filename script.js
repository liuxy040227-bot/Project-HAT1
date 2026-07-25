/*
====================================================

Project-HAT
她和他们

Version : Alpha 0.1.0

Developer : 66

====================================================
*/

"use strict";

const Game = {

    current: "boot",

    init() {

        this.bindEvents();

    },

    bindEvents() {

        document
            .getElementById("enterBtn")
            ?.addEventListener("click", () => {

                this.changePage("statement");

            });

        document
            .getElementById("statementNext")
            ?.addEventListener("click", () => {

                this.changePage("author");

            });

        document
            .getElementById("authorNext")
            ?.addEventListener("click", () => {

                this.startGame();

            });

    },

    changePage(next) {

        const currentPage = document.getElementById(this.current);

        if(currentPage){

            currentPage.classList.remove("active");

        }

        const nextPage = document.getElementById(next);

        if(nextPage){

            nextPage.classList.add("active");

        }

        this.current = next;

    },

    startGame(){

        alert("欢迎来到《她和他们》Alpha 0.1");

    }

};

window.addEventListener("DOMContentLoaded", () => {

    Game.init();

});