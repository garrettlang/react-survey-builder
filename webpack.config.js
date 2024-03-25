var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  // devtool: 'source-map',
  output: {
    path: path.resolve('./public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json'],
    alias: {
      "jquery": path.join(__dirname, "./jquery-stub.js")
    }
  },
  plugins: [
    //
  ],

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$|.jsx?$/,
        use: [
          { loader: 'babel-loader' }
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader', 
            options: {
              sassOptions: {
                includePaths: ['./node_modules'],
              },
            }
          }
        ]
      },
    ]
  },
  devServer: {
    port: 8080,
    host: "localhost",
	allowedHosts: "all", // This will bypass host check for local IP
	historyApiFallback: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    static: {
		directory: path.join(__dirname, "./public"),
		watch: {
			options: {
				aggregateTimeout: 300,
				poll: 1000
			}
		}
	},
    open: true,
    proxy: {
      "/api/*": "http://127.0.0.1:5005"
    }
  }
};
