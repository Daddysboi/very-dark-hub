import {Lga} from "./model";
import {State} from "../state/model";
import lgas from "../../data/json/lga.json";
import logger from "../../utils/logger";
import {ILga} from "./types";

export const createLga = async (lgaData: { name: string, code: string, state: string }) => {
    // The state code in lga.json is prefixed e.g. "NG-LA", state model just has "LA"
    const stateCode = lgaData.state.split('-')[1];
    const state = await State.findOne({ code: stateCode });
    if (state) {
        const newLga = new Lga({
            name: lgaData.name,
            code: lgaData.code,
            state: state._id,
        });
        await newLga.save();
        return newLga;
    }
    return null;
};

const generateLgaCode = (stateCode: string, lgaName: string) => {
    const sanitizedLgaName = lgaName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `${stateCode}-${sanitizedLgaName}`;
}

export const syncLgas = async () => {
    logger.info('Syncing LGAs ...');

    const dbLgas = await Lga.find({});
    const jsonLgasData = lgas;

    const dbStates = await State.find({});
    const stateMap = new Map(dbStates.map(s => [s.code, s._id]));

    const jsonLgas: (Omit<ILga, '_id' | 'state' | 'createdAt' | 'updatedAt'> & { state: string })[] = [];
    for (const stateData of jsonLgasData) {
        const stateId = stateMap.get(stateData['state-code']);
        if (stateId) {
            for (const lgaName of stateData.lgas) {
                jsonLgas.push({
                    name: lgaName,
                    code: generateLgaCode(stateData['state-code'], lgaName),
                    state: stateId.toString()
                });
            }
        }
    }

    const dbLgaMap = new Map(dbLgas.map(l => [l.code, l]));
    const jsonLgaMap = new Map(jsonLgas.map(l => [l.code, l]));

    const toDelete = dbLgas.filter(l => !jsonLgaMap.has(l.code));
    const toCreate = jsonLgas.filter(l => !dbLgaMap.has(l.code));

    if (toDelete.length > 0) {
        await Lga.deleteMany({_id: {$in: toDelete.map(l => l._id)}});
        logger.info(`Deleted ${toDelete.length} obsolete LGAs.`);
    }

    if (toCreate.length > 0) {
        await Lga.insertMany(toCreate);
        logger.info(`Created ${toCreate.length} new LGAs.`);
    }
    
    const toUpdate = [];
    for (const dbLga of dbLgas) {
        const jsonLga = jsonLgaMap.get(dbLga.code);
        if (jsonLga) {
            if (dbLga.name !== jsonLga.name) {
                toUpdate.push(Lga.updateOne({ _id: dbLga._id }, { name: jsonLga.name }));
            }
        }
    }

    if (toUpdate.length > 0) {
        await Promise.all(toUpdate);
        logger.info(`Updated ${toUpdate.length} LGAs.`);
    }

    if (!toDelete.length && !toCreate.length && !toUpdate.length) {
        logger.info('LGAs are already in sync.');
    } else {
        logger.info('Finished syncing LGAs.');
    }
};