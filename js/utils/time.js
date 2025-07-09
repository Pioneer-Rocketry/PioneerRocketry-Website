export function dateTimeToUTC(localDatetime) {
    const time = new Date(localDatetime);
    return time.toISOString();
}

export function UTCToLocalDateTime(utcDatetime) {
    time = new Date(utcDatetime);
    //get the local time from UTC time
    time = new Date(time.getTime() - time.getTimezoneOffset() * 60000);

    return time.toISOString().replace('Z', '');
}

export function formatDateForInput(dateString, timeString) {
    let date = new Date(dateString);

    // Split time into hours and minutes
    if (dateString == null || dateString == undefined || dateString == '') {
        console.log('Invalid Date', dateString);
        return '';
    }
    if (timeString == null || timeString == undefined || timeString == '') {
        console.log('Invalid Time', timeString, 'Attempting to get time from date');
        dateString = date.toISOString().slice(0, 16);
        timeString = date.toISOString().slice(11, 16);
    }

    let [hours, minutes] = timeString.split(':');

    // Set the time part manually to the date object
    date.setHours(hours - 5);
    date.setMinutes(minutes);

    // Return the formatted string for the input field (yyyy-MM-ddTHH:mm)
    return date.toISOString().slice(0, 16);
}