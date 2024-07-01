import formatWithComas from "./formatWithComas";

export default function formatCryptoDetail(value: number | string) {
    return value ? formatWithComas(value) : null;
}