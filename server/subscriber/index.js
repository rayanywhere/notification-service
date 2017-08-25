const TcpServer = require('tcp-framework').Server;
const Message = require('tcp-framework').Message;
const log4js = require('log4js');
const assert = require('assert');
const SocketManage = require('../lib/socket_manage');

module.exports = class extends TcpServer {
    constructor(options) {
        super(options);
        this._logger = log4js.getLogger('subscriber');
        this.socketManage = new SocketManage();
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
        this.socketManage.clean(socket);
        this._logger.info(`subscriber client(${socket.remoteAddress}:${socket.remotePort}) closed`);
    }

    onError(socket, err) {
        this._logger.info(`subscriber error occurred at client(${socket.remoteAddress}:${socket.remotePort}): ${err.stack}`);
    }

    onMessage(socket, incomingMessage) {
        try {
            let selectEvent = [...new Set(JSON.parse(incomingMessage.payload.toString('utf8')))];
            this._logger.debug(`subscriber client(${socket.remoteAddress}:${socket.remotePort} select events[${selectEvent}]`);
            this.socketManage.listen(socket, selectEvent);
        }
        catch (err) {
            this._logger.error(err);
        }
    }

    broadcast(event, params) {
        if (this.socketManage.whoListenedThisEvent(event)) {
            for (let socket of this.socketManage.whoListenedThisEvent(event)) {
                this._logger.debug(`sending event[${event}] to subscriber ${socket.remoteAddress}:${socket.remotePort}`);
                this.send(socket, new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({event, params}), 'utf8')));
            }
        }
    }
};


