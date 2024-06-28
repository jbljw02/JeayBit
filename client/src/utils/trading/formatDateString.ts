export default function formatDateString(time: Date | string) {
    let date = new Date(time);
    let formattedDate = date.getFullYear() + '.'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '.'
        + date.getDate().toString().padStart(2, '0') + ' '
        + date.getHours().toString().padStart(2, '0') + ':'
        + date.getMinutes().toString().padStart(2, '0');
        
    return formattedDate;
}