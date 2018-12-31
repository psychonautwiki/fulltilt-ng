export type AccelerometerData = {
    x: number,
    y: number,
    z: number
};

export type RotationData = {
    alpha: number,
    beta: number,
    gamma: number,
    absolute?: boolean
};

export type DeviceMotionData = {
    acceleration: AccelerometerData,
    accelerationIncludingGravity: AccelerometerData,
    rotationRate: RotationData
};

// i.e. [ 0, 1, 0 ]
export type RotationAxis = [
    number, number, number
];