import { rubyclubMenu4 } from "../../../../scratch-vm/src/extensions/rubyclub";

/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    //クラス定義などはまとめておく
    //ブロック内で以下のようにけば，このコードを呼び出せる
    //Generator.prepares_[`sample`] = Generator.sample_init(null);
    Generator.rubyclub_init = function() {
        return `Class.new \n\n`;
    };

    //各ブロックに対応する Ruby コードを書く
    Generator.rubyclub_command0 = function () {
         Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        return `puts "command0"\n`;
    };

    Generator.rubyclub_value0 = function () {
        return ['value0', Generator.ORDER_ATOMIC];
    };

    Generator.rubyclub_flag0 = function () {
        return ['flag0', Generator.ORDER_ATOMIC];
    };

    Generator.rubyclub_command1 = function (block) {
        Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        const num  = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE)  || 0;
        return `puts(command1, ${text}, ${num})\n`;
    };

    Generator.rubyclub_command2 = function (block) {
        Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        return `puts(command2, ${text1})\n`;
    };

    Generator.rubyclub_command3 = function (block) {
        Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        const num1  = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE)  || 0;
        return `puts(command2, ${text1}, ${num1})\n`;
    };


    


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    Generator.rubyclub_r1 = function (block) {
        //Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        return `led${text1} = GPIO.new( ${text1}, GPIO::OUT )\n`
        //return `puts(command2, ${text1})\n`;
    };

    Generator.rubyclub_r2 = function (block) {
        // Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        const text = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        const num  = Generator.valueToCode(block, 'NUM1', Generator.ORDER_NONE)  || 0;
        return `led${text}.write(${num})\n`;
    };

    Generator.rubyclub_r3 = function (block) {
        //Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        return `led${text1} = GPIO.new( ${text1}, GPIO::OUT )\n`;
    };

    Generator.rubyclub_r4 = function (block) {
        const text1 = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
        return `sw${text1}.read == 1\n`;
    };

    Generator.rubyclub_r5 = function () {
        Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
       return `pwm1 = PWM.new( 15 )\n`;
   };

   Generator.rubyclub_r6 = function (block) {
    Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
    const text = Generator.valueToCode(block, 'TEXT1', Generator.ORDER_NONE) || null;
    return `pwm1.freq(${text}), pwm1.duty(512)\n`;
};

Generator.rubyclub_r7 = function () {
    Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
   return `pwm1.duty(0)\n`;
};

Generator.rubyclub_r8 = function () {
    Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
   return `adc = ADC.new( 39, ADC::ATTEN_11DB, ADC::WIDTH_12BIT )\n`;
};

Generator.rubyclub_r9 = function () {
    Generator.prepares_[`sample`] = Generator.rubyclub_init(null);
   return `voltage = adc.read()
   temp = 1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - voltage) / (voltage/ 10.0) / 10.0) + 1.0 / (25.0 + 273.0) ) - 273.0
   \n`;
};

Generator.rubyclub_r10 = function () {
    return `sprintf("%.1f", temp).to_f\n`;
};



    // メニューについては Ruby 側でも定義が必要のようだ
    Generator.rubyclub_menu_menu1 = function (block) {
        const menu1 = Generator.getFieldValue(block, 'menu1') || null;
        return [menu1, Generator.ORDER_ATOMIC];
    };
    Generator.rubyclub_menu_menu2 = function (block) {
        const menu2 = Generator.getFieldValue(block, 'menu2') || null;
        return [menu2, Generator.ORDER_ATOMIC];
    };
    Generator.rubyclub_menu_menu3 = function (block) {
        const menu3 = Generator.getFieldValue(block, 'menu3') || null;
        return [menu3, Generator.ORDER_ATOMIC];
    };
    Generator.rubyclub_menu_menu4 = function (block) {
        const menu4 = Generator.getFieldValue(block, 'menu4') || null;
        return [menu4, Generator.ORDER_ATOMIC];
    };

    return Generator;
}