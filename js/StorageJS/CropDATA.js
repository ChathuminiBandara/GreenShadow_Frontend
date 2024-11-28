// Initialize IDs
let cropCounter = 1;
let fieldCounter = 1;

// Local fallback storage for crops
let cropsFallback = [];

// Add new crop and handle form submission
$('#addCropForm').on('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    // Generate IDs automatically
    const cropId = `C${String(cropCounter).padStart(3, '0')}`;
    const fieldId = `F${String(fieldCounter).padStart(3, '0')}`;
    cropCounter++;
    fieldCounter++;

    // Capture form data
    const cropName = $('#cropName').val();
    const plantingDate = $('#plantingDate').val();
    const harvestDate = $('#harvestDate').val();
    const status = $('#status').val();
    const yieldValue = $('#yield').val() || 'N/A';

    const cropData = {
        cropId,
        cropName,
        fieldId,
        plantingDate,
        harvestDate,
        status,
        yield: yieldValue,
    };

    // Send data to backend using AJAX
    $.ajax({
        url: 'your-backend-endpoint-url', // Replace with actual backend URL
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cropData),
        success: function(response) {
            // On successful save to backend, add to UI
            addCropToUI(cropData);
        },
        error: function(xhr, status, error) {
            // Fallback if backend fails
            console.error('Backend error:', error);
            cropsFallback.push(cropData); // Save data locally
            addCropToUI(cropData);
        },
    });

    // Clear form fields
    $('#addCropForm')[0].reset();
});

// Add crop to UI
function addCropToUI(crop) {
    $('#cropTable tbody').append(`
        <tr>
            <td>${crop.cropId}</td>
            <td>${crop.cropName}</td>
            <td>${crop.fieldId}</td>
            <td>${crop.plantingDate}</td>
            <td>${crop.harvestDate}</td>
            <td>${crop.status}</td>
            <td>${crop.yield}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </td>
        </tr>
    `);
}

// Edit and Delete functionalities
$(document).on('click', '.delete-btn', function() {
    $(this).closest('tr').remove();
});

$(document).on('click', '.edit-btn', function() {
    const row = $(this).closest('tr');

    // Populate form fields with row data
    $('#cropName').val(row.find('td:eq(1)').text());
    $('#plantingDate').val(row.find('td:eq(3)').text());
    $('#harvestDate').val(row.find('td:eq(4)').text());
    $('#status').val(row.find('td:eq(5)').text());
    $('#yield').val(row.find('td:eq(6)').text());

    // Change Add button to Update
    $('#addCropForm button[type="submit"]').text('Update Crop').addClass('update-crop').removeClass('btn-success').addClass('btn-warning');

    // Update the entry on form submission
    $(document).on('click', '.update-crop', function(event) {
        event.preventDefault();

        // Update row data
        row.find('td:eq(1)').text($('#cropName').val());
        row.find('td:eq(3)').text($('#plantingDate').val());
        row.find('td:eq(4)').text($('#harvestDate').val());
        row.find('td:eq(5)').text($('#status').val());
        row.find('td:eq(6)').text($('#yield').val());

        // Reset form and button text
        $('#addCropForm')[0].reset();
        $('#addCropForm button[type="submit"]').text('Add Crop').removeClass('update-crop').removeClass('btn-warning').addClass('btn-success');
    });
});

// Load fallback crops into UI when page loads
$(document).ready(function() {
    if (cropsFallback.length > 0) {
        cropsFallback.forEach(crop => addCropToUI(crop));
    }
});
