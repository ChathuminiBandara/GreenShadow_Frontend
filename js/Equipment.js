$(document).ready(function () {
    // Fetch and load existing data using AJAX (GET request)
    $.ajax({
        url: '/api/equipment', // Spring Boot endpoint to fetch data
        type: 'GET',
        success: function (data) {
            // If data is fetched successfully, populate the table
            data.forEach(equipment => {
                appendEquipmentToTable(equipment);
            });
        },
        error: function (err) {
            console.error('Error fetching equipment data:', err);
        }
    });

    // Listen for form submission
    $('#addEquipmentForm').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission behavior

        // Get form data
        var equipmentData = {
            equipmentName: $('#equipmentName').val(),
            equipmentType: $('#equipmentType').val(),
            purchaseDate: $('#purchaseDate').val(),
            status: $('#status').val(),
            lastServiced: $('#lastServiced').val(),
            location: $('#location').val()
        };

        // Send data to the server using AJAX (POST request)
        $.ajax({
            url: '/api/equipment', // Spring Boot endpoint to add new equipment
            type: 'POST',
            data: JSON.stringify(equipmentData),  // Sending data as a JSON string
            contentType: 'application/json',  // Setting content type to JSON
            success: function (response) {
                // If successful, append new equipment to the table
                appendEquipmentToTable(response);  // Assuming the server returns the created equipment
                $('#addEquipmentForm')[0].reset();  // Reset the form after submission
            },
            error: function (err) {
                console.error('Error adding new equipment:', err);
            }
        });
    });

    // Function to append new equipment to the table
    function appendEquipmentToTable(equipment) {
        var row = `<tr>
                        <td>${equipment.equipmentId}</td>
                        <td>${equipment.equipmentName}</td>
                        <td>${equipment.equipmentType}</td>
                        <td>${equipment.purchaseDate}</td>
                        <td>${equipment.status}</td>
                        <td>${equipment.lastServiced}</td>
                        <td>${equipment.location}</td>
                        <td><button class="btn btn-warning">Edit</button> <button class="btn btn-danger">Delete</button></td>
                    </tr>`;
        $('#equipmentTable tbody').append(row);
    }
});