const Tools = "tools";
const ToolsConverter = {
    register: function (converter) {
        // puts()
        converter.registerCallMethod("self", "puts", 1, (params) => {
            const { args } = params;
            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.createBlock("tools_puts", "statement");
            converter.addTextInput(block, "TEXT", args[0], "test");
            return block;
        });
    },
};
export default ToolsConverter;
