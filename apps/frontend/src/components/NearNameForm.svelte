<script lang="ts">
    import Paper, { Title, Subtitle, Content } from '@smui/paper';
    import TextField from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text/index';
    import { getChainInterface } from '@baf-wallet/multi-chain';
    import { NearChainInterface } from '@baf-wallet/near';
    import { Chain, jsonRpcResultOk } from '@baf-wallet/interfaces';

    const near = getChainInterface<NearChainInterface>(Chain.NEAR);

    enum NameStatus {
        OK,
        INVALID,
        TAKEN
    };

    let name: string;
    let nameStatus: NameStatus;
    $: invalid = nameStatus !== NameStatus.OK;
    $: fullName = `${name}.testnet`;

    async function updateNameStatus() {
        if (!/^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/.test(fullName)) {
            nameStatus = NameStatus.INVALID;
        }

        const res = await near.rpc.other.viewAccount('testnet', name);
        if (jsonRpcResultOk(res)) {
            nameStatus = NameStatus.TAKEN;
        }
    }

</script>

<Paper>
    <Title>Welcome to BAF Wallet!</Title>
    <Subtitle>Please choose a username to get started</Subtitle>
    <Content>
        <TextField type="text" bind:value={name} bind:invalid label="Username" on:change={updateNameStatus}>
            <HelperText validationMsg slot="helper">
                {#if nameStatus === NameStatus.INVALID}
                    Usernames must be 2-64 lowercase alphanumeric characters separated by either '_' or '-'
                {:else if nameStatus === NameStatus.TAKEN}
                    That name is already taken. Please choose another.
                {:else}
                    An error has occurred.
                {/if}
            </HelperText>
        </TextField>
    </Content>
</Paper>

