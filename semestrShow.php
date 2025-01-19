<?php

require "bootstrap.php";

$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $query = "SELECT * FROM semestr";

    $result = $pdo->prepare($query);
    $result->execute();
    $result = $result->fetchAll();

    echo json_encode($result);
    exit();

}

?>