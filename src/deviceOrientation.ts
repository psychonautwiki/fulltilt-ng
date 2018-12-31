import {
    RotationData
} from './types';

import { RotationMatrix } from './rotationMatrix';
import { Quaternion } from './quaternion';
import { Euler } from './euler';
import {
    degToRad,
    hasScreenOrientationAPI,
    screenOrientationAngle
} from './constants';

export type DeviceOrientationOptions = {
    type: 'game' | 'world'
};

type EnrichedDeviceOrientationEvent = DeviceOrientationEvent & {
    webkitCompassAccuracy?: number,
    webkitCompassHeading?: number
};

export class DeviceOrientation {
    static ALPHA: 'alpha';
    static BETA: 'beta';
    static GAMMA: 'gamma';

    data: RotationData | null;

    private active: boolean;
    private options: DeviceOrientationOptions;

    private alphaOffsetDevice: Euler | null;
    private alphaOffsetScreen: number;

    private screenOrientationAngle: number;

    private _callbacks: ((event: DeviceOrientationEvent) => void)[];

    constructor(options: DeviceOrientationOptions) {
        this.options = options; // by default use UA deviceorientation 'type' ('game' on iOS, 'world' on Android)

        this.alphaOffsetScreen = 0;
        this.alphaOffsetDevice = null;

        this.active = false;
        this.data = null;
        this._callbacks = [];

        this.screenOrientationAngle = screenOrientationAngle;

        this._init();
    }

    _init() {
        const maxTries = 200;
        const successThreshold = 10;

        let tries = 0;
        let successCount = 0;

        // Create a game-based deviceorientation object (initial alpha === 0 degrees)
        if (this.options.type === 'game') {
            const setGameAlphaOffset = (evt: DeviceOrientationEvent) => {
                if (evt.alpha !== null) { // do regardless of whether 'evt.absolute' is also true
                    this.alphaOffsetDevice = new Euler(evt.alpha, 0, 0);
                    this.alphaOffsetDevice.rotateZ(-this.screenOrientationAngle);

                    // Discard first {successThreshold} responses while a better compass lock is found by UA
                    if (++successCount >= successThreshold) {
                        window.removeEventListener('deviceorientation', setGameAlphaOffset, false);

                        return;
                    }
                }

                if (++tries < maxTries) {
                    return;
                }

                window.removeEventListener('deviceorientation', setGameAlphaOffset, false);
            };

            window.addEventListener('deviceorientation', setGameAlphaOffset, false);

            return;
        }

        if (this.options.type === 'world') {
            const setCompassAlphaOffset = (evt: EnrichedDeviceOrientationEvent) => {
                if (evt.absolute !== true
                    && evt.webkitCompassAccuracy !== undefined
                    && evt.webkitCompassAccuracy !== null
                    && +evt.webkitCompassAccuracy >= 0
                    && +evt.webkitCompassAccuracy < 50
                ) {
                    const alphaOffsetDevice = new Euler(evt.webkitCompassHeading || 0, 0, 0);
                    alphaOffsetDevice.rotateZ(this.screenOrientationAngle);

                    this.alphaOffsetDevice = alphaOffsetDevice;
                    this.alphaOffsetScreen = this.screenOrientationAngle;

                    // Discard first {successThreshold} responses while a better compass lock is found by UA
                    if (++successCount >= successThreshold) {
                        window.removeEventListener('deviceorientation', setCompassAlphaOffset, false);
                        return;
                    }
                }

                if (++tries >= maxTries) {
                    window.removeEventListener('deviceorientation', setCompassAlphaOffset, false);
                }

            };

            window.addEventListener('deviceorientation', setCompassAlphaOffset, false);
        }

        // else... use whatever orientation system the UA provides ('game' on iOS, 'world' on Android)

        0 as never;
    }

    handleDeviceOrientationChange = (event: DeviceOrientationEvent) => {
        this.data = event;

        this._callbacks.forEach(callback =>
            callback(event)
        );
    }

