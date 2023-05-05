interface Delta {}
interface Easing {}
interface Rectangle {}

interface State {
    element: Element;
    parent: Element | undefined;
    rectangle: Rectangle | undefined;
    opacity: number;
    display: string;
}

interface Motion {
    readonly element: Element;
    readonly easing: Easing;
    readonly delta: Delta;

    readonly promise: Promise<Motion>;

    apply(delta: Delta, time: DOMHighResTimeStamp): boolean;
    done(completed: boolean): void;
}

// What's needed to animate a tween?
//   - apply()
//   - promise.then()
//   - done()

// What's needed to create a tween?
//   - element
//   - easing
//   - delta

// What's needed to compute a delta?
//   - start relative rectange
//   - end relative rectange
//   - start state
//   - end state

// What's needed to reframe a tween?
//   - current parent ??
//   - new parent
//   - start snapshot
//   - end snapshot

// What's needed for last-known states?
//   - end relative rectangle

class Tween implements Motion {}
class Bounce implements Motion {} // formerly known as a pulse


// ---


interface Solution {
    readonly promise: Promise<Solution>;
}

interface Solver {
    solve(): Solution;
}
