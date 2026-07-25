/*!
 * Project-HAT
 * File: engine.js
 * Version: Alpha 0.1.3
 * Date: 2026-07-26
 * Author: 66
 */

"use strict";

const HAT = (() => {

    const VERSION = "Alpha 0.1.3";

    const state = {

        version: VERSION,

        day: 1,

        week: 1,

        month: 9,

        year: 1,

        period: "上午",

        weather: "晴",

        location: "大学校园",

        money: 3000,

        energy: 100,

        mood: 80,

        popularity: 0,

        relationship: {},

        inventory: [],

        flags: {},

        eventQueue: [],

        logs: []

    };

    const characters = {

        "官俊臣": createCharacter("官俊臣"),
        "张桂源": createCharacter("张桂源"),
        "张函瑞": createCharacter("张函瑞"),
        "王橹杰": createCharacter("王橹杰"),
        "左奇函": createCharacter("左奇函"),
        "陈奕恒": createCharacter("陈奕恒"),
        "杨涵博": createCharacter("杨涵博"),
        "张奕然": createCharacter("张奕然"),
        "聂玮辰": createCharacter("聂玮辰"),
        "魏子宸": createCharacter("魏子宸"),
        "陈思罕": createCharacter("陈思罕"),
        "陈浚铭": createCharacter("陈浚铭"),
        "王烁然": createCharacter("王烁然"),
        "杨博文": createCharacter("杨博文"),
        "李煜东": createCharacter("李煜东")

    };

    function createCharacter(name){

        return{

            name,

            favor:0,

            trust:0,

            friendship:0,

            romance:0,

            meet:false,

            unlocked:false,

            events:[],

            dailyTalk:0

        };

    }

    function log(text){

        state.logs.push({

            time:Date.now(),

            text

        });

        if(state.logs.length>300){

            state.logs.shift();

        }

    }

    function emit(name,data={}){

        window.dispatchEvent(

            new CustomEvent(name,{
                detail:data
            })

        );

    }

    function save(){

        const saveData={

            state,

            characters

        };

        localStorage.setItem(
            "Project-HAT-Save",
            JSON.stringify(saveData)
        );

        log("游戏已保存");

        emit("hat:save");

    }

    function load(){

        const raw=localStorage.getItem(
            "Project-HAT-Save"
        );

        if(!raw) return false;

        try{

            const data=JSON.parse(raw);

            Object.assign(state,data.state);

            Object.keys(data.characters).forEach(name=>{

                if(characters[name]){

                    Object.assign(
                        characters[name],
                        data.characters[name]
                    );

                }

            });

            log("读取存档");

            emit("hat:load");

            return true;

        }catch(e){

            console.error(e);

            return false;

        }

    }

    function newGame(){

        localStorage.removeItem(
            "Project-HAT-Save"
        );

        location.reload();

    }

    function meet(name){

        if(!characters[name]) return;

        const c=characters[name];

        if(!c.meet){

            c.meet=true;

            c.unlocked=true;

            c.friendship=5;

            state.popularity++;

            log("认识了 "+name);

            emit("hat:meet",c);

        }

    }

    function addFavor(name,value){

        if(!characters[name]) return;

        characters[name].favor+=value;

        emit("hat:favor",{

            name,

            value

        });

    }

    function addFriendship(name,value){

        if(!characters[name]) return;

        characters[name].friendship+=value;

        emit("hat:friendship",{

            name,

            value

        });

    }

    function spendMoney(value){

        state.money-=value;

        if(state.money<0){

            state.money=0;

        }

        emit("hat:money");

    }

    function earnMoney(value){

        state.money+=value;

        emit("hat:money");

    }

    function nextPeriod(){

        const order=[
            "上午",
            "中午",
            "下午",
            "晚上"
        ];

        let index=order.indexOf(state.period);

        index++;

        if(index>=order.length){

            index=0;

            nextDay();

        }

        state.period=order[index];

        emit("hat:time");

    }

    function nextDay(){

        state.day++;

        state.energy=100;

        randomWeather();

        emit("hat:day");

    }

    function randomWeather(){

        const list=[
            "晴",
            "多云",
            "小雨",
            "阴",
            "大雨"
        ];

        state.weather=
            list[
                Math.floor(
                    Math.random()*list.length
                )
            ];

    }

    function addItem(item){

        state.inventory.push(item);

        emit("hat:item",item);

    }

    function hasItem(name){

        return state.inventory.includes(name);

    }

    function queueEvent(event){

        state.eventQueue.push(event);

    }

    function popEvent(){

        if(state.eventQueue.length===0){

            return null;

        }

        return state.eventQueue.shift();

    }

    function getCharacter(name){

        return characters[name];

    }

    function getState(){

        return state;

    }

    log("Engine Ready");

    return{

        VERSION,

        state,

        characters,

        save,

        load,

        newGame,

        meet,

        addFavor,

        addFriendship,

        spendMoney,

        earnMoney,

        nextPeriod,

        nextDay,

        addItem,

        hasItem,

        queueEvent,

        popEvent,

        getCharacter,

        getState,

        log

    };

})();

window.HAT = HAT;