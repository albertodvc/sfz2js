// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "input$ebnf$1", "symbols": ["object"]},
    {"name": "input$ebnf$1", "symbols": ["input$ebnf$1", "object"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "input", "symbols": ["input$ebnf$1"]},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": () => null},
    {"name": "opcode$subexpression$1", "symbols": [(lexer.has("path") ? {type: "path"} : path)]},
    {"name": "opcode$subexpression$1", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "opcode$subexpression$1", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "opcode", "symbols": [(lexer.has("opcode") ? {type: "opcode"} : opcode), {"literal":"="}, "opcode$subexpression$1", "_"], "postprocess": extractOpcode},
    {"name": "header", "symbols": [{"literal":"<"}, (lexer.has("header") ? {type: "header"} : header), {"literal":">"}, "_"], "postprocess": extractHeader},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": extracComment},
    {"name": "object$ebnf$1", "symbols": ["opcode"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "opcode"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$ebnf$2", "symbols": ["comment"], "postprocess": id},
    {"name": "object$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object", "symbols": ["header", "object$ebnf$1", "object$ebnf$2"], "postprocess": extractObject}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
