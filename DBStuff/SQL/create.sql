create table user (
  name varchar(50) not null,
  username varchar(50) primary key,
  email varchar(100) unique
);
create table leagueMatch (
  matchId varchar(50) primary key,
  matchUrl varchar(200) unique,
  matchName varchar(50) not null,
  updated datetime,
  active boolean not null
);
create table matchPlayer (
  playerId varchar(50) not null,
  matchId varchar(50) not null,
  playerName varchar(100) not null,
  primary key (playerId, matchId)
);
create table userTeam (
  username varchar(50) not null,
  matchId varchar(50) not null,
  captain boolean not null,
  playerId varchar(50) not null,
  primary key (username, matchId, playerId)
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




-- sgsg

desc userTeam;
drop table userTeam;

create table userTeam
(
	username varchar(50),
    matchId varchar(50),
    teamId integer primary key auto_increment
);

create table team
(
	teamId integer,
    playerId varchar(50),
    captain boolean
);
alter table team
add constraint FK_team_teamId
foreign key (teamId) references userTeam(teamId);
