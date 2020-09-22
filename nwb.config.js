process.env.CHROME_BIN = require('puppeteer').executablePath();

var extraWebpackConfig = {
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
    },
};

module.exports = {
    type: 'react-component',
    karma: {
        browsers: ['ChromeHeadless'],
    },
    npm: {
        esModules: false,
        umd: false,
    },
    webpack: {
        extra: extraWebpackConfig,
    },
};
