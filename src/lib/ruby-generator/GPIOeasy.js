/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    //クラス定義などはまとめておく
    //ブロック内で以下のようにけば，このコードを呼び出せる
    //Generator.prepares_[`sample`] = Generator.sample_init(null);
    Generator.GPIOeasy_LED_init = function () {
        return `led13 = GPIO.new( 13, GPIO::OUT )\nled12 = GPIO.new( 12, GPIO::OUT )\nled14 = GPIO.new( 14, GPIO::OUT )\nled27 = GPIO.new( 27, GPIO::OUT )\nled26 = GPIO.new( 26, GPIO::OUT )\nled25 = GPIO.new( 25, GPIO::OUT )\nled33 = GPIO.new( 33, GPIO::OUT )\nled32 = GPIO.new( 32, GPIO::OUT )\n`;
    };

    Generator.GPIOeasy_Switch_init = function () {
        return `sw34 = GPIO.new( 34, GPIO::IN, GPIO::PULL_UP)\nsw35 = GPIO.new( 35, GPIO::IN, GPIO::PULL_UP)\nsw18 = GPIO.new( 18, GPIO::IN, GPIO::PULL_UP)\nsw19 = GPIO.new( 19, GPIO::IN, GPIO::PULL_UP)\n`;
    };

    Generator.GPIOeasy_Sound_init = function () {
        return `pwm1 = PWM.new( 15 )\n`;
    };

    Generator.GPIOeasy_Temperature_init = function () {
        return `adc = ADC.new( 39, ADC::ATTEN_11DB, ADC::WIDTH_12BIT )\n\ndef adc_measure(adc)\n  voltage = adc.read()temp = 1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - voltage) / (voltage/ 10.0) / 10.0) + 1.0 / (25.0 + 273.0) ) - 273.0\n  return temp\nend\n`;
    };

    //各ブロックに対応する Ruby コードを書く
    Generator.GPIOeasy_LED = function (block) {
        Generator.prepares_[`GPIOeasy`] = Generator.GPIOeasy_LED_init(null);
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE) || 0;
        const num2 = Generator.getFieldValue(block, 'NUM2', Generator.ORDER_NONE) || 0;
        const num3 = Generator.getFieldValue(block, 'NUM3', Generator.ORDER_NONE) || 0;
        const num4 = Generator.getFieldValue(block, 'NUM4', Generator.ORDER_NONE) || 0;
        const num5 = Generator.getFieldValue(block, 'NUM5', Generator.ORDER_NONE) || 0;
        const num6 = Generator.getFieldValue(block, 'NUM6', Generator.ORDER_NONE) || 0;
        const num7 = Generator.getFieldValue(block, 'NUM7', Generator.ORDER_NONE) || 0;
        const num8 = Generator.getFieldValue(block, 'NUM8', Generator.ORDER_NONE) || 0;
        return `led13.write(${num1})\nled12.write(${num2})\nled14.write(${num3})\nled27.write(${num4})\nled26.write(${num5})\nled25.write(${num6})\nled33.write(${num7})\nled32.write(${num8})\n`;
    };

    Generator.GPIOeasy_Switch = function (block) {
        Generator.prepares_[`GPIOeasy`] = Generator.GPIOeasy_Switch_init(null);
        const switch1 = Generator.getFieldValue(block, 'SWITCH1', Generator.ORDER_NONE) || 0;
        const switch2 = Generator.getFieldValue(block, 'SWITCH2', Generator.ORDER_NONE) || 0;
        const switch3 = Generator.getFieldValue(block, 'SWITCH3', Generator.ORDER_NONE) || 0;
        const switch4 = Generator.getFieldValue(block, 'SWITCH4', Generator.ORDER_NONE) || 0;
        return `(sw34.read == ${switch1}) && (sw35.read == ${switch2}) && (sw18.read == ${switch3}) && (sw19.read == ${switch4})\n`;
    };

    Generator.GPIOeasy_Sound = function (block) {
        Generator.prepares_[`GPIOeasy`] = Generator.GPIOeasy_Sound_init(null);
        const num = Generator.getFieldValue(block, 'SCALE', Generator.ORDER_NONE) || 0;
        return `pwm1.freq(${num})\npwm1.duty(512)\n`;
    };

    Generator.GPIOeasy_Sound_stop = function () {
        Generator.prepares_[`GPIOeasy`] = Generator.GPIOeasy_Sound_init(null);
        return `pwm1.duty(0)\n`;
    };

    Generator.GPIOeasy_Temperature = function () {
        Generator.prepares_[`GPIOeasy`] = Generator.GPIOeasy_Temperature_init(null);
        return 'sprintf("%.1f", adc_measure(adc)).to_f\n';
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