var matchData = Spark.getData();
if (Spark.getPlayer().getPlayerId() != matchData.participants[0].id) {
    Spark.exit();
}
var challengeCode = "";
var accessType = "PRIVATE";
switch (matchData.matchShortCode) {
    case "StandardMatch":
        challengeCode = "StandardChallenge";
        break;
    default:
        Spark.exit();
}

var createChallengeRequest = new SparkRequests.CreateChallengeRequest();
createChallengeRequest.challengeShortCode = challengeCode;
createChallengeRequest.accessType = accessType;
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
createChallengeRequest.endTime = tomorrow.toISOString();
        
createChallengeRequest.usersToChallenge = [];
var participants = matchData.participants;
var numberOfPlayers = participants.length;
for (var i = 1; i < numberOfPlayers; i++) {
    createChallengeRequest.usersToChallenge.push(participants[i].id)
}
createChallengeRequest.Send();