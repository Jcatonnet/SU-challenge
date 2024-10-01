
export const isWorkingDay = (date, saturdayDeliveries) => {
    const day = date.getDay();
    return day !== 0 && (day !== 6 || saturdayDeliveries);
};


export const addWorkingDays = (shippingDate, deliveryPromise, saturdayDeliveries) => {
    let date = new Date(shippingDate);
    let daysAdded = 0;

    while (daysAdded < deliveryPromise) {
        date.setDate(date.getDate() + 1);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 0 || (dayOfWeek === 6 && !saturdayDeliveries)) {
            continue;
        }
        daysAdded++;
    }

    return date;
};