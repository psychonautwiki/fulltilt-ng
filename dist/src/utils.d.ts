import { DeviceMotion } from "./deviceMotion";
import { DeviceOrientation } from "./deviceOrientation";
export declare function sign(orig_x: number): number;
export declare function sensorCheck(sensor: DeviceMotion | DeviceOrientation): Promise<void>;
