const escapeQuote = str => str.replace(/"/g, '\\"')

const stringifyValue = value => {
    switch (typeof value) {
    case 'string':
        if (!value) return '""'
        return /[\t "']/.test(value) ? `"${escapeQuote(value)}"` : value
    case 'number':
        return `${value}`
    case 'boolean':
        return value ? 'on' : 'off'
    case 'object':
        if (Array.isArray(value)) {
            return `[${value.map(stringifyValue).join(', ')}]`
        }
    }
    return value
}

const stringify = (input, prefix) => {
    let output = ''
    if (prefix) {
        let wrap = (-1 === prefix.indexOf('.')) ? '\n' : ''
        output += `${wrap}[${prefix}]\n${wrap}`
    }
    for (let key in input) {
        if ('object' !== typeof input[key]) {
            output += `${key} = ${stringifyValue(input[key])}\n`
        } else if (Array.isArray(input[key])) {
            output += `${key} = ${stringifyValue(input[key])}\n`
        }
    }
    for (let key in input) {
        if ('object' === typeof input[key] && !Array.isArray(input[key])) {
            output += stringify(input[key], prefix ? `${prefix}.${key}` : key)
        }
    }
    return output
}

module.exports = {
    stringify
}
