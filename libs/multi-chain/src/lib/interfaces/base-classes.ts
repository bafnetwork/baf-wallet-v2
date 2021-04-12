import { Chain, PublicKey } from '@baf-wallet/interfaces';
import { ec, eddsa } from 'elliptic';
import * as sha3 from 'js-sha3';
import { inspect } from 'util';
const ecSecp = new ec('secp256k1');
const ecEd = new eddsa('ed25519');

export class Serializer{
  constructor(private types){}
  serialize(object) {
      let idx = this.types.findIndex((e)=> {return e.name == object.constructor.name});
      if (idx == -1) throw "type  '" + object.constructor.name + "' not initialized";
      return JSON.stringify([idx, Object.entries(object)]);
  }
  deserialize(jstring) {
      let array = JSON.parse(jstring);
      let object = new this.types[array[0]]();
      array[1].map(e=>{object[e[0]] = e[1];});
      return object;
  }
}
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

  // abstract static serializeSendTXOpts<SendOpts>(opts: SendOpts): string {
  //   // const stringified = JSON.stringify(inspect(opts, { showHidden: true, depth: null }))
  //   console.log((opts as any).actions[0].transfer)
  //   const stringified  = new Serializer([NearSendTxOpts]);
  //   console.log(stringified);
  //   return encodeURIComponent(stringified);
  // }
}

export abstract class ChainUtil {
  constructor(public chain: Chain) {}

  public static verifySignedEd25519(
    pubkey: PublicKey,
    msg: string,
    signedMsg: eddsa.Signature
  ): boolean {
    const msgHash = sha3.keccak256(msg);

    let validSig = ecEd.verify(
      msgHash,
      signedMsg,
      Buffer.from(pubkey).toString('hex')
    );
    return validSig;
  }

  public static verifySignedSecp256k1(
    pubkey: PublicKey,
    msg: string,
    signedMsg: ec.Signature
  ): boolean {
    const msgHash = sha3.keccak256(msg);

    let validSig = ecSecp.verify(msgHash, signedMsg, Buffer.from(pubkey));
    return validSig;
  }

  public static createUserVerifyMessage(userId: string, nonce: string) {
    return `${userId}:${nonce}`;
  }
}
