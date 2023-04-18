const customStatusValues = {
    "Done" : 1,
    "To-do" : 2,
    "Doing" : 3,
    "Overdue": 4
};

function sortGANTT(data) {
    data.sort((a, b) => {
        const startDateDiff = new Date(a.TaskAttributes.StartDate).getTime() - new Date(b.TaskAttributes.StartDate).getTime();
        if (startDateDiff !== 0) {
            return startDateDiff;
        } else {
            const statusB = customStatusValues[a.TaskAttributes.Status];
            const statusA = customStatusValues[b.TaskAttributes.Status];
            return statusA - statusB;
        }
    });
    return data;
}


module.exports = sortGANTT

