import {
    AccelerometerData,
    RotationData,
    DeviceMotionData
} from './types';

import {
    hasScreenOrientationAPI,
    screenOrientationAngle,
    SCREEN_ROTATION_90,
    SCREEN_ROTATION_180,
    SCREEN_ROTATION_270,
    SCREEN_ROTATION_MINUS_90,
    degToRad
} from './constants';

export class DeviceMotion {
    data: DeviceMotionData | null;

    private active: boolean;
    private screenOrientationAngle: number;

    private _callbacks: ((event: DeviceMotionEvent) => void)[];

    constructor() {
        this.active = false;
        this.data = null;
        this._callbacks = [];

        // initial value
        this.screenOrientationAngle = screenOrientationAngle;
    }

    private handleDeviceMotionChange = (event: DeviceMotionEvent & DeviceMotionData) => {
        this.data = event;

        this._callbacks.forEach(callback =>
            callback(event)
        );
    }

    private handleScreenOrientationChange = () => {
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

    start ( callback = () => {} ) {
        if ( callback && typeof callback === 'function' ) {
            this._callbacks.push( callback );
        }

        if ( this.active ) {
            return;
        }

        if ( this.screenOrientationAngle ) {
            window.screen.orientation.addEventListener( 'change', this.handleScreenOrientationChange, false );
        } else {
            window.addEventListener( 'orientationchange', this.handleScreenOrientationChange, false );
        }

        window.addEventListener( 'devicemotion', this.handleDeviceMotionChange, false );

        this.active = true;
    }

    stop () {
        if ( !this.active ) {
            return;
        }

        window.removeEventListener( 'devicemotion', this.handleDeviceMotionChange, false );

        this.active = false;
    }

    listen ( callback = () => {} ) {
        this.start( callback );
    }

    getScreenAdjustedAcceleration () {
        const accData: AccelerometerData =
            this.data
                && this.data.acceleration
                    ? this.data.acceleration
                    : { x: 0, y: 0, z: 0 };

        const screenAccData: AccelerometerData = {
            x: 0,
            y: 0,
            z: 0
        };

        switch ( this.screenOrientationAngle ) {
            case SCREEN_ROTATION_90:
                screenAccData.x = - accData.y;
                screenAccData.y =   accData.x;
                break;
            case SCREEN_ROTATION_180:
                screenAccData.x = - accData.x;
                screenAccData.y = - accData.y;
                break;
            case SCREEN_ROTATION_270:
            case SCREEN_ROTATION_MINUS_90:
                screenAccData.x =   accData.y;
                screenAccData.y = - accData.x;
                break;
            default: // SCREEN_ROTATION_0
                screenAccData.x =   accData.x;
                screenAccData.y =   accData.y;
                break;
        }

        screenAccData.z = accData.z;

        return screenAccData;
    }

    getScreenAdjustedAccelerationIncludingGravity () {
        const accGData: AccelerometerData =
            this.data
                && this.data.accelerationIncludingGravity
                    ? this.data.accelerationIncludingGravity
                    : { x: 0, y: 0, z: 0 };

        const screenAccGData: AccelerometerData = {
            x: 0,
            y: 0,
            z: 0
        };

        switch ( this.screenOrientationAngle ) {
            case SCREEN_ROTATION_90:
                screenAccGData.x = - accGData.y;
                screenAccGData.y =   accGData.x;
                break;
            case SCREEN_ROTATION_180:
                screenAccGData.x = - accGData.x;
                screenAccGData.y = - accGData.y;
                break;
            case SCREEN_ROTATION_270:
            case SCREEN_ROTATION_MINUS_90:
                screenAccGData.x =   accGData.y;
                screenAccGData.y = - accGData.x;
                break;
            default: // SCREEN_ROTATION_0
                screenAccGData.x =   accGData.x;
                screenAccGData.y =   accGData.y;
                break;
        }

        screenAccGData.z = accGData.z;

        return screenAccGData;
    }

    getScreenAdjustedRotationRate () {
        const rotRateData: RotationData =
            this.data
            && this.data.rotationRate
                ? this.data.rotationRate
                : { alpha: 0, beta: 0, gamma: 0 };

        const screenRotRateData: RotationData = {
            alpha: 0,
            beta: 0,
            gamma: 0
        };

        const rotAlpha = rotRateData.alpha || 0;
        const rotBeta = rotRateData.beta || 0;
        const rotGamma = rotRateData.gamma || 0;

        switch ( this.screenOrientationAngle ) {
            case SCREEN_ROTATION_90:
                screenRotRateData.beta  = - rotGamma;
                screenRotRateData.gamma =   rotBeta;
                break;
            case SCREEN_ROTATION_180:
                screenRotRateData.beta  = - rotBeta;
                screenRotRateData.gamma = - rotGamma;
                break;
            case SCREEN_ROTATION_270:
            case SCREEN_ROTATION_MINUS_90:
                screenRotRateData.beta  =   rotGamma;
                screenRotRateData.gamma = - rotBeta;
                break;
            default: // SCREEN_ROTATION_0
                screenRotRateData.beta  =   rotBeta;
                screenRotRateData.gamma =   rotGamma;
                break;
        }

        screenRotRateData.alpha = rotAlpha;

        return screenRotRateData;
    }

    getLastRawEventData () {
        return this.data || {};
    }
}
