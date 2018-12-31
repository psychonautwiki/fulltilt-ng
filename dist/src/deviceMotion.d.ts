import { AccelerometerData, RotationData, DeviceMotionData } from './types';
export declare class DeviceMotion {
    data: DeviceMotionData | null;
    private active;
    private screenOrientationAngle;
    private _callbacks;
    constructor();
    handleDeviceMotionChange: (event: DeviceMotionEvent & DeviceMotionData) => void;
    handleScreenOrientationChange: () => void;
    start(callback?: () => void): void;
    stop(): void;
    listen(callback?: () => void): void;
    getScreenAdjustedAcceleration(): AccelerometerData;
    getScreenAdjustedAccelerationIncludingGravity(): AccelerometerData;
    getScreenAdjustedRotationRate(): RotationData;
    getLastRawEventData(): {};
}
