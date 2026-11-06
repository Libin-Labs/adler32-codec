function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
function bytes(v: Uint8Array): void {
  if (!(v instanceof Uint8Array)) throw new TypeError('Expected Uint8Array');
  if (v.length > 1048576) throw new RangeError('Byte budget exceeded');
}
export function adler32(input: Uint8Array, seed = 1): number {
  bytes(input);
  integer(seed, 0, 4294967295);
  let a = seed & 65535,
    b = seed >>> 16;
  if (a >= 65521 || b >= 65521) throw new RangeError('Noncanonical Adler seed');
  for (const v of input) {
    a = (a + v) % 65521;
    b = (b + a) % 65521;
  }
  return (b * 65536 + a) >>> 0;
}
