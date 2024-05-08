const mqtt = require('mqtt');
const {
    THINGSBOARD_FEEDS,
    THINGSBOARD_KEY,
    THINGSBOARD_IO_USERNAME,
} = require('../config/thingsboard');
const Publisher = require('./publisher');

class MqttClient extends Publisher {
    constructor() {
        super();
        let options = {
        host: 'demo.thingsboard.io', //TODO: connect to live thingsboard
        port: '1883',
        protocol: 'mqtt',
        username: THINGSBOARD_IO_USERNAME,
        password: THINGSBOARD_KEY,
        };

        this.client = mqtt.connect(options);

        this.client.on('connect', () => console.log('Connected'));
        this.client.on('error', (err) => console.log(err));

        this.receiveMessage();
    }

    subscribeTopic(topic) {
        this.client.subscribe(THINGSBOARD_FEEDS + topic, (err) => {
            if (err) console.log(err);
        });
    }

    receiveMessage() {
        this.client.on('message', (topic, message) => {
            console.log('Received message:', topic, message.toString());
            this.notify(message.toString());
        });
    }

    sendMessage(topic, message) {
        this.client.publish(topic, message);
    }
}

module.exports = MqttClient;
