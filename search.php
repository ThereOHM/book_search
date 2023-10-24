<?php
$csvFile = 'books.csv';
$query = isset($_GET['query']) ? $_GET['query'] : '';

$filteredRows = array();

if (($handle = fopen($csvFile, 'r')) !== false) {
  $header = fgetcsv($handle, 0, ';');

  while (($row = fgetcsv($handle, 0, ';')) !== false) {
    $matches = false;
    foreach ($row as $value) {
      if (stripos($value, $query) !== false) {
        $matches = true;
        break;
      }
    }

    if ($matches) {
      $filteredRows[] = $row;
    }
  }

  fclose($handle);
}

header('Content-Type: application/json');
echo json_encode($filteredRows);
?>
