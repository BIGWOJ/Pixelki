create table grupa
(
    grupaID integer not null
        constraint grupaPK
            primary key autoincrement,
    nazwa   TEXT    not null
);

create table numerAlbumu
(
    numerAlbumuID integer not null
        constraint numerAlbumuPK
            primary key autoincrement,
    numer         INTEGER not null
);

create table przedmiot
(
    przedmiotID  integer not null
        constraint przedmiotPK
            primary key autoincrement,
    nazwa        TEXT    not null,
    formaStudiow TEXT    not null,
    wydzial      TEXT    not null
);

create table wydzial
(
    wydzialID integer not null
        constraint wydzialPK
            primary key autoincrement,
    nazwa     TEXT    not null
);

create table sala
(
    salaID    integer not null
        constraint salaPK
            primary key autoincrement,
    wydzialID integer not null
        constraint salaWydzialFK
            references wydzial,
    numerSali integer,
    budynek   TEXT    not null
);

create table wykladowca
(
    wykladowcaID integer not null
        constraint wykladowcaPK
            primary key autoincrement,
    imie         TEXT    not null,
    nazwisko     TEXT    not null
);

create table lekcja
(
    lekcjaID     integer not null
        constraint lekcjaID
            primary key autoincrement,
    wykladowcaID integer not null
        constraint lekcjaWykladowcaFK
            references wykladowca,
    grupaID      integer not null
        constraint lekcjaGrupaFK
            references grupa,
    salaID       integer not null
        constraint lekcjaSalaFK
            references sala,
    przedmiotID  integer not null
        constraint lekcjaPrzedmiotFK
            references przedmiot,
    tytul        TEXT    not null,
    opis         TEXT    not null,
    start        TEXT    not null,
    koniec       TEXT    not null,
    formaZajec   TEXT    not null
);

create table studentLekcja
(
    studentLekcjaID integer not null
        constraint studentLekcjaPK
            primary key autoincrement,
    numberAlbumuID  integer not null
        constraint studentLekcjaNumberAlbumuFK
            references numerAlbumu,
    lekcjaID        integer not null
        constraint studentLekcjaLekcjaFK
            references lekcja
);

