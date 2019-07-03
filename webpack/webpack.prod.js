const merge = require('webpack-merge');
const common = require('./webpack.common');
const OfflinePlugin = require('offline-plugin');

const path = require('path');
const rootDir = path.resolve(process.env.PWD);

const package_json = require(path.resolve(rootDir, './package.json'));

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
    const version = (env && env.VERSION) || package_json.version;
    const build = (env && env.BUILD) || (new Date().toISOString().replace(/[\-\:T]|(\.[0-9]{3}Z)/g, ''));

    const versionName = version + '-' + build;


    return merge(common, {
        mode: 'production',

        output: {
            filename: '[name].' + versionName + '.[hash:5].bundle.js'
        },

        plugins: [
            new MiniCssExtractPlugin(
                {
                    filename: '[name].' + versionName + '.[hash:5].bundle.css'
                }
            ),
            new OfflinePlugin()
        ]
    });
};