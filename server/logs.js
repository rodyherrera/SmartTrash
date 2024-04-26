const { mongoose } = require('./aliases');
require('./aliases');
const DeviceLog = require('@models/deviceLog');
const mongoConnector = require('@utilities/mongoConnector');

const BATCH_SIZE = 500000; // Tamaño de lote reducido para evitar el agotamiento de la memoria
const TOTAL_DOCUMENTS = 30 * 24 * 60 * 60; // 30 días * 24 horas * 60 minutos * 60 segundos

const generateDocuments = (start, end) => {
    const currentDate = new Date();
    const documents = [];

    for (let i = start; i < end; i++) {
        console.log('i2', i, '->', end);
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
    try {
        await DeviceLog.insertMany(documents);
        console.log(`Insertados ${documents.length} documentos.`);
    } catch (error) {
        console.error('Error al insertar documentos:', error);
    }
};

const xyz = async () => {
    try {
        await mongoConnector();

        for (let i = 0; i < TOTAL_DOCUMENTS; i += BATCH_SIZE) {
            console.log('i1 -', TOTAL_DOCUMENTS);
            const documents = generateDocuments(i, Math.min(i + BATCH_SIZE, TOTAL_DOCUMENTS));
            await insertDocuments(documents);
        }

        console.log('Todos los documentos han sido insertados exitosamente.');
    } catch (error) {
        console.error('Error en la inserción de documentos:', error);
    }
};

(async () => {
    await xyz();
})();
