<template>
    <div class="comment-box">
        <!-- //评论列举-->
        <div class="comment-list-box">
            <el-table
                    v-loading="loading"
                    :data="comments"
                    style="width: 90%">
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column prop="parentContent" label="评论谁的评论">
                </el-table-column>
                <el-table-column prop="userName" label="评论者名">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==='0'"><el-tag type="danger" >已删除</el-tag></span>
                        <span v-if="scope.row.state==='1'"><el-tag type="success">正常</el-tag></span>
                        <span v-if="scope.row.state==='2'"><el-tag >草稿</el-tag></span>
                        <span v-if="scope.row.state==='3'"><el-tag type="warning">置顶</el-tag></span>
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
                            <el-button  type="danger" size="mini" disabled>删除</el-button>
                        </span>
                        <span v-if="scope.row.state!=='0'">
                            <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                        </span>
                        <span v-if="scope.row.state==='1'">
                            <el-button @click="topComment(scope.row)"  size="mini" >置顶</el-button>
                        </span>
                        <span v-else-if="scope.row.state==='3'">
                            <el-button @click="topComment(scope.row)" type="warning" size="mini">取消置顶</el-button>
                        </span>
                        <span v-else>
                            <el-button   size="mini" disabled>置顶</el-button>
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
        <!-- 删除提示-->
        <el-dialog
                title="温馨提示"
                :visible.sync="isShowDialog"
                width="30%"
                center>
            <span>真的要删除吗？删除评论可能找不回来</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="isShowDialog = false">取 消</el-button>
            <el-button type="primary" @click="isDeleteComment">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as dateUtils from "../../utils/date";
    import * as api from '../../api/api'

    export default {
        data(){
            return{
                isShowDialog:false,
                loading:false,
                deleteTargetId:'',
                comments:[],
                pageNavigation:{
                    currentPage:1,
                    totalCount:0,
                    pageSize:7
                }
            }
        },
        methods:{
            isDeleteComment(){
                api.delComment(this.deleteTargetId).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                        this.deleteTargetId=''
                        this.isShowDialog=false
                        this.getComments()
                    }else{
                        this.toastES(result.message,'error')
                    }
                })
            },
            del(item){
                this.deleteTargetId=item.id;
                this.isShowDialog=true;
            },
            topComment(item){
                api.topComment(item.id).then(result=>{
                    if (result.code === 20000) {
                        this.toastES(result.message,'success')
                        this.getComments()
                    }else{
                        this.toastES(result.message,'error')
                    }
                })
            },
            onPageChang(page){
                this.pageNavigation.currentPage=page;
                this.getComments()

            },
            formatDate(dataStr){
                let date=new Date(dataStr);
                return dateUtils.formatDate(date,'yyyy-MM-dd:hh:mm:ss')
            },
            getComments(){
                this.loading=true
                api.listComments(this.pageNavigation.currentPage,this.pageNavigation.pageSize).then(result=>{
                    if (result.code === 20000) {
                        this.comments=result.data.content;
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
            this.getComments()
        }
    }
</script>

<style >
    .comment-list-box .el-button{
        margin-right: 5px;
    }
</style>