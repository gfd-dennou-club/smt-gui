/* global Opal */
import _ from 'lodash';

/**
 * MakeyMakey converter
 */
const MakeyMakeyConverter = {
    // eslint-disable-next-line no-unused-vars
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {
        let block;
        if ((this._isSelf(receiver) || receiver === Opal.nil) &&
            name === 'when' &&
            args.length === 2 && args[0].type === 'sym' &&
            rubyBlockArgs && rubyBlockArgs.length === 0 &&
            rubyBlock) {
            switch (args[0].value) {
            case 'makey_key_pressed':
                if (this._isStringOrBlock(args[1])) {
                    block = this._createBlock('makeymakey_whenMakeyKeyPressed', 'hat');
                    this._addInput(
                        block,
                        'KEY',
                        this._createFieldBlock('makeymakey_menu_KEY', 'KEY', args[1])
                    );
                    this._setParent(rubyBlock, block);
                }
                break;
            case 'makey_pressed_in_oder':
                if (this._isStringOrBlock(args[1])) {
                    block = this._createBlock('makeymakey_whenCodePressed', 'hat');
                    this._addInput(
                        block,
                        'SEQUENCE',
                        this._createFieldBlock('makeymakey_menu_SEQUENCE', 'SEQUENCE', args[1])
                    );
                    this._setParent(rubyBlock, block);
                }
                break;
            }
        }
        return block;
    }
};

export default MakeyMakeyConverter;
