const fs = require("fs");

class SwearJar
{
	static fileName = "swearjar.txt";

	static init()
	{
		if(!fs.existsSync(this.fileName))
		{
			fs.writeFileSync(this.fileName, 0);
		}
	}

	static getValue()
	{
		var val = parseInt(fs.readFileSync(this.fileName), "utf-8");
		return val;
	}

	static addSwear()
	{
		var val = parseInt(fs.readFileSync(this.fileName), "utf-8");
		val += 25;
		fs.writeFileSync(this.fileName, val.toString());
	}
};

module.exports = SwearJar;