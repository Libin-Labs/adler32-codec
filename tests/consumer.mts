import { adler32 } from '@lp-labs/adler32-codec';
if (adler32(new Uint8Array([1])) !== 0x00020002) throw new Error('Checksum');
// @ts-expect-error invalid argument must be rejected by declarations
adler32([1]);
