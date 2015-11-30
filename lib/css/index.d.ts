import { IReceiver } from 'phosphor-plugins';
/**
 * The interface for `phosphide:css` extension point.
 */
export interface IPhosphideCSS {
    /**
     * Fully qualified path to the css file (e.g. `foo/lib/index.css`).
     */
    path: string;
}
/**
 * The factory function for the `phosphide:css:main` extension point.
 */
export declare function createCSSReceiver(): IReceiver;
