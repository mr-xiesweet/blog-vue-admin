<template>
    <div class="info-box">
        <!--信息显示        -->
        <div class="info-list-box">
            <el-form  label-width="100px" class="demo-ruleForm">
                <el-form-item label="id" >
                    <el-input type="text" v-model="userInfo.id" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" >
                    <el-input v-model.number="userInfo.email" disabled></el-input>
                    <el-button class="chang-email-button" @click="toEmail()">修改</el-button>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input type="input" v-model="userInfo.userName" autocomplete="off" @keyup.enter.native="updateInfo"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <div @click="isShowAvatarCutter()" class="user-info-avatar">
                        <el-avatar shape="square"  :src="userInfo.avatar" ></el-avatar>
                    </div>
                </el-form-item>
                <el-form-item label="签名">
                    <el-input type="input" v-model="userInfo.sign" autocomplete="off" @keyup.enter.native="updateInfo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateInfo()">修改</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 头像编辑       -->
        <div class="info-dialog">
            <avatar-upload
                       field="file"
                       @crop-upload-success="cropUploadSuccess"
                       @crop-upload-fail="cropUploadFail"
                       v-model="showAvatarCutter"
                       :width="300"
                       :height="300"
                       url="/admin/image/avatar"
                       >
            </avatar-upload>
        </div>
    </div>
</template>

<script>
    import * as api from '../../api/api'
    import avatarUpload from 'vue-image-crop-upload/upload-2.vue';
    export default {
        components:{
            'avatar-upload': avatarUpload
        },
        data(){
            return{

                showAvatarCutter:false,
                userInfo: {
                    id:'',
                    sign:'',
                    email:'',
                    userName:'',
                    avatar:''

                },
            }
        },
        methods:{
            isShowAvatarCutter(){
                this.showAvatarCutter=true;
            },
            cropUploadSuccess(response){
                if (response.code === 20000) {
                    this.toastES('上传成功','success')

                    this.userInfo.avatar=this.blog_constant.baseUrl+'/portal/image/'+response.data.id;

                }else{
                    this.toastES(response,'false')
                }
            },

            cropUploadFail(status, field){
                console.log('-------- upload fail --------');
                console.log(status);
                console.log('field: ' + field);
            },
            toEmail(){
                this.$router.push({
                    path:'/setting/email'
                })
            },
            updateInfo(){
                this.showAvatarCutter = false;
                api.updateUserInfo(this.userInfo.id,this.userInfo).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                        // this.getUserInfo()
                    }else{
                        this.toastES(result.message,'false')
                    }
                })

            },
            getUserInfo(){
                api.checkToken().then(result=>{
                    if (result.code === 20000) {
                        this.isShow=true;
                        this.userInfo=result.data;

                    }else{
                        this.toastES(result.message,'error');
                    }
                })
            },

        },

        mounted() {
            this.getUserInfo()
        }

    }
</script>

<style scoped>
    .user-info-avatar{
        display: inline-block;
    }
    .chang-email-button{
        margin-left: 10px;
    }
    .user-info-avatar{
        cursor: pointer;
    }
    .info-list-box .el-input{
        width: 250px;
    }
</style>