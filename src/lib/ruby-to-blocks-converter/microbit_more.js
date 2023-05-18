import Primitive from "./primitive";

const MicroBitMore = "microbit_more";
const SharedData = "microbit_more.shared_data";

const ButtonsMenu = ["A", "B", "any"];
const ButtonsMenuLower = ButtonsMenu.map((x) => x.toLowerCase());

const GesturesMenu = ["moved", "shaken", "jumped"];

const TiltDirectionAnyMenu = ["front", "back", "left", "right", "any"];

const TiltDirectionMenu = TiltDirectionAnyMenu.slice(0, 4);

const AnalogIn = [0, 1, 2];
const Gpio = [0, 1, 2, 8, 13, 14, 15, 16];

const AccelerationMenu = ["x", "y", "z", "absolute"];

const PinMode = {
    none: "pullNone",
    up: "pullUp",
    down: "pullDown",
};
const PinModeMenu = Object.keys(PinMode);

const EventType = {
    none: 0,
    pulse: 2,
    edge: 1,
};
const EventTypeMenu = Object.keys(EventType);

const EventMenu = ["rise", "fall", "high pulse", "low pulse"];
const Event = [2, 3, 4, 5];

const ConnectionStateMenu = ["connected", "disconnected"];

/**
 * MicroBitMore converter
 */
