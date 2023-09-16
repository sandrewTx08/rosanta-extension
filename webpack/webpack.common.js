import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, '..', 'src');

export default {
  mode: 'production',
  entry: {
    popup: join(srcDir, 'components', 'Popup', 'index.tsx'),
    options: join(srcDir, 'components', 'Options', 'index.tsx'),
    background: join(srcDir, 'background', 'index.ts')
  },
  output: {
    path: join(__dirname, '../dist/js'),
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return chunk.name !== 'background';
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [require('autoprefixer')]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'icon.png', to: '../', context: 'public' },
        {
          from: 'manifest-v3.json',
          to: '../manifest.json',
          context: 'public'
        },
        { from: 'popup.html', to: '../', context: 'public' },
        { from: 'options.html', to: '../', context: 'public' }
      ]
    })
  ]
};
