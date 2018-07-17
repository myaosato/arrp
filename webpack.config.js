const path = require('path');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: './arrp-browser-interface.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'arrp-browser.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, '/'),
  },

  node: {
    __dirname: false,
  }
};
