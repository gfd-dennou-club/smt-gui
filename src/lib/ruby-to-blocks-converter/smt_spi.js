/**
 * converter for SPI
 */
const SmT_SPI_Converter = {
    register: function (converter) {

        // --- SPI.new の変換 ---
        converter.registerOnSend("::SPI", "new", 1, (params) => {
            const { args, node } = params;
	    
            if (!converter.isHash(args[0])) return null;
            const miso = args[0].get("sym:miso_pin");	    
            const mosi = args[0].get("sym:mosi_pin");
            const clk  = args[0].get("sym:clk_pin");
            if (!converter.isNumber(miso)) return null;
            if (!converter.isNumber(mosi)) return null;
            if (!converter.isNumber(clk))  return null;

            const expression = `SPI.new( miso_pin:${miso.value}, mosi_pin:${mosi.value}, clk_pin:${clk.value})`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- spi = SPI.new の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {
	    const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^SPI\.new\(\s*miso_pin:\s*(\d+)\s*,\s*mosi_pin:\s*(\d+)\s*,\s*clk_pin:\s*(\d+)\s*\)/
            );

            if (!match) return null;
            if (variable.name != "spi") return null;

            const block = converter.changeRubyExpressionBlock(
                rh, "microcom_spi_init", "statement"
            );
            converter.addNumberInput(block, "MISO", "math_integer", Number(match[1]));
            converter.addNumberInput(block, "MOSI", "math_integer", Number(match[2]));
            converter.addNumberInput(block, "CLK",  "math_integer", Number(match[3]));
            return block;
        });

    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

        const receiverName = receiver.fields.VALUE.value;
        if (!receiverName) return null;
	
        const match = receiverName.match(/^spi/);
	if (!match) return null;
	
	switch (name) {

	    // spi.write
            case "write": {
		if (args.length != 2) return null;		
                if (!this.isNumber(args[0])) return null;
                if (!this.isNumber(args[1])) return null;
		
		const block = this._changeBlock(
                    receiver, "microcom_spi_write", "statement"
		);

		let addr1 = 0 ;
		let addr2 = 0 ;
		let addr3 = 0 ;
		let addr4 = 0 ;
		
		if  ( Number( args[0] ) < 16 ) {
		    addr1 = 0 ;
		    addr2 = (Number(args[0])).toString(16)[0] ;			
		} else if ( Number( args[0] ) < 256 ) {
		    addr1 = (Number(args[0])).toString(16)[0] ;
		    addr2 = (Number(args[0])).toString(16)[1] ;
		} else {
		    return null;
		}
		this._addField(block, "ADDR1", String(addr1).toUpperCase() );
		this._addField(block, "ADDR2", String(addr2).toUpperCase() );

		if  ( Number( args[1] ) < 16 ) {
		    addr3 = 0 ;
		    addr4 = (Number(args[1])).toString(16)[0] ;		    
		} else if ( Number( args[1] ) < 256 ) {		    
		    addr3 = (Number(args[1])).toString(16)[0] ;
		    addr4 = (Number(args[1])).toString(16)[1] ;		   
		} else {
		    return null;
		}
		this._addField(block, "ADDR3", String(addr3).toUpperCase() );
		this._addField(block, "ADDR4", String(addr4).toUpperCase() );
		
		return block;
                break;
            }

            // spi.read
            case "read": {
		if (args.length != 1) return null;
		if (!this._isNumber(args[0])) return null;
		const num = Number( args[0] );
		    
		const block = this._changeBlock(
                    receiver, "microcom_spi_read", "value"
                );
		this._addNumberInput(block, "BYTES", "math_integer", num, 10);
		return block;
                break;
            }
        }
        return null;
    },
};

export default SmT_SPI_Converter;
