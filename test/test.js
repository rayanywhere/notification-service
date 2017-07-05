const PublisherClient = require('../client/publisher');
const SubscriberClient = require('../client/subscriber');
const assert = require('assert');

describe('#notification-service', function() {
    before(function() {
        global.publisherClient = new PublisherClient({host:'localhost', port:2001});
        global.subscriberClient = new SubscriberClient({host:'localhost', port:2000});
    });

    describe("testing subscriber", function() {
    	it("should return without error", function(done) {
        	subscriberClient.subscribe(["Hello"]);
        	setTimeout(() => { done(); }, 1000);
        });
    })

    describe("testing publisher", function() {
        it("should return without error", function(done) {
        	publisherClient.publish("Hello", {go:"go", f:"f"});
        	setTimeout(() => { done(); }, 1000);
        });
    });
});