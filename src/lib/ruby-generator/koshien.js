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
    Generator.koshien_get_map_area = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.get_map_area([${x},${y}])\n`;
    };
    Generator.koshien_set_dynamite = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.set_dynamite([${x},${y}])\n`;
    };
    Generator.koshien_set_bomb = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return `koshien.set_bomb([${x},${y}])\n`;
    };
    Generator.koshien_map = function (block) {
        const x = Generator.valueToCode(block, 'X', Generator.ORDER_NONE) || 0;
        const y = Generator.valueToCode(block, 'Y', Generator.ORDER_NONE) || 0;
        return [`koshien.map([${x},${y}])`];
    };
    Generator.koshien_other_player_x = function () {
        return [`koshien.other_player_x`];
    };
    Generator.koshien_other_player_y = function () {
        return [`koshien.other_player_y`];
    };
    Generator.koshien_enemy_x = function () {
        return [`koshien.enemy_x`];
    };
    Generator.koshien_enemy_y = function () {
        return [`koshien.enemy_y`];
    };
    Generator.koshien_goal_x = function () {
        return [`koshien.goal_x`];
    };
    Generator.koshien_goal_y = function () {
        return [`koshien.enemy_y`];
    };
    Generator.koshien_player_x = function () {
        return [`koshien.player_x`];
    };
    Generator.koshien_player_y = function () {
        return [`koshien.player_y`];
    };
    Generator.koshien_set_name = function (block) {
        const name = Generator.valueToCode(block, 'NAME', Generator.ORDER_NONE) || Generator.quote_('test');
        return `koshien.set_name(${name})\n`;
    };
    Generator.koshien_turn_over = function () {
        return `koshien.turn_over\n`;
    };
    Generator.koshien_connect_game = function () {
        return `koshien.connect_game\n`;
    };

    return Generator;
}