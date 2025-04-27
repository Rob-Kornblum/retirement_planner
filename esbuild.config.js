const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");

const isWatch = process.argv.includes("--watch");

esbuild
  .context({
    entryPoints: ["app/javascript/application.js"],
    bundle: true,
    outdir: "app/assets/builds",
    plugins: [
      sassPlugin({
        type: 'css',
        // enable CSS Modules for .module.scss files
        modules: {
          // naming convention for generated class names
          auto: /\.module\.(scss|sass)$/,
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      })
    ],
    sourcemap: true,
    format: "esm",
    target: ["es2020"],
    logLevel: "info",
    loader: {
      ".js": "jsx",
      ".scss": "css",
    },
  })
  .then((ctx) => {
    if (isWatch) {
      return ctx.watch().then(() => {
        console.log("Watching for changes...");
      });
    } else {
      return ctx.rebuild().then(() => {
        console.log("Build complete.");
        return ctx.dispose();
      });
    }
  })
  .catch(() => process.exit(1));