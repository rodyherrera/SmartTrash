require('./aliases');

const DeviceLog = require('@models/deviceLog');
const mongoConnector = require('@utilities/mongoConnector');

const BATCH_SIZE = 100000;
const TOTAL_DOCUMENTS = 30 * 24 * 60 * 60;

const generateDocuments = (start, end) => {
    const currentDate = new Date();
    const documents = [];
    for(let i = start; i < end; i++){
        const randomOffset = Math.floor(Math.random() * TOTAL_DOCUMENTS);
        const date = new Date(currentDate.getTime() - randomOffset + (i * 1000));
        const distance = Math.floor(Math.random() * 100) + 1;
        const clampedDistance = Math.max(0, Math.min(distance, 60));
        const usagePercentage = 100 - (clampedDistance / 60) * 16.67;
        documents.push({
            stduid: 'st/4C11AE113CBF',
            distance,
            usagePercentage,
            createdAt: date,
        });
    }
    return documents;
};

const insertDocuments = async (documents) => {
    try{
        console.log('[SmartTrash Cloud]: Inserting documents...');
        await DeviceLog.insertMany(documents, {
            ordered: false,
            writeConcern: {  w: 1, j: false }
        });
        console.log('[SmartTrash Cloud]: OK!');
    }catch(error){
        console.error('[SmartTrash Cloud]:', error);
    }
};

(async () => {
    try{
        await mongoConnector();
        for(let i = 0; i < TOTAL_DOCUMENTS; i += BATCH_SIZE){
            const documents = generateDocuments(i, Math.min(i + BATCH_SIZE, TOTAL_DOCUMENTS));
            await insertDocuments(documents);
        }
        console.log('[SmartTrash Cloud]: OK!')
    }catch(error){
        console.error('[SmartTrash Cloud]:', error);
    }
})();