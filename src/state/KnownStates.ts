import { MutableSnapshot, createMutableSnapshot } from "./Snapshot";

export interface KnownStates extends MutableSnapshot {}

export const createKnownStates: () => KnownStates = createMutableSnapshot;
