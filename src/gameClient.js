var GameSparks = require("../gamesparks-javascript-sdk-2018-04-18/gamesparks");
var config = new require("./config.json");

exports.GameClient = function () {
    var gamesparks = new GameSparks();

    this.playerId = undefined;

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

    function onMessage(message) {
        console.log("GAME onMessage: " + JSON.stringify(message));
    }

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
}