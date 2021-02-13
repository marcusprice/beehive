const { src, dest, watch } = require('gulp');

exports.default = () => {
  watch('./src/*', () => {
    src('./src/index.js').pipe(dest('./dist/'));
  });
};
