<template>
	<div>
        <vfd @saveFlow="saveFlow"></vfd>
    </div>
</template>

<script>
    import vfd from 'vfd'
    
    export default {
        methods:{
            saveFlow(data){
                alert(data)
            }
        },
        components: {
            vfd
        }
    }
</script>