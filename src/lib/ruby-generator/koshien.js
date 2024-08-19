/**
 * Define Ruby code generator for Microbit More Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.koshien_connectGame = function (block) {
        const name = Generator.valueToCode(block, 'NAME', Generator.ORDER_NONE) || Generator.quote_('player1');
        return `koshien.connect_game(name: ${name})\n`;
    };

    Generator.koshien_getMapArea = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.get_map_area(${x}, ${y})\n`;
    };

    Generator.koshien_map = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return [`koshien.map(${x}, ${y})`];
    };

    Generator.koshien_moveTo = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.move_to(${x}, ${y})\n`;
    };

    Generator.koshien_calcRoute = function (block) {
        const srcX = Generator.valueToCode(block, 'SRC_X', Generator.ORDER_NONE) || 0;
        const srcY = Generator.valueToCode(block, 'SRC_Y', Generator.ORDER_NONE) || 0;
        const dstX = Generator.valueToCode(block, 'DST_X', Generator.ORDER_NONE) || 0;
        const dstY = Generator.valueToCode(block, 'DST_Y', Generator.ORDER_NONE) || 0;
        const exceptCells = Generator.quote_(
            Generator.getFieldValue(block, 'EXCEPT_CELLS', Generator.ORDER_NONE) || ' '
        );
        const result = Generator.quote_(
            Generator.getFieldValue(block, 'RESULT', Generator.ORDER_NONE) || ' '
        );

        // eslint-disable-next-line max-len
        return `koshien.calc_route(src: [${srcX}, ${srcY}], dst: [${dstX}, ${dstY}], except_cells: ${exceptCells}, result: ${result})\n`;
    };

    Generator.koshien_setItem = function (block) {
        const item = Generator.getFieldValue(block, 'ITEM') || null;
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.set_${item}(${x}, ${y})\n`;
    };

    Generator.koshien_loadMap = function (block) {
        const location = Generator.valueToCode(block, 'LOCATION', Generator.ORDER_NONE) || Generator.quote_('map1');
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return [`koshien.load_map(${location}, ${x}, ${y})`];
    };

    Generator.koshien_saveMapAll = function (block) {
        const location = Generator.valueToCode(block, 'LOCATION', Generator.ORDER_NONE) || Generator.quote_('map1');
        return `koshien.save_map_all(${location})\n`;
    };

    Generator.koshien_locateObjects = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        const sqSize = Generator.valueToCode(block, 'SQ_SIZE', Generator.ORDER_NONE) || 5;
        const objects = Generator.valueToCode(block, 'OBJECTS', Generator.ORDER_NONE) || Generator.quote_('A B C D');
        const result = Generator.quote_(
            Generator.getFieldValue(block, 'RESULT', Generator.ORDER_NONE) || ' '
        );

        // eslint-disable-next-line max-len
        return `koshien.locate_objects(sq_size: ${sqSize}, cent: [${x}, ${y}], objects: ${objects}, result: ${result})\n`;
    };
    Generator.koshien_targetCoordinate = function (block) {
        const target = Generator.getFieldValue(block, 'TARGET') || 'player';
        const coordinate = Generator.getFieldValue(block, 'COORDINATE') || 'x';
        return [`koshien.${target}_${coordinate}`];
    };
    Generator.koshien_turnOver = function () {
        return `koshien.turn_over\n`;
    };
    Generator.koshien_coordinateOf = function (block) {
        const where = Generator.valueToCode(block, 'WHERE', Generator.ORDER_NONE) || Generator.quote_('0:0');
        const coordinate = Generator.getFieldValue(block, 'COORDINATE') || null;
        return [`koshien.coordinate_of_${coordinate}(${where})`];
    };

    return Generator;
}
