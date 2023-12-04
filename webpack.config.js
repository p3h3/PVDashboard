const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry : "./src/index.js",
    mode: "development",
    output : {
        path: resolve(__dirname, "dist"),
        filename: "main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [
                    "html-loader"
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'paho-mqtt': resolve(
                __dirname,
                'node_modules/paho-mqtt/paho-mqtt.js'
            ),
        },
    },
}