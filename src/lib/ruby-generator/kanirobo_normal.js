/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    //クラス定義などはまとめておく
    //ブロック内で以下のようにけば，このコードを呼び出せる
    //Generator.prepares_[`sample`] = Generator.sample_init(null);
    Generator.kaniroboNormal_init = function() {
        return `Class.new \n\n`;
    };

    Generator.kaniroboNormal_menu_menu1 = function (block){
        const Menu1 = Generator.getFieldValue(block, 'menu1') || null;
        return [Menu1, Generator.ORDER_ATMIC];
    };

    Generator.kaniroboNormal_menu_menu2 = function (block){
        const Menu2 = Generator.getFieldValue(block, 'menu2') || null;
        return [Menu2, Generator.ORDER_ATMIC];
    };

    Generator.kaniroboNormal_menu_menu3 = function (block){
        const Menu3 = Generator.getFieldValue(block, 'menu3') || null;
        return [Menu3, Generator.ORDER_ATMIC];
    };

    Generator.kaniroboNormal_menu_menu4 = function (block){
        const Menu4 = Generator.getFieldValue(block, 'menu4') || null;
        return [Menu4, Generator.ORDER_ATMIC];
    };

    Generator.kaniroboNormal_menu_menu5 = function (block){
        const Menu5 = Generator.getFieldValue(block, 'menu5') || null;
        return [Menu5, Generator.ORDER_ATMIC];
    };

    Generator.kaniroboNormal_menu_menu6 = function (block){
        const Menu6 = Generator.getFieldValue(block, 'menu6') || null;
        return [Menu6, Generator.ORDER_ATMIC];
    };

    Generator.kaniroboNormal_menu_menu7 = function (block){
        const Menu7 = Generator.getFieldValue(block, 'menu7') || null;
        return [Menu7, Generator.ORDER_ATMIC];
    };

    //各ブロックに対応する Ruby コードを書く
    Generator.kaniroboNormal_command0 = function (block) {
	 //Generator.prepares_[`kaniroboNormal`] = Generator.kaniroboNormal_init(null);
        return `motorEn = GPIO.new(12, GPIO::OUT)\n`;
    };

    Generator.kaniroboNormal_command1 = function (block) {
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        console.log(text1);
        return `motorEn.${text1}\n`;
    };

    Generator.kaniroboNormal_command2 = function (block) {
        const text2 = Generator.valueToCode(block, 'TEXT2', Generator.ORDER_NONE) || null;
        console.log(text2);
        return `motor${text2} = GPIO.new(${text2}, GPIO::OUT)\n`;
    };
    
    Generator.kaniroboNormal_command3 = function (block) {
        const text5 = Generator.valueToCode(block, 'TEXT5', Generator.ORDER_NONE) || null;
        console.log(text5);
        return `motor${text5}_pwm = PWM.new(${text5}, ch=0)\n`;
    };

    Generator.kaniroboNormal_command4 = function (block) {
        const text2 = Generator.valueToCode(block, 'TEXT2', Generator.ORDER_NONE) || null;
        const text3 = Generator.valueToCode(block, 'TEXT3', Generator.ORDER_NONE) || null;
        console.log(text2);
        console.log(text3);
        return `motor${text2}.${text3}\n`;
    };

    Generator.kaniroboNormal_command5 = function (block) {
        const text5 = Generator.valueToCode(block, 'TEXT5', Generator.ORDER_NONE) || null;
        const num  = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE)  || 0;
        console.log(text5);
        return `motor${text5}_pwm.duty(${num})\n`;
    };

    Generator.kaniroboNormal_command6 = function (block) {
        const text4 = Generator.valueToCode(block, 'TEXT4', Generator.ORDER_NONE) || null;
        console.log(text4);
        return `lux${text4} = ADC.new(${text4}, ADC::ATTEN_11DB, ADC::WIDTH_12BIT)\n`;
    };

    Generator.kaniroboNormal_value0 = function (block) {
        const text4 = Generator.valueToCode(block, 'TEXT4', Generator.ORDER_NONE) || null;
        console.log(text4);
        return `lux${text4}.rawread\n`;
    };

    Generator.kaniroboNormal_command7 = function (block) {
        const text7 = Generator.valueToCode(block, 'TEXT7', Generator.ORDER_NONE) || null;
        console.log(typeof text7);
        console.log(text7);
        const a = text7.substr( 0, 2 );
        const b = text7.substr( 2, 1 );
        return `servo${a} = PWM.new(${a}, ch=${b})\n`; //chの値の変更
    };

    Generator.kaniroboNormal_command8 = function (block) {
        const text6 = Generator.valueToCode(block, 'TEXT6', Generator.ORDER_NONE) || null;
        const num  = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE)  || 0;
        console.log(text6);
        console.log(num);
        return `servo${text6}.freq(${num})\n`;
    };

    Generator.kaniroboNormal_command9 = function (block) {
        const text6 = Generator.valueToCode(block, 'TEXT6', Generator.ORDER_NONE) || null;
        const num  = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE)  || 0;
        console.log(text6);
        return `servo${text6}.duty(${num})\n`;
    };

    Generator.kaniroboNormal_value1 = function (block) {
        const num  = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE)  || 0;
        console.log(num);
        return `(((${num}.to_f - 90.0) * 0.95 / 90.0 + 1.45) / 20.0 * 1024).to_i\n`;
    };

    // メニューについては Ruby 側でも定義が必要のようだ
    
    return Generator;
}
