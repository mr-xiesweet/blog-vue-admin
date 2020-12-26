<template>
    <div class="dashboard-box">
        <div class=" title-bar ">欢迎访问心机之蛙系统管理中心</div>
        <div class="web-size-info-box margin-bottom-20">
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">
                <div class="title"> 注册用户：</div>
                <div class="number" >{{size.registerSize}}</div>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                <div class="title">  文章总数：</div>
                <div class="number" >{{size.articleSize}}</div>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                <div class="title"> 评论总数：</div>
                <div class="number" >{{size.commentSize}}</div>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                <div class="title"> 访问量：</div>
                <div class="number" > {{size.webSize}}</div>

            </div></el-col>
        </el-row>
         </div>
        <div class="dashboard-bottom-part">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="comment-content bg-purple">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>快捷操作</span>
                            </div>
                            <div class="fast-way-list">
                               <div class="class-way-item">
                                 <router-link style="text-decoration: none" to="/content/post-article" class="el-icon-reading"> 写文章</router-link>
                               </div>
                                <div class="class-way-item">
                                    <router-link style="text-decoration: none" to="/setting/websize-info" class="el-icon-s-shop"> 网站信息</router-link>
                                </div>
                                <div class="class-way-item">
                                    <router-link style="text-decoration: none" to="/setting/email" class="el-icon-message"> 邮箱管理</router-link>
                                </div>
                                <div class="class-way-item">
                                    <router-link style="text-decoration: none" to="/content/manage-article" class="el-icon-s-management"> 文章管理</router-link>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="navigation-content bg-purple">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span >最新评论</span>
                                <el-button style="float: right; padding: 3px 0;" type="text" @click="toCommentList">更多>></el-button>
                            </div>
                            <div style="margin-bottom: 10px " class="title-top">
                                <span class="title" style="margin-bottom: 100px ">评论者</span>
                                <span   style="margin-left:20%;margin-bottom: 100px">内容</span>
                            </div>
                            <div class="comment-list-box">
                                <template>

                                    <vue-seamless-scroll :data="comments" class="seamless-warp content_font" :class-option="classOption">
                                        <ul class="item">
                                            <li v-for="(item,index) in comments" v-bind:key="index">
                                                <span  v-text="item.userName" class="product-buyer-name title"></span>
                                                <span  v-text="item.content" style="margin-left:20%; color: #8c939d; font-size:15px; " class="product-buyer-name clearfit"></span>
                                            </li>
                                        </ul>
                                    </vue-seamless-scroll>
                                </template>
                            </div>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import * as api from '../../api/api'
    //上下滑动引入插件
    import Vue from 'vue'
    import scroll from 'vue-seamless-scroll'
    Vue.use(scroll)

    export default {
        data(){
            return{
                size:{
                    registerSize:3,
                    articleSize:4,
                    commentSize:5,
                    webSize:201,
                },
                comments:[],
                loading:false,

                animate: false,
                showNum: 4, // 可见列表条数
            }
        },
        methods:{
            getRegisterSize(){
                api.listUser(1,10).then(result=>{
                    if(result.code===20000){
                        this.size.registerSize=result.data.totalElements;
                      
                    }
                })
            },
            getArticleSize(){
                api.listArticle(1,8,'','','').then(result=>{
                    if(result.code===20000){
                        this.size.articleSize=result.data.totalElements;
                    }
                })
            },
            getWebSize(){
                api.getWebSize().then(result=>{

                    if(result.code===20000){
                        this.size.webSize=result.data.web_size_view_account;
                    }
                })
            },
            getComment(){
                api.listComments(1,8).then(result=>{
                    if (result.code === 20000) {
                        this.comments=result.data.content;
                        this.size.commentSize = result.data.totalElements
                    }else{
                        this.$message({
                            message:result.message,
                            center:true,
                            type:'error'
                        })
                    }
                })
            },
            toCommentList(){
                this.$router.push({
                    path:'/content/manage-comment'
                })
            },

        },
        mounted() {
            // 可见数据高度

            this.getRegisterSize();
            this.getArticleSize();
            this.getWebSize();
            this.getComment()

        },
        computed: {
            classOption () {
                return {
                    step:0.4
                }
            }
        }

    }
</script>

<style >

    .comment-list-box .product-buyer-name {
        display:inline-block;
        max-width: 200px;

        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;

    }
    .comment-list-box .seamless-warp {
        height: 80px;
        overflow: hidden;

    }
    .comment-list-box  .content_font {
        font-size: 18px;
        color: black;
        padding: 20px;
        margin:10px;
    }

    .title-bar {
        padding: 10px;
        font-size: 20px;

    }
    .web-size-info-box{
        margin: 10px;
    }
    .dashboard-bottom-part{
        margin:20px;
    }
    .web-size-info-box .title{
        padding: 15px;
        font-size: 25px;
    }
    .web-size-info-box .number{
        color: #00b0e8;
        font-size: 40px;
        text-align: center;
    }
    .navigation-content .title-top span{
        color: black;
        font-size: 20px;
        font-weight: 900;
     }
    .web-size-info-box .bg-purple ,.dashboard-bottom-part .bg-purple{
        box-shadow: 0 1px 10px #afafaf;
        height: 150px;
    }
    .class-way-item{
        font-size: 20px;
        margin-bottom: 15px;
    }

    .comment-user-avatar span{
        line-height: 40px;
        float: left;
        color: black;
        font-size: 20px;

    }




</style>