// Convert the previous web-only loader to the app's React Native version
// and re-export it so imports stay consistent across the codebase.
export { default } from './GlobalPreloader';
export type { default as GlobalPreloader } from './GlobalPreloader';
