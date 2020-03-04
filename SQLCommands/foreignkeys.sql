alter table score
add constraint FK_score_username
foreign key (username) references user(username)
on delete cascade;

alter table userTeam
add constraint FK_userTeam_username
foreign key (username) references user(username);
on delete cascade;

alter table userTeam
add constraint FK_userTeam_matchId
foreign key (matchId) references leagueMatch(matchId)
on delete cascade;

alter table matchPlayer
add constraint FK_matchPlayer_matchId
foreign key (matchId) references leagueMatch(matchId)
on delete cascade;