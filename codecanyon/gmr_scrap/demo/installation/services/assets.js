const { minify } = require("html-minifier");
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const loadAssets = () => {
  const basePath = path.join(__dirname, "..");
  const publicPath = path.join(basePath, "public");
  const indexHtmlPath = path.join(basePath, "views", "index.html");

  const prefix = process.env.NODE_ENV === "server" ? "/setup" : "";
  const assets = (files) => files.map((file) => `${prefix}${file}`);

  const styles = assets([
    "/node_modules/bootstrap/dist/css/bootstrap.min.css",
    "/node_modules/@highlightjs/cdn-assets/styles/default.min.css",
    "/css/index.css",
  ])
    .map((style) => `<link rel="stylesheet" href="${style}" />`)
    .join("\n");

  const scripts = assets([
    "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    "/node_modules/socket.io-client/dist/socket.io.js",
    "/node_modules/@highlightjs/cdn-assets/highlight.min.js",
    "/node_modules/highlightjs-structured-text/dist/iecst.min.js",
    "/js/services.js",
    "/js/socket.js",
    "/js/machine.js",
    "/js/env.js",
  ])
    .map((script) => `<script src="${script}"></script>`)
    .join("\n");

  const indexHtmlContent = readFileSync(indexHtmlPath, "utf8")
    .replace("<!-- styles -->", styles)
    .replace("<!-- scripts -->", scripts);

  writeFileSync(
    path.join(publicPath, "index.html"),
    minify(indexHtmlContent, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
    })
  );
};

module.exports = loadAssets;
