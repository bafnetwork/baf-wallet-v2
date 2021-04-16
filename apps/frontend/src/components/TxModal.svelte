<script lang="ts">
    import Card from "./base/Card.svelte";
    import XButton from "./base/XButton.svelte";

    import { getContext } from 'svelte';
    const { close } = getContext('modal');

    export let txLink: string | undefined;
    export let isComplete: boolean;
    export let error: any | undefined = undefined;
</script>

<Card classExtra="w-1/4 flex flex-col relative">
    <XButton onClick={close}/>
    <div class="flex flex-row justify-center py-4">
        {#if !isComplete}
            <svg width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" class="fill-current text-lightBlue-900">
                <circle cx="12.5" cy="12.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="0s" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
                    <animate attributeName="fill-opacity"
                    begin="100ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="52.5" cy="12.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="300ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="52.5" cy="52.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="600ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="92.5" cy="12.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="800ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="92.5" cy="52.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="400ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="12.5" cy="92.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="700ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="52.5" cy="92.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="500ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
                <circle cx="92.5" cy="92.5" r="12.5">
                    <animate attributeName="fill-opacity"
                    begin="200ms" dur="1s"
                    values="1;.2;1" calcMode="linear"
                    repeatCount="indefinite" />
                </circle>
            </svg>
        {:else if error}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        {/if}
    </div>
    {#if !isComplete}
        <h1 class="pb-6 text-xl text-center">Awaiting Confirmation...</h1>
    {:else if error === undefined}
        <h1 class="pb-6 text-xl text-center">Transaction Confirmed</h1>
    {:else}
        <h1 class="pb-6 text-xl text-center">Transaction Failed</h1>
    {/if}
    
    {#if txLink !== undefined}
        <span class="text-center">Explorer: <a target="_blank" rel="noopener noreferrer" href={txLink}>{txLink}</a></span>
    {/if}
</Card>
