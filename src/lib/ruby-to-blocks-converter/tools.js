const Tools = "tools";
const ToolsConverter = {
    register: function (converter) {
        //正しい tools.puts()
        converter.registerCallMethod("self", Tools, 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock(Tools, node);
        });
        converter.registerCallMethod(Tools, "puts", 1, (params) => {
            const { receiver, args } = params;
            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "tools_puts",
                "statement"
            );
            converter.addTextInput(block, "TEXT", args[0], "test");
            return block;
        });

        //正しい puts()
        converter.registerCallMethod("self", "puts", 1, (params) => {
            const { args } = params;
            console.error(args[0].value.name);
            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.createBlock("tools_puts", "statement");
            converter.addTextInput(block, "TEXT", args[0], "test");
            return block;
        });
    },
};
export default ToolsConverter;
