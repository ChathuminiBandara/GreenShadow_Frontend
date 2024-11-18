// Global log counter to generate unique log IDs
let logIdCounter = 1;
const logsTableBody = $('#logsTable tbody');
const logs = [];

// Function to render logs to the table
function renderLogs() {
    logsTableBody.empty();
    logs.forEach((log, index) => {
        logsTableBody.append(`
                <tr data-index="${index}">
                    <td>${log.id}</td>
                    <td>${log.date}</td>
                    <td>${log.activity}</td>
                    <td>${log.user}</td>
                    <td>${log.details}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editLogButton" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editLogModal">Edit</button>
                        <button class="btn btn-danger btn-sm deleteLogButton" data-index="${index}" data-bs-toggle="modal" data-bs-target="#deleteLogModal">Delete</button>
                    </td>
                </tr>
            `);
    });
}

// Add Log Form Submission
$('#addLogForm').submit(function (e) {
    e.preventDefault();

    const newLog = {
        id: `L${logIdCounter++}`,  // Generate a new unique ID
        date: $('#logDate').val(),
        activity: $('#logActivity').val(),
        user: $('#logUser').val(),
        details: $('#logDetails').val()
    };

    logs.push(newLog);
    renderLogs();
    $('#addLogModal').modal('hide');
});

// Edit Log Button Click
$(document).on('click', '.editLogButton', function () {
    const index = $(this).data('index');
    const log = logs[index];
    $('#editLogId').val(log.id);
    $('#editLogDate').val(log.date);
    $('#editLogActivity').val(log.activity);
    $('#editLogUser').val(log.user);
    $('#editLogDetails').val(log.details);
});

// Edit Log Form Submission
$('#editLogForm').submit(function (e) {
    e.preventDefault();
    const index = logs.findIndex(log => log.id === $('#editLogId').val());
    if (index !== -1) {
        logs[index].date = $('#editLogDate').val();
        logs[index].activity = $('#editLogActivity').val();
        logs[index].user = $('#editLogUser').val();
        logs[index].details = $('#editLogDetails').val();
        renderLogs();
        $('#editLogModal').modal('hide');
    }
});

// Delete Log Button Click
$(document).on('click', '.deleteLogButton', function () {
    const index = $(this).data('index');
    $('#deleteLogButton').data('index', index);
});

// Confirm Delete
$('#deleteLogButton').click(function () {
    const index = $(this).data('index');
    logs.splice(index, 1);
    renderLogs();
    $('#deleteLogModal').modal('hide');
});

// Initial Rendering of Logs
renderLogs();