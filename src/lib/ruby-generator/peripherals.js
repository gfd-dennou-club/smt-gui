/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.peripherals_m5lcd_init = function () {
        return `m5lcd = ILI934X.new(23, 18, 14, 27, 33, 32) \n`;
    };
    
    Generator.peripherals_ili934x_write_line = function (block) {
        Generator.prepares_.i2c_m5lcd = Generator.peripherals_m5lcd_init(null);
        const x1   = Generator.valueToCode(block, 'X1', Generator.ORDER_NONE);
        const y1   = Generator.valueToCode(block, 'Y1', Generator.ORDER_NONE);
        const x2   = Generator.valueToCode(block, 'X2', Generator.ORDER_NONE);
        const y2   = Generator.valueToCode(block, 'X2', Generator.ORDER_NONE);
        const type = Generator.getFieldValue(block, 'TYPE') || null;
        const color = Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.draw_${type}(${x1}, ${y1}, ${x2}, ${y2}, ${color}) \n`;
    };

    Generator.peripherals_ili934x_write_circle = function (block) {
        Generator.prepares_.i2c_m5lcd = Generator.peripherals_m5lcd_init(null);
        const x1   = Generator.valueToCode(block, 'X1', Generator.ORDER_NONE);
        const y1   = Generator.valueToCode(block, 'Y1', Generator.ORDER_NONE);
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE);
        const type = Generator.getFieldValue(block, 'TYPE') || null;
        const color = Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.draw_${type}(${x1}, ${y1}, ${size}, ${color}) \n`;
    };

    Generator.peripherals_ili934x_write_string = function (block) {
        Generator.prepares_.i2c_m5lcd = Generator.peripherals_m5lcd_init(null);
        const x1   = Generator.valueToCode(block, 'X1', Generator.ORDER_NONE);
        const y1   = Generator.valueToCode(block, 'Y1', Generator.ORDER_NONE);
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE);
        const mess = Generator.valueToCode(block, 'MESS', Generator.ORDER_NONE);
        const color = Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.drawString(${x1}, ${y1}, ${mess}, ${size}, ${color}) \n`;
    };

    //
    // I2C Sensors
    //
    Generator.peripherals_i2c_sensor_init = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        return `${name} = ${sensor}.new(i2c)\n`;
    };

    Generator.peripherals_i2c_sensor_read = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        return `${name}.read\n`;
    };
    
    Generator.peripherals_i2c_sensor_value = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        return [`${name}.${target}`, Generator.ORDER_ATOMIC];
   };

    //
    // LCD
    //
    Generator.peripherals_lcd_init = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        return `${name} = ${sensor}.new(i2c)\n`;
    };

    Generator.peripherals_lcd_cursor = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        const line = Generator.valueToCode(block, 'LINE', Generator.ORDER_NONE) || 1;
        return (
	    `${name}.cursor(line: ${line})\n` 
	);
    };
    Generator.peripherals_lcd_print = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();	
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `${name}.print(${text})\n`
	);
    };
    Generator.peripherals_lcd_clear = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();	
        return (
	    `${name}.clear\n`
	);
    };

    //
    // RTC    
    //
    Generator.peripherals_rtc_init = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        return `${name} = ${sensor}.new(i2c)\n`;
    };

    Generator.peripherals_rtc_write = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
	const year = Generator.valueToCode(block, 'YEAR', Generator.ORDER_NONE) || 'nil';
	const mon  = Generator.valueToCode(block, 'MON',  Generator.ORDER_NONE) || 'nil';
	const day  = Generator.valueToCode(block, 'DAY',  Generator.ORDER_NONE) || 'nil';
	const wday = Generator.valueToCode(block, 'WDAY', Generator.ORDER_NONE) || 'nil';
	const hour = Generator.valueToCode(block, 'HOUR', Generator.ORDER_NONE) || 'nil';
	const min  = Generator.valueToCode(block, 'MIN',  Generator.ORDER_NONE) || 'nil';
	const sec  = Generator.valueToCode(block, 'SEC',  Generator.ORDER_NONE) || 'nil';
        return (
	    `${name}.write( [${year}, ${mon}, ${day}, ${wday}, ${hour}, ${min}, ${sec}] )\n`
	);
    };
    
    Generator.peripherals_rtc_read = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        return `${name}.read\n`;
    };

    Generator.peripherals_rtc_value = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const name   = sensor.toLowerCase();
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        return [`${name}.${target}`, Generator.ORDER_ATOMIC];
    };

    //
    // Wi-Fi
    //
    Generator.peripherals_wifi_init = function () {
        return (
	    `wlan = WLAN.new()\n`
	);
    };

    Generator.peripherals_wifi_connect = function (block) {
        const ssid = Generator.valueToCode(block, 'SSID', Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASS', Generator.ORDER_NONE);
        return (
	    `wlan.connect(${ssid}, ${pass}) \n`
	);
    };

    Generator.peripherals_wifi_connected = function () {
        return [`wlan.connected?`, Generator.ORDER_ATOMIC];
    };
    
    Generator.peripherals_sntp_init = function () {
        return (
	    `sntp = SNTP.new \n`
	);
    };

    Generator.peripherals_sntp_read = function () {
        return (
	    `sntp.read \n`
	);
    };

    Generator.peripherals_sntp_value = function (block) {
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        return [`sntp.${target}`, Generator.ORDER_ATOMIC];
    };    
    
    Generator.peripherals_http_get = function (block) {
        const url = Generator.valueToCode(block, 'URL', Generator.ORDER_NONE) || null;
        return [`HTTP.get( ${url} )`, Generator.ORDER_ATOMIC]
    };

    Generator.peripherals_http_post = function (block) {
        const url  = Generator.valueToCode(block, 'URL',  Generator.ORDER_NONE) || null;
        const data = Generator.valueToCode(block, 'DATA', Generator.ORDER_NONE) || null;
        return [`HTTP.post( ${url}, ${data} )`, Generator.ORDER_ATOMIC];
    };

    //
    // SD
    //
    Generator.peripherals_sd_init = function (block) {
        const pin = Generator.valueToCode(block, 'PIN', Generator.ORDER_NONE) || null;
	const dir = Generator.valueToCode(block, 'DIR', Generator.ORDER_NONE) || null;
        return (
  	    `sdspi = SDSPI.new(spi, cs_pin:${pin}, mount_point:${dir})\n` 
	);
    };

    Generator.peripherals_sd_open = function (block) {
        const file = Generator.valueToCode(block, 'FILE', Generator.ORDER_NONE) || null;
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return (
	    `fp = File.open( filename, "${mode}")\n`
	);
    };

    Generator.peripherals_sd_close = function () {
        return (
	    `fp.close\n`
	);
    };

    Generator.peripherals_sd_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `fp.puts(${text})\n`
	);
    };

    Generator.peripherals_sd_gets = function (block) {
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return [`fp.${mode}`, Generator.ORDER_ATOMIC];
    };

    Generator.peripherals_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `puts( ${text} )\n`;
    };

}

