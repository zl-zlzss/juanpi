// 0. 导入 gulp
const gulp = require('gulp')
// 1-1. 导入 gulp-sass 第三方包
const sass = require('gulp-sass')
// 1-2. 导入 gulp-cssmin 第三方包
const cssmin = require('gulp-cssmin')
// 1-3. 导入 gulp-autoprefixer 第三方
const autoprefixer = require('gulp-autoprefixer')
// 3-1. 导入 gulp-uglify 第三方
const uglify = require('gulp-uglify')
// 3-2. 导入 gulp-babel
const babel = require('gulp-babel')
// 4-1. 导入 gulp-htmlmin
const htmlmin = require('gulp-htmlmin')
// 7. 导入 del
const del = require('del')



// 1. 打包 sass 文件 - gulp4 的书写信息
const sassHandler = () => {
    return gulp
        .src('./src/sass/*.scss')
        .pipe(sass()) // 转码
        .pipe(autoprefixer()) // 添加前缀
        .pipe(cssmin()) // 压缩
        .pipe(gulp.dest('./dist/sass/')) // 存放到指定目录
}


// 2. 打包 css 文件
const cssHandler = () => {
    return gulp
        .src('./src/css/*.css')
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css/'))
}

// 3. 打包 js 文件
const jsHandler = () => {
    // 3-1. 找到 js 文件
    return gulp
      .src('./src/js/*.js')
      .pipe(babel({ presets: ['@babel/env'] })) // ES6 转码
      .pipe(uglify()) // 压缩
      .pipe(gulp.dest('./dist/js/')) // 保存
}

// 4. 打包 html 文件
const htmlHandler = () => {
    // 4-1. 找到 html 文件
    return gulp
      .src('./src/html/*.html')
      // 因为 htmlmin 的所有打包信息都需要以参数的形式进行配置
      .pipe(htmlmin({ // 压缩
        collapseWhitespace: true, // 去除空白内容
        collapseBooleanAttributes: true, // 简写布尔值属性
        removeAttributeQuotes: true, // 去除属性上的双引号
        removeComments: true, // 去除注释
        removeEmptyElements: true, // 去除空元素
        removeEmptyAttributes: true, // 去除空的属性
        removeScriptTypeAttributes: true, // 去除 script 标签上的 type 属性
        removeStyleLinkTypeAttributes: true, // 去除 style 标签和 link 标签上的 type 属性
        minifyJS: true, // 压缩内嵌式 js 代码, 不认识 ES6
        minifyCSS: true, // 压缩内嵌式 css 文本, 不能自动加前缀
      }))
      .pipe(gulp.dest('./dist/html/')) // 保存
}

// 5. 打包 image 文件
const imgHandler = () => {
    // 找到文件
    return gulp
      .src('./src/img/*.**')
      .pipe(gulp.dest('./dist/images/'))
}

// 6. 转存 assets 文件
const assetsHandler = () => {
    return gulp
      .src('./src/assets/*/**')
      .pipe(gulp.dest('./dist/assets'))
}

// 7. 删除 dist 文件
const delHandler = () => {
    return del('./dist/')
}

// last. 配置一个 默认 任务
const defaultHandler = gulp.series(
    delHandler,
    gulp.parallel(sassHandler, cssHandler, jsHandler, htmlHandler, imgHandler, assetsHandler),
  
)





// 导出放在最后
module.exports.sassHandler = sassHandler
module.exports.cssHandler = cssHandler
module.exports.jsHandler = jsHandler
module.exports.htmlHandler = htmlHandler
module.exports.imgHandler = imgHandler
module.exports.assetsHandler = assetsHandler
module.exports.delHandler = delHandler
// 为什么一定要起名叫做 default
// 因为你在命令行执行的时候, 如果书写 $ gulp default
// 可以简写成 $ gulp
module.exports.default = defaultHandler