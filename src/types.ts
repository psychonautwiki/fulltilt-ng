export type AccelerometerData = {
    x: number;
    y: number;
    z: number;
};

export type RotationData = {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    absolute?: boolean | null;
};

export type DeviceMotionData = {
    acceleration: AccelerometerData | null;
    accelerationIncludingGravity: AccelerometerData | null;
    rotationRate: RotationData | null;
    interval: number | null;
};

// i.e. [ 0, 1, 0 ]
export type RotationAxis = [
    number, number, number
];