import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const BUILD_DIR = path.resolve(here, '..');
export const ROOT = path.resolve(BUILD_DIR, '../..');
export const ASSETS_DIR = path.join(ROOT, 'packages/assets');
export const DIST = path.join(BUILD_DIR, 'dist');
export const REACT_GEN = path.join(ROOT, 'packages/react/src/generated');
