chai = require 'chai'
chai.should()

{parse} = require './index'

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

        parse(source, quote: yes).should.deep.equal
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

        parse(source, section: yes).should.deep.equal
            k: 'v'
            sec:
                k: 'v2'

    it 'should parse numbers', ->
        
        source = """
            float = 1.2
            int = 9
            str = '1.2'
        """

        parse(source, number: yes, quote: yes).should.deep.equal
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

        parse(source, bool: yes, quote: yes).should.deep.equal
            ace: yes
            boolean: yes
            crate: no
            drip: no
            erra: 'true'
