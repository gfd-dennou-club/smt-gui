/**
 * Define Ruby code generator for micro:bit MORE Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.microbitMore_whenButtonPressed = function (block) {
        block.isStatement = true;
        const btn =
            Generator.valueToCode(block, "BTN", Generator.ORDER_NONE) ||
            Generator.quote_("A");
        return `microbit_more.when_button_pressed(${btn}) do\n`;
    };

    Generator.microbitMore_isButtonPressed = function (block) {
        const btn =
            Generator.valueToCode(block, "BTN", Generator.ORDER_NONE) ||
            Generator.quote_("A");
        return [
            `microbit_more.button_pressed?(${btn})`,
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    Generator.microbitMore_whenGesture = function (block) {
        block.isStatement = true;
        const gesture =
            Generator.valueToCode(block, "GESTURE", Generator.ORDER_NONE) ||
            Generator.quote_("moved");
        return `microbit_more.when(${gesture}) do\n`;
    };

    const makeMatrixArgs = function (matrix) {
        matrix = matrix.replace(/0/g, ".");
        matrix = matrix.match(/.{5}/g).map((s) => Generator.quote_(s));
        return matrix.join(",\n");
    };
    Generator.microbitMore_displaySymbol = function (block) {
        let matrix = Generator.valueToCode(
            block,
            "MATRIX",
            Generator.ORDER_NONE
        );
        if (!matrix) {
            matrix = makeMatrixArgs("0101010101100010101000100");
        }
        if (matrix.indexOf("\n") >= 0) {
            matrix = `\n${Generator.prefixLines(matrix, Generator.INDENT)}\n`;
        }
        return `microbit_more.display(${matrix})\n`;
    };

    Generator.microbitMore_displayText = function (block) {
        const text =
            Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) ||
            Generator.quote_("Hello!");
        return `microbit_more.display_text(${text})\n`;
    };

    Generator.microbitMore_displayClear = function () {
        return `microbit_more.clear_display\n`;
    };

    Generator.microbitMore_whenTilted = function (block) {
        block.isStatement = true;
        const direction =
            Generator.valueToCode(block, "DIRECTION", Generator.ORDER_NONE) ||
            null;
        return `microbit_more.when_tilted(${direction}) do\n`;
    };

    Generator.microbitMore_isTilted = function (block) {
        const direction =
            Generator.valueToCode(block, "DIRECTION", Generator.ORDER_NONE) ||
            null;
        return [`microbit_more.tilted?(${direction})`, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_getTiltAngle = function (block) {
        const direction =
            Generator.valueToCode(block, "DIRECTION", Generator.ORDER_NONE) ||
            null;
        return [
            `microbit_more.tilt_angle(${direction})`,
            Generator.ORDER_ATOMIC,
        ];
    };

    Generator.microbitMore_whenPinConnected = function (block) {
        block.isStatement = true;
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return `microbit_more.when_pin_connected(${pin}) do\n`;
    };

    Generator.microbitMore_isPinConnected = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [
            `microbit_more.pin_connected?(${pin})`,
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    Generator.microbitMore_getLightLevel = function () {
        return ["microbit_more.light_intensity", Generator.ORDER_FUNCTION_CALL];
    };

    Generator.microbitMore_getTemperature = function () {
        return ["microbit_more.temperature", Generator.ORDER_FUNCTION_CALL];
    };

    Generator.microbitMore_getCompassHeading = function () {
        return [
            "microbit_more.angle_with_the_north",
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    Generator.microbitMore_getPitch = function () {
        return ["microbit_more.pitch", Generator.ORDER_FUNCTION_CALL];
    };

    Generator.microbitMore_getRoll = function () {
        return ["microbit_more.roll", Generator.ORDER_FUNCTION_CALL];
    };

    Generator.microbitMore_getMagneticForce = function () {
        return ["microbit_more.magnetic_force", Generator.ORDER_FUNCTION_CALL];
    };

    Generator.microbitMore_getAcceleration = function (block) {
        const axis =
            Generator.valueToCode(block, "AXIS", Generator.ORDER_NONE) || null;
        return [
            `microbit_more.acceleration(${axis})`,
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    Generator.microbitMore_getAnalogValue = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [
            `microbit_more.analog_value_of_pin(${pin})`,
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    Generator.microbitMore_getDigitalValue = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [
            `microbit_more.digital_value_of_pin(${pin})`,
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    const PinModeLabel = {
        pullNone: "none",
        pullUp: "up",
        pullDown: "down",
    };
    Generator.microbitMore_setPinMode = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        const mode = Generator.getFieldValue(block, "MODE") || "pullUp";
        const modeLabel = Generator.quote_(PinModeLabel[mode]);
        return `microbit_more.set_pin_to_input_pull(${pin}, ${modeLabel})\n`;
    };

    Generator.microbitMore_setOutput = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        const level =
            Generator.valueToCode(block, "LEVEL", Generator.ORDER_NONE) || 0;
        return `microbit_more.set_digital(${pin}, ${level})\n`;
    };

    Generator.microbitMore_setPWM = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        const level =
            Generator.valueToCode(block, "LEVEL", Generator.ORDER_NONE) || 0;
        return `microbit_more.set_pwm(${pin}, ${level})\n`;
    };

    Generator.microbitMore_setServo = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        const angle =
            Generator.valueToCode(block, "ANGLE", Generator.ORDER_NONE) || 0;
        return `microbit_more.set_servo(${pin}, ${angle})\n`;
    };

    const EventTypeLabel = {
        0: "none",
        1: "edge",
        2: "pulse",
    };
    Generator.microbitMore_setPinEventType = function (block) {
        const eventType = Generator.getFieldValue(block, "EVENT_TYPE") || 0;
        const eventTypeLabel = Generator.quote_(EventTypeLabel[eventType]);
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        return `microbit_more.catch_event_on(${eventTypeLabel}, ${pin})\n`;
    };

    const EventLabel = {
        5: "low pulse",
        4: "high pulse",
        3: "fall",
        2: "rise",
    };
    Generator.microbitMore_whenPinEvent = function (block) {
        block.isStatement = true;
        const event = Generator.getFieldValue(block, "EVENT") || 5;
        const eventLabel = Generator.quote_(EventLabel[event]);
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        return `microbit_more.when_catch_at_pin(${eventLabel}, ${pin}) do\n`;
    };

    Generator.microbitMore_getPinEventTimestamp = function (block) {
        const event = Generator.getFieldValue(block, "EVENT") || 5;
        const eventLabel = Generator.quote_(EventLabel[event]);
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || 0;
        return `microbit_more.timestamp_of(${eventLabel}, ${pin})\n`;
    };

    Generator.microbitMore_getSharedData = function (block) {
        const index =
            Generator.valueToCode(block, "INDEX", Generator.ORDER_NONE) || 0;
        return [
            `microbit_more.shared_data[${index}]`,
            Generator.ORDER_FUNCTION_CALL,
        ];
    };

    Generator.microbitMore_setSharedData = function (block) {
        const index =
            Generator.valueToCode(block, "INDEX", Generator.ORDER_NONE) || 0;
        const value =
            Generator.valueToCode(block, "VALUE", Generator.ORDER_NONE) || 0;
        return `microbit_more.shared_data[${index}] = ${value}\n`;
    };

    Generator.microbitMore_whenConnectionChanged = function (block) {
        block.isStatement = true;
        const state = Generator.quote_(
            Generator.getFieldValue(block, "STATE") || "connected"
        );
        return `microbit_more.when_microbit(${state}) do\n`;
    };

    Generator.microbitMore_menu_buttons = function (block) {
        const buttons = Generator.quote_(
            Generator.getFieldValue(block, "buttons") || "A"
        );
        return [buttons, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_gestures = function (block) {
        const gestures = Generator.quote_(
            Generator.getFieldValue(block, "gestures") || "moved"
        );
        return [gestures, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_tiltDirectionAny = function (block) {
        const tiltDirectionAny = Generator.quote_(
            Generator.getFieldValue(block, "tiltDirectionAny") || "any"
        );
        return [tiltDirectionAny, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_tiltDirection = function (block) {
        const tiltDirection = Generator.quote_(
            Generator.getFieldValue(block, "tiltDirection") || "front"
        );
        return [tiltDirection, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_touchPins = function (block) {
        const touchPins = Generator.getFieldValue(block, "touchPins") || 0;
        return [touchPins, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_gpio = function (block) {
        const gpio = Generator.getFieldValue(block, "gpio") || 0;
        return [gpio, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_axis = function (block) {
        const axis = Generator.quote_(
            Generator.getFieldValue(block, "axis") || "x"
        );
        return [axis, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_analogIn = function (block) {
        const analogIn = Generator.getFieldValue(block, "analogIn") || 0;
        return [analogIn, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_digitalValue = function (block) {
        const digitalValue =
            Generator.getFieldValue(block, "digitalValue") || 0;
        return [digitalValue, Generator.ORDER_ATOMIC];
    };

    Generator.microbitMore_menu_sharedDataIndex = function (block) {
        const index = Generator.getFieldValue(block, "sharedDataIndex") || 0;
        return [index, Generator.ORDER_ATOMIC];
    };

    Generator.matrix = function (block) {
        const matrix =
            Generator.getFieldValue(block, "MATRIX") ||
            "0000000000000000000000000";
        return [makeMatrixArgs(matrix), Generator.ORDER_ATOMIC];
    };

    return Generator;
}
