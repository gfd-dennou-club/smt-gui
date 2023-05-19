/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    //クラス定義などはまとめておく
    //ブロック内で以下のようにけば，このコードを呼び出せる
    //Generator.prepares_[`sample`] = Generator.sample_init(null);
    Generator.sample_init = function() {
        return `Class.new \n\n`;
    };

    //各ブロックに対応する Ruby コードを書く
    Generator.sample_command0 = function () {
	 Generator.prepares_[`sample`] = Generator.sample_init(null);
        return `puts "command0"\n`;
    };
    
    Generator.sample_value0 = function () {
	return ['value0', Generator.ORDER_ATOMIC];
    };

    Generator.sample_flag0 = function () {
	return ['flag0', Generator.ORDER_ATOMIC];
    };
       
    Generator.sample_command1 = function (block) {
	Generator.prepares_[`sample`] = Generator.sample_init(null);
	const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
	const num  = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE)  || 0;
        return `puts(command1, ${text}, ${num})\n`;
    };

    Generator.sample_command2 = function (block) {
	Generator.prepares_[`sample`] = Generator.sample_init(null);
	const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        return `puts(command2, ${text1})\n`;
    };

    Generator.sample_command3 = function (block) {
	Generator.prepares_[`sample`] = Generator.sample_init(null);
	const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
	const num1  = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE)  || 0;	
        return `puts(command2, ${text1}, ${num1})\n`;
    };
    
    // メニューについては Ruby 側でも定義が必要のようだ
    Generator.sample_menu_menu1 = function (block) {
        const menu1 = Generator.getFieldValue(block, 'menu1') || null;
        return [menu1, Generator.ORDER_ATOMIC];
    };
    Generator.sample_menu_menu2 = function (block) {
        const menu2 = Generator.getFieldValue(block, 'menu2') || null;
        return [menu2, Generator.ORDER_ATOMIC];
    };
    
    return Generator;
}
