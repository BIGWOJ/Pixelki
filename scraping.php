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


function scrapWykladowca($pdo, $ssl_error=False) {       // funkcja scrapowania danych do tabeli wykladowca, argument = zmienna laczenia z baza
    try {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=teacher&query=';       // link do API

        if ($ssl_error) {
            $options = [
                "ssl" => [
                    "verify_peer" => false,
                    "verify_peer_name" => false,
                ],
            ];
            $context = stream_context_create($options);
            #Pobranie zawartosci ze zwrotki z API
            $response = file_get_contents($url, false, $context);
        }
        else {
            $response = file_get_contents($url);
        }

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

function scrapNumerAlbumu($pdo, $ssl_error=False) {
    try {
        $url = 'https://plan.zut.edu.pl/schedule_student.php?number={album_index}&start=2024-10-01T00%3A00%3A00%2B01%3A00&end=2025-06-23T00%3A00%3A00%2B01%3A00';

        //Start jako pierwszy dzień zajęć, end jako ostatni dzień zajęć
        for ($album_index = 53894; $album_index <= 53900; $album_index++) {
            $url_replaced = str_replace('{album_index}', $album_index, $url);
            if ($ssl_error) {
                //Opcje dla file_get_contents, bo bez tego były błędy związane z certyfikatem SSL
                $options = [
                    "ssl" => [
                        "verify_peer" => false,
                        "verify_peer_name" => false,
                    ],
                ];
                $context = stream_context_create($options);
                $response = file_get_contents($url_replaced, false, $context);
            }
            else {
                $response = file_get_contents($url_replaced);
            }

            $data = json_decode($response, true);

            //Warunek gdy chcemy zeby przed scrapowaniem tablica sie czyscila, jesli nie to ustawic na false
            $clearTableCondition = true;
            if ($clearTableCondition) {
                try {
                    $clearTable = $pdo->prepare("DELETE FROM numerAlbumu");
                    $clearTable -> execute();

                    $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'numerAlbumu'");
                    $clearIndexes -> execute();
                } catch (PDOException $e) {
                    echo "Blad zapytania: " . $e -> getMessage();
                    exit();
                }
            }

            //Jeżeli opisany zakres czasowy zwrócił 1 rekord, to znaczy, że nie ma zajęć (pusta lista)
            if (count($data) == 1) {
                $puste+=1;
            }
            else {
                $dodac+=1;
            }
        }
        echo "Puste: " . $puste . "\n";

    } catch (PDOException $e) {
        echo "Blad polaczenia z API: " . $e -> getMessage();
        exit();
    }
}

//Ustawić na True, jeśli występuje błąd związany z certyfikatem SSL
$ssl_error = True;

$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych

#scrapWykladowca($pdo, $ssl_error);

#scrapWydzial($pdo);

scrapNumerAlbumu($pdo, $ssl_error);