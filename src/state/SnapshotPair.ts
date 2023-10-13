import { Snapshot } from "./Snapshot";

/**
 * ...
 */
export class SnapshotPair {

    /**
     * ...
     */
    public readonly start: Snapshot;

    /**
     * ...
     */
    public readonly end: Snapshot;

    /**
     * ...
     * @param start ...
     * @param end ...
     */
    constructor(start: Snapshot, end: Snapshot) {
        this.start = start;
        this.end = end;
    }

}
