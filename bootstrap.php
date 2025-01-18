<?php

function dbConnection($path){       // funkcja laczenia z baza, zwraca zmienna polaczenia z baza
    try {
        $pdo = new PDO($path);
        //echo "Pomyslnie polaczono z baza danych \n";

    } catch (PDOException $e) {
        //echo "Blad polaczenia: " . $e -> getMessage();
        exit();
    }

    return $pdo;
}