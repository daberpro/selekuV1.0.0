"use strict";
const chalk = require('chalk');
function SelekuError({ config, message, line, info }) {
    let { log: c } = console;
    let { name, type } = config;
    if (name === "syntax" && type === "import") {
        c(` |`, chalk.keyword("orange")(chalk.bold(`Syntax Error at: `)), chalk.keyword("white")(message), chalk.keyword("blue")("line : " + line));
        c(` |`, "Info :");
        c(` |`, info);
        c(" | ");
    }
    if (name === "syntax" && type === "preprocess") {
        c(` |`, chalk.keyword("orange")(chalk.bold(`Syntax Error at: `)), chalk.keyword("white")(message), chalk.keyword("blue")("line : " + line));
        c(` |`, "Info :");
        c(` |`, info);
        c(" | ");
    }
    if (type === "reference")
        c(chalk.keyword("orange")(chalk.bold(`Reference Error at: `)), chalk.keyword("white")(message), chalk.keyword("green")("line : " + line));
}
module.exports = SelekuError;
