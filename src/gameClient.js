var GameSparks = require("../gamesparks-javascript-sdk-2018-04-18/gamesparks");
var config = new require("./config.json");

exports.GameClientStates = {
    IDLE: "Idle",
    MATCHMAKING: "Matchmaking",
    CHALLENGE: "Challenge"
}

exports.GameClient = function () {
    var gamesparks = new GameSparks();

    this.state = exports.GameClientStates.IDLE;
    this.playerId = undefined;
    this.challenge = undefined;

    this.connected = () => (gamesparks.connected === true);

    this.connect = function () {
        return new Promise(function (resolve, reject) {
            gamesparks.initPreview({
                key: config.gameApiKey,
                secret: config.credentialSecret,
                credential: config.credential,
                onInit: () => resolve(),
                onMessage: onMessage,
                onError: (error) => reject(error),
                logger: console.log
            });
        });
    }

    this.disconnect = function () {
        clearInterval(gamesparks.keepAliveInterval);
        gamesparks.disconnect();
    }

    function onMessage(message) {
        switch (message["@class"]) {
            case ".MatchNotFoundMessage":
                this.state = exports.GameClientStates.IDLE;
                break;
            case ".ChallengeStartedMessage":
                this.state = exports.GameClientStates.CHALLENGE;
                this.challenge = message.challenge;
                break;
            default:
                console.log("GAME onMessage: " + JSON.stringify(message));
        }
    }
    onMessage = onMessage.bind(this);

    this.authWithCustomId = function (customId) {
        return new Promise(resolve => {
            var requestData = {
                "deviceId": customId
                , "deviceOS": "NodeJS"
            }
            sendRequest("DeviceAuthenticationRequest", requestData)
                .then(response => {
                    if (response.userId) {
                        this.playerId = response.userId;
                        resolve();
                    } else {
                        reject(new Error(response));
                    }
                })
                .catch(error => { console.error(error); });
        });
    }

    function sendRequest(requestType, requestData) {
        return new Promise(function (resolve) {
            gamesparks.sendWithData(requestType, requestData, (response) => resolve(response));
        });
    }

    this.connectAsAnonymous = function (customId) {
        return this.connect()
            .then(() => this.authWithCustomId(customId));
    }

    this.findStandardMatch = function () {
        var eventData = { eventKey: "FindStandardMatch" }
        return new Promise(resolve => {
            sendRequest("LogEventRequest", eventData)
                .then(response => {
                    if (!response.error) {
                        this.state = exports.GameClientStates.MATCHMAKING;
                        resolve();
                    } else {
                        console.error(response.error);
                        reject(new Error(response));
                    }
                })
                .catch(error => {
                    console.error(error);
                    reject(new Error(error));
                });
        });
    }
}