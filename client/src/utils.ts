export const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2
});

export const formatDate = (dateObj: Date): string => {
    return new Date(dateObj).toISOString()    // format: 2020-04-20T20:08:18.966Z
        .replace(/T/, ' ')          // replace T with a space
        .replace(/\..+/, '')        // delete the dot and everything after
}