import { Configuration, DefaultApi } from '@baf-wallet/api-client';
import { constants } from './constants';

export const apiClient = new DefaultApi(
  new Configuration({
    basePath: constants.basePathApi,
  })
);
