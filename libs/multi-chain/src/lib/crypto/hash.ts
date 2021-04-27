import * as sha3 from 'js-sha3';
import { sha256 as js_sha256 } from 'js-sha256';

export function keccak256(msg: Buffer): Buffer {
  return Buffer.from(sha3.keccak256(msg), 'hex');
}

export function sha256(msg: Buffer): Buffer {
    return Buffer.from(js_sha256(msg), 'hex');
}

// add more wrappers here as needed
