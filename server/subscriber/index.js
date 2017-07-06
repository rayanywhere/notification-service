const TcpServer = require('tcp-framework').Server;
const Message = require('tcp-framework').Message;
const log4js = require('log4js');
const assert = require('assert');

module.exports = class extends TcpServer {
	constructor(options) {
		super(options);
		this._subscribers = new Set();
        this._logger = log4js.getLogger('subscriber');
	}

    onStarted() {
		this._logger.info(`subscriber server started at ${this._options.host}:${this._options.port}`);
	}

	onStopped() {
		this._logger.info(`subscriber server stopped at ${this._options.host}:${this._options.port}`);
	}

	onConnected(socket) {
		this._subscribers.add(socket);
		this._logger.info(`subscriber client(${socket.remoteAddress}:${socket.remotePort}) connected`);
	}

	onClosed(socket) {
		this._subscribers.delete(socket);
		this._logger.info(`subscriber client(${socket.remoteAddress}:${socket.remotePort}) closed`);
	}

	onError(socket, err) {
		this._logger.info(`subscriber error occurred at client(${socket.remoteAddress}:${socket.remotePort}): ${err.stack}`);
	}

	broadcast(event, params) {
		this._logger.info('prepare to broadcast event ' + event);
		for (let socket of this._subscribers) {
			this._logger.info(`broadcast to subscriber ${socket.remoteAddress}:${socket.remotePort}`);
			this.send(socket, new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({event, params}), 'utf8')));
		}
	}
}
