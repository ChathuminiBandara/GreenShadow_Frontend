$(document).ready(function () {
    const apiUrl = '/api/equipment'; // Backend API endpoint

    // Load Equipment Data
    function loadEquipment() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const equipmentTable = $('#equipmentTable');
                equipmentTable.empty(); // Clear existing rows
                response.forEach(equipment => {
                    equipmentTable.append(`
                        <tr>
                            <td>${equipment.id}</td>
                            <td>${equipment.name}</td>
                            <td>${equipment.type}</td>
                            <td>${equipment.purchaseDate}</td>
                            <td>
                                <span class="badge ${
                        equipment.status === 'Operational' ? 'bg-success' :
                            equipment.status === 'Under Maintenance' ? 'bg-warning' :
                                'bg-danger'
                    }">${equipment.status}</span>
                            </td>
                            <td>${equipment.lastServiced || 'N/A'}</td>
                            <td>${equipment.location}</td>
                            <td>
                                <button class="btn btn-info btn-sm" onclick="editEquipment(${equipment.id})"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-danger btn-sm" onclick="deleteEquipment(${equipment.id})"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function () {
                alert('Failed to load equipment data.');
            }
        });
    }

    // Add New Equipment
    $('#addEquipmentForm').submit(function (event) {
        event.preventDefault();
        const equipment = {
            name: $('#equipmentName').val(),
            type: $('#equipmentType').val(),
            purchaseDate: $('#purchaseDate').val(),
            status: $('#equipmentStatus').val(),
            location: $('#location').val(),
        };

        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(equipment),
            success: function () {
                alert('Equipment added successfully!');
                $('#addEquipmentModal').modal('hide');
                $('#addEquipmentForm')[0].reset();
                loadEquipment(); // Reload table
            },
            error: function () {
                alert('Failed to add equipment.');
            }
        });
    });

    // Edit Equipment
    window.editEquipment = function (id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'GET',
            success: function (equipment) {
                // Populate form fields for editing
                $('#equipmentName').val(equipment.name);
                $('#equipmentType').val(equipment.type);
                $('#purchaseDate').val(equipment.purchaseDate);
                $('#equipmentStatus').val(equipment.status);
                $('#location').val(equipment.location);

                $('#addEquipmentModal').modal('show'); // Reuse the add modal for editing
                $('#addEquipmentForm').off('submit').submit(function (event) {
                    event.preventDefault();
                    const updatedEquipment = {
                        name: $('#equipmentName').val(),
                        type: $('#equipmentType').val(),
                        purchaseDate: $('#purchaseDate').val(),
                        status: $('#equipmentStatus').val(),
                        location: $('#location').val(),
                    };

                    $.ajax({
                        url: `${apiUrl}/${id}`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(updatedEquipment),
                        success: function () {
                            alert('Equipment updated successfully!');
                            $('#addEquipmentModal').modal('hide');
                            loadEquipment(); // Reload table
                        },
                        error: function () {
                            alert('Failed to update equipment.');
                        }
                    });
                });
            },
            error: function () {
                alert('Failed to fetch equipment details.');
            }
        });
    };

    // Delete Equipment
    window.deleteEquipment = function (id) {
        if (confirm('Are you sure you want to delete this equipment?')) {
            $.ajax({
                url: `${apiUrl}/${id}`,
                method: 'DELETE',
                success: function () {
                    alert('Equipment deleted successfully!');
                    loadEquipment(); // Reload table
                },
                error: function () {
                    alert('Failed to delete equipment.');
                }
            });
        }
    };

    // Search and Filter (No changes needed)
    $('#searchEquipment').on('input', function () {
        const query = $(this).val().toLowerCase();
        $('#equipmentTable tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
        });
    });

    $('#filterStatus').change(function () {
        const filter = $(this).val();
        $('#equipmentTable tr').filter(function () {
            const status = $(this).find('.badge').text();
            $(this).toggle(filter === '' || status === filter);
        });
    });

    // Initial Load
    loadEquipment();
});
