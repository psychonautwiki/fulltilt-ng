import { RotationData } from './types';
import { RotationMatrix } from './rotationMatrix';
import { Quaternion } from './quaternion';
import { Euler } from './euler';
export declare type DeviceOrientationOptions = {
    type: 'game' | 'world';
};
export declare class DeviceOrientation {
    static ALPHA: 'alpha';
    static BETA: 'beta';
    static GAMMA: 'gamma';
    data: RotationData | null;
    private active;
    private options;
    private alphaOffsetDevice;
    private alphaOffsetScreen;
    private screenOrientationAngle;
    private _callbacks;
    constructor(options: DeviceOrientationOptions);
    _init(): void;
    handleDeviceOrientationChange: (event: DeviceOrientationEvent) => void;
    handleScreenOrientationChange: () => void;
    start(callback?: () => void): void;
    stop(): void;
    listen(callback?: () => void): void;
    getFixedFrameQuaternion(): Quaternion;
    getScreenAdjustedQuaternion(): Quaternion;
    getFixedFrameMatrix(): RotationMatrix;
    getScreenAdjustedMatrix(): RotationMatrix;
    getFixedFrameEuler(): Euler;
    getScreenAdjustedEuler(): Euler;
    isAbsolute(): boolean;
    getLastRawEventData(): {};
}
