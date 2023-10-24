var originalData = []; // Store the original data
var filteredData = []; // Store the filtered data
var displayedData = []; // Store the currently displayed data
var rowsPerPage = 15; // Number of rows to display per page
var currentPage = 1; // Current page number

var sortColumn = -1; // Track the currently sorted column
var sortAscending = true; // Track the sorting order

// Get the Scroll to Top button:
let mybutton = document.getElementById("myBtn");


function loadData() {
  // Send a request to fetch the CSV data
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var csvData = xhr.responseText;
      originalData = parseCSV(csvData);
      filteredData = originalData;
      displayedData = filteredData.slice(0, rowsPerPage); // Display the first page of rows
      populateTable(displayedData);
      updateLoadMoreButton();
    }
  };
  xhr.open('GET', 'books.csv', true);
  xhr.send();
}

function parseCSV(csvData) {
  var lines = csvData.split('\n');
  var headers = lines[0].split(';');
  var data = [];

  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].split(';');
    if (line.length === headers.length) {
      var item = {};
      for (var j = 0; j < headers.length; j++) {
        item[headers[j]] = line[j];
      }
      data.push(item);
    }
  }

  return data;
}

function search() {
  var query = document.getElementById('searchInput').value.toLowerCase();
  filteredData = originalData.filter(function(item) {
    return (
      item['Autor'].toLowerCase().includes(query) ||
      item['Titel'].toLowerCase().includes(query) ||
      item['Inhaltsbeschreibung'].toLowerCase().includes(query)
    );
  });
  sortTable(sortColumn, sortAscending); // Apply sorting to the filtered data
}

function sortTable(column) {
  if (column === sortColumn) {
    sortAscending = !sortAscending; // Toggle sorting order if the same column is clicked
  } else {
    sortAscending = true; // Set the sorting order to ascending for a new column
  }

  filteredData.sort(function(a, b) {
    var valA = a[Object.keys(a)[column]];
    var valB = b[Object.keys(b)[column]];

    // Treat the values in the first column as numbers
    if (column === 0) {
      valA = parseInt(valA, 10);
      valB = parseInt(valB, 10);
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) {
      return sortAscending ? -1 : 1; // Adjust the return value based on the sorting order
    }
    if (valA > valB) {
      return sortAscending ? 1 : -1; // Adjust the return value based on the sorting order
    }
    return 0;
  });

  sortColumn = column;

  populateTable(filteredData);
}

function populateTable(data) {
  var tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  for (var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');

    for (var key in data[i]) {
      var cell = document.createElement('td');
      cell.innerText = data[i][key];
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }
}

function loadMoreRows() {
  currentPage++; // Increment the current page number
  var start = (currentPage - 1) * rowsPerPage;
  var end = currentPage * rowsPerPage;
  var newRows = filteredData.slice(start, end);
  displayedData = displayedData.concat(newRows);
  populateTable(displayedData);
  updateLoadMoreButton();
}

function updateLoadMoreButton() {
  var loadMoreButton = document.getElementById('loadMore');
  if (currentPage * rowsPerPage >= filteredData.length) {
    loadMoreButton.style.display = 'none'; // Hide the "Load More" button if all rows are displayed
  } else {
    loadMoreButton.style.display = 'block';
  }
}


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 


// Load the data and initialize the search functionality
window.addEventListener('load', function() {
  loadData();

  var searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', search);

  var searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      search();
    }
  });
});
