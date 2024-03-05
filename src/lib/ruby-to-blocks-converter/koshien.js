
const Koshien = 'koshien'
const KoshienConverter = {
    register: function (converter) {
        converter.registerCallMethod('self', Koshien, 0, params => {
            const { node } = params;

            return converter.createRubyExpressionBlock(Koshien, node);
        });
        converter.registerCallMethod(Koshien, 'move_to', 1, params => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_move_to', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'get_map_area', 1, params => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_get_map_area', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'set_dynamite', 1, params => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_set_dynamite', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'set_bomb', 1, params => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_set_bomb', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'map', 1, params => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_map', 'value');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'other_player_x', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_other_player_x', 'value');
        });
        converter.registerCallMethod(Koshien, 'other_player_y', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_other_player_y', 'value');
        });
        converter.registerCallMethod(Koshien, 'enemy_x', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_enemy_x', 'value');
        });
        converter.registerCallMethod(Koshien, 'enemy_y', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_enemy_y', 'value');
        });
        converter.registerCallMethod(Koshien, 'goal_x', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_goal_x', 'value');
        });
        converter.registerCallMethod(Koshien, 'goal_y', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_goal_y', 'value');
        });
        converter.registerCallMethod(Koshien, 'player_x', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_player_x', 'value');
        });
        converter.registerCallMethod(Koshien, 'player_y', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_player_y', 'value');
        });
        converter.registerCallMethod(Koshien, 'set_name', 1, params => {
            const { receiver, args } = params;

            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_set_name', 'statement');
            converter.addTextInput(block, 'NAME', args[0], 'test');
            return block;
        });
        converter.registerCallMethod(Koshien, 'turn_over', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_turn_over', 'value');
        });
        converter.registerCallMethod(Koshien, 'connect_game', 0, params => {
            const { receiver } = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_connect_game', 'value');
        });
    }
};
export default KoshienConverter;