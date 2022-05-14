@{%

const moo = require('moo')

let lexer = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    '=': '=',
    '<': '<',
    '>': '>',
    comment: {
        match: /\/\/[^\n]*/,
        value: s => s.substring(3)
    },
    header: [
        'region',
        'group',
        'control',
    ],
    opcode: [
        'default_path',
        'sample',
        'pitch_keycenter',
        'lokey',
        'hikey',
        'lovel',
        'hivel',
        'loop_mode',
        'pitch_keytrack',
        'offset',
        'end',
        'volume',
    ],
    path: /(?:[a-zA-Z0-9_-]+(?:\/?[a-zA-Z0-9_-]*)*)(?:\.[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]|\/)/,
    string: /[a-zA-Z0-9_]+/
})

%}

@lexer lexer

input -> object:+

_ -> null | %space {% () => null %}

opcode -> %opcode "=" (%path | %string | %number) _ {% extractOpcode %}

header -> "<" %header ">" _ {% extractHeader %}

comment -> %comment _ {% extracComment %}

object -> header opcode:+ comment:? {% extractObject %}


@{%

function log(d) {
    console.log(d)
    return d;
}

function castValue(type, value) {
    switch (type) {
        case 'sample':
        case 'loop_mode':
        case 'default_path':
            return value;
        default:
            return Number(value);
    }
}

function extracComment([{ value}]) { return value; }

function extractHeader([, { type, value }]) { return { type, value }; }

function extractOpcode([{ value: key }, , [{ value }]]) { return [key, value]; }

function extractObject([{ type, value }, opcodes, comment]) {
    return {
        type: value,
        ...comment ? { label: comment } : {},
        opcodes: opcodes.reduce((acc, [key, value]) => ({
            ...acc,
            [key]: castValue(key, value)
        }), {})
    };
}

%}