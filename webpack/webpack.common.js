const path = require('path');
const rootDir = path.resolve(process.env.PWD);

const webpack = require('webpack');
const package_json = require(path.resolve(rootDir, './package.json'));

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const appPublicPath = (package_json.app && package_json.app.publicPath) || '/';

const outputDir = path.resolve(rootDir, 'build' + appPublicPath);

module.exports = {
    entry: {
        app: path.resolve(rootDir, 'src/index.tsx')
    },

    output: {
        publicPath: appPublicPath,
        path: outputDir
    },

    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx'
        ]
    },
    module: {
        rules: [
            {
                test: [
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                    /\.svg$/
                ],
                loader: 'file-loader',
                options: {
                    outputPath: 'static/media',
                    name: '[name].[hash:5].[ext]'
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/fonts',
                            name: '[name].[hash:5].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(ts|tsx)$/,
                // exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            sourceMap: true,
                            // localIdentName: '[name]__[local]__[hash:base64:5]'
                            localIdentName: '[name]__[local]'
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'css-hot-loader'
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            sourceMap: true,
                            localIdentName: '[name]__[local]__[hash:base64:5]'
                            // localIdentName: '[local]'
                        },
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin([outputDir], {
            root: rootDir
        }),
        new ForkTsCheckerWebpackPlugin({
            silent: true,
            async: false,
            watch: path.resolve(rootDir, 'src'),
            tsconfig: path.resolve(rootDir, 'tsconfig.json'),
            tslint: path.resolve(rootDir, 'tslint.json')
        }),
        new HtmlWebPackPlugin(
            {
                filename: 'index.html',
                template: path.resolve(rootDir, 'public/index.html'),
                favicon: path.resolve(rootDir, 'public/favicon.ico')
            }
        ),
        new CopyWebpackPlugin([
            { from: 'public', to: '.' },
        ]),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /ru/
        )
    ],

    performance: {
        hints: false,
    },

    stats: {
        // chunks: false,
        // chunkGroups: false,
        // chunkModules: false,
        // chunkOrigins: false,
        entrypoints: false,
        // depth: false,
        // maxModules: 0,
        modules: false,
        // performance: false
    },

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name(module) {
                        const packageName = module.context.match(/node_modules\/(.*?)(\/|$)/)[1];
                        return `vendor/npm.${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    }
};