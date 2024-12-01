$(document).ready(function () {
    const apiUrl = '/api/crops'; // Change this URL to match your backend API endpoint

    // Function to load crops via AJAX
    function loadCrops() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const cropTableBody = $('#cropTable tbody');
                cropTableBody.empty();
                response.forEach((crop, index) => {
                    cropTableBody.append(`
                        <tr>
                            <td>${crop.cropCode}</td>
                            <td>${crop.commonName}</td>
                            <td>${crop.scientificName}</td>
                            <td><img src="${crop.image}" alt="Crop Image" style="width: 50px; height: 50px; object-fit: cover;"></td>
                            <td>${crop.category}</td>
                            <td>${crop.season}</td>
                            <td>${crop.field}</td>
                            <td>
                                <button class="btn btn-primary btn-sm editBtn" data-index="${index}" data-id="${crop.id}">Edit</button>
                                <button class="btn btn-danger btn-sm deleteBtn" data-id="${crop.id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function () {
                alert('Failed to load crops');
            }
        });
    }

    // Add new crop
    $('#addCropForm').submit(function (event) {
        event.preventDefault();
        const file = $('#image')[0].files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const crop = {
                commonName: $('#commonName').val(),
                scientificName: $('#scientificName').val(),
                image: e.target.result,
                category: $('#category').val(),
                season: $('#season').val(),
                field: $('#field').val(),
            };

            $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(crop),
                success: function () {
                    loadCrops();
                    $('#addCropModal').modal('hide');
                    $('#addCropForm')[0].reset();
                    $('#imagePreview').addClass('d-none');
                    alert('Crop added successfully');
                },
                error: function () {
                    alert('Failed to add crop');
                }
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    // Edit crop
    $(document).on('click', '.editBtn', function () {
        const cropId = $(this).data('id');

        // Fetch crop details
        $.ajax({
            url: `${apiUrl}/${cropId}`,
            method: 'GET',
            success: function (crop) {
                $('#editCropIndex').val(cropId);
                $('#editCommonName').val(crop.commonName);
                $('#editScientificName').val(crop.scientificName);
                $('#editCategory').val(crop.category);
                $('#editSeason').val(crop.season);
                $('#editField').val(crop.field);

                $('#editCropModal').modal('show');
            },
            error: function () {
                alert('Failed to fetch crop details');
            }
        });
    });

    // Save changes to edited crop
    $('#editCropForm').submit(function (event) {
        event.preventDefault();
        const cropId = $('#editCropIndex').val();

        const updatedCrop = {
            commonName: $('#editCommonName').val(),
            scientificName: $('#editScientificName').val(),
            category: $('#editCategory').val(),
            season: $('#editSeason').val(),
            field: $('#editField').val(),
        };

        $.ajax({
            url: `${apiUrl}/${cropId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedCrop),
            success: function () {
                loadCrops();
                $('#editCropModal').modal('hide');
                alert('Crop updated successfully');
            },
            error: function () {
                alert('Failed to update crop');
            }
        });
    });

    // Delete crop
    $(document).on('click', '.deleteBtn', function () {
        const cropId = $(this).data('id');

        if (confirm('Are you sure you want to delete this crop?')) {
            $.ajax({
                url: `${apiUrl}/${cropId}`,
                method: 'DELETE',
                success: function () {
                    loadCrops();
                    alert('Crop deleted successfully');
                },
                error: function () {
                    alert('Failed to delete crop');
                }
            });
        }
    });

    // Image Preview
    $('#image').change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').attr('src', e.target.result).removeClass('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            $('#imagePreview').addClass('d-none');
        }
    });

    // Initial data load
    loadCrops();
});
