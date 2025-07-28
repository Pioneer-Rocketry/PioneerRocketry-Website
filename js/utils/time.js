export function formatForDatetimeLocal(dateStr) {
    try{
        const date = new Date(dateStr);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm
    }catch(e){
        console.error('Error formatting date for datetime-local:', e);
        return '';
    }
    
}