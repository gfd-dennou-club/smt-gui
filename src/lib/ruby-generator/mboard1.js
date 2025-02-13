/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    // クラス定義などはまとめておく
    // ブロック内で以下のようにけば，このコードを呼び出せる
    // Generator.prepares_[`sample`] = Generator.sample_init(null);
    Generator.mboard1_led_init = function () {
        return `led13 = GPIO.new( 13, GPIO::OUT )\n` +
            `led12 = GPIO.new( 12, GPIO::OUT )\n` +
            `led14 = GPIO.new( 14, GPIO::OUT )\n` +
            `led27 = GPIO.new( 27, GPIO::OUT )\n` +
            `led26 = GPIO.new( 26, GPIO::OUT )\n` +
            `led25 = GPIO.new( 25, GPIO::OUT )\n` +
            `led33 = GPIO.new( 33, GPIO::OUT )\n` +
            `led32 = GPIO.new( 32, GPIO::OUT )\n`;
    };
    
    Generator.mboard1_switch_init = function () {
        return `sw34 = GPIO.new( 34, GPIO::IN, GPIO::PULL_UP)\n` +
            `sw35 = GPIO.new( 35, GPIO::IN, GPIO::PULL_UP)\n` +
            `sw18 = GPIO.new( 18, GPIO::IN, GPIO::PULL_UP)\n` +
            `sw19 = GPIO.new( 19, GPIO::IN, GPIO::PULL_UP)\n`;
    };

    Generator.mboard1_pwm_init = function () {
        return `pwm1 = PWM.new( 15 )\n`;
    };
    
    Generator.mboard1_adc_init = function () {
        return `adc = ADC.new( 39, ADC::ATTEN_11DB, ADC::WIDTH_12BIT )\n` +
            `def adc_measure(adc)\n` +
               `  voltage = adc.read()\n` +
                // eslint-disable-next-line max-len
                `  temp = 1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - voltage) / (voltage/ 10.0) / 10.0) + 1.0 / (25.0 + 273.0) ) - 273.0\n` +
               `  return temp\n` +
               `end\n`;
    };
    
    // 各ブロックに対応する Ruby コードを書く
    Generator.mboard1_led1 = function (block) {
        Generator.prepares_.led = Generator.mboard1_led_init(null);
        const num1 = Generator.getFieldValue(block, 'NUM1', Generator.ORDER_NONE) || 0;
        const num2 = Generator.getFieldValue(block, 'NUM2', Generator.ORDER_NONE) || 0;
        const num3 = Generator.getFieldValue(block, 'NUM3', Generator.ORDER_NONE) || 0;
        const num4 = Generator.getFieldValue(block, 'NUM4', Generator.ORDER_NONE) || 0;
        const num5 = Generator.getFieldValue(block, 'NUM5', Generator.ORDER_NONE) || 0;
        const num6 = Generator.getFieldValue(block, 'NUM6', Generator.ORDER_NONE) || 0;
        const num7 = Generator.getFieldValue(block, 'NUM7', Generator.ORDER_NONE) || 0;
        const num8 = Generator.getFieldValue(block, 'NUM8', Generator.ORDER_NONE) || 0;
        return `led13.write(${num1})\n` +
            `led12.write(${num2})\n` +
            `led14.write(${num3})\n` +
            `led27.write(${num4})\n` +
            `led26.write(${num5})\n` +
            `led25.write(${num6})\n` +
            `led33.write(${num7})\n` +
            `led32.write(${num8})\n`;
    };

    Generator.mboard1_switch1 = function (block) {
        Generator.prepares_.switch = Generator.mboard1_switch_init(null);
        const sw1 = Generator.getFieldValue(block, 'SWITCH1', Generator.ORDER_NONE) || 0;
        const sw2 = Generator.getFieldValue(block, 'SWITCH2', Generator.ORDER_NONE) || 0;
        const sw3 = Generator.getFieldValue(block, 'SWITCH3', Generator.ORDER_NONE) || 0;
        const sw4 = Generator.getFieldValue(block, 'SWITCH4', Generator.ORDER_NONE) || 0;
        // eslint-disable-next-line max-len
        return [`(sw34.read == ${sw1}) && (sw35.read == ${sw2}) && (sw18.read == ${sw3}) && (sw19.read == ${sw4}) `, Generator.ORDER_ATOMIC];
    };
    
    Generator.mboard1_sound1 = function (block) {
        Generator.prepares_.pwm = Generator.mboard1_pwm_init(null);
        const num = Generator.getFieldValue(block, 'SCALE', Generator.ORDER_NONE) || 0;
        return `pwm1.freq(${num})\n` +
               `pwm1.duty(512)\n`;
    };

    Generator.mboard1_sound2 = function () {
        Generator.prepares_.pwm = Generator.mboard1_pwm_init(null);
        return `pwm1.duty(0)\n`;
    };

    Generator.mboard1_temperature1 = function () {
        Generator.prepares_.adc = Generator.mboard1_adc_init(null);
        return [`sprintf("%.1f", adc_measure(adc)).to_f`, Generator.ORDER_ATOMIC];
    };

    
    // // メニューについては Ruby 側でも定義が必要のようだ
    Generator.mboard1_menu_soundMenu = function (block) {
        const soundMenu = Generator.getFieldValue(block, 'soundMenu') || null;
        return [soundMenu, Generator.ORDER_ATOMIC];//soundMenuに変更
    };
    Generator.mboard1_menu_ledSwMenu = function (block) {
        const ledSwMenu = Generator.getFieldValue(block, 'ledSwMenu') || null;
        return [ledSwMenu, Generator.ORDER_ATOMIC];
    };//LedSwMenuに変更

    return Generator;
}
