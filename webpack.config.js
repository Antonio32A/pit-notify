const path = require("path");
const mode = process.env.NODE_ENV || "production";

module.exports = {
    devtool: false,
    output: {
        filename: "worker.js",
        path: path.join(__dirname, "dist")
    },
    mode,
    resolve: {
        extensions: [".js"],
        plugins: [],
        fallback: { util: false  }
    }
};
