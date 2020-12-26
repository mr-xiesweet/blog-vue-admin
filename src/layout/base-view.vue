<template>
    <div id="app">
        <el-container>
            <el-header id="admin-header">
                <top-header></top-header>
            </el-header>
            <el-container class="main-container">
                <el-aside id="left-list-menu-box" width="210px">
                    <left-menu ></left-menu>
                </el-aside>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    export default {
        // mounted() {
        //     //动态设置侧边菜单的高度
        //     let leftMenuBox=document.getElementById('left-list-menu-box');
        //     let adminHeader=document.getElementById('admin-header');
        //     let dy=window.innerHeight-adminHeader.offsetHeight;
        //     if (leftMenuBox) {
        //         leftMenuBox.style.height=dy+'px';
        //     }
        // }
    }
</script>

<style scoped>
    .el-header{
        background-color: dodgerblue;

        height: 46px !important;
        line-height: 46px ;
    }
    .el-aside {
        background-color: #F2F2F2;
        border-right: solid 1px #e6e6e6;
        line-height: 200px;
    }
    #left-list-menu-box .el-menu{
        border-right: none;
        background-color: #F2F2F2;
    }
    .el-main{
        padding: 0;
    }
    .main-container{
        position: absolute;
        top:46px;
        width: 100%;
        bottom: 0;
    }



</style>