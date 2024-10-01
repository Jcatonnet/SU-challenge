import fs from 'fs/promises';
import path from 'path';
import { isWorkingDay, calculateOverseaDelay, addWorkingDays } from './helpers.js';

const calculateExpectedDeliveries = (input) => {
    const { carriers, packages, country_distance } = input;

    const deliveries = packages.map(pack => {
        const carrier = carriers.find(carrier => carrier.code === pack.carrier);

        const overseaDelay = calculateOverseaDelay(
            pack.origin_country,
            pack.destination_country,
            carrier,
            country_distance
        );

        const totalDeliveryPromise = carrier.delivery_promise + overseaDelay;

        const expectedDeliveryDate = addWorkingDays(
            pack.shipping_date,
            totalDeliveryPromise,
            carrier.saturday_deliveries
        );

        const expectedDelivery = expectedDeliveryDate.toISOString().split('T')[0];

        return {
            package_id: pack.id,
            expected_delivery: expectedDelivery,
            oversea_delay: overseaDelay
        };
    });

    return { deliveries };
};

const processDeliveries = async () => {
    try {
        const inputFilePath = path.resolve('./data/input.json');
        const jsonData = await fs.readFile(inputFilePath, 'utf8');

        const inputData = JSON.parse(jsonData);

        const result = calculateExpectedDeliveries(inputData);

        const outputFilePath = path.resolve('./data/output.json');
        await fs.writeFile(outputFilePath, JSON.stringify(result, null, 2));

        console.log('Output.json has been successfully created');
    } catch (error) {
        console.error('Error processing deliveries:', error);
    }
};

processDeliveries();
