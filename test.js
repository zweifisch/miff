require("chai").should();
var tokenize = require("./index").tokenize;
var parse = require("./index").parse;
var types = require("./index").types;
var SPACE = types.SPACE;
var STRING = types.STRING;
var SYMBOL = types.SYMBOL;
var NEWLINE = types.NEWLINE;
var OP = types.OP;


describe('tokenize', ()=> {

    it('should respect escaping', ()=> {
        var source = 'key="v\\"al"';
        Array.from(tokenize(source)).should.deep.equal([
            {val: "key", type: SYMBOL, line:1},
            {val: "=", type: OP, line:1},
            {val: "v\"al", type: STRING, line:1}
        ]);
    });

    it('should recognize bool', ()=> {
        var source = 'key=off';
        Array.from(tokenize(source)).should.deep.equal([
            {val: "key", type: SYMBOL, line:1},
            {val: "=", type: OP, line:1},
            {val: false, type: types.BOOL, line:1}
        ]);
    });

    it('should tokenize', ()=> {
        var source = "[section.sub]\n key=val#comment\n#comment\n\n";
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
        var source = "[section.sub]\nkey=val";
        parse(source).should.deep.equal({
            section: {
                sub: {
                    key: "val"
                }
            }
        });
    });

    it('should parse string', ()=> {
        var source = "\n\n key = 'val' \n\n k = v a l ";
        parse(source).should.deep.equal({
            key: "val",
            k: "v a l"
        });
    });

    it('should parse numbers and bools', ()=> {
        var source = "key = -1.2\n key2 = false \n key3   = on";
        parse(source).should.deep.equal({
            key: -1.2,
            key2: false,
            key3: true
        });
    });

    it('should parse array', ()=> {
        var source = "key = [1, true, 'str in, g' , string]";
        parse(source).should.deep.equal({
            key: [1, true, "str in, g", "string"]
        });
    });
});
