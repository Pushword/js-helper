const WatchExternalFilesPlugin = require("webpack-watch-files-plugin").default;
const Encore = require("@symfony/webpack-encore");
const tailwindcss = require("tailwindcss");

function getFilesToWatch(basePath = "./..") {
    return [
        basePath + "/vendor/pushword/core/src/templates/**/*.html.twig",
        basePath + "/vendor/pushword/core/src/templates/*.html.twig",
        basePath + "/vendor/pushword/conversation/src/templates/*.html.twig",
        basePath + "/vendor/pushword/admin-block-editor/src/templates/page/*.html.twig",
        basePath + "/templates/*.html.twig",
        basePath + "/templates/**/*.html.twig",
        basePath + "/templates/**/**/*.html.twig",
    ];
}
function getTailwindConfig(watchFiles = null) {
    if (watchFiles === null) watchFiles = getFilesToWatch();
    var tailwindConfig = require("@pushword/js-helper/src/tailwind.config.js");
    tailwindConfig.content = watchFiles;
    return tailwindConfig;
}

module.exports = {
    getFilesToWatch: getFilesToWatch,
    getTailwindConfig: getTailwindConfig,
    getEncore: function (
        watchFiles = null,
        tailwindConfig = null,
        outputPath = "./../public/assets/",
        publicPath = "/assets",
        manifestKeyPrefix = null,
        filesToCopy = [
            {
                from: "./favicons",
                to: "[name].[ext]",
            },
        ],
        entries = null,
        styleEntries = null
    ) {
        if (watchFiles === null) {
            watchFiles = getFilesToWatch();
        }

        if (tailwindConfig === null) {
            tailwindConfig = getTailwindConfig(watchFiles);
        }

        if (entries === null) {
            entries = [{ name: "app", file: __dirname + "/app.js" }];
        } else if (typeof entries === "string") {
            entries = [{ name: "app", file: entries }];
        }

        if (styleEntries === null) {
            styleEntries = [{ name: "style", file: __dirname + "/app.css" }];
        } else if (typeof styleEntries === "string") {
            styleEntries = [{ name: "style", file: styleEntries }];
        }

        Encore.setOutputPath(outputPath)
            .setPublicPath(publicPath)
            .cleanupOutputBeforeBuild()
            .enableSassLoader()
            .enableSourceMaps(false)
            .enableVersioning(false)
            .addPlugin(
                new WatchExternalFilesPlugin({
                    files: watchFiles,
                })
            )
            .enablePostCssLoader((options) => {
                options.postcssOptions = {
                    plugins: [require("postcss-import"), tailwindcss(tailwindConfig), require("autoprefixer")],
                };
            })
            .disableSingleRuntimeChunk();
        filesToCopy.forEach(function (toCopy) {
            Encore.copyFiles(toCopy);
        });

        if (manifestKeyPrefix !== null) Encore.setManifestKeyPrefix(manifestKeyPrefix);

        entries.forEach(function (entry) {
            Encore.addEntry(entry.name, entry.file);
        });

        styleEntries.forEach(function (entry) {
            Encore.addStyleEntry(entry.name, entry.file);
        });

        return Encore;
    },
};