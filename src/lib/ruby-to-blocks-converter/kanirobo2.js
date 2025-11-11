const GPIO = "GPIO";

const Kanirobo2Converter = {
    register: function (converter) {
        converter.registerCallMethod("self", GPIO, 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock(GPIO, node);
        });
        converter.registerCallMethod("self", "gpio32", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("gpio32", node);
        });
        converter.registerCallMethod("self", "gpio25", 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock("gpio25", node);
        });

        // gpio32.write()
        converter.registerCallMethod("gpio32", "write", 1, (params) => {
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

        // gpio25.write()
        converter.registerCallMethod("gpio25", "write", 1, (params) => {
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

        // GPIO.new()
        converter.registerCallMethod(GPIO, "new", 2, (params) => {
            const { args, node } = params;
            if (!converter.isNumberOrBlock(args[0])) return null;
            if (args[0].value !== 25 && args[0].value !== 32) return null;
            // ToDo: GPIO::OUTについてもチェックができるといい

            const expression = `GPIO.new(${args[0].value}, GPIO::OUT)`;
            return converter.createRubyExpressionBlock(expression, node);
        });

        // PWM.new()
        converter.registerCallMethod("PWM", "new", 2, (params) => {
            const { args, node } = params;
            if (!converter.isNumberOrBlock(args[0])) return null;
            if (args[0].value !== 26 && args[0].value !== 33) return null;
            // ToDo: GPIO::OUTについてもチェックができるといい

            const expression = `PWM.new(${args[0].value}, timer: )`;
            return converter.createRubyExpressionBlock(expression, node);
        });
    },

    onVasgn: function (scope, variable, rh) {
        const expression = this._getRubyExpression(rh);
        if (!expression) return null;

        const match = expression.match(/GPIO\.new\(\s*(\d+),\s*GPIO::OUT\s*\)/);
        if (!match) return null;
        if (variable.name !== `gpio${match[1]}`) return null;
        console.log(match[1]);

        const block = this._changeRubyExpressionBlock(
            rh,
            "kanirobo2_command2",
            "statement"
        );
        this._addField(block, "TEXT", match[1]);

        return block;
    },
};

export default Kanirobo2Converter;
