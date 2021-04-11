import { Chain } from '@baf-wallet/interfaces';
import { ec,  } from 'elliptic';
import * as sha3 from 'js-sha3';
const ecSecp = new ec('secp256k1');

export abstract class Signer<SendOpts> {
  constructor(public chain: Chain) {}

  abstract awaitConstructorInit(): Promise<void>;

  // Return an explorer link
  abstract sendTX(chainOpts?: SendOpts): Promise<string>;

  public static deserializeSendTXOpts<SendOpts>(opts: string): SendOpts {
    try {
      return (JSON.parse(decodeURIComponent(opts)) as any) as SendOpts;
    } catch (e) {
      throw `Error deserializing ${opts}: ${e}`;
    }
  }

  public static serializeSendTXOpts(opts: any) {
    return encodeURIComponent(JSON.stringify(opts));
  }
}

export abstract class ChainUtil {
  constructor(public chain: Chain) {}

  public static verifySignedSecp256k1(
    pubkey: Buffer,
    msg: string,
    signedMsg: ec.Signature
  ): boolean {
    const msgHash = sha3.keccak256(msg);

    let validSig = ecSecp.verify(msgHash, signedMsg, pubkey);
    return validSig;
  }

  public static createUserVerifyMessage(userId: string, nonce: string) {
    return `${userId}:${nonce}`
  }
}
