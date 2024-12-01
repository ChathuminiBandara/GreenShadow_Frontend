let fieldCount = 0; // Counter for Field IDs

const apiUrl = 'https://your-backend-url.com/api/fields'; // Replace with your actual backend URL

// Fetch fields data from server (for initial rendering and updates)
const fetchFields = () => {
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: (response) => {
            renderFields(response.fields); // Assuming the API returns an object with a 'fields' array
        },
        error: (err) => {
            console.error('Error fetching fields:', err);
        },
    });
};

// Render the Fields Table
const renderFields = (fields) => {
    const tableBody = $('#fieldTable tbody');
    tableBody.empty();
    fields.forEach((field, index) => {
        tableBody.append(`
            <tr>
                <td>${field.id}</td>
                <td>${field.name}</td>
                <td>${field.location}</td>
                <td>${field.area}</td>
                <td>${field.crop}</td>
                <td>${field.irrigation}</td>
                <td>${field.soil}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editField(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteField(${index})">Delete</button>
                </td>
            </tr>
        `);
    });
};

// Add a new field with image upload
const addField = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', $('#fieldName').val());
    formData.append('location', $('#location').val());
    formData.append('area', $('#area').val());
    formData.append('crop', $('#cropType').val());
    formData.append('irrigation', $('#irrigationStatus').val());
    formData.append('soil', $('#soilQuality').val());

    const fieldImage1 = $('#fieldImage1')[0].files[0];
    const fieldImage2 = $('#fieldImage2')[0].files[0];
    if (fieldImage1) formData.append('fieldImage1', fieldImage1);
    if (fieldImage2) formData.append('fieldImage2', fieldImage2);

    $.ajax({
        url: apiUrl,
        method: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
            fetchFields(); // Reload the fields data after adding a new one
            $('#addFieldForm')[0].reset(); // Reset form
        },
        error: (err) => {
            console.error('Error adding field:', err);
        },
    });
};

// Edit an existing field
const editField = (index) => {
    const field = fields[index];

    // Populate form with field data
    $('#fieldName').val(field.name);
    $('#location').val(field.location);
    $('#area').val(field.area);
    $('#cropType').val(field.crop);
    $('#irrigationStatus').val(field.irrigation);
    $('#soilQuality').val(field.soil);

    // Change button text to "Update Field"
    $('#addFieldForm button').text('Update Field').off().click((e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', field.id);
        formData.append('name', $('#fieldName').val());
        formData.append('location', $('#location').val());
        formData.append('area', $('#area').val());
        formData.append('crop', $('#cropType').val());
        formData.append('irrigation', $('#irrigationStatus').val());
        formData.append('soil', $('#soilQuality').val());

        const fieldImage1 = $('#fieldImage1')[0].files[0];
        const fieldImage2 = $('#fieldImage2')[0].files[0];
        if (fieldImage1) formData.append('fieldImage1', fieldImage1);
        if (fieldImage2) formData.append('fieldImage2', fieldImage2);

        $.ajax({
            url: `${apiUrl}/${field.id}`,
            method: 'PUT',
            processData: false,
            contentType: false,
            data: formData,
            success: (response) => {
                fetchFields(); // Reload the fields data after updating
                $('#addFieldForm')[0].reset(); // Reset form
                $('#addFieldForm button').text('Add Field').off().click(addField); // Reset button
            },
            error: (err) => {
                console.error('Error updating field:', err);
            },
        });
    });
};

// Delete a field
const deleteField = (index) => {
    const field = fields[index];

    $.ajax({
        url: `${apiUrl}/${field.id}`,
        method: 'DELETE',
        success: (response) => {
            fetchFields(); // Reload the fields data after deleting
        },
        error: (err) => {
            console.error('Error deleting field:', err);
        },
    });
};

$(document).ready(() => {
    fetchFields(); // Initialize fields by fetching data from the backend
    $('#addFieldForm').submit(addField); // Bind form submission
});
