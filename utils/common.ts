export const formatUZS = (number: number | null | string, withCurrency = true) => {
    if(!number)
        return `0 UZS`;

    const formatted = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return withCurrency ? `${formatted} UZS` : formatted;
}