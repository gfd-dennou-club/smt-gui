/**
 * Define Ruby code generator for Microbit More Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */

export default function (Generator) {
    Generator.koshien_move_to = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.move_to([${x},${y}])\n`;
    };
    Generator.koshien_calc_route = function (block) {
        const src_x = Generator.valueToCode(block, 'SRC_X', Generator.ORDER_NONE) || 0;
        const src_y = Generator.valueToCode(block, 'SRC_Y', Generator.ORDER_NONE) || 0;
        const dst_x = Generator.valueToCode(block, 'DST_X', Generator.ORDER_NONE) || 0;
        const dst_y = Generator.valueToCode(block, 'DST_Y', Generator.ORDER_NONE) || 0;
        const list = Generator.valueToCode(block, 'LIST', Generator.ORDER_NONE) || 0;

        return [`koshien.calc_route(src:"${src_x}:${src_y}",dst:"${dst_x}:${dst_y}",except_cells:${list})`];
    };
    Generator.koshien_get_map_area = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.get_map_area([${x},${y}])\n`;
    };
    Generator.koshien_set_item = function (block) {
        const item = Generator.getFieldValue(block, 'ITEM') || null;
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.set_${item}([${x},${y}])\n`;
    };
    Generator.koshien_map = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        const location = Generator.valueToCode(block, 'LOCATION', Generator.ORDER_NONE) || Generator.quote_('map_1');
        return [`koshien.map(${x},${y} on: ${location})`];
    };
    Generator.koshien_map_all = function (block) {
        const location = Generator.valueToCode(block, 'LOCATION', Generator.ORDER_NONE) || Generator.quote_('map_1');
        return [`koshien.map(save_as: ${location})`];
    };
    Generator.koshien_locate_objects = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE) || 5;
        const item = Generator.valueToCode(block, 'ITEM', Generator.ORDER_NONE) || Generator.quote_('["A","B","C","D"]');

        return [`koshien.locate_objects(sq_size:${size},cent:"${x}:${y}",objects:${item})`];
    };
    Generator.koshien_target_coordinate = function (block) {
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        const coordinate = Generator.getFieldValue(block, 'COORDINATE') || null;
        return [`koshien.${target}_${coordinate}`];
    };
    Generator.koshien_turn_over = function () {
        return `koshien.turn_over\n`;
    };
    Generator.koshien_connect_game = function (block) {
        const name = Generator.valueToCode(block, 'NAME', Generator.ORDER_NONE) || Generator.quote_('test');
        return `koshien.connect_game(player_name:${name})\n`;
    };
    Generator.koshien_position_coordinate = function (block) {
        const where = Generator.valueToCode(block, 'WHERE', Generator.ORDER_NONE) || Generator.quote_('0:0');
        const coordinate = Generator.getFieldValue(block, 'COORDINATE') || null;
        return [`koshien.position_${coordinate}(${where})`];
    };

    return Generator;
}