<?php


function dbConnection($path){       // funkcja laczenia z baza, zwraca zmienna polaczenia z baza
    try {
        $pdo = new PDO($path);
        echo "Pomyslnie polaczono z baza danych \n";

    } catch (PDOException $e) {
        echo "Blad polaczenia: " . $e -> getMessage();
        exit();
    }

    return $pdo;
}


function scrapWykladowca($pdo) {       // funkcja scrapowania danych do tabeli wykladowca, argument = zmienna laczenia z baza
    try {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=teacher&query=';                              // link do API

        $response = file_get_contents($url);                                                            // pobranie zawartosci ze zwrotki z API
        echo "Pomyslnie otrzymano zwrot z API \n";
        $data = json_decode($response, true);                                                 // dekodowania zawartosci do JSON


        $clearTableCondition = true;                                                                    // warunek gdy chcemy zeby przed scrapowaniem tablica sie czyscila, jesli nie to ustawic na false
        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM wykladowca");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'wykladowca'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $addToBase = true;                                                                              // warunek czy chcemy scrapwoac, jesli nie to ustawic na false
        if ($addToBase) {

            $sqlInsert = "INSERT INTO wykladowca (imie, nazwisko) VALUES (:imie, :nazwisko)";           // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($data as $person) {

                if (isset($person['item'])) {                                                           // sprawdza czy przedmiot w tablicy istnieje
                    list($surname, $name) = explode(" ", $person['item'], 2);             // rozbijanie stringa na imie i nazwisko
                    $statement -> bindParam(':imie', $name, PDO::PARAM_STR);
                    $statement -> bindParam(':nazwisko', $surname, PDO::PARAM_STR);

                    try {
                        $statement -> execute();
                    } catch (PDOException $e) {
                        echo "Blad zapytania: " . $e -> getMessage();
                        exit();
                    }

                }
            }
        }

    } catch (PDOException $e) {
        echo "Blad polaczenia z API: " . $e -> getMessage();
        exit();
    }
}

function scrapWydzial($pdo) {       // funkcja scrapowania danych do tabeli wydzial, argument = zmienna laczenia z baza
    try {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=room&query=';                              // link do API

        $response = file_get_contents($url);                                                            // pobranie zawartosci ze zwrotki z API
        echo "Pomyslnie otrzymano zwrot z API \n";
        $data = json_decode($response, true);                                                 // dekodowania zawartosci do JSON


        $clearTableCondition = true;                                                                    // warunek gdy chcemy zeby przed scrapowaniem tablica sie czyscila, jesli nie to ustawic na false
        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM wydzial");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'wydzial'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $addToBase = true;                                                                              // warunek czy chcemy scrapwoac, jesli nie to ustawic na false
        if ($addToBase) {

            $sqlInsert = "INSERT INTO wydzial (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            $wydzialArray = [];

            foreach ($data as $department) {

                if (isset($department['item'])) {                                                        // sprawdza czy przedmiot w tablicy istnieje
                    $name = explode(" ", $department["item"]);                                  // pobieranie nazwy wydzialu ze stringa
                    $wydzialArray[] = $name[0];                                                          // dodanie nazwy wydzialu do tablicy
                }
            }

            $wydzialArrayUnique = array_unique($wydzialArray);                                           // pobranie unikalnych wartosci z tablicy wydzialow

            foreach ($wydzialArrayUnique as $department) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $department, PDO::PARAM_STR);

                try {
                    $statement -> execute();
                } catch (PDOException $e) {
                    echo "Blad zapytania: " . $e -> getMessage();
                    exit();
                }
            }

        }

    } catch (PDOException $e) {
        echo "Blad polaczenia z API: " . $e -> getMessage();
        exit();
    }
}


// dokonczyc sala bo zle sie scrapuje :(
/*function scrapSala($pdo) {       // funkcja scrapowania danych do tabeli sala, argument = zmienna laczenia z baza
    try {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=room&query=';                              // link do API

        $response = file_get_contents($url);                                                            // pobranie zawartosci ze zwrotki z API
        echo "Pomyslnie otrzymano zwrot z API \n";
        $data = json_decode($response, true);                                                 // dekodowania zawartosci do JSON


        $clearTableCondition = true;                                                                    // warunek gdy chcemy zeby przed scrapowaniem tablica sie czyscila, jesli nie to ustawic na false
        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM sala");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'sala'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $addToBase = true;                                                                              // warunek czy chcemy scrapwoac, jesli nie to ustawic na false
        if ($addToBase) {

            $sqlInsert = "INSERT INTO sala (wydzialID, numerSali, budynek) VALUES (:wydzialID, :numerSali, :budynek)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);


            foreach ($data as $room) {

                if (isset($room['item'])) {                                                        // sprawdza czy przedmiot w tablicy istnieje
                    list($wydzialNazwa, $budynek, $numerSali) = explode(" ", $room['item'], 3);             // rozbijanie stringa na wydzial, budynek i sale
                    echo $wydzialNazwa . " " . $budynek . " " . $numerSali . "\n";

                    $queryWydzialID = "SELECT wydzialID FROM wydzial WHERE nazwa = :wydzialNazwa";

                    $wydzialID = $pdo->prepare($queryWydzialID);
                    $wydzialID -> bindParam(':wydzialNazwa', $wydzialNazwa, PDO::PARAM_STR);
                    $wydzialID -> execute();
                    $wydzialIDresult = $wydzialID -> fetch(PDO::FETCH_ASSOC);

                    #print_r($wydzialIDresult["wydzialID"]);

                    #echo gettype($wydzialIDresult["wydzialID"]);

                    $wydzialIDresult = (string)$wydzialIDresult["wydzialID"];


                    $statement -> bindParam(':wydzialID', $wydzialIDresult, PDO::PARAM_STR);
                    $statement -> bindParam(':budynek', $budynek, PDO::PARAM_STR);
                    $statement -> bindParam(':numerSali', $numerSali, PDO::PARAM_STR);

                    try {
                        $statement -> execute();
                    } catch (PDOException $e) {
                        echo "Blad zapytania: " . $e -> getMessage();
                        exit();
                    }

                }
            }



        }

    } catch (PDOException $e) {
        echo "Blad polaczenia z API: " . $e -> getMessage();
        exit();
    }
}*/




$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych

#scrapWykladowca($pdo);

#scrapWydzial($pdo);

