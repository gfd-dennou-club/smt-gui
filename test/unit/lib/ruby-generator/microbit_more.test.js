import RubyGenerator from '../../../../src/lib/ruby-generator';
import MicrobitMoreBlocks from '../../../../src/lib/ruby-generator/microbit_more';

describe('RubyGenerator/MicrobitMore', () => {
    beforeEach(() => {
        RubyGenerator.cache_ = {};
        RubyGenerator.definitions_ = {};
        RubyGenerator.functionNames_ = {};
        RubyGenerator.currentTarget = null;
        MicrobitMoreBlocks(RubyGenerator);
    });

    test('microbitMore_whenPinConnected', () => {
        const block = {
            opcode: 'microbitMore_whenPinConnected',
            fields: {
                PIN: {
                    value: 'P0'
                }
            }
        };
        const expected = 'microbit_more.when_pin_connected(0) do\n';
        expect(RubyGenerator.microbitMore_whenPinConnected(block)).toEqual(expected);
    });

    test('microbitMore_isTilted', () => {
        const block = {
            opcode: 'microbitMore_isTilted',
            fields: {
                DIRECTION: {
                    value: 'ANY'
                }
            }
        };
        const result = RubyGenerator.microbitMore_isTilted(block);
        expect(result[0]).toEqual('microbit_more.tilted?("any")');
    });

    test('microbitMore_getTiltAngle', () => {
        const block = {
            opcode: 'microbitMore_getTiltAngle',
            fields: {
                DIRECTION: {
                    value: 'FRONT'
                }
            }
        };
        const result = RubyGenerator.microbitMore_getTiltAngle(block);
        expect(result[0]).toEqual('microbit_more.tilt_angle("front")');
    });

    test('microbitMore_whenGesture(MOVED)', () => {
        const block = {
            opcode: 'microbitMore_whenGesture',
            fields: {
                GESTURE: {
                    value: 'MOVED'
                }
            }
        };
        const expected = 'microbit_more.when("moved") do\n';
        expect(RubyGenerator.microbitMore_whenGesture(block)).toEqual(expected);
    });

    test('microbitMore_whenGesture(TILTED)', () => {
        const block = {
            opcode: 'microbitMore_whenGesture',
            fields: {
                GESTURE: {
                    value: 'TILTED'
                }
            }
        };
        const expected = 'microbit_more.when("tilted_any") do\n';
        expect(RubyGenerator.microbitMore_whenGesture(block)).toEqual(expected);
    });

    test('microbitMore_whenGesture(TILT_UP)', () => {
        const block = {
            opcode: 'microbitMore_whenGesture',
            fields: {
                GESTURE: {
                    value: 'TILT_UP'
                }
            }
        };
        const expected = 'microbit_more.when("tilted_front") do\n';
        expect(RubyGenerator.microbitMore_whenGesture(block)).toEqual(expected);
    });
});
