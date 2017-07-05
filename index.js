module.exports = {
	Server: {
		Subscriber: require('./server/subscriber'),
		Publisher: require('./server/publisher')
	},
	Client: {
		Subscriber: require('./client/subscriber'),
		Publisher: require('./client/publisher')
	}
};