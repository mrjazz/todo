module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'es5-shim'],
        browsers: ['PhantomJS'],
        reporters: ['dots'],
        files: [
            './test/**/*.spec.*'
        ],
        preprocessors: {
           './test/**/*.spec.*': ['webpack']
        },
        webpack: {
            module: {
                loaders: [{
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015'],
                        plugins: ['rewire']
                    }
                }]
            }
        },
        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-es5-shim'),
            require('karma-firefox-launcher'),
            require('karma-phantomjs-launcher')
        ],
        webpackServer: {
            noInfo: true
        }
    });
};
