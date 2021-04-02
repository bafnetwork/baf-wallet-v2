// import type { NearSendTXOpts } from '@baf-wallet/multi-chain';
import { NearSigner } from '@baf-wallet/multi-chain';
import { getNearNetworkId } from '@baf-wallet/interfaces';

// const opts: NearSendTXOpts = NearSigner.deserializeSendTXOpts(optsStr);
export function createSigner(privkey, pubkey) {
  const signer = new NearSigner(
    privkey,
    NearSigner.getImplicitAccountId(pubkey),
    getNearNetworkId(0)
  );
  return signer;
}
