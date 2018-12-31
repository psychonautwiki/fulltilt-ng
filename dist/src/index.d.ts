import { DeviceOrientation, DeviceOrientationOptions } from './deviceOrientation';
import { DeviceMotion } from './deviceMotion';
export declare class FULLTILT {
    static version: string;
    static getDeviceOrientation(options: DeviceOrientationOptions): Promise<DeviceOrientation>;
    static getDeviceMotion(): Promise<DeviceMotion>;
}
