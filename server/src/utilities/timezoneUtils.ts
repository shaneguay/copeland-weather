
export function convertUtcSecondsToLocal(utcSeconds: number, timezoneOffset: number, locale: string = 'en-US'): string {
    const localTime = new Date(utcSeconds * 1000 + timezoneOffset * 60000);

    return localTime.toLocaleString(locale, { timeZoneName: 'short' });
}