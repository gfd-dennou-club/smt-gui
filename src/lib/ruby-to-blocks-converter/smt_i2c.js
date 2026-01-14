const getClassConstant = (block) => {
    const value = block.value;
    if (!value) return null;

    const scope = value.scope;
    const name = value.name;
    return `${scope}::${name}`;
};

/**
 * converter for I2C
 */
const SmT_I2C_Converter = {
    register: function (converter) {

        // --- I2C.new の変換 ---
        converter.registerOnSend("::I2C", "new", 1, (params) => {
            const { args, node } = params;

            if (!converter.isHash(args[0])) return null;
            const scl = args[0].get("sym:scl_pin");
            const sda = args[0].get("sym:sda_pin");
            if (!converter.isNumber(scl)) return null;
            if (!converter.isNumber(sda)) return null;

            const expression = `I2C.new( scl_pin:${scl.value}, sda_pin:${sda.value})`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- i2c = I2C.new の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;
	    
            const match = expression.match(
                /^I2C\.new\(\s*scl_pin:\s*(\d+)\s*,\s*sda_pin:\s*(\d+)\s*\)/
            );

            if (!match) return null;
            if (variable.name != "i2c") return null;

            const block = converter.changeRubyExpressionBlock(
                rh,
                "microcom_i2c_init",
                "statement"
            );
            converter.addNumberInput(
                block,
                "SCL",
                "math_integer",
                Number(match[1])
            );
            converter.addNumberInput(
                block,
                "SDA",
                "math_integer",
                Number(match[2])
            );

            return block;
        });

        // --- i2c レシーバの登録 ---
        converter.registerOnSend("self", "i2c", 0, (params) => {
            return converter.createRubyExpressionBlock(str, params.node);
        });
    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {
        const receiverName = (() => {
            if (this._isRubyExpression(receiver)) {
                return this._getRubyExpression(receiver);
            } else if (this._isRubyArgument(receiver)) {
                return receiver.fields.VALUE.value;
            } else {
                return null;
            }
        })();

        if (!receiverName) return null;
	
        const match = receiverName.match(/^i2c/);
	if (!match) return null;

	switch (name) {

            // i2c.write 
            case "write": {

                if (args.length != 2 && args.length != 3 ) return null;

		let flag = 0;
		let blockname = "";
		
                if (!this.isNumber(args[0])) return null;
                if (!this.isNumber(args[1])) return null;

                if (this.isNumber(args[2]) || args[2] === undefined) {
		    blockname = "microcom_i2c_write";		    
		} else {
		    blockname = "microcom_i2c_write2";
		    flag = 1;			
		}

		const block = (() => {
                    if (this._isRubyExpression(receiver)) {
			return this._changeRubyExpressionBlock(
                            receiver, blockname, "statement"
			);
                    } else {
			return this._changeBlock(
                            receiver, blockname, "statement"
			);
                    }
		})();
		
		let addr1 = 0 ;
		let addr2 = 0 ;
		let addr3 = 0 ;
		let addr4 = 0 ;
		let addr5 = '-' ;
		let addr6 = '-' ;
		
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
		    
                if (this._isNumber(args[2])) {
		    if  ( Number( args[2] ) < 16 ) {
			addr5 = 0 ;
			addr6 = (Number(args[2])).toString(16)[0] ;
		    } else if ( Number( args[2] ) < 256 ) {
			addr5 = (Number(args[2])).toString(16)[0] ;
			addr6 = (Number(args[2])).toString(16)[1] ;
		    }			
		    this._addField(block, "ADDR5", String(addr5).toUpperCase() );
		    this._addField(block, "ADDR6", String(addr6).toUpperCase() );
			
		} else if (flag === 1) {
		    this._addTextInput(block, "HEX", args[2], "please input block");
		}
		
		return block;
                break;
            }

            // i2c.read
            case "read": {
		
                if (args.length != 2 && args.length != 3) return null;

		    
		if (!this._isNumber(args[0])) return null;
                if (!this._isNumber(args[1])) return null;
		
		const num = Number( args[1] );		    
		
		const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_i2c_read", "value"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_i2c_read", "value"
                        );
                    }
		})();

		let addr1 = 0 ;
		let addr2 = 0 ;
		let addr3 = '-' ;
		let addr4 = '-' ;
		
		if  ( Number( args[0] ) < 16 ) {		    
		    addr1 = 0 ;
		    addr2 = (Number(args[0])).toString(16)[0] ;		    
		} else if ( Number( args[0] ) < 256 ) {
		    addr1 = (Number(args[0])).toString(16)[0] ;
		    addr2 = (Number(args[0])).toString(16)[1] ;
		} else {
		    return null;
		}
		
                if (this._isNumber(args[2])) {
		    if  ( Number( args[2] ) < 16 ) {
			addr3 = 0 ;
			addr4 = (Number(args[2])).toString(16)[0] ;
		    } else if ( Number( args[2] ) < 256 ) {
			addr3 = (Number(args[2])).toString(16)[0] ;
			addr4 = (Number(args[2])).toString(16)[1] ;
		    } 
		}		    
		this._addField(block, "ADDR1", String(addr1).toUpperCase() );
		this._addField(block, "ADDR2", String(addr2).toUpperCase() );
		this._addNumberInput(block, "BYTES", "math_integer", num, 10);
		this._addField(block, "ADDR3", String(addr3).toUpperCase() );
		this._addField(block, "ADDR4", String(addr4).toUpperCase() );
		return block;
                break;
            }
        }
        return null;
    },
};

export default SmT_I2C_Converter;
