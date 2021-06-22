// membuat sistem import untuk seleku (3:0)

const file = require("fs");
const path = require("path");

interface importer{

	name: string,
	id: string,
	path: string,
	included: {
		syntax: string,
		filename: string
	},
	option: object

}

class include {

	private name: string;
	private id: string;
	private option: object;
	private path: string;

	include: any;

	constructor({name, id, option, path}: any){

		this.name = name;
		this.id = id;
		this.option = option;
		this.path = path;
		this.include = {};

	}

	get getSyntax(): typeof path{

		let Path = path.join(this.path);

		try{

			let query = file.readFileSync(Path);
			return query.toString();

		}catch(err){
			const chalk = require("chalk");
			console.log(" | "+chalk.keyword("red")(err.message.replace(/\,/igm,",\n | ")));
		}

	}

	get getInclude(): importer{

		return this.include;

	}

}

module.exports = include;