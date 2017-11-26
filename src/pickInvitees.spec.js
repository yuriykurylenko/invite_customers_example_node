const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');

const geolib = require('geolib');
const pickInvitees = require('./pickInvitees');

chai.use(spies);

describe('pickInvitees specs', () => {
    const location = { latitude: 53.3393, longitude: -6.2576841 };
    const distance = 100000;

    describe('when input is invalid', () => {
        describe('when customers is not an array', () => {
            const customers = { user: { user_id: 1, latitude: location.latitude, longitude: location.longitude } };

            it('throws an error', () => {
                expect(pickInvitees.bind(null, customers, location, distance)).to.throw();
            });
        });

        describe('when customers array contains an object with missing required fields', () => {
            const customers = [{
                user_id: 1,
                name: 'Lars Larsen',
                latitude: location.latitude,
                longitude: location.longitude
            }, {
                user_id: 2,
                name: 'Lars Larsen',
                longitude: location.longitude
            }];

            it('throws an error', () => {
                expect(pickInvitees.bind(null, customers, location, distance)).to.throw();
            });
        });

        describe('when location does not contain latitude or longitude', () => {
            const customers = [{
                user_id: 1,
                name: 'Lars Larsen',
                latitude: location.latitude,
                longitude: location.longitude
            }];
            const wrongLocation = { latitude: 53 };

            it('throws an error', () => {
                expect(pickInvitees.bind(null, customers, wrongLocation, distance)).to.throw();
            });
        });

        describe('when distance is not a valid positive number', () => {
            const customers = [{
                user_id: 1,
                name: 'Lars Larsen',
                latitude: location.latitude,
                longitude: location.longitude
            }];
            const distance = -100;

            it('throws an error', () => {
                expect(pickInvitees.bind(null, customers, location, distance)).to.throw();
            });
        });
    });

    describe('when input is valid', () => {
        const location1 = { latitude: 54.133333, longitude: -6.433333 };
        const location2 = { latitude: 30.1, longitude: 12.5 };

        const user1 = {
            user_id: 10,
            name: 'Lars Larsen',
            latitude: location.latitude,
            longitude: location.longitude
        };
        const user2 = {
            user_id: 1,
            name: 'Marco Marcosen',
            latitude: location1.latitude,
            longitude: location1.longitude
        };
        const user3 = {
            user_id: 2,
            name: 'Santiago Klüver',
            latitude: location2.latitude,
            longitude: location2.longitude
        };

        const customers = [user1, user2, user3];
        const distance = 100000;

        const sameLocation = (l1, l2) => {
            return l1.latitude == l2.latitude && l1.longitude == l2.longitude
        };

        beforeEach(() => {
            geolib.prototype.getDistance = chai.spy((l1, l2) => {
                if (sameLocation(l1, location)) {
                    return 0;
                } else if (sameLocation(l1, location1)) {
                    return 2000;
                } else if (sameLocation(l1, location2)) {
                    return 1234567;
                } else {
                    return 1000000000;
                }
            });
        });

        it('includes customers, that are located closer than distance threshold', () => {
            expect(pickInvitees(customers, location, distance)).to.deep.include(user1);
            expect(pickInvitees(customers, location, distance)).to.deep.include(user2);
        });

        it('excludes customers, that are located more far away than distance threshold', () => {
            expect(pickInvitees(customers, location, distance)).to.not.include(user3);
        });

        it('orders customers by user_id property', () => {
            const orderedUserIds = [user2.id, user1.id];
            expect(pickInvitees(customers, location, distance).map(c => c.user_id)).to.deep.equal(orderedUserIds);
        });
    });
});
