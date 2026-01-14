const getClassConstant = (block) => {
    const value = block.value;
    if (!value) return null;

    const scope = value.scope;
    const name = value.name;
    return `${scope}::${name}`;
};

/**
 * Microcom converter
 */
const SmT_Network_Converter = {
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

        // wlan
        converter.registerOnSend("self", "wlan", 0, (params) => {
            const { node } = params;
            return converter.createRubyExpressionBlock("wlan", node);
        });

        // wlan.connect
        converter.registerOnSend("wlan", "connect", 2, (params) => {
	    console.log("--- wlan.connect ---");
            const { args, receiver } = params;
            if (!converter._isStringOrBlock(args[0])) return null;
            if (!converter._isStringOrBlock(args[1])) return null;

            const block = converter._changeRubyExpressionBlock(
                receiver, "peripherals_wifi_connect", "statement"
            );	   
	    converter._addTextInput(block, "SSID", args[0], "test");
	    converter._addTextInput(block, "PASS", args[1], "test");
            return block;
        });
	
        // wlan.connected?
        converter.registerOnSend("wlan", "connected?", 0, (params) => {
            const { receiver } = params;

            const block = converter._changeRubyExpressionBlock(
                receiver, "peripherals_wifi_connected", "value_boolean"
            );
            return block;
            });


        // HTTP
        converter.registerOnSend("self", "::HTTP", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("::HTTP", node);
        });

	// HTTP.get
        converter.registerOnSend("::HTTP", "get", 1, (params) => {
            const { args } = params;
            if (!converter._isStringOrBlock(args[0])) return null;
	    
	    const block = converter.createBlock("peripherals_http_get", "value");
            converter._addTextInput(block, "URL", args[0], "test");
            return block;
        });

	// HTTP.post
        converter.registerOnSend("::HTTP", "post", 2, (params) => {
            const { args } = params;
            if (!converter._isStringOrBlock(args[0])) return null;
            if (!converter._isStringOrBlock(args[1])) return null;	    

	    const block = converter.createBlock("peripherals_http_post", "statement");
            converter._addTextInput(block, "URL",  args[0], "test");
            converter._addTextInput(block, "DATA", args[1], "test");
            return block;
        });
/*
        // SNTP
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
                /^SNTP\.new\(\s*\)/
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

        // sntp.read
        converter.registerOnSend("sntp", "read", 0, (params) => {
            const { receiver } = params;
	    
            const block = converter._changeRubyExpressionBlock(
                receiver,
                "peripherals_sntp_read",
                "statement"
            );
            return block;
        });

	// sntp.XXXX
	const items = ['year', 'mon', 'mday', 'wday', 'hour', 'min', 'sec'];
	items.forEach( function(item) {
            converter.registerOnSend('sntp', item, 0, params => {
		console.log( "----" );
		console.log( item );
		const { receiver } = params;
		const block = converter._changeRubyExpressionBlock(
                    receiver,
                    "peripherals_sntp_date",
                    "statement"
		);	   		
		converter.addField(block, "TIME", item);
		return block;
            });
	});

*/

    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

	// lvar (ローカル変数) である前提
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

export default SmT_Network_Converter;
