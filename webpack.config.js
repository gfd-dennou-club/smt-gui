const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

// PostCss
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

const assetsManifest = require('./src/assetsManifest.json');

const STATIC_PATH = process.env.STATIC_PATH || '/static';

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: process.env.SMALRUBY3_HOST,
        disableHostCheck: true,
        port: process.env.PORT || 8601,
        open: true
    },
    output: {
        library: 'GUI',
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js'
    },
    resolve: {
        symlinks: false
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src'),
                /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                /node_modules[\\/]pify/,
                /node_modules[\\/]@vernier[\\/]godirect/
            ],
            options: {
                // Explicitly disable babelrc so we don't catch various config
                // in much lower dependencies.
                babelrc: false,
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-proposal-object-rest-spread',
                    ['react-intl', {
                        messagesDir: './translations/messages/'
                    }]],
                presets: ['@babel/preset-env', '@babel/preset-react']
            }
        },
        {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: '[name]_[local]_[hash:base64:5]'
                    },
                    importLoaders: 1,
                    localsConvention: 'camelCase'
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: function () {
                        return [
                            postcssImport,
                            postcssVars,
                            autoprefixer
                        ];
                    }
                }
            }]
        },
        {
            test: /\.hex$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 16 * 1024
                }
            }]
        }]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/
            })
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/scratch-blocks/media',
                    to: 'static/blocks-media/default'
                },
                {
                    from: 'node_modules/scratch-blocks/media',
                    to: 'static/blocks-media/high-contrast'
                },
                {
                    from: 'src/lib/themes/high-contrast/blocks-media',
                    to: 'static/blocks-media/high-contrast',
                    force: true
                }
            ]
        })
    ]
};

if (!process.env.CI) {
    base.plugins.push(new webpack.ProgressPlugin());
}

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            'lib.min': ['react', 'react-dom'],
            'gui': path.resolve(__dirname, 'src/playground/index.jsx'),
            'blocksonly': path.resolve(__dirname, 'src/playground/blocks-only.jsx'),
            'compatibilitytesting': path.resolve(__dirname, 'src/playground/compatibility-testing.jsx'),
            'player': path.resolve(__dirname, 'src/playground/player.jsx')
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|mp3|gif|jpg)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 2048,
                        outputPath: 'static/assets/'
                    }
                }
            ])
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: 'lib.min'
            },
            runtimeChunk: {
                name: 'lib.min'
            }
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
                'process.env.DEBUG': Boolean(process.env.DEBUG),
                'process.env.GA_ID': `"${process.env.GA_ID || 'UA-000000-01'}"`
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'gui'],
                template: 'src/playground/index.ejs',
                title: 'Smalruby',
                originTrials: JSON.parse(fs.readFileSync('origin-trials.json'))
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'gui'],
                template: 'src/playground/index.ejs',
                filename: 'ja.html',
                title: 'スモウルビー',
                originTrials: JSON.parse(fs.readFileSync('origin-trials.json'))
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'blocksonly'],
                template: 'src/playground/index.ejs',
                filename: 'blocks-only.html',
                title: 'Smalruby 3.0 GUI: Blocks Only Example',
                originTrials: JSON.parse(fs.readFileSync('origin-trials.json'))
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'compatibilitytesting'],
                template: 'src/playground/index.ejs',
                filename: 'compatibility-testing.html',
                title: 'Smalruby 3.0 GUI: Compatibility Testing',
                originTrials: JSON.parse(fs.readFileSync('origin-trials.json'))
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'player'],
                template: 'src/playground/index.ejs',
                filename: 'player.html',
                title: 'Smalruby 3.0 GUI: Player Example',
                originTrials: JSON.parse(fs.readFileSync('origin-trials.json'))
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'static',
                        to: 'static'
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'extensions/**',
                        to: 'static',
                        context: 'src/examples'
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'extension-worker.{js,js.map}',
                        context: 'node_modules/scratch-vm/dist/web',
                        noErrorOnMissing: true
                    }
                ]
            }),
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
                additionalManifestEntries: assetsManifest,
                exclude: [
                    /\.DS_Store/
                ],
                maximumFileSizeToCacheInBytes: 32 * 1024 * 1024
            }),
            new WebpackPwaManifest({
                name: 'Smalruby',
                short_name: 'Smalruby',
                description: 'GraphicaL User Interface for creating and running Smalruby 3.0 projects',
                background_color: '#ffffff',
                orientation: 'any',
                crossorigin: 'use-credentials',
                inject: true,
                ios: {
                    'apple-mobile-web-app-title': 'Smalruby',
                    'apple-mobile-web-app-status-bar-style': 'default'
                },
                icons: [
                    {
                        src: path.resolve('static/pwa-icon.png'),
                        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                    }
                ]
            })
        ])
    })
].concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
        // export as library
        defaultsDeep({}, base, {
            target: 'web',
            entry: {
                'smalruby3-gui': path.resolve(__dirname, 'src/index.js')
            },
            output: {
                libraryTarget: 'umd',
                path: path.resolve('dist'),
                publicPath: `${STATIC_PATH}/`
            },
            externals: {
                'react': 'react',
                'react-dom': 'react-dom'
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|mp3|gif|jpg)$/,
                        loader: 'url-loader',
                        options: {
                            limit: 2048,
                            outputPath: 'static/assets/',
                            publicPath: `${STATIC_PATH}/assets/`
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'static/javascripts/setup-opal.js',
                            to: 'static/javascripts/setup-opal.js'
                        }
                    ]
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'extension-worker.{js,js.map}',
                            context: 'node_modules/scratch-vm/dist/web',
                            noErrorOnMissing: true
                        }
                    ]
                }),
                // Include library JSON files for scratch-desktop to use for downloading
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/lib/libraries/*.json',
                            to: 'libraries',
                            flatten: true
                        }
                    ]
                })
            ])
        })) : []
);
