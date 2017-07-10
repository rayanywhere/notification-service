const TcpServer = require('tcp-framework').Server;
const Message = require('tcp-framework').Message;
const log4js = require('log4js');
const assert = require('assert');

module.exports = class extends TcpServer {
	constructor(options, subscriberServer) {
		super(options);
		this._subscriberServer = subscriberServer;
        this._logger = log4js.getLogger('publisher');
	}

    onStarted() {
		this._logger.info(`publisher server started at ${this._options.host}:${this._options.port}`);
	}

	onStopped() {
		this._logger.info(`publisher server stopped at ${this._options.host}:${this._options.port}`);
	}

	onConnected(socket) {
		this._logger.info(`publisher client(${socket.remoteAddress}:${socket.remotePort}) connected`);
	}

	onClosed(socket) {
		this._logger.info(`publisher client(${socket.remoteAddress}:${socket.remotePort}) closed`);
	}

	onError(socket, err) {
		this._logger.info(`publisher error occurred at client(${socket.remoteAddress}:${socket.remotePort}): ${err.stack}`);
	}

    onMessage(socket, incomingMessage) {
    	try {
    		const {event, params} = JSON.parse(incomingMessage.payload.toString('utf8'));
    		assert(event !== undefined, 'missing event in publish package');
    		this._logger.debug(`broadcasting event[${event}] with params=${JSON.stringify(params)}`);
    		this._subscriberServer.broadcast(event, params);
    	}
    	catch(err) {
    		this._logger.error(err);
    	}
	}
}
