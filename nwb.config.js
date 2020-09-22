process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = {
    type: 'react-component',
    karma: {
        browsers: ['ChromeHeadless'],
    },
    npm: {
        esModules: false,
        umd: false,
    },
};
