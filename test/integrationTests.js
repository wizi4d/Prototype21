var expect = require("chai").expect;
var GameClientModule = require("../src/gameClient");

describe("Integration test", function () {
    this.timeout(0);

    it("should connect client to server", async function () {
        var gameClient = new GameClientModule.GameClient();
        expect(gameClient.connected()).is.false;

        await gameClient.connect();

        expect(gameClient.connected()).is.true;
    });

    it("should auth two anonymous players", async function () {
        var gameClient1 = new GameClientModule.GameClient();
        expect(gameClient1.playerId).is.undefined;
        var gameClient2 = new GameClientModule.GameClient();
        expect(gameClient2.playerId).is.undefined;

        await gameClient1.connect();
        await gameClient1.authWithCustomId("111");

        expect(gameClient1.playerId).is.equals("5b5f5614031f5bc44d59b6a9");

        await gameClient2.connect();
        await gameClient2.authWithCustomId("222");

        expect(gameClient2.playerId).is.equals("5b5f6ddb031f5bc44d59b741");
    });
})