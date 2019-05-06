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
})