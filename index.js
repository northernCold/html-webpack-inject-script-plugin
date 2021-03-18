const fs = require("fs");
const path = require("path");

module.exports = class HtmlWebpackInjectScriptPlugin {
  constructor(options) {
    this.filename = options?.filename;
    this.inline = options.inline || false;
  }
  apply(compiler) {
    const { filename, inline } = this;
    const context = compiler.context;
    const self = this;
    compiler.hooks.compilation.tap("HtmlWebpackInjectScriptPlugin", compilation => {
      compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData) {
        if (!inline) return;
        let script = self.createInlineTagScript(context, filename)
        htmlPluginData.body.unshift(script);
      });
      
      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData) {
        if (inline) return;
        let scriptSrc = self.getScriptSrcPath(filename, compiler); // this value of the src attribute of script;
        scriptSrc = scriptSrc.replace(/\\/g, "/");
        let fullPath = self.getFullPath(context, filename); // the absolute path to filename
        let outputRelativePath = path.relative(context, filename); // the dist relative path to filename
        htmlPluginData.assets.js.unshift(scriptSrc);
        compilation.assets[outputRelativePath] = {
          source: function () {
            return fs.readFileSync(fullPath, { encoding: "utf-8" })
          },
          size: function () {
            return fs.statSync(fullPath).size;
          }
        }
      })
    });
  }
  createInlineTagScript(context, filename) {
    let fullPath = this.getFullPath(context, filename);
    let code = fs.readFileSync(fullPath, "utf-8");
    let tag = {
      tagName: "script",
      closeTag: true,
      innerHTML: code
    };
    return tag;
  }
  getFullPath(context, filename) {
    return path.resolve(context, filename);
  }
  getScriptSrcPath(filename, compiler) {
    if (path.resolve(filename) === path.normalize(filename)) {
      const context = compiler.context;
      return compiler.options.output.publicPath + path.relative(context, filename);
    }
    return filename;
  }
}