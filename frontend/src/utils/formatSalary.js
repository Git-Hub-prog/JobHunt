export const formatSalaryInLPA = (salary) => {
    if (salary === null || salary === undefined || salary === "") {
        return "0";
    }

    const salaryInLpa = Number(salary) / 100000;
    return Number.isInteger(salaryInLpa) ? salaryInLpa.toString() : salaryInLpa.toFixed(1);
};