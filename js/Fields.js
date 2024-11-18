let fieldCount = 0; // Counter for Field IDs

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

const fields = []; // Temporary storage for fields

const addField = (e) => {
    e.preventDefault();

    // Auto-generate Field ID
    fieldCount++;
    const newField = {
        id: `F${String(fieldCount).padStart(3, '0')}`,
        name: $('#fieldName').val(),
        location: $('#location').val(),
        area: $('#area').val(),
        crop: $('#cropType').val(),
        irrigation: $('#irrigationStatus').val(),
        soil: $('#soilQuality').val(),
    };

    fields.push(newField); // Add new field to array
    renderFields(fields); // Re-render table
    $('#addFieldForm')[0].reset(); // Reset form
};

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

        // Update field data
        fields[index] = {
            ...field,
            name: $('#fieldName').val(),
            location: $('#location').val(),
            area: $('#area').val(),
            crop: $('#cropType').val(),
            irrigation: $('#irrigationStatus').val(),
            soil: $('#soilQuality').val(),
        };

        renderFields(fields); // Re-render table
        $('#addFieldForm')[0].reset(); // Reset form
        $('#addFieldForm button').text('Add Field').off().click(addField); // Reset button
    });
};

const deleteField = (index) => {
    fields.splice(index, 1); // Remove field from array
    renderFields(fields); // Re-render table
};

$(document).ready(() => {
    renderFields(fields); // Initialize empty table
    $('#addFieldForm').submit(addField); // Bind form submission
});