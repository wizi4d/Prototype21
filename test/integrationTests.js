var expect = require("chai").expect;
var GameClientModule = require("../src/gameClient");

describe("Integration test", function () {
    this.timeout(0);

    var playerCustomIds = {
        id1: "111",
        id2: "222"
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
})