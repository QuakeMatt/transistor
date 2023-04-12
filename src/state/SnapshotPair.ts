import { Snapshot } from "./Snapshot";

export interface SnapshotPair {
    readonly start: Snapshot;
    readonly end: Snapshot;
}

export function createSnapshotPair(start: Snapshot, end: Snapshot): SnapshotPair {
    return {
        start,
        end,
    };
}
