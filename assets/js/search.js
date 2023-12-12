$(document).ready(function () {
    $("#name-search").on("keyup", function () {
        var searchText = $(this).val().toLowerCase();
        
        // Iterate through each table row
        $("table tbody tr").each(function () {
            var $row = $(this);
            var columns = $row.find("td");

            // Flag to determine if the row should be shown
            var shouldShow = false;

            // Check each column for a match
            columns.each(function (index) {
                var columnText = $(this).text().toLowerCase();
                if (columnText.includes(searchText)) {
                    shouldShow = true;
                    return false; // Exit the loop if a match is found in this column
                }
            });

            // Show or hide the row based on the 'shouldShow' flag
            $row.toggle(shouldShow);
        });
    });
});
