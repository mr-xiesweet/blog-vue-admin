<template>
    <div class="article-post-box">
    <!--  标题-->
        <div >

            <b>标题：</b><el-input v-model="article.title" placeholder="请输入标题" style="width: 400px"></el-input>
        </div>
    <!--  内容编辑部分-->
        <div class="article-post-part">
            <mavon-editor
                    v-model="article.content"
                    class="article-editor"
                    ref="mdEditor"
                    @onImageClick="onEditorImageClick">
            </mavon-editor>
        </div>
    <!--  文章设置：分类，封面，标签-->
        <div class="article-post-setting-part">
            <!--信息显示        -->
            <div class="info-list-box">
                <el-form  label-width="100px" class="demo-ruleForm" >
                    <el-form-item label="分类" >
                        <el-select v-model="article.categoryId" placeholder="请选择">
                            <el-option
                                    v-for="item in categories"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摘要" >
                        <el-input
                                type="textarea"
                                autosize
                                placeholder="请输入内容"
                                v-model="article.summary"
                                style="width: 250px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="标签" >
                        <el-tag
                                :key="tag"
                                v-for="tag in labels"
                                closable
                                :disable-transitions="false"
                                @close="delete_tag(tag)">
                            {{tag}}
                        </el-tag>
                        <el-input
                                class="input-new-tag"
                                v-if="labelInputVisible"
                                v-model="labelInputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"

                        >
                        </el-input>
                        <el-button  v-if="labels.length>=5"    class="button-new-tag" size="small" @click="showLabelInput" style ="display:none">+ 添加新标签</el-button>
                        <el-button  v-else class="button-new-tag" size="small" @click="showLabelInput" >+ 添加新标签</el-button>

                    </el-form-item>

                    <el-form-item label="封面:" required>
                            <div class="article-cover-selector" @click="showCoverSelector">
                                <el-image v-if="article.cover!==''" :src="blog_constant.baseUrl+'/portal/image/'+article.cover"></el-image>
                                <i  v-else class="el-icon-plus" ></i>
                            </div>
                        </el-form-item>

                </el-form>
            </div>


        </div>

    <!--  发布/草稿/预览的按钮-->
        <div class="article-post-action-bar">
            <div class="action-btn-container clearfit">
                <el-button plain @click="preView">全屏预览</el-button>
                <el-button v-if="isShowDraftBtn" plain @click="draftArticle">保持草稿</el-button>
                <el-button v-else plain @click="draftArticle" style="display:none">保持草稿</el-button>
                <el-button type="primary" @click="commitArticle">{{commitBtnText}}</el-button>
            </div>
        </div>
        <!-- 图片编辑器       -->
        <div class="article-post-dialog-box">
            <el-dialog
                    :visible.sync="dialogVisible"
                    width="30%">
                <div class="image-selector-box">
                    <div class="image-action-box" >
                        <el-upload
                                class="avatar-uploader"
                                action="/admin/image/article"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                               >
                            <el-button >上传照片</el-button>
                        </el-upload>

                    </div>
                    <div class="image-selector-list">
                        <el-radio-group v-model="selectImageIndex">
                            <el-radio-button :label="index" v-for="(item,index) in images" :key="index" >
                                <el-image :src="'/portal/image/'+item.url"></el-image>
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                    <!--多页显示-->
                    <div class="image-picker-navigation">
                        <el-pagination
                                class="list-user-box-navigation"
                                background
                                layout="prev, pager, next"
                                @current-change="onPageChang"
                                :pageSize="pageNavigation.pageSize"
                                :total="pageNavigation.totalCount"
                                :current-page="pageNavigation.currentPage">
                        </el-pagination>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onImageSelect">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 内部切换页面提示       -->
        <el-dialog
                title="提示"
                :visible.sync="changTipIsShow"
                width="30%"
                center>
            <span>系统可能不会保留这个页面的信息哦</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="changTipIsShow = false">取 消</el-button>
            <el-button type="primary" @click="toNextPage()">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as api from '../../api/api'

    //导入文章编辑器
    import editor from '../../../lib/mavon-editor/mavon-editor';
    import '../../../lib/mavon-editor/css/index.css';
    import Vue from 'vue';
    Vue.use(editor);

    export default {
        data(){
            return{
                changTipIsShow:false,
                isContentSave:true,
                nextPath:'',
                pageNavigation:{
                    currentPage:1,
                    totalCount:0,
                    pageSize:10
                },
                //分辨图片用处时封面还是内容
                imageSelectorFor:'article',
                selectImageIndex:0,
                labelInputValue:'',
                labelInputVisible:false,
                dialogUpdateImage:false,
                labels:[],
                categories:[],
                images:[],
                article:{
                    id:'',
                    title:'',
                    content:'',
                    categoryId:'',
                    label:'',
                    cover:'',
                    summary:'',
                    state:'1',
                    type:'1'

                },
                showAvatarCutter:false,
                dialogVisible:false,
                isShowDraftBtn:true,
                commitBtnText:'发表文章'
            }
        },
        watch:{
            article:{
                handler(){
                   this.isContentSave=false;
                },
                deep:true
            }
        },
        methods:{
            toNextPage(){
                this.isContentSave=true;
                this.$router.push({
                    path:this.nextPath
                })
            },
            //全屏预览
            preView(){
                this.$refs.mdEditor.toolbar_right_click('read');
            },
            //提交为草稿
            draftArticle(){
                if(this.article.title===''){
                    this.toastES('文章标题不能为空','error')
                    return
                }
                this.article.state='2'
                api.addArticle(this.article).then(result=>{
                    if(result.code===20000){
                        //保持成功清掉关闭页面提示
                        window.onbeforeunload=null;
                        this.changTipIsShow=false
                        this.isContentSave=true

                        this.toastES(result.message,'success')
                        //跳转到文章列表页面
                        this.$router.push({
                            path:'/content/manage-article'
                        })
                    }else {
                        this.toastES(result.message,'error')
                    }
                })
            },
            //提交按钮
            commitArticle() {

                if(this.article.title===''){
                    this.toastES('文章标题不能为空','error')
                    return
                }
                if(this.article.content===''){
                    this.toastES('文章内容不能为空','error')
                    return
                }
                if(this.article.cover===''){
                    this.toastES('文章封面不能为空','error')
                    return
                }
                if(this.article.summary===''){
                    this.toastES('文章摘要不能为空','error')
                    return
                }
                //处理标签问题
                if(this.labels.length===''){
                    this.toastES('请设置标签，方便搜索','error')
                    return;
                }
                let tempLabels='';
                this.labels.forEach((item,index)=>{
                    tempLabels+=item;
                    if(index!==this.labels.length-1){
                        tempLabels+='-'
                    }
                })
                this.article.label=tempLabels
                if(this.article.id===''){
                    api.addArticle(this.article).then(result=>{
                        if(result.code===20000){
                            //保持成功清掉关闭页面提示
                            window.onbeforeunload=null;
                            this.changTipIsShow=false;
                            this.isContentSave=true;

                            this.toastES(result.message,'success')
                            //跳转到文章列表页面
                            this.$router.push({
                                path:'/content/manage-article'
                            })
                        }else {
                            this.toastES(result.message,'error')
                        }
                    })

                }else {
                    this.article.state='1';
                    api.updateArticle(this.article.id,this.article).then(result=>{
                        if(result.code===20000){
                            this.toastES(result.message,'success')

                            //保持成功清掉关闭页面提示
                            window.onbeforeunload=null;
                            this.changTipIsShow=false
                            this.isContentSave=true

                            //跳转到文章列表页面
                            this.$router.push({
                                path:'/content/manage-article'
                            })
                        }else {
                            this.toastES(result.message,'error')
                        }
                    })
                }

            },
             //点击编辑器图片按钮
            onEditorImageClick(){
                // this.toastES('编辑器图片点击了','error')
                this.imageSelectorFor='article'
                this.dialogVisible=true;
            },
            onPageChang(page){
                this.pageNavigation.currentPage=page;
                this.listImagesOriginal();
            },
            //列举照片
            listImagesOriginal(){
                //todo:这里差一个参数，图片来源
                api.listImagesOriginal(this.pageNavigation.currentPage,this.pageNavigation.pageSize,'article').then(result=>{
                    if (result.code === 20000) {
                        this.images=result.data.content;

                        this.pageNavigation.currentPage=result.data.number+1;
                        this.pageNavigation.totalCount=result.data.totalElements;
                        this.pageNavigation.pageSize=result.data.size;
                    }
                })
            },
            //上传本地照片
            uploadError(response){
                    this.toastES(response.message,'error')
            },
            //图片选择
            onImageSelect(){
                this.dialogVisible=false;
                let item=this.images[this.selectImageIndex]
                if(this.imageSelectorFor==='cover'){
                    this.article.cover=item.url
                }else if(this.imageSelectorFor==='article'){
                    this.$refs.mdEditor.toolbar_left_addlink('no-link',item.name,this.blog_constant.baseUrl+'/portal/image/'+item.url)
                }
            },
            //显示封面图片编辑
            showCoverSelector(){
                //图片编辑框用于封面
                this.imageSelectorFor='cover';
                //显示图片编辑框
                this.dialogVisible=true;
            },

            showLabelInput(){
                if (this.labels.length < 5) {
                    this.labelInputVisible=true;
                }else {
                    this.labelInputVisible=false
                }
                //添加标签，将焦点发在输入框
                this.$nextTick(()=>{
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            handleInputConfirm(){
                //回车的时候
                if (this.labels.length < 5) {
                    this.labels.push(this.labelInputValue)
                    this.labelInputValue='';
                    this.labelInputVisible=false;
                }
            },
            uploadSuccess(response){
                if (response.code === 20000) {
                    this.toastES(response.message,'success')
                }
                this.listImagesOriginal()
            },

            beforeUpload(){

            },
            delete_tag(tag){
                this.labels.splice(this.labels.indexOf(tag),1)
                //TODO:处理显示输入框
            },
            listCategories(){
                api.listCategories().then(result=>{
                    if (result.code === 20000) {
                        this.categories=result.data
                    }
                })
            },
            getOneArticle(articleId){
                api.getArticle(articleId).then(result=>{
                    if(result.code===20000){

                        let remoteArticle=result.data;

                        this.article.id=remoteArticle.id;
                        this.article.title=remoteArticle.title;
                        this.article.content=remoteArticle.content;
                        this.article.categoryId=remoteArticle.categoryId;
                        this.article.label=remoteArticle.label;
                        this.article.cover=remoteArticle.cover;
                        this.article.summary=remoteArticle.summary;
                        this.article.state=remoteArticle.state;
                        this.article.type=remoteArticle.type;
                        this.labels=remoteArticle.labels;
                        this.commitBtnText='更新文章';
                        if(this.article.state!=='2'){
                            this.isShowDraftBtn=false;
                        }
                    }
                })
            }
        },

        beforeDestroy() {
            //离开页面前清掉监听，防止其他页面也提示这个
            window.onbeforeunload=null;
        },
        beforeRouteLeave(to,from,next){
            if(this.isContentSave){
                next();
            }else{
                this.nextPath=to.path;
                this.changTipIsShow=true;
            }
        },
        mounted() {
            //监听是否关闭这个网页
            window.onbeforeunload=function(){
                return '系统可能不会保存填写的稿件信息哦'
            }
            let articleId=this.$route.query.articleId;
            if(articleId) {
                this.getOneArticle(articleId)
            }
            this.listCategories();
            this.listImagesOriginal();
        }
    }
</script>

<style >
    .image-selector-list{
        margin-top:5px;
    }

    .article-post-part{
        margin-bottom: 20px;
        height: 500px;
    }
    .article-post-setting-part{
        height: 400px;
    }

    .article-post-action-bar{

        margin-top: 10px;
        float: right;
        position: fixed;
        bottom:0;

    }
    .article-post-part .markdown-body{
        height: 500px;
    }
    .info-list-box .el-input,.textarea{
        width: 250px;
    }
    .info-list-box .el-image{
        width: 100px;
        height: 100px;
    }
    .avatar-uploader .avatar-uploader-icon ,.article-cover-selector{
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        border-radius: 4px;
        border: #EDEDED solid 1px;
        margin: 5px;
    }
    .image-selector-list .el-image{
        width: 95px;
        height: 95px;

     }
    /*去掉选择图片的边框*/
    .image-selector-box .el-radio-button__inner,.image-selector-box .el-radio-button:first-child .el-radio-button__inner{
        border: none;
        padding: 5px;
        border-radius: 5px;
    }
    .article-post-part .v-note-op{
        position: sticky;/*固定区域*/
        top:0;
    }
    .article-post-dialog-box .el-dialog__header{
        display: none;
    }
</style>