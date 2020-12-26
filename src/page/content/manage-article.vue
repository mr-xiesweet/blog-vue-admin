
<template>
    <div class="article-box">
        <!--  文章搜索    -->
        <div class="comment-action-bar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item label="文章关键词：">
                    <el-input v-model="search.keyword" placeholder="文章关键词"></el-input>
                </el-form-item>
                <el-form-item label="分类:" >
                    <el-select v-model="search.categoryId" placeholder="请选择">
                        <el-option
                                v-for="item in categories"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态:" >
                    <el-select v-model="search.state" placeholder="请选择">
                        <el-option
                                v-for="item in states"
                            :key="item.name"
                            :label="item.name"
                            :value="item.state">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="doArticleSearch()">查询</el-button>
                    <el-button type="primary" @click="cleanSearch()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--        //文章列举-->
        <div class="comment-list-box">
            <el-table
                    v-loading="loading"
                    :data="articles"
                    style="width: 95%" >
                <el-table-column prop="id" label="ID" width="170">

                </el-table-column>
                <el-table-column prop="title" label="标题" width="150">

                </el-table-column>
                <el-table-column prop="viewCount" label="浏览量" width="80">

                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==='0'"><el-tag type="danger" >已删除</el-tag></span>
                        <span v-if="scope.row.state==='1'"><el-tag type="success">正常</el-tag></span>
                        <span v-if="scope.row.state==='2'"><el-tag >草稿</el-tag></span>
                        <span v-if="scope.row.state==='3'"><el-tag type="warning">置顶</el-tag></span>
                    </template>
                </el-table-column>
                <el-table-column prop="summary" label="摘要">
                </el-table-column>
                <el-table-column label="创建时间" width="160">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" width="160">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" >
                        <el-button @click="edit(scope.row)"  size="mini">编辑</el-button>
                        <el-button v-if="scope.row.state==='0'" type="danger" size="mini" disabled>删除</el-button>
                        <el-button v-if="scope.row.state!=='0'" @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                        <el-button v-if="scope.row.state==='1'" @click="topArticle(scope.row)"  size="mini" >置顶</el-button>

                        <el-button v-else-if="scope.row.state==='3'" @click="topArticle(scope.row)" type="warning" size="mini">取消置顶</el-button>

                        <el-button v-else  size="mini" disabled>置顶</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--        //切页-->
        <div class=" margin-padding-20">
            <el-pagination
                    class="list-box-navigation"
                    background
                    layout="prev, pager, next"
                    @current-change="onPageChang"
                    :pageSize="pageNavigation.pageSize"
                    :total="pageNavigation.totalCount"
                    :current-page="pageNavigation.currentPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import * as api from '../../api/api'
    import * as dateUtils from "../../utils/date";

    export default {

        data(){
            return{
                articles:[],
                loading:false,
                pageNavigation:{
                    currentPage:1,
                    totalCount:0,
                    pageSize:3
                },

                search:{
                    categoryId:'',
                    keyword:'',
                    state:''
                },
                categories:[],
                states:[{name:'删除',state:'0'},
                        {name:'正常',state: '1'},
                        {name:'草稿',state: '2'},
                        {name:'置顶',state:'3'},
                        {name:'所有状态',state:''},
                        ]
            }
        },
       methods:{
           edit(item){
                let articleId=item.id;
                this.$router.push({
                    path:'/content/post-article',
                    query:{
                        articleId:articleId
                    }
                })
           },
           topArticle(item){
               api.topArticle(item.id).then(result=>{
                   if (result.code === 20000) {
                       //this.getCategories();
                       this.toastES(result.message,'success')
                       location.reload();
                   }else {
                       this.toastES(result.message,'error')
                   }
               })
           },
           del(item){
               api.deleteArticle(item.id).then(result=>{
                   if (result.code === 20000) {
                       //this.getCategories();
                       this.toastES(result.message,'success')
                       location.reload();
                   }else {
                       this.toastES(result.message,'error')
                   }
               })
           },
           listCategories(){
               api.listCategories().then(result=>{
                   if (result.code === 20000) {
                       this.categories=result.data;
                       this.categories.push({
                           id:'',
                           name:'所有分类'
                       })
                   }
               })
           },
           doArticleSearch(){
               this.getArticle();
           },
           cleanSearch(){
               this.search.categoryId='';
               this.search.state='';
               this.search.keyword='';
               this.getArticle();
           },
           //切页
           onPageChang(page){
               this.pageNavigation.currentPage=page;
               this.getArticle();

           },
           formatDate(dataStr){
               let date=new Date(dataStr);
               return dateUtils.formatDate(date,'yyyy-MM-dd:hh:mm:ss')
           },
           getArticle(){
               this.loading=true;
               api.listArticle(this.pageNavigation.currentPage,this.pageNavigation.pageSize,this.search.state,this.search.keyword,this.search.categoryId).then(result=>{
                   if (result.code === 20000) {

                       this.articles=result.data.content;
                       /*
                       this.pageNavigation.currentPage=result.data.number+1;
                       this.pageNavigation.totalCount=result.data.totalElements;
                       this.pageNavigation.pageSize=result.data.size;
                        */
                       this.pageNavigation.currentPage=result.data.number+1;
                       this.pageNavigation.totalCount=result.data.totalElements;
                       this.pageNavigation.pageSize=result.data.size;
                       this.loading=false;
                   }

               })
           },

       },
        mounted() {
            this.getArticle();
            this.listCategories();
        }
    }
</script>

<style >
    .article-box .cell {
        text-align: center;
    }

    .comment-list-box .el-button{
        margin-right: 2px;
    }
</style>