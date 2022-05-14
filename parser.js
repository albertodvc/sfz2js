const fs = require('fs');
const nearley = require('nearley');
const grammar = require('./grammar.js');

const [, , sfzFile, outputFile] = process.argv;

const defaultOutputFile = getFilename(sfzFile);

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const sfz = fs.readFileSync(sfzFile, 'utf8');

parser.feed(sfz);

const instrument = buildInstrument(parser.results[0][0]);

fs.writeFileSync(`${outputFile || defaultOutputFile}.json`, JSON.stringify(instrument, null, 4));

function buildInstrument(results) {
    return results.reduce(({ regions, ...others }, header) => {
        const [last, ...rest] = regions.reverse();
        return {
            ...others,
            ...['group', 'region'].includes(header.type)
                ? {
                    regions: [
                        ...rest ? rest.reverse() : [],
                        ...(last?.type === 'group' && header.type !== 'group')
                            ? [{ ...last, regions: [...(last.regions || []), header] }]
                            : [...(last ? [last] : []), header],
                    ],
                }
                : { [header.type]: header, regions },
            
        };
    }, { regions: [] });
}

function getFilename(file) {
    const [ext, ...rest] = file.split('.').reverse();
    if (ext !== 'sfz') { throw new Error('Only .sfz files supported'); }
    return rest.reverse().join('.');
}