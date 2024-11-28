 $(document).ready(function () {
        // Check if equipment data already exists in localStorage
        if (localStorage.getItem("equipmentData")) {
            // Load existing data and populate the table
            const savedData = JSON.parse(localStorage.getItem("equipmentData"));
            savedData.forEach(equipment => {
                appendEquipmentToTable(equipment);
            });
        }

        let editingEquipmentId = null; // To track the equipment being edited

        // Listen for form submission
        $('#addEquipmentForm').on('submit', function (e) {
            e.preventDefault(); // Prevent default form submission behavior

            // Get form data
            var equipmentData = {
                equipmentId: editingEquipmentId ? editingEquipmentId : getNextEquipmentId(),
                equipmentName: $('#equipmentName').val(),
                equipmentType: $('#equipmentType').val(),
                purchaseDate: $('#purchaseDate').val(),
                status: $('#status').val(),
                lastServiced: $('#lastServiced').val(),
                location: $('#location').val()
            };

            // Save data to localStorage (either update or add new)
            if (editingEquipmentId) {
                updateEquipmentInLocalStorage(equipmentData);
                updateRowInTable(equipmentData);
            } else {
                saveDataToLocalStorage(equipmentData);
                appendEquipmentToTable(equipmentData);
            }

            // Optionally reset the form and button text
            $('#addEquipmentForm')[0].reset();
            $('#addEquipmentForm button').text('Add Equipment'); // Reset to "Add Equipment"
            editingEquipmentId = null; // Reset the editing state
        });

        // Function to append new equipment to the table
        function appendEquipmentToTable(equipment) {
            var row = `<tr data-id="${equipment.equipmentId}">
                        <td>${equipment.equipmentId}</td>
                        <td>${equipment.equipmentName}</td>
                        <td>${equipment.equipmentType}</td>
                        <td>${equipment.purchaseDate}</td>
                        <td>${equipment.status}</td>
                        <td>${equipment.lastServiced}</td>
                        <td>${equipment.location}</td>
                        <td>
                            <button class="btn btn-primary edit-btn">Edit</button>
                            <button class="btn btn-danger delete-btn">Delete</button>
                        </td>
                    </tr>`;
            $('#equipmentTable tbody').append(row);
        }

        // Function to get the next available equipment ID
        function getNextEquipmentId() {
            let highestId = 0;

            // Retrieve existing data from localStorage if available
            if (localStorage.getItem("equipmentData")) {
                const equipmentData = JSON.parse(localStorage.getItem("equipmentData"));
                // Get the highest ID from existing data
                highestId = equipmentData.reduce((maxId, equipment) => Math.max(maxId, equipment.equipmentId), 0);
            }

            // The next equipment ID is the highest ID + 1
            return highestId + 1;
        }

        // Function to save data to localStorage
        function saveDataToLocalStorage(newEquipment) {
            let equipmentData = [];

            // Retrieve existing data from localStorage if available
            if (localStorage.getItem("equipmentData")) {
                equipmentData = JSON.parse(localStorage.getItem("equipmentData"));
            }

            // Add the new equipment data
            equipmentData.push(newEquipment);

            // Save the updated data back to localStorage
            localStorage.setItem("equipmentData", JSON.stringify(equipmentData));
        }

        // Function to update equipment in localStorage
        function updateEquipmentInLocalStorage(updatedEquipment) {
            let equipmentData = JSON.parse(localStorage.getItem("equipmentData"));

            // Find the equipment and update it
            equipmentData = equipmentData.map(equipment =>
                equipment.equipmentId === updatedEquipment.equipmentId ? updatedEquipment : equipment
            );

            // Save the updated data back to localStorage
            localStorage.setItem("equipmentData", JSON.stringify(equipmentData));
        }

        // Function to update row in table
        function updateRowInTable(updatedEquipment) {
            const row = $(`#equipmentTable tr[data-id="${updatedEquipment.equipmentId}"]`);
            row.find('td').eq(1).text(updatedEquipment.equipmentName);
            row.find('td').eq(2).text(updatedEquipment.equipmentType);
            row.find('td').eq(3).text(updatedEquipment.purchaseDate);
            row.find('td').eq(4).text(updatedEquipment.status);
            row.find('td').eq(5).text(updatedEquipment.lastServiced);
            row.find('td').eq(6).text(updatedEquipment.location);
        }

        // Event delegation for editing equipment
        $('#equipmentTable').on('click', '.edit-btn', function () {
            // Get the equipment ID of the row that was clicked
            const equipmentId = $(this).closest('tr').data('id');
            const equipmentData = getEquipmentFromLocalStorage(equipmentId);

            // Populate form with equipment data
            $('#equipmentName').val(equipmentData.equipmentName);
            $('#equipmentType').val(equipmentData.equipmentType);
            $('#purchaseDate').val(equipmentData.purchaseDate);
            $('#status').val(equipmentData.status);
            $('#lastServiced').val(equipmentData.lastServiced);
            $('#location').val(equipmentData.location);

            // Change the button text to "Update" and set the equipmentId to editing mode
            $('#addEquipmentForm button').text('Update Equipment');
            editingEquipmentId = equipmentId;
        });

        // Function to get equipment by ID from localStorage
        function getEquipmentFromLocalStorage(equipmentId) {
            const equipmentData = JSON.parse(localStorage.getItem("equipmentData"));
            return equipmentData.find(equipment => equipment.equipmentId === equipmentId);
        }

        // Event delegation for deleting equipment
        $('#equipmentTable').on('click', '.delete-btn', function () {
            // Get the equipment ID of the row that was clicked
            const equipmentId = $(this).closest('tr').data('id');

            // Remove the equipment data from localStorage
            removeEquipmentFromLocalStorage(equipmentId);

            // Remove the row from the table
            $(this).closest('tr').remove();
        });

        // Function to remove equipment from localStorage
        function removeEquipmentFromLocalStorage(equipmentId) {
            let equipmentData = JSON.parse(localStorage.getItem("equipmentData"));

            // Filter out the equipment with the given ID
            equipmentData = equipmentData.filter(equipment => equipment.equipmentId !== equipmentId);

            // Save the updated data back to localStorage
            localStorage.setItem("equipmentData", JSON.stringify(equipmentData));
        }
    });
