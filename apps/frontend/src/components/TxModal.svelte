<script lang="ts">
    import Modal from "./base/Modal.svelte";
    import Card from "./base/Card.svelte";
    export let visible: boolean = false;
    export let txLink: string | undefined;
    export let isComplete: boolean;
    export let error: any | undefined = undefined;
</script>

<Modal bind:visible={visible}>
    <Card classExtra="w-1/4 flex flex-col">
        <div class="flex flex-row justify-center py-4">
            {#if !isComplete}
                <svg width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" class="text-blue-500 fill-current">
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
</Modal>
