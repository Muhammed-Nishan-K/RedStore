document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('name-search');
    const tableBody = document.querySelector('table tbody');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const productName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

            if (productName.includes(searchTerm)) {
                row.style.display = ''; // Show the row if the product name matches the search term
            } else {
                row.style.display = 'none'; // Hide the row if there is no match
            }
        });
    }
});