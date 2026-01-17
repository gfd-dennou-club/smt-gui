import {WebUSB, DAPLink} from 'dapjs';
import keyMirror from 'keymirror';

import log from './log.js';

import hexUrl from '../generated/microbit-more-hex-url.cjs';

/**
 * The version of a micro:bit.
 * @enum {string}
 */
const DeviceVersion = keyMirror({
    V1: null,
    V2: null
});

const vendorId = 0x0d28;
const productId = 0x0204;

/**
 * Assumes the device is a micro:bit and determines its version.
 * @param {USBDevice} device The USB device to check.
 * @returns {DeviceVersion} The version of the device.
 * @throws {Error} If the device is not a recognized micro:bit or is V1.
 */
const getDeviceVersion = device => {
    const microBitBoardId = device?.serialNumber?.substring(0, 4) ?? '';
    switch (microBitBoardId) {
    case '9900':
    case '9901':
        throw new Error('MicrobitMore only supports micro:bit V2');
    case '9903':
    case '9904':
    case '9905':
    case '9906':
        return DeviceVersion.V2;
    }

    throw new Error('Could not identify micro:bit board version');
};

/**
 * Fetches the hex file and returns a map of micro:bit versions to hex file contents.
 * @returns {Promise<Map<DeviceVersion, Uint8Array>>} A map of micro:bit versions to hex file contents.
 */
const getHexMap = async () => {
    const response = await fetch(hexUrl);
    const hex = await response.text();

    const hexMap = new Map();
    const binary = new TextEncoder().encode(hex);
    hexMap.set(DeviceVersion.V2, binary);

    return hexMap;
};

/**
 * Copy the MicrobitMore-specific hex file to the specified micro:bit.
 * @param {USBDevice} device The micro:bit to update.
 * @param {function(number): void} [progress] Optional function to call with progress updates in the range of [0..1].
 * @returns {Promise<void>} A Promise that resolves when the update is completed.
 * @throws {Error} If anything goes wrong while fetching the hex file or updating the micro:bit.
 */
const updateMicroBit = async (device, progress) => {
    log.info(`Connecting to micro:bit`);
    const transport = new WebUSB(device);
    const target = new DAPLink(transport);
    if (progress) {
        target.on(DAPLink.EVENT_PROGRESS, progress);
    }
    log.info(`Checking micro:bit version`);
    const version = getDeviceVersion(device);
    log.info(`Collecting hex file`);
    const hexMap = await getHexMap();
    const hexData = hexMap.get(version);
    if (!hexData) {
        throw new Error(`Could not find hex file for micro:bit ${version}`);
    }
    log.info(`Connecting to micro:bit ${version}`);
    await target.connect();
    log.info(`Sending hex file...`);
    try {
        await target.flash(hexData);
    } finally {
        log.info('Disconnecting');
        if (target.connected) {
            await target.disconnect();
        } else {
            log.info('Already disconnected');
        }
    }
};

/**
 * Requests a micro:bit from the browser then updates it with the MicrobitMore-specific hex file.
 * The browser is expected to prompt the user to select a micro:bit.
 * @param {function(number): void} [progress] Optional function to call with progress updates in the range of [0..1].
 * @returns {Promise<void>} A Promise that resolves when the update is completed.
 * @throws {Error} If anything goes wrong while fetching the hex file or updating the micro:bit.
 */
const selectAndUpdateMicroBit = async progress => {
    log.info('Selecting micro:bit');

    const device = await navigator.usb.requestDevice({
        filters: [{vendorId, productId}]
    });

    if (!device) {
        log.info('No device selected');
        return;
    }

    return updateMicroBit(device, progress);
};

/**
 * Checks if the browser supports updating a micro:bit.
 * @returns {boolean} True if the browser appears to support updating a micro:bit.
 */
const isMicroBitUpdateSupported = () =>
    !!(navigator.usb && navigator.usb.requestDevice);

export {
    isMicroBitUpdateSupported,
    selectAndUpdateMicroBit
};
