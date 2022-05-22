const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function (env, { analyze }) {
    const production = env.production || process.env.NODE_ENV === 'production';
    const environment = process.env.NODE_ENV ?? "development";
    return {
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "./dist"),
            filename: 'bundle.js',
        },
        resolve: {
            extensions: ['.css', '.js'],
            modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dev-app'), 'node_modules']
          },
        module: {
            rules: [
                { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset' },
                { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, type: 'asset' },
                {
                    test: /\.css$/, use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                                modules: true,
                            },
                        },
                    ],
                },
                { test: /\.ts$/, use: 'ts-loader' },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({ template: 'index.html', scriptLoading: "module" }),
            new CopyWebpackPlugin({
                patterns: [{ from: "public/" }],
            }),
            new Dotenv({
                path: `./.env${production ? '' : '.' + environment}`,
            }),
            analyze && new BundleAnalyzerPlugin()
        ].filter(p => p),
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            open: !process.env.CI,
            port: 3000,
            host: "0.0.0.0",
            client: {
                overlay: false
            }
        },
    }
}