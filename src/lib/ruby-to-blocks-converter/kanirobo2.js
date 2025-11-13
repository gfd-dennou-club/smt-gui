const classNames = ["GPIO", "PWM", "ADC"];
const gpioPins = ["25", "32"];
const pwmPins = ["26", "33", "27", "14"];
const adcPins = ["36", "34", "35", "2"];

const deleteBlock = (converter, block) => {
    if (converter._context.blocks[block.id]) {
        if (block.inputs) {
            for (const inputName in block.inputs) {
                const inputBlockId = block.inputs[inputName].block;
                if (inputBlockId && converter._context.blocks[inputBlockId]) {
                    delete converter._context.blocks[inputBlockId];
                }
            }
        }
        delete converter._context.blocks[block.id];
    }
};

const Kanirobo2Converter = {
    register: function (converter) {
        // GPIO,PWM,ADC
        classNames.forEach((className) => {
            converter.registerCallMethod("self", className, 0, (params) => {
                const { node } = params;

                return converter.createRubyExpressionBlock(className, node);
            });
        });
        // gpio
        gpioPins.forEach((pin) => {
            // gpio
            converter.registerCallMethod("self", "gpio" + pin, 0, (params) => {
                const { node } = params;
                return converter.createRubyExpressionBlock("gpio" + pin, node);
            });
            // gpio.write
            // converter.registerCallMethod("gpio" + pin, "write", 1, (params) => {
            //     const { receiver, args } = params;
            //     if (!converter.isNumber(args[0])) return null;
            //     if (args[0].value !== 0 && args[0].value !== 1) return null;
            //     const block = converter.changeRubyExpressionBlock(
            //         receiver,
            //         "kanirobo2_command4",
            //         "statement"
            //     );
            //     converter.addField(block, "TEXT1", pin);
            //     converter.addField(block, "TEXT2", args[0]);
            //     return block;
            // });
        });
        // pwm
        pwmPins.forEach((pin) => {
            // pwm
            converter.registerCallMethod("self", "pwm" + pin, 0, (params) => {
                const { node } = params;

                return converter.createRubyExpressionBlock("pwm" + pin, node);
            });

            // switch (pin) {
            //     // pwm.pulse_with_us
            //     case "27":
            //     case "14":
            //         converter.registerCallMethod(
            //             "pwm" + pin,
            //             "pulse_with_us",
            //             1,
            //             (params) => {
            //                 const { receiver, args } = params;
            //                 const pulseWidth = (() => {
            //                     if (converter.isBlock(args[0])) {
            //                         const source = converter._getSource(
            //                             args[0].node
            //                         );

            //                         deleteBlock(converter, args[0]);

            //                         return source.match(/(\d+)\.to_i\s*\*/)[1];
            //                     }
            //                 })();
            //                 if (!pulseWidth) return null;

            //                 const block = converter.changeRubyExpressionBlock(
            //                     receiver,
            //                     "kanirobo2_command8",
            //                     "statement"
            //                 );
            //                 converter.addField(block, "TEXT", pin);
            //                 converter.addNumberInput(
            //                     block,
            //                     "NUM",
            //                     "math_number",
            //                     Number(pulseWidth)
            //                 );
            //                 return block;
            //             }
            //         );
            //     case "26":
            //     case "33":
            //         // pwm.duty
            //         converter.registerCallMethod(
            //             "pwm" + pin,
            //             "duty",
            //             1,
            //             (params) => {
            //                 const { receiver, args } = params;

            //                 const duty = (() => {
            //                     if (converter.isBlock(args[0])) {
            //                         const source = converter._getSource(
            //                             args[0].node
            //                         );

            //                         deleteBlock(converter, args[0]);

            //                         return source.match(
            //                             /\(\s*(\d+)\s*%\s*\d+\s*\)\.to_i/
            //                         )[1];
            //                     }
            //                 })();
            //                 if (!duty) return null;

            //                 const block = converter.changeRubyExpressionBlock(
            //                     receiver,
            //                     "kanirobo2_command5",
            //                     "statement"
            //                 );
            //                 converter.addField(block, "TEXT", pin);
            //                 converter.addNumberInput(
            //                     block,
            //                     "NUM",
            //                     "math_number",
            //                     Number(duty)
            //                 );
            //                 return block;
            //             }
            //         );
            // }
        });
        // adc
        adcPins.forEach((pin) => {
            // adc
            converter.registerCallMethod("self", "adc" + pin, 0, (params) => {
                const { node } = params;

                return converter.createRubyExpressionBlock("adc" + pin, node);
            });

            // adc.read_raw
            // converter.registerCallMethod(
            //     "adc" + pin,
            //     "read_raw",
            //     0,
            //     (params) => {
            //         const { receiver } = params;

            //         const block = converter.changeRubyExpressionBlock(
            //             receiver,
            //             "kanirobo2_value0",
            //             "statement"
            //         );
            //         converter.addField(block, "TEXT", pin);

            //         return block;
            //     }
            // );
        });

        // GPIO.new()
        converter.registerCallMethod("GPIO", "new", 2, (params) => {
            const { args, node } = params;
            if (!converter.isNumber(args[0])) return null;
            if (args[0].value !== 25 && args[0].value !== 32) return null;
            // ToDo: GPIO::OUTについてもチェックができるといい

            const expression = `GPIO.new(${args[0].value}, GPIO::OUT)`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // PWM.new()
        converter.registerCallMethod("PWM", "new", 2, (params) => {
            const { args, node } = params;

            const timer = args[1].get("sym:timer");
            const channel = args[1].get("sym:channel");
            const frequency = args[1].get("sym:frequency");

            if (!converter.isNumber(args[0])) return null;
            if (
                args[0].value !== 26 &&
                args[0].value !== 33 &&
                args[0].value !== 27 &&
                args[0].value !== 14
            )
                return null;
            if (!converter.isNumber(timer)) return null;
            if (!converter.isNumber(channel)) return null;
            const freqValue = (() => {
                if (converter.isNumber(frequency)) {
                    return frequency.value;
                } else if (
                    Array.isArray(frequency) &&
                    converter.isBlock(frequency[0])
                ) {
                    const block = frequency[0];
                    const source = converter._getSource(block.node);

                    deleteBlock(converter, block);

                    return source;
                } else {
                    return null;
                }
            })();
            if (!freqValue) return null;

            const expression = `PWM.new(${args[0].value}, timer:${timer.value}, channel:${channel.value}, frequency:${freqValue})`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // ADC.new()
        converter.registerCallMethod("ADC", "new", 1, (params) => {
            const { args, node } = params;
            if (!converter.isNumber(args[0])) return null;
            if (
                args[0].value !== 36 &&
                args[0].value !== 34 &&
                args[0].value !== 35 &&
                args[0].value !== 2
            )
                return null;

            const expression = `ADC.new(${args[0].value})`;
            return converter.createRubyExpressionBlock(expression, node);
        });
    },

    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {
        const receiverName = (() => {
            if (this._isRubyArgument(receiver)) {
                return receiver.fields.VALUE.value;
            } else if (this._isRubyExpression(receiver)) {
                return this._getRubyExpression(receiver);
            } else {
                return null;
            }
        })();

        if (!receiverName) return null;

        switch (name) {
            case "write": {
                const match = receiverName.match(/^gpio(\d+)$/);

                if (match && args.length === 1) {
                    const pin = match[1];

                    if (!this.isNumber(args[0])) return null;
                    if (args[0].value !== 0 && args[0].value !== 1) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "kanirobo2_command4",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "kanirobo2_command4",
                                "statement"
                            );
                        }
                    })();

                    this._addField(block, "TEXT1", pin);
                    this._addField(block, "TEXT2", args[0].value);
                    return block;
                }
                break;
            }
            case "duty": {
                const match = receiverName.match(/^pwm(\d+)$/);

                const pin = match[1];
                if (pin !== "26" && pin !== "33") return null;

                if (match && args.length === 1) {
                    const duty = (() => {
                        if (this._isBlock(args[0])) {
                            const source = this._getSource(args[0].node);

                            deleteBlock(this, args[0]);

                            console.log(args[0]);

                            return source.match(
                                /\(\s*(\d+)\s*%\s*\d+\s*\)\.to_i/
                            )[1];
                        }
                    })();
                    if (!duty) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "kanirobo2_command5",
                                "statement"
                            );
                        } else {
                            this._changeBlock(
                                receiver,
                                "kanirobo2_command5",
                                "statement"
                            );
                        }
                    })();

                    this._addField(block, "TEXT", pin);
                    this._addNumberInput(
                        block,
                        "NUM",
                        "math_number",
                        Number(duty)
                    );
                    return block;
                }
                break;
            }
            case "read_raw": {
                const match = receiverName.match(/^adc(\d+)$/);

                if (match) {
                    const pin = match[1];

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "kanirobo2_value0",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "kanirobo2_value0",
                                "statement"
                            );
                        }
                    })();
                    this._addField(block, "TEXT", pin);

                    return block;
                }
                break;
            }
            case "pulse_with_us": {
                const match = receiverName.match(/^pwm(\d+)$/);

                const pin = match[1];
                if (pin !== "27" && pin !== "14") return null;

                if (match && args.length === 1) {
                    const pulseWidth = (() => {
                        if (this._isBlock(args[0])) {
                            const source = this._getSource(args[0].node);

                            deleteBlock(this, args[0]);

                            return source.match(/(\d+)\.to_i\s*\*/)[1];
                        }
                    })();
                    if (!pulseWidth) return null;

                    const block = (() => {
                        if (this._isRubyExpression(receiver)) {
                            return this._changeRubyExpressionBlock(
                                receiver,
                                "kanirobo2_command8",
                                "statement"
                            );
                        } else {
                            return this._changeBlock(
                                receiver,
                                "kanirobo2_command8",
                                "statement"
                            );
                        }
                    })();

                    this._addField(block, "TEXT", pin);
                    this._addNumberInput(
                        block,
                        "NUM",
                        "math_number",
                        Number(pulseWidth)
                    );
                    return block;
                }
                break;
            }
        }
        return null;
    },

    onVasgn: function (scope, variable, rh) {
        const expression = this._getRubyExpression(rh);
        if (!expression) return null;

        const className = expression.substring(0, expression.indexOf("."));

        switch (className) {
            // GPIO.new
            case "GPIO": {
                const match = expression.match(
                    /GPIO\.new\(\s*(\d+),\s*GPIO::OUT\s*\)/
                );
                if (variable.name !== `gpio${match[1]}`) return null;

                const block = this._changeRubyExpressionBlock(
                    rh,
                    "kanirobo2_command2",
                    "statement"
                );
                this._addField(block, "TEXT", match[1]);

                return block;
            }
            // ADC.new
            case "ADC": {
                const match = expression.match(/^ADC\.new\(\s*(\d+)\s*\)/);
                if (variable.name !== `adc${match[1]}`) return null;

                const block = this._changeRubyExpressionBlock(
                    rh,
                    "kanirobo2_command6",
                    "statement"
                );
                this._addField(block, "TEXT", match[1]);

                return block;
            }
            // PWM.new
            case "PWM": {
                const match = expression.match(
                    /^PWM\.new\(\s*(\d+),\s*timer:\s*(\d+),\s*channel:\s*(\d+),\s*frequency:\s*(.+?)\s*\)/
                );
                if (variable.name !== `pwm${match[1]}`) return null;

                const [, pin, timer, channel, frequency] = match;

                // motor
                if (pin === "26" || pin === "33") {
                    if (timer !== "1") return null;
                    if (
                        (pin === "26" && channel !== "1") ||
                        (pin === "33" && channel !== "2")
                    )
                        return null;

                    const block = this._changeRubyExpressionBlock(
                        rh,
                        "kanirobo2_command3",
                        "statement"
                    );
                    this._addField(block, "TEXT", pin);

                    return block;
                    // servo
                } else if (pin === "27" || pin === "14") {
                    if (timer !== "2") return null;
                    if (
                        (pin === "27" && channel !== "3") ||
                        (pin === "14" && channel !== "4")
                    )
                        return null;

                    const servoMatch = frequency.match(
                        /1000\s*\/\s*(\d+)\.to_i\s*/
                    );
                    if (!servoMatch) return null;

                    const block = this._changeRubyExpressionBlock(
                        rh,
                        "kanirobo2_command7",
                        "statement"
                    );
                    this._addField(block, "TEXT", pin);
                    this._addNumberInput(
                        block,
                        "NUM",
                        "math_number",
                        Number(servoMatch[1])
                    );

                    return block;
                }
            }
        }
    },
};

export default Kanirobo2Converter;
