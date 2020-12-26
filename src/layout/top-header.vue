<template>
    <div class="header-part clearfit">
        <!--显示内容--->
        <div class="header-left-box float-left">
            <div class="header-logo">博客系统管理中心</div>
        </div>
        <div class="header-right-box float-right">
            <div class="header-user-info clearfit">
                <div class="header-user-avatar float-left ">
                    <img :src="avatar">
                </div>
                <div class="header-user-username float-right">
                    <el-dropdown  @command="handleCommand">
                          <span class="el-dropdown-link">
                             {{userName}}
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link style="text-decoration: none" to="/setting/info" > 个人信息</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from '../api/api'
    export default {
        data(){
            return{
                userName:'未知',
                avatar:''
            }
        },
        methods:{
            handleCommand(command){
                if(command==='logout'){
                    api.logout().then(result=>{
                        if(result.code===20000){
                            this.$message({
                                message:result.message,
                                center:true,
                                type:'success'
                            })

                        }
                    })
                    this.$router.push({
                        path:'/login'
                    })
                }

            }
        },
        mounted() {
            this.userName=window.localStorage.getItem('userName')
            this.avatar=window.localStorage.getItem('avatar')
        }
    }
</script>

<style scoped>
    .header-user-avatar img{
        width: 36px;
        height: 36px;
        border-radius: 50%;
        vertical-align: middle;/*垂直居中*/
        padding-right: 5px;
    }
    .header-user-username .el-dropdown-link{
        color: #ffffff;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        line-height: 60px
    }
    .header-left-box{
        color: #ffffff;
        font-size: 20px;
        font-weight: 600;
    }
</style>