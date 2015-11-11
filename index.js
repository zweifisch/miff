"use strict";

let util = require("./util");

let take = util.take;
let unshift = util.unshift;
let skip = util.skip;

const SPACE = 0;
const STRING = 1;
const SYMBOL = 2;
const NEWLINE = 3;
const OP = 4;
const BOOL = 5;
const COMMENT = 6;

let tokenize = function*(input) {
    let quoting = false;
    let escaping = false;
    let commenting = false;
    let token = "";
    let line = 1;

    let collect = function*(type) {
        if (token) {
            type = type || SYMBOL;
            if (type === SYMBOL) {
                if (token === "on" || token === "true") {
                    token = true;
                    type = BOOL;
                } else if (token === "off" || token === "false") {
                    token = false;
                    type = BOOL;
                }
            }
            yield {val:token, type: type, line: line};
            token = "";
        };
    };
    
    for (let char of input) {
        if (commenting) {
            if (char === "\n") {
                commenting = false;
                yield *collect(COMMENT);
                yield {val: char, type: NEWLINE, line: line};
                line += 1;
            } else {
                token += char;
            }
        } else if (escaping) {
            escaping = false;
            token += char;
        } else if (quoting) {
            if (char === "\\") {
                escaping = true;
            } else if (char === quoting) {
                quoting = false;
                yield *collect(STRING);
            } else {
                token += char;
            }
        } else {
            switch (char) {
            case ' ':
                yield *collect();
                yield {val:char, type: SPACE, line: line};
                continue;
            case '"':
            case "'":
                quoting = char;
                continue;
            case "=":
            case "[":
            case "]":
            case ".":
            case ",":
                yield *collect();
                yield {val: char, type: OP, line: line};
                continue;
            case "#":
                yield *collect();
                commenting = true;
                continue;
            case "\n":
                yield *collect();
                yield {val: char, type: NEWLINE, line: line};
                line += 1;
                continue;
            case "\r":
                continue;
            }
            token += char;
        }
    }
    if (quoting) throw Error(`unmatched ${quoting}`);
    yield *collect();
};

let ensureNamespace = (obj, namespace)=> {
    let node = obj;
    for (let name of namespace) {
        if (!(name in node)) {
            node[name] = new Object(null);
        }
        node = node[name];
    }
    return node;
};

let isOP = (val, token)=> token.type === OP && token.val === val;

let isSP = (token)=> token.type === SPACE;

let parseNamespace = function(tokens) {
    let ns = [];
    while (true) {
        let token = tokens.next();
        if (token.value.type === SYMBOL) {
            ns.push(token.value.val);
            token = tokens.next();
            if (isOP("]", token.value)) break;
            if (!isOP(".", token.value))
                throw Error(`unexpected token in section header ${token.value.val}`);
        }
    }
    return ns;
};

let parseArray = function(tokens) {
    let result = [];
    while(true) {

        tokens = skip(tokens, (x)=> isSP(x) || x.type === NEWLINE || isOP(",", x));

        let token = tokens.next();
        if (token.done) throw Error(`array not closed on line ${token.value.line}`);
        if (isOP("]", token.value)) break;

        tokens = unshift(token.value, tokens);
        let todo = parseValue(tokens);
        result.push(todo[0]);
        tokens = todo[1];

        tokens = skip(tokens, isSP);

        token = tokens.next();

        if (isOP("]", token.value)) break;

        if (!(isOP(",", token.value) || token.value.type === NEWLINE)) {
            throw Error(`unexpected token in array "${token.value.val}"`);
        }
    }
    return [result, tokens];
};

let parseValue = function(tokens) {
    tokens = skip(tokens, isSP);
    let token = tokens.next();
    if (isOP("[", token.value)) {
        return parseArray(tokens);
    } else if (token.value.type === STRING) {
        return [token.value.val, tokens];
    } else if (token.value.type === BOOL) {
        return [token.value.val, tokens];
    }
    tokens = unshift(token.value, tokens);

    let todo = take(tokens, (x)=> x.type !== NEWLINE && !isOP(",", x) && !isOP("]", x));
    let value = todo[0];
    tokens = todo[1];
    let result = value.map((x)=> x.val).join("").trim();
    if (!isNaN(parseFloat(result)) && isFinite(result))
        result = parseFloat(result);
    return [result, tokens];
};

exports.parse = function(input, result) {
    result = result || new Object(null);
    let node = result;
    let tokens = tokenize(input);
    tokens = skip(tokens, (x)=> x.type === NEWLINE || x.type === SPACE);
    let token = tokens.next();

    let parse = function() {
        if (isOP("[", token.value)) {
            node = ensureNamespace(result, parseNamespace(tokens));
        } else if (token.value.type === SYMBOL) {
            let key = token.value.val;
            tokens = skip(tokens, isSP);
            token = tokens.next();
            if (token.done) throw Error(`unexpected end of file, missing value for key ${key}`);
            if (!isOP("=", token.value)) throw Error(`missing value for key ${key}`);
            let todo = parseValue(tokens);
            node[key] = todo[0];
            tokens = todo[1];
        }
        token = tokens.next();
    };

    while(!token.done) parse();

    return result;
};

exports.tokenize = tokenize;

exports.types = {
    SPACE:SPACE,
    STRING:STRING,
    SYMBOL:SYMBOL,
    NEWLINE:NEWLINE,
    OP:OP,
    BOOL:BOOL,
    COMMENT:COMMENT
};

exports.load = function (files) {
    let fs = require('fs');
    let ret = new Object(null);
    for (let file of files)
        exports.parse(fs.readFileSync(file, {encoding: 'utf8'}), ret);
    return ret;
};

exports.stringify = function() {
    return ;
};

exports.dump = function() {
};
