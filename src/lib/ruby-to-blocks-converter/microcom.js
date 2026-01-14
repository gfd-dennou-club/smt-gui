/**
 * Microcom converter
 */
const MicrocomConverter = {
    register: function (converter) {

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

};

export default MicrocomConverter;
