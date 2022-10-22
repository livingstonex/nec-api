const { Plan, Privilege } = require('../models/sql').models;

const plans = require('../data/plans.json');
const privileges = require('../data/privileges.json');

const seed = async () => {
    try {
        await Promise.all([
            Plan.bulkCreate(plans),
            Privilege.bulkCreate(privileges)
        ]);
        console.log('Data seeded successfully');
    } catch (err) {
        console.error(err);
    }
};

module.exports = seed;