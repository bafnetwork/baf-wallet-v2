import { Chain, GenericTxParams } from '@baf-wallet/interfaces';
import { deserializeData, serializeData } from '@baf-wallet/utils';

// TODO: interface check
export const deserializeTxParams = (paramsEncoded: string): GenericTxParams => {
  return deserializeData(decodeURIComponent(paramsEncoded)) as GenericTxParams;
};

export const createApproveRedirectURL = (
  chain: Chain,
  baseURL: string,
  opts: GenericTxParams
) => {
  return encodeURI(
    `${baseURL}/#/approve-redirect/${chain.toString()}/${encodeURIComponent(
      serializeData(opts)
    )}`
  );
};
