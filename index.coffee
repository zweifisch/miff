
exports.parse = (input, opts, result)->
    quotesSupport = opts?.quotes
    sectionSupport = opts?.section
    equalSignSupport = opts?.equal
    parseNumber = opts?.numbers
    result ?= {}
    section = result
    for line, linenumber in input.split /[\r\n]+/
        line = line.trim()
        continue unless line
        first = line.charAt 0
        continue if first is ';' or first is '#'
        if sectionSupport and first is '['
            if line.charAt(line.length - 1) is ']'
                section = result[line.substr 1, line.length - 2] = {}
                continue
            else
                throw "section header not closed on #{linenumber + 1}"
        shift = 1
        while true
            idx = line.indexOf '=', shift
            if idx is -1
                throw new Error "'=' not found on line #{linenumber + 1}"
            if equalSignSupport
                if '\\' isnt line.charAt idx - 1
                    key = (line.substr 0, idx).split('\\=').join '='
                    value = line.substr idx + 1
                    break
                else
                    shift = idx + 1
            else
                key = line.substr 0, idx
                value = line.substr idx + 1
                break
        value = value.trimLeft()
        unquoted = no
        if quotesSupport
            char = value.charAt 0
            if char is '"' and value.charAt(value.length - 1) is '"'
                value = value.substr 1, value.length - 2
                unquoted = yes
            else if char is "'" and value.charAt(value.length - 1) is "'"
                value = value.substr 1, value.length - 2
                unquoted = yes
        if parseNumber and not unquoted
            if not isNaN(parseFloat value) and isFinite value
                value = parseFloat value
        section[key.trimRight()] = value
    result

exports.load = (files..., opts)->
    fs = require 'fs'
    ret = {}
    if 'object' isnt typeof opts
        files.push opts
        opts = null
    for file in files
        exports.parse fs.readFileSync(file, encoding: 'utf-8'), opts, ret
    ret
