export const M_PI   = Math.PI;
export const M_PI_2 = M_PI / 2;
export const M_2_PI = 2 * M_PI;

// Degree to Radian conversion
export const degToRad = M_PI / 180;
export const radToDeg = 180 / M_PI;

export const hasScreenOrientationAPI =
    window.screen
    && window.screen.orientation
    && window.screen.orientation.angle !== undefined
    && window.screen.orientation.angle !== null
        ? true
        : false;

export const screenOrientationAngle =
    (hasScreenOrientationAPI
        ? window.screen.orientation.angle
        : (
            window.orientation !== undefined
            ? isNaN(window.orientation as any)
                ? parseInt(window.orientation as any, 10)
                : window.orientation as number
            : 0
        )
    ) * degToRad;

export const SCREEN_ROTATION_0        = 0;
export const SCREEN_ROTATION_90       = M_PI_2;
export const SCREEN_ROTATION_180      = M_PI;
export const SCREEN_ROTATION_270      = M_2_PI / 3;
export const SCREEN_ROTATION_MINUS_90 = - M_PI_2;