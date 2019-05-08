var expect = require("chai").expect;
var GameClientModule = require("../src/gameClient");

var sleep = function (ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

describe("Integration test", function () {
    this.timeout(0);

    var playerCustomIds = {
        id1: "111",
        id2: "222",
        id3: "333"
    }

    var allClients = [];

    function newGameClient() {
        var newClient = new GameClientModule.GameClient();
        allClients.push(newClient);
        return newClient;
    }

    afterEach(function () {
        for (let i = 0; i < allClients.length; i++) {
            allClients[i].disconnect();
        }
        allClients = [];
    });

    it("should connect client to server", async function () {
        var gameClient = newGameClient();
        expect(gameClient.connected()).is.false;

        await gameClient.connect();

        expect(gameClient.connected()).is.true;
    });

    it("should auth two anonymous players", async function () {
        var gameClient1 = newGameClient();
        expect(gameClient1.playerId).is.undefined;
        var gameClient2 = newGameClient();
        expect(gameClient2.playerId).is.undefined;

        await gameClient1.connectAsAnonymous(playerCustomIds.id1);

        expect(gameClient1.playerId).is.equals("5b5f5614031f5bc44d59b6a9");

        await gameClient2.connectAsAnonymous(playerCustomIds.id2);

        expect(gameClient2.playerId).is.equals("5b5f6ddb031f5bc44d59b741");
    });

    it("should find match", async function () {
        var gameClient1 = newGameClient();
        var gameClient2 = newGameClient();
        var gameClient3 = newGameClient();

        await gameClient1.connectAsAnonymous(playerCustomIds.id1);
        await gameClient2.connectAsAnonymous(playerCustomIds.id2);
        await gameClient3.connectAsAnonymous(playerCustomIds.id3);

        await gameClient1.findStandardMatch();
        expect(gameClient1.state).is.equals(GameClientModule.GameClientStates.MATCHMAKING);
        await gameClient2.findStandardMatch();
        expect(gameClient2.state).is.equals(GameClientModule.GameClientStates.MATCHMAKING);
        await gameClient3.findStandardMatch();
        expect(gameClient3.state).is.equals(GameClientModule.GameClientStates.MATCHMAKING);

        await sleep(3000);

        expect(gameClient1.state).is.equals(GameClientModule.GameClientStates.CHALLENGE);
        expect(gameClient1.challenge, "challenge").is.not.undefined;
        expect(gameClient1.challenge.challengeId).is.not.undefined;

        expect(gameClient2.state).is.equals(GameClientModule.GameClientStates.CHALLENGE);
        expect(gameClient2.challenge.challengeId).is.equals(gameClient1.challenge.challengeId);

        expect(gameClient3.state).is.equals(GameClientModule.GameClientStates.CHALLENGE);
        expect(gameClient3.challenge.challengeId).is.equals(gameClient1.challenge.challengeId);
    });
})