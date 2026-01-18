/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    //
    // GPIO (output)
    //
    Generator.mctboard_led_init = function (block){
        return (
	    `gpio13 = GPIO.new( 13, GPIO::OUT )\n` +
	    `gpio12 = GPIO.new( 12, GPIO::OUT )\n` +
	    `gpio14 = GPIO.new( 14, GPIO::OUT )\n` +
	    `gpio27 = GPIO.new( 27, GPIO::OUT )\n` +
	    `gpio26 = GPIO.new( 26, GPIO::OUT )\n` +
	    `gpio25 = GPIO.new( 25, GPIO::OUT )\n` +
	    `gpio33 = GPIO.new( 33, GPIO::OUT )\n` +
	    `gpio32 = GPIO.new( 32, GPIO::OUT )\n` 
	);
    };
    
    Generator.mctboard_led_all = function (block) {
	Generator.prepares_.led = Generator.mctboard_led_init(null);
        const onoff1  = Generator.getFieldValue(block, 'ONOFF1', Generator.ORDER_NONE);
        const onoff2  = Generator.getFieldValue(block, 'ONOFF2', Generator.ORDER_NONE);
        const onoff3  = Generator.getFieldValue(block, 'ONOFF3', Generator.ORDER_NONE);
        const onoff4  = Generator.getFieldValue(block, 'ONOFF4', Generator.ORDER_NONE);
        const onoff5  = Generator.getFieldValue(block, 'ONOFF5', Generator.ORDER_NONE);
        const onoff6  = Generator.getFieldValue(block, 'ONOFF6', Generator.ORDER_NONE);
        const onoff7  = Generator.getFieldValue(block, 'ONOFF7', Generator.ORDER_NONE);
        const onoff8  = Generator.getFieldValue(block, 'ONOFF8', Generator.ORDER_NONE);
        return (
	    `gpio13.write(${onoff1})\n` +
	    `gpio12.write(${onoff2})\n` +
	    `gpio14.write(${onoff3})\n` +
	    `gpio27.write(${onoff4})\n` +
	    `gpio26.write(${onoff5})\n` +
	    `gpio25.write(${onoff6})\n` +
	    `gpio33.write(${onoff7})\n` +
	    `gpio32.write(${onoff8})\n` 
	);
    };

    Generator.mctboard_led = function (block) {
	Generator.prepares_.led = Generator.mctboard_led_init(null);
        const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
        return (
	    `gpio${pin}.write(${onoff})\n`
	);
    };

    //
    // GPIO (SW)
    //
    Generator.mctboard_sw_init = function (block){
        return (
	    `gpio34 = GPIO.new( 34, GPIO::IN ) \n` +
	    `gpio35 = GPIO.new( 35, GPIO::IN ) \n` +
	    `gpio18 = GPIO.new( 18, GPIO::IN|GPIO::PULL_UP ) \n` +
	    `gpio19 = GPIO.new( 19, GPIO::IN|GPIO::PULL_UP ) \n`
	);
    };

    Generator.mctboard_sw_all = function (block) {
	Generator.prepares_.sw = Generator.mctboard_sw_init(null);
        const onoff1  = Generator.getFieldValue(block, 'ONOFF1', Generator.ORDER_NONE);
        const onoff2  = Generator.getFieldValue(block, 'ONOFF2', Generator.ORDER_NONE);
        const onoff3  = Generator.getFieldValue(block, 'ONOFF3', Generator.ORDER_NONE);
        const onoff4  = Generator.getFieldValue(block, 'ONOFF4', Generator.ORDER_NONE);
        return [ `(gpio34.read == ${onoff1}) && (gpio35.read == ${onoff2}) && (gpio18.read == ${onoff3}) && (gpio19.read == ${onoff4})`, Generator.ORDER_ATOMIC ];
    };

    Generator.mctboard_sw = function (block) {
	Generator.prepares_.sw = Generator.mctboard_sw_init(null);
	const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
        return [`gpio${pin}.read == ${onoff}`, Generator.ORDER_ATOMIC];
    };


    //
    // PWM LEDs
    //
    Generator.mctboard_pwm_led_init = function (block){
        return (
	    `pwm13 = PWM.new( 13, timer: 0, frequency:440 )\n` +
	    `pwm12 = PWM.new( 12, timer: 0, frequency:440 )\n` +
	    `pwm14 = PWM.new( 14, timer: 0, frequency:440 )\n` +
	    `pwm27 = PWM.new( 27, timer: 0, frequency:440 )\n` +
	    `pwm26 = PWM.new( 26, timer: 0, frequency:440 )\n` +
	    `pwm25 = PWM.new( 25, timer: 0, frequency:440 )\n` +
	    `pwm33 = PWM.new( 33, timer: 0, frequency:440 )\n` +
	    `pwm32 = PWM.new( 32, timer: 0, frequency:440 )\n` 
	);
    };

    Generator.mctboard_pwm_duty = function (block) {
	Generator.prepares_.pwm_led = Generator.mctboard_pwm_led_init(null);
        const pin  = Generator.getFieldValue(block, 'PIN',  Generator.ORDER_NONE);
	const duty = Generator.valueToCode(block, 'DUTY', Generator.ORDER_NONE) || 0;
        return (
	    `pwm${pin}.duty( ${duty} )\n`
	);
    };

    //
    // PWM buzzer
    //
    Generator.mctboard_pwm_buzzer_init = function (block){
        return (
   	    `pwm15 = PWM.new( 15, timer: 1, frequency:440 )\n` 
	);
    };
    
    Generator.mctboard_buzzer = function (block) {
	Generator.prepares_.pwm_buzzer = Generator.mctboard_pwm_buzzer_init(null);
	const note = Generator.getFieldValue(block, 'NOTE', Generator.ORDER_NONE) || 0;
        return (
	    `pwm15.duty( 50 )\n` +
	    `pwm15.frequency( ${note} )\n`
	);
    };

    Generator.mctboard_buzzer_stop = function (block) {
	Generator.prepares_.pwm_buzzer = Generator.mctboard_pwm_buzzer_init(null);
        return (
	    `pwm15.duty( 0 )\n` 
	);
    };

    //
    // ADC
    //
    Generator.mctboard_temp_init = function () {
        return (	
	    `adc39 = ADC.new( 39 )\n` 
	);
    };

    Generator.mctboard_temp = function () {
        Generator.prepares_.adc_temp = Generator.mctboard_temp_init(null);
        return [`1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - adc39.read() * 1000.0) / (adc39.read() * 1000.0) ) + 1.0 / 298.0 ) - 273.0\n`, Generator.ORDER_ATOMIC];
    };

    //
    // I2C
    //
    Generator.mctboard_i2c_init = function () {
        return (
	    `i2c = I2C.new(scl_pin:22, sda_pin:21)\n`
	);
    };

    //
    // LCD
    //
    Generator.mctboard_i2c_lcd_init = function () {
        Generator.prepares_.i2c = Generator.mctboard_i2c_init(null);
        return (
	    `aqm0802a = AQM0802A.new(i2c)\n`
	);
    };

    Generator.mctboard_monitor = function (block) {
        Generator.prepares_.i2c_lcd = Generator.mctboard_i2c_lcd_init(null);
        const line = Generator.getFieldValue(block, 'LINE', Generator.ORDER_NONE) || 0;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `aqm0802a.cursor(line: ${line})\n` +
	    `aqm0802a.print("        ")\n` +
            `aqm0802a.cursor(${line})\n` +
 	    `aqm0802a.print(line: ${text}))\n`
	);
    };

    //
    // RTC
    //
    Generator.mctboard_i2c_rtc_init = function () {
        Generator.prepares_.i2c = Generator.mctboard_i2c_init(null);
        return (
            `rx8035sa = RX8035SA.new(i2c)\n` 
	);
    };

    Generator.mctboard_rtc_set = function (block) {
	Generator.prepares_.i2c_rtc = Generator.mctboard_i2c_rtc_init(null);
	const year = Generator.valueToCode(block, 'YEAR', Generator.ORDER_NONE) || 'nil';
	const mon  = Generator.valueToCode(block, 'MON',  Generator.ORDER_NONE) || 'nil';
	const day  = Generator.valueToCode(block, 'DAY',  Generator.ORDER_NONE) || 'nil';
	const wday = Generator.valueToCode(block, 'WDAY', Generator.ORDER_NONE) || 'nil';
	const hour = Generator.valueToCode(block, 'HOUR', Generator.ORDER_NONE) || 'nil';
	const min  = Generator.valueToCode(block, 'MIN',  Generator.ORDER_NONE) || 'nil';
	const sec  = Generator.valueToCode(block, 'SEC',  Generator.ORDER_NONE) || 'nil';
        return (
	    `rx8035sa.write( [${year}, ${mon}, ${day}, ${wday}, ${hour}, ${min}, ${sec}] )\n`
	);
    };

    Generator.mctboard_rtc_read = function (block) {
	Generator.prepares_.i2c_rtc = Generator.mctboard_i2c_rtc_init(null);
        return (
	    `rx8035sa.read\n`
	);
    };

    Generator.mctboard_rtc_date = function (block) {
	Generator.prepares_.i2c_rtc = Generator.mctboard_i2c_rtc_init(null);
        const time = Generator.getFieldValue(block, 'TIME') || null;
        return [`rx8035sa.${time}`, Generator.ORDER_ATOMIC];
    };

    //
    // Wi-Fi
    //
    Generator.mctboard_wifi_init = function (block) {
        const ssid = Generator.valueToCode(block, 'SSID', Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASS', Generator.ORDER_NONE);
        return (
	    `wlan = WLAN.new()\n` +
	    `wlan.connect(${ssid}, ${pass}) \n`
	);
    };

    Generator.mctboard_wifi_isconnected = function () {
        return [`wlan.connected?`, Generator.ORDER_ATOMIC];
    };

    Generator.mctboard_sntp_init = function () {
        return (
	    `sntp = SNTP.new \n`
	);
    };

    Generator.mctboard_sntp_read = function () {
        return (
	    `sntp.read \n`
	);
    };

    Generator.mctboard_sntp_date = function (block) {
        const time = Generator.getFieldValue(block, 'TIME') || null;
        return [`sntp.${time}`, Generator.ORDER_ATOMIC];
    };    
    
    Generator.mctboard_http_get = function (block) {
        const url = Generator.valueToCode(block, 'URL', Generator.ORDER_NONE) || null;
        return [`HTTP.get( ${url} )`, Generator.ORDER_ATOMIC]
    };

    Generator.mctboard_http_post = function (block) {
        const url  = Generator.valueToCode(block, 'URL',  Generator.ORDER_NONE) || null;
        const data = Generator.valueToCode(block, 'DATA', Generator.ORDER_NONE) || null;
        return (
	    `HTTP.post( ${url}, ${data} )\n` 
	);
    };

    //
    // GPS
    //
    Generator.mctboard_gps_init = function (block) {
        return (
	    `gpio5 = GPIO.new(5, GPIO::OUT)\n`    +
            `gpio5.write(0)\n`                    +
	    `uart2 = UART.new(2, baudrate:9600)\n`+
    	    `sleep(1) \n`
	);
    };

    Generator.mctboard_gps_puts = function (block) {
	Generator.prepares_.gps = Generator.mctboard_gps_init(null);
        const comm = Generator.valueToCode(block, 'COMM', Generator.ORDER_NONE) || null;
        return (
	    `uart2.puts(${comm}) \n`
	);
    };

    Generator.mctboard_gps_gets = function (block) {
	Generator.prepares_.gps = Generator.mctboard_gps_init(null);
        return [`uart2.gets`, Generator.ORDER_ATOMIC];
    };

    Generator.mctboard_gps_clear = function (block) {
	Generator.prepares_.gps = Generator.mctboard_gps_init(null);
        return (
	    `uart2.clear_tx_buffer\n` +
	    `uart2.clear_rx_buffer\n` 
	);
    };

    //
    // SD
    //
    Generator.mctboard_sd_init = function (block) {
        return (
	    `spi = SPI.new(miso_pin:19, mosi_pin:23, clk_pin:18)\n` +
  	    `sdspi = SDSPI.new(spi, cs_pin:2, mount_point:'/sdcard')\n` +
	    `filedir = "/sdcard" \n` 
	);
    };

    Generator.mctboard_sd_open = function (block) {
	Generator.prepares_.sd = Generator.mctboard_sd_init(null);
        const file = Generator.valueToCode(block, 'FILE', Generator.ORDER_NONE) || null;
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return (
    	    `filename = filedir + "/" + ${file}\n` +
	    `fp = File.open( filename, "${mode}")\n`
	);
    };

    Generator.mctboard_sd_close = function (block) {
	Generator.prepares_.sd = Generator.mctboard_sd_init(null);
        return (
	    `fp.close\n`
	);
    };

    Generator.mctboard_sd_puts = function (block) {
	Generator.prepares_.sd = Generator.mctboard_sd_init(null);
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `fp.puts(${text})\n`
	);
    };

    Generator.mctboard_sd_gets = function (block) {
	Generator.prepares_.sd = Generator.mctboard_sd_init(null);
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return [`fp.${mode}`, Generator.ORDER_ATOMIC];
    };

    Generator.mctboard_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `puts( ${text} )\n`;
    };
    
}
