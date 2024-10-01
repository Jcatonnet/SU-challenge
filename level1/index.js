import fs from 'fs/promises';
import path from 'path';


const calculateExpectedDelivery = (data) => {
    const deliveries = data.packages.map(pack => {

        const carrier = data.carriers.find(carrier => carrier.code === pack.carrier);

        if (!carrier) {
            throw new Error(`Unknown carrier: ${pack.carrier}`);
        }

        const shippingDate = new Date(pack.shipping_date);
        shippingDate.setDate(shippingDate.getDate() + carrier.delivery_promise);

        return {
            package_id: pack.id,
            expected_delivery: shippingDate.toISOString().split('T')[0],
        };
    });

    return { deliveries };
};

const processDeliveries = async () => {
    try {
        const inputFilePath = path.resolve('./data/input.json');
        const jsonData = await fs.readFile(inputFilePath, 'utf8');

        const inputData = JSON.parse(jsonData);

        const result = calculateExpectedDelivery(inputData);

        const outputFilePath = path.resolve('./data/output.json');
        await fs.writeFile(outputFilePath, JSON.stringify(result, null, 2));

        console.log('Output.json has been successfully created');
    } catch (error) {
        console.error('Error processing deliveries:', error);
    }
};

processDeliveries();
