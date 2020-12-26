import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)



// /* 内容页面*/
const manageArticle = () => import("@/page/content/manage-article");
const manageComment = () => import("@/page/content/manage-comment");
const manageImage = () => import("@/page/content/manage-image");
const postArticle= () => import("@/page/content/post-article");
// /*首页*/
const index = () => import("@/page/dashboard/index")
// /*登录*/
 const login= () => import("@/page/login/login")
// /*运营*/
const manageCategory = () => import("@/page/operate/manage-category");
const loop = () => import("@/page/operate/loop");
// /*设置*/
const info = () => import("@/page/settings/info");
const email = () => import("@/page/settings/email");
const friendLink = () => import("@/page/settings/friend-link");
const websizeInfo = () => import("@/page/settings/websize-info");
/*用户管理*/
const list = () => import("@/page/usr/list");

/*base-view*/
const baseView = () => import("@/layout/base-view");
const rightView = () => import("@/layout/right-view");


export const routes=[
    {
        path: '' ,
        component: baseView,
        children:[
            {
                path:'/index',
                name:'首页',
                icon:'el-icon-s-home',
                hidden:false,
                component:index
            },
            {
                path:'/content',
                name:'内容',
                icon:'el-icon-folder-opened',
                hidden:false,
                component:rightView,
                children:[
                    {
                        path:"manage-article",
                        name:'文章管理',
                        icon:'el-icon-document-checked',
                        hidden:false,
                        component:manageArticle
                    },
                    {
                        path: "manage-comment",
                        name:'评论管理',
                        icon:'el-icon-s-comment',
                        hidden:false,
                        component:manageComment
                    },
                    {
                        path: "manage-image",
                        name:'图片管理',
                        icon:'el-icon-picture',
                        hidden:false,
                        component:manageImage
                    },
                    {
                        path: "post-article",
                        name:'写文章',
                        icon:'el-icon-document-checked',
                        hidden:false,
                        component:postArticle
                    }
                ],

            },
            {
                path:'/dashboard',
                name:'主页（重复）',
                icon:'el-icon-s-shop',
                hidden:true,
                component:rightView,
                children:[
                    {
                        path: "index",
                        name:'主页（重复）',
                        icon:'',
                        hidden:false,
                        component:index
                    }
                ],

            },

            {
                path:'/operate',
                component:rightView,
                name:'运营',
                icon:'el-icon-s-order\n',
                hidden:false,
                children:[
                    {
                        path: "loop",
                        name:'轮播图管理',
                        icon:'el-icon-loading',
                        hidden:false,
                        component:loop
                    },
                    {
                        path: "manage-category",
                        name:'分类管理',
                        icon:'el-icon-s-cooperation',
                        hidden:false,
                        component:manageCategory
                    }
                ],

            },
            {
                path:'/setting',
                component:rightView,
                name:'设置',
                icon:'el-icon-s-tools',
                hidden:false,
                children:[
                    {
                        path: "email",
                        name:'邮箱管理',
                        icon:'el-icon-postcard',
                        hidden:false,
                        component:email
                    },
                    {
                        path: "info",
                        name:'管理员信息',
                        icon:'el-icon-user-solid',
                        hidden:false,
                        component:info
                    },
                    {
                        path: "friend-link",
                        name:'友情链接',
                        icon:'el-icon-link',
                        hidden:false,
                        component:friendLink
                    },
                    {
                        path: "websize-info",
                        name:'网站信息',
                        icon:'el-icon-info',
                        hidden:false,
                        component:websizeInfo
                    }
                ],

            },
            {
                path:'/user',
                component:rightView,
                name:'用户',
                icon:'el-icon-user',
                hidden:false,
                children:[
                    {
                        path: "list",
                        name:'例举用户',
                        icon:'el-icon-more\n',
                        hidden:false,
                        component:list
                    }
                ],

            },
        ]
    },
    {
        path:"/login",
        component:login
    }

];
const router = new VueRouter({
    routes
})

export default router;