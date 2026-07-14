const chai = require('chai');
const sinon = require('sinon');

const Client = require('../src/Client');
const { Events } = require('../src/util/Constants');

const expect = chai.expect;

async function createPageConsoleListener() {
    const client = new Client({ authTimeoutMs: 100 });
    const stopAfterListenerRegistration = new Error('stop after page console listener registration');
    let evaluateCallCount = 0;
    let pageConsoleListener;

    client.setDeviceName = async () => undefined;
    client.getWWebVersion = async () => 'test-version';
    client.pupPage = {
        evaluate: async () => {
            evaluateCallCount += 1;
            if (evaluateCallCount === 1) {
                return true;
            }
            if (evaluateCallCount === 2) {
                return undefined;
            }
            throw stopAfterListenerRegistration;
        },
        on: (eventName, listener) => {
            if (eventName === 'console') {
                pageConsoleListener = listener;
            }
        },
    };

    try {
        await client.inject();
    } catch (error) {
        if (error !== stopAfterListenerRegistration) {
            throw error;
        }
    }

    expect(pageConsoleListener).to.be.a('function');
    return { client, pageConsoleListener };
}

describe('Client chrome OOM detection', function () {
    it('emits chrome_oom for blob memory exhaustion', async function () {
        const { client, pageConsoleListener } = await createPageConsoleListener();
        const callback = sinon.spy();
        client.on(Events.CHROME_OOM, callback);

        pageConsoleListener({
            text: () => 'Failed to load resource: net::ERR_BLOB_OUT_OF_MEMORY',
        });

        expect(callback.calledOnce).to.equal(true);
    });

    it('keeps emitting chrome_oom for general memory exhaustion', async function () {
        const { client, pageConsoleListener } = await createPageConsoleListener();
        const callback = sinon.spy();
        client.on(Events.CHROME_OOM, callback);

        pageConsoleListener({
            text: () => 'Failed to load resource: net::ERR_OUT_OF_MEMORY',
        });

        expect(callback.calledOnce).to.equal(true);
    });

    it('does not emit chrome_oom for an unrelated page log', async function () {
        const { client, pageConsoleListener } = await createPageConsoleListener();
        const callback = sinon.spy();
        client.on(Events.CHROME_OOM, callback);

        pageConsoleListener({
            text: () => 'Failed to load resource: net::ERR_NAME_NOT_RESOLVED',
        });

        expect(callback.called).to.equal(false);
    });
});
