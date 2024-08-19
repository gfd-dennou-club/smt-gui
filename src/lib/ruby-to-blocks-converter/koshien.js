const Koshien = 'koshien';

const KoshienConverter = {
    register: function (converter) {
        converter.registerCallMethod('self', Koshien, 0, params => {
            const {node} = params;

            return converter.createRubyExpressionBlock(Koshien, node);
        });

        converter.registerCallMethod(Koshien, 'connect_game', 1, params => {
            const {receiver, args} = params;

            const name = args[0].get('sym:name');
            if (!converter.isStringOrBlock(name)) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_connectGame', 'statement');
            converter.addTextInput(block, 'NAME', name, 'player1');
            return block;
        });

        const checkX = block => {
            if (converter.isBlock(block)) return true;
            return block.value >= 0 && block.value <= 14;
        };
        const checkY = checkX;

        converter.registerCallMethod(Koshien, 'get_map_area', 2, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!checkX(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;
            if (!checkY(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_getMapArea', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);
            return block;
        });

        converter.registerCallMethod(Koshien, 'map', 2, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!checkX(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;
            if (!checkY(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_map', 'value');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);

            return block;
        });

        converter.registerCallMethod(Koshien, 'move_to', 2, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_moveTo', 'statement');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);
            return block;
        });

        converter.registerCallMethod(Koshien, 'calc_route', 1, params => {
            const {receiver, args} = params;

            const srcArray = args[0].get('sym:src');
            const dstArray = args[0].get('sym:dst');
            const exceptCells = args[0].get('sym:except_cells');
            const result = args[0].get('sym:result');
            if (!converter.isNumberOrBlock(srcArray.value[0])) return null;
            if (!checkX(srcArray.value[0])) return null;
            if (!converter.isNumberOrBlock(srcArray.value[1])) return null;
            if (!checkY(srcArray.value[1])) return null;
            if (!converter.isNumberOrBlock(dstArray.value[0])) return null;
            if (!checkX(dstArray.value[0])) return null;
            if (!converter.isNumberOrBlock(dstArray.value[1])) return null;
            if (!checkY(dstArray.value[1])) return null;
            if (!converter.isString(exceptCells)) return null;
            if (!converter.isString(result)) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_calcRoute', 'statement');
            converter.addNumberInput(block, 'SRC_X', 'math_number', srcArray.value[0], 0);
            converter.addNumberInput(block, 'SRC_Y', 'math_number', srcArray.value[1], 0);
            converter.addNumberInput(block, 'DST_X', 'math_number', dstArray.value[0], 0);
            converter.addNumberInput(block, 'DST_Y', 'math_number', dstArray.value[1], 0);
            converter.addField(block, 'EXCEPT_CELLS', exceptCells);
            converter.addField(block, 'RESULT', result);
            return block;
        });

        converter.registerCallMethod(Koshien, 'set_dynamite', 2, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_setItem', 'statement');
            converter.addField(block, 'ITEM', 'dynamite');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);
            return block;
        });

        converter.registerCallMethod(Koshien, 'set_bomb', 2, params => {
            const {receiver, args} = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_setItem', 'statement');
            converter.addField(block, 'ITEM', 'bomb');
            converter.addNumberInput(block, 'X', 'math_number', args[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[1], 0);
            return block;
        });

        converter.registerCallMethod(Koshien, 'save_map_all', 1, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_saveMapAll', 'statement');
            converter.addTextInput(block, 'LOCATION', args[0], 'map1');
            return block;
        });

        converter.registerCallMethod(Koshien, 'load_map', 3, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0])) return null;
            if (!converter.isNumberOrBlock(args[1])) return null;
            if (!checkX(args[1])) return null;
            if (!converter.isNumberOrBlock(args[2])) return null;
            if (!checkY(args[2])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_loadMap', 'value');
            converter.addTextInput(block, 'LOCATION', args[0], 'map1');
            converter.addNumberInput(block, 'X', 'math_number', args[1], 0);
            converter.addNumberInput(block, 'Y', 'math_number', args[2], 0);

            return block;
        });

        converter.registerCallMethod(Koshien, 'locate_objects', 1, params => {
            const {receiver, args} = params;

            const sqSize = args[0].get('sym:sq_size');
            const centArray = args[0].get('sym:cent');
            const objects = args[0].get('sym:objects');
            const result = args[0].get('sym:result');

            if (!converter.isNumberOrBlock(sqSize)) return null;
            if (!converter.isNumberOrBlock(centArray.value[0])) return null;
            if (!checkX(centArray.value[0])) return null;
            if (!converter.isNumberOrBlock(centArray.value[1])) return null;
            if (!checkY(centArray.value[1])) return null;
            if (!converter.isStringOrBlock(objects)) return null;
            if (!converter.isStringOrBlock(result)) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_locateObjects', 'statement');
            converter.addNumberInput(block, 'SQ_SIZE', 'math_number', sqSize, 0);
            converter.addNumberInput(block, 'X', 'math_number', centArray.value[0], 0);
            converter.addNumberInput(block, 'Y', 'math_number', centArray.value[1], 0);
            converter.addTextInput(block, 'OBJECTS', objects, '0');
            converter.addField(block, 'RESULT', result);
            return block;
        });

        converter.registerCallMethod(Koshien, 'other_player_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'other_player');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });

        converter.registerCallMethod(Koshien, 'other_player_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'other_player');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });

        converter.registerCallMethod(Koshien, 'enemy_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'enemy');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });

        converter.registerCallMethod(Koshien, 'enemy_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'enemy');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });

        converter.registerCallMethod(Koshien, 'goal_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'goal');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });

        converter.registerCallMethod(Koshien, 'goal_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'goal');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });

        converter.registerCallMethod(Koshien, 'player_x', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'player');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });

        converter.registerCallMethod(Koshien, 'player_y', 0, params => {
            const {receiver} = params;
            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_targetCoordinate', 'value');
            converter.addField(block, 'TARGET', 'player');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });

        converter.registerCallMethod(Koshien, 'turn_over', 0, params => {
            const {receiver} = params;
            return converter.changeRubyExpressionBlock(receiver, 'koshien_turnOver', 'statement');
        });


        converter.registerCallMethod(Koshien, 'coordinate_of_x', 1, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_coordinateOf', 'value');
            converter.addTextInput(block, 'WHERE', args[0], '0:0');
            converter.addField(block, 'COORDINATE', 'x');
            return block;
        });

        converter.registerCallMethod(Koshien, 'coordinate_of_y', 1, params => {
            const {receiver, args} = params;

            if (!converter.isStringOrBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(receiver, 'koshien_coordinateOf', 'value');
            converter.addTextInput(block, 'WHERE', args[0], '0:0');
            converter.addField(block, 'COORDINATE', 'y');
            return block;
        });
    }
};

export default KoshienConverter;
