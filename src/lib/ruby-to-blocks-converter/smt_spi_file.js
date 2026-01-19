/**
 * converter for File
 */

const SmT_SPI_FILE_Converter = {
    register: function (converter) {

        // --- File.open の変換 ---
        converter.registerOnSend("::File", "open", 2, (params) => {
            const { args, node } = params;

	    const fname = args[0].value;
	    if (!converter.isStringOrBlock(fname)) return null;

	    const mode = args[1].value;
	    if (!converter.isString(mode)) return null;
	    
	    const expression = `File.open( ${fname}, "${mode}" )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- file = File.open の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {

            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;
	    
            const match = expression.match(
                /^File.open\s*\(\s*(\S+)\s*,\s*\"(\S+)\"\s*\)/
            );
	    
            if (!match) return null;
            if (variable.name != "file") return null;

            const block = converter.changeRubyExpressionBlock(
                rh, "peripherals_sd_open", "statement"
            );
	    converter.addTextInput(block, "FILE", match[1], "test");
	    converter.addField(block, "MODE", match[2]);
            return block;
        });
    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

	const receiverName = receiver.fields.VALUE.value;
        if (!receiverName) return null;

        const match = receiverName.match(/^file$/);
	if (!match) return null;
	
	switch (name) {
	    
            // file.puts
            case "puts": {
                if (args.length != 1) return null; 

		const block = this._changeBlock(
		    receiver, "peripherals_sd_puts", "statement"
                );
		this.addTextInput(block, "TEXT", args[0], "test");
		return block;
		break;
	    }
            // file.read
            case "read": {
                if (args.length != 0) return null; 

		const block = this._changeBlock(
		    receiver, "peripherals_sd_gets", "value"
                );
		this.addField(block, "MODE", "read");
		return block;
		break;
	    }
            // file.gets
            case "gets": {
                if (args.length != 0) return null; 
		
		const block = this._changeBlock(
		    receiver, "peripherals_sd_gets", "value"
                );
		this.addField(block, "MODE", "gets");
		return block;
		break;
	    }
            // file.close
            case "close": {
                if (args.length != 0) return null; 
		
		const block = this._changeBlock(
		    receiver, "peripherals_sd_close", "statement"
                );
		return block;
		break;
	    }
	}
	return null;
    },

};

export default SmT_SPI_FILE_Converter;
