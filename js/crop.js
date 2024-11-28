// Load crops when the page loads
$(document).ready(function () {
    loadCrops();
});

// Load crops from the server
function loadCrops() {
    $.ajax({
        url: '/api/crops',
        type: 'GET',
        success: function (data) {
            data.forEach(crop => {
                $('#cropTable tbody').append(`
                    <tr data-id="${crop.id}">
                        <td>${crop.id}</td>
                        <td>${crop.name}</td>
                        <td>${crop.fieldId}</td>
                        <td>${crop.plantingDate}</td>
                        <td>${crop.harvestDate}</td>
                        <td>${crop.status}</td>
                        <td>${crop.yield || 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function () {
            alert('Failed to load crops.');
        }
    });
}

// Add new crop
$('#addCropForm').on('submit', function (event) {
    event.preventDefault();

    const cropData = {
        name: $('#cropName').val(),
        plantingDate: $('#plantingDate').val(),
        harvestDate: $('#harvestDate').val(),
        status: $('#status').val(),
        yield: $('#yield').val(),
    };

    $.ajax({
        url: '/api/crops',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cropData),
        success: function (newCrop) {
            $('#cropTable tbody').append(`
                <tr data-id="${newCrop.id}">
                    <td>${newCrop.id}</td>
                    <td>${newCrop.name}</td>
                    <td>${newCrop.fieldId}</td>
                    <td>${newCrop.plantingDate}</td>
                    <td>${newCrop.harvestDate}</td>
                    <td>${newCrop.status}</td>
                    <td>${newCrop.yield || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                    </td>
                </tr>
            `);
            $('#addCropForm')[0].reset();
        },
        error: function () {
            alert('Failed to add crop.');
        }
    });
});

// Delete crop
$(document).on('click', '.delete-btn', function () {
    const row = $(this).closest('tr');
    const cropId = row.data('id');

    $.ajax({
        url: `/api/crops/${cropId}`,
        type: 'DELETE',
        success: function () {
            row.remove();
        },
        error: function () {
            alert('Failed to delete crop.');
        }
    });
});

// Edit crop
$(document).on('click', '.edit-btn', function () {
    const row = $(this).closest('tr');

    $('#cropName').val(row.find('td:eq(1)').text());
    $('#plantingDate').val(row.find('td:eq(3)').text());
    $('#harvestDate').val(row.find('td:eq(4)').text());
    $('#status').val(row.find('td:eq(5)').text());
    $('#yield').val(row.find('td:eq(6)').text());

    $('#addCropForm button[type="submit"]').text('Update Crop').addClass('update-crop').removeClass('btn-success').addClass('btn-warning');
    $('#addCropForm').data('editingId', row.data('id'));
});

// Update crop
$(document).on('click', '.update-crop', function (event) {
    event.preventDefault();

    const cropId = $('#addCropForm').data('editingId');
    const cropData = {
        name: $('#cropName').val(),
        plantingDate: $('#plantingDate').val(),
        harvestDate: $('#harvestDate').val(),
        status: $('#status').val(),
        yield: $('#yield').val(),
    };

    $.ajax({
        url: `/api/crops/${cropId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(cropData),
        success: function (updatedCrop) {
            const row = $(`#cropTable tbody tr[data-id="${cropId}"]`);
            row.find('td:eq(1)').text(updatedCrop.name);
            row.find('td:eq(3)').text(updatedCrop.plantingDate);
            row.find('td:eq(4)').text(updatedCrop.harvestDate);
            row.find('td:eq(5)').text(updatedCrop.status);
            row.find('td:eq(6)').text(updatedCrop.yield || 'N/A');

            $('#addCropForm')[0].reset();
            $('#addCropForm button[type="submit"]').text('Add Crop').removeClass('update-crop').removeClass('btn-warning').addClass('btn-success');
        },
        error: function () {
            alert('Failed to update crop.');
        }
    });
});
