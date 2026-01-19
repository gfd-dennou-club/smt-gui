/**
 * converter for SD card
 */

const SmT_SDSPI_Converter = {
    register: function (converter) {

        // --- SDSPI.new の変換 ---
        converter.registerOnSend("::SDSPI", "new", 2, (params) => {
            const { args, node } = params;

	    //console.log(args[0].fields.VALUE.value);
	    //console.log(args[1].get("sym:cs_pin").value);
	    //console.log(args[1].get("sym:mount_point").value);

	    const spi = args[0].fields.VALUE.value;
	    if (!converter.isString(spi)) return null;
	    
	    if (!converter.isHash(args[1])) return null;

            const cs  = args[1].get("sym:cs_pin").value;
	    if (!converter.isNumber(cs)) return null;

            const mnt = args[1].get("sym:mount_point").value;
	    if (!converter.isStringOrBlock(mnt)) return null;
	    
	    const expression = `SDSPI.new( ${spi}, cs_pin:${cs}, mount_point:"${mnt}" )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- sdspi = SDSPI.new の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {

            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;
	    
            const match = expression.match(
                /^SDSPI\.new\s*\(\s*spi\s*,\s*cs_pin:\s*(\d+)\s*,\s*mount_point:\s*\"(\S+)\"\s*\)/
            );
	    
            if (!match) return null;
            if (variable.name != "sdspi") return null;

            const block = converter.changeRubyExpressionBlock(
                rh, "peripherals_sd_init", "statement"
            );
            converter.addNumberInput(block, "PIN", "math_integer", Number(match[1]));
	    converter.addTextInput(block, "DIR", match[2], "test");
            return block;
        });
    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

	const receiverName = receiver.fields.VALUE.value;
        if (!receiverName) return null;

        const match = receiverName.match(/^sdspi$/);
	if (!match) return null;
	
	switch (name) {
	    
            // sdspi.umount
            case "umount": {
                if (args.length != 0) return null; 

		const block = this._changeBlock(
		    receiver, "peripherals_sd_umount", "statement"
                );
		return block;
		break;
	    }
	}
	return null;
    },

};

export default SmT_SDSPI_Converter;
