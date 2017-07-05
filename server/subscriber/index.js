const TcpServer = require('tcp-framework').Server;
const Message = require('tcp-framework').Message;
const log4js = require('log4js');
const assert = require('assert');

module.exports = class extends TcpServer {
	constructor(options) {
		super(options);
		this._eventMap = new Map();
        this._logger = log4js.getLogger('subscriber');
	}

    onStarted() {
		this._logger.info(`subscriber server started at ${this._options.host}:${this._options.port}`);
	}

	onStopped() {
		this._logger.info(`subscriber server stopped at ${this._options.host}:${this._options.port}`);
	}

	onConnected(socket) {
		this._logger.info(`subscriber client(${socket.remoteAddress}:${socket.remotePort}) connected`);
	}

	onClosed(socket) {
		for (let [event, socketSet] of this._eventMap) {
			socketSet.delete(socket);
			if (socketSet.size <= 0) {
				this._eventMap.delete(event);
			}
		}
		this._logger.info(`subscriber client(${socket.remoteAddress}:${socket.remotePort}) closed`);
	}

	onError(socket, err) {
		this._logger.info(`subscriber error occurred at client(${socket.remoteAddress}:${socket.remotePort}): ${err.stack}`);
	}

    onMessage(socket, incomingMessage) {
    	try {
    		const {events} = JSON.parse(incomingMessage.payload.toString('utf8'));
    		assert(events instanceof Array, 'missing event in subscribe package');
    		events.forEach((event) => {
    			if (!this._eventMap.has(event)) {
	    			this._eventMap.set(event, new Set());
	    		}
	    		this._eventMap.get(event).add(socket);
    		});
    	}
    	catch(err) {
    		this._logger.error(err);
    	}
	}

	broadcast(event, params) {
		this._logger.info('prepare to broadcast event ' + event);
		if (!this._eventMap.has(event)) {
			return;
		}

		for (let socket of this._eventMap.get(event)) {
			this._logger.info('send to socket ' + socket.remotePort);
			this.send(socket, new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({event, params}), 'utf8')));
		}
	}
}
