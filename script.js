// Initialize button status
let sliderValues = [0, 0, 0, 0, 0, 0];

// Function to toggle the slider values
function toggleSliderValue(sliderId) {
    const index = parseInt(sliderId.replace("slider", "")) - 1;
    // For the last slider with 3 values (0, 1, 2)
    if (index === 5) {
        const slider = document.getElementById(sliderId);
        sliderValues[index] = (sliderValues[index] + 1) % 3;
        slider.value = sliderValues[index];
    } else {
        // For the first five sliders with 0 and 1 values
        sliderValues[index] = (sliderValues[index] === 0) ? 1 : 0;
        document.getElementById(sliderId).value = sliderValues[index];
    }
    updateResult();
}

// Function to update the result based on the selected geographical area and button states
function updateResult() {
    // Get the selected area from the dropdown
    const selectedArea = document.getElementById('area-select').value;

    // Define a mapping of area values to CSV file paths
    const csvFilePath = areaToCsvPath[selectedArea];

    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            const csvRows = csvData.split('\n');
            const headers = csvRows[0].split(',');
            const data = csvRows.slice(1);

            data.forEach(row => {
                const rowValues = row.split(',');
                const rowSliderValues = rowValues.slice(0, 6).map(val => parseInt(val)); // Extract slider values from the row
                const resultFloat = parseFloat(rowValues[6]); // Extract the float result

                if (JSON.stringify(rowSliderValues) === JSON.stringify(sliderValues)) {
                    const roundedResult = Math.round(resultFloat); // Round the float to an integer
                    document.getElementById("value").textContent = roundedResult;
                    return; // Exit the loop if a match is found
                }
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// Add click event listeners to all buttons
for (let i = 1; i <= 6; i++) {
    const sliderId = `slider${i}`;
    const slider = document.getElementById(sliderId);
    slider.addEventListener("input", () => {
        toggleSliderValue(sliderId);
        updateResult(); // Update the result when a slider is changed
    });
}

function updateColumnOptions() {
    const selectedArea = areaSelect.value;
    const csvFilePath = areaToCTPath[selectedArea];

    // Fetch the CSV file and update the column dropdown
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            const headers = csvData.split('\n')[0].split(',');

            // Clear existing options
            while (columnSelect.firstChild) {
                columnSelect.removeChild(columnSelect.firstChild);
            }

            // Populate the column dropdown with options
            headers.forEach(header => {
                const option = document.createElement('option');
                option.value = header;
                option.textContent = header;
                columnSelect.appendChild(option);
            });

            // Update the column result value when the area changes
            updateColumnResult();
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

function updateColumnResult() {
    const selectedColumn = columnSelect.value;

    // Fetch the CSV file and update the column result value
    fetch(areaToCTPath[areaSelect.value])
        .then(response => response.text())
        .then(csvData => {
            const rows = csvData.split('\n');
            const headers = rows[0].split(',');

            // Find the index of the selected column
            const columnIndex = headers.indexOf(selectedColumn);

            if (columnIndex !== -1 && rows.length > 1) {
                const firstDataRow = rows[1].split(',')[columnIndex];
                const secondDataRow = rows[2].split(',')[columnIndex];
                const result = "("+firstDataRow+", "+secondDataRow+")"
                columnResultValue.textContent = result;
            } else {
                columnResultValue.textContent = '-';
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// Add an event listener to the area select dropdown
const areaSelect = document.getElementById('area-select');
const columnSelect = document.getElementById('column-select');
const columnResultValue = document.getElementById('column-result-value');
const areaToCsvPath = {
    DFW: 'data/dfw_prediction.csv',
    NY: 'data/ny_prediction.csv',
    // Add mappings for other areas as needed
};
const areaToCTPath = {
    DFW: 'data/dfw_CTresult.csv',
    NY: 'data/ny_CTresult.csv',
    // Add mappings for other areas as needed
};

areaSelect.addEventListener('change', updateResult); // Update the result when the area is changed

areaSelect.addEventListener('change', updateColumnOptions);

columnSelect.addEventListener('change', updateColumnResult);

// Initialize button status and update result
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 6; i++) {
        const sliderId = `slider${i}`;
        const slider = document.getElementById(sliderId);
        slider.value = sliderValues[i - 1]; // Set the initial slider value
    }

    // Initial update of result
    updateResult();

    updateColumnOptions();

    // Initialize columnSelect with the first option
    const firstOption = columnSelect.querySelector('option');
    if (firstOption) {
        columnSelect.value = firstOption.value;
    }

    // Initialize columnResultValue with the first row value
    updateColumnResult();
});
