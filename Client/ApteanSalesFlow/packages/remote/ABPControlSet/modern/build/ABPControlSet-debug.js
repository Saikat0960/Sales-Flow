var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = false;
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = descriptor;
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.Symbol = function() {
  var counter = 0;
  function Symbol(opt_description) {
    return $jscomp.SYMBOL_PREFIX + (opt_description || '') + counter++;
  }
  return Symbol;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + opt_start);
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = String(array);
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    var iteratorFunction = arrayLike[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call(opt_thisArg, next.value));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call(opt_thisArg, arrayLike[i]));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / right;
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = String(array);
    }
    var len = array.length;
    for (var i = opt_fromIndex || 0; i < len; i++) {
      if (array[i] == searchElement || Object.is(array[i], searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        delete executingBatch[i];
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_(value);
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_(value);
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, obj);
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason | '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      var callbacks = this.onSettledCallbacks_;
      for (var i = 0; i < callbacks.length; ++i) {
        callbacks[i].call();
        callbacks[i] = null;
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(function() {
        asyncExecutor.asyncExecute(callback);
      });
    }
  };
  function resolvingPromise(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  }
  PolyfillPromise['resolve'] = resolvingPromise;
  PolyfillPromise['reject'] = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise['race'] = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        resolvingPromise(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise['all'] = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return resolvingPromise([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          resolvingPromise(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  return PolyfillPromise;
}, 'es6', 'es3');
$jscomp.executeAsyncGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new NativeWeakMap([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakMap;
  }
  var prop = '$jscomp_hidden_' + Math.random().toString().substring(2);
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.polyfill('Map', function(NativeMap) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_MAP && function() {
    if (!NativeMap || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = NativeMap;
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeMap;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return entry && entry.value;
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call(opt_thisArg, entry[1], entry[0], this);
    }
  };
  PolyfillMap.prototype[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = obj;
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.assign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, var_args) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (!source) {
        continue;
      }
      for (var key in source) {
        if ($jscomp.owns(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.underscoreProtoCanBeSet = function() {
  var x = {a:true};
  var y = {};
  try {
    y.__proto__ = x;
    return y.a;
  } catch (e) {
  }
  return false;
};
$jscomp.setPrototypeOf = typeof Object.setPrototypeOf == 'function' ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(target, proto) {
  target.__proto__ = proto;
  if (target.__proto__ !== proto) {
    throw new TypeError(target + ' is not extensible');
  }
  return target;
} : null;
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  return orig || $jscomp.setPrototypeOf;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || typeof Object.create == 'function' ? Object.create : function(prototype) {
  var ctor = function() {
  };
  ctor.prototype = prototype;
  return new ctor;
};
$jscomp.construct = function() {
  function reflectConstructWorks() {
    function Base() {
    }
    function Derived() {
    }
    new Base;
    Reflect.construct(Base, [], Derived);
    return new Base instanceof Base;
  }
  if (typeof Reflect != 'undefined' && Reflect.construct) {
    if (reflectConstructWorks()) {
      return Reflect.construct;
    }
    var brokenConstruct = Reflect.construct;
    var patchedConstruct = function(target, argList, opt_newTarget) {
      var out = brokenConstruct(target, argList);
      if (opt_newTarget) {
        Reflect.setPrototypeOf(out, opt_newTarget.prototype);
      }
      return out;
    };
    return patchedConstruct;
  }
  function construct(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = $jscomp.objectCreate(proto);
    var apply = Function.prototype.apply;
    var out = apply.call(target, obj, argList);
    return out || obj;
  }
  return construct;
}();
$jscomp.polyfill('Reflect.construct', function(orig) {
  return $jscomp.construct;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if ($jscomp.ASSUME_ES5 || typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (!($jscomp.ASSUME_ES5 || typeof Object.preventExtensions == 'function')) {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  } else {
    if ($jscomp.setPrototypeOf) {
      var setPrototypeOf = $jscomp.setPrototypeOf;
      var polyfill = function(target, proto) {
        try {
          setPrototypeOf(target, proto);
          return true;
        } catch (e) {
          return false;
        }
      };
      return polyfill;
    } else {
      return null;
    }
  }
}, 'es6', 'es5');
$jscomp.polyfill('Set', function(NativeSet) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_SET && function() {
    if (!NativeSet || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = NativeSet;
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeSet;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  PolyfillSet.prototype[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call(opt_thisArg, value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = $jscomp.objectCreate(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
  if ($jscomp.setPrototypeOf) {
    var setPrototypeOf = $jscomp.setPrototypeOf;
    setPrototypeOf(childCtor, parentCtor);
  } else {
    for (var p in parentCtor) {
      if (p == 'prototype') {
        continue;
      }
      if (Object.defineProperties) {
        var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
        if (descriptor) {
          Object.defineProperty(childCtor, p, descriptor);
        }
      } else {
        childCtor[p] = parentCtor[p];
      }
    }
  }
  childCtor.superClass_ = parentCtor.prototype;
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new NativeWeakSet([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakSet;
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('Overrides.Button', {override:'Ext.Button', initialize:function() {
  this.__configureClassNames();
  this.callParent();
}, privates:{__configureClassNames:function(config) {
  var hasIcon = this.iconCls && this.iconCls.length > 0 ? true : false;
  var hasText = this.text && this.text.length > 0 ? true : false;
  var hasMenu = this.menu ? true : false;
  if (hasIcon) {
    this.addCls('icon');
  }
  if (hasText) {
    this.addCls('text');
  }
  if (hasMenu) {
    this.addCls('menu');
  }
}}});
Ext.define('Ext.panel.Collapsible', {override:'Ext.Panel', config:{collapsed:null, collapsible:null}, hasCollapsible:true, defaultCollapserCls:'Ext.panel.Collapser', doDestroy:function() {
  this.setCollapsible(null);
  this.callParent();
}, collapse:function(animation) {
  return this.getCollapsible().collapse(animation);
}, expand:function(animation) {
  return this.getCollapsible().expand(animation);
}, toggleCollapsed:function(collapsed, animation) {
  return this.getCollapsible().toggleCollapsed(collapsed, animation);
}, getCollapsed:function() {
  var collapsible = this.getCollapsible();
  return collapsible ? collapsible.getCollapsed() : false;
}, updateCollapsed:function(collapsed) {
  var collapsible = this.getCollapsible();
  if (collapsible) {
    collapsible.setCollapsed(collapsed);
  }
}, applyCollapsible:function(collapsible, collapser) {
  if (collapsible === true) {
    collapsible = {direction:this.getHeaderPosition()};
  } else {
    if (typeof collapsible === 'string') {
      collapsible = {direction:collapsible};
    } else {
      if (!collapsible) {
        return null;
      }
    }
  }
  if (collapser) {
    collapser.setConfig(collapsible);
  } else {
    collapsible = Ext.apply({xclass:this.defaultCollapserCls, target:this}, collapsible);
    collapser = Ext.create(collapsible);
  }
  return collapser;
}, updateCollapsible:function(collapsible, oldCollapsible) {
  if (oldCollapsible) {
    if (!this.destroying) {
      oldCollapsible.doExpandCollapse(false);
    }
    oldCollapsible.destroy();
  }
  if (collapsible && this.rendered) {
    this.initCollapsible(collapsible);
  }
}, updateHeader:function(header, oldHeader) {
  var collapsible = this.getCollapsible();
  this.callParent([header, oldHeader]);
  if (this.isConfiguring && collapsible) {
    collapsible.toggleCollapsed(collapsible.getCollapsed(), false);
  }
}, updateHeaderPosition:function(headerPosition, oldHeaderPosition) {
  var collapsible = this.getCollapsible();
  if (collapsible && collapsible.getCollapsed()) {
    headerPosition = collapsible.getDirection();
  }
  this.moveHeaderPosition(headerPosition, oldHeaderPosition);
}, privates:{initCollapsible:function(collapsible) {
  this.ensureHeader();
  collapsible.initialize();
}, onCollapsibleRendered:function() {
  var collapsible = this.getCollapsible();
  if (collapsible) {
    this.initCollapsible(collapsible);
  }
}, reattachBodyWrap:function() {
  var me = this, header = me._header, el = me.maxHeightElement || me.element, bodyWrap = me.bodyWrapElement;
  if (bodyWrap.parent() !== el) {
    if (header) {
      bodyWrap.insertAfter(header.element);
    } else {
      el.insertFirst(bodyWrap);
    }
  }
}}});
Ext.define('Overrides.field.Number', {override:'Ext.field.Number', allowThousandSeparator:false, thousandSeparator:null, initialize:function() {
  var me = this;
  if (me.allowThousandSeparator) {
    me.thousandSeparator = me.thousandSeparator ? me.thousandSeparator : Ext.util.Format.thousandSeparator;
  }
  me.callParent();
}, updateDecimals:function(decimals) {
  var me = this, format = me.allowThousandSeparator ? '0,0' : '0', zeroChar = me.getTrim() ? '#' : '0', value;
  if (me.formatString) {
    format = me.formatString;
  } else {
    if (decimals) {
      if (me.allowThousandSeparator) {
        format += '.' + Ext.String.repeat('0', decimals);
      } else {
        format += '.' + Ext.String.repeat(zeroChar, decimals);
      }
    }
  }
  me.numberFormat = format;
  if (!me.isConfiguring) {
    value = me.getValue();
    if (Ext.isDate(value)) {
      me.setInputValue(value);
    }
  }
}});
Ext.define('Overrides.menu.Menu', {override:'Ext.menu.Menu', initialize:function() {
  this.callParent();
  this.mon(this, 'show', this.__addIconClass);
}, privates:{__addIconClass:function() {
  var hasIcons = false, items = this.getInnerItems(), i = 0, l = items.length;
  for (i; i < l; i++) {
    var item = items[i];
    if (item.baseCls === 'x-menuitem' && item.getIconCls() || item.baseCls === 'x-menucheckitem' && item.hasOwnProperty('checkboxElement')) {
      i = l;
      hasIcons = true;
    }
  }
  if (!hasIcons) {
    this.addCls('no-icons');
  }
}}});
Ext.define('Ext.data.validator.Time', {extend:'Ext.data.validator.AbstractDate', alias:'data.validator.time', type:'time', isTimeValidator:true, message:'Is not a valid time', privates:{getDefaultFormat:function() {
  return Ext.Date.defaultTimeFormat;
}}});
Ext.define('Ext.field.trigger.Time', {extend:'Ext.field.trigger.Expand', xtype:'timetrigger', alias:'trigger.time', classCls:Ext.baseCSSPrefix + 'timetrigger'});
Ext.define('Ext.panel.TimeHeader', {extend:'Ext.Component', xtype:'analogtimeheader', classCls:Ext.baseCSSPrefix + 'analogtimeheader', config:{position:null}, template:[{reference:'headerEl', cls:Ext.baseCSSPrefix + 'header-el', children:[{reference:'timeEl', cls:Ext.baseCSSPrefix + 'time-wrapper-el', children:[{cls:Ext.baseCSSPrefix + 'time-el ' + Ext.baseCSSPrefix + 'hour-el', reference:'hoursEl', listeners:{click:'onHoursClick'}}, {cls:Ext.baseCSSPrefix + 'time-el', html:':'}, {cls:Ext.baseCSSPrefix + 
'time-el ' + Ext.baseCSSPrefix + 'minute-el', reference:'minutesEl', listeners:{click:'onMinutesClick'}}]}, {reference:'meridiemEl', cls:Ext.baseCSSPrefix + 'meridiem-wrapper-el', children:[{cls:Ext.baseCSSPrefix + 'am-el ' + Ext.baseCSSPrefix + 'meridiem-el', reference:'amEl', html:'AM', listeners:{click:'onAmClick'}}, {cls:Ext.baseCSSPrefix + 'pm-el ' + Ext.baseCSSPrefix + 'meridiem-el', reference:'pmEl', html:'PM', listeners:{click:'onPmClick'}}]}]}], onHoursClick:function(e) {
  this.ownerCmp.onHoursClick(e);
}, onMinutesClick:function(e) {
  this.ownerCmp.onMinutesClick(e);
}, onAmClick:function(e) {
  this.ownerCmp.onAmClick(e);
}, onPmClick:function(e) {
  this.ownerCmp.onPmClick(e);
}});
Ext.define('Ext.panel.TimeView', {extend:'Ext.Panel', xtype:'analogtime', requires:['Ext.panel.TimeHeader'], config:{value:'now', autoAdvance:true, vertical:true, confirmable:false, confirmHandler:null, declineHandler:null, scope:'this', buttonAlign:'right', defaultButtons:{ok:'up.onConfirm', cancel:'up.onDecline'}, mode:'hour'}, platformConfig:{'phone || tablet':{vertical:'auto'}}, classCls:Ext.baseCSSPrefix + 'analogtime', dotIndicatorCls:Ext.baseCSSPrefix + 'analog-picker-dot-indicator', animationTimeDelay:200, 
initDate:'1/1/1970', header:{xtype:'analogtimeheader'}, listeners:{painted:'onPainted', scope:'this'}, MAX_MINUTES:24 * 60 + 59, getTemplate:function() {
  var template = this.callParent(), child = template[0].children[0];
  child.children = [{reference:'pickerWrapEl', cls:Ext.baseCSSPrefix + 'picker-wrap-el', children:[{cls:Ext.baseCSSPrefix + 'analog-picker-el', reference:'analogPickerEl', children:[{cls:Ext.baseCSSPrefix + 'analog-picker-hand-el', reference:'handEl'}, {cls:Ext.baseCSSPrefix + 'analog-picker-face-el', reference:'faceEl'}], listeners:{mousedown:'onFaceMouseDown', mouseup:'onFaceMouseUp'}}]}];
  return template;
}, activateHours:function(value, options) {
  var me = this, header = me.getHeader(), am = this.getAm(), hoursEl = header.hoursEl, minutesEl = header.minutesEl, hours = me.getHours();
  me.setMode('hour');
  value = value != null ? value : (hours >= 12 ? hours - 12 : hours) + (!am ? 12 : 0);
  hoursEl.addCls('active');
  minutesEl.removeCls('active');
  me.setHours(value, options);
}, activateMinutes:function(value, options) {
  var me = this, header = me.getHeader(), hoursEl = header.hoursEl, minutesEl = header.minutesEl;
  me.setMode('minute');
  value = value != null ? value : me.getMinutes();
  minutesEl.addCls('active');
  hoursEl.removeCls('active');
  me.setMinutes(value, options);
}, applyValue:function(value) {
  var now;
  if (Ext.isDate(value)) {
    value = value.getHours() * 60 + value.getMinutes();
  } else {
    if (value === 'now' || !Ext.isNumber(value) || isNaN(value) || value < 0 || value > this.MAX_MINUTES) {
      now = new Date;
      value = now.getHours() * 60 + now.getMinutes();
    }
  }
  return value;
}, getAngleFromTime:function(time, type) {
  var isMinute = type !== 'hour', total = isMinute ? 60 : 12, anglePerItem = 360 / total, initialRotation = isMinute ? anglePerItem * 15 : anglePerItem * 3;
  return time * anglePerItem - initialRotation;
}, getCenter:function() {
  var me = this, center, size;
  if (!me._center) {
    me._center = center = me.analogPickerEl.getXY();
    size = me.analogPickerEl.measure();
    center[0] += Math.floor(size.width / 2);
    center[1] += Math.floor(size.height / 2);
  }
  return me._center;
}, getTimeFromAngle:function(angle) {
  var me = this, mode = me.getMode(), isMinute = mode !== 'hour', total = isMinute ? 60 : 12, anglePerItem = 360 / total, initialRotation = isMinute ? anglePerItem * 15 : anglePerItem * 3;
  angle = anglePerItem * Math.round(angle / anglePerItem);
  angle += initialRotation;
  if (angle >= 360) {
    angle -= 360;
  }
  if (!isMinute && angle === 0) {
    return total;
  } else {
    return angle / anglePerItem;
  }
}, getElementByValue:function(value) {
  var me = this, mode = this.getMode();
  value = parseInt(value);
  if (mode === 'hour' && value === 0) {
    value = 12;
  }
  if (!me.itemValueMap) {
    me.layoutFace();
  }
  return me.itemValueMap[value];
}, getHours:function() {
  var value = this.getValue();
  return Math.floor(value / 60);
}, getMinutes:function() {
  var me = this, value = me.getValue(), hour = me.getHours();
  return value != null ? value - hour * 60 : 0;
}, getAm:function() {
  var value = this.getValue(), hour = Math.floor(value / 60);
  return hour < 12;
}, layoutFace:function() {
  if (!this.rendered) {
    return;
  }
  var me = this, parent = me.getParent(), mode = me.getMode(), face = me.faceEl, pickerWidth = face.measure('w'), isMinute = mode === 'minute', type = isMinute ? 'minute' : 'hour', padding = 50, total = isMinute ? 60 : 12, i, item, itemText, rot;
  face.setHtml('');
  me.itemValueMap = {};
  for (i = 1; i <= total; i++) {
    item = Ext.Element.create();
    rot = me.getAngleFromTime(i, type);
    itemText = i;
    if (isMinute) {
      itemText = i;
      if (i % 5 !== 0) {
        item.setStyle('opacity', 0);
      }
      if (i === 60) {
        itemText = '0';
      }
      item.addCls('minute-picker-el');
    } else {
      item.addCls('hour-picker-el');
    }
    item.type = type;
    item.value = parseInt(itemText);
    item.rotation = rot;
    item.setText(isMinute ? Ext.String.leftPad(itemText, 2, '0') : itemText);
    me.itemValueMap[item.value] = item;
    item.setStyle('transform', 'rotate(' + rot + 'deg) translateX(' + (pickerWidth - padding) / 2 + 'px) rotate(' + -rot + 'deg)');
    face.appendChild(item);
  }
  if (parent && parent.isHeighted()) {
    parent.updateHeight();
  }
}, onConfirm:function(e) {
  var me = this;
  me.updateField();
  Ext.callback(me.getConfirmHandler(), me.getScope(), [me, e], 0, me);
}, onDecline:function(e) {
  var me = this;
  me.collapsePanel();
  Ext.callback(me.getDeclineHandler(), me.getScope(), [me, e], 0, me);
}, onFaceElementClick:function(target, options) {
  target = Ext.fly(target);
  if (!target) {
    return;
  }
  var me = this, am = me.getAm(), value = target.value, type = target.type;
  if (type) {
    if (type === 'hour') {
      value = am ? value : value + 12;
      value = am && value === 12 ? 0 : value;
      me.setHours(value, options);
    } else {
      me.setMinutes(value, options);
      if (!me.getConfirmable()) {
        me.updateField();
      }
    }
  }
  if (me.getAutoAdvance() && me.getMode() === 'hour') {
    me.activateMinutes(null, {delayed:true, animate:true});
  }
}, onFaceMouseDown:function(e) {
  var me = this;
  if (!me.dragging) {
    e.preventDefault();
    me.startDrag();
  }
}, onFaceMouseUp:function(e) {
  var me = this, target;
  if (e.pointerType === 'touch') {
    target = document.elementFromPoint.apply(document, e.getXY());
  } else {
    target = e.target;
  }
  me.stopDrag();
  me.onFaceElementClick(target);
}, onHoursClick:function() {
  this.activateHours(null, {animate:true});
}, onMouseMove:function(e) {
  var me = this, options = {disableAnimation:true}, mode = me.getMode(), am = me.getAm(), angle, center, point, x, y, value;
  if (me.dragging) {
    center = me.getCenter();
    point = e.getXY();
    x = point[0] - center[0];
    y = point[1] - center[1];
    angle = Math.atan2(y, x);
    angle = angle * (180 / Math.PI);
    if (y < 0) {
      angle += 360;
    }
    value = me.getTimeFromAngle(angle);
    if (mode === 'hour') {
      value = am ? value : value + 12;
      value = am && value === 12 ? 0 : value;
      me.setHours(value, options);
    } else {
      me.setMinutes(value, options);
    }
  }
}, onAmClick:function() {
  this.setAm(true);
}, onMinutesClick:function() {
  this.activateMinutes(null, {animate:true});
}, onOrientationChange:function() {
  this.setVerticalByOrientation();
}, onPainted:function() {
  var me = this;
  me.layoutFace();
  me.updateValue(me.getValue());
  me.activateHours();
}, onPmClick:function() {
  this.setAm(false);
}, setAm:function(value) {
  var me = this, current = me.getAm(), hours = me.getHours(), header = me.getHeader(), amEl = header.amEl, pmEl = header.pmEl, el = value ? amEl : pmEl;
  if (!me.hasSetAm || current !== value) {
    amEl.removeCls('active');
    pmEl.removeCls('active');
    el.addCls('active');
    me.hasSetAm = true;
  }
  if (current !== value) {
    me.setHours(hours + (value ? -12 : 12));
  }
}, setClockHand:function(options) {
  var me = this, isMinute = options.type === 'minute', currentMode = me.getMode(), mode = isMinute ? 'minute' : 'hour', value = !isMinute && options.value > 12 ? options.value - 12 : options.value, rotation = me.getAngleFromTime(value, options.type), analogPickerEl = me.analogPickerEl, handEl = me.handEl, el;
  analogPickerEl.removeCls(['animated', 'animated-delayed']);
  analogPickerEl.toggleCls(me.dotIndicatorCls, isMinute && value % 5 !== 0);
  if (currentMode !== mode) {
    this.setMode(isMinute ? 'minute' : 'hour');
  }
  el = me.getElementByValue(value);
  if (el && (!me.activeElement || me.activeElement !== el)) {
    if (me.activeElement) {
      me.activeElement.removeCls('active');
    }
    me.activeElement = el;
    if (options.disableAnimation) {
      el.addCls('active');
    } else {
      Ext.defer(function() {
        el.addCls('active');
      }, me.animationTimeDelay);
    }
  }
  if (handEl.rotation !== rotation) {
    analogPickerEl.toggleCls('animated' + (options.delayed ? '-delayed' : ''), !!options.animate);
    handEl.setStyle('transform', 'rotate(' + rotation + 'deg)');
    handEl.rotation = rotation;
  }
}, setHours:function(value, options) {
  var me = this, header = me.getHeader(), mode = me.getMode(), minutes = me.getMinutes(), displayValue = value > 12 ? value - 12 : value;
  displayValue = displayValue === 0 ? 12 : displayValue;
  header.hoursEl.setText(displayValue);
  if (mode === 'hour') {
    me.setClockHand(Ext.apply({value:value, type:'hour'}, options));
  }
  me.setValue(value * 60 + minutes);
}, setMinutes:function(value, options) {
  var me = this, header = me.getHeader(), mode = me.getMode(), hours = me.getHours();
  header.minutesEl.setText(Ext.String.leftPad(value, 2, '0'));
  if (mode === 'minute') {
    me.setClockHand(Ext.apply({value:value, type:'minute'}, options));
  }
  me.setValue(hours * 60 + value);
}, setTime:function(hour, minute, am) {
  var me = this;
  me.setHours(hour);
  me.setMinutes(minute);
  me.setAm(am);
}, startDrag:function() {
  var me = this;
  me.el.on({mousemove:'onMouseMove', scope:me});
  me.dragging = true;
}, stopDrag:function() {
  var me = this;
  me.el.un({mousemove:'onMouseMove', scope:me});
  me._center = null;
  me.dragging = false;
}, updateConfirmable:function(confirmable) {
  this.setButtons(confirmable && this.getDefaultButtons());
}, updateMode:function() {
  this.layoutFace();
}, updateValue:function() {
  var me = this, hour = me.getHours(), minutes = me.getMinutes(), am = me.getAm();
  if (this.rendered) {
    me.setHours(hour);
    me.setMinutes(minutes);
    me.hasSetAm = false;
    me.setAm(am);
  }
}, updateField:function() {
  var me = this, hour = me.getHours(), minutes = me.getMinutes(), newValue = new Date(me.initDate);
  newValue.setHours(hour > 23 ? hour - 12 : hour);
  newValue.setMinutes(minutes);
  me.fireEvent('select', me.parent, newValue);
}, collapsePanel:function() {
  this.fireEvent('collapsePanel', this);
}, setVerticalByOrientation:function() {
  this.updateVertical('auto');
}, updateVertical:function(vertical) {
  var me = this, viewport = Ext.Viewport;
  if (viewport) {
    if (vertical === 'auto') {
      vertical = viewport.getOrientation() === viewport.PORTRAIT;
      viewport.on('orientationchange', 'onOrientationChange', me);
    } else {
      viewport.un('orientationchange', 'onOrientationChange', me);
    }
  }
  me.toggleCls(Ext.baseCSSPrefix + 'vertical', vertical);
  me.setHeaderPosition(vertical ? 'top' : 'left');
  me.layoutFace();
}, doDestroy:function() {
  var viewport = Ext.Viewport;
  if (viewport) {
    viewport.un('orientationchange', 'onOrientationChange', this);
  }
  this.callParent();
}});
Ext.define('Ext.panel.Time', {extend:'Ext.Panel', xtype:'timepanel', mixins:['Ext.mixin.ConfigProxy'], config:{view:{xtype:'analogtime'}}, proxyConfig:{view:{configs:['value', 'autoAdvance', 'vertical', 'confirmable', 'confirmHandler', 'declineHandler', 'scope', 'defaultButtons', 'mode'], methods:['getHours', 'getMinutes', 'getMeridiem', 'updateField']}}, autoSize:null, initialize:function() {
  var me = this;
  me.callParent();
  if (me.getFloated()) {
    me.el.dom.setAttribute('tabIndex', -1);
    me.el.on('mousedown', me.onMouseDown, me);
  }
  me.relayEvents(me.getView(), ['collapsePanel', 'select']);
}, applyView:function(config, view) {
  return Ext.updateWidget(view, config, this, 'createView');
}, createView:function(config) {
  return this.mergeProxiedConfigs('view', config);
}, updateView:function(view, oldView) {
  if (oldView) {
    Ext.destroy(oldView);
  }
  this.add(view);
}, updateButtonAlign:function(align) {
  this.getView().setButtonAlign(align);
}, onMouseDown:function(e) {
}});
Ext.define('Ext.field.Time', {extend:'Ext.field.Picker', xtype:'timefield', requires:['Ext.field.trigger.Time', 'Ext.panel.Time', 'Ext.data.validator.Time'], config:{triggers:{expand:{type:'time'}}, format:'', altFormats:'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A'}, platformConfig:{'phone || tablet':{floatedPicker:{modal:true, centered:true}, errorTarget:'under'}}, picker:'floated', floatedPicker:{xtype:'timepanel', floated:true, confirmable:true, 
listeners:{select:'onPickerChange', collapsePanel:'collapse', scope:'owner'}}, initDate:'1970-01-01', initDateFormat:'Y-m-d', matchFieldWidth:false, createFloatedPicker:function(config) {
  var pickerConfig = this.getFloatedPicker();
  return Ext.apply(pickerConfig, config);
}, getAutoPickerType:function() {
  return 'floated';
}, onPickerChange:function(picker, value) {
  var me = this;
  me.forceInputChange = true;
  me.setValue(value);
  me.forceInputChange = false;
  me.fireEvent('select', me, value);
  me.collapse();
}, parseValue:function(value, errors) {
  var me = this, date = value, defaultFormat = me.getFormat(), altFormats = me.getAltFormats(), formats = [defaultFormat].concat(altFormats), i, len, format;
  if (date) {
    if (!Ext.isDate(date)) {
      for (i = 0, len = formats.length; i < len; i++) {
        format = formats[i];
        date = Ext.Date.parse(me.initDate + ' ' + value, me.initDateFormat + ' ' + format);
        if (date) {
          return date;
        }
      }
    }
    if (date) {
      return date;
    }
  }
  return this.callParent([value, errors]);
}, realignFloatedPicker:function(picker) {
  picker = picker || this.getPicker();
  if (picker.isCentered()) {
    picker.center();
  } else {
    return this.callParent([picker]);
  }
}, showPicker:function() {
  var me = this, picker;
  me.callParent();
  picker = me.getPicker();
  picker.setValue(me.getValue());
  if (picker.getModal()) {
    me.getFocusTrap().focus();
  }
}, transformValue:function(value) {
  if (Ext.isDate(value)) {
    if (isNaN(value.getTime())) {
      value = null;
    }
  }
  return value;
}, applyInputValue:function(value, oldValue) {
  if (Ext.isDate(value)) {
    return Ext.Date.format(value, this.getFormat());
  }
  return this.callParent([value, oldValue]);
}, applyPicker:function(picker, oldPicker) {
  var me = this;
  if (picker === 'edge') {
    Ext.log.warn('Time Panel does not support "edge" picker, defaulting to "floated"');
    picker = 'floated';
  }
  picker = me.callParent([picker, oldPicker]);
  if (picker) {
    picker.ownerCmp = me;
  }
  return picker;
}, applyAltFormats:function(altFormats) {
  if (!altFormats) {
    return [];
  } else {
    if (!Ext.isArray(altFormats)) {
      return altFormats.split('|');
    }
  }
  return altFormats;
}, applyFormat:function(format) {
  return format || Ext.Date.defaultTimeFormat;
}, updateFormat:function(format) {
  this.setParseValidator({type:'time', format:format});
}, applyValue:function(value, oldValue) {
  if (!(value || value === 0)) {
    value = null;
  }
  value = this.callParent([value, oldValue]);
  if (value) {
    if (this.isConfiguring) {
      this.originalValue = value;
    }
  }
  return value;
}, updateValue:function(value, oldValue) {
  var picker = this._picker;
  if (picker) {
    picker.setValue(value);
  }
  this.callParent([value, oldValue]);
}});
Ext.define('Ext.panel.Collapser', {requires:['Ext.panel.Collapsible', 'Ext.fx.Animation', 'Ext.Deferred'], config:{animation:null, collapseAnimation:null, collapsed:false, collapseToolText:'Collapse panel', direction:'top', drawer:{xtype:'panel', border:true, top:0, left:0, cls:Ext.baseCSSPrefix + 'drawer'}, drawerHideDelay:500, dynamic:null, expandAnimation:null, expandToolText:'Expand panel', target:null, tool:{xtype:'tool', weight:900}, useDrawer:true}, constructor:function(config) {
  this.initConfig(config);
}, initialize:function() {
  var me = this;
  me.rendered = true;
  me.ensureCollapseTool();
  me.initialized = true;
  if (me.getCollapsed()) {
    me.doExpandCollapse(true, true);
  }
  me.setupDrawerListeners();
}, destroy:function() {
  var me = this, active = me.activeOperation, task = me.drawerTask;
  me.destroying = true;
  if (task) {
    task.cancel();
  }
  if (active) {
    active.anim.end();
  }
  if (!me.getTarget().destroying) {
    me.reattachBodyWrap();
  }
  Ext.destroy(me.drawerHeaderListener, me.drawerListeners, me.drawer, me.collapsibleTool);
  me.destroying = false;
  me.callParent();
}, collapse:function(animation) {
  return this.toggleCollapsed(true, animation);
}, expand:function(animation) {
  return this.toggleCollapsed(false, animation);
}, hideDrawer:function(animation) {
  var me = this, drawer = me.drawer, ret;
  if (me.isSliding || !me.getCollapsed() || !drawer || !me.drawerVisible) {
    return;
  }
  animation = me.parseAnimation(false, animation);
  if (animation) {
    me.getTarget().element.addCls(me.slidingCls);
    ret = me.doAnimation(false, me.getSlideOutCfg(me.getDirection(), me.afterDrawerHide, animation));
    me.isSliding = true;
  } else {
    me.afterDrawerHide();
    ret = Ext.Promise.resolve();
  }
  return ret;
}, isDynamic:function() {
  var dynamic = this.getDynamic(), target;
  if (dynamic === null) {
    target = this.getTarget();
    dynamic = target.getFloated() || !target.getRefOwner();
  }
  return dynamic;
}, showDrawer:function(animation) {
  var me = this, savedProps = me.savedProps, direction = me.getDirection(), target = me.getTarget(), headerSize = me.getHeaderSize(), endDirection = me.endDirection, vertical = me.verticalMap[direction], drawer, w, h, ret, header;
  if (me.isSliding || !me.getCollapsed() || !me.getDrawer()) {
    return Ext.Promise.resolve();
  }
  drawer = me.createDrawer();
  if (vertical) {
    h = '100%';
    w = savedProps.measuredWidth || me.defaultSize;
    drawer.setTop(0);
    drawer.setBottom(0);
    if (endDirection[direction]) {
      drawer.setLeft(null);
      drawer.setRight(headerSize);
    } else {
      drawer.setRight(null);
      drawer.setLeft(headerSize);
    }
  } else {
    w = '100%';
    h = savedProps.measuredHeight || me.defaultSize;
    drawer.setRight(0);
    drawer.setLeft(0);
    if (endDirection[direction]) {
      drawer.setTop(null);
      drawer.setBottom(headerSize);
    } else {
      drawer.setBottom(null);
      drawer.setTop(headerSize);
    }
    if (target.getHeader() && target.getHeaderPosition() === direction) {
      header = drawer.ensureHeader();
      if (header) {
        header.hide();
      }
    }
  }
  me.configureDrawer(drawer, w, h);
  drawer.show();
  animation = me.parseAnimation(false, animation);
  me.isSliding = true;
  if (animation) {
    animation = me.getSlideInCfg(direction, me.afterDrawerShow, animation);
    animation.preserveEndState = true;
    me.getTarget().element.addCls(me.slidingCls);
    ret = me.doAnimation(false, animation);
  } else {
    me.afterDrawerShow();
    ret = Ext.Promise.resolve();
  }
  return ret;
}, toggleCollapsed:function(collapsed, animation) {
  var me = this, target = me.getTarget(), current = me.getCollapsed(), event, ret;
  if (collapsed === current) {
    return Ext.Promise.resolve();
  }
  event = 'before' + (collapsed ? 'collapse' : 'expand');
  if (me.initialized && target.hasListeners[event] && target.fireEvent(event, target) === false) {
    return Ext.Promise.resolve();
  }
  if (me.rendered) {
    animation = me.parseAnimation(collapsed, animation);
  } else {
    animation = null;
  }
  me.hideDrawer(false);
  if (animation) {
    ret = me.doExpandCollapseAnimated(collapsed, animation);
  } else {
    ret = me.doExpandCollapse(collapsed);
  }
  return ret;
}, applyAnimation:function(config) {
  if (config === true) {
    config = {};
  }
  return config;
}, updateCollapsed:function(collapsed) {
  var me = this;
  if (me.rendered && !me.preventUpdate) {
    me._collapsed = !collapsed;
    me.toggleCollapsed(collapsed);
  }
}, updateCollapseToolText:function(text) {
  this.setToolTextIf(text, this.getCollapsed());
}, updateDirection:function(direction, oldDirection) {
  var me = this;
  if (!me.isConfiguring) {
    if (me.getCollapsed()) {
      me.getTarget().moveHeaderPosition(direction, oldDirection);
    }
    me.ensureCollapseTool();
  }
}, updateDynamic:function(dynamic) {
  var me = this, drawer = me.drawer;
  if (dynamic && drawer) {
    if (me.hasDetachedBody) {
      me.reattachBodyWrap();
    }
    me.drawer = Ext.destroy(drawer);
  }
}, updateExpandToolText:function(text) {
  this.setToolTextIf(text, !this.getCollapsed());
}, updateUseDrawer:function() {
  if (this.rendered) {
    this.setupDrawerListeners();
  }
}, privates:{animateEndCls:Ext.baseCSSPrefix + 'placeholder-animate-end', collapsingDirections:{top:['up', 'down'], left:['left', 'right'], bottom:['down', 'up'], right:['right', 'left']}, defaultSize:300, endDirection:{right:1, bottom:1}, headerChangePosition:{top:['top', 'bottom'], left:['left', 'right'], bottom:['bottom', 'top'], right:['right', 'left']}, hasDetachedBody:false, rendered:false, slidingCls:Ext.baseCSSPrefix + 'sliding', verticalMap:{right:1, left:1}, afterAnimation:function(active) {
  active.deferred.resolve();
  this.activeOperation = null;
}, afterDrawerHide:function() {
  var me = this, target = me.getTarget(), active = me.activeOperation, drawer = me.drawer, header;
  target.element.removeCls(me.slidingCls);
  me.drawerVisible = me.isSliding = false;
  if (!me.destroying) {
    me.drawerListeners = Ext.destroy(me.drawerListeners);
    drawer.hide();
    header = drawer.getHeader();
    if (header) {
      header.show();
    }
    target.fireEvent('drawerhide', target);
  }
  if (active) {
    me.afterAnimation(active);
  }
}, afterDrawerShow:function() {
  var me = this, active = me.activeOperation, drawerListeners, listenerCfg, target = me.getTarget(), header;
  me.isSliding = false;
  me.drawerVisible = true;
  if (!me.destroying) {
    target.element.removeCls(me.slidingCls);
    listenerCfg = {mouseleave:'handleElMouseLeave', mouseenter:'handleElMouseEnter', scope:me, destroyable:true};
    drawerListeners = [Ext.on('mousedown', 'handleGlobalDrawerEvent', me, {destroyable:true}), Ext.getDoc().on('mousemove', 'handleGlobalDrawerEvent', me, {destroyable:true}), me.drawer.element.on(listenerCfg)];
    header = target.getHeader();
    if (header) {
      drawerListeners.push(header.element.on(listenerCfg));
    }
    me.drawerListeners = drawerListeners;
    target.fireEvent('drawershow', target);
  }
  if (active) {
    me.afterAnimation(active);
  }
}, afterExpandCollapseAnimation:function() {
  var me = this, active = me.activeOperation, target = me.getTarget(), cls = active.animCls, header, bodyWrap;
  if (!me.destroying) {
    header = target.getHeader();
    if (active.placeHolder) {
      me.drawer.hide();
    }
    if (active.reattach) {
      me.reattachBodyWrap();
    }
    if (header && active.restoreHeaderVis) {
      header.element.setVisibility(true);
    }
    if (cls) {
      target.element.removeCls(cls);
    }
    if (active.restore) {
      me.restoreProps();
      bodyWrap = target.bodyWrapElement;
      bodyWrap.setWidth(null).setHeight(null);
      header = header && header.element;
      if (header) {
        header.setWidth(null).setHeight(null);
      }
    }
    me.afterExpandCollapse(active.collapsed, true);
  }
  me.afterAnimation(active);
}, afterExpandCollapse:function(collapsed) {
  var me = this, target = me.getTarget(), types = me.headerChangePosition, direction = me.getDirection(), headerPosition = target.getHeaderPosition(), event = collapsed ? 'collapse' : 'expand';
  target.bodyWrapElement.setVisible(!collapsed);
  if (types[headerPosition].indexOf(direction) < 0) {
    target.moveHeaderPosition(collapsed ? direction : headerPosition, !collapsed ? direction : headerPosition);
  }
  me.preventUpdate = true;
  me.setCollapsed(collapsed);
  me.preventUpdate = false;
  me.ensureCollapseTool();
  if (me.initialized && target.hasListeners[event]) {
    target.fireEvent(event, target);
  }
}, createDrawer:function() {
  var me = this, p = me.drawer;
  if (!p) {
    me.drawer = p = Ext.create(me.getDrawer());
    p.bodyWrapElement.hide();
  }
  return p;
}, configureDrawer:function(drawer, width, height, resetPos) {
  var me = this, target = me.getTarget(), bodyWrap = target.bodyWrapElement;
  drawer.setTitle(target.getTitle());
  drawer.setWidth(width);
  drawer.setHeight(height);
  if (resetPos) {
    drawer.setTop(0);
    drawer.setRight(null);
    drawer.setBottom(null);
    drawer.setLeft(0);
  }
  drawer.element.append(bodyWrap);
  me.getContainerTarget().appendChild(drawer.element);
  bodyWrap.show();
  drawer.show();
  me.hasDetachedBody = true;
}, doAnimation:function(collapsed, animation, activeOperation) {
  activeOperation = activeOperation || {};
  var deferred = activeOperation.deferred || new Ext.Deferred, anim = new Ext.fx.Animation(animation);
  activeOperation.anim = anim;
  activeOperation.deferred = deferred;
  activeOperation.collapsed = collapsed;
  this.activeOperation = activeOperation;
  Ext.Animator.run(anim);
  return deferred.promise;
}, doExpandCollapse:function(collapsed, initial) {
  var me = this, target = me.getTarget(), direction;
  if (me.rendered) {
    if (collapsed) {
      me.saveProps();
      target.setFlex(null);
      direction = me.getDirection();
      if (direction === 'top' || direction === 'bottom') {
        target.setHeight(null);
      } else {
        target.setWidth(null);
      }
    } else {
      me.reattachBodyWrap();
      me.restoreProps();
    }
    me.afterExpandCollapse(collapsed);
  }
  return initial ? null : Ext.Promise.resolve();
}, doExpandCollapseAnimated:function(collapsed, animation) {
  if (this.isDynamic()) {
    return this.doExpandCollapseDynamic(collapsed, animation);
  }
  return this.doExpandCollapsePlaceholder(collapsed, animation);
}, doExpandCollapseDynamic:function(collapsed, animation) {
  var me = this, target = me.getTarget(), headerPosition = target.getHeaderPosition(), direction = me.getDirection(), targetEl = target.element, bodyWrap = target.bodyWrapElement, header = target.getHeader(), headerEl = header && header.element, from = {}, to = {}, directionVertical = direction === 'top' || direction === 'bottom', headerVertical = headerPosition === 'top' || headerPosition === 'bottom', headerSize = me.getHeaderSize(), headerDifferent = headerPosition !== direction, height, width, 
  savedProps, size;
  if (collapsed) {
    savedProps = me.saveProps();
    height = savedProps.measuredHeight;
    width = savedProps.measuredWidth;
    if (directionVertical) {
      me.measureAndSet(bodyWrap, 'Height');
      if (headerDifferent) {
        me.measureAndSet(headerEl, 'Height');
      }
      from.height = height;
      to.height = headerVertical ? headerSize : 0;
      target.setHeight(null);
      target.setMinHeight(null);
    } else {
      me.measureAndSet(bodyWrap, 'Width');
      if (headerDifferent) {
        me.measureAndSet(headerEl, 'Width');
      }
      from.width = width;
      to.width = headerVertical ? headerSize : 0;
      target.setWidth(null);
      target.setMinWidth(null);
    }
    target.setFlex(null);
  } else {
    headerDifferent = headerPosition !== direction;
    me.reattachBodyWrap();
    if (directionVertical) {
      targetEl.setHeight(null);
    } else {
      targetEl.setWidth(null);
    }
    me.restoreProps(true);
    if (headerDifferent) {
      target.moveHeaderPosition(collapsed ? direction : headerPosition, !collapsed ? direction : headerPosition);
    }
    bodyWrap.show();
    if (headerEl) {
      headerEl.setWidth(null).setHeight(null);
    }
    me.measureAndSet(bodyWrap, directionVertical ? 'Height' : 'Width', true);
    size = targetEl.measure();
    height = size.height;
    width = size.width;
    target.setFlex(null);
    me.measureAndSet(headerEl, directionVertical ? 'Height' : 'Width');
    if (directionVertical) {
      from.height = headerSize;
      to.height = height;
      target.setHeight(null);
    } else {
      from.width = headerSize;
      to.width = width;
      target.setWidth(null);
    }
  }
  return me.doAnimation(collapsed, Ext.apply({scope:me, callback:me.afterExpandCollapseAnimation, element:targetEl, preserveEndState:true, from:from, to:to}, animation), {restore:!collapsed});
}, doExpandCollapsePlaceholder:function(collapsed, animation) {
  var me = this, types = me.collapsingDirections, target = me.getTarget(), targetEl = target.element, headerPosition = target.getHeaderPosition(), direction = me.getDirection(), directionVertical = direction === 'top' || direction === 'bottom', headerVertical = headerPosition === 'top' || headerPosition === 'bottom', header = target.getHeader(), headerDifferent = directionVertical !== headerVertical, containerBox = me.getContainerTarget().getBox(), height, width, drawer, anim, animCls, restoreHeaderVis, 
  savedProps, size;
  drawer = me.createDrawer();
  if (collapsed) {
    savedProps = me.saveProps();
    height = savedProps.measuredHeight;
    width = savedProps.measuredWidth;
  } else {
    me.reattachBodyWrap();
    me.restoreProps(true);
    size = targetEl.measure();
    height = size.height;
    width = size.width;
  }
  me.configureDrawer(drawer, width, height, true);
  drawer.setLeft(targetEl.getLeft() - containerBox.left);
  drawer.setTop(targetEl.getTop() - containerBox.top);
  if (directionVertical) {
    target.setHeight(null);
    target.setMinHeight(null);
  } else {
    target.setWidth(null);
    target.setMinWidth(null);
  }
  target.setFlex(null);
  if (collapsed) {
    if (headerDifferent && types[headerPosition].indexOf(direction) < 0) {
      target.moveHeaderPosition(collapsed ? direction : headerPosition, !collapsed ? direction : headerPosition);
    }
    if (header) {
      header.element.setVisibility(false);
    }
    anim = me.getSlideOutCfg(direction, function() {
      if (me.destroying) {
        return;
      }
      var active = me.activeOperation;
      drawer.hide();
      if (header) {
        header.element.setVisibility(true);
        me.doAnimation(collapsed, {type:'slideIn', element:header.element, reverse:true, direction:direction, isElementBoxFit:false, scope:me, callback:me.afterExpandCollapseAnimation}, active);
      } else {
        me.afterExpandCollapseAnimation();
      }
    }, animation);
  } else {
    anim = me.getSlideInCfg(direction, me.afterExpandCollapseAnimation, animation);
    if (me.endDirection[direction]) {
      animCls = me.animateEndCls;
      targetEl.addCls(animCls);
    }
    if (!headerDifferent) {
      header.element.setVisibility(false);
      restoreHeaderVis = true;
    }
  }
  return me.doAnimation(collapsed, anim, {placeHolder:true, restore:!collapsed, reattach:true, animCls:animCls, restoreHeaderVis:restoreHeaderVis});
}, ensureCollapseTool:function() {
  var me = this, target = me.getTarget(), header = target.ensureHeader(), pos = me.getDirection(), collapsed = me.getCollapsed(), types = me.collapsingDirections, tool = me.collapsibleTool, cfg = me.getTool();
  if (header && cfg) {
    if (!tool) {
      me.collapsibleTool = tool = target.addTool(Ext.apply({handler:me.onToggleToolTap, scope:me, $internal:true}, cfg))[0];
    }
    tool.setType(collapsed ? types[pos][1] : types[pos][0]);
    tool.setTooltip(collapsed ? me.getExpandToolText() : me.getCollapseToolText());
  } else {
    me.collapsibleTool = Ext.destroy(tool);
  }
}, getAnimationFor:function(collapsed) {
  var anim = collapsed ? this.getCollapseAnimation() : this.getExpandAnimation();
  return anim || this.getAnimation();
}, getContainerTarget:function() {
  return this.getTarget().element.parent();
}, getDrawerTask:function() {
  var me = this, task = me.drawerTask;
  if (!task) {
    me.drawerTask = task = new Ext.util.DelayedTask(me.hideDrawer, me);
  }
  return task;
}, getHeaderSize:function() {
  var header = this.getTarget().ensureHeader(), headerEl = header && header.element;
  return headerEl ? Math.min(headerEl.measure('h'), headerEl.measure('w')) : 0;
}, getSlideInCfg:function(direction, callback, animation) {
  return Ext.apply({type:'slideIn', direction:direction, reverse:true, element:this.drawer.element, isElementBoxFit:false, scope:this, callback:callback}, animation);
}, getSlideOutCfg:function(direction, callback, animation) {
  return Ext.apply({type:'slideOut', direction:direction, element:this.drawer.element, isElementBoxFit:false, scope:this, callback:callback}, animation);
}, handleElMouseEnter:function() {
  this.getDrawerTask().cancel();
}, handleElMouseLeave:function(e) {
  var me = this, toElement = e.getRelatedTarget(), target = me.getTarget();
  if (toElement && (target.owns(toElement) || me.drawer.owns(toElement))) {
    return;
  }
  me.getDrawerTask().delay(me.getDrawerHideDelay());
}, handleGlobalDrawerEvent:function(e) {
  var me = this, drawer = me.drawer, target = me.getTarget(), task;
  task = me.getDrawerTask();
  if (target.owns(e) || drawer.owns(e)) {
    task.cancel();
  } else {
    task.delay(me.getDrawerHideDelay());
  }
}, measureAndSet:function(el, dimension, clear) {
  if (!el) {
    return;
  }
  var setter = 'set' + dimension, getter = 'get' + dimension;
  if (clear) {
    el[setter](null);
  }
  el[setter](el[getter](false, true));
}, onHeaderTap:function(e) {
  var me = this, tool = me.collapsibleTool, collapsed = me.getCollapsed();
  if (!me.isDynamic() && !(tool && tool.owns(e))) {
    me.toggleCollapsed(!collapsed);
  }
}, onToggleToolTap:function() {
  this.toggleCollapsed(!this.getCollapsed());
}, parseAnimation:function(collapsed, animation) {
  if (animation === undefined) {
    animation = this.getAnimationFor(collapsed);
  } else {
    if (animation) {
      if (typeof animation === 'boolean') {
        animation = {};
      }
      animation = Ext.apply({}, animation, this.getAnimationFor(collapsed));
    }
  }
  return animation;
}, reattachBodyWrap:function() {
  if (this.hasDetachedBody) {
    this.getTarget().reattachBodyWrap();
    this.hasDetachedBody = false;
  }
}, restoreProps:function(keep) {
  var target = this.getTarget(), savedProps = this.savedProps, prop;
  if (savedProps) {
    prop = savedProps.flex;
    if (prop) {
      target.setFlex(prop);
    }
    target.setMinHeight(savedProps.minHeight);
    target.setMinWidth(savedProps.minWidth);
    target.setHeight(savedProps.height);
    target.setWidth(savedProps.width);
  }
  if (!keep) {
    this.savedProps = null;
  }
}, saveProps:function() {
  var me = this, target = me.getTarget(), size = target.element.measure();
  me.savedProps = {flex:target.getFlex(), minHeight:target.getMinHeight(), minWidth:target.getMinWidth(), height:target.getHeight(), width:target.getWidth(), measuredWidth:size.width, measuredHeight:size.height};
  return me.savedProps;
}, setToolTextIf:function(text, doSet) {
  var tool = this.collapsibleTool;
  if (text && tool && doSet) {
    tool.setTooltip(text);
  }
}, setupDrawerListeners:function() {
  var me = this, header = me.getTarget().getHeader();
  me.drawerHeaderListener = Ext.destroy(me.drawerHeaderListener);
  if (header && me.getUseDrawer()) {
    me.drawerHeaderListener = header.element.on({destroyable:true, scope:me, tap:'onHeaderTap'});
  }
}}});
Ext.define('ABPControlSet.base.view.contextmenu.plugin.ContextMenu', {extend:'Ext.plugin.Abstract', id:'abpcontextmenu', alias:'plugin.abpcontextmenu', cachedConfig:{contextMenu:1}, applyContextMenu:function(contextMenu) {
  contextMenu = Ext.widget({padding:0, relative:true, xtype:'menu', floating:true, header:false, layout:'fit', items:[{xtype:'abpcontextmenu', listeners:{itemclick:this.onItemClick, scope:this}, store:{type:'tree', rootVisible:true, root:{}}}]});
  return contextMenu;
}, constructor:function(config) {
  config = config || {};
  this.callParent([config]);
}, onItemClick:function(tree, itemData) {
  var currentCmp = tree.getCurrentCmp ? tree.getCurrentCmp() : null;
  var item = itemData.node;
  var currentContext = tree.getCurrentContext();
  if (currentCmp) {
    var contextMenu = this.getContextMenu();
    currentCmp.fireEvent(ABPControlSet.common.types.Events.ContextMenuItemClick, currentCmp, currentContext, item, item.get('checkbox') ? !!item.get('checked') : null);
    var handler = item.get('handler');
    if (Ext.isFunction(handler)) {
      handler(currentCmp, currentContext, item, item.get('checkbox') ? !!item.get('checked') : null);
    }
    if (!item.get('checkbox') && item.get('leaf')) {
      contextMenu.hide();
    }
  }
}, init:function(parent) {
  if (Ext.toolkit === 'classic') {
    var element = parent.element ? parent.element : parent.el;
    if (element) {
      element.on({contextmenu:{fn:this.onContextMenu, scope:this}});
    } else {
      parent.on({el:{contextmenu:{fn:this.onContextMenu, scope:this}}});
    }
  } else {
    parent.on({contextmenu:{element:'element', preventDefault:true, fn:this.onContextMenu, scope:this}});
  }
}, onContextMenu:function(event, el) {
  var contextMenu = this.getContextMenu(), contextList = contextMenu ? contextMenu.down('abpcontextmenu') : null;
  if (contextList) {
    var store = contextList.getStore(), root = store.getRoot();
    if (root) {
      root.removeAll();
      var cmp = this.cmp;
      if (cmp && cmp.fireEvent) {
        var context = cmp.getContextMenuData ? cmp.getContextMenuData(event, el) : {};
        contextList.setCurrentCmp(cmp);
        contextList.setCurrentContext(context);
        if (cmp.fireEvent(ABPControlSet.common.types.Events.ContextMenu, root, this.cmp, context, el, event) !== false) {
          if (root && root.childNodes && root.childNodes.length > 0) {
            if (event && event.stopEvent) {
              event.stopEvent();
            }
            if (Ext.toolkit === 'modern') {
              contextMenu.showBy(cmp, 't-b');
            } else {
              contextMenu.showAt(event.pageX, event.pageY);
            }
          }
        }
      }
    }
  }
}});
Ext.define('ABPControlSet.common.types.Events', {singleton:true, UserChanged:'userchanged', TriggerClick:'triggerclick', TriggerFocus:'triggerfocus', ContextMenu:'contextshow', ContextMenuItemClick:'contextmenuitemclick', ImageLongPress:'longpress', ImageClick:'click', ImageDoubleClick:'doubletap', RadioGroupFocus:'radiogroupfocus', AGGridRemove:'aggridremove', AGGridAdd:'aggridadd', AGGridUpdate:'aggridupdate'});
Ext.define('ABPControlSet.base.view.field.plugin.Field', {extend:'Ext.plugin.Abstract', requires:['ABPControlSet.common.types.Events'], alias:'plugin.abpfield', focusValue:null, init:function(component) {
  component.labelPad = component.labelAlign === 'top' ? 5 : 14;
  if (component.xtype === 'abpcheckbox' || component.xtype === 'abpradiogroup') {
    return;
  } else {
    var listeners = {focus:this.userChangedFocus, blur:this.userChangedBlur, select:this.userChangedSelect, scope:this};
    component.userTyping = false;
    this.registerInputListener(listeners, this.userInputFormat);
    component.on(listeners);
  }
}, registerInputListener:Ext.emptyFn, userInputFormat:function(e) {
  var field = this.cmp;
  field.userTyping = true;
  var fieldFormatter = field.getFieldFormatter();
  var fieldFormat = field.getFieldFormat();
  if (Ext.isFunction(fieldFormatter) && !field.getReadOnly() && !field.getDisabled()) {
    field.setFieldFormattedValue(fieldFormatter, fieldFormat, true);
  }
}, userChangedFocus:function(field, e) {
  var me = this, fieldFormatter = field.getFieldFormatter(), fieldFormat = field.getFieldFormat();
  if (Ext.isFunction(fieldFormatter)) {
    field.setFieldFormattedValue(fieldFormatter, fieldFormat, true);
  }
  if (field instanceof Ext.form.field.ComboBox && e) {
    var relatedTarget = e.relatedTarget;
    var relatedEl = relatedTarget ? Ext.fly(relatedTarget) : null;
    var relatedComponent = relatedEl ? relatedEl.component : null;
    var isPicker = relatedComponent ? Ext.toolkit === 'classic' ? relatedComponent instanceof Ext.view.BoundList : false : false;
    if (isPicker) {
      var pickerOwner = relatedComponent.ownerCmp;
      if (pickerOwner && pickerOwner.id === field.id) {
        return;
      }
    }
  }
  me.focusValue = field.getValue();
}, userChangedBlur:function(field) {
  var me = this;
  var value = field.getValue();
  field.userTyping = false;
  if (Ext.valueFrom(value, null) == null && Ext.valueFrom(me.focusValue, null) == null) {
    return;
  }
  if (!field.isEqual(value, me.focusValue)) {
    field.__flushValueViewModel();
    field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, value, me.focusValue);
    me.focusValue = value;
  }
  var fieldFormatter = field.getFieldFormatter();
  var fieldFormat = field.getFieldFormat();
  if (Ext.isFunction(fieldFormatter)) {
    field.setFieldFormattedValue(fieldFormatter, fieldFormat, false);
  }
}, userChangedSelect:function(field, record) {
  var me = this;
  var value = field.getValue();
  if (Ext.valueFrom(value, null) == null && Ext.valueFrom(field, me.focusValue, null) == null) {
    return;
  }
  if (!field.isEqual(value, me.focusValue)) {
    var focusValue = me.focusValue;
    me.focusValue = value;
    field.__inUserChangedHandler = true;
    field.__flushValueViewModel();
    field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, value, focusValue);
    delete field.__inUserChangedHandler;
  }
}});
Ext.define('ABPControlSet.view.field.plugin.Field', {override:'ABPControlSet.base.view.field.plugin.Field', registerInputListener:function(listeners, inputHandler) {
  Ext.apply(listeners, {keyup:{element:this.cmp.inputElement ? 'inputElement' : 'element', fn:inputHandler, scope:this}});
  return listeners;
}});
Ext.define('ABPControlSet.base.view.field.plugin.LinkedLabel', {extend:'Ext.plugin.Abstract', alias:'plugin.abplinkedlabel', init:function(component) {
  var inputId = component.inputId = component.inputId || Ext.id();
  var data = this.getLabelableRenderData(component);
  component.__hideLabel = component.hideLabel;
  component.__linkedLabel = Ext.widget({forId:inputId, xtype:'abplabel', required:Ext.isBoolean(component.required) ? component.required : Ext.isBoolean(component.allowBlank) ? !component.allowBlank : undefined, disabled:component.disabled, hidden:component.hidden === true ? true : component.hideLabel === true ? true : false, responsiveCol:(component.responsiveCol || 1) - 1, width:component.labelWidth, disabledCls:'x-form-item-default x-item-disabled', cls:data.labelCls + ' abp-linked-label', responsiveWidth:component.labelWidth, 
  responsiveColSpan:1, responsiveRow:component.responsiveRow, responsiveRowSpan:1, field:component});
  var listeners = {};
  var container = component.up('container');
  if (!container) {
    listeners.added = this.onComponentAdded;
  } else {
    var itemCollection = container.items;
    var cmpPos = itemCollection.indexOf(component);
    this.insertLabel(component, container, cmpPos);
  }
  this.hookIntoFieldLabel(component);
  Ext.apply(listeners, {disable:function(component) {
    component.__linkedLabel.disable(true);
  }, enable:function(component) {
    component.__linkedLabel.enable(true);
  }, hide:function(component) {
    component.__linkedLabel.hide();
  }, show:function(component) {
    if (!component.__hideLabel) {
      component.__linkedLabel.show();
    }
  }, beforerender:function(component) {
    if (!component.__hideLabel && !component.hidden) {
      component.__linkedLabel.show();
    } else {
      component.__linkedLabel.hide();
    }
  }, removed:function(component, owner) {
    owner.remove(component.__linkedLabel);
  }, destroy:function(component) {
    Ext.destroy(component.__linkedLabel);
  }});
  component.on(listeners);
}, getLabelableRenderData:Ext.emptyFn, onComponentAdded:function(component, container, cmpPos) {
  this.insertLabel(component, container, cmpPos);
}, insertLabel:function(component, container, cmpPos) {
  container.insert((cmpPos || 1) - 1, component.__linkedLabel);
}});
Ext.define('ABPControlSet.base.view.field.plugin.LinkedLabel', {extend:'Ext.plugin.Abstract', alias:'plugin.abplinkedlabel', getLabelableRenderData:function(component) {
  return {};
}, hookIntoFieldLabel:function(component) {
  var label = component.getLabel();
  component.setLabel(undefined);
  component.updateLabel = this.updateLabel;
  component.setLabel(label);
}, updateLabel:function(label) {
  var labelCmp = this.__linkedLabel;
  if (labelCmp) {
    labelCmp.setHtml(Ext.String.htmlEncode(label));
  }
}});
Ext.define('ABPControlSet.base.view.field.plugin.RadioGroup', {extend:'Ext.plugin.Abstract', requires:['ABPControlSet.common.types.Events'], alias:'plugin.abpradiogroup', focusValue:null, init:function(component) {
  component.on({focusleave:this.onFocusLeave, focusenter:this.onFocusEnter, scope:this});
}, onFocusLeave:function(group) {
  var me = this, newValue = group.getValue();
  if (Ext.valueFrom(newValue, null) == null && Ext.valueFrom(me.focusValue, null) == null) {
    return;
  }
  if (!group.isEqual(newValue, me.focusValue)) {
    group.__flushValueViewModel();
    group.fireEvent(ABPControlSet.common.types.Events.UserChanged, group, newValue, me.focusValue);
    me.focusValue = newValue;
  }
}, onFocusEnter:function(group) {
  group.fireEvent(ABPControlSet.common.types.Events.RadioGroupFocus, group);
  this.focusValue = group.getValue();
}});
Ext.define('ABPControlSet.view.field.plugin.RadioGroup', {override:'ABPControlSet.base.view.field.plugin.RadioGroup'});
Ext.define('ABPControlSet.base.view.field.plugin.RelativeDateTime', {extend:'Ext.plugin.Abstract', alias:'plugin.abprelativedatetime', absoluteValue:null, relativeValue:null, maxRelativeValue:null, canBeRelative:false, dateFormat:'jS F Y', init:function(component) {
  if (component.xtype !== 'abptime' && component.xtype !== 'abpdate' && component.xtype !== 'abpdatetime') {
    return;
  } else {
    var listeners = {disable:this.onFieldDisable, enable:this.onFieldEnable, writeablechange:this.onFieldWritable, change:this.onFieldValueChanged, afterrender:this.onFieldRender, scope:this};
    this.field = component;
    this.absoluteValue = component.getValue();
    this.maxRelativeValue = component.maxRelative ? component.maxRelative.split('|') : ['24', 'h'];
    this.field.relativeUpdate = component.relativeUpdate || 60;
    component.on(listeners);
    if (component.disabled) {
      this.onFieldDisable();
    }
    if (component.readOnly) {
      this.onFieldWritable();
    }
    var me = this;
    me.updateRunner = new Ext.util.TaskRunner;
    me.updateTask = me.updateRunner.newTask({run:me.updateFieldRelative, interval:me.field.relativeUpdate * 1000, scope:me});
  }
}, start:function() {
  if (this.updateTask) {
    this.updateTask.start();
  } else {
    this.startAfterRender = true;
  }
}, stop:function() {
  if (this.updateTask) {
    this.updateTask.stop();
  }
}, onFieldValueChanged:function() {
  this.absoluteValue = this.field.getValue();
  if (this.tip && this.tip.isVisible()) {
    this.tip.setConfig(this.getTipConfig());
  }
  if (this.field.disabled) {
    this.onFieldDisable();
  }
  if (this.field.readOnly) {
    this.onFieldWritable();
  }
}, onFieldRender:function() {
  if (this.startAfterRender) {
    this.start();
    if (this.canBeRelative && !this.tip) {
      this.createToolTip();
    }
  }
}, onFieldDisable:function() {
  var focusEl = this.field.getFocusEl();
  if (focusEl) {
    if (!this.savedTitle) {
      this.savedTitle = focusEl.dom.getAttribute('title');
    }
    focusEl.dom.removeAttribute('title');
  }
}, onFieldEnable:function() {
  if (this.savedTitle && !this.field.readOnly) {
    var focusEl = this.field.getFocusEl();
    if (focusEl) {
      focusEl.dom.setAttribute('title', this.savedTitle);
    }
  }
}, createToolTip:function() {
  var fieldId = this.field.getId(), me = this, tipConfig = this.getTipConfig();
  this.tip = Ext.create('Ext.tip.ToolTip', {target:fieldId, title:tipConfig.title, minWidth:tipConfig.minWidth, html:tipConfig.html, cls:'abp-relative-tip', shadow:'drop', dismissDelay:0, listeners:{beforeshow:function(tip) {
    var config = me.getTipConfig();
    tip.setMinWidth(config.minWidth);
    tip.setTitle(config.title);
    tip.setHtml(config.html);
  }}});
}, getTipConfig:function() {
  var title = Ext.Date.format(this.absoluteValue, this.dateFormat);
  var titleWidth = ABP.util.Common.actualMeasureText(title, '14px roboto');
  if (this.field.xtype === 'abpdatetime') {
    var time = Ext.Date.format(this.absoluteValue, 'g:i A');
    title = '\x3cspan class\x3d"tip-date"\x3e' + title + '\x3c/span\x3e\x3cspan class\x3d"tip-time"\x3e' + time + '\x3c/span\x3e';
  }
  var tipConfig = {html:ABP.util.RelativeTime.format(this.absoluteValue, true), title:title, minWidth:titleWidth.width + 16};
  return tipConfig;
}, onFieldWritable:function() {
  if (this.field.setValue) {
    this.canBeRelative = this.field.readOnly;
    if (this.field.readOnly) {
      this.field.addCls('abp-relative-readonly');
      this.fieldDisabled = this.field.getDisabled();
      this.field.setDisabled(true);
      var focusEl = this.field.getFocusEl();
      if (focusEl && !this.tip) {
        this.createToolTip();
      }
    } else {
      this.field.removeCls('abp-relative-readonly');
      if (typeof this.fieldDisabled !== null) {
        this.field.setDisabled(this.fieldDisabled);
      }
    }
    this.updateFieldRelative();
  }
}, checkRelativeValid:function() {
  var now = new Date;
  var offset = Ext.Date.diff(this.absoluteValue, now, this.maxRelativeValue[1]);
  if (offset > parseInt(this.maxRelativeValue[0])) {
    return false;
  }
  return true;
}, updateFieldRelative:function() {
  var withinThreshold = this.checkRelativeValid(), focusEl = this.field.getFocusEl();
  if (this.field.setRawValue && this.canBeRelative) {
    if (withinThreshold) {
      this.relativeValue = ABP.util.RelativeTime.format(this.absoluteValue, true);
    } else {
      this.relativeValue = Ext.Date.format(this.absoluteValue, this.dateFormat);
    }
    this.field.setRawValue(this.relativeValue);
    if (this.tip && this.tip.isVisible()) {
      var config = this.getTipConfig();
      this.tip.setMinWidth(config.minWidth);
      this.tip.setTitle(config.title);
      this.tip.setHtml(config.html);
    }
    if (focusEl) {
      if (!this.savedTitle) {
        this.savedTitle = focusEl.dom.getAttribute('title');
      }
      focusEl.dom.removeAttribute('title');
    }
    this.start();
  } else {
    this.field.setValue(this.absoluteValue);
    if (this.savedTitle && focusEl) {
      focusEl.dom.setAttribute('title', this.savedTitle);
    }
    this.stop();
  }
}, destroy:function() {
  this.updateTask.destroy();
  this.updateRunner.destroy();
  this.callParent();
}});
Ext.define('ABPControlSet.base.view.grid.plugin.ListView', {extend:'Ext.AbstractPlugin', alias:'plugin.listview', mixins:['Ext.mixin.Observable'], showTitle:true, autoFillMain:true, autoFillBody:false, allowMainDuplication:false, allowBodyDuplication:true, showHeaders:false, gridId:null, config:{fullRow:null, template:null}, listTemplateClsPreface:'abp-list-view-template-', cellColumnFieldsTpl:new Ext.XTemplate(['\x3ctd class\x3d"abp-list-view-cellColumn abp-list-view-cellColumn-{[values.cellColumn]}"\x3e', 
'\x3ctpl for\x3d"values.cellColumnPriorities"\x3e', '{%', 'cellColumnParent\x3dparent;', 'priorityIndex \x3d xindex - 1;', '%}', '\x3ctable class\x3d"abp-list-view-field abp-list-view-field-{[priorityIndex + 1]}"\x3e', '\x3ctr\x3e', '\x3ctpl if\x3d"."\x3e', '\x3ctpl for\x3d"."\x3e', '\x3ctpl if\x3d"."\x3e', '\x3ctpl if\x3d"cellColumnParent.includeLabel"\x3e', '\x3ctd class\x3d"abp-list-view-field-label abp-list-view-field-label-{[priorityIndex + 1]}"\x3e', '{fieldLabel}', '\x3c/td\x3e', '\x3c/tpl\x3e', 
'{%', 'values.listViewPlugin.renderCell(values, out, priorityIndex + xindex - 1, cellColumnParent)', '%}', '\x3ctpl else\x3e', '\x3ctd class\x3d"abp-list-view-field abp-list-view-field-{[priorityIndex + 1]} abp-list-view-field-value abp-list-view-field-value-{[priorityIndex + 1]}"\x3e', '\x3c/td\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', '\x3c/tr\x3e', '\x3c/table\x3e', '\x3c/tpl\x3e', '\x3c/td\x3e', {definitions:'var priorityIndex;var cellColumnParent;', disableFormats:true}]), namedGridAreaTpl:new Ext.XTemplate(['\x3ctpl for\x3d"."\x3e', 
'{% values.listViewPlugin.renderAreaCell(values, out) %}', '\x3c/tpl\x3e']), gridcellColumnFieldsTpl:new Ext.XTemplate(['\x3ctd class\x3d"abp-list-view-cellColumn abp-list-view-cellColumn-{[values.cellColumn]} ', '{[values.fillColumn \x3d\x3d\x3d 1 ? values.fillCls : values.noFillCls]} ', 'abp-list-align-{[values.align]} ', 'abp-list-justify-{[values.justify]}" ', 'style\x3d"flex: {[values.flex]}"\x3e', '\x3ctpl for\x3d"values.cellColumnPriorities"\x3e', '{%', 'cellColumnParent\x3dparent;', 'priorityIndex \x3d xindex - 1;', 
'rowsToFill \x3d parent.rowsToFill;', '%}', '\x3ctable class\x3d"abp-list-view-field abp-list-view-field-{[rowsToFill ? rowsToFill[parseInt(priorityIndex)] : priorityIndex + 1]}', '"\x3e', '\x3ctr\x3e', '\x3ctpl if\x3d"."\x3e', '\x3ctpl for\x3d"."\x3e', '\x3ctpl if\x3d"."\x3e', '\x3ctpl if\x3d"cellColumnParent.includeLabel"\x3e', '\x3ctd class\x3d"abp-list-view-field-label abp-list-view-field-label-{[rowsToFill ? rowsToFill[priorityIndex] : priorityIndex + 1]}"\x3e', '{fieldLabel}', '\x3c/td\x3e', 
'\x3c/tpl\x3e', '{%', 'values.listViewPlugin.renderCell(values, out, priorityIndex + xindex - 1, cellColumnParent)', '%}', '\x3ctpl else\x3e', '\x3ctd class\x3d"abp-list-view-field abp-list-view-field-{[rowsToFill ? rowsToFill[priorityIndex] : "nio"]} abp-list-view-field-value abp-list-view-field-value-{[rowsToFill ? rowsToFill[priorityIndex + 1] : priorityIndex + 1]}"\x3e', '\x3c/td\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', '\x3c/tr\x3e', '\x3c/table\x3e', '\x3c/tpl\x3e', '\x3c/td\x3e', 
{definitions:'var priorityIndex;var cellColumnParent; var rowsToFill;', disableFormats:true}]), templates:{triData:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(1, 1, 2, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(2, 3, 6, true, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(3, 7, 14, true, values.params, out, parent);', '%}', {disableFormats:true}], start:1, end:14}, triImage:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 
'values.listViewPlugin.renderCellColumn(2, 1, 2, true, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(3, 3, 6, true, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:6}, duoImage:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 2, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:2}, phoneNumberDisplay:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);', 
'%}', {disableFormats:true}], start:0, end:1}, phoneNumberDisplayInForm:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:1}, emailDisplay:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:1}, singleLineItem:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);', '%}', {disableFormats:true}], 
start:0, end:1}, singleLineItemWithTrigger:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:2}, twoLineItem:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 2, 2, false, values.params, out, parent);', 
'%}', {disableFormats:true}], start:0, end:2}, twoLineItemWithTrigger:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(3, 3, 3, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:3}, threeLineItem:{tpl:['{%', 
'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:3}, threeLineItemWithTrigger:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);', 
'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(3, 3, 3, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(4, 4, 4, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:4}, headerLineItemWithThreeFields:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);', 
'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(3, 3, 3, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:4}, twoLineItemWithPhoneOrEmail:{tpl:['{%', 'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);', 'values.listViewPlugin.renderCellColumn(1, 1, 2, false, values.params, out, parent);', '%}', {disableFormats:true}], start:0, end:2}, gridExample:{tpl:['{%', 
'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true);', 'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [1,2]);', 'values.listViewPlugin.renderGridCellColumn(2, 3, 3, false, values.params, out, parent, false, [1]);', '%}', {disableFormats:true, cssGridTemplate:true, cols:3, rows:3}], start:0, end:2}, gridExampleBottom:{tpl:['{%', 'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true);', 
'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [2,3]);', 'values.listViewPlugin.renderGridCellColumn(2, 3, 3, false, values.params, out, parent, false, [3]);', '%}', {disableFormats:true, cssGridTemplate:true, cols:3, rows:3}], start:0, end:2}, gridExampleSplit:{tpl:['{%', 'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true);', 'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [1,3]);', 
'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1,3]);', '%}', {disableFormats:true, cssGridTemplate:true, cols:3, rows:3}], start:0, end:2}, gridExampleImageCenter:{tpl:['{%', 'values.listViewPlugin.renderGridCellColumn(1, 0, 0, false, values.params, out, parent, true, null, "center");', 'values.listViewPlugin.renderGridCellColumn(0, 1, 2, false, values.params, out, parent, false, [1,3], "center");', 'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1,3], "center");', 
'%}', {disableFormats:true, cssGridTemplate:true, cols:3, rows:3}], start:0, end:2}, gridExampleX:{tpl:['{%', 'values.listViewPlugin.renderGridCellColumn(0, 0, 1, false, values.params, out, parent, false, [1, 3], "center", "bottom");', 'values.listViewPlugin.renderGridCellColumn(1, 2, 2, false, values.params, out, parent, false, [2], "center", null, 3);', 'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1, 3], "center", "center");', '%}', {disableFormats:true, 
cssGridTemplate:true, cols:3, rows:3}], start:0, end:2}, gridExampleV:{tpl:['{%', 'values.listViewPlugin.renderGridCellColumn(0, 0, 1, false, values.params, out, parent, false, [1, 2], "center", "bottom");', 'values.listViewPlugin.renderGridCellColumn(1, 2, 2, false, values.params, out, parent, false, [3], "center", null, 3);', 'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1, 2], "center", "center");', '%}', {disableFormats:true, cssGridTemplate:true, 
cols:3, rows:3}], start:0, end:2}, namedAreaGrid:{tpl:['{%', 'values.listViewPlugin.renderNamedAreaGrid(values, out, parent);', '%}', {disableFormats:true, namedGridTemplate:true}]}, gridDefinedOneColumn:{tpl:['{%', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', '%}', {disableFormats:true, cssGridTemplate:true}], start:0, end:0}, gridDefinedTwoColumns:{tpl:['{%', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 
'%}', {disableFormats:true, cssGridTemplate:true}], start:0, end:2}, gridDefinedThreeColumns:{tpl:['{%', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', '%}', {disableFormats:true, cssGridTemplate:true}], start:0, end:2}, gridDefinedFourColumns:{tpl:['{%', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 
'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', '%}', {disableFormats:true, cssGridTemplate:true}], start:0, end:3}, gridDefinedFiveColumns:{tpl:['{%', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 
'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', 'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);', '%}', {disableFormats:true, cssGridTemplate:true}], start:0, end:4}, gridExampleFlex:{tpl:['{%', 'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true, null, "left", "bottom");', 'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [1,2], null, null, 3);', 
'values.listViewPlugin.renderGridCellColumn(2, 3, 3, false, values.params, out, parent, false, [1], null, "center");', '%}', {disableFormats:true, flexGridTemplate:true, cols:3, rows:3}], start:0, end:2}}, constructor:function(config) {
  config = config || {};
  config.fullRow = config.fullRow || false;
  this.callParent([config]);
  this.mixins.observable.constructor.call(this);
}, init:function(parentPanel) {
  var me = this;
  me.gridId = parentPanel.controlId;
  var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
  if (userTemplate) {
    me.setTemplate(userTemplate);
  } else {
    var template = me.getTemplate();
    if (!template) {
      me.setTemplate('triData');
    }
  }
  me.cmp.toggleListView = me.toggleListView.bind(me);
  parentPanel.listViewPlugin = me;
}, toggleListSettings:function() {
  var me = this, listSettings = me.listSettings;
  if (listSettings) {
    var isVisible = listSettings.isVisible();
    listSettings[isVisible ? 'hide' : 'show']();
  }
}, onListNodeDrop:function(node, data) {
  var me = this, gridId = me.gridId, template = me.getTemplate(), templateInfo = me.templates[template], endIndex = templateInfo ? templateInfo.end : 0, startIndex = templateInfo ? templateInfo.start : 0, view = data.view, store = view.getStore(), range = store.getRange(), record, length = range.length;
  for (var i = 0; i < length; i++) {
    record = range[i];
    if (i >= startIndex && i <= endIndex) {
      record.set('listPriority', i);
      ABP.util.LocalStorage.setForLoggedInUser(gridId + template + 'priority' + record.get('field'), i);
    } else {
      record.set('listPriority', undefined);
      ABP.util.LocalStorage.removeForLoggedInUser(gridId + template + 'priority' + record.get('field'));
    }
  }
  me.doUpdateTemplate(me.getTemplate());
}, toggleListView:function() {
  this.setFullRow(!this.getFullRow());
}, templateListSorter:function(a, b) {
  var aP = a.get('listPriority'), bP = b.get('listPriority'), aC = a.get('fullColumnIndex'), bC = b.get('fullColumnIndex');
  if (aP <= bP) {
    return -1;
  } else {
    if (aP > bP) {
      return 1;
    } else {
      if (aC <= bC) {
        return -1;
      } else {
        if (aC > bC) {
          return 1;
        }
      }
    }
  }
}, updateFullRow:function(fullRow) {
  this.doUpdateFullRow(fullRow);
}, updateTemplate:function(name) {
  var me = this, gridId = me.gridId, templates = me.templates, template = templates[name];
  me.listTemplate = Ext.destroy(me.listTemplate);
  if (template) {
    template = new Ext.XTemplate(Ext.clone(template.tpl));
    me.listTemplate = template;
    if (gridId) {
      ABP.util.LocalStorage.setForLoggedInUser(gridId + 'listtemplate', name);
    }
  } else {
    ABP.util.LocalStorage.removeForLoggedInUser(gridId + 'listtemplate');
  }
  me.doUpdateTemplate(name);
}, renderFullRow:function(params, out, parent) {
  var me = this, listTemplate = me.listTemplate, rowValues = {};
  rowValues.listViewPlugin = me;
  rowValues.params = params;
  rowValues.record = params.record;
  rowValues.recordIndex = params.recordIndex;
  rowValues.rowIndex = params.rowIndex;
  listTemplate.applyOut(rowValues, out, parent);
  rowValues.record = rowValues.params = rowValues.listViewPlugin = null;
}, renderNamedAreaGrid:function(values, out, parent) {
  var me = this, listTemplate = me.namedGridAreaTpl;
  cellValues = {};
  cellValues.listViewPlugin = values.listViewPlugin;
  cellValues.cells = values.params.cells;
  listTemplate.applyOut(cellValues, out, parent);
}, renderCellColumn:function(cellColumn, start, end, includeLabel, params, out, parent) {
  var me = this, cellColumnValues = {params:params}, priorities = me.priorities || {}, cellColumnPriorities = [], cellColumnTpl = me.cellColumnFieldsTpl;
  for (var i = start; i <= end; i++) {
    if (priorities[i]) {
      for (var priority in priorities[i]) {
        priority = priorities[i][priority];
        if (!(priority.column instanceof Ext.Base)) {
          var len = params.columns.length;
          for (var i = 0; i < len; i++) {
            var col = params.columns[i];
            if (col.dataIndex === priority.column.dataIndex) {
              priority.column = col;
              break;
            }
          }
        }
      }
    }
    cellColumnPriorities.push(priorities[i]);
  }
  cellColumnValues.cellColumn = cellColumn;
  cellColumnValues.includeLabel = includeLabel || false;
  cellColumnValues.cellColumnPriorities = cellColumnPriorities;
  cellColumnTpl.applyOut(cellColumnValues, out, parent);
  cellColumnValues.cellColumn = cellColumnValues.cellColumnPriorities = cellColumnValues.params = null;
}, renderGridCellColumn:function(cellColumn, start, end, includeLabel, params, out, parent, fillColumn, rowsToFill, justify, align, flex) {
  var me = this, cellColumnValues = {params:params}, priorities = me.priorities || {}, cellColumnPriorities = [], cellColumnTpl = me.gridcellColumnFieldsTpl;
  for (var i = start; i <= end; i++) {
    if (priorities[i]) {
      for (var priority in priorities[i]) {
        priority = priorities[i][priority];
        if (!(priority.column instanceof Ext.Base)) {
          var len = params.columns.length;
          for (var i = 0; i < len; i++) {
            var col = params.columns[i];
            if (col.dataIndex === priority.column.dataIndex) {
              priority.column = col;
              break;
            }
          }
        }
      }
    }
    cellColumnPriorities.push(priorities[i]);
  }
  cellColumnValues.cellColumn = cellColumn;
  cellColumnValues.rowsToFill = rowsToFill;
  cellColumnValues.fillColumn = fillColumn ? 1 : 0;
  cellColumnValues.fillCls = 'abp-list-view-cellColumn-fill';
  cellColumnValues.noFillCls = 'abp-list-view-cellColumn-nofill';
  cellColumnValues.justify = justify || 'left';
  cellColumnValues.align = align || 'left';
  cellColumnValues.flex = flex || 1;
  cellColumnValues.includeLabel = includeLabel || false;
  cellColumnValues.cellColumnPriorities = cellColumnPriorities;
  cellColumnTpl.applyOut(cellColumnValues, out, parent);
  cellColumnValues.cellColumn = cellColumnValues.cellColumnPriorities = cellColumnValues.params = null;
}, renderDefinedCellColumn:function(includeLabel, params, out, parent) {
  var me = this, cellColumnValues = {params:params}, priorities = me.priorities || {}, cellColumnPriorities = [], cellColumnTpl = me.gridcellColumnFieldsTpl, templateConfig = parent.getParent().config.__data.listView.template, parentListView = parent.parent;
  if (parentListView.cellColumnIndex !== 0 && !parentListView.cellColumnIndex) {
    parentListView.cellColumnIndex = 0;
  }
  var cellColumnConfig = templateConfig.cellColumns[parentListView.cellColumnIndex];
  var rowsToFill = cellColumnConfig.cells ? [] : null;
  if (rowsToFill) {
    Ext.Array.each(cellColumnConfig.cells, function(cell) {
      rowsToFill.push(cell.rowNumber + 1);
    });
  }
  if (parentListView.cellIndex !== 0 && !parentListView.cellIndex) {
    parentListView.cellIndex = 0;
  }
  var end = cellColumnConfig.cells ? cellColumnConfig.cells.length + parentListView.cellIndex : templateConfig.numRows + parentListView.cellIndex;
  for (var i = parentListView.cellIndex; i < end; i++) {
    if (priorities[i]) {
      for (var priority in priorities[i]) {
        priority = priorities[i][priority];
        if (!(priority.column instanceof Ext.Base)) {
          var len = params.columns.length;
          for (var i = 0; i < len; i++) {
            var col = params.columns[i];
            if (col.dataIndex === priority.column.dataIndex) {
              priority.column = col;
              break;
            }
          }
        }
      }
      parentListView.cellIndex++;
    }
    cellColumnPriorities.push(priorities[i]);
  }
  cellColumnValues.cellColumn = parentListView.cellColumnIndex;
  parentListView.cellColumnIndex++;
  cellColumnValues.rowsToFill = rowsToFill;
  cellColumnValues.fillColumn = cellColumnConfig.fillColumn ? 1 : 0;
  cellColumnValues.fillCls = 'abp-list-view-cellColumn-fill';
  cellColumnValues.noFillCls = 'abp-list-view-cellColumn-nofill';
  cellColumnValues.justify = cellColumnConfig.horizontalAlign || 'left';
  cellColumnValues.align = cellColumnConfig.verticalAlign || 'left';
  cellColumnValues.flex = cellColumnConfig.flex || 1;
  cellColumnValues.includeLabel = includeLabel || false;
  cellColumnValues.cellColumnPriorities = cellColumnPriorities;
  cellColumnTpl.applyOut(cellColumnValues, out, parent);
  cellColumnValues.cellColumn = cellColumnValues.cellColumnPriorities = cellColumnValues.params = null;
  if (parentListView.cellIndex === parent.cells.length && parentListView.cellColumnIndex === templateConfig.cellColumns.length) {
    parentListView.cellIndex = 0;
    parentListView.cellColumnIndex = 0;
  }
}, renderCell:function(values, out, xIndex, parent) {
  var params = parent.params;
  var origCls = values.column.tdCls;
  values.column.tdCls = (origCls || '') + ' abp-list-view-field-value abp-list-view-field-value-' + xIndex;
  params.view.renderCell(values.column, params.record, params.recordIndex, params.rowIndex, values.column.fullColumnIndex - 1, out);
  values.column.tdCls = origCls;
}, renderAreaCell:function(values, out) {
  var cells = values.cells, cLength = cells.length;
  var letters = ['a', 'b', 'c', 'd', 'e'];
  for (var i = 0; i < cLength; i++) {
    var cell = cells[i], cellConfig = cell.config, horizontalAlign = cellConfig.horizontalAlign, verticalAlign = cellConfig.verticalAlign, colIdx = letters[cell.colIdx], rowIdx = cell.rowIdx;
    out.push('\x3ctd priority\x3d"' + i + '" data-index\x3d"' + cell.name + '" class\x3d"cell-placeholder abp-list-view-field-value abp-grid-cell-type-' + cell.xtype + '" style\x3d"grid-area: ' + (colIdx + rowIdx) + '; justify-self: ' + horizontalAlign + '; align-self: ' + verticalAlign + ';"\x3e\x3c/td\x3e');
  }
}, onTemplateChange:function(combo, newValue) {
  var me = this;
  me.setTemplate(newValue);
  if (me.setListSettings) {
    me.setListSettings();
  }
}, updatePriorities:function(columns) {
  var me = this, template = me.getTemplate(), columnApi = me.cmp.columnApi, length = columns.length, column, cell, text, listPriority, dataIndex, priority, noPriority = [], bodyPriorities = null, fullColumn, priorities = null;
  for (var i = 0; i < length; i++) {
    column = columns[i];
    column = column.colDef ? column.colDef : column;
    fullColumn = (columnApi ? columnApi.getColumn(column.field) : column) || column;
    dataIndex = column.dataIndex ? column.dataIndex : column.getDataIndex ? column.getDataIndex() : Ext.isString(column.field) ? column.field : null;
    text = column.text ? column.text : column.getText ? column.getText() : column.headerName;
    cell = column.getCell ? column.getCell() : null;
    if (cell) {
      if (cell.xtype === 'expandercell') {
        continue;
      }
    }
    listPriority = parseInt(ABP.util.LocalStorage.getForLoggedInUser(me.gridId + template + 'priority' + dataIndex));
    column.listPriority = Ext.isNumber(listPriority) ? listPriority : column.listPriority;
    priority = {listViewPlugin:me, fullColumnIndex:fullColumn.fullColumnIndex, column:fullColumn, fieldName:dataIndex, fieldLabel:text};
    if (Ext.isNumber(column.listPriority) || Ext.isString(column.listPriority)) {
      if (!priorities) {
        priorities = {};
      }
      priority.priority = column.listPriority;
      if (!priorities[column.listPriority]) {
        priorities[column.listPriority] = [];
      }
      priorities[column.listPriority].splice(0, 0, priority);
    } else {
      if (me.autoFillMain || me.autoFillBody) {
        noPriority.push(priority);
      }
    }
    if (Ext.isNumber(column.bodyPriority) || Ext.isString(column.bodyPriority)) {
      if (!bodyPriorities) {
        bodyPriorities = {};
      }
      priority.priority = column.bodyPriority;
      if (!bodyPriorities[column.bodyPriority]) {
        bodyPriorities[column.bodyPriority] = [];
      }
      bodyPriorities[column.bodyPriority].splice(0, 0, priority);
    }
  }
  if (noPriority.length > 0) {
    var noPriorityItem;
    var noPriorityCounter = 0;
    if (me.autoFillMain) {
      for (var i = 0; i < 15; i++) {
        if (priorities && !Ext.isEmpty(priorities[i])) {
          continue;
        } else {
          noPriorityItem = noPriority[noPriorityCounter];
          if (Ext.isEmpty(noPriorityItem)) {
            break;
          }
          if (!Ext.isEmpty(noPriorityItem.bodyPriority) && !me.allowBodyDuplication) {
            noPriorityCounter++;
            i--;
            continue;
          } else {
            if (!priorities) {
              priorities = {};
            }
            noPriorityItem.priority = i;
            if (!priorities[i]) {
              priorities[i] = [];
            }
            priorities[i].splice(0, 0, noPriorityItem);
            noPriorityCounter++;
          }
        }
      }
    }
    if (me.autoFillBody && noPriorityCounter < noPriority.length - 1) {
      var noPriorityCounter = 0;
      for (var i = 0; i < 10; i++) {
        if (bodyPriorities && !Ext.isEmpty(bodyPriorities[i])) {
          continue;
        } else {
          noPriorityItem = noPriority[noPriorityCounter];
          if (Ext.isEmpty(noPriorityItem)) {
            break;
          }
          if (!Ext.isEmpty(noPriorityItem.listPriority) && !me.allowMainDuplication) {
            noPriorityCounter++;
            i--;
            continue;
          } else {
            if (!bodyPriorities) {
              bodyPriorities = {};
            }
            noPriorityItem.priority = i;
            if (!bodyPriorities[i]) {
              bodyPriorities[i] = [];
            }
            bodyPriorities[i].splice(0, 0, noPriorityItem);
            noPriorityCounter++;
          }
        }
      }
    }
  }
  me.priorities = priorities;
  me.bodyPriorities = bodyPriorities;
}, destroy:function() {
  delete this.bodyPriorities;
  delete this.priorities;
  delete this.listTemplate;
  this.callParent(arguments);
}});
Ext.define('ABPControlSet.view.listview.ListViewRow', {extend:'Ext.grid.Row', xtype:'listviewrow', requires:['Ext.grid.plugin.RowExpander'], config:{cellsElementStyle:null}, setCellsElementStyle:function(style) {
  var me = this;
  if (!Ext.isEmpty(me.cellsElement) && !Ext.isEmpty(style)) {
    me.cellsElement.setStyle(style);
  }
}, element:{reference:'element', tag:'table', children:[{tag:'tr', reference:'cellsElement', className:Ext.baseCSSPrefix + 'cells-el'}]}, cellPlaceholderSelector:null, getCellForField:function(cells, fieldName) {
  var cell, column, length = cells.length;
  for (var i = 0; i < length; i++) {
    cell = cells[i];
    if (cell) {
      column = cell.getColumn();
      if (column.getDataIndex() === fieldName) {
        return cell;
      }
    }
  }
}, onAdded:function(grid) {
  var me = this, out = [], listViewPlugin = grid.listViewPlugin;
  me.callParent(arguments);
  if (listViewPlugin) {
    listViewPlugin.renderFullRow({record:null, rowIndex:null, recordIndex:null, cells:me.cells, cellsElement:me.cellsElement}, out, this);
    me.cellsElement.dom.innerHTML = out.join('');
    var cells = me.cells, rowExpander = grid.getPlugin('rowexpander'), placeholder, cell, fieldName, cellsElementDom = me.cellsElement.dom, placeholders = cellsElementDom.querySelectorAll('.' + me.cellPlaceholderSelector), length = placeholders.length;
    for (var i = 0; i < length; i++) {
      placeholder = placeholders[i];
      if (placeholder) {
        fieldName = placeholder.getAttribute('data-index');
        if (!Ext.isEmpty(fieldName)) {
          cell = me.getCellForField(cells, fieldName);
          if (cell) {
            placeholder.appendChild(cell.el.dom);
            cell.setRendered(true);
          }
        }
      }
    }
    if (rowExpander) {
      me.addColumn(rowExpander.getColumn());
    }
  } else {
    me.callParent(arguments);
  }
}, toggleCollapsed:function() {
  var me = this, collapsed = me.getCollapsed();
  this.setCollapsed(!collapsed);
  if (collapsed) {
    body = me.getBody();
    if (body) {
      if (body.isPainted() && body.el && body.el.dom && body.el.dom.scrollIntoViewIfNeeded) {
        Ext.defer(function() {
          body.el.dom.scrollIntoViewIfNeeded(false);
        }, 50);
      } else {
        body.on('painted', function() {
          if (body.el && body.el.dom && body.el.dom.scrollIntoViewIfNeeded) {
            body.el.dom.scrollIntoViewIfNeeded(false);
          }
        }, me);
      }
    }
  }
}, removeColumn:Ext.emptyFn, setColumnWidth:Ext.emptyFn, showColumn:Ext.emptyFn, hideColumn:Ext.emptyFn});
Ext.define('ABPControlSet.view.grid.plugin.ListView', {override:'ABPControlSet.base.view.grid.plugin.ListView', requires:['ABPControlSet.view.listview.ListViewRow'], cellPlaceholderSelector:'cell-placeholder', originalItemConfig:null, constructor:function(config) {
  config = config || {};
  var me = this, cmp = config.cmp;
  if (cmp && !(cmp instanceof ABPControlSet.base.view.grid.AGGrid)) {
    me.originalItemConfig = cmp.getItemConfig();
  }
  me.callParent([config]);
}, init:function() {
  var me = this;
  me.callParent(arguments);
  me.addSettings();
  if (me.showTitle) {
    me.toggleTool = Ext.widget({xtype:'tool', padding:'4px 8px 4px 8px', align:'right', iconCls:'icon icon-list-style-bullets', handler:this.toggleListView, scope:this});
    if (me.cmp.getTitleBar) {
      me.cmp.getTitleBar().add(me.toggleTool);
    } else {
      me.cmp.addTool(me.toggleTool);
    }
  }
}, addSettings:function() {
  var me = this, fullRow = me.getFullRow(), parentPanel = me.cmp;
  if (me.showTitle) {
    me.settingsTool = Ext.widget({xtype:'tool', align:'right', padding:'4px 8px 4px 8px', iconCls:'icon icon-gearwheels', handler:this.toggleListSettings, hidden:!fullRow, scope:this});
    if (parentPanel.getTitleBar) {
      parentPanel.getTitleBar().add(me.settingsTool);
    } else {
      parentPanel.addTool(me.settingsTool);
    }
  }
  var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
  me.listSettings = Ext.widget({xtype:'container', docked:'right', hidden:true, width:'100%', padding:4, layout:{type:'vbox', align:'stretch'}, cls:'abp-list-view-settings', listeners:{show:function(container) {
    container.down('#listOrder').setHideHeaders(true);
  }}, items:[{xtype:'abpcombobox', fieldLabel:'Template', labelAlign:'top', displayField:'display', valueField:'value', itemId:'templateCombo', forceSelection:true, listeners:{change:me.onTemplateChange, scope:me}, store:Ext.create('ABPControlSet.store.ListViewTemplates'), value:userTemplate || 'triData'}, {xtype:'tree', itemId:'listOrder', flex:1, scrollable:'y', store:Ext.create('Ext.data.TreeStore'), columns:[{xtype:'gridcolumn', dataIndex:'text', flex:1}], rootVisible:false}]});
  if (parentPanel.getHeaderContainer) {
    var header = parentPanel.getHeaderContainer();
    if (header.endColumnUpdate) {
      Ext.Function.interceptAfter(header, 'endColumnUpdate', me.setListSettings, me);
    }
  }
  parentPanel.insert(2, me.listSettings);
  me.setListSettings();
}, setListSettings:function() {
  var me = this, listSettings = me.listSettings, tree = listSettings.down('#listOrder'), treeStore = tree.getStore(), parentPanel = me.cmp, columns = parentPanel.getColumns(), text, field, listColumns = [];
  columns.forEach(function(column) {
    text = column.getText();
    text = (text || '').trim();
    field = column.getDataIndex();
    if (field) {
      listColumns.push({leaf:true, text:Ext.isEmpty(text) || text !== '\x26nbsp' ? field : text, field:field});
    }
  });
  treeStore.setRoot({expanded:true, children:listColumns});
}, renderCell:function(values, out, xIndex, parent) {
  out.push('\x3ctd priority\x3d"' + values.priority + '" data-index\x3d"' + values.fieldName + '" class\x3d"cell-placeholder abp-list-view-field-value abp-list-view-field-value-' + xIndex + '"\x3e\x3c/td\x3e');
}, renderAreaCell:function(values, out) {
  var cells = values.cells, cLength = cells.length;
  var letters = ['a', 'b', 'c', 'd', 'e'];
  for (var i = 0; i < cLength; i++) {
    var cell = cells[i], cellConfig = cell.config, horizontalAlign = cellConfig.horizontalAlign, verticalAlign = cellConfig.verticalAlign, spacing = cellConfig.spacing, colIdx = letters[cell.colIdx], rowIdx = cell.rowIdx;
    out.push('\x3ctd priority\x3d"' + i + '" data-index\x3d"' + cell.name + '" class\x3d"cell-placeholder abp-list-view-field-value abp-grid-cell-type-' + cell.xtype + '" style\x3d"grid-area: ' + (colIdx + rowIdx) + '; justify-self: ' + horizontalAlign + '; align-self: ' + verticalAlign + (Ext.isEmpty(spacing) ? ';"\x3e\x3c/td\x3e' : '; padding: ' + spacing + ';"\x3e\x3c/td\x3e'));
  }
}, doUpdateFullRow:function(fullRow) {
  var me = this, parentPanel = me.cmp;
  if (parentPanel) {
    var bodyEl = parentPanel.bodyElement, settingsTool = me.settingsTool, listSettings = me.listSettings, parentListViewTpl = parentPanel.config.__data.listView.template;
    parentPanel.setHideHeaders(fullRow);
    if (fullRow) {
      var columns = parentPanel.getColumns();
      me.updatePriorities(columns);
      var listTpl = me.listTemplate;
      var listItemConfig = {xtype:'listviewrow', cls:me.makeListViewClasses(me, listTpl, parentListViewTpl), style:me.makeListViewStyles(parentListViewTpl, columns), cellPlaceholderSelector:me.cellPlaceholderSelector, template:me.listTemplate, cellsElementStyle:listTpl.namedGridTemplate ? me.makeListViewStyles(parentListViewTpl, columns, true) : null};
      Ext.applyIf(listItemConfig, me.originalItemConfig);
      parentPanel.setItemConfig(listItemConfig);
    } else {
      if (listSettings) {
        listSettings.hide();
      }
      parentPanel.setItemConfig(me.originalItemConfig);
    }
    if (settingsTool) {
      settingsTool[fullRow ? 'show' : 'hide']();
    }
    parentPanel.toggleCls('abp-panel-list-view', fullRow);
    if (bodyEl) {
      bodyEl.toggleCls('abp-list-view', fullRow);
    }
    me.resetGrid(fullRow, false);
  }
}, makeListViewClasses:function(listView, listTpl, parentListViewTpl) {
  var baseCls = listView.listTemplateClsPreface + listView.getTemplate();
  if (!parentListViewTpl) {
    if (listTpl.cssGridTemplate || listTpl.namedGridTemplate) {
      baseCls += ' abp-list-view-template-grid-rows-' + (listTpl.rows ? listTpl.rows : 1) + '-columns-' + (listTpl.cols ? listTpl.cols : 1);
    }
    if (listTpl.flexGridTemplate) {
      baseCls += ' abp-list-view-template-grid-rows-' + (listTpl.rows ? listTpl.rows : 1) + '-columns-' + (listTpl.cols ? listTpl.cols : 1) + ' abp-flex-grid';
    }
  } else {
    if (listTpl.namedGridTemplate) {
      baseCls += ' abp-list-view-template-grid-rows-' + (parentListViewTpl.numRows ? parentListViewTpl.numRows : 1) + '-columns-' + (parentListViewTpl.cellColumns.length || 1);
    } else {
      if (listTpl.cssGridTemplate) {
        baseCls += ' abp-list-view-template-grid-rows-' + (parentListViewTpl.numRows ? parentListViewTpl.numRows : 1) + '-columns-' + parentListViewTpl.cellColumns.length;
      }
      if (listTpl.flexGridTemplate) {
        baseCls += ' abp-list-view-template-grid-rows-' + (parentListViewTpl.numRows ? parentListViewTpl.numRows : 1) + '-columns-' + parentListViewTpl.cellColumns.length + ' abp-flex-grid';
      }
    }
  }
  return baseCls;
}, makeListViewStyles:function(parentListViewTpl, columns, usingNamedGridAreas) {
  var me = this;
  if (!parentListViewTpl) {
    return null;
  } else {
    var styleObj = {};
    var cellColumns = parentListViewTpl.cellColumns;
    if (cellColumns) {
      var specifiedColumnWidths = [];
      var specifiedColumnCount = 0;
      var hasSpecifiedColumnWidth = false;
      var calculatedColString = '';
      var len = cellColumns.length;
      for (var cellColumnIdx = 0; cellColumnIdx < len; cellColumnIdx++) {
        if (cellColumns[cellColumnIdx].columnWidth) {
          if (cellColumns[cellColumnIdx].columnWidth === '100%') {
            cellColumns[cellColumnIdx].columnWidth = '1fr';
          }
          hasSpecifiedColumnWidth = true;
          specifiedColumnWidths.push(cellColumns[cellColumnIdx].columnWidth);
          specifiedColumnCount++;
          calculatedColString += cellColumns[cellColumnIdx].columnWidth + ' ';
        } else {
          specifiedColumnWidths.push('auto');
        }
      }
      if (hasSpecifiedColumnWidth) {
        var templateColumns = me.calculateColumnWidths(specifiedColumnWidths, calculatedColString, specifiedColumnCount);
        if (templateColumns) {
          if (!styleObj) {
            styleObj = {};
          }
          styleObj['grid-template-columns'] = templateColumns;
        }
      }
      styleObj['grid-template-areas'] = me.calculateGridTemplateAreas(cellColumns, parentListViewTpl);
      if (!Ext.isEmpty(parentListViewTpl.rowSpacing)) {
        me.setCellRowSpacing(styleObj, parentListViewTpl.rowSpacing);
      }
      if (!Ext.isEmpty(parentListViewTpl.dataRowSpacing)) {
        me.setDataRowSpacing(styleObj, parentListViewTpl.dataRowSpacing);
      }
      me.makeColumnCellStyles(cellColumns, columns, specifiedColumnWidths, cellColumns.length, parentListViewTpl.numRows);
      return styleObj ? styleObj : null;
    } else {
      return null;
    }
  }
}, setDataRowSpacing:function(styleObj, spacing) {
  var sides = spacing.split(' ');
  var top, bottom, left, right;
  switch(sides.length) {
    case 1:
      top = sides[0];
      right = sides[0];
      bottom = sides[0];
      left = sides[0];
      break;
    case 2:
      top = sides[0];
      right = sides[1];
      bottom = sides[0];
      left = sides[1];
      break;
    case 3:
      top = sides[0];
      right = sides[1];
      bottom = sides[2];
      left = sides[1];
      break;
    case 4:
      top = sides[0];
      right = sides[1];
      bottom = sides[2];
      left = sides[3];
      break;
  }
  styleObj['margin-left'] = left + 'px';
  styleObj['margin-right'] = right + 'px';
  styleObj['margin-top'] = top + 'px';
  styleObj['margin-bottom'] = bottom + 'px';
}, setCellRowSpacing:function(styleObj, spacing) {
  var sides = spacing.split(' ');
  var top, bottom, left, right;
  switch(sides.length) {
    case 1:
      top = sides[0];
      right = sides[0];
      bottom = sides[0];
      left = sides[0];
      break;
    case 2:
      top = sides[0];
      right = sides[1];
      bottom = sides[0];
      left = sides[1];
      break;
    case 3:
      top = sides[0];
      right = sides[1];
      bottom = sides[2];
      left = sides[1];
      break;
    case 4:
      top = sides[0];
      right = sides[1];
      bottom = sides[2];
      left = sides[3];
      break;
  }
  styleObj['padding-left'] = left + 'px';
  styleObj['padding-right'] = right + 'px';
  styleObj['padding-top'] = top + 'px';
  styleObj['padding-bottom'] = bottom + 'px';
  styleObj['row-gap'] = parseInt(top) + parseInt(bottom) + 'px';
}, calculateGridTemplateAreas:function(cellColumns, parentListViewTpl) {
  var me = this;
  var templateRowString = '';
  var sLength = cellColumns.length;
  var cLength = parentListViewTpl.numRows;
  var grid = [];
  var toOverwrite = {};
  var letters = ['a', 'b', 'c', 'd', 'e'];
  for (var i = 0; i < sLength; i++) {
    var cellColumn = cellColumns[i];
    var cells = cellColumn.cells;
    if (cellColumn.fillColumn === true) {
      for (var rowIdx = 1; rowIdx <= cLength; rowIdx++) {
        toOverwrite[letters[i] + rowIdx] = letters[i] + 1;
      }
    }
    for (var j = 0; j < cLength; j++) {
      var row;
      if (i === 0) {
        row = [];
        grid.push(row);
      } else {
        row = grid[j];
      }
      if (cells) {
        cell = Ext.Array.findBy(cells, function(c) {
          return c.rowNumber === j;
        });
        if (!Ext.isEmpty(cell)) {
          if (!Ext.isEmpty(cell.colSpan)) {
            for (var k = 1; k <= cell.colSpan; k++) {
              if (Ext.isEmpty(toOverwrite[letters[i + k - 1] + (j + 1)])) {
                toOverwrite[letters[i + k - 1] + (j + 1)] = letters[i] + (j + 1);
              }
            }
          }
          if (!Ext.isEmpty(cell.rowSpan)) {
            for (var k = 1; k <= cell.rowSpan; k++) {
              if (Ext.isEmpty(toOverwrite[letters[i] + (j + 1 + k - 1)])) {
                toOverwrite[letters[i] + (j + 1 + k - 1)] = letters[i] + (j + 1);
              }
            }
          }
        }
      }
      if (!toOverwrite[letters[i] + (j + 1)]) {
        row.push(letters[i] + (j + 1));
      } else {
        row.push(toOverwrite[letters[i] + (j + 1)]);
      }
    }
  }
  for (var i = 0; i < grid.length; i++) {
    templateRowString += me.joinTemplateRowArrayToString(grid[i]);
  }
  return templateRowString;
}, joinTemplateRowArrayToString:function(row) {
  return '"' + row.join(' ') + '"';
}, calculateColumnWidths:function(specifiedColumnWidths, calculatedColString, specifiedColumnCount) {
  var me = this;
  var templateColumnString = '';
  var contentSpecified = false;
  if (calculatedColString.indexOf('content') > -1) {
    contentSpecified = true;
    if (calculatedColString.indexOf('px') > -1 || calculatedColString.indexOf('%') > -1) {
      ABP.util.Logger.logError('Cannot specify both match content ("max-content" or "min-content" for width) and numeric column widths in list view row');
      return false;
    }
  }
  var len = specifiedColumnWidths.length;
  for (var colIdx = 0; colIdx < len; colIdx++) {
    if (contentSpecified) {
      templateColumnString += specifiedColumnWidths[colIdx] + ' ';
    } else {
      if (specifiedColumnWidths[colIdx] === 'auto') {
        var columnWidthString = '1fr ';
        specifiedColumnWidths[colIdx] = columnWidthString;
        templateColumnString += columnWidthString;
      } else {
        templateColumnString += specifiedColumnWidths[colIdx] + ' ';
      }
    }
  }
  return templateColumnString;
}, makeColumnCellStyles:function(cellColumns, cells, columnWidths, numColumns, numRows) {
  var me = this, cellIdx = 0;
  for (var i = 0; i < numColumns; i++) {
    var len = 0;
    if (cellColumns[i].cells) {
      len = cellColumns[i].cells.length;
    } else {
      len = numRows;
    }
    for (var j = 0; j < len; j++) {
      var cellConfig = null;
      if (cellColumns[i].cells) {
        cellConfig = cellColumns[i].cells[j];
      }
      if (cellConfig) {
        if (cellConfig.stretch) {
          if (!cells[cellIdx].config.cell.cls) {
            cells[cellIdx].config.cell.cls = 'abp-forms-width-inherit';
          } else {
            cells[cellIdx].config.cell.cls += ' abp-forms-width-inherit';
          }
        }
      }
      if (cellColumns[i].fillColumn === true) {
        cells[cellIdx].config.cell.minHeight = Math.max(numRows * 1.1, 2) + 'rem';
      }
      if (!Ext.isEmpty(cellColumns[i].columnWidth) && cellColumns[i].columnWidth.indexOf('px') > -1) {
        cells[cellIdx].config.cell.width = cellColumns[i].columnWidth;
      } else {
        cells[cellIdx].config.cell.width = null;
      }
      if (!Ext.isEmpty(cellColumns[i].horizontalAlign)) {
        cells[cellIdx].config.cell.horizontalAlign = cellColumns[i].horizontalAlign;
      } else {
        cells[cellIdx].config.cell.horizontalAlign = 'left';
      }
      if (!Ext.isEmpty(cellColumns[i].verticalAlign)) {
        cells[cellIdx].config.cell.verticalAlign = cellColumns[i].verticalAlign;
      } else {
        cells[cellIdx].config.cell.verticalAlign = 'center';
      }
      if (!Ext.isEmpty(cellConfig) && !Ext.isEmpty(cellConfig.spacing)) {
        cells[cellIdx].config.cell.spacing = me.calculateCellSpacing(cellConfig.spacing);
      }
      if (!Ext.isEmpty(cellConfig) && !Ext.isEmpty(cellConfig.rowNumber)) {
        cells[cellIdx].config.cell.rowIdx = cellConfig.rowNumber + 1;
      } else {
        cells[cellIdx].config.cell.rowIdx = j + 1;
      }
      cells[cellIdx].config.cell.colIdx = i;
      cellIdx++;
      if (cellIdx >= cells.length) {
        break;
      }
    }
    if (cellIdx >= cells.length) {
      break;
    }
  }
}, calculateCellSpacing:function(spacing) {
  var parts = spacing.split(' ');
  var ret = '';
  for (var i in parts) {
    ret += parts[i] + 'px ';
  }
  return ret;
}, doUpdateTemplate:function() {
  var me = this, parentPanel = me.cmp, fullRow = me.getFullRow();
  if (parentPanel && parentPanel.rendered) {
    if (fullRow) {
      var columns = parentPanel.getColumns();
      me.updatePriorities(columns);
    }
    me.resetGrid(fullRow, true);
  }
}, resetGrid:function(fullRow, refresh) {
  var me = this, parentPanel = me.cmp;
  if (parentPanel) {
    parentPanel.setVariableHeights(fullRow);
    parentPanel.refresh();
  }
}, destroy:function() {
  delete this.listSettings;
  delete this.toggleTool;
  delete this.settingsTool;
  this.callParent(arguments);
}});
Ext.define('ABPControlSet.base.view.grid.plugin.AGListView', {extend:'ABPControlSet.base.view.grid.plugin.ListView', alias:'plugin.aglistview', init:function(parentPanel) {
  var me = this;
  me.callParent(arguments);
  me.mon(parentPanel, {beforeembed:me.onBeforeEmbed, scope:me});
}, addSettings:Ext.emptyFn, onBeforeEmbed:function(panel, gridOptions) {
  if (gridOptions) {
    var me = this;
    var components = gridOptions.components || {};
    var sideBar = gridOptions.sideBar;
    if (sideBar !== false) {
      var ListViewSettingsToolPanel = function() {
      };
      var sideBarConfig = {toolPanels:Ext.isObject(sideBar) ? sideBar.toolPanels || [] : []};
      sideBar = sideBar === true ? 'columns' : sideBar;
      if (Ext.isString(sideBar)) {
        sideBarConfig.defaultToolPanel = sideBar;
        sideBarConfig.toolPanels.push(sideBar);
      }
      var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
      ListViewSettingsToolPanel.prototype.init = function(params) {
        me.listSettings = Ext.widget({xtype:'container', padding:4, hidden:true, cls:'abp-list-view-settings', layout:{type:'vbox', align:'stretch'}, listeners:{el:{painted:{fn:function(el) {
          el.component.setSize('100%', '100%');
          el.component.updateLayout();
          el.component.down('#listOrder').setHideHeaders(true);
        }, single:true}}}, items:[{xtype:'abpcombobox', fieldLabel:'Template', labelAlign:'top', displayField:'display', valueField:'value', itemId:'templateCombo', forceSelection:true, listeners:{change:me.onTemplateChange, scope:me}, store:Ext.create('ABPControlSet.store.ListViewTemplates'), value:userTemplate || 'triData'}, {xtype:Ext.toolkit === 'classic' ? 'treepanel' : 'tree', itemId:'listOrder', flex:1, scrollable:'y', hideHeaders:true, store:Ext.create('Ext.data.TreeStore'), columns:[{xtype:'gridcolumn', 
        dataIndex:'text', flex:1}], listeners:{drop:me.onListNodeDrop, scope:me}, viewConfig:Ext.toolkit === 'classic' ? {plugins:{treeviewdragdrop:{containerScroll:true}}, getRowClass:me.getRowClass.bind(me)} : undefined, rootVisible:false}], renderTo:Ext.getBody()});
        params.api.addEventListener('gridColumnsChanged', me.setListSettings.bind(me));
      };
      ListViewSettingsToolPanel.prototype.getGui = function() {
        me.listSettings.show();
        return me.listSettings.el.dom;
      };
      sideBarConfig.toolPanels.push({id:'listViewSettings', labelDefault:'List View', labelKey:'listView', iconKey:'list-view', toolPanel:ListViewSettingsToolPanel});
    }
    Ext.apply(gridOptions, {embedFullWidthRows:true, getRowStyle:me.getRowStyle.bind(me), sideBar:sideBarConfig, components:components, embedFullWidthRows:true, getRowHeight:me.getRowHeight.bind(me), groupUseEntireRow:true, groupRowRenderer:me.groupRowRenderer.bind(me), fullWidthCellRenderer:me.fullWidthRenderer.bind(me), isFullWidthCell:me.isFullWidthCell.bind(me)});
  }
}, setListSettings:function(params) {
  if (this.listSettings) {
    var me = this, columnApi = me.cmp.columnApi, store = this.listSettings.down('#listOrder').getStore(), columns = columnApi.getAllColumns(), text, listColumns = [];
    columns.forEach(function(column) {
      text = column.colDef.headerName;
      text = (text || '').trim();
      if (column.colDef.field) {
        listColumns.push({leaf:true, text:Ext.isEmpty(text) ? column.colDef.field : text, field:column.colDef.field});
      }
    });
    store.setRoot({expanded:true, children:listColumns});
  }
}, isFullWidthCell:function(rowNode) {
  return this.getFullRow();
}, getRowStyle:function(params) {
  var me = this, fullRow = me.getFullRow();
  if (fullRow) {
    return {display:'table'};
  }
}, getRowHeight:function(node) {
  var me = this, template = me.getTemplate(), fullRow = me.getFullRow();
  if (fullRow) {
    if (template === 'duoImage') {
      return 80;
    } else {
      var el = node.api.gridPanel.getGui(), width = el ? el.clientWidth : 0;
      if (width < 700) {
        return 240;
      } else {
        if (width < 900) {
          return 180;
        } else {
          return 105;
        }
      }
    }
  } else {
    return 32;
  }
}, fullWidthRenderer:function(params) {
  var me = this, out = [], template = me.getTemplate(), rowComp = params.api.rowRenderer.rowCompsByIndex[params.rowIndex];
  Ext.apply(params, {record:params.node, recordIndex:params.rowIndex, rowComp:rowComp});
  me.renderFullRow(params, out, params);
  var tr = document.createElement('tr');
  tr.className = (tr.className || '') + ' abp-full-width-list-row ' + me.listTemplateClsPreface + template;
  tr.innerHTML = out.join('');
  var cellComps = rowComp.cellComps;
  var cellCompsArray = Object.values ? Object.values(cellComps) : Object.keys(cellComps).map(function(e) {
    return cellComps[e];
  });
  rowComp.callAfterRowAttachedOnCells(cellCompsArray, tr);
  return tr;
}, groupRowRenderer:function(params) {
}, renderCell:function(values, out, xIndex, parent) {
  var column = values.column, params = parent.params, eGridCell = params.eGridCell, rowComp = params.rowComp;
  var cellTemplates = [];
  rowComp.createNewCell(column, eGridCell, cellTemplates, []);
  if (cellTemplates.length > 0) {
    var cellTpl = cellTemplates.join('');
    var withoutFirstDiv = cellTpl.replace('div', 'td');
    var start = withoutFirstDiv.lastIndexOf('div');
    var lastTd = withoutFirstDiv.substring(start);
    lastTd = lastTd.replace('div', 'td');
    var withoutLastDiv = withoutFirstDiv.substring(0, start);
    out.push((withoutLastDiv + lastTd).replace('class\x3d"', 'class\x3d"abp-list-view-field-value abp-list-view-field-value-' + xIndex + ' '));
  }
}, doUpdateFullRow:function(fullRow) {
  var me = this, parentPanel = me.cmp;
  if (parentPanel && parentPanel.gridApi) {
    parentPanel.toggleCls('abp-ag-list-view', fullRow);
    parentPanel.gridApi.headerRootComp.setVisible(!fullRow);
    me.resetGrid(fullRow);
  }
}, doUpdateTemplate:function() {
  var me = this;
  if (me.cmp && me.cmp.rendered) {
    this.resetGrid(this.getFullRow());
  }
}, resetGrid:function(fullRow) {
  var me = this, parentPanel = me.cmp;
  if (parentPanel) {
    if (fullRow) {
      me.updatePriorities(parentPanel.columnApi.getAllColumns());
    }
    parentPanel.gridApi.resetRowHeights();
    parentPanel.gridApi.redrawRows();
  }
}});
Ext.define('ABPControlSet.view.grid.plugin.AGListView', {override:'ABPControlSet.base.view.grid.plugin.AGListView'});
Ext.define('ABPControlSet.base.view.grid.AGGrid', {extend:'Ext.Panel', requires:['ABPControlSet.base.view.grid.plugin.AGListView'], layout:'fit', agGrid:null, columnDefs:null, rowData:null, gridApi:null, isUsingSenchaStore:false, listOnTop:false, listView:false, gridHeight:null, cls:['ag-theme-balham'], bodyCls:'abp-ag-grid-body', border:true, config:{store:null}, constructor:function(config) {
  config = config || {};
  config.items = [{xtype:'component', itemId:'agGrid', style:{maxWidth:'calc(100% - 1px)', height:'100%', minHeight:Ext.isNumber(config.gridHeight) ? config.gridHeight + 'px' : Ext.isString(config.gridHeight) ? config.gridHeight : '100%'}}];
  config.listView = Ext.isBoolean(config.listView) ? config.listView : this.listView === false ? false : true;
  if (config.listView) {
    config.plugins = config.plugins || {};
    config.plugins.aglistview = config.plugins.aglistview || true;
  }
  config.store = Ext.create('ABPControlSet.store.AGGrid');
  this.callParent([config]);
}, beginEmbed:function() {
  var me = this, agGridComponent = me.down('#agGrid'), hidden = me.getHidden(), embeddableEl = agGridComponent.getEl ? agGridComponent.getEl() : agGridComponent.el || agGridComponent.element;
  if (hidden) {
    me.on({show:me.beginEmbed, single:true});
    return;
  }
  if (embeddableEl) {
    me.on('destroy', me.destroyAGGrid);
    me.embeddedEl = embeddableEl;
    if (typeof agGrid === 'object') {
      var eGridDiv = document.querySelector('#' + embeddableEl.id);
      var gridOptions = me.getOptions() || {};
      gridOptions.parentComponent = me;
      gridOptions.onCellValueChanged = me.changeCellValue;
      gridOptions.suppressLoadingOverlay = true;
      gridOptions.suppressNoRowsOverlay = true;
      if (me.fireEvent('beforeembed', me, gridOptions) !== false) {
        me.agGrid = new agGrid.Grid(eGridDiv, gridOptions);
        me.gridApi = gridOptions.api;
        me.columnApi = gridOptions.columnApi;
        var store = me.getStore();
        if (store instanceof ABPControlSet.store.AGGrid) {
          store.setColumnApi(me.columnApi);
          store.setGridApi(me.gridApi);
        }
        me.fireEvent('embed', me, me.agGrid, me.gridApi, me.columnApi);
      }
    } else {
      embeddableEl.setHtml('Necessary files to use the ag-grid were not initialized properly. Please review the AGGrid component documentation for details on how to include the proper files.');
    }
    me.afterEmbed(me.agGrid, me.gridApi, me.columnApi);
  }
}, afterEmbed:Ext.emptyFn, embeddedEl:null, copyDataFromStore:function() {
  var me = this;
  var store = me.getStore();
  var rowData = store.getData().items.map(function(x) {
    return x.data;
  });
  var copyOfRowData = [];
  var i = 0;
  for (; i < rowData.length; i++) {
    copyOfRowData[i] = JSON.parse(JSON.stringify(rowData[i]));
  }
  return copyOfRowData;
}, changeCellValue:function(rowToChange) {
  var me = this.parentComponent;
  var store = me.getStore();
  if (store) {
    var record = store.findRecord('id', rowToChange.data.id);
    if (record) {
      record.set(rowToChange.data);
      me.fireEvent(ABPControlSet.common.types.Events.AGGridUpdate, me, record);
    }
  } else {
    me._update(null, rowToChange.data, null, null, null, null);
  }
}, addRowValue:function(rowToAdd) {
  var me = this;
  var store = me.getStore();
  var record = Ext.create('Ext.data.Model', rowToAdd.data);
  if (store) {
    store.add(record);
    me.fireEvent(ABPControlSet.common.types.Events.AGGridAdd, me, me.up('container'), store.indexOf(record));
  } else {
    me._add(null, record, null, null);
  }
}, removeRowValue:function(rowsToRemove) {
  var me = this;
  var store = me.getStore();
  var data = rowsToRemove.data.map(function(x) {
    return x.id;
  });
  var i = 0;
  var record;
  if (store) {
    for (; i < data.length; i++) {
      record = store.findRecord('id', data[i]);
      store.remove(record);
    }
    me.fireEvent(ABPControlSet.common.types.Events.AGGridRemove, me, me.up('container'), store.indexOf(record));
  } else {
    me._remove(null, rowsToRemove, null, null, null);
  }
}, getOptions:Ext.emptyFn, onChange:Ext.emptyFn, destroyAGGrid:function() {
  var me = this;
  delete me.embeddedEl;
  me.agGrid.destroy();
  delete me.agGrid;
  delete me.gridApi;
  delete me.columnApi;
}});
Ext.define('ABPControlSet.base.mixin.Column', {extend:'Ext.Mixin', mixinConfig:{id:'abpcolumn'}, config:{fieldFormatter:null, fieldFormat:null}, constructor:function() {
  this.callParent(arguments);
  this.hookFormatRenderer();
}, hookFormatRenderer:Ext.EmptyFn, columnFormatRenderer:Ext.emptyFn});
Ext.define('ABPControlSet.mixin.Column', {override:'ABPControlSet.base.mixin.Column', hookFormatRenderer:function() {
  var cell = this.getCell(), columnRenderer = this.getRenderer ? this.getRenderer() : this.renderer, cellRenderer = cell ? cell.getRenderer ? cell.getRenderer() : cell.renderer : null;
  if (!columnRenderer && !cellRenderer) {
    if (cell) {
      if (cell.setRenderer) {
        cell.setRenderer(this.columnFormatRenderer);
      } else {
        cell.renderer = this.columnFormatRenderer;
      }
    } else {
      this.setRenderer(this.columnFormatRenderer);
    }
  }
}, columnFormatRenderer:function(value, record, dataIndex, cell, column) {
  var fieldFormatter = column.getFieldFormatter(), fieldFormat = column.getFieldFormat();
  if (Ext.isFunction(fieldFormatter)) {
    return fieldFormatter(column, fieldFormat, (Ext.isEmpty(value) ? '' : value).toString(), false, value);
  } else {
    return value;
  }
}});
Ext.define('ABPControlSet.base.view.grid.Column', {extend:'Ext.grid.column.Column', xtype:'abpcolumn', requires:['ABPControlSet.base.mixin.Column'], mixins:['ABPControlSet.base.mixin.Column'], constructor:function(config) {
  config = config || {};
  this.callParent([config]);
  this.mixins.abpcolumn.constructor.call(this);
}});
Ext.define('ABPControlSet.common.Constants', {statics:{COLUMN_WIDTH_SAMPLE_PERCENTAGE:0.05, MINIMUM_COLUMN_WIDTH:40, COLUMN_HEADER_RIGHT_ALIGN_PADDING:6, COLUMN_HEADER_REQUIRED_PADDING:12, COLUMN_HEADER_EXTRA_PADDING:4, COLUMN_MENU_TRIGGER_PADDING:15, COLUMN_SORT_ARROW_PADDING:15, COLUMN_FILTER_ICON_PADDING:10, RESPONSIVE_SNAPPOINT_WIDTH_1:510, MAP_URL_FORMAT_STRING:'https://www.google.com/maps/search/?api\x3d1\x26query\x3d{0}'}});
Ext.define('ABPControlSet.base.view.grid.plugin.Grid', {extend:'Ext.plugin.Abstract', requires:['ABPControlSet.common.Constants'], id:'abpgrid', alias:'plugin.abpgrid', getTableView:Ext.emptyFn, getHeaderContainer:Ext.emptyFn, getNecessaryCells:Ext.emptyFn, sizeToContent:function() {
  var grid = this.cmp;
  var recordsPerPage = grid.recordsPerPage;
  if (grid.recordsPerPageSizing && Ext.isNumber(recordsPerPage) && !grid.hidden && !grid.destroyed && !grid.destroying) {
    var store = grid.getStore();
    var tableView = this.getTableView();
    if (store && tableView) {
      var total = store.isBufferedStore ? store.getTotalCount() : store.getCount();
      var currentCount = store.isBufferedStore ? store.data.getCount() : store.getCount();
      var currentRecords = total < currentCount ? currentCount : total;
      var scrollReserve = 0;
      var recordCalc = recordsPerPage;
      var currentRecordCalc = grid.currentRecordsPerPageCalc;
      if (recordsPerPage > currentRecords) {
        recordCalc = currentRecords;
      }
      if (recordCalc === currentRecordCalc) {
        return;
      }
      if (grid.fireEvent('beforesizetocontent', grid) !== false) {
        var scrollbarSize = Ext.getScrollbarSize(true);
        if (scrollbarSize) {
          scrollReserve = scrollbarSize.height || 0;
        }
        grid.fireEvent('beforeheightsizetocontent', grid);
        grid.setHeight(null);
        var rowHeight = 22;
        if (grid.rowLines) {
          rowHeight += 1;
        }
        var height = Math.max(recordCalc, 1) * rowHeight + scrollReserve;
        tableView.setMinHeight(scrollReserve + rowHeight);
        tableView.setHeight(height);
        grid.currentRecordsPerPageCalc = recordCalc;
      }
    }
  }
}, sizeColumnsToContent:function(defer, nodes) {
  var grid = this.cmp;
  if (grid.columnSizing) {
    defer = defer || false;
    if (!defer) {
      var view = this.getTableView();
      if (view) {
        var viewBody = view.body;
        var viewBodyDom = viewBody ? viewBody.dom : null;
        if (!viewBodyDom || viewBodyDom.children && viewBodyDom.children.length === 0) {
          defer = true;
        } else {
          var headerCt = view.headerCt;
          var headerCtEl = headerCt ? headerCt.el : null;
          var targeEl = headerCtEl ? headerCtEl.query('.x-box-target')[0] : null;
          if (!targeEl || targeEl.children && targeEl.children.length === 0) {
            defer = true;
          }
        }
      }
    }
    if (defer) {
      Ext.defer(this.doSizeColumnsToContent, 1, this, [nodes]);
    } else {
      this.doSizeColumnsToContent(nodes);
    }
  }
}, doSizeColumnsToContent:function(nodes) {
  var grid = this.cmp;
  var headerCt = this.getHeaderContainer();
  if (headerCt && !grid.hidden && (!grid.destroyed && !grid.destroying)) {
    var view = this.getTableView();
    if (grid.fireEvent('beforesizecolumnstocontent', grid) !== false) {
      var columns = headerCt.query('gridcolumn');
      var length = columns.length;
      var column;
      var width;
      var nearestGrid;
      var nearestView;
      var calculatedColumns = [];
      var previousMaxContentWidth;
      columns.reverse();
      for (var i = 0; i < length; i++) {
        column = columns[i];
        if (column.isVisible() && !column.flex) {
          if (view.isLockingView) {
            nearestGrid = column.up('grid');
            nearestView = nearestGrid ? nearestGrid.getView ? nearestGrid.getView() : nearestGrid : null;
          } else {
            nearestView = view;
          }
          if (nearestView) {
            previousMaxContentWidth = column.__maxContentWidth;
            column.__maxContentWidth = this.getContentWidth(nearestView.el, column, nodes);
            if (column.__maxContentWidth === false) {
              if (Ext.isFunction(nearestView.getMaxContentWidth)) {
                column.__maxContentWidth = nearestView.getMaxContentWidth(column);
              }
            }
            if (previousMaxContentWidth != column.__maxContentWidth) {
              calculatedColumns.push(column);
            }
          }
        }
      }
      var calculatedLength = calculatedColumns.length;
      var columnsUpdated = false;
      for (var i = 0; i < calculatedLength; i++) {
        column = calculatedColumns[i];
        if (column.isVisible() && !column.flex) {
          width = column.__maxContentWidth;
          if (Ext.isNumber(column.minColWidth) && width < column.minColWidth) {
            width = column.minColWidth;
          } else {
            if (Ext.isNumber(column.maxColWidth) && width > column.maxColWidth) {
              width = column.maxColWidth;
            }
          }
          column.greatestWidth = column.greatestWidth || 0;
          if (width > column.greatestWidth) {
            if (columnsUpdated === false) {
              grid.fireEvent('beforecolumnsupdated', grid);
              columnsUpdated = true;
            }
            column.greatestWidth = width;
            column.setWidth(width);
          }
        }
      }
      if (columnsUpdated === true) {
        grid.fireEvent('aftercolumnsupdated', grid);
      }
    }
  }
}, getContentWidth:function(viewEl, header, nodes) {
  var cells = this.getNecessaryCells(viewEl, header, nodes);
  var usePrecise;
  if (Ext.isEmpty(usePrecise)) {
    usePrecise = Ext.os.deviceType === 'Desktop';
  }
  var maxWidth = 0, constants = ABPControlSet.common.Constants, pixelPerChar = 8, firstCell = cells[0];
  if (firstCell) {
    if (Ext.isEmpty(firstCell.innerText) && firstCell.innerHTML) {
      return false;
    } else {
      var cellEl = Ext.fly(firstCell);
      if (cellEl) {
        var textMetric = new Ext.util.TextMetrics(firstCell);
        var paddingLeft = parseInt(cellEl.getStyle('padding-left'), 10) || 0;
        var paddingRight = parseInt(cellEl.getStyle('padding-right'), 10) || 0;
        var paddingWidth = paddingRight + paddingLeft;
        var widestCellTexts = [];
        var leastGreatestCharLength = 0;
        var charLength;
        var length = cells.length;
        var string;
        var maxSampleCells = Math.ceil(length * constants.COLUMN_WIDTH_SAMPLE_PERCENTAGE);
        for (var i = 0; i < length; i++) {
          string = cells[i].innerText;
          charLength = string.length;
          if (charLength > leastGreatestCharLength) {
            if (maxSampleCells > widestCellTexts.length) {
              widestCellTexts.push(string);
            } else {
              var indexToReplace;
              for (var j = 0; j < widestCellTexts.length; j++) {
                if (leastGreatestCharLength === 0 || widestCellTexts[j].length === leastGreatestCharLength) {
                  indexToReplace = j;
                }
              }
              widestCellTexts[indexToReplace] = string;
            }
            leastGreatestCharLength = 0;
            for (var j = 0; j < widestCellTexts.length; j++) {
              if (leastGreatestCharLength === 0 || widestCellTexts[j].length < leastGreatestCharLength) {
                leastGreatestCharLength = widestCellTexts[j].length;
              }
            }
          }
        }
        var max = Math.max;
        var cellWidth;
        var maxSampleLength = widestCellTexts.length > maxSampleCells ? maxSampleCells : widestCellTexts.length;
        if (!usePrecise) {
          pixelPerChar = textMetric.getWidth('A');
          for (var i = 0; i < maxSampleLength; i++) {
            cellWidth = widestCellTexts[i].length * pixelPerChar + paddingWidth;
            maxWidth = max(maxWidth, cellWidth);
          }
        } else {
          for (var i = 0; i < maxSampleLength; i++) {
            cellWidth = textMetric.getWidth(Ext.htmlEncode(widestCellTexts[i])) + paddingWidth;
            maxWidth = max(maxWidth, cellWidth);
          }
        }
        Ext.destroy(textMetric);
      }
    }
  }
  if (header.el) {
    var headerWidth = header.allowBlank === false ? constants.COLUMN_HEADER_REQUIRED_PADDING : constants.COLUMN_HEADER_EXTRA_PADDING;
    var headerTextMetric = new Ext.util.TextMetrics(header.el);
    headerWidth += headerTextMetric.getWidth(header.text) || 0;
    Ext.destroy(headerTextMetric);
    if (header.align === 'right') {
      headerWidth += constants.COLUMN_HEADER_RIGHT_ALIGN_PADDING;
    }
    if (header.allowFilter) {
      var filterValue = header.getFilterValue();
      if (!Ext.isEmpty(filterValue)) {
        headerWidth += constants.COLUMN_FILTER_ICON_PADDING;
      }
    }
    if (!Ext.isEmpty(header.sortState)) {
      headerWidth += constants.COLUMN_SORT_ARROW_PADDING;
    }
    var maxWidthWithTriggerBuffer = header.triggerBuffer ? maxWidth + header.triggerBuffer : maxWidth;
    if (!header.menuDisabled) {
      headerWidth += constants.COLUMN_MENU_TRIGGER_PADDING;
    }
    maxWidth = maxWidthWithTriggerBuffer < headerWidth ? headerWidth : maxWidthWithTriggerBuffer;
  }
  return maxWidth < constants.MINIMUM_COLUMN_WIDTH ? constants.MINIMUM_COLUMN_WIDTH : maxWidth;
}});
Ext.define('ABPControlSet.view.grid.plugin.Grid', {override:'ABPControlSet.base.view.grid.plugin.Grid', init:function(grid) {
  if (grid.columnSizing || grid.recordsPerPageSizing) {
    var view = this.getTableView();
    view.addListener({painted:function() {
      if (!this.destroyed) {
        this.sizeColumnsToContent(false);
      }
    }, refresh:function() {
      if (!this.destroyed) {
        this.sizeColumnsToContent(false);
      }
    }, scope:this});
  }
}, getNecessaryCells:function(viewEl, header, nodes) {
  return header.getCells();
}, getTableView:function() {
  return this.cmp;
}, getHeaderContainer:function() {
  if (!this.destroyed) {
    return this.cmp.getHeaderContainer();
  }
}});
Ext.define('ABPControlSet.base.mixin.Component', {extend:'Ext.Mixin', requires:['ABPControlSet.base.view.contextmenu.plugin.ContextMenu'], config:{responsiveWidth:null, backgroundColor:null, foregroundColor:null}, mixinConfig:{id:'abpcomponent'}, constructor:function(config) {
  config = config || {};
  if (config.contextMenu) {
    this.addCSPlugin(config, 'abpcontextmenu');
  }
  this.callParent([config]);
}, getContextMenuData:Ext.emptyFn, addCSPlugin:function(config, pluginType) {
  if (config) {
    config.plugins = config.plugins || {};
    if (Ext.isObject(config.plugins) && !config.plugins[pluginType]) {
      config.plugins[pluginType] = pluginType;
    } else {
      if (Ext.isArray(config.plugins) && !config.plugins.indexOf(pluginType) > -1) {
        config.plugins.push(pluginType);
      }
    }
  }
}, removeCSPlugin:function(config, pluginType) {
  if (config) {
    if (Ext.isObject(config.plugins) && config.plugins[pluginType]) {
      delete config.plugins[pluginType];
    } else {
      if (Ext.isArray(config.plugins) && config.plugins.indexOf(pluginType) > -1) {
        config.plugins = Ext.Array.remove(config.plugins, pluginType);
      }
    }
  }
}, updateBackgroundColor:function(color) {
  var me = this;
  var el = Ext.isClassic ? me.el && me.rendered ? me.el : me.protoEl : me.element ? me.element : null;
  if (el) {
    el.setStyle('background-color', color);
  } else {
    me.style = me.style || {};
    me.style.backgroundColor = color;
  }
}, updateForegroundColor:function(color) {
  var me = this;
  var el = Ext.isClassic ? me.el && me.rendered ? me.el : me.protoEl : me.element ? me.element : null;
  if (el) {
    el.setStyle('color', color);
  } else {
    me.style = me.style || {};
    me.style.color = color;
  }
}, getBackgroundColor:function() {
  var me = this;
  var el = Ext.isClassic ? me.el && me.rendered ? me.el : me.protoEl : me.element ? me.element : null;
  if (el) {
    return el.getStyle('background-color');
  } else {
    if (Ext.isObject(me.style)) {
      return me.style.backgroundColor;
    } else {
      return me.callParent();
    }
  }
}, getForegroundColor:function() {
  var me = this;
  var el = Ext.isClassic ? me.el && me.rendered ? me.el : me.protoEl : me.element ? me.element : null;
  if (el) {
    return el.getStyle('color');
  } else {
    if (Ext.isObject(me.style)) {
      return me.style.color;
    } else {
      return me.callParent();
    }
  }
}, __flushValueViewModel:function() {
  var me = this, bind = me.bind || {}, valueBind = bind['value'], valueViewModel = valueBind ? valueBind.owner : null;
  if (valueViewModel) {
    valueViewModel.notify();
  }
}, updateResponsiveWidth:function(responsiveWidth) {
  this.responsiveWidth = responsiveWidth;
  if (this.rendered) {
    if (this.updateLayout) {
      this.updateLayout();
    } else {
      this.setWidth(this.getWidth());
    }
  }
}, userSetValue:function(value) {
  var me = this, focusValue = !Ext.isEmpty(me.focusValue) ? me.focusValue : Ext.isFunction(me.getValue) ? me.getValue() : me.value;
  if (Ext.isFunction(this.setValue)) {
    if (Ext.isFunction(me.isEqual) && !me.isEqual(value, focusValue) || value !== focusValue) {
      me.focusValue = focusValue;
      me.setValue(value);
    }
  }
}});
Ext.define('ABPControlSet.mixin.Component', {override:'ABPControlSet.base.mixin.Component'});
Ext.define('ABPControlSet.base.mixin.Button', {extend:'ABPControlSet.base.mixin.Component', config:{icons:null, iconFontSize:null}, setIconFontSize:function(fontSize) {
  var me = this, previousFontSize = me.getIconFontSize();
  if (!Ext.isEmpty(previousFontSize) && Ext.isEmpty(fontSize) || !Ext.isEmpty(fontSize)) {
    me.updateButtonIconStyle({'font-size':Ext.isNumber(fontSize) ? fontSize + 'px' : fontSize});
  }
  this.callParent(arguments);
}, updateButtonIconStyle:Ext.emptyFn});
Ext.define('ABPControlSet.mixin.Button', {override:'ABPControlSet.base.mixin.Button', updateIcons:function(icons) {
  var me = this, element = me.iconElement, hasIconCls = me.hasIconCls;
  if (Ext.isString(icons)) {
    icons = icons.split(',');
  }
  if (icons && icons.length > 0) {
    me.addCls(hasIconCls);
    var iconUrls = '';
    var length = icons.length;
    for (var i = 0; i < length; i++) {
      iconUrls += 'url(' + icons[i] + ')' + (length === i + 1 ? '' : ',');
    }
    element.setStyle('background-image', iconUrls);
  } else {
    element.setStyle('background-image', '');
    if (!me.getIconCls()) {
      me.removeCls(hasIconCls);
    }
  }
}, updateForegroundColor:function(color) {
  var me = this;
  this.callParent(arguments);
  if (me.rendered) {
    var el = me.textElement;
    if (el) {
      el.setStyle('color', color);
    }
  } else {
    me.on('painted', function() {
      me.textElement.setStyle('color', color);
    }, me);
  }
}, updateBackgroundColor:function(color) {
  var me = this;
  this.callParent(arguments);
  if (me.rendered) {
    var el = me.element;
    if (el) {
      el.setStyle('background-color', color);
      el.setStyle('border-color', color);
    }
  } else {
    me.on('painted', function() {
      var el = me.element;
      el.setStyle('background-color', color);
      el.setStyle('border-color', color);
    }, me);
  }
}, updateButtonIconStyle:function(style) {
  var me = this;
  if (me.rendered) {
    if (me.iconElement) {
      me.iconElement.setStyle(style);
    }
  } else {
    me.on('painted', function() {
      if (me.iconElement) {
        me.iconElement.setStyle(style);
      }
    });
  }
}});
Ext.define('ABPControlSet.base.mixin.CardContainer', {extend:'Ext.Mixin', mixinConfig:{id:'abpcardcontainer'}, singletons:null, constructor:function(config) {
  config = config || {};
  config.singletons = new Ext.util.Collection({keyFn:function(item) {
    return item['cardId'];
  }});
  this.callParent([config]);
}, showView:function(cardId, reset, destroyNewer) {
  destroyNewer = destroyNewer || false;
  reset = reset || false;
  Ext.suspendLayouts();
  var me = this, layout = me.getLayout(), setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout), itemCollection = me.items, length = itemCollection.length;
  var viewToShow = itemCollection.findBy(function(item) {
    return item['cardId'] === cardId;
  });
  var existingSingleton = me.singletons.get(cardId);
  if (existingSingleton) {
    var lastHostId = existingSingleton.lastHostId;
    if (lastHostId) {
      viewToShow = itemCollection.findBy(function(item) {
        return item['cardId'] === lastHostId;
      });
      if (viewToShow) {
        viewToShow.add(existingSingleton);
      }
    }
  }
  if (viewToShow) {
    if (viewToShow.isHost) {
      var hostedCardId = viewToShow.hostedCardId, hostedCard = me.singletons.get(hostedCardId);
      if (hostedCard) {
        viewToShow.add(hostedCard);
        hostedCard.lastHostId = hostedCard.hostCardId = viewToShow.cardId;
      }
    }
    var indexToShow = itemCollection.indexOf(viewToShow);
    if (reset) {
      me.removeAll(true);
    } else {
      if (destroyNewer && indexToShow < length) {
        me.destroyNewer(indexToShow);
      }
    }
    if (itemCollection.indexOf(viewToShow) === -1) {
      viewToShow = me.add(viewToShow);
    }
    if (setActiveFn) {
      setActiveFn(viewToShow);
    }
    Ext.resumeLayouts(true);
    return true;
  }
  Ext.resumeLayouts(true);
  return false;
}, destroyNewer:function(currentIndex) {
  var me = this, item, itemCollection = me.items, length = itemCollection.length;
  for (var i = length; i > currentIndex; i--) {
    item = itemCollection.getAt(i);
    if (item) {
      if (item.isHost) {
        item.removeAll(false);
      }
      me.remove(item, {destroy:true});
    }
  }
}, addView:function(viewToShow, reset, destroyNewer) {
  reset = reset || false;
  destroyNewer = destroyNewer === false ? false : true;
  var me = this, originalViewToShow = viewToShow, itemCollection = me.items, layout = me.getLayout(), setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout), currentItem = layout.getActiveItem ? layout.getActiveItem() : me.getActiveItem ? me.getActiveItem() : null, currentIndex = itemCollection.indexOf(currentItem);
  Ext.suspendLayouts();
  var length = itemCollection.length;
  if (reset) {
    me.removeAll(true);
  } else {
    if (destroyNewer && length > currentIndex && currentIndex !== -1) {
      me.destroyNewer(currentIndex);
    }
  }
  if (viewToShow) {
    if (viewToShow.singleton === true) {
      var addHost = true;
      var existingSingleton = me.singletons.get(viewToShow.cardId);
      if (existingSingleton) {
        var lastHostId = existingSingleton.lastHostId;
        var hostCardId = existingSingleton.hostCardId;
        if (lastHostId === hostCardId) {
          viewToShow = itemCollection.findBy(function(item) {
            return item['cardId'] === lastHostId;
          });
          if (viewToShow) {
            viewToShow.add(existingSingleton);
            addHost = false;
          } else {
            viewToShow = originalViewToShow;
          }
        }
      }
      if (addHost) {
        if (!existingSingleton) {
          me.singletons.add(viewToShow);
        }
        var hostCardId = viewToShow.hostCardId || Ext.id();
        viewToShow.lastHostId = hostCardId;
        viewToShow = Ext.widget({xtype:'container', isHost:true, layout:'fit', cardId:hostCardId, hostedCardId:viewToShow.cardId, items:[viewToShow]});
      }
    }
    viewToShow = me.add(viewToShow);
    if (setActiveFn) {
      setActiveFn(viewToShow);
    }
  } else {
    viewToShow = false;
  }
  Ext.resumeLayouts(true);
  return viewToShow;
}, forwardView:function() {
  var me = this, itemCollection = me.items, layout = me.getLayout(), setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout);
  var viewToShow, currentItem = layout.getActiveItem ? layout.getActiveItem() : me.getActiveItem ? me.getActiveItem() : null, currentIndex = itemCollection.indexOf(currentItem);
  if (currentIndex !== -1) {
    viewToShow = itemCollection.getAt(currentIndex + 1);
  }
  if (viewToShow && setActiveFn) {
    setActiveFn(viewToShow);
  }
}, backView:function(backCount, destroyNewer) {
  var me = this, layout = me.getLayout(), setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout), currentItem = layout.getActiveItem ? layout.getActiveItem() : me.getActiveItem ? me.getActiveItem() : null, itemCollection = me.items;
  Ext.suspendLayouts();
  destroyNewer = destroyNewer || false;
  backCount = backCount || 1;
  var currentIndex = currentItem ? itemCollection.indexOf(currentItem) : null, moveTo = Ext.isNumber(currentIndex) ? currentIndex - backCount : null;
  if (Ext.isNumber(moveTo)) {
    var moveToItem = itemCollection.getAt(moveTo < 0 ? 0 : moveTo);
    if (destroyNewer) {
      if (moveTo < 0) {
        me.removeAll(true);
      } else {
        me.destroyNewer(moveTo);
      }
    }
    if (moveToItem && setActiveFn && moveTo >= 0) {
      setActiveFn(moveToItem);
    }
  }
  Ext.resumeLayouts(true);
}});
Ext.define('ABPControlSet.mixin.CardContainer', {override:'ABPControlSet.base.mixin.CardContainer', destroyNewer:function(currentIndex) {
  var me = this, itemCollection = me.items, item;
  for (var i = itemCollection.length; i > currentIndex; i--) {
    item = itemCollection.getAt(i);
    if (item) {
      me.remove(item, {destroy:true});
    }
  }
}});
Ext.define('ABPControlSet.base.mixin.Field', {extend:'ABPControlSet.base.mixin.Component', config:{fieldLabel:null, fieldFormatter:null, fieldFormat:null, fieldFormatOnLoad:true, required:null, spellcheck:true, labelForegroundColor:null, labelHidden:null, blankText:null, sizeToInnerContent:null, tagForReadOnly:null}, mixinConfig:{after:{setValue:'onValueUpdate', destroy:'doCleanup', setReadOnly:'onReadOnlyUpdate', afterRender:'onAfterRender'}}, __linkedLabel:null, constructor:function(config) {
  config = config || {};
  this.addCSPlugin(config, 'abpfield');
  if (config.linkedLabel) {
    this.addCSPlugin(config, 'abplinkedlabel');
  }
  this.callParent([config]);
}, onValueUpdate:function(value) {
  var me = this, fieldFormatOnLoad = me.getFieldFormatOnLoad();
  if (fieldFormatOnLoad && !me.userTyping && !me.containsFocus) {
    var fieldFormatter = me.getFieldFormatter();
    var fieldFormat = me.getFieldFormat();
    if (Ext.isFunction(fieldFormatter)) {
      me.setFieldFormattedValue(fieldFormatter, fieldFormat, false);
    }
  }
  if (me.getSizeToInnerContent()) {
    me.doSizeToInnerContent();
  }
  if (me.getTagForReadOnly()) {
    me.doReadOnlyTagUpdate();
  }
}, updateSizeToInnerContent:function(sizeToInnerContent) {
  this.toggleCls('abp-size-to-content-input', sizeToInnerContent);
  if (sizeToInnerContent) {
    this.doSizeToInnerContent();
  }
}, onAfterRender:Ext.emptyFn, doReadOnlyTagUpdate:function() {
  var me = this, readOnly = me.getReadOnly(), readOnlyElement = me.readOnlyElement, value = me.getValue();
  if (readOnlyElement) {
    me.toggleCls('abp-read-only-link-field', readOnly);
    if (Ext.isModern) {
      readOnlyElement.setHtml(Ext.String.htmlEncode(me.getInputValue()));
    } else {
      readOnlyElement.setHtml(Ext.String.htmlEncode(me.getRawValue()));
    }
    if (me.getTagForReadOnly() === 'a') {
      readOnlyElement.set({'href':me.formatUsageUrl(value)});
      if (me.usage === 'url' || me.usage === 'address') {
        readOnlyElement.set({'target':'_blank', 'rel':'noopener noreferrer'});
      }
    }
  }
}, formatUsageUrl:function(value) {
  var me = this, formatStr;
  switch(me.usage) {
    case 'phone':
      formatStr = 'tel:{0}';
      break;
    case 'email':
      formatStr = 'mailto:{0}';
      break;
    case 'address':
      formatStr = ABPControlSet.common.Constants.MAP_URL_FORMAT_STRING;
      break;
    default:
      formatStr = '{0}';
      break;
  }
  return Ext.String.format(formatStr, value);
}, onReadOnlyUpdate:function() {
  var me = this;
  if (me.getTagForReadOnly()) {
    var readOnly = me.getReadOnly(), readOnlyElement = me.readOnlyElement;
    if (readOnlyElement) {
      me.toggleCls('abp-read-only-link-field', readOnly);
    }
  }
}, doSizeToInnerContent:Ext.emptyFn, getBackgroundColor:function() {
  var inputEl = this.getInputElement();
  if (inputEl) {
    return inputEl.getStyle('background-color');
  } else {
    return this._backgroundColor;
  }
}, getForegroundColor:function() {
  var inputEl = this.getInputElement();
  if (inputEl) {
    return inputEl.getStyle('color');
  } else {
    return this._foregroundColor;
  }
}, updateBackgroundColor:function(color) {
  var inputEl = this.getInputElement();
  if (inputEl && this.rendered) {
    inputEl.setStyle('background-color', color);
  }
}, updateForegroundColor:function(color) {
  var inputEl = this.getInputElement();
  if (inputEl && this.rendered) {
    inputEl.setStyle('color', color);
  }
}, getLabelForegroundColor:function() {
  var me = this;
  var label = me.getLabel();
  if (Ext.isObject(label.style)) {
    return label.style.color;
  } else {
    return me.callParent();
  }
}, updateLabelForegroundColor:function(color) {
  var me = this;
  var label = me.labelElement;
  if (label) {
    label.setStyle('color', color);
  }
}, getBlankText:function(blankText) {
  return this.blankText;
}, setBlankText:function(blankText) {
  this.blankText = blankText;
}, setFieldFormattedValue:Ext.emptyFn, doCleanup:function() {
  if (this.inputTextMetrics) {
    this.inputTextMetrics = this.inputTextMetrics.destroy();
  }
  if (this.readOnlyElement) {
    this.readOnlyElement = this.readOnlyElement.destroy();
  }
}});
Ext.define('ABPControlSet.mixin.Field', {override:'ABPControlSet.base.mixin.Field', constructor:function(config) {
  this.callParent([config]);
  this.updateRequired = this.onUpdateRequired;
}, onUpdateRequired:function(required) {
  var me = this;
  me.superclass.updateRequired.apply(this, arguments);
  if (me.__linkedLabel) {
    me.__linkedLabel.toggleCls('abp-mandatory', required);
  }
  if (me.labelElement) {
    me.labelElement.toggleCls('abp-mandatory', required);
  }
}, updateFieldLabel:function(fieldLabel) {
  this.setLabel(fieldLabel);
}, getFieldLabel:function() {
  return this.getLabel();
}, getInputElement:function() {
  return this.inputElement;
}, updateSpellcheck:function(spellcheck) {
  if (Ext.isFunction(this.setAutoCorrect)) {
    this.setAutoCorrect(!!spellcheck);
  }
  if (Ext.isFunction(this.setInputAttribute)) {
    this.setInputAttribute('spellcheck', spellcheck ? 'true' : 'false');
  }
}, updateForegroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    this.callParent(arguments);
  } else {
    me.on('painted', function() {
      me.inputElement.setStyle('color', color);
    }, me);
  }
}, updateBackgroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    this.callParent(arguments);
  } else {
    me.on('painted', function() {
      me.inputElement.setStyle('background-color', color);
    }, me);
  }
}, getLabelHidden:function() {
  var me = this;
  return me.labelElement.el.getHidden();
}, setLabelHidden:function(value) {
  var me = this;
  if (value) {
    me.labelElement.el.hide();
  } else {
    me.labelElement.el.show();
  }
}, fromSetFormattedValue:false, setFieldFormattedValue:function(fieldFormatter, fieldFormat, userTyping) {
  var valueToFormat = this.getInputValue ? this.getInputValue() : this.getValue(), formattedValue = fieldFormatter(this, fieldFormat, (Ext.isEmpty(valueToFormat) ? '' : valueToFormat).toString(), userTyping, valueToFormat);
  if (userTyping) {
    this.setInputValue(formattedValue);
  } else {
    if (!this.fromSetFormattedValue) {
      this.fromSetFormattedValue = true;
      this.setValue(formattedValue);
    }
  }
  this.fromSetFormattedValue = false;
}, onAfterRender:function() {
  var me = this, tagForReadOnly = me.getTagForReadOnly();
  if (tagForReadOnly) {
    var innerElement = me.innerElement;
    if (innerElement) {
      me.readOnlyElement = innerElement.createChild({tag:me.getTagForReadOnly(), reference:'readOnlyElement', tabindex:me.inputTabIndex, cls:Ext.baseCSSPrefix + 'input-el abp-read-only-link'});
      me.doReadOnlyTagUpdate();
    }
  }
}, doSizeToInnerContent:function() {
  var me = this, el = me.el, afterInputElement = me.afterInputElement, afterInputWidth = afterInputElement ? afterInputElement.getWidth() : 0, bodyWrapElement = me.bodyWrapElement, totalWidth = el.getWidth(), inputElement = me.inputElement, labelWidth = me.labelTextElement ? me.labelTextElement.getWidth() : 0, inputMetrics = me.inputTextMetrics = me.inputTextMetrics || new Ext.util.TextMetrics(inputElement), maxInputWidth = totalWidth - labelWidth, rawValue = me.getInputValue(), inputWidth = inputMetrics.getWidth(rawValue) + 
  inputElement.getPadding('lr') + afterInputWidth, preciseWidth = inputWidth > maxInputWidth ? maxInputWidth : inputWidth;
  if (preciseWidth && bodyWrapElement) {
    bodyWrapElement.setMaxWidth(preciseWidth);
  }
}});
Ext.define('ABPControlSet.base.mixin.Checkbox', {extend:'ABPControlSet.base.mixin.Field', config:{fieldLabel:null}, lastClickTime:null, IOS_USER_CLICK_IS_CHANGE_SOURCE_TIMEOUT:300, constructor:function(config) {
  config = config || {};
  if (config.linkedLabel) {
    this.addCSPlugin(config, 'abplinkedlabel');
  }
  this.callParent([config]);
}});
Ext.define('ABPControlSet.mixin.Checkbox', {override:'ABPControlSet.base.mixin.Checkbox', updateFieldLabel:function(fieldLabel) {
  this.setLabel(fieldLabel);
}, getFieldLabel:function() {
  return this.getLabel();
}, updateForegroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    var el = me.iconElement;
    if (el) {
      el.setStyle('color', color);
    }
  } else {
    me.on('painted', function() {
      me.iconElement.setStyle('color', color);
    }, me);
  }
}, updateBackgroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    var el = me.iconElement;
    if (el) {
      el.setStyle('background-color', color);
    }
  } else {
    me.on('painted', function() {
      me.iconElement.setStyle('background-color', color);
    }, me);
  }
}, getBackgroundColor:function() {
  var me = this;
  if (me.rendered) {
    var el = me.iconElement;
    if (el) {
      return el.getStyle('background-color');
    }
  } else {
    return this._backgroundColor;
  }
}, getForegroundColor:function() {
  var me = this;
  if (me.rendered) {
    var el = me.iconElement;
    if (el) {
      return el.getStyle('color');
    }
  } else {
    return this._foregroundColor;
  }
}});
Ext.define('ABPControlSet.base.mixin.ComboBox', {extend:'ABPControlSet.base.mixin.Field', config:{publishListValue:false, listValue:null}, constructor:function(config) {
  config = config || {};
  config.publishes = config.publishes || [];
  config.publishes.push('listValue');
  this.callParent([config]);
}});
Ext.define('ABPControlSet.base.mixin.CustomControl', {extend:'ABPControlSet.base.mixin.Component', beginEmbed:function() {
  var me = this, hidden = me.getHidden(), embeddedEl = me.embeddedEl;
  if (hidden) {
    me.on({show:me.beginEmbed, single:true, scope:this, priority:999});
    return;
  }
  if (embeddedEl) {
    me.on('destroy', me.destroyEmbedded);
    me.embed(me.embeddedEl);
  }
}, embed:Ext.emptyFn, embeddedEl:null, destroyEmbedded:function() {
  delete this.embeddedEl;
}});
Ext.define('ABPControlSet.base.mixin.Grid', {extend:'ABPControlSet.base.mixin.Component', config:{readOnly:null, required:null}, constructor:function(config) {
  config = config || {};
  this.addCSPlugin(config, 'abpgrid');
  this.callParent([config]);
}, getContextMenuData:function(event, element) {
  var position = event.position || {}, column = position.column || {}, cmp = ABPControlSet.common.Common.getComponentFromElement(element);
  return {component:cmp, record:position.record, rowIdx:position.rowIdx, colIdx:position.colIdx, dataIndex:column.dataIndex};
}});
Ext.define('ABPControlSet.mixin.Grid', {override:'ABPControlSet.base.mixin.Grid'});
Ext.define('ABPControlSet.base.mixin.Icon', {extend:'Ext.Component', config:{value:null}, setValue:function(iconCls) {
  var currentIconCls = this.currentIconCls;
  if (iconCls !== currentIconCls) {
    this.removeCls(currentIconCls);
    this.currentIconCls = iconCls;
    this.addCls(iconCls);
  }
}});
Ext.define('ABPControlSet.base.mixin.Image', {extend:'ABPControlSet.base.mixin.Component', config:{fieldLabel:null, src:null, cropStyle:null}, getBackgroundColor:function() {
  console.log('getBackgroundColor unsupported for abpimage.');
}, getForegroundColor:function() {
  console.log('getForegroundColor unsupported for abpimage.');
}, setBackgroundColor:function() {
  console.log('setBackgroundColor unsupported for abpimage.');
}, setForegroundColor:function() {
  console.log('setForegroundColor unsupported for abpimage.');
}, updateBackgroundColor:function(color) {
  console.log('setBackgroundColor unsupported for abpimage.');
}, updateForegroundColor:function(color) {
  console.log('setForegroundColor unsupported for abpimage.');
}, getTooltipEl:function() {
  var me = this;
  if (me.rendered) {
    var image = me.down('#user-image');
    return image ? image.el : me.el;
  }
}, updatePlaceholder:function(placeholderValue) {
  var placeholder = this.down('#placeholder');
  if (placeholder && !Ext.isString(placeholderValue)) {
    placeholderValue = '';
  }
  placeholder.setHtml(placeholderValue);
}, onImageLoaded:function() {
  var me = this;
  me.showLoadedImage();
  me.hidePlaceHolderText();
  me.hidePlaceHolderImage();
}, privates:{showLoadedImage:function() {
  var image = this.down('#user-image');
  if (image) {
    image.show();
    image.addCls('loaded');
  }
}, hidePlaceHolderText:function() {
  var placeholder = this.down('#placeholder');
  if (placeholder) {
    placeholder.hide();
  }
}, hidePlaceHolderImage:function() {
  if (this.getSrc() !== '') {
    var placeholderImage = this.down('#placeholder-image');
    placeholderImage.hide();
  }
}, configureImageClassName:function(cropStyle, dimensions) {
  var className = '';
  if (cropStyle && cropStyle !== 'none') {
    className = 'cropped';
    if (cropStyle === 'oval') {
      className += ' oval';
    }
  }
  return className;
}, configureDimensions:function(config) {
  if (config.cropStyle === 'circle') {
    var height = config.height || 0, width = config.width || 0, smaller = height < width ? height : width;
    return {height:smaller, width:smaller};
  } else {
    return {height:config.height, width:config.width};
  }
}}});
Ext.define('ABPControlSet.mixin.Image', {override:'ABPControlSet.base.mixin.Image', config:{placeholder:null, readOnly:null}, updateFieldLabel:function(fieldLabel) {
  this.setLabel(fieldLabel);
}, getFieldLabel:function() {
  return this.getLabel();
}, updateSrc:function(source) {
  var me = this;
  var imageCmp = me.down('image');
  if (imageCmp) {
    imageCmp.setSrc(source);
  } else {
    me.items[0].src = source;
  }
}, updateReadOnly:function(newReadOnly) {
  if (newReadOnly) {
    this.addCls('abp-image-upload-readonly');
  } else {
  }
  this.setLayout(Ext.layout.vbox);
  this.addCls('abp-image-upload');
  return this;
}});
Ext.define('ABPControlSet.base.mixin.Panel', {extend:'ABPControlSet.base.mixin.Component', headerTitle:null, config:{headerForegroundColor:null, headerBackgroundColor:null, bodyBackgroundColor:null}, setHeaderTitle:function(value) {
  this.setTitle(value);
}, getHeaderTitle:function() {
  var me = this;
  var title = me.getTitle();
  if (title) {
    return title;
  } else {
    return me.callParent();
  }
}, updateForegroundColor:function(color) {
  ABP.util.Logger.logWarn("Setting an abppanel's foregroundColor is not defined.");
}, updateBodyForegroundColor:function(color) {
  ABP.util.Logger.logWarn("Setting an abppanel's bodyForegroundColor is not defined.");
}, getForegroundColor:function() {
  ABP.util.Logger.logWarn("Getting an abppanel's foregroundColor is not defined.");
}, getBodyForegroundColor:function() {
  ABP.util.Logger.logWarn("Getting an abppanel's bodyForegroundColor is not defined.");
}});
Ext.define('ABPControlSet.mixin.Panel', {override:'ABPControlSet.base.mixin.Panel', updateHeaderForegroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    me.updateHeaderTitleColor(color);
  } else {
    me.on('painted', function() {
      me.updateHeaderTitleColor(color);
    }, me);
  }
}, updateHeaderBackgroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    me.updateHeaderBackColor(color);
  } else {
    me.on('painted', function() {
      me.updateHeaderBackColor(color);
    }, me);
  }
}, updateBodyBackgroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    me.updateBodyBackColor(color);
  } else {
    me.on('painted', function() {
      me.updateBodyBackColor(color);
    }, me);
  }
}, getHeaderBackgroundColor:function() {
  var me = this;
  if (me.rendered) {
    var hd = me.getHeader();
    if (hd) {
      var el = hd.element;
      if (el & el.getStyle) {
        return el.getStyle('background-color');
      }
    }
  } else {
    return this._headerBackgroundColor;
  }
}, getHeaderForegroundColor:function() {
  var me = this;
  if (me.rendered) {
    var hd = me.getHeader();
    if (hd) {
      var ti = hd.getTitle();
      if (ti) {
        var el = ti.element;
        if (el && el.getStyle) {
          return el.getStyle('color');
        }
      }
    }
  } else {
    return this._headerForegroundColor;
  }
}, getBodyBackgroundColor:function() {
  var me = this;
  if (me.rendered) {
    var el = me.bodyElement;
    if (el && el.getStyle) {
      return el.getStyle('background-color');
    }
  } else {
    return this._backgroundColor;
  }
}, privates:{updateHeaderBackColor:function(color) {
  me = this;
  var hd = me.getHeader();
  if (hd) {
    var el = hd.element;
    if (el && el.setStyle) {
      el.setStyle('background-color', color);
    }
  }
}, updateHeaderTitleColor:function(color) {
  me = this;
  var hd = me.getHeader();
  if (hd) {
    var ti = hd.getTitle();
    if (ti) {
      var el = ti.element;
      if (el && el.setStyle) {
        el.setStyle('color', color);
      }
    }
  }
}, updateBodyBackColor:function(color) {
  me = this;
  var el = me.bodyElement;
  if (el && el.setStyle) {
    el.setStyle('background-color', color);
  }
}}});
Ext.define('ABPControlSet.base.mixin.RadioGroup', {extend:'ABPControlSet.base.mixin.Field', config:{store:null, labelField:null, valueField:null}, constructor:function(config) {
  config = config || {};
  this.removeCSPlugin(config, 'abpfield');
  this.addCSPlugin(config, 'abpradiogroup');
  this.callParent([config]);
}, updateStore:function(store) {
  if (Ext.isString(store)) {
    var form = this.up('form'), vm = form.getViewModel();
    store = vm.getStore(store);
  }
  if (Ext.isObject(store)) {
    if (store.getCount() > 0) {
      this.onStoreUpdate();
    } else {
      store.on('datachanged', this.onStoreUpdate, this);
    }
  }
}, updateRadioItems:function() {
  var me = this, labelField = me.getLabelField(), valueField = me.getValueField(), store = me.getStore(), radioFields = [], record, radioRecords = store.getRange(), length = radioRecords.length;
  me.removeAll();
  for (var i = 0; i < length; i++) {
    record = radioRecords[i];
    radioFields.push({inputValue:record.get(valueField), boxLabel:record.get(labelField)});
  }
  me.add(radioFields);
}});
Ext.define('ABPControlSet.mixin.RadioGroup', {override:'ABPControlSet.base.mixin.RadioGroup', config:{readOnly:null}, updateReadOnly:function(readOnly) {
  var itemsCollection = this.getItems(), items = itemsCollection.getRange(), length = items.length;
  for (var i = 0; i < length; i++) {
    if (items[i].setReadOnly) {
      items[i].setReadOnly(readOnly);
    } else {
      items[i].readOnly = readOnly;
    }
  }
}, onStoreUpdate:function() {
  if (this.rendered) {
    this.updateRadioItems();
  } else {
    this.on('painted', this.updateRadioItems, this);
  }
}, updateForegroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    me.__renderedRadioGroupUpdateForegroundColor(color);
  } else {
    me.on('painted', function() {
      me.__renderedRadioGroupUpdateForegroundColor(color);
    }, me);
  }
}, __renderedRadioGroupUpdateForegroundColor:function(color) {
  var me = this;
  var items = me.getItems && me.getItems().getRange ? me.getItems().getRange() : me.getItems() || [], length = items.length;
  var displayEls = Ext.Array.pluck(items, 'iconElement');
  for (var i = 0; i < length; i++) {
    displayEls[i].setStyle('color', color);
  }
}, updateBackgroundColor:function(color) {
  var me = this;
  if (me.rendered) {
    me.__renderedRagioGroupUpdateBackgroundColor(color);
  } else {
    me.on('painted', function() {
      me.__renderedRagioGroupUpdateBackgroundColor(color);
    }, me);
  }
}, __renderedRagioGroupUpdateBackgroundColor:function(color) {
  var me = this;
  var items = me.getItems && me.getItems().getRange ? me.getItems().getRange() : me.getItems() || [], length = items.length;
  var displayEls = Ext.Array.pluck(items, 'iconElement');
  for (var i = 0; i < length; i++) {
    displayEls[i].setStyle('background-color', color);
  }
}});
Ext.define('ABPControlSet.base.mixin.SegmentedButton', {extend:'ABPControlSet.base.mixin.Component', config:{}});
Ext.define('ABPControlSet.base.mixin.Separator', {extend:'ABPControlSet.base.mixin.Component', afterRender:function() {
  if (this.getWidth() > this.getMaxWidth()) {
    this.setWidth(this.getMaxWidth());
  } else {
    if (this.getWidth() < this.getMinWidth()) {
      this.setWidth(this.getMinWidth());
    }
  }
  if (this.spacing) {
    this.setMargin(this.spacing);
  }
}});
Ext.define('ABPControlSet.base.mixin.TabPanel', {extend:'ABPControlSet.base.mixin.Component', updateBackgroundColor:function(backgroundColor) {
  var me = this, tabBar = me.getTabBar();
  tabBar.setStyle('background-color', backgroundColor);
  this.callParent(arguments);
}});
Ext.define('ABPControlSet.base.mixin.Text', {extend:'ABPControlSet.base.mixin.Field', config:{}});
Ext.define('ABPControlSet.mixin.Text', {override:'ABPControlSet.base.mixin.Text'});
Ext.define('ABPControlSet.base.mixin.TextArea', {extend:'ABPControlSet.base.mixin.Field', config:{spellcheck:false}});
Ext.define('ABPControlSet.base.mixin.TextDisplay', {extend:'ABPControlSet.base.mixin.Field', config:{markupType:null}});
Ext.define('ABPControlSet.util.Markdown', {singleton:true, parseMarkdown:function(text) {
  this.initializeCustomMarked();
  if (text && text.length) {
    marked.setOptions({sanitize:true});
    return marked(text);
  } else {
    return text;
  }
}, privates:{customRenderingInitialized:false, initializeCustomMarked:function() {
  if (!this.customRenderingInitialized) {
    var renderer = new marked.Renderer;
    renderer.link = function(href, title, text) {
      var link = marked.Renderer.prototype.link.call(this, href, title, text);
      return link.replace('\x3ca', "\x3ca target\x3d'_blank' ");
    };
    marked.setOptions({renderer:renderer});
    this.customRenderingInitialized = true;
  }
}}});
Ext.define('ABPControlSet.mixin.TextDisplay', {override:'ABPControlSet.base.mixin.TextDisplay', requires:['ABPControlSet.util.Markdown'], updateMarkupType:function(value) {
  var innerHTML = this.getInnerHtmlElement();
  var textValue = this.getValue();
  if (value === 'markdown') {
    this.setHtml(ABPControlSet.util.Markdown.parseMarkdown(textValue));
    this.inputElement.addCls('x-hidden-display');
    innerHTML.removeCls('x-hidden-display');
    this.addCls('abp-markdown');
  } else {
    this.inputElement.removeCls('x-hidden-display');
    innerHTML.addCls('x-hidden-display');
    this.removeCls('abp-markdown');
  }
}, onAfterRender:function() {
}});
Ext.define('ABPControlSet.base.mixin.Trigger', {extend:'Ext.Mixin', config:{tooltip:null, disabled:null, icon:null, hidden:null}, mixinConfig:{after:{setDisabled:'afterSetDisabled'}}, afterSetDisabled:Ext.emptyFn, updateHidden:function(hidden) {
  this.hidden = hidden;
  if (hidden) {
    this.hide();
    if (this.component) {
      this.component.hidden = hidden;
      this.component.hide();
    }
  } else {
    this.show();
    if (this.component) {
      this.component.hidden = hidden;
      this.component.show();
    }
  }
}, updateTooltip:function(tooltip) {
  if (this.component) {
    if (this.component.setTooltip) {
      this.component.setTooltip(tooltip);
    } else {
      this.component.tooltip = tooltip;
    }
  }
}, updateIcon:function(icon) {
  if (this.component) {
    if (this.component.setIconCls) {
      this.component.setIconCls(icon);
    } else {
      this.component.iconCls = icon;
    }
  }
}});
Ext.define('ABPControlSet.mixin.Trigger', {override:'ABPControlSet.base.mixin.Trigger', afterSetDisabled:function() {
  var component = this.component, disabled = this.getDisabled();
  if (component) {
    if (component.setDisabled) {
      component.setDisabled(disabled);
      component.el.setTabIndex(disabled ? -1 : 0);
    } else {
      component.disabled = disabled;
      component.tabIndex = disabled ? -1 : 0;
    }
  }
}});
Ext.define('ABPControlSet.layout.Accordion', {extend:'Ext.layout.VBox', alias:'layout.abpaccordion', type:'abpaccordion', targetCls:Ext.baseCSSPrefix + 'accordion-layout-ct', itemCls:[Ext.baseCSSPrefix + 'box-item', Ext.baseCSSPrefix + 'accordion-item'], align:'stretch', enableSplitters:false, fill:true, titleCollapse:true, hideCollapseTool:false, collapseFirst:undefined, activeOnTop:false, multi:false, wrapOver:true, panelCollapseMode:'header', defaultAnimatePolicy:{y:true, height:true}, owner:null, 
onContainerInitialized:function() {
  this.callParent(arguments);
  var container = this.getContainer();
  this.owner = container;
  var el = container.innerElement || container.bodyElement || container.el;
  if (el) {
    el.dom.setAttribute('role', 'tablist');
    el.dom.setAttribute('aria-multiselectable', true);
  }
}, onItemAdd:function(item) {
  var me = this;
  item.getCollapsible = item.getCollapsible || function() {
    return false;
  };
  item.getCollapsed = item.getCollapsed || function() {
    return false;
  };
  if (item.rendered) {
    me.beforeRenderItem(item);
  } else {
    item.on('painted', me.beforeRenderItem, me);
  }
  if (item.collapseMode === 'placeholder') {
    item.collapseMode = me.panelCollapseMode;
  }
  item.collapseDirection = item.headerPosition;
  me.callParent(arguments);
}, onItemRemove:function(panel, destroying) {
  var me = this, item;
  me.callParent(arguments);
  if (!me.owner.destroying && !me.multi && !panel.getCollapsed()) {
    item = me.owner.items.first();
    if (item) {
      item.expand();
    }
  }
}, getExpanded:function() {
  var items = this.owner.items.items, len = items.length, i = 0, out = [], add, item;
  for (; i < len; ++i) {
    item = items[i];
    if (!item.hidden) {
      add = item.getCollapsed ? !item.getCollapsed() : true;
      if (add) {
        out.push(item);
      }
    }
  }
  return out;
}, afterCollapse:Ext.emptyFn, afterExpand:Ext.emptyFn, beforeRenderItem:function(comp) {
  var me = this, owner = me.owner, collapseFirst = me.collapseFirst, hasCollapseFirst = Ext.isDefined(collapseFirst), expandedItem = me.getExpanded()[0], multi = me.multi, comp;
  comp.toggleCls(Ext.baseCSSPrefix + 'accordion-item', true);
  if (comp.header) {
    comp.header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd', true);
  }
  comp.isAccordionPanel = true;
  comp.bodyAriaRole = 'tabpanel';
  comp.accordionWrapOver = me.wrapOver;
  if (!multi || comp.getCollapsible() == undefined) {
    comp.setCollapsible({useDrawer:!me.titleCollapse});
  }
  if (comp.getCollapsible()) {
    if (hasCollapseFirst) {
      comp.collapseFirst = collapseFirst;
    }
    if (me.hideCollapseTool) {
      comp.hideCollapseTool = me.hideCollapseTool;
      me.configureTitleCollapse(comp, true);
    } else {
      if (me.titleCollapse && comp.titleCollapse === undefined) {
        me.configureTitleCollapse(comp, me.titleCollapse);
      }
    }
  }
  comp.hideHeader = comp.width = null;
  comp.title = comp.title || '\x26#160;';
  if (comp.addBodyCls) {
    comp.addBodyCls(Ext.baseCSSPrefix + 'accordion-body');
  }
  if (!multi) {
    if (expandedItem) {
      comp.setCollapsed(expandedItem !== comp);
    } else {
      if (comp.getCollapsed() === false) {
        expandedItem = comp;
      } else {
        comp.setCollapsed(true);
      }
    }
    owner.mon(comp, 'beforecollapse', me.onBeforeComponentCollapse, me);
    owner.mon(comp, 'beforeexpand', me.onBeforeComponentExpand, me);
  }
  owner.mon(comp, 'collapse', me.updatePanelClasses, me);
  owner.mon(comp, 'expand', me.updatePanelClasses, me);
  comp.headerOverCls = Ext.baseCSSPrefix + 'accordion-hd-over';
  if (!me.processing && !multi) {
    if (!expandedItem) {
      comp.setCollapsed(false);
    } else {
      if (me.activeOnTop) {
        me.configureItem(expandedItem);
        expandedItem.setCollapsed(false);
        if (owner.items.indexOf(expandedItem) > 0) {
          owner.insert(0, expandedItem);
        }
      }
    }
  }
}, configureTitleCollapse:function(comp, titleCollapse) {
  var collapsible = comp.getCollapsible();
  if (Ext.isObject(collapsible)) {
    var header = collapsible.getTarget().getHeader();
    if (header) {
      if (titleCollapse) {
        collapsible.setUseDrawer(false);
        collapsible.setAnimation(false);
      }
      if (header.element && titleCollapse) {
        header.element.un({destroyable:true, scope:comp, tap:this.onTitleTap});
        header.element.on({destroyable:true, scope:comp, tap:this.onTitleTap});
      }
    }
  }
}, onTitleTap:function() {
  this.setCollapsed(!this.getCollapsed());
}, configureItem:function(item) {
  item.ignoreHeaderBorderManagement = true;
  item.animCollapse = false;
  if (this.fill) {
    item.flex = 1;
  }
}, getVisibleItems:function() {
  var owner = this.owner, items = owner ? owner.items.items : [], item, len = items.length, i = 0, visible = [];
  for (var i = 0; i < len; i++) {
    item = items[i];
    if (!item.rendered && item.hidden !== true || item.rendered && item.isVisible()) {
      visible.push(item);
    }
  }
  return visible;
}, updatePanelClasses:function() {
  var children = this.getVisibleItems(), ln = children.length, siblingCollapsed = true, i, child, header;
  for (i = 0; i < ln; i++) {
    child = children[i];
    header = child.getHeader ? child.getHeader() : null;
    if (header) {
      header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd', true);
      header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd-sibling-expanded', !siblingCollapsed);
      header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd-last-collapsed', i + 1 === ln && child.getCollapsed());
    }
    siblingCollapsed = child.getCollapsed();
  }
}, onBeforeComponentExpand:function(toExpand) {
  var me = this, owner = me.owner, multi = me.multi, moveToTop = !multi && !me.animate && me.activeOnTop, expanded;
  if (!me.processing) {
    me.processing = true;
    if (!multi) {
      expanded = me.getExpanded()[0];
      if (expanded && expanded !== toExpand) {
        expanded.collapse();
      }
    }
    if (moveToTop) {
      Ext.suspendLayouts();
      owner.insert(0, toExpand);
      Ext.resumeLayouts();
    }
    me.processing = false;
  }
}, onBeforeComponentCollapse:function(comp) {
  var me = this, owner = me.owner, toExpand, expanded;
  if (me.owner.items.getCount() === 1) {
    return false;
  }
  if (!me.processing) {
    me.processing = true;
    toExpand = comp.next() || comp.prev();
    if (me.multi) {
      expanded = me.getExpanded();
      if (expanded.length === 1) {
        toExpand.expand();
      }
    } else {
      if (toExpand) {
        toExpand.expand();
      }
    }
    me.processing = false;
  }
}});
Ext.define('ABPControlSet.common.CSSGrid', {extend:'Ext.Mixin', responsiveGridTplFormat:'1fr', gridTplFormat:'1fr', gridTplFormatIE:'1fr', defaultTopGroupName:'__0__', fillRowWidth:true, columnPrecedence:false, defaultMinColumnWidth:180, gridContainerStyled:false, baseCls:'css-grid-container', baseResponsiveCls:'css-grid-container-responsive', groupCls:'css-grid-container-group', gridItemCls:'css-grid-container-item', itemBodyCls:'css-grid-container-item-body', responsive:Ext.toolkit === 'modern' ? 
true : false, fillEmptySpace:false, baseColumnWidth:null, maxColumns:null, minColumnWidth:1, columnSpacing:null, rowSpacing:null, defaultSpacing:4, contentJustify:null, containerSpacing:null, runCalculations:function(items, forceUpdate) {
  var me = this, containerWidth = me.getTargetWidth(), gridCt = me.getRenderTarget();
  containerWidth = Ext.isString(containerWidth) ? parseInt(containerWidth) : containerWidth;
  if (gridCt && !Ext.isEmpty(containerWidth)) {
    if (me.responsive && me.calculateLayoutInfo(items, containerWidth, forceUpdate)) {
      var groups = me.getGroups(items);
      for (var groupName in groups) {
        groups[groupName].configured = groups[groupName].calculated = false;
      }
      me.calculateItems(items, me.columnWidth, me.columns, me.defaultTopGroupName);
      me.updateGridContainer(gridCt, me.columnWidth, me.columns);
    } else {
      if (!me.responsive) {
        me.calculateLayoutInfo(items, containerWidth);
        me.calculateFill(items);
        me.updateGridContainer(gridCt, me.columnWidth, me.columns);
        me.calculateItems(items);
      }
    }
  }
}, getTargetWidth:function() {
  var me = this;
  if (Ext.toolkit === 'modern') {
    var target = me.getRenderTarget(), targetEl = target ? target.el : null;
    return targetEl ? targetEl.getWidth() : undefined;
  } else {
    var owner = me.owner;
    if (owner.bodyResponsiveWidth && owner.bodyFixedWidth) {
      var gridCt = me.gridCt;
      return gridCt.getStyle('width') || gridCt.getWidth();
    } else {
      var targetContext = me.ownerContext.targetContext;
      return targetContext.getProp('width') || targetContext.getStyle('width') || (targetContext.lastBox ? targetContext.lastBox.width : targetContext.getDomProp('width'));
    }
  }
}, findAllAt:function(isColumn, placement, items) {
  var me = this, length = items.length, item, isLabel, atPlacement = [], itemSpacing, itemSpacingFactor, itemPlacement, itemSpan, isPercent, itemSize, earliestFillIndex = placement, allFill = true, isSingle = false, hasFill = false, hasFillViaChild = false;
  for (var i = 0; i < length; i++) {
    item = items[i];
    isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label;
    itemPlacement = (isColumn ? item.responsiveCol : item.responsiveRow) || 0;
    itemSpan = (isColumn ? item.responsiveColSpan : item.responsiveRowSpan) || 1;
    if (itemPlacement === placement || itemPlacement < placement && itemSpan > 1 && itemPlacement + itemSpan - 1 >= placement) {
      hasFillViaChild = item.responsiveFillViaChild === true ? true : false;
      hasFill = hasFillViaChild || (isColumn ? Ext.isBoolean(item.responsiveFillWidth) ? item.responsiveFillWidth : !!item.responsiveFill : Ext.isBoolean(item.responsiveFillHeight) ? item.responsiveFillHeight : !!item.responsiveFill);
      allFill = allFill === false ? false : hasFill;
      earliestFillIndex = hasFill ? itemPlacement < earliestFillIndex ? itemPlacement : earliestFillIndex : earliestFillIndex;
      isPercent = false;
      itemSize = isColumn ? item.width || item.responsiveWidth || item.minWidth : item.height || item.responsiveHeight || item.minHeight;
      isSingle = itemSpan === 1 && itemPlacement === placement;
      itemSpacing = me.getItemSpacing(item);
      itemSpacingFactor = isColumn ? itemSpacing.left : itemSpacing.top;
      if (!Ext.isEmpty(itemSize)) {
        isPercent = Ext.isString(itemSize) && itemSize.indexOf('%') !== -1;
        itemSize = parseInt(itemSize) / itemSpan + (isPercent ? '%' : 0);
        itemSize = Ext.isNumber(itemSize) ? Math.round(itemSize + itemSpacingFactor * (isColumn && isLabel ? 1 : 2)) : itemSize;
      }
      atPlacement.push({single:isSingle, fillViaChild:hasFillViaChild, fill:hasFill, allFill:allFill, earliestFillIndex:earliestFillIndex, size:itemSize, isPercent:isPercent, item:item});
    }
  }
  return atPlacement;
}, translateItemsForResponsiveTemplate:function(isColumn, items) {
  var me = this, length = items.length, item, isLabel, atPlacement = [], itemSpacing, itemSpacingFactor, itemSpan, isPercent, itemSize, earliestFillIndex = 0, allFill = true, hasFill = false, hasFillViaChild = false;
  for (var i = 0; i < length; i++) {
    item = items[i];
    isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label;
    itemSpan = (isColumn ? item.responsiveColSpan : item.responsiveRowSpan) || 1;
    hasFillViaChild = item.responsiveFillViaChild === true ? true : false;
    hasFill = hasFillViaChild || (isColumn ? Ext.isBoolean(item.responsiveFillWidth) ? item.responsiveFillWidth : !!item.responsiveFill : Ext.isBoolean(item.responsiveFillHeight) ? item.responsiveFillHeight : !!item.responsiveFill);
    allFill = allFill === false ? false : hasFill;
    earliestFillIndex = hasFill ? i < earliestFillIndex ? i : earliestFillIndex : earliestFillIndex;
    isPercent = false;
    itemSize = isColumn ? item.width || item.responsiveWidth || item.minWidth : item.height || item.responsiveHeight || item.minHeight;
    itemSpacing = me.getItemSpacing(item);
    itemSpacingFactor = isColumn ? itemSpacing.left : itemSpacing.top;
    if (!Ext.isEmpty(itemSize)) {
      isPercent = Ext.isString(itemSize) && itemSize.indexOf('%') !== -1;
      itemSize = parseInt(itemSize) / itemSpan + (isPercent ? '%' : 0);
      itemSize = Ext.isNumber(itemSize) ? Math.round(itemSize + itemSpacingFactor * (isColumn && isLabel ? 1 : 2)) : itemSize;
    }
    atPlacement.push({single:length === 1, fillViaChild:hasFillViaChild, fill:hasFill, allFill:allFill, earliestFillIndex:earliestFillIndex, size:itemSize, isPercent:isPercent, item:item});
  }
  return atPlacement;
}, calculateMaxRowAndColumn:function(items) {
  var me = this, length = items.length, item, column, colspan, maxColumn = 0, row, rowspan, maxRow = 0, noItemsHaveSpecs = true;
  for (var i = 0; i < length; i++) {
    item = items[i];
    if (!Ext.isEmpty(item.responsiveCol) || !Ext.isEmpty(item.responsiveColSpan)) {
      noItemsHaveSpecs = false;
    }
    column = item.responsiveCol || 0;
    colspan = item.responsiveColSpan || 1;
    if (column + colspan > maxColumn) {
      me.maxColumn = maxColumn = column + colspan;
    }
    if (!Ext.isEmpty(item.responsiveRow) || !Ext.isEmpty(item.responsiveRowSpan)) {
      noItemsHaveSpecs = false;
    }
    row = item.responsiveRow || 0;
    rowspan = item.responsiveRowSpan || 1;
    if (row + rowspan > maxRow) {
      me.maxRow = maxRow = row + rowspan;
    }
  }
  if (noItemsHaveSpecs) {
    me.maxRow = me.maxColumn = length;
  }
}, calculateLayoutInfo:function(items, newWidth, forceUpdate) {
  var me = this, responsive = me.responsive;
  if (responsive) {
    var needsUpdate = false, oldWidth = me.oldWidth, defaultTopGroupName = me.defaultTopGroupName, oldColumnCount = me.columns, oldColumnWidth = me.columnWidth;
    if (!Ext.isEmpty(oldWidth) && newWidth === oldWidth && forceUpdate !== true) {
      needsUpdate = false;
    } else {
      me.calculateMaxRowAndColumn(items);
      var info = me.getColumnsAndColumnWidth(items, newWidth, me.maxColumns, me.baseColumnWidth);
      me.columns = info.columns;
      me.columnWidth = info.columnWidth;
      if (forceUpdate === true || (me.columns !== oldColumnCount || me.columnWidth !== oldColumnWidth)) {
        needsUpdate = true;
      }
      me.configureItems(items, defaultTopGroupName, me.columns, me.columnWidth);
    }
    if (needsUpdate) {
      me.oldWidth = newWidth;
    }
    return needsUpdate;
  } else {
    me.calculateMaxRowAndColumn(items);
    me.columnStyle = me.calculateColumnsTemplate(items);
    me.rowStyle = me.calculateRowsTemplate(items);
  }
}, calculateRowsTemplate:function(items) {
  items = items || [];
  var me = this, rowsTemplate = '', rowsInStart, fillUsed = {used:false, earliestFillIndex:0}, maxRow = me.maxRow;
  for (var i = 0; i <= maxRow - 1; i++) {
    rowsInStart = me.findAllAt(false, i, items);
    if (fillUsed.used && fillUsed.earliestFillIndex < i) {
      fillUsed.used = false;
    }
    rowsTemplate += me.calculateItemTemplate(rowsInStart, false, fillUsed) + ' ';
  }
  return rowsTemplate;
}, calculateColumnsTemplate:function(items) {
  items = items || [];
  var me = this, columnsTemplate = '', columnsInStart, maxColumn = me.maxColumn, fillUsed = {used:false, earliestFillIndex:maxColumn - 1};
  for (var i = maxColumn - 1; i >= 0; i--) {
    columnsInStart = me.findAllAt(true, i, items);
    if (fillUsed.used && fillUsed.earliestFillIndex < i) {
      fillUsed.used = false;
    }
    columnsTemplate = ' ' + me.calculateItemTemplate(columnsInStart, true, fillUsed) + columnsTemplate;
  }
  return columnsTemplate;
}, calculateItemTemplate:function(inPlacement, isColumn, fillUsed) {
  inPlacement = inPlacement || [];
  var length = inPlacement.length, val = '';
  if (length) {
    var item, size, single, minSize, earliestFillIndex, isPlacementToFill, isFill, singleSize, singleHasFill, itemWithFillSize, itemFillViaChild, currentFillMinSizePercent, currentSingleMinSizePercent, currentMinSizePercent;
    for (var i = 0; i < length; i++) {
      item = inPlacement[i];
      size = item.size;
      if (item.allFill || length === 1 && item.single === true && (item.fill || item.fillViaChild === true)) {
        singleHasFill = true;
      }
      if (length === 1 && item.single === true && !Ext.isEmpty(size)) {
        single = true;
        if (item.isPercent && Ext.isString(singleSize) && singleSize.indexOf('%') !== -1) {
          currentSingleMinSizePercent = parseInt(singleSize);
          singleSize = currentSingleMinSizePercent > size ? singleSize : size + '%';
        } else {
          if (size > singleSize) {
            singleSize = size;
          } else {
            if (Ext.isEmpty(singleSize)) {
              singleSize = size;
            }
          }
        }
      }
      if (item.fill === true || item.fillViaChild === true) {
        earliestFillIndex = isColumn ? earliestFillIndex > item.earliestFillIndex ? item.earliestFillIndex : earliestFillIndex : earliestFillIndex < item.earliestFillIndex ? item.earliestFillIndex : earliestFillIndex;
        isFill = itemFillViaChild = true;
        if (item.isPercent && Ext.isString(itemWithFillSize) && itemWithFillSize.indexOf('%') !== -1) {
          currentFillMinSizePercent = parseInt(itemWithFillSize);
          itemWithFillSize = currentFillMinSizePercent > size ? itemWithFillSize : size + '%';
        } else {
          if (size > itemWithFillSize || Ext.isEmpty(itemWithFillSize)) {
            itemWithFillSize = size;
          }
        }
      }
      if (item.isPercent && Ext.isString(minSize) && minSize.indexOf('%') !== -1) {
        currentMinSizePercent = parseInt(minSize);
        minSize = currentMinSizePercent > size ? minSize : size + '%';
      } else {
        if (size > minSize) {
          minSize = size;
        } else {
          if (Ext.isEmpty(minSize)) {
            minSize = size;
          }
        }
      }
    }
    if ((isFill || itemFillViaChild) && !fillUsed.used) {
      fillUsed.earliestFillIndex = earliestFillIndex;
      isPlacementToFill = true;
      fillUsed.used = true;
    }
    if (Ext.isString(minSize) && minSize.indexOf('%') !== -1) {
      minSize = minSize + '%';
      if (minSize === '100%') {
        minSize = '1fr';
      }
    } else {
      if (Ext.isNumber(minSize)) {
        minSize = minSize + 'px';
      } else {
        minSize = null;
      }
    }
    if (Ext.isString(itemWithFillSize) && itemWithFillSize.indexOf('%') !== -1) {
      itemWithFillSize = itemWithFillSize + '%';
      if (itemWithFillSize === '100%') {
        itemWithFillSize = '1fr';
      }
    } else {
      if (Ext.isNumber(itemWithFillSize)) {
        itemWithFillSize = itemWithFillSize + 'px';
      } else {
        itemWithFillSize = null;
      }
    }
    if (minSize === '0px' || minSize === '0%') {
      val = '0px';
    } else {
      if (single) {
        if (Ext.isString(singleSize) && singleSize.indexOf('%') !== -1) {
          singleSize = singleSize + '%';
          if (singleSize === '100%') {
            singleSize = '1fr';
          }
        } else {
          if (Ext.isNumber(singleSize)) {
            singleSize = singleSize + 'px';
          } else {
            singleSize = null;
          }
        }
        if (isColumn) {
          val = Ext.isNumber(parseInt(singleSize)) ? singleSize : 'auto';
        } else {
          val = Ext.isNumber(parseInt(singleSize)) ? singleSize ? singleSize : 'auto' : 'max-content';
        }
        if (singleHasFill) {
          val = 'minmax(' + val + ', 1fr)';
        }
      } else {
        if (isPlacementToFill || singleHasFill) {
          val = Ext.isNumber(parseInt(itemWithFillSize)) ? itemWithFillSize : itemWithFillSize ? 'auto' : 'min-content';
          val = 'minmax(' + val + ', 1fr)';
        } else {
          if (isColumn) {
            val = Ext.isNumber(parseInt(minSize)) ? 'max-content' : isPlacementToFill ? '0px' : 'min-content';
          } else {
            val = Ext.isNumber(parseInt(minSize)) ? minSize : isFill ? 'auto' : 'min-content';
          }
        }
      }
    }
  } else {
    val = '0px';
  }
  return val;
}, calculateFill:function(items) {
  var me = this, owner, length = items.length, item;
  if (Ext.toolkit === 'modern') {
    owner = me.getContainer();
  } else {
    owner = me.owner;
  }
  for (var i = 0; i < length; i++) {
    item = items[i];
    if ((item.responsiveFill || item.responsiveFillViaChild) && owner.responsiveFill !== true && owner.responsiveFillViaChild !== true) {
      owner.responsiveFillViaChild = true;
    }
  }
}, determineItemsWithColumnRowSorting:function(items) {
  return items.sort(this.columnAndRowSort);
}, columnAndRowSort:function(itemA, itemB) {
  if (itemA.responsiveRow === itemB.responsiveRow) {
    if (itemA.responsiveCol < itemB.responsiveCol) {
      return -1;
    } else {
      if (itemA.responsiveCol === itemB.responsiveCol) {
        return 0;
      }
      return 1;
    }
  } else {
    if (itemA.responsiveRow < itemB.responsiveRow) {
      return -1;
    } else {
      if (itemA.responsiveRow === itemB.responsiveRow) {
        return 0;
      }
      return 1;
    }
  }
}, isColumnAndRowSortable:function(items) {
  var i, item, len = items.length;
  for (i = 0; i < len; i++) {
    item = items[i];
    if (Ext.isEmpty(item.responsiveCol) || Ext.isEmpty(item.responsiveColSpan) || Ext.isEmpty(item.responsiveRow) || Ext.isEmpty(item.responsiveRowSpan)) {
      return false;
    }
  }
  return true;
}, calculateItems:function(items, columnWidth, columns, groupName) {
  if (this.responsive) {
    this.rowStyle = this.calculateResponsiveItems(items, columnWidth, columns, groupName);
  } else {
    var me = this, len = items.length, item, style, minWidth, isLabel, itemSpacing, minHeight, itemWidth, margin, bodyEl, col, colspan, row, rowspan, bodyStyle, spanRowEnd, spanColEnd, largestRowCount = me.maxRow, largestColumnCount = me.maxColumn;
    for (var i = 0; i < len; i++) {
      item = items[i];
      bodyEl = Ext.toolkit === 'modern' ? item.bodyWrapElement : item.bodyEl;
      bodyStyle = null;
      isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label;
      itemSpacing = me.getItemSpacing(item);
      style = {};
      row = (item.responsiveRow || 0) + 1;
      rowspan = item.responsiveRowSpan || 1;
      col = (item.responsiveCol || 0) + 1;
      colspan = item.responsiveColSpan || 1;
      spanRowEnd = len != 1 && item.responsiveFill && row + (rowspan - 1) >= largestRowCount ? true : false;
      spanColEnd = len != 1 && item.responsiveFill && col + (colspan - 1) >= largestColumnCount ? true : false;
      if (Ext.isIE) {
        Ext.apply(style, {'-ms-grid-row':row, '-ms-grid-row-span':rowspan, '-ms-grid-column':col, '-ms-grid-column-span':colspan});
        if (item.cellAlign || isLabel) {
          Ext.apply(style, {'-ms-grid-column-align':item.cellAlign || (isLabel ? 'flex-end' : 'safe')});
        }
      } else {
        Ext.apply(style, {'grid-row-start':row, 'grid-row-end':'span ' + (spanRowEnd ? 'end' : rowspan), 'grid-column-start':col, 'grid-column-end':'span ' + (spanColEnd ? 'end' : colspan)});
        if (item.cellAlign || isLabel) {
          Ext.apply(style, {'justify-self':item.cellAlign || (isLabel ? 'flex-end' : 'safe')});
          if (Ext.browser.is.Firefox && isLabel) {
            Ext.apply(style, {'align-self':'center'});
          }
        }
      }
      minHeight = item.responsiveMinHeight || item.minHeight || 0;
      if (Ext.isString(minHeight) && minHeight.indexOf('%') !== -1) {
      } else {
        if (Ext.isNumber(minHeight)) {
          minHeight = minHeight + 'px';
        }
      }
      minWidth = item.responsiveMinWidth || item.minWidth || 0;
      if (Ext.isString(minWidth) && minWidth.indexOf('%') !== -1) {
      } else {
        if (Ext.isNumber(minWidth)) {
          minWidth = minWidth + 'px';
        }
      }
      itemWidth = item.responsiveWidth || item.width;
      if (Ext.isString(itemWidth) && itemWidth.indexOf('%') !== -1) {
      } else {
        if (Ext.isNumber(itemWidth)) {
          itemWidth = itemWidth + 'px';
        }
      }
      itemHeight = item.responsiveHeight || item.height;
      if (Ext.isString(itemHeight) && itemHeight.indexOf('%') !== -1) {
      } else {
        if (Ext.isNumber(itemHeight)) {
          itemHeight = itemHeight + 'px';
        }
      }
      if ((Ext.toolkit === 'modern' ? item instanceof Ext.field.Field : item instanceof Ext.form.field.Base) && bodyEl) {
        bodyStyle = bodyStyle || {};
        if (item.responsiveFill === true) {
          Ext.apply(bodyStyle, {'width':'100%'});
        } else {
          if (item.responsiveFillWidth === true) {
            Ext.apply(bodyStyle, {'width':'100%'});
          } else {
            Ext.apply(bodyStyle, {'width':itemWidth});
          }
        }
        if (!Ext.isEmpty(minWidth)) {
          Ext.apply(bodyStyle, {'minWidth':minWidth});
        }
        if (!Ext.isEmpty(minHeight)) {
          Ext.apply(bodyStyle, {'minHeight':minHeight});
        }
        if (bodyEl) {
          if (bodyEl.dom) {
            Ext.apply(bodyEl.dom.style, bodyStyle);
          } else {
            bodyEl.setStyle(bodyStyle);
          }
        }
      }
      if (!Ext.isEmpty(minWidth) && Ext.isEmpty(style.minWidth)) {
        style.minWidth = minWidth;
      }
      if (!Ext.isEmpty(minHeight) && Ext.isEmpty(style.minHeight)) {
        style.minHeight = minHeight;
      }
      if (!Ext.isEmpty(itemWidth) && Ext.isEmpty(style.width)) {
        style.width = itemWidth;
      }
      if (!Ext.isEmpty(itemHeight) && Ext.isEmpty(style.height)) {
        style.height = itemHeight;
      }
      if (item.responsiveFill === true || item.responsiveFillViaChild == true) {
        style.width = '100%';
        style.height = (Ext.toolkit === 'modern' ? item instanceof Ext.field.Field : item instanceof Ext.form.field.Base) ? 'auto' : '100%';
      } else {
        if (Ext.isEdge || Ext.isIE) {
          style.minWidth = 'calc(100% - ' + (itemSpacing.left + itemSpacing.right) + 'px)';
        }
      }
      if (!(item instanceof Ext.Container) || item.isLabelable) {
        style[Ext.browser.is.Firefox && !(item instanceof Ext.Button) ? 'padding' : 'margin'] = me.getItemSpacingStyle(itemSpacing);
      }
      if (item.setStyle) {
        item.setStyle(style);
      } else {
        if (item.protoEl && item.protoEl.setStyle) {
          item.protoEl.setStyle(style);
        }
      }
    }
  }
}, calculateResponsiveItems:function(items, columnWidth, columns, groupName) {
  var me = this, item, itemEl, itemRow, isGroup, previousIsGroup = false, previousItemRow = -1, previousItemSetRow = -1, len = items.length, style, bodyEl, translatedItems, calcItems = [], checkStyle, groupStyle, groups = me.groups, group, modern = Ext.toolkit === 'modern', rowIdx = 0, fillUsed = {used:false, earliestFillIndex:0}, single = false, rowStyle = '', template, currentGroupName, colIdx = 0, rowspans = [], j, spacingStyle, itemSpacing;
  items = me.determineItemsWithColumnRowSorting(items);
  if (Ext.isEmpty(columnWidth) || Ext.isEmpty(columns)) {
    return;
  }
  for (var i = 0; i < len; i++) {
    item = items[i];
    itemRow = item.responsiveRow;
    itemEl = item.el;
    itemSpacing = me.getItemSpacing(item);
    itemEl.toggleCls(me.gridItemCls, true);
    if (colIdx + item.colspan > columns || itemRow > previousItemRow && previousItemSetRow === rowIdx + 1) {
      single = calcItems.length === 0;
      calcItems = single ? [item] : calcItems;
      colIdx = 0;
      rowIdx++;
      for (j = 0; j < columns; j++) {
        if (rowspans[j] > 0) {
          rowspans[j]--;
        }
      }
      translatedItems = me.translateItemsForResponsiveTemplate(false, calcItems);
      template = me.calculateItemTemplate(translatedItems, false, fillUsed);
      rowStyle += ' ' + template;
      calcItems = single ? [] : [item];
    } else {
      while (colIdx >= columns || rowspans[colIdx] > 0) {
        if (colIdx >= columns) {
          for (j = 0; j < columns; j++) {
            if (rowspans[j] > 0) {
              rowspans[j]--;
            }
          }
        } else {
          colIdx++;
        }
      }
      calcItems.push(item);
    }
    var useFullWidth = !!(item.layout ? item.layout.contentJustify : false);
    style = {'justify-self':item.cellAlign || 'stretch', 'align-self':item.rowAlign, '-ms-grid-row':(rowIdx + 1).toString(), '-ms-grid-column-span':Ext.isIE ? item.colspan || 1 : undefined, '-ms-grid-column':Ext.isIE ? (colIdx + 1).toString() : undefined, 'grid-column-start':(colIdx + 1).toString(), 'grid-column-end':'span ' + item.colspan, 'grid-row-start':(rowIdx + 1).toString(), 'width':useFullWidth ? '100%' : 'auto'};
    if (modern ? item instanceof Ext.field.Field : item instanceof Ext.form.field.Base) {
      bodyEl = modern ? item.bodyWrapElement : item.bodyEl;
      if (bodyEl) {
        bodyEl.toggleCls(me.itemBodyCls, true);
      }
    } else {
      if (item instanceof Ext.Container) {
        bodyEl = modern ? item.bodyWrapElement : item.body;
        if (bodyEl) {
          bodyEl.toggleCls(me.itemBodyCls, true);
        }
      }
    }
    if (Ext.isEdge) {
      style.minWidth = '100%';
    }
    if (item.fixedWidth) {
      var maxWidth = item.responsiveWidth || item.responsiveMaxWidth || item.responsiveMinWidth;
      if (Ext.isString(maxWidth)) {
        style['max-width'] = maxWidth;
      } else {
        if (maxWidth >= columnWidth * columns) {
          maxWidth = columnWidth * columns;
        }
        style['max-width'] = maxWidth + 'px';
      }
    }
    isGroup = item instanceof Ext.Container;
    if (!Ext.isEmpty(me.containerSpacing) && isGroup) {
      style['margin-left'] = previousIsGroup && previousItemSetRow === rowIdx ? Ext.isString(me.containerSpacing) ? me.containerSpacing : me.containerSpacing + 'px' : '0px';
    }
    previousIsGroup = isGroup;
    spacingStyle = me.getItemSpacingStyle(itemSpacing);
    if (item instanceof Ext.Button) {
      style.width = 'calc(100% - ' + (itemSpacing.right + itemSpacing.left) + 'px)';
      style.margin = spacingStyle;
    } else {
      style.padding = spacingStyle;
    }
    itemEl.setStyle(style);
    for (j = item.colspan || 1; j; --j) {
      rowspans[colIdx] = item.rowspan || 1;
      ++colIdx;
    }
    previousItemRow = itemRow;
    previousItemSetRow = rowIdx;
  }
  if (calcItems.length > 0) {
    translatedItems = me.translateItemsForResponsiveTemplate(false, calcItems);
    template = me.calculateItemTemplate(translatedItems, false, fillUsed);
    rowStyle += ' ' + template;
  }
  return rowStyle;
}, getItemSpacing:function(item) {
  var me = this, itemEl = item.el ? item.el : item.element, useMargin = item instanceof Ext.Button, columnSpacing = me.columnSpacing, rowSpacing = me.rowSpacing, spacing = Ext.dom.Element.parseBox(me.defaultSpacing), itemSpacing = Ext.isEmpty(item.spacing) ? spacing : Ext.dom.Element.parseBox(item.spacing), isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label, styles = {};
  if (!Ext.isEmpty(columnSpacing)) {
    spacing.left = spacing.right = columnSpacing;
  }
  if (!Ext.isEmpty(rowSpacing)) {
    spacing.top = spacing.botton = rowSpacing;
  }
  if (itemEl) {
    var top = (useMargin ? itemEl.getMargin('t') : itemEl.getPadding('t')) || undefined, right = (useMargin ? itemEl.getMargin('r') : itemEl.getPadding('r')) || undefined, bottom = (useMargin ? itemEl.getMargin('b') : itemEl.getPadding('b')) || undefined, left = (useMargin ? itemEl.getMargin('l') : itemEl.getPadding('l')) || undefined;
    if (top) {
      styles.top = top;
    }
    if (right) {
      styles.right = right;
    }
    if (bottom) {
      styles.bottom = bottom;
    }
    if (left) {
      styles.left = left;
    }
  }
  Ext.applyIf(itemSpacing, spacing);
  Ext.apply(itemSpacing, styles);
  if (isLabel) {
    itemSpacing.right = 0;
  }
  return itemSpacing;
}, getItemSpacingStyle:function(itemSpacing) {
  return itemSpacing.top + 'px ' + itemSpacing.right + 'px ' + itemSpacing.bottom + 'px ' + itemSpacing.left + 'px';
}, configureItems:function(items, groupName, columns, columnWidth) {
  var me = this, i = 0, groups = me.groups || me.getGroups(items), len = items.length, item, info, group, groupWidth, groupColSpan, currentGroupName, currentItemColSpan, currentItemRow, previousItemRow = len > 0 ? items[0].responsiveRow : null, emptyColumns = columns, lastEndIndex = 0, fillRowWidth = me.fillRowWidth, rowFinished = false;
  for (; i < len; i++) {
    item = items[i];
    groupColSpan = false;
    groupWidth = 0;
    currentGroupName = item.responsiveGroup;
    group = groups[currentGroupName];
    if (group && currentGroupName !== groupName) {
      if (group.configured) {
        continue;
      } else {
        groupColSpan = me.getGroupColSpan(group.items, emptyColumns, columnWidth);
      }
    }
    if (groupColSpan) {
      if (groupColSpan > emptyColumns) {
        if (emptyColumns !== columns) {
          if (fillRowWidth) {
            me.stretchItemsForRow(items, lastEndIndex, emptyColumns, columns, i, columnWidth);
          }
          emptyColumns = columns;
          lastEndIndex = i;
          i--;
          rowFinished = true;
          continue;
        } else {
          groupColSpan = groupColSpan > columns ? columns : groupColSpan;
          groupWidth = groupColSpan * columnWidth;
        }
      } else {
        groupWidth = groupColSpan * columnWidth;
      }
      info = me.getColumnsAndColumnWidth(group.items, groupWidth);
      group.columns = info.columns;
      group.columnWidth = info.columnWidth;
      group.colspan = groupColSpan;
      me.configureItems(group.items, currentGroupName, info.columns, info.columnWidth);
      me.updateGridContainer(group.el, info.columnWidth, info.columns);
      group.configured = true;
      if (groups[group.parentGroup] && !groups[group.parentGroup].configured) {
        groups[group.parentGroup].configured = me.isParentGroupFinished('configured', group.parentGroup);
      }
      emptyColumns = emptyColumns - group.colspan;
      if (emptyColumns > 0) {
        rowFinished = false;
      } else {
        rowFinished = true;
        lastEndIndex = i;
        emptyColumns = columns;
      }
    } else {
      currentItemRow = Ext.isEmpty(item.responsiveRow) ? null : item.responsiveRow;
      currentItemColSpan = me.getItemColSpan(item, emptyColumns, columnWidth);
      if (emptyColumns === columns && currentItemColSpan >= columns) {
        item.colspan = columns;
        lastEndIndex = i + 1;
        previousItemRow = items[lastEndIndex] ? items[lastEndIndex].responsiveRow : currentItemRow;
        rowFinished = true;
      } else {
        if (currentItemColSpan > emptyColumns || currentItemRow !== null && previousItemRow === null || currentItemRow !== null && previousItemRow !== null && currentItemRow > previousItemRow) {
          if (fillRowWidth) {
            me.stretchItemsForRow(items, lastEndIndex, emptyColumns, columns, i, columnWidth);
          }
          emptyColumns = columns;
          lastEndIndex = i;
          i--;
          previousItemRow = currentItemRow;
          rowFinished = false;
        } else {
          item.colspan = currentItemColSpan;
          emptyColumns -= currentItemColSpan;
          if (emptyColumns > 0) {
            previousItemRow = currentItemRow;
            rowFinished = false;
          } else {
            emptyColumns = columns;
            lastEndIndex = i;
            previousItemRow = items[i + 1] ? items[i + 1].responsiveRow : currentItemRow;
            rowFinished = true;
          }
        }
      }
    }
  }
  if (len > 0 && fillRowWidth && !rowFinished) {
    me.stretchItemsForRow(items, lastEndIndex, emptyColumns, columns, len, columnWidth);
  }
}, updateGridContainer:function(gridCt, columnWidth, columns) {
  var me = this, owner = me.owner || me.getContainer(), gridDom = gridCt.dom ? gridCt.dom : gridCt, gridStyle = gridDom ? gridDom.style : null, totalWidth = gridCt ? gridCt.getWidth() : null;
  if (gridStyle) {
    var style = {};
    if (!me.gridContainerStyled) {
      gridCt.toggleCls(me.baseCls, true);
      if (me.responsive) {
        gridCt.toggleCls(me.baseResponsiveCls, true);
      }
      me.gridContainerStyled = true;
    }
    var columnsTemplate = me.columnStyle, trimLastColumn = false, rowsTemplate = me.rowStyle;
    if (me.responsive) {
      if (me.contentJustify) {
        style['justify-content'] = me.contentJustify;
      }
      if (me.fixedColumnWidth) {
        columnsTemplate = Ext.String.repeat(me.fixedColumnWidth + 'px', columns, ' ');
      } else {
        if (totalWidth && totalWidth < columnWidth * columns) {
          trimLastColumn = true;
        }
        columnsTemplate = Ext.String.repeat(Ext.String.format(me.responsiveGridTplFormat, columnWidth), trimLastColumn ? columns - 1 : columns, ' ');
        if (columns === 1) {
          columnsTemplate = '100%';
        } else {
          if (trimLastColumn) {
            columnsTemplate += ' 1fr';
          }
        }
      }
      if (owner.bodyFixedWidth && owner.bodyResponsiveWidth) {
        var maxWidth = owner.bodyResponsiveWidth || owner.bodyResponsiveWidth || owner.bodyResponsiveWidth;
        if (Ext.isString(maxWidth)) {
          style['max-width'] = maxWidth;
        } else {
          style['max-width'] = maxWidth + 'px';
        }
      } else {
        style['max-width'] = '100%';
      }
    }
    if (owner.responsiveFillViaChild && gridStyle['height'] !== '100%') {
      style['height'] = '100%';
    }
    if (Ext.isIE && columnsTemplate !== gridStyle['-ms-grid-columns']) {
      style['-ms-grid-columns'] = columnsTemplate;
    } else {
      if (columnsTemplate !== gridStyle['grid-template-columns']) {
        style['grid-template-columns'] = columnsTemplate;
      }
    }
    if (Ext.isIE && rowsTemplate !== gridStyle['-ms-grid-rows']) {
      style['-ms-grid-rows'] = rowsTemplate;
    } else {
      if (rowsTemplate !== gridStyle['grid-template-rows']) {
        style['grid-template-rows'] = rowsTemplate;
      }
    }
    if (!Ext.Object.isEmpty(style)) {
      gridCt.setStyle(style);
    }
  }
}, getColumnWidth:function(items, newWidth) {
  var me = this, itemWidth, item, i, len = items.length, allWidths = [];
  for (i = 0; i < len; i++) {
    item = items[i];
    if (Ext.isEmpty(item.responsiveColSpan)) {
      itemWidth = item.responsiveWidth;
      if (Ext.isString(itemWidth) && itemWidth.indexOf('%') === -1) {
        itemWidth = parseInt(itemWidth);
      }
      if (itemWidth && !isNaN(itemWidth)) {
        allWidths.push(me.nearestEven(itemWidth));
      }
    }
  }
  if (allWidths.length > 0) {
    allWidths.push(me.nearestEven(newWidth));
    return Math.max(me.findGCD(allWidths), me.minColumnWidth);
  }
}, findGCD:function(items) {
  if (Object.prototype.toString.call(items) !== '[object Array]') {
    return false;
  }
  var len, a, b;
  len = items.length;
  if (!len) {
    return null;
  }
  a = items[0];
  for (var i = 1; i < len; i++) {
    b = items[i];
    a = this.gcdTwo(a, b);
  }
  return a;
}, gcdTwo:function(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    return false;
  }
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}, getLargestColumnWidth:function(items) {
  var columnWidth = 0, i, item, len = items.length, largestColumnWidth = null;
  for (i = 0; i < len; i++) {
    item = items[i];
    if (!Ext.isEmpty(item.responsiveColSpan)) {
      columnWidth = item.responsiveWidth || 0;
      columnWidth = columnWidth / (item.responsiveColSpan || 1);
      columnWidth = isNaN(columnWidth) ? 1 : columnWidth;
      if (columnWidth > largestColumnWidth) {
        largestColumnWidth = columnWidth;
      }
    }
  }
  return largestColumnWidth;
}, nearestEven:function(num) {
  return 2 * Math.round(num / 2);
}, getItemColSpan:function(item, emptyColumns, columnWidth) {
  var currentItemColSpan, widthColSpan = 0;
  if (!Ext.isEmpty(item.responsiveColSpan)) {
    currentItemColSpan = item.responsiveColSpan;
    var emptyWidth = emptyColumns * columnWidth, itemWidth = currentItemColSpan * columnWidth;
    if (emptyWidth <= itemWidth) {
      currentItemColSpan = emptyColumns;
    }
    if (Ext.isString(item.responsiveWidth) && item.responsiveWidth.indexOf('%') !== -1) {
      var percent = parseInt(item.responsiveWidth.replace('%', '')) / 100;
      widthColSpan = Math.round(percent * emptyColumns);
      itemWidth = widthColSpan * columnWidth;
      if (emptyWidth < itemWidth) {
        currentItemColSpan = emptyColumns;
      } else {
        currentItemColSpan = widthColSpan;
      }
    } else {
      if (Ext.isNumber(item.responsiveWidth)) {
        widthColSpan = Math.round(item.responsiveWidth / columnWidth) || 1;
        itemWidth = widthColSpan * columnWidth;
        if (emptyWidth <= itemWidth) {
          currentItemColSpan = widthColSpan;
        }
      }
    }
  } else {
    if (Ext.isString(item.responsiveWidth) && item.responsiveWidth.indexOf('%') !== -1) {
      var percent = parseInt(item.responsiveWidth.replace('%', '')) / 100;
      currentItemColSpan = Math.round(percent * emptyColumns);
    } else {
      if (Ext.isEmpty(item.responsiveWidth)) {
        currentItemColSpan = emptyColumns;
      } else {
        currentItemColSpan = Math.round(item.responsiveWidth / columnWidth) || 1;
        if (item.responsiveWidth > columnWidth * emptyColumns) {
          currentItemColSpan += 1;
        }
      }
    }
    if (Ext.isNumber(item.responsiveMinWidth)) {
      widthColSpan = Math.round(item.responsiveMinWidth / columnWidth) || 1;
    } else {
      if (Ext.isNumber(item.minWidth)) {
        widthColSpan = Math.round(item.minWidth / columnWidth) || 1;
      }
    }
    currentItemColSpan = widthColSpan > currentItemColSpan ? widthColSpan : currentItemColSpan;
  }
  return currentItemColSpan;
}, stretchItemsForRow:function(items, rowStartIndex, emptyColumns, totalCols, end) {
  var me = this, unfixedCount = 0, j, item, groups = me.groups, group, previousItem, previousItemColSpan, addToEach = 0, difference = 0, floor = true, extendLast = false, extraColSpan;
  if (end - rowStartIndex === 1) {
    item = items[rowStartIndex];
    item.colspan = totalCols;
    group = groups[item.responsiveGroup];
    if (group) {
      group.colspan = totalCols;
    }
  } else {
    for (j = rowStartIndex; j < end; j++) {
      if (!items[j].fixedWidth) {
        unfixedCount++;
      }
    }
    if (unfixedCount > 0) {
      addToEach = emptyColumns / unfixedCount;
      difference = addToEach % 1;
    } else {
      extendLast = true;
    }
    for (j = rowStartIndex; j < end; j++) {
      previousItem = items[j];
      previousItemColSpan = previousItem.colspan;
      if (!previousItem.fixedWidth) {
        if (addToEach > 0) {
          if (emptyColumns > 0) {
            extraColSpan = difference !== 0 ? floor ? Math.floor(addToEach) : Math.ceil(addToEach) : addToEach;
            if (j == end - 1) {
              previousItem.colspan = previousItemColSpan + emptyColumns;
              emptyColumns = 0;
            } else {
              previousItem.colspan = previousItemColSpan + extraColSpan;
              emptyColumns -= extraColSpan;
            }
            if (difference !== 0) {
              floor = !floor;
            }
          }
        }
      } else {
        if (extendLast && j == end - 1) {
          previousItem.colspan = previousItemColSpan + emptyColumns;
        }
      }
    }
  }
}, isParentGroupFinished:function(prop, groupName) {
  var me = this, i, groups = me.groups, groupToCheck = groups[groupName], ownItemsLength = groupToCheck.ownItems ? groupToCheck.ownItems.length : 0, groupsToCheck = groupToCheck.groups, len = groupsToCheck ? groupsToCheck.length : 0;
  if (ownItemsLength) {
    return false;
  }
  for (i = 0; i < len; i++) {
    if (!groups[groupsToCheck[i]][prop]) {
      return false;
    }
  }
  return true;
}, isPartOfGroup:function(item, otherGroupName) {
  var me = this, groups = me.groups, currentGroupName = item.responsiveGroup, currentGroup = groups[item.responsiveGroup];
  if (currentGroup) {
    return !!(currentGroupName === otherGroupName || Ext.Array.contains(currentGroup.groups, otherGroupName));
  }
  return false;
}, getGroups:function(items) {
  var me = this, item, insertEl, defaultTopGroupName = me.defaultTopGroupName, parentGroupInsertEl, groups = me.groups || {}, len = items.length, containerEl, i;
  if (Ext.toolkit === 'modern') {
    var owner = me.getContainer();
    insertEl = owner.bodyElement ? owner.bodyElement : owner;
  } else {
    insertEl = me.getRenderTarget();
  }
  insertEl = insertEl.dom || insertEl;
  for (var groupName in groups) {
    groups[groupName].ownItems = [];
    groups[groupName].items = [];
    groups[groupName].groups = [];
  }
  for (i = 0; i < len; i++) {
    item = items[i];
    parentGroupInsertEl = insertEl;
    item.responsiveParentGroup = item.responsiveParentGroup || defaultTopGroupName;
    if (!Ext.isEmpty(item.responsiveParentGroup)) {
      if (!groups[item.responsiveParentGroup]) {
        if (item.responsiveParentGroup === defaultTopGroupName) {
          containerEl = insertEl;
        } else {
          containerEl = document.createElement('div');
        }
        parentGroupInsertEl = containerEl;
        groups[item.responsiveParentGroup] = {el:containerEl, color:'#' + Math.floor(Math.random() * 16777215).toString(16), items:[], groups:[], ownItems:[]};
      } else {
        parentGroupInsertEl = groups[item.responsiveParentGroup].el;
      }
      groups[item.responsiveParentGroup].items.push(item);
    }
    if (!Ext.isEmpty(item.responsiveParentGroup) && !Ext.Array.contains(groups[item.responsiveParentGroup].groups, item.responsiveGroup)) {
      groups[item.responsiveParentGroup].groups.push(item.responsiveGroup);
    }
    item.responsiveGroup = item.responsiveGroup || defaultTopGroupName;
    if (!Ext.isEmpty(item.responsiveGroup)) {
      if (!groups[item.responsiveGroup]) {
        if (item.responsiveGroup === defaultTopGroupName) {
          containerEl = insertEl;
        } else {
          containerEl = document.createElement('div');
        }
        groups[item.responsiveGroup] = {el:containerEl, parentGroup:item.responsiveParentGroup, color:'#' + Math.floor(Math.random() * 16777215).toString(16), items:[], groups:[], ownItems:[]};
      }
      groups[item.responsiveGroup].items.push(item);
      groups[item.responsiveGroup].ownItems.push(item);
    }
  }
  return me.groups = groups;
}, getGroupColSpan:function(items, emptyColumns, columnWidth) {
  var me = this;
  if (me.isColumnAndRowSortable(items)) {
    return me.getLargestColumnCount(items);
  } else {
    var item, groupColSpan = 0, currentItemColSpan, len = items.length;
    for (var i = 0; i < len; i++) {
      item = items[i];
      currentItemColSpan = me.getItemColSpan(item, emptyColumns, columnWidth);
      groupColSpan += currentItemColSpan;
    }
    return groupColSpan;
  }
}, getLargestColumnCount:function(items) {
  var columnCount = 0, i, col, colspan, item, len = items.length, largestColumnCount = 0;
  for (i = 0; i < len; i++) {
    item = items[i];
    col = (item.responsiveCol || 0) + 1;
    colspan = item.responsiveColSpan || 1;
    columnCount = col + (colspan - 1);
    if (columnCount > largestColumnCount) {
      largestColumnCount = columnCount;
    }
  }
  largestColumnCount = largestColumnCount === 0 ? len : largestColumnCount;
  return largestColumnCount;
}, getColumnsAndColumnWidth:function(items, newWidth, columns, columnWidth) {
  var me = this, maxColumns = columns ? columns : undefined, largestColumnCount = Math.max(Math.floor(me.getLargestColumnCount(items)), 1);
  if (me.fixedColumnWidth) {
    columnWidth = me.fixedColumnWidth;
  } else {
    if (!Ext.isEmpty(columnWidth) && Ext.isEmpty(columns)) {
      columns = Math.max(Math.floor(newWidth / columnWidth), 1);
    } else {
      if (!Ext.isEmpty(columns) && Ext.isEmpty(columnWidth)) {
        columnWidth = Math.min(Math.floor(newWidth / columns), newWidth);
      } else {
        if (Ext.isEmpty(columns) && Ext.isEmpty(columnWidth)) {
          columnWidth = me.getColumnWidth(items, newWidth);
          if (Ext.isEmpty(columnWidth)) {
            maxColumns = maxColumns || largestColumnCount;
            var safeColumns = Math.max(Math.floor(newWidth / me.defaultMinColumnWidth), 1);
            var maxColumnWidth = Math.max(Math.floor(newWidth / maxColumns), 1);
            columnWidth = me.getLargestColumnWidth(items);
            columnWidth = columnWidth < maxColumnWidth ? columnWidth : maxColumnWidth;
            columnWidth = me.defaultMinColumnWidth > columnWidth ? me.defaultMinColumnWidth : columnWidth;
            maxColumns = Math.max(Math.floor(newWidth / columnWidth), 1);
            maxColumns = safeColumns < maxColumns ? safeColumns : maxColumns;
          }
          if (!Ext.isEmpty(maxColumns)) {
            columns = maxColumns;
            columnWidth = Math.max(Math.floor(newWidth / columns), 1);
          } else {
            columns = Math.max(Math.floor(newWidth / columnWidth), 1);
          }
        }
      }
    }
  }
  var allowedColumns = Math.max(Math.floor(newWidth / columnWidth), 1);
  return {columns:allowedColumns < columns ? allowedColumns : columns, columnWidth:columnWidth};
}});
Ext.define('ABPControlSet.layout.CSSGrid', {extend:'Ext.layout.Auto', alias:'layout.cssgrid', type:'cssgrid', requires:['ABPControlSet.common.CSSGrid'], mixins:['ABPControlSet.common.CSSGrid'], constructor:function(config) {
  config = config || {};
  var container = config.container;
  if (container) {
    var items = container && container.items;
    if (items) {
      items.setSorters({sorterFn:this.columnAndRowSort});
      items.sort();
    }
  }
  this.callParent(arguments);
}, doLayout:function(force) {
  var me = this, items = me.getLayoutItems();
  me.runCalculations(items, force);
}, onAfterItemDockedChange:function() {
  this.callParent(arguments);
  this.doLayout(true);
}, onItemPositionedChange:function() {
  this.callParent(arguments);
  this.doLayout(true);
}, onItemCenteredChange:function() {
  this.callParent(arguments);
  this.doLayout(true);
}, onItemHiddenChange:function() {
  this.doLayout(true);
}, onContainerInitialized:function() {
  var me = this, owner = me.getContainer();
  owner.mon(Ext.Viewport, 'orientationchange', function() {
    this.doLayout();
  }, me);
  owner.on({single:true, painted:function() {
    this.doLayout();
    if (this.responsive === true) {
      owner.mon(Ext.Viewport, 'resize', function(element, width, height, oldWidth, oldHeight) {
        if (width !== oldWidth) {
          var items = this.getLayoutItems();
          this.runCalculations(items);
        }
      }, this);
    }
  }, scope:me});
  owner.on({delegate:'\x3e component', hiddenchange:'onItemHiddenChange', scope:me});
  me.callParent(arguments);
}, getLayoutItems:function() {
  var me = this, owner = me.getContainer(), items = owner && owner.items, hideMode, visible = [];
  items = items && items.getRange() || [];
  var length = items.length, item;
  for (var i = 0; i < length; i++) {
    item = items[i];
    hideMode = item.getHideMode ? item.getHideMode() : null;
    if (item.isVisible() || hideMode && hideMode !== 'display' || !me.responsive) {
      visible.push(item);
    }
  }
  return me.determineItemsWithColumnRowSorting(visible);
}, getRenderTarget:function() {
  var owner = this.getContainer();
  var rt = owner.bodyElement ? owner.bodyElement : owner;
  return rt;
}});
Ext.define('ABPControlSet.view.CardContainer', {extend:'Ext.Container', xtype:'abpcardcontainer', requires:['ABPControlSet.base.mixin.CardContainer'], mixins:['ABPControlSet.base.mixin.CardContainer'], layout:{type:'card'}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcardcontainer.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.CustomControl', {extend:'Ext.Component', xtype:'abpcustomcontrol', requires:['ABPControlSet.base.mixin.CustomControl'], mixins:['ABPControlSet.base.mixin.CustomControl'], element:{reference:'element', children:[{reference:'embeddedEl', style:'height: 100%; width: 100%;'}]}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, initialize:function() {
  this.callParent(arguments);
  if (this.rendered) {
    this.beginEmbed();
  } else {
    this.on({painted:{fn:this.beginEmbed, scope:this, priority:999}});
  }
}});
Ext.define('ABPControlSet.view.Window', {extend:'Ext.Dialog', xtype:'abpwindow', scaleWithContainer:true, scaleWithContainerRatio:0.9, skipCenter:false, startMaximizedOnSmallViewport:true});
Ext.define('ABPControlSet.view.button.Button', {extend:'Ext.Button', xtype:'abpbutton', requires:['ABPControlSet.base.mixin.Button'], mixins:['ABPControlSet.base.mixin.Button'], config:{iconColor:null}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, setIconColor:function(color) {
  if (this.iconElement) {
    this.iconElement.setStyle('color', color);
  }
}, doTap:function(me) {
  me.callParent(arguments);
  if (typeof appInsights == 'object') {
    appInsights.trackEvent({name:'buttonclick', button:me.name || me.itemId || me.automationCls, text:me.getText()});
  }
}});
Ext.define('ABPControlSet.view.button.Segmented', {extend:'Ext.SegmentedButton', xtype:'abpsegmentedbutton', mixins:['ABPControlSet.base.mixin.SegmentedButton'], lastChangeEventFromUser:false, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, initialize:function() {
  this.on({'change':this.fireUserChanged});
  this.callParent(arguments);
}, privates:{onPressedChange:function(button, pressed) {
  var localSettingValue = this.settingValue;
  if (localSettingValue === false || this.lastChangeEventTrusted) {
    this.lastChangeEventTrusted = true;
  }
  this.callParent(arguments);
  if (localSettingValue === false && this.lastChangeEventTrusted) {
    this.lastChangeEventTrusted = false;
  }
}, fireUserChanged:function(field, newValue, oldValue) {
  if (this.lastChangeEventTrusted) {
    field.__flushValueViewModel();
    field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, newValue, oldValue);
  }
  return;
}}});
Ext.define('ABPControlSet.view.component.Icon', {extend:'Ext.Component', xtype:'abpicon', mixins:['ABPControlSet.base.mixin.Icon']});
Ext.define('ABPControlSet.view.component.StepProgressBar', {extend:'Ext.Component', xtype:'abpstepprogressbar', tpl:['\x3cdiv class\x3d"abp-step-progress-container"\x3e', '\x3cul class\x3d"abp-step-progress-list"\x3e', '\x3ctpl for\x3d"steps"\x3e', '\x3ctpl if\x3d"complete"\x3e', '\x3cli id\x3d"abp-step-number-id-{stepNum}" class\x3d"abp-step-progress-complete abp-step-progress-step"\x3e', '\x3cspan class\x3d"abp-step-progress-btn-wrapper"\x3e', '\x3cspan class\x3d"abp-step-progress-step-button"\x3e{stepCompleteLabel}\x3c/span\x3e', 
'\x3c/span\x3e', '\x3cspan class\x3d"abp-step-progress-step-label"\x3e{label}\x3c/span\x3e', '\x3c/li\x3e', '\x3ctpl elseif\x3d"current"\x3e', '\x3cli id\x3d"abp-step-number-id-{stepNum}" class\x3d"abp-step-progress-current abp-step-progress-step"\x3e', '\x3cspan class\x3d"abp-step-progress-btn-wrapper"\x3e', '\x3cspan class\x3d"abp-step-progress-step-button"\x3e{stepLabel}\x3c/span\x3e', '\x3c/span\x3e', '\x3cspan class\x3d"abp-step-progress-step-label"\x3e{label}\x3c/span\x3e', '\x3c/li\x3e', '\x3ctpl else\x3e', 
'\x3cli id\x3d"abp-step-number-id-{stepNum}" class\x3d"abp-step-progress-undone abp-step-progress-step"\x3e', '\x3cspan class\x3d"abp-step-progress-btn-wrapper"\x3e', '\x3cspan class\x3d"abp-step-progress-step-button"\x3e{stepLabel}\x3c/span\x3e', '\x3c/span\x3e', '\x3cspan class\x3d"abp-step-progress-step-label"\x3e{label}\x3c/span\x3e', '\x3c/li\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', '\x3c/ul\x3e', '\x3c/div\x3e'], onResize:function(params, x, t, z) {
  this.hide();
  this.show();
}});
Ext.define('ABPControlSet.view.tree.CheckboxTreeItem', {extend:'Ext.list.TreeItem', xtype:'checkboxtreelistitem', checkedCls:Ext.baseCSSPrefix + 'treelist-item-checked', element:{reference:'element', tag:'li', cls:Ext.baseCSSPrefix + 'treelist-item', children:[{reference:'rowElement', cls:Ext.baseCSSPrefix + 'treelist-row', children:[{reference:'wrapElement', cls:Ext.baseCSSPrefix + 'treelist-item-wrap', children:[{reference:'iconElement', cls:Ext.baseCSSPrefix + 'treelist-item-icon'}, {reference:'textElement', 
cls:Ext.baseCSSPrefix + 'treelist-item-text'}, {reference:'expanderElement', cls:Ext.baseCSSPrefix + 'treelist-item-expander'}, {reference:'checkboxElement', cls:Ext.baseCSSPrefix + 'treelist-item-checkbox'}]}]}, {reference:'itemContainer', tag:'ul', cls:Ext.baseCSSPrefix + 'treelist-container'}, {reference:'toolElement', cls:Ext.baseCSSPrefix + 'treelist-item-tool'}]}, onClick:function() {
  var me = this, node = me.getNode();
  if (node) {
    checked = !node.get('checked');
    node.set('checked', checked);
    me.doNodeUpdate(node);
  }
  me.callParent(arguments);
}, privates:{doNodeUpdate:function(node) {
  var me = this, checkedCls = me.checkedCls;
  me.callParent([node]);
  var checked = node.get('checked');
  var element = me.element;
  if (element) {
    element.toggleCls(checkedCls, checked);
  }
}}});
Ext.define('ABPControlSet.view.tree.Tree', {extend:'Ext.list.Tree', xtype:'abptree', requires:['ABPControlSet.base.mixin.Component', 'ABPControlSet.view.tree.CheckboxTreeItem'], mixins:['ABPControlSet.base.mixin.Component'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, getItemConfig:function(node, parent) {
  var config = this.callParent(arguments);
  if (node.get('checkbox') === true) {
    config.xtype = 'checkboxtreelistitem';
    config.checked = !!node.get('checked');
  }
  return config;
}});
Ext.define('ABPControlSet.view.contextmenu.ContextMenu', {extend:'ABPControlSet.view.tree.Tree', xtype:'abpcontextmenu', config:{currentCmp:null, currentContext:null}, margin:0});
Ext.define('ABPControlSet.view.errors.ErrorList', {extend:'Ext.Component', xtype:'abperrors', alias:'abperrorpanel', cls:'abp-errors', ariaRole:'alert', config:{title:'What happened', messageType:1, errors:[]}, element:{reference:'element', cls:'abp-errors', listeners:{click:'onClick'}, children:[{reference:'iconContainer', cls:'abp-errors-icon', children:[{reference:'iconEl', tag:'span'}]}, {reference:'maintContainer', cls:'errors-message-content', children:[{reference:'titleEl', cls:'abp-errors-title'}, 
{reference:'messagesEl', tag:'ul', cls:'abp-errors-list'}]}]}, applyMessageType:function(newType, oldType) {
  if (newType === 'error') {
    newType = 1;
  } else {
    if (newType === 'warning') {
      newType = 2;
    } else {
      if (newType === 'info') {
        newType = 3;
      }
    }
  }
  return newType;
}, updateMessageType:function(icon, oldIcon) {
  var me = this;
  if (me.rendered) {
    if (oldIcon) {
      me.iconEl.removeCls(me.getIconClass(oldIcon));
      me.el.removeCls(me.getElClass(oldIcon));
    }
    me.iconEl.addCls(me.getIconClass(icon));
    me.el.addCls(me.getElClass(icon));
    me.updateLayout();
  }
}, updateTitle:function(title) {
  var me = this;
  if (me.rendered) {
    me.titleEl.setHtml(title);
    me.updateLayout();
  }
}, updateErrors:function(errors) {
  var me = this;
  if (me.rendered) {
    var errorData = me.getMessagesData();
    var html = '';
    Ext.each(errorData, function(error, i) {
      html += '\x3cli class\x3d"abp-errors-message" data-fieldid\x3d"' + error.fieldId + '"\x3e' + Ext.encode(error.text) + '\x3c/li\x3e';
    });
    me.messagesEl.setHtml(html);
  }
}, privates:{getIconClass:function(type) {
  if (type === 1) {
    return 'icon-sign-warning';
  }
  if (type === 2) {
    return 'icon-information';
  }
  return 'icon-about';
}, getElClass:function(type) {
  if (type === 1) {
    return 'abp-errors-warning';
  }
  if (type === 2) {
    return 'abp-errors-information';
  }
  return 'abp-errors-error';
}, getMessagesData:function() {
  var me = this, messages = [];
  Ext.each(me.getErrors(), function(error, i) {
    var message = {};
    if (Ext.isString(error)) {
      message.text = error;
    } else {
      message.text = error.text;
      message.fieldId = error.fieldId;
    }
    messages.push(message);
  });
  return messages;
}, onClick:function(e, target) {
  if (e.target.tagName !== 'LI') {
    return;
  }
  var args = {fieldId:null};
  if (e.target.dataset.fieldid) {
    args.fieldId = e.target.dataset.fieldid;
  }
  this.fireEvent('navigateField', args, e);
}}});
Ext.define('ABPControlSet.view.field.Checkbox', {extend:'Ext.field.Checkbox', xtype:'abpcheckbox', requires:['ABPControlSet.base.mixin.Checkbox'], mixins:['ABPControlSet.base.mixin.Checkbox'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, initialize:function() {
  this.on({'change':this.fireUserChanged, 'painted':this.afterRenderInit});
  this.callParent(arguments);
}, updateRequired:Ext.emptyFn, privates:{afterRenderInit:function() {
  if (Ext.isiOS) {
    this.element.onAfter('click', this.afterClickiOS, this);
  }
}, fireUserChanged:function(field, newValue, oldValue) {
  var me = this, changeTime = Date.now();
  Ext.defer(function() {
    if (field.containsFocus || field.hasFocus || Ext.isiOS && me.lastClickTime && changeTime - me.lastClickTime < me.IOS_USER_CLICK_IS_CHANGE_SOURCE_TIMEOUT) {
      me.lastClickTime = null;
      field.__flushValueViewModel();
      field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, newValue, oldValue);
    }
  }, 1);
}, afterClickiOS:function(a, b, c, d, e, f) {
  var me = this;
  me.lastClickTime = Date.now();
}}});
Ext.define('ABPControlSet.view.field.ComboBox', {extend:'Ext.field.ComboBox', xtype:'abpcombobox', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.ComboBox'], mixins:['ABPControlSet.base.mixin.ComboBox'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, setValue:function(value) {
  if (this.getPublishListValue()) {
    var storeRec = this.findRecordByValue(value);
    if (storeRec && !storeRec.phantom) {
      this.setListValue(value);
    } else {
      this.setListValue(undefined);
    }
  }
  this.callParent(arguments);
}, onFocus:function() {
  var store = this.getStore(), count = store.getCount(), editable = this.getEditable();
  if (count === 0 && editable) {
    return;
  } else {
    this.callParent(arguments);
  }
}});
Ext.define('ABPControlSet.view.field.Currency', {extend:'Ext.field.Container', xtype:'abpcurrency', requires:['ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.Field'], layout:{type:'hbox', align:'stretch'}, cls:'abp-currencybox', searchString:'', showRight:false, config:{value:null, currencyCode:null, store:null, readOnly:false, formatString:'000,000.00', stepValue:1}, defaults:{currencyDisplayField:'name', currencyValueField:'abbr'}, constructor:function(config) {
  config = config || {};
  config.currencyDisplayField = config.currencyDisplayField || 'display';
  config.currencyValueField = config.currencyValueField || 'value';
  config.store = config.store || this.buildStore(config);
  var showRight = config.showRight = config.showRight || false;
  config.items = [showRight ? this.buildNumberField(config) : this.buildCombo(config), showRight ? this.buildCombo(config) : this.buildNumberField(config)];
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, updateReadOnly:function(readOnly) {
  var me = this, numberField = me.down('abpnumber'), codeField = me.down('abpcombobox');
  if (numberField) {
    numberField.setReadOnly(readOnly);
  }
  if (codeField) {
    codeField.setReadOnly(readOnly);
  }
}, updateValue:function(value) {
  var me = this, numberField = me.down('abpnumber');
  if (numberField) {
    numberField.setValue(value);
  }
}, updateStore:function(store) {
  var me = this, codeField = me.down('abpcombobox');
  if (codeField && codeField.bindStore) {
    var noItems = store ? store.getCount() <= 1 : true;
    if (store) {
      codeField.bindStore(store);
      codeField.setSelection(store.getAt(0));
      codeField.setValue(me.config.currencyCode);
    }
    codeField.setDisabled(noItems);
    codeField.setHideTrigger(noItems);
  }
}, updateCurrencyCode:function(code) {
  var me = this, codeField = me.down('abpcombobox');
  if (codeField) {
    codeField.setValue(code);
  }
}, buildCombo:function(config) {
  return {xtype:'abpcombobox', displayField:config.currencyDisplayField || 'display', valueField:config.currencyValueField || 'value', editable:false, enableKeyEvents:true, tabIndex:-1, store:config.store, autoSelect:true, hideTrigger:!config.store || config.store.getCount() <= 1, disabledCls:config.showRight ? 'abp-currency-combo-single-right' : 'abp-currency-combo-single', cls:['abp-currency-combo', config.showRight ? 'abp-currency-right' : 'abp-currency-left'], disabled:!config.store || config.store.getCount() <= 
  1, listeners:{afterRender:this.onComboAfterRender, collapse:this.onComboCollapse, select:this.onComboSelect}};
}, onComboSelect:function(combobox, selection) {
  combobox.up('abpcurrency').setCurrencyCode(combobox.getValue());
}, onComboKeyUp:function(combobox, e) {
  var currency = combobox.up('abpcurrency');
  currency.keyupHandler(e);
}, buildNumberField:function(config) {
  return {xtype:'abpnumber', hideTrigger:true, decimalPrecision:config.decimalPrecision ? config.decimalPrecison : 2, allowThousandSeparator:true, decimalSeparator:config.decimalSeparator ? config.decimalSeparator : '.', thousandSeparator:config.thousandSeparator ? config.thousandSeparator : ',', allowDecimals:true, enableKeyEvents:true, keyNavEnabled:false, repsonsiveFill:true, inputType:null, minValue:config.minValue || config.minValue === 0 ? config.minValue : Number.NEGATIVE_INFINITY, maxValue:config.maxValue ? 
  config.maxValue : Number.MAX_VALUE, stepValue:config.step ? config.step : 1, cls:['abp-currency-number', config.showRight ? 'abp-currency-left' : 'abp-currency-right'], listeners:{change:this.onNumberChange, keyup:this.onNumberKeyDown}};
}, onNumberBlur:function(numberField) {
  var currencyField = numberField.up('abpcurrency');
  if (currencyField) {
    currencyField.formatNumberField(numberField, numberField.getValue(), '0,0.00');
  }
}, onNumberChange:function(numberField, newValue, oldValue) {
  var currencyField = numberField.up('abpcurrency');
  if (Math.abs(newValue - oldValue) === 1) {
    currencyField.formatNumberField(numberField, newValue, '0,0.00');
  }
  currencyField.setValue(newValue);
}, formatNumberField:function(numberField, newValue, formatString) {
  var origThousandSeparator = Ext.util.Format.thousandSeparator, origDecimalSeparator = Ext.util.Format.decimalSeparator;
  Ext.util.Format.thousandSeparator = numberField.thousandSeparator;
  Ext.util.Format.decimalSeparator = numberField.decimalSeparator;
  numberField.setInputValue(Ext.util.Format.number(newValue, formatString));
  Ext.util.Format.thousandSeparator = origThousandSeparator;
  Ext.util.Format.decimalSeparator = origDecimalSeparator;
}, buildStore:function(config) {
  var storeData = [], displayField = config.currencyDisplayField, valueField = config.currencyValueField;
  if (Ext.isArray(config.availableCurrencies)) {
    config.availableCurrencies.forEach(function(curr) {
      var newCurr = {};
      newCurr[displayField] = newCurr[valueField] = curr;
      storeData.push(newCurr);
    });
  }
  return Ext.create('Ext.data.Store', {fields:[displayField, valueField], data:storeData});
}, onNumberKeyDown:function(numberField, e) {
  var currencyField = numberField.up('abpcurrency');
  if (e.ctrlKey || e.keyCode === 32 || e.altKey || /^[A-Z]$/i.test(e.browserEvent.key)) {
    currencyField.keyupHandler(e);
    e.stopEvent();
  } else {
    var currentValue = numberField.getValue(), minValue = numberField.getMinValue(), maxValue = numberField.getMaxValue(), stepValue = numberField.stepValue;
    if (e.keyCode === 40) {
      if (currentValue - stepValue > minValue) {
        numberField.setValue(currentValue - stepValue);
        numberField.setInputValue(currentValue + stepValue);
      } else {
        numberField.setValue(minValue);
        numberField.setInputValue(minValue);
      }
    } else {
      if (e.keyCode === 38) {
        if (currentValue + stepValue < maxValue) {
          numberField.setValue(currentValue + stepValue);
          numberField.setInputValue(currentValue + stepValue);
        } else {
          numberField.setValue(maxValue);
          numberField.setInputValue(maxValue);
        }
      }
    }
  }
}, onComboAfterRender:function(combobox) {
  combobox.setValue(combobox.lastValue);
}, onComboCollapse:function(combobox) {
  Ext.defer(function() {
    combobox.up().down('abpnumber').focus();
  }, 0);
}, onNumberAfterRender:function(numberField) {
  var currencyField = numberField.up('abpcurrency');
  if (currencyField) {
    currencyField.formatNumberField(numberField, numberField.getValue(), '0,0.00');
  }
}, keyupHandler:function(e) {
  var me = this, comboBox = me.down('abpcombobox');
  me.initialValueChanged = true;
  if (!comboBox.isDisabled()) {
    if (e.ctrlKey) {
      var store = me.getStore(), selIndex = store.indexOf(comboBox.getSelection()), storeCount = store.getCount();
      if (e.keyCode === 38) {
        if (selIndex > 0) {
          comboBox.setSelection(store.getAt(selIndex - 1));
        } else {
          comboBox.setSelection(store.getAt(storeCount - 1));
        }
      } else {
        if (e.keyCode === 40) {
          if (selIndex < storeCount - 1) {
            comboBox.setSelection(store.getAt(selIndex + 1));
          } else {
            comboBox.setSelection(store.getAt(0));
          }
        }
      }
    } else {
      if (e.altKey) {
        if (e.keyCode === 38) {
          comboBox.collapse();
        } else {
          if (e.keyCode === 40) {
            comboBox.expand();
          }
        }
      } else {
        me.searchString += e.browserEvent.key;
        var selections = me.getStore().query(me.config.currencyDisplayField, me.searchString, false, false);
        if (selections.length > 0) {
          comboBox.setSelection(selections.getAt(0));
        }
        if (selections.length <= 1) {
          me.searchString = '';
        }
      }
    }
  }
}});
Ext.define('ABPControlSet.view.field.Date', {extend:'Ext.field.Date', xtype:'abpdate', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.Field'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.panel.DateTime', {extend:'Ext.panel.Date', xtype:'abpdatetimepanel', requires:['Ext.layout.Carousel', 'Ext.panel.DateView', 'Ext.panel.DateTitle', 'Ext.panel.YearPicker'], bbar:{xtype:'container', items:[{padding:'0px 2px 0px 2px', xtype:'abptime', itemId:'timeField'}]}, config:{format:{$value:Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat, cached:true}}, applyValue:function(date) {
  if (typeof date === 'string') {
    date = Ext.Date.parse(date, this.getFormat());
  } else {
    if (!date) {
      date = new Date;
    }
  }
  return Ext.isDate(date) ? date : null;
}, onTodayButtonClick:function() {
  var me = this, timeField = me.down('#timeField'), timeDateValue = timeField ? timeField.getValue() : null, offset;
  offset = me.getLayout().getFrontItem().getMonthOffset();
  if (offset !== 0) {
    if (Math.abs(offset) === 1) {
      me.switchPanes(-offset);
    } else {
      me.replacePanes(-offset);
    }
  }
  var today = new Date;
  if (timeDateValue) {
    today.setHours(timeDateValue.getHours());
    today.setMinutes(timeDateValue.getMinutes());
  }
  me.setValue(today);
}, updateValue:function(value, oldValue) {
  var me = this, time = Ext.isDate(value) ? Ext.Date.format(value, Ext.Date.defaultTimeFormat) : null, timeField = me.down('#timeField');
  if (timeField) {
    timeField.setValue(time);
  }
  me.callParent(arguments);
}, onDateClick:function(e) {
  var me = this, cell = e.getTarget(me.cellSelector, me.bodyElement), date = cell && cell.date, focus = true, disabled = cell && cell.disabled, timeField = me.down('#timeField'), timeDateValue = timeField ? timeField.getValue() : null;
  date = new Date(date.getTime());
  if (!date || me.getDisabled()) {
    return;
  }
  if (date && timeDateValue) {
    date.setHours(timeDateValue.getHours());
    date.setMinutes(timeDateValue.getMinutes());
  }
  if (!disabled) {
    me.setValue(date);
    if (me.getAutoConfirm()) {
      if (e.pointerType === 'touch') {
        e.preventDefault();
      }
      focus = false;
      me.fireEvent('select', me, date);
    }
  }
  if (focus) {
    me.focusDate(date);
  }
}, privates:{applyFocusableDate:function(date) {
  var me = this, boundary;
  if (date) {
    if ((boundary = me.getMinDate()) && !me.getShowBeforeMinDate() && date.getTime() < boundary.getTime()) {
      date = boundary;
    } else {
      if ((boundary = me.getMaxDate()) && !me.getShowAfterMaxDate() && date.getTime() > boundary.getTime()) {
        date = boundary;
      }
    }
  }
  return date;
}}, getPaneByDate:function(date) {
  var me = this, findDate = Ext.Date.clearTime(new Date(date), true), panes = me.getInnerItems(), month, pane, i, len;
  month = Ext.Date.getFirstDateOfMonth(findDate);
  for (i = 0, len = panes.length; i < len; i++) {
    pane = panes[i];
    if (Ext.Date.isEqual(pane.getMonth(), month)) {
      return pane;
    }
  }
  return null;
}, getCellByDate:function(date) {
  var findDate = Ext.Date.clearTime(new Date(date), true);
  var pane = this.getPaneByDate(findDate);
  return pane ? pane.getCellByDate(findDate) : null;
}});
Ext.define('ABPControlSet.view.picker.DateTime', {extend:'Ext.picker.Date', xtype:'abpdatetimepicker', config:{hourText:'Hour', minuteText:'Minute', meridiemText:'AM/PM', slotOrder:['month', 'day', 'year', 'hour', 'minute', 'meridiem']}, setValue:function(value, animated) {
  var me = this;
  if (Ext.isDate(value)) {
    value = {day:value.getDate(), month:value.getMonth() + 1, year:value.getFullYear(), hour:value.getHours(), minute:value.getMinutes()};
  }
  me.callParent([value, animated]);
  if (me.rendered) {
    me.onSlotPick();
  }
  return me;
}, getValue:function(useDom) {
  var values = {}, items = this.getItems().items, ln = items.length, daysInMonth, day, month, year, hour, minute, meridiem, item, i;
  for (i = 0; i < ln; i++) {
    item = items[i];
    if (item.isSlot) {
      values[item.getName()] = item.getValue(useDom);
    }
  }
  var localeIs24 = false;
  var format = Ext.Date.defaultTimeFormat;
  try {
    if (format && format.indexOf('H') > -1) {
      localeIs24 = true;
    }
  } catch (error) {
  }
  if (values.year === null && values.month === null && values.day === null) {
    return null;
  }
  meridiem = Ext.isNumber(values.meridiem) ? values.meridiem : 0;
  year = Ext.isNumber(values.year) ? values.year : 1;
  month = Ext.isNumber(values.month) ? values.month : 1;
  day = Ext.isNumber(values.day) ? values.day : 1;
  hour = Ext.isNumber(values.hour) ? localeIs24 ? values.hour : values.hour + (meridiem === 1 ? 12 : 0) : localeIs24 ? 0 : 12;
  minute = Ext.isNumber(values.minute) ? values.minute : 0;
  if (month && year && month && day) {
    daysInMonth = this.getDaysInMonth(month, year);
  }
  day = daysInMonth ? Math.min(day, daysInMonth) : day;
  return new Date(year, month - 1, day, hour, minute);
}, createSlots:function() {
  var me = this, slotOrder = me.getSlotOrder(), yearsFrom = me.getYearFrom(), yearsTo = me.getYearTo(), years = [], days = [], months = [], hours = [], minutes = [], meridiems = [{text:'AM', value:0}, {text:'PM', value:1}], slots = [], reverse = yearsFrom > yearsTo, ln, i, daysInMonth;
  while (yearsFrom) {
    years.push({text:yearsFrom, value:yearsFrom});
    if (yearsFrom === yearsTo) {
      break;
    }
    if (reverse) {
      yearsFrom--;
    } else {
      yearsFrom++;
    }
  }
  var localeIs24 = false;
  var format = Ext.Date.defaultTimeFormat;
  try {
    if (format && format.indexOf('H') > -1) {
      localeIs24 = true;
    }
  } catch (error) {
  }
  var hoursLength = localeIs24 ? 24 : 12;
  for (i = 0; i < hoursLength; i++) {
    hours.push({text:localeIs24 ? i : i + 1, value:localeIs24 ? i : i + 1});
  }
  for (i = 0; i < 60; i++) {
    minutes.push({text:i < 10 ? '0' + i : i, value:i});
  }
  daysInMonth = me.getDaysInMonth(1, (new Date).getFullYear());
  for (i = 0; i < daysInMonth; i++) {
    days.push({text:i + 1, value:i + 1});
  }
  for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
    months.push({text:Ext.Date.monthNames[i], value:i + 1});
  }
  slotOrder.forEach(function(item) {
    if (item !== 'meridiem' || item === 'meridiem' && !localeIs24) {
      slots.push(me.createSlot(item, days, months, years, hours, minutes, meridiems));
    }
  });
  me.setSlots(slots);
}, createSlot:function(name, days, months, years, hours, minutes, meridiems) {
  var me = this, result;
  switch(name) {
    case 'year':
      result = {name:'year', align:'center', data:years, title:me.getYearText(), flex:3};
      break;
    case 'month':
      result = {name:name, align:'right', data:months, title:me.getMonthText(), flex:4};
      break;
    case 'day':
      result = {name:'day', align:'center', data:days, title:me.getDayText(), flex:2};
      break;
    case 'hour':
      result = {name:'hour', align:'center', data:hours, title:me.getHourText(), flex:2};
      break;
    case 'minute':
      result = {name:'minute', align:'center', data:minutes, title:me.getDayText(), flex:2};
      break;
    case 'meridiem':
      result = {name:'meridiem', align:'center', data:meridiems, title:me.getMeridiemText(), flex:2};
      break;
  }
  if (me._value) {
    result.value = me._value[name];
  }
  return result;
}});
Ext.define('ABPControlSet.view.field.Time', {extend:'Ext.field.Time', xtype:'abptime', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.Field'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.field.DateTime', {extend:'Ext.field.Date', xtype:'abpdatetime', requires:['ABPControlSet.view.panel.DateTime', 'ABPControlSet.view.picker.DateTime', 'ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.Field'], config:{dateFormat:Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat}, floatedPicker:{xtype:'abpdatetimepanel', autoConfirm:true, floated:true, 
listeners:{tabout:'onTabOut', select:'onPickerChange', scope:'owner'}, keyMap:{ESC:'onTabOut', scope:'owner'}}, edgePicker:{xtype:'abpdatetimepicker', cover:true}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, applyPicker:function(picker, oldPicker) {
  var me = this;
  picker = me.callParent([picker, oldPicker]);
  me.pickerType = picker.xtype === 'abpdatetimepicker' ? 'edge' : 'floated';
  picker.ownerCmp = me;
  return picker;
}});
Ext.define('ABPControlSet.view.field.Display', {extend:'Ext.field.Display', xtype:'abptextdisplay', classCls:'abp-textdisplay', requires:['ABPControlSet.base.mixin.TextDisplay', 'ABPControlSet.util.Markdown'], mixins:['ABPControlSet.base.mixin.TextDisplay'], updateRequired:Ext.emptyFn, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, updateValue:function(newValue, oldValue) {
  var markupType = this.getMarkupType();
  if (markupType === 'markdown' && newValue && newValue.length) {
    if (this.usage === 'address') {
      newValue = this.getAddressMarkdownValue(newValue, oldValue);
    }
    this.setHtml(ABPControlSet.util.Markdown.parseMarkdown(newValue));
  } else {
    this.callParent([newValue, oldValue]);
  }
}, getAddressMarkdownValue:function(newValue, oldValue) {
  var urlFriendlyAddr = encodeURIComponent(newValue.replace(/\n/g, ','));
  var addrLines = newValue.split('\n');
  var formattedAddr = '[**' + ('-' + addrLines[0]).trim().substr(1) + '**';
  var lines = addrLines.length;
  for (var i = 1; i < lines; i++) {
    formattedAddr += '  \n' + ('-' + addrLines[i]).trim().substr(1);
  }
  formattedAddr += '](' + Ext.String.format(ABPControlSet.common.Constants.MAP_URL_FORMAT_STRING, urlFriendlyAddr) + ')';
  return formattedAddr;
}});
Ext.define('ABPControlSet.view.field.TextArea', {extend:'Ext.field.TextArea', xtype:'abptextarea', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.Field'], grow:true, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.field.EntityLink', {extend:'ABPControlSet.view.field.TextArea', xtype:'abpentitylinkfield', cls:'abp-link-field', editable:false, maxRows:1, config:{valueField:'value', displayField:'text'}, setUserValue:function(value) {
  var me = this;
  this.__userChange = true;
  me.setValue(value);
  this.__userChange = null;
}, updateValue:function(value, oldValue) {
  value = value || {};
  var me = this, displayValue = me.getEntityDisplayValue(value);
  me.setInputValue(displayValue);
  me.syncEmptyState();
  if (this.__userChange && !me.valuesEqual(value, oldValue)) {
    this.fireEvent(ABPControlSet.common.types.Events.UserChanged, this, value, oldValue);
  }
}, valuesEqual:function(value1, value2) {
  if (Ext.isEmpty(value1) && Ext.isEmpty(value2)) {
    return true;
  }
  if (!Ext.isObject(value1) || !Ext.isObject(value2)) {
    return false;
  }
  return Ext.Object.equals(value1, value2);
}, completeEdit:function() {
  var me = this, value = me.getInputValue(), parsedValue = me.parseValue(value);
  if (parsedValue !== null) {
    me.setInputValue(me.getEntityDisplayValue(me.getValue()));
  }
}, getEntityDisplayValue:function(value) {
  var me = this, df = me.getDisplayField(), vf = me.getValueField(), displayValue = value[df], valueValue = value[vf];
  if (Ext.isEmpty(displayValue)) {
    displayValue = valueValue;
  }
  return displayValue;
}});
Ext.define('ABPControlSet.view.picker.Icon', {extend:'Ext.dataview.List', xtype:'abpiconpicker', cls:['abp-icon-picker', 'abp-icon-picker-modern'], itemCls:'abp-icon-picker-item', constructor:function(config) {
  config = config || {};
  config.store = config.store || ABPControlSet.common.Common.getIconStore();
  this.callParent([config]);
}, applyItemTpl:function() {
  return '\x3cdiv class\x3d"' + this.itemCls + ' {icon}"\x3e\x3c/div\x3e';
}});
Ext.define('ABPControlSet.view.field.IconPicker', {extend:'Ext.field.ComboBox', xtype:'abpiconcombo', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Field', 'ABPControlSet.view.picker.Icon'], mixins:['ABPControlSet.base.mixin.Field'], displayField:'icon', valueField:'icon', triggers:{iconTrigger:{xclass:'ABPControlSet.view.form.trigger.Trigger'}}, constructor:function(config) {
  config = config || {};
  var iconStore = ABPControlSet.common.Common.getIconStore();
  config.store = iconStore;
  config.picker = 'floated';
  config.floatedPicker = {xtype:'abpiconpicker', store:iconStore};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, setValue:function(value) {
  var me = this;
  me.callParent(arguments);
  var iconTrigger = me.getTriggers()['iconTrigger'];
  if (iconTrigger) {
    iconTrigger.setIcon(value);
  }
}});
Ext.define('ABPControlSet.view.field.Image', {extend:'Ext.field.Container', xtype:'abpimage', requires:['ABPControlSet.base.mixin.Image'], mixins:['ABPControlSet.base.mixin.Image'], layout:'fit', statics:{defaultDimension:128}, viewModel:{data:{pickerImageHasChanged:true, pickerImageIsRemovedOrNeverAdded:true, editorReadOnly:true}, formulas:{addOrChangeButtonText:function(get) {
  return get('pickerImageIsRemovedOrNeverAdded') ? 'Add' : 'Change';
}}}, config:{src:null, labelHidden:false}, placeholderOpacity:0.3, enabledOpacity:1, originalPickerSrc:'', pickerShowing:false, publishes:['src'], cls:'abp-image', defaultPlaceholder:Ext.getResourcePath('img/temp_abpimage-empty-placeholder.png', null, 'ABPControlSet'), defaultEmptyPlaceHolder:Ext.getResourcePath('img/temp_abpimage-empty-placeholder.png', null, 'ABPControlSet'), defaultPopupPlaceholder:Ext.getResourcePath('img/temp_abpimage-edit-placeholder.png', null, 'ABPControlSet'), updateRequired:Ext.emptyFn, 
constructor:function(config) {
  config = config || {};
  var me = this;
  var height = parseInt(config.height || config.minHeight || config.maxHeight || 100);
  var readOnly = config.readOnly = config.readOnly === false ? false : true;
  var dimensions = this.configureDimensions(config);
  var imageClassName = this.configureImageClassName(config.cropStyle, dimensions);
  config.height = dimensions.height;
  config.width = dimensions.width;
  if (!config.readOnly && !config.src) {
    config.src = '';
    if (config.bind && config.bind.src) {
    } else {
      config.cls = ('new-image ' + (this.config.cls || '') + ' ' + (config.cls || '')).trim();
    }
  }
  config.items = [{xtype:'component', itemId:'placeholder', cls:'abp-image-placeholder', html:config.placeholder || '', style:{'text-align':'center', 'font-size':'2em', 'opacity':me.placeholderOpacity}}, {xtype:'container', cls:('placeholder-img-wrapper ' + imageClassName).trim() + ' abp-image-upload', itemId:'defaultImage', hidden:false, style:{'opacity':me.placeholderOpacity}, items:[{xtype:'image', itemId:'placeholder-image', cls:imageClassName, context:me, scope:me, style:{'opacity':me.placeholderOpacity}, 
  listeners:{tap:this.onPlaceholderImageTap, show:this.onPlaceholderShow, hide:this.onPlaceholderHide}, src:this.defaultPlaceholder}]}, {xtype:'container', cls:('empty-placeholder-img-wrapper ' + imageClassName).trim() + ' abp-image-upload', itemId:'defaultEmptyImage', hidden:false, items:[{xtype:'image', itemId:'empty-placeholder-image', cls:imageClassName + ' empty-abp-image', context:me, scope:me, src:me.defaultEmptyPlaceHolder, style:{'opacity':me.placeholderOpacity}}]}, {xtype:'image', itemId:'user-image', 
  hidden:true, src:config.src, cls:imageClassName, listeners:{tap:this.onImageTap, load:this.onImageLoaded, scope:this, el:{doubletap:this.onImageDoubleTap, taphold:this.onImageTapHold, scope:this}}}, {xtype:'abpicon', itemId:'editButton', value:'icon-pencil', cls:'abp-image-icon-edit', bind:{hidden:'{editorReadOnly}'}}, {xtype:'abpdialogform', itemId:'imageEditorPopup', minHeight:100, context:me, cls:'abp-image-editor', listeners:{beforeshow:me.onPopupPickerBeforeShow, hide:me.onPopupPickerHide, 
  resize:me.onPopupPickerResize}, items:[{xtype:'titlebar', docked:'top', title:'Edit Photo', titleAlign:'left', items:[{iconCls:'icon-navigate-cross', handler:function() {
    this.up('#imageEditorPopup').hide();
  }, cls:'abp-image-editor-close', align:'right'}]}, {xtype:'image', itemId:'user-popup-image', context:me, cls:'abp-image-editor-image', src:me.defaultPopupPlaceholder, listeners:{beforeshow:me.onPopupPickerBeforeShow, load:me.onPopupPickerLoad, tap:me.onChangeButtonTap}}, {xtype:'titlebar', docked:'bottom', items:[{xtype:'button', text:'Delete', align:'left', context:me, bind:{hidden:'{pickerImageIsRemovedOrNeverAdded}'}, handler:function() {
    this.context.clearImage();
  }}, {xtype:'button', text:'Save Changes', align:'right', context:me, cls:'abp-image-editor-save-btn', bind:{hidden:'{pickerImageHasChanged}'}, handler:me.onSaveButtonTap}, {xtype:'button', bind:{text:'{addOrChangeButtonText}'}, align:'right', context:me, minWidth:64, handler:me.onChangeButtonTap}, {xtype:'filefield', name:config.name || 'abp-popup-image-upload-form', accept:'image/*', text:'Change', hidden:true, align:'right', listeners:{change:{element:'element', fn:me.onFileChange, scope:this}}}]}]}];
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
  this.down('#editButton').el.on('tap', function() {
    me.onImageTap();
  });
  this.down('filefield').setInputAttribute('type', 'file');
  this.down('filefield').setInputAttribute('oninput', '');
  this.down('filefield').setInputAttribute('accept', Ext.isEmpty(config.accept) ? 'image/*' : config.accept);
}, onImageTapHold:function(image) {
  this.fireEvent(ABPControlSet.common.types.Events.ImageLongPress, image);
}, onImageDoubleTap:function(image) {
  this.fireEvent(ABPControlSet.common.types.Events.ImageDoubleClick, image);
}, updateOpacity:function(readOnly) {
  if (readOnly === true) {
    this.down('#editButton').setStyle({'opacity':this.placeholderOpacity});
  } else {
    this.down('#editButton').setStyle({'opacity':this.enabledOpacity});
  }
}, onPlaceholderShow:function() {
  this.context.down('#editButton').setStyle({'opacity':this.context.placeholderOpacity});
}, onPlaceholderHide:function() {
  this.context.down('#editButton').setStyle({'opacity':this.context.enabledOpacity});
}, onResize:function(x, y, z, a) {
  if (x !== y) {
    var squareDim = Math.min(x, y);
    this.setHeight(squareDim);
    this.setWidth(squareDim);
    this.setMinHeight(squareDim);
    this.setMinWidth(squareDim);
    this.setMaxHeight(squareDim);
    this.setMaxWidth(squareDim);
    this.setStyle({'padding':'0px 0px 0px 0px', 'margin':'0px 0px 0px 0px'});
  }
}, onPopupPickerLoad:function(cmp, event) {
  var maxWidth = this.context.query('#imageEditorPopup')[0].el.getWidth(), maxHeight = ABPControlSet.view.field.Image.defaultDimension;
  var dimensions = this.context.getPopupImageDimensions(maxWidth, maxHeight, event.target);
  this.el.removeCls('x-hidden x-hidden-display');
  this.el.setHeight(ABPControlSet.view.field.Image.defaultDimension);
  this.el.setWidth(dimensions.width);
  this.el.setStyle('background-size', dimensions.backgroundSize);
}, getPopupImageDimensions:function(maxWidth, maxHeight, target) {
  var width = target.width, height = target.height, retWidth = ABPControlSet.view.field.Image.defaultDimension, retHeight = ABPControlSet.view.field.Image.defaultDimension, widthToHeightRatio = width / height;
  if (width > maxWidth && height > maxHeight) {
    if (height > width) {
      retHeight = maxHeight;
      retWidth = retHeight * widthToHeightRatio;
    } else {
      retWidth = maxWidth;
      retHeight = retWidth / widthToHeightRatio;
    }
  } else {
    retHeight = ABPControlSet.view.field.Image.defaultDimension;
    retWidth = retHeight * widthToHeightRatio;
  }
  var dimString = retWidth + 'px ' + retHeight + 'px';
  return {height:retHeight, width:retWidth, backgroundSize:dimString};
}, onPopupPickerBeforeShow:function() {
  var imageContext = this.context, vm = imageContext.getViewModel();
  imageContext.pickerShowing = true;
  imageContext.originalPickerSrc = imageContext.getSrc();
  imageContext.setPopupImagePickerSrc(imageContext.getSrc());
  vm.set('pickerImageIsRemovedOrNeverAdded', Ext.isEmpty(imageContext.originalPickerSrc));
}, setLabelHidden:function(hideLabel) {
  if (!Ext.isEmpty(this.labelElement)) {
    if (hideLabel === true) {
      this.labelElement.hide();
    } else {
      this.labelElement.show();
    }
  }
}, onPopupPickerHide:function() {
  var imageContext = this.context, vm = imageContext.getViewModel();
  if (!imageContext.saveRequested) {
    imageContext.setPopupImagePickerSrc(imageContext.originalPickerSrc);
  }
  imageContext.saveRequested = false;
  imageContext.pickerShowing = false;
}, onImageLoaded:function() {
  var me = this;
  if (!Ext.isEmpty(me.getSrc())) {
    me.setStyle({'padding':'0px 0px 0px 0px', 'margin':'0px 5px 0px 10px'});
  }
  me.showLoadedImage();
  me.hidePlaceHolderText();
  me.hidePlaceHolderImage();
}, onPopupPickerResize:function() {
  this.center();
}, onImageTap:function(image) {
  if (!this.getReadOnly()) {
    this.down('#imageEditorPopup').show();
    this.fireEvent(ABPControlSet.common.types.Events.ImageClick, image);
  }
}, onSaveButtonTap:function() {
  var me = this, context = me.context, pickerContext = context.query('#imageEditorPopup')[0];
  var pickerSrc = pickerContext.down('#user-popup-image').getSrc();
  if (pickerSrc === context.defaultPopupPlaceholder) {
    context.setSrc('');
  } else {
    context.setSrc(pickerSrc);
  }
  pickerContext.saveRequested = true;
  pickerContext.originalPickerSrc = pickerSrc;
  pickerContext.hide();
}, onChangeButtonTap:function() {
  var fileTarget = this.context.query('filefield')[0].el;
  if (!Ext.isEmpty(fileTarget)) {
    fileTarget.query('input[type\x3dfile]')[0].click();
  }
}, onPlaceholderImageTap:function(image) {
  this.context.query('#imageEditorPopup')[0].show();
}, getSrc:function() {
  var imageCmp = this.down('#user-image');
  if (imageCmp) {
    return imageCmp.getSrc();
  }
}, updateReadOnly:function(readOnly) {
  var me = this, vm = me.getViewModel();
  vm.set('editorReadOnly', readOnly);
  this.showDefaultPlaceholder();
  me.updateOpacity(readOnly);
}, setSrc:function(value) {
  var me = this;
  if (Ext.isEmpty(value)) {
    me.resetABPImage();
  } else {
    me.setUserImageSrc(value);
  }
  me.callParent(arguments);
}, clearImage:function() {
  this.onFileChange({target:{files:[]}});
}, validateFileType:function(accept, fileType) {
  if (Ext.isEmpty(accept)) {
    return true;
  } else {
    if (accept === 'image/*') {
      if (fileType.toLowerCase().indexOf('image') > -1) {
        return true;
      }
    } else {
      var acceptedTypes = accept.split(',');
      for (var type in acceptedTypes) {
        if (fileType.toLowerCase() === acceptedTypes[type].toLowerCase()) {
          return true;
        }
      }
    }
  }
  return false;
}, onFileChange:function(event) {
  var me = this, vm = me.getViewModel(), file = event.target.files[0], reader = new FileReader;
  if (!file && !event.event) {
    me.resetImagePicker();
    return;
  }
  if (file && me.validateFileType(event.target.accept, file.type) === false) {
    ABP.view.base.toast.ABPToast.show({message:'[The file type specified is not supported]', level:'Warning'});
    return;
  }
  reader.onload = function(e) {
    me.setPopupImagePickerSrc(e.target.result);
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}, privates:{resetABPImage:function() {
  var me = this;
  me.hideActualImage();
  me.showDefaultPlaceholder();
  var placeholder = this.down('#placeholder');
  me.addCls('new-image');
  me.removeCls('loaded');
}, setUserImageSrc:function(src) {
  var me = this, placeholderImage = me.down('#placeholder-image'), actualImage = me.down('#user-image');
  placeholderImage.hide();
  me.removeCls('new-image');
  me.setPopupImagePickerSrc(src);
  actualImage.setSrc(src);
  me.hideAllPlaceholders();
}, setPopupImagePickerSrc:function(src) {
  var me = this, vm = me.getViewModel(), popupPickerImage = me.down('#user-popup-image');
  if (me.pickerShowing) {
    vm.set('pickerImageIsRemovedOrNeverAdded', Ext.isEmpty(src));
    vm.set('pickerImageHasChanged', me.originalPickerSrc === src);
  }
  if (Ext.isEmpty(src)) {
    popupPickerImage.setSrc(me.defaultPopupPlaceholder);
  } else {
    popupPickerImage.setSrc(src);
  }
}, hidePopupImagePickerImage:function() {
  var me = this, vm = me.getViewModel(), popupPickerImage = me.down('#user-popup-image');
  me.setPopupImagePickerSrc('');
  popupPickerImage.setHidden(true);
}, resetImagePicker:function() {
  var me = this, filePicker = me.down('filefield');
  filePicker.reset();
  me.hidePopupImagePickerImage();
}, hideActualImage:function() {
  var me = this, actualImage = me.down('#user-image');
  me.hidePopupImagePickerImage();
  actualImage.setSrc('');
  actualImage.setHidden(true);
}, setShownItemDimensions:function(shownItem, squareDim) {
  shownItem.setHeight(squareDim);
  shownItem.setWidth(squareDim);
  shownItem.setMinHeight(squareDim);
  shownItem.setMinWidth(squareDim);
  shownItem.setMaxHeight(squareDim);
  shownItem.setMaxWidth(squareDim);
  shownItem.setStyle({'padding':'0px 0px 0px 0px'});
}, hideAllPlaceholders:function() {
  var me = this, placeholderImage = me.down('#placeholder-image'), emptyImageWrapper = me.down('#defaultEmptyImage'), emptyPlaceholder = me.down('#empty-placeholder-image'), placeholder = me.down('#placeholder'), defaultImage = me.down('#defaultImage');
  placeholderImage.hide();
  emptyImageWrapper.hide();
  emptyPlaceholder.hide();
  placeholder.hide();
  defaultImage.hide();
}, showDefaultPlaceholder:function() {
  var me = this, placeholderImage = me.down('#placeholder-image'), emptyImageWrapper = me.down('#defaultEmptyImage'), emptyPlaceholder = me.down('#empty-placeholder-image'), placeholder = me.down('#placeholder'), defaultImage = me.down('#defaultImage');
  var squareDim = Math.min(me.getHeight(), me.getWidth());
  if (squareDim === 0) {
    squareDim = me.getContainer().element.getWidth();
  }
  if (Ext.isEmpty(me.getSrc())) {
    if (me.getReadOnly() !== true) {
      me.setShownItemDimensions(placeholderImage, squareDim);
      me.setShownItemDimensions(defaultImage, squareDim);
      emptyImageWrapper.hide();
      emptyPlaceholder.hide();
      placeholder.hide();
      placeholderImage.show();
      defaultImage.show();
    } else {
      if (!Ext.isEmpty(me.getPlaceholder())) {
        me.setShownItemDimensions(placeholder, squareDim);
        placeholderImage.hide();
        emptyPlaceholder.hide();
        defaultImage.hide();
        placeholder.show();
      } else {
        me.setShownItemDimensions(emptyImageWrapper, squareDim);
        me.setShownItemDimensions(emptyPlaceholder, squareDim);
        placeholderImage.hide();
        defaultImage.hide();
        placeholder.hide();
        emptyImageWrapper.show();
        emptyPlaceholder.show();
      }
    }
  } else {
    placeholder.hide();
    placeholderImage.hide();
  }
}}});
Ext.define('ABPControlSet.view.field.MultiEntityLink', {extend:'ABPControlSet.view.field.EntityLink', xtype:'abpmultientitylinkfield', config:{delimeter:', ', store:null}, setUserValue:function(values) {
  var me = this;
  this.__userChange = true;
  me.setValue(values);
  this.__userChange = null;
}, updateValue:function(values, oldValues) {
  values = values || [];
  var me = this, store = me.getStore(), inputValue = me.getEntityDisplayValue(values);
  me.setInputValue(inputValue);
  if (store) {
    store.suspendEvents();
    store.removeAll();
    store.add(values);
    store.resumeEvents(true);
  }
  me.syncEmptyState();
  if (this.__userChange && !me.valuesEqual(values, oldValues)) {
    this.fireEvent(ABPControlSet.common.types.Events.UserChanged, this, values, oldValues);
  }
}, valuesEqual:function(values1, values2) {
  if (Ext.isEmpty(values1) && Ext.isEmpty(values2)) {
    return true;
  }
  if (!Ext.isArray(values1) || !Ext.isArray(values2)) {
    return false;
  }
  if (values1.length !== values2.length) {
    return false;
  }
  var equalCount = 0;
  values1.forEach(function(item1, index1) {
    var data1 = item1 instanceof Ext.data.Model ? item1.data : item1;
    Ext.Array.every(values2, function(item2, index2) {
      var data2 = item2 instanceof Ext.data.Model ? item2.data : item2;
      if (Ext.Object.equals(data1, data2)) {
        equalCount++;
        return false;
      }
      return true;
    });
  });
  return equalCount === values1.length;
}, getEntityDisplayValue:function(values) {
  var me = this, item, length = values.length, inputValue = '', delimeter = me.getDelimeter(), value, descriptor, vf = me.getValueField(), df = me.getDisplayField();
  for (var i = 0; i < length; i++) {
    item = values[i];
    value = item.get ? item.get(vf) : item[vf];
    descriptor = (item.get ? item.get(df) : item[df]) || value;
    inputValue += i !== 0 ? delimeter + descriptor : descriptor;
  }
  return inputValue;
}, updateStore:function(store) {
  var me = this;
  if (store) {
    store.clearManagedListeners();
    me.mon(store, 'endupdate', me.doUpdateStore, me);
  }
  me.doUpdateStore(store);
}, doUpdateStore:function(store) {
  if (!store) {
    store = this.getStore();
  }
  var items = store && store.getRange ? store.getRange() : null;
  if (items) {
    this.setValue(items);
  }
}});
Ext.define('ABPControlSet.view.field.Number', {extend:'Ext.field.Number', xtype:'abpnumber', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.Field'], allowThousandSeparator:false, thousandSeparator:null, inputType:'number', inputMode:'decimal', constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, initialize:function() {
  this.callParent(arguments);
  if (this.inputMode && this.inputElement && this.inputElement.dom) {
    this.inputElement.dom.setAttribute('inputmode', this.inputMode);
  }
}});
Ext.define('ABPControlSet.view.field.RadioGroup', {extend:'Ext.field.Container', xtype:'abpradiogroup', requires:['ABPControlSet.base.view.field.plugin.RadioGroup', 'ABPControlSet.base.mixin.Field'], mixins:['ABPControlSet.base.mixin.RadioGroup'], publishes:['value'], constructor:function(config) {
  config = config || {};
  config.defaults = config.defaults || {};
  Ext.applyIf(config.defaults, {xtype:'radiofield', readOnly:config.readOnly, padding:'0 5 0 0'});
  config.defaults.listeners = config.defaults.listeners || {};
  Ext.apply(config.defaults.listeners, {change:this.__onItemValueChange, scope:this});
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, setReadOnly:function() {
  if (this.superclass.setReadOnly) {
    this.callParent(arguments);
  }
}, updateValue:function(value) {
  var items = this.getItems().getRange(), length = items.length;
  for (var i = 0; i < length; i++) {
    items[i].setGroupValue(value);
    break;
  }
  this.callParent(arguments);
}, __onItemValueChange:function(item) {
  if (item.$onChange) {
    var value = item.getValue();
    this.setValue(value);
  }
}});
Ext.define('ABPControlSet.view.form.trigger.Trigger', {extend:'Ext.field.trigger.Trigger', alias:'trigger.abptrigger', xtype:'abptrigger', requires:['ABPControlSet.base.mixin.Trigger'], mixins:['ABPControlSet.base.mixin.Trigger'], tabIndex:-1, template:[{tag:'div', reference:'iconElement', classList:['mixin-trigger']}], constructor:function(config) {
  config = config || {};
  config.component = {xtype:'tool', callback:this.triggerClick.bind(this), cls:'mixin-trigger-tool', maskOnDisable:false, iconCls:config.icon, listeners:{focus:this.onTriggerFocus, scope:this}};
  config.__handler = config.__handler || config.handler;
  config.handler = null;
  this.callParent([config]);
  this.mon(this.field, 'painted', this.onFieldRender, this);
}, onTriggerFocus:function(e) {
  var field = this.field;
  if (field) {
    field.fireEvent(ABPControlSet.common.types.Events.TriggerFocus, this);
  }
}, triggerClick:function() {
  var field = this.field;
  if (field && !this.getDisabled() && !field.getDisabled()) {
    if (field.fireEvent(ABPControlSet.common.types.Events.TriggerClick, this, field) !== false) {
      var handler = this.__handler;
      if (handler) {
        Ext.callback(handler, null, [this, field], 0, field);
      }
    }
  }
}, onClick:function(e) {
  var me = this, handler = !me.getDisabled() && me.getHandler(), field = me.getField();
  if (field) {
    this.component.focus();
    if (handler) {
      Ext.callback(handler, me.getScope(), [field, me, e], null, field);
    }
  }
}, onMouseDown:function(e) {
  this.component.focus();
}, onFieldRender:function() {
  var me = this, component = me.component;
  if (!component.isComponent && !component.isWidget) {
    component = Ext.widget(component);
  }
  me.component = component;
  component.iconElement.removeCls(Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon');
  component.render(me.iconElement);
}, destroy:function() {
  var component = this.component;
  if (component.isComponent || component.isWidget) {
    component.destroy();
  }
  this.component = null;
  this.callParent();
}});
Ext.define('ABPControlSet.view.field.Text', {extend:'Ext.field.Text', xtype:'abptext', requires:['ABPControlSet.base.view.field.plugin.LinkedLabel', 'ABPControlSet.view.form.trigger.Trigger', 'ABPControlSet.base.view.field.plugin.Field', 'ABPControlSet.base.mixin.Text'], mixins:['ABPControlSet.base.mixin.Text'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.rightpane.interactions.InteractionsController', {extend:'Ext.app.ViewController', alias:'controller.interactionspane', listen:{controller:{'*':{interactions_populate:'populateContainer', rightPane_toggleTab:'handleToggleTab'}}}, onToggle:function() {
}, populateContainer:function(content) {
  var me = this;
  var view = me.getView();
  view.removeAll();
  view.add(content);
}, privates:{handleToggleTab:function(activeTab) {
  var me = this, view = me.getView();
  if (activeTab.xtype === view.xtype) {
    me.onToggle();
  }
}, baseRightPanePanel_toggleRightPane:function() {
  this.fireEvent('session_toggleRightPane');
}}});
Ext.define('ABPControlSet.view.rightpane.interactions.Interactions', {extend:'Ext.Panel', requires:['ABPControlSet.view.rightpane.interactions.InteractionsController'], alias:'widget.interactionspane', controller:'interactionspane', scrollable:'vertical', focusableContainer:true, initialize:function() {
  var me = this;
  me.setTools((me.config.tools || []).concat([{type:'close', automationCls:'rightpanel-btn-close', handler:'baseRightPanePanel_toggleRightPane'}]));
  this.callParent();
}, title:'Interactions', items:[]});
Ext.define('ABPControlSet.common.types.Interaction', {items:null, fields:null, placement:null, rightPane:true, rightPaneTitle:null, title:null, text:null, headerPriority:null, thumbbarPriority:null, bind:null, handler:null});
Ext.define('ABPControlSet.base.plugin.Interactions', {extend:'Ext.AbstractPlugin', alias:'plugin.abpinteractions', requires:['ABPControlSet.view.rightpane.interactions.Interactions', 'ABPControlSet.common.types.Interaction'], groupDefaults:{xtype:'container', padding:0}, itemDefaults:{flex:1, xtype:'abpbutton', scale:'medium'}, config:{interactions:null, thumbarInteractions:null, headerInteractions:null, rightPaneInteractions:null}, interactionsBar:null, __thumbarInteractions:null, __headerInteractions:null, 
__rightPaneInteractions:null, paneName:'interactions', init:function(cmp) {
  var me = this, interactions = cmp.interactions, listeners = {boxready:me.interactionOnShow, aftershow:me.interactionOnShow, beforehide:me.interactionOnHide, beforedestroy:me.interactionOnHide, scope:me};
  listeners[Ext.toolkit === 'modern' ? 'painted' : 'render'] = {fn:me.interactionOnShow, scope:me, single:true};
  me.setInteractions(interactions);
  delete cmp.interactions;
  cmp.on(listeners);
}, setInteractions:function(interactions) {
  interactions = interactions || [];
  var me = this;
  me.callParent(arguments);
  me.__thumbarInteractions = [];
  me.__headerInteractions = [];
  me.__rightPaneInteractions = [];
  me.processInteractions(interactions, false);
  me.setThumbarInteractions(me.__thumbarInteractions);
  if (Ext.toolkit === 'classic') {
    me.setHeaderInteractions(me.__headerInteractions);
  }
  me.setRightPaneInteractions(me.__rightPaneInteractions);
}, interactionOnShow:function() {
  var me = this, view = me.getCmp(), controller = view.getController();
  if (controller) {
    if (Ext.toolkit === 'classic') {
      controller.fireEvent('container_rightPane_initTab', me.paneName);
    }
    controller.fireEvent('container_rightPane_showButton', me.paneName, true);
    controller.fireEvent('interactions_populate', me.getRightPaneInteractions());
    if (Ext.toolkit === 'modern') {
      controller.fireEvent('container_thumbbar_show', {buttons:me.getThumbarInteractions()});
    }
  }
}, interactionOnHide:function() {
  var me = this, view = me.getCmp(), controller = view.getController();
  if (controller) {
    if (Ext.toolkit === 'modern') {
      controller.fireEvent('container_thumbbar_hide', true);
    }
    controller.fireEvent('container_rightPane_showButton', me.paneName, false);
    controller.fireEvent('container_rightPane_toggleTab', me.paneName, false);
    controller.fireEvent('interactions_populate', []);
  }
}, setThumbarInteractions:function(interactions) {
  var me = this, view = me.getCmp();
  interactions = interactions || [];
  interactions = interactions.sort(function(a, b) {
    return a.thumbbarPriority - b.thumbbarPriority;
  });
  this.callParent([interactions]);
  var me = this, isVisible = view.isVisible();
  if (isVisible) {
    me.interactionOnShow();
  }
}, setHeaderInteractions:function(interactions) {
  var me = this, interactionsBar = me.getTBar();
  interactions = interactions || [];
  interactions = interactions.sort(function(a, b) {
    return a.headerPriority - b.headerPriority;
  });
  if (Ext.toolkit === 'classic') {
    if (interactionsBar && Ext.isArray(interactions)) {
      if (interactionsBar.removeAll) {
        interactionsBar.removeAll();
        interactionsBar.add(interactions);
      } else {
        interactionsBar.items = interactions;
      }
    }
  }
}, getTBar:function() {
  var me = this, view = me.getCmp(), interactionsBar = me.interactionsBar;
  if (!interactionsBar) {
    interactionsBar = Ext.create({scrollable:'horizontal', xtype:'toolbar', docked:'top', dock:'top', cls:'interactions-toolbar'});
    me.interactionsBar = view.addDocked(interactionsBar)[0];
  }
  return me.interactionsBar;
}, setRightPaneInteractions:function(interactions) {
  this.callParent(arguments);
  var me = this, view = me.getCmp(), isVisible = view.isVisible();
  if (isVisible) {
    me.interactionsOnShow();
  }
}, processInteractions:function(interaction, isChild, parent) {
  var me = this, view = me.getCmp(), thumbbar = me.__thumbarInteractions, header = me.__headerInteractions, rightPane = me.__rightPaneInteractions, controller = view.getController(), vm = view.getViewModel();
  isChild = interaction.items ? false : isChild;
  if (Ext.isObject(interaction)) {
    interaction.viewModel = {parent:vm};
    if (interaction.handler && controller) {
      var handler = interaction.handler;
      interaction.handler = Ext.isObject(handler) ? handler.fn.bind(handler.scope || controller) : (Ext.isFunction(handler) ? handler : controller[handler] ? controller[handler] : Ext.emptyFn).bind(controller);
    }
    interaction.refOwner = view;
    interaction.scope = controller || view;
    if (Ext.toolkit === 'modern' && Ext.isNumber(interaction.thumbbarPriority)) {
      var thumbarClone = Ext.clone(interaction);
      delete thumbarClone.text;
      thumbbar.push(thumbarClone);
    }
    if (!isChild && Ext.toolkit === 'classic' && Ext.isNumber(interaction.headerPriority)) {
      var headerClone = Ext.clone(interaction);
      if (headerClone.items) {
        me.processInteractions(headerClone.items, !!parent, headerClone);
        Ext.applyIf(headerClone, {defaultType:'abpbutton'});
        Ext.applyIf(headerClone, me.groupDefaults);
        Ext.applyIf(headerClone, {defaults:me.itemDefaults});
      } else {
        Ext.applyIf(headerClone, me.itemDefaults);
      }
      header.push(headerClone);
    }
    if (!isChild && interaction.rightPane !== false) {
      var rightPaneClone = Ext.clone(interaction);
      if (Ext.toolkit === 'classic') {
        rightPaneClone.getBubbleTarget = function() {
          return view;
        };
      }
      if (rightPaneClone.items) {
        var rightPaneItems = [], length = rightPaneClone.items.length;
        for (var i = 0; i < length; i++) {
          if (rightPaneClone.items[i].rightPane !== false) {
            rightPaneItems.push(rightPaneClone.items[i]);
          }
        }
        rightPaneClone.items = rightPaneItems;
        me.processInteractions(rightPaneClone.items, !!parent, rightPaneClone);
        Ext.applyIf(rightPaneClone, me.groupDefaults);
        Ext.applyIf(rightPaneClone, {defaults:me.itemDefaults});
      } else {
        Ext.applyIf(rightPaneClone, me.itemDefaults);
      }
      if (rightPaneClone.rightPaneTitle) {
        rightPaneClone.title = rightPaneClone.rightPaneTitle;
      }
      rightPane.push(rightPaneClone);
    }
    return interaction;
  } else {
    if (Ext.isArray(interaction)) {
      var length = interaction.length;
      for (var i = 0; i < length; i++) {
        interaction[i] = me.processInteractions(interaction[i], !!parent, parent);
      }
    }
  }
}});
Ext.define('ABPControlSet.view.form.Form', {extend:'Ext.form.Panel', xtype:'abpform', requires:['ABPControlSet.base.mixin.Panel', 'ABPControlSet.base.plugin.Interactions'], mixins:['ABPControlSet.base.mixin.Panel'], plugins:{abpinteractions:false}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.form.Label', {extend:'Ext.Label', xtype:'abplabel', labelSeparator:'', constructor:function(config) {
  config = config || {};
  config.cls = config.cls || '';
  config.cls += ' ' + Ext.baseCSSPrefix + 'form-item-label ' + Ext.baseCSSPrefix + 'form-item-label-default ' + Ext.baseCSSPrefix + 'form-item-label-right ' + Ext.baseCSSPrefix + 'form-item-label-inner ' + Ext.baseCSSPrefix + 'form-item-label-text';
  this.callParent([config]);
}, trimLabelSeparator:function() {
  var me = this, separator = me.labelSeparator, label = me.text || '', lastChar = label.substr(label.length - 1);
  return lastChar === separator ? label.slice(0, -1) : label;
}, getElConfig:function() {
  var me = this, text = me.text, separator = me.labelSeparator;
  if (!Ext.isEmpty(separator)) {
    text = me.trimLabelSeparator() + separator;
  }
  me.html = text ? Ext.util.Format.htmlEncode(text) : me.html || '';
  return Ext.apply(me.superclass.superclass.getElConfig.apply(this), {htmlFor:me.forId || ''});
}, setText:function(text, encode) {
  var me = this, separator = me.labelSeparator;
  me.text = text;
  encode = true;
  if (!Ext.isEmpty(separator)) {
    text = me.trimLabelSeparator() + separator;
  }
  me.setHtml(text);
}});
Ext.define('ABPControlSet.view.grid.AGGrid', {extend:'ABPControlSet.base.view.grid.AGGrid', xtype:'abpaggrid', requires:['ABPControlSet.base.view.grid.AGGrid', 'ABPControlSet.base.mixin.Component'], mixins:['ABPControlSet.base.mixin.Component'], config:{store:null}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, initialize:function() {
  this.callParent(arguments);
  if (this.rendered) {
    this.beginEmbed();
  } else {
    this.on({painted:{fn:this.beginEmbed, scope:this, priority:999}});
  }
}});
Ext.define('ABPControlSet.view.grid.Grid', {extend:'Ext.grid.Grid', xtype:'abpgrid', requires:['ABPControlSet.base.view.grid.plugin.Grid', 'ABPControlSet.base.mixin.Grid'], border:true, mixins:['ABPControlSet.base.mixin.Grid'], listOnTop:false, listView:false, config:{showShadow:false, shadowOnScroll:false}, listeners:{storechange:{el:'element', fn:function(grid, store) {
  var me = this;
  if (store) {
    store.on('datachanged', me.setGridHeightFromStore.bind(me));
  }
}}}, constructor:function(config) {
  config = config || {};
  config.listView = Ext.isBoolean(config.listView) ? config.listView : this.listView === false ? false : true;
  if (config.listView) {
    config.plugins = config.plugins || {};
    config.plugins.listview = config.plugins.listview === true ? {} : config.plugins.listview;
    if (!Ext.isObject(config.plugins.listview)) {
      config.plugins.listview = {};
    }
    config.plugins.listview.fullRow = config.listOnTop || this.listOnTop;
    config.plugins.listview.template = config.listTemplate || this.listTemplate;
  }
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, onScrollMove:function(start, end) {
  var me = this;
  var useShadow = me.getShadowOnScroll();
  var showShadow = me.getShowShadow();
  var boxExists = document.getElementById('grid-box-shadow');
  if (!useShadow) {
    return;
  }
  if (!boxExists) {
    var box = document.createElement('div');
    box.id = 'grid-box-shadow';
    box.style.opacity = 0;
    this.outerCt.el.dom.prepend(box);
  }
  if (end >= 6 && !showShadow) {
    if (boxExists) {
      boxExists.style.opacity = 1;
    }
    me.setShowShadow(true);
  } else {
    if (end < 6 && showShadow) {
      boxExists.style.opacity = 0;
      me.setShowShadow(false);
    }
  }
}, privates:{syncRows:function() {
  if (this.isHidden(true)) {
    return;
  }
  this.setGridHeight();
  this.callParent(arguments);
}, syncRowsToHeight:function(force) {
  var me = this, bufferZone = me.getBufferSize(), infinite = me.infinite, rowCountWas = me.getItemCount(), rowHeight = me.rowHeight, firstTime = !rowHeight, renderInfo = me.renderInfo, oldIndexBottom = renderInfo && renderInfo.indexBottom, storeCount = me.store.getCount(), visibleHeight = me.getMaxHeight() || me.getVisibleHeight(), indexTop, row, rowCount;
  if (firstTime) {
    if (!rowCountWas) {
      me.setItemCount(1);
    }
    row = me.dataItems[0];
    row.$height = null;
    me.rowHeight = rowHeight = me.measureItem(row);
    if (!rowCountWas) {
      row.destroy();
      me.dataItems.length = 0;
      me.setItemCount(0);
    }
  }
  if (infinite) {
    rowCount = Math.ceil(visibleHeight / rowHeight) + bufferZone;
    rowCount = Math.min(rowCount, storeCount);
  } else {
    rowCount = storeCount;
  }
  me.setItemCount(rowCount);
  if (me.listView || firstTime && me.store.isVirtualStore || rowCountWas !== rowCount || storeCount < oldIndexBottom) {
    if (infinite) {
      indexTop = Math.min(storeCount - rowCount, renderInfo.indexTop);
      indexTop = Math.max(0, indexTop);
      if (indexTop === me.getTopRenderedIndex()) {
        me.updateTopRenderedIndex(indexTop);
      } else {
        me.setTopRenderedIndex(indexTop);
      }
    }
    if (firstTime) {
      me.refreshGrouping();
    }
    force = force !== false;
    if (force && storeCount < oldIndexBottom) {
      renderInfo.top = renderInfo.indexTop * me.rowHeight;
    }
  }
  if (force) {
    me.syncRows();
  }
}, setGridHeightFromStore:function(store) {
  this.setGridHeight(store);
}, setGridHeight:function(store) {
  var grid = this, rowHeight = grid.rowHeight, itemCount, store = store || grid.getStore(), height = grid.getHeight(), gridItemCount = grid.getItemCount(), minHeight = grid.getMinHeight(), extraHeight = this.getExtraGridHeight();
  if (Ext.isEmpty(minHeight)) {
    grid.setMinHeight(rowHeight + extraHeight);
  }
  if (store && store.getData()) {
    itemCount = store.getData().length;
  }
  if (!itemCount) {
    itemCount = gridItemCount;
  }
  if (!grid.responsiveFillHeight) {
    if (itemCount === 0) {
      itemCount = 1;
    }
    var totalHeight = rowHeight * itemCount + extraHeight;
    if (totalHeight !== height && totalHeight > 0) {
      grid.setHeight(totalHeight);
    }
  } else {
    grid.setHeight('100%');
  }
  if (grid.config.maxHeight) {
    var maxHeight = ABP.util.String.parseInt(grid.config.maxHeight), currentMaxHeight = grid.getMaxHeight();
    if (Ext.isEmpty(currentMaxHeight) && currentMaxHeight !== maxHeight) {
      grid.setMaxHeight(maxHeight + extraHeight);
    }
  }
}, getExtraGridHeight:function() {
  var grid = this, padding = grid.el.getPadding('tb'), margin = grid.el.getMargin('tb'), rowLinesIncrement = grid.getRowLines() ? 1 : 0, headerHeight;
  if (grid.listView) {
    var titleBar = grid.getTitleBar();
    headerHeight = titleBar ? titleBar.el.getHeight() : 0;
  } else {
    var header = grid.getHeaderContainer();
    headerHeight = header ? header.el.getHeight() : 0;
  }
  return headerHeight + padding + margin + rowLinesIncrement;
}}});
Ext.define('ABPControlSet.view.grid.cell.ButtonCell', {extend:'Ext.grid.cell.Widget', xtype:'abpbuttoncell', cls:'abp-forms-button-cell', config:{widgetClasses:'x-icon-el x-font-icon', iconCls:null, text:null, fieldLabel:null, disabled:null, hidden:null, parentColumn:null}, constructor:function(config) {
  var columnConfig = config.column ? config.column.config : null;
  var column = config.parentColumn;
  if (columnConfig) {
    config.widget = {xtype:'abpbutton', cls:'grid-row-tools abp-forms-row-button abp-list-view-trigger', automationCls:'list-view-trigger-' + columnConfig.listPriority, iconCls:column && column.iconCls ? column.iconCls : null, text:column && column.label ? column.label : '', iconAlign:'top', disabled:column ? column.disabled : false, hidden:column ? column.hidden : false};
  }
  this.callParent([config]);
}, setValue:function(value) {
  var widget = this.getWidget();
  if (!Ext.isEmpty(widget)) {
    widget.setValue(value);
  }
  this.callParent(value);
}, setIconCls:function(value) {
  var widget = this.getWidget();
  if (!Ext.isEmpty(widget)) {
    widget.setIconCls(value);
  }
}, setFieldLabel:function(value) {
  var widget = this.getWidget();
  if (!Ext.isEmpty(widget)) {
    widget.setText(value);
  }
}});
Ext.define('ABPControlSet.view.grid.cell.IconCell', {extend:'Ext.grid.cell.Widget', xtype:'abpiconcell', cls:'abp-forms-icon-cell', config:{widgetClasses:'x-icon-el x-font-icon', foregroundColor:null}, constructor:function(config) {
  var columnConfig = config.column ? config.column.config : null;
  if (columnConfig) {
    config.widget = {xtype:'abpicon', cls:config.widgetClasses ? config.widgetClasses : widgetClasses, automationCls:'list-view-icon-' + columnConfig.listPriority};
  }
  this.callParent([config]);
}, setValue:function(value) {
  var widget = this.getWidget();
  if (!Ext.isEmpty(widget)) {
    widget.setValue(value);
  }
  this.callParent(null);
}});
Ext.define('ABPControlSet.view.grid.cell.ImageCell', {extend:'Ext.grid.cell.Cell', xtype:'abpimagecell', encodeHtml:false, config:{placeholder:null}, statics:{onImageLoad:function(image) {
  image.parentNode.firstChild.style.display = 'none';
  var imageNode = image.parentNode && image.parentNode.parentNode ? image.parentNode.parentNode.parentNode : null;
  if (imageNode) {
    imageNode.parentElement.classList.add('loaded');
    var smallestDimension = Math.max(50, imageNode.parentElement.offsetHeight, imageNode.parentElement.offsetWidth);
    image.style.maxHeight = smallestDimension + 'px';
    image.style.maxWidth = smallestDimension + 'px';
  }
  image.style.display = 'block';
}, onImageError:function(image) {
  var imageNode = image.parentNode && image.parentNode.parentNode ? image.parentNode.parentNode.parentNode : null;
  if (imageNode) {
    imageNode.parentElement.classList.remove('loaded');
  }
}}, updatePlaceholder:function(newPlaceholder, oldPlaceholder) {
  var me = this;
  if (!Ext.isEmpty(newPlaceholder) && newPlaceholder !== oldPlaceholder) {
    var placeholderCell = me.element.down('.img-placeholder');
    if (placeholderCell) {
      placeholderCell.el.dom.innerText = newPlaceholder;
    }
  }
}, constructor:function(config) {
  config = config || {};
  Ext.apply(config, {renderer:function(value, record, dataIndex, cell) {
    if (record && cell.config) {
      var vm = cell.lookupViewModel();
      var placeholderBind = cell.config.bind ? cell.config.bind.placeholder : null;
      if (placeholderBind && placeholderBind.indexOf('{') === 0) {
        placeholderBind = placeholderBind.substr(1).slice(0, -1);
      }
      if (placeholderBind) {
        placeholder = vm.get(placeholderBind);
      }
    }
    var className = '';
    if (cell.cropStyle) {
      className = 'cropped';
    }
    var placeholder = placeholder || (cell.getPlaceholder() || '');
    return '\x3cdiv class\x3d"' + className + '"\x3e' + '\x3cdiv class\x3d"img-placeholder"\x3e' + placeholder + '\x3c/div\x3e' + '\x3cimg style\x3d"display:none;" onload\x3d"ABPControlSet.view.grid.cell.ImageCell.onImageLoad(arguments[0].srcElement);" onerror\x3d"ABPControlSet.view.grid.cell.ImageCell.onImageError(arguments[0].srcElement)" src\x3d"' + value + '"\x3e' + '\x3c/div\x3e';
  }});
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.grid.cell.TextCell', {extend:'Ext.grid.cell.Cell', xtype:'abptextcell', encodeHtml:false, config:{foregroundColor:null}, updateForegroundColor:function(color) {
  this.el.setStyle('color', color);
}});
Ext.define('ABPControlSet.view.panel.Panel', {extend:'Ext.field.Panel', xtype:'abppanel', requires:['ABPControlSet.base.mixin.Panel'], border:true, mixins:['ABPControlSet.base.mixin.Panel'], config:{readOnly:null}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, updateReadOnly:function(newReadOnly) {
  this.getFields(false).forEach(function(field) {
    if (field.setReadOnly) {
      field.setReadOnly(newReadOnly);
    }
  });
  return this;
}});
Ext.define('ABPControlSet.view.panel.TabPanel', {extend:'Ext.tab.Panel', xtype:'abptabpanel', requires:['ABPControlSet.base.mixin.TabPanel'], mixins:['ABPControlSet.base.mixin.TabPanel'], tabBar:{scrollable:'horizontal'}, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.tab.Tab', {extend:'Ext.tab.Tab', xtype:'abptab', requires:['ABPControlSet.base.mixin.Button'], mixins:['ABPControlSet.base.mixin.Button'], constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}});
Ext.define('ABPControlSet.view.visual.Separator', {extend:'Ext.menu.Separator', xtype:'abpseparator', cls:'abp-horizontal-separator', requires:['ABPControlSet.base.mixin.Separator'], mixins:['ABPControlSet.base.mixin.Separator'], afterRender:Ext.EmptyFn, constructor:function(config) {
  config = config || {};
  this.mixins.abpcomponent.constructor.call(this, config);
  this.callParent([config]);
}, setForegroundColor:function(color) {
  if (this.bodyElement) {
    this.bodyElement.setStyle('border-color', color);
  }
}});
Ext.define('ABPControlSet.store.AGGrid', {extend:'Ext.data.Store', autoLoad:false, processingAG:false, processingExt:false, config:{gridApi:null, columnApi:null}, updateColumnApi:function(columnApi) {
  var me = this, fields = [];
  if (columnApi) {
    fields = me.transformColumnDefs(columnApi.getAllColumns());
  }
  me.setFields(fields);
}, updateGridApi:function(gridApi) {
  var me = this;
  if (gridApi && gridApi.rowModel && gridApi.rowModel.getType().toLowerCase() == 'inmemory') {
    gridApi.addEventListener('modelUpdated', me.__syncData.bind(me));
    me.__syncData();
  }
}, listeners:{add:'extAdd', remove:'extRemove', update:'extUpdate'}, transformColumnDefs:function(columns) {
  columns = columns || [];
  var fields = [], colDef, length = columns.length;
  for (var i; i < length; i++) {
    colDef = columns[i] ? columns[i].colDef : null;
    if (colDef) {
      fields.push({type:'string', fieldName:colDef['headerName'], name:colDef['field']});
    }
  }
  return fields;
}, __syncData:function() {
  var me = this, rows = [], gridApi = me.getGridApi();
  if (gridApi && !me.processingExt) {
    me.processingAG = true;
    gridApi.forEachNodeAfterFilterAndSort(function(node) {
      if (node.data) {
        rows.push(node.data);
      }
    });
    me.loadData(rows);
    me.processingAG = false;
  }
}, extAdd:function(store, records, index, options) {
  var me = this, gridApi = me.getGridApi(), recToAdd = {add:null};
  if (gridApi && !me.processingAG) {
    me.processingExt = true;
    recToAdd.add = records.map(function(x) {
      return x.data;
    });
    me.gridApi.updateRowData(recToAdd);
    me.processingExt = false;
  }
}, extRemove:function(store, records, index, isMove, eOpts) {
  var me = this, gridApi = me.getGridApi(), recsToRemove = {remove:null};
  if (gridApi && !me.processingAG) {
    recsToRemove.remove = records.map(function(x) {
      return x.data;
    });
    me.processingExt = true;
    me.gridApi.updateRowData(recsToRemove);
    me.processingExt = false;
  }
}, extUpdate:function(store, record, operation, modifiedFieldNames, details, eOpts) {
  var me = this, gridApi = me.getGridApi(), recToUpdate = record;
  if (gridApi && !me.processingAG) {
    recToUpdate = record.getData();
    me.processingExt = true;
    me.gridApi.updateRowData({update:[recToUpdate]});
    me.processingExt = false;
  }
}});
Ext.define('ABPControlSet.store.BufferedAGGrid', {extend:'ABPControlSet.store.AGGrid', requires:['ABPControlSet.store.AGGrid'], updateGridApi:function(gridApi) {
  this.callParent(arguments);
}});
Ext.define('ABPControlSet.store.ListViewTemplates', {extend:'Ext.data.Store', data:[{display:'Tri Image', value:'triImage'}, {display:'Tri Data', value:'triData'}, {display:'Duo Image', value:'duoImage'}, {display:'Phone Number Display', value:'phoneNumberDisplay'}, {display:'Phone Number Display In Form', value:'phoneNumberDisplayInForm'}, {display:'Email Display', value:'emailDisplay'}, {display:'Single Line Item', value:'singleLineItem'}, {display:'Single Line Item with Trigger', value:'singleLineItemWithTrigger'}, 
{display:'Two Line Item', value:'twoLineItem'}, {display:'Two Line Item With Trigger', value:'twoLineItemWithTrigger'}, {display:'Three Line Item', value:'threeLineItem'}, {display:'Three Line Item With Trigger', value:'threeLineItemWithTrigger'}, {display:'Header Line Item With Three Fields', value:'headerLineItemWithThreeFields'}, {display:'Two Line Phone or Email', value:'twoLineItemWithPhoneOrEmail'}]});
Ext.define('ABPControlSet.Initialize', {singleton:true, requires:['ABPControlSet.base.view.*', 'ABPControlSet.base.mixin.*', 'ABPControlSet.mixin.*', 'ABPControlSet.layout.*', 'ABPControlSet.view.*', 'ABPControlSet.store.*']});
Ext.define('ABPControlSet.common.Common', {singleton:true, config:{iconStore:null}, iconPrefix:'icon-', iconRe:/(?:^|\s)pickericon-(\S*)(?:\s|$)/, getComponentFromElement:function(element) {
  var cmp = Ext.Viewport, possibleCmp;
  if (element) {
    cmp = null;
    while (cmp === null) {
      possibleCmp = Ext.getCmp(element.id);
      if (possibleCmp instanceof Ext.Widget || possibleCmp instanceof Ext.Component) {
        cmp = possibleCmp;
      } else {
        element = element.offsetParent;
        if (!element) {
          break;
        }
      }
    }
  }
  return cmp;
}, getIconStore:function() {
  var iconStore = this.callParent(arguments);
  if (!iconStore) {
    var me = this, iconRegex = new RegExp('^\\.(' + me.iconPrefix + '.*)::before$'), match = null;
    var icons = [];
    Ext.iterate(Ext.util.CSS.getRules(), function(key, value) {
      match = iconRegex.exec(value.selectorText);
      if (match) {
        icons.push({icon:match[1]});
      }
    });
    iconStore = new Ext.data.Store({data:icons});
    this.setIconStore(iconStore);
  }
  return iconStore;
}});
Ext.define('ABPControlSet.common.types.AssociatedDataRoot', {rootPropName:'', decode:false, matchProp:'', componentMatchProp:'', assoc:{}});
Ext.define('ABPControlSet.common.types.Engine', {requires:['ABPControlSet.common.types.AssociatedDataRoot'], appId:null, sort:null, decode:false, responsive:true, generateModel:false, modelFieldPropName:null, modelIdentifierPropName:null, flat:true, rootComponentPropName:'.', associatedDataRoots:[], parentPropName:'', matchChildWithName:'', ownerPropName:'', childrenProps:[], originalDataPropName:'', assoc:{}, advancedAssoc:{}, xtypes:{}, defaults:{}, interactionsProp:null, interactionAssoc:null, 
interactionChildrenProps:null, interactionsSort:null, constructor:function(config) {
  config = config || {};
  this.callParent(arguments);
  Ext.apply(this, config);
}});
Ext.define('ABPControlSet.common.FormEngine', {requires:['ABPControlSet.view.*', 'ABPControlSet.layout.*', 'ABPControlSet.common.types.*'], engine:null, __currentItems:null, processItem:Ext.emptyFn, processInteraction:Ext.emptyFn, processItemField:Ext.emptyFn, processAssociatedItem:Ext.emptyFn, processResult:function(result, model) {
  return result;
}, preProcessReference:function(value) {
  return value;
}, processAssociatedItemData:Ext.emptyFn, constructor:function(config) {
  config = config || {};
  this.engine = config.engine || this.engine || {};
  this.callParent(arguments);
  if (!(this.engine instanceof ABPControlSet.common.types.Engine)) {
    this.engine = new ABPControlSet.common.types.Engine(this.engine);
  }
}, processJson:function(json, callback, additionalConfig) {
  var originalEngine = Ext.clone(this.engine);
  if (Ext.isString(json)) {
    json = Ext.decode(json);
  }
  if (Ext.isObject(additionalConfig)) {
    Ext.apply(this.engine, additionalConfig);
  }
  var engine = this.engine, componentRoot;
  if (!engine.rootComponentPropName || engine.rootComponentPropName === '.') {
    componentRoot = json;
  } else {
    componentRoot = this.findRoot(engine.rootComponentPropName, json);
  }
  if (engine.decode) {
    componentRoot = Ext.decode(componentRoot);
  }
  var result = this.process(componentRoot), fields = Ext.isArray(result) ? [] : result.fields, components = Ext.isArray(result) ? result : result.items;
  var associatedDataRoots = engine.associatedDataRoots, dataRootConfig, dataRoot, length = associatedDataRoots.length, i = 0, modelPreface = 'dynamic_', modelIdentifierPropName = engine.modelIdentifierPropName, modelIdentifier, model;
  if (engine.generateModel && modelIdentifierPropName) {
    modelIdentifier = this.getPropValue(json, modelIdentifierPropName);
    if (modelIdentifier && Ext.ClassManager.isCreated(modelPreface + modelIdentifier)) {
      model = Ext.create(modelPreface + modelIdentifier);
      engine.generateModel = false;
    }
  }
  for (; i < length; i++) {
    dataRootConfig = associatedDataRoots[i];
    if (dataRootConfig.rootPropName) {
      dataRoot = this.findRoot(dataRootConfig.rootPropName, json);
      if (dataRootConfig.decode) {
        try {
          var encodedDataRoot = Ext.decode(dataRoot);
          dataRoot = encodedDataRoot;
        } catch (err) {
        }
      }
      if (dataRoot) {
        this.processDataAssociation(dataRoot, dataRootConfig, components);
      }
    }
  }
  var interactions;
  if (engine.interactionsProp) {
    var interactionsRoot = this.findRoot(engine.interactionsProp, json);
    if (interactionsRoot) {
      interactions = this.processInteractions(interactionsRoot);
    }
  }
  if (engine.generateModel && !model) {
    modelIdentifier = modelIdentifier || Ext.id();
    Ext.define(modelPreface + modelIdentifier, {extend:'Ext.data.Model', fields:fields || []});
    model = Ext.create(modelPreface + modelIdentifier);
  }
  delete this.__currentItems;
  var finalResult = this.processResult(components, model, interactions ? Ext.isArray(interactions) ? interactions : interactions.items || [interactions] : null);
  Ext.apply(this.engine, originalEngine);
  if (Ext.isFunction(callback)) {
    callback(finalResult);
  } else {
    return finalResult;
  }
}, processDataForForm:function(form, json) {
  var engine = this.engine;
  if (engine.flat) {
    var associatedDataRoots = engine.associatedDataRoots, dataRootConfig, dataRoot, length = associatedDataRoots.length, i = 0;
    for (; i < length; i++) {
      dataRootConfig = associatedDataRoots[i];
      if (dataRootConfig.rootPropName) {
        dataRoot = this.findRoot(dataRootConfig.rootPropName, json);
        if (dataRootConfig.decode) {
          try {
            var encodedDataRoot = Ext.decode(dataRoot);
            dataRoot = encodedDataRoot;
          } catch (err) {
          }
        }
        if (dataRoot) {
          this.processDataAssociationForForm(dataRoot, dataRootConfig, form);
        }
      }
    }
  } else {
  }
}, process:function(root, allItems, allFields, childProp) {
  var item;
  var engine = this.engine;
  allFields = allFields || [];
  if (Ext.isArray(root)) {
    if (Ext.isFunction(this.engine.sort)) {
      root = Ext.Array.sort(root, this.engine.sort);
    }
    var items = [];
    var length = root.length;
    for (var i = 0; i < length; i++) {
      item = this.process(root[i], items, allFields, childProp) || null;
      if (Ext.isObject(item) && item.items) {
        items = items.concat(item.items);
      } else {
        if (Ext.isArray(item)) {
          items = items.concat(item);
        }
      }
    }
    return {items:items, fields:allFields};
  } else {
    if (Ext.isObject(root)) {
      allItems = allItems || [];
      allFields = allFields || [];
      item = this.associateData(root, engine.assoc, childProp);
      if (!engine.flat) {
        var childrenProps = engine.childrenProps || [];
        var children;
        var length = childrenProps.length;
        var foundItems = [];
        for (var i = 0; i < length; i++) {
          children = root[childrenProps[i]];
          if (Ext.isArray(children) && children.length) {
            var result = this.process(children, null, allFields, childrenProps[i]);
            if (Ext.isObject(result) && result.items) {
              foundItems = foundItems.concat(result.items);
            } else {
              if (Ext.isArray(result)) {
                foundItems = foundItems.concat(result);
              }
            }
          } else {
            if (Ext.isObject(children)) {
              for (var childName in children) {
                var result = this.process(children[childName], null, allFields, childrenProps[i]);
                if (Ext.isObject(result) && result.items) {
                  foundItems = foundItems.concat(result.items);
                } else {
                  if (Ext.isArray(result)) {
                    foundItems = foundItems.concat(result);
                  }
                }
              }
            }
          }
        }
        if (foundItems.length > 0) {
          item.items = foundItems;
        }
      }
    }
  }
  var result = [], options = this.processItem(item, item[engine.originalDataPropName]);
  if (options === false) {
    item = null;
    result = [];
  } else {
    if (Ext.isObject(options)) {
      var before = options.before || [], after = options.after || [];
      result = result.concat(before);
      if (!Ext.isEmpty(item.xtype)) {
        result = result.concat([item]);
      }
      result = result.concat(after);
    } else {
      result = [item];
    }
  }
  if (engine.generateModel) {
    var fieldItem, length = result.length, field, name;
    for (var i = 0; i < length; i++) {
      fieldItem = result[i];
      field = this.processItemField(fieldItem, fieldItem[engine.originalDataPropName]);
      name = fieldItem[engine.originalDataPropName] ? fieldItem[engine.originalDataPropName][engine.modelFieldPropName] : null;
      if (field !== false && !Ext.isEmpty(name)) {
        allFields.push(Ext.isObject(field) ? field : {name:name});
      }
    }
  }
  if (item && engine.flat) {
    this.__currentItems = this.__currentItems || {};
    this.__currentItems[item[engine.matchChildWithName]] = item;
    if (!Ext.isEmpty(root[engine.parentPropName])) {
      this.addToParent(result, root[engine.parentPropName]);
      return;
    } else {
      if (!Ext.isEmpty(root[engine.ownerPropName])) {
        this.addToParent(result, root[engine.ownerPropName]);
        return;
      }
    }
  }
  if (Ext.isObject(result)) {
    return result;
  } else {
    return {items:result, fields:allFields};
  }
}, processInteractions:function(root, childProp) {
  var interaction;
  var engine = this.engine;
  if (Ext.isArray(root)) {
    if (Ext.isFunction(this.engine.interactionsSort)) {
      root = Ext.Array.sort(root, this.engine.interactionsSort);
    }
    var interactions = [];
    var length = root.length;
    for (var i = 0; i < length; i++) {
      interaction = this.processInteractions(root[i], childProp) || null;
      if (Ext.isObject(interaction) && interaction.items) {
        interactions = interactions.concat(interaction.items);
      } else {
        if (Ext.isArray(interaction)) {
          interactions = interactions.concat(interaction);
        }
      }
    }
    return {items:interactions};
  } else {
    if (Ext.isObject(root)) {
      interaction = this.associateData(root, engine.interactionAssoc, childProp);
      interaction.appId = interaction.appId || engine.appId;
      var childrenProps = engine.interactionChildrenProps || [];
      var children;
      var length = childrenProps.length;
      var foundItems = [];
      for (var i = 0; i < length; i++) {
        children = root[childrenProps[i]];
        if (Ext.isArray(children) && children.length) {
          var result = this.processInteractions(children, childrenProps[i]);
          if (Ext.isObject(result) && result.items) {
            foundItems = foundItems.concat(result.items);
          } else {
            if (Ext.isArray(result)) {
              foundItems = foundItems.concat(result);
            }
          }
        } else {
          if (Ext.isObject(children)) {
            for (var childName in children) {
              var result = this.processInteractions(children[childName], childrenProps[i]);
              if (Ext.isObject(result) && result.items) {
                foundItems = foundItems.concat(result.items);
              } else {
                if (Ext.isArray(result)) {
                  foundItems = foundItems.concat(result);
                }
              }
            }
          }
        }
      }
      if (foundItems.length > 0) {
        interaction.items = foundItems;
      }
    }
  }
  this.processInteraction(interaction, interaction[engine.originalDataPropName]);
  return {items:[interaction]};
}, associateData:function(root, assocOrig, childProp) {
  var me = this, item = {}, engine = me.engine, assoc = {}, defaults = engine.defaults, advancedAssoc = engine.advancedAssoc, xtypes = engine.xtypes, xtypeString = 'xtype';
  Ext.apply(assoc, assocOrig);
  if (engine.originalDataPropName) {
    item[engine.originalDataPropName] = root;
  }
  function processXtype(foundTypeProp) {
    var type = me.getPropValue(root, foundTypeProp);
    if (xtypes[foundTypeProp] && xtypes[foundTypeProp][type]) {
      item[xtypeString] = xtypes[foundTypeProp][type];
    } else {
      if (xtypes[type]) {
        item[xtypeString] = xtypes[type];
      }
    }
    if (advancedAssoc[foundTypeProp] && advancedAssoc[foundTypeProp][type]) {
      Ext.apply(assoc, advancedAssoc[foundTypeProp][type]);
    } else {
      if (advancedAssoc[type]) {
        Ext.apply(assoc, advancedAssoc[type]);
      }
    }
    if (foundTypeProp && defaults[foundTypeProp] && defaults[foundTypeProp][type]) {
      Ext.applyIf(item, Ext.clone(defaults[foundTypeProp][type]));
    } else {
      if (type && defaults[type]) {
        Ext.applyIf(item, Ext.clone(defaults[type]));
      }
    }
    return foundTypeProp;
  }
  if (xtypeString in assoc) {
    var xtype = assoc[xtypeString];
    if (Ext.isArray(xtype)) {
      var length = xtype.length, attemptXtype;
      for (var i = 0; i < length; i++) {
        attemptXtype = me.getPropValue(root, xtype[i]);
        if (!Ext.isEmpty(attemptXtype)) {
          processXtype(xtype[i]);
          break;
        }
      }
    } else {
      if (Ext.isString(xtype)) {
        processXtype(xtype);
      }
    }
  }
  var val, assocProp;
  for (var prop in assoc) {
    if (prop === xtypeString) {
      continue;
    } else {
      assocProp = assoc[prop];
      if (assocProp.indexOf('+') !== -1) {
        var props = assocProp.split('+');
        var length = props.length;
        val = '';
        for (var i = 0; i < length; i++) {
          val += me.getPropValue(root, props[i]) || '';
        }
      } else {
        val = me.getPropValue(root, assocProp);
      }
      if (val !== undefined) {
        item[prop] = val;
      }
    }
  }
  if (engine.defaults['childrenProps'] && engine.defaults['childrenProps'][childProp]) {
    Ext.applyIf(item, Ext.clone(engine.defaults['childrenProps'][childProp]));
  }
  return item;
}, getPropValue:function(root, prop) {
  var split = prop.split('.'), length = split.length;
  if (split.length > 1) {
    var value = root;
    for (var i = 0; i < length; i++) {
      value = this.doGet(value, split[i]);
      if (value == undefined) {
        break;
      }
    }
    return value;
  } else {
    return this.doGet(root, prop);
  }
}, doGet:function(root, prop) {
  var value = root[prop];
  if (Ext.String.startsWith(prop, '!')) {
    prop = prop.substring(1, prop.length);
    if (Ext.String.startsWith(prop, '^')) {
      prop = prop.substring(1, prop.length);
      value = root[prop] != undefined ? (root[prop] + '' || '').toLowerCase() : undefined;
    } else {
      value = root[prop] != undefined ? !root[prop] : undefined;
    }
  } else {
    if (Ext.String.startsWith(prop, '^')) {
      prop = prop.substring(1, prop.length);
      value = root[prop] != undefined ? (root[prop] + '' || '').toUpperCase() : undefined;
    }
  }
  return value;
}, processDataAssociation:function(root, rootConfig, componentItems) {
  if (Ext.isArray(root)) {
    var length = root.length;
    for (var i = 0; i < length; i++) {
      this.processDataAssociation(root[i], rootConfig, componentItems) || null;
    }
  } else {
    if (Ext.isObject(root)) {
      var newObj = this.associateData(root, rootConfig.assoc, this.engine);
      var component = this.findItem(componentItems, rootConfig.componentMatchProp, root[rootConfig.matchProp]);
      this.processAssociatedItem(component, root, newObj, rootConfig.rootPropName);
    }
  }
}, processDataAssociationForForm:function(root, rootConfig, form) {
  if (Ext.isArray(root)) {
    var length = root.length;
    for (var i = 0; i < length; i++) {
      this.processDataAssociationForForm(root[i], rootConfig, form) || null;
    }
  } else {
    if (Ext.isObject(root)) {
      var newObj = this.associateData(root, rootConfig.assoc, this.engine);
      var component = form;
      if (Ext.isString(root[rootConfig.matchProp])) {
        component = this.findItemOnForm(form, rootConfig.componentMatchProp, root[rootConfig.matchProp]);
      }
      this.processAssociatedItemData(component, root, newObj, rootConfig.rootPropName);
    }
  }
}, addToParent:function(items, parentValue) {
  var me = this, currentItems = me.__currentItems || {}, parent = currentItems[parentValue];
  if (parent) {
    parent.items = parent.items || [];
    parent.items = parent.items.concat(items);
  }
}, convertObjectsToArray:function(root, engine) {
  var data;
  for (var prop in root) {
    if (Ext.isObject(root[prop])) {
      var length = engine.objectToArrayNames.length;
      data = null;
      for (var i = 0; i < length; i++) {
        if (engine.objectToArrayNames[i].prop === prop) {
          data = engine.objectToArrayNames[i];
          break;
        }
      }
      if (data) {
        if (Ext.isArray(root[data.newProp])) {
          root[data.newProp] = root[data.newProp].concat(this.objectToArray(root[prop], engine));
        } else {
          root[data.newProp] = this.objectToArray(root[prop], engine);
        }
        if (data.newProp !== prop) {
          delete root[prop];
        }
      }
    } else {
      if (Ext.isArray(root[prop])) {
        var length = root[prop].length;
        for (var i = 0; i < length; i++) {
          this.convertObjectsToArray(root[prop][i]);
        }
      }
    }
  }
  return root;
}, objectToArray:function(object, engine) {
  var newArray = [];
  for (var prop in object) {
    this.convertObjectsToArray(object[prop], engine);
    object[prop][engine.objectToPropName] = prop;
    newArray.push(object[prop]);
  }
  return newArray;
}, findRoot:function(name, newObj) {
  for (var prop in newObj) {
    if (prop === name) {
      return newObj[prop];
    } else {
      if (Ext.isObject(newObj[prop])) {
        var found = this.findRoot(name, newObj[prop]);
        if (found) {
          return found;
        }
      }
    }
  }
}, findItem:function(items, itemProp, value) {
  var i = 0, len = items.length;
  for (; i < len; i++) {
    if (items[i][this.engine.originalDataPropName] && items[i][this.engine.originalDataPropName][itemProp] === value) {
      return items[i];
    } else {
      if (Ext.isArray(items[i].items)) {
        var item = this.findItem(items[i].items, itemProp, value);
        if (item) {
          return item;
        }
      }
    }
  }
}, findItemOnForm:function(form, itemProp, value) {
  var mappedProp = this.findAssociatedPropMap(itemProp);
  if (mappedProp) {
    if (mappedProp === 'reference') {
      var reference = this.preProcessReference(value);
      if (reference) {
        return form.lookup(reference);
      }
    } else {
      return form.down('[' + mappedProp + '\x3d' + value + ']');
    }
  } else {
    return form.down('[' + itemProp + '\x3d' + value + ']');
  }
}, findAssociatedPropMap:function(itemProp) {
  if (Ext.isString(itemProp)) {
    var engine = this.engine;
    var assoc = engine.assoc;
    if (assoc) {
      for (var prop in assoc) {
        if (assoc[prop] === itemProp) {
          return prop;
        }
      }
    }
  }
}});
