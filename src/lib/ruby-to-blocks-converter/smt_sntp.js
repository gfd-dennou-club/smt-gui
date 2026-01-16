/**
 * converter for network
 */

const SNTP_TARGET = ['read', 'year', 'mon', 'mday', 'wday', 'hour', 'min', 'sec'];

const SmT_Network_Converter = {
    register: function (converter) {

        // SNTP.new
        converter.registerOnSend("::SNTP", "new", 0, (params) => {
            const { args, node } = params;

            const expression = `SNTP.new( )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // sntp = SNTP.new
        converter.registerOnVasgn((scope, variable, rh) => {
	    const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^SNTP\.new\s*\(\s*\)/
            );

            if (!match) return null;
            if (variable.name != "sntp") return null;

            const block = converter.changeRubyExpressionBlock(
                rh,
                "peripherals_sntp_init",
                "statement"
            );
            return block;
        });

        // sntp
        converter.registerOnSend("self", "sntp", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("sntp", node);
        });

    },
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

	const receiverName = receiver.fields.VALUE.value;
        if (!receiverName) return null;

        const match = receiverName.match(/^sntp$/);
	if (!match) return null;

	const targetPattern = new RegExp(`^(${SNTP_TARGET.join('|')})`);
	const match2 = name.match(targetPattern);
	if (!match2) return null;
	
	switch (name) {
	    
            // sntp.read
            case "read": {
		if (args.length != 0) return null; 
                const block = this._changeBlock(
		    receiver, "peripherals_sntp_read", "statement"
                );
                return block;
                break;
            }

  	    default: {
		if (args.length != 0) return null;
		const block = this._changeBlock(
                    receiver, "peripherals_sntp_value", "value"
		);
		this._addField(block, "TARGET", name);
		return block;
		break;
	    }
	}		     
	return null;
    },

};

export default SmT_Network_Converter;
