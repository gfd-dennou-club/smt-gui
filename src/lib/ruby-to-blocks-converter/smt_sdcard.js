/**
 * converter for SD card
 */

const SmT_SDcard_Converter = {
    register: function (converter) {

        // WLAN.new
        converter.registerOnSend("::WLAN", "new", 0, (params) => {
            const { args, node } = params;

            const expression = `WLAN.new( )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // wlan = WLAN.new
        converter.registerOnVasgn((scope, variable, rh) => {
	    const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^WLAN\.new\(\s*\)/
            );

            if (!match) return null;
            if (variable.name != "wlan") return null;

            const block = converter.changeRubyExpressionBlock(
                rh, "peripherals_wifi_init", "statement"
            );
            return block;
        });
    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

	const receiverName = receiver.fields.VALUE.value;
        if (!receiverName) return null;

        const match = receiverName.match(/^wlan$/);
	if (!match) return null;
	
	switch (name) {
	    
            // wlan.connect
            case "connect": {
                if (args.length != 2) return null; 
		if (!this._isStringOrBlock(args[0])) return null;
		if (!this._isStringOrBlock(args[1])) return null;
		
                const block = this._changeBlock(
		    receiver, "peripherals_wifi_connect", "statement"
                );
		this._addTextInput(block, "SSID", args[0], "test");
		this._addTextInput(block, "PASS", args[1], "test");
                return block;
                break;
            }

            // wlan.connect
            case "connected?": {
                if (args.length != 0) return null; 

		const block = this._changeBlock(
		    receiver, "peripherals_wifi_connected", "value_boolean"
                );
		return block;
		break;
	    }
	}
	return null;
    },

};

export default SmT_SDcard_Converter;
