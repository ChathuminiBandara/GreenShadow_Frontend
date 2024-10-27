
    $(document).ready(function () {
    // Function to load content
    function loadContent(target) {
        $("#contentSection").load(target, function (response, status, xhr) {
            if (status == "error") {
                $("#contentSection").html("<h3>Error loading page: " + xhr.status + " " + xhr.statusText + "</h3>");
            }
        });
    }

    // Handle navigation clicks
    $(".nav-link").click(function (event) {
    event.preventDefault(); // Prevent the default anchor click behavior
    const target = $(this).data("target"); // Get the target from data attribute
    loadContent(target); // Load the content
});

    // Optionally load the initial content
    loadContent("fields.html"); // Load default content on page load
});


// Repeat similar functions for loadCrops, loadStaff, loadVehicles, loadEquipment, loadLogs


/*// js/scripts.js
$(document).ready(function() {
    $('.nav-link').click(function(e) {
        e.preventDefault(); // Prevent default anchor click behavior
        var target = $(this).data('target'); // Get the target HTML file

        // Load the content using AJAX
        $('#contentSection').load(target, function(response, status, xhr) {
            if (status == "error") {
                $('#contentSection').html("<p>Sorry, there was an error loading the content.</p>");
            }
        });
    });
});*/
