const fs = require('fs');
const readline = require('readline');

const readInput = filename => {
    return new Promise((resolve, reject) => {
        let lineReader;
        let lineNumber = 0;
        let result = [];

        lineReader = readline.createInterface({
            input: fs
                .createReadStream(filename)
                .on('error', e => reject(`Error in ${filename}: ${e}`))
        });

        lineReader
            .on('line', line => {
                lineNumber++;
                try {
                    result.push(JSON.parse(line));
                } catch(e) {
                    reject(`Error on line ${lineNumber} in ${filename}: ${e}`)
                }
            })
            .on('close', () => resolve(result));
    });
};

module.exports = readInput;
