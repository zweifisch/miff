"use strict";

exports.skip = function*(iterator, fn) {
    var item;
    while (!((item = iterator.next()).done) && fn(item.value)) {}
    if (!item.done) yield item.value;
    yield *iterator;
};

exports.unshift = function*(val, iterator) {
    yield val;
    yield *iterator;
};

exports.peek = function*(iterator) {
    let cached = [];
    console.log(">>>>");
    for (let item of iterator) {
        console.log(item);
        cached.push(item);
    }
    console.log("<<<<");
    yield;
    while (cached.length) yield cached.shift();
};

exports.take = (iterator, fn) => {
    let result = [];
    let item;
    while (!((item = iterator.next()).done) && fn(item.value)) {
        result.push(item.value);
    }
    return [result, item.done ? iterator : exports.unshift(item.value, iterator)];
};
