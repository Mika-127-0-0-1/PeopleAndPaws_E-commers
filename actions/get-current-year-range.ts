export const getCurrentYearRange = () => {
    const currentYear = new Date().getUTCFullYear();

    return {
        currentYear,
        startOfYear: new Date(Date.UTC(currentYear, 0, 1)),
        startOfNextYear: new Date(Date.UTC(currentYear + 1, 0, 1)),
    };
};
