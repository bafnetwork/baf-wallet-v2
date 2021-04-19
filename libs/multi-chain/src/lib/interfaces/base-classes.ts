import { Chain, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import { ec, eddsa } from 'elliptic';
import * as sha3 from 'js-sha3';
import { formatKey } from '../utils';

const ecSecp = new ec('secp256k1');
const ecEd = new eddsa('ed25519');

export abstract class Signer<SendOpts, TX> {
  constructor(public chain: Chain) {}

  abstract awaitConstructorInit(): Promise<void>;

  // Return an explorer link
  abstract createTX(signedTX: SendOpts): Promise<TX>;

  // Return an explorer link
  abstract signTX(tx: TX): Promise<Uint8Array>;

  // Return an explorer link
  abstract sendTX(signedTX: Uint8Array): Promise<string>;

  public static deserializeSendTXOpts<SendOpts>(opts: string): SendOpts {
    try {
      return (JSON.parse(decodeURIComponent(opts)) as any) as SendOpts;
    } catch (e) {
      throw `Error deserializing ${opts}: ${e}`;
    }
  }

  static serializeSendTXOpts<SendOpts>(opts: SendOpts): string {
    return encodeURIComponent(JSON.stringify(opts));
  }
}

export abstract class ChainUtil {
  constructor(public chain: Chain) {}

  public static verifySignedEd25519(
    pubkey: PublicKey,
    msg: string,
    signedMsg: string
  ): boolean {
    const msgHash = sha3.keccak256(msg);

    let validSig = ecEd.verify(
      msgHash,
      signedMsg,
      Buffer.from(pubkey).toString('hex')
    );
    return validSig;
  }

  public static signEd25519(sk: SecretKey, msg: string): eddsa.Signature {
    const msgHash = sha3.keccak256(msg);
    const sig = ecEd.sign(msgHash, Buffer.from(sk).toString('hex'));
    return sig;
  }

  public static verifySignedSecp256k1(
    pubkey: PublicKey,
    msg: string,
    signedMsg: string
  ): boolean {
    const msgHash = sha3.keccak256(msg);
    let validSig = ecSecp.verify(
      msgHash,
      Buffer.from(signedMsg, 'hex'),
      pubkey
    );
    return validSig;
  }

  public static signSecp256k1(sk: SecretKey, msg: string): ec.Signature {
    const msgHash = sha3.keccak256(msg);
    const sig = ecSecp.sign(msgHash, sk, 'hex', {
      canonical: true,
    });
    return sig;
  }

  public static createUserVerifyMessage(userId: string, nonce: string) {
    return `${userId}:${nonce}`;
  }
}
