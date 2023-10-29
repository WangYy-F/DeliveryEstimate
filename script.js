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

    //const selectedArea = areaSelect.value;
    const selectedAreaText = areaSelect.options[areaSelect.selectedIndex].text;

    // Generate file paths for 2019 and 2021 based on the selected area
    areaToCsvPath2019[selectedArea] = `Result/${selectedAreaText}_prediction.csv`;
    areaToCTPath2019[selectedArea] = `Result/${selectedAreaText}_CTresult.csv`;
    areaToCsvPath2021[selectedArea] = `Result/${selectedAreaText}_prediction_2021.csv`;
    areaToCTPath2021[selectedArea] = `Result/${selectedAreaText}_CTresult_2021.csv`;

    const selectedYear = document.getElementById('year-select').value;

    if (selectedYear === '2019') {
        areaToCsvPath = areaToCsvPath2019;
        areaToCTPath = areaToCTPath2019;
    } else if (selectedYear === '2021') {
        areaToCsvPath = areaToCsvPath2021;
        areaToCTPath = areaToCTPath2021;
    }

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
                const popresultFloat = parseFloat(rowValues[7]); // Extract the float result

                if (JSON.stringify(rowSliderValues) === JSON.stringify(sliderValues)) {
                    const roundedResult = Math.round(resultFloat); // Round the float to an integer
                    document.getElementById("value").textContent = roundedResult;
                    const poproundedResult = Math.round(popresultFloat); // Round the float to an integer
                    document.getElementById("pop_value").textContent = poproundedResult;
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
                const roundedfirstDataRow = Math.round(firstDataRow);
                const roundedsecondDataRow = Math.round(secondDataRow);
                const result = "("+roundedfirstDataRow+", "+roundedsecondDataRow+")"
                columnResultValue.textContent = result;
            } else {
                columnResultValue.textContent = '-';
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

function handleYearChange() {
    // Get the selected year from the dropdown
    const selectedYear = document.getElementById('year-select').value;

    if (selectedYear === '2019') {
        areaToCsvPath = areaToCsvPath2019;
        areaToCTPath = areaToCTPath2019;
    } else if (selectedYear === '2021') {
        areaToCsvPath = areaToCsvPath2021;
        areaToCTPath = areaToCTPath2021;
    }

    // Update the result based on the selected year and settings
    updateResult();
    updateColumnOptions();
    // Add any other updates you need to perform here.
}

// Add an event listener to the year select dropdown
const yearSelect = document.getElementById('year-select');
const areaSelect = document.getElementById('area-select');
const columnSelect = document.getElementById('column-select');
const columnResultValue = document.getElementById('column-result-value');
const areaToCsvPath2019 = {};
const areaToCTPath2019 = {};
const areaToCsvPath2021 = {};
const areaToCTPath2021 = {};

// You can use these objects as needed when the area selection changes

yearSelect.addEventListener('change', handleYearChange);

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
    handleYearChange();
    // Initial update of result
    const firstOption = columnSelect.querySelector('option');
    if (firstOption) {
        columnSelect.value = firstOption.value;
    }

    // Initialize columnResultValue with the first row value
    updateColumnResult();
});
