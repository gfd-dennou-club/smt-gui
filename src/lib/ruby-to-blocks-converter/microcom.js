const classNames = ["GPIO", "PWM", "ADC", "UART", "I2C"];

const getClassConstant = (block) => {
    const value = block.value;
    if (!value) return null;

    const scope = value.scope;
    const name = value.name;
    return `${scope}::${name}`;
};

/**
 * KaniRobo converter
 */
const MicrocomConverter = {
    register: function (converter) {
        //Class
        classNames.forEach((className) => {
            const createMicroBlock = (node) =>
                converter.createRubyExpressionBlock(className, node);
            converter.registerOnSend("self", className, 0, (params) => {
                console.log("ClassName start");
                const { node } = params;
                return createMicroBlock(node);
            });
        });

        // GPIO
        // GPIO.new out
        converter.registerOnSend("::GPIO", "new", 2, (params) => {
            const { args, node } = params;

            if (!converter.isNumber(args[0])) return null;
            const mode = getClassConstant(args[1]);
            if (mode != "::GPIO::OUT") return null;

            const expression = `GPIO.new(${args[0].value}, GPIO::OUT)`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // GPIO.new in
        converter.registerOnSend("::GPIO", "new", 3, (params) => {
            const { args, node } = params;

            if (!converter.isNumber(args[0])) return null;
            const mode = getClassConstant(args[1]);
            if (mode != "::GPIO::IN") return null;
            const pullMode = getClassConstant(args[2]);
            if (pullMode != "::GPIO::PULL_UP") return null;

            const expression = `GPIO.new(${args[0].value}, GPIO::IN, GPIO::PULL_UP)`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // gpio = GPIO.new
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /GPIO\.new\(\s*([^,]+?)\s*,\s*([^,]+?)\s*(?:,\s*([^,]+?)\s*)?\)/
            );
            if (!match) return null;
            if (variable.name !== `gpio${match[1]}`) return null;

            const opcode = (() => {
                if (match[2] == "GPIO::OUT" && match[3] == null)
                    return "microcom_gpio_output_init";
                else if (match[2] == "GPIO::IN" && match[3] == "GPIO::PULL_UP")
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

            // // gpio.write
            // converter.registerOnSend(str, "write", 1, (params) => {
            //     const { receiver, args } = params;
            //     if (!converter.isNumberOrBlock(args[0])) return null;

            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_gpio_write",
            //         "statement"
            //     );
            //     converter.addNumberInput(
            //         block,
            //         "VALUE",
            //         "math_integer",
            //         args[0],
            //         0
            //     );
            //     converter.addNumberInput(block, "PIN", "math_integer", pin, 10);
            //     return block;
            // });

            // // gpio.read
            // converter.registerOnSend(str, "read", 0, (params) => {
            //     const { receiver, args } = params;
            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_gpio_read",
            //         "value"
            //     );
            //     converter.addNumberInput(block, "PIN", "math_integer", pin, 10);
            //     return block;
            // });
        }

        // PWM
        // PWM.new
        converter.registerOnSend("::PWM", "new", 2, (params) => {
            const { args, node } = params;

            const timer = args[1].get("sym:timer");
            const channel = args[1].get("sym:channel");
            const frequency = args[1].get("sym:frequency");

            if (!converter.isNumber(args[0])) return null;
            if (!converter.isNumber(timer)) return null;
            if (!converter.isNumber(channel)) return null;
            if (!converter.isNumber(frequency)) return null;

            const expression = `PWM.new(${args[0].value}, timer:${timer.value}, channel:${channel.value}, frequency:${frequency.value})`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // pwm = PWM.new
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^PWM\.new\(\s*(\d+),\s*timer:\s*(\d+),\s*channel:\s*(\d+),\s*frequency:\s*(\d+)\s*\)/
            );

            if (!match) return null;
            if (variable.name != `pwm${match[1]}`) return null;

            const [, pin, timer, channel, frequency] = match;

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
                "CHAN",
                "math_integer",
                Number(channel),
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
        for (let pin = 0; pin <= 40; pin++) {
            let str = "pwm" + pin;

            const createMicroBlock = (node) =>
                converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend("self", str, 0, (params) => {
                const { node } = params;
                return createMicroBlock(node);
            });

            // converter.registerOnSend(str, "duty", 1, (params) => {
            //     const { receiver, args } = params;
            //     if (!converter._isNumberOrBlock(args[0])) return null;

            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_pwm_duty",
            //         "statement"
            //     );
            //     converter._addNumberInput(
            //         block,
            //         "DUTY",
            //         "math_integer",
            //         args[0],
            //         0
            //     );
            //     converter._addNumberInput(
            //         block,
            //         "PIN",
            //         "math_integer",
            //         pin,
            //         10
            //     );
            //     return block;
            // });

            // converter.registerOnSend(str, "frequency", 1, (params) => {
            //     const { receiver, args } = params;
            //     if (!converter._isNumberOrBlock(args[0])) return null;

            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_pwm_frequency",
            //         "statement"
            //     );
            //     converter._addNumberInput(
            //         block,
            //         "FREQ",
            //         "math_integer",
            //         args[0],
            //         1000
            //     );
            //     converter._addNumberInput(
            //         block,
            //         "PIN",
            //         "math_integer",
            //         pin,
            //         10
            //     );
            //     return block;
            // });

            // converter.registerOnSend(str, "pulse_width_us", 1, (params) => {
            //     const { receiver, args } = params;
            //     if (!converter._isNumberOrBlock(args[0])) return null;

            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_pwm_pulse",
            //         "statement"
            //     );
            //     converter._addNumberInput(
            //         block,
            //         "PULSE",
            //         "math_integer",
            //         args[0],
            //         10
            //     );
            //     converter._addNumberInput(
            //         block,
            //         "PIN",
            //         "math_integer",
            //         pin,
            //         10
            //     );
            //     return block;
            // });
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

        for (let pin = 0; pin <= 40; pin++) {
            let str = "adc" + pin;

            // adc
            const createMicroBlock = (node) =>
                converter.createRubyExpressionBlock(str, node);
            converter.registerOnSend("self", str, 0, (params) => {
                const { node } = params;
                return createMicroBlock(node);
            });

            // // adc.read_raw
            // converter.registerOnSend(str, "read_raw", 0, (params) => {
            //     console.log("test");
            //     const { receiver } = params;
            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_adc_raw",
            //         "value"
            //     );
            //     converter.addNumberInput(block, "PIN", "math_integer", pin, 10);
            //     return block;
            // });

            // // adc.read
            // converter.registerOnSend(str, "read", 0, (params) => {
            //     const { receiver } = params;
            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "microcom_adc_volt",
            //         "value"
            //     );
            //     converter.addNumberInput(block, "PIN", "math_integer", pin, 10);
            //     return block;
            // });
        }

        // puts
        converter.registerOnSend("self", "puts", 1, (params) => {
            const { args } = params;
            if (!converter._isNumberOrStringOrBlock(args[0])) return null;

            const block = converter.createBlock("microcom_puts", "statement");
            converter._addTextInput(block, "TEXT", args[0], "test");
            return block;
        });
    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {
        const receiverName = (() => {
            if (this._isRubyExpression(receiver)) {
                return this._getRubyExpression(receiver);
            } else {
                return receiver.fields.VALUE.value;
            }
        })();

        if (!receiverName) return null;

        switch (name) {
            // gpio.write
            case "write": {
                const match = receiverName.match(/^gpio(\d+)$/);

                if (match && args.length === 1) {
                    const pin = Number(match[1]);

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
                }
                break;
            }
            // gpio.read adc.read
            case "read": {
                const match = receiverName.match(/^(\D+)(\d+)$/);
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
                    this.addNumberInput(block, "PIN", "math_integer", pin, 10);

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

                if (match) {
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
        }
        return null;
    },
};

export default MicrocomConverter;
