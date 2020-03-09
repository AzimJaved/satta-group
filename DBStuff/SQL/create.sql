create table user (
  name varchar(50) not null,
  username varchar(50) primary key,
  email varchar(100) unique
);
create table leagueMatch (
  matchId integer primary key,
  matchUrl varchar(200) unique,
  matchName varchar(50) not null,
  updated datetime,
  active boolean not null
);
create table matchPlayer (
  playerId integer primary key,
  matchId integer not null,
  playerName varchar(100) not null,
);
CREATE TABLE scoringRule (
  wicket INTEGER NOT NULL,
  run INTEGER not null,
  catch INTEGER not null,
  stump INTEGER not null
);
create table score (
  username varchar(50) primary key,
  currentScore integer,
  totalScore integer
);

create table userTeam
(
	username varchar(50),
  matchId integer,
  teamId integer primary key
);

create table team
(
	teamId integer,
  playerId integer,
  captain boolean
);
