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
const MicrocomConverter = {
    register: function (converter) {
        // GPIO
        // GPIO.new
        converter.registerOnSend("::GPIO", "new", 2, (params) => {
            const { args, node } = params;

            if (!converter.isNumber(args[0])) return null;
            if (converter.isBlock(args[1])) {
                const mode = converter.getSource(args[1].node);
                if (!mode == "GPIO::IN|GPIO::PULL_UP") return null;

                converter.removeBlock(args[1]);

                const expression = `GPIO.new( ${args[0].value}, GPIO::IN|GPIO::PULL_UP )`;
                return converter.createRubyExpressionBlock(expression, node);
            } else {
                const mode = getClassConstant(args[1]);
                if (mode != "::GPIO::OUT") return null;

                const expression = `GPIO.new( ${args[0].value}, GPIO::OUT )`;
                return converter.createRubyExpressionBlock(expression, node);
            }
        });

        // gpio = GPIO.new
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /GPIO\.new\(\s*(\d+)\s*,\s*(.+?)\s*\)/
            );
            if (!match) return null;
            if (variable.name !== `gpio${match[1]}`) return null;

            const opcode = (() => {
                if (match[2] == "GPIO::OUT" && match[3] == null)
                    return "microcom_gpio_output_init";
                else if (match[2] == "GPIO::IN|GPIO::PULL_UP")
                    return "microcom_gpio_input_init";
                else return null;
            })();
            if (!opcode) return null;

            const block = converter.changeRubyExpressionBlock(
                rh,
                opcode,
                "statement"
            );
            converter.addNumberInput(
                block,
                "PIN",
                "math_integer",
                Number(match[1]),
                10
            );

            return block;
        });

        for (let pin = 0; pin <= 40; pin++) {
            let str = "gpio" + pin;

            // gpio
            const createMicroBlock = (node) =>
                converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend("self", str, 0, (params) => {
                const { node } = params;
                return createMicroBlock(node);
            });
        }

        // PWM
        // PWM.new
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

        // pwm = PWM.new
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^PWM\.new\(\s*(\d+),\s*timer:\s*(\d+),\s*frequency:\s*(\d+)\s*\)/
            );

            if (!match) return null;
            if (variable.name != `pwm${match[1]}`) return null;

            const [, pin, timer, frequency] = match;

            const block = converter.changeRubyExpressionBlock(
                rh,
                "microcom_pwm_init",
                "statement"
            );
            converter.addNumberInput(
                block,
                "PIN",
                "math_integer",
                Number(pin),
                10
            );
            converter.addNumberInput(
                block,
                "TIMER",
                "math_integer",
                Number(timer),
                10
            );
            converter.addNumberInput(
                block,
                "FREQ",
                "math_integer",
                Number(frequency),
                10
            );

            return block;
        });

        // pwm
        for (let pin = 0; pin <= 40; pin++) {
            let str = "pwm" + pin;

            const createMicroBlock = (node) =>
                converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend("self", str, 0, (params) => {
                const { node } = params;
                return createMicroBlock(node);
            });
        }

        // ADC
        // ADC.new
        converter.registerOnSend("::ADC", "new", 1, (params) => {
            const { receiver, args, node } = params;

            if (!converter.isNumber(args[0])) return null;

            const expression = `ADC.new( ${args[0].value} )`;
            //未解決のブロックがあるという意味でいったん保留
            return converter.createRubyExpressionBlock(expression, node);
        });

        // adc = ADC.new
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            const match = expression.match(/^ADC\.new\(\s*(\d+)\s*\)/);
            if (!match) return null;
            if (variable.name !== `adc${match[1]}`) return null;

            const block = converter.changeRubyExpressionBlock(
                rh,
                "microcom_adc_init",
                "statement"
            );
            converter.addNumberInput(
                block,
                "PIN",
                "math_integer",
                Number(match[1]),
                10
            );
            return block;
        });

        // adc
        for (let pin = 0; pin <= 40; pin++) {
            let str = "adc" + pin;

            const createMicroBlock = (node) =>
                converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend("self", str, 0, (params) => {
                const { node } = params;
                return createMicroBlock(node);
            });
        }

        // I2C
        // I2C.new
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

        // i2c = I2C.new
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

        // i2c
        converter.registerOnSend("self", "i2c", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("i2c", node);
        });

        // UART
        // UART.new
        converter.registerOnSend("::UART", "new", 2, (params) => {
            const { args, node } = params;

            if (!converter.isNumber(args[0])) return null;
            const baundrate = args[1].get("sym:baudrate");
            if (!baundrate) return null;
            if (!converter.isNumber(baundrate)) return null;

            const expression = `UART.new( ${args[0].value}, baudrate:${baundrate.value} )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // uart = UART.new
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^UART\.new\(\s*(\d+),\s*baudrate:\s*(\d+)\s*\)/
            );

            if (!match) return null;
            if (variable.name != `uart${match[1]}`) return null;

            const block = converter.changeRubyExpressionBlock(
                rh,
                "microcom_uart_init",
                "statement"
            );
            converter.addNumberInput(
                block,
                "UART",
                "math_integer",
                Number(match[1])
            );
            converter.addNumberInput(
                block,
                "RATE",
                "math_integer",
                Number(match[2])
            );

            return block;
        });

        // uart
        for (let pin = 0; pin <= 4; pin++) {
            converter.registerOnSend("self", "uart" + pin, 0, (params) => {
                const { node } = params;

                return converter.createRubyExpressionBlock("uart" + pin, node);
            });
        }

        // puts
        converter.registerOnSend("self", "puts", 1, (params) => {
            const { args } = params;
            if (!converter._isNumberOrStringOrBlock(args[0])) return null;

            const block = converter.createBlock("microcom_puts", "statement");
            converter._addTextInput(block, "TEXT", args[0], "test");
            return block;
        });
	
	// .to_i(16)
        converter.registerOnSend(['string', 'block'], 'to_i', 1, params => {
	    const {receiver} = params;

            const block = converter._createBlock('microcom_num16', 'value');
            converter._addTextInput(block, 'NUM', receiver, '77');
            return block;
        });

	// .to_s(16)
        converter.registerOnSend(['string', 'block'], 'to_s', 1, params => {
	    console.log( params );
	    const {receiver} = params;

            const block = converter._createBlock('microcom_str16', 'value');
	    converter._addTextInput(block, 'STR', receiver, '77');
            return block;
        });
	
	// .ord
        converter.registerOnSend(['string', 'block'], 'ord', 0, params => {
	    console.log( params );
	    const {receiver} = params;

            const block = converter._createBlock('microcom_ord', 'value');
            converter._addTextInput(block, 'STR', receiver, 'A');
            return block;
        });

	// .bytes
        converter.registerOnSend(['string', 'block'], 'bytes', 0, params => {
	    const {receiver} = params;

            const block = converter._createBlock('microcom_bytes', 'value');
            converter._addTextInput(block, 'STR', receiver, '77');
            return block;
        });

	// .split
        converter.registerOnSend(['string', 'block'], 'split', 1, params => {
	    console.log( params );
	    const {receiver} = params;

            const block = converter._createBlock('microcom_split', 'value');
            converter._addTextInput(block, 'STR', receiver, ',');
//            converter._addTextInput(block, 'DELIMITER', receiver, ',');
            return block;
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

	console.log( name );
	console.log( args );

	
        switch (name) {
            // gpio.write i2c.write
            case "write": {
                const match = receiverName.match(/^(.+?)(\d*)$/);

                if (match[1] == "gpio" && args.length == 1) {
                    // gpio.write
                    const pin = Number(match[2]);

                    if (!this._isNumber(args[0])) return null;
                    if (args[0].value !== 0 && args[0].value !== 1) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_gpio_write",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_gpio_write",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(
                        block,
                        "VALUE",
                        "math_integer",
                        args[0],
                        0
                    );
                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);

                    return block;
                } else if (match[1] == "i2c" && args.length == 3) {
                    // i2c.write
		    console.log( args );
                    if (!this.isStringOrBlock(args[0])) return null;
                    if (!this.isStringOrBlock(args[1])) return null;
                    if (!this.isStringOrBlock(args[2])) return null;

                    // ToDo: コマンドの詳しいチェック
		    
                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_i2c_write",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_i2c_write",
                                "statement"
                            );
                        }
                    })();
                    this._addTextInput(block, "ADDR",  args[0], "77");
                    this._addTextInput(block, "COMM1", args[1], "00");
                    this._addTextInput(block, "COMM2", args[2], "21");

                    return block;
                }
                break;
            }
            // gpio.read adc.read i2c.read
            case "read": {
                const match = receiverName.match(/^(.+?)(\d*)$/);
                const pin = Number(match[2]);

                if (match[1] == "gpio" && args.length == 0) {
                    // gpio.read
                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_gpio_read",
                                "value"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_gpio_read",
                                "value"
                            );
                        }
                    })();

                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);

                    return block;
                } else if (match[1] == "adc" && args.length == 0) {
                    // adc.read
                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_adc_volt",
                                "value"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_adc_volt",
                                "value"
                            );
                        }
                    })();
                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);

                    return block;
                } else if (match[1] == "i2c" && args.length == 2) {

		    if (!this.isStringOrBlock(args[0]))  return null;
                    if (!this._isNumber(args[1])) return null;
		    
		    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_i2c_read",
                                "value"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_i2c_read",
                                "value"
                            );
                        }
			})();
		    this._addTextInput(block, "ADDR", args[0], "77");
                    this._addNumberInput(
                        block,
                        "BYTES",
                        "math_integer",
                        Number(args[1]),
                        10
                    );

                    return block;
                }
                break;
            }
            // pwm.duty
            case "duty": {
                const match = receiverName.match(/^pwm(\d+)$/);

                const pin = Number(match[1]);

                if (match && args.length === 1) {
                    if (!this._isNumber(args[0])) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_pwm_duty",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_pwm_duty",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);
                    this._addNumberInput(
                        block,
                        "DUTY",
                        "math_number",
                        args[0],
                        10
                    );

                    return block;
                }
                break;
            }
            // pwm.frequency
            case "frequency": {
                const match = receiverName.match(/^pwm(\d+)$/);

                const pin = Number(match[1]);

                if (match && args.length === 1) {
                    if (!this._isNumber(args[0])) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_pwm_frequency",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_pwm_frequency",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);
                    this._addNumberInput(
                        block,
                        "FREQ",
                        "math_number",
                        args[0],
                        10
                    );

                    return block;
                }
                break;
            }
            // pwm.pulse_width_us
            case "pulse_width_us": {
                const match = receiverName.match(/^pwm(\d+)$/);

                const pin = Number(match[1]);

                if (match && args.length === 1) {
                    if (!this._isNumber(args[0])) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_pwm_pulse",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_pwm_pulse",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);
                    this._addNumberInput(
                        block,
                        "PULSE",
                        "math_number",
                        args[0],
                        10
                    );

                    return block;
                }
                break;
            }
            // adc.read_raw
            case "read_raw": {
                const match = receiverName.match(/^adc(\d+)$/);

                if (match && args.length == 0) {
                    const pin = Number(match[1]);

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_adc_raw",
                                "value"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_adc_raw",
                                "value"
                            );
                        }
                    })();
                    this._addNumberInput(block, "PIN", "math_integer", pin, 10);

                    return block;
                }
                break;
            }
            // uart.puts
            case "puts": {
                const match = receiverName.match(/^uart(\d+)$/);

                if (match && args.length == 1) {
                    const pin = Number(match[1]);

                    if (!this._isString(args[0])) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_uart_puts",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_uart_puts",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(
                        block,
                        "UART",
                        "math_integer",
                        pin,
                        10
                    );
                    this._addTextInput(block, "COMM", args[0], "Output String");

                    return block;
                }
                break;
            }
            // uart.gets
            case "gets": {
                const match = receiverName.match(/^uart(\d+)$/);

                if (match && args.length == 0) {
                    const pin = Number(match[1]);

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_uart_gets",
                                "value"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_uart_gets",
                                "value"
                            );
                        }
                    })();

                    this._addNumberInput(
                        block,
                        "UART",
                        "math_integer",
                        pin,
                        10
                    );

                    return block;
                }
                break;
            }
            // uart.tx_clear
            case "tx_clear": {
                const match = receiverName.match(/^uart(\d+)$/);

                if (match && args.length == 0) {
                    const pin = Number(match[1]);

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_uart_txclear",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_uart_txclear",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(
                        block,
                        "UART",
                        "math_integer",
                        pin,
                        10
                    );

                    return block;
                }
                break;
            }
            // uart.rx_clear
            case "rx_clear": {
                const match = receiverName.match(/^uart(\d+)$/);

                if (match && args.length == 0) {
                    const pin = Number(match[1]);

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "microcom_uart_rxclear",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "microcom_uart_rxclear",
                                "statement"
                            );
                        }
                    })();

                    this._addNumberInput(
                        block,
                        "UART",
                        "math_integer",
                        pin,
                        10
                    );

                    return block;
                }
                break;
            }
        }
        return null;
    },
};

export default MicrocomConverter;
