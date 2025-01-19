<?php

require "bootstrap.php";

$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = $input["semestr"];
    $dateStart = $input["dateStart"];
    $dateEnd = $input["dateEnd"];

    //walidacja

    if ($name != "Semestr letni" && $name != "Semestr zimowy") {
        echo json_encode("Nieprawidlowa wartosc nazwy semestru!");
        exit();
    }

    if (strtotime($dateStart) === false) {
        echo json_encode("Nieprawidlowa data rozpoczecia semestru");
        exit();
    }

    if (strtotime($dateEnd) === false) {
        echo json_encode("Nieprawidlowa data zakonczenia semestru!");
        exit();
    }

    $query = "UPDATE semestr SET start = :dateStart, end = :dateEnd WHERE name = :name";

    $result = $pdo->prepare($query);
    $result->bindParam(':dateStart', $dateStart);
    $result->bindParam(':dateEnd', $dateEnd);
    $result->bindParam(':name', $name);
    $result->execute();

    echo json_encode($name);
    exit();


}

?>