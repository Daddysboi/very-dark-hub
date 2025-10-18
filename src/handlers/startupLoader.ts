import logger from "../utils/logger";
import {Country} from "../modules/country/model";
import {State} from "../modules/state/model";

import countries from "../data/json/country.json";
import states from "../data/json/state.json";
import {syncLgas} from "../modules/lga/service";

const syncCountries = async () => {
    logger.info('Syncing Countries ...');
    const dbCountries = await Country.find({});
    const jsonCountries = countries;

    const dbCountryMap = new Map(dbCountries.map(c => [c.alpha3, c]));
    const jsonCountryMap = new Map(jsonCountries.map(c => [c.alpha3, c]));

    const toDelete = dbCountries.filter(c => !jsonCountryMap.has(c.alpha3));
    const toCreate = jsonCountries.filter(c => !dbCountryMap.has(c.alpha3));

    if (toDelete.length > 0) {
        await Country.deleteMany({_id: {$in: toDelete.map(c => c._id)}});
        logger.info(`Deleted ${toDelete.length} obsolete countries.`);
    }

    if (toCreate.length > 0) {
        await Country.insertMany(toCreate);
        logger.info(`Created ${toCreate.length} new countries.`);
    }

    if (!toDelete.length && !toCreate.length) {
        logger.info('Countries are already in sync.');
    } else {
        logger.info('Finished syncing Countries.');
    }
};

const syncStates = async () => {
    logger.info('Syncing States ...');
    const dbStates = await State.find({});
    const jsonStates = states;

    // Map country alpha2 to country _id
    const dbCountries = await Country.find({});
    const countryMap = new Map(dbCountries.map(c => [c.alpha2, c._id]));

    const dbStateMap = new Map(dbStates.map(s => [s.code, s]));
    const jsonStateMap = new Map(jsonStates.map(s => [s.code, s]));

    const toDelete = dbStates.filter(s => !jsonStateMap.has(s.code));

    const toCreate = jsonStates
        .filter(s => !dbStateMap.has(s.code))
        .map(s => ({ ...s, country: countryMap.get(s.name) }));


    if (toDelete.length > 0) {
        await State.deleteMany({_id: {$in: toDelete.map(s => s._id)}});
        logger.info(`Deleted ${toDelete.length} obsolete states.`);
    }

    if (toCreate.length > 0) {
        // @ts-ignore
        await State.insertMany(toCreate);
        logger.info(`Created ${toCreate.length} new states.`);
    }

    // Now check for updates
    const toUpdate = [];
    for (const dbState of dbStates) {
        const jsonState = jsonStateMap.get(dbState.code);
        if (jsonState) {
            const countryId = countryMap.get(jsonState.country);
            if (countryId) {
                if (dbState.name !== jsonState.name || !dbState.country.equals(countryId)) {
                    toUpdate.push(State.updateOne({ _id: dbState._id }, { name: jsonState.name, country: countryId }));
                }
            }
        }
    }

    if (toUpdate.length > 0) {
        await Promise.all(toUpdate);
        logger.info(`Updated ${toUpdate.length} states.`);
    }


    if (!toDelete.length && !toCreate.length && !toUpdate.length) {
        logger.info('States are already in sync.');
    } else {
        logger.info('Finished syncing States.');
    }
};

export const loadStartupData = async () => {
    await syncCountries();
    await syncStates();
    await syncLgas();
};
