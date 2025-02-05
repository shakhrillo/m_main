var minify = require("html-minifier").minify;
const path = require("path");

const loadAssets = () => {
  const publicPath = path.join(__dirname, "..", "public");
  const indexHtml = path.join(__dirname, "..", "views", "index.html");
  const styles = [
    "/node_modules/bootstrap/dist/css/bootstrap.min.css",
    "/node_modules/@highlightjs/cdn-assets/styles/default.min.css",
    "/css/index.css",
  ].map((style) => {
    if (process.env.NODE_ENV === "server") {
      return `/setup${style}`;
    }
    return style;
  });
  const scripts = [
    "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    "/node_modules/socket.io-client/dist/socket.io.js",
    "/node_modules/@highlightjs/cdn-assets/highlight.min.js",
    "/node_modules/highlightjs-structured-text/dist/iecst.min.js",
    "/js/services.js",
    "/js/socket.js",
    "/js/machine.js",
    "/js/env.js",
  ].map((script) => {
    if (process.env.NODE_ENV === "server") {
      return `/setup${script}`;
    }
    return script;
  });
  const scriptTags = scripts.map(
    (script) => `<script src="${script}"></script>`
  );
  const indexHtmlContent = require("fs").readFileSync(indexHtml, "utf8");
  const updatedIndexHtml = indexHtmlContent.replace(
    "<!-- scripts -->",
    scriptTags.join("\n")
  );
  const stylesTags = styles.map(
    (style) => `<link rel="stylesheet" href="${style}" />`
  );
  const updatedIndexHtmlWithStyles = updatedIndexHtml.replace(
    "<!-- styles -->",
    stylesTags.join("\n")
  );
  require("fs").writeFileSync(
    path.join(publicPath, "index.html"),
    minify(updatedIndexHtmlWithStyles, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
    })
  );
};

module.exports = loadAssets;
