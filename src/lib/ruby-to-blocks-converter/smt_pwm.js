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
 * converter for PWM
 */
const SmT_PWM_Converter = {
    register: function (converter) {

        // --- PWM.new の変換 ---
        converter.registerOnSend("::PWM", "new", 2, (params) => {
            const { args, node } = params;

            const timer = args[1].get("sym:timer");
            const frequency = args[1].get("sym:frequency");

            if (!converter.isNumber(args[0])) return null;
            if (!converter.isNumber(timer)) return null;
            if (!converter.isNumber(frequency)) return null;

            const expression = `PWM.new(${args[0].value}, timer:${timer.value}, frequency:${frequency.value})`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- pwmX = PWM.new(...) の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^PWM\.new\(\s*(\d+)\s*,\s*timer:\s*(\d+)\s*,\s*frequency:\s*(\d+)\s*\)/
            );
            if (!match) return null;
            if (variable.name != `pwm${match[1]}`) return null;

            const [, pin, timer, frequency] = match;

            const block = converter.changeRubyExpressionBlock(
                rh, "microcom_pwm_init", "statement"
            );
            converter.addNumberInput( block, "PIN", "math_integer", Number(pin), 10 );
            converter.addNumberInput( block, "TIMER", "math_integer", Number(timer), 10 );
            converter.addNumberInput( block, "FREQ", "math_integer", Number(frequency), 10 );
            return block;
        });

        // --- pwmX のレシーバの登録 (0-40) ---
        for (let pin = 0; pin <= 40; pin++) {
            const str = "pwm" + pin;
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

        const match = receiverName.match(/^pwm(\d+)$/);

	if (!match) return null;
        const pin = Number(match[1]);
	
	switch (name) {
	    
            // pwm.duty
            case "duty": {
                if (args.length != 1) return null; 
                if (!this._isNumber(args[0])) return null;

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_pwm_duty", "statement"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_pwm_duty", "statement"
                        );
                    }
                })();
                this._addNumberInput(block, "PIN", "math_integer", pin, 10);
                this._addNumberInput(block, "DUTY","math_number", args[0], 10);

                return block;
                break;
            }

            // pwm.frequency
            case "frequency": {

                const pin = Number(match[1]);

                if (args.length != 1) return null; 
                if (!this._isNumber(args[0])) return null;

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_pwm_frequency", "statement"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_pwm_frequency", "statement"
                        );
                    }
                })();
		
                this._addNumberInput(block, "PIN", "math_integer", pin, 10);
                this._addNumberInput(block, "FREQ", "math_number", args[0], 10);

		return block;
                break;
            }

            // pwm.pulse_width_us
            case "pulse_width_us": {

                if (args.length != 1) return null; 
                if (!this._isNumber(args[0])) return null;

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_pwm_pulse", "statement"
                        );
                    } else {
                        return this._changeBlock(
			    receiver, "microcom_pwm_pulse", "statement"
                        );
                    }
                })();

                this._addNumberInput(block, "PIN", "math_integer", pin, 10);
                this._addNumberInput(block, "PULSE", "math_number", args[0], 10);
		
                return block;
                break;
            }
        }
        return null;
    },
};

export default SmT_PWM_Converter;
