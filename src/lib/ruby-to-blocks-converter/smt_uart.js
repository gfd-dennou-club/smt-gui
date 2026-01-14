const getClassConstant = (block) => {
    const value = block.value;
    if (!value) return null;

    const scope = value.scope;
    const name = value.name;
    return `${scope}::${name}`;
};

/**
 * converter for UART
 */
const SmT_UART_Converter = {
    register: function (converter) {

        // --- UART.new の変換 ---
        converter.registerOnSend("::UART", "new", 2, (params) => {
            const { args, node } = params;

            if (!converter.isNumber(args[0])) return null;
            const baundrate = args[1].get("sym:baudrate");
            if (!baundrate) return null;
            if (!converter.isNumber(baundrate)) return null;

            const expression = `UART.new( ${args[0].value}, baudrate:${baundrate.value} )`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // --- uart = UART.new の代入を init ブロックへ変換 ---
        converter.registerOnVasgn((scope, variable, rh) => {
            const expression = converter.getRubyExpression(rh);
            if (!expression) return null;

            const match = expression.match(
                /^UART\.new\(\s*(\d+),\s*baudrate:\s*(\d+)\s*\)/
            );

            if (!match) return null;
            if (variable.name != `uart${match[1]}`) return null;

            const block = converter.changeRubyExpressionBlock(
                rh, "microcom_uart_init", "statement"
            );
            converter.addNumberInput(block, "UART", "math_integer", Number(match[1]));
            converter.addNumberInput(block, "RATE", "math_integer", Number(match[2]));
            return block;
        });

        // --- uart のレシーバの登録 ---
        for (let pin = 0; pin <= 4; pin++) {
            converter.registerOnSend("self", "uart" + pin, 0, (params) => {
                const { node } = params;
                return converter.createRubyExpressionBlock("uart" + pin, node);
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

	const match = receiverName.match(/^uart(\d+)$/);
	if (!match) return null;
        const pin = Number(match[1]);	
	
	switch (name) {

            // uart.puts
            case "puts": {
                if (args.length != 1) return null;
                if (!this._isString(args[0])) return null;

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_uart_puts", "statement"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_uart_puts", "statement"
                        );
                    }
                })();
		this._addNumberInput(block, "UART", "math_integer", pin, 10);
                this._addTextInput(block, "COMM", args[0], "Output String");
                return block;
                break;
            }

            // uart.gets
            case "gets": {
                if (args.length != 0) return null;
                const pin = Number(match[1]);

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_uart_gets", "value"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_uart_gets", "value"
                        );
                    }
                })();
		this._addNumberInput(block, "UART", "math_integer", pin, 10);
		return block;
                break;
            }

            // uart.clear_tx_buffer
            case "clear_tx_buffer": {
                if (args.length != 0) return null;
                const pin = Number(match[1]);

                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_uart_txclear", "statement"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_uart_txclear", "statement"
                        );
                    }
                })();
		this._addNumberInput(block, "UART", "math_integer", pin, 10);
                return block;
                break;
            }

            // uart.clear_rx_buffer
            case "clear_rx_buffer": {
                if (args.length != 0) return null;
                const pin = Number(match[1]);
		
                const block = (() => {
                    if (this._isRubyExpression(receiver)) {
                        return this._changeRubyExpressionBlock(
                            receiver, "microcom_uart_rxclear", "statement"
                        );
                    } else {
                        return this._changeBlock(
                            receiver, "microcom_uart_rxclear", "statement"
                        );
                    }
                })();		
                this._addNumberInput(block, "UART", "math_integer", pin, 10);
                return block;
                break;
            }
        }
        return null;
    },
};

export default SmT_UART_Converter;
