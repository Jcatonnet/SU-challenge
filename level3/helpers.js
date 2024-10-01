const isWorkingDay = (date, saturdayDeliveries) => {
    const day = date.getDay();
    return day !== 0 && (day !== 6 || saturdayDeliveries);
};

const calculateOverseaDelay = (originCountry, destinationCountry, carrier, countryDistance) => {
    const distance = countryDistance[originCountry][destinationCountry] || 0;
    const overseaDelayThreshold = carrier.oversea_delay_threshold;
    const overseaDelay = Math.floor(distance / overseaDelayThreshold);

    return overseaDelay;
};

const addWorkingDays = (shippingDate, totalPromise, saturdayDeliveries) => {
    let date = new Date(shippingDate);
    let daysAdded = 0;

    while (daysAdded < totalPromise) {
        date.setDate(date.getDate() + 1);

        if (isWorkingDay(date, saturdayDeliveries)) {
            daysAdded++;
        }
    }

    return date;
};

export {
    isWorkingDay,
    calculateOverseaDelay,
    addWorkingDays
};
