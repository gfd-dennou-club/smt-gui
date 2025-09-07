import _ from 'lodash';

/**
 * GdxFor converter
 */
const GdxForConverter = {
    register: function (converter) {
        // Regular method calls
        converter.registerCallMethod('self', 'gdx_for_acceleration', 1, params => {
            const {args} = params;
            
            if (!converter.isStringOrBlock(args[0])) return null;
            
            const block = converter.createBlock('gdxfor_getAcceleration', 'value');
            converter.addInput(
                block,
                'DIRECTION',
                converter.createFieldBlock('gdxfor_menu_axisOptions', 'axisOptions', args[0])
            );
            return block;
        });

        converter.registerCallMethod('self', 'gdx_for_force', 0, () =>
            converter.createBlock('gdxfor_getForce', 'value')
        );

        converter.registerCallMethod('self', 'gdx_for_tilted?', 1, params => {
            const {args} = params;
            
            if (!converter.isStringOrBlock(args[0])) return null;
            
            const block = converter.createBlock('gdxfor_isTilted', 'value');
            converter.addInput(
                block,
                'TILT',
                converter.createFieldBlock('gdxfor_menu_tiltAnyOptions', 'tiltAnyOptions', args[0])
            );
            return block;
        });

        converter.registerCallMethod('self', 'gdx_for_tilt_angle', 1, params => {
            const {args} = params;
            
            if (!converter.isStringOrBlock(args[0])) return null;
            
            const block = converter.createBlock('gdxfor_getTilt', 'value');
            converter.addInput(
                block,
                'TILT',
                converter.createFieldBlock('gdxfor_menu_tiltOptions', 'tiltOptions', args[0])
            );
            return block;
        });

        converter.registerCallMethod('self', 'gdx_for_falling?', 0, () =>
            converter.createBlock('gdxfor_isFreeFalling', 'value')
        );

        converter.registerCallMethod('self', 'gdx_for_spin_speed', 1, params => {
            const {args} = params;
            
            if (!converter.isStringOrBlock(args[0])) return null;
            
            const block = converter.createBlock('gdxfor_getSpinSpeed', 'value');
            converter.addInput(
                block,
                'DIRECTION',
                converter.createFieldBlock('gdxfor_menu_axisOptions', 'axisOptions', args[0])
            );
            return block;
        });

        // Event methods with blocks
        converter.registerCallMethodWithBlock('self', 'when', 2, 0, params => {
            const {args, rubyBlock} = params;
            
            if (args[0].type !== 'sym' || !converter.isStringOrBlock(args[1])) return null;
            
            let block;
            switch (args[0].value) {
            case 'gdx_for_gesture': {
                block = converter.createBlock('gdxfor_whenGesture', 'hat');
                converter.addInput(
                    block,
                    'GESTURE',
                    converter.createFieldBlock('gdxfor_menu_gestureOptions', 'gestureOptions', args[1])
                );
                converter.setParent(rubyBlock, block);
                break;
            }
                
            case 'gdx_force_sensor': {
                block = converter.createBlock('gdxfor_whenForcePushedOrPulled', 'hat');
                converter.addInput(
                    block,
                    'PUSH_PULL',
                    converter.createFieldBlock('gdxfor_menu_pushPullOptions', 'pushPullOptions', args[1])
                );
                converter.setParent(rubyBlock, block);
                break;
            }
                
            case 'gdx_for_tilted': {
                block = converter.createBlock('gdxfor_whenTilted', 'hat');
                converter.addInput(
                    block,
                    'TILT',
                    converter.createFieldBlock('gdxfor_menu_tiltAnyOptions', 'tiltAnyOptions', args[1])
                );
                converter.setParent(rubyBlock, block);
                break;
            }
            }
            
            return block;
        });
    }
};

export default GdxForConverter;
