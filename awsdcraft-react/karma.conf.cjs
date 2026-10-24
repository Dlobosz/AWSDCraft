const fs = require("fs");

const rutasNavegador = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

if (!process.env.CHROME_BIN) {
  const encontrado = rutasNavegador.find((ruta) => fs.existsSync(ruta));
  if (encontrado) process.env.CHROME_BIN = encontrado;
}

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "src/pruebas/*.spec.js", watched: false }],
    preprocessors: { "src/pruebas/*.spec.js": ["webpack"] },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            resolve: { fullySpecified: false },
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                plugins: [["istanbul", { exclude: ["src/pruebas/**"] }]],
              },
            },
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
    },
    webpackMiddleware: { stats: "errors-only" },
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "html" }, { type: "text" }, { type: "text-summary" }],
    },
    browsers: ["ChromeHeadlessSinSandbox"],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu"],
      },
    },
    singleRun: true,
    autoWatch: false,
  });
};
