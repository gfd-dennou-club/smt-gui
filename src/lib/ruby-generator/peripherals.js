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
    // i2c
    // 
//    Generator.peripherals_i2c_init = function () {
//        return `i2c = I2C.new()\n`;
//    };


    //
    // SCD30
    //
    Generator.peripherals_scd30_init = function () {
        Generator.prepares_.i2c = Generator.mctboard_i2c_init(null);
        return `scd30 = SCD30.new(i2c)\n`;
    };
    
    Generator.peripherals_scd30 = function (block) {
        Generator.prepares_.i2c_scd30 = Generator.peripherals_scd30_init(null);
        const obs = Generator.getFieldValue(block, 'OBS') || null;
        return [`scd30.${obs}`, Generator.ORDER_ATOMIC];
    };

    //
    // DPS310
    //
    Generator.peripherals_dps310_init = function () {
        Generator.prepares_.i2c = Generator.mctboard_i2c_init(null);
        return `dps310 = DPS310.new(i2c)\n`;
    };
    
    Generator.peripherals_dps310 = function (block) {
        Generator.prepares_.i2c_dps310 = Generator.peripherals_dps310_init(null);
        const obs = Generator.getFieldValue(block, 'OBS') || null;
        return [`dps310.${obs}`, Generator.ORDER_ATOMIC];
    };

}

