//
//  Asynchronous module definitions
var queue = [], map = queue.map, some = queue.some, hasOwnProperty = queue.hasOwnProperty;

const isAbsolute = new RegExp('^([a-z]+://|//)');
const libs = new Map;
const modules = new Map;


function urlIsAbsolute (url) {
    return typeof url === 'string' && isAbsolute.test(url);
}


export const require = requireFrom(name => {
    var nameUrl = libs.get(name) || name;
    if (nameUrl.local) return nameUrl.url;
    if (urlIsAbsolute(nameUrl)) return nameUrl;
    return `https://unpkg.com/${name}`;
});


export function requireFrom(source) {

    function load (name) {
        var url = source(name + ""), module = modules.get(url);
        if (!module) modules.set(url, module = new Promise(function(resolve, reject) {
            var script = document.createElement("script");
            script.onload = function() {
                if (queue.length !== 1) return reject(new Error("invalid module"));
                resolve(queue.pop()(load));
            };
            script.onerror = function() {
                reject(new Error("unable to load module"));
            };
            script.async = true;
            script.src = url;
            window.define = define;
            document.head.appendChild(script);
        }));
        return module;
    }

    function require (name) {
        return arguments.length > 1 ? Promise.all(map.call(arguments, load)).then(merge) : load(name);
    }

    require.libs = libs;
    require.modules = modules;

    require.local = function (name, url) {
        libs.set(name, {
            local: true,
            url: url
        });
    };

    return require;
}

function merge(modules) {
  var o = {}, i = -1, n = modules.length, m, k;
  while (++i < n) {
    for (k in (m = modules[i])) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
        else o[k] = m[k];
      }
    }
  }
  return o;
}

function getter(object, name) {
  return function() { return object[name]; };
}

function isexports(name) {
  return (name + "") === "exports";
}

function define(name, dependencies, factory) {
  if (arguments.length < 3) factory = dependencies, dependencies = name;
  if (arguments.length < 2) factory = dependencies, dependencies = [];
  queue.push(some.call(dependencies, isexports) ? function(require) {
    var exports = {};
    return Promise.all(map.call(dependencies, function(name) {
      return isexports(name += "") ? exports : require(name);
    })).then(function(dependencies) {
      factory.apply(null, dependencies);
      return exports;
    });
  } : function(require) {
    return Promise.all(map.call(dependencies, require)).then(function(dependencies) {
      return typeof factory === "function" ? factory.apply(null, dependencies) : factory;
    });
  });
}

define.amd = {};
