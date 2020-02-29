create table user
(
	name varchar(50) not null,
    username varchar(50) primary key,
    email varchar(100) unique
);

create table leagueMatch
(
	matchId varchar(50) primary key,
    matchUrl varchar(200) unique,
    matchName varchar(50) not null,
    updated datetime,
    active boolean not null
);

create table matchPlayer
(
	playerId varchar(50) primary key,
    matchId varchar(50) not null,
    playerName varchar(100) not null
);

create table userTeam
(
	username varchar(50) not null,
    matchId varchar(50) not null,
    captain boolean not null,
    playerId varchar(50) not null
);

create table score
(
	username varchar(50) not null,
    currentScore int,
    totalScore int
);

