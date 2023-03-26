export function isDateValid(dateString: string) {
    return !isNaN(new Date(dateString).getTime());
}