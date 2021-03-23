<script lang="ts">
    import Modal from "./base/Modal.svelte";
    import Card from "./base/Card.svelte";
    import SendForm from "./SendForm.svelte";
    export let visible: boolean = false;

    const postSubmitHook = () => {
        visible = false;
    }

    const onCancel = () => {
        visible = false;
    }
</script>

<Modal bind:visible={visible}>
    <Card classExtra="w-1/4 flex flex-col">
        <h1 class="pb-5 text-3xl">Send</h1>
        <SendForm {postSubmitHook} {onCancel}/>
    </Card>
</Modal>
