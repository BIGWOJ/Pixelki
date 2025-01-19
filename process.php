<?php

require "bootstrap.php";
require "scraping.php";

$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych

// ZROBIC WALIDACJE!!!

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);

    $wykladowca = $input["wykladowca"];
    $sala = $input["sala"];
    $przedmiot = $input["przedmiot"];
    $grupa = $input["grupa"];
    $numerAlbumu = $input["numerAlbumu"];
    $forma = $input["forma"];
    $dataStart = $input["dataStart"];
    $dataEnd = $input["dataEnd"];

    $query = "SELECT
                w.imie,
                w.nazwisko,
                g.nazwa,
                wy.nazwa,
                s.pokoj,
                p.nazwa,
                l.tytul,
                l.opis,
                l.start,
                l.koniec,
                l.formaZajec
                FROM lekcja l
                JOIN grupa g ON l.grupaID = g.grupaID
                JOIN wykladowca w ON l.wykladowcaID = w.wykladowcaID
                JOIN sala s ON l.salaID = s.salaID
                JOIN wydzial wy ON s.wydzialID = wy.wydzialID
                JOIN przedmiot p ON l.przedmiotID = p.przedmiotID
                WHERE l.start BETWEEN :dataStart AND :dataEnd";

    $queryNumerAlbumu = "SELECT
                w.imie,
                w.nazwisko,
                g.nazwa,
                wy.nazwa,
                s.pokoj,
                p.nazwa,
                l.tytul,
                l.opis,
                l.start,
                l.koniec,
                l.formaZajec
                FROM lekcja l
                JOIN grupa g ON l.grupaID = g.grupaID
                JOIN NumerAlbumuGrupa nga ON g.grupaID = nga.grupaID
                JOIN numerAlbumu n on nga.numerAlbumuID = n.numerAlbumuID
                JOIN wykladowca w ON l.wykladowcaID = w.wykladowcaID
                JOIN sala s ON l.salaID = s.salaID
                JOIN wydzial wy ON s.wydzialID = wy.wydzialID
                JOIN przedmiot p ON l.przedmiotID = p.przedmiotID
                WHERE l.start BETWEEN :dataStart AND :dataEnd";

    $queryKonsultacje = "SELECT
    w.imie,
    w.nazwisko,
    l.tytul,
    l.opis,
    l.start,
    l.koniec
    FROM lekcja l
    JOIN wykladowca w ON l.wykladowcaID = w.wykladowcaID
    WHERE l.start BETWEEN :dataStart AND :dataEnd
    AND l.opis LIKE '%Konsultacje%'";

    $wykladowcaTrue = false;
    $salaTrue = false;
    $przedmiotTrue = false;
    $grupaTrue = false;
    $numerAlbumuTrue = false;
    $formaTrue = false;

    if (!empty($numerAlbumu)){
        $query = $queryNumerAlbumu;
        $query = $query . " AND n.numer = :numerAlbumu";
        $numerAlbumuTrue = true;
        //scrapGrupyNumberAlbumu($pdo, $numerAlbumu);
        //scrapNumerAlbumuGrupa($pdo, $numerAlbumu);
        //scrapLekcjaNumberAlbumu($pdo, $numerAlbumu);
    }

    if (!empty($wykladowca)){
        list($nazwisko, $imie) = explode(" ", $wykladowca, 2);

        $query = $query . " AND w.nazwisko = :nazwisko AND w.imie = :imie";
        $wykladowcaTrue = true;
        scrapGrupyWykladowca($pdo, $wykladowca);
        scrapLekcjaWykladowca($pdo, $wykladowca);
    }
    if (!empty($sala)){
        list($wydzial, $pokoj) = explode(" ", $sala, 2);

        $query = $query . " AND wy.nazwa = :wydzial AND s.pokoj = :pokoj";
        $salaTrue = true;
        scrapGrupySala($pdo, $sala);
        scrapLekcjaSala($pdo, $sala);
    }
    if (!empty($przedmiot)){
        $query = $query . " AND p.nazwa = :przedmiot";
        $przedmiotTrue = true;
        scrapGrupyPrzedmiot($pdo, $przedmiot);
        scrapLekcjaPrzedmiot($pdo, $przedmiot);
    }
    if (!empty($grupa)){
        $query = $query . " AND g.nazwa = :grupa";
        $grupaTrue = true;
        scrapGrupyGrupa($pdo, $grupa);
        scrapLekcjaGrupa($pdo, $grupa);
    }
    if (!empty($forma)){
        $query = $query . " AND l.formaZajec = :forma";
        $formaTrue = true;
    }

    if (!empty($forma) && $forma == "konsultacje") {
        $query = $queryKonsultacje;
        $salaTrue = false;
        $przedmiotTrue = false;
        $grupaTrue = false;
        $numerAlbumuTrue = false;
        $formaTrue = false;
    }

    if (!empty($wykladowca)){
        list($nazwisko, $imie) = explode(" ", $wykladowca, 2);

        $query = $query . " AND w.nazwisko = :nazwisko AND w.imie = :imie";
        $wykladowcaTrue = true;
        //scrapGrupyWykladowca($pdo, $wykladowca);
        //scrapLekcjaWykladowca($pdo, $wykladowca);
    }


    $result = $pdo->prepare($query);

    if ($wykladowcaTrue) {
        $result->bindParam(':imie', $imie);
        $result->bindParam(':nazwisko', $nazwisko);
    }
    if ($salaTrue) {
        $result->bindParam(':wydzial', $wydzial);
        $result->bindParam(':pokoj', $pokoj);
    }
    if ($przedmiotTrue) {
        $result->bindParam(':przedmiot', $przedmiot);
    }
    if ($grupaTrue) {
        $result->bindParam(':grupa', $grupa);
    }
    if ($numerAlbumuTrue) {
        $result->bindParam(':numerAlbumu', $numerAlbumu);
    }
    if ($formaTrue) {
        $result->bindParam(':forma', $forma);
    }



    $result->bindParam(':dataStart', $dataStart);
    $result->bindParam(':dataEnd', $dataEnd);
    $result->execute();
    $result = $result->fetchAll();



    echo json_encode($result);
    exit;
}

?>
