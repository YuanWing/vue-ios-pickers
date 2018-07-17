const path = require('path');
const autoprefixer = require('autoprefixer');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = (env, argv) =>{
  const mode = argv.mode === 'production';
  return {
    entry: './src/index.js',
    output: {
      filename: `vue-ios-pickers${mode ? '.min' : ''}.js`,
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        }, {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: [['env']]
          }
        }, {
          test: /\.less$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    browsers: ['last 3 versions']
                  })
                ]
              },
            },
            'less-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }
};
