import RubyGenerator from '../../../../src/lib/ruby-generator';
import LooksBlocks from '../../../../src/lib/ruby-generator/looks';

describe('RubyGenerator/Looks', () => {
    beforeEach(() => {
        RubyGenerator.cache_ = {
            comments: {},
            targetCommentTexts: []
        };
        RubyGenerator.definitions_ = {};
        RubyGenerator.functionNames_ = {};
        RubyGenerator.currentTarget = null;
        LooksBlocks(RubyGenerator);
    });

    describe('looks_say', () => {
        test('normal say', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {
                    MESSAGE: {}
                }
            };
            RubyGenerator.valueToCode = jest.fn().mockReturnValue('"Hello!"');
            const expected = 'say("Hello!")\n';
            expect(RubyGenerator.looks_say(block)).toEqual(expected);
        });

        test('with @smalruby:print', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {
                    MESSAGE: {}
                }
            };
            RubyGenerator.cache_.comments['block-id'] = { text: '@smalruby:print' };
            RubyGenerator.valueToCode = jest.fn().mockReturnValue('"Hello!"');
            const expected = 'print("Hello!")\n';
            expect(RubyGenerator.looks_say(block)).toEqual(expected);
        });

        test('with @smalruby:puts', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {
                    MESSAGE: {}
                }
            };
            RubyGenerator.cache_.comments['block-id'] = { text: '@smalruby:puts' };
            RubyGenerator.valueToCode = jest.fn().mockReturnValue('"Hello!"');
            const expected = 'puts("Hello!")\n';
            expect(RubyGenerator.looks_say(block)).toEqual(expected);
        });

        test('with @smalruby:p', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {
                    MESSAGE: {}
                }
            };
            RubyGenerator.cache_.comments['block-id'] = { text: '@smalruby:p' };
            RubyGenerator.valueToCode = jest.fn().mockReturnValue('"Hello!"');
            const expected = 'p("Hello!")\n';
            expect(RubyGenerator.looks_say(block)).toEqual(expected);
        });

        test('with unknown @smalruby: tag defaults to say', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {
                    MESSAGE: {}
                }
            };
            RubyGenerator.cache_.comments['block-id'] = { text: '@smalruby:unknown' };
            RubyGenerator.valueToCode = jest.fn().mockReturnValue('"Hello!"');
            const expected = 'say("Hello!")\n';
            expect(RubyGenerator.looks_say(block)).toEqual(expected);
        });
    });

    describe('scrub_ (meta-comment filtering)', () => {
        test('should filter out @smalruby: comments', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {},
                next: null
            };
            RubyGenerator.cache_.comments['block-id'] = { text: '@smalruby:print' };
            RubyGenerator.getInputs = jest.fn().mockReturnValue({});
            RubyGenerator.isConnectedValue = jest.fn().mockReturnValue(false);
            RubyGenerator.getBlock = jest.fn().mockReturnValue(null);
            RubyGenerator.blockToCode = jest.fn().mockReturnValue('');

            const code = 'print("Hello!")\n';
            const result = RubyGenerator.scrub_(block, code);
            
            // Should NOT contain the comment since it starts with @smalruby:
            expect(result).toEqual('print("Hello!")\n');
        });

        test('should keep normal comments', () => {
            const block = {
                id: 'block-id',
                opcode: 'looks_say',
                inputs: {},
                next: null
            };
            RubyGenerator.cache_.comments['block-id'] = { text: 'normal comment' };
            RubyGenerator.getInputs = jest.fn().mockReturnValue({});
            RubyGenerator.isConnectedValue = jest.fn().mockReturnValue(false);
            RubyGenerator.getBlock = jest.fn().mockReturnValue(null);
            RubyGenerator.blockToCode = jest.fn().mockReturnValue('');

            const code = 'say("Hello!")\n';
            const result = RubyGenerator.scrub_(block, code);
            
            expect(result).toEqual('# normal comment\nsay("Hello!")\n');
        });
    });
});
