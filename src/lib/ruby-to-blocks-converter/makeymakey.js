import _ from 'lodash';

/**
 * MakeyMakey converter
 */
const MakeyMakeyConverter = {
    register: function (converter) {
        // when :makey_key_pressed, key do ... end
        converter.registerCallMethodWithBlock('self', 'when', 2, 0, params => {
            const {args, rubyBlock} = params;
            if (args.length === 2 && args[0].type === 'sym' && rubyBlock) {
                switch (args[0].value) {
                case 'makey_key_pressed':
                    if (converter._isStringOrBlock(args[1])) {
                        const block = converter._createBlock('makeymakey_whenMakeyKeyPressed', 'hat');
                        converter._addInput(
                            block,
                            'KEY',
                            converter._createFieldBlock('makeymakey_menu_KEY', 'KEY', args[1])
                        );
                        converter._setParent(rubyBlock, block);
                        return block;
                    }
                    break;
                case 'makey_pressed_in_oder':
                    if (converter._isStringOrBlock(args[1])) {
                        const block = converter._createBlock('makeymakey_whenCodePressed', 'hat');
                        converter._addInput(
                            block,
                            'SEQUENCE',
                            converter._createFieldBlock('makeymakey_menu_SEQUENCE', 'SEQUENCE', args[1])
                        );
                        converter._setParent(rubyBlock, block);
                        return block;
                    }
                    break;
                }
            }
            return null;
        });
    }
};

export default MakeyMakeyConverter;
