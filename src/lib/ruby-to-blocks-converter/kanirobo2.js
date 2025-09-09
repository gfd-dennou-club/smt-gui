const GPIO = "GPIO";

const Kanirobo2Converter = {
    register: function (converter) {
        converter.registerCallMethod("self", GPIO, 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock(GPIO, node);
        });
        converter.registerCallMethod("self", "motor32", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("motor32", node);
        });
        converter.registerCallMethod("self", "motor25", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("motor25", node);
        });

        // motor32.write()
        converter.registerCallMethod("motor32", "write", 1, (params) => {
            const { receiver, args } = params;
            if (
                !converter.isNumberOrBlock(args[0]) &&
                (args[0].value == 0 || args[0].value == 1)
            )
                return null;
            const block = converter.changeRubyExpressionBlock(
                receiver,
                "kanirobo2_command4",
                "statement"
            );
            converter.addField(block, "TEXT1", "32");
            converter.addFieldInput(
                block,
                "TEXT2",
                "kanirobo2_menu_menu1",
                "menu1",
                args[0],
                "0"
            );
            return block;
        });

        // motor25.write()
        converter.registerCallMethod("motor25", "write", 1, (params) => {
            const { receiver, args } = params;
            if (
                !converter.isNumberOrBlock(args[0]) &&
                (args[0].value == 0 || args[0].value == 1)
            )
                return null;
            const block = converter.changeRubyExpressionBlock(
                receiver,
                "kanirobo2_command4",
                "statement"
            );
            converter.addField(block, "TEXT1", "25");
            converter.addFieldInput(
                block,
                "TEXT2",
                "kanirobo2_menu_menu1",
                "menu1",
                args[0],
                "0"
            );
            return block;
        });

        converter.registerCallMethod("self", "motor32 = ", 1, (params) => {
            const { receiver, args } = params;
            const block = converter.changeRubyExpressionBlock(
                receiver,
                "kanirobo2_command4",
                "statement"
            );
            converter.addField(block, "TEXT1", "25");
            converter.addFieldInput(
                block,
                "TEXT2",
                "kanirobo2_menu_menu1",
                "menu1",
                args[0],
                "0"
            );
            return block;
        });

        // 高尾
        converter.registerCallMethod("self", GPIO, 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock(GPIO, node);
        });

        // GPIO.new(32, GPIO::OUT)
        converter.registerCallMethod(GPIO, "new", 2, (params) => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (args[0].value !== 25 && args[0].value !== 32) return null;
            if (args[1].toString() !== "GPIO::OUT") return null;

            // ここでは receiver = GPIO という Ruby の式を
            // GPIO.new(32, GPIO::OUT) という式に変換しています。
            const textBlock =
                converter._context.blocks[receiver.inputs.EXPRESSION.block];
            textBlock.fields.TEXT.value = `GPIO.new(${args[0].value}, GPIO::OUT)`;
            return receiver;
        });
    },

    onVasge: function (scope, variable, rh, code) {
        let block;
        let pat, pin;
        switch(variable.name) {
            case 'motor32':
            case 'motor25':
                pin = parseInt(variable.name.substring(variable.name.length - 2, variable.name.length))
                pat = new RegExpo(variable.name + "\\s*=\\s*GPIO.new\\(" + pin + ",\\s*GPIO::OUT\\)")
                if (pat.test(code)) {
                    block = this._createBlock()
                }

        }
    },

    onOpAsgn: function (lh, operator, rh) {
        let block;
        console.log(operator);
        if (
            this._isRubyStatement(lh) &&
            operator === "=" &&
            this._isNumberOrBlock(rh)
        ) {
            const code = this._getRubyStatement(lh);
            switch (code) {
                case "self.pen_size":
                    block = this._changeBlock(
                        lh,
                        "pen_changePenSizeBy",
                        "statement"
                    );
                    delete this._context.blocks[block.inputs.STATEMENT.block];
                    delete block.inputs.STATEMENT;

                    this._addNumberInput(block, "SIZE", "math_number", rh, 1);
                    break;
                case "self.pen_color":
                case "self.pen_saturation":
                case "self.pen_brightness":
                case "self.pen_transparency":
                    block = this._changeBlock(
                        lh,
                        "pen_changePenColorParamBy",
                        "statement"
                    );
                    delete this._context.blocks[block.inputs.STATEMENT.block];
                    delete block.inputs.STATEMENT;

                    this._addFieldInput(
                        block,
                        "COLOR_PARAM",
                        "pen_menu_colorParam",
                        "colorParam",
                        code.replace("self.pen_", ""),
                        "color"
                    );
                    this._addNumberInput(block, "VALUE", "math_number", rh, 10);
                    break;
            }
        }
        return block;
    },
};

export default Kanirobo2Converter;
