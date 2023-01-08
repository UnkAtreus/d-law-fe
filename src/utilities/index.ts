export function changeNumberTo1k(number: string): string {
    const num = Number(number);
    if (num > 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    } else {
        return number;
    }
}
