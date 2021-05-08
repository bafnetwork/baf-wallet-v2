<script lang="ts">
  import {
    Balance,
    Chain,
    ChainContractTokenConstant,
    SupportedTransferTypes,
  } from '@baf-wallet/interfaces';
  import {
    getTokenLogoUrl,
    TokenInfo,
    getTokenInfo,
  } from '@baf-wallet/chain-info';
  import { constants } from '../config/constants';
  import AmountFormatter from '@baf-wallet/base-components/AmountFormatter.svelte';
  import { ChainStores } from '../state/chains.svelte';
  import Button from '@smui/button';
  import { getContext } from 'svelte';
  import SendModal from './SendModal.svelte';
  const { open } = getContext('modal');

  function openSendModal(
    chain: Chain,
    tokenInfo: TokenInfo,
    transferType: SupportedTransferTypes,
    opts?: {
      contractAddress: string;
    }
  ) {
    open(SendModal, { chain, transferType, tokenInfo, ...(opts || {}) });
  }

  async function getContractTokenInfo(
    chain: Chain,
    contract: ChainContractTokenConstant,
    balance: Balance
  ): Promise<ContractTokenInfo | null> {
    const tokenInfo = await getTokenInfo(chain, contract.contractAddress);
    if (balance === '0' || !balance) {
      return null;
    }
    return {
      tokenInfo,
      address: contract.contractAddress,
      balance,
    };
  }

  interface ContractTokenInfo {
    tokenInfo: TokenInfo;
    address: string;
    balance: Balance;
  }

  interface ChainBalance {
    chain: Chain;
    chainTokenInfo: TokenInfo;
    balance: Balance;
    contractTokens: (ContractTokenInfo | null)[];
  }

  async function initChainBalances(): Promise<ChainBalance[]> {
    const balanceProms: Promise<ChainBalance>[] = Object.keys($ChainStores).map(
      async (chain: Chain) => {
        const chainInfo = $ChainStores[chain];
        const chainTokenInfo = await getTokenInfo(chain);
        return {
          chain,
          chainTokenInfo,
          balance: await chainInfo.accounts
            .getGenericMasterAccount()
            .getBalance(),
          contractTokens: await Promise.all(
            chainInfo
              .getConstants(constants.env)
              .tokens.map(async (contract) =>
                getContractTokenInfo(
                  chain,
                  contract,
                  await chainInfo.accounts
                    .getGenericMasterAccount()
                    .getContractTokenBalance(contract.contractAddress)
                )
              )
          ),
        };
      }
    );
    return Promise.all(balanceProms);
  }
</script>

<div class="wrapper">
  <th />
  <th>Chain</th>
  <th>Balance</th>
  <th>Actions</th>
  {#await initChainBalances() then chains}
    {#each chains as chain, i}
      <img
        src={getTokenLogoUrl(chain.chain)}
        alt={`${chain.chainTokenInfo.name}.png`}
      />
      <div>
        {chain.chainTokenInfo.name}
      </div>
      <div>
        <AmountFormatter
          chain={chain.chain}
          bal={chain.balance}
          isNativeToken={true}
          tokenInfo={chain.chainTokenInfo}
        />
      </div>
      <Button
        on:click={() =>
          openSendModal(
            chain.chain,
            chain.chainTokenInfo,
            SupportedTransferTypes.NativeToken
          )}>Transfer</Button
      >
      {#each chain.contractTokens.filter((tok) => tok !== null) as contractToken}
        <img
          src={getTokenLogoUrl(chain.chain, contractToken.address)}
          alt={`${contractToken.tokenInfo.name}.png`}
        />
        <div>
          {chain.chainTokenInfo.name}
        </div>
        <div>
          <AmountFormatter
            chain={chain.chain}
            bal={contractToken.balance}
            tokenInfo={contractToken.tokenInfo}
            isNativeToken={false}
          />
        </div>
        <Button
          on:click={() =>
            openSendModal(
              chain.chain,
              contractToken.tokenInfo,
              SupportedTransferTypes.ContractToken,
              {
                contractAddress: contractToken.address,
              }
            )}>Transfer</Button
        >
      {/each}
    {/each}
  {:catch error}
    <span>An error occurred when attempting to fetch asset data: {error}</span>
  {/await}
</div>

<style>
  /* your styles go here */
  .wrapper {
    display: grid;
    gap: 1rem;
    grid-template-columns: 2rem 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
  }
  img {
    width: 100%;
  }
</style>
