<script lang="ts">
  import {
    Balance,
    Chain,
    ChainBalance,
    AccountContractTokenBalFn,
    ChainContractTokenConstant,
  } from '@baf-wallet/interfaces';
  import {
    getTokenLogoUrl,
    TokenInfo,
    getTokenInfo,
  } from '@baf-wallet/trust-wallet-assets';
  import { constants } from '../config/constants';
  import AmountFormatter from '@baf-wallet/base-components/AmountFormatter.svelte';
  import { ChainStores } from '../state/chains.svelte';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import { getContext } from 'svelte';
  import SendModal from './SendModal.svelte';
  const { open } = getContext('modal');

  function openSendModal(chain: Chain) {
    open(SendModal, { chain });
  }

  async function getContractTokenInfo(
    chain: Chain,
    contract: ChainContractTokenConstant,
    getContractTokenBalance: AccountContractTokenBalFn
  ) {
    const tokenInfo = await getTokenInfo(chain, contract.contractAddress);
    return {
      tokenInfo,
      address: contract.contractAddress,
      balance: await getContractTokenBalance(contract.contractAddress),
    };
  }

  interface ChainBalance {
    chain: Chain;
    chainTokenInfo: TokenInfo;
    balance: Balance;
    contractTokens: {
      tokenInfo: TokenInfo;
      address: string;
      balance: Balance;
    }[];
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
              .tokens.map((contract) =>
                getContractTokenInfo(
                  chain,
                  contract,
                  chainInfo.accounts.getGenericMasterAccount()
                    .getContractTokenBalance
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
  <th>Asset</th>
  <th>Balance</th>
  <th>Actions</th>
  {#await initChainBalances() then chains}
    {#each chains as chain, i}
      <img
        src={getTokenLogoUrl(chain.chain)}
        alt={`${chain.chainTokenInfo.name}.png`}
      />
      <div>
        {`${chain.chainTokenInfo.symbol}`}
      </div>
      <div>
        <AmountFormatter chain={chain.chain} bal={chain.balance} />
      </div>
      <Button onClick={() => openSendModal(chain.chain)}>Transfer</Button>
      {#each chain.contractTokens as contractToken}
        <img
          src={getTokenLogoUrl(chain.chain, contractToken.address)}
          alt={`${contractToken.tokenInfo.name}.png`}
        />
        <div>
          {`${contractToken.tokenInfo.symbol}`}
        </div>
        <div>
          <!-- TODO: amount formatter that can also take an option for number of decimals -->
          <!-- <AmountFormatter chain={chain.chain} bal={chain.balance} /> -->
        </div>
        <!-- <Button onClick={() => openSendModal(chain.chain)}>Transfer</Button> -->
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

<!-- TODO:s
 1. Amount formatter,
 2. Return the actual balance for an account
 3. Have the Transfer of tokens actually work
-->