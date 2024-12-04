// 천의 자리마다 콤마를 찍음
export default function formatWithComas(value: string | number, dump?: boolean) {
    if (typeof value === 'number') {
        if (dump) value = Math.floor(value);
        value = String(value);
    }
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}