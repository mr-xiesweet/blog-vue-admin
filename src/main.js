import Vue from 'vue'
import App from './App.vue'
import router from "./router";
/*饿了么ui*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.component('leftMenu',leftMenu);
Vue.component('topHeader',topHeader);
//编辑器
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// // use
// Vue.use(mavonEditor)
//
//const axios= require('axios')
//全局常量
import constants from "./utils/constants";
Vue.prototype.blog_constant=constants
//
import base from "./utils/allFunction"
Vue.use(base);//将全局函数当做插件来进行注册


import Plugin from 'v-fit-columns';
Vue.use(Plugin);


import {checkToken} from './api/api';
router.beforeEach((to,from,next)=>{

      if(to.path ==='/login'){
        next();
      }else{
        //axios.get('/user/text')
          checkToken().then(result =>{
          let res=result;
          if (res.code === 20000) {
              //保存头像与用户名，提供显示
              window.localStorage.setItem('avatar',result.data.avatar)
              window.localStorage.setItem('userName',result.data.userName)
            if (res.data.roles === 'role_admin') {
              next()
            }else{
              location.href='https://www.sunofbeach.net'
            }
          }else {
            next({
              path: '/login'
            })
          }
        })
      }
      next();
    });

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
