// Initialize button status
let buttonStatus = ["T", "T", "T", "T", "T", "T"];

// Function to toggle the button status
function toggleButtonStatus(buttonId) {
    const index = parseInt(buttonId.replace("button", "")) - 1;
    buttonStatus[index] = buttonStatus[index] === "T" ? "F" : "T";
    updateResultFromCSV(buttonStatus);
}

// Function to update the result based on the recorded data from CSV
function updateResultFromCSV(buttonStates) {
    // Replace with the path to your CSV file
    const csvFilePath = 'data.csv';

    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            const csvRows = csvData.split('\n');
            const headers = csvRows[0].split(',');
            const data = csvRows.slice(1);

            data.forEach(row => {
                const rowValues = row.split(',');
                const rowButtonStates = rowValues.slice(0, 6); // Extract button states from the row
                const result = rowValues[6]; // Extract the result

                if (JSON.stringify(rowButtonStates) === JSON.stringify(buttonStates)) {
                    document.getElementById("value").textContent = result;
                    return; // Exit the loop if a match is found
                }
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// Add click event listeners to all buttons
for (let i = 1; i <= 6; i++) {
    const buttonId = `button${i}`;
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
        toggleButtonStatus(buttonId);
        button.textContent = buttonStatus[i - 1];
    });
}

// Initialize button status and update result
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 6; i++) {
        const buttonId = `button${i}`;
        const textField = document.getElementById(`text${i}`);
        const buttonText = textField.value;
        button.textContent = buttonText;
    }

    // Initial update of result
    updateResultFromCSV(buttonStatus);
});
