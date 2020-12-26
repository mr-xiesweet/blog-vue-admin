exports.install = function (Vue) {

    Vue.prototype.toastES = function (msg, tf) {//全局函数1
        this.$message({
            message: msg,
            center: true,
            type: tf
        })
    };

};