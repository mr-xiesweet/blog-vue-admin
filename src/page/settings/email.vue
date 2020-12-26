<template>
    <div class="email-box">
        <div class="email-list-box" center>
            <el-form  ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                <el-form-item label="邮箱">
                    <el-input v-model="newEmail"></el-input>
                    <el-button v-if='!isCountDowning' @click="getVerifyCode()" class="email-geg-varifyCode" type="primary">获取验证码</el-button>
                    <el-button v-else  class="email-geg-varifyCode" disabled>{{countDownText}}</el-button>
                </el-form-item>
                <el-form-item label="验证码">
                    <el-input v-model="verifyCode" @keyup.enter.native="updateEmail"></el-input>
                </el-form-item >
                <el-form-item>
                    <el-button @click="updateEmail()">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    import * as api from '../../api/api'
    export default {
        data(){
            return{
                newEmail:"",
                verifyCode:"",
                isCountDowning:false,
                countDownText:'重新发送（60）'
            }

        },
        methods:{

            getVerifyCode(){
                //校验邮箱格式是否正确
                let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
                if (!reg.test(this.newEmail)) {
                    this.toastES('邮箱地址格式不对..','error');
                    return;
                }
                //发送验证码
                api.getVerifyCode(this.newEmail,'update').then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')

                        //倒计时
                        let time=59;
                        this.isCountDowning=true;
                        let that=this;//解决作用域的问题，即按钮不显示倒计时
                        let interval=setInterval(function () {
                            time--;
                            if(time<=0){
                                clearInterval(interval)
                                that.isCountDowning=false;
                            }
                            that.countDownText='重新发送（'+time+')';

                        },1000)
                    }
                    else (
                        this.toastES(result.message,'error')

                    )
                })



            },
            updateEmail(){
                if (this.newEmail === '' || this.verifyCode === '') {
                    this.toastES('新邮箱或者验证码为空','error')
                    return
                }
                api.updateEmail(this.newEmail,this.verifyCode).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                        this.newEmail='';
                        this.verifyCode='';
                    }else{
                        this.toastES(result.message,'error')
                    }
                })
            }

        }
    }
</script>

<style >
    .email-list-box{
        margin: auto;
    }
    .email-list-box .el-input{
        width: 250px;
    }
    .email-geg-varifyCode{
        margin-left: 20px;

        size: 15px;
    }

</style>