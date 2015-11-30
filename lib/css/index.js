/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * The factory function for the `phosphide:css:main` extension point.
 *
 * The extension point accepts only `config` inputs, which can
 * contain `path: string` or `paths: string[]` fields.
 * The path(s) must be fully qualified (e.g. `foo/lib/index.css`).
 */
function createCSSReceiver() {
    return {
        add: function (extension) {
            var paths = [];
            if (extension.config &&
                extension.config.path &&
                extension.config.hasOwnProperty('path')) {
                paths.push(extension.config.path);
            }
            if (extension.config &&
                extension.config.paths &&
                extension.config.hasOwnProperty('paths')) {
                paths.push(extension.config.paths);
            }
            paths.forEach(function (path) {
                System.normalize(path).then(function (newPath) {
                    // handle steal.js path normalization artifact
                    newPath = newPath.replace('!$css', '');
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = newPath;
                    document.head.appendChild(link);
                    cssRegistry.set(extension.id, link.href);
                });
            });
        },
        remove: function (id) {
            var path = cssRegistry.get(id);
            if (path) {
                removeCSS(path);
                cssRegistry.delete(id);
            }
        },
        dispose: function () {
            cssRegistry.forEach(removeCSS);
            cssRegistry = new Map();
        }
    };
}
exports.createCSSReceiver = createCSSReceiver;
/**
 * Remove CSS from the DOM by `href`.
 */
function removeCSS(href) {
    var nodes = document.getElementsByTagName('link');
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].href === href) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    }
}
// Mapping of extension ids to link `href`.
var cssRegistry = new Map();
