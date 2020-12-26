module.exports = {
    devServer: {
        host:'localhost',
        port:2030,
        proxy: {
            '/user/':{
                target: 'http://localhost:2020/',
                changeOrigin: true,
            },
            '/admin':{
                target: 'http://localhost:2020/',
                changeOrigin: true,
                
            },
            '/portal':{
                target: 'http://10.0.4.9:2020/',
                changeOrigin: true,
            }
        }
    }
};