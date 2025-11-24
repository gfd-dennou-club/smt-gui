/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.mctboard_led_init = function (block){
        return (
	    `led13 = GPIO.new( 13, GPIO::OUT )\n` +
	    `led12 = GPIO.new( 12, GPIO::OUT )\n` +
	    `led14 = GPIO.new( 14, GPIO::OUT )\n` +
	    `led27 = GPIO.new( 27, GPIO::OUT )\n` +
	    `led26 = GPIO.new( 26, GPIO::OUT )\n` +
	    `led25 = GPIO.new( 25, GPIO::OUT )\n` +
	    `led33 = GPIO.new( 33, GPIO::OUT )\n` +
	    `led32 = GPIO.new( 32, GPIO::OUT )\n` 
	);
    };

    Generator.mctboard_sw_init = function (block){
        return (
	    `sw34 = GPIO.new( 34, GPIO::IN|GPIO::PULL_UP ) \n` +
	    `sw35 = GPIO.new( 35, GPIO::IN|GPIO::PULL_UP ) \n` +
	    `sw18 = GPIO.new( 18, GPIO::IN|GPIO::PULL_UP ) \n` +
	    `sw19 = GPIO.new( 19, GPIO::IN|GPIO::PULL_UP ) \n`
	);
    };

    Generator.mctboard_pwm_led_init = function (block){
        return (
	    `pwm13 = PWM.new( 13, timer: 0, channel: 0, frequency:440 )\n` +
	    `pwm12 = PWM.new( 12, timer: 0, channel: 1, frequency:440 )\n` +
	    `pwm14 = PWM.new( 14, timer: 0, channel: 2, frequency:440 )\n` +
	    `pwm27 = PWM.new( 27, timer: 0, channel: 3, frequency:440 )\n` +
	    `pwm26 = PWM.new( 26, timer: 0, channel: 4, frequency:440 )\n` +
	    `pwm25 = PWM.new( 25, timer: 0, channel: 5, frequency:440 )\n` +
	    `pwm33 = PWM.new( 33, timer: 0, channel: 6, frequency:440 )\n` +
	    `pwm32 = PWM.new( 32, timer: 0, channel: 7, frequency:440 )\n` 
	);
    };

    Generator.mctboard_pwm_buzzer_init = function (block){
        return (
   	    `pwm15 = PWM.new( 15, timer: 1, channel: 0, frequency:440 )\n` 
	);
    };

    Generator.mctboard_temp_init = function () {
        return (
	    `adc = ADC.new( 39 )\n` +
            `def adc_measure(adc)\n` +
            `  voltage = adc.read()\n` +
            `  temp = 1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - voltage) / (voltage/ 10.0) / 10.0) + 1.0 / (25.0 + 273.0) ) - 273.0\n` +
            `  return temp\n` +
	    `end\n`
	);
    };
    
    Generator.mctboard_led_all = function (block) {
	Generator.prepares_[`led_all`] = Generator.mctboard_led_init(null);
        const onoff1  = Generator.getFieldValue(block, 'ONOFF1', Generator.ORDER_NONE);
        const onoff2  = Generator.getFieldValue(block, 'ONOFF2', Generator.ORDER_NONE);
        const onoff3  = Generator.getFieldValue(block, 'ONOFF3', Generator.ORDER_NONE);
        const onoff4  = Generator.getFieldValue(block, 'ONOFF4', Generator.ORDER_NONE);
        const onoff5  = Generator.getFieldValue(block, 'ONOFF5', Generator.ORDER_NONE);
        const onoff6  = Generator.getFieldValue(block, 'ONOFF6', Generator.ORDER_NONE);
        const onoff7  = Generator.getFieldValue(block, 'ONOFF7', Generator.ORDER_NONE);
        const onoff8  = Generator.getFieldValue(block, 'ONOFF8', Generator.ORDER_NONE);
        return (
	    `led13.write(${onoff1})\n` +
	    `led12.write(${onoff2})\n` +
	    `led13.write(${onoff3})\n` +
	    `led27.write(${onoff4})\n` +
	    `led26.write(${onoff5})\n` +
	    `led25.write(${onoff6})\n` +
	    `led33.write(${onoff7})\n` +
	    `led32.write(${onoff8})\n` 
	);
    };

    Generator.mctboard_led = function (block) {
	Generator.prepares_[`led`] = Generator.mctboard_led_init(null);
        const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
        return (
	    `led${pin}.write(${onoff})\n`
	);
    };

    Generator.mctboard_sw_all = function (block) {
	Generator.prepares_[`sw_all`] = Generator.mctboard_sw_init(null);
        const onoff1  = Generator.getFieldValue(block, 'ONOFF1', Generator.ORDER_NONE);
        const onoff2  = Generator.getFieldValue(block, 'ONOFF2', Generator.ORDER_NONE);
        const onoff3  = Generator.getFieldValue(block, 'ONOFF3', Generator.ORDER_NONE);
        const onoff4  = Generator.getFieldValue(block, 'ONOFF4', Generator.ORDER_NONE);
        return [ `(sw34.read == ${onoff1}) && (sw35.read == ${onoff2}) && (sw18.read == ${onoff3}) && (sw19.read == ${onoff4})`, Generator.ORDER_ATOMIC ];
    };

    Generator.mctboard_sw = function (block) {
	Generator.prepares_[`sw`] = Generator.mctboard_sw_init(null);
	const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
        return [`sw${pin}.read == ${onoff}`, Generator.ORDER_ATOMIC];
    };

    Generator.mctboard_pwm_duty = function (block) {
	Generator.prepares_[`pwm`] = Generator.mctboard_pwm_led_init(null);
        const pin  = Generator.getFieldValue(block, 'PIN',  Generator.ORDER_NONE);
	const duty = Generator.valueToCode(block, 'DUTY', Generator.ORDER_NONE) || 0;
        return (
	    `pwm${pin}.duty( ${duty} % 101)\n`
	);
    };

    Generator.mctboard_buzzer = function (block) {
	Generator.prepares_[`buzzer`] = Generator.mctboard_pwm_buzzer_init(null);
	const note = Generator.getFieldValue(block, 'NOTE', Generator.ORDER_NONE) || 0;
        return (
	    `pwm15.duty( 50 )\n` +
	    `pwm15.freq( ${note} )\n`
	);
    };

    Generator.mctboard_buzzer_stop = function (block) {
	Generator.prepares_[`buzzer_stop`] = Generator.mctboard_pwm_buzzer_init(null);
        return (
	    `pwm15.duty( 0 )\n` 
	);
    };

    Generator.mctboard_temp = function () {
        Generator.prepares_['temp'] = Generator.mctboard_temp_init(null);
        return [`sprintf("%.1f", adc_measure(adc)).to_f`, Generator.ORDER_ATOMIC];
    };

    //
    // LCD
    //
    Generator.mctboard_i2c_init = function () {
        return (
	    `i2c = I2C.new(22, 21)\n`
	);
    };

    Generator.mctboard_i2c_lcd_init = function () {
        Generator.prepares_.i2c = Generator.mctboard_i2c_init(null);
        return (
	    `lcd = AQM0802A.new(i2c)\n`
	);
    };

    Generator.mctboard_monitor = function (block) {
        Generator.prepares_.i2c_lcd = Generator.mctboard_i2c_lcd_init(null);
        const line = Generator.getFieldValue(block, 'LINE', Generator.ORDER_NONE) || 0;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `lcd.cursor(0, ${line})\n` +
	    `lcd.write_string("        ")\n` +
            `lcd.cursor(0, ${line})\n` +
	    `lcd.write_string(${text}.to_s)\n`
	);
    };

    //
    // RTC
    //
    Generator.mctboard_rtc_init = function () {
        Generator.prepares_.i2c = Generator.mctboard_i2c_init(null);
        return (
	    `sntp = SNTP.new \n` +
            `rtc = RX8035SA.new(i2c)\n` +
	    `rtc.write( sntp.datetime ) \n`
	);
    };

    Generator.mctboard_rtc_date = function (block) {
        const time = Generator.getFieldValue(block, 'TIME') || null;
        return [`rtc.${time}`, Generator.ORDER_ATOMIC];
    };
    
    //
    // Wi-Fi
    //
    Generator.mctboard_wifi_init = function (block) {
        const ssid = Generator.valueToCode(block, 'SSID', Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASS', Generator.ORDER_NONE);
        return (
	    `wlan = WLAN.new('STA')\n` +
	    `wlan.connect(${ssid}, ${pass}) \n`
	);
    };

    Generator.mctboard_wifi_connected = function () {
        return [`wlan.is_connected?`, Generator.ORDER_ATOMIC];
    };

    Generator.mctboard_http_get = function (block) {
        const url = Generator.valueToCode(block, 'URL', Generator.ORDER_NONE) || null;
        return [`HTTP.get( ${url} )\n`, Generator.ORDER_ATOMIC]
    };

    Generator.mctboard_http_post = function (block) {
        const url  = Generator.valueToCode(block, 'URL',  Generator.ORDER_NONE) || null;
        const data = Generator.valueToCode(block, 'DATA', Generator.ORDER_NONE) || null;
        return (
	    `post = HTTP.post( ${url}, ${data} )\n` +
	    `puts( post )\n`
	);
    };

    //
    // GPS
    //
    Generator.mctboard_gps_init = function (block) {
        return (
	    `gps_pw = GPIO.new(5, GPIO::OUT)\n`    +
            `gps_pw.write(0)\n`                    +
	    `uart = UART.new(2, baudrate:9600)\n`  +
	    `gps = GPS.new(uart, GPS::RMSmode) \n` +
    	    `sleep(1) \n`
	);
    };

    Generator.mctboard_gps_puts = function (block) {
    Generator.prepares_['gps_puts'] = Generator.mctboard_gps_init(null);
        const comm = Generator.valueToCode(block, 'COMM', Generator.ORDER_NONE) || null;
        return (
	    `gps.puts(${comm}) \n`
	);
    };

    Generator.mctboard_gps_gets = function (block) {
    Generator.prepares_['gps_gets'] = Generator.mctboard_gps_init(null);
        return [`gps.gets\n`, Generator.ORDER_ATOMIC];
    };
    
    Generator.mctboard_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `puts( ${text} )\n`;
    };
    


}
