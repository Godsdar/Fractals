const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FilemanagerWebpackPlugin = require("filemanager-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = {
	entry: path.resolve(__dirname, "src", "index.js"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "template.html"),
			filename: "index.html"
		}),
		new FilemanagerWebpackPlugin({
			events: {
				onStart: {
					delete: ["dist"]
				}
			},
		}),
	],
	devServer: {
		watchFiles: path.resolve(__dirname, "src"),
		open: true
	}
};

module.exports = config;

