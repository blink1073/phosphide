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
 * The path is the relative path from the plugin root.
 */
function createCSSReceiver() {
    var _this = this;
    return {
        isDisposed: false,
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
                var fullPath = extension.plugin + "/" + path;
                System.normalize(fullPath).then(function (normPath) {
                    // handle steal.js path normalization artifact
                    normPath = normPath.replace('!$css', '');
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = normPath;
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
            _this.isDisposed = true;
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
