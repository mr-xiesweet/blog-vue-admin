<template>
    <div class="images-box">
        <!--  照片搜索      -->
        <div class="image-action-bar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item label="来源" >
                    <el-select v-model="original" placeholder="请选择">
                        <el-option
                                v-for="item in originals"
                                :key="item.name"
                                :label="item.name"
                                :value="item.original">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="this.doImageSearch">查询</el-button>
                    <el-button type="primary" @click="this.cleanSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="comment-list-box">
            <el-table
                    v-loading="loading"
                    :data="images"
                    style="width: 90%">
                <el-table-column fixed prop="id" label="ID"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-image :src="'portal/image/'+scope.row.url" class="images-image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="original" label="来源"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==='0'"><el-tag type="danger" >已删除</el-tag></span>
                        <span v-if="scope.row.state==='1'"><el-tag type="success">正常</el-tag></span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" >
                        <span v-if="scope.row.state==='0'">
                            <el-button @click="del(scope.row)"  size="mini" >恢复</el-button>
                        </span>
                        <span v-if="scope.row.state!=='0'">
                            <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                        </span>
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
    import * as dateUtils from "../../utils/date";
    import * as api from '../../api/api'
    export default {
        data(){
            return{
                loading:false,
                images:[],

                targetDeleteId:'',
                original:'',
                isSelectOriginal:false,
                pageNavigation:{
                    currentPage:1,
                    totalCount:0,
                    pageSize:5
                },
                originals:[{name:'轮播图',original:'loop'},
                    {name:'文章',original: 'article'},
                    {name:'友情链接logo',original: 'link'},
                    {name:'头像',original:'avatar'}]

            }
        },
        methods:{
            doImageSearch(){
                this.isSelectOriginal=true;
                this.pageNavigation.currentPage=1;
                this.listImagesOriginal();
            },
            listImagesOriginal() {
                api.listImagesOriginal(this.pageNavigation.currentPage,this.pageNavigation.pageSize,this.original).then(result=>{
                    if (result.code === 20000) {
                        this.images=result.data.content;

                        this.pageNavigation.currentPage=result.data.number+1;
                        this.pageNavigation.totalCount=result.data.totalElements;
                        this.pageNavigation.pageSize=result.data.size;
                    }else {
                        this.toastES(result.message,'error')
                    }
                })
            },
            cleanSearch(){
                this.listImages();
                this.isSelectOriginal=false;
            },
            onPageChang(page){
                this.pageNavigation.currentPage=page;
                //判断是搜索结果切页还是原本的切页
                if(this.isSelectOriginal){
                    this.listImagesOriginal()
                }else{
                    this.listImages()
                }

            },

            del(item){
                api.deleteImage(item.id).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                        this.listImages()
                        this.isShowDelete=false;
                    }else {
                        this.toastES(result.message,'error')
                    }
                })

            },
            formatDate(dataStr){
                let date=new Date(dataStr);
                return dateUtils.formatDate(date,'yyyy-MM-dd:hh:mm:ss')
            },

            listImages(){
                this.loading=true
                api.listImages(this.pageNavigation.currentPage,this.pageNavigation.pageSize).then(result=>{
                    if (result.code === 20000) {
                        this.images=result.data.content;

                        this.pageNavigation.currentPage=result.data.number+1;
                        this.pageNavigation.totalCount=result.data.totalElements;
                        this.pageNavigation.pageSize=result.data.size;
                        this.loading=false
                    }else {
                        this.toastES(result.message,'error')
                    }
                })
            }
        },
        mounted() {
            this.listImages()
        }
    }
</script>

<style >
    .images-image, .el-upload img{
        width: 100px;
        height: 100px;
        padding: 4px;
        border-radius: 4px;
        border: #EDEDED solid 1px;
    }

</style>