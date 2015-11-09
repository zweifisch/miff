ensureNamespace = (obj, namespace)->
    node = obj
    for name in namespace
        node[name] = new Object null unless name of node
        node = node[name]
    node

parseValue = (input, linenumber)->
    input = input.trim()
    firstChar = input.charAt 0
    if firstChar is '"' and input.charAt(input.length - 1) is '"'
        return input.substr 1, input.length - 2
    if firstChar is "'" and input.charAt(input.length - 1) is "'"
        return input.substr 1, input.length - 2
    if input is 'on' or input is 'true'
        return true
    if input is 'off' or input is 'false'
        return false
    if firstChar is '['
        if input.charAt(input.length - 1) isnt ']'
            throw Error "array not closed on line #{linenumber + 1}"
        return input.substr(1, input.length - 2).split(",").map (x)-> parseValue x, linenumber
    if not isNaN(parseFloat input) and isFinite input
        return parseFloat input
    input

exports.parse = (input, opts, result)->
    result ?= new Object null
    section = result
    for line, linenumber in input.split /[\r\n]+/
        line = line.trim()
        continue unless line
        first = line.charAt 0
        continue if first is ';' or first is '#'
        if first is '['
            if line.charAt(line.length - 1) isnt ']'
                throw Error "section header not closed on #{linenumber + 1}"
            section = ensureNamespace result, (line.substr 1, line.length - 2).split('.')
            continue
        idx = line.indexOf '=', 1
        if idx is -1
            throw Error "'=' not found on line #{linenumber + 1} '#{line}'"
        key = line.substr(0, idx).trimRight()
        value = line.substr idx + 1
        section[key] = parseValue value, linenumber
    result

exports.load = (files..., opts)->
    fs = require 'fs'
    ret = {}
    if 'object' isnt typeof opts
        files.push opts
        opts = null
    for file in files
        exports.parse fs.readFileSync(file, encoding: 'utf8'), opts, ret
    ret

exports.stringify = (dict)->

    {EOL} = require 'os'

    escapeEq = (str)-> str.replace /\=/g, '\\='
    escapeQuote = (str)-> str.replace /'/g, "'"

    stringify = (kv)->
        ret = ''
        for k,v of kv
            if 'object' is typeof v
                ret += "#{EOL}[#{k}]#{EOL}"
                ret += stringify v
            else if 'string' is typeof v
                if 'true' is v or 'false' is v
                    ret += "#{escapeEq k} = '#{v}'#{EOL}"
                else if (' ' is v.charAt 0) or (' ' is v.charAt v.length - 1)
                    ret += "#{escapeEq k} = '#{escapeQuote v}'#{EOL}"
                else
                    ret += "#{escapeEq k} = #{v}#{EOL}"
            else
                ret += "#{escapeEq k} = #{v}#{EOL}"
        ret

    stringify dict

exports.dump = (dict, file)->
    fs = require 'fs'
    fs.writeFileSync file, exports.stringify(dict), encoding: 'utf8'
