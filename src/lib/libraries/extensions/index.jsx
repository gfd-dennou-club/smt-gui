import React from 'react';
import {FormattedMessage} from 'react-intl';

import kanirobo             from './smt/kanirobo.png';
import kaniroboInsetIconURL from './smt/kanirobo-small.png';

import kaniroboR             from './smt/kaniroboR.png';
import kaniroboRInsetIconURL from './smt/kaniroboR-small.png';

import mctboard             from './smt/mctboard.png';
import mctboardInsetIconURL from './smt/mctboard-small.png';

import rboard               from './smt/rboard.png'
import rboardInsetIconURL   from './smt/rboard-small.png';

import microcom             from './smt/microcom.png';
import microcomInsetIconURL from './smt/microcom-small.png';

import peripherals              from './smt/peripherals.png';
import peripheralsInsetIconURL  from './smt/peripherals-small.png';

import rboard0               from './smt/rboard0.png'
import rboard0InsetIconURL   from './smt/rboard0-small.png';

const extensions = [
    {
        name: (
            <FormattedMessage
                defaultMessage="Kanirobo"
                description="Name for the 'Kanirobo' extension"
                id="gui.kanirobo.name"
            />
        ),
        extensionId: 'kanirobo',
        iconURL: kanirobo,
        insetIconURL: kaniroboInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Kanirobo Blocks"
                description="Description for the 'Kanirobo' extension"
                id="gui.kanirobo.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="KaniroboR"
                description="Name for the 'KaniroboR' extension"
                id="gui.kaniroboR.name"
            />
        ),
        extensionId: 'kaniroboR',
        iconURL: kaniroboR,
        insetIconURL: kaniroboRInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="KaniroboR Blocks"
                description="Description for the 'KaniroboR' extension"
                id="gui.kaniroboR.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="MCT-Board"
                description="Name for the 'mctboard' extension"
                id="gui.mctboard.name"
            />
        ),
        extensionId: 'mctboard',
        iconURL: mctboard,
        insetIconURL: mctboardInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Matsue-ct Board Blocks"
                description="Description for the 'mctboard' extension"
                id="gui.mctboard.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="RBoard"
                description="Name for the 'RBoard' extension"
                id="gui.rboard.name"
            />
        ),
        extensionId: 'rboard',
        iconURL: rboard,
        insetIconURL: rboardInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="RBoard Blocks"
                description="Description for the 'RBoard' extension"
                id="gui.rboard.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Microcom"
                description="Name for the 'Micro_Computer' extension"
                id="gui.microcom.name"
            />
        ),
        extensionId: 'microcom',
        iconURL: microcom,
        insetIconURL: microcomInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Common I/O API Blocks"
                description="Description for the 'Microcom' extension"
                id="gui.microcom.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Peripherals"
                description="Name for the 'Peripherals' extension"
                id="gui.peripherals.name"
            />
        ),
        extensionId: 'peripherals',
        iconURL: peripherals,
        insetIconURL: peripheralsInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Peripherals (sensors)"
                description="Description for the 'peripherals' extension"
                id="gui.peripherals.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="RBoard_old"
                description="Name for the 'RBoard' extension (old version)"
                id="gui.rboard0.name"
            />
        ),
        extensionId: 'rboard0',
        iconURL: rboard0,
        insetIconURL: rboard0InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="RBoard Blocks"
                description="Description for the 'RBoard' extension (old version)"
                id="gui.rboard0.description"
            />
        ),
        featured: true
    }
];

export default extensions;
