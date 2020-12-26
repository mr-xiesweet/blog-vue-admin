<template>
    <!--    <div>轮播图管理</div>-->
    <div class="loop-box">
        <!-- 添加轮播图按钮       -->
        <div class="loop-action-bar">
            <el-button type="primary" size="mini" @click="this.showEditorloop">添加轮播图</el-button>
        </div>
        <!--    轮播图显示            -->
        <div class="loop-list-box">
            <el-table
                    v-loading="loading"
                    :data="loops"
                    style="width: 90%">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column label="标题">
                    <template slot-scope="scope">
                        <a class="loop-title" :href="scope.row.targetUrl">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column  label="轮播图">
                    <template slot-scope="scope">
                       <el-image :src="scope.row.imageUrl" class="loop-image"></el-image>

                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state==='0'" type="danger" >已删除</el-tag>
                        <el-tag v-else type="success">正常</el-tag>
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
                        <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                        <el-button v-if="scope.row.state==='0'" @click="del(scope.row)" type="danger" size="mini" disabled>删除</el-button>
                        <el-button v-else @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--删除轮播图-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <span>你确定要删除:{{deleteMessage}}吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteLoop">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加轮播图-->
        <el-dialog
                :title='editTitle'
                :visible.sync="editorDialogShow"
                :close-on-click-modal=false
                :close-on-press-escape=false
                class="loop-dialog-box"
                width="500px"
                center>
            <div class="'loop-edit-box" >
                <el-form >
                    <el-form-item label="标题:" required>
                        <el-input v-model="loop.title" placeholder="请输入标题" required></el-input>
                    </el-form-item>

                    <el-form-item label="跳转链接:" required>
                        <el-input v-model="loop.targetUrl" placeholder="请输入目标链接" required max="128"></el-input>
                    </el-form-item>

                    <el-form-item label="封面:" required>
                        <el-upload
                                class="avatar-uploader"
                                action="/admin/image/loop"
                                :show-file-list="false"
                                :on-success="uploadSuccess">
                            <img v-if="loop.imageUrl!==''" :src="loop.imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="顺序:" required>
                        <el-input-number v-model="loop.order"  :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态:" required>
                        <el-select v-model="loop.state" placeholder="选择状态" >
                            <el-option label="可使用" value="1" ></el-option>
                            <el-option label="不可用" value="0" ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editorDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="addLoop" >{{editorCommitText}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as api from '../../api/api'
    import * as dateUtils from '../../utils/date'
    export default {
        data(){
            return{
                loops:[],
                dialogVisible:false,
                deleteMessage:'',
                deleteTargetId:'',

                editorCommitText:'',
                editorDialogShow: false,
                editTitle:'',

                loading:false,
                loop:{
                    id:"",
                    title:'',
                    order:'0',
                    targetUrl:'',
                    imageUrl:'',
                    state:'1'
                }
            }
        },
        methods:{
            uploadSuccess(response){
                if (response.code === 20000) {

                    this.loop.imageUrl='/portal/image/'+response.data.id;
                    this.toastES(response.message,'success')
                }else{
                    this.toastES(response.message,'error')
                }

            },
            /*数据回显*/
            edit(item){
                this.loop.id=item.id;
                this.loop.order=item.order;
                this.loop.state=item.state;
                this.loop.targetUrl=item.targetUrl;
                this.loop.imageUrl=item.imageUrl;
                this.loop.title=item.title;
                this.editorCommitText='编辑';
                this.editTitle='编辑轮播图' ;
                this.editorDialogShow=true;
                //this.addCategory();

            },
            /*
            * 删除轮播图 */
            del(item){

                this.deleteMessage=item.name;
                this.deleteTargetId=item.id;
                this.dialogVisible=true;
            },
            formatDate(dataStr){
                let date=new Date(dataStr);
                return dateUtils.formatDate(date,'yyyy-MM-dd:hh:mm:ss')
            },

            deleteLoop(){
                this.dialogVisible = false;
                api.deleteLoop(this.deleteTargetId).then(result=>{
                    if (result.code === 20000) {
                        //this.getCategories();
                        this.toastES(result.message,'success')
                        this.getLoops()
                    }
                })
            },
            getLoops(){
                this.loading=true;
                api.listLoops().then(result=>{

                    this.loading=false;
                    if (result.code === 20000) {
                        this.loops=result.data
                        console.log(this.loops)
                    }
                })
            },
            showEditorloop(){

                this.editorCommitText='添加';
                this.editTitle='添加轮播图' ;
                this.editorDialogShow=true;

            },
            addLoop(){

                //TODO：检测数据
                if (this.loop.title === '') {
                    this.toastES('轮播图标题不允许为空','error')
                    return;
                }
                if (this.loop.targetUrl === '') {
                    this.toastES('目标链接不能为空','error')
                    return;
                }
                if (!this.loop.targetUrl.startsWith('http://') && !this.loop.targetUrl.startsWith('https://')) {
                    this.toastES('目标链接格式错误，可能导致打不开','error')
                    return;
                }
                if (this.loop.imageUrl=== '') {
                    this.toastES('轮播图图片不能为空','error')
                    return;
                }

                if (this.loop.id === '') {
                    api.addLoop(this.loop).then(result=>{

                        if (result.code === 20000) {
                            this.toastES(result.message,'success')
                            this.getLoops();
                            this.resetLoop();
                        }
                    })
                    this.editorDialogShow = false;
                }else{
                    api.updateLoop(this.loop.id ,this.loop).then(result=>{
                        if (result.code === 20000) {
                            this.toastES(result.message,'success')
                            this.getLoops();
                            this.resetLoop();
                        }
                    })
                    this.editorDialogShow = false;
                }
            },
            resetLoop(){
                this.loop.title='';
                this.loop.targetUrl='';
                this.loop.imageUrl='';
                this.loop.state='1';
                this.loop.order='1';
            }

        },
        mounted() {
            //获取分类列表
            this.getLoops();
        }
    }
</script>

<style >
    .loop-list-box .cell{
        text-align: center;

    }
    .loop-list-box{
        overflow: auto ;
    }
    .loop-image, .el-upload img{
        width: 100px;
        height: 100px;
        padding: 4px;
        border-radius: 4px;
        border: #EDEDED solid 1px;
    }
    .loop-dialog-box .avatar-uploader .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        border-radius: 4px;
        border: #EDEDED solid 1px;
    }
    .loop-title{
        text-decoration: none;
    }

</style>