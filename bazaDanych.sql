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

create table NumerAlbumuGrupa
(
    numerAlbumuGrupaID integer not null
        constraint NumerAlbumuGrupaPK
            primary key,
    grupaID            integer not null
        constraint grupaIDFK
            references grupa,
    numerAlbumuID      integer not null
        constraint numerAlbumuIDFK
            references numerAlbumu
);

create table przedmiot
(
    przedmiotID integer not null
        constraint przedmiotPK
            primary key autoincrement,
    nazwa       TEXT    not null
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
    pokoj     TEXT
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
    formaZajec   TEXT
);

