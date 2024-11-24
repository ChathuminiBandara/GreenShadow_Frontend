$(document).ready(function () {
    // Sample data for staff (this would normally come from an API or database)
    let staffData = [
    ];

    // Function to render staff data in the table
    function renderStaff() {
        const staffTableBody = $('#staffTable tbody');
        staffTableBody.empty(); // Clear any existing rows

        staffData.forEach(function (staff) {
            const staffRow = `
                <tr data-id="${staff.id}">
                    <td>${staff.id}</td>
                    <td>${staff.name}</td>
                    <td>${staff.position}</td>
                    <td>${staff.contact}</td>
                    <td>
                        <button class="btn btn-info btn-sm editBtn">Edit</button>
                        <button class="btn btn-danger btn-sm deleteBtn">Delete</button>
                    </td>
                </tr>
            `;
            staffTableBody.append(staffRow);
        });
    }

    // Render initial staff data
    renderStaff();

    // Add New Staff Member
    $('#addStaffForm').submit(function (event) {
        event.preventDefault();

        const staffName = $('#staffName').val();
        const staffPosition = $('#staffPosition').val();
        const staffContact = $('#staffContact').val();

        const newStaff = {
            id: 'S' + (staffData.length + 1).toString().padStart(3, '0'),
            name: staffName,
            position: staffPosition,
            contact: staffContact
        };

        staffData.push(newStaff);
        renderStaff(); // Re-render the table
        $(this).trigger('reset'); // Clear form inputs
    });

    // Edit Staff Member
    $('#staffTable').on('click', '.editBtn', function () {
        const staffRow = $(this).closest('tr');
        const staffId = staffRow.data('id');
        const staff = staffData.find(s => s.id === staffId);

        // Fill in the form with current staff data for editing
        $('#staffName').val(staff.name);
        $('#staffPosition').val(staff.position);
        $('#staffContact').val(staff.contact);

        // Change the submit button to update mode
        $('#addStaffForm').off('submit').submit(function (event) {
            event.preventDefault();

            // Update the staff data
            staff.name = $('#staffName').val();
            staff.position = $('#staffPosition').val();
            staff.contact = $('#staffContact').val();

            renderStaff(); // Re-render the table
            $(this).trigger('reset'); // Clear form inputs

            // Reset the form submission to add new staff
            $('#addStaffForm').off('submit').submit(addStaffMember);
        });
    });

    // Delete Staff Member
    $('#staffTable').on('click', '.deleteBtn', function () {
        const staffRow = $(this).closest('tr');
        const staffId = staffRow.data('id');
        staffData = staffData.filter(s => s.id !== staffId); // Remove staff by ID
        renderStaff(); // Re-render the table
    });
});
