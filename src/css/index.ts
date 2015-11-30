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
 * The interface for `phosphide:css` extension point.
 */
export
interface IPhosphideCSS {
  /**
   * Fully qualified path to the css file (e.g. `foo/lib/index.css`).
   */
  path: string;
}


/**
 * The factory function for the `phosphide:css:main` extension point.
 */
export
function createCSSReceiver(): IReceiver {
  return {
    add: function(extension: IExtension) {
      let path = '';
      if (extension.item &&
          extension.item.path &&
          extension.item.hasOwnProperty('path')) {
        path = extension.item.path;
      } else if (extension.config &&
                 extension.config.path &&
                 extension.config.hasOwnProperty('path')) {
        path = extension.config.path;
      } else if (extension.data &&
                 extension.data.path &&
                 extension.data.hasOwnProperty('path')) {
        path = extension.data.path;
      }
      if (path) {
        System.normalize(path).then(function(newPath) {
          newPath = newPath.replace('!$css', '');
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = newPath;
          document.head.appendChild(link);
          cssRegistry.set(extension.id, link.href);
        });
      }
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
