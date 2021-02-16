/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
    const options = {
        entry: './src/ts/main.ts',
        plugins: [
            new HtmlWebpackPlugin({
                cleanStaleWebpackAssets: false,
                template: './src/views/index.ejs',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                }
            }),
            new CleanWebpackPlugin()
        ],
        module: {
            rules: [
                {
                    test: /\.ejs$/,
                    use: [
                        'html-loader',
                        {
                            loader: 'ejs-html-loader',
                            options: {
                                context: {}
                            }
                        }
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: env.development
                                ? {
                                      sourceMap: true,
                                      importLoaders: 2
                                  }
                                : {}
                        },
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(pdf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                publicPath: 'res/'
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: (url) =>
                                    url.slice(url.indexOf('img\\') + 4).replace(/\\/g, '/'),
                                outputPath: (url) => `img/${url}`,
                                publicPath: 'img/'
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            pathinfo: false
        },
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
            usedExports: true
        }
    };

    if (env.development) {
        options['devServer'] = {
            contentBase: './dist',
            watchContentBase: true,
            hot: true,
            port: 9000,
            open: true
        };
        options['mode'] = 'development';
        options['devtool'] = 'eval-source-map';
    } else {
        options['mode'] = 'production';
        options['devtool'] = 'source-map';
    }

    return options;
};
