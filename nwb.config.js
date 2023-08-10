process.env.CHROME_BIN = require('puppeteer').executablePath();

const ESLintPlugin = require('eslint-webpack-plugin');
const myEslintOptions = {
    extensions: [`js`],
    exclude: [`node_modules`],
};

var extraWebpackConfig = {
    plugins: [new ESLintPlugin(myEslintOptions)],
};

module.exports = {
    type: 'react-component',
    karma: {
        browsers: ['ChromeHeadless'],
        testContext: 'tests.webpack.js',
    },
    npm: {
        cjs: false,
        umd: false,
    },
    webpack: {
        extra: extraWebpackConfig,
    },
};