const MicroBitMoreConverter = {
    register: function (converter) {
        converter.registerCallMethod("self", MicroBitMore, 0, (params) => {
            const { node } = params;

            return converter.createRubyExpressionBlock(MicroBitMore, node);
        });

        converter.registerCallMethodWithBlock(
            MicroBitMore,
            "when_button_pressed",
            1,
            0,
            (params) => {
                const { receiver, args, rubyBlock } = params;

                if (!converter.isStringOrBlock(args[0])) return null;
                if (converter.isString(args[0])) {
                    const index = ButtonsMenuLower.indexOf(
                        args[0].toString().toLowerCase()
                    );
                    if (index < 0) return null;

                    args[0] = new Primitive(
                        "str",
                        ButtonsMenu[index],
                        args[0].node
                    );
                }

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_whenButtonPressed",
                    "hat"
                );
                converter.addFieldInput(
                    block,
                    "BTN",
                    "microbitMore_menu_buttons",
                    "buttons",
                    args[0],
                    "A"
                );
                converter.setParent(rubyBlock, block);
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "button_pressed?",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isStringOrBlock(args[0])) return null;
                if (converter.isString(args[0])) {
                    const index = ButtonsMenuLower.indexOf(
                        args[0].toString().toLowerCase()
                    );
                    if (index < 0) return null;

                    args[0] = new Primitive(
                        "str",
                        ButtonsMenu[index],
                        args[0].node
                    );
                }

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_isButtonPressed",
                    "value_boolean"
                );
                converter.addFieldInput(
                    block,
                    "BTN",
                    "microbitMore_menu_buttons",
                    "buttons",
                    args[0],
                    "A"
                );
                return block;
            }
        );

        converter.registerCallMethodWithBlock(
            MicroBitMore,
            "when",
            1,
            0,
            (params) => {
                const { receiver, args, rubyBlock } = params;

                if (!converter.isStringOrBlock(args[0])) return null;
                if (converter.isString(args[0])) {
                    const index = GesturesMenu.indexOf(
                        args[0].toString().toLowerCase()
                    );
                    if (index < 0) return null;

                    args[0] = new Primitive(
                        "str",
                        GesturesMenu[index],
                        args[0].node
                    );
                }

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_whenGesture",
                    "hat"
                );
                converter.addFieldInput(
                    block,
                    "GESTURE",
                    "microbitMore_menu_gestures",
                    "gestures",
                    args[0],
                    "moved"
                );
                converter.setParent(rubyBlock, block);
                return block;
            }
        );

        converter.registerCallMethod(MicroBitMore, "display", 5, (params) => {
            const { receiver, args } = params;

            if (!args.every((x) => converter.isString(x))) return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_displaySymbol",
                "statement"
            );

            let matrix = "";
            for (const arg of args) {
                matrix += arg;
            }
            matrix = matrix.replace(/[1-9]/g, "1").replace(/[^1-9]/g, "0");
            converter.addFieldInput(
                block,
                "MATRIX",
                "matrix",
                "MATRIX",
                matrix,
                null
            );
            return block;
        });

        converter.registerCallMethod(MicroBitMore, "display", 1, (params) => {
            const { receiver, args } = params;

            if (!converter.isBlock(args[0])) return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_displaySymbol",
                "statement"
            );
            converter.addFieldInput(
                block,
                "MATRIX",
                "matrix",
                "MATRIX",
                args[0],
                "0101010101100010101000100"
            );
            return block;
        });

        converter.registerCallMethod(
            MicroBitMore,
            "display_text",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isStringOrBlock(args[0])) return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_displayText",
                    "statement"
                );
                converter.addTextInput(block, "TEXT", args[0], "Hello!");
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "clear_display",
            0,
            (params) => {
                const { receiver } = params;

                return converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_displayClear",
                    "statement"
                );
            }
        );

        converter.registerCallMethodWithBlock(
            MicroBitMore,
            "when_tilted",
            1,
            0,
            (params) => {
                const { receiver, args, rubyBlock } = params;

                if (!converter.isStringOrBlock(args[0])) return null;
                if (converter.isString(args[0])) {
                    const index = TiltDirectionAnyMenu.indexOf(
                        args[0].toString().toLowerCase()
                    );
                    if (index < 0) return null;

                    args[0] = new Primitive(
                        "str",
                        TiltDirectionAnyMenu[index],
                        args[0].node
                    );
                }

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_whenTilted",
                    "hat"
                );
                converter.addFieldInput(
                    block,
                    "DIRECTION",
                    "microbitMore_menu_tiltDirectionAny",
                    "tiltDirectionAny",
                    args[0],
                    "any"
                );
                converter.setParent(rubyBlock, block);
                return block;
            }
        );

        converter.registerCallMethod(MicroBitMore, "tilted?", 1, (params) => {
            const { receiver, args } = params;

            if (!converter.isStringOrBlock(args[0])) return null;
            if (converter.isString(args[0])) {
                const index = TiltDirectionAnyMenu.indexOf(
                    args[0].toString().toLowerCase()
                );
                if (index < 0) return null;

                args[0] = new Primitive(
                    "str",
                    TiltDirectionAnyMenu[index],
                    args[0].node
                );
            }

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_isTilted",
                "value_boolean"
            );
            converter.addFieldInput(
                block,
                "DIRECTION",
                "microbitMore_menu_tiltDirectionAny",
                "tiltDirectionAny",
                args[0],
                "any"
            );
            return block;
        });

        converter.registerCallMethod(
            MicroBitMore,
            "tilt_angle",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isStringOrBlock(args[0])) return null;
                if (converter.isString(args[0])) {
                    const index = TiltDirectionMenu.indexOf(
                        args[0].toString().toLowerCase()
                    );
                    if (index < 0) return null;

                    args[0] = new Primitive(
                        "str",
                        TiltDirectionMenu[index],
                        args[0].node
                    );
                }

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getTiltAngle",
                    "value"
                );
                converter.addFieldInput(
                    block,
                    "DIRECTION",
                    "microbitMore_menu_tiltDirection",
                    "tiltDirection",
                    args[0],
                    "front"
                );
                return block;
            }
        );

        converter.registerCallMethodWithBlock(
            MicroBitMore,
            "when_pin_connected",
            1,
            0,
            (params) => {
                const { receiver, args, rubyBlock } = params;

                if (!converter.isNumberOrBlock(args[0])) return null;
                if (
                    converter.isNumber(args[0]) &&
                    Gpio.indexOf(args[0].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_whenPinConnected",
                    "hat"
                );
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[0],
                    "0"
                );
                converter.setParent(rubyBlock, block);
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "pin_connected?",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isNumberOrBlock(args[0])) return null;
                if (
                    converter.isNumber(args[0]) &&
                    Gpio.indexOf(args[0].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_isPinConnected",
                    "value_boolean"
                );
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[0],
                    "0"
                );
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "light_intensity",
            0,
            (params) => {
                const { receiver } = params;

                return converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getLightLevel",
                    "value"
                );
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "temperature",
            0,
            (params) => {
                const { receiver } = params;

                return converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getTemperature",
                    "value"
                );
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "angle_with_the_north",
            0,
            (params) => {
                const { receiver } = params;

                return converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getCompassHeading",
                    "value"
                );
            }
        );

        converter.registerCallMethod(MicroBitMore, "pitch", 0, (params) => {
            const { receiver } = params;

            return converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_getPitch",
                "value"
            );
        });

        converter.registerCallMethod(MicroBitMore, "roll", 0, (params) => {
            const { receiver } = params;

            return converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_getRoll",
                "value"
            );
        });

        converter.registerCallMethod(
            MicroBitMore,
            "magnetic_force",
            0,
            (params) => {
                const { receiver } = params;

                return converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getMagneticForce",
                    "value"
                );
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "acceleration",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isStringOrBlock(args[0])) return null;
                if (converter.isString(args[0])) {
                    const index = AccelerationMenu.indexOf(
                        args[0].toString().toLowerCase()
                    );
                    if (index < 0) return null;

                    args[0] = new Primitive(
                        "str",
                        AccelerationMenu[index],
                        args[0].node
                    );
                }
                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getAcceleration",
                    "value"
                );
                converter.addFieldInput(
                    block,
                    "AXIS",
                    "microbitMore_menu_axis",
                    "axis",
                    args[0],
                    "x"
                );
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "analog_value_of_pin",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isNumberOrBlock(args[0])) return null;
                if (
                    converter.isNumber(args[0]) &&
                    AnalogIn.indexOf(args[0].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getAnalogValue",
                    "value"
                );
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_analogIn",
                    "analogIn",
                    args[0],
                    "0"
                );
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "digital_value_of_pin",
            1,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isNumberOrBlock(args[0])) return null;
                if (
                    converter.isNumber(args[0]) &&
                    Gpio.indexOf(args[0].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getDigitalValue",
                    "value"
                );
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[0],
                    "0"
                );
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "set_pin_to_input_pull",
            2,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isNumberOrBlock(args[0])) return null;
                if (
                    converter.isNumber(args[0]) &&
                    AnalogIn.indexOf(args[0].value) < 0
                )
                    return null;
                if (!converter.isString(args[1])) return null;
                const index = PinModeMenu.indexOf(
                    args[1].toString().toLowerCase()
                );
                if (index < 0) return null;
                args[1] = new Primitive(
                    "str",
                    PinMode[PinModeMenu[index]],
                    args[1].node
                );

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_setPinMode",
                    "statement"
                );
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_analogIn",
                    "analogIn",
                    args[0],
                    "0"
                );
                converter.addField(block, "MODE", args[1]);
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "set_digital",
            2,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isNumberOrBlock(args[0])) return null;
                if (
                    converter.isNumber(args[0]) &&
                    Gpio.indexOf(args[0].value) < 0
                )
                    return null;
                if (!converter.isNumberOrBlock(args[1])) return null;
                if (
                    converter.isNumber(args[1]) &&
                    args[1].value !== 0 &&
                    args[1].value !== 1
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_setOutput",
                    "statement"
                );
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[0],
                    "0"
                );
                converter.addFieldInput(
                    block,
                    "LEVEL",
                    "microbitMore_menu_digitalValue",
                    "digitalValue",
                    args[1],
                    "0"
                );
                return block;
            }
        );

        converter.registerCallMethod(MicroBitMore, "set_pwm", 2, (params) => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (converter.isNumber(args[0]) && Gpio.indexOf(args[0].value) < 0)
                return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_setPWM",
                "statement"
            );
            converter.addFieldInput(
                block,
                "PIN",
                "microbitMore_menu_gpio",
                "gpio",
                args[0],
                "0"
            );
            converter.addNumberInput(block, "LEVEL", "math_number", args[1], 0);
            return block;
        });

        converter.registerCallMethod(MicroBitMore, "set_servo", 2, (params) => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (converter.isNumber(args[0]) && Gpio.indexOf(args[0].value) < 0)
                return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_setServo",
                "statement"
            );
            converter.addFieldInput(
                block,
                "PIN",
                "microbitMore_menu_gpio",
                "gpio",
                args[0],
                "0"
            );
            converter.addNumberInput(block, "ANGLE", "math_number", args[1], 0);
            return block;
        });

        converter.registerCallMethod(
            MicroBitMore,
            "catch_event_on",
            2,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isString(args[0])) return null;
                const index = EventTypeMenu.indexOf(
                    args[0].toString().toLowerCase()
                );
                if (index < 0) return null;
                args[0] = new Primitive(
                    "int",
                    EventType[EventTypeMenu[index]],
                    args[0].node
                );
                if (!converter.isNumberOrBlock(args[1])) return null;
                if (
                    converter.isNumber(args[1]) &&
                    Gpio.indexOf(args[1].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_setPinEventType",
                    "statement"
                );
                converter.addField(block, "EVENT_TYPE", args[0]);
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[1],
                    "0"
                );
                return block;
            }
        );

        converter.registerCallMethodWithBlock(
            MicroBitMore,
            "when_catch_at_pin",
            2,
            0,
            (params) => {
                const { receiver, args, rubyBlock } = params;

                if (!converter.isString(args[0])) return null;
                const index = EventMenu.indexOf(
                    args[0].toString().toLowerCase()
                );
                if (index < 0) return null;
                args[0] = new Primitive("int", Event[index], args[0].node);
                if (!converter.isNumberOrBlock(args[1])) return null;
                if (
                    converter.isNumber(args[1]) &&
                    Gpio.indexOf(args[1].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_whenPinEvent",
                    "hat"
                );
                converter.addField(block, "EVENT", args[0]);
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[1],
                    "0"
                );
                converter.setParent(rubyBlock, block);
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "timestamp_of",
            2,
            (params) => {
                const { receiver, args } = params;

                if (!converter.isString(args[0])) return null;
                const index = EventMenu.indexOf(
                    args[0].toString().toLowerCase()
                );
                if (index < 0) return null;
                args[0] = new Primitive("int", Event[index], args[0].node);
                if (!converter.isNumberOrBlock(args[1])) return null;
                if (
                    converter.isNumber(args[1]) &&
                    Gpio.indexOf(args[1].value) < 0
                )
                    return null;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_getPinEventTimestamp",
                    "value"
                );
                converter.addField(block, "EVENT", args[0]);
                converter.addFieldInput(
                    block,
                    "PIN",
                    "microbitMore_menu_gpio",
                    "gpio",
                    args[1],
                    "0"
                );
                return block;
            }
        );

        converter.registerCallMethod(
            MicroBitMore,
            "shared_data",
            0,
            (params) => {
                const { receiver, node } = params;

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "ruby_expression",
                    "value_boolean"
                );
                block.node = node;
                converter.addInput(
                    block,
                    "EXPRESSION",
                    converter.createTextBlock(SharedData)
                );
                return block;
            }
        );

        converter.registerCallMethod(SharedData, "[]", 1, (params) => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (
                converter.isNumber(args[0]) &&
                (args[0].value < 0 || args[0].value > 3)
            )
                return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_getSharedData",
                "value"
            );
            converter.addFieldInput(
                block,
                "INDEX",
                "microbitMore_menu_sharedDataIndex",
                "sharedDataIndex",
                args[0],
                "0"
            );
            return block;
        });

        converter.registerCallMethod(SharedData, "[]=", 2, (params) => {
            const { receiver, args } = params;

            if (!converter.isNumberOrBlock(args[0])) return null;
            if (
                converter.isNumber(args[0]) &&
                (args[0].value < 0 || args[0].value > 3)
            )
                return null;
            if (!converter.isNumberOrBlock(args[1])) return null;

            const block = converter.changeRubyExpressionBlock(
                receiver,
                "microbitMore_setSharedData",
                "statement"
            );
            converter.addFieldInput(
                block,
                "INDEX",
                "microbitMore_menu_sharedDataIndex",
                "sharedDataIndex",
                args[0],
                "0"
            );
            converter.addNumberInput(block, "VALUE", "math_number", args[1], 0);
            return block;
        });

        converter.registerCallMethodWithBlock(
            MicroBitMore,
            "when_microbit",
            1,
            0,
            (params) => {
                const { receiver, args, rubyBlock } = params;

                if (!converter.isString(args[0])) return null;
                const index = ConnectionStateMenu.indexOf(
                    args[0].toString().toLowerCase()
                );
                if (index < 0) return null;
                args[0] = new Primitive(
                    "str",
                    ConnectionStateMenu[index],
                    args[0].node
                );

                const block = converter.changeRubyExpressionBlock(
                    receiver,
                    "microbitMore_whenConnectionChanged",
                    "hat"
                );
                converter.addField(block, "STATE", args[0]);
                converter.setParent(rubyBlock, block);
                return block;
            }
        );
    },
};

export default MicroBitMoreConverter;
