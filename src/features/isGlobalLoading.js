// src/selectors/isGlobalLoading.ts
import { RootState } from "../app/store";

/**
 * Returns true if *any* slice in the Redux tree has `loading === true`
 */
export const isGlobalLoading = (state) =>
  Object.values(state).some(
    // slice must be an object that exposes a boolean `loading`
    (slice) => slice && typeof slice.loading === "boolean" && slice.loading
  );
