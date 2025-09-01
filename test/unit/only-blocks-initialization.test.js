/**
 * @fileoverview Test for only_blocks parameter initialization logic
 */

import {CATEGORY_BLOCKS, initializeBlockSelectionFromOnlyBlocks} from '../../src/components/block-display-modal/block-display-modal.jsx';

describe('only_blocks parameter initialization', () => {
    test('should initialize with all blocks selected when no only_blocks parameter (default behavior)', () => {
        const result = initializeBlockSelectionFromOnlyBlocks(null);
        expect(result).toEqual({
            motion: CATEGORY_BLOCKS.motion,
            looks: CATEGORY_BLOCKS.looks,
            sound: CATEGORY_BLOCKS.sound,
            events: CATEGORY_BLOCKS.events,
            control: CATEGORY_BLOCKS.control,
            sensing: CATEGORY_BLOCKS.sensing,
            operators: CATEGORY_BLOCKS.operators
        });
    });

    test('should initialize empty selection when empty string is provided', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('');
        expect(result).toEqual({
            motion: [],
            looks: [],
            sound: [],
            events: [],
            control: [],
            sensing: [],
            operators: []
        });
    });

    test('should select all motion blocks when "motion_" is specified', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('motion_');
        expect(result.motion).toEqual(CATEGORY_BLOCKS.motion);
        expect(result.looks).toEqual([]);
        expect(result.sound).toEqual([]);
    });

    test('should select specific block when exact block ID is specified', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('motion_movesteps');
        expect(result.motion).toEqual(['motion_movesteps']);
        expect(result.looks).toEqual([]);
    });

    test('should handle multiple categories with underscore suffix', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('motion_.looks_');
        expect(result.motion).toEqual(CATEGORY_BLOCKS.motion);
        expect(result.looks).toEqual(CATEGORY_BLOCKS.looks);
        expect(result.sound).toEqual([]);
    });

    test('should handle mix of category and specific block selections', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('motion_.looks_say.sound_play');
        expect(result.motion).toEqual(CATEGORY_BLOCKS.motion);
        expect(result.looks).toEqual(['looks_say']);
        expect(result.sound).toEqual(['sound_play']);
    });

    test('should not have prefix matching issues - looks_say should not affect looks_sayforsecs', () => {
        // When only looks_say is specified, looks_sayforsecs should NOT be selected
        const result = initializeBlockSelectionFromOnlyBlocks('looks_say');
        expect(result.looks).toEqual(['looks_say']);
        expect(result.looks).not.toContain('looks_sayforsecs');
    });

    test('should work with comma separator', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('motion_movesteps,looks_say');
        expect(result.motion).toEqual(['motion_movesteps']);
        expect(result.looks).toEqual(['looks_say']);
    });

    test('should work with period separator', () => {
        const result = initializeBlockSelectionFromOnlyBlocks('motion_movesteps.looks_say');
        expect(result.motion).toEqual(['motion_movesteps']);
        expect(result.looks).toEqual(['looks_say']);
    });
});