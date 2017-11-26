const mock = require('mock-fs');
const chai = require('chai');
const expect = chai.expect;

const readInput = require('./readInput');

chai.use(require('chai-as-promised'));

describe('readInput specs', () => {
    describe('when input is invalid', () => {
        beforeEach(() => {
            mock({
                'data': {
                    'customers.txt': 'file content here'
                }
            });
        });

        describe('when input file does not exist', () => {
            it('returns a promise that gets rejected', () => {
                expect(readInput('./data/customers.json')).to.be.rejected;
            });
        });

        describe('when input file contains lines with invalid JSON', () => {
            it('returns a promise that gets rejected', () => {
                expect(readInput('./data/customers.txt')).to.be.rejected;
            });
        });
    });

    describe('when input is valid', () => {
        const line1 = '{"user_id": 10, "name": "Lars Larsen"}';
        const line2 = '{"user_id": 11, "name": "Anders Andersen"}';

        const input = `${line1}\n${line2}`;
        const output = [line1, line2].map(line => JSON.parse(line));

        beforeEach(() => {
            mock({
                'data': {
                    'customers.txt': input
                }
            });
        });

        describe('when input file contains lines with valid JSON', () => {
            it('returns a promise that gets fulfilled with an array of JSON objects from lines in input file', () => {
                expect(readInput('./data/customers.txt')).to.eventually.deep.equal(output);
            });
        });
    });
});
