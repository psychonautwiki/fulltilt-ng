export declare type AccelerometerData = {
    x: number;
    y: number;
    z: number;
};
export declare type RotationData = {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    absolute?: boolean | null;
};
export declare type DeviceMotionData = {
    acceleration: AccelerometerData | null;
    accelerationIncludingGravity: AccelerometerData | null;
    rotationRate: RotationData | null;
    interval: number | null;
};
export declare type RotationAxis = [number, number, number];
