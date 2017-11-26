const geolib = require('geolib');

const pickInvitees = (customers, location, distance) => {
    if (!Array.isArray(customers)) {
        throw new Error(`${customers} is not an array`);
    }
    if (!location.latitude || !location.longitude) {
        throw new Error(`${location} does not contain latitude or longitude`);
    }
    if (isNaN(distance) || distance < 0) {
        throw new Error(`${distance} is not a valid positive number`);
    }

    return customers
        .filter(customer => {
            if (!customer.user_id || !customer.name || !customer.latitude || !customer.longitude) {
                throw new Error(`Missing required fields in ${customer} object`);
            }
            return geolib.getDistance(customer, location) < distance;
        })
        .sort((a, b) => a.user_id - b.user_id);
};

module.exports = pickInvitees;
