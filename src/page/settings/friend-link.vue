<template>
    <!--    <div>友情链接管理</div>-->
    <div class="friendLink-box">
        <!-- 添加友情按钮       -->
        <div class="friendLink-action-bar">
            <el-button type="primary" size="mini" @click="this.showEditorLink">添加友情链接</el-button>
        </div>
        <!--    轮播图显示            -->
        <div class="friendLink-list-box">
            <el-table v-loading="loading" :data="friend_link" style="width: 90%">
                <el-table-column prop="id"  label="ID"></el-table-column>
                <el-table-column label="名字">
                    <template slot-scope="scope">
                        <a style="text-decoration: none" :href="scope.row.url">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="logo">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.logo" class="friendLink-image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==='0'"><el-tag type="danger">已删除</el-tag></span>
                        <span v-else><el-tag type="success">正常</el-tag></span>
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
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                        <el-button v-if="scope.row.state==='0'" @click="del(scope.row)" type="danger" size="mini"
                                   disabled>删除
                        </el-button>
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
                <el-button type="primary" @click="deleteLink">确 定</el-button>
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
            <div class="'friendLink-edit-box">
                <el-form>
                    <el-form-item label="标题:" required>
                        <el-input v-model="link.name" placeholder="请输入名称" required></el-input>
                    </el-form-item>
                    <el-form-item label="跳转链接:" required>
                        <el-input v-model="link.url" placeholder="请输入目标链接" required max="128"></el-input>
                    </el-form-item>
                    <el-form-item label="封面:" required>
                        <el-upload
                                class="avatar-uploader"
                                action="/admin/image/link"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                                :before-upload="beforeUpload">
                            <img v-if="link.logo!==''" :src="link.logo" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="顺序:" required>
                        <el-input-number v-model="link.order" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态:" required>
                        <el-select v-model="link.state" placeholder="选择状态">
                            <el-option label="可使用" value="1"></el-option>
                            <el-option label="不可用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editorDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="addLink">{{editorCommitText}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as api from '../../api/api'
    import * as dateUtils from '../../utils/date'

    export default {
        data() {
            return {
                friend_link: [],
                dialogVisible: false,
                deleteMessage: '',
                deleteTargetId: '',

                editorCommitText: '',
                editorDialogShow: false,
                editTitle: '',

                loading: false,
                link: {
                    id: "",
                    name: '',
                    order: '',
                    logo: '',
                    url: '',
                    state: '1'
                }
            }
        },
        methods: {
            uploadSuccess(response) {
                if (response.code === 20000) {
                    this.link.logo = this.blog_constant.baseUrl + '/portal/image/' + response.data.id;

                    this.toastES(response.message, 'success')
                } else {
                    this.toastES(response.message, 'error')
                }

            },
            beforeUpload() {

            },
            edit(item) {
                this.link.id = item.id;
                this.link.order = item.order;
                this.link.state = item.state;
                this.link.url = item.url;
                this.link.logo = item.logo;
                this.link.name = item.name;
                this.editorCommitText = '编辑';
                this.editTitle = '编辑轮播图';
                this.editorDialogShow = true;

            },
            del(item) {

                this.deleteMessage = item.name;
                this.deleteTargetId = item.id;
                this.dialogVisible = true;
            },
            formatDate(dataStr) {
                let date = new Date(dataStr);
                return dateUtils.formatDate(date, 'yyyy-MM-dd:hh:mm:ss')
            },

            deleteLink() {
                this.dialogVisible = false;
                api.deleteLink(this.deleteTargetId).then(result => {
                    if (result.code === 20000) {
                        //this.getCategories();
                        this.toastES(result.message, 'success')
                        this.getFriends()
                    }
                })
            },
            getFriends() {
                this.loading = true;
                api.listFriends().then(result => {

                    this.loading = false;
                    if (result.code === 20000) {
                        this.friend_link = result.data
                    }
                })
            },
            showEditorLink() {
                this.editorCommitText = '添加';
                this.editTitle = '添加轮播图';
                this.editorDialogShow = true;
            },
            addLink() {
                //TODO：检测数据
                if (this.link.name === '') {
                    this.toastES('标题不允许为空', 'error')
                    return;
                }
                if (this.link.url === '') {
                    this.toastES('目标链接不能为空', 'error')
                    return;
                }
                if (!this.link.url.startsWith('http://') && !this.link.url.startsWith('https://')) {
                    this.toastES('目标链接格式错误，可能导致打不开', 'error')
                    return;
                }
                if (this.link.logo === '') {
                    this.toastES('logo不能为空', 'error')
                    return;
                }

                if (this.link.id === '') {
                    api.addLink(this.link).then(result => {

                        if (result.code === 20000) {
                            this.toastES(result.message, 'success')
                            this.getFriends();
                            this.resetLink();
                        } else {
                            this.toastES(result.message, 'error')

                        }
                    })
                    this.editorDialogShow = false;
                } else {
                    api.updateLink(this.link.id, this.link).then(result => {
                        if (result.code === 20000) {
                            this.toastES(result.message, 'success')
                            this.getFriends();
                            this.resetLink();
                        } else {
                            this.toastES(result.message, 'error')

                        }
                    })
                    this.editorDialogShow = false;
                }
            },
            resetLink() {
                this.link.name = '';
                this.link.logo = '';
                this.link.lurl = '';
                this.link.state = '1';
                this.link.order = '';
            }

        },
        mounted() {
            //获取分类列表
            this.getFriends();
        }
    }
</script>

<style>
    .friendLink-list-box .cell {
        text-align: center;
    }

    .friendLink-image, .el-upload img {
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

</style>