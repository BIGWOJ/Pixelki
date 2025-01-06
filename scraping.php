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

function scrapNumerAlbumu($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True, $console_write=False) {
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

        if ($console_write) {
            //Dodatkowa pomocnicza zmienna do testowania
            $iteracja = 0;
        }

        //Iterowanie dopóki nie znajdziemy indeksu, dla którego jest jakiś plan zajęć
        //=============== 59622 to największy numer albumu w bazie z planem zajęć, więc na szybko można od niego startować ===============
        for ($album_index = 59623; $album_index >= 1; $album_index--) {
            if ($console_write) {
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
                if ($console_write) {
                    echo "Koniec na albumie: " . $album_index . "\n";
                }
                break;
            }
            if ($console_write) {
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

//Funkcja poprawiająca numery albumu, usuwając te, które nie mają planu zajęć
function poprawaNumerAlbumu($pdo, $ssl_error=False, $console_write=False, $start_index=1) {
    try {
        //Pobranie wszystkich numerów albumów
        $sql = "SELECT numer FROM numerAlbumu";
        $statement = $pdo->prepare($sql);
        $statement -> execute();
        $numerAlbumu = $statement -> fetchAll(PDO::FETCH_ASSOC);

        try {
            $url = 'https://plan.zut.edu.pl/schedule_student.php?number={album_index}&start=2024-10-01T00%3A00%3A00%2B01%3A00&end=2025-11-01T00%3A00%3A00%2B01%3A00';

            $deleteStatement = $pdo->prepare("DELETE FROM numerAlbumu WHERE numer = :numer");

            //Start_index przydatny do zaczęcia iterowania od konkretnego indeksu (zaoszczędzenie czasu)
            for ($i = $start_index; $i < count($numerAlbumu); $i++) {
                $url_replaced = str_replace('{album_index}', $numerAlbumu[$i]['numer'], $url);

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

                //Jeżeli zapytanie zwróciło tylko jeden element, to znaczy, że nie ma planu zajęć -> usuwamy numer
                if (count($data) == 1) {
                    if ($console_write) {
                        echo "Usuwany numer: " . $numerAlbumu[$i]['numer'] . "\n";
                    }
                    $deleteStatement->bindParam(':numer', $numerAlbumu[$i]['numer'], PDO::PARAM_INT);
                    $deleteStatement->execute();
                }
                //W przeciwnym razie numer jest używany, więc nie usuwamy z bazy
                else {
                    if ($console_write) {
                        echo "\t\tUżywany numer: " . $numerAlbumu[$i]['numer'] . "\n";
                    }
                }
            }

        } catch (PDOException $e) {
            echo "Blad zapytania: " . $e -> getMessage();
            exit();
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

// scrapGrupy bedzie tylko uzywana tylko w momencie wyszukania przez uzytkownika swojego numer albumu, wykladowcy, sali lub przedmiotu
function scrapGrupyNumberAlbumu($pdo, $albumNumber, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT nazwa from grupa";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        $flattenedGroupsNameResult = [];

        foreach($sqlGroupsNameResult as $row){
            $flattenedGroupsNameResult[] = $row["nazwa"];
        }


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM grupa");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'grupa'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $groupsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");


        $url = 'https://plan.zut.edu.pl/schedule_student.php?number=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $albumNumber . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
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


        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        $groupsArray = array_merge($flattenedGroupsNameResult, $groupsArray);
        $groupsArray = array_unique($groupsArray);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($groupsArray as $group) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $group, PDO::PARAM_STR);

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

function scrapGrupyWykladowca($pdo, $teacherName, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT nazwa from grupa";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        $flattenedGroupsNameResult = [];

        foreach($sqlGroupsNameResult as $row){
            $flattenedGroupsNameResult[] = $row["nazwa"];
        }


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM grupa");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'grupa'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $groupsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        list($lastName, $name) = explode(" ", $teacherName, 2);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?teacher=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $lastName . "%20" . $name . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
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


        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        $groupsArray = array_merge($flattenedGroupsNameResult, $groupsArray);
        $groupsArray = array_unique($groupsArray);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($groupsArray as $group) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $group, PDO::PARAM_STR);

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

function scrapGrupySala($pdo, $room, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT nazwa from grupa";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        $flattenedGroupsNameResult = [];

        foreach($sqlGroupsNameResult as $row){
            $flattenedGroupsNameResult[] = $row["nazwa"];
        }


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM grupa");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'grupa'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $groupsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        $room = str_replace(" ", "%20", $room);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?room=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $room . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
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


        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        $groupsArray = array_merge($flattenedGroupsNameResult, $groupsArray);
        $groupsArray = array_unique($groupsArray);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($groupsArray as $group) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $group, PDO::PARAM_STR);

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

function scrapGrupyPrzedmiot($pdo, $subject, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT nazwa from grupa";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        $flattenedGroupsNameResult = [];

        foreach($sqlGroupsNameResult as $row){
            $flattenedGroupsNameResult[] = $row["nazwa"];
        }


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM grupa");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'grupa'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $groupsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        $subject = str_replace(" ", "%20", $subject);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?subject=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $subject . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        $groupsArray = array_merge($flattenedGroupsNameResult, $groupsArray);
        $groupsArray = array_unique($groupsArray);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($groupsArray as $group) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $group, PDO::PARAM_STR);

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

function scrapGrupyGrupa($pdo, $group, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT nazwa from grupa";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        $flattenedGroupsNameResult = [];

        foreach($sqlGroupsNameResult as $row){
            $flattenedGroupsNameResult[] = $row["nazwa"];
        }


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM grupa");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'grupa'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $groupsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        $group = str_replace(" ", "%20", $group);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?group=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $group . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        $groupsArray = array_merge($flattenedGroupsNameResult, $groupsArray);
        $groupsArray = array_unique($groupsArray);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($groupsArray as $group) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $group, PDO::PARAM_STR);

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

// ta funkcja scrapuje wszystkie mozliwe grupy (nie wiem czy na pewno wszystkie)
function scrapGrupyTest($pdo, $ssl_error=False, $clearTableCondition=True, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT nazwa from grupa";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);


        $flattenedGroupsNameResult = [];

        foreach($sqlGroupsNameResult as $row){
            $flattenedGroupsNameResult[] = $row["nazwa"];
        }


        if ($clearTableCondition){
            try {
                $clearTable = $pdo->prepare("DELETE FROM grupa");  // czyszczenie tablicy
                $clearTable -> execute();

                $clearIndexes = $pdo->prepare("DELETE FROM sqlite_sequence WHERE name = 'grupa'"); // czyszczenie indexow tablicy
                $clearIndexes -> execute();
            } catch (PDOException $e) {
                echo "Blad zapytania: " . $e -> getMessage();
                exit();
            }
        }



        $groupsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");



        $url = 'https://plan.zut.edu.pl/schedule_student.php?subject=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . "test" . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        $groupsArray = array_merge($flattenedGroupsNameResult, $groupsArray);
        $groupsArray = array_unique($groupsArray);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO grupa (nazwa) VALUES (:nazwa)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($groupsArray as $group) {                                               // wstawianie do tabeli

                $statement -> bindParam(':nazwa', $group, PDO::PARAM_STR);

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

function scrapLekcjaNumberAlbumu($pdo, $albumNumber, $ssl_error=False, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlLesson = "SELECT * from lekcja";
        $sqlLessonResult = $pdo->query($sqlLesson);
        $sqlLessonResult = $sqlLessonResult -> fetchAll(PDO::FETCH_ASSOC);

        #print_r($sqlLessonResult);


        $lessonsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        $url = 'https://plan.zut.edu.pl/schedule_student.php?number=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $albumNumber . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $lesson) {
            if(count($lesson) > 0) {
                if(isset($lesson)){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                    $wykladowca = $lesson["worker"];
                    $grupa = $lesson["group_name"];
                    $sala = $lesson["room"];
                    $przedmiot = $lesson["subject"];
                    $tytul = $lesson["title"];
                    $opis = $lesson["description"];
                    $lessonStart = $lesson["start"];
                    $lessonEnd = $lesson["end"];
                    $form = $lesson["lesson_form"];

                    $lessonsArray[] = [
                        "worker" => $wykladowca,
                        "group_name" => $grupa,
                        "room" => $sala,
                        "subject" => $przedmiot,
                        "title" => $tytul,
                        "description" => $opis,
                        "start" => $lessonStart,
                        "end" => $lessonEnd,
                        "lesson_form" => $form];
                }
            }

        }


        $arrayLessonsAdd = [];


        // dodawania tylko nowych lekcji
        foreach ($lessonsArray as $lesson) {
            $uniqueKey = $lesson["title"] . "-" . $lesson["description"] . "-" . $lesson["start"] . "-" . $lesson["end"] . "-" . $lesson["lesson_form"];

            $elementExists = false;

            foreach ($sqlLessonResult as $key) {
                $existingKey = $key["tytul"] . "-" . $key["opis"] . "-" . $key["start"] . "-" . $key["koniec"] . "-" . $key["formaZajec"];
                if ($existingKey == $uniqueKey) {
                    $elementExists = true;
                    break;
                }
            }
            if (!$elementExists) {
                $arrayLessonsAdd[] = $lesson;
            }
        }

        #print_r($arrayLessonsAdd);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO lekcja (wykladowcaID, grupaID, salaID, przedmiotID, tytul, opis, start, koniec, formaZajec) VALUES (:wykladowcaID, :grupaID, :salaID, :przedmiotID, :tytul, :opis, :start, :koniec, :formaZajec)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($arrayLessonsAdd as $lesson) {

                // pobranie id wykladowcy
                list($lastName, $name) = explode(" ", (string)$lesson["worker"], 2);             // rozbijanie stringa na imie i nazwisko
                #echo "wykladowca: " . $lastName . " " . $name . "\n";
                $queryWykladowcaID = "SELECT wykladowcaID FROM wykladowca WHERE (Imie = :name AND Nazwisko = :lastName)";
                $wykladowcaID = $pdo->prepare($queryWykladowcaID);
                $wykladowcaID->bindParam(':name', $name, PDO::PARAM_STR);
                $wykladowcaID->bindParam(':lastName', $lastName, PDO::PARAM_STR);
                $wykladowcaID->execute();
                $wykladowcaIDresult = $wykladowcaID->fetch(PDO::FETCH_ASSOC);
                $wykladowcaIDresult = (string)$wykladowcaIDresult["wykladowcaID"];

                // pobranie id grupy
                $grupa = $lesson["group_name"];

                $queryGrupaID = "SELECT grupaID FROM grupa WHERE nazwa = :nazwaGrupy";
                $grupaID = $pdo->prepare($queryGrupaID);
                $grupaID->bindParam(':nazwaGrupy', $grupa, PDO::PARAM_STR);
                $grupaID->execute();
                $grupaIDresult = $grupaID->fetch(PDO::FETCH_ASSOC);
                $grupaIDresult = (string)$grupaIDresult["grupaID"];

                #echo $grupaIDresult . "\n";

                // pobranie id sali
                $room = $lesson["room"];

                list($nazwaWydzialu, $nazwaPokoju) = explode(" ", (string)$lesson["room"], 2);             // rozbijanie stringa na wydzial i pokoj


                $querySalaID = "SELECT s.salaID FROM sala s
                                JOIN wydzial w ON s.wydzialID = w.wydzialID
                                WHERE s.pokoj = :nazwaPokoju AND w.nazwa = :nazwaWydzialu";
                $salaID = $pdo->prepare($querySalaID);
                $salaID->bindParam(':nazwaPokoju', $nazwaPokoju, PDO::PARAM_STR);
                $salaID->bindParam(':nazwaWydzialu', $nazwaWydzialu, PDO::PARAM_STR);
                $salaID->execute();
                $salaIDresult = $salaID->fetch(PDO::FETCH_ASSOC);
                $salaIDresult = (string)$salaIDresult["salaID"];

                #echo $salaIDresult . "\n";

                // pobieranie id przedmiotu
                $przedmiot = $lesson["subject"];

                $queryPrzedmiotID = "SELECT przedmiotID FROM przedmiot WHERE nazwa = :nazwaPrzedmiotu";
                $przedmiotID = $pdo->prepare($queryPrzedmiotID);
                $przedmiotID->bindParam(':nazwaPrzedmiotu', $przedmiot, PDO::PARAM_STR);
                $przedmiotID->execute();
                $przedmiotIDresult = $przedmiotID->fetch(PDO::FETCH_ASSOC);
                $przedmiotIDresult = (string)$przedmiotIDresult["przedmiotID"];

                #echo $przedmiotIDresult . "\n";


                // wstawianie do tabeli

                $statement->bindParam(':wykladowcaID', $wykladowcaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':grupaID', $grupaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':salaID', $salaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':przedmiotID', $przedmiotIDresult, PDO::PARAM_STR);
                $statement->bindParam(':tytul', $lesson["title"], PDO::PARAM_STR);
                $statement->bindParam(':opis', $lesson["description"], PDO::PARAM_STR);
                $statement->bindParam(':start', $lesson["start"], PDO::PARAM_STR);
                $statement->bindParam(':koniec', $lesson["end"], PDO::PARAM_STR);
                $statement->bindParam(':formaZajec', $lesson["lesson_form"], PDO::PARAM_STR);


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

function scrapLekcjaWykladowca($pdo, $teacherName, $ssl_error=False, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlLesson = "SELECT * from lekcja";
        $sqlLessonResult = $pdo->query($sqlLesson);
        $sqlLessonResult = $sqlLessonResult -> fetchAll(PDO::FETCH_ASSOC);

        #print_r($sqlLessonResult);

        $lessonsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");


        list($lastName, $name) = explode(" ", $teacherName, 2);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?teacher=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $lastName . "%20" . $name . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $lesson) {
            if(count($lesson) > 0) {
                if(isset($lesson)){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                    $wykladowca = $lesson["worker"];
                    $grupa = $lesson["group_name"];
                    $sala = $lesson["room"];
                    $przedmiot = $lesson["subject"];
                    $tytul = $lesson["title"];
                    $opis = $lesson["description"];
                    $lessonStart = $lesson["start"];
                    $lessonEnd = $lesson["end"];
                    $form = $lesson["lesson_form"];

                    $lessonsArray[] = [
                        "worker" => $wykladowca,
                        "group_name" => $grupa,
                        "room" => $sala,
                        "subject" => $przedmiot,
                        "title" => $tytul,
                        "description" => $opis,
                        "start" => $lessonStart,
                        "end" => $lessonEnd,
                        "lesson_form" => $form];
                }
            }

        }


        $arrayLessonsAdd = [];


        // dodawania tylko nowych lekcji
        foreach ($lessonsArray as $lesson) {
            $uniqueKey = $lesson["title"] . "-" . $lesson["description"] . "-" . $lesson["start"] . "-" . $lesson["end"] . "-" . $lesson["lesson_form"];

            $elementExists = false;

            foreach ($sqlLessonResult as $key) {
                $existingKey = $key["tytul"] . "-" . $key["opis"] . "-" . $key["start"] . "-" . $key["koniec"] . "-" . $key["formaZajec"];
                if ($existingKey == $uniqueKey) {
                    $elementExists = true;
                    break;
                }
            }
            if (!$elementExists) {
                $arrayLessonsAdd[] = $lesson;
            }
        }

        #print_r($arrayLessonsAdd);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO lekcja (wykladowcaID, grupaID, salaID, przedmiotID, tytul, opis, start, koniec, formaZajec) VALUES (:wykladowcaID, :grupaID, :salaID, :przedmiotID, :tytul, :opis, :start, :koniec, :formaZajec)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($arrayLessonsAdd as $lesson) {

                // pobranie id wykladowcy
                list($lastName, $name) = explode(" ", (string)$lesson["worker"], 2);             // rozbijanie stringa na imie i nazwisko
                #echo "wykladowca: " . $lastName . " " . $name . "\n";
                $queryWykladowcaID = "SELECT wykladowcaID FROM wykladowca WHERE (Imie = :name AND Nazwisko = :lastName)";
                $wykladowcaID = $pdo->prepare($queryWykladowcaID);
                $wykladowcaID->bindParam(':name', $name, PDO::PARAM_STR);
                $wykladowcaID->bindParam(':lastName', $lastName, PDO::PARAM_STR);
                $wykladowcaID->execute();
                $wykladowcaIDresult = $wykladowcaID->fetch(PDO::FETCH_ASSOC);
                $wykladowcaIDresult = (string)$wykladowcaIDresult["wykladowcaID"];

                // pobranie id grupy
                $grupa = $lesson["group_name"];

                $queryGrupaID = "SELECT grupaID FROM grupa WHERE nazwa = :nazwaGrupy";
                $grupaID = $pdo->prepare($queryGrupaID);
                $grupaID->bindParam(':nazwaGrupy', $grupa, PDO::PARAM_STR);
                $grupaID->execute();
                $grupaIDresult = $grupaID->fetch(PDO::FETCH_ASSOC);
                $grupaIDresult = (string)$grupaIDresult["grupaID"];

                #echo $grupaIDresult . "\n";

                // pobranie id sali
                $room = $lesson["room"];

                list($nazwaWydzialu, $nazwaPokoju) = explode(" ", (string)$lesson["room"], 2);             // rozbijanie stringa na wydzial i pokoj


                $querySalaID = "SELECT s.salaID FROM sala s
                                JOIN wydzial w ON s.wydzialID = w.wydzialID
                                WHERE s.pokoj = :nazwaPokoju AND w.nazwa = :nazwaWydzialu";
                $salaID = $pdo->prepare($querySalaID);
                $salaID->bindParam(':nazwaPokoju', $nazwaPokoju, PDO::PARAM_STR);
                $salaID->bindParam(':nazwaWydzialu', $nazwaWydzialu, PDO::PARAM_STR);
                $salaID->execute();
                $salaIDresult = $salaID->fetch(PDO::FETCH_ASSOC);
                $salaIDresult = (string)$salaIDresult["salaID"];

                #echo $salaIDresult . "\n";

                // pobieranie id przedmiotu
                $przedmiot = $lesson["subject"];

                $queryPrzedmiotID = "SELECT przedmiotID FROM przedmiot WHERE nazwa = :nazwaPrzedmiotu";
                $przedmiotID = $pdo->prepare($queryPrzedmiotID);
                $przedmiotID->bindParam(':nazwaPrzedmiotu', $przedmiot, PDO::PARAM_STR);
                $przedmiotID->execute();
                $przedmiotIDresult = $przedmiotID->fetch(PDO::FETCH_ASSOC);
                $przedmiotIDresult = (string)$przedmiotIDresult["przedmiotID"];

                #echo $przedmiotIDresult . "\n";


                // wstawianie do tabeli

                $statement->bindParam(':wykladowcaID', $wykladowcaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':grupaID', $grupaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':salaID', $salaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':przedmiotID', $przedmiotIDresult, PDO::PARAM_STR);
                $statement->bindParam(':tytul', $lesson["title"], PDO::PARAM_STR);
                $statement->bindParam(':opis', $lesson["description"], PDO::PARAM_STR);
                $statement->bindParam(':start', $lesson["start"], PDO::PARAM_STR);
                $statement->bindParam(':koniec', $lesson["end"], PDO::PARAM_STR);
                $statement->bindParam(':formaZajec', $lesson["lesson_form"], PDO::PARAM_STR);


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

function scrapLekcjaSala($pdo, $room, $ssl_error=False, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlLesson = "SELECT * from lekcja";
        $sqlLessonResult = $pdo->query($sqlLesson);
        $sqlLessonResult = $sqlLessonResult -> fetchAll(PDO::FETCH_ASSOC);

        #print_r($sqlLessonResult);

        $lessonsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");


        $room = str_replace(" ", "%20", $room);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?room=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $room . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $lesson) {
            if(count($lesson) > 0) {
                if(isset($lesson)){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                    $wykladowca = $lesson["worker"];
                    $grupa = $lesson["group_name"];
                    $sala = $lesson["room"];
                    $przedmiot = $lesson["subject"];
                    $tytul = $lesson["title"];
                    $opis = $lesson["description"];
                    $lessonStart = $lesson["start"];
                    $lessonEnd = $lesson["end"];
                    $form = $lesson["lesson_form"];

                    $lessonsArray[] = [
                        "worker" => $wykladowca,
                        "group_name" => $grupa,
                        "room" => $sala,
                        "subject" => $przedmiot,
                        "title" => $tytul,
                        "description" => $opis,
                        "start" => $lessonStart,
                        "end" => $lessonEnd,
                        "lesson_form" => $form];
                }
            }

        }


        $arrayLessonsAdd = [];


        // dodawania tylko nowych lekcji
        foreach ($lessonsArray as $lesson) {
            $uniqueKey = $lesson["title"] . "-" . $lesson["description"] . "-" . $lesson["start"] . "-" . $lesson["end"] . "-" . $lesson["lesson_form"];

            $elementExists = false;

            foreach ($sqlLessonResult as $key) {
                $existingKey = $key["tytul"] . "-" . $key["opis"] . "-" . $key["start"] . "-" . $key["koniec"] . "-" . $key["formaZajec"];
                if ($existingKey == $uniqueKey) {
                    $elementExists = true;
                    break;
                }
            }
            if (!$elementExists) {
                $arrayLessonsAdd[] = $lesson;
            }
        }

        #print_r($arrayLessonsAdd);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO lekcja (wykladowcaID, grupaID, salaID, przedmiotID, tytul, opis, start, koniec, formaZajec) VALUES (:wykladowcaID, :grupaID, :salaID, :przedmiotID, :tytul, :opis, :start, :koniec, :formaZajec)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($arrayLessonsAdd as $lesson) {

                // pobranie id wykladowcy
                list($lastName, $name) = explode(" ", (string)$lesson["worker"], 2);             // rozbijanie stringa na imie i nazwisko
                #echo "wykladowca: " . $lastName . " " . $name . "\n";
                $queryWykladowcaID = "SELECT wykladowcaID FROM wykladowca WHERE (Imie = :name AND Nazwisko = :lastName)";
                $wykladowcaID = $pdo->prepare($queryWykladowcaID);
                $wykladowcaID->bindParam(':name', $name, PDO::PARAM_STR);
                $wykladowcaID->bindParam(':lastName', $lastName, PDO::PARAM_STR);
                $wykladowcaID->execute();
                $wykladowcaIDresult = $wykladowcaID->fetch(PDO::FETCH_ASSOC);
                $wykladowcaIDresult = (string)$wykladowcaIDresult["wykladowcaID"];

                // pobranie id grupy
                $grupa = $lesson["group_name"];

                $queryGrupaID = "SELECT grupaID FROM grupa WHERE nazwa = :nazwaGrupy";
                $grupaID = $pdo->prepare($queryGrupaID);
                $grupaID->bindParam(':nazwaGrupy', $grupa, PDO::PARAM_STR);
                $grupaID->execute();
                $grupaIDresult = $grupaID->fetch(PDO::FETCH_ASSOC);
                $grupaIDresult = (string)$grupaIDresult["grupaID"];

                #echo $grupaIDresult . "\n";

                // pobranie id sali
                $room = $lesson["room"];

                list($nazwaWydzialu, $nazwaPokoju) = explode(" ", (string)$lesson["room"], 2);             // rozbijanie stringa na wydzial i pokoj


                $querySalaID = "SELECT s.salaID FROM sala s
                                JOIN wydzial w ON s.wydzialID = w.wydzialID
                                WHERE s.pokoj = :nazwaPokoju AND w.nazwa = :nazwaWydzialu";
                $salaID = $pdo->prepare($querySalaID);
                $salaID->bindParam(':nazwaPokoju', $nazwaPokoju, PDO::PARAM_STR);
                $salaID->bindParam(':nazwaWydzialu', $nazwaWydzialu, PDO::PARAM_STR);
                $salaID->execute();
                $salaIDresult = $salaID->fetch(PDO::FETCH_ASSOC);
                $salaIDresult = (string)$salaIDresult["salaID"];

                #echo $salaIDresult . "\n";

                // pobieranie id przedmiotu
                $przedmiot = $lesson["subject"];

                $queryPrzedmiotID = "SELECT przedmiotID FROM przedmiot WHERE nazwa = :nazwaPrzedmiotu";
                $przedmiotID = $pdo->prepare($queryPrzedmiotID);
                $przedmiotID->bindParam(':nazwaPrzedmiotu', $przedmiot, PDO::PARAM_STR);
                $przedmiotID->execute();
                $przedmiotIDresult = $przedmiotID->fetch(PDO::FETCH_ASSOC);
                $przedmiotIDresult = (string)$przedmiotIDresult["przedmiotID"];

                #echo $przedmiotIDresult . "\n";


                // wstawianie do tabeli

                $statement->bindParam(':wykladowcaID', $wykladowcaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':grupaID', $grupaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':salaID', $salaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':przedmiotID', $przedmiotIDresult, PDO::PARAM_STR);
                $statement->bindParam(':tytul', $lesson["title"], PDO::PARAM_STR);
                $statement->bindParam(':opis', $lesson["description"], PDO::PARAM_STR);
                $statement->bindParam(':start', $lesson["start"], PDO::PARAM_STR);
                $statement->bindParam(':koniec', $lesson["end"], PDO::PARAM_STR);
                $statement->bindParam(':formaZajec', $lesson["lesson_form"], PDO::PARAM_STR);


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

function scrapLekcjaPrzedmiot($pdo, $subject, $ssl_error=False, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlLesson = "SELECT * from lekcja";
        $sqlLessonResult = $pdo->query($sqlLesson);
        $sqlLessonResult = $sqlLessonResult -> fetchAll(PDO::FETCH_ASSOC);

        #print_r($sqlLessonResult);

        $lessonsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        $subject = str_replace(" ", "%20", $subject);

        $url = 'https://plan.zut.edu.pl/schedule_student.php?subject=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $subject . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $lesson) {
            if(count($lesson) > 0) {
                if(isset($lesson)){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                    $wykladowca = $lesson["worker"];
                    $grupa = $lesson["group_name"];
                    $sala = $lesson["room"];
                    $przedmiot = $lesson["subject"];
                    $tytul = $lesson["title"];
                    $opis = $lesson["description"];
                    $lessonStart = $lesson["start"];
                    $lessonEnd = $lesson["end"];
                    $form = $lesson["lesson_form"];

                    $lessonsArray[] = [
                        "worker" => $wykladowca,
                        "group_name" => $grupa,
                        "room" => $sala,
                        "subject" => $przedmiot,
                        "title" => $tytul,
                        "description" => $opis,
                        "start" => $lessonStart,
                        "end" => $lessonEnd,
                        "lesson_form" => $form];
                }
            }

        }


        $arrayLessonsAdd = [];


        // dodawania tylko nowych lekcji
        foreach ($lessonsArray as $lesson) {
            $uniqueKey = $lesson["title"] . "-" . $lesson["description"] . "-" . $lesson["start"] . "-" . $lesson["end"] . "-" . $lesson["lesson_form"];

            $elementExists = false;

            foreach ($sqlLessonResult as $key) {
                $existingKey = $key["tytul"] . "-" . $key["opis"] . "-" . $key["start"] . "-" . $key["koniec"] . "-" . $key["formaZajec"];
                if ($existingKey == $uniqueKey) {
                    $elementExists = true;
                    break;
                }
            }
            if (!$elementExists) {
                $arrayLessonsAdd[] = $lesson;
            }
        }

        #print_r($arrayLessonsAdd);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO lekcja (wykladowcaID, grupaID, salaID, przedmiotID, tytul, opis, start, koniec, formaZajec) VALUES (:wykladowcaID, :grupaID, :salaID, :przedmiotID, :tytul, :opis, :start, :koniec, :formaZajec)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($arrayLessonsAdd as $lesson) {

                // pobranie id wykladowcy
                list($lastName, $name) = explode(" ", (string)$lesson["worker"], 2);             // rozbijanie stringa na imie i nazwisko
                #echo "wykladowca: " . $lastName . " " . $name . "\n";
                $queryWykladowcaID = "SELECT wykladowcaID FROM wykladowca WHERE (Imie = :name AND Nazwisko = :lastName)";
                $wykladowcaID = $pdo->prepare($queryWykladowcaID);
                $wykladowcaID->bindParam(':name', $name, PDO::PARAM_STR);
                $wykladowcaID->bindParam(':lastName', $lastName, PDO::PARAM_STR);
                $wykladowcaID->execute();
                $wykladowcaIDresult = $wykladowcaID->fetch(PDO::FETCH_ASSOC);
                $wykladowcaIDresult = (string)$wykladowcaIDresult["wykladowcaID"];

                // pobranie id grupy
                $grupa = $lesson["group_name"];

                $queryGrupaID = "SELECT grupaID FROM grupa WHERE nazwa = :nazwaGrupy";
                $grupaID = $pdo->prepare($queryGrupaID);
                $grupaID->bindParam(':nazwaGrupy', $grupa, PDO::PARAM_STR);
                $grupaID->execute();
                $grupaIDresult = $grupaID->fetch(PDO::FETCH_ASSOC);
                $grupaIDresult = (string)$grupaIDresult["grupaID"];

                #echo $grupaIDresult . "\n";

                // pobranie id sali
                $room = $lesson["room"];

                list($nazwaWydzialu, $nazwaPokoju) = explode(" ", (string)$lesson["room"], 2);             // rozbijanie stringa na wydzial i pokoj


                $querySalaID = "SELECT s.salaID FROM sala s
                                JOIN wydzial w ON s.wydzialID = w.wydzialID
                                WHERE s.pokoj = :nazwaPokoju AND w.nazwa = :nazwaWydzialu";
                $salaID = $pdo->prepare($querySalaID);
                $salaID->bindParam(':nazwaPokoju', $nazwaPokoju, PDO::PARAM_STR);
                $salaID->bindParam(':nazwaWydzialu', $nazwaWydzialu, PDO::PARAM_STR);
                $salaID->execute();
                $salaIDresult = $salaID->fetch(PDO::FETCH_ASSOC);
                $salaIDresult = (string)$salaIDresult["salaID"];

                #echo $salaIDresult . "\n";

                // pobieranie id przedmiotu
                $przedmiot = $lesson["subject"];

                $queryPrzedmiotID = "SELECT przedmiotID FROM przedmiot WHERE nazwa = :nazwaPrzedmiotu";
                $przedmiotID = $pdo->prepare($queryPrzedmiotID);
                $przedmiotID->bindParam(':nazwaPrzedmiotu', $przedmiot, PDO::PARAM_STR);
                $przedmiotID->execute();
                $przedmiotIDresult = $przedmiotID->fetch(PDO::FETCH_ASSOC);
                $przedmiotIDresult = (string)$przedmiotIDresult["przedmiotID"];

                #echo $przedmiotIDresult . "\n";


                // wstawianie do tabeli

                $statement->bindParam(':wykladowcaID', $wykladowcaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':grupaID', $grupaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':salaID', $salaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':przedmiotID', $przedmiotIDresult, PDO::PARAM_STR);
                $statement->bindParam(':tytul', $lesson["title"], PDO::PARAM_STR);
                $statement->bindParam(':opis', $lesson["description"], PDO::PARAM_STR);
                $statement->bindParam(':start', $lesson["start"], PDO::PARAM_STR);
                $statement->bindParam(':koniec', $lesson["end"], PDO::PARAM_STR);
                $statement->bindParam(':formaZajec', $lesson["lesson_form"], PDO::PARAM_STR);


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

function scrapLekcjaGrupa($pdo, $group, $ssl_error=False, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlLesson = "SELECT * from lekcja";
        $sqlLessonResult = $pdo->query($sqlLesson);
        $sqlLessonResult = $sqlLessonResult -> fetchAll(PDO::FETCH_ASSOC);

        #print_r($sqlLessonResult);

        $lessonsArray = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");

        $group = str_replace(" ", "%20", $group);


        $url = 'https://plan.zut.edu.pl/schedule_student.php?group=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $group . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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


        foreach ($data as $lesson) {
            if(count($lesson) > 0) {
                if(isset($lesson)){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                    $wykladowca = $lesson["worker"];
                    $grupa = $lesson["group_name"];
                    $sala = $lesson["room"];
                    $przedmiot = $lesson["subject"];
                    $tytul = $lesson["title"];
                    $opis = $lesson["description"];
                    $lessonStart = $lesson["start"];
                    $lessonEnd = $lesson["end"];
                    $form = $lesson["lesson_form"];

                    $lessonsArray[] = [
                        "worker" => $wykladowca,
                        "group_name" => $grupa,
                        "room" => $sala,
                        "subject" => $przedmiot,
                        "title" => $tytul,
                        "description" => $opis,
                        "start" => $lessonStart,
                        "end" => $lessonEnd,
                        "lesson_form" => $form];
                }
            }

        }


        $arrayLessonsAdd = [];


        // dodawania tylko nowych lekcji
        foreach ($lessonsArray as $lesson) {
            $uniqueKey = $lesson["title"] . "-" . $lesson["description"] . "-" . $lesson["start"] . "-" . $lesson["end"] . "-" . $lesson["lesson_form"];

            $elementExists = false;

            foreach ($sqlLessonResult as $key) {
                $existingKey = $key["tytul"] . "-" . $key["opis"] . "-" . $key["start"] . "-" . $key["koniec"] . "-" . $key["formaZajec"];
                if ($existingKey == $uniqueKey) {
                    $elementExists = true;
                    break;
                }
            }
            if (!$elementExists) {
                $arrayLessonsAdd[] = $lesson;
            }
        }

        #print_r($arrayLessonsAdd);



        if ($addToBase) {

            $sqlInsert = "INSERT INTO lekcja (wykladowcaID, grupaID, salaID, przedmiotID, tytul, opis, start, koniec, formaZajec) VALUES (:wykladowcaID, :grupaID, :salaID, :przedmiotID, :tytul, :opis, :start, :koniec, :formaZajec)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($arrayLessonsAdd as $lesson) {

                // pobranie id wykladowcy
                list($lastName, $name) = explode(" ", (string)$lesson["worker"], 2);             // rozbijanie stringa na imie i nazwisko
                #echo "wykladowca: " . $lastName . " " . $name . "\n";
                $queryWykladowcaID = "SELECT wykladowcaID FROM wykladowca WHERE (Imie = :name AND Nazwisko = :lastName)";
                $wykladowcaID = $pdo->prepare($queryWykladowcaID);
                $wykladowcaID->bindParam(':name', $name, PDO::PARAM_STR);
                $wykladowcaID->bindParam(':lastName', $lastName, PDO::PARAM_STR);
                $wykladowcaID->execute();
                $wykladowcaIDresult = $wykladowcaID->fetch(PDO::FETCH_ASSOC);
                $wykladowcaIDresult = (string)$wykladowcaIDresult["wykladowcaID"];

                // pobranie id grupy
                $grupa = $lesson["group_name"];

                $queryGrupaID = "SELECT grupaID FROM grupa WHERE nazwa = :nazwaGrupy";
                $grupaID = $pdo->prepare($queryGrupaID);
                $grupaID->bindParam(':nazwaGrupy', $grupa, PDO::PARAM_STR);
                $grupaID->execute();
                $grupaIDresult = $grupaID->fetch(PDO::FETCH_ASSOC);
                $grupaIDresult = (string)$grupaIDresult["grupaID"];

                #echo $grupaIDresult . "\n";

                // pobranie id sali
                $room = $lesson["room"];

                list($nazwaWydzialu, $nazwaPokoju) = explode(" ", (string)$lesson["room"], 2);             // rozbijanie stringa na wydzial i pokoj


                $querySalaID = "SELECT s.salaID FROM sala s
                                JOIN wydzial w ON s.wydzialID = w.wydzialID
                                WHERE s.pokoj = :nazwaPokoju AND w.nazwa = :nazwaWydzialu";
                $salaID = $pdo->prepare($querySalaID);
                $salaID->bindParam(':nazwaPokoju', $nazwaPokoju, PDO::PARAM_STR);
                $salaID->bindParam(':nazwaWydzialu', $nazwaWydzialu, PDO::PARAM_STR);
                $salaID->execute();
                $salaIDresult = $salaID->fetch(PDO::FETCH_ASSOC);
                $salaIDresult = (string)$salaIDresult["salaID"];

                #echo $salaIDresult . "\n";

                // pobieranie id przedmiotu
                $przedmiot = $lesson["subject"];

                $queryPrzedmiotID = "SELECT przedmiotID FROM przedmiot WHERE nazwa = :nazwaPrzedmiotu";
                $przedmiotID = $pdo->prepare($queryPrzedmiotID);
                $przedmiotID->bindParam(':nazwaPrzedmiotu', $przedmiot, PDO::PARAM_STR);
                $przedmiotID->execute();
                $przedmiotIDresult = $przedmiotID->fetch(PDO::FETCH_ASSOC);
                $przedmiotIDresult = (string)$przedmiotIDresult["przedmiotID"];

                #echo $przedmiotIDresult . "\n";


                // wstawianie do tabeli

                $statement->bindParam(':wykladowcaID', $wykladowcaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':grupaID', $grupaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':salaID', $salaIDresult, PDO::PARAM_STR);
                $statement->bindParam(':przedmiotID', $przedmiotIDresult, PDO::PARAM_STR);
                $statement->bindParam(':tytul', $lesson["title"], PDO::PARAM_STR);
                $statement->bindParam(':opis', $lesson["description"], PDO::PARAM_STR);
                $statement->bindParam(':start', $lesson["start"], PDO::PARAM_STR);
                $statement->bindParam(':koniec', $lesson["end"], PDO::PARAM_STR);
                $statement->bindParam(':formaZajec', $lesson["lesson_form"], PDO::PARAM_STR);


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

function scrapNumerAlbumuGrupa($pdo, $albumNumber, $ssl_error=False, $addToBase=True) {
    try {
        // przygotowywanie poprawnego linka do APi

        $sqlGroupsName = "SELECT g.nazwa, na.numer from NumerAlbumuGrupa n
                         JOIN grupa g ON n.grupaID = g.grupaID
                         JOIN numerAlbumu na ON n.numerAlbumuID = na.numerAlbumuID";
        $sqlGroupsNameResult = $pdo->query($sqlGroupsName);
        $sqlGroupsNameResult = $sqlGroupsNameResult -> fetchAll(PDO::FETCH_ASSOC);

        #print_r($sqlGroupsNameResult);


        $groupsArray = [];
        $arrayGroupAdd = [];
        $newGroup = [];

        // ustawienie zeby pobieralo tylko lekcje do 1 miesiaca w przod
        $dateNow = new DateTime();
        $dateNow = $dateNow->format("Y-m-d");

        $dateMonth = new DateTime();
        $dateMonth = $dateMonth->modify("+1 month");
        $dateMonth = $dateMonth->format("Y-m-d");


        $url = 'https://plan.zut.edu.pl/schedule_student.php?number=';    // link do API
        // przygotowanie nazwy pokoju dla api

        $url = $url . $albumNumber . "&start=" . $dateNow . "T00%3A00%3A00%2B01%3A00&end=" . $dateMonth . "T00%3A00%3A00%2B01%3A00";
        echo $url . "\n";

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



        foreach ($data as $group) {
            if(isset($group["group_name"])){               // sprawdzanie czy API nie zwrocilo pustego wyniku
                $groupsArray[] = $group["group_name"];
            }
        }
        $groupsArray = array_unique($groupsArray);

        #print_r($groupsArray);

        foreach($groupsArray as $group){
            $newGroup[] = ["nazwa" => $group, "numer" => $albumNumber];
        }

        #print_r($newGroup);


        // dodawania tylko nowych rekordow
        foreach ($newGroup as $group) {
            $uniqueKey = $group["nazwa"] . "-" . $group["numer"];

            $elementExists = false;

            foreach ($sqlGroupsNameResult as $key) {
                $existingKey = $key["nazwa"] . "-" . $key["numer"];
                if ($existingKey == $uniqueKey) {
                    $elementExists = true;
                    break;
                }
            }
            if (!$elementExists) {
                $arrayGroupAdd[] = $group;
            }
        }

        #print_r($groupsArray);

        if ($addToBase) {

            $sqlInsert = "INSERT INTO NumerAlbumuGrupa (grupaID, numerAlbumuID) VALUES (:grupaID, :numberAlbumuID)";                                 // wstawianie do tabeli
            $statement = $pdo->prepare($sqlInsert);

            foreach ($arrayGroupAdd as $group) {                                               // wstawianie do tabeli
                $sqlGroupNumberID = "SELECT grupaID FROM grupa WHERE nazwa = :nazwa";
                $sqlGroupNumberIDResult = $pdo->prepare($sqlGroupNumberID);
                $sqlGroupNumberIDResult->BindParam(':nazwa', $group["nazwa"], PDO::PARAM_STR);
                $sqlGroupNumberIDResult->execute();
                $sqlGroupNumberIDResult = $sqlGroupNumberIDResult -> fetch(PDO::FETCH_ASSOC);
                $sqlGroupNumberIDResult = $sqlGroupNumberIDResult["grupaID"];

                $statement -> bindParam(':grupaID', $sqlGroupNumberIDResult, PDO::PARAM_STR);
                $statement -> bindParam(':numberAlbumuID', $albumNumber, PDO::PARAM_INT);

                try {
                    $statement -> execute();
                } catch (PDOException $e) {
                    echo "Blad zapytania insert: " . $e -> getMessage();
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
$console_write = True;

$dbPath = 'sqlite:./data.db';   // link do bazy danych

$pdo = dbConnection($dbPath);   // polaczenie z baza danych


#scrapWykladowca($pdo, $ssl_error);

#scrapWydzial($pdo);

#scrapNumerAlbumu($pdo, $ssl_error, $clearTableCondition, $addToBase, $console_write);

#scrapSala($pdo, $ssl_error, $clearTableCondition, $addToBase);

#scrapPrzedmiot($pdo, $ssl_error, $clearTableCondition, $addToBase);

#poprawaNumerAlbumu($pdo, $ssl_error, $console_write, $start_index=92);

#scrapGrupyNumberAlbumu($pdo, $albumNumber = "53731", $ssl_error, $clearTableCondition = True, $addToBase = True);

#scrapGrupyWykladowca($pdo, "Abramek Karol", $ssl_error, $clearTableCondition = True, $addToBase = True);

#scrapGrupySala($pdo, $room = "WI WI1- 007", $ssl_error, $clearTableCondition = True, $addToBase = True);

#scrapGrupyPrzedmiot($pdo, $subject = "Sieci komputerowe (L)", $ssl_error, $clearTableCondition = True, $addToBase = True);

#scrapGrupyGrupa($pdo, $group = "SD_1 sem_S 1_Grześkowiak", $ssl_error, $clearTableCondition = True, $addToBase = True);

#scrapGrupyTest($pdo, $ssl_error, $clearTableCondition, $addToBase); // ta funkcja zbiera wszystkie grupy

#scrapLekcjaNumberAlbumu($pdo, $albumNumber = "53873", $ssl_error=False, $addToBase=True);

#scrapLekcjaWykladowca($pdo, $teacherName = "Kondyjowska-Dziechciarz Marzena", $ssl_error=False, $addToBase=True);

#scrapLekcjaSala($pdo, $teacherName = "WI WI1- 007", $ssl_error=False, $addToBase=True);

#scrapLekcjaPrzedmiot($pdo, $subject = "Sieci komputerowe (L)", $ssl_error=False, $addToBase=True);

#scrapLekcjaGrupa($pdo, $group = "SJO/WBIHZ/S1/s.3/Krupka/l", $ssl_error=False, $addToBase=True);

// dodawania rekordow do tabeli numerAlbumuGrupa
#scrapNumerAlbumuGrupa($pdo, $albumNumber = "53731", $ssl_error=False, $addToBase=True);






