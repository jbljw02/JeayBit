export default function formatTradeAmount(amount: string) {
    const strAmount = String(amount);
    if (strAmount.length <= 10) {
        return strAmount;
    }
    return strAmount[9] === '.' ? strAmount.substring(0, 9) : strAmount.substring(0, 10);
}