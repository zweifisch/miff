chai = require 'chai'
chai.should()

{parse, stringify} = require './index'

describe 'parse', ->

    it 'should turn lines into a dict', ->

        source = """
            key=value
        """

        parse(source).should.deep.equal key:'value'

    it 'should allow white space in key and value', ->

        source = """
            key=value
            k e y= "v a l "
        """

        parse(source).should.deep.equal
            key:'value'
            'k e y': 'v a l '

    it 'should escape', ->

        source = """
            key\\==value=
        """

        parse(source, equal: yes).should.deep.equal
            'key=':'value='

    it 'should allow unicode', ->

        source = """
            key = 钥匙
        """

        parse(source).should.deep.equal
            'key':'钥匙'

    it 'should skip empty line', ->

        parse('\r\n  \n').should.deep.equal {}

    it 'should support section', ->

        source = """
            k = v
            [sec]
            k = v2
        """

        parse(source).should.deep.equal
            k: 'v'
            sec:
                k: 'v2'

    it 'should parse numbers', ->
        
        source = """
            float = 1.2
            int = 9
            str = '1.2'
        """

        parse(source, number: yes).should.deep.equal
            float: 1.2
            int: 9
            str: '1.2'

    it 'should parse bool', ->

        source = """
            ace = on
            boolean = true
            crate = false
            drip = off
            erra = 'true'
        """

        parse(source, bool: yes).should.deep.equal
            ace: yes
            boolean: yes
            crate: no
            drip: no
            erra: 'true'

describe 'stringify', ->

    {EOL} = require 'os'

    it 'should stringify', ->

        input =
            str: 'value'
            num: 1
            bool: true

        expected = """
            str = value
            num = 1
            bool = true\n"""

        stringify(input).should.equal expected.split('\n').join EOL

    it 'should preserve space', ->

        input =
            k: 'v'
            k1: ' v'
            k2: 'v '
            k3: ' v '

        expected = """
            k = v
            k1 = ' v'
            k2 = 'v '
            k3 = ' v '\n"""

        stringify(input).should.equal expected.split('\n').join EOL

    it 'should escape equal', ->

        input =
            'k=e=y': 'value'

        expected = """
            k\\=e\\=y = value\n"""

        stringify(input).should.equal expected.split('\n').join EOL

    it 'should generate section header', ->

        input =
            default: 'val'
            sec1:
                k:'val1'
            sec2:
                k:'val2'

        expected = """
            default = val

            [sec1]
            k = val1

            [sec2]
            k = val2\n"""

        stringify(input).should.equal expected.split('\n').join EOL