    handleScreenOrientationChange = () => {
        if ( hasScreenOrientationAPI ) {
            this.screenOrientationAngle = ( window.screen.orientation.angle || 0 ) * degToRad;

            return;
        }

        this.screenOrientationAngle = (
            typeof window.orientation === 'string'
                ? parseInt(window.orientation, 10)
                : window.orientation as number
            || 0
        ) * degToRad;

        return;
    }

    start (callback = () => {}) {
        if (callback && typeof callback === 'function') {
            this._callbacks.push(callback);
        }

        if (hasScreenOrientationAPI) {
            window.screen.orientation.addEventListener('change', this.handleScreenOrientationChange, false);
        } else {
            window.addEventListener('orientationchange', this.handleScreenOrientationChange, false);
        }

        if (!this.active) {
            window.addEventListener('deviceorientation', this.handleDeviceOrientationChange, false);

            this.active = true;
        }
    }

    stop () {
        if (this.active) {
            window.removeEventListener('deviceorientation', this.handleDeviceOrientationChange, false);

            this.active = false;
        }
    }

    listen (callback = () => {}) {
        this.start(callback);
    }

    getFixedFrameQuaternion (): Quaternion {
        const euler = Euler.empty();
        const matrix = RotationMatrix.empty();
        const quaternion = Quaternion.empty();

        const orientationData: RotationData =
            this.data || { alpha: 0, beta: 0, gamma: 0 };

        let adjustedAlpha = orientationData.alpha || 0;

        if (this.alphaOffsetDevice) {
            matrix.setFromEuler(this.alphaOffsetDevice);
            matrix.rotateZ(- this.alphaOffsetScreen);
            euler.setFromRotationMatrix(matrix);

            if (euler.alpha < 0) {
                euler.alpha += 360;
            }

            euler.alpha %= 360;

            adjustedAlpha -= euler.alpha;
        }

        euler.set(
            adjustedAlpha,
            orientationData.beta || 0,
            orientationData.gamma || 0
        );

        quaternion.setFromEuler(euler);

        return quaternion;
    }

    getScreenAdjustedQuaternion () {
        const quaternion = this.getFixedFrameQuaternion();

        // Automatically apply screen orientation transform
        quaternion.rotateZ(- this.screenOrientationAngle);

        return quaternion;

    }

    getFixedFrameMatrix () {
        const euler = Euler.empty();
        const matrix = RotationMatrix.empty();

        const orientationData: RotationData =
            this.data || { alpha: 0, beta: 0, gamma: 0 };

        let adjustedAlpha = orientationData.alpha || 0;

        if (this.alphaOffsetDevice) {
            matrix.setFromEuler(this.alphaOffsetDevice);
            matrix.rotateZ(- this.alphaOffsetScreen);
            euler.setFromRotationMatrix(matrix);

            if (euler.alpha < 0) {
                euler.alpha += 360;
            }

            euler.alpha %= 360;

            adjustedAlpha -= euler.alpha;
        }

        euler.set(
            adjustedAlpha,
            orientationData.beta || 0,
            orientationData.gamma || 0
        );

        matrix.setFromEuler(euler);

        return matrix;
    };

    getScreenAdjustedMatrix () {
            const matrix = this.getFixedFrameMatrix();

            // Automatically apply screen orientation transform
            matrix.rotateZ(- this.screenOrientationAngle);

            return matrix;
    }

    getFixedFrameEuler () {
        const euler = Euler.empty();

        euler.setFromRotationMatrix(
            this.getFixedFrameMatrix()
        );

        return euler;
    }

    getScreenAdjustedEuler() {
        const euler = Euler.empty();

        euler.setFromRotationMatrix(
            this.getScreenAdjustedMatrix()
        );

        return euler;
    }

    isAbsolute() {
        return (this.data && this.data.absolute === true) || false;
    }

    getLastRawEventData() {
        return this.data || {};
    }
}