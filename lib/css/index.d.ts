import { IReceiver } from 'phosphor-plugins';
/**
 * The factory function for the `phosphide:css:main` extension point.
 *
 * The extension point accepts only `config` inputs, which can
 * contain `path: string` or `paths: string[]` fields.
 * The path(s) must be fully qualified (e.g. `foo/lib/index.css`).
 */
export declare function createCSSReceiver(): IReceiver;
