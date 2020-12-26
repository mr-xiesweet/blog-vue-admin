import http from './http';


/***分类管理****/
//解析token
export const checkToken =()=>{
    return http.requestGet('/user/check-token')
};
export const doLogin =(verifyCode,captcha_key,sobUser)=>{
    return http.requestPost('/user/login/'+verifyCode+'/'+captcha_key,sobUser)
}
export const listCategories =()=>{
    return http.requestGet('/admin/category/list')
}
export const deleteCategories =(categoryId)=>{
    return http.requestDelete('/admin/category/'+categoryId)
}
export const addCategories =(category)=>{
    return http.requestPost('/admin/category',category)
}
export const updateCategories =(categoryId,category)=>{
    return http.requestPut('/admin/category/'+categoryId,category)
}
/***轮播图管理****/
export const listLoops =()=>{
    return http.requestGet('/admin/loop/list')
}
export const addLoop =(loop)=>{
    return http.requestPost('/admin/loop',loop)
}
export const updateLoop =(loopId,loop)=>{
    return http.requestPut('/admin/loop/'+loopId,loop)
}
export const deleteLoop =(loopId)=>{
    return http.requestDelete('/admin/loop/'+loopId)
}
/*用户管理*/
export const listUser = (page,size)=>{

    return http.requestGet('/user/list?page='+page+'&size='+size)
}
export const doUserSearch =(userName,email)=>{
    return http.requestGet('/user/list?email='+email+'&page=1&size=10&userName='+userName)
}
export const deleteUser =(UserId,state)=>{///user/id/state
    return http.requestDelete('/user/'+UserId+'/'+state)
}
export const retUserPassword =(userId,password)=>{///user/ret_password/sd?password=sd
    return http.requestPut('/user/reset-passoword/'+userId+'?password='+password)
}
// 设置
export const getVerifyCode =(emailAddress,type)=>{// /user/verify_code?email=d&type=d
    //return http.requestGet('/user/verify_code?email='+emailAddress+'&type='+type);
    return http.requestGet('/user/verify_code?type='+type+'&email='+emailAddress);
}
export const updateEmail =(emailAddress,verify_code)=>{// /user/email?email=3214454493%40qq.com&verify_code=874846

    return http.requestPut('/user/email?email='+emailAddress+'&verify_code='+verify_code);
}
export const updateUserInfo =(userId,user)=>{// /user/email?email=3214454493%40qq.com&verify_code=874846
    return http.requestPut('/user/user_info/'+userId,user);
}
export const getWebSeo =()=>{
    return http.requestGet('/portal/web_size_info/seo');
}
export const getWebTitle =()=>{
    return http.requestGet('/portal/web_size_info/title');
}
export const updateWebSeo =(description,keyword)=> {
    return http.requestPut('/admin/web_size_info/seo?keywords='+keyword+'&description='+description);
}
export const updateWebTitle =(title)=>{
    return http.requestPut('/admin/web_size_info/title?title='+title);
}
// 友情链接管理
export const listFriends =()=>{
    return http.requestGet('/admin/friend_link/list')
}
export const addLink =(link)=>{
    return http.requestPost('/admin/friend_link',link)
}
export const updateLink =(linkId,link)=>{
    return http.requestPut('/admin/friend_link/'+linkId,link)
}
export const deleteLink =(linkId)=>{
    return http.requestDelete('/admin/friend_link/'+linkId)
}
//列举照片
export const listImages =(page,size)=>{
    return http.requestGet('/admin/image/list/'+page+'/'+size)
}
//增加文章
export const addArticle =(article)=>{
    return http.requestPost('/admin/article',article)
}


//文章搜索
export const listArticle =(page,size,state ,keyword,categoryId)=>{
    return http.requestGet('/admin/article/list/'+page+'/'+size+"?state="+state+'&keyword='+keyword+'&categoryId='+categoryId)
}
//设置文章删除状态
export const deleteArticle =(articleId)=>{//admin/article/state/dfd
    return http.requestDelete('/admin/article/state/'+articleId)
}
export const topArticle =(articleId)=>{//admin/article/state/dfd
    return http.requestPut('/admin/article/top/'+articleId)
}
//获取单篇文章
export const getArticle =(articleId)=>{//admin/article/state/dfd
    return http.requestGet('/admin/article/'+articleId)
}
//更新文章信息
export const updateArticle =(articleId,article)=>{//admin/article/state/dfd
    return http.requestPut('/admin/article/'+articleId,article)
}
//获取评论列表
export const listComments =(page,size)=>{//?page=1&size=2
    return http.requestGet('/admin/comment/list/'+page+'/'+size)
}
//删除评论
export const delComment =(commentId)=>{//admin/article/state/dfd
    return http.requestDelete('/admin/comment/'+commentId)
}
//顶置评论
export const topComment =(commentId)=>{//admin/article/state/dfd
    return http.requestPut('/admin/comment/top/'+commentId)
}
//删除照片
export const deleteImage =(imageId)=>{//admin/article/state/dfd
    return http.requestDelete('/admin/image/'+imageId)
}
export const deleteImageState =(imageId)=>{//admin/article/state/dfd
    return http.requestDelete('/admin/image/state/'+imageId)
}
//根据来源列举图片
export const listImagesOriginal =(page,size,original)=>{
    return http.requestGet('/admin/image/list/'+page+'/'+size+'?original='+original)
}
//退出登录
export const logout =()=>{
    return http.requestGet('/user/logout')
}

//获取数量

export const getRegisterSize =()=>{
    return http.requestGet('/admin/web_size_info/user_count')
}
export const getArticleSize =()=>{
    return http.requestGet('/admin/web_size_info/article_count')
}
export const getCommentSize =()=>{
    return http.requestGet('/admin/web_size_info/comment_count')
}
export const getWebSize =()=>{
    return http.requestGet('/admin/web_size_info/view_count')
}