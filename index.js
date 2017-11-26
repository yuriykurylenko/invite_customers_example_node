const readInput = require('./src/readInput');
const pickInvitees = require('./src/pickInvitees');

const INPUT_FILE = './data/customers.txt';
const DUBLIN = { latitude: 53.3393, longitude: -6.2576841 };
const DISTANCE = 100000;

readInput(INPUT_FILE)
    .then(customers => console.log(pickInvitees(customers, DUBLIN, DISTANCE)))
    .catch(e => console.log(e));
