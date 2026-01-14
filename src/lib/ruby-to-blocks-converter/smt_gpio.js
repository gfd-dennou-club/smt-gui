/**
 * クラス定数のフルネームを取得するヘルパー
 */
const getClassConstant = (block) => {
    const value = block.value;
    if (!value) return null;

    const scope = value.scope || '';
    const name = value.name;
    return `${scope}::${name}`;
};

/**
 * converter for GPIO
 *
*/
const SmT_GPIO_Converter = {
    register: function (converter) {

        // --- GPIO.new の変換 ---
        converter.registerOnSend("::GPIO", "new", 2, (params) => {
            const { args, node } = params;
            if (!converter.isNumber(args[0])) return null;

            let mode;
            if (converter.isBlock(args[1])) {
                mode = converter.getSource(args[1].node);
            } else {
                mode = getClassConstant(args[1]);
            }

            // モードに応じた式を生成
            const validModes = [
                "::GPIO::OUT", "GPIO::OUT",
                "::GPIO::IN", "GPIO::IN",
                "GPIO::IN|GPIO::PULL_UP", "::GPIO::IN|::GPIO::PULL_UP",
                "GPIO::IN|GPIO::PULL_DOWN", "::GPIO::IN|::GPIO::PULL_DOWN"
            ];

            if (validModes.includes(mode)) {
                // block の場合は削除（インライン引数として処理するため）
                if (converter.isBlock(args[1])) {
                    converter.removeBlock(args[1]);
                }
                const cleanMode = mode.replace(/^::/, ''); // 先頭の :: を削除
                const expression = `GPIO.new( ${args[0].value}, ${cleanMode} )`;
                return converter.createRubyExpressionBlock(expression, node);
            }
            return null;
        });
	
        // --- gpioX = GPIO.new(...) の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(/GPIO\.new\(\s*(\d+)\s*,\s*(.+?)\s*\)/);
            if (!match) return null;

            // 変数名が gpio10 のようになっているか確認
            if (variable.name !== `gpio${match[1]}`) return null;

            const block = converter.changeRubyExpressionBlock(rh, "microcom_gpio_init", "statement");
            
            converter.addNumberInput(block, "PIN", "math_integer", Number(match[1]), 10);
            converter.addField(block, "DIRECTION", match[2].trim());

            return block;
        });

        // --- gpioX レシーバーの登録 (0-40) ---
        for (let pin = 0; pin <= 40; pin++) {
            const str = "gpio" + pin;
            converter.registerOnSend("self", str, 0, (params) => {
                return converter.createRubyExpressionBlock(str, params.node);
            });
        }
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
	
        const match = receiverName.match(/^gpio(\d+)$/);

	if (!match) return null;
        const pin = Number(match[1]);
	
	switch (name) {
	    
            // gpio.write 
            case "write": {
	    
                if (args.length != 1) null
                if (!this._isNumber(args[0])) return null;
                if (args[0].value !== 0 && args[0].value !== 1) return null;
		
                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_gpio_write", "statement"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_gpio_write", "statement"
                        );
                    }
                })();		
                this._addNumberInput(block, "VALUE", "math_integer", args[0], 0);
                this._addNumberInput(block, "PIN", "math_integer", pin, 10);
		
                return block;
                break;
            }
	    
            // gpio.read
            case "read": {
		if (args.length != 0) null;

		console.log( this._isRubyExpression(receiver) );
		
                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_gpio_read", "value"
			);
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_gpio_read", "value"
                        );
                    }
                })();		
                this._addNumberInput(block, "PIN", "math_integer", pin, 10);
		
                return block;
                break;
            }
        }
        return null;
    }
};

export default SmT_GPIO_Converter;
