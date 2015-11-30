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
 * The path(s) must be fully qualified (e.g. `foo/lib/index.css`).
 */
export
function createCSSReceiver(): IReceiver {
  return {
    add: (extension: IExtension) => {
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
        System.normalize(path).then(newPath => {
          newPath = newPath.replace('!$css', '');
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = newPath;
          document.head.appendChild(link);
          cssRegistry.set(extension.id, link.href);
        });
      });
    },
    remove: (id: string) => {
      let path = cssRegistry.get(id);
      if (path) {
        removeCSS(path);
        cssRegistry.delete(id);
      }
    },
    dispose: () => {
      cssRegistry.forEach(removeCSS);
      cssRegistry = new Map<string, string>();
    }
  }
}


/**
 * Remove CSS from the DOM by `href` path.
 */
function removeCSS(path: string): void {
  var nodes = document.getElementsByTagName('link');
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].href === path) {
      nodes[i].parentNode.removeChild(nodes[i]);
    }
  }
}


// css registry
var cssRegistry = new Map<string, string>();
