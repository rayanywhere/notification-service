const TcpClient = require('tcp-framework').Client;
const Message = require('tcp-framework').Message;
const assert = require('assert');

module.exports = class extends TcpClient {

    constructor(config, events) {
        super(config);
        this.events = events;
    }

    onConnected() {
        this.send(new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify(this.events), 'utf8')));
    }

    onMessage(incomingMessage) {
        try {
            const {event, params} = JSON.parse(incomingMessage.payload.toString('utf8'));
            this.onEvent(event, params);
        }
        catch (err) {

        }
    }

    onEvent(event, params) {
    }
};
