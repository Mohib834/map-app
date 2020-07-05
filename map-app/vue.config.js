
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

///////////////////////////////////////////////////////////////////
// USE ONLY APPLUES FOR DEV SERVER TESTING when using npm run serve

//const USE_LOCAL_SERVER_FOR_DEVELOPMENT = true;  //  use a local service
const USE_LOCAL_SERVER_FOR_DEVELOPMENT = false;   //  cloud service which has nginx that redirects via /clientsocket


let _host;
if(USE_LOCAL_SERVER_FOR_DEVELOPMENT){
    _host = 'http://localhost:3000';
}
else{
    _host =  'https://www.makemapart.com';

}

///////////////////////////////////////////////////////////////////


// vue.config.js
module.exports = {
    chainWebpack: (config) => {
        config.plugins.delete('prefetch');        
        config.plugin('CompressionPlugin').use(CompressionPlugin)
    },
    // options...
    devServer: {
      disableHostCheck: true,   // https://stackoverflow.com/questions/43619644/i-am-getting-an-invalid-host-header-message-when-running-my-react-app-in-a-we
      compress: true,
        port: 9000,
        proxy: {
            '/api/*': {
                target: _host,
                changeOrigin: true,
                secure: false,
                headers: {
                    Connection: 'keep-alive',
                },
            },
            '/clientsocket/*': {
                target: _host,
                pathRewrite: {'^/clientsocket' :  (USE_LOCAL_SERVER_FOR_DEVELOPMENT) ? '/' : '/clientsocket'},
                ws: true,
                changeOrigin: true,
            }

        }
    },

    //https://github.com/vuejs/vue-cli/issues/2675
    configureWebpack: {
        resolve: {
            symlinks: false
        },
        optimization: {
            runtimeChunk: true,
        },
        plugins: [
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new BundleAnalyzerPlugin()
        ]
    },

    lintOnSave: false,
    baseUrl: undefined,
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: undefined,
    parallel: undefined,

    css: {
      extract: false
    }
};