const TcpClient = require('tcp-framework').Client;
const Message = require('tcp-framework').Message;
const assert = require('assert');

module.exports = class extends TcpClient {
    onMessage(incomingMessage) {
    	try {
    		const {event, params} = JSON.parse(incomingMessage.payload.toString('utf8'));
    		this.onEvent(event, params);
    	}
    	catch(err) {
			
    	}
    }

    onEvent(event, params) {
    }
};
