const path = require('path');

module.exports = {
    entry: './lib/main.js',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
