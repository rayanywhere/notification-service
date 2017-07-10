const opts = require('opts');

module.exports = () => {
	const opt = [
        {
            long: 'publisher-host',
            description: 'publisher host to listen',
            value: true,
            required: false
        },
        {
            long: 'publisher-port',
            description: 'publisher port to listen',
            value: true,
            required: true
        },
        {
            long: 'subscriber-host',
            description: 'subscriber host to listen',
            value: true,
            required: false
        },
        {
            long: 'subscriber-port',
            description: 'subscriber port to listen',
            value: true,
            required: true
        },
        {
            short: 't',
            long: 'timeout',
            description: 'timeout for requests',
            value: true,
            required: false
        },
        {
            short: 'd',
            long: 'duration',
            description: 'second(s) of serving time, shutdown service afterward',
            value: true,
            required: false
        },
        {
            short: 'l',
            long: 'log',
            description: 'log directory',
            value: true,
            required: false
        }
    ];
    opts.parse(opt, [], true);

    return {
        subscriberHost: (opts.get('subscriber-host') === undefined) ? 'localhost' : opts.get('subscriber-host'),
        subscriberPort: parseInt(opts.get('subscriber-port')),
        publisherHost: (opts.get('publisher-host') === undefined) ? 'localhost' : opts.get('publisher-host'),
        publisherPort: parseInt(opts.get('publisher-port')),
        timeout: (typeof opts.get('timeout') === 'undefined') ? 3 : parseInt(opts.get('timeout')),
        duration: (typeof opts.get('duration') === 'undefined') ? undefined : parseInt(opts.get('duration')),
        log: (typeof opts.get('log') === 'undefined') ? './logs/' : opts.get('log')
    };
};