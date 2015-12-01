/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IExtension, IReceiver
} from 'phosphor-plugins';


/**
 * The factory function for the `phosphide:css:main` extension point.
 *
 * The extension point accepts only `config` inputs, which can
 * contain `path: string` or `paths: string[]` fields.
 * The path is the relative path from the plugin root.
 */
export
function createCSSReceiver(): IReceiver {
  return {
    isDisposed: false,
    add: function(extension: IExtension) {
      let paths: string[] = [];
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
      paths.forEach(path => {
        let fullPath = `${extension.plugin}/${path}`;
        System.normalize(fullPath).then(normPath => {
          // handle steal.js path normalization artifact
          normPath = normPath.replace('!$css', '');
          let link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = normPath;
          document.head.appendChild(link);
          cssRegistry.set(extension.id, link.href);
        });
      });
    },
    remove: function(id: string) {
      let path = cssRegistry.get(id);
      if (path) {
        removeCSS(path);
        cssRegistry.delete(id);
      }
    },
    dispose: function() {
      cssRegistry.forEach(removeCSS);
      cssRegistry = new Map<string, string>();
      this.isDisposed = true;
    }
  }
}


/**
 * Remove CSS from the DOM by `href`.
 */
function removeCSS(href: string): void {
  let nodes = document.getElementsByTagName('link');
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].href === href) {
      nodes[i].parentNode.removeChild(nodes[i]);
    }
  }
}


// Mapping of extension ids to link `href`.
var cssRegistry = new Map<string, string>();
