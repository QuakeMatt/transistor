interface Rectangle {}

interface Snapshot {
    rectangle: Rectangle;
    parent: Rectangle;

    display: string;
    opacity: number;
    transform: Rectangle;
}

interface Tween {
    startSnaptshot: Snapshot;
    endSnapshot: Snapshot;

    startTime: number;
    options: TweenOptions;
}

interface TweenOptions {
    easing: Function;
    delay: number;
    duration: number;

    // transform_easing: Function;
    // transform_delay: number;
    // transform_duration: number;

    // transform_x_easing: Function;
    // transform_x_delay: number;
    // transform_x_duration: number;

    // transform_y_easing: Function;
    // transform_y_delay: number;
    // transform_y_duration: number;

    // scale_easing: Function;
    // scale_delay: number;
    // scale_duration: number;

    // scale_x_easing: Function;
    // scale_x_delay: number;
    // scale_x_duration: number;

    // scale_y_easing: Function;
    // scale_y_delay: number;
    // scale_y_duration: number;
}
