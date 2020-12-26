<template>
    <div id="app">
        <!--显示我们的内容-->
        <div class="content-title-box" v-text="$route.name"></div>
        <div class="content-container-box">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    //调试
    // export default {
    //     mounted() {
    //         console.log(this.$route)
    //     }
    // }
</script>

<style >
    .content-container-box{
        padding: 10px;
    }
    .content-title-box{
        margin-top:10px;
        padding: 5px;
       /*font-weight: 600;*/
    }
</style>