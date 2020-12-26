<template>

    <div>
        <!--顶部-->
        <div class="admin-login-header-box">
            <div class="admin-login-header-center center">
                <div class="admin-login-logo">
                    博客系统 | 登录
                </div>
            </div>
        </div>
        <!--中间-->
        <div class="admin-login-center-box">
            <div class="center login-center-box">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form label-position="right" label-width="100px"  >
                            <el-form-item label="用户名:" required>
                                <el-input v-model="sobUser.userName" placeholder="请输入用户名" required></el-input>
                            </el-form-item>
                            <el-form-item label="密码:" required>
                                <el-input v-model="unPassword" placeholder="请输入密码" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="验证码:" required>
                                <el-input v-model="loginInfo.verifyCode" placeholder="请输入验证码" class="captcha_input_code" @keyup.enter.native="doLogin"></el-input>
                            </el-form-item>
                            <el-form-item label="点击切换">
                                <img :src="captchaPath" @click="updateVerifyCode" class="captcha-code">
                            </el-form-item>
                            <el-form-item >
                                <el-button type="primary" class="button-login" @click="doLogin" size="small">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!--底部-->
    </div>


</template>

<script>
    import {doLogin} from '../../api/api'
    //import {hex_md5} from "../../utils/md5";
    export default {
        data() {
            return {

                sobUser: {
                    userName: '',
                    password: ''

                },
                loginInfo:{
                    verifyCode: '',
                    captcha_key:''
                },
                captchaPath:'',
                unPassword:''
            };
        },
        methods:{
            doLogin(){
                //发起登录
                //TODO：检测数据
                if (this.sobUser.userName === '') {
                    this.toastES('用户名不能为空','error')
                    return;

                }
                if (this.sobUser.unPassword === '') {
                    this.toastES('密码不能为空','error')
                    return;
                }
                if (this.loginInfo.verifyCode === '') {
                    this.toastES('验证码不能为空','error')
                    return;
                }
                this.sobUser.password=this.unPassword
                   doLogin(this.loginInfo.verifyCode,this.loginInfo.captcha_key,this.sobUser).then(result =>{
                    //处理结果
                        let data=result;
                        if(data.code===20000){
                            this.toastES(data.message,'success')
                            this.$router.push({path:'/index'})
                        }else{
                            this.updateVerifyCode()
                            this.toastES(data.message,'error')
                        }
                });
            },
            updateVerifyCode(){
                //this.captchaPath = "http://192.168.6.132:2021/user/captcha?captcha_key="+Date.parse(new Date())
                this.captchaPath="/user/captcha?captcha_key="+this.loginInfo.captcha_key+"&random="+Date.parse(new Date());
            }
        },
        mounted() {

            this.loginInfo.captcha_key=Date.parse(new Date());
            this.updateVerifyCode();
        }
    }
</script>

<style >
    .admin-login-header-box{
        width: 100%;
        height: 46px;
        background: dodgerblue;
        margin-bottom: 20px;
    }
    .center{
        line-height: 46px;
        margin: 0 auto;
    }
    .admin-login-header-center{

        width: 1140px;
    }
    .admin-login-logo{
        color: #ffffff;
        font-size: 20px;
        font-weight: 600;
    }
    .login-center-box{
        width: 1140px;
        height: 300px;
        padding: 20px;
        background: #ffffff;
        box-shadow: 0 1px 10px #afafaf;
        border-radius: 4px;
    }
    .admin-login-center-box{
        color: #ffffff;
        font-size: 10px;
        font-weight: 600;
    }
    .captcha-code{
        cursor: pointer;
        box-shadow: 0 1px 10px #e6e6e6;
        width: 100px;
        height: 42px;
    }

</style>