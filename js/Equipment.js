let equipmentCount = 0; // Counter for Equipment IDs

const renderTable = (equipmentList) => {
    const tableBody = $('#equipmentTable tbody');
    tableBody.empty();
    equipmentList.forEach((equipment, index) => {
        tableBody.append(`
                <tr>
                    <td>${equipment.id}</td>
                    <td>${equipment.name}</td>
                    <td>${equipment.type}</td>
                    <td>${equipment.purchaseDate}</td>
                    <td>${equipment.status}</td>
                    <td>${equipment.lastServiced}</td>
                    <td>${equipment.location}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editEquipment(${index})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEquipment(${index})">Delete</button>
                    </td>
                </tr>
            `);
    });
};

const equipmentList = []; // Temporary storage for equipment

const addEquipment = (e) => {
    e.preventDefault();

    // Generate new Equipment ID
    equipmentCount++;
    const newEquipment = {
        id: `E${String(equipmentCount).padStart(3, '0')}`,
        name: $('#equipmentName').val(),
        type: $('#equipmentType').val(),
        purchaseDate: $('#purchaseDate').val(),
        status: $('#status').val(),
        lastServiced: $('#lastServiced').val(),
        location: $('#location').val(),
    };

    equipmentList.push(newEquipment); // Add equipment to the list
    renderTable(equipmentList); // Re-render the table
    $('#addEquipmentForm')[0].reset(); // Reset the form
};

const editEquipment = (index) => {
    const equipment = equipmentList[index];

    // Pre-fill the form with the selected equipment data
    $('#equipmentName').val(equipment.name);
    $('#equipmentType').val(equipment.type);
    $('#purchaseDate').val(equipment.purchaseDate);
    $('#status').val(equipment.status);
    $('#lastServiced').val(equipment.lastServiced);
    $('#location').val(equipment.location);

    // Change button text to "Update Equipment"
    $('#addEquipmentForm button').text('Update Equipment').off().click((e) => {
        e.preventDefault();

        // Update equipment details
        equipmentList[index] = {
            ...equipment,
            name: $('#equipmentName').val(),
            type: $('#equipmentType').val(),
            purchaseDate: $('#purchaseDate').val(),
            status: $('#status').val(),
            lastServiced: $('#lastServiced').val(),
            location: $('#location').val(),
        };

        renderTable(equipmentList); // Re-render the table
        $('#addEquipmentForm')[0].reset(); // Reset the form
        $('#addEquipmentForm button').text('Add Equipment').off().click(addEquipment); // Restore default button behavior
    });
};

const deleteEquipment = (index) => {
    equipmentList.splice(index, 1); // Remove equipment from the list
    renderTable(equipmentList); // Re-render the table
};

$(document).ready(() => {
    renderTable(equipmentList); // Render empty table on load
    $('#addEquipmentForm').submit(addEquipment); // Bind form submission
});