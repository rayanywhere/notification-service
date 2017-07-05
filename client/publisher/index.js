const TcpClient = require('tcp-framework').Client;
const Message = require('tcp-framework').Message;

module.exports = class extends TcpClient {
	publish(event, params) {
		this.send(new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({event, params}), 'utf8')));
    }
};