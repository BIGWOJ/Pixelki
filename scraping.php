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


function scrapWykladowca($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {       // funkcja scrapowania danych do tabeli wykladowca, argument = zmienna laczenia z baza
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

function scrapWydzial($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {       // funkcja scrapowania danych do tabeli wydzial, argument = zmienna laczenia z baza
    try {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=room&query=';                              // link do API

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
        }                                                           // pobranie zawartosci ze zwrotki z API
        echo "Pomyslnie otrzymano zwrot z API \n";
        $data = json_decode($response, true);                                                 // dekodowania zawartosci do JSON


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

function scrapSala($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {       // funkcja scrapowania danych do tabeli sala, argument = zmienna laczenia z baza
    try {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=room&query=';                              // link do API


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
        }         // pobranie zawartosci ze zwrotki z API
        echo "Pomyslnie otrzymano zwrot z API \n";
        $data = json_decode($response, true);                                                 // dekodowania zawartosci do JSON


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



        if ($addToBase) {

            $sqlInsert = "INSERT INTO sala (wydzialID, pokoj) VALUES (:wydzialID, :pokoj)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);


            foreach ($data as $room) {

                if (isset($room['item'])) {                                                        // sprawdza czy przedmiot w tablicy istnieje
                    list($wydzialNazwa, $pokoj) = explode(" ", $room['item'], 2);             // rozbijanie stringa na wydzial, budynek i sale

                    $queryWydzialID = "SELECT wydzialID FROM wydzial WHERE nazwa = :wydzialNazwa";

                    $wydzialID = $pdo->prepare($queryWydzialID);
                    $wydzialID -> bindParam(':wydzialNazwa', $wydzialNazwa, PDO::PARAM_STR);
                    $wydzialID -> execute();
                    $wydzialIDresult = $wydzialID -> fetch(PDO::FETCH_ASSOC);


                    $wydzialIDresult = (string)$wydzialIDresult["wydzialID"];


                    $statement -> bindParam(':wydzialID', $wydzialIDresult, PDO::PARAM_STR);
                    $statement -> bindParam(':pokoj', $pokoj, PDO::PARAM_STR);

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

function scrapNumerAlbumu($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True, $test=False) {
    try {

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

        //Start i end jako pierwszy miesiąc nauki
        $url = 'https://plan.zut.edu.pl/schedule_student.php?number={album_index}&start=2024-10-01T00%3A00%3A00%2B01%3A00&end=2025-11-01T00%3A00%3A00%2B01%3A00';

        if ($test) {
            //Dodatkowa pomocnicza zmienna do testowania
            $iteracja = 0;
        }

        //Iterowanie dopóki nie znajdziemy indeksu, dla którego jest jakiś plan zajęć
        //=============== 59622 to największy numer albumu w bazie z planem zajęć, więc na szybko można od niego startować ===============
        for ($album_index = 59623; $album_index >= 1; $album_index--) {
            if ($test) {
                $iteracja += 1;
            }

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
            } else {
                $response = file_get_contents($url_replaced);
            }

            $data = json_decode($response, true);

            //Jeżeli zapytanie zwróciło więcej niż jeden element, to znaczy, że jest jakiś plan zajęć -> poprawny numer albumu
            if (count($data) > 1) {
                if ($test) {
                    echo "Koniec na albumie: " . $album_index . "\n";
                }
                break;
            }
            if ($test) {
                echo $iteracja . "\n";
            }
        }

        $the_largest_index = $album_index;

        if ($addToBase) {
            $sqlInsert = "INSERT INTO numerAlbumu (numer) VALUES (:numerAlbumu)";
            $statement = $pdo->prepare($sqlInsert);

            //Dodawanie wszystkich albumów do największego, jaki ma jakiś plan zajęć
            $pdo->beginTransaction();
            try {
                for ($index = 1; $index <= $the_largest_index; $index++) {
                    $statement -> bindParam(':numerAlbumu', $index, PDO::PARAM_INT);
                    $statement -> execute();
                }
                $pdo->commit();

            } catch (PDOException $e) {
                $pdo->rollBack();
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }

    } catch (PDOException $e) {
        echo "Blad polaczenia z API: " . $e -> getMessage();
        exit();
    }
}

function scrapPrzedmiot($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {       // funkcja scrapowania danych do tabeli sala, argument = zmienna laczenia z baza
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlRoomsName = "SELECT w.nazwa, s.pokoj FROM sala s
                         JOIN wydzial w ON s.wydzialID = w.wydzialID";
        $sqlRoomsNameResult = $pdo->query($sqlRoomsName);
        $sqlRoomsNameResult = $sqlRoomsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM przedmiot");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'przedmiot'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $przedmiotArray = [];


        // pobieranie wszystkich lekcji z wszystkich sal
        foreach ($sqlRoomsNameResult as $row) {
            $url = 'https://plan.zut.edu.pl/schedule_student.php?room=';    // link do API

            // przygotowanie nazwy pokoju dla api

            $link = $row["nazwa"] . " " . $row["pokoj"];
            $link = str_replace("   "," ", $link);
            $link = str_replace("  "," ", $link);
            $link = str_replace(" ", "%20", $link);

            // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
            $dateNow = new DateTime();
            $dateNow = $dateNow->format("Y-m-d");

            $dateMonth = new DateTime();
            $dateMonth = $dateMonth->modify("+1 month");
            $dateMonth = $dateMonth->format("Y-m-d");


            $url = $url . $link . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
            #echo $url . "\n";

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
            }         // pobranie zawartosci ze zwrotki z API
            echo "Pomyslnie otrzymano zwrot z API \n";
            $data = json_decode($response, true);                                                 // dekodowania zawartosci do JSON


            foreach ($data as $przedmiot) {
                if(isset($przedmiot["subject"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                    $przedmiotArray[] = $przedmiot["subject"];
                }
            }

        }


        if ($addToBase) {

            $sqlInsert = "INSERT INTO przedmiot (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            $przedmiotArrayUnique = array_unique($przedmiotArray);                                           // pobranie unikalnych wartosci z tablicy wydzialow

            foreach ($przedmiotArrayUnique as $przedmiot) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $przedmiot, PDO::PARAM_STR);

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




//Ustawić na True, jeśli występuje błąd związany z certyfikatem SSL
$ssl_error = True;

//Ustawić na True, jeśli chcemy wyczyścić tabelę przed scrapowaniem
$clearTableCondition = True;

//Ustawić na True, jeśli chcemy dodawać dane do tabeli
$addToBase = True;

//Ustawić na True, jeżeli chcemy mieć podgląd do zmiannych testowych w konsoli podczas scrapNumerAlbumu
$test = False;

$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych

#scrapWykladowca($pdo, $ssl_error);

#scrapWydzial($pdo);

#scrapNumerAlbumu($pdo, $ssl_error, $clearTableCondition, $addToBase, $test);

#scrapSala($pdo, $ssl_error, $clearTableCondition, $addToBase);

#scrapPrzedmiot($pdo, $ssl_error, $clearTableCondition, $addToBase);

