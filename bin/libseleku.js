"use strict";
// membuat sistem import untuk seleku (3:0)
const file = require("fs");
const path = require("path");
class include {
    constructor({ name, id, option, path }) {
        this.name = name;
        this.id = id;
        this.option = option;
        this.path = path;
        this.include = {};
    }
    get getSyntax() {
        let Path = path.join(this.path);
        try {
            let query = file.readFileSync(Path);
            return query.toString();
        }
        catch (err) {
            const chalk = require("chalk");
            console.log(" | " + chalk.keyword("red")(err.message.replace(/\,/igm, ",\n | ")));
        }
    }
    get getInclude() {
        return this.include;
    }
}
module.exports = include;
