// Initialize button status
let buttonStatus = ["T", "T", "T", "T", "T", "T"];

// Function to toggle the button status
function toggleButtonStatus(buttonId) {
    const index = parseInt(buttonId.replace("button", "")) - 1;
    buttonStatus[index] = buttonStatus[index] === "T" ? "F" : "T";
    updateResult();
}

// Function to update the result based on the selected geographical area and button states
function updateResult() {
    // Get the selected area from the dropdown
    const selectedArea = document.getElementById('area-select').value;

    // Define a mapping of area values to CSV file paths
    const areaToCsvPath = {
        DFW: 'data/dfw.csv',
        NY: 'data/ny.csv',
        // Add mappings for other areas as needed
    };

    const csvFilePath = areaToCsvPath[selectedArea];

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

                if (JSON.stringify(rowButtonStates) === JSON.stringify(buttonStatus)) {
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
        updateResult(); // Update the result when a button is clicked
    });
}

// Add an event listener to the area select dropdown
const areaSelect = document.getElementById('area-select');
areaSelect.addEventListener('change', updateResult); // Update the result when the area is changed

// Initialize button status and update result
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 6; i++) {
        const buttonId = `button${i}`;
        const textField = document.getElementById(`text${i}`);
        const buttonText = textField.value;
        const button = document.getElementById(buttonId); // Define the button here
        button.textContent = buttonStatus[i-1];
    }

    // Initial update of result
    updateResult();
});
