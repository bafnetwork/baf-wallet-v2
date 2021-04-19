import { Account, Contract } from 'near-api-js';
import ContractConfig from '../../config.json'

async function buildContract(account: Account): Promise<Contract> {
  const contract = new Contract(account, ContractConfig.contractName, {
    viewMethods: []
  });
  return contract
}
