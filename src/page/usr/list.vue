<template xmlns:font-family="http://www.w3.org/1999/xhtml">
    <div class="user-box">
        <!--  用户搜索    -->
        <div class="user-action-bar">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="用户名：">
                    <el-input v-model="search.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="search.email" placeholder="邮箱"></el-input>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="this.doUserSearch">查询</el-button>
                    <el-button type="primary" @click="this.cleanSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--        用户列表-->
        <div class="user-list-box">
            <el-table
                    v-loading="loading"
                    :data="users"
                    border
                    style="width:95%"
                    max-height="800px">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="170">
                </el-table-column>
                <el-table-column
                        label="头像"
                        width="100">
                    <template slot-scope="scope">
                        <!--                         <el-image :src="" class="user-image"></el-image>-->
                        <el-avatar shape="square" :src="scope.row.avatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                        label="签名"
                        width="245">
                    <template slot-scope="scope">
                        <div v-if="scope.row.sign">
                            <span v-text="scope.row.sign"></span>
                        </div>
                        <div v-else>
                            <span>这人很懒，没有留下任何东西</span>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="70">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state==='0'" type="danger">已删除</el-tag>
                        <el-tag v-else type="success">正常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="创建时间"
                        width="160">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="更新时间"
                        width="160">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="ret_p(scope.row)" type="primary" size="mini">重置密码</el-button>

                        <el-button v-if="scope.row.state==='0'" @click="edit(scope.row)" size="mini">恢复</el-button>
                        <el-button v-else @click="edit(scope.row)" type="danger" size="mini">删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--  用户列表换页尾部       -->
        <div class=" margin-padding-20">
            <el-pagination
                    class="list-box-navigation"
                    background
                    layout="prev, pager, next"
                    @current-change="onPageChang"
                    :pageSize="pageNavigation.pageSize"
                    :total="pageNavigation.totalCount"
                    :current-page="pageNavigation.currentPage"
            >
            </el-pagination>
        </div>
        <!--重置密码-->
        <el-dialog
                title="提示 "
                :visible.sync="dialogVisible"
                width="30%">
            <el-form status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div style="font-family: Helvetica Neue ; margin-bottom: 10px;" >修改&nbsp;<el-link type="info" disabled>{{ret.retUserName}}</el-link>&nbsp;的密码 </div>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ret.tarPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ret.checkPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="retPassword(ret.tarPassword,ret.checkPassword,ret.deleteTargetId)"
                               type="primary">提交
                    </el-button>
                    <el-button @click="clearContent">清空</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 删除用户-->
        <el-dialog
                :title='editTitle'
                :visible.sync="editorDialogShow"
                :close-on-click-modal=false
                :close-on-press-escape=false
                class="user-dialog-box"
                width="500px"
                center>
            <div class="'user-edit-box">
                <el-form>
                    <el-form-item label="用户名:">
                        <el-input v-model="search.userName" placeholder="请输入用户名" disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="头像:">
                        <img v-if="user.avatar!==''" :src="user.avatar" class="avatar">
                    </el-form-item>
                    <el-form-item label="email:">
                        <el-input v-model="user.email" placeholder="请输入邮箱" disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:" required>
                        <el-select v-model="user.state" placeholder="选择状态">
                            <el-option label="可使用" value="1"></el-option>
                            <el-option label="不可用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editorDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="editUser">{{editorCommitText}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import * as api from '../../api/api'
    import * as dateUtils from '../../utils/date'
    //import * as md5 from '../../utils/md5'

    export default {
        data() {
            return {
                users: [],
                //是否让弹框出现
                dialogVisible: false,

                editorCommitText: '',
                editorDialogShow: false,
                editTitle: '',

                loading: false,
                user: {
                    id: "",
                    userName: '',
                    roles: '',
                    avatar: '',
                    email: '',
                    sign: '',
                    state: ''
                },
                pageNavigation: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 3
                },
                search: {
                    email: '',
                    userName: ''
                },
                ret: {
                    tarPassword: '',
                    checkPassword: '',
                    //更改密码页面的标题
                    retMessage: '',
                    //更改密码的用户的id
                    retTargetId: '',
                    retUserName:'',
                }

            }
        },
        mounted() {
            //获取分类列表
            this.getUsers();

        },
        methods: {
            clearContent() {
                this.ret.tarPassword = '';
                this.ret.checkPassword = ''
            },
            retPassword(tp, cp, rip) {
                // this.dialogVisible=false;
                //this.toastES('后端api带设置','error')

                if (tp===''){
                    this.toastES("密码不可为空", 'error')
                    return;
                }
                if (tp !== cp) {
                    this.toastES("密码不一致", 'error')
                    return;
                } else {
                   // tp = md5.hex_md5(tp);
                    api.retUserPassword(rip, tp).then(result => {
                        if (result.code === 20000) {
                            this.dialogVisible = false;
                            this.clearContent()
                            this.toastES("重置成功", 'success')
                        } else {
                            this.toastES("失败" + result.code, 'error')

                        }
                    })
                }
            },

            edit(item) {
                this.deleteTargetId = item.id
                this.search.userName = item.userName;
                this.user.roles = item.role;
                this.user.avatar = item.avatar;
                this.user.email = item.email;
                this.user.sign = item.sign;
                this.user.state = item.state;
                this.editorCommitText = '编辑';
                this.editTitle = '修改权限';
                this.editorDialogShow = true;
                // this.addUser();

            },
            ret_p(item) {

                this.ret.deleteMessage = item.name;
                this.ret.deleteTargetId = item.id;
                this.ret.retUserName = item.userName;
                this.dialogVisible = true;
            },
            editUser() {
                this.editorDialogShow = false;
                // if (this.user.state==='1') {
                //     this.user.state='0'
                // }else {
                //     this.user.state='1'
                // }
                api.deleteUser(this.deleteTargetId, this.user.state).then(result => {
                    if (result.code === 20000) {
                        //this.getCategories();
                        this.toastES(result.message, 'success')
                        this.getUsers()
                    }
                })
            },
            getUsers() {
                api.listUser(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
                    this.loading = false;
                    //处理结果
                    this.handleListUserResult(result);
                });
            },

            formatDate(dataStr) {
                let date = new Date(dataStr);
                return dateUtils.formatDate(date, 'yyyy-MM-dd:hh:mm:ss')
            },
            doUserSearch() {
                if (this.search.userName === '' && this.search.email === '') {
                    this.users = [];
                } else {
                    api.doUserSearch(this.search.userName, this.search.email).then(result => {
                        this.handleListUserResult(result)
                    })
                }
            },
            cleanSearch() {
                this.search.userName = '';
                this.search.email = '';
                this.getUsers();
            },
            handleListUserResult(result) {
                if (result.code === 20000) {

                    this.users = result.data.content;
                    this.pageNavigation.currentPage = result.data.number + 1;
                    this.pageNavigation.totalCount = result.data.totalElements;
                    this.pageNavigation.pageSize = result.data.size;
                    // this.toastES(result.message,'success')
                }
            },
            onPageChang(page) {
                this.pageNavigation.currentPage = page;
                this.getUsers();
            }
        }
    }
</script>

<style>
 .user-list-box .cell {
     text-align: center;

 }
</style>