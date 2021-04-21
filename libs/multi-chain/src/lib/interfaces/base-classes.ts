import { ChainName, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import { ec  } from 'elliptic';
import * as sha3 from 'js-sha3';
import * as nacl from 'tweetnacl';

const ecSecp = new ec('secp256k1');
export abstract class Signer<SendOpts, TX> {
  constructor(public chain: ChainName) {}

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
  constructor(public chain: ChainName) {}

  public static verifySignedEd25519(
    pubkey: PublicKey,
    msg: string,
    signedMsg: string
  ): boolean {
    const msgHash = sha3.keccak256(msg);
    return nacl.sign.detached.verify(
      new Uint8Array(Buffer.from(msgHash, 'hex')),
      new Uint8Array(Buffer.from(signedMsg, 'hex')),
      new Uint8Array(pubkey)
    );
  }

  public static signEd25519(sk: SecretKey, msg: string): string {
    const msgHash = sha3.keccak256(msg);
    const sig = nacl.sign.detached(
      new Uint8Array(Buffer.from(msgHash, 'hex')),
      new Uint8Array(sk)
    )
    return Buffer.from(sig).toString('hex');
  }

  public static verifySignedSecp256k1(
    pubkey: PublicKey,
    msg: string,
    signedMsg: string
  ): boolean {
    const msgHash = Buffer.from(sha3.keccak256(msg), 'hex');
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
