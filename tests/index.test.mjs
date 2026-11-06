import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('standard Wikipedia fixture', () => {
  assert.equal(api.adler32(new TextEncoder().encode('Wikipedia')), 0x11e60398);
});
test('empty initial', () => {
  assert.equal(api.adler32(new Uint8Array()), 1);
});
test('chunk continuation', () => {
  const v = new TextEncoder().encode('A streaming checksum');
  assert.equal(api.adler32(v), api.adler32(v.subarray(4), api.adler32(v.subarray(0, 4))));
});
test('independent sums', () => {
  for (let n = 0; n < 100; n++) {
    const v = Uint8Array.from({ length: n }, (_, i) => (i * 17) % 256);
    let a = 1,
      b = 0;
    for (const x of v) {
      a += x;
      b += a;
    }
    assert.equal(api.adler32(v), ((b % 65521) * 65536 + (a % 65521)) >>> 0);
  }
});
test('seed validation', () => {
  assert.throws(() => api.adler32(new Uint8Array(), 65535));
  assert.throws(() => api.adler32(new Uint8Array(), -1));
});
test('byte and size bounds', () => {
  assert.throws(() => api.adler32([]));
  assert.throws(() => api.adler32(new Uint8Array(1048577)));
});
