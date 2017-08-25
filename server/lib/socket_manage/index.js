module.exports = class {

    constructor() {
        this.events = new Map();
        this.socketEvents = new Map();
    }

    whoListenedThisEvent(event) {
        let sockets = [];
        let socketSet = this.events.get(event);
        if (socketSet) sockets = [...socketSet.keys()];
        return sockets;
    }

    listOfEventListened(socket) {
        let events = this.socketEvents.get(socket);
        if (!events) events = [];
        return events;
    }

    listen(socket, events) {
        for (let event of events) {
            let socketsSet = this.events.get(event);
            if (!socketsSet) {
                socketsSet = new Set();
                socketsSet.add(socket);
                this.events.set(event, socketsSet);
            } else {
                socketsSet.add(socket);
                this.events.set(event, socketsSet);
            }
        }
        this.socketEvents.set(socket, events);
    }

    clean(socket, event) {
        if (this.socketEvents.get(socket)) {
            this.socketEvents.get(socket).forEach(event => {
                this.events.get(event).delete(socket);
            });
            this.socketEvents.delete(socket);
        }
    }
};