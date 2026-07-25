/*!
 * Project-HAT
 * File: scene.js
 * Version: Alpha 0.1.3
 * Date: 2026-07-26
 * Author: 66
 *
 * 场景系统
 */

"use strict";

const SceneManager = (() => {

    const scenes = {};

    let currentScene = null;

    function register(id, config) {

        scenes[id] = Object.assign({

            id,

            title: "",

            location: "",

            background: "",

            music: "",

            onEnter: null,

            onExit: null,

            actions: []

        }, config);

    }

    function exists(id) {
        return !!scenes[id];
    }

    function get(id) {
        return scenes[id] || null;
    }

    function enter(id) {

        if (!exists(id)) {

            console.warn("Scene Not Found:", id);
            return false;

        }

        if (currentScene && currentScene.onExit instanceof Function) {
            currentScene.onExit(currentScene);
        }

        currentScene = scenes[id];

        if (window.HAT) {

            HAT.state.location = currentScene.location;

        }

        document.dispatchEvent(new CustomEvent("scene:change", {
            detail: currentScene
        }));

        if (currentScene.onEnter instanceof Function) {
            currentScene.onEnter(currentScene);
        }

        return true;

    }

    function current() {
        return currentScene;
    }

    function action(index) {

        if (!currentScene) return;

        const act = currentScene.actions[index];

        if (!act) return;

        if (act.condition instanceof Function) {

            if (!act.condition()) return;

        }

        if (act.execute instanceof Function) {

            act.execute();

        }

    }

    register("campus_gate", {

        title: "大学校门",

        location: "大学校门",

        background: "assets/bg/campus_gate.jpg",

        music: "assets/bgm/day.mp3",

        actions: [

            {
                text: "进入校园",

                execute() {

                    enter("campus_square");

                }

            }

        ]

    });

    register("campus_square", {

        title: "校园广场",

        location: "校园广场",

        background: "assets/bg/square.jpg",

        music: "assets/bgm/day.mp3",

        actions: [

            {
                text: "教学楼",

                execute() {

                    enter("teaching_building");

                }

            },

            {
                text: "宿舍",

                execute() {

                    enter("dormitory");

                }

            },

            {
                text: "食堂",

                execute() {

                    enter("canteen");

                }

            },

            {
                text: "图书馆",

                execute() {

                    enter("library");

                }

            }

        ]

    });

    register("teaching_building", {

        title: "教学楼",

        location: "教学楼",

        background: "assets/bg/teaching.jpg",

        music: "assets/bgm/campus.mp3"

    });

    register("library", {

        title: "图书馆",

        location: "图书馆",

        background: "assets/bg/library.jpg",

        music: "assets/bgm/library.mp3"

    });

    register("canteen", {

        title: "学生食堂",

        location: "学生食堂",

        background: "assets/bg/canteen.jpg",

        music: "assets/bgm/day.mp3"

    });

    register("dormitory", {

        title: "宿舍",

        location: "宿舍",

        background: "assets/bg/dormitory.jpg",

        music: "assets/bgm/night.mp3"

    });

    register("playground", {

        title: "操场",

        location: "操场",

        background: "assets/bg/playground.jpg",

        music: "assets/bgm/day.mp3"

    });

    register("supermarket", {

        title: "校园超市",

        location: "校园超市",

        background: "assets/bg/shop.jpg"

    });

    register("express_station", {

        title: "快递站",

        location: "快递站",

        background: "assets/bg/express.jpg"

    });

    register("coffee_shop", {

        title: "咖啡店",

        location: "咖啡店",

        background: "assets/bg/coffee.jpg"

    });

    register("music_room", {

        title: "音乐教室",

        location: "音乐教室",

        background: "assets/bg/music.jpg"

    });

    register("city_street", {

        title: "商业街",

        location: "商业街",

        background: "assets/bg/street.jpg"

    });

    function list() {

        return Object.values(scenes);

    }

    return {

        register,

        enter,

        current,

        currentScene: current,

        action,

        list,

        exists,

        get

    };

})();

window.SceneManager = SceneManager;