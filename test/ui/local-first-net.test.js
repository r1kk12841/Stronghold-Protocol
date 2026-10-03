import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { LocalFirstNet } from '../../public/js/net.js';

class FakeRemote {
  constructor() {
    this.status = 'idle';
    this.ping = null;
    this.pendingCount = 0;
    this.playerId = null;
    this.calls = [];
    this.listeners = new Map();
  }
  on(type, fn) { this.listeners.set(type, fn); }
  snapshot() { return { status: this.status, attempt: 0, retryAt: 0, ping: null, lastError: null, playerId: this.playerId }; }
  setName(name) { this.calls.push(['setName', name]); this.status = 'connecting'; }
  connect() { this.calls.push(['connect']); this.status = 'connecting'; }
  close() { this.calls.push(['close']); this.status = 'closed'; }
  request(type, fields) { this.calls.push(['request', type, fields]); return Promise.resolve({ t: 'ok' }); }
  send(type, fields) { this.calls.push(['send', type, fields]); return true; }
  retryNow() {}
  reconnectNow() {}
  probe() {}
  serverNow() { return Date.now(); }
}

describe('LocalFirstNet', () => {
  test('boot and a solo room never touch the co-op transport', async () => {
    const remote = new FakeRemote();
    const net = new LocalFirstNet(remote);
    const states = [];
    net.on('room.state', (msg) => states.push(msg));
    net.setName('Local Doctor');
    net.startLocal();
    await net.request('room.create', { mode: 'solo', difficulty: 'FUNNY' });
    assert.equal(net.status, 'local');
    assert.deepEqual(remote.calls, []);
    assert.equal(states.at(-1).mode, 'solo');
    assert.equal(states.at(-1).seats[0].name, 'Local Doctor');
  });

  test('creating or joining co-op lazily opens the server transport', async () => {
    const remote = new FakeRemote();
    const net = new LocalFirstNet(remote);
    net.setName('Online Doctor');
    await net.request('room.create', { mode: 'coop', difficulty: 'NORMAL' });
    assert.deepEqual(remote.calls[0], ['setName', 'Online Doctor']);
    assert.deepEqual(remote.calls[1], ['request', 'room.create', { mode: 'coop', difficulty: 'NORMAL' }]);
    assert.equal(net.status, 'connecting');
  });

  test('leaving a co-op room closes the server transport and returns local', async () => {
    const remote = new FakeRemote();
    const net = new LocalFirstNet(remote);
    await net.request('room.join', { code: 'ABCD' });
    await net.request('room.leave');
    assert.deepEqual(remote.calls.slice(-2), [
      ['request', 'room.leave', {}],
      ['close'],
    ]);
    assert.equal(net.status, 'local');
    assert.equal(net.remoteWanted, false);
  });
});
