var challangeData = Spark.getData();
var acceptChallengeRequest = new SparkRequests.AcceptChallengeRequest();
acceptChallengeRequest.challengeInstanceId = challangeData.challenge.challengeId;
acceptChallengeRequest.message = "Joining";
acceptChallengeRequest.SendAs(Spark.getPlayer().getPlayerId());