/**
 * converter for Utils
 */
const SmT_Utils_Converter = {
    register: function (converter) {

	// puts
        converter.registerOnSend("self", "puts", 1, (params) => {
            const { args } = params;
            if (!converter.isNumberOrStringOrBlock(args[0])) return null;

            const block = converter.createBlock("microcom_puts", "statement");
            converter.addTextInput(block, "TEXT", args[0], "test");
            return block;
        });
	
        // p
        converter.registerOnSend("self", "p", 1, (params) => {
            const { args } = params;
            if (!converter.isNumberOrStringOrBlock(args[0])) return null;

            const block = converter.createBlock("microcom_p", "statement");
            converter.addTextInput(block, "TEXT", args[0], "test");
            return block;
        });
	
	// .to_i(16)
        converter.registerOnSend(['string', 'block', 'variable'], 'to_i', 1, params => {
	    const {receiver} = params;

            const block = converter.createBlock('microcom_num16', 'value');
            converter.addTextInput(block, 'NUM', receiver, '77');
            return block;
        });

	// .to_s
        converter.registerOnSend(['string', 'block', 'variable'], 'to_s', 0, params => {
	    const {receiver} = params;

            const block = converter.createBlock('microcom_tools', 'value');
	    converter.addTextInput(block, 'STR', receiver, '77');
            converter.addField(block, "TOOL", 'to_s');
            return block;
        });


	// .to_s(16)
        converter.registerOnSend(['string', 'block', 'variable'], 'to_s', 1, params => {
	    const {receiver} = params;

            const block = converter.createBlock('microcom_tools', 'value');
	    converter.addTextInput(block, 'STR', receiver, '77');
            converter.addField(block, "TOOL", 'to_s(16)');
            return block;
        });
	
	// .ord
        converter.registerOnSend(['string', 'block', 'variable'], 'ord', 0, params => {
	    const {receiver} = params;

            const block = converter.createBlock('microcom_tools', 'value');
            converter.addTextInput(block, 'STR', receiver, 'A');
	    converter.addField(block, "TOOL", 'ord');
            return block;
        });

	// .bytes
        converter.registerOnSend(['string', 'block', 'variable'], 'bytes', 0, params => {
	    const {receiver} = params;

            const block = converter.createBlock('microcom_tools', 'value');
            converter.addTextInput(block, 'STR', receiver, '77');
	    converter.addField(block, "TOOL", 'bytes');
            return block;
        });

	// .split
        converter.registerOnSend(['string', 'block', 'variable'], 'split', 1, params => {
	    const {receiver} = params;

            const block = converter.createBlock('microcom_tools', 'value');
            converter.addTextInput(block, 'STR', receiver, ',');
	    converter.addField(block, "TOOL", 'split(",")');
            return block;
        });
	
	// .size
        converter.registerOnSend(['string', 'block', 'variable'], 'size', 0, params => {
	    const {receiver} = params;
	    
            const block = converter.createBlock('microcom_tools', 'value');
            converter.addTextInput(block, 'STR', receiver, '77');
	    converter.addField(block, "TOOL", 'size');
            return block;
        });

    },
};

export default SmT_Utils_Converter;
