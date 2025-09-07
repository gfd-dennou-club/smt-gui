import _ from 'lodash';

/**
 * Pen converter
 */
const PenConverter = {
    register: function (converter) {
        // pen_clear method (sprite only)
        converter.registerCallMethod('sprite', 'pen_clear', 0, () =>
            converter.createBlock('pen_clear', 'statement')
        );

        // pen_stamp method (sprite only)
        converter.registerCallMethod('sprite', 'pen_stamp', 0, () =>
            converter.createBlock('pen_stamp', 'statement')
        );

        // pen_down method (sprite only)
        converter.registerCallMethod('sprite', 'pen_down', 0, () =>
            converter.createBlock('pen_penDown', 'statement')
        );

        // pen_up method (sprite only)
        converter.registerCallMethod('sprite', 'pen_up', 0, () =>
            converter.createBlock('pen_penUp', 'statement')
        );

        // pen_color= method (sprite only)
        converter.registerCallMethod('sprite', 'pen_color=', 1, params => {
            const {args} = params;

            if (converter.isNumberOrBlock(args[0])) {
                const block = converter.createBlock('pen_setPenColorParamTo', 'statement');
                converter.addFieldInput(
                    block, 'COLOR_PARAM', 'pen_menu_colorParam', 'colorParam',
                    'color', 'color'
                );
                converter.addNumberInput(block, 'VALUE', 'math_number', args[0], 50);
                return block;
            } else if (converter._isColorOrBlock(args[0])) {
                const block = converter.createBlock('pen_setPenColorToColor', 'statement');
                converter.addFieldInput(block, 'COLOR', 'colour_picker', 'COLOUR', args[0], '#43066f');
                return block;
            }
            return null;
        });

        // pen_saturation= method (sprite only)
        converter.registerCallMethod('sprite', 'pen_saturation=', 1, params => {
            const {args} = params;
            if (!converter.isNumberOrBlock(args[0])) return null;

            const block = converter.createBlock('pen_setPenColorParamTo', 'statement');
            converter.addFieldInput(
                block, 'COLOR_PARAM', 'pen_menu_colorParam', 'colorParam',
                'saturation', 'color'
            );
            converter.addNumberInput(block, 'VALUE', 'math_number', args[0], 50);
            return block;
        });

        // pen_brightness= method (sprite only)
        converter.registerCallMethod('sprite', 'pen_brightness=', 1, params => {
            const {args} = params;
            if (!converter.isNumberOrBlock(args[0])) return null;

            const block = converter.createBlock('pen_setPenColorParamTo', 'statement');
            converter.addFieldInput(
                block, 'COLOR_PARAM', 'pen_menu_colorParam', 'colorParam',
                'brightness', 'color'
            );
            converter.addNumberInput(block, 'VALUE', 'math_number', args[0], 50);
            return block;
        });

        // pen_transparency= method (sprite only)
        converter.registerCallMethod('sprite', 'pen_transparency=', 1, params => {
            const {args} = params;
            if (!converter.isNumberOrBlock(args[0])) return null;

            const block = converter.createBlock('pen_setPenColorParamTo', 'statement');
            converter.addFieldInput(
                block, 'COLOR_PARAM', 'pen_menu_colorParam', 'colorParam',
                'transparency', 'color'
            );
            converter.addNumberInput(block, 'VALUE', 'math_number', args[0], 50);
            return block;
        });

        // pen_size= method (sprite only)
        converter.registerCallMethod('sprite', 'pen_size=', 1, params => {
            const {args} = params;
            if (!converter.isNumberOrBlock(args[0])) return null;

            const block = converter.createBlock('pen_setPenSizeTo', 'statement');
            converter.addNumberInput(block, 'SIZE', 'math_number', args[0], 1);
            return block;
        });
    },

    // Keep onOpAsgn for += operators
    // eslint-disable-next-line no-unused-vars
    onOpAsgn: function (lh, operator, rh) {
        let block;
        if (this._isRubyStatement(lh) && operator === '+' && this._isNumberOrBlock(rh)) {
            const code = this._getRubyStatement(lh);
            switch (code) {
            case 'self.pen_size':
                block = this._changeBlock(lh, 'pen_changePenSizeBy', 'statement');
                delete this._context.blocks[block.inputs.STATEMENT.block];
                delete block.inputs.STATEMENT;

                this._addNumberInput(block, 'SIZE', 'math_number', rh, 1);
                break;
            case 'self.pen_color':
            case 'self.pen_saturation':
            case 'self.pen_brightness':
            case 'self.pen_transparency':
                block = this._changeBlock(lh, 'pen_changePenColorParamBy', 'statement');
                delete this._context.blocks[block.inputs.STATEMENT.block];
                delete block.inputs.STATEMENT;

                this._addFieldInput(
                    block, 'COLOR_PARAM', 'pen_menu_colorParam', 'colorParam',
                    code.replace('self.pen_', ''), 'color'
                );
                this._addNumberInput(block, 'VALUE', 'math_number', rh, 10);
                break;
            }
        }
        return block;
    }
};

export default PenConverter;
