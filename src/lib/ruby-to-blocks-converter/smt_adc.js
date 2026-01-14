/**
 * クラス定数のフルネームを取得するヘルパー
 */
const getClassConstant = (block) => {
    const value = block.value;
    if (!value) return null;

    const scope = value.scope;
    const name = value.name;
    return `${scope}::${name}`;
};

/**
 * converter for ADC
 */
const SmT_ADC_Converter = {
    register: function (converter) {

        // --- ADC.new の変換 ---
        converter.registerOnSend("::ADC", "new", 1, (params) => {
            const { receiver, args, node } = params;
            if (!converter.isNumber(args[0])) return null;

            const expression = `ADC.new( ${args[0].value} )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- adcX = ADC.new(...) の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

	    const match = expression.match(/^ADC\.new\(\s*(\d+)\s*\)/);
            if (!match) return null;
            if (variable.name !== `adc${match[1]}`) return null;

            const block = converter.changeRubyExpressionBlock(
                rh, "microcom_adc_init", "statement"
            );
            converter.addNumberInput(block, "PIN", "math_integer", Number(match[1]), 10);
            return block;
        });

        // --- adcX のレシーバの登録 (0-40) ---
        for (let pin = 0; pin <= 40; pin++) {
            const str = "adc" + pin;
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

	const match = receiverName.match(/^adc(\d+)$/);

	if (!match) return null;
        const pin = Number(match[1]);
	
	switch (name) {

	    // adc.read
            case "read": {
		if (args.length != 0) null;

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_adc_volt", "value"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_adc_volt", "value"
			);
                    }
                })();
                this._addNumberInput(block, "PIN", "math_integer", pin, 10);
		
                return block;
                break;		    
	    }

            // adc.read_raw
            case "read_raw": {
		if (args.length != 0) null;

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_adc_raw", "value"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_adc_raw", "value"
                        );
                    }
                })();
                this._addNumberInput(block, "PIN", "math_integer", pin, 10);

                return block;
                break;
            }
	    
        }
        return null;
    },
};

export default SmT_ADC_Converter;
