var path = require('path');
var webpack = require('webpack');

module.exports = {
	//mode: 'production',
	entry: './src/index.jsx',
	//devtool: "source-map",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		// library: 'ReactSurveyBuilder',
		// libraryTarget: 'umd',
		// umdNamedDefine: true,
	},
	// externals: {
	// 	//don't bundle the 'react' npm package with our bundle.js
	// 	//but get it from a global 'React' variable
	// 	'react': {
	// 		'commonjs': 'react',
	// 		'commonjs2': 'react',
	// 		'amd': 'react',
	// 		'root': 'React'
	// 	},
	// 	'react-dom': {
	// 		'commonjs': 'react-dom',
	// 		'commonjs2': 'react-dom',
	// 		'amd': 'react-dom',
	// 		'root': 'ReactDOM'
	// 	},
	// 	// 'react-hook-form': 'react-hook-form',
	// 	// 'react-imask': 'react-imask',
	// 	// 'react-bootstrap': 'react-bootstrap',
	// 	// 'react-datepicker': 'react-datepicker',
	// 	// 'classnames': 'classnames',
	// 	// 'jquery': 'jquery',
	// 	'bootstrap': 'bootstrap'
	// },
	resolve: {
		extensions: ['./mjs', '.js', '.jsx', '.scss', '.css', '.json'],
		alias: {
			"jquery": path.join(__dirname, "./jquery-stub.js")
		}
		// modules: ['node_modules']
	},
	module: {
		rules: [
		  {
			test: /\.(js|jsx)$/,
			use: 'babel-loader',
			exclude: /node_modules/
		  },
		  {
			test: /\.scss$/,
			use: [
			  'style-loader',
			  'css-loader',
			  'sass-loader'
			]
		  }
		]
	  },
	// module: {
	// 	rules: [
	// 		{
	// 			exclude: /node_modules/,
	// 			test: /\.js$|.jsx?$/,
	// 			use: [
	// 				{ loader: 'babel-loader' }
	// 			]
	// 		},
	// 		{
	// 			test: /\.scss$/,
	// 			use: [
	// 				{
	// 					loader: 'style-loader'
	// 				},
	// 				{
	// 					loader: 'css-loader',
	// 					options: {
    //                         sourceMap: true
    //                     }
	// 				},
	// 				{
	// 					loader: 'sass-loader', 
	// 					options: {
	// 						sourceMap: true,
	// 						sassOptions: {
	// 							includePaths: ['./node_modules'],
	// 						},
	// 					}
	// 				}
	// 			]
	// 		},
	// 	]
	// },
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
	  ]
	// performance: {
	// 	hints: false
	// }
};