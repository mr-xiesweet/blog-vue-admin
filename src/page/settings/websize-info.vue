<template>
    <div class="websize-info-box">
        <div class="info-list-box">
            <el-form  label-width="100px"  >
                <el-form-item label="网站名称" >
                    <el-input type="text" v-model="webTitle" autocomplete="off" @keyup.enter.native="updateWebInfo"></el-input>
                </el-form-item>
                <el-form-item label="网站关键字" >
                    <el-input v-model.number=" webTarget" @keyup.enter.native="updateWebInfo"></el-input>

                </el-form-item>
                <el-form-item label="网站描述">
                    <el-input type="textarea" :row='3' v-model="webDescription"  @keyup.enter.native="updateWebInfo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateWebInfo()">修改</el-button>

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
                webTitle:'',
                webTarget:'',
                webDescription:''
            }
        },
        methods:{
            updateWebInfo(){
                if (this.webTarget === '' || this.webTitle === '' || this.webDescription === '') {
                    this.toastES('不允许为空','error')
                    return;
                }
                api.updateWebTitle(this.webTitle).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                    }else {
                        this.toastES(result.message,'error')
                        return;
                    }
                });
                api.updateWebSeo(this.webDescription,this.webTarget).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                    } else {
                        this.toastES(result.message,'error')
                        return;
                    }
                })
            },
            getWebInfo(){
                api.getWebTitle().then(result=>{
                    if (result.code === 20000) {
                        this.webTitle=result.data['value']
                    }else {
                        this.toastES(result.message,'error')
                        return;
                    }
                })
                api.getWebSeo().then(result=>{
                    if (result.code === 20000) {
                        this.webTarget=result.data['web_size_keywords']
                        // this.webTarget=result.data.web_size_keywords
                        this.webDescription=result.data['web_size_description']
                    }else {
                        this.toastES(result.message,'error')
                        return;
                    }
                })
            },

        },
        mounted() {
            this.getWebInfo()
        }
    }
</script>

<style scoped>
    .info-list-box .el-input, .info-list-box .el-textarea{
        width: 250px;
    }
</style>