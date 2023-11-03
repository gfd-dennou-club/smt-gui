/**
 * Define Ruby code generator for Ruby Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    const getUnquoteText = function (block, fieldName, order) {
        const input = block.inputs[fieldName];
        if (input) {
            const targetBlock = Generator.getBlock(input.block);
            if (targetBlock && targetBlock.opcode === 'text') {
                return Generator.getFieldValue(targetBlock, 'TEXT') || '';
            }
        }
        return Generator.valueToCode(block, fieldName, order);
    };

    Generator.ruby_statement = function (block) {
        const statement = getUnquoteText(block, 'STATEMENT', Generator.ORDER_NONE);
        return `${statement}\n`;
    };

    //
    // GPIO
    //

    Generator.mrubyc_gpio_led_init = function (block) {
        return `led13 = GPIO.new( 13, GPIO::OUT )\n` + 
	       `led12 = GPIO.new( 12, GPIO::OUT )\n` + 
	       `led14 = GPIO.new( 14, GPIO::OUT )\n` + 
	       `led27 = GPIO.new( 27, GPIO::OUT )\n` + 
	       `led26 = GPIO.new( 26, GPIO::OUT )\n` + 
	       `led25 = GPIO.new( 25, GPIO::OUT )\n` + 
	       `led33 = GPIO.new( 33, GPIO::OUT )\n` + 
	       `led32 = GPIO.new( 32, GPIO::OUT )\n` ;
    };
    
    Generator.mrubyc_gpio_sw_init = function (block) {
        return `sw34 = GPIO.new( 34, GPIO::IN, GPIO::PULL_UP)\n`+
	       `sw35 = GPIO.new( 35, GPIO::IN, GPIO::PULL_UP)\n`+
	       `sw18 = GPIO.new( 18, GPIO::IN, GPIO::PULL_UP)\n`+
	       `sw19 = GPIO.new( 19, GPIO::IN, GPIO::PULL_UP)\n`;
    };

    Generator.mrubyc_gpio_led_all = function (block) {
	Generator.prepares_[`gpio_led`] = Generator.mrubyc_gpio_led_init(null);
        const led1 = Generator.getFieldValue(block, 'LED1') || null;
        const led2 = Generator.getFieldValue(block, 'LED2') || null;
        const led3 = Generator.getFieldValue(block, 'LED3') || null;
        const led4 = Generator.getFieldValue(block, 'LED4') || null;
        const led5 = Generator.getFieldValue(block, 'LED5') || null;
        const led6 = Generator.getFieldValue(block, 'LED6') || null;
        const led7 = Generator.getFieldValue(block, 'LED7') || null;
        const led8 = Generator.getFieldValue(block, 'LED8') || null;
        return `led13.write(${led1})\n`+
	       `led12.write(${led2})\n`+
	       `led14.write(${led3})\n`+
	       `led27.write(${led4})\n`+
	       `led26.write(${led5})\n`+
	       `led25.write(${led6})\n`+
	       `led33.write(${led7})\n`+
	       `led32.write(${led7})\n`;
    };

    Generator.mrubyc_gpio_sw_all = function (block) {
        Generator.prepares_[`gpio_sw`] = Generator.mrubyc_gpio_sw_init(null);
        const sw1 = Generator.getFieldValue(block, 'SW1') || null;
	const sw2 = Generator.getFieldValue(block, 'SW2') || null;
	const sw3 = Generator.getFieldValue(block, 'SW3') || null;
	const sw4 = Generator.getFieldValue(block, 'SW4') || null;
        return [`(sw34.read == ${sw1}) && (sw35.read == ${sw2}) && (sw18.read == ${sw3}) && (sw19.read == ${sw4}) `, Generator.ORDER_ATOMIC];
    };

    //
    // PWM 
    //
    Generator.mrubyc_pwm_init = function (block) {
        return `pwm1 = PWM.new( 15 )\n` ;
    };

    Generator.mrubyc_pwm_sound = function (block) {
        Generator.prepares_['pwm'] = Generator.mrubyc_pwm_init(null);
        const sound = Generator.getFieldValue(block, 'SOUND') || null;
        return `pwm1.freq(${sound})\n` +
               `pwm1.duty(512)\n` ;
    };

    Generator.mrubyc_pwm_clear = function (block) {
        Generator.prepares_['pwm'] = Generator.mrubyc_pwm_init(null);
        return `pwm1.duty(0)\n`;
    };


    //
    // ADC
    // 
    Generator.mrubyc_adc_init = function (block) {
        return `adc = ADC.new( 39, ADC::ATTEN_11DB, ADC::WIDTH_12BIT )\n`;
    };

    Generator.mrubyc_adc_measure = function (block) {
        Generator.prepares_['adc_init'] = Generator.mrubyc_adc_init(null);
        return `def adc_measure(adc)\n` +
               `  voltage = adc.read()\n` +
               `  temp = 1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - voltage) / (voltage/ 10.0) / 10.0) + 1.0 / (25.0 + 273.0) ) - 273.0\n` + 
               `  return temp\n` +
               `end\n`;
    };

    Generator.mrubyc_adc_read = function (block) {
        Generator.prepares_['adc_measure'] = Generator.mrubyc_adc_measure(null);
        return [`sprintf("%.1f", adc_measure(adc)).to_f`, Generator.ORDER_ATOMIC];
    };
    
    
    //
    // I2C
    //
    Generator.mrubyc_i2c_init = function (block) {
        return `i2c = I2C.new(22, 21)\n`;
    }; 

    ////
    //// LCD
    ////
    Generator.mrubyc_i2c_lcd_init = function (block) {
        Generator.prepares_['i2c'] = Generator.mrubyc_i2c_init(null);
        return `lcd = AQM0802A.new(i2c)\n` ;
    }; 

    Generator.mrubyc_i2c_lcd_write = function (block) {
        Generator.prepares_['i2c_lcd'] = Generator.mrubyc_i2c_lcd_init(null);
        const line = Generator.getFieldValue(block, 'LINE') || null;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE);
        return `lcd.cursor(0, ${line})\n` +
               `lcd.write_string("        ")\n`+
               `lcd.cursor(0, ${line})\n` + 	    
               `lcd.write_string((${text}).to_s)\n`;
    };

    ////
    //// LCD
    ////
    Generator.mrubyc_i2c_m5lcd_init = function (block) {
        Generator.prepares_['i2c'] = Generator.mrubyc_i2c_init(null);
        return `m5lcd = ILI934X.new(23, 18, 14, 27, 33, 32) \n` ;
    }; 

    Generator.mrubyc_i2c_m5lcd_write1 = function (block) {
        Generator.prepares_['i2c_m5lcd'] = Generator.mrubyc_i2c_m5lcd_init(null);
        const pos1 = Generator.valueToCode(block, 'POS1', Generator.ORDER_NONE);
        const pos2 = Generator.valueToCode(block, 'POS2', Generator.ORDER_NONE);
        const pos3 = Generator.valueToCode(block, 'POS3', Generator.ORDER_NONE);
        const pos4 = Generator.valueToCode(block, 'POS4', Generator.ORDER_NONE);
	const type = Generator.getFieldValue(block, 'TYPE') || null;
	const color= Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.draw_${type}(${pos1}, ${pos2}, ${pos3}, ${pos4}, ${color}) \n`;
    };

    Generator.mrubyc_i2c_m5lcd_write2 = function (block) {
        Generator.prepares_['i2c_m5lcd'] = Generator.mrubyc_i2c_m5lcd_init(null);
        const pos1 = Generator.valueToCode(block, 'POS1', Generator.ORDER_NONE);
        const pos2 = Generator.valueToCode(block, 'POS2', Generator.ORDER_NONE);
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE);
	const type = Generator.getFieldValue(block, 'TYPE') || null;
	const color= Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.draw_${type}(${pos1}, ${pos2}, ${size}, ${color}) \n`;
    };

    Generator.mrubyc_i2c_m5lcd_write3 = function (block) {
        Generator.prepares_['i2c_m5lcd'] = Generator.mrubyc_i2c_m5lcd_init(null);
        const pos1 = Generator.valueToCode(block, 'POS1', Generator.ORDER_NONE);
        const pos2 = Generator.valueToCode(block, 'POS2', Generator.ORDER_NONE);
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE);
        const mess = Generator.valueToCode(block, 'MESS', Generator.ORDER_NONE);
	const color= Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.drawString(${pos1}, ${pos2}, ${mess}, ${size}, ${color}) \n`;
    };

    //
    // WIFI
    //    

    Generator.mrubyc_wifi_init = function (ssid, pass) {
        return `wlan = WLAN.new('STA', WLAN::ACTIVE)\n`;
    };

    Generator.mrubyc_wifi_personal_init = function (block) {
        const ssid = Generator.valueToCode(block, 'SSID',     Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASSWORD', Generator.ORDER_NONE);
        Generator.prepares_['wifi_init'] = Generator.mrubyc_wifi_init();
	
        return `wlan.connect(${ssid}, ${pass}) \n`;
    };

    Generator.mrubyc_wifi_is_connected = function (block) {
        return [`wlan.is_connected?`, Generator.ORDER_ATOMIC];
    };

    ////
    //// RTC
    ////
    Generator.mrubyc_i2c_rtc_ntp_init = function (block) {
        Generator.prepares_['i2c'] = Generator.mrubyc_i2c_init(null);
        return `sntp = SNTP.new \n` +
            `rtc = RX8035SA.new(i2c)\n`+
	    `rtc.write( sntp.datetime ) \n`;	   
    };

    Generator.mrubyc_i2c_rtc_ntp = function (block) {
//        Generator.prepares_['i2c'] = Generator.mrubyc_i2c_init(null);
//	Generator.prepares_['i2c_rtc_ntp'] = Generator.mrubyc_i2c_rtc_ntp_init(null);
        const time = Generator.getFieldValue(block, 'TIME') || null;
	return [`rtc.${time}`, Generator.ORDER_ATOMIC];
    };
    

    //
    // UART
    //
    Generator.mrubyc_uart_init = function (block) {
        return `uart = UART.new(2, 9600)\n`;
    }; 

    //
    // GPS
    //
    Generator.mrubyc_uart_gps_init = function (block) {
        Generator.prepares_['uart'] = Generator.mrubyc_uart_init(null);
        return `GPS.power_on \n` +
	       `gps = GPS.new(uart, GPS::RMSmode) \n` ;
    };

    Generator.mrubyc_uart_gps_status = function (block) {
	Generator.prepares_['uart_gps'] = Generator.mrubyc_uart_gps_init(null);
        return [`gps.is_ready?`, Generator.ORDER_ATOMIC];
    };

    Generator.mrubyc_uart_gps = function (block) {
	Generator.prepares_['uart_gps'] = Generator.mrubyc_uart_gps_init(null);
        const data = Generator.getFieldValue(block, 'DATA') || null;
        return [`gps.${data}`, Generator.ORDER_ATOMIC];
    };
    
    //
    // SCD30
    //
    Generator.mrubyc_i2c_scd30_init = function (block) {
	Generator.prepares_['i2c'] = Generator.mrubyc_i2c_init(null);
        return  `scd30 = SCD30.new(i2c)\n`;
    };
    
    Generator.mrubyc_i2c_scd30_status = function (block) {
        Generator.prepares_['i2c_scd30'] = Generator.mrubyc_i2c_scd30_init(null);
        return [`scd30.is_ready?`, Generator.ORDER_ATOMIC];
    };

    Generator.mrubyc_i2c_scd30 = function (block) {
        Generator.prepares_['i2c_scd30'] = Generator.mrubyc_i2c_scd30_init(null);
        const val = Generator.getFieldValue(block, 'SCD30') || null;
        return [`scd30.${val}`, Generator.ORDER_ATOMIC];
    };

    //
    // SHT35
    //
    Generator.mrubyc_i2c_sht35_init = function (block) {
	Generator.prepares_['i2c'] = Generator.mrubyc_i2c_init(null);
        return  `sht35 = SHT35.new(i2c)\n`;
    };
    
    Generator.mrubyc_i2c_sht35_status = function (block) {
        Generator.prepares_['i2c_sht35'] = Generator.mrubyc_i2c_sht35_init(null);
        return [`sht35.is_ready?`, Generator.ORDER_ATOMIC];
    };

    Generator.mrubyc_i2c_sht35 = function (block) {
        Generator.prepares_['i2c_sht35'] = Generator.mrubyc_i2c_sht35_init(null);
        const val = Generator.getFieldValue(block, 'SHT35') || null;
        return [`sht35.${val}`, Generator.ORDER_ATOMIC];
    };
    
    //
    // お宝
    //
    Generator.mrubyc_uart_gps_otakara_init = function (block) {
        Generator.prepares_['uart_gps'] = Generator.mrubyc_uart_gps_init(null);
        return `takara = Otakara.new( wlan ) \n` ;
    };

    Generator.mrubyc_uart_gps_otakara_distance = function (block) {
        Generator.prepares_['uart_gps_otakara'] = Generator.mrubyc_uart_gps_otakara_init(null);
	const pos = Generator.getFieldValue(block, 'OTAKARA') || null;
        return [`takara.calcDist( gps.pos, ${pos} )`, Generator.ORDER_ATOMIC];	
    };

    // iBeacon
    //
    Generator.mrubyc_ibeacon_init = function (block) {
        return  `ibeacon = IBeacon.new \n`;
    };
    
    Generator.mrubyc_ibeacon_get = function (block) {
        Generator.prepares_['ibeacon'] = Generator.mrubyc_ibeacon_init(null);
        return `ibeacon.get \n`;
    };

    Generator.mrubyc_ibeacon = function (block) {
        Generator.prepares_['ibeacon'] = Generator.mrubyc_ibeacon_init(null);
	const val = Generator.getFieldValue(block, 'VAL') || null;
        return [`ibeacon.${val}`, Generator.ORDER_ATOMIC];	
    };    
        
    // 高専サーバへの送信
    //
    Generator.mrubyc_matsue_send_srv = function (block) {
        return [`"http://pluto.epi.it.matsue-ct.jp/iotex2/monitoring3.php"`, Generator.ORDER_ATOMIC];
    }

    Generator.mrubyc_matsue_send_data = function (block) {
	const srv  = Generator.valueToCode(block,  'SRV') || null;
	const name = Generator.valueToCode(block,  'NAME') || null;
	const time = getUnquoteText(block,         'TIME', Generator.ORDER_NONE);
	const key  = Generator.getFieldValue(block,'KEY') || null;
	const val  = Generator.valueToCode(block,  'VALUE', Generator.ORDER_NONE);
	const key2 = Generator.getFieldValue(block,'KEY2') || null;
	const val2 = Generator.valueToCode(block,  'VALUE2', Generator.ORDER_NONE);
	const tz   = Generator.getFieldValue(block,'TIMEZONE') || null;
        return  [`sprintf("%s?hostname=%s&time=%s&${key}=%f&${key2}=%f&utc=%d",${srv},${name},${time},${val},${val2},${tz})`, Generator.ORDER_ATOMIC];
    };

    Generator.mrubyc_matsue_send = function (block) {
	const url = getUnquoteText(block, 'URL') || null;
        return `wlan.access( ${url} )\n`;
    };

    Generator.mrubyc_matsue_send_save_init = function (block) {
        return `listURLs = Array.new \n`;
    };

    Generator.mrubyc_matsue_send_save = function (block) {
	Generator.prepares_['send_save_init'] = Generator.mrubyc_matsue_send_save_init(null);
	const url = getUnquoteText(block, 'URL') || null;
        return `listURLs.push( ${url} )\n`;
    };

    Generator.mrubyc_matsue_send_save2 = function (block) {
	Generator.prepares_['send_save_init'] = Generator.mrubyc_matsue_send_save_init(null);
        return `listURLs.each do |listURL| \n` +
	    `  wlan.access( listURL ) \n` +
	    `end \n` +
	    `listURLs = Array.new \n`;
    };

    return Generator;
}