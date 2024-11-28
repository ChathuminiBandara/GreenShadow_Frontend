$(document).ready(function () {
    let editingRow = null; // To keep track of the row being edited
    const localStorageKey = "fieldsData"; // Key for storing fields in localStorage

    // Initialize fields from localStorage
    const loadFields = () => {
        const fields = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        fields.forEach((field) => {
            addRowToTable(field, false);
        });
    };

    // Save fields to localStorage
    const saveFields = () => {
        const fields = [];
        $('#fieldTable tbody tr').each(function () {
            const row = $(this);
            const field = {
                id: row.find('td').eq(0).text(),
                name: row.find('td').eq(1).text(),
                location: row.find('td').eq(2).text(),
                area: row.find('td').eq(3).text(),
                cropType: row.find('td').eq(4).text(),
                irrigationStatus: row.find('td').eq(5).text(),
                soilQuality: row.find('td').eq(6).text(),
            };
            fields.push(field);
        });
        localStorage.setItem(localStorageKey, JSON.stringify(fields));
    };

    // Add a new row to the table
    const addRowToTable = (field, save = true) => {
        const newRow = `
            <tr>
                <td>${field.id}</td>
                <td>${field.name}</td>
                <td>${field.location}</td>
                <td>${field.area}</td>
                <td>${field.cropType}</td>
                <td>${field.irrigationStatus}</td>
                <td>${field.soilQuality}</td>
                <td>
                    <button class="btn btn-primary editBtn">Edit</button>
                    <button class="btn btn-danger deleteBtn">Delete</button>
                </td>
            </tr>`;
        $('#fieldTable tbody').append(newRow);

        if (save) saveFields(); // Save to localStorage if necessary
    };

    // Handle form submission for adding or updating field
    $('#addFieldForm').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const fieldName = $('#fieldName').val();
        const location = $('#location').val();
        const area = $('#area').val();
        const cropType = $('#cropType').val();
        const irrigationStatus = $('#irrigationStatus').val();
        const soilQuality = $('#soilQuality').val();

        // Validate form data
        if (fieldName === "" || location === "" || area === "" || cropType === "" || irrigationStatus === "" || soilQuality === "") {
            alert("Please fill in all fields");
            return;
        }

        const field = {
            id: editingRow ? editingRow.find('td').eq(0).text() : Date.now().toString(), // Use the existing ID or a new timestamp
            name: fieldName,
            location,
            area,
            cropType,
            irrigationStatus,
            soilQuality,
        };

        if (editingRow) {
            // If editingRow is not null, update the existing row
            editingRow.find('td').eq(1).text(field.name);
            editingRow.find('td').eq(2).text(field.location);
            editingRow.find('td').eq(3).text(field.area);
            editingRow.find('td').eq(4).text(field.cropType);
            editingRow.find('td').eq(5).text(field.irrigationStatus);
            editingRow.find('td').eq(6).text(field.soilQuality);

            editingRow = null; // Reset the editing row flag
            $('#submitBtn').text('Add Field'); // Reset button text to "Add Field"
        } else {
            // Add the new row to the table
            addRowToTable(field);
        }

        // Clear form after submission
        $('#addFieldForm')[0].reset();
        saveFields(); // Save changes to localStorage
    });

    // Handle edit button click
    $('#fieldTable').on('click', '.editBtn', function () {
        const row = $(this).closest('tr');

        // Populate form with the data from the selected row
        $('#fieldName').val(row.find('td').eq(1).text());
        $('#location').val(row.find('td').eq(2).text());
        $('#area').val(row.find('td').eq(3).text());
        $('#cropType').val(row.find('td').eq(4).text());
        $('#irrigationStatus').val(row.find('td').eq(5).text());
        $('#soilQuality').val(row.find('td').eq(6).text());

        editingRow = row; // Mark the row being edited

        // Change the submit button text to "Update"
        $('#submitBtn').text('Update');
    });

    // Handle delete button click
    $('#fieldTable').on('click', '.deleteBtn', function () {
        $(this).closest('tr').remove(); // Remove the row from the table
        saveFields(); // Save changes to localStorage
    });

    // Load fields on page load
    loadFields();
});
