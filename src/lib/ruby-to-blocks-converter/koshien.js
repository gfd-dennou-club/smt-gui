import {a} from 'bowser';

const Koshien = 'koshien';

const KoshienConverter = {
    register: function (converter) {
        converter.registerCallMethod('self', Koshien, 0, params => {
            const {node} = params;

            return converter.createRubyExpressionBlock(Koshien, node);
        });

        converter.registerCallMethod(Koshien, 'move_to', 1, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_move_to', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'calc_route', 1, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0].get('sym:src').value)) return null;
            if (!converter.isStringOrBlock(args[0].get('sym:dst').value)) return null;
            if (!converter.isNumberOrBlock(args[0].get('sym:except_cells').value)) return null;

            const src = args[0].get('sym:src').value.split(':');
            const dst = args[0].get('sym:dst').value.split(':');

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_calc_route', 'value');
            converter.addNumberInput(block, 'SRC_X', 'math_number', Number(src[0]), 0);
            converter.addNumberInput(block, 'SRC_Y', 'math_number', Number(src[1]), 0);
            converter.addNumberInput(block, 'DST_X', 'math_number', Number(dst[0]), 0);
            converter.addNumberInput(block, 'DST_Y', 'math_number', Number(dst[1]), 0);
            converter.addNumberInput(block, 'LIST', 'math_number', Number(args[0].get('sym:except_cells')), 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'get_map_area', 1, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_get_map_area', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'set_dynamite', 1, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_set_item', 'statement');
            converter.addField(block, 'ITEM', 'dynamite');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'set_bomb', 1, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0].value[0])) return null;
            if (!converter.isNumberOrBlock(args[0].value[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_set_item', 'statement');
            converter.addField(block, 'ITEM', 'bomb');
            converter.addNumberInput(block, 'X', 'math_number', args[0].value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[0].value[1], 0);
            return block;
        });
        converter.registerCallMethod(Koshien, 'map', 3, params => {
            const {receiver, args} = params;

            const location = args[2].get('sym:on').value;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;
            if (!converter.isStringOrBlock(location)) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_map', 'value');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);
            converter.addNumberInput(block, 'LOCATION', location, 0);

            return block;
        });
        converter.registerCallMethod(Koshien, 'map_all', 1, params => {
            const {receiver, args} = params;

            const location = args[0].get('sym:save_as').value;
            if (!converter.isStringOrBlock(location)) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_map_all', 'statement');
            converter.addTextInput(block, 'LOCATION', location, 'map_1');
            return block;
        });
        converter.registerCallMethod(Koshien, 'locate_objects', 1, params => {
            const {receiver, args} = params;

            const sq_size = args[0].get('sym:sq_size').value;
            const cent = args[0].get('sym:cent').value;
            const objects = args[0].get('sym:objects').value;

            if (!converter.isNumberOrBlock(sq_size)) return null;
            if (!converter.isStringOrBlock(cent)) return null;
            if (!converter.isStringOrBlock(objects)) return null;

            const cent_coordinate = cent.split(':');

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_locate_objects', 'value');
            converter.addNumberInput(block, 'SIZE', 'math_number', sq_size, 0);
            converter.addNumberInput(block, 'X', 'math_number', Number(cent_coordinate[0]), 0);
            converter.addNumberInput(block, 'Y', 'math_number', Number(cent_coordinate[1]), 0);
            converter.addTextInput(block, 'ITEM', objects, '0');
            return block;
        });
        converter.registerCallMethod(Koshien, 'other_player_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'other_player');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });
        converter.registerCallMethod(Koshien, 'other_player_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'other_player');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });
        converter.registerCallMethod(Koshien, 'enemy_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'enemy');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });
        converter.registerCallMethod(Koshien, 'enemy_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'enemy');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });
        converter.registerCallMethod(Koshien, 'goal_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'goal');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });
        converter.registerCallMethod(Koshien, 'goal_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'goal');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });
        converter.registerCallMethod(Koshien, 'player_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'player');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });
        converter.registerCallMethod(Koshien, 'player_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_target_coordinate', 'value');
            converter.addField(block, 'TARGET', 'player');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });
        converter.registerCallMethod(Koshien, 'turn_over', 0, params => {
            const {receiver} = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_turn_over', 'value');
        });
        converter.registerCallMethod(Koshien, 'connect_game', 1, params => {
            const {receiver, args} = params;

            const name = args[0].get('sym:player_name').value;
            if (!converter.isStringOrBlock(name)) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_connect_game', 'statement');
            converter.addTextInput(block, 'NAME', name, 'test');
            return block;
        });
        converter.registerCallMethod(Koshien, 'position_x', 1, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_position_coordinate', 'value');
            converter.addTextInput(block, 'WHERE', args[0], '4:3');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });
        converter.registerCallMethod(Koshien, 'position_y', 1, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_position_coordinate', 'value');
            converter.addTextInput(block, 'WHERE', args[0], '0:0');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });
    }
};
export default KoshienConverter;
