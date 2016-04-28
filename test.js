"use strict";

require("chai").should();

let tokenize = require("./index").tokenize;
let parse = require("./index").parse;
let types = require("./index").types;
let SPACE = types.SPACE;
let STRING = types.STRING;
let SYMBOL = types.SYMBOL;
let NEWLINE = types.NEWLINE;
let OP = types.OP;

let util = require("./util");


describe('util', ()=> {

    let gen = function*() {
        yield 1;
        yield 2;
        yield 3;
    };

    it('take', ()=> {
        let result = util.take(gen(), (x)=> x < 3);
        result[0].should.deep.equal([1 ,2]);
        let last = result[1].next();
        last.value.should.equal(3);
    });
});


describe('tokenize', ()=> {

    it('should respect escaping', ()=> {
        let source = 'key="v\\"al"';
        Array.from(tokenize(source)).should.deep.equal([
            {val: "key", type: SYMBOL, line:1},
            {val: "=", type: OP, line:1},
            {val: "v\"al", type: STRING, line:1}
        ]);
    });

    it('should recognize bool', ()=> {
        let source = 'key=off';
        Array.from(tokenize(source)).should.deep.equal([
            {val: "key", type: SYMBOL, line:1},
            {val: "=", type: OP, line:1},
            {val: false, type: types.BOOL, line:1}
        ]);
    });

    it('should tokenize', ()=> {
        let source = "[section.sub]\n key=val#comment\n#comment\n\n";
        Array.from(tokenize(source)).should.deep.equal([
            {val: "[", type: OP, line:1},
            {val: "section", type: SYMBOL, line:1},
            {val: ".", type: OP, line:1},
            {val: "sub", type: SYMBOL, line:1},
            {val: "]", type: OP, line:1},
            {val: "\n", type: NEWLINE, line:1},
            {val: " ", type: SPACE, line:2},
            {val: "key", type: SYMBOL, line:2},
            {val: "=", type: OP, line:2},
            {val: "val", type: SYMBOL, line:2},
            {val: "comment", type: types.COMMENT, line:2},
            {val: "\n", type: NEWLINE, line:2},
            {val: "comment", type: types.COMMENT, line:3},
            {val: "\n", type: NEWLINE, line:3},
            {val: "\n", type: NEWLINE, line:4}
        ]);
    });

});


describe('parse', ()=> {
    it('should parse parse section', ()=> {
        let source = "[section.sub]\nkey=val";
        parse(source).should.deep.equal({
            section: {
                sub: {
                    key: "val"
                }
            }
        });
    });

    it('should parse string', ()=> {
        let source = "\n\n key = 'val' \n\n k = v a l ";
        parse(source).should.deep.equal({
            key: "val",
            k: "v a l"
        });
    });

    it('should parse numbers and bools', ()=> {
        let source = "key = -1.2\n key2 = false \n key3   = on";
        parse(source).should.deep.equal({
            key: -1.2,
            key2: false,
            key3: true
        });
    });

    it('should parse array', ()=> {
        let source = "key = [1, true, 'str in, g' , string, [nested, items, ,]]";
        parse(source).should.deep.equal({
            key: [1, true, "str in, g", "string", ["nested", "items"]]
        });
    });

    it('should parse array', ()=> {
        let source = "key = [ \n item\nitem2\n item3\n]";
        parse(source).should.deep.equal({
            key: ["item", "item2", "item3"]
        });
    });

    it('should parse array', ()=> {
        let source = "key = [ \n item,\nitem2 ,\n item3 ,\n]";
        parse(source).should.deep.equal({
            key: ["item", "item2", "item3"]
        });
    });

    it('should parse array', ()=> {
        let source = "key = [ ]";
        parse(source).should.deep.equal({
            key: []
        });
    });

    it('should reutrn empty object', ()=> {
        parse('\r\n  \n').should.deep.equal({});
    });

    it('should allow comments at end of input', ()=> {
        parse('# comment').should.deep.equal({});
    });
});
