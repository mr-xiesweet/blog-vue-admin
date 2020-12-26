<template>
<!--    <div>分类管理</div>-->
    <div class="category-box">
        <div class="category-action-bar">
            <el-button type="primary" size="mini" @click="this.showEditorCategory">添加分类</el-button>
        </div>
        <div class="category-list-box">
            <el-table
                    v-loading="loading"
                    :data="categories"
                    style="width: 90%">
                <el-table-column fixed prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="分类名称"></el-table-column>
                <el-table-column prop="pinyin" label="拼音"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==='1'"><el-tag type="success" >正常</el-tag></span>
                        <span v-if="scope.row.status==='0'"><el-tag type="danger">已删除</el-tag></span>
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
                <el-table-column label="操作" >
                    <template slot-scope="scope" >
                        <el-button @click="edit(scope.row)" type="primary" size="mini" >编辑</el-button>
                        <el-button v-if="scope.row.status==='0'" @click="del(scope.row)" type="danger" size="mini" disabled>删除</el-button>
                        <el-button v-if="scope.row.status==='1'" @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--删除分类-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <span>你确定要删除:{{deleteMessage}}吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteCategory">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加分类-->
        <el-dialog
                :title='editTitle'
                :visible.sync="editorDialogShow"
                :close-on-click-modal=false
                :close-on-press-escape=false
                width="500px"
                center>
            <div class="'catagory-edit-box">
                 <el-form >
                     <el-form-item label="分类名:" required>
                         <el-input v-model="category.name" placeholder="请输入分类名" required></el-input>
                     </el-form-item>
                     <el-form-item label="描述:" required>
                         <el-input v-model="category.description" placeholder="请输入描述内容" required max="128"></el-input>
                     </el-form-item>
                     <el-form-item label="拼音:" required>
                         <el-input v-model="category.pinyin" placeholder="请输入拼音" required></el-input>
                     </el-form-item>
                     <el-form-item label="顺序:" required>
                         <el-input-number v-model="category.order"  :min="1" :max="100"></el-input-number>
                     </el-form-item>
                     <el-form-item label="状态:" required>
                         <el-select v-model="category.status" placeholder="选择状态">
                             <el-option label="可使用" value="1"></el-option>
                             <el-option label="不可用" value="0"></el-option>
                         </el-select>
                     </el-form-item>
                 </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editorDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="addCategory">{{editorCommitText}}</el-button>
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
                categories:[],
                dialogVisible:false,
                deleteMessage:'',
                deleteTargetId:'',

                editorCommitText:'',
                editorDialogShow: false,
                editTitle:'',

                loading:false,
                category:{
                    id:"",
                    name:'',
                    order:'0',
                    pinyin:'',
                    description:'',
                    status:'1'
                }
            }
        },
        methods:{
            edit(item){
                this.category.id=item.id;
                this.category.order=item.order;
                this.category.status=item.status;
                this.category.description=item.description;
                this.category.name=item.name;
                this.category.pinyin=item.pinyin;
                this.editorCommitText='编辑';
                this.editTitle='编辑分类' ;
                this.editorDialogShow=true;
                //this.addCategory();

            },
            del(item){

                this.deleteMessage=item.name;
                this.deleteTargetId=item.id;
                this.dialogVisible=true;
            },
            formatDate(dataStr){
                let date=new Date(dataStr);
                return dateUtils.formatDate(date,'yyyy-MM-dd:hh:mm:ss')
            },

            deleteCategory(){
                this.dialogVisible = false;
                api.deleteCategories(this.deleteTargetId).then(result=>{
                    if (result.code === 20000) {
                        //this.getCategories();
                        this.toastES(result.message,'success')
                        this.getCategories()
                    }
                })
            },
            getCategories(){
                this.loading=true;
                api.listCategories().then(result=>{

                    this.loading=false;
                    if (result.code === 20000) {
                        this.categories=result.data
                    }
                })
            },
            showEditorCategory(){
                this.editorCommitText='添加';
                this.editTitle='添加分类' ;
                this.editorDialogShow=true;
            },
            addCategory(){

                //TODO：检测数据
                if (this.category.name === '') {
                    this.toastES('分类名字不允许为空','error')
                    return;

                }
                if (this.category.description === '') {
                    this.toastES('描述不能为空','error')
                    return;
                }
                if (this.category.pinyin=== '') {
                    this.toastES('拼音不能为空','error')
                    return;
                }
                if (this.category.id === '') {
                    api.addCategories(this.category).then(result=>{

                        if (result.code === 20000) {
                            this.toastES(result.message,'success')
                            this.getCategories();
                            this.resetCategories();
                        }
                    })
                    this.editorDialogShow = false;
                }else{
                    api.updateCategories(this.category.id ,this.category).then(result=>{
                        if (result.code === 20000) {
                            this.toastES(result.message,'success')
                            this.getCategories();
                            this.resetCategories();
                        }
                    })
                    this.editorDialogShow = false;
                }
            },
            resetCategories(){
                this.category.pinyin='';
                this.category.description='';
                this.category.name='';
                this.category.status='1';
                this.category.order='1';
            }

        },
        mounted() {
            //获取分类列表
          this.getCategories();
        }
    }
</script>

<style >
    .category-list-box .cell{
        text-align: center;
    }
    .category-list-box {
        overflow: auto ;
    }

</style>