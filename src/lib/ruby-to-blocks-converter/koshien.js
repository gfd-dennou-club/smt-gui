
const Koshien = 'koshien'
const KoshienConverter = {
    register: function (converter) {
        converter.registerCallMethod('self', Koshien, 0, params => {
            const { node } = params;

            return converter.createRubyExpressionBlock(Koshien, node);
        });

        converter.registerCallMethod(Koshien, 'move_to', 2, params => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_move_to', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);
            return block;
        });
    }
};
export default KoshienConverter;