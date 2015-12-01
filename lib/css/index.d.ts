import { IReceiver } from 'phosphor-plugins';
/**
 * The factory function for the `phosphide:css:main` extension point.
 *
 * The extension point accepts only `config` inputs, which can
 * contain `path: string` or `paths: string[]` fields.
 * The path is the relative path from the plugin root.
 */
export declare function createCSSReceiver(): IReceiver;
