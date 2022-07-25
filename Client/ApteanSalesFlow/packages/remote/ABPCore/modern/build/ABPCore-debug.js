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
Ext.define('ABP.Component', {override:'Ext.Component', constructor:function() {
  var me = this;
  var eventsToAutomate = ['onClick', 'onChange'];
  this.callParent(arguments);
  if (Ext.isFunction(this.toggleCls) && eventsToAutomate.some(function(element) {
    return this[element] || Boolean(this.handler);
  }.bind(me)) || Boolean(this.automationCls)) {
    this.toggleCls(ABP.util.Common.getAutomationClass(this), true);
  }
}, setAriaLabel:function(label) {
  var me = this;
  if (me.rendered) {
    var dom = me.el.dom;
    if (label) {
      dom.setAttribute('aria-label', label);
    } else {
      dom.removeAttribute('aria-label');
    }
    if (me.hideLabel && me.inputEl) {
      me.inputEl.dom.setAttribute('aria-label', label);
    }
  }
}});
Ext.define('ABP.Widget', {override:'Ext.Widget', constructor:function() {
  var me = this;
  var eventsToAutomate = ['onClick', 'onChange'];
  this.callParent(arguments);
  if (Ext.isFunction(this.toggleCls) && eventsToAutomate.some(function(element) {
    return this[element];
  }.bind(me)) || Boolean(this.automationCls)) {
    this.toggleCls(ABP.util.Common.getAutomationClass(this), true);
  }
}});
Ext.define('ABP.Container', {override:'Ext.Container'});
Ext.define('ABP.view.overrides.TabPanelOverride', {override:'Ext.Container', getComponent:function(component) {
  if (this.destroyed) {
    return null;
  }
  if (typeof component === 'number') {
    return this.getItems().getAt(component);
  }
  if (Ext.isObject(component)) {
    component = component.getItemId();
  }
  return this.getItems().get(component);
}});
Ext.define('ABP.view.overrides.DefaultLayoutOverride', {override:'Ext.layout.Auto', removeBodyItem:function(item) {
  item.setZIndex(null);
  if (item.element) {
    item.element.detach();
  }
}, onItemFloatingChange:function(item, floating) {
  if (floating && item.element) {
    this.insertBodyItem(item);
  } else {
    this.removeBodyItem(item);
  }
}});
Ext.define('Overrides.field.Field', {override:'Ext.field.Field'});
Ext.define('Overrides.LoadMask', {override:'Ext.LoadMask', type:3, extraMask:null, config:{extraMask:null}, updateExtraMask:function(extraMask) {
  if (this.extraMaskEl) {
    this.extraMaskEl.setHtml(extraMask);
  }
}, getTemplate:function() {
  var prefix = Ext.baseCSSPrefix;
  return [{reference:'innerElement', cls:prefix + 'mask-inner', children:[{reference:'extraMaskEl', cls:prefix + 'mask-extra'}, {reference:'messageElement'}]}];
}, constructor:function(config) {
  config = config || {};
  config.type = config.type || this.type;
  config.cls = config.cls || '';
  config.cls += ' x-mask abp-loadmask';
  config.message = Ext.String.htmlEncode(config.message) || '';
  switch(config.type) {
    case 1:
      config.cls += ' abp-spinner';
      config.extraMask = '\x3cdiv class\x3d"abp-spinner-el"\x3e\x3c/div\x3e';
      break;
    case 2:
      config.cls += ' loading-circles';
      config.extraMask = '\x3cdiv class\x3d"circle"\x3e\x3cdiv class\x3d"bounce1"\x3e\x3c/div\x3e\x3cdiv class\x3d"bounce2"\x3e\x3c/div\x3e\x3cdiv class\x3d"bounce3"\x3e\x3c/div\x3e\x3c/div\x3e';
      break;
    case 3:
      config.cls += ' loading-bars';
      config.extraMask = '\x3cdiv class\x3d"bars"\x3e \x3cdiv class\x3d"rect1"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect2"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect3"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect4"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect5"\x3e\x3c/div\x3e \x3c/div\x3e';
      break;
    default:
      break;
  }
  this.callParent([config]);
}});
Ext.define('ABP.view.overrides.ToastOverride', {override:'Ext.Toast', showToast:function(config) {
  var me = this, message = config.message, timeout = config.timeout, cls = config.cls, alignment = config.alignment, messageContainer = me.getMessage(), msgAnimation = me.getMessageAnimation();
  if (config.onclick) {
    me.el.dom.onclick = config.onclick;
    me.handler = config.handler;
    me.handlerArgs = config.handlerArgs ? config.handlerArgs : null;
  } else {
    me.el.dom.onclick = null;
    me.handler = me.handlerArgs = null;
  }
  if (me.isRendered() && me.isHidden() === false) {
    messageContainer.onAfter({hiddenchange:function() {
      me.removeCls('abp-toast-GRN');
      me.removeCls('abp-toast-BLU');
      me.removeCls('abp-toast-ORG');
      me.removeCls('abp-toast-RED');
      me.addCls(cls);
      me.setMessage(message);
      me.setTimeout(timeout);
      messageContainer.onAfter({scope:me, hiddenchange:function() {
        me.startTimer();
      }, single:true});
      messageContainer.show(msgAnimation);
      me.show({animation:null, alignment:{component:document.body, alignment:alignment, options:{offset:[0, 20]}}});
    }, scope:me, single:true});
    messageContainer.hide(msgAnimation);
  } else {
    Ext.util.InputBlocker.blockInputs();
    if (!me.getParent() && Ext.Viewport) {
      Ext.Viewport.add(me);
    }
    me.setMessage(message);
    me.setTimeout(timeout);
    me.setCls('abp-toast');
    me.removeCls('abp-toast-GRN');
    me.removeCls('abp-toast-BLU');
    me.removeCls('abp-toast-ORG');
    me.removeCls('abp-toast-RED');
    me.addCls(cls);
    me.startTimer();
    me.show({animation:null, alignment:{component:document.body, alignment:alignment, options:{offset:[0, 20]}}});
  }
}});
Ext.define('ABP.tip.ToolTip', {override:'Ext.tip.ToolTip', privates:{onTargetOut:function(e) {
  if (this.currentTarget.dom && !this.currentTarget.contains(e.relatedTarget)) {
    if (!this.getAllowOver() || this.getAllowOver() && !e.within(this.el, true)) {
      this.handleTargetOut();
    }
  }
}}});
Ext.define('ABP.field.Checkbox', {override:'Ext.field.Checkbox', getBoxTemplate:function() {
  return [{reference:'iconElement', cls:Ext.baseCSSPrefix + 'font-icon ' + Ext.baseCSSPrefix + 'icon-el ' + ABP.util.Common.getAutomationClass(this), children:[this.getInputTemplate()]}];
}, getSameGroupFields:function() {
  return this.callParent(arguments) || [];
}});
Ext.define('ABP.view.overrides.PickerOverride', {override:'Ext.picker.Picker', bind:{doneButton:'{i18n.selectfield_mobile_done:htmlEncode}', cancelButton:'{i18n.error_cancel_btn:htmlEncode}'}});
Ext.define('ABP.view.overrides.slider.Toggle', {override:'Ext.slider.Toggle', setValue:function(newValue, oldValue) {
  this.callParent([newValue, oldValue]);
  if (this.thumbs && this.thumbs.length > 0) {
    this.onChange(this.thumbs[0], newValue, oldValue);
  }
}});
Ext.define('ABP.grid.cell.Base', {override:'Ext.grid.cell.Base', constructor:function(config) {
  config = config || {};
  config.name = config.name || (config.column ? config.column.getDataIndex ? config.column.getDataIndex() : config.column.dataIndex : '');
  this.callParent([config]);
  this.setCellCls(this.getCellCls() + ' ' + ABP.util.Common.getAutomationClass(this));
}});
Ext.define('ABP.model.ABPLoggingModel', {extend:'Ext.data.Model', fields:['level', 'time', 'message', 'detail']});
Ext.define('ABP.store.ABPLoggingStore', {extend:'Ext.data.Store', requires:['ABP.model.ABPLoggingModel'], model:'ABP.model.ABPLoggingModel', storeId:'ABPLoggingStore', proxy:{type:'memory', reader:{type:'json'}}});
Ext.define('ABP.util.Logger', {singleton:true, alternateClassName:'ABPLogger', requires:['ABP.store.ABPLoggingStore'], initialized:false, _store:undefined, _enabled:false, MAX_RECORDS:500, constructor:function() {
  this._store = Ext.create('ABP.store.ABPLoggingStore');
}, getCurrentTime:function() {
  var date = new Date;
  return date.toISOString();
}, store:function(log) {
  if (this._enabled) {
    if (!this._initialized) {
      this.initialize();
    }
    this._store.add(log);
    if (this._store.getCount() > this.MAX_RECORDS) {
      this._store.removeAt(0);
    }
  }
}, initialize:function() {
  this._initialized = true;
  this.logInfo('Logger', navigator.userAgent);
}, enable:function() {
  this._enabled = true;
}, disable:function() {
  this._enabled = false;
}, log:function(message, detail, level, logStack) {
  this.store({level:level, time:this.getCurrentTime(), message:message, detail:detail});
  var consoleMessage = Ext.isEmpty(detail) ? message : message + '\n' + detail;
  if (level === 'FATAL' || level === 'ERROR') {
    level = 'error';
  } else {
    if (level === 'WARNING' || level === 'ARIA') {
      level = 'warn';
    } else {
      if (level === 'INFO') {
        level = 'info';
      } else {
        if (level === 'DEBUG' || level === 'TRACE') {
          level = 'log';
        }
      }
    }
  }
  Ext.log({msg:consoleMessage, level:level, stack:!!logStack});
}, logFatal:function(message, detail) {
  this.log(message, detail, 'FATAL');
}, logError:function(message, detail) {
  this.log(message, detail, 'ERROR');
}, logWarn:function(message, detail) {
  this.log(message, detail, 'WARNING');
}, logInfo:function(message, detail) {
  this.log(message, detail, 'INFO');
}, logDebug:function(message, detail) {
  this.log(message, detail, 'DEBUG');
}, logTrace:function(message, detail) {
  this.log(message, detail, 'TRACE');
}, logException:function(ex, level, show) {
  var text = '';
  var details = '';
  if (Ext.isObject(ex) || ex.stack) {
    text = ex.message || ex.description;
    details = ex.stack !== null ? ex.stack : 'No stack trace available.';
  } else {
    text = ex;
  }
  show = show === false ? show : true;
  this.log(text, details, level, true);
  if (Ext.AbstractComponent.layoutSuspendCount !== 0) {
    Ext.resumeLayouts();
  }
  return false;
}, logAria:function(msg, level, target) {
  this.log('ARIA' + level + ': ' + msg, target, 'ARIA');
}, handleException:function(msg, url, line, column, error) {
  var errorLocation;
  try {
    error = error || {};
    errorLocation = (error.fileName || url) + ':' + (error.lineNumber || line) + ':' + (error.columnNumber || column);
    error.message = (error.message || msg) + '\n  at ' + errorLocation;
    if (!error.stack && (error.fileName || url)) {
      error.stack = 'Error: ' + error.message + '\n  at ' + errorLocation;
    }
    Ext.bind(ABP.view.util.Logger.logException, ABP.view.util.Logger, [error, 'ERROR', false]).call();
  } catch (ignore) {
  }
  return true;
}, handleError:function(err) {
  if (err) {
    try {
      var errMsg = Ext.JSON.encode(err);
      Ext.bind(ABP.view.util.Logger.logException, ABP.view.util.Logger, ['Error raised.', errMsg, 'ERROR']).call();
    } catch (ignore) {
    }
  }
  return false;
}, getLogs:function(delimeter) {
  if (!delimeter) {
    delimeter = ',';
  }
  var data = '';
  var i;
  var record, detail;
  for (i = 0; i < this._store.getCount(); i++) {
    record = this._store.getAt(i);
    data = data + record.get('time') + delimeter + record.get('level') + delimeter + record.get('message');
    detail = record.get('detail');
    if (detail) {
      data = data + delimeter + detail;
    }
    data = data + '\r\n';
  }
  return data;
}, clearLogs:function() {
  this._store.removeAll();
}}, function(ABPLogger) {
  ABPLogger.aria = function() {
    ABPLogger.logAria.apply(ABPLogger, arguments);
  };
});
Ext.define('ABP.util.String', {singleton:true, requires:['ABP.util.Logger'], config:{seperator:','}, constructor:function(config) {
  this.initConfig(config);
}, toArray:function(str) {
  var words;
  if (str) {
    words = str.split(this.config.seperator);
  }
  return words || [];
}, makeHumanReadable:function(string, seperator, joiner) {
  var words = string.split(seperator || ' ');
  words = words.map(function capitalize(word) {
    return word.slice(0, 1).toUpperCase() + word.slice(1);
  });
  return words.join(joiner || ' ');
}, capitalize:function(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}, limitLength:function(string, length) {
  if (!length) {
    return string;
  }
  var newString = string;
  if (string.length > length) {
    newString = string.slice(0, length);
    if (newString[newString.length - 1] === ' ') {
      newString = newString.slice(0, -1);
    }
    newString += '...';
  }
  return newString;
}, parseInt:function(string, radix) {
  radix = radix ? radix : 10;
  var num = parseInt(string, radix);
  if (Ext.isNumber(num)) {
    return num;
  } else {
    return false;
  }
}, isVowel:function(letter) {
  var vowels = ['a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U'];
  return vowels.indexOf(letter) > -1;
}});
Ext.define('ABP.grid.Row', {override:'Ext.grid.Row', requires:['ABP.util.String'], privates:{beginRefresh:function(context) {
  var me = this;
  context = me.callParent(arguments);
  if (context) {
    var row = context.row;
    if (row) {
      var grid = me.getParent();
      var gridAutomationCls = grid.automationCls || (grid.automationCls = ABP.util.Common.getAutomationClass(grid));
      row.toggleCls(gridAutomationCls + '-row-' + row.getRecordIndex(), true);
    }
  }
  return context;
}}});
Ext.define('ABP.view.overrides.PackageEntryOverride', {override:'Ext.package.Entry', count:0, loaded:false, constructor:function(name) {
  var me = this;
  me.packageName = name;
  if (ABP.util.Config.getPackageURL() !== null) {
    me.jsUrl = ABP.util.Config.getPackageURL() + '/modern/' + name + '/' + name + '.js';
    me.cssUrl = ABP.util.Config.getPackageURL() + '/modern/' + name + '/' + name + '.css';
  } else {
    me.jsUrl = Ext.getResourcePath(name + '.js', null, name);
    me.cssUrl = Ext.getResourcePath(name + '.css', null, name);
  }
  me.promise = new Ext.Promise(function(resolve, reject) {
    me.resolveFn = resolve;
    me.rejectFn = reject;
  });
}, getRequires:function() {
  var me = this, metadata = me.metadata, reqs = me._requires, requires, req;
  if (!reqs) {
    reqs = [];
    if (metadata && (requires = metadata.requires) && requires.length) {
      for (var i = 0; i < requires.length; i++) {
        req = requires[i];
        if (req != me.packageName) {
          reqs.push(req);
        }
      }
    }
    me._requires = reqs;
  }
  return reqs;
}, beginLoad:function() {
  var me = this;
  if (!me.loaded) {
    me.block();
    me.loadStyle();
    me.loadScript();
    me.unblock();
  }
}, loadStyle:function() {
  var metadata = this.metadata, required = metadata && metadata.required, css = metadata && metadata.css;
  if (css !== false && required !== true) {
    this.load(this.cssUrl);
  }
}, loadScript:function() {
  var metadata = this.metadata, files = metadata && metadata.files, manifest = Ext.manifest, loadOrder = manifest && manifest.loadOrder, paths = [], i;
  if (files && loadOrder) {
    for (i = 0; i < files.length; i++) {
      paths.push(loadOrder[files[i]].path);
    }
    this.load(paths);
  } else {
    if (metadata && !metadata.included) {
      this.load(this.jsUrl);
    }
  }
}, load:function(url) {
  var me = this;
  me.block();
  Ext.Boot.load({url:url, success:function() {
    me.unblock();
  }, failure:function() {
    if (Ext.String.endsWith(url, '.css')) {
      me.unblock();
    } else {
      if (!me.error) {
        me.error = new Error('Failed to load "' + url + '"');
        me.error.url = url;
        me.unblock();
      }
    }
  }});
}, block:function() {
  this.count++;
}, _wait:function(className) {
  var me = this;
  me.block();
  Ext.require(className, function() {
    me.unblock();
  });
}, _getPendingClasses:function() {
  var CM = Ext.ClassManager, classState = CM && CM.classState, pending, className;
  if (CM.getPendingClasses) {
    return CM.getPendingClasses();
  } else {
    if (classState) {
      pending = [];
      for (className in classState) {
        if (className && className !== 'null') {
          if (classState[className] < 30) {
            pending.push(className);
          }
        }
      }
      return pending;
    }
  }
}, unblock:function() {
  var me = this;
  if (!me.error && me.count > 1) {
    me.count--;
  } else {
    me.count = 0;
    var pending = me._getPendingClasses();
    if (pending && pending.length) {
      me._wait(pending);
    } else {
      me.notify();
    }
  }
}, notify:function() {
  var me = this;
  if (me.resolveFn) {
    me.count = 0;
    if (me.error) {
      ABP.util.Logger.logError(me.error);
      me.rejectFn(me.error);
    } else {
      me.loaded = true;
      ABP.util.Logger.logInfo('Loaded package "' + me.packageName + '"');
      console.log('Loaded package "' + me.packageName + '"');
      me.resolveFn(me);
    }
    me.resolveFn = me.rejectFn = null;
  }
}});
Ext.isiOS = Ext.isiOS || /iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
if (Ext.isiOS) {
  Ext.isMac = false;
  Ext.platformTags.desktop = false;
}
Ext.define('ABP.controllers.base.rightPane.RightPanePanelController', {extend:'Ext.app.ViewController', listen:{controller:{'*':{rightPane_toggleTab:'handleToggleTab'}}}, onToggle:function() {
}, createButtonMenu:function(items, layout) {
  layout = this.configureButtonMenuLayout(layout);
  return Ext.create('Ext.menu.Menu', {xtype:'menu', floated:false, floating:false, cls:'settings-container-button-menu', layout:layout, ui:'lightblue', hidden:true, height:0, animCollapse:true, items:items});
}, addMenuButton:function(items, settings) {
  if (!items || Ext.isEmpty(items)) {
    return null;
  }
  Ext.applyIf(settings, {cls:'settings-container-button', automationCls:'toolusermenu-unsafe-' + settings.titleKey || settings.title, handler:'toggleMenuButton'});
  var me = this, view = me.getView(), menu = me.createButtonMenu(items, settings.layout);
  view.add({text:settings.title, ariaLabel:settings.title, bind:settings.titleKey ? {text:'{i18n.' + settings.titleKey + ':htmlEncode}', ariaLabel:'{i18n.' + settings.titleKey + ':ariaEncode}'} : {}, buttonMenu:menu, cls:settings.cls, ui:'menuitem', uiCls:'light', textAlign:'left', automationCls:settings.automationCls, handler:settings.handler, listeners:settings.listeners, keyMap:settings.keyMap || null, iconCls:'icon-navigate-close', iconAlign:'right'});
  view.add(menu);
  return menu;
}, privates:{handleToggleTab:function(activeTab) {
  var me = this, view = me.getView();
  if (activeTab.xtype === view.xtype) {
    me.onToggle();
  }
}, baseRightPanePanel_toggleRightPane:function() {
  this.fireEvent('session_toggleRightPane');
}, configureButtonMenuLayout:function(layout) {
  if (layout === 'table') {
    return {type:'table', columns:6};
  }
  if (layout === 'hbox') {
    return {type:'hbox', pack:'start', align:'center', wrap:true};
  }
  return {type:'vbox', pack:'start', align:'start'};
}, toggleMenuButton:function(button) {
  var me = this;
  var view = me.getView();
  var activeBtn = view.activeMenuButton;
  var btnMenu;
  if (!activeBtn && !button) {
    return;
  }
  if (activeBtn) {
    activeBtn.removeCls('x-btn-menu-active');
    btnMenu = activeBtn.buttonMenu;
    btnMenu.setHeight(0);
    btnMenu.hide();
    view.activeMenuButton = null;
    if (!button || button && button.id === activeBtn.id) {
      return;
    }
  }
  btnMenu = button.buttonMenu;
  if (!btnMenu) {
    return;
  }
  button.addCls('x-btn-menu-active');
  btnMenu.show();
  btnMenu.setHeight('auto');
  view.activeMenuButton = button;
}}});
Ext.define('ABP.data.TreeData', {xtype:'abptreedata', isData:true, data:null, parentDataArray:null, index:null, level:null, parentId:null, constructor:function(config) {
  this.initConfig(config);
  return this;
}, getData:function() {
  return this.data;
}, isLeaf:function() {
  return this.data ? this.data.isLeaf : false;
}, hasChildNodes:function() {
  return this.data ? this.data.children ? true : false : false;
}, set:function(key, value) {
  if (this.data) {
    this.data[key] = value;
  }
}, remove:function() {
  if (this.parentDataArray) {
    Ext.Array.removeAt(this.parentDataArray, this.index);
  }
}});
Ext.define('ABP.events.ABPEvents', {extend:'Ext.mixin.Observable', alternateClassName:'Ext.ABPEvents', requires:['Ext.dom.Element'], observableType:'abp', singleton:true, resizeBuffer:100, constructor:function() {
  var me = this;
  me.callParent();
}, fireEvent:function(name) {
  if (typeof appInsights == 'object') {
    appInsights.trackEvent(name, arguments);
  }
  return this.callParent(arguments);
}}, function(ABPEvents) {
  ABP.on = function() {
    return ABPEvents.addListener.apply(ABPEvents, arguments);
  };
  ABP.un = function() {
    return ABPEvents.removeListener.apply(ABPEvents, arguments);
  };
  ABP.fireEvent = function() {
    return ABPEvents.fireEvent.apply(ABPEvents, arguments);
  };
});
Ext.define('ABP.events.ABPEventDomain', {extend:'Ext.app.EventDomain', requires:['Ext.ABPEvents'], singleton:true, type:'abp', constructor:function() {
  var me = this;
  me.callParent();
  me.monitor(Ext.ABPEvents);
}, listen:function(listeners, controller) {
  this.callParent([{global:listeners}, controller]);
}, match:Ext.returnTrue});
Ext.define('ABP.internal.util.MainMenu', {singleton:true, copyFavorites:function() {
  var me = this, favorites = me.getFavoritesNode();
  if (!favorites) {
    return null;
  }
  var favoritesWork = favorites.copy(undefined, undefined, true);
  return favoritesWork.childNodes;
}, jsonSerializeFavorites:function() {
  var me = this, navStore = Ext.getStore('navSearch'), favorites = me.getFavoritesNode();
  if (!favorites) {
    return null;
  }
  if (navStore.lazyFill) {
    var serializedFavorites = this.serializeNodeWithData(favorites, navStore);
    return Ext.JSON.encode(serializedFavorites.children);
  } else {
    return Ext.JSON.encode(favorites.serialize().children);
  }
}, getFavoritesNode:function() {
  var navStore = Ext.getStore('navSearch');
  if (!navStore) {
    return null;
  }
  return navStore.getNodeById('container_nav-favorites');
}, serializeNodeWithData:function(node, store, writerParam) {
  var writer = writerParam || new Ext.data.writer.Json({writeAllFields:true});
  var result = writer.getRecordData(node);
  var children = [];
  var childNodes = node.childNodes;
  var len = Ext.isArray(childNodes) ? childNodes.length : 0;
  for (var i = 0; i < len; i++) {
    children.push(this.serializeNodeWithData(childNodes[i], store, writer));
  }
  var childData = node.data.children;
  var len = Ext.isArray(childData) ? childData.length : 0;
  for (var i = 0; i < len; i++) {
    var unique = Ext.Array.every(children, function(childNode) {
      return !(childNode.id === childData[i].id);
    });
    if (unique) {
      var newRec = store.getModel().loadData(childData[i]);
      children.push(this.serializeNodeWithData(newRec, store, writer));
    }
  }
  if (!Ext.isEmpty(children)) {
    result.children = children;
  }
  return result;
}});
Ext.define('ABP.model.ApplicationServicesModel', {extend:'Ext.data.Model', fields:[{name:'services', type:'auto'}]});
Ext.define('ABP.model.EnvironmentModel', {extend:'Ext.data.Model', fields:['name', 'id', 'languages']});
Ext.define('ABP.model.HelpLinkModel', {extend:'Ext.data.Model', fields:['product', 'type', 'link']});
Ext.define('ABP.model.HelpLinkTypeModel', {extend:'Ext.data.Model', fields:['type', 'text']});
Ext.define('ABP.model.PreBootstrapConfigModel', {extend:'Ext.data.Model', fields:[{name:'serverUrl', type:'string'}, {name:'overrideExistingServerUrl', type:'boolean'}, {name:'usesRedirectForToken', type:'boolean'}]});
Ext.define('ABP.model.RecentModel', {extend:'Ext.data.Model', fields:[{name:'appId', type:'string'}, {name:'searchId', type:'string'}, {name:'timestamp', type:'int'}, {name:'count', type:'int'}, {name:'text', type:'string'}, {name:'hierarchy', type:'string'}, {name:'instanceId', type:'string'}]});
Ext.define('ABP.model.SearchModel', {extend:'Ext.data.Model', fields:[{name:'appId', type:'string'}, {name:'event', type:'string'}, {name:'id', type:'string'}, {name:'icon', type:'string'}, {name:'minLength', type:'int'}, {name:'minLengthError', type:'string'}, {name:'name', type:'string'}, {name:'recents', type:'int', defaultValue:5}, {name:'suggestionThreshold', type:'int', defaultValue:3}, {name:'suggestionEvent', type:'string'}]});
Ext.define('ABP.model.SearchTreeResultsModel', {extend:'Ext.data.Model', fields:['appId', 'event', 'eventArgs', 'text', 'activateApp', 'hierarchy', 'shorthand', 'href']});
Ext.define('ABP.model.ServerUrlModel', {extend:'Ext.data.Model', fields:['url']});
Ext.define('ABP.model.SettingsLanguageModel', {extend:'Ext.data.Model', fields:['Key', 'Value']});
Ext.define('ABP.model.Suggestion', {extend:'Ext.data.Model', fields:[{name:'timestamp', type:'int'}, {name:'count', type:'int'}, {name:'text', type:'string'}, {name:'hierarchy', type:'string'}, {name:'instanceId', type:'string'}, {name:'isRecent', type:'boolean'}]});
Ext.define('ABP.model.WCAGRegion', {extend:'Ext.data.Model', alias:'model.wcagregion', fields:[{name:'domId', type:'string'}, {name:'text', type:'string'}, {name:'textKey', type:'string'}, {name:'event', type:'string'}, {name:'context', type:'string'}]});
Ext.define('ABPCore.plugins.LoadingLine', {extend:'Ext.plugin.Abstract', alias:'plugin.loadingline', isBusy:false, init:function(cmp) {
  var me = this;
  me.setCmp(cmp);
  me.isBusy = me.cmp.isBusy;
  me.cmp.on('afterrender', me.onAfterRender, me);
  me.cmp.on('painted', me.onAfterRender, me);
  me.cmp.on('isBusy', me.onUpdateIsBusy, me);
  me.cmp.on('toggleIsBusy', me.onToggleIsBusy, me);
  me.cmp.setBusy = me.cmpSetBusy;
  me.cmp.hasLoadingLine = true;
}, destroy:function() {
  if (this.cmp) {
    delete this.cmp.setBusy;
    delete this.cmp.hasLoadingLine;
    this.cmp.un('afterrender', this.onAfterRender, this);
    this.cmp.un('painted', this.onAfterRender, this);
    this.cmp.un('isBusy', this.onUpdateIsBusy, this);
    this.cmp.un('toggleIsBusy', this.onUpdateIsBusy, this);
  }
}, setBusy:function(isBusy) {
  var me = this;
  if (me.isBusy != isBusy) {
    me.updateIsBusy(isBusy);
  }
}, privates:{cmpSetBusy:function(isBusy) {
  this.fireEvent('isBusy', isBusy);
}, onToggleIsBusy:function() {
  this.setBusy(!this.isBusy);
}, onUpdateIsBusy:function(isBusy) {
  this.setBusy(isBusy);
}, onAfterRender:function() {
  var me = this;
  var cmp = me.getCmp();
  cmp.add(me.loadingLine = Ext.widget({xtype:'abploadingline', itemId:'loadingLine', reference:'loadingLine', floating:true, height:2, padding:0, hidden:!me.isBusy, width:cmp.getWidth()}));
  return;
}, updateIsBusy:function(isBusy) {
  var me = this, cmp = me.getCmp(), line = me.loadingLine;
  if (cmp.header) {
    cmp = cmp.getHeader();
  }
  if (isBusy) {
    line.setWidth(cmp.getWidth());
    line.showBy(cmp, 'bl-bl', [0, 0]);
  } else {
    line.setHidden(true);
  }
  me.isBusy = isBusy;
}}});
Ext.define('ABP.store.ABPEnvironmentStore', {extend:'Ext.data.Store', requires:['ABP.model.EnvironmentModel'], model:'ABP.model.EnvironmentModel', storeId:'ABPEnvironmentStore'});
Ext.define('ABP.store.ABPPreBootstrapConfigStore', {extend:'Ext.data.Store', requires:['ABP.model.PreBootstrapConfigModel', 'Ext.data.proxy.Rest'], model:'ABP.model.PreBootstrapConfigModel', storeId:'ABPPreBootstrapConfigStore', proxy:{type:'rest', url:Ext.getResourcePath('abp-prebootstrap-config.json', 'shared'), reader:{type:'json'}}, autoload:false});
Ext.define('ABP.store.ABPRecentSearchStore', {extend:'Ext.data.Store', requires:['ABP.model.RecentModel'], model:'ABP.model.RecentModel', storeId:'ABPRecentSearchStore', autoLoad:false, proxy:{type:'localstorage', id:'ABP_RecentSearches'}, sorters:[{property:'timestamp', direction:'DESC'}], append:function(searchProvider, searchText, info, instanceId) {
  if (!searchText || searchText.length === 0) {
    return;
  }
  var maxRecents = searchProvider.get('recents');
  if (maxRecents === 0) {
    return;
  }
  var me = this;
  var model = me.lookup(searchProvider.data.appId, searchProvider.data.id, searchText);
  if (model) {
    model.beginEdit();
    model.set('timestamp', Date.now());
    model.set('count', model.data.count + 1);
    model.endEdit();
  } else {
    model = Ext.create('ABP.model.RecentModel');
    model.set('appId', searchProvider.data.appId);
    model.set('searchId', searchProvider.data.id);
    model.set('timestamp', Date.now());
    model.set('count', 1);
    model.set('text', searchText);
    model.set('hierarchy', info);
    model.set('instanceId', instanceId);
    me.add(model);
  }
  me.truncate(searchProvider);
  me.sync();
}, privates:{lookup:function(appId, searchId, text) {
  var record = null;
  text = text.toLowerCase();
  this.each(function(item) {
    if (item.data.appId === appId && item.data.searchId === searchId && item.data.text.toLowerCase() === text) {
      record = item;
      return false;
    }
  });
  return record;
}, truncate:function(search) {
  search.data.appId, search.data.id;
  var me = this;
  var maxCount = search.get('recents') * 10;
  var toRemove = [];
  var count = 0;
  me.each(function(item) {
    if (item.data.appId === search.data.appId && item.data.searchId === search.data.id) {
      count++;
    }
    if (count > maxCount) {
      toRemove.push(item);
    }
  });
  me.remove(toRemove);
}}});
Ext.define('ABP.store.ABPServerUrlStore', {extend:'Ext.data.Store', requires:['ABP.model.ServerUrlModel', 'Ext.data.proxy.LocalStorage'], storeId:'ABPServerUrlStore', model:'ABP.model.ServerUrlModel', autoLoad:true, autoSync:true, proxy:{type:'localstorage', id:'ABP_SavedServerUrls'}});
Ext.define('ABP.store.ApplicationAuthenticationStore', {extend:'Ext.data.Store', requires:['Ext.data.proxy.Rest'], storeId:'ApplicationAuthenticationStore', proxy:{type:'rest', url:Ext.getResourcePath('application.settings.json?_dc\x3d' + Date.now(), 'shared'), reader:{type:'json', rootProperty:'authentication'}}});
Ext.define('ABP.store.ABPApplicationServicesStore', {extend:'Ext.data.Store', requires:['ABP.model.ApplicationServicesModel', 'Ext.data.proxy.Rest'], model:'ABP.model.ApplicationServicesModel', storeId:'ABPApplicationServicesStore', proxy:{type:'rest', url:Ext.getResourcePath('application.settings.json', 'shared'), reader:{type:'json', rootProperty:'services'}}, autoload:false});
Ext.define('ABP.events.ThemeEvents', {extend:'Ext.mixin.Observable', alternateClassName:'Ext.ABPThemeEvents', requires:['Ext.dom.Element'], observableType:'theme', singleton:true, resizeBuffer:100, constructor:function() {
  var me = this;
  me.callParent();
}}, function(ABPThemeEvents) {
  ABPTheme = typeof ABPTheme == 'undefined' ? {} : ABPTheme;
  ABPTheme.on = function() {
    return ABPThemeEvents.addListener.apply(ABPThemeEvents, arguments);
  };
  ABPTheme.un = function() {
    return ABPThemeEvents.removeListener.apply(ABPThemeEvents, arguments);
  };
  ABPTheme.fireEvent = function() {
    return ABPThemeEvents.fireEvent.apply(ABPThemeEvents, arguments);
  };
});
Ext.define('ABP.events.ThemeEventDomain', {extend:'Ext.app.EventDomain', requires:['Ext.ABPThemeEvents'], singleton:true, type:'theme', constructor:function() {
  var me = this;
  me.callParent();
  me.monitor(Ext.ABPThemeEvents);
}, listen:function(listeners, controller) {
  this.callParent([{global:listeners}, controller]);
}, match:Ext.returnTrue});
Ext.define('ABP.ThemeManager', {singleton:true, requires:['ABP.events.ThemeEventDomain'], config:{selectedTheme:Ext.theme.subThemeList[0]}, applySelectedTheme:function(theme) {
  if (theme && theme.themes) {
    return theme.themes;
  }
  return theme;
}, updateSelectedTheme:function(theme, oldTheme) {
  ABPTheme.fireEvent('changed', theme);
}}, function(ThemeManager) {
  ABPTheme = typeof ABPTheme == 'undefined' ? {} : ABPTheme;
  ABPTheme.setTheme = function(theme) {
    return ABP.ThemeManager.setSelectedTheme(theme);
  };
});
Ext.define('ABP.util.RequestQueue', {alternateClassName:'ABPRequestQueue', singleton:true, requestQueue:[], push:function(request) {
  var me = this;
  if (request && request.url) {
    me.requestQueue.push(request);
    ABPLogger.logDebug('Queued request: ' + request.url);
  }
}, start:function() {
  var me = this;
  while (!Ext.isEmpty(me.requestQueue)) {
    var request = me.pop();
    if (request) {
      ABPLogger.logDebug('Retry request from queue: ' + request.url);
      ABP.util.Ajax.request(request);
    }
  }
}, isEmpty:function() {
  return Ext.isEmpty(this.requestQueue);
}, privates:{pop:function() {
  var me = this;
  if (!Ext.isEmpty(me.requestQueue) && me.requestQueue.length > 0) {
    var nextRequest = me.requestQueue[0];
    if (nextRequest.headers && nextRequest.headers.Authorization) {
      delete nextRequest.headers.Authorization;
    }
    Ext.Array.removeAt(me.requestQueue, 0);
    return nextRequest;
  }
}}});
Ext.define('ABP.util.Ajax', {requires:['ABP.util.RequestQueue'], singleton:true, mixins:{observable:'Ext.mixin.Observable'}, config:{timeout:null}, interceptor:null, constructor:function(config) {
  this.mixins.observable.constructor.call(this, config);
}, availableRequests:{configuration:'configuration', login:'login', bootstrap:'bootstrap', refreshToken:'refreshtoken', logout:'logout', saveFavorites:'favorites', offlinePassword:'offlinePassword', actionCenterConfig:'controlcenter'}, request:function(options) {
  var me = this, response = {success:false, responseText:'', status:200};
  options.headers = options.headers || {};
  options.headers = Ext.applyIf(options.headers, me.getRequestHeaders(options));
  if (me.fireEvent('intercept', me, options, response) !== false) {
    if (response.success) {
      if (response.status === 2001) {
        return;
      }
      if (response.status === 200) {
        Ext.callback(options.success, options.scope, [response, options]);
      } else {
        Ext.callback(options.failure, options.scope, [response, options]);
      }
      return;
    }
  } else {
    return;
  }
  if (!options.timeout && me.getTimeout()) {
    options.timeout = me.getTimeout();
  }
  var endpoint = this.getUrlInfo(options.url).abpEndPoint;
  if (endpoint) {
    var interactions = ABP.util.AjaxInteractionManager.getAjaxInteractions(endpoint);
    if (interactions) {
      var communications = interactions.communications;
      var substitute = interactions.substitute;
      var urlQueryStringParameter = interactions.urlQueryStringParameters;
      if (communications && Ext.isArray(communications)) {
        var success = [];
        var failure = [];
        for (var i = 0; i < communications.length; i++) {
          if (communications[i].handlerObj) {
            if (communications[i].handlerObj.success) {
              success.push(communications[i].handlerObj.success);
            }
            if (communications[i].handlerObj.failure) {
              failure.push(communications[i].handlerObj.failure);
            }
          }
        }
        if (!Ext.isEmpty(success)) {
          options.initialSuccess = options.success;
          options.configSuccess = success;
          options.success = function(resp, options) {
            for (var successItter = 0; successItter < options.configSuccess.length; successItter++) {
              if (Ext.isFunction(options.configSuccess[successItter])) {
                options.configSuccess[successItter](resp);
              } else {
                if (Ext.isString(options.configSuccess[successItter])) {
                  var func = ABP.util.Common.getSingletonFunctionFromString(options.configSuccess[successItter]);
                  if (func) {
                    func(resp);
                  }
                }
              }
            }
            options.initialSuccess(resp, options);
          };
        }
        if (!Ext.isEmpty(failure)) {
          options.initialFailure = options.failure;
          options.configFailure = failure;
          options.failure = function(resp, options) {
            for (var failItter = 0; failItter < options.configFailure.length; failItter++) {
              if (Ext.isFunction(options.configFailure[failItter])) {
                options.configFailure[failItter](resp);
              } else {
                if (Ext.isString(options.configFailure[failItter])) {
                  var func = ABP.util.Common.getSingletonFunctionFromString(options.configFailure[failItter]);
                  if (func) {
                    func(resp);
                  }
                }
              }
            }
            options.initialFailure(resp, options);
          };
        }
      }
      if (substitute && substitute.substituteFunc) {
        if (Ext.isFunction(substitute.substituteFunc)) {
          substitute.substituteFunc(options);
          return;
        } else {
          if (Ext.isString(substitute.substituteFunc)) {
            var func = ABP.util.Common.getSingletonFunctionFromString(substitute.substituteFunc);
            if (func) {
              func(options);
              return;
            }
          }
        }
      }
      if (urlQueryStringParameter && Ext.isArray(urlQueryStringParameter) && !Ext.isEmpty(urlQueryStringParameter)) {
        var additionalParamString = options.url.indexOf('?') === -1 ? '?' : '\x26';
        var urlQueryStringParameterLength = urlQueryStringParameter.length;
        for (var i = 0; i < urlQueryStringParameterLength; ++i) {
          if (i !== 0) {
            additionalParamString += '\x26' + urlQueryStringParameter[i].name + '\x3d' + urlQueryStringParameter[i].value;
          } else {
            additionalParamString += urlQueryStringParameter[i].name + '\x3d' + urlQueryStringParameter[i].value;
          }
        }
        options.url += additionalParamString;
      }
    }
  }
  if (ABPAuthManager.getToken()) {
    options.initialFailure = options.failure;
    options.failure = me.handleAjaxFailure;
  }
  Ext.Ajax.request(options);
}, getRequestHeaders:function(options) {
  var url = options.url;
  var headers = {};
  var service = ABPServiceManager.matchEndpointToService(url);
  if (!Ext.isEmpty(service)) {
    var token = ABPServiceManager.getTokenForService(service);
    if (Ext.isEmpty(token)) {
      if (url.indexOf(ABP.util.Ajax.getServerUrl()) > -1) {
        token = ABPAuthManager.getToken();
      }
    }
    if (!Ext.isEmpty(token)) {
      headers['Authorization'] = 'Bearer ' + token;
    }
  } else {
    var token = ABPAuthManager.getToken();
    if (!Ext.isEmpty(token)) {
      headers['Authorization'] = 'Bearer ' + token;
    } else {
      if (ABP.util.Config.getAuthType() === 'oauth' && ABP.util.Config.getSessionId() !== null) {
        headers['Authorization'] = 'Bearer ' + ABP.util.Config.getSessionId();
      }
    }
  }
  headers['SystemId'] = ABP.util.LocalStorage.get('SavedEnvironment');
  headers['UserId'] = ABP.util.LocalStorage.get('SavedUsername');
  return headers;
}, getServerUrl:function() {
  var savedServerUrl = ABP.util.LocalStorage.get('ServerUrl');
  if (savedServerUrl && this.isValidServerUrl(savedServerUrl)) {
    if (savedServerUrl.indexOf('#') > 0) {
      savedServerUrl = savedServerUrl.substring(0, savedServerUrl.indexOf('#'));
    }
    return savedServerUrl;
  } else {
    return '';
  }
}, getBootstrapServerUrl:function() {
  var savedServerUrl = ABP.util.LocalStorage.get('ServerUrl');
  var baseUrl = '';
  if (savedServerUrl && this.isValidServerUrl(savedServerUrl)) {
    if (savedServerUrl.indexOf('#') > 0) {
      savedServerUrl = savedServerUrl.substring(0, savedServerUrl.indexOf('#'));
    }
    baseUrl = savedServerUrl;
  } else {
    if (document.URL.indexOf('http') !== -1) {
      if (this.attemptDiscoveryServerUrl) {
        baseUrl = this.attemptDiscoveryServerUrl;
        if (baseUrl === document.location.origin) {
          this.attemptDiscoveryServerUrl = '';
          return '';
        }
      } else {
        baseUrl = document.URL;
      }
      if (baseUrl.indexOf('#') > 0) {
        baseUrl = baseUrl.substring(0, baseUrl.indexOf('#'));
      }
      baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
      this.attemptDiscoveryServerUrl = baseUrl;
      var prefix = ABP.util.Config.getApiUrlPrefix();
      if (prefix !== null) {
        baseUrl = baseUrl + prefix;
      }
    }
  }
  return baseUrl;
}, getAttemptDiscoveryServerUrl:function() {
  return this.attemptDiscoveryServerUrl;
}, isValidServerUrl:function(url) {
  if (!url) {
    return false;
  }
  return /^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*|(?:(?:[a-z\u00a1-\uffff0-9]+_?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(url);
}, getUrlInfo:function(url) {
  var serverUrl = ABP.util.LocalStorage.get('ServerUrl');
  if (!serverUrl) {
    serverUrl = window.location.origin;
  }
  serverUrl = serverUrl.toLowerCase();
  url = url.replace(serverUrl + '/', '');
  var params = url.split('?');
  var options = null;
  if (params.length === 2) {
    options = params[1].split('\x26');
  }
  var route = params[0].split('/');
  var abpFunction = '';
  var i = route.lastIndexOf('abp');
  if (i > -1 && i <= route.length - 2) {
    abpFunction = route[i + 1];
  }
  return {baseUrl:serverUrl, routes:route, abpEndPoint:abpFunction, options:options};
}, uploadFile:function(file, sourceUrl) {
  ABP.util.Ajax.request({url:sourceUrl, rawData:file, headers:{'Content-Type':null}, success:function(response) {
    if (response.status !== 200) {
      ABP.view.base.popUp.PopUp.showInfo('error ' + response.status);
    }
  }, failure:function(response) {
    var title = ABP.util.Common.geti18nString('error_upload_failed');
    var error = Ext.JSON.decode(response.responseText);
    ABP.util.Logger.logError(title + ' (' + response.stausText + ')', error.exceptionMessage);
    ABP.view.base.popUp.PopUp.showInfo(title, error.exceptionMessage);
  }});
}, downloadFile:function(sourceUrl) {
  ABP.util.Ajax.request({url:sourceUrl, success:function(response, opts) {
    try {
      Ext.destroy(Ext.get('downloadIframe'));
    } catch (e$0) {
    }
    Ext.DomHelper.append(document.body, {tag:'iframe', id:'downloadIframe', frameBorder:0, width:0, height:0, css:'display:none;visibility:hidden;height:0px;', src:sourceUrl});
  }, failure:function(response, opts) {
    var title = ABP.util.Common.geti18nString('error_download_failed');
    if (response.status === 410) {
      var message = ABP.util.Common.geti18nString('error_download_failed_fileNotFound');
      ABP.util.Logger.logError(title + ' (410)', message);
      ABP.view.base.popUp.PopUp.showInfo(title, message);
    } else {
      if (response.responseText) {
        var error = Ext.JSON.decode(response.responseText);
        ABP.util.Logger.logError(title + ' (' + response.status + ')', error.errorMessage);
        ABP.view.base.popUp.PopUp.showInfo(title, error.errorMessage);
      }
    }
  }});
}, handleAjaxFailure:function(response, options) {
  var usesB2cToken = ABP.util.Msal.enabled;
  var maxFailureAttempts = 1;
  options.failureAttempts = Ext.isNumber(options.failureAttempts) ? options.failureAttempts : 0;
  options.failureAttempts += 1;
  if (options.failureAttempts > maxFailureAttempts) {
    options.failure = options.initialFailure;
    delete options.initialFailure;
    Ext.callback(options.initialFailure, options.scope, [response, options]);
  }
  if (response.status === 401 && !options.refreshedToken) {
    ABPRequestQueue.push(options);
    if (ABPAuthManager.isRequestingToken()) {
      return;
    }
    try {
      var service = ABPServiceManager.matchEndpointToService(options.url);
      usesB2cToken = ABPAuthManager.serviceUsesB2cToken(service);
    } catch (e$1) {
      ABPLogger.logWarn(e$1);
    }
    ABPAuthManager.requestToken(usesB2cToken).then(function() {
      options.refreshedToken = true;
      options.failure = options.initialFailure;
      delete options.initialFailure;
      ABP.util.Ajax.request(options);
      if (!ABPRequestQueue.isEmpty()) {
        ABPRequestQueue.start();
      }
    }, function(response) {
      Ext.callback(options.initialFailure, options.scope, [response, options]);
    });
  } else {
    Ext.callback(options.initialFailure, options.scope, [response, options]);
  }
}});
Ext.define('ABP.util.AjaxInteractionManager', {singleton:true, requires:['ABP.util.Logger'], config:{registeredAjaxCommunications:{}, registeredAjaxSubstitutions:{}, registeredAjaxUrlQueryStringParameters:{}}, constructor:function(config) {
  this.initConfig(config);
}, getAjaxInteractions:function(ajaxIdentifier) {
  var communications = this.getRegisteredAjaxCommunications()[ajaxIdentifier];
  var substitute = this.getRegisteredAjaxSubstitutions()[ajaxIdentifier];
  var urlQueryStringParameters = this.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier];
  var ret = null;
  if (communications || substitute || urlQueryStringParameters) {
    ret = {'communications':communications, 'substitute':substitute, 'urlQueryStringParameters':urlQueryStringParameters};
  }
  return ret;
}, registerAjaxCommunication:function(ajaxIdentifier, appId, handlerObj) {
  ABP.util.Logger.logTrace('Registering Ajax Communication: ' + ajaxIdentifier + ' for ' + appId);
  if (this.getRegisteredAjaxCommunications()[ajaxIdentifier]) {
    this.getRegisteredAjaxCommunications()[ajaxIdentifier].push({'appId':appId, 'handlerObj':handlerObj});
  } else {
    this.getRegisteredAjaxCommunications()[ajaxIdentifier] = [{'appId':appId, 'handlerObj':handlerObj}];
  }
}, registerAjaxSubstitute:function(ajaxIdentifier, appId, substituteFunc) {
  ABP.util.Logger.logTrace('Registering Ajax Override: ' + ajaxIdentifier + ' for ' + appId);
  this.getRegisteredAjaxSubstitutions()[ajaxIdentifier] = {'appId':appId, 'substituteFunc':substituteFunc};
}, registerAjaxUrlQueryStringParameter:function(ajaxIdentifier, parameterName, parameterValue) {
  var me = this;
  ABP.util.Logger.logTrace('Registering Ajax Query String Parameter: ' + ajaxIdentifier + ' of ' + parameterName + ':' + parameterValue);
  if (ajaxIdentifier !== 'all') {
    me.__setUrlQueryStringParameter(ajaxIdentifier, parameterName, parameterValue);
  } else {
    var availableRequests = ABP.util.Ajax.availableRequests;
    for (prop in availableRequests) {
      me.__setUrlQueryStringParameter(prop, parameterName, parameterValue);
    }
  }
}, privates:{__setUrlQueryStringParameter:function(ajaxIdentifier, parameterName, parameterValue) {
  var me = this;
  if (me.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier]) {
    me.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier].push({'name':parameterName, 'value':parameterValue});
  } else {
    me.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier] = [{'name':parameterName, 'value':parameterValue}];
  }
}}});
Ext.define('ABP.util.Aria', {singleton:true, setExpanded:function(cmp, expanded) {
  if (!cmp) {
    return;
  }
  if (cmp.inputEl) {
    cmp.inputEl.dom.setAttribute('aria-expanded', expanded);
  }
}, setActiveDecendant:function(cmp, selectedId) {
  if (!cmp) {
    return;
  }
  if (cmp.inputEl) {
    cmp.inputEl.dom.setAttribute('aria-activedescendant', selectedId);
  }
}, encodeAttribute:function(s) {
  if (!s) {
    return s;
  }
  s = String(s).replace(/&/g, '').replace(/"/g, '').replace(/'/g, '').replace(/</g, '').replace(/>/g, '');
  return Ext.String.htmlEncode(s);
}});
Ext.apply(Ext.util.Format, {ariaEncode:function(v) {
  return ABP.util.Aria.encodeAttribute(v);
}});
Ext.define('ABP.util.AuthenticationManager', {alternateClassName:'ABPAuthManager', singleton:true, tokenKey:'servicetoken', tokenAudience:[], tokenRefreshTask:null, tokenAudienceLoaded:false, requestingToken:false, tokens:new Ext.util.HashMap, serviceToken:null, token:null, requestToken:function(usesB2cToken) {
  var me = this;
  var promises = [];
  var audiences = me.getTokenAudience();
  usesB2cToken = Ext.isBoolean(usesB2cToken) ? usesB2cToken : true;
  if (usesB2cToken) {
    promises.push(ABP.util.Msal.getToken());
  } else {
    for (i = 0; i < audiences.length; i++) {
      promises.push(me.requestTokenForService(audiences[i]));
    }
  }
  return Ext.Deferred.all(promises);
}, serviceUsesB2cToken:function(service) {
  var me = this;
  service = Ext.isString(service) ? ABPServiceManager.getService(service) : service;
  return Ext.isEmpty(service.usesB2cToken) ? true : service.usesB2cToken;
}, requestTokenForService:function(audience) {
  var me = this;
  var service = ABPServiceManager.getService(audience);
  if (service && service.usesB2cToken) {
    var message = Ext.String.format('Service {0} is configured to use B2C tokens.', audience);
    ABPLogger.logDebug(message);
    return;
  }
  if (me.requestingToken) {
    return;
  }
  url = ABP.util.Ajax.getServerUrl();
  var deferred = new Ext.Deferred;
  me.requestingToken = true;
  var request = {method:'GET', withCredentials:true, url:url + '/abp/token?audience\x3d' + audience, success:function(response) {
    me.requestingToken = false;
    var resp = Ext.JSON.decode(response.responseText);
    me.authenticationSuccessService(resp.authorizationToken);
    deferred.resolve(resp);
  }, failure:function(response) {
    me.requestingToken = false;
    me.authenticationFailure(response);
    deferred.reject(response);
  }};
  var previousToken = me.getToken(audience);
  if (previousToken) {
    request.headers = {'Authorization':'Bearer ' + previousToken};
  }
  ABP.util.Ajax.request(request);
  return deferred.promise;
}, isRequestingToken:function() {
  return this.requestingToken;
}, isTokenValid:function() {
  var me = this;
  var now = Math.floor(Date.now() / 1000);
  var tokenExpires = me.currentTokenExpires;
  if (!Ext.isNumber(tokenExpires)) {
    tokenExpires = me.getTokenExpiration();
  }
  return tokenExpires > now + 2;
}, getToken:function() {
  var me = this;
  return ABP.util.SessionStorage.get(me.tokenKey);
}, setToken:function(token, payload) {
  var me = this;
  if (!Ext.isEmpty(token)) {
    me.token = token;
    ABP.util.SessionStorage.set(me.tokenKey, token);
  }
}, getServiceToken:function() {
  var me = this;
  if (me.serviceToken) {
    return me.serviceToken;
  } else {
    return ABP.util.SessionStorage.get('abpservicetoken');
  }
}, setServiceToken:function(token) {
  var me = this;
  if (!Ext.isEmpty(token)) {
    me.serviceToken = token;
    ABP.util.SessionStorage.set('abpservicetoken', token);
  }
}, getTokenForAudience:function(audience) {
  return this.getServiceToken();
}, privates:{addTokenAudience:function(audience) {
  var me = this;
  if (me.tokenAudience.indexOf(audience) > -1) {
    return;
  } else {
    me.tokenAudience.push(audience);
  }
}, removeTokenAudience:function(audience) {
  var me = this;
  var indexOfAudience = me.tokenAudience.indexOf(audience);
  if (indexOfAudience > -1) {
    me.tokenAudience.splice(indexOfAudience, 1);
  }
}, getTokenAudience:function() {
  return ABPServiceManager.getRegisteredServices();
}, authenticationSuccessService:function(token) {
  var me = this;
  if (ABP.util.Jwt.isJwt(token)) {
    var tokenPayload = ABP.util.Jwt.getPayload(token);
    me.setServiceToken(token, tokenPayload);
    me.setServiceTokenRefreshTask(token, tokenPayload);
  }
  if (!ABPRequestQueue.isEmpty()) {
    ABPRequestQueue.start();
  }
}, authenticationSuccess:function(token) {
  var me = this;
  if (ABP.util.Jwt.isJwt(token)) {
    var tokenPayload = ABP.util.Jwt.getPayload(token);
    ABPLogger.logDebug('Token Generation Success: ' + tokenPayload.aud);
    me.setToken(token, tokenPayload);
    me.setTokenRefreshTask(token, tokenPayload);
  }
  if (!ABPRequestQueue.isEmpty()) {
    ABPRequestQueue.start();
  }
}, authenticationFailure:function(response) {
  ABPLogger.logError('Token Generation Failed.');
  ABPLogger.logDebug(response.responseText);
}, getTokenExpiration:function(token, payload) {
  var me = this;
  var token = token || me.getToken();
  if (ABP.util.Jwt.isJwt(token)) {
    var jwtPayload = Ext.isEmpty(payload) ? ABP.util.Jwt.getPayload(token) : payload;
    if (Ext.isNumber(jwtPayload.exp) && !Ext.isEmpty(jwtPayload.iat)) {
      return jwtPayload.exp - jwtPayload.iat;
    }
  }
}, setTokenRefreshTask:function(token, payload) {
  var me = this;
  if (Ext.isEmpty(me.tokenRefreshTask)) {
    me.tokenRefreshTask = new Ext.util.DelayedTask(me.requestToken, me);
  }
  var tokenExpiresIn = me.getTokenExpiration(token, payload);
  if (ABP.Config.getDebugMode() && payload) {
    var tokenLogString = 'Token: {0}\n\nExpires at UTC: {1}.\n\nCurrent UTC: {2}';
    var currentDate = new Date;
    var expireDate = new Date(currentDate.getTime() + tokenExpiresIn * 1000);
    tokenLogString = Ext.String.format(tokenLogString, token, expireDate.toUTCString(), currentDate.toUTCString());
    ABPLogger.logDebug(tokenLogString);
  }
  var tokenExpiresMs = tokenExpiresIn;
  if (Ext.isNumber(tokenExpiresIn)) {
    tokenExpiresMs = tokenExpiresMs * 1000 * 0.7;
    tokenExpiresMs = Math.floor(tokenExpiresMs);
    me.tokenRefreshTask.delay(tokenExpiresMs);
    ABPLogger.logDebug('Services token is set to refresh in about ' + Math.round(tokenExpiresMs / 1000 / 60) + ' minutes.');
  }
}, setServiceTokenRefreshTask:function(token, payload) {
  var me = this;
  if (Ext.isEmpty(me.tokenRefreshTask)) {
    me.tokenRefreshTask = new Ext.util.DelayedTask(me.requestTokenForService, me);
  }
  var tokenExpiresIn = me.getTokenExpiration(token, payload);
  if (ABP.Config.getDebugMode() && payload) {
    var tokenLogString = 'Token: {0}\n\nExpires at UTC: {1}.\n\nCurrent UTC: {2}';
    var currentDate = new Date;
    var expireDate = new Date(currentDate.getTime() + tokenExpiresIn * 1000);
    tokenLogString = Ext.String.format(tokenLogString, token, expireDate.toUTCString(), currentDate.toUTCString());
    ABPLogger.logDebug(tokenLogString);
  }
  var tokenExpiresMs = tokenExpiresIn;
  if (Ext.isNumber(tokenExpiresIn)) {
    tokenExpiresMs = tokenExpiresMs * 1000 * 0.7;
    tokenExpiresMs = Math.floor(tokenExpiresMs);
    me.tokenRefreshTask.delay(tokenExpiresMs);
    ABPLogger.logDebug('Services token is set to refresh in about ' + Math.round(tokenExpiresMs / 1000 / 60) + ' minutes.');
  }
}}});
Ext.define('ABP.util.BroadcastChannel', {singleton:true, broadcastAvailable:true, broadcastChannels:[], create:function(channelName, callback, scope) {
  try {
    var channel = new BroadcastChannel(channelName);
    channel.onmessage = callback.bind(scope);
    this.broadcastChannels.push(channel);
  } catch (err) {
    this._broadcastAvailable = false;
    console.error('Unable to create broadcast channel');
  }
}, remove:function(channelName) {
  var channel = Ext.Array.findBy(this.broadcastChannels, function(item) {
    return channelName === item.name;
  });
  if (channel) {
    channel.close();
    Ext.Array.remove(channel);
  }
}, send:function(channelName, message) {
  var channel = Ext.Array.findBy(this.broadcastChannels, function(item) {
    return channelName === item.name;
  });
  if (channel) {
    channel.postMessage(message);
  }
}});
Ext.define('ABP.util.CSS.Colors', {singleton:true, themePrefixCls:'.abp-theme-colors ', defaultMismatchColor:'darkred', selectors:{'base':'.abp-theme .base '}, getThemeColor:function(color) {
  var result;
  var me = this;
  var selectedThemeSelector = '.' + ABP.ThemeManager.getSelectedTheme();
  var selector = me.selectors[color];
  if (Ext.isEmpty(selector)) {
    selector = '.abp-theme .' + color;
    result = this.getProperty(me.themePrefixCls + selector, 'color', me.defaultMismatchColor);
  } else {
    result = this.getProperty(me.themePrefixCls + selector + selectedThemeSelector, 'color', me.defaultMismatchColor);
  }
  if (result === me.defaultMismatchColor) {
    ABP.util.Logger.logWarn('The ABP theme color requested is not in the ABP theme: "' + color + '". Using the mismatch color "' + me.defaultMismatchColor + '" to highlight the problem control.');
  }
  return result;
}, getAnyColor:function(color) {
  var me = this;
  var selectedThemeSelector = '.' + ABP.ThemeManager.getSelectedTheme();
  var result = this.getProperty(me.themePrefixCls + me.selectors[color] + selectedThemeSelector, 'color', color);
}, getProperty:function(selector, property, original) {
  var rule = Ext.util.CSS.getRule(selector);
  if (rule) {
    var value = rule.styleMap ? rule.styleMap.get(property) : rule.style.getPropertyValue(property);
    if (value) {
      return value.toString();
    }
  } else {
    return original;
  }
}});
Ext.define('ABP.util.Color', {singleton:true, getRGBValues:function(c) {
  if (c.substr(0, 3) == 'rgb') {
    return this.getFromRGBFunction(c);
  }
  if (c.substr(0, 1) == '#') {
    return this.getFromHex(c);
  }
}, getWCAGContrast:function(cmp) {
  var style = window.getComputedStyle(cmp, null);
  var background = style.getPropertyValue('background-color');
  if (this.isTransparent(background)) {
    background = this.getParentBackground(cmp);
  }
  var foreground = style.getPropertyValue('color');
  var fontSize = parseInt(style.getPropertyValue('font-size').replace('px', ''));
  var fontWeight = style.getPropertyValue('font-weight');
  var wcag = '';
  var isLargeText = fontSize >= 24 || fontSize > 18 && fontWeight >= 700;
  var ratio = ABP.util.Color.getContrast(foreground, background);
  if (isLargeText) {
    if (ratio >= 3) {
      if (ratio >= 4.5) {
        wcag = 'AAA';
      } else {
        wcag = 'AA';
      }
    } else {
      console.log('WCAG Fail - ' + background + ' / ' + foreground + ' \x3e ' + ratio);
    }
  } else {
    if (ratio >= 4.5) {
      if (ratio >= 7) {
        wcag = 'AAA';
      } else {
        wcag = 'AA';
      }
    } else {
      console.log('WCAG Fail - ' + background + ' / ' + foreground + ' \x3e ' + ratio);
    }
  }
  return wcag;
}, getContrast:function(c1, c2) {
  var me = this;
  var rgb1 = c1;
  if (typeof c1 == 'string') {
    rgb1 = me.getRGBValues(c1);
  }
  var rgb2 = c2;
  if (typeof c2 == 'string') {
    rgb2 = me.getRGBValues(c2);
  }
  var lum1 = me.getLuminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
  var lum2 = me.getLuminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
  return lum1 > lum2 ? lum1 / lum2 : lum2 / lum1;
}, getContrastingBWColor:function(color) {
  var me = this;
  var black = me.getContrast('#000000', color);
  var white = me.getContrast('#FFFFFF', color);
  return black > white ? '#000000' : '#FFFFFF';
}, privates:{getFromHex:function(c) {
  var arr = [0, 0, 0];
  c = c.replace('#', '');
  arr[0] = parseInt(c.substr(0, 2), 16);
  arr[1] = parseInt(c.substr(2, 2), 16);
  arr[2] = parseInt(c.substr(4, 2), 16);
  return arr;
}, getFromRGBFunction:function(color) {
  color = color.toUpperCase();
  var c = color.replace('(', '');
  c = c.replace(')', '');
  c = c.replace('RGBA', '');
  c = c.replace('RGB', '');
  var arr = c.split(',');
  arr[0] = Number(arr[0]);
  arr[1] = Number(arr[1]);
  arr[2] = Number(arr[2]);
  if (color.indexOf('RGBA') > -1) {
    arr[3] = Number(arr[3]);
  }
  return arr;
}, getLuminanace:function(r, g, b) {
  var a = [r, g, b].map(function(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}, isTransparent:function(color) {
  var rgb = this.getFromRGBFunction(color);
  if (rgb.length <= 3) {
    return false;
  }
  return rgb[3] === 0;
}, getParentBackground:function(cmp) {
  var parent = cmp.parentElement;
  if (!parent) {
    return 'rgb(255,255,255)';
  }
  var style = window.getComputedStyle(parent, null);
  var background = style.getPropertyValue('background-color');
  if (this.isTransparent(background)) {
    return this.getParentBackground(parent);
  }
  return background;
}}});
Ext.define('ABP.util.Common', {singleton:true, __cssClassNameInvalidChars:/[ !\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, __lastLoginAsUserDeferId:null, __keyNavigation:false, __uuidGenerator:null, geti18nString:function(i18nKey, disableWarning) {
  var app = Ext.getApplication();
  var mainView = app.getMainView();
  var vm = mainView.getViewModel();
  var ret = null;
  if (vm) {
    ret = vm.checkI18n(i18nKey, disableWarning);
  }
  return ret;
}, getClassic:function() {
  return Ext.toolkit === 'classic';
}, getModern:function() {
  return Ext.toolkit === 'modern';
}, getWindowHeight:function() {
  var ret;
  if (this.getClassic()) {
    ret = Ext.getBody().getHeight();
  } else {
    ret = Ext.Viewport.getWindowHeight();
  }
  return ret;
}, getWindowWidth:function() {
  var ret;
  if (this.getClassic()) {
    ret = Ext.getBody().getWidth();
  } else {
    ret = Ext.Viewport.getWindowWidth();
  }
  return ret;
}, getPortrait:function() {
  var ret = null;
  if (this.getModern()) {
    ret = Ext.Viewport.determineOrientation() === 'portrait';
  }
  return ret;
}, getLandscape:function() {
  var ret = null;
  if (this.getModern()) {
    ret = Ext.Viewport.determineOrientation() === 'landscape';
  }
  return ret;
}, inspectString:function(value) {
  var allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /\x3c!--[\s\S]*?--\x3e|<\?(?:php)?[\s\S]*?\?>/gi;
  return value.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
    return allowed.indexOf('\x3c' + $1.toLowerCase() + '\x3e') > -1 ? $0 : '';
  }).replace('/\x3e', '').trim();
}, getSmallScreen:function() {
  var width = this.getWindowWidth();
  var height = this.getWindowHeight();
  var ret = false;
  if (width < 700 || height < 700) {
    ret = true;
  }
  return ret;
}, getToolBarButton:function(uniqueId) {
  var app = Ext.getApplication();
  var mainView = app.getMainView();
  var toolBar = mainView.down('toolbartop');
  var ret = null;
  if (toolBar) {
    ret = toolBar.getController().getButton(uniqueId);
  }
  return ret;
}, getMenuItem:function(appId, uniqueId, tree) {
  var mm = this.getMainMenu();
  var ret = null;
  if (mm) {
    ret = mm.getController().findMenuItem(appId, uniqueId, tree);
  }
  return ret;
}, getFavorites:function() {
  var serializedFavorites = ABP.internal.util.MainMenu.jsonSerializeFavorites();
  return serializedFavorites;
}, getCurrentTheme:function() {
  var app = Ext.getApplication();
  var mainView = app.getMainView();
  vm = mainView.getViewModel();
  return vm.get('currentTheme');
}, isFavorite:function(appId, value) {
  var child;
  var navStore = Ext.getStore('navSearch');
  var favorites = navStore.getNodeById('container_nav-favorites');
  if (favorites) {
    if (navStore.lazyFill) {
      var mm = this.getMainMenu();
      if (typeof value === 'function') {
        child = mm.getController().findTreeStoreItemInChildren(favorites, null, null, value);
      } else {
        if (Ext.isString(value)) {
          child = mm.getController().findTreeStoreItemInChildren(favorites, 'uniqueId', 'fav_' + value);
        }
      }
    } else {
      if (typeof value === 'function') {
        child = favorites.findChildBy(value, null, true);
      } else {
        if (Ext.isString(value)) {
          child = favorites.findChild('uniqueId', 'fav_' + value, true);
        }
      }
    }
  }
  return Ext.isEmpty(child) ? false : true;
}, getRecents:function() {
  var mainmenu = this.getMainMenu();
  var ret = [];
  if (mainmenu) {
    var vm = mainmenu.getViewModel();
    var recentPages = vm.get('recentPages');
    if (recentPages && !Ext.isEmpty(recentPages)) {
      var toEncode = [];
      for (var i = 0; i < recentPages.length; ++i) {
        if (recentPages[i].serialData) {
          toEncode.push(recentPages[i].serialData);
        }
      }
      if (!Ext.isEmpty(toEncode)) {
        ret = Ext.JSON.encode(toEncode);
      }
    }
  }
  return ret;
}, getAutomationClass:function(extObj) {
  var automationXtype;
  var automationName;
  var initialConfigAutoCls;
  var initialConfigLabelKey;
  var initialConfigLabel;
  if (extObj.initialConfig) {
    if (extObj.initialConfig.node) {
      if (extObj.initialConfig.node.data) {
        initialConfigAutoCls = extObj.initialConfig.node.data.automationCls;
        initialConfigLabelKey = extObj.initialConfig.node.data.labelKey;
        initialConfigLabel = extObj.initialConfig.node.data.label;
      }
    }
  }
  if (this.hasAutomationClass(extObj)) {
    return '';
  }
  if (extObj.automationCls) {
    return this.getAutomationAnchorName(extObj.automationCls);
  } else {
    if (initialConfigAutoCls) {
      return this.getAutomationAnchorName(initialConfigAutoCls);
    } else {
      if (Ext.isString(extObj.xtype)) {
        automationXtype = extObj.xtype;
      } else {
        if (Ext.isString(extObj.defaultType)) {
          automationXtype = extObj.defaultType;
        } else {
          automationXtype = 'unknown-xtype';
        }
      }
      if (Ext.isString(extObj.name)) {
        automationName = extObj.name;
      } else {
        if (Ext.isString(initialConfigLabelKey)) {
          automationName = initialConfigLabelKey;
        } else {
          if (Ext.isString(initialConfigLabel)) {
            automationName = initialConfigLabel;
          } else {
            if (Ext.isString(extObj.itemId)) {
              automationName = extObj.itemId;
            } else {
              automationName = 'custom-unsafe';
            }
          }
        }
      }
      return this.getAutomationAnchorName(automationXtype + '-' + automationName);
    }
  }
}, getAutomationAnchorName:function(uniqueName) {
  return 'a-' + uniqueName.replace(this.__cssClassNameInvalidChars, '-');
}, isJsonString:function(string) {
  try {
    JSON.parse(string);
  } catch (e$2) {
    return false;
  }
  return true;
}, setKeyboardFocus:function(selector) {
  var cmps = Ext.query(selector, false);
  if (cmps && cmps.length > 0) {
    var extCmp = Ext.getCmp(cmps[0].id);
    Ext.getCmp(extCmp.id).focus(50);
  }
}, openBrowserTab:function(url, urlTarget, urlDisplayText, useCurrentUser) {
  var env = ABP.util.Config.getEnvironment();
  var user = ABP.util.Config.getUsername();
  var sessionToken = ABP.util.Config.getOAuthInfo();
  var lang = ABP.util.Config.getLanguage();
  var pass = ABP.util.LocalStorage.getForLoggedInUser('SavedPassword');
  if (!pass) {
    if (ABP.util.LocalStorage.get('SavedUsername') == user && ABP.util.LocalStorage.get('SavedEnvironment') == env) {
      pass = ABP.util.LocalStorage.get('SavedPassword');
    }
  }
  var loginAsUserObj = this.getLoginAsUserObj(env, user, sessionToken, lang, pass, !useCurrentUser);
  ABP.util.LocalStorage.set('LoginAsUser', ABP.util.Common.jsonEncode(loginAsUserObj));
  if (ABP.util.Common.__lastLoginAsUserDeferId) {
    Ext.undefer(ABP.util.Common.__lastLoginAsUserDeferId);
    ABP.util.Common.__lastLoginAsUserDeferId = null;
  }
  ABP.util.Common.__lastLoginAsUserDeferId = Ext.defer(function(loginAsUserObj) {
    try {
      var localLoginAsUserObj = ABP.util.Common.jsonDecode(ABP.util.LocalStorage.get('LoginAsUser'));
      if (loginAsUserObj.created == localLoginAsUserObj.created) {
        ABP.util.LocalStorage.remove('LoginAsUser');
      }
    } catch (ex) {
    }
  }, ABP.util.Constants.login.loginAsUserLifetime * 1000, this, [loginAsUserObj]);
  urlTarget = urlTarget || '_blank';
  var result = window.open(url, urlTarget);
  if (Ext.isEmpty(result)) {
    ABP.view.base.popUp.PopUp.showHyperlink('help_blocked_Text', url, urlTarget, urlDisplayText, 'help_blocked_Title', null, null, null);
  }
}, jsonDecode:function(jsonString) {
  var jsonStringObj = null;
  try {
    jsonStringObj = Ext.JSON.decode(jsonString);
  } catch (ex) {
    ABP.util.Logger.logError('Cannot JSON.decode this:' + jsonString + '. Exception:' + ex);
  }
  return jsonStringObj;
}, jsonEncode:function(object) {
  var jsonString = null;
  try {
    jsonString = Ext.JSON.encode(object);
  } catch (ex) {
    ABP.util.Logger.logError('Cannot JSON.encode this:' + object + '. Exception:' + ex);
  }
  return jsonString;
}, setViewModelProperty:function(name, value) {
  var app = Ext.getApplication(), mainView = app.getMainView(), vm = mainView.getViewModel(), whiteListedProperties = ['switchToOnline'];
  if (whiteListedProperties.indexOf(name) === -1) {
    return;
  }
  if (vm) {
    vm.set(name, value);
  }
}, getViewModelProperty:function(name) {
  var app = Ext.getApplication(), mainView = app.getMainView(), vm = mainView.getViewModel();
  return vm.get(name);
}, hasAutomationClass:function(extObj) {
  var hasAutoCls;
  var cls = extObj.getCls ? extObj.getCls() : extObj.cls;
  if (!cls && typeof extObj.getNode === 'function') {
    var node = extObj.getNode();
    if (node && node.data) {
      extObj = node.data;
      cls = extObj.cls;
    }
  }
  if (!cls && extObj.componentCls) {
    cls = extObj.componentCls;
  }
  hasAutoCls = this.testForAutomationClass(cls);
  if (hasAutoCls === false && (cls && extObj.componentCls)) {
    if (cls !== extObj.componentCls) {
      hasAutoCls = this.testForAutomationClass(extObj.componentCls);
    }
  }
  return hasAutoCls;
}, testForAutomationClass:function(cls) {
  var autoClasses;
  var hasAutoCls;
  if (Ext.isArray(cls)) {
    cls.forEach(function(val, index, array) {
      if (!hasAutoCls) {
        hasAutoCls = /\b(a-[a-zA-Z0-9-]+)\b/m.test(val);
      }
    });
    return hasAutoCls;
  } else {
    if (Ext.isString(cls)) {
      autoClasses = cls.match(ABP.util.Constants.AUTOMATION_CLASS_REGEX);
      if (autoClasses === null) {
        return false;
      } else {
        return autoClasses.length > 0;
      }
    }
  }
}, getLoginAsUserObj:function(env, user, sessionToken, lang, pass, clearSession) {
  var loginAsUserObj = {environment:env, logonId:user, sessionToken:sessionToken, locale:lang, password:pass, created:Date.now(), clearSession:clearSession};
  return loginAsUserObj;
}, flushAllBindings:function(component, parentViewXtype) {
  var view, vm;
  if (parentViewXtype) {
    view = component.up('[xtype\x3d' + parentViewXtype + ']');
  } else {
    view = component;
  }
  if (view) {
    var vm = view.getViewModel();
    if (vm) {
      vm.notify();
    }
  }
}, measureCache:{}, measureDiv:null, actualMeasureText:function(text, font) {
  var me = this, measureDiv = me.measureDiv, FARAWAY = 100000, size;
  if (!measureDiv) {
    var parent = Ext.Element.create({'data-sticky':true, style:{'overflow':'hidden', 'position':'relative', 'float':'left', 'width':0, 'height':0}});
    me.measureDiv = measureDiv = Ext.Element.create({style:{'position':'absolute', 'x':FARAWAY, 'y':FARAWAY, 'z-index':-FARAWAY, 'white-space':'nowrap', 'display':'block', 'padding':0, 'margin':0}});
    Ext.getBody().appendChild(parent);
    parent.appendChild(measureDiv);
  }
  if (font) {
    measureDiv.setStyle({font:font, lineHeight:'normal'});
  }
  measureDiv.setText('(' + text + ')');
  size = measureDiv.getSize();
  measureDiv.setText('()');
  size.width -= measureDiv.getSize().width;
  return size;
}, measureTextSingleLine:function(text, font) {
  text = text.toString();
  var me = this, cache = me.measureCache, chars = text.split(''), width = 0, height = 0, cachedItem, charactor, i, ln, size;
  if (!cache[font]) {
    cache[font] = {};
  }
  cache = cache[font];
  if (cache[text]) {
    return cache[text];
  }
  for (i = 0, ln = chars.length; i < ln; i++) {
    charactor = chars[i];
    if (!(cachedItem = cache[charactor])) {
      size = me.actualMeasureText(charactor, font);
      cachedItem = cache[charactor] = size;
    }
    width += cachedItem.width;
    height = Math.max(height, cachedItem.height);
  }
  return cache[text] = {width:width, height:height};
}, getABPAboutData:function() {
  return {icon:'aptean2018', name:'Aptean Business Platform', version:'3.1.0.0', copyright:'Aptean \x26copy; ' + (new Date).getFullYear(), detail:'Copyright (C) 2004-' + (new Date).getFullYear() + ' Aptean. All rights reserved.\x3cp\x3e' + 'Aptean, all other product names, service names, slogans, and related logos are registered trademarks or trademarks of Aptean, Inc in the United States and other countries.  All other company, product or service names referenced herein are used for identification purposes only and may be trademarks of their respective owners.\x3cp\x3e' + 
  'This program is protected by copyright law and international treaties. Unauthorized reproduction and distribution is strictly prohibited.'};
}, getSingletonFunctionFromString:function(functionString) {
  var ret;
  var namespaces = functionString.split('.');
  var func = namespaces.pop();
  ret = window;
  for (var i = 0; i < namespaces.length; ++i) {
    ret = ret[namespaces[i]];
    if (ret === undefined) {
      return null;
    }
  }
  return ret[func];
}, getBrowserLanguage:function() {
  var lang = window.navigator.language.toLowerCase();
  this.setPageLanguage(lang, true);
  return lang;
}, setPageLanguage:function(lang, ifBlank) {
  if (!lang) {
    return;
  }
  if (ifBlank) {
    var current = document.documentElement.getAttribute('lang');
    if (current) {
      return;
    }
  }
  document.documentElement.setAttribute('lang', lang);
}, isEmptyObject:function(obj) {
  if (obj == null) {
    return true;
  }
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }
  if (typeof obj !== 'object') {
    return true;
  }
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}, getObjectProperty:function(obj, propString) {
  if (!Ext.isString(propString) || !Ext.isObject(obj)) {
    return;
  }
  var props = propString.split('.'), propsLen = props.length, i = -1;
  while (++i < propsLen) {
    var nextObj = Ext.isObject(obj) ? obj[props[i]] : undefined;
    if (nextObj !== undefined) {
      obj = nextObj;
    } else {
      return;
    }
  }
  if (i === propsLen) {
    return obj;
  }
  return;
}, removeCaseInsensitiveDuplicates:function(store, column) {
  var me = this;
  if (!store || !column) {
    return store;
  }
  var storeLen = store.getCount();
  for (var i = storeLen - 1; i > 0; i--) {
    var value = store.getAt(i).getData()[column];
    var duplicateIndex = me.containsCaseInsensitive(store, column, value);
    if (duplicateIndex !== i && duplicateIndex > -1) {
      store.removeAt(i);
    }
  }
}, getKeyboardNavigation:function() {
  return this.__keyNavigation;
}, getMouseNavigation:function() {
  return !this.__keyNavigation;
}, setKeyboardNavigation:function(bKeyInput) {
  this.__keyNavigation = bKeyInput;
}, getUuid:function() {
  if (!this.__uuidGenerator) {
    this.__uuidGenerator = Ext.create('Ext.data.identifier.Uuid', {});
  }
  return this.__uuidGenerator.generate();
}, isIOSChrome:function() {
  return !Ext.isEmpty(Ext.browser.userAgent.match('CriOS'));
}, privates:{getMainMenu:function() {
  var app = Ext.getApplication();
  var mainView = app.getMainView();
  var mm = mainView.down('mainmenu');
  return mm;
}, compareCaseInsensitive:function(column, value) {
  var expression = new RegExp('^' + value + '$', 'i');
  return function(rec) {
    return expression.test(rec.get(column));
  };
}, containsCaseInsensitive:function(store, column, value) {
  return store.findBy(this.compareCaseInsensitive(column, value));
}}});
Ext.define('ABP.util.Config', {singleton:true, alternateClassName:'ABP.Config', requires:['ABP.util.Logger'], config:{i18n:[], language:'en', bootstrapConfig:null, sessionConfig:null, username:null, environment:null, sessionId:null, authType:null, application:null, loggedIn:false, apiUrlPrefix:null, prebootSettingsExtraFields:[], rightPaneTabs:[], packageURL:null, hardcodedConfig:null, debugMode:false, b2cShowLogin:false, subscriptions:[], disabledProductSubscriptions:[]}, setSubscriptions:function(subs) {
  var me = this;
  var subLength = subs.length;
  var disabledProductSubscriptions = [];
  for (var i = 0; i < subLength; ++i) {
    var sub = subs[i];
    var product = sub.product.toLowerCase();
    if (!sub.enabled) {
      disabledProductSubscriptions.push(product);
    } else {
      if (product === 'abpinsight' || product === 'insight') {
        ABPInsight.util.WebserviceManager.setApiUrl(product.endpoint);
      }
    }
  }
  me.subscriptions = subs;
  me.disabledProductSubscriptions = disabledProductSubscriptions;
}, DEFAULT_BOOTSTRAP_CONFIG:{settings:{canRecoverPassword:false, canKeepMeSignedIn:false, canKeepMultipleUsersSignedIn:false, canForcePasswordChange:false, allowServiceChange:true, rememberEnvironment:true, rememberLanguage:true, rememberPassword:false, rememberUsername:true, rememberPreviousServerUrls:true, authenticationType:null, extraLoginFields:[], usernameCaseSensitive:false, showSimpleLogin:true}, languageResources:[], branding:{companyName:''}, availableEnvironments:[], defaultEnvironment:'', 
authenticatedUserName:null}, DEFAULT_SESSION_CONFIG:{settings:{userConfig:{displayName:null, photo:null, enableEditProfile:false}, appToolbarTitle:null, autoHideMenu:true, enableMenuFavorites:false, enableMenuPeelOff:false, enableMenuRecent:false, enableMenuSuggested:false, enableNavSearch:false, enableSearch:false, notifications:{enabled:false, maxHistory:100, clearBadgeOnActivate:true, sources:[]}, enableWideMenu:false, favorites:[], disableNavMenu:false, startMenuHidden:false, inactiveTimeout:0, 
inactiveWarningTime:0, rightPane:[], rememberMenuState:true, hideTreeNavigation:true, searchInfo:[], defaultSearch:'', loadPage:{appId:'', event:'', eventArgs:''}, toolbarTitleShowBranding:true, layoutPersistance:'local', mainMenuModernFocusFirstOption:false, mainMenuNavSearchDisableSoundex:false, mainMenuNavSearchDisableRelevance:false, mainMenuNavSearchDuplicateFields:'', mainMenuNavSearchResultsMax:20, mainMenuRecentMaxShown:5, mainMenuRecentServerSideSaving:false, mainMenuSingleExpand:false, 
mainMenuSuggestedAutoExpand:true, mainMenuStartFavoritesOpen:false, mainMenuLazyFill:true, navSearchShowPath:true, persistSelectedTheme:true, settingsPage:{enableAbout:true, enableHeadlinesManager:false, enableHelp:true, enableLanguages:true, enableLoggerView:true, enableSignOff:true, enableUser:true, showSessionTimer:true, showEnvironment:true}}, navMenu:[], navMenuOrder:{favorites:0, recents:1, suggested:2, navigation:3}, sessionMenu:[], toolbarMenu:[], toolbarTitleImageUrl:null, enabledPlugins:[], 
availableWidgets:[], languageResources:[], headlines:[]}, setPrebootSettingsExtraFields:function(newfield) {
  if (Ext.isArray(newfield)) {
    if (newfield.length > 0 && !Ext.isArray(newfield[0])) {
      this.config.prebootSettingsExtraFields = this.config.prebootSettingsExtraFields.concat(newfield);
    }
  } else {
    this.config.prebootSettingsExtraFields.push(newfield);
  }
}, registerRightPaneTabs:function(tabs) {
  if (Ext.isArray(tabs)) {
    if (tabs.length > 0 && !Ext.isArray(tabs[0])) {
      this.config.rightPaneTabs = this.config.rightPaneTabs.concat(tabs);
    }
  } else {
    this.config.rightPaneTabs.push(tabs);
  }
}, constructor:function(config) {
  this.initConfig(config);
}, checkArray:function(item, description) {
  if (!item) {
    ABP.util.Logger.logWarn(description + ' is missing, converting to empty Array');
    return [];
  }
  if (!(item instanceof Array)) {
    ABP.util.Logger.logWarn(description + ' is not an Array, converting');
    return [item];
  }
  return item;
}, checkUrl:function(item, description) {
  var validator = new Ext.data.validator.Url;
  if (!item) {
    ABP.util.Logger.logWarn(description + ' is missing, nulling');
    return null;
  }
  if (!validator.validate(item) === true) {
    ABP.util.Logger.logWarn(description + ' is not a valid URL, nulling');
    return null;
  }
  return item;
}, checkBoolean:function(item, description, defaultValue) {
  if (typeof item === 'string' || item instanceof String) {
    switch(item.toLowerCase()) {
      case 'false':
      case '0':
        ABP.util.Logger.logWarn(description + ' is string value, converting to boolean.');
        return false;
      case 'true':
      case '1':
        ABP.util.Logger.logWarn(description + ' is string value, converting to boolean.');
        return true;
      default:
        ABP.util.Logger.logWarn(description + ' is not specified, using default value "' + defaultValue + '"');
        return defaultValue;
    }
  }
  if (typeof item === 'boolean' || item instanceof Boolean) {
    return item;
  }
  return defaultValue;
}, checkInteger:function(value, description, defaultValue) {
  if (Number.isInteger && Number.isInteger(value)) {
    return value;
  } else {
    if (Ext.Number.parseInt(value)) {
      ABP.util.Logger.logWarn(description + ' is not an integer value, converting to integer. Or using Internet Explorer 11 or below.');
      return Ext.Number.parseInt(value);
    } else {
      ABP.util.Logger.logWarn(description + ' is not an integer value, using default value: ' + defaultValue);
      return defaultValue;
    }
  }
}, checkString:function(item, defaultValue) {
  if (typeof item === 'string' || item instanceof String) {
    return item;
  }
  return defaultValue;
}, processBootstrapConfig:function(config) {
  var me = this;
  var i = 0;
  if (!config) {
    ABP.util.Logger.logError('Bootstrap configuration is not valid, using default configuration.');
    me.setBootstrapConfig(me.DEFAULT_BOOTSTRAP_CONFIG);
    return;
  }
  if (!config.settings) {
    ABP.util.Logger.logError('Bootstrap configuration missing settings element, using default settings configuration.');
    config.settings = me.DEFAULT_BOOTSTRAP_CONFIG.settings;
  } else {
    var settings = config.settings;
    settings.canRecoverPassword = me.checkBoolean(settings.canRecoverPassword, 'Bootstrap configuration - settings - canRecoverPassword', me.DEFAULT_BOOTSTRAP_CONFIG.settings.canRecoverPassword);
    settings.canKeepMeSignedIn = me.checkBoolean(settings.canKeepMeSignedIn, 'Bootstrap configuration - settings - canKeepMeSignedIn', me.DEFAULT_BOOTSTRAP_CONFIG.settings.canKeepMeSignedIn);
    settings.canKeepMultipleUsersSignedIn = me.checkBoolean(settings.canKeepMultipleUsersSignedIn, 'Bootstrap configuration - settings - canKeepMultipleUsersSignedIn', me.DEFAULT_BOOTSTRAP_CONFIG.settings.canKeepMultipleUsersSignedIn);
    settings.canForcePasswordChange = me.checkBoolean(settings.canForcePasswordChange, 'Bootstrap configuration - settings - canForcePasswordChange', me.DEFAULT_BOOTSTRAP_CONFIG.settings.canForcePasswordChange);
    settings.allowServiceChange = me.checkBoolean(settings.allowServiceChange, 'Bootstrap configuration - settings - allowServiceChange', me.DEFAULT_BOOTSTRAP_CONFIG.settings.allowServiceChange);
    settings.defaultLanguage = me.checkString(settings.defaultLanguage, me.DEFAULT_BOOTSTRAP_CONFIG.settings.defaultLanguage);
    ABP.util.Common.setPageLanguage(settings.defaultLanguage);
    settings.rememberEnvironment = me.checkBoolean(settings.rememberEnvironment, 'Bootstrap configuration - settings - rememberEnvironment', me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberEnvironment);
    settings.rememberLanguage = me.checkBoolean(settings.rememberLanguage, 'Bootstrap configuration - settings - rememberLanguage', me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberLanguage);
    settings.rememberPassword = me.checkBoolean(settings.rememberPassword, 'Bootstrap configuration - settings - rememberPassword', me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberPassword);
    settings.rememberUsername = me.checkBoolean(settings.rememberUsername, 'Bootstrap configuration - settings - rememberUsername', me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberUsername);
    settings.rememberPreviousServerUrls = me.checkBoolean(settings.rememberPreviousServerUrls, 'Bootstrap configuration - settings - rememberPreviousServerUrls', me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberPreviousServerUrls);
    settings.authenticationType = me.checkString(settings.authenticationType, me.DEFAULT_BOOTSTRAP_CONFIG.settings.authenticationType);
    settings.extraLoginFields = me.checkArray(settings.extraLoginFields, 'extra Login field');
    settings.showSimpleLogin = me.checkBoolean(settings.showSimpleLogin, 'Bootstrap configuration - settings - showSimpleLogin', me.DEFAULT_BOOTSTRAP_CONFIG.settings.showSimpleLogin);
  }
  if (!config.languageResources) {
    ABP.util.Logger.logError('Bootstrap configuration missing languageResources element, using default languageResources configuration.');
    config.languageResources = me.DEFAULT_BOOTSTRAP_CONFIG.languageResources;
  } else {
    config.languageResources = me.checkArray(config.languageResources, 'Bootstrap configuration - languageResources');
  }
  if (!config.branding) {
    ABP.util.Logger.logError('Bootstrap configuration missing branding element, using default branding configuration.');
    config.branding = me.DEFAULT_BOOTSTRAP_CONFIG.branding;
  }
  if (!config.availableEnvironments) {
    ABP.util.Logger.logError('Bootstrap configuration missing availableEnvironments element, using default availableEnvironments configuration.');
    config.availableEnvironments = me.DEFAULT_BOOTSTRAP_CONFIG.availableEnvironments;
  } else {
    config.availableEnvironments = me.checkArray(config.availableEnvironments, 'Bootstrap configuration - availableEnvironments');
    for (i = 0; i < config.availableEnvironments.length; ++i) {
      if (config.availableEnvironments[i].languages) {
        config.availableEnvironments[i].languages = me.checkArray(config.availableEnvironments[i].languages, 'Bootstrap configuration - availableEnvironments - available languages');
      }
    }
  }
  if (!config.defaultEnvironment) {
    ABP.util.Logger.logError('Bootstrap configuration missing defaultEnvironment element, using default defaultEnvironment configuration.');
    config.defaultEnvironment = me.DEFAULT_BOOTSTRAP_CONFIG.defaultEnvironment;
  }
  if (!config.authenticatedUserName) {
    config.authenticatedUserName = me.DEFAULT_BOOTSTRAP_CONFIG.authenticatedUserName;
  }
  if (config.offlineBootstrap) {
    ABP.util.LocalStorage.set('OfflineBootstrap', Ext.JSON.encode(config.offlineBootstrap));
    config.offlineAuthenticationType = config.offlineBootstrap.offlineAuthenticationType;
    config.hideOfflineModeToggle = config.offlineBootstrap.hideOfflineModeToggle;
    if (config.offlineBootstrap.offlineAuthenticationType === 1) {
      config.validateOfflinePassword = config.offlineBootstrap.validateOfflinePassword;
    }
  }
  this.setBootstrapConfig(config);
}, processSessionConfigMenuItems:function(navMenu, menuType, processChildren) {
  var me = this, i;
  for (i = 0; i < navMenu.length; i++) {
    navMenu[i].type = me.checkString(navMenu[i].type, 'event');
    navMenu[i].uniqueId = me.checkString(navMenu[i].uniqueId, '');
    navMenu[i].label = me.checkString(navMenu[i].label, '');
    navMenu[i].labelKey = me.checkString(navMenu[i].labelKey, '');
    navMenu[i].icon = me.checkString(navMenu[i].icon, '');
    if (navMenu[i].type === 'route') {
      navMenu[i].hash = me.checkString(navMenu[i].hash, '');
    } else {
      navMenu[i].event = me.checkString(navMenu[i].event, '');
      navMenu[i].eventArgs = me.checkArray(navMenu[i].eventArgs, 'Session configuration\x3esettings\x3e' + menuType + '\x3eeventArgs');
    }
    navMenu[i].appId = me.checkString(navMenu[i].appId, '');
    navMenu[i].activateApp = me.checkBoolean(navMenu[i].activateApp, 'Session configuration\x3esettings\x3e' + menuType + '\x3eactivateApp', true);
    navMenu[i].enabled = me.checkBoolean(navMenu[i].enabled, 'Session configuration\x3esettings\x3e' + menuType + '\x3eenabled', true);
    navMenu[i].tooltip = me.checkString(navMenu[i].tooltip, '');
    navMenu[i].tooltipKey = me.checkString(navMenu[i].tooltipKey, '');
    navMenu[i].shorthand = me.checkString(navMenu[i].shorthand, '');
    if (processChildren) {
      navMenu[i].children = me.checkArray(navMenu[i].children, 'Session configuration\x3e' + menuType + '\x3echildren');
      if (navMenu[i].children.length > 0) {
        navMenu[i].children = me.processSessionConfigMenuItems(navMenu[i].children, menuType, processChildren);
      }
    }
  }
  return navMenu;
}, processSessionConfig:function(config) {
  var me = this;
  var currSpPointer;
  if (!config) {
    ABP.util.Logger.logError('Session configuration is not valid, using default configuration.');
    me.setBootstrapConfig(me.DEFAULT_SESSION_CONFIG);
    return;
  }
  me.loadPersonalisation();
  if (!config.settings) {
    ABP.util.Logger.logError('Session configuration missing settings element, using default settings configuration.');
    config.settings = me.DEFAULT_SESSION_CONFIG.settings;
  } else {
    var settings = config.settings;
    settings.autoHideMenu = me.checkBoolean(settings.autoHideMenu, 'Session configuration - settings - autoHideMenu', me.DEFAULT_SESSION_CONFIG.settings.autoHideMenu);
    settings.enableSearch = me.checkBoolean(settings.enableSearch, 'Session configuration - settings - enableSearch', me.DEFAULT_SESSION_CONFIG.settings.enableSearch);
    settings.startMenuHidden = me.checkBoolean(settings.startMenuHidden, 'Session configuration - settings - startMenuHidden', me.DEFAULT_SESSION_CONFIG.settings.startMenuHidden);
    settings.rememberMenuState = me.checkBoolean(settings.rememberMenuState, 'Session configuration - settings - rememberMenuState', me.DEFAULT_SESSION_CONFIG.settings.rememberMenuState);
    settings.enableWideMenu = me.checkBoolean(settings.enableWideMenu, 'Session configuration - settings - enableWideMenu', me.DEFAULT_SESSION_CONFIG.settings.enableWideMenu);
    settings.disableNavMenu = me.checkBoolean(settings.disableNavMenu, 'Session configuration - settings - disableNavMenu', me.DEFAULT_SESSION_CONFIG.settings.disableNavMenu);
    settings.enableMenuFavorites = me.checkBoolean(settings.enableMenuFavorites, 'Session configuration - settings - enableMenuFavorites', me.DEFAULT_SESSION_CONFIG.settings.enableMenuFavorites);
    settings.enableMenuPeelOff = me.checkBoolean(settings.enableMenuPeelOff, 'Session configuration - settings - enableMenuPeelOff', me.DEFAULT_SESSION_CONFIG.settings.enableMenuPeelOff);
    settings.enableMenuRecent = me.checkBoolean(settings.enableMenuRecent, 'Session configuration - settings - enableMenuRecent', me.DEFAULT_SESSION_CONFIG.settings.enableMenuRecent);
    settings.enableMenuSuggested = me.checkBoolean(settings.enableMenuSuggested, 'Session configuration - settings - enableMenuSuggested', me.DEFAULT_SESSION_CONFIG.settings.enableMenuSuggested);
    settings.enableNavSearch = me.checkBoolean(settings.enableNavSearch, 'Session configuration - settings - enableNavSearch', me.DEFAULT_SESSION_CONFIG.settings.enableNavSearch);
    settings.hideTreeNavigation = me.checkBoolean(settings.hideTreeNavigation, 'Session configuration - settings - hideTreeNavigation', me.DEFAULT_SESSION_CONFIG.settings.hideTreeNavigation);
    settings.toggleableGlobalSearchField = me.checkBoolean(settings.toggleableGlobalSearchField, 'Session configuration - settings - toggleableGlobalSearchField', me.DEFAULT_SESSION_CONFIG.settings.toggleableGlobalSearchField);
    settings.mainMenuModernFocusFirstOption = me.checkBoolean(settings.mainMenuModernFocusFirstOption, 'Session configuration - settings - mainMenuModernFocusFirstOption', me.DEFAULT_SESSION_CONFIG.settings.mainMenuModernFocusFirstOption);
    settings.mainMenuNavSearchDisableSoundex = me.checkBoolean(settings.mainMenuNavSearchDisableSoundex, 'Session configuration - settings - mainMenuNavSearchDisableSoundex', me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchDisableSoundex);
    settings.mainMenuNavSearchDuplicateFields = me.checkString(settings.mainMenuNavSearchDuplicateFields, me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchDuplicateFields);
    settings.mainMenuNavSearchDisableRelevance = me.checkBoolean(settings.mainMenuNavSearchDisableRelevance, 'Session configuration - settings - mainMenuNavSearchDisableRelevance', me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchDisableRelevance);
    settings.mainMenuNavSearchResultsMax = me.checkInteger(settings.mainMenuNavSearchResultsMax, 'Session configuration - settings - mainMenuNavSearchResultsMax', me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchResultsMax);
    settings.mainMenuLazyFill = me.checkBoolean(settings.mainMenuLazyFill, 'Session configuration - settings - mainMenuLazyFill', me.DEFAULT_SESSION_CONFIG.settings.mainMenuLazyFill);
    settings.mainMenuRecentMaxShown = me.checkInteger(settings.mainMenuRecentMaxShown, 'Session configuration - settings - mainMenuRecentMaxShown', me.DEFAULT_SESSION_CONFIG.settings.mainMenuRecentMaxShown);
    settings.mainMenuSingleExpand = me.checkBoolean(settings.mainMenuSingleExpand, 'Session configuration - settings - mainMenuSingleExpand', me.DEFAULT_SESSION_CONFIG.settings.mainMenuSingleExpand);
    settings.mainMenuSuggestedAutoExpand = me.checkBoolean(settings.mainMenuSuggestedAutoExpand, 'Session configuration - settings - mainMenuSuggestedAutoExpand', me.DEFAULT_SESSION_CONFIG.settings.mainMenuSuggestedAutoExpand);
    settings.mainMenuStartFavoritesOpen = me.checkBoolean(settings.mainMenuStartFavoritesOpen, 'Session configuration - settings - mainMenuStartFavoritesOpen', me.DEFAULT_SESSION_CONFIG.settings.mainMenuStartFavoritesOpen);
    settings.navSearchShowPath = me.checkBoolean(settings.navSearchShowPath, 'Session configuration - settings - navSearchShowPath', me.DEFAULT_SESSION_CONFIG.settings.navSearchShowPath);
    settings.persistSelectedTheme = me.checkBoolean(settings.persistSelectedTheme, 'Session configuration - settings - persistSelectedTheme', me.DEFAULT_SESSION_CONFIG.settings.persistSelectedTheme);
    if (!settings.notifications) {
      settings.notifications = me.DEFAULT_SESSION_CONFIG.settings.notifications;
    } else {
      settings.notifications.enabled = me.checkBoolean(settings.notifications.enabled, 'Session configuration - settings - notifications - enabled', me.DEFAULT_SESSION_CONFIG.settings.notifications.enabled);
      settings.notifications.maxHistory = me.checkInteger(settings.notifications.maxHistory, 'Session configuration - settings - notifications - maxHistory', me.DEFAULT_SESSION_CONFIG.settings.notifications.maxHistory);
      settings.notifications.clearBadgeOnActivate = me.checkBoolean(settings.notifications.clearBadgeOnActivate, 'Session configuration - settings - notifications - clearBadgeOnActivate', me.DEFAULT_SESSION_CONFIG.settings.notifications.clearBadgeOnActivate);
      settings.notifications.sources = me.checkArray(settings.notifications.sources, 'Session configuration - settings - notifications - sources');
    }
    if (!settings.favorites || Ext.isArray(settings.favorites) || Ext.isString(settings.favorites)) {
      settings.favorites = {favoriteItems:settings.favorites, allowItemRename:true, depthLimit:0};
    } else {
      if (Ext.isObject(settings.favorites)) {
        if (settings.favorites.depthLimit && settings.favorites.depthLimit > 2) {
          ABP.util.Logger.logWarn('favorites.depthLimit must be equal to 0, 1 or 2. Setting default value of 0 (unlimited folder depth)');
          settings.favorites.depthLimit = 0;
        }
      }
    }
    if (!settings.rightPane) {
      settings.rightPane = me.DEFAULT_SESSION_CONFIG.settings.rightPane;
    }
    if (settings.enableSearch) {
      if (!settings.searchInfo) {
        ABP.util.Logger.logError('Session configuration missing searchInfo element, using default searchInfo configuration.');
        settings.searchInfo = me.DEFAULT_SESSION_CONFIG.settings.searchInfo;
      } else {
        settings.searchInfo = me.checkArray(settings.searchInfo, 'Session configuration - settings - searchInfo');
      }
      settings.defaultSearch = me.checkString(settings.defaultSearch, me.DEFAULT_SESSION_CONFIG.settings.defaultSearch);
    }
    if (settings.settingsPage) {
      if (settings.settingsPage.enableUser !== undefined) {
        currSpPointer = settings.settingsPage.enableUser;
      } else {
        if (settings.enableUser !== undefined) {
          currSpPointer = settings.enableUser;
        } else {
          currSpPointer = settings.settingsPage.enableUser;
        }
      }
      settings.settingsPage.enableUser = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableUser', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableUser);
      if (settings.settingsPage.enableHeadlinesManager !== undefined) {
        currSpPointer = settings.settingsPage.enableHeadlinesManager;
      } else {
        if (settings.enableHeadlinesManager !== undefined) {
          currSpPointer = settings.enableHeadlinesManager;
        } else {
          currSpPointer = settings.settingsPage.enableHeadlinesManager;
        }
      }
      settings.settingsPage.enableHeadlinesManager = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableHeadlinesManager', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableHeadlinesManager);
      if (settings.settingsPage.enableHelp !== undefined) {
        currSpPointer = settings.settingsPage.enableHelp;
      } else {
        if (settings.enableHelp !== undefined) {
          currSpPointer = settings.enableHelp;
        } else {
          currSpPointer = settings.settingsPage.enableHelp;
        }
      }
      settings.settingsPage.enableHelp = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableHelp', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableHelp);
      if (settings.settingsPage.enableAbout !== undefined) {
        currSpPointer = settings.settingsPage.enableAbout;
      } else {
        if (settings.enableAbout !== undefined) {
          currSpPointer = settings.enableAbout;
        } else {
          currSpPointer = settings.settingsPage.enableAbout;
        }
      }
      settings.settingsPage.enableAbout = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableAbout', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableAbout);
      if (settings.settingsPage.enableSignOff !== undefined) {
        currSpPointer = settings.settingsPage.enableSignOff;
      } else {
        if (settings.enableSignOff !== undefined) {
          currSpPointer = settings.enableSignOff;
        } else {
          currSpPointer = settings.settingsPage.enableSignOff;
        }
      }
      settings.settingsPage.enableSignOff = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableSignOff', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableSignOff);
      if (settings.settingsPage.enableLoggerView !== undefined) {
        currSpPointer = settings.settingsPage.enableLoggerView;
      } else {
        if (settings.enableLoggerView !== undefined) {
          currSpPointer = settings.enableLoggerView;
        } else {
          currSpPointer = settings.settingsPage.enableLoggerView;
        }
      }
      settings.settingsPage.enableLoggerView = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableLoggerView', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLoggerView);
      if (settings.settingsPage.enableLanguages !== undefined) {
        currSpPointer = settings.settingsPage.enableLanguages;
      } else {
        if (settings.enableLanguages !== undefined) {
          currSpPointer = settings.enableLanguages;
        } else {
          currSpPointer = settings.settingsPage.enableLanguages;
        }
      }
      settings.settingsPage.enableLanguages = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - enableLanguages', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLanguages);
      if (settings.settingsPage.showSessionTimer !== undefined) {
        currSpPointer = settings.settingsPage.showSessionTimer;
      } else {
        if (settings.showSessionTimer !== undefined) {
          currSpPointer = settings.showSessionTimer;
        } else {
          currSpPointer = settings.settingsPage.showSessionTimer;
        }
      }
      settings.settingsPage.showSessionTimer = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - showSessionTimer', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showSessionTimer);
      if (settings.settingsPage.showEnvironment !== undefined) {
        currSpPointer = settings.settingsPage.showEnvironment;
      } else {
        if (settings.showEnvironment !== undefined) {
          currSpPointer = settings.showEnvironment;
        } else {
          currSpPointer = settings.settingsPage.showEnvironment;
        }
      }
      settings.settingsPage.showEnvironment = me.checkBoolean(currSpPointer, 'Session configuration - settings - settingsPage - showEnvironment', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showEnvironment);
    } else {
      settings.settingsPage = {};
      settings.settingsPage.enableUser = me.checkBoolean(settings.enableUser, 'Session configuration - settings - settingsPage - enableUser', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableUser);
      settings.settingsPage.enableHelp = me.checkBoolean(settings.enableHelp, 'Session configuration - settings - settingsPage - enableHelp', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableHelp);
      settings.settingsPage.enableAbout = me.checkBoolean(settings.enableAbout, 'Session configuration - settings - settingsPage - enableAbout', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableAbout);
      settings.settingsPage.enableSignOff = me.checkBoolean(settings.enableSignOff, 'Session configuration - settings - settingsPage - enableSignOff', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableSignOff);
      settings.settingsPage.enableLoggerView = me.checkBoolean(settings.enableLoggerView, 'Session configuration - settings - settingsPage - enableLoggerView', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLoggerView);
      settings.settingsPage.enableLanguages = me.checkBoolean(settings.enableLanguages, 'Session configuration - settings - settingsPage - enableLanguages', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLanguages);
      settings.settingsPage.showSessionTimer = me.checkBoolean(settings.showSessionTimer, 'Session configuration - settings - settingsPage - showSessionTimer', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showSessionTimer);
      settings.settingsPage.showEnvironment = me.checkBoolean(settings.showEnvironment, 'Session configuration - settings - settingsPage - showEnvironment', me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showEnvironment);
    }
    settings.layoutPersistance = me.checkString(settings.layoutPersistance, me.DEFAULT_SESSION_CONFIG.settings.layoutPersistance);
    if (!settings.userConfig) {
      ABP.util.Logger.logWarn('Session configuration missing settings.userConfig element, using default userConfig.');
      settings.userConfig = me.DEFAULT_SESSION_CONFIG.settings.userConfig;
    } else {
      settings.userConfig.displayName = me.checkString(settings.userConfig.displayName, me.DEFAULT_SESSION_CONFIG.settings.userConfig.displayName);
      if (settings.userConfig.photo) {
        ABP.util.LocalStorage.setForLoggedInUser('Photo', settings.userConfig.photo);
      }
    }
    settings.toolbarTitleShowBranding = settings.toolbarTitleShowBranding === false ? false : me.DEFAULT_SESSION_CONFIG.settings.toolbarTitleShowBranding;
  }
  if (!config.navMenu) {
    ABP.util.Logger.logError('Session configuration missing navMenu element, using default navMenu configuration.');
    config.navMenu = me.DEFAULT_SESSION_CONFIG.navMenu;
  } else {
    config.navMenu = me.checkArray(config.navMenu, 'Session configuration - navMenu');
    config.navMenu = me.processSessionConfigMenuItems(config.navMenu, 'navMenu', true);
  }
  if (!config.navMenuOrder) {
    config.navMenuOrder = me.DEFAULT_SESSION_CONFIG.navMenuOrder;
  } else {
    config.navMenuOrder = me.processNavMenuOrder(config.navMenuOrder);
  }
  if (!config.firstMenuAtTop) {
    config.firstMenuAtTop = false;
  }
  if (!config.sessionMenu) {
    ABP.util.Logger.logError('Session configuration missing sessionMenu element, using default sessionMenu configuration.');
    config.sessionMenu = me.DEFAULT_SESSION_CONFIG.sessionMenu;
  } else {
    config.sessionMenu = me.checkArray(config.sessionMenu, 'Session configuration - sessionMenu');
    config.sessionMenu = me.processSessionConfigMenuItems(config.sessionMenu, 'sessionMenu', false);
  }
  if (!config.toolbarMenu) {
    ABP.util.Logger.logError('Session configuration missing toolbarMenu element, using default toolbarMenu configuration.');
    config.toolbarMenu = me.DEFAULT_SESSION_CONFIG.toolbarMenu;
  } else {
    config.toolbarMenu = me.checkArray(config.toolbarMenu, 'Session configuration - toolbarMenu');
    config.toolbarMenu = me.processSessionConfigMenuItems(config.toolbarMenu, 'toolbarMenu', false);
  }
  if (!config.toolbarTitleImageUrl) {
    config.toolbarTitleImageUrl = me.DEFAULT_SESSION_CONFIG.toolbarTitleImageUrl;
  }
  if (!config.enabledPlugins) {
    ABP.util.Logger.logInfo('Session configuration missing enabledPlugins element, using default enabledPlugins configuration.');
    config.enabledPlugins = me.DEFAULT_SESSION_CONFIG.enabledPlugins;
  } else {
    config.enabledPlugins = me.checkArray(config.enabledPlugins, 'Session configuration - enabledPlugins');
  }
  if (!config.availableWidgets) {
    ABP.util.Logger.logInfo('Session configuration missing availableWidgets element, using default availableWidgets configuration.');
    config.availableWidgets = me.DEFAULT_SESSION_CONFIG.availableWidgets;
  } else {
    config.availableWidgets = me.checkArray(config.availableWidgets, 'Session configuration - availableWidgets');
  }
  if (!config.languageResources) {
    ABP.util.Logger.logInfo('Session configuration missing languageResources element, using default languageResources configuration.');
    config.languageResources = me.DEFAULT_SESSION_CONFIG.languageResources;
  } else {
    config.languageResources = me.checkArray(config.languageResources, 'Session configuration - languageResources');
  }
  if (config.offlineConfiguration) {
    ABP.util.LocalStorage.setForLoggedInUser('OfflineConfiguration', Ext.JSON.encode(config.offlineConfiguration));
  }
  this.setSessionConfig(config);
}, isPreAuthenticated:function() {
  var bc = this.getBootstrapConfig();
  if (bc && bc.authenticatedUserName) {
    return true;
  }
  return false;
}, isDesktop:function() {
  var ua = navigator.userAgent.toLowerCase();
  var isMobile = ua.indexOf('mobile') > -1;
  var isAndroid = ua.indexOf('android') > -1;
  var isWinTab = ua.indexOf('windows nt') > -1 && ua.indexOf('touch') > -1;
  var ret = true;
  if (!isWinTab) {
    if (ua.indexOf('windows nt') > -1) {
      try {
        document.createEvent('TouchEvent');
        isWinTab = true;
      } catch (e$3) {
      }
    }
  }
  if (isMobile || isAndroid || isWinTab) {
    ret = false;
  }
  return ret;
}, getSessionId:function() {
  var me = this;
  var sess = me._sessionId;
  var ret;
  if (!Ext.isObject(sess)) {
    ret = sess;
  } else {
    ret = sess.access_token;
  }
  return ret;
}, getOAuthInfo:function() {
  return this._sessionId;
}, getSessionURL:function(appendChar) {
  var me = this;
  var sess = me._sessionId;
  var aC = appendChar || '\x26';
  if (Ext.isString(sess)) {
    return aC + 'sessionId\x3d' + sess;
  } else {
    return '';
  }
}, checkHostNameMatch:function(url) {
  var hostname = window.location.hostname;
  var parser = document.createElement('a');
  parser.href = url;
  return parser.hostname === hostname;
}, injectConfig:function(config) {
  config.settings.searchInfo.unshift({'id':'Global', 'name':'Global', 'appId':'Respondv6', 'event':'searchGlobal', 'minLength':0, 'minLengthError':'Respond_Search_QuickSearchMinimumFilterLengthError'});
}, addPackageConfig:function(packageName, packageConfig) {
  this._sessionConfig[packageName] = packageConfig;
}, privates:{supportMultipleLanguages:function(environments) {
  if (!environments) {
    return false;
  }
  for (var i = 0; i < environments.length; i++) {
    if (environments[i].languages && environments[i].languages.length > 1) {
      return true;
    }
  }
  return false;
}, loadPersonalisation:function() {
  var me = this;
  me.DEFAULT_SESSION_CONFIG.settings.defaultSearch = ABP.util.LocalStorage.getForLoggedInUser('DefaultSearch');
}, getDisplayNameInitials:function() {
  var me = this, displayName = me.getSessionConfig().settings.userConfig.displayName, names = null;
  if (displayName) {
    names = displayName.split(' ');
    return Ext.Array.map(names, function(n) {
      return n[0];
    }).join('').substring(0, 2).toUpperCase();
  }
  return null;
}, processNavMenuOrder:function(menuOrder) {
  var me = this;
  var undefinedValues = false;
  var defaultOrder = me.DEFAULT_SESSION_CONFIG.navMenuOrder;
  var range = Object.keys(defaultOrder).length;
  var highestOrdinal = 0;
  var ordinalsUsed = [];
  for (var property in defaultOrder) {
    if (menuOrder.hasOwnProperty(property)) {
      if (Ext.isEmpty(menuOrder[property])) {
        undefinedValues = true;
        continue;
      } else {
        if (!Ext.isNumber(menuOrder[property]) || menuOrder[property] >= range) {
          ABP.util.Logger.logError('Nav menu order is incorrect, using default. ' + menuOrder[property] + ' is not a number or outside range');
          return defaultOrder;
        } else {
          if (ordinalsUsed.indexOf(menuOrder[property]) > -1) {
            ABP.util.Logger.logError(Ext.String.format('Nav menu order is incorrect, using the default order. Duplicate position found for {0}:{1}', property, menuOrder[property]));
            return defaultOrder;
          } else {
            ordinalsUsed.push(menuOrder[property]);
            if (menuOrder[property] > highestOrdinal) {
              highestOrdinal = menuOrder[property];
            }
          }
        }
      }
    } else {
      menuOrder[property] = null;
    }
  }
  if (undefinedValues) {
    for (var property in defaultOrder) {
      if (Ext.isEmpty(menuOrder[property])) {
        highestOrdinal += 1;
        menuOrder[property] = highestOrdinal;
      }
    }
  }
  return menuOrder;
}, getDisplayName:function() {
  var me = this;
  if (me.getSessionConfig().settings.userConfig && me.getSessionConfig().settings.userConfig.displayName) {
    return me.getSessionConfig().settings.userConfig.displayName;
  }
  return me.getUsername();
}, getProfilePicture:function() {
  var me = this;
  return me.getSessionConfig().settings.userConfig.photo;
}, updateLanguage:function(lang) {
  ABP.util.Common.setPageLanguage(lang);
}, canGlobalSearchToggle:function() {
  var canToggle = this.getSessionConfig().settings.toggleableGlobalSearchField;
  if (Ext.isBoolean(canToggle)) {
    return canToggle;
  } else {
    return true;
  }
}}});
Ext.define('ABP.util.Constants', {statics:{BASE_FONT:'roboto, opensans, arial', RESPONSIVE_SNAPPOINT_WIDTH:510, REQUIRED_FIELD_LABEL_INCREMENT:10, GRAPH_COLORS:['#B23875', '#00E5D3', '#B488FA', '#12AEED', '#FF990A', '#FF366C', '#21C042', '#4328B7'], CHART_COLORS:{victoria:'#4328B7', meadow:'#21C042', radicalRed:'#FF366C', california:'#FF990A', cerulean:'#12AEED', mauve:'#B488FA', neptune:'#00E5D3', viola:'#B23875', red:'#C90813'}, AUTOMATION_CLASS_REGEX:/\b(a-[a-zA-Z0-9-]+)\b/gm, colors:{AlertRed:'#BD202E', 
WarningOrange:'#F7941E', ListHeader:'#969290', BodyBackground:'#E6E6E6', BodyColor:'#333333', Black:'#000000', White:'#FFFFFF', Blue:'#1284c7', Green:'#87B840', Text:'#33363a', Text:'#33363a', LightText:'#49575B', AxisText:'#59686C', LightGreen:'#8cc640'}, badgePriority:{Alert:'#C90813', Warning:'#EC641F', Success:'#0B9B29', Info:'#30ACDE'}, login:{loginAsUserLifetime:60}, loadingLinesHtml:'\x3cdiv class\x3d"abp-loadmask loading-bars"\x3e\x3cdiv class\x3d"bars slim"\x3e \x3cdiv class\x3d"rect1"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect2"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect3"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect4"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect5"\x3e\x3c/div\x3e \x3c/div\x3e\x3c/div\x3e'}});
Ext.define('ABP.util.Currency', {singleton:true, requires:['ABP.util.Logger'], removeCents:function(amountValue) {
  return Ext.util.Format.currency(amountValue, Ext.util.Format.currencySign, 0);
}, cents:function(amountValue) {
  var value = Ext.util.Format.currency(amountValue);
  var parts = value.split(Ext.util.Format.decimalSeparator);
  if (parts.length >= 2) {
    return parts[1];
  } else {
    return Ext.util.Format.decimalSeparator + '00';
  }
}, abvFormat:function(data) {
  var value = Ext.util.Format.currency(data, Ext.util.Format.currencySign, 0);
  if (value > 100000) {
    value = value.substr(0, value.length - 4) + 'k';
  }
  return value;
}});
Ext.define('ABP.util.Date', {singleton:true, requires:['ABP.util.Logger'], config:{formats:['Y-m-d H:i:s', 'Y-m-d', 'h:i:s', 'H:i:s', 'n/j/Y', 'l, F d, Y', 'l, F d, Y g:i:s A', 'F d', 'g:i A', 'g:i:s A', 'Y-m-d\\TH:i:s', 'Y-m-d H:i:sO', 'F, Y', 'c']}, constructor:function(config) {
  this.initConfig(config);
}, parse:function(str) {
  if (Ext.isDate(str)) {
    return str;
  }
  if (Number.isInteger(str)) {
    return new Date(str);
  }
  if (Ext.Number.parseInt(str)) {
    return new Date(Ext.Number.parseInt(str));
  }
  var d = null;
  var formats = this.getFormats();
  for (var i = 0; i < formats.length; i++) {
    d = Ext.Date.parse(str, formats[i]);
    if (d) {
      return d;
    }
  }
  return false;
}});
Ext.define('ABP.util.Discovery', {singleton:true, discoverUrl:'https://apteancustomermanagement.azurewebsites.net/abp/discover', discover:function(email, failure) {
  var org = '';
  if (email.indexOf('@') < 0) {
    org = email;
    email = '';
  }
  failure = failure || Ext.emptyFn;
  var me = this;
  Ext.Ajax.request({url:me.discoverUrl, method:'GET', params:{org:org, email:email}, success:function(result) {
    var responseText = result.responseText;
    if (Ext.isString(responseText)) {
      try {
        var customer = Ext.decode(responseText);
        if (customer) {
          me.setServiceUrls(customer);
          me.__redirectForCustomer(customer);
        }
      } catch (ex) {
        failure('Error processing returned discover response');
        return;
      }
    }
  }, failure:function(result) {
    failure(result.responseText);
  }});
}, discoverUserInfo:function(org, id_token, success, failure) {
  failure = failure || Ext.emptyFn;
  var me = this;
  Ext.Ajax.request({url:me.discoverUrl, method:'GET', params:{org:org, email:''}, success:function(result) {
    var responseText = result.responseText;
    if (Ext.isString(responseText)) {
      try {
        var customer = Ext.decode(responseText);
        if (customer) {
          me.__getWellKnownMetadata(customer, function(wellKnown) {
            me.__getAuthorizedUserInfo(wellKnown.userinfo_endpoint, id_token, success);
          });
        }
      } catch (ex) {
        window.location = document.location.origin + '/#error\x3d' + encodeURIComponent('Error processing returned discover response');
        return;
      }
    }
  }});
}, privates:{setServiceUrls:function(customer) {
  Ext.Array.each(customer.subscriptions, function(subscription) {
    ABPServiceManager.setServiceUrl(subscription.product, subscription.endpoint);
  });
}, __getWellKnownMetadata:function(customer, success) {
  var authDetails = customer.authentication;
  customer.serviceEndpoint = 'http://dga1app02comtech:8080/api/v1';
  ABP.util.LocalStorage.set('ServerUrl', customer.serviceEndpoint);
  if (authDetails) {
    authDetails = Ext.isArray(authDetails) ? authDetails[0] : authDetails;
    if (authDetails.metadataUrl) {
      Ext.Ajax.request({method:'GET', url:authDetails.metadataUrl, success:function(response) {
        var responseText = response.responseText;
        if (Ext.isString(responseText)) {
          var metadata = Ext.decode(responseText);
          if (metadata) {
            success(metadata);
          }
        }
      }});
    }
  }
}, __getAuthorizedUserInfo:function(url, id_token, success) {
  var me = this;
  Ext.Ajax.request({method:'GET', url:url, headers:{'Authorization':'Bearer ' + id_token}, success:function(response) {
    var responseText = response.responseText;
    if (Ext.isString(responseText)) {
      var user = Ext.decode(responseText);
      if (success) {
        success(user);
      }
    }
  }});
}, __redirectForCustomer:function(customer) {
  var me = this;
  var authDetails = customer.authentication;
  customer.serviceEndpoint = 'http://dga1app02comtech:8080/api/v1';
  ABP.util.LocalStorage.set('ServerUrl', customer.serviceEndpoint);
  if (authDetails) {
    authDetails = Ext.isArray(authDetails) ? authDetails[0] : authDetails;
    if (authDetails.metadataUrl) {
      Ext.Ajax.request({method:'GET', url:authDetails.metadataUrl, success:function(response) {
        var responseText = response.responseText;
        if (Ext.isString(responseText)) {
          var metadata = Ext.decode(responseText);
          if (metadata) {
            me.__redirectForWellKnown(customer, authDetails, metadata);
          }
        }
      }});
    }
  }
}, __redirectForWellKnown:function(customer, authDetails, metadata) {
  var supportsOidc = metadata.scopes_supported.indexOf('openid') >= 0;
  var supportsProfile = metadata.scopes_supported.indexOf('profile') >= 0;
  var scope = 'openid';
  if (!metadata.scopes_supported.indexOf('openid')) {
  }
  if (metadata.scopes_supported.indexOf('profile') >= 0) {
    scope += ' profile';
  }
  window.location = metadata.authorization_endpoint + '?' + Ext.Object.toQueryString({response_type:'id_token', client_id:authDetails.clientId, scope:scope, redirect_uri:document.location.origin, nonce:ABP.util.Jwt.getNonce()});
}}});
Ext.define('ABP.util.Events', {singleton:true, alternateClassName:'ABP.Events', signOut:'main_DestroySession', showSettings:'featureCanvas_showSetting', switchLanguage:'main_switchLanguage', setRoute:'container_setRoute', addDefaultLanguageStrings:'main_addDefaultLanguageStrings', updateLanguageStrings:'main_updateLanguageStrings', pendingChanges:'main_pendingChanges', menuToggle:'session_toggleMenu', menuShow:'session_openMenu', menuHide:'session_closeMenu', menuToggleNav:'mainMenu_toggleNav', menuEnableOption:'mainMenu_enableMenuOption', 
menuAddOption:'mainMenu_addMenuOption', menuRemoveOption:'mainMenu_removeMenuOption', menuUpdateCount:'mainMenu_updateMenuCount', menuAddRecent:'mainMenu_addRecent', menuAddFavorite:'mainMenu_addFavorite', menuRemoveFavorite:'mainMenu_removeFavorite', menuUpdateFavorites:'mainmenu_updateFavorites', favoritesUpdated:'favorites_updated', menuFocusFavorites:'mainmenu_focusFavorites', menuReplaceSuggested:'mainMenu_replaceSuggested', menuAddTreeItems:'mainMenu_addTreeOption', menuRemoveTreeItem:'mainMenu_removeTreeOption', 
toolbarSetTitle:'toolbar_setTitle', toolbarAddButton:'toolbar_addButton', toolbarRemoveButton:'toolbar_removeButton', toolbarOpenSearch:'toolbar_openSearch', rightPaneToggle:'rightPane_toggle', rightPaneToggleTab:'rightPane_toggleTab', rightPaneAddElement:'rightPane_addElement', rightPaneShowButton:'toolbar_setVisibilityRightPaneButton', rightPaneInitTab:'rightPane_initTab', rightPaneUpdateBadge:'toolbar_updateBadge', rightPaneIncrementBadge:'toolbar_incrementBadge', rightPaneDecrementBadge:'toolbar_decrementBadge', 
rightPaneClearBadge:'toolbar_clearBadge', notificationsAdd:'abp_notifications_add', notificationsRemove:'abp_notifications_remove', notificationsRead:'abp_notifications_read', notificationsUnread:'abp_notifications_unread', globalSearchSuggestions:'abp_search_suggestions', headlinesShow:'abp_headlines_show', headlinesHide:'abp_headlines_hide', thumbbarShow:'thumbbar_show', thumbbarHide:'thumbbar_hide', userProfileEdit:'user_profile_edit'});
Ext.define('ABP.util.IdCreator', {singleton:true, config:{currentId:0}, constructor:function(config) {
  this.initConfig(config);
}, getId:function(config) {
  var objToPass = {appId:config.appId, type:config.type, activateApp:config.activateApp};
  if (config.type === 'event') {
    objToPass.event = config.event;
    objToPass.eventArgs = config.eventArgs;
  } else {
    if (config.type === 'route') {
      objToPass.hash = config.hash;
    }
  }
  var serialized = this.serialize(objToPass);
  var hashed = ABP.util.Sha256.sha256(serialized);
  return hashed;
}, privates:{serialize:function(object) {
  var type;
  var serialized = '';
  for (var element in object) {
    if (object[element]) {
      type = typeof element;
      serialized += '[' + type + ':' + element + ':' + object[element].toString() + ']';
    }
  }
  return serialized;
}}});
Ext.define('ABP.util.Jwt', {singleton:true, isJwt:function(tokenString) {
  try {
    jwt_decode(tokenString);
  } catch (ex) {
    return false;
  }
  return true;
}, getPayload:function(tokenString) {
  return jwt_decode(tokenString);
}, getNonce:function() {
  var nonce = this.randomString(16);
  ABP.util.LocalStorage.set('nonce', nonce);
  return nonce;
}, validateNonce:function(nonce) {
  var isValid = false;
  if (ABP.util.LocalStorage.get('nonce') === nonce) {
    isValid = true;
  }
  ABP.util.LocalStorage.set('nonce', '');
  return isValid;
}, privates:{randomString:function(length) {
  var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
  result = '';
  while (length > 0) {
    var bytes = new Uint8Array(16);
    var random = window.crypto.getRandomValues(bytes);
    random.forEach(function(c) {
      if (length == 0) {
        return;
      }
      if (c < charset.length) {
        result += charset[c];
        length--;
      }
    });
  }
  return result;
}}});
Ext.define('ABP.util.Keyboard', {singleton:true, focus:function(selector) {
  var cmps = Ext.query(selector, false);
  if (cmps && cmps.length > 0) {
    var extCmp = Ext.getCmp(cmps[0].id);
    if (extCmp) {
      Ext.getCmp(extCmp.id).focus(50);
      return true;
    } else {
      for (i = 0; i < cmps.length; i++) {
        if (!cmps[i].hasCls('x-tab-guard')) {
          if (cmps[i].focus) {
            cmps[i].focus();
            return true;
          }
        }
      }
    }
  }
  return false;
}});
Ext.define('ABP.util.LocalStorage', {singleton:true, prefix:'ABP_', userToken:'_Env-\\[(.*)]_User-\\[(.*?)]__', userToken3:'_Env-(.*)_User-(.*?)__', usernameKey:'Username', storageVersion:'4', storageVersionKey:'LocalStorageVersion', storageVersionUserKey:'LocalStorageUserVersion', constructor:function() {
  this.upgradeStorage();
}, get:function(key) {
  if (this.localStorageAvailable()) {
    var value = localStorage.getItem(this.prefix + key);
    return value;
  }
  return '';
}, set:function(key, value) {
  if (this.localStorageAvailable()) {
    localStorage.setItem(this.prefix + key, value);
  }
}, remove:function(key) {
  if (this.localStorageAvailable()) {
    localStorage.removeItem(this.prefix + key);
  }
}, contains:function(key) {
  if (this.localStorageAvailable()) {
    return localStorage.getItem(this.prefix + key) === null ? false : true;
  }
  return false;
}, getForLoggedInUser:function(key) {
  if (this.localStorageAvailable()) {
    var value = localStorage.getItem(this.getLoggedInUserStoragePrefix() + key);
    return value;
  }
  return '';
}, setForLoggedInUser:function(key, value) {
  if (this.localStorageAvailable()) {
    localStorage.setItem(this.getLoggedInUserStoragePrefix() + key, value);
  }
}, removeForLoggedInUser:function(key) {
  if (this.localStorageAvailable()) {
    localStorage.removeItem(this.getLoggedInUserStoragePrefix() + key);
  }
}, containsForLoggedInUser:function(key) {
  if (this.localStorageAvailable()) {
    return localStorage.getItem(this.getLoggedInUserStoragePrefix() + key) === null ? false : true;
  }
  return false;
}, getForUser:function(env, user, key) {
  if (this.localStorageAvailable()) {
    var value = localStorage.getItem(this.getUserStoragePrefix(env, user) + key);
    return value;
  }
  return '';
}, setForUser:function(env, user, key, value) {
  if (this.localStorageAvailable()) {
    localStorage.setItem(this.getUserStoragePrefix(env, user) + key, value);
  }
}, removeForUser:function(env, user, key) {
  if (this.localStorageAvailable()) {
    localStorage.removeItem(this.getUserStoragePrefix(env, user) + key);
  }
}, removeAllForUser:function(env, user) {
  if (this.localStorageAvailable()) {
    var userPrefix = this.getUserStoragePrefix(env, user);
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && Ext.String.startsWith(key, userPrefix)) {
        localStorage.removeItem(key);
        i--;
      }
    }
  }
}, containsForUser:function(env, user, key) {
  if (this.localStorageAvailable()) {
    return localStorage.getItem(this.getUserStoragePrefix(env, user) + key) === null ? false : true;
  }
  return false;
}, getUserData:function(includeUsersFromUnknownEnvironments) {
  var users;
  if (this.localStorageAvailable()) {
    var envStore = Ext.data.StoreManager.lookup('ABPEnvironmentStore');
    var re = new RegExp('^' + this.prefix + this.userToken);
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var matchResult = key.match(re);
      if (matchResult) {
        var env = matchResult[1];
        var user = matchResult[2];
        if (user) {
          user = user.toLowerCase();
        }
        var itemKey = matchResult.input.replace(matchResult[0], '');
        var itemValue = localStorage.getItem(localStorage.key(i));
        if (!users) {
          users = [];
        }
        var found = false;
        for (var j = 0; j < users.length; j++) {
          if (users[j].env === env && users[j].user === user) {
            found = true;
            break;
          }
        }
        if (!found) {
          if (envStore) {
            var envRec = envStore.getById(env);
            if (!envRec && !includeUsersFromUnknownEnvironments) {
              continue;
            }
          } else {
            if (!includeUsersFromUnknownEnvironments) {
              continue;
            }
          }
          users.push({env:env, user:user, username:user, data:{}});
        }
        if (itemKey == this.usernameKey) {
          users[j].username = itemValue;
        } else {
          users[j].data[itemKey] = itemValue;
        }
      }
    }
    return users;
  }
  return users;
}, upgradeUserStorage:function() {
  try {
    if (this.localStorageAvailable()) {
      var currentUserStorageVersion = this.get(this.storageVersionUserKey);
      if (!currentUserStorageVersion || currentUserStorageVersion != this.storageVersion) {
        if (!currentUserStorageVersion) {
          var st = this.get('ABPActionCenter_Layout');
          if (st !== null) {
            this.setForLoggedInUser('ABPActionCenter_Layout', st);
            this.remove('ABPActionCenter_Layout');
          }
        }
        this.set(this.storageVersionUserKey, this.storageVersion);
      }
    }
  } catch (err) {
    console.log(err);
  }
}, localStorageWritable:function() {
  try {
    if (this.localStorageAvailable(true)) {
      localStorage.setItem(this.prefix + 'WriteTest', 'test');
      localStorage.removeItem(this.prefix + 'WriteTest');
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return false;
}, privates:{localStorageAvailable:function(logError) {
  try {
    return window.localStorage !== undefined && window.localStorage !== null;
  } catch (err) {
    if (logError) {
      console.log(err);
    }
    return false;
  }
}, getLoggedInUserStoragePrefix:function() {
  var env = ABP.util.Config.getEnvironment() || '';
  var user = ABP.util.Config.getUsername() || '';
  return this.prefix + this.getUserToken(env, user);
}, getUserStoragePrefix:function(env, user) {
  return this.prefix + this.getUserToken(env, user);
}, getUserToken:function(env, user) {
  if (user) {
    user = user.toLowerCase();
  }
  var userToken = this.userToken.replace(new RegExp('\\\\', 'g'), '').replace('\\[', '[').replace('(.*)', env ? env : '_Anonymous_').replace('(.*?)', user ? user : '_Anonymous_');
  return userToken;
}, upgradeStorage:function() {
  try {
    if (this.localStorageAvailable()) {
      var currentStorageVersion = this.get(this.storageVersionKey);
      if (!currentStorageVersion || currentStorageVersion != this.storageVersion) {
        if (!currentStorageVersion) {
        } else {
          if (currentStorageVersion == '3') {
            var changes = [];
            var re = new RegExp('^' + this.prefix + this.userToken3);
            for (var i = 0; i < localStorage.length; i++) {
              var key = localStorage.key(i);
              var matchResult = key.match(re);
              if (matchResult) {
                var env = matchResult[1];
                var user = matchResult[2];
                if (user) {
                  user = user.toLowerCase();
                }
                var itemKey = matchResult.input.replace(matchResult[0], '');
                var itemValue = localStorage.getItem(localStorage.key(i));
                changes.push({env:env, user:user, itemKey:itemKey, itemValue:itemValue, oldKey:key});
              }
            }
            for (var i = 0; i < changes.length; i++) {
              this.setForUser(changes[i].env, changes[i].user, changes[i].itemKey, changes[i].itemValue);
              localStorage.removeItem(changes[i].oldKey);
            }
          }
        }
        this.set(this.storageVersionKey, this.storageVersion);
      }
    }
  } catch (err) {
    console.log(err);
  }
}}});
Ext.define('ABP.util.Msal', {singleton:true, instance:null, config:null, enabled:false, authStore:null, requiresLogin:false, redirectUri:null, interactionRedirectUri:null, config:{stopAtLoginPage:false}, constructor:function() {
  try {
    if (!window['Msal']) {
      ABPLogger.logDebug('Microsoft Authentication Library was not present.');
      return;
    }
  } catch (ex) {
    ABPLogger.logDebug('Microsoft Authentication Library was not present.');
  }
  var authStore = this.getAuthStore();
  authStore.load();
  authStore.on('load', this.authStoreLoaded, this);
}, signIn:function() {
  var loginRequest = this.getLoginRequest(true);
  this.instance.loginRedirect(loginRequest);
}, signOut:function() {
  if (!this.enabled) {
    return;
  }
  this.instance.logout();
}, getToken:function() {
  var me = this;
  var msalInstance = this.instance;
  if (!msalInstance.getAccount()) {
    me.signIn();
    return;
  }
  var tokenRequest = this.getLoginRequest();
  if (!ABPAuthManager.getToken()) {
    me.requiresLogin = true;
  }
  return msalInstance.acquireTokenSilent(tokenRequest).then(ABP.util.Msal.handleTokenResponse)['catch'](ABP.util.Msal.handleTokenFailure);
}, formatUri:function(uri) {
  if (uri.indexOf('index.html') > -1) {
    uri = uri.split('index.html')[0];
  }
  if (uri.slice(-1) !== '/') {
    uri += '/';
  }
  return uri;
}, handleTokenResponse:function(response) {
  var me = ABP.util.Msal;
  var token;
  if (!Ext.isEmpty(response.accessToken)) {
    token = response.accessToken;
  }
  ABPAuthManager.authenticationSuccess(token);
  if (me.requiresLogin) {
    var app = Ext.getApplication();
    if (app) {
      var mvm = app.getMainView().getViewModel();
      if (mvm.get('bootstrapped')) {
        console.log('TA/DEBUG - MSAL - firing main_tokenAuthenticate');
        Ext.fireEvent('main_tokenAuthenticate');
      }
    }
  }
}, handleTokenFailure:function(error) {
  var me = ABP.util.Msal;
  if (error.message && error.message.startsWith('AADB2C90205')) {
    ABPLogger.logWarn('Failed token acquisition', error);
  } else {
    if (me.requiresInteraction(error.errorCode)) {
      return ABP.util.Msal.signIn();
    } else {
      me.instance.acquireTokenRedirect(me.getLoginRequest());
    }
  }
}, getAuthStore:function() {
  if (this.authStore) {
    return this.authStore;
  }
  var authStore = Ext.data.StoreManager.lookup('ApplicationAuthenticationStore');
  if (!authStore) {
    authStore = Ext.create('ABP.store.ApplicationAuthenticationStore');
  }
  this.authStore = authStore;
  return authStore;
}, authStoreLoaded:function(store) {
  var me = ABP.util.Msal;
  store.un('load', this.authStoreLoaded, this);
  var config = me.getMsalConfig(store);
  if (config) {
    me.enabled = true;
    me.instance = new Msal.UserAgentApplication(config);
    me.instance.handleRedirectCallback(me.redirectCallback);
    if (!me.authenticationSuccess) {
      me.getToken();
    }
  }
}, getLoginRequest:function(interactive) {
  var me = ABP.util.Msal;
  var config = me.config;
  if (config) {
    var requestConfig = {scopes:config.b2cScopes, redirectUri:me.getRedirectUri(interactive)};
    if (config.extraQueryParameters) {
      requestConfig.extraQueryParameters = config.extraQueryParameters;
    } else {
      if (config.domainHint) {
        requestConfig.extraQueryParameters = {domain_hint:config.domainHint};
      }
    }
    return requestConfig;
  }
}, getRedirectUri:function(interactive) {
  var me = ABP.util.Msal;
  if (interactive) {
    if (!Ext.isEmpty(me.interactionRedirectUri)) {
      return me.interactionRedirectUri;
    }
  }
  if (!Ext.isEmpty(me.redirectUri)) {
    return me.redirectUri;
  }
  var redirectUri = me.instance.getRedirectUri();
  me.interactionRedirectUri = redirectUri;
  if (redirectUri.indexOf('index.html') > -1) {
    redirectUri = redirectUri.split('index.html')[0];
  }
  if (redirectUri.slice(-1) !== '/') {
    redirectUri += '/';
  }
  me.redirectUri = redirectUri + 'auth.html';
  return interactive === true ? me.interactionRedirectUri : me.redirectUri;
}, getMsalConfig:function(store) {
  var me = this;
  var msalConfig;
  var rec = store.getAt(0);
  if (rec) {
    var config = rec.getData();
    me.config = config;
    msalConfig = {auth:{clientId:config.clientId, authority:config.authority, validateAuthority:false}, cache:{cacheLocation:config.cacheLocation || 'localStorage', storeAuthStateInCookie:config.storeAuthStateInCookie || true}};
    if (config.postLogoutRedirectUri) {
      if (Ext.isString(config.postLogoutRedirectUri)) {
        msalConfig.auth.postLogoutRedirectUri = config.postLogoutRedirectUri;
      }
      if (Ext.isBoolean(config.postLogoutRedirectUri)) {
        msalConfig.auth.postLogoutRedirectUri = me.formatUri(window.location.href) + 'signout.html';
      }
    }
  }
  return msalConfig;
}, redirectCallback:function(error, response) {
  var me = ABP.util.Msal;
  var authStore = me.getAuthStore();
  if (authStore) {
    authStore.un('load', me.authStoreLoaded, me);
  }
  var token = response.accessToken;
  if (!token && response.idToken) {
    me.requiresLogin = true;
    me.getToken();
    return;
  }
  if (token) {
    ABPLogger.logDebug('Setting token from redirectCallback ' + token);
    ABPAuthManager.authenticationSuccess(token);
    me.authenticationSuccess = true;
  }
}, requiresInteraction:function(errorCode) {
  if (!errorCode || !errorCode.length) {
    return false;
  }
  return errorCode === 'consent_required' || errorCode === 'interaction_required' || errorCode === 'login_required';
}, getStopAtLoginPage:function() {
  var bootstrapConfig = ABP.Config.getBootstrapConfig();
  if (bootstrapConfig) {
    return ABP.util.Common.getObjectProperty(bootstrapConfig, 'settings.b2cShowLogin');
  }
  return this.getB2cShowLogin();
}});
Ext.define('ABP.util.PluginManager', {singleton:true, requires:['ABP.util.Logger'], config:{registeredPlugins:{}, activePlugins:{}}, constructor:function(config) {
  this.initConfig(config);
}, getActivePluginsImplementingFunction:function(functionName) {
  var activePlugins = this.getActivePlugins(), pluginsToReturn = [], pluginId, plugin;
  for (pluginId in activePlugins) {
    if (activePlugins.hasOwnProperty(pluginId)) {
      plugin = activePlugins[pluginId];
      if (plugin[functionName]) {
        pluginsToReturn.push({plugin:plugin, pluginId:pluginId});
      }
    }
  }
  return pluginsToReturn;
}, getPluginClass:function(pluginId) {
  return this.getRegisteredPlugins()[pluginId];
}, getPluginInstance:function(pluginId) {
  var instance = this.getActivePlugins()[pluginId];
  if (!instance) {
    var pluginClass = this.getPluginClass(pluginId);
    if (pluginClass) {
      try {
        instance = Ext.create(pluginClass);
        this.getActivePlugins()[pluginId] = instance;
        ABP.util.Logger.logTrace('Initialized plugin: ' + pluginClass);
      } catch (e$4) {
        ABP.util.Logger.logError('Error initializing plugin: ' + pluginClass + ' : ' + e$4.message);
      }
    }
  }
  return instance;
}, getAllPluginConfigs:function() {
  var plugins = this.getRegisteredPlugins(), configs = [], pluginName, pluginClass, clazz;
  for (pluginName in plugins) {
    if (plugins.hasOwnProperty(pluginName)) {
      pluginClass = plugins[pluginName];
      clazz = Ext.ClassManager.get(pluginClass);
      if (!clazz) {
        ABP.util.Logger.logWarn('no class found for ' + pluginClass);
      } else {
        configs.push({pluginName:pluginName, config:clazz.prototype.config});
      }
    }
  }
  return configs;
}, getMergedPluginConfigs:function(propertyName) {
  var mergedConfigs = [], allConfigs = this.getAllPluginConfigs(), i, configItem;
  if (propertyName === 'aboutInfo') {
    mergedConfigs.push(ABP.util.Common.getABPAboutData());
  }
  Ext.each(allConfigs, function(item) {
    configItem = item.config[propertyName];
    if (configItem) {
      if (configItem instanceof Array) {
        for (i = 0; i < configItem.length; i++) {
          mergedConfigs.push(Ext.clone(configItem[i]));
        }
      } else {
        mergedConfigs.push(Ext.clone(configItem));
      }
    }
  });
  return mergedConfigs;
}, initializeAllPlugins:function() {
  var pluginId;
  ABP.util.Logger.logTrace('Initializing all plugins');
  var plugins = ABP.util.PluginManager.getRegisteredPlugins();
  for (pluginId in plugins) {
    if (plugins.hasOwnProperty(pluginId)) {
      this.getPluginInstance(pluginId);
    }
  }
}, register:function(pluginId, pluginClass) {
  ABP.util.Logger.logTrace('Registering Plugin: ' + pluginId + ' ' + pluginClass);
  this.getRegisteredPlugins()[pluginId] = pluginClass;
}});
Ext.define('ABP.util.RelativeTime', {singleton:true, requires:['ABP.util.Logger', 'ABP.util.Date'], config:{refreshInterval:60, itemSelector:'.abp-time-ago', offsets:{now:45, minuteOffset:120, xminutes:50, oneHour:80, xHours:24, oneDay:48, xDays:30, oneMonth:60, xMonths:365, oneYear:2}, toolTipFormat:'l jS F, Y, H:i'}, updateRunner:null, updateTask:null, constructor:function(config) {
  var me = this;
  me.initConfig(config);
  me.updateRunner = new Ext.util.TaskRunner;
  me.updateTask = me.updateRunner.newTask({run:me.updateElements, interval:me.getRefreshInterval() * 1000, scope:me});
  me.start();
}, start:function() {
  var me = this;
  me.updateTask.start();
}, stop:function() {
  var me = this;
  me.updateTask.stop();
}, format:function(original, compressed) {
  if (Ext.isString(original)) {
    var _initialString = original;
    original = new Date(original);
    if (original instanceof Date && isNaN(original)) {
      ABP.util.Logger.logWarn('Could not create relative time, failed to parse value: ' + _initialString);
      return;
    }
  }
  if (!isNaN(parseInt(original, 10))) {
    original = parseInt(original, 10);
  }
  compressed = typeof compressed !== 'undefined' ? compressed : false;
  var originalTime = new Date(original);
  var me = this;
  var now = new Date;
  var offset = Ext.Date.diff(originalTime, now, Ext.Date.SECOND);
  var offsets = me.getOffsets();
  var keyPrefix = 'abp_time_';
  if (compressed) {
    keyPrefix = 'abp_short_time_';
  }
  var prefix = ABP.util.Common.geti18nString(keyPrefix + 'prefix_ago');
  var suffix = ABP.util.Common.geti18nString(keyPrefix + 'suffix_ago');
  if (offset < 0) {
    prefix = ABP.util.Common.geti18nString(keyPrefix + 'prefix_from_now');
    suffix = ABP.util.Common.geti18nString(keyPrefix + 'suffix_from_now');
  }
  var seconds = Math.abs(offset);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var years = Math.floor(days / 365);
  var text = '';
  if (seconds < offsets.now) {
    text = ABP.util.Common.geti18nString(keyPrefix + 'seconds');
  } else {
    if (seconds < offsets.minuteOffset) {
      text = ABP.util.Common.geti18nString(keyPrefix + 'minute');
    } else {
      if (minutes < offsets.xminutes) {
        text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'minutes'), Math.round(minutes));
      } else {
        if (minutes < offsets.oneHour) {
          text = ABP.util.Common.geti18nString(keyPrefix + 'hour');
        } else {
          if (hours < offsets.xHours) {
            text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'hours'), Math.round(hours));
          } else {
            if (hours < offsets.oneDay) {
              text = ABP.util.Common.geti18nString(keyPrefix + 'day');
            } else {
              if (days < offsets.xDays) {
                text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'days'), Math.floor(days));
              } else {
                if (days < offsets.oneMonth) {
                  text = ABP.util.Common.geti18nString(keyPrefix + 'month');
                } else {
                  if (days < offsets.xMonths) {
                    text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'months'), Math.floor(days / 30));
                  } else {
                    if (years < offsets.oneYear) {
                      text = ABP.util.Common.geti18nString(keyPrefix + 'year');
                    } else {
                      text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'years'), Math.floor(years));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (prefix.length > 0) {
    text = prefix + ' ' + text;
  }
  if (suffix.length > 0) {
    text = text + ' ' + suffix;
  }
  return Ext.String.htmlEncode(text);
}, formatTooltip:function(time) {
  if (!isNaN(parseInt(time, 10))) {
    time = parseInt(time, 10);
  }
  var dt = new Date(time);
  return Ext.Date.format(dt, this.getToolTipFormat());
}, privates:{updateElements:function() {
  var me = this;
  var timeElements = Ext.dom.Element.query(me.getItemSelector());
  timeElements.forEach(function(element) {
    if (element.dataset && element.dataset.time) {
      element.innerText = me.format(element.dataset.time);
    }
  });
}}});
Ext.apply(Ext.util.Format, {formatRelativeTime:function(v) {
  return ABP.util.RelativeTime.format(v);
}, formatRelativeShortTime:function(v) {
  return ABP.util.RelativeTime.format(v, true);
}, formatRelativeTool:function(v) {
  return ABP.util.RelativeTime.formatTooltip(v);
}});
Ext.define('ABP.util.ServiceManager', {alternateClassName:'ABPServiceManager', singleton:true, services:new Ext.util.Collection, registerService:function(service) {
  var me = this;
  if (!service) {
    return;
  }
  service.usesB2cToken = Ext.isBoolean(service.usesB2cToken) ? service.usesB2cToken : true;
  me.services.add({id:service.name, service:service});
  if (service.usesB2cToken === false && Ext.isEmpty(ABPAuthManager.getServiceToken())) {
    ABPAuthManager.requestTokenForService(service.name);
  }
}, getTokenForService:function(service) {
  var me = this;
  var service = me.getService(service);
  if (service && service.usesB2cToken) {
    return ABPAuthManager.getToken();
  } else {
    return ABPAuthManager.getTokenForAudience(service);
  }
}, getService:function(serviceName) {
  var me = this;
  var item = me.services.get(serviceName);
  if (item) {
    return item.service;
  } else {
    ABPLogger.logDebug('Could not find service ' + serviceName);
    return null;
  }
}, getServiceUrl:function(serviceName) {
  var me = this;
  var service = me.getService(serviceName);
  if (service) {
    return service.url;
  }
  return null;
}, setServiceUrl:function(serviceName, url) {
  var me = this;
  var service = me.getService(serviceName);
  if (service) {
    service.url = url;
  }
}, isServiceCall:function(url) {
  return Ext.isEmpty(this.matchEndpointToService(url));
}, matchEndpointToService:function(url) {
  var me = this;
  var serviceName;
  me.services.each(function(item) {
    var service = item.service;
    if (url.indexOf(service.url) > -1) {
      serviceName = service.name;
    }
  });
  return serviceName;
}, getRegisteredServices:function() {
  var me = this;
  var serviceNames = [];
  me.services.eachKey(function(key) {
    serviceNames.push(key);
  });
  return serviceNames;
}});
Ext.define('ABP.util.SessionStorage', {singleton:true, prefix:'ABP_', get:function(key) {
  if (this.sessionStorageAvailable()) {
    var value = sessionStorage.getItem(this.prefix + key);
    return value;
  }
  return '';
}, set:function(key, value) {
  if (this.sessionStorageAvailable()) {
    sessionStorage.setItem(this.prefix + key, value);
  }
}, remove:function(key) {
  if (this.sessionStorageAvailable()) {
    sessionStorage.removeItem(this.prefix + key);
  }
}, contains:function(key) {
  if (this.sessionStorageAvailable()) {
    return sessionStorage.getItem(this.prefix + key) === null ? false : true;
  }
  return false;
}, privates:{sessionStorageAvailable:function(logError) {
  try {
    return window.sessionStorage !== undefined && window.sessionStorage !== null;
  } catch (err) {
    if (logError) {
      console.log(err);
    }
    return false;
  }
}}});
Ext.define('ABP.util.Sha256', {singleton:true, sha256:function(value, salt) {
  try {
    if (salt) {
      value = salt + value;
    }
    return SHA256(value);
  } catch (error) {
    ABP.util.Logger.logWarn(Ext.String.format('Failed to hash value, it will be stored in plain text. Clear browser cache to remove this value. "{0}".', error));
    return value;
  }
}, generateSaltForUser:function(user, environmentId) {
  if (Ext.isEmpty(user) || Ext.isEmpty(environmentId)) {
    return '';
  }
  return user + environmentId;
}});
Ext.define('ABP.util.Stopwatch', {singleton:true, startTime:undefined, stopTime:undefined, laps:[], isRunning:false, trace:true, info:'', start:function(tag) {
  if (this.isRunning) {
    return;
  }
  this.laps = [];
  this.startTime = new Date;
  this.stopTime = null;
  this.isRunning = true;
  this.info = tag ? tag : '';
}, stop:function() {
  if (!this.isRunning) {
    return;
  }
  this.stopTime = new Date;
  this.isRunning = false;
  if (this.trace) {
    ABP.util.Logger.logTrace('[STOP] ' + this.info + ' Elapsed Time(ms): ' + this.elapsed());
  }
  return this.elapsed();
}, reset:function() {
  this.laps = [];
  this.startTime = this.isRunning ? new Date : null;
  this.stopTime = null;
}, restart:function() {
  this.isRunning = true;
  this.reset();
}, elapsed:function() {
  return (this.isRunning ? new Date : this.stopTime) - this.startTime;
}, lap:function(info) {
  if (!info) {
    info = 'Lap ' + this.laps.length;
  }
  this.laps.push({name:info, elapsed:this.elapsed});
  if (this.trace) {
    ABP.util.Logger.logTrace('[' + info + '] ' + this.elapsed() + 'ms');
  }
}});
Ext.define('ABP.util.UserActivityMonitor', {singleton:true, ui:null, runner:null, task:null, lastActive:null, running:false, verbose:false, interval:1000 * 1, maxInactive:1000 * 60 * 0, warning:1000 * 30 * 0, init:function(config) {
  if (!config) {
    config = {};
  }
  this.maxInactive = 1000 * 60 * ABP.util.Config.getSessionConfig().settings.inactiveTimeout;
  this.warning = 1000 * 60 * ABP.util.Config.getSessionConfig().settings.inactiveWarningTime;
  if (this.maxInactive <= 0) {
    return;
  }
  Ext.apply(this, config, {runner:new Ext.util.TaskRunner, ui:Ext.getBody(), task:{run:this.monitorUI, interval:this.interval, scope:this}});
  this.running = true;
}, isRunning:function() {
  return this.running;
}, start:function() {
  var me = this;
  if (!me.isRunning()) {
    return false;
  }
  me.ui.on('keydown', this.onUpdateActivity, this);
  me.ui.on('tap', this.onUpdateActivity, this);
  me.ui.on('swipe', this.onUpdateActivity, this);
  me.ui.on('pinch', this.onUpdateActivity, this);
  me.lastActive = new Date;
  me.logTrace('User activity monitor has been started.');
  me.runner.start(this.task);
}, stop:function() {
  var me = this;
  if (!me.isRunning()) {
    return false;
  }
  me.runner.stop(this.task);
  me.lastActive = null;
  me.ui.un('keydown', this.onUpdateActivity);
  me.ui.un('tap', this.onUpdateActivity);
  me.ui.un('swipe', this.onUpdateActivity);
  me.ui.un('pinch', this.onUpdateActivity);
  me.logTrace('User activity monitor has been stopped.');
}, onUpdateActivity:function() {
  this.lastActive = new Date;
  this.logTrace('User activity detected (' + this.lastActive + ')');
}, monitorUI:function() {
  var now = new Date, inactive = now - this.lastActive;
  var timeout_me = this;
  var controller = Ext.getApplication().getController('ABP.view.ApplicationController');
  var time = Math.round((this.maxInactive - inactive) / 1000);
  var date = new Date(null);
  date.setSeconds(time);
  if (inactive >= this.warning && this.warning > 0) {
    if (time >= 0) {
      var confirmFunction = function(btn) {
        if (btn === true) {
          controller.fireEvent('onInactive');
          controller.fireEvent('main_fireAppEvent', 'container', 'signout', ['user init', false]);
        } else {
          controller.fireEvent('retain_session');
          timeout_me.start();
        }
      };
      var message = ABP.util.Common.geti18nString('inactive_timeout');
      var title = ABP.util.Common.geti18nString('timeout_title');
      ABP.view.base.popUp.PopUp.customPopup(message + date.toISOString().substr(14, 5), title, '?', [{text:'session_retain', args:false}, {text:'session_signoff', args:true}], confirmFunction);
    }
  }
  if (inactive >= this.maxInactive) {
    this.logInfo('MAXIMUM INACTIVE TIME HAS BEEN REACHED');
    this.stop();
    controller.fireEvent('onInactive');
    var timeout = ABP.util.Common.geti18nString('session_timeout');
    controller.fireEvent('main_fireAppEvent', 'container', 'signout', [timeout, false]);
  } else {
    this.logTrace('CURRENTLY INACTIVE FOR ' + inactive + ' (ms)');
  }
}, privates:{logTrace:function(msg) {
  if (this.verbose) {
    ABP.util.Logger.logTrace(msg);
  }
}, logInfo:function(msg) {
  ABP.util.Logger.logInfo(msg);
}}});
Ext.define('ABP.util.Version', {singleton:true, config:{version:'3.0.0', build:'0001'}, constructor:function(config) {
  this.initConfig(config);
}});
Ext.define('ABP.util.filters.text.TextFilter', {itemId:'StringFilter', config:{searchText:'', searchTerms:[], matchAllValues:false, minLengthThreshold:2, searchFields:[], weighting:1}, defaultSearchFieldConfig:{name:'', useSoundEx:true}, matchingConfig:{isMatch:false, isExactMatch:false, wordPosition:false, charPosition:false, soundsLike:false}, constructor:function(config) {
  if (Ext.isArray(config.searchFields)) {
    Ext.Array.each(config.searchFields, function(searchField, index, searchFields) {
      searchFields[index] = Ext.apply({}, searchField || {}, this.defaultSearchFieldConfig);
    });
  }
  config.searchText = config.searchText.toLowerCase().trim();
  config.weighting = 1 / config.searchText.split(' ').length;
  config.searchTerms = config.searchText.split(' ');
  this.initConfig(config);
  return this;
}, filter:function(item) {
  var searchText = this.getSearchText();
  if (!searchText) {
    return true;
  }
  var threshold = this.getMinLengthThreshold();
  if (searchText.length < threshold) {
    return true;
  }
  var me = this, itemMatching = [], match = null;
  var numberOfTerms = this.config.searchTerms.length;
  for (var i = 0; i < numberOfTerms; i++) {
    if (this.config.searchTerms[i].length >= threshold || i > 0) {
      if (this.getMatchAllValues()) {
        match = this._itemHasMatch(item, this.config.searchTerms[i], i);
      } else {
        match = this._itemHasMatch(item, this.config.searchTerms[i], i);
      }
      if (match.isMatch) {
        itemMatching.push(match);
      }
    }
  }
  if (this.getMatchAllValues()) {
    if (itemMatching.length != numberOfTerms) {
      itemMatching = [];
    }
  }
  item.data._relevance = me._calculateAccuracy(itemMatching);
  return item.data._relevance > 0;
}, calculateRelevancy:function(item) {
  var me = this;
  var searchText = this.getSearchText();
  if (!searchText) {
    return 0;
  }
  var threshold = this.getMinLengthThreshold();
  if (searchText.length < threshold) {
    return 0;
  }
  var itemMatching = [];
  var match = null;
  var numberOfTerms = this.config.searchTerms.length;
  for (var i = 0; i < numberOfTerms; i++) {
    if (this.config.searchTerms[i].length >= threshold || i > 0) {
      if (this.getMatchAllValues()) {
        match = this._itemHasMatch(item, this.config.searchTerms[i], i);
      } else {
        match = this._itemHasMatch(item, this.config.searchTerms[i], i);
      }
      if (match.isMatch) {
        itemMatching.push(match);
      }
    }
  }
  if (this.getMatchAllValues()) {
    if (itemMatching.length != numberOfTerms) {
      itemMatching = [];
    }
  }
  item.data._relevance = me._calculateAccuracy(itemMatching);
  return item.data._relevance;
}, _calculateAccuracy:function(matchings) {
  if (matchings.length === 0) {
    return 0;
  }
  var relevance = 0;
  var matches = 0;
  matchings.forEach(function(matching) {
    if (matching.isExactMatch) {
      relevance += 20;
    }
    if (matching.wordPosition) {
      relevance += 6;
    }
    if (matching.charPosition) {
      relevance += 10;
    }
    if (matching.soundsLike) {
      relevance += 3;
    }
  });
  return relevance;
}, _itemHasMatch:function(item, searchTerm, termIndex) {
  var me = this;
  var matchToReturn = me._createMatch();
  Ext.Array.each(this.getSearchFields(), function(field, index) {
    var fieldValue = item.get(field.name);
    match = me._contains(fieldValue, searchTerm, termIndex);
    if (!match.isMatch && field.useSoundEx) {
      match = me.soundsLike(fieldValue, searchTerm, match);
    }
    matchToReturn.isMatch |= match.isMatch;
    matchToReturn.isExactMatch |= match.isExactMatch;
    matchToReturn.wordPosition |= match.wordPosition;
    matchToReturn.charPosition |= match.charPosition;
    matchToReturn.soundsLike |= match.soundsLike;
  });
  return matchToReturn;
}, _createMatch:function(config) {
  return Ext.apply({}, config || {}, this.matchingConfig);
}, _contains:function(propertyValue, searchTerm, termIndex) {
  var me = this, match = me._createMatch();
  if (!propertyValue || Ext.isObject(propertyValue)) {
    return match;
  }
  propertyValue = propertyValue.toLowerCase();
  if (propertyValue === this.getSearchText()) {
    match.isExactMatch = true;
  }
  var valueParts = propertyValue.split(' ');
  for (var i = 0; i < valueParts.length; i++) {
    var pos = valueParts[i].indexOf(searchTerm);
    if (pos >= 0) {
      match.isMatch = true;
      match.wordPosition = termIndex === i;
      match.charPosition = pos === 0;
    }
  }
  return match;
}, characterFilter:function(item) {
  var searchText = this.getSearchText();
  if (!searchText) {
    return true;
  }
  var threshold = 0;
  if (searchText.length < threshold) {
    return true;
  }
  var me = this, itemMatching = [], match = null;
  var numberOfTerms = this.config.searchTerms.length;
  for (var i = 0; i < numberOfTerms; i++) {
    if (this.config.searchTerms[i].length >= threshold || i > 0) {
      if (this.getMatchAllValues()) {
        match = this._itemHasMatch(item, this.config.searchTerms[i], i);
      } else {
        match = this._itemHasMatch(item, this.config.searchTerms[i], i);
      }
      if (match.isMatch) {
        itemMatching.push(match);
      }
    }
  }
  if (this.getMatchAllValues()) {
    if (itemMatching.length != numberOfTerms) {
      itemMatching = [];
    }
  }
  item.data._relevance = me._calculateAccuracy(itemMatching);
  return item.data._relevance > 0;
}, privates:{soundsLike:function(propertyValue, searchTerm) {
  var me = this, match = me._createMatch();
  if (!propertyValue || Ext.isObject(propertyValue)) {
    return match;
  }
  var searchTermSoundEx = this.getSoundEx(searchTerm);
  var startSoundEx = this.getProminentPart(searchTermSoundEx);
  parts = propertyValue.split(' ');
  for (i = 0; i < parts.length; i++) {
    var wordSoundex = this.getSoundEx(parts[i]);
    if (wordSoundex === searchTermSoundEx) {
      match.isMatch = true;
      match.soundsLike = true;
    }
    if (Ext.String.startsWith(wordSoundex, startSoundEx)) {
      match.isMatch = true;
      match.soundsLike = true;
    }
  }
  return match;
}, getProminentPart:function(soundex) {
  var i = soundex.indexOf('0');
  if (i < 0) {
    return soundex;
  }
  return soundex.substring(0, i);
}, getSoundEx:function(value) {
  var charArray = value.toLowerCase().split(''), firstChar = charArray.shift(), soundCode = '', codes = {a:'', e:'', i:'', o:'', u:'', b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, d:3, t:3, l:4, m:5, n:5, r:6};
  soundCode = firstChar + charArray.map(function(value, index, charArray) {
    return codes[value];
  }).filter(function(value, index, charArray) {
    return index === 0 ? value !== codes[firstChar] : value !== charArray[index - 1];
  }).join('');
  return (soundCode + '000').slice(0, 4).toUpperCase();
}}});
Ext.define('ABP.util.filters.Factory', {singleton:true, requires:['ABP.util.filters.text.TextFilter'], createStringFilter:function(searchText, fieldsToSearch, matchAllValues, minLengthThreshold) {
  var config = {searchText:searchText, searchFields:fieldsToSearch, matchAllValues:matchAllValues};
  if (minLengthThreshold) {
    config.minLengthThreshold = minLengthThreshold;
  }
  var textFilter = Ext.create('ABP.util.filters.text.TextFilter', config);
  return textFilter.filter.bind(textFilter);
}, createTopNFilter:function(maxResults) {
  var config = {maxResults:maxResults};
  var filter = Ext.create('ABP.util.filters.misc.TopNFilter', config);
  return filter.filter.bind(filter);
}, createDuplicationFilter:function(fields) {
  if (Ext.isString(fields)) {
    fields = ABP.util.String.toArray(fields);
  }
  var config = {fields:fields};
  var filter = Ext.create('ABP.util.filters.misc.DuplicateFilter', config);
  return filter.filter.bind(filter);
}});
Ext.define('ABP.util.filters.misc.DuplicateFilter', {itemId:'DuplicateFilter', config:{fields:[]}, keys:[], constructor:function(config) {
  this.initConfig(config);
  this.keys = [];
  return this;
}, filter:function(item) {
  var me = this;
  var key = me.generateKey(item);
  if (!key) {
    return true;
  }
  if (Ext.Array.contains(me.keys, key)) {
    return false;
  }
  me.keys.push(key);
  return true;
}, privates:{generateKey:function(item) {
  var me = this;
  var key = '';
  var fields = me.getFields();
  Ext.Array.forEach(fields, function(field) {
    var value = item.get(field);
    if (value) {
      key += value.toString();
    }
  });
  return key;
}}});
Ext.define('ABP.util.filters.misc.TopNFilter', {itemId:'TopNFilter', config:{maxResults:10}, constructor:function(config) {
  this.initConfig(config);
  return this;
}, filter:function(item) {
  var me = this;
  if (item.store) {
    var i = item.store.indexOf(item);
    return i < me.getMaxResults();
  }
  return false;
}});
Ext.define('ABP.util.keyboard.Codes', {singleton:true, statics:{keyOptions:{forwardSlash:191}}});
Ext.define('ABP.util.keyboard.Shortcuts', {requires:['ABP.util.Keyboard'], keyNav:null, routeMapping:[], config:{controller:null}, constructor:function(config) {
  var me = this;
  Ext.apply(me, config);
  me.keyNav = new Ext.util.KeyNav({target:Ext.getBody(), scope:me, defaultEventAction:'stopEvent', ignoreInputFields:true, F:{ctrl:true, shift:true, fn:function(e) {
    me.controller.fireEvent('container_showMenu', true);
    me.controller.fireEvent('container_menuFocusFavorites');
  }, defaultEventAction:'stopPropagation'}, Z:{ctrl:true, shift:true, fn:function(e) {
    ABP.view.base.automation.AutomationHintOverlay.toggle();
  }, defaultEventAction:'stopPropagation'}, Home:{ctrl:true, fn:function(e) {
    me.controller.fireEvent('container_showMenu', true);
    ABP.util.Keyboard.focus('.nav-search-field');
  }, defaultEventAction:'stopPropagation'}, Alt:{ctrl:false, fn:function(e) {
    me.controller.fireEvent('container_toggleMenuShortcuts', true);
    ABP.util.Common.setKeyboardNavigation(true);
  }}, 191:{fn:function(keyCode, e) {
    if (keyCode.altKey) {
      me.controller.fireEvent('abp_jumpto_show');
    } else {
      me.controller.fireEvent('abp_searchBar_toggleKey');
    }
    return true;
  }, defaultEventAction:'stopPropagation'}, enter:{fn:this.KeyboardNavUpdate, defaultEventAction:false}, tab:{fn:this.KeyboardNavUpdate, defaultEventAction:false}, left:{fn:this.KeyboardNavUpdate, defaultEventAction:false}, right:{fn:this.KeyboardNavUpdate, defaultEventAction:false}, up:{fn:this.KeyboardNavUpdate, defaultEventAction:false}, down:{fn:this.KeyboardNavUpdate, defaultEventAction:false}});
}, KeyboardNavUpdate:function() {
  ABP.util.Common.setKeyboardNavigation(true);
}, enable:function() {
  this.keyNav.enable();
}, disable:function() {
  this.keyNav.disable();
}, addShortcuts:function(shortcuts) {
  var bindings = [];
  for (i = 0, len = shortcuts.length; i < len; i++) {
    var key = this.getKey(shortcuts[i].key);
    binding = {key:key, shift:shortcuts[i].key.indexOf('SHIFT+') >= 0, ctrl:shortcuts[i].key.indexOf('CTRL+') >= 0, alt:shortcuts[i].key.indexOf('ALT+') >= 0, handler:this.shortcutHandler, scope:this};
    bindings[key] = binding;
    this.addRouteMap(binding, shortcuts[i]);
  }
  this.keyNav.addBindings(bindings);
}, getKey:function(keyCombo) {
  keyCombo = keyCombo.toUpperCase();
  return keyCombo.replace('SHIFT+', '').replace('CTRL+', '').replace('ALT+', '');
}, addRouteMap:function(binding, route) {
  var key = this.getRouteKey(binding);
  this.routeMapping[key] = route;
}, shortcutHandler:function(e) {
  var eventConfig = this.routeMapping[this.getRouteKey(e)];
  this.controller.fireAppEvent(eventConfig.appId, eventConfig.event, eventConfig.eventArgs, eventConfig.activateApp);
}, getRouteKey:function(e) {
  var key = '';
  if (e.ctrlKey || e.ctrl) {
    key += 'CTRL+';
  }
  if (e.shiftKey || e.shift) {
    key += 'SHIFT+';
  }
  if (e.altKey || e.alt) {
    key += 'ALT+';
  }
  if (Ext.isNumber(e.keyCode)) {
    key += e.keyCode;
  } else {
    key += Ext.event.Event[e.key];
  }
  return key;
}});
Ext.define('ABP.view.Root', {extend:'Ext.app.Controller', routes:{'login':{before:'onBeforeLogin', action:'onLogin'}, 'logout':'onLogout', 'home':'onHome', 'nosupport':'onNoSupport'}, refs:[{ref:'main', selector:'app-main', autoCreate:false}], onLogout:function() {
  this.fireEvent('main_DestroySession');
}, onBeforeLogin:function(action) {
  if (ABP.util.Config.getLoggedIn()) {
    ABP.view.base.popUp.PopUp.customPopup('reload_warning', '', '?', [{text:'error_ok_btn', args:true}, {text:'error_cancel_btn', args:false}], 'main_routingWarningCallback');
  } else {
    action.resume();
  }
}, onLogin:function() {
  var vm = null;
  var main = this.getMain();
  if (main) {
    vm = main.getViewModel();
  }
  if (vm && vm.get('bootstrapped') || !vm) {
    this.fireEvent('main_ShowLogin');
  }
}, onNoSupport:function() {
  this.fireEvent('main_ShowNoSupportPage');
  this.setRoutes({});
}, onHome:function() {
  if (this.getApplication().getMainView().down('featurecanvas')) {
    this.fireEvent('featureCanvas_triggerDefaultMenuItem');
  } else {
    this.redirectTo('');
  }
}});
Ext.define('ABP.view.ApplicationController', {extend:'Ext.app.Controller', alias:'controller.abpapplicationcontroller', listen:{controller:{'*':{container_signOut:'__signout', container_toggleMenu:'__menuToggle', container_showMenu:'__menuOpen', container_toggleMenuShortcuts:'__menuToggleShortcuts', container_hideMenu:'__menuClose', container_toggleNav:'__navToggle', container_giveFocus:'__givenFocus', container_enableMenuOption:'__menuOptionEnable', container_addMenuOption:'__menuOptionAdd', container_removeMenuOption:'__menuOptionRemove', 
container_updateMenuCount:'__menuUpdateCount', container_menuAddRecent:'__menuAddRecent', container_menuAddFavorite:'__menuAddFavorite', container_menuRemoveFavorite:'__menuRemoveFavorite', container_menuUpdateFavorites:'__menuUpdateFavorites', container_menuFocusFavorites:'__menuFocusFavorite', container_menuReplaceSuggested:'__menuReplaceSuggested', container_menuAddTreeItems:'__menuAddTreeItems', container_menuRemoveTreeItem:'__menuRemoveTreeItem', container_toolbar_showBranding:'__toolbarShowBranding', 
container_toolbar_setTitle:'__toolbarSetTitle', container_toolbar_addButton:'__toolbarAddButton', container_toolbar_removeButton:'__toolbarRemoveButton', container_openSearch:'__openSearch', container_showSettings:'__showSettings', container_switchLanguage:'__switchLanguage', container_switchTheme:'__switchTheme', container_clean:'__cleanUp', container_setRoute:'__setRoute', container_addDefaultLanguageStrings:'__addDefaultLanguageStrings', container_updateLanguageStrings:'__updateLanguageStrings', 
container_pendingChanges:'__pendingChangesToggle', container_rightPane_toggle:'__rightPaneToggle', container_rightPane_toggleTab:'__rightPaneToggleTab', container_rightPane_addElement:'__rightPaneAddElement', container_rightPane_showButton:'__rightPaneShowButton', container_rightPane_initTab:'__rightPaneInitTab', container_rightPane_updateBadge:'__rightPaneUpdateBadge', container_rightPane_incrementBadge:'__rightPaneIncrementBadge', container_rightPane_decrementBadge:'__rightPaneDecrementBadge', 
container_rightPane_clearBadge:'__rightPaneClearBadge', container_notifications_add:'__addNotifications', container_notifications_remove:'__removeNotifications', container_notifications_read:'__markNotificationsRead', container_notifications_unread:'__markNotificationsUnread', container_globalsearch_suggestions:'__updateGlobalSearchSuggestions', container_headlines_show:'__showHeadlines', container_headlines_hide:'__hideHeadline', container_headlines_load:'__loadHeadlines', container_thumbbar_show:'__showThumbbar', 
container_thumbbar_hide:'__hideThumbbar', container_updateUserProfile:'__updateUserProfile', container_bootstrap_success:'__bootstrapSuccessful', container_authentication_success:'__authenticationSuccessful', container_config_processed:'__configurationProcessed'}}}, __signout:function(reason, force) {
  this.fireEvent('main_DestroySession', reason, force);
}, __menuToggle:function() {
  this.fireEvent('session_toggleMenu');
}, __menuOpen:function() {
  this.fireEvent('session_openMenu');
}, __menuToggleShortcuts:function() {
  this.fireEvent('session_toggleMenuShortcuts');
}, __menuClose:function() {
  this.fireEvent('session_closeMenu');
}, __givenFocus:function() {
  this.fireEvent('toolbar_focus');
}, __menuOptionEnable:function(appId, uniqueId, isEnabled) {
  this.fireEvent('mainMenu_enableMenuOption', appId, uniqueId, isEnabled);
}, __menuOptionAdd:function(button, nav, parentAppId, parentId, tree) {
  this.fireEvent('mainMenu_addMenuOption', button, nav, parentAppId, parentId, tree);
}, __menuOptionRemove:function(appId, uniqueId) {
  this.fireEvent('mainMenu_removeMenuOption', appId, uniqueId);
}, __menuUpdateCount:function(appId, uniqueId, data) {
  this.fireEvent('mainMenu_updateMenuCount', appId, uniqueId, data);
}, __menuAddRecent:function(pageInfo) {
  this.fireEvent('mainMenu_addRecent', pageInfo);
}, __menuAddFavorite:function(pageInfo, saveRequest) {
  this.fireEvent('mainMenu_addFavorite', pageInfo, saveRequest);
}, __menuRemoveFavorite:function(appId, uniqueId, saveRequest) {
  this.fireEvent('mainMenu_removeFavorite', appId, uniqueId, saveRequest);
}, __menuUpdateFavorites:function(favoritesArray, saveRequest) {
  this.fireEvent('mainmenu_updateFavorites', favoritesArray, saveRequest);
}, __menuFocusFavorite:function() {
  this.fireEvent('mainmenu_focusFavorites');
}, __menuReplaceSuggested:function(pageInfoArray) {
  this.fireEvent('mainMenu_replaceSuggested', pageInfoArray);
}, __menuAddTreeItems:function(treeItems) {
  this.fireEvent('mainMenu_addTreeOption', treeItems);
}, __menuRemoveTreeItem:function(appId, uniqueId) {
  this.fireEvent('mainMenu_removeTreeOption', appId, uniqueId);
}, __navToggle:function(type) {
  this.fireEvent('mainMenu_toggleNav', type);
}, __toolbarSetTitle:function(newTitle) {
  this.fireEvent('toolbar_setTitle', newTitle);
}, __toolbarShowBranding:function(showBranding) {
  this.fireEvent('toolbar_showBranding', showBranding);
}, __toolbarAddButton:function(buttonFeatures, icon, func, uniqueId) {
  this.fireEvent('toolbar_addButton', buttonFeatures, icon, func, uniqueId);
}, __toolbarRemoveButton:function(button) {
  this.fireEvent('toolbar_removeButton', button);
}, __showSettings:function(args) {
  this.fireEvent('featureCanvas_showSetting', args);
}, __addDefaultLanguageStrings:function(args) {
  this.fireEvent('main_addDefaultLanguageStrings', args);
}, __updateLanguageStrings:function(args) {
  this.fireEvent('main_updateLanguageStrings', args);
}, __openSearch:function() {
  this.fireEvent('toolbar_openSearch');
}, __switchLanguage:function(newLang) {
  this.fireEvent('main_switchLanguage', newLang);
}, __switchTheme:function(newTheme) {
  ABPTheme.setTheme(newTheme);
}, __pendingChangesToggle:function(pendingChanges) {
  this.fireEvent('main_pendingChanges', pendingChanges);
}, __cleanUp:function() {
}, __setRoute:function(hash, force) {
  if (force === undefined) {
    force = true;
  }
  this.redirectTo(hash, Ext.coerce(force, true));
}, __rightPaneToggle:function() {
  this.fireEvent('rightPane_toggle');
}, __rightPaneAddElement:function(content) {
  this.fireEvent('rightPane_addElement', content);
}, __rightPaneToggleTab:function(uniqueId, open, focus) {
  this.fireEvent('rightPane_toggleTab', uniqueId, open, focus);
}, __rightPaneShowButton:function(uniqueId, show) {
  this.fireEvent('toolbar_setVisibilityRightPaneButton', uniqueId, show);
}, __rightPaneInitTab:function(uniqueId) {
  this.fireEvent('rightPane_initTab', uniqueId);
}, __rightPaneUpdateBadge:function(uniqueId, badgeConfig) {
  this.fireEvent('toolbar_updateBadge', uniqueId, badgeConfig);
}, __rightPaneIncrementBadge:function(uniqueId, number) {
  this.fireEvent('toolbar_incrementBadge', uniqueId, number);
}, __rightPaneDecrementBadge:function(uniqueId, number) {
  this.fireEvent('toolbar_decrementBadge', uniqueId, number);
}, __rightPaneClearBadge:function(uniqueId) {
  this.fireEvent('toolbar_clearBadge', uniqueId);
}, __addNotifications:function(source, sourceKey, notifications) {
  this.fireEvent('abp_notifications_add', source, sourceKey, notifications);
}, __removeNotifications:function(notifications) {
  this.fireEvent('abp_notifications_remove', notifications);
}, __markNotificationsRead:function(notifications) {
  this.fireEvent('abp_notifications_read', notifications);
}, __markNotificationsUnread:function(notifications) {
  this.fireEvent('abp_notifications_unread', notifications);
}, __updateGlobalSearchSuggestions:function(searchId, seachTerm, suggestions, removeCaseInsensitiveDuplicates) {
  this.fireEvent('abp_search_suggestions', searchId, seachTerm, suggestions, removeCaseInsensitiveDuplicates);
}, __showHeadlines:function(headlines) {
  this.fireEvent('abp_headlines_show', headlines);
}, __hideHeadline:function(uniqueId) {
  this.fireEvent('abp_headlines_hide', uniqueId);
}, __loadHeadlines:function() {
  this.fireEvent('abp_headlines_load');
}, __showThumbbar:function(config) {
  this.fireEvent('thumbbar_show', config);
}, __hideThumbbar:function(clear) {
  this.fireEvent('thumbbar_hide', clear);
}, __updateUserProfile:function(profileData) {
  this.fireEvent('main_updateUserProfile', profileData);
}, __bootstrapSuccessful:function() {
  this.fireEvent('abp_milestone_bootstrap_success');
}, __authenticationSuccessful:function() {
  this.fireEvent('abp_milestone_authentication_success');
}, __configurationProcessed:function() {
  this.fireEvent('abp_milestone_config_processed');
}});
Ext.define('ABP.view.base.popUp.PopUpController', {extend:'Ext.app.ViewController', alias:'controller.abppopupcontroller', listen:{controller:{'*':{popup_showPopUp:'showMe', popup_hidePopUp:'hideMe'}}}, showMe:function(text, buttonArray) {
  var me = this;
  var view = me.getView();
  view.setLabel(text);
  view.setButtons(buttonArray);
  view.show();
}, hideMe:function() {
  this.getView().hide();
}});
Ext.define('ABP.view.base.popUp.PopUpHeader', {extend:'Ext.Container', alias:'widget.popupheader', cls:'abp-popup-header', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'panelheader', itemId:'abpPanelHeader', cls:'abp-popup-header-header', titleRotation:'0', defaultType:'tool'}], setPosition:function(pos) {
  this.down('#abpPanelHeader').setPosition(pos);
}, getInnerHeader:function() {
  return this.down('#abpPanelHeader');
}});
Ext.define('ABP.view.base.popUp.PopUp', {extend:'Ext.Panel', singleton:true, requires:['ABP.view.base.popUp.PopUpController', 'ABP.view.base.popUp.PopUpHeader', 'ABPControlSet.util.Markdown'], alias:'widget.abppopup', alternateClassName:'ABP.Popup', controller:'abppopupcontroller', header:{xtype:'popupheader'}, layout:{type:'vbox', align:'center', pack:'center'}, modal:true, hidden:true, centered:true, cls:'abp-popup', sizingConstants:{minWidth:350, minHeight:225, maxWidth:500, maxHeight:350}, minHeight:255, 
maxHeight:350, shadow:false, config:{closeKeymap:undefined}, items:[{xtype:'container', docked:'bottom', itemId:'errorPopButtonBar', cls:'errorpop-buttonbar', layout:{type:'hbox', pack:'end'}, items:[{xtype:'button', frame:false, width:100, handler:function() {
  this.up('abppopup').hidePopup();
}}]}, {xtype:'component', itemId:'errorPopIcon', cls:'popIcon', html:'\x3ci class\x3d"icon-window-warning"\x3e\x3c/i\x3e'}, {xtype:'component', itemId:'errorPopMessage', cls:'errorpop-message', flex:1, width:'100%', scrollable:'y', html:''}], __showPopup:function(message, title, icon, buttonConfig, closeCallback, options) {
  var me = this;
  options = options || {};
  var __icon = me.down('#errorPopIcon');
  var __message = me.down('#errorPopMessage');
  var __buttonbar = me.down('#errorPopButtonBar');
  if (!me.getRenderTo()) {
    me.setRenderTo(Ext.Viewport.el.dom);
  }
  if (icon) {
    if (icon === '?') {
      __icon.setHtml('\x3ci class\x3d"icon-question"\x3e\x3c/i\x3e');
      if (!__icon.hasCls('actionblueIcon')) {
        __icon.addCls('actionblueIcon');
      }
    } else {
      if (icon === 'i') {
        __icon.setHtml('\x3ci class\x3d"icon-information"\x3e\x3c/i\x3e');
        if (!__icon.hasCls('actionblueIcon')) {
          __icon.addCls('actionblueIcon');
        }
      } else {
        if (Ext.isString(icon) && icon.length > 1) {
          __icon.setHtml('\x3ci class\x3d"' + icon + '"\x3e\x3c/i\x3e');
          if (__icon.hasCls('actionblueIcon')) {
            __icon.removeCls('actionblueIcon');
          }
        } else {
          __icon.setHtml('\x3ci class\x3d"icon-sign-warning"\x3e\x3c/i\x3e');
          if (__icon.hasCls('actionblueIcon')) {
            __icon.removeCls('actionblueIcon');
          }
        }
      }
    }
    __icon.setHidden(false);
  } else {
    __icon.setHidden(true);
  }
  if (title && Ext.isString(title)) {
    me.__setTitle(me.__checkString(title));
  } else {
    me.__setTitle('');
  }
  if (message) {
    var isMarkdown = options.isMarkdown || false;
    message = me.__getFormattedMessage(message, isMarkdown);
    if (options && options.url) {
      var urlHtml = Ext.String.format('\x3cbr/\x3e\x3cbr/\x3e\x3ca href\x3d"{0}" target\x3d"{1}" onclick\x3d"try { ABP.view.base.popUp.PopUp.hidePopup(); return true; } catch (e) {return true;}"\x3e{2}\x3c/a\x3e', options.url, options && options.urlTarget ? options.urlTarget : '_blank', options && options.urlDisplayText ? me.__checkString(options.urlDisplayText) : options.url);
      __message.setHtml(message + urlHtml);
    } else {
      __message.setHtml(message);
    }
    __message.setHidden(false);
  } else {
    __message.setHidden(true);
  }
  if (buttonConfig) {
    __buttonbar.removeAll();
    __buttonbar.add(me.__getCustomButtons(buttonConfig));
  } else {
    __buttonbar.removeAll();
    __buttonbar.add(me.__getDefaultButtons());
  }
  me.closeCallback = closeCallback;
  me.calculateSizing(__message.getHidden(), __message.getHtml());
  me.show();
  me.__putFocusOnButton();
  Ext.Viewport.mask();
}, __getFormattedMessage:function(message, isMarkdown) {
  if (isMarkdown) {
    return ABPControlSet.util.Markdown.parseMarkdown(message);
  } else {
    var me = this;
    if (Ext.isString(message)) {
      return me.__checkString(message);
    } else {
      if (Ext.isArray(message)) {
        var line, lines = '', length = message.length;
        for (var i = 0; i < length; i++) {
          line = message[i];
          if (Ext.isString(line)) {
            lines += me.__checkString(line) + (i === length - 1 ? '' : '\x3cbr/\x3e');
          }
        }
        return lines;
      }
    }
  }
}, getHeader:function() {
  return this.header.getInnerHeader();
}, __setTitle:function(title) {
  var header = this.getHeader();
  if (title) {
    if (header.setTitle) {
      header.setTitle(title);
      this.header.show();
    } else {
      header.title = title;
    }
  } else {
    if (header.setTitle) {
      header.setTitle('');
      this.header.hide();
    } else {
      header.title = '';
      this.header.hidden = true;
    }
  }
}, __checkString:function(strToCheck) {
  var copy = strToCheck.slice(0);
  var ret = ABP.util.Common.geti18nString(strToCheck, true);
  if (copy === ret) {
    ret = ABP.util.Common.inspectString(ret);
  }
  return Ext.String.htmlEncode(ret);
}, __getDefaultButtons:function() {
  return [{xtype:'button', frame:false, minWidth:100, automationCls:'popup-btn-ok', cls:'popupButton', defaultFocus:true, text:this.__checkString('error_ok_btn'), handler:function() {
    this.up('abppopup').hidePopup();
  }}];
}, __getCustomButtons:function(buttonConfig) {
  var me = this;
  var ret = [];
  var buttonText = '';
  var i = 0;
  if (Ext.isArray(buttonConfig)) {
    for (i = 0; i < buttonConfig.length; ++i) {
      if (buttonConfig[i].text) {
        buttonText = ABP.util.Common.geti18nString(buttonConfig[i].text);
        ret.push({xtype:'button', frame:false, minWidth:100, defaultFocus:buttonConfig[i].defaultFocus, args:buttonConfig[i].args, text:Ext.String.htmlEncode(buttonText), automationCls:'popup-btn-' + i, cls:'popupButton', handler:function() {
          this.up('abppopup').hidePopup(this.args);
        }});
      }
    }
  } else {
    if (buttonConfig.text) {
      buttonText = ABP.util.Common.geti18nString(buttonConfig.text);
      ret.push({xtype:'button', frame:false, minWidth:100, defaultFocus:buttonConfig.defaultFocus, args:buttonConfig.args, text:Ext.String.htmlEncode(buttonText), automationCls:'popup-btn-0', cls:'popupButton', handler:function() {
        this.up('abppopup').hidePopup(this.args);
      }});
    }
  }
  if (Ext.isEmpty(ret)) {
    ret = me.__getDefaultButtons();
  }
  return ret;
}, __putFocusOnButton:function() {
  var me = this;
  var buttonbar = me.down('#errorPopButtonBar');
  var buttons = buttonbar.items.items;
  var i = 0;
  var foundFocus = false;
  for (i; i < buttons.length; ++i) {
    if (buttons[i].defaultFocus) {
      foundFocus = buttons[i];
      break;
    }
  }
  if (foundFocus) {
    foundFocus.focus();
  } else {
    if (buttons.length > 0) {
      buttons[0].focus();
    }
  }
}, calculateSizing:function(hidden, text) {
  var me = this;
  var devicetype = Ext.os.deviceType;
  if (devicetype === 'Phone') {
    me.__phoneSizing(hidden, text);
  } else {
    if (devicetype === 'Tablet') {
      me.__tabletSizing(hidden, text);
    }
  }
}, __phoneSizing:function(hidden, text) {
  this.setMinWidth(300);
  this.setMaxHeight('calc(100% - 40px)');
  this.setMaxWidth('calc(100% - 40px)');
}, __tabletSizing:function(hidden, text) {
  var me = this;
  if (hidden) {
    me.setWidth(me.sizingConstants.minWidth);
  } else {
    var size = text.length * 7;
    var largestSize = 6275;
    var smallestSize = 400;
    if (size < largestSize) {
      if (size <= smallestSize) {
        me.setWidth(me.sizingConstants.minWidth);
      } else {
        var percentage = size / largestSize;
        me.setWidth(me.sizingConstants.minWidth + (me.sizingConstants.maxWidth - me.sizingConstants.minWidth) * percentage);
      }
    } else {
      me.setWidth(me.sizingConstants.maxWidth);
    }
  }
}, hidePopup:function(args) {
  this.hide();
  Ext.Viewport.unmask();
  if (this.closeCallback) {
    if (Ext.isFunction(this.closeCallback)) {
      this.closeCallback(args);
    } else {
      this.getController().fireEvent(this.closeCallback, args);
    }
  }
}, beforeclose:function() {
  Ext.destroy(this.getCloseKeymap());
}, afterRender:function() {
  var me = this;
  me.addBodyCls('framePop-body');
  me.callParent();
}, showPopup:function(errorMessage, buttonMessage, closeCallback, options) {
  this.__showPopup(errorMessage, null, '!', {text:buttonMessage}, closeCallback, options);
}, showInfo:function(message, title, options) {
  this.__showPopup(message, title, 'i', null, null, options);
}, showError:function(message, title, options) {
  this.__showPopup(message, title, '!', null, null, options);
}, showOkCancel:function(message, title, callback, options) {
  this.__showPopup(message, title, '?', [{text:'error_ok_btn', defaultFocus:true, args:true}, {text:'error_cancel_btn', args:false}], callback, options);
}, showYesNo:function(message, title, callback, options) {
  this.__showPopup(message, title, '?', [{text:'error_yes_btn', defaultFocus:true, args:true}, {text:'error_no_btn', args:false}], callback, options);
}, customPopup:function(message, title, icon, buttonConfig, closeCallback, options) {
  this.__showPopup(message, title, icon, buttonConfig, closeCallback, options);
}, showHyperlink:function(message, url, urlTarget, urlDisplayText, title, icon, buttonConfig, closeCallback, options) {
  options = options || {};
  options.url = url;
  options.urlTarget = urlTarget;
  options.urlDisplayText = urlDisplayText;
  this.__showPopup(message, title, icon, buttonConfig, closeCallback, options);
}});
Ext.define('ABP.view.base.toast.ToastBase', {requires:['ABPControlSet.util.Markdown'], levelEnum:{'BLU':0, 'GRN':1, 'ORG':2, 'RED':3, 0:'BLU', 1:'GRN', 2:'ORG', 3:'RED', 'Alert':3, 'Warning':2, 'Success':1, 'Info':0}, ariaLiveMapping:{'BLU':'polite', 'GRN':'polite', 'ORG':'polite', 'RED':'assertive'}, defaultIconEnum:{0:'icon-information', 1:'icon-check', 2:'icon-sign-warning', 3:'icon-about'}, defaultIcons:{BLU:'icon-information', GRN:'icon-hand-thumb-up', ORG:'icon-sign-warning', RED:'icon-alert'}, 
privates:{getParamConfig:function(message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
  var me = this;
  var config = message;
  if (Ext.isString(message)) {
    config = {message:message.trim()};
    if (level) {
      config.level = level;
    }
    if (iconCls) {
      config.iconCls = iconCls;
    }
    if (placement) {
      config.placement = placement;
    }
    if (handler) {
      config.handler = handler;
    } else {
      config.handler = null;
    }
    if (handlerArgs) {
      config.handlerArgs = handlerArgs;
    } else {
      config.handlerArgs = null;
    }
    if (isMarkdown) {
      config.isMarkdown = isMarkdown;
    } else {
      config.isMarkdown = false;
    }
  }
  config = Ext.applyIf(config, {message:'not set!', level:0, placement:'b', icon:true, iconCls:'icon-information', duration:me.getDefaultDuration(config.message), isMarkdown:false});
  if (!config.iconCls) {
    config.iconCls = me.defaultIconEnum[level];
  }
  return config;
}, getLevel:function(level) {
  var me = this;
  if (Ext.isString(level)) {
    level = me.levelEnum[level];
  }
  if (Ext.isNumeric(level)) {
    level = me.levelEnum[level];
  }
  if (!level) {
    return me.levelEnum[0];
  }
  return level;
}, makeHtml:function(config) {
  var messageText = config.isMarkdown ? ABPControlSet.util.Markdown.parseMarkdown(config.message) : Ext.htmlEncode(config.message);
  var ret = "\x3cdiv style\x3d'display: flex;' class\x3d'abp-toast-inner-" + this.getLevel(config.level) + "'\x3e" + "\x3cdiv class\x3d'abp-toast-icon-block " + Ext.htmlEncode(config.iconCls) + "'\x3e\x3c/div\x3e" + "\x3cdiv class\x3d'abp-toast-message'\x3e" + messageText + '\x3c/div\x3e' + '\x3c/div\x3e';
  return ret;
}, getDefaultDuration:function(message) {
  return 3000 + message.length * 60;
}, handleClick:function() {
  var me = Ext.getCmp(this.id);
  if (Ext.isFunction(me.handler)) {
    me.handler(me.handlerArgs);
  }
}}}, function(Toast) {
  ABP.toast = function(message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
    return ABP.view.base.toast.ABPToast.show(message, level, iconCls, placement, handler, handlerArgs, isMarkdown);
  };
});
Ext.define('ABP.view.base.toast.ABPToast', {extend:'ABP.view.base.toast.ToastBase', requires:['Ext.Toast', 'ABPControlSet.util.Markdown'], singleton:true, modernAlignmentEnum:{'b':'b-b', 'br':'br', 'bl':'bl', 't':'t-t', 'tr':'tr', 'tl':'tl', 'l':'l-l', 'r':'r-r'}, show:function(message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
  var me = this;
  var config = me.getParamConfig(message, level, iconCls, placement, handler, handlerArgs, isMarkdown);
  if (Ext.isString(config.placement)) {
    config.placement = me.modernAlignmentEnum[config.placement];
  }
  var levelMap = me.getLevel(config.level);
  var ariaLive = me.ariaLiveMapping[levelMap];
  var onclick = config.handler ? me.handleClick : null;
  var toast = Ext.toast({ariaRole:'alert', ariaAttributes:{'aria-live':ariaLive}, message:me.makeHtml(config), timeout:config.duration, alignment:config.placement, shadow:true, onclick:onclick, handler:config.handler, handlerArgs:config.handlerArgs, cls:['abp-toast', 'abp-toast-' + levelMap]});
  return toast;
}, privates:{makeHtml:function(config) {
  var messageText = config.isMarkdown ? ABPControlSet.util.Markdown.parseMarkdown(config.message) : Ext.htmlEncode(config.message);
  var ret = "\x3cdiv style\x3d'display: flex;' class\x3d'abp-toast-inner-" + this.getLevel(config.level) + "'\x3e" + "\x3cdiv class\x3d'abp-toast-icon-block " + Ext.htmlEncode(config.iconCls) + "'\x3e\x3c/div\x3e" + "\x3cdiv class\x3d'abp-toast-message'\x3e" + messageText + '\x3c/div\x3e' + '\x3c/div\x3e';
  return ret;
}}}, function(ABPToast) {
  ABP.toast = function(message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
    return ABP.view.base.toast.ABPToast.show(message, level, iconCls, placement, handler, handlerArgs, isMarkdown);
  };
});
Ext.define('ABP.view.base.automation.AutomationHintOverlay', {extend:'Ext.Container', singleton:true, tooltip:null, alias:'widget.automationoverlay', positioned:true, centered:true, floated:true, fullscreen:true, hidden:true, items:[], style:'background: rgba(255,255,255,0.2); z-index: 9;', cls:'automation-over-top', overlayTip:undefined, toggle:function() {
  if (this.isVisible()) {
    this.hideOverlay();
  } else {
    this.showOverlay();
  }
}, showOverlay:function() {
  var me = this;
  var re = ABP.util.Constants.AUTOMATION_CLASS_REGEX;
  var matches;
  var regions = [];
  var size = Ext.getBody().getViewSize();
  if (!this.overlayTip) {
    var config = {target:me.el, delegate:'div[autolabel]', trackMouse:true, listeners:{beforeshow:function updateTipBody(tip) {
      tip.update(tip.triggerElement.getAttribute('autolabel'));
    }}};
    me.overlayTip = Ext.create('Ext.tip.ToolTip', config);
  }
  function walk(el, func) {
    func(el);
    el = el.firstChild;
    while (el) {
      walk(el, func);
      el = el.nextSibling;
    }
  }
  function getElPos(el) {
    var left = 0, top = 0;
    var xyz = [];
    while (el) {
      left += el.offsetLeft - el.scrollLeft + el.clientLeft;
      top += el.offsetTop - el.scrollTop + el.clientTop;
      if (el.style.transform.indexOf('translate3d') > -1) {
        xyz = el.style.transform.match(/[+-]?[0-9]+.?([0-9]+)?(?=px)/g);
        left += parseInt(xyz[0]);
        top += parseInt(xyz[1]);
      }
      el = el.offsetParent;
    }
    return {left:left, top:top};
  }
  function createRegion(el, label) {
    var elPos = getElPos(el);
    return {xtype:'component', cls:'automation-hint', left:elPos.left, top:elPos.top, width:el.offsetWidth, height:el.offsetHeight, html:label, tooltip:label, tooltip:{html:label, trackMouse:true}, autoEl:{tag:'div', autolabel:label}, listeners:{mouseover:{element:'element', fn:me.highlightElement}, mouseleave:{element:'element', fn:me.removeElementHighlight}}};
  }
  walk(Ext.getBody().dom, function(el) {
    if (el.nodeType === 1) {
      if (el.offsetWidth > 0) {
        matches = el.className.match(re);
        if (matches !== null) {
          regions.push(createRegion(el, matches.filter(function(val, index, array) {
            return Ext.isString(val) && array.indexOf(val) === index;
          }).reduce(function(acc, curVal, _index, array) {
            if (array.length > 1) {
              return acc + ' ' + curVal;
            } else {
              return curVal;
            }
          })));
        }
        if (el.hasAttribute('automationId')) {
          regions.push(createRegion(el, 'automationId: ' + el.getAttribute('automationId')));
        }
      }
    }
  });
  me.removeAll();
  me.setSize(size.width, size.height);
  me.add(regions);
  me.show();
}, hideOverlay:function() {
  var me = this;
  me.removeAll(true, true);
  me.hide();
}, highlightElement:function() {
  var cmp = Ext.getCmp(this.id);
  cmp.addCls('automation-hint-over');
}, removeElementHighlight:function() {
  var cmp = Ext.getCmp(this.id);
  cmp.removeCls('automation-hint-over');
}});
Ext.define('ABP.view.base.PackageViewController', {extend:'Ext.app.ViewController', alternateClassName:'basepackagecontroller', alias:'controller.abppackageviewcontroller', updateTitle:function(title) {
  this.fireEvent('container_toolbar_setTitle', title);
}, showBranding:function(show) {
  this.fireEvent('container_toolbar_showBranding', show);
}, signOut:function(reason, force) {
  this.fireEvent(ABP.Events.signOut, reason, force);
}, showSettings:function(page) {
  this.fireEvent(ABP.Events.showSettings, page);
}, switchLanguage:function(languageKey) {
  this.fireEvent(ABP.Events.switchLanguage, languageKey);
}, switchTheme:function(theme) {
  this.fireEvent(ABP.Events.switchTheme, theme);
}, setRoute:function(hash, force) {
  this.fireEvent(ABP.Events.setRoute, hash, force);
}, addDefaultLanguageStrings:function(strings) {
  this.fireEvent(ABP.Events.addDefaultLanguageStrings, strings);
}, pendingChanges:function(pendingChanges) {
  this.fireEvent(ABP.Events.pendingChanges, pendingChanges);
}, menuToggle:function() {
  this.fireEvent(ABP.Events.menuToggle);
}, menuShow:function() {
  this.fireEvent(ABP.Events.menuShow);
}, menuHide:function() {
  this.fireEvent(ABP.Events.menuHide);
}, menuToggleNav:function() {
  this.fireEvent(ABP.Events.menuToggleNav);
}, menuEnableOption:function(appId, uniqueId, isEnabled) {
  this.fireEvent(ABP.Events.menuEnableOption, appId, uniqueId, isEnabled);
}, menuAddOption:function(nav, parentAppId, parentId, tree) {
  this.fireEvent(ABP.Events.menuAddOption, nav, parentAppId, parentId, tree);
}, menuRemoveOption:function(appId, uniqueId) {
  this.fireEvent(ABP.Events.menuRemoveOption, appId, uniqueId);
}, menuUpdateCount:function(appId, uniqueId, config) {
  this.fireEvent(ABP.Events.menuUpdateCount, appId, uniqueId, config);
}, menuAddRecent:function(pageInfo) {
  this.fireEvent(ABP.Events.menuAddRecent, pageInfo);
}, menuAddFavorite:function(pageInfo) {
  this.fireEvent(ABP.Events.menuAddFavorite, pageInfo);
}, menuRemoveFavorite:function(appId, uniqueId) {
  this.fireEvent(ABP.Events.menuRemoveFavorite, appId, uniqueId);
}, menuUpdateFavorites:function(favoritesArray) {
  this.fireEvent(ABP.Events.menuUpdateFavorites, favoritesArray);
}, menuFocusFavorites:function() {
  this.fireEvent(ABP.Events.menuFocusFavorites);
}, menuReplaceSuggested:function(pageInfoArray) {
  this.fireEvent(ABP.Events.menuReplaceSuggested, pageInfoArray);
}, menuAddTreeItems:function(treeItems) {
  this.fireEvent(ABP.Events.menuAddTreeItems, treeItems);
}, menuRemoveTreeItem:function(appId, uniqueId) {
  this.fireEvent(ABP.Events.menuRemoveTreeItem, appId, uniqueId);
}, toolbarSetTitle:function(newTitle) {
  this.fireEvent(ABP.Events.toolbarSetTitle, newTitle);
}, toolbarAddButton:function(buttonConfig) {
  this.fireEvent(ABP.Events.toolbarAddButton, buttonConfig);
}, toolbarRemoveButton:function(uniqueId) {
  this.fireEvent(ABP.Events.toolbarRemoveButton, uniqueId);
}, toolbarOpenSearch:function() {
  this.fireEvent(ABP.Events.toolbarOpenSearch);
}, rightPaneToggle:function() {
  this.fireEvent(ABP.Events.rightPaneToggle);
}, rightPaneToggleTab:function(uniqueId, open) {
  this.fireEvent(ABP.Events.rightPaneToggleTab, uniqueId, open);
}, rightPaneAddElement:function(content) {
  this.fireEvent(ABP.Events.rightPaneAddElement, content);
}, rightPaneShowButton:function(uniqueId, show) {
  this.fireEvent(ABP.Events.rightPaneShowButton, uniqueId, show);
}, rightPaneInitTab:function(uniqueId) {
  this.fireEvent(ABP.Events.rightPaneInitTab, uniqueId);
}, rightPaneUpdateBadge:function(uniqueId, badgeConfig) {
  this.fireEvent(ABP.Events.rightPaneUpdateBadge, uniqueId, badgeConfig);
}, rightPaneIncrementBadge:function(uniqueId, number) {
  this.fireEvent(ABP.Events.rightPaneIncrementBadge, uniqueId, number);
}, rightPaneDecrementBadge:function(uniqueId, number) {
  this.fireEvent(ABP.Events.rightPaneDecrementBadge, uniqueId, number);
}, rightPaneClearBadge:function(uniqueId) {
  this.fireEvent(ABP.Events.rightPaneClearBadge, uniqueId);
}, notificationsAdd:function(source, sourceKey, notifications) {
  this.fireEvent(ABP.Events.notificationsAdd, source, sourceKey, notifications);
}, notificationsRemove:function(notifications) {
  this.fireEvent(ABP.Events.notificationsRemove, notifications);
}, notificationsRead:function(notifications) {
  this.fireEvent(ABP.Events.notificationsRead, notifications);
}, notificationsUnread:function(notifications) {
  this.fireEvent(ABP.Events.notificationsUnread, notifications);
}, globalSearchSuggestions:function(searchId, searchTerm, suggestions) {
  this.fireEvent(ABP.Events.globalSearchSuggestions, searchId, searchTerm, suggestions);
}, headlinesShow:function(headlines) {
  this.fireEvent(ABP.Events.headlinesShow, headlines);
}, headlinesHide:function(uniqueId) {
  this.fireEvent(ABP.Events.headlinesHide, uniqueId);
}, thumbbarShow:function(config) {
  this.fireEvent(ABP.Events.thumbbarShow, config);
}, thumbbarHide:function(clear) {
  this.fireEvent(ABP.Events.thumbbarHide, clear);
}});
Ext.define('ABP.view.Application', {extend:'Ext.app.Application', name:'ABP', requires:['ABP.util.Common', 'ABP.util.Constants', 'ABP.util.Config', 'ABP.util.CSS.Colors', 'ABP.util.Events', 'ABP.util.Jwt', 'ABP.util.Logger', 'ABP.util.Msal', 'ABP.view.Root', 'ABP.view.ApplicationController', 'ABP.view.base.popUp.PopUp', 'ABP.view.base.toast.ABPToast', 'ABP.view.base.automation.AutomationHintOverlay', 'ABP.store.ABPEnvironmentStore', 'ABP.store.ABPPreBootstrapConfigStore', 'ABP.view.base.PackageViewController', 
'ABP.events.ABPEventDomain', 'ABP.events.ABPEvents'], stores:['ABP.store.ABPApplicationServicesStore', 'ABP.store.ApplicationAuthenticationStore', 'ABP.store.ABPEnvironmentStore', 'ABP.store.ABPServerUrlStore', 'ABP.store.ABPPreBootstrapConfigStore'], controllers:['ABP.view.Root', 'ABP.view.ApplicationController'], listen:{controller:{'#':{unmatchedroute:'onUnmatchedRoute'}}}, onUnmatchedRoute:function(hash) {
  if (!ABP.util.Config.getLoggedIn()) {
    if (hash.indexOf('/') > 0) {
      ABP.util.SessionStorage.set('AfterLoginRedirect', hash);
    }
  }
}, launch:function() {
  ABP.util.Config.setApplication(this);
  ABP.util.Logger.enable();
  Ext.Ajax.setDefaultHeaders({'Accept':'application/json', 'Content-Type':'application/json'});
}});
Ext.define('ABP.view.base.components.ExpandPanelViewModel', {extend:'Ext.app.ViewModel', requires:[], alias:'viewmodel.abpexpandpanel'});
Ext.define('ABP.view.base.popUp.PopUpModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abppopupmodel'});
Ext.define('ABP.view.launch.LaunchCarouselController', {extend:'Ext.app.ViewController', alias:'controller.launchcarouselcontroller', listen:{controller:{'*':{launchCarousel_Settings:'switchToSettings', launchCarousel_Login:'switchToLogin', launchCarousel_Maintenance:'switchToMaintenance', launchCarousel_SelectUser:'switchToSelectUser', launchCarousel_Discovery:'switchToDiscovery'}}}, switchToSettings:function() {
  if (ABP.util.Common.getClassic()) {
    this.getView().setActiveTab('settings-tab');
  } else {
    this.getView().setActiveItem('#' + 'settings-tab');
    this.showLoginForm();
  }
}, switchToLogin:function() {
  if (ABP.util.Common.getClassic()) {
    this.getView().setActiveTab('login-tab');
  } else {
    this.getView().setActiveItem('#' + 'login-tab');
    this.showLoginForm();
  }
  if (ABP.util.Msal.enabled) {
    this.adjustLoginPageForB2cAuth();
  }
}, switchToMaintenance:function(xtypeToShow, additionalStepInfo) {
  var me = this;
  var view = me.getView();
  if (ABP.util.Common.getClassic()) {
    me.switchToSettings();
  }
  if (xtypeToShow) {
    var maintenance = view.down('maintenance');
    if (maintenance) {
      maintenance.showScreen(xtypeToShow, additionalStepInfo);
    }
  }
  if (ABP.util.Common.getClassic()) {
    this.getView().setActiveTab('maintenance-tab');
    if (xtypeToShow) {
      if (xtypeToShow === 'forcepassword') {
        if (view.down('#newPassword')) {
          view.down('#newPassword').focus();
        }
      } else {
        if (xtypeToShow === 'recoverpassword') {
          if (view.down('#recUrl')) {
            view.down('#recUrl').focus();
          }
        }
      }
    }
  } else {
    this.getView().setActiveItem('#' + 'maintenance-tab');
    this.showLoginForm();
  }
}, switchToSelectUser:function() {
  if (ABP.util.Common.getClassic()) {
    var v = this.getView();
    v.setActiveTab('selectuser-tab');
    Ext.defer(v.down('#selectuser-tab').initFocus, 10, v.down('#selectuser-tab'));
  } else {
    this.getView().setActiveItem('#' + 'selectuser-tab');
    this.showLoginForm();
  }
}, switchToDiscovery:function(options) {
  var tabName = 'discovery-tab', error = options ? options.error : null, v = this.getView();
  if (ABP.util.Common.getClassic()) {
    v.setActiveTab(tabName);
    var tab = v.down('#' + tabName), tabVm = tab.getViewModel();
    tabVm.set('errorText', error);
  } else {
    v.setActiveItem('#' + tabName);
    this.showLoginForm();
    var tab = v.down('#' + tabName), tabVm = tab.getViewModel();
    tabVm.set('errorText', error);
  }
}, showLoginForm:function() {
  var view = this.getView();
  var wrapper = view.up('#login-form-wrapper');
  if (wrapper) {
    wrapper.setHidden(false);
  }
}, adjustLoginPageForB2cAuth:function() {
  var me = this;
  var vm = me.getViewModel();
  vm.set('b2cAuth', true);
  vm.set('showUsernameField', false);
}});
Ext.define('ABP.view.launch.LaunchCarouselModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.launchcarouselmodel', data:{env_selection:null}});
Ext.define('ABP.view.launch.discovery.DiscoveryController', {extend:'Ext.app.ViewController', alias:'controller.discoverycontroller', onBoxready:function(event, fn) {
  var me = this, vm = me.getViewModel(), view = me.getView();
  view.down('#email').focus();
}, handleSpecialKeys:function(field, e) {
  if (e.getKey() == e.ENTER) {
    this.loginButtonClick();
  }
}, loginButtonClick:function() {
  var me = this, view = this.getView(), vm = this.getViewModel(), email = vm.get('email'), emailField = view.down('#email');
  if (emailField.isValid() && email) {
    vm.set('errorText', null);
    me.fireEvent('main_showLoading', 'load_discovering', 'fullSize');
    ABP.util.Discovery.discover(email, function() {
      this.fireEvent('main_hideLoading');
      this.fireEvent('main_ShowLogin');
    }.bind(me));
  } else {
    vm.set('errorText', 'Fill in necessary fields');
  }
}, discoverFailure:function(failureMessage) {
  var vm = this.getViewModel();
  me.fireEvent('main_hideLoading');
  vm.set('errorText', failureMessage);
}});
Ext.define('ABP.view.launch.discovery.DiscoveryModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.discoverymodel', data:{email:'', organization:'', errorText:''}, formulas:{shouldOrgBeRequired:function(get) {
  var email = get('email'), unknownDomains = ['gmail', 'yahoo', 'google'];
  return (new RegExp(unknownDomains.join('|'))).test(email);
}}});
Ext.define('ABP.view.launch.login.LoginController', {extend:'Ext.app.ViewController', alias:'controller.logincontroller', listen:{controller:{'*':{login_updateViewModel:'updateViewModel'}}, component:{'*':{login_UserHit:'userEnter', login_PassHit:'loginButtonClick', login_environmentChanged:'onEnvironmentChanged'}}}, onBoxready:function(event, fn) {
  var me = this, vm = me.getViewModel(), view = me.getView();
  if (vm.get('username')) {
    view.down('#password').focus();
  } else {
    view.down('#username').focus();
  }
  me.checkForSignoutReason();
}, checkForSignoutReason:function() {
  var reason = ABP.util.SessionStorage.get('SignoutReason');
  if (reason && reason !== 'user init') {
    ABP.util.SessionStorage.remove('SignoutReason');
    ABP.view.base.popUp.PopUp.showError(reason);
  }
}, onTabChanged:function(event) {
}, checkLocalStorageAccess:function() {
  if (!ABP.util.LocalStorage.localStorageWritable()) {
    ABP.view.base.popUp.PopUp.showError('Your browser settings are preventing the use of local storage.  Please change settings before opening this program.');
  }
}, initViewModel:function() {
  var me = this;
  me.checkLocalStorageAccess();
  var vm = me.getViewModel();
  var reason = ABP.util.SessionStorage.get('SignoutReason');
  if (reason && reason !== 'user init') {
    vm.set('loginErrorLabel', reason);
  }
  ABP.util.SessionStorage.remove('SignoutReason');
  var preauthUser = vm.get('bootstrapConf.authenticatedUserName');
  var authType = vm.get('bootstrapConf.settings.authenticationType');
  if (authType === 'integrated' && preauthUser !== undefined && preauthUser !== null && preauthUser !== '') {
    vm.set('username', preauthUser);
  } else {
    me.setInitialValue({toModelField:'username', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberUsername', useLocalStorageKey:'SavedUsername'});
    me.setInitialValue({toModelField:'password', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberPassword', useLocalStorageKey:'SavedPassword'});
  }
  me.setInitialValue({toModelField:'selected_environment', useDefaultValueFrom:'bootstrapConf.defaultEnvironment', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberEnvironment', useLocalStorageKey:'SavedEnvironment'});
  me.setInitialValue({toModelField:'selected_language', useDefaultValueFrom:'bootstrapConf.settings.defaultLanguage', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberLanguage', useLocalStorageKey:'SavedLanguage'});
}, setInitialValue:function(opts) {
  var me = this;
  var vm = me.getViewModel();
  var initialValue = opts.useDefaultValueFrom ? vm.get(opts.useDefaultValueFrom) : '';
  var queryLS = opts.ifLocalStorageEnabledBy ? vm.get(opts.ifLocalStorageEnabledBy) : false;
  if (queryLS && (queryLS === true || queryLS === 'true')) {
    var savedValue = ABP.util.LocalStorage.get(opts.useLocalStorageKey);
    if (savedValue && savedValue !== '' && savedValue !== null) {
      initialValue = savedValue;
    }
  }
  vm.set(opts.toModelField, initialValue);
}, updateViewModel:function() {
  var me = this;
  var vm = me.getViewModel();
  vm.set('username', ABP.util.LocalStorage.get('SavedUsername'));
  vm.set('password', ABP.util.LocalStorage.get('SavedPassword'));
  vm.set('selected_environment', ABP.util.LocalStorage.get('SavedEnvironment'));
  vm.set('selected_language', ABP.util.LocalStorage.get('SavedLanguage'));
}, loginButtonClick:function() {
  var me = this;
  var view = me.getView();
  ABP.util.Common.flushAllBindings(view);
  var vm = me.getViewModel();
  var usernameField = me.lookupReference('usernameField');
  if (usernameField) {
    vm.set('username', usernameField.getValue());
  }
  var passfield = me.lookupReference('passwordField');
  if (passfield) {
    passfield.blur();
    vm.set('password', passfield.getValue());
  }
  var complete = me.checkInputs();
  var keep = vm.get('keepMeSignedIn');
  var locale = 'en';
  var extras = view.down('#loginExtraFieldCont');
  var i = 0;
  var configExtras = [];
  var extraFields = [];
  var extraSettings = me.getExtraSettingsFields();
  if (vm.get('lan_selection')) {
    locale = vm.get('lan_selection').data.key;
  } else {
    if (vm.get('bootstrapConf.settings.defaultLanguage')) {
      locale = vm.get('bootstrapConf.settings.defaultLanguage');
    }
  }
  var env = vm.get('environment');
  if (vm.get('env_selection')) {
    env = vm.get('env_selection').id;
  }
  if (ABP.util.Common.getClassic()) {
    extras = extras.items.items;
  } else {
    extras = extras.getInnerItems();
  }
  if (complete === true) {
    var jsonData = {'environment':env, 'logonId':vm.get('username'), 'password':vm.get('password'), 'locale':locale, 'forceLogin':false};
    if (extras.length > 0) {
      for (i = 0; i < extras.length; ++i) {
        var extraField = extras[i];
        if (extraField.request === 'authentication') {
          if (extraField.getValue && extraField.getValue() !== undefined) {
            jsonData[extraField.fieldId] = extraField.getValue();
          } else {
            if (extraField.getFieldData && extraField.getFieldData() !== undefined) {
              jsonData[extraField.fieldId] = extraField.getFieldData();
            }
          }
        } else {
          if (extraField.request === 'configuration') {
            if (extraField.getValue && extraField.getValue() !== undefined) {
              configExtras.push({fieldId:extraField.fieldId, val:extraField.getValue()});
            } else {
              if (extraField.getFieldData && extraField.getFieldData() !== undefined) {
                configExtras.push({fieldId:extraField.fieldId, val:extraField.getFieldData()});
              }
            }
          }
        }
        if (extraField.getValue && extraField.getValue() !== undefined) {
          extraFields.push({fieldId:extraField.fieldId, val:extraField.getValue()});
        } else {
          if (extraField.getFieldData && extraField.getFieldData() !== undefined) {
            extraFields.push({fieldId:extraField.fieldId, val:extraField.getFieldData()});
          }
        }
      }
    }
    if (extraSettings && extraSettings.length > 0) {
      for (i = 0; i < extraSettings.length; ++i) {
        jsonData[extraSettings[i].fieldId] = extraSettings[i].val;
      }
    }
    ABP.util.LocalStorage.remove('loginextrafields');
    vm.getParent().getParent().set('configurationExtraInfo', configExtras);
    vm.getParent().getParent().set('loginExtraFieldsFilled', extraFields);
    if (extras.length > 0) {
      this.fireEvent('main_saveExtraFieldInfo');
    }
    this.fireEvent('main_Authenticate', jsonData, keep);
  } else {
    if (!complete) {
      ABP.view.base.popUp.PopUp.showError('login_all_fields');
    } else {
      ABP.view.base.popUp.PopUp.showError(complete);
    }
  }
}, onSettingsClick:function() {
  this.fireEvent('launchCarousel_Settings', this);
}, onForgotPasswordClick:function() {
  this.fireEvent('launchCarousel_Maintenance', 'recoverpassword');
}, onEnvironmentChanged:function(newVal) {
  var me = this;
  var vM = me.getViewModel();
  var environments = vM.data.main_environmentStore.data;
  if (newVal) {
    if (environments !== undefined && environments.length > 0) {
      var newEnv = environments.getByKey(newVal.id || newVal);
      if (newEnv.data.languages) {
        var langs = vM.getStore('login_settingsStore');
        if (!Ext.isArray(newEnv.data.languages)) {
          if (newEnv.data.languages.key) {
            langs.loadData([newEnv.data.languages]);
            me.showLanguages(true);
          } else {
            me.showLanguages(false);
          }
        } else {
          var copy = newEnv.data.languages.slice(0);
          var languages = me.getOrderedLanguages(copy);
          if (languages) {
            langs.loadData(languages);
            me.showLanguages(true);
          } else {
            me.showLanguages(false);
          }
        }
      } else {
        me.showLanguages(false);
      }
    }
  }
}, getOrderedLanguages:function(newLangs) {
  var me = this;
  var vM = me.getViewModel();
  var def = vM.get('bootstrapConf.settings.defaultLanguage');
  var i;
  var defaultLang;
  var rememLang;
  var remLang = ABP.util.LocalStorage.get('SavedLanguage');
  var retLangs = null;
  var removal = [];
  if (def !== undefined && def !== null && newLangs.length > 0) {
    for (i = newLangs.length - 1; i > -1; --i) {
      if (!newLangs[i].key || !newLangs[i].name) {
        removal.push(i);
      }
    }
    if (removal.length > 0) {
      for (i = 0; i < removal.length; ++i) {
        newLangs.splice(i, 1);
      }
    }
    if (newLangs.length > 0) {
      for (i = 0; i < newLangs.length; ++i) {
        if (def === newLangs[i].key) {
          defaultLang = [];
          defaultLang.push(newLangs[i]);
          newLangs.splice(i, 1);
          retLangs = defaultLang.concat(newLangs);
        }
      }
    }
    if (newLangs.length > 0 && retLangs === null) {
      retLangs = newLangs;
    }
  } else {
    if (!def && newLangs.length > 0) {
      retLangs = newLangs;
    }
  }
  if (remLang && retLangs) {
    removal = [];
    for (i = retLangs.length - 1; i > -1; --i) {
      if (!retLangs[i].key || !retLangs[i].name) {
        removal.push(i);
      }
    }
    if (removal.length > 0) {
      for (i = 0; i < removal.length; ++i) {
        retLangs.splice(i, 1);
      }
    }
    if (retLangs.length > 0) {
      for (i = 0; i < retLangs.length; ++i) {
        if (remLang === retLangs[i].key) {
          rememLang = [];
          rememLang.push(retLangs[i]);
          retLangs.splice(i, 1);
          retLangs = rememLang.concat(retLangs);
        }
      }
    }
  }
  return retLangs;
}, showLanguages:function(showBool) {
  var me = this;
  var vm = me.getViewModel();
  var combo = me.getView().down('#login-language');
  if (showBool) {
    combo.focusable = true;
    if (ABP.util.Common.getClassic()) {
      combo.select(combo.store.data.items[0]);
    }
  } else {
    combo.focusable = false;
  }
}, checkInputs:function() {
  var me = this;
  var view = me.getView();
  var ret = true;
  if (ABP.util.Msal.enabled) {
    return true;
  }
  var user = view.down('#username');
  var pass = view.down('#password');
  var extras = view.down('#loginExtraFieldCont');
  var i = 0;
  if (user.getValue().length <= 0) {
    ret = false;
    user.addCls('login-error');
  } else {
    user.removeCls('login-error');
  }
  if (pass.isVisible() && pass.getValue().length <= 0) {
    ret = false;
    pass.addCls('login-error');
  } else {
    pass.removeCls('login-error');
  }
  if (extras.items && extras.items.items && !Ext.isEmpty(extras.items.items)) {
    for (i = 0; i < extras.items.items.length; ++i) {
      if (extras.items.items[i].required) {
        if (extras.items.items[i].getValue() !== '') {
          extras.items.items[i].removeCls('login-error');
        } else {
          ret = false;
          extras.items.items[i].addCls('login-error');
        }
      }
      if (extras.items.items[i].checkValue && !extras.items.items[i].checkValue()) {
        if (extras.items.items[i].getErrorString) {
          ret = extras.items.items[i].getErrorString();
        } else {
          ret = false;
        }
        extras.items.items[i].addCls('login-error');
      }
    }
  }
  return ret;
}, keepMeSignedInClicked:function() {
  var me = this;
  var vm = me.getViewModel();
  var checked = vm.get('keepMeSignedIn');
  vm.set('keepMeSignedIn', !checked);
}, userEnter:function() {
  var me = this;
  var passfield = me.lookupReference('passwordField');
  if (passfield) {
    passfield.focus();
  }
}, getExtraSettingsFields:function() {
  var ret;
  var local = ABP.util.LocalStorage.get('settingsextrafields');
  if (local) {
    ret = JSON.parse(local);
  } else {
    ret = this.getViewModel().get('prebootstrapExtraSettingsFilled');
  }
  return ret;
}});
Ext.define('ABP.view.launch.login.LoginModel', {requires:['ABP.model.SettingsLanguageModel'], extend:'Ext.app.ViewModel', alias:'viewmodel.loginmodel', data:{username:'', password:'', lan_selection:null, selected_environment:'', selected_language:''}, stores:{login_settingsStore:{model:'ABP.model.SettingsLanguageModel'}}, formulas:{canRecoverPassword:{bind:{_canRecoverPassword:'{bootstrapConf.settings.canRecoverPassword}', _b2cAuth:'{b2cAuth}'}, get:function(data) {
  if (data._b2cAuth === false && (data._canRecoverPassword === true || data._canRecoverPassword === 'true')) {
    return true;
  }
  return false;
}}, canKeepMeSignedIn:{bind:{_canKeepMeSignedIn:'{bootstrapConf.settings.canKeepMeSignedIn}', _isOffline:'{isOffline}', _offlineMode:'{offlineMode}'}, get:function(data) {
  if (data._isOffline || data._offlineMode) {
    return false;
  }
  if (data._canKeepMeSignedIn === true || data._canKeepMeSignedIn === 'true') {
    return true;
  }
  return false;
}}, keepMeSignedInIcon:{bind:{_checked:'{keepMeSignedIn}'}, get:function(data) {
  var ret;
  if (data._checked) {
    ret = 'icon-checked-square';
  } else {
    ret = 'icon-unchecked-square';
  }
  return ret;
}}, allowServiceChange:{bind:{_allowServiceChange:'{bootstrapConf.settings.allowServiceChange}'}, get:function(data) {
  if (data._allowServiceChange === true || data._allowServiceChange === 'true') {
    return true;
  }
  return false;
}}, preauthenticated:{bind:{_authenticatedUserName:'{bootstrapConf.authenticatedUserName}', _authenticationType:'{bootstrapConf.settings.authenticationType}'}, get:function(data) {
  if (data._authenticationType === 'integrated' && data._authenticatedUserName !== undefined && data._authenticatedUserName !== null && data._authenticatedUserName !== '') {
    this.set('username', data._authenticatedUserName);
    return true;
  }
  return false;
}}, canselectuser:{bind:{_canKeepMultipleUsersSignedIn:'{bootstrapConf.settings.canKeepMultipleUsersSignedIn}'}, get:function(data) {
  if (data._canKeepMultipleUsersSignedIn) {
    var userData = ABP.util.LocalStorage.getUserData();
    if (userData && userData.length > 0) {
      return true;
    }
  }
  return false;
}}, environment:{bind:{_avail:'{bootstrapConf.availableEnvironments}', _selected:'{selected_environment}', _default:'{bootstrapConf.defaultEnvironment}'}, get:function(data) {
  var avail = data._avail;
  var i;
  if (data._selected && avail) {
    for (i = 0; i < avail.length; ++i) {
      if (avail[i].id === data._selected || avail[i].name === data._selected) {
        return avail[i].id;
      }
    }
  }
  if (data._default && avail) {
    for (i = 0; i < avail.length; ++i) {
      if (avail[i].id === data._default || avail[i].name === data._default) {
        return avail[i].id;
      }
    }
  }
  if (avail && avail.length > 0) {
    return avail[0].id;
  }
  return null;
}}, hideEnvironment:{bind:{environments:'{bootstrapConf.availableEnvironments}', simplifyControls:'{bootstrapConf.settings.showSimpleLogin}'}, get:function(data) {
  if (!data.simplifyControls) {
    return false;
  }
  if (data.environments && data.environments.length === 1) {
    return true;
  }
  return false;
}}, hideLanguage:{bind:{environment:'{env_selection}', simplifyControls:'{bootstrapConf.settings.showSimpleLogin}'}, get:function(data) {
  if (!data.simplifyControls) {
    return false;
  }
  if (!data.environment) {
    return false;
  }
  if (data.environment.data && data.environment.data.languages && data.environment.data.languages.length === 1) {
    return true;
  }
  return false;
}}, language:{bind:{_env:'{env_selection}', _avail:'{bootstrapConf.availableEnvironments}', _def:'{selected_language}'}, get:function(data) {
  var env, i, lang;
  if (data._def && data._env && data._avail) {
    for (i = 0; i < data._avail.length; ++i) {
      if (data._avail[i].id === data._env.id) {
        env = data._avail[i];
        break;
      }
    }
    if (env) {
      if (env.languages && env.languages.length > 0) {
        for (i = 0; i < env.languages.length; ++i) {
          if (env.languages[i].key === data._def) {
            lang = env.languages[i];
            break;
          }
        }
        if (lang) {
          return lang.key;
        }
        return env.languages[0].key;
      }
    }
    return null;
  }
  if (data._env && data._avail) {
    for (i = 0; i < data._avail.length; ++i) {
      if (data._avail[i].id === data._env.id) {
        env = data._avail[i];
        break;
      }
    }
    if (env) {
      if (env.languages && env.languages.length > 0) {
        return env.languages[0].key;
      }
    }
  }
  return null;
}}, extraLoginFields:{bind:{__extraField:'{bootstrapConf.settings.extraLoginFields}'}, get:function(data) {
  var ret = [];
  var classic = ABP.util.Common.getClassic();
  var saved;
  var i = 0;
  if (data.__extraField) {
    for (i = 0; i < data.__extraField.length; ++i) {
      if (this.checkForExistingFieldId(ret, data.__extraField[i].fieldId)) {
        saved = this.checkForSavedValue(data.__extraField[i].fieldId);
        if (classic) {
          if (data.__extraField[i].type) {
            if (data.__extraField[i].type === 'text') {
              ret.push({xtype:'textfield', cls:'a-extraloginfield-text-' + data.__extraField[i].fieldId, width:'100%', labelAlign:'top', fieldLabel:ABP.util.Common.geti18nString(data.__extraField[i].label), itemId:'extraLoginFields_' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, required:data.__extraField[i].required || false, request:data.__extraField[i].request, value:saved || data.__extraField[i].value || ''});
            } else {
              if (data.__extraField[i].type === 'list' && data.__extraField[i].options && data.__extraField[i].options.length > 0) {
                ret.push({xtype:'combo', cls:'launch-combo-box a-extraloginfield-list-' + data.__extraField[i].fieldId, width:'100%', labelAlign:'top', fieldLabel:ABP.util.Common.geti18nString(data.__extraField[i].label), itemId:'extraLoginFields_' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, store:{data:data.__extraField[i].options}, displayField:'name', value:saved || data.__extraField[i].options[0].key, valueField:'key', triggerAction:'all', allowBlank:false, labelWidth:0, 
                editable:false, autoSelect:true, required:data.__extraField[i].required || false, request:data.__extraField[i].request});
              } else {
                if (data.__extraField[i].type === 'toggle') {
                  var isActive = Ext.isBoolean(saved) ? saved : data.__extraField[i].active === 'true' || data.__extraField[i].active === true;
                  ret.push({xtype:'button', cls:'login-keepme', fieldId:data.__extraField[i].fieldId, itemId:'extraLoginFields_' + data.__extraField[i].fieldId, width:'100%', focusCls:'', text:ABP.util.Common.geti18nString(data.__extraField[i].text), iconCls:isActive ? 'icon-checked-square' : 'icon-unchecked-square', active:isActive, value:isActive, handler:function() {
                    this.active = !this.active;
                    if (this.active) {
                      this.setIconCls('icon-checked-square');
                    } else {
                      this.setIconCls('icon-unchecked-square');
                    }
                    this.value = this.active;
                  }, required:data.__extraField[i].required || false, request:data.__extraField[i].request, getRequired:function() {
                    return this.required;
                  }});
                } else {
                  if (data.__extraField[i].type === 'number') {
                    var len = null;
                    if (data.__extraField[i].maxVal) {
                      len = data.__extraField[i].maxVal.length;
                    }
                    ret.push({xtype:'numberfield', cls:'a-extrasettingsfield-text-' + data.__extraField[i].fieldId, width:'100%', labelAlign:'top', fieldLabel:ABP.util.Common.geti18nString(data.__extraField[i].label), itemId:'extraSettingsFields' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, value:saved || '', required:data.__extraField[i].required || false, maxValue:data.__extraField[i].maxVal ? parseFloat(data.__extraField[i].maxVal) : null, minValue:data.__extraField[i].minVal ? 
                    parseFloat(data.__extraField[i].minVal) : null, maxLength:len, enforceMaxLength:true, checkValue:function() {
                      var ret = true;
                      var val = this.getValue();
                      var maxVal = this.maxValue;
                      var minVal = this.minValue;
                      var valString;
                      if (minVal && val < minVal) {
                        valString = ABP.util.Common.geti18nString('login_extraValue');
                        ret = false;
                        ABP.view.base.popUp.PopUp.showError(this.getEmptyText() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
                      } else {
                        if (maxVal && val > maxVal) {
                          valString = ABP.util.Common.geti18nString('login_extraValue');
                          ret = false;
                          ABP.view.base.popUp.PopUp.showError(this.getEmptyText() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
                        }
                      }
                      return ret;
                    }});
                  } else {
                    if (data.__extraField[i].type === 'button') {
                      ret.push(this.__makeClassicButton(data.__extraField[i]));
                    }
                  }
                }
              }
            }
          }
        } else {
          if (data.__extraField[i].type) {
            if (data.__extraField[i].type === 'text') {
              ret.push({xtype:'textfield', cls:['x-unselectable', 'login-form', 'a-extraloginfield-text-' + data.__extraField[i].fieldId], width:'100%', clearable:false, allowBlank:'false', labelAlign:'top', label:ABP.util.Common.geti18nString(data.__extraField[i].label), itemId:'extraLoginFields_' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, required:data.__extraField[i].required || false, request:data.__extraField[i].request, value:saved || ''});
            } else {
              if (data.__extraField[i].type === 'list' && data.__extraField[i].options && data.__extraField[i].options.length > 0) {
                ret.push({xtype:'selectfield', cls:['login-form', 'a-extraloginfield-list-' + data.__extraField[i].fieldId], width:'100%', labelAlign:'top', label:ABP.util.Common.geti18nString(data.__extraField[i].label), itemId:'extraLoginFields_' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, store:{data:data.__extraField[i].options}, displayField:'name', value:saved || data.__extraField[i].options[0].key, valueField:'key', triggerAction:'all', allowBlank:false, labelWidth:0, 
                editable:false, autoSelect:true, required:data.__extraField[i].required || false, request:data.__extraField[i].request});
              } else {
                if (data.__extraField[i].type === 'toggle') {
                  var isActive = Ext.isBoolean(saved) ? saved : data.__extraField[i].active === 'true' || data.__extraField[i].active === true;
                  ret.push({xtype:'button', cls:['login-keepme', 'a-extraloginfield-button' + data.__extraField[i].fieldId], itemId:'extraLoginFields_' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, text:ABP.util.Common.geti18nString(data.__extraField[i].text), iconCls:isActive ? 'icon-checked-square' : 'icon-unchecked-square', active:isActive, value:isActive, handler:function() {
                    this.active = !this.active;
                    if (this.active) {
                      this.setIconCls('icon-checked-square');
                    } else {
                      this.setIconCls('icon-unchecked-square');
                    }
                    this.setValue(this.active);
                  }, width:'100%', request:data.__extraField[i].request, required:data.__extraField[i].required || false, getRequired:function() {
                    return this.required;
                  }});
                } else {
                  if (data.__extraField[i].type === 'number') {
                    ret.push({xtype:'abpnumberfield', cls:['x-unselectable', 'login-form', 'a-extraloginfield-text-' + data.__extraField[i].fieldId], width:'100%', clearable:false, allowBlank:'false', labelAlign:'top', label:ABP.util.Common.geti18nString(data.__extraField[i].label), itemId:'extraSettingsFields' + data.__extraField[i].fieldId, fieldId:data.__extraField[i].fieldId, required:data.__extraField[i].required || false, maxValue:data.__extraField[i].maxVal ? parseFloat(data.__extraField[i].maxVal) : 
                    null, minValue:data.__extraField[i].minVal ? parseFloat(data.__extraField[i].minVal) : null, value:saved || ''});
                  } else {
                    if (data.__extraField[i].type === 'button') {
                      ret.push(this.__makeModernButton(data.__extraField[i]));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return ret;
}}, loginBtnText:{bind:{_online:'{i18n.login_signin_btn}', _offline:'{i18n.login_offline_signin_btn}', _isOffline:'{isOffline}', _offlineMode:'{offlineMode}'}, get:function(data) {
  if (data._isOffline || data._offlineMode) {
    return data._offline;
  } else {
    return data._online;
  }
}}, passwordText:{bind:{_online:'{i18n.login_password}', _offline:'{i18n.offline_login_password}', _isOffline:'{isOffline}', _offlineMode:'{offlineMode}'}, get:function(data) {
  if (data._isOffline || data._offlineMode) {
    try {
      var bootstrapConfig = this.get('bootstrapConf');
      if (bootstrapConfig.offlineAuthenticationType && bootstrapConfig.offlineAuthenticationType === 1) {
        return data._offline;
      }
    } catch (err) {
      return data._online;
    }
    return data._offline;
  } else {
    return data._online;
  }
}}, showPasswordField:{bind:{_isOffline:'{isOffline}', _offlineMode:'{offlineMode}'}, get:function(data) {
  var offlineAuthType = this.get('bootstrapConf.offlineAuthenticationType');
  var preAuth = this.get('preauthenticated');
  var b2cAuth = this.get('b2cAuth');
  var offlineNoAuth = (data._isOffline || data._offlineMode) && offlineAuthType === 0;
  if (b2cAuth || preAuth || offlineNoAuth) {
    return false;
  } else {
    return true;
  }
}}}, checkForExistingFieldId:function(where, what) {
  var i = 0;
  var ret = true;
  for (i = 0; i < where.length; ++i) {
    if (where[i].fieldId === what) {
      ret = false;
      break;
    }
  }
  return ret;
}, checkForSavedValue:function(fieldId) {
  var local = ABP.util.LocalStorage.get('loginextrafields');
  var json;
  var ret = null;
  var i = 0;
  if (local) {
    json = JSON.parse(local);
    for (i = 0; i < json.length; ++i) {
      if (json[i].fieldId === fieldId) {
        ret = json[i].val;
        break;
      }
    }
  }
  return ret;
}, __makeClassicButton:function(field) {
  var type = field.action;
  var handler;
  var popup;
  switch(type) {
    case 'popup':
      handler = function() {
        popup = Ext.create('ABP.view.base.popUp.PopUpFrame', {config:{buttonInfo:field}});
        popup.show();
      };
      break;
    case 'redirect':
      handler = function() {
        window.location.href = field.url;
      };
      break;
    case 'newTab':
      handler = function() {
        window.open(field.url);
      };
      break;
  }
  return {xtype:'button', handler:handler, cls:'btn-extra a-extrasettingsfield-button-' + field.fieldId, itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, bind:{text:field.labelKey ? '{i18n.' + field.labelKey + '}' : field.label}, width:'100%', fieldData:null, request:field.request, setFieldData:function(data) {
    this.fieldData = data;
  }, getFieldData:function() {
    return this.fieldData;
  }, getRequired:function() {
    return false;
  }};
}, __makeModernButton:function(field) {
  var type = field.action;
  var handler;
  var popup;
  switch(type) {
    case 'popup':
      handler = function() {
        popup = Ext.create({xtype:'popupframe', config:{buttonInfo:field}});
        popup.show();
      };
      break;
    case 'redirect':
      handler = function() {
        window.location.href = field.url;
      };
      break;
    case 'newTab':
      handler = function() {
        window.open(field.url);
      };
      break;
  }
  return {xtype:'button', handler:handler, cls:['btn-login', 'login-form', 'a-extrasettingsfield-button-' + field.fieldId], itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, margin:'6 0 4 0', bind:{text:field.labelKey ? '{i18n.' + field.labelKey + '}' : field.label}, width:'100%', fieldData:null, request:field.request, setFieldData:function(data) {
    this.fieldData = data;
  }, getFieldData:function() {
    return this.fieldData;
  }, getRequired:function() {
    return false;
  }};
}});
Ext.define('ABP.view.launch.selectuser.SelectUserController', {extend:'Ext.app.ViewController', alias:'controller.selectusercontroller', requires:['ABP.store.ABPEnvironmentStore'], listen:{component:{'*':{selectuser_select:'selectUser', selectuser_delete:'deleteUser', selectuser_new:'newUser'}}, controller:{'*':{selectuser_load_users:'loadUsers'}}, store:{'#ABPEnvironmentStore':{datachanged:'environmentStoreChanged'}}}, selectUser:function(record) {
  if (record) {
    var env = record.get('env');
    var user = record.get('username');
    var logonAsUserObj = ABP.util.Common.getLoginAsUserObj(env, user, ABP.util.LocalStorage.getForUser(env, user, 'sessionToken'), ABP.util.LocalStorage.getForUser(env, user, 'SavedLanguage'), ABP.util.LocalStorage.getForUser(env, user, 'SavedPassword'));
    this.fireEvent('main_loginAsUser', logonAsUserObj);
  }
}, deleteUser:function(record) {
  if (record) {
    ABP.util.LocalStorage.removeAllForUser(record.get('env'), record.get('user'));
    var vm = this.getViewModel();
    if (vm) {
      var users = vm.getStore('userStore');
      if (users) {
        users.reload();
      }
    }
  }
}, loadUsers:function() {
  var vm = this.getViewModel();
  if (vm) {
    var users = vm.getStore('userStore');
    if (users) {
      users.load();
      if (users.numRealUsers) {
        vm.set('selectedUser', users.getAt(1));
      } else {
        vm.set('selectedUser', users.getAt(0));
      }
      console.log('store loaded');
    }
  }
}, newUser:function() {
  this.fireEvent('main_showLoginForNewUser', null);
}, environmentStoreChanged:function() {
  this.loadUsers();
}, init:function() {
  this.callParent();
  var vm = this.getViewModel();
  if (vm && vm.get('bootstrapped')) {
    this.loadUsers();
  }
}});
Ext.define('ABP.view.launch.selectuser.SelectUserModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.selectusermodel', requires:['Ext.data.StoreManager'], data:{selectedUser:null}, stores:{userStore:{fields:['env', 'user', 'envName'], autoLoad:false, autoSync:true, proxy:{type:'memory', reader:{type:'json'}}, numRealUsers:0, load:function() {
  var users = ABP.util.LocalStorage.getUserData();
  if (!Ext.isArray(users)) {
    users = [];
  }
  Ext.Array.sort(users, function(a, b) {
    if (Ext.isObject(a) && Ext.isObject(b)) {
      var aDate = parseInt(a.data.LastLogin);
      var bDate = parseInt(b.data.LastLogin);
      if (aDate && !bDate) {
        return -1;
      } else {
        if (!aDate && bDate) {
          return 1;
        } else {
          if (!aDate && !bDate) {
            return 0;
          } else {
            if (aDate < bDate) {
              return 1;
            } else {
              if (aDate > bDate) {
                return -1;
              }
            }
          }
        }
      }
    }
    return 0;
  });
  var envStore = Ext.data.StoreManager.lookup('ABPEnvironmentStore');
  if (envStore) {
    if (Ext.isArray(users) && users.length > 0) {
      for (var i = 0; i < users.length; i++) {
        var env = envStore.getById(users[i].env);
        if (env) {
          users[i].envName = env.data.name;
        } else {
          Ext.Array.removeAt(users, i);
          i--;
        }
      }
    }
  }
  this.numRealUsers = users.length;
  users.unshift({user:ABP.util.Common.geti18nString('login_selectUserAnotherUser'), username:ABP.util.Common.geti18nString('login_selectUserAnotherUser'), useAnotherUser:true});
  this.loadData(users);
  return this;
}}}});
Ext.define('ABP.view.launch.settings.ExtraStepController', {extend:'Ext.app.ViewController', alias:'controller.extrastepcontroller', backButtonClick:function() {
  this.fireEvent('launchCarousel_Login', this);
}, continueButtonClick:function() {
  var me = this;
  var view = me.getView();
  var inner = view.down('#ABPExtraStepCustomContainer');
  var ret;
  if (inner) {
    inner = inner.down();
    if (inner && inner.getController() && inner.getController().getSaveData) {
      ret = inner.getController().getSaveData();
      if (ret) {
        me.fireEvent('main_secondAuthStep', ret, view.config.additionalInfo.path);
      }
    }
  }
}});
Ext.define('ABP.view.launch.maintenance.ForcePasswordController', {extend:'Ext.app.ViewController', alias:'controller.forcepassword', listen:{component:{'*':{forcepw_Signin:'signInButtonClick'}}}, backButtonClick:function() {
  this.fireEvent('launchCarousel_Login', this);
}, signInButtonClick:function() {
  var me = this;
  var vm = me.getViewModel();
  var newPass = vm.get('newPassword');
  var confPass = vm.get('confirmPassword');
  if (newPass.length <= 0 || confPass <= 0) {
    if (newPass.length <= 0) {
      me.getView().down('#newPassword').addCls('login-error');
    } else {
      me.getView().down('#newPassword').removeCls('login-error');
    }
    if (confPass <= 0) {
      me.getView().down('#confirmPassword').addCls('login-error');
    } else {
      me.getView().down('#confirmPassword').removeCls('login-error');
    }
    ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_enterNewPassword'), vm.get('i18n.error_ok_btn'));
  } else {
    me.getView().down('#newPassword').removeCls('login-error');
    me.getView().down('#confirmPassword').removeCls('login-error');
    if (vm.get('newPassword') !== vm.get('confirmPassword')) {
      ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_passwordsDoNotMatch'), vm.get('i18n.error_ok_btn'));
    } else {
      var loginJson = vm.get('forcePasswordChange');
      var pwChangeData = {'environment':loginJson.environment, 'logonId':loginJson.logonId, 'password':loginJson.password, 'newPassword':vm.get('newPassword')};
      me.fireEvent('main_showLoading', 'Sending Request', 'fullSize');
      var urlPartTwo = '/abp/ChangePassword/';
      Ext.Ajax.request({url:me.getServerUrl() + urlPartTwo, disableCaching:false, withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version > 9, method:'POST', jsonData:pwChangeData, success:function(response) {
        var r = Ext.JSON.decode(response.responseText);
        if (r.resultCode === 0) {
          loginJson.password = pwChangeData.newPassword;
          me.fireEvent('main_Authenticate', loginJson);
        } else {
          if (r.resultCode >= 1 && r.resultCode <= 6) {
            var i18nMsg = vm.get('i18n.' + r.errorMessageKey);
            ABP.view.base.popUp.PopUp.showPopup(i18nMsg || r.errorMessage, vm.get('i18n.error_ok_btn'));
            me.fireEvent('main_hideLoading');
          } else {
            ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_passwordChangeFailed'), vm.get('i18n.error_ok_btn'));
            me.fireEvent('main_hideLoading');
          }
        }
      }, failure:function() {
        me.fireEvent('main_hideLoading');
        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_passwordChangeFailed'), vm.get('i18n.error_ok_btn'));
      }});
    }
  }
}, getServerUrl:function() {
  return ABP.util.LocalStorage.get('ServerUrl');
}});
Ext.define('ABP.view.launch.maintenance.ForcePasswordModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.forcepassword', data:{newPassword:'', confirmPassword:''}});
Ext.define('ABP.view.launch.settings.OfflinePasswordController', {extend:'Ext.app.ViewController', alias:'controller.offlinepasswordcontroller', listen:{component:{'*':{savepassword:'saveButtonClick'}}}, cancelButtonClick:function() {
  if (!ABP.util.Config.getLoggedIn()) {
    ABP.util.LocalStorage.setForLoggedInUser('OfflinePasswordSkipped', true);
    this.fireEvent('main_doConfiguration');
  } else {
    this.fireEvent('featureCanvas_hideSetting');
  }
}, saveButtonClick:function() {
  var me = this;
  var view = me.getView();
  var vm = this.getViewModel();
  var passwordField = me.lookupReference('offlinepassword');
  var confirmpasswordField = me.lookupReference('confirmofflinepassword');
  var password = passwordField.getValue();
  var confirmpassword = confirmpasswordField.getValue();
  if (!password) {
    passwordField.markInvalid('Enter a password');
    passwordField.focus();
    return;
  }
  if (!confirmpassword) {
    confirmpasswordField.markInvalid('Enter password again');
    confirmpasswordField.focus();
    return;
  }
  if (password !== confirmpassword) {
    ABP.view.base.popUp.PopUp.showError('offline_passwords_dont_match');
    return;
  }
  if (vm.get('bootstrapConf.validateOfflinePassword') === true) {
    var serverUrl = ABP.util.LocalStorage.get('ServerUrl');
    jsonData = {logonId:ABP.util.Config.getUsername(), environment:ABP.util.Config.getEnvironment(), offlinePassword:password};
    ABP.util.Ajax.request({url:serverUrl + '/abp/offlinePassword', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version > 9, method:'POST', jsonData:jsonData, success:function(response) {
      var resp = Ext.JSON.decode(response.responseText);
      if (resp.resultCode === 0) {
        me.saveOfflinePassword(password);
      } else {
        ABP.view.base.popUp.PopUp.showPopup(resp.errorMessage, 'error_ok_btn');
        return;
      }
    }, failure:function(response) {
      ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
    }});
  } else {
    me.saveOfflinePassword(password);
  }
}, saveOfflinePassword:function(password) {
  ABP.util.LocalStorage.removeForLoggedInUser('OfflinePasswordSkipped');
  var salt = ABP.util.Sha256.generateSaltForUser(ABP.util.Config.getUsername(), ABP.util.Config.getEnvironment());
  ABP.util.LocalStorage.setForLoggedInUser('OfflinePassword', ABP.util.Sha256.sha256(password, salt));
  if (!ABP.util.Config.getLoggedIn()) {
    this.fireEvent('main_doConfiguration');
  } else {
    this.fireEvent('featureCanvas_hideSetting');
  }
}});
Ext.define('ABP.view.launch.maintenance.RecoverPasswordController', {extend:'Ext.app.ViewController', alias:'controller.recoverpassword', listen:{component:{'*':{recoverpw_Send:'sendButtonClick'}}}, backButtonClick:function() {
  this.fireEvent('launchCarousel_Login', this);
}, sendButtonClick:function() {
  var me = this;
  var vm = me.getViewModel();
  var recId = '';
  var env = '';
  if (vm.get('env_selection')) {
    env = vm.get('env_selection').id;
  }
  if (vm.get('recover_id')) {
    recId = vm.get('recover_id');
  }
  if (env !== '' && recId !== '') {
    me.getView().down('#rec-environment-combo').removeCls('login-error');
    me.getView().down('#recUrl').removeCls('login-error');
    me.fireEvent('main_showLoading', 'Sending Request', 'fullSize');
    var urlPartTwo = '/abp/RecoverPassword?loginId\x3d' + vm.get('recover_id') + '\x26environment\x3d' + env;
    Ext.Ajax.request({url:me.getServerUrl() + urlPartTwo, disableCaching:false, withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version > 9, method:'GET', success:function(response) {
      var resp = Ext.JSON.decode(response.responseText);
      me.fireEvent('main_hideLoading');
      if (resp.resultCode === 0) {
        ABP.view.base.popUp.PopUp.showPopup('login_recover_submit_success', 'error_ok_btn', function() {
          me.fireEvent('launchCarousel_Login', me);
        });
      }
    }, failure:function() {
      me.fireEvent('main_hideLoading');
      ABP.view.base.popUp.PopUp.showPopup(vm.get('login_recover_failed'), vm.get('i18n.error_ok_btn'));
    }});
  } else {
    if (env === '') {
      me.getView().down('#rec-environment-combo').addCls('login-error');
    } else {
      me.getView().down('#rec-environment-combo').removeCls('login-error');
    }
    if (recId === '') {
      me.getView().down('#recUrl').addCls('login-error');
    } else {
      me.getView().down('#recUrl').removeCls('login-error');
    }
    if (env === '' || recId === '') {
      ABP.view.base.popUp.PopUp.showPopup('login_all_fields', 'error_ok_btn');
    }
  }
}, getServerUrl:function() {
  return ABP.util.LocalStorage.get('ServerUrl');
}});
Ext.define('ABP.view.launch.maintenance.RecoverPasswordModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.recoverpassword', data:{recover_id:''}, formulas:{environment:{bind:{_def:'{bootstrapConf.defaultEnvironment}', _avail:'{bootstrapConf.availableEnvironments}', _selected:'{env_selection}'}, get:function(data) {
  if (data._selected && data._selected.id) {
    return data._selected.id;
  }
  var i;
  if (data._def && data._avail) {
    for (i = 0; i < data._avail.length; ++i) {
      if (data._avail[i].id === data._def || data._avail[i].name === data._def) {
        return data._avail[i].id;
      }
    }
  } else {
    if (data._avail.length > 0) {
      return data._avail[0].id;
    }
  }
  return null;
}}}});
Ext.define('ABP.view.launch.settings.SettingsController', {extend:'Ext.app.ViewController', alias:'controller.settingscontroller', listen:{component:{'*':{settings_save:'saveButtonClick', server_url_select:'serverUrlSelect', delete_server_url:'deleteServerUrl'}}, controller:{'*':{settings_refresh_server_url:'refreshServerUrl'}}}, init:function() {
  var serverUrl = ABP.util.LocalStorage.get('ServerUrl');
  this.saveServerUrl(serverUrl);
}, onMoreServerUrlsClick:function() {
  var view = this.getView();
  var moreServerUrls = view.down('#moreServerUrls');
  if (moreServerUrls && !moreServerUrls.destroyed) {
    var collapsed = moreServerUrls.getCollapsed() === false ? false : true;
    moreServerUrls[Ext.toolkit === 'modern' ? 'toggleCollapsed' : 'toggleCollapse'](!collapsed, null);
    var moreServerUrlsButton = view.down('#moreServerUrls-label');
    if (moreServerUrlsButton) {
      if (collapsed) {
        moreServerUrlsButton.setIconCls('icon-navigate-open');
      } else {
        moreServerUrlsButton.setIconCls('icon-navigate-close');
      }
    }
  }
}, serverUrlSelect:function(record) {
  if (record) {
    var view = this.getView();
    var url = view.down('#url');
    if (url) {
      url.setValue(record.get('url'));
    }
  }
}, deleteServerUrl:function(record) {
  if (record) {
    var store = Ext.data.StoreManager.lookup('ABPServerUrlStore');
    if (store) {
      if (store) {
        store.remove(record);
      }
    }
  }
}, refreshServerUrl:function() {
  var view = this.getView();
  var url = view.down('#url');
  if (url) {
    url.setValue(ABP.util.LocalStorage.get('ServerUrl'));
  }
}, backButtonClick:function() {
  this.fireEvent('launchCarousel_Login', this);
}, saveButtonClick:function() {
  var me = this;
  var view = me.getView();
  var url = view.down('#url').getValue();
  var goAhead = true;
  var vm;
  if (url.length <= 0) {
    vm = me.getViewModel();
    me.getView().down('#url').markInvalid(vm.get('i18n.login_all_fields'));
    ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_all_fields'), vm.get('i18n.error_ok_btn'));
  } else {
    me.getView().down('#url').clearInvalid();
    url = url.trim();
    if (!me.isValidServerUrl(url)) {
      ABP.view.base.popUp.PopUp.showPopup('login_settings_invalidurl');
      this.fireEvent('main_hideLoading');
      goAhead = false;
    }
    if (goAhead) {
      if (!view.down('#settingsExtraFieldCont') || me.extraFieldsCheck()) {
        ABP.util.LocalStorage.set('ServerUrl', url);
        me.saveServerUrl(url);
        this.fireEvent('main_relaunch', this);
      }
    }
  }
}, extraFieldsCheck:function() {
  var me = this;
  var vm = me.getViewModel();
  var view = me.getView();
  var extraFields = view.down('#settingsExtraFieldCont').items.items;
  var ret = true;
  var temp = [];
  var i = 0;
  if (!Ext.isEmpty(extraFields)) {
    for (i; i < extraFields.length; ++i) {
      if (extraFields[i].checkValue && !extraFields[i].checkValue()) {
        ret = false;
        break;
      }
      if (extraFields[i].getValue() !== '') {
        var fieldId = extraFields[i].getItemId().slice(19);
        var fieldValue = null;
        if (extraFields[i].xtype === 'combo') {
          fieldValue = extraFields[i].getRawValue();
        } else {
          if (extraFields[i].xtype === 'button' && Ext.isFunction(extraFields[i].getFieldData)) {
            buttonvals = extraFields[i].getFieldData();
            if (buttonvals) {
              for (var prop in buttonvals) {
                temp.push({fieldId:prop, val:buttonvals[prop]});
              }
              continue;
            }
          } else {
            fieldValue = extraFields[i].getValue();
          }
        }
        temp.push({fieldId:fieldId, val:fieldValue});
      } else {
        ret = false;
        ABP.view.base.popUp.PopUp.showError('login_all_fields');
        break;
      }
    }
    vm.getParent().getParent().set('prebootstrapExtraSettingsFilled', temp);
    ABP.util.LocalStorage.remove('settingsextrafields');
  }
  return ret;
}, isValidServerUrl:function(url) {
  if (!url) {
    return false;
  }
  return /^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*|(?:(?:[a-z\u00a1-\uffff0-9]+_?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(url);
}, privates:{saveServerUrl:function(serverUrl) {
  if (!Ext.isEmpty(serverUrl)) {
    var store = Ext.data.StoreManager.lookup('ABPServerUrlStore');
    if (store) {
      if (store.find('url', serverUrl) === -1) {
        store.insert(0, {url:serverUrl});
      }
    }
  }
}}});
Ext.define('ABP.view.launch.settings.SettingsModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.settingsmodel', requires:['ABP.store.ABPServerUrlStore'], data:{url:{}, language:{}}, stores:{serverUrlStore:'ABPServerUrlStore'}, formulas:{saveButtonWidth:{bind:{_bootstrapped:'{bootstrapped}'}, get:function(data) {
  if (data._bootstrapped) {
    return '49%';
  }
  return '100%';
}}, extraSettingsFields:{bind:{__injectedFields:'{injectedSettingsFields}', __extraFields:'{bootstrapConf.settings.extraSettingsFields}', __filledFields:'{prebootstrapExtraSettingsFilled}'}, get:function(data) {
  var ret = [];
  var classic = ABP.util.Common.getClassic();
  var i = 0;
  var matchedVal, savedVal;
  if (data.__injectedFields) {
    if (classic) {
      for (i = 0; i < data.__injectedFields.length; i++) {
        if (this.__checkForExistingFieldId(ret, data.__injectedFields[i].fieldId)) {
          if (!Ext.isEmpty(data.__filledFields)) {
            matchedVal = this.__matchField(data.__injectedFields[i], data.__filledFields);
          } else {
            savedVal = this.__checkForSavedValue(data.__injectedFields[i].fieldId);
            if (!Ext.isEmpty(savedVal)) {
              matchedVal = savedVal;
            }
          }
          if (data.__injectedFields[i].type) {
            if (data.__injectedFields[i].type === 'text') {
              ret.push(this.__makeClassicTextField(data.__injectedFields[i], matchedVal));
            } else {
              if (data.__injectedFields[i].type === 'list' && data.__injectedFields[i].options && data.__injectedFields[i].options.length > 0) {
                ret.push(this.__makeClassicListField(data.__injectedFields[i], matchedVal));
              } else {
                if (data.__injectedFields[i].type === 'toggle') {
                  ret.push(this.__makeClassicToggleField(data.__injectedFields[i], matchedVal));
                } else {
                  if (data.__injectedFields[i].type === 'number') {
                    ret.push(this.__makeClassicNumericField(data.__injectedFields[i], matchedVal));
                  } else {
                    if (data.__injectedFields[i].type === 'button') {
                      ret.push(this.__makeClassicButton(data.__injectedFields[i], matchedVal));
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      for (i = 0; i < data.__injectedFields.length; i++) {
        if (this.__checkForExistingFieldId(ret, data.__injectedFields[i].fieldId)) {
          if (!Ext.isEmpty(data.__filledFields)) {
            matchedVal = this.__matchField(data.__injectedFields[i], data.__filledFields);
          } else {
            savedVal = this.__checkForSavedValue(data.__injectedFields[i].fieldId);
            if (!Ext.isEmpty(savedVal)) {
              matchedVal = savedVal;
            }
          }
          if (data.__injectedFields[i].type) {
            if (data.__injectedFields[i].type === 'text') {
              ret.push(this.__makeModernTextField(data.__injectedFields[i], matchedVal));
            } else {
              if (data.__injectedFields[i].type === 'list' && data.__injectedFields[i].options && data.__injectedFields[i].options.length > 0) {
                ret.push(this.__makeModernListField(data.__injectedFields[i], matchedVal));
              } else {
                if (data.__injectedFields[i].type === 'toggle') {
                  ret.push(this.__makeModernToggleField(data.__injectedFields[i], matchedVal));
                } else {
                  if (data.__injectedFields[i].type === 'number') {
                    ret.push(this.__makeModernNumericField(data.__injectedFields[i], matchedVal));
                  } else {
                    if (data.__injectedFields[i].type === 'button') {
                      ret.push(this.__makeModernButton(data.__injectedFields[i], matchedVal));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (data.__extraFields) {
    if (classic) {
      if (Ext.isArray(data.__extraFields)) {
        for (i = 0; i < data.__extraFields.length; i++) {
          if (this.__checkForExistingFieldId(ret, data.__extraFields[i].fieldId)) {
            if (!Ext.isEmpty(data.__filledFields)) {
              matchedVal = this.__matchField(data.__extraFields[i], data.__filledFields);
            } else {
              savedVal = this.__checkForSavedValue(data.__extraFields[i].fieldId);
              if (!Ext.isEmpty(savedVal)) {
                matchedVal = savedVal;
              }
            }
            if (data.__extraFields[i].type) {
              if (data.__extraFields[i].type === 'text') {
                ret.push(this.__makeClassicTextField(data.__extraFields[i], matchedVal));
              } else {
                if (data.__extraFields[i].type === 'list' && data.__extraFields[i].options && data.__extraFields[i].options.length > 0) {
                  ret.push(this.__makeClassicListField(data.__extraFields[i], matchedVal));
                } else {
                  if (data.__extraFields[i].type === 'toggle') {
                    ret.push(this.__makeClassicToggleField(data.__extraFields[i], matchedVal));
                  } else {
                    if (data.__extraFields[i].type === 'number') {
                      ret.push(this.__makeClassicNumericField(data.__extraFields[i], matchedVal));
                    } else {
                      if (data.__extraFields[i].type === 'button') {
                        ret.push(this.__makeClassicButton(data.__extraFields[i], matchedVal));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        if (this.__checkForExistingFieldId(ret, data.__extraFields.fieldId)) {
          if (!Ext.isEmpty(data.__filledFields)) {
            matchedVal = this.__matchField(data.__extraFields, data.__filledFields);
          } else {
            savevdVal = this.__checkForSavedValue(data.__extraFields.fieldId);
            if (!Ext.isEmpty(savedVal)) {
              matchedVal = savedVal;
            }
          }
          if (data.__extraFields.type) {
            if (data.__extraFields.type === 'text') {
              ret.push(this.__makeClassicTextField(data.__extraFields, matchedVal));
            } else {
              if (data.__extraFields.type === 'list' && data.__extraFields.options && data.__extraFields.options.length > 0) {
                ret.push(this.__makeClassicListField(data.__extraFields, matchedVal));
              } else {
                if (data.__extraFields.type === 'toggle') {
                  ret.push(this.__makeClassicToggleField(data.__extraFields, matchedVal));
                } else {
                  if (data.__extraFields.type === 'button') {
                    ret.push(this.__makeClassicButton(data.__extraFields, matchedVal));
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if (Ext.isArray(data.__extraFields)) {
        for (i = 0; i < data.__extraFields.length; i++) {
          if (this.__checkForExistingFieldId(ret, data.__extraFields[i].fieldId)) {
            if (!Ext.isEmpty(data.__filledFields)) {
              matchedVal = this.__matchField(data.__extraFields[i], data.__filledFields);
            } else {
              savedVal = this.__checkForSavedValue(data.__extraFields[i].fieldId);
              if (!Ext.isEmpty(savedVal)) {
                matchedVal = savedVal;
              }
            }
            if (data.__extraFields[i].type) {
              if (data.__extraFields[i].type === 'text') {
                ret.push(this.__makeModernTextField(data.__extraFields[i], matchedVal));
              } else {
                if (data.__extraFields[i].type === 'list' && data.__extraFields[i].options && data.__extraFields[i].options.length > 0) {
                  ret.push(this.__makeModernListField(data.__extraFields[i], matchedVal));
                } else {
                  if (data.__extraFields[i].type === 'toggle') {
                    ret.push(this.__makeModernToggleField(data.__extraFields[i], matchedVal));
                  } else {
                    if (data.__extraFields[i].type === 'number') {
                      ret.push(this.__makeModernNumericField(data.__extraFields[i], matchedVal));
                    } else {
                      if (data.__extraFields[i].type === 'button') {
                        ret.push(this.__makeModernButton(data.__extraFields[i], matchedVal));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        if (this.__checkForExistingFieldId(ret, data.__extraFields.fieldId)) {
          if (!Ext.isEmpty(data.__filledFields)) {
            matchedVal = this.__matchField(data.__extraFields, data.__filledFields);
          } else {
            savedVal = this.__checkForSavedValue(data.__extraFields.fieldId);
            if (!Ext.isEmpty(savedVal)) {
              matchedVal = savedVal;
            }
          }
          if (data.__extraFields.type) {
            if (data.__extraFields.type === 'text') {
              ret.push(this.__makeModernTextField(data.__extraFields, matchedVal));
            } else {
              if (data.__extraFields.type === 'list' && data.__extraFields.options && data.__extraFields.options.length > 0) {
                ret.push(this.__makeModernListField(data.__extraFields, matchedVal));
              } else {
                if (data.__extraFields.type === 'toggle') {
                  ret.push(this.__makeModernToggleField(data.__extraFields, matchedVal));
                } else {
                  if (data.__extraFields.type === 'number') {
                    ret.push(this.__makeModernNumericField(data.__extraFields, matchedVal));
                  } else {
                    if (data.__extraFields.type === 'button') {
                      ret.push(this.__makeModernButton(data.__extraFields, matchedVal));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return ret;
}}}, __makeClassicTextField:function(field, matchedVal) {
  return {xtype:'textfield', cls:'a-extrasettingsfield-text-' + field.fieldId, width:'100%', labelAlign:'top', fieldLabel:ABP.util.Common.geti18nString(field.label), itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, value:matchedVal || field.value, listeners:{specialkey:function(f, e) {
    if (e.getKey() === e.ENTER) {
      f.fireEvent('settings_save');
    }
  }}};
}, __makeClassicListField:function(field, matchedVal) {
  return {xtype:'combo', cls:'launch-combo-box a-extrasettingsfield-list-' + field.fieldId, width:'100%', labelAlign:'top', fieldLabel:ABP.util.Common.geti18nString(field.label), itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, store:{data:field.options}, displayField:'name', value:matchedVal !== null ? matchedVal : field.options[0].key, valueField:'key', triggerAction:'all', allowBlank:false, labelWidth:0, editable:false, autoSelect:true};
}, __makeClassicToggleField:function(field, matchedVal) {
  var activeVal = field.active === 'true' || field.active === true;
  if (!Ext.isEmpty(matchedVal)) {
    activeVal = matchedVal;
  }
  return {xtype:'button', width:'100%', cls:'login-keepme a-extrasettingsfield-button-' + field.fieldId, itemId:'extraSettingsFields' + field.fieldId, text:ABP.util.Common.geti18nString(field.text), iconCls:activeVal ? 'icon-checked-square' : 'icon-unchecked-square', active:activeVal, value:activeVal, handler:function() {
    this.active = !this.active;
    if (this.active) {
      this.setIconCls('icon-checked-square');
    } else {
      this.setIconCls('icon-unchecked-square');
    }
    this.value = this.active;
  }};
}, __makeClassicNumericField:function(field, matchedVal) {
  var len = null;
  if (field.maxVal) {
    len = field.maxVal.toString().length;
  }
  return {xtype:'numberfield', cls:'a-extrasettingsfield-text-' + field.fieldId, width:'100%', labelAlign:'top', fieldLabel:ABP.util.Common.geti18nString(field.label), itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, value:matchedVal, maxValue:field.maxVal ? parseFloat(field.maxVal) : null, minValue:field.minVal ? parseFloat(field.minVal) : null, maxLength:len, enforceMaxLength:true, checkValue:function() {
    var ret = true;
    var val = this.getValue();
    var maxVal = this.maxValue;
    var minVal = this.minValue;
    var valString;
    if (minVal && val < minVal) {
      valString = ABP.util.Common.geti18nString('login_extraValue');
      ret = false;
      ABP.view.base.popUp.PopUp.showError(this.getEmptyText() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
    } else {
      if (maxVal && val > maxVal) {
        valString = ABP.util.Common.geti18nString('login_extraValue');
        ret = false;
        ABP.view.base.popUp.PopUp.showError(this.getEmptyText() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
      }
    }
    return ret;
  }};
}, __makeClassicButton:function(field) {
  var type = field.action;
  var handler;
  var popup;
  switch(type) {
    case 'popup':
      handler = function() {
        popup = Ext.create('ABP.view.base.popUp.PopUpFrame', {config:{buttonInfo:field}});
        popup.show();
      };
      break;
    case 'redirect':
      handler = function() {
        window.location.href = field.url;
      };
      break;
    case 'newTab':
      handler = function() {
        window.open(field.url);
      };
      break;
  }
  return {xtype:'button', handler:handler, cls:'btn-extra a-extrasettingsfield-button-' + field.fieldId, itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, bind:{text:field.labelKey ? '{i18n.' + field.labelKey + '}' : field.label}, width:'100%', fieldData:null, setFieldData:function(data) {
    this.fieldData = data;
  }, getFieldData:function() {
    return this.fieldData;
  }};
}, __makeModernTextField:function(field, matchedVal) {
  return {xtype:'textfield', cls:'x-unselectable login-form a-extraloginfield-text-' + field.fieldId, width:'100%', clearable:false, allowBlank:'false', labelAlign:'top', label:ABP.util.Common.geti18nString(field.label), itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, value:matchedVal ? matchedVal : ''};
}, __makeModernListField:function(field, matchedVal) {
  return {xtype:'selectfield', cls:'login-form a-extraloginfield-list-' + field.fieldId, width:'100%', labelAlign:'top', label:ABP.util.Common.geti18nString(field.label), itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, store:{data:field.options}, displayField:'name', value:matchedVal !== null ? matchedVal : field.options[0].key, valueField:'key', triggerAction:'all', allowBlank:false, labelWidth:0, editable:false, autoSelect:true};
}, __makeModernToggleField:function(field, matchedVal) {
  var activeVal = field.active === 'true' || field.active === true;
  if (!Ext.isEmpty(matchedVal)) {
    activeVal = matchedVal;
  }
  return {xtype:'button', cls:'login-keepme a-keepme-button', width:'100%', itemId:'extraSettingsFields' + field.fieldId, focusCls:'', text:ABP.util.Common.geti18nString(field.text), iconCls:activeVal ? 'icon-checked-square' : 'icon-unchecked-square', active:activeVal, value:activeVal, handler:function() {
    this.active = !this.active;
    if (this.active) {
      this.setIconCls('icon-checked-square');
    } else {
      this.setIconCls('icon-unchecked-square');
    }
    this.setValue(this.active);
  }};
}, __makeModernNumericField:function(field, matchedVal) {
  var len = null;
  if (field.maxVal) {
    len = field.maxVal.toString().length;
  }
  return {xtype:'abpnumberfield', cls:'x-unselectable login-form a-extraloginfield-text-' + field.fieldId, width:'100%', clearable:false, allowBlank:'false', labelAlign:'top', label:ABP.util.Common.geti18nString(field.label), itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, maxValue:field.maxVal ? parseFloat(field.maxVal) : null, minValue:field.minVal ? parseFloat(field.minVal) : null, value:matchedVal ? matchedVal : '', maxLength:len};
}, __makeModernButton:function(field) {
  var type = field.action;
  var handler;
  var popup;
  switch(type) {
    case 'popup':
      handler = function() {
        popup = Ext.create({xtype:'popupframe', config:{buttonInfo:field}});
        popup.show();
      };
      break;
    case 'redirect':
      handler = function() {
        window.location.href = field.url;
      };
      break;
    case 'newTab':
      handler = function() {
        window.open(field.url);
      };
      break;
  }
  return {xtype:'button', handler:handler, cls:['btn-login', 'login-form', 'a-extrasettingsfield-button-' + field.fieldId], itemId:'extraSettingsFields' + field.fieldId, fieldId:field.fieldId, margin:'6 0 4 0', bind:{text:field.labelKey ? '{i18n.' + field.labelKey + '}' : field.label}, width:'100%', fieldData:null, setFieldData:function(data) {
    this.fieldData = data;
  }, getFieldData:function() {
    return this.fieldData;
  }};
}, __matchField:function(lookFor, lookIn) {
  var ret = null;
  var savedVal;
  var i = 0;
  for (i; i < lookIn.length; i++) {
    if (lookIn[i].fieldId === lookFor.fieldId) {
      ret = lookIn[i].val;
      break;
    }
  }
  if (ret === null) {
    savedVal = this.__checkForSavedValue(lookFor);
    if (savedVal) {
      ret = savedVal;
    }
  }
  return ret;
}, __checkForExistingFieldId:function(where, what) {
  var i = 0;
  var ret = true;
  for (i = 0; i < where.length; ++i) {
    if (where[i].fieldId === what) {
      ret = false;
      break;
    }
  }
  return ret;
}, __checkForSavedValue:function(fieldId) {
  var local = ABP.util.LocalStorage.get('settingsextrafields');
  var json;
  var ret = null;
  var i = 0;
  if (local) {
    json = JSON.parse(local);
    for (i = 0; i < json.length; ++i) {
      if (json[i].fieldId === fieldId) {
        ret = json[i].val;
        break;
      }
    }
  }
  return ret;
}});
Ext.define('ABP.view.launch.loading.LoadingScreen', {extend:'Ext.LoadMask', alias:'widget.apteanloadingscreen', layout:{type:'vbox', align:'center', pack:'center'}, initComponent:function() {
  this.items = [{xtype:'container', height:140, layout:{type:'vbox', align:'center'}, items:[{xtype:'component', html:'\x3cdiv class\x3d"login-hdr"\x3e\x3c/div\x3e', focusable:false}, {xtype:'component', componentCls:'bootstrap-loading', flex:1, html:'Connecting\x3cdiv class\x3d"bootstrap-loading-dot1"\x3e.\x3c/div\x3e\x3cdiv class\x3d"bootstrap-loading-dot2"\x3e.\x3c/div\x3e\x3cdiv class\x3d"bootstrap-loading-dot3"\x3e.\x3c/div\x3e'}]}];
}});
Ext.define('ABP.view.base.noSupport.NoSupport', {extend:'Ext.Container', alias:'widget.nosupportpage', layout:{type:'vbox', align:'center', pack:'center'}, cls:'launch-canvas', fullscreen:true, height:'100%', width:'100%', items:[{xtype:'component', html:'This product does not support desktop browsers.\x3cbr\x3ePlease open this website on a mobile device.', style:{'color':'white', 'font-size':'1.75em', 'text-align':'center'}}]});
Ext.define('ABP.view.session.offline.PasswordPromptModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abp-passwordprompt', data:{passwordLabel:null, okBtnLabel:null, cancelBtnlabel:null}});
Ext.define('ABP.view.session.offline.PasswordPromptController', {extend:'Ext.app.ViewController', requires:['ABP.view.session.offline.PasswordPromptModel'], alias:'controller.passwordprompt', onOkClicked:function() {
  var me = this, view = me.getView(), vm = me.getViewModel(), passwordField = view.down('#password'), password = passwordField.getValue();
  var jsonData = {};
  jsonData.environment = ABP.util.Config.getEnvironment();
  jsonData.logonId = ABP.util.Config.getUsername();
  jsonData.password = password;
  ABP.util.Common.setViewModelProperty('switchToOnline', true);
  me.fireEvent('main_Authenticate', jsonData);
  view.close();
}, onCancelClicked:function() {
  var me = this;
  var view = me.getView();
  view.close();
}});
Ext.define('ABP.view.session.offline.PasswordPrompt', {extend:'Ext.Panel', requires:['ABP.view.session.offline.PasswordPromptController'], alias:'widget.passwordprompt', controller:'passwordprompt', viewModel:{type:'abp-passwordprompt'}, layout:{type:'vbox', align:'center', pack:'center'}, bind:{title:'{i18n.offline_promptpassword_title:htmlEncode}'}, floated:true, centered:true, modal:true, width:300, minHeight:200, shadow:false, items:[{xtype:'textfield', width:250, itemId:'password', inputType:'password', 
labelAlign:'top', bind:{label:'{passwordLabel:htmlEncode}'}}], bbar:{items:[{border:false, text:'cancel', bind:{text:'{cancelBtnlabel:htmlEncode}'}, width:100, handler:'onCancelClicked'}, {border:false, text:'ok', bind:{text:'{okBtnLabel:htmlEncode}'}, width:100, handler:'onOkClicked'}]}});
Ext.define('ABP.view.launch.LaunchCarousel', {extend:'Ext.tab.Panel', requires:['ABP.view.launch.LaunchCarouselController', 'ABP.view.launch.LaunchCarouselModel'], alias:'widget.launchcarousel', controller:'launchcarouselcontroller', viewModel:'launchcarouselmodel', tabBar:{hidden:true}, initialize:function(a, b) {
  this.onAfter('painted', this.setup);
}, setup:function() {
  var me = this;
  var vm = me.getViewModel();
  var startingLaunchCarouselTab = vm.get('startingLaunchCarouselTab');
  me.setActiveItem('#' + startingLaunchCarouselTab);
}});
Ext.define('ABP.view.launch.login.Login', {extend:'Ext.form.Panel', requires:['ABP.view.launch.login.LoginController', 'ABP.view.launch.login.LoginModel'], alias:'widget.login', controller:'logincontroller', viewModel:{type:'loginmodel'}, cls:'login-fields main-content-wrapper', scrollable:'vertical', items:[{xtype:'container', cls:'main-content', defaults:{labelAlign:'top'}, items:[{xtype:'abptext', itemId:'username', reference:'usernameField', disabledCls:'preauth-disabled', clearable:false, allowBlank:'false', 
tabIndex:1, automationCls:'login-username', cls:'x-unselectable login-form', bind:{value:'{username}', disabled:'{preauthenticated}', label:'{i18n.login_username:htmlEncode}', hidden:'{!showUsernameField}'}, listeners:{action:function(t, e, eOpts) {
  t.fireEvent('login_UserHit');
}, scope:this}}, {xtype:'abptext', itemId:'password', reference:'passwordField', disabledCls:'preauth-disabled', clearable:false, tabIndex:2, allowBlank:'false', inputType:'password', automationCls:'login-password', cls:'x-unselectable login-form', bind:{value:'{password}', hidden:'{!showPasswordField}', label:'{passwordText:htmlEncode}'}, listeners:{action:function(t, e, eOpts) {
  t.fireEvent('login_PassHit');
}, scope:this}}, {xtype:'selectfield', itemId:'login-environment', tabIndex:3, cls:'login-form launch-combo-box a-environment-combo', bind:{store:'{main_environmentStore}', value:'{environment}', selection:'{env_selection}', label:'{i18n.login_environment:htmlEncode}', hidden:'{hideEnvironment}'}, queryMode:'local', clearable:false, labelWidth:0, editable:false, forceSelection:true, displayField:'name', valueField:'id', listeners:{change:function(me, newVal) {
  me.fireEvent('login_environmentChanged', newVal);
}, scope:this}}, {xtype:'selectfield', itemId:'login-language', tabIndex:4, bind:{store:'{login_settingsStore}', value:'{language}', selection:'{lan_selection}', label:'{i18n.login_language:htmlEncode}', hidden:'{hideLanguage}'}, queryMode:'local', clearable:false, cls:'login-form launch-combo-box a-language-combo', displayField:'name', valueField:'key', labelWidth:0, editable:false}, {xtype:'container', layout:'vbox', itemId:'loginExtraFieldCont', bind:{items:'{extraLoginFields}'}}]}, {xtype:'container', 
cls:'main-content-footer', defaults:{labelAlign:'top'}, items:[{xtype:'button', tabIndex:5, cls:'btn-login login-form a-login-button', itemId:'loginButton', bind:{text:'{loginBtnText:htmlEncode}'}, handler:'loginButtonClick'}, {xtype:'button', tabIndex:6, cls:'login-keepme a-keepme-button', itemId:'loginKeepMe', bind:{text:'{i18n.login_keepMeSignedIn:htmlEncode}', iconCls:'{keepMeSignedInIcon}', hidden:'{!canKeepMeSignedIn}'}, handler:'keepMeSignedInClicked'}, {xtype:'button', tabIndex:7, cls:'login-forgotpassword login-form a-forgot-button', 
itemId:'loginForgot', hidden:true, bind:{text:'{i18n.login_forgotpassword:htmlEncode}', hidden:'{!canRecoverPassword}'}, handler:'onForgotPasswordClick'}, {xtype:'button', tabIndex:8, cls:'btn-settings login-form a-login-settings', itemId:'settingsButton', iconCls:'icon-gearwheel', handler:'onSettingsClick', bind:{hidden:'{!allowServiceChange}'}}]}], listeners:{initialize:'checkForSignoutReason'}});
Ext.define('ABP.view.base.popUp.PopUpFrame', {extend:'Ext.Panel', alias:'widget.popupframe', requires:['ABP.view.base.popUp.PopUpHeader'], floated:true, centered:true, modal:true, header:{xtype:'popupheader'}, cls:'framePop', width:'90%', maxWidth:316, minHeight:200, shadow:false, layout:'fit', items:[{xtype:'container', docked:'bottom', itemId:'errorPopButtonBar', cls:'errorpop-buttonbar', layout:{type:'hbox', pack:'end'}, items:[{xtype:'button', height:36, width:100, itemId:'abpPopFrameClose', 
cls:'abp-popup-button', handler:function() {
  this.up('popupframe').closePopup();
}}, {xtype:'button', height:36, width:100, itemId:'abpPopFrameSave', cls:'abp-popup-button', handler:function() {
  var pop = this.up('popupframe');
  var inner = {};
  var ret;
  if (pop.config && pop.config.buttonInfo && pop.config.buttonInfo.contentXtype) {
    inner = pop.down(pop.config.buttonInfo.contentXtype);
    if (inner && inner.getController() && inner.getController().getSaveData) {
      ret = inner.getController().getSaveData();
      if (ret) {
        pop.config.returnData = ret;
      }
    } else {
      pop.closePopup();
    }
  } else {
    pop.closePopup();
  }
}}]}], initialize:function() {
  var me = this;
  if (me.config && me.config.buttonInfo) {
    if (me.config.buttonInfo.contentXtype) {
      me.add({xtype:me.config.buttonInfo.contentXtype, padding:10});
    }
    if (me.config.buttonInfo.contentTitle) {
      me.setTitle(me.config.buttonInfo.contentTitle);
    }
  }
  me.setCentered(true);
  me.setModal(true);
  me.callParent(arguments);
  me.addBodyCls('framePop-body');
  me.down('#abpPopFrameClose').setText(ABP.util.Common.geti18nString('button_close'));
  me.down('#abpPopFrameSave').setText(ABP.util.Common.geti18nString('login_save'));
}, closePopup:function() {
  if (this.config && this.config.returnData && this.config.returnData) {
    Ext.getApplication().getMainView().down('[fieldId\x3d' + this.config.buttonInfo.fieldId + ']').setFieldData(this.config.returnData);
  }
  this.destroy();
}, getHeader:function() {
  return this.header.getInnerHeader();
}, addTool:function(tool) {
  var header = this.getHeader(), items;
  if (header) {
    items = this.createTools(Ext.Array.from(tool), this);
    if (items && items.length) {
      items = header.add(items);
    }
  }
  return items;
}});
Ext.define('ABP.view.launch.settings.Settings', {extend:'Ext.Container', requires:['ABP.view.launch.settings.SettingsController', 'ABP.view.launch.settings.SettingsModel', 'ABP.view.base.popUp.PopUpFrame'], alias:'widget.settings', controller:'settingscontroller', viewModel:{type:'settingsmodel'}, cls:'settings-modern main-content-wrapper', height:'100%', scrollable:'vertical', items:[{xtype:'container', cls:'main-content', items:[{xtype:'component', cls:'settings-title', bind:{html:'{i18n.login_settingsTitle:htmlEncode}'}}, 
{xtype:'component', cls:'settings-text', bind:{html:'{i18n.login_settingsInstructions:htmlEncode}'}}, {xtype:'textfield', align:'middle', clearable:false, itemId:'url', labelWidth:0, value:'', cls:'x-unselectable a-settings-url login-required-field login-form', labelAlign:'top', required:true, bind:{label:'{i18n.login_url:htmlEncode}'}, listeners:{action:function(t, e, eOpts) {
  t.fireEvent('settings_save');
}}}, {xtype:'abpbutton', cls:'settings-moreServerUrls-button', ui:'(none)', itemId:'moreServerUrls-label', automationCls:'settings-moreurlsbutton', bind:{text:'{i18n.login_previousUrls:htmlEncode}', hidden:'{!bootstrapConf.settings.rememberPreviousServerUrls}'}, iconCls:'icon-navigate-close', iconAlign:'right', textAlign:'left', margin:0, listeners:{tap:'onMoreServerUrlsClick'}}, {xtype:'abppanel', itemId:'moreServerUrls', cls:'settings-moreServerUrls', collapsible:true, collapsed:true, header:{hidden:true}, 
layout:'fit', items:[{xtype:'dataview', itemId:'moreServerUrlsList', cls:'settings-moreServerUrlsList a-settings-moreServerUrlsList', bind:{store:'{serverUrlStore}'}, focusCls:Ext.baseCSSPrefix + 'focused ' + Ext.baseCSSPrefix + 'selected', height:130, scrollable:true, itemTpl:['\x3cdiv class\x3d"server-url-item"\x3e', '\x3cdiv class\x3d"server-url a-server-url"\x3e{url}\x3c/div\x3e', '\x3cdiv class\x3d"delete-item" role\x3d"button" aria-label\x3d"Remove URL" title\x3d"Remove URL"\x3e\x3cspan class\x3d"delete-item-icon icon-garbage-can a-delete-item-icon"\x3e\x3c/span\x3e\x3c/div\x3e', 
'\x3c/div\x3e'], keyMap:{'ENTER':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, 'server_url_select');
}, 'SPACE':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, 'server_url_select');
}, 'DELETE':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, 'delete_server_url');
}, 'BACKSPACE':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, 'delete_server_url');
}}, __handleKeyEvent:function(eventObj, dataview, recordEvent) {
  if (eventObj && eventObj.currentTarget && dataview) {
    var currentTarget = eventObj.currentTarget;
    var recordId = currentTarget.getAttribute('data-recordid');
    if (recordId) {
      var record = dataview.store.getByInternalId(recordId);
      if (Ext.isObject(record)) {
        dataview.fireEvent(recordEvent, record);
      }
    }
  }
}, listeners:{childTap:function(dataview, location, eOpts) {
  if (Ext.isObject(location) && Ext.isObject(location.record) && location.event) {
    if (location.event.getTarget('.delete-item-icon')) {
      dataview.fireEvent('delete_server_url', location.record);
    } else {
      if (location.event.getTarget('.server-url')) {
        dataview.fireEvent('server_url_select', location.record);
      }
    }
  }
  return true;
}}}]}, {xtype:'container', layout:'vbox', itemId:'settingsExtraFieldCont', bind:{items:'{extraSettingsFields}'}}]}, {xtype:'container', cls:'main-content-footer buttons', items:[{xtype:'button', itemId:'backBtn', cls:'btn-login a-settings-back login-form', bind:{text:'{i18n.login_back:htmlEncode}', hidden:'{!bootstrapped}'}, handler:'backButtonClick', width:'49%'}, {xtype:'button', itemId:'saveButton', cls:'btn-login a-settings-save login-form', bind:{text:'{i18n.login_save:htmlEncode}', width:'{saveButtonWidth}'}, 
handler:'saveButtonClick'}]}], initialize:function() {
  var me = this;
  me.callParent();
  me.down('#url').setValue(ABP.util.LocalStorage.get('ServerUrl'));
}});
Ext.define('ABP.view.launch.maintenance.ForcePassword', {extend:'Ext.Container', alias:'widget.forcepassword', requires:['ABP.view.launch.maintenance.ForcePasswordController', 'ABP.view.launch.maintenance.ForcePasswordModel'], controller:'forcepassword', viewmodel:{type:'forcepassword'}, layout:{type:'vbox', align:'stretch', pack:'start'}, defaults:{labelAlign:'top'}, cls:'maintenance-modern main-content-wrapper', height:'100%', items:[{xtype:'container', cls:'main-content', items:[{xtype:'component', 
cls:'settings-title', bind:{html:'{i18n.login_forcepw_title:htmlEncode}'}}, {xtype:'component', itemId:'forcepwGuide', cls:'settings-text x-unselectable', bind:{html:'{i18n.login_forcepw_instructions:\x3ehtmlEncode}'}}, {xtype:'textfield', inputType:'password', bind:{value:'{newPassword}', label:'{i18n.login_forcepw_newPassword:htmlEncode}'}, itemId:'newPassword', cls:'x-unselectable login-required-field a-forcechange-newpassword login-form'}, {xtype:'textfield', inputType:'password', bind:{value:'{confirmPassword}', 
label:'{i18n.login_forcepw_confirmPassword:htmlEncode}'}, itemId:'confirmPassword', cls:'x-unselectable login-required-field a-forcechange-confirmpassword login-form'}]}, {xtype:'container', cls:'main-content-footer buttons', items:[{xtype:'button', itemId:'forceBackButton', cls:'btn-login a-forcechange-back login-form', handler:'backButtonClick', bind:{text:'{i18n.login_forcepw_back:htmlEncode}'}, width:'49%'}, {xtype:'button', itemId:'forceSignInButton', cls:'btn-login a-forcechange-signin login-form', 
handler:'signInButtonClick', bind:{text:'{i18n.login_forcepw_signIn:htmlEncode}'}, width:'49%'}]}]});
Ext.define('ABP.view.launch.maintenance.RecoverPassword', {extend:'Ext.Container', alias:'widget.recoverpassword', requires:['ABP.view.launch.maintenance.RecoverPasswordController', 'ABP.view.launch.maintenance.RecoverPasswordModel'], controller:'recoverpassword', viewmodel:{type:'recoverpassword'}, cls:'maintenance-modern main-content-wrapper', height:'100%', items:[{xtype:'container', cls:'main-content', defaults:{labelAlign:'top'}, items:[{xtype:'component', cls:'settings-title', bind:{html:'{i18n.login_recoverTitle:htmlEncode}'}}, 
{xtype:'component', itemId:'settingsGuide', cls:'settings-text x-unselectable', bind:{html:'{i18n.login_recoverInstructions:htmlEncode}'}}, {xtype:'textfield', bind:{value:'{recover_id}', label:'{i18n.login_recover_id:htmlEncode}'}, itemId:'recUrl', reference:'recoverPasswordId', cls:'x-unselectable login-form login-required-field a-recoverpw-userid', listeners:{specialkey:function(f, e) {
  if (e.getKey() === e.ENTER) {
    this.up().down('#saveButton').fireEvent('click');
  }
}}}, {xtype:'selectfield', itemId:'rec-environment-combo', bind:{store:'{main_environmentStore}', value:'{environment}', selection:'{env_selection}', label:'{i18n.login_environment:htmlEncode}'}, queryMode:'local', labelWidth:0, cls:'login-form launch-combo-box login-required-field a-recoverpw-environment', editable:false, forceSelection:true, autoSelect:true, displayField:'name', valueField:'id', listeners:{change:function(me, newVal) {
  me.fireEvent('login_environmentChanged', newVal);
}, scope:this}}]}, {xtype:'container', cls:'main-content-footer buttons', items:[{xtype:'button', itemId:'recBackButton', cls:'btn-login a-recoverpw-back login-form', handler:'backButtonClick', bind:{text:'{i18n.login_recover_back:htmlEncode}'}, width:'49%'}, {xtype:'button', itemId:'recSendButton', cls:'btn-login a-recoverpw-send login-form', handler:'sendButtonClick', bind:{text:'{i18n.login_recover_send:htmlEncode}'}, width:'49%'}]}]});
Ext.define('ABP.view.launch.maintenance.ExtraStep', {extend:'Ext.Container', requires:['ABP.view.launch.settings.ExtraStepController'], alias:'widget.maintenanceextrastep', controller:'extrastepcontroller', layout:{type:'vbox', align:'stretch', pack:'start'}, cls:'maintenance-modern main-content-wrapper', height:'100%', initialize:function() {
  this.items.items[0].add({xtype:this.additionalInfo.xtype, additionalInfo:this.additionalInfo});
  this.callParent();
}, items:[{xtype:'container', cls:'main-content', itemId:'ABPExtraStepCustomContainer', items:[]}, {xtype:'container', cls:'main-content-footer buttons', items:[{xtype:'button', reference:'backButton', cls:['btn-login', 'a-extrastep-back', 'login-form'], width:'49%', handler:'backButtonClick', bind:{text:'{i18n.login_back:htmlEncode}'}}, {xtype:'button', itemId:'saveButton', width:'49%', cls:['btn-login', 'a-extrastep-save', 'login-form'], handler:'continueButtonClick', bind:{text:'{i18n.button_continue:htmlEncode}'}}]}]});
Ext.define('ABP.view.launch.maintenance.OfflinePassword', {extend:'Ext.Container', requires:['ABP.view.launch.settings.OfflinePasswordController'], alias:'widget.offlinepassword', controller:'offlinepasswordcontroller', layout:{type:'vbox', align:'middle', pack:'center'}, cls:'main-content-wrapper', items:[{xtype:'container', cls:'main-content', items:[{xtype:'component', bind:{html:'{i18n.offline_login_instructions:htmlEncode}'}}, {xtype:'textfield', labelAlign:'top', reference:'offlinepassword', 
inputType:'password', allowBlank:false, tabIndex:2, bind:{label:'{i18n.offline_login_password:htmlEncode}'}, automationCls:'offline-login-password', inputAttrTpl:['automationId\x3d"offlineLoginPassword"'], focusable:true}, {xtype:'textfield', labelAlign:'top', reference:'confirmofflinepassword', inputType:'password', allowBlank:false, tabIndex:2, bind:{label:'{i18n.offline_login_confirmpassword:htmlEncode}'}, automationCls:'offline-login-confirmpassword', inputAttrTpl:['automationId\x3d"confirmofflineLoginPassword"'], 
listeners:{specialkey:function(f, e) {
  if (e.getKey() === e.ENTER) {
    f.fireEvent('savepassword');
  }
}, scope:this}, focusable:true}]}, {xtype:'container', cls:'main-content-footer buttons', items:[{xtype:'button', reference:'backButton', cls:'btn-login a-extrastep-back', width:'49%', handler:'cancelButtonClick', bind:{text:'{i18n.button_cancel:htmlEncode}'}}, {xtype:'button', reference:'saveButton', width:'49%', cls:'btn-login a-extrastep-save', handler:'saveButtonClick', bind:{text:'{i18n.button_save:htmlEncode}'}}]}]});
Ext.define('ABP.view.launch.maintenance.Maintenance', {extend:'Ext.Container', requires:['ABP.view.launch.maintenance.ForcePassword', 'ABP.view.launch.maintenance.RecoverPassword', 'ABP.view.launch.maintenance.ExtraStep', 'ABP.view.launch.maintenance.OfflinePassword'], alias:'widget.maintenance', height:'100%', items:[], cls:'maintenance-modern', showScreen:function(xtypeToShow, additionalStepInfo) {
  var xtypeToShowObj = this.down(xtypeToShow);
  if (xtypeToShowObj && xtypeToShow === 'maintenanceextrastep') {
    this.removeAll();
    this.add({xtype:xtypeToShow, additionalInfo:additionalStepInfo});
  }
  if (!xtypeToShowObj) {
    this.removeAll();
    this.add({xtype:xtypeToShow, additionalInfo:additionalStepInfo});
  }
}});
Ext.define('ABP.view.launch.selectuser.SelectUser', {extend:'Ext.Container', requires:['ABP.view.launch.selectuser.SelectUserController', 'ABP.view.launch.selectuser.SelectUserModel', 'ABP.view.base.popUp.PopUpFrame'], alias:'widget.selectuser', controller:'selectusercontroller', viewModel:{type:'selectusermodel'}, cls:'settings-modern main-content-wrapper', height:'100%', items:[{xtype:'container', cls:'main-content', items:[{xtype:'component', cls:'settings-title', bind:{html:'{i18n.login_selectUserTitle:htmlEncode}'}}, 
{xtype:'component', cls:'settings-text', bind:{html:'{i18n.login_selectUserInstructions:htmlEncode}'}}, {xtype:'dataview', itemId:'userList', cls:'selectuser-userList a-selectuser-userList', bind:{store:'{userStore}'}, focusCls:Ext.baseCSSPrefix + 'focused ' + Ext.baseCSSPrefix + 'selected', scrollable:true, itemTpl:['\x3cdiv class\x3d"selectuser-item"\x3e', '\x3cdiv class\x3d"selectuser-image"\x3e\x3cspan class\x3d"selectuser-image-icon {useAnotherUser:this.getClass(values.data)}" style\x3d"{data:this.getPhoto()}"\x3e\x3c/span\x3e\x3c/div\x3e', 
'\x3cdiv style\x3d"display: inline-block" class\x3d"user-info"\x3e', '\x3ctpl if\x3d"useAnotherUser"\x3e', '\x3cdiv class\x3d"user-info-name a-selectuser-newuser"\x3e{username:htmlEncode}\x3c/div\x3e', '\x3ctpl else\x3e', '\x3cdiv class\x3d"user-info-name a-selectuser-user"\x3e{username:htmlEncode}\x3c/div\x3e', '\x3cdiv class\x3d"user-info-env a-selectuser-env"\x3e{envName:htmlEncode}\x3c/div\x3e', '\x3c/tpl\x3e', '\x3c/div\x3e', '\x3ctpl if\x3d"useAnotherUser"\x3e', '\x3ctpl else\x3e', '\x3cdiv class\x3d"delete-item"\x3e\x3cspan class\x3d"delete-item-icon icon-garbage-can a-delete-item-icon"\x3e\x3c/span\x3e\x3c/div\x3e', 
'\x3c/tpl\x3e', '\x3c/div\x3e', {getClass:function(useAnotherUser, data) {
  if (useAnotherUser) {
    return 'icon-businessperson2 a-selectuser-newicon';
  }
  if (data.Photo) {
    return 'user-photo a-selectuser-icon';
  }
  return 'icon-user a-selectuser-icon';
}, getPhoto:function(data) {
  if (!data || !data.Photo) {
    return '';
  }
  return 'background-image:url(' + data.Photo + ')';
}}], keyMap:{'ENTER':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, false);
}, 'SPACE':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, false);
}, 'DELETE':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, true);
}, 'BACKSPACE':function(eventObj, dataview) {
  this.__handleKeyEvent(eventObj, dataview, true);
}}, __handleKeyEvent:function(eventObj, dataview, deleteUser) {
  if (eventObj && eventObj.currentTarget && dataview) {
    var currentTarget = eventObj.currentTarget;
    var recordId = currentTarget.getAttribute('data-recordid');
    if (recordId) {
      var record = dataview.store.getByInternalId(recordId);
      if (Ext.isObject(record)) {
        if (deleteUser) {
          if (!record.get('useAnotherUser')) {
            dataview.fireEvent('selectuser_delete', record);
          }
        } else {
          if (record.get('useAnotherUser')) {
            dataview.fireEvent('selectuser_new');
          } else {
            dataview.fireEvent('selectuser_select', record);
          }
        }
      }
    }
  }
}, listeners:{childTap:function(dataview, location, eOpts) {
  if (Ext.isObject(location) && Ext.isObject(location.record) && location.event) {
    if (location.event.getTarget('.delete-item-icon')) {
      dataview.fireEvent('selectuser_delete', location.record);
    } else {
      if (location.record) {
        if (location.record.get('useAnotherUser')) {
          dataview.fireEvent('selectuser_new');
        } else {
          dataview.fireEvent('selectuser_select', location.record);
        }
      }
    }
  }
  return true;
}}}]}]});
Ext.define('ABP.view.launch.discovery.Discovery', {extend:'Ext.form.Panel', requires:['ABP.view.launch.discovery.DiscoveryController', 'ABP.view.launch.discovery.DiscoveryModel'], alias:'widget.discovery', controller:'discoverycontroller', viewModel:{type:'discoverymodel'}, cls:'login-fields main-content-wrapper', scrollable:'vertical', items:[{xtype:'container', cls:'main-content', defaults:{labelAlign:'top'}, items:[{type:'component', margin:'0 0 20 0', bind:{html:'{i18n.login_SSOHelp:htmlEncode}'}}, 
{xtype:'abptext', itemId:'email', reference:'emailField', disabledCls:'preauth-disabled', tabIndex:1, clearable:false, allowBlank:'false', automationCls:'login-email', cls:'x-unselectable login-form', bind:{value:'{email}', label:'{i18n.login_emailOrOrganisation:htmlEncode}'}}, {xtype:'label', itemId:'errorText', padding:4, bind:{html:'{errorText}'}}]}, {xtype:'container', cls:'main-content-footer', defaults:{labelAlign:'top'}, items:[{xtype:'button', tabIndex:3, cls:'btn-login login-form a-login-button', 
itemId:'loginButton', bind:{text:'{i18n.login_signin_btn:htmlEncode}'}, handler:'loginButtonClick'}]}]});
Ext.define('ABP.view.launch.LaunchCanvas', {extend:'Ext.Container', alias:'widget.launchcanvas', requires:['ABP.view.launch.LaunchCarousel', 'ABP.view.launch.login.Login', 'ABP.view.launch.settings.Settings', 'ABP.view.launch.maintenance.Maintenance', 'ABP.view.launch.selectuser.SelectUser', 'ABP.view.launch.discovery.Discovery'], itemId:'launch-canvas', cls:'launch-canvas', layout:{type:'vbox', align:'center', pack:'center'}, items:[{xtype:'sessionbanner', docked:'top'}, {xtype:'container', userCls:'login-form', 
layout:{type:'vbox', align:'stretch', pack:'center'}, itemId:'login-form-wrapper', cls:'login-form-wrapper', hidden:true, items:[{xtype:'component', cls:'login-hdr-wrapper', itemId:'login-title', html:'\x3cdiv class\x3d"login-hdr"\x3e\x3c/div\x3e', tabIndex:-1, focusable:false}, {xtype:'launchcarousel', flex:1, items:[{title:'settings', xtype:'settings', itemId:'settings-tab'}, {title:'selectuser', xtype:'selectuser', itemId:'selectuser-tab'}, {title:'discovery', xtype:'discovery', itemId:'discovery-tab'}, 
{title:'login', xtype:'login', itemId:'login-tab'}, {title:'maintenance', xtype:'maintenance', itemId:'maintenance-tab'}]}]}]});
Ext.define('ABP.view.main.ABPMainController', {extend:'Ext.app.ViewController', alias:'controller.abpmaincontroller', requires:['ABP.util.Ajax', 'ABP.util.Discovery', 'ABP.util.AuthenticationManager', 'ABP.view.launch.loading.LoadingScreen', 'ABP.view.base.noSupport.NoSupport', 'ABP.view.base.automation.AutomationHintOverlay', 'ABP.util.LocalStorage', 'ABP.util.SessionStorage', 'ABP.util.ServiceManager', 'ABP.view.session.offline.PasswordPrompt', 'Ext.Package', 'ABP.util.Sha256', 'ABP.view.launch.LaunchCanvas', 
'ABP.util.keyboard.Shortcuts', 'ABP.ThemeManager'], listen:{global:{main_tokenAuthenticate:'tokenAuthenticate'}, controller:{'*':{main_Authenticate:'authenticate', main_doBootstrap:'doBootstrap', main_doConfiguration:'doConfiguration', main_getSubscriptionServices:'getSubscriptionServices', main_ShowLogin:'showLogin', main_ShowNoSupportPage:'showNoSupportPage', main_AddSession:'addSession', main_DestroySession:'destroySession', main_relaunch:'relaunch', main_appUnloaded:'onAppUnloaded', main_appLoaded:'onAppLoaded', 
main_appShutdown:'onAppShutdown', main_fireAppEvent:'fireAppEvent', main_logoutComplete:'logoutComplete', main_showLoading:'showLoading', main_switchLanguage:'switchLanguage', main_hideLoading:'hideLoading', main_forceLogin:'forceLogin', main_addDefaultLanguageStrings:'addDefaultLanguageStrings', main_saveExtraFieldInfo:'saveExtras', main_routingWarningCallback:'routingWarningCallback', main_secondAuthStep:'secondAuthStep', main_loginAsUser:'loginAsUser', main_showLoginForNewUser:'showLoginForNewUser', 
main_processHeadlines:'processHeadlines', main_pendingChanges:'pendingChangesToggle', main_activeAppFocus:'activeAppFocus', main_updateUserProfile:'onUpdateUserProfile', main_updateLanguageStrings:'updateLanguageStrings', container_go_online:'promptOnlineMode', container_go_offline:'promptOfflineMode', abp_milestone_authentication_success:'afterLoginSuccess'}}, component:{'*':{main_fireAppEvent:'fireAppEvent'}}, theme:{changed:'switchTheme'}}, keyboardNavigator:null, requestingLogin:false, init:function() {
  var me = this;
  var vm = me.getViewModel();
  var loginAsUser = ABP.util.LocalStorage.get('LoginAsUser');
  ABP.util.LocalStorage.remove('LoginAsUser');
  if (loginAsUser) {
    var loginAsUserObj = ABP.util.Common.jsonDecode(loginAsUser);
    if (Ext.isObject(loginAsUserObj)) {
      if ((Date.now() - loginAsUserObj.created) / 1000 <= ABP.util.Constants.login.loginAsUserLifetime) {
        this.setLoginUser(loginAsUserObj);
      }
    }
  }
  var ssThresh = this.getViewModel().get('smallScreenThreshold');
  vm.set('smallScreen', ABP.util.Common.getClassic() ? false : Ext.Viewport.getWindowWidth() <= ssThresh || Ext.Viewport.getWindowHeight() <= ssThresh);
  this.initKeyboardBindings();
  window.addEventListener('online', function(event) {
    me.handleConnectionStateChange(event);
  });
  window.addEventListener('offline', function(event) {
    me.handleConnectionStateChange(event);
  });
  window.addEventListener('beforeunload', function(e) {
    me.onBeforeUnload(e);
  });
  me.loadApplicationServices();
  var hardcodedConfig = ABP.util.Config.getHardcodedConfig();
  if (!hardcodedConfig || hardcodedConfig.enablePreBootstrapLoad === true) {
    var prebootstrapConfigStore = Ext.data.StoreManager.lookup('ABPPreBootstrapConfigStore');
    if (prebootstrapConfigStore) {
      prebootstrapConfigStore.load({callback:function(records, operation, success) {
        try {
          if (success) {
            var preBootRecord = this.first(), usesRedirectForToken = preBootRecord ? preBootRecord.get('usesRedirectForToken') : false;
            var serverUrl = preBootRecord.get('serverUrl');
            var overrideExistingServerUrl = preBootRecord.get('overrideExistingServerUrl');
            var b2cShowLogin = preBootRecord.get('b2cShowLogin');
            if (Ext.isBoolean(b2cShowLogin)) {
              ABP.util.Msal.setStopAtLoginPage(b2cShowLogin);
            }
            if (overrideExistingServerUrl || !Ext.isEmpty(serverUrl) && Ext.isEmpty(ABP.util.LocalStorage.get('ServerUrl'))) {
              ABP.util.LocalStorage.set('ServerUrl', serverUrl);
              me.fireEvent('settings_refresh_server_url');
            }
            if (ABP.util.Msal.enabled) {
              me.tokenAuthenticate();
            }
            if (usesRedirectForToken) {
              me.handleAuthRedirect();
              return;
            }
          }
        } catch (ex) {
        }
        me.continueToBootstrap();
      }});
    } else {
      ABP.util.Logger.log('Cannot lookup ABPPreBootstrapConfigStore');
      this.continueToBootstrap();
    }
  } else {
    this.continueToBootstrap();
  }
}, tokenAuthenticate:function() {
  var me = this;
  if (Ext.isEmpty(ABP.util.LocalStorage.get('ServerUrl'))) {
    return;
  }
  var token = ABPAuthManager.getToken();
  if (token) {
    me.loginWithB2cToken(token);
  } else {
    me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');
  }
}, handleAuthRedirect:function() {
  var me = this;
  function getParameterByName(name) {
    var match = RegExp('[#\x26]' + name + '\x3d([^\x26]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  function getIdToken() {
    return getParameterByName('id_token');
  }
  var idToken = getIdToken();
  if (idToken) {
    var parseJwt = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    };
    var jwt = parseJwt(idToken);
    if (jwt) {
      if (!ABP.util.Jwt.validateNonce(jwt.nonce)) {
        ABP.util.Logger.logError('ERROR: Nonce is not OK! Token replay attack might be underway');
        return;
      }
      var name = jwt.preferred_username || jwt.name;
      me.authenticateWithIDPToken(idToken, {logonId:name});
    }
  } else {
    var tenantIdentifier = ABP.util.LocalStorage.get('TenantIdentifier');
    if (tenantIdentifier) {
      ABP.util.Discovery.discover(tenantIdentifier, null, function(error) {
        me.showLaunch('discovery-tab', error ? {error:error} : null);
      });
    } else {
      var getError = function() {
        return getParameterByName('error');
      };
      var error = getError();
      me.showLaunch('discovery-tab', error ? {error:error} : null);
    }
  }
}, loginWithB2cToken:function(token, options) {
  var me = this;
  var bootstrapConfig = ABP.util.Config.getBootstrapConfig();
  var vm = me.getViewModel();
  var jsonData;
  var keepSignedIn;
  var tokenPayload = ABP.util.Jwt.getPayload(token);
  vm.set('hidePreAuthMessage', true);
  if (Ext.isEmpty(bootstrapConfig)) {
    return;
  }
  var stopAtLoginPage = ABP.util.Msal.getStopAtLoginPage();
  if (stopAtLoginPage === true && Ext.isEmpty(options)) {
    var keepMeSignedIn = !!ABP.util.LocalStorage.get('keepSignedIn') === true;
    if (keepMeSignedIn) {
      options = options || {};
      options.jsonData = me.reconstructUserSessionObject();
    } else {
      me.showLogin();
      return;
    }
  }
  if (!Ext.isEmpty(vm.get('loginTime')) || me.requestingLogin === true) {
    me.fireEvent('main_hideLoading');
    return;
  }
  options = options || {};
  jsonData = Ext.isEmpty(options.jsonData) ? {logonId:''} : options.jsonData;
  keepSignedIn = Ext.isEmpty(options.jsonData) ? false : options.keepSignedIn;
  me.requestingLogin = true;
  me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');
  ABP.util.Ajax.request({url:ABP.util.LocalStorage.get('ServerUrl') + '/abp/login/', method:'POST', headers:{'Authorization':'Bearer ' + token}, jsonData:jsonData, keepSignedIn:keepSignedIn, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, success:function(response, request) {
    me.requestingLogin = false;
    var jsonData = request.jsonData || {};
    var keepSignedIn = request.keepSignedIn;
    if (tokenPayload) {
      if (!Ext.isEmpty(tokenPayload.emails)) {
        jsonData.logonId = tokenPayload.emails[0];
      } else {
        if (tokenPayload.family_name && tokenPayload.given_name) {
          jsonData.logonId = tokenPayload.given_name + ' ' + tokenPayload.family_name;
        } else {
          var msalUserAccount = ABP.util.Msal.instance.getAccount();
          if (msalUserAccount && msalUserAccount.name) {
            jsonData.logonId = msalUserAccount.name;
          }
        }
      }
    }
    var responseData = Ext.JSON.decode(response.responseText);
    if (responseData.authorizationToken) {
      ABPAuthManager.authenticationSuccess(responseData.authorizationToken);
    }
    me.authenticationLogic(responseData, true, jsonData, keepSignedIn);
  }, failure:function(err) {
    me.requestingLogin = false;
    if (err) {
    } else {
    }
    me.fireEvent('main_hideLoading');
  }});
}, authenticateWithIDPToken:function(token, jsonData) {
  var me = this;
  var vm = me.getViewModel();
  vm.set('hidePreAuthMessage', true);
  me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');
  ABP.util.Ajax.request({url:ABP.util.LocalStorage.get('ServerUrl') + '/abp/login/', method:'POST', jsonData:jsonData, headers:{'Authorization':'Bearer ' + token}, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, success:function(response) {
    if (jsonData.customerName) {
      ABP.util.LocalStorage.set('TenantIdentifier', jsonData.customerName);
    }
    var responseData = Ext.JSON.decode(response.responseText);
    if (responseData.authorizationToken) {
      ABPAuthManager.authenticationSuccess(responseData.authorizationToken);
    }
    me.authenticationLogic(responseData, true, jsonData);
  }, failure:function(err) {
    if (err) {
    } else {
    }
    me.fireEvent('main_hideLoading');
  }});
}, continueToBootstrap:function() {
  var vm = this.getViewModel();
  var eFields = ABP.util.Config.config.prebootSettingsExtraFields;
  if (!Ext.isEmpty(eFields)) {
    vm.set('injectedSettingsFields', eFields);
  }
  if (Ext.isEmpty(eFields)) {
    this.doBootstrap();
  } else {
    if (this.checkPrebootVsLocalStorage(eFields)) {
      this.doBootstrap();
    } else {
      this.showLaunch('settings-tab');
    }
  }
}, onBeforeUnload:function(event) {
  var me = this, vm = me.getViewModel();
  if (vm.get('pendingChanges') && !vm.get('signout')) {
    return (event || window.event).returnValue = ABP.util.Common.geti18nString('reload_warning');
  }
}, loginAsUser:function(userInfo) {
  this.setLoginUser(userInfo);
  this.authCheck();
}, showLoginForNewUser:function() {
  this.setLoginUser(null);
  this.fireEvent('launchCarousel_Login', this);
}, setLoginUser:function(userInfo) {
  var vm = this.getViewModel();
  vm.set('loginAsUser', userInfo);
  userInfo = userInfo || {};
  if (userInfo.clearSession) {
    ABP.util.SessionStorage.remove('sessionToken');
    ABP.util.SessionStorage.remove('SavedUsername');
    return;
  }
  if (Ext.isEmpty(userInfo.sessionToken)) {
    ABP.util.SessionStorage.remove('sessionToken');
    ABP.util.SessionStorage.remove('SavedUsername');
    ABP.util.LocalStorage.remove('sessionToken');
  } else {
    if (Ext.isObject(userInfo.sessionToken)) {
      userInfo.sessionToken = Ext.JSON.encode(userInfo.sessionToken);
    }
    ABP.util.SessionStorage.set('sessionToken', userInfo.sessionToken);
    if (vm.get('bootstrapConf.settings.canKeepMultipleUsersSignedIn')) {
      ABP.util.LocalStorage.remove('sessionToken');
    }
  }
  if (Ext.isEmpty(userInfo.logonId)) {
    ABP.util.LocalStorage.remove('SavedUsername');
    ABP.util.SessionStorage.remove('SavedUsername');
  } else {
    ABP.util.LocalStorage.set('SavedUsername', userInfo.logonId);
    ABP.util.SessionStorage.set('SavedUsername', userInfo.logonId);
  }
  if (Ext.isEmpty(userInfo.password)) {
    ABP.util.LocalStorage.remove('SavedPassword');
  } else {
    ABP.util.LocalStorage.set('SavedPassword', userInfo.password);
  }
  if (Ext.isEmpty(userInfo.environment)) {
    ABP.util.LocalStorage.remove('SavedEnvironment');
  } else {
    ABP.util.LocalStorage.set('SavedEnvironment', userInfo.environment);
  }
  if (Ext.isEmpty(userInfo.locale)) {
    ABP.util.LocalStorage.remove('SavedLanguage');
  } else {
    ABP.util.LocalStorage.set('SavedLanguage', userInfo.locale);
  }
  vm.set('allowAutoShowSelectUser', false);
  this.fireEvent('login_updateViewModel');
}, authenticate:function(jsonData, keepSignedIn) {
  var me = this;
  var vm = me.getViewModel();
  if (ABP.util.Msal.enabled) {
    var token = ABPAuthManager.getToken();
    if (token) {
      me.loginWithB2cToken(token, {jsonData:jsonData, keepSignedIn:keepSignedIn});
      return;
    }
  }
  me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');
  if (keepSignedIn === undefined) {
    keepSignedIn = vm.get('keepMeSignedIn');
  }
  if (keepSignedIn) {
    vm.set('keepMeSignedIn', true);
  }
  vm.set('selected.environment', jsonData.environment);
  vm.set('selected.language', jsonData.locale);
  if ((vm.get('isOffline') || vm.get('offlineMode')) && !ABP.util.Config.getLoggedIn()) {
    me.offlineAuthenticate(jsonData, keepSignedIn);
    return;
  }
  ABP.util.Ajax.request({url:ABP.util.LocalStorage.get('ServerUrl') + '/abp/login/', method:'POST', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, jsonData:jsonData, success:function(response) {
    me.loginSuccess(response, jsonData, true);
  }, failure:function(err) {
    if (err) {
      if ((vm.get('isOffline') || vm.get('offlineMode')) && ABP.util.Config.getLoggedIn()) {
        me.fireEvent('main_hideLoading');
        ABP.view.base.popUp.PopUp.showPopup('offline_passwordPrompt_failure', 'error_ok_btn');
        return;
      }
      if (err.timedout) {
        ABP.view.base.popUp.PopUp.showPopup('error_timedout', 'error_ok_btn', function() {
          me.fireEvent('login_UserHit');
        });
      } else {
        if (err.responseText !== '') {
          var resText = Ext.JSON.decode(err.responseText);
          me.handleLoginFailureResponse(resText, false, null, function() {
            me.fireEvent('login_UserHit');
          });
        }
      }
    } else {
      ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn', function() {
        me.fireEvent('login_UserHit');
      });
    }
    me.redirectTo('login', true);
    me.fireEvent('main_hideLoading');
  }});
}, authenticationLogic:function(responseData, loginPass, jsonData, keepSignedIn) {
  var me = this;
  var vm = me.getViewModel();
  vm.set('loginTime', Date.now());
  if (responseData && responseData.logonId) {
    jsonData = jsonData || {};
    jsonData.logonId = responseData.logonId;
  }
  if (jsonData) {
    if (loginPass || jsonData.logonId) {
      ABP.util.Config.setUsername(jsonData.logonId);
      ABP.util.SessionStorage.set('SavedUsername', jsonData.logonId);
    }
    if (loginPass || jsonData.environment) {
      ABP.util.Config.setEnvironment(jsonData.environment);
    }
    if (loginPass) {
      ABP.util.LocalStorage.upgradeUserStorage();
    }
    if (loginPass) {
      ABP.util.LocalStorage.setForLoggedInUser(ABP.util.LocalStorage.usernameKey, ABP.util.Config.getUsername());
      ABP.util.LocalStorage.setForLoggedInUser('LastLogin', Date.now());
    }
    if (loginPass || jsonData.logonId) {
      me.rememberValue({value:jsonData.logonId, toLocalStorageKey:'SavedUsername', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberUsername', orIf:keepSignedIn});
    }
    if (loginPass || jsonData.password) {
      me.rememberValue({value:jsonData.password, toLocalStorageKey:'SavedPassword', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberPassword', andOnlyIf:keepSignedIn, toLoggedInUserLocalStorageKey:true});
    }
    if (loginPass || jsonData.environment) {
      me.rememberValue({value:jsonData.environment, toLocalStorageKey:'SavedEnvironment', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberEnvironment'});
    }
    if (loginPass || jsonData.locale) {
      me.rememberValue({value:jsonData.locale, toLocalStorageKey:'SavedLanguage', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberLanguage', toLoggedInUserLocalStorageKey:true});
    }
    if (loginPass || jsonData.logonId && jsonData.password) {
      if (vm.get('bootstrapConf.offlineAuthenticationType') === 2) {
        var salt = ABP.util.Sha256.generateSaltForUser(jsonData.logonId, jsonData.environment);
        var passwordHash = ABP.util.Sha256.sha256(jsonData.password, salt);
        ABP.util.LocalStorage.setForLoggedInUser('SavedPasswordHash', passwordHash);
      }
    }
  }
  if (loginPass) {
    me.rememberValue({value:me.getExtraSettingsFieldsAsString(), toLocalStorageKey:'settingsextrafields', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberExtraSettingsFields'});
    me.rememberValue({value:me.getExtraLoginFieldsAsString(), toLocalStorageKey:'loginextrafields', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberExtraLoginFields'});
    if (keepSignedIn) {
      ABP.util.LocalStorage.setForLoggedInUser('keepSignedIn', true);
      ABP.util.LocalStorage.set('keepSignedIn', true);
    }
  }
  if (responseData && responseData.extraStep) {
    me.showLaunch('extraloginstep-tab', responseData.extraStep);
    me.fireEvent('main_hideLoading');
  } else {
    if (Ext.isEmpty(ABP.util.Config.getAuthType())) {
      if (!ABP.util.Config._bootstrapConfig || !ABP.util.Config._bootstrapConfig.authenticatedUserName) {
        if (ABP.util.Common.isJsonString(responseData.sessionId)) {
          var breakdown = Ext.JSON.decode(responseData.sessionId);
          ABP.util.Config.setSessionId(breakdown);
          ABP.util.Config.setAuthType('oauth');
          me.handleNewToken(breakdown, keepSignedIn);
        } else {
          ABP.util.Config.setSessionId(responseData.sessionId);
          ABP.util.Config.setAuthType('integrated');
        }
      }
    }
    if (ABP.util.Config.getAuthType() === 'oauth') {
      var tokenResponse = Ext.JSON.decode(responseData.sessionId);
      ABP.util.Config.setSessionId(tokenResponse);
      me.handleNewToken(tokenResponse, keepSignedIn);
    } else {
      if (ABP.util.Config.getAuthType() === 'integrated') {
        if (responseData.sessionId) {
          ABP.util.Config.setSessionId(responseData.sessionId);
        }
      } else {
        if (ABP.util.Config.getAuthType() === 'cookie') {
        }
      }
    }
    if (typeof appInsights == 'object') {
      appInsights.setAuthenticatedUserContext(jsonData.logonId);
    }
    me.fireEvent('container_authentication_success');
    me.fireEvent('main_doConfiguration', jsonData && jsonData.locale ? jsonData.locale : vm.get('selected.language'));
  }
}, secondAuthStep:function(jsonData, path) {
  var me = this;
  var vm = me.getViewModel();
  if (path && path[0] !== '/') {
    path = '/' + path;
  }
  me.fireEvent('main_showLoading', ABP.util.Common.geti18nString('load_extraAuthStep'));
  ABP.util.Ajax.request({url:ABP.util.LocalStorage.get('ServerUrl') + path, method:'POST', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, jsonData:jsonData, success:function(response) {
    me.loginSuccess(response, jsonData, false);
  }, failure:function(err) {
    if (err) {
      if (err.timedout) {
        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.error_timedout'), vm.get('i18n.error_ok_btn'), function() {
          me.fireEvent('login_UserHit');
        });
      } else {
        if (err.responseText !== '') {
          try {
            var resText = Ext.JSON.decode(err.responseText);
            var mess = resText.errorMessage;
          } catch (error) {
          }
          if (mess) {
            ABP.view.base.popUp.PopUp.showPopup(mess, vm.get('i18n.error_ok_btn'), function() {
              me.fireEvent('login_UserHit');
            });
          } else {
            ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_authFailure'), vm.get('i18n.error_ok_btn'), function() {
              me.fireEvent('login_UserHit');
            });
          }
        }
      }
    } else {
      ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_authFailure'), vm.get('i18n.error_ok_btn'), function() {
        me.fireEvent('login_UserHit');
      });
    }
    me.redirectTo('login', true);
    me.fireEvent('main_hideLoading');
  }});
}, showLaunch:function(startingLaunchCarouselTab, options) {
  var me = this;
  var view = this.getView();
  if (!view.down('launchcanvas')) {
    view.removeAll(true, true);
    me.getViewModel().set('startingLaunchCarouselTab', startingLaunchCarouselTab);
    view.add({xtype:'launchcanvas'});
  }
  switch(startingLaunchCarouselTab) {
    case 'settings-tab':
      me.fireEvent('launchCarousel_Settings');
      break;
    case 'login-tab':
      me.fireEvent('launchCarousel_Login');
      break;
    case 'maintenance-tab':
      me.fireEvent('launchCarousel_Maintenance');
      break;
    case 'selectuser-tab':
      me.fireEvent('launchCarousel_SelectUser');
      break;
    case 'discovery-tab':
      me.fireEvent('launchCarousel_Discovery', options);
      break;
    case 'extraloginstep-tab':
      me.fireEvent('launchCarousel_Maintenance', 'maintenanceextrastep', options);
  }
}, showNoSupportPage:function() {
  var me = this;
  var view = me.getView();
  view.removeAll(true, true);
  view.add({xtype:'nosupportpage'});
}, showSettings:function() {
  this.showLaunch('settings-tab');
}, showLogin:function() {
  if (this.getViewModel().get('allowAutoShowSelectUser') == true && this.userSelectionPossible()) {
    this.showLaunch('selectuser-tab');
  } else {
    this.showLaunch('login-tab');
  }
}, userSelectionPossible:function() {
  var vm = this.getViewModel();
  if (vm && vm.get('bootstrapped') && ABP.util.Config.getBootstrapConfig().settings.canKeepMultipleUsersSignedIn) {
    var userData = ABP.util.LocalStorage.getUserData();
    if (userData && userData.length > 1) {
      return true;
    }
  }
  return false;
}, doBootstrap:function() {
  var me = this;
  var vm = me.getView().getViewModel();
  var serverUrl = ABP.util.Ajax.getBootstrapServerUrl();
  var extraFields = me.getExtraSettingsFields();
  var fullUrl = '';
  if (!serverUrl || Ext.browser.name === 'IE' && Ext.browser.version.major === 9 && !ABP.util.Config.checkHostNameMatch(serverUrl)) {
    me.showSettings();
    return;
  }
  fullUrl = serverUrl + '/abp/bootstrap?deviceType\x3d' + Ext.os.deviceType + '\x26locale\x3d' + ABP.util.Common.getBrowserLanguage();
  if (!Ext.isEmpty(extraFields)) {
    var i = 0;
    for (i; i < extraFields.length; ++i) {
      fullUrl += '\x26' + extraFields[i].fieldId + '\x3d' + extraFields[i].val;
    }
  }
  Ext.Ajax.useDefaultXhrHeader = true;
  ABP.util.Ajax.request({url:fullUrl, withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, method:'GET', success:function(response) {
    try {
      ABP.util.LocalStorage.set('ServerUrl', serverUrl);
      var resp = Ext.JSON.decode(response.responseText);
      vm.set('offlineMode', false);
      if (resp.resultCode === 0) {
        me.loadBootstrapConfig(resp.configuration);
      } else {
        if (resp.resultCode === 11) {
          me.showSettings();
        } else {
          if (resp.errorMessage) {
            ABP.view.base.popUp.PopUp.showError(resp.errorMessage);
          }
          me.showSettings();
        }
      }
    } catch (ex) {
      me.doBootstrapErrorHander(ex, me, vm);
    }
  }, failure:function(err) {
    me.doBootstrapErrorHander(err, me, vm);
  }});
}, doBootstrapErrorHander:function(err, me, vm) {
  if ((err.status === 404 || err.status === 0) && (!navigator.onLine || navigator.connection && (navigator.connection.type === 'unknown' || navigator.connection.type === 'none'))) {
    if (ABP.util.LocalStorage.get('OfflineBootstrap')) {
      vm.set('offlineMode', true);
      var offlineBootstrap = Ext.JSON.decode(ABP.util.LocalStorage.get('OfflineBootstrap'));
      var offlineAuthType = offlineBootstrap.offlineAuthenticationType;
      var hideOfflineModeToggle = offlineBootstrap.hideOfflineModeToggle;
      offlineBootstrap = offlineBootstrap.bootstrap;
      offlineBootstrap.offlineAuthenticationType = offlineAuthType;
      offlineBootstrap.hideOfflineModeToggle = hideOfflineModeToggle;
      me.loadBootstrapConfig(offlineBootstrap);
      return;
    }
  }
  if (ABP.util.Ajax.getAttemptDiscoveryServerUrl()) {
    me.doBootstrap();
    return;
  }
  me.showSettings();
  var connection = vm.checkI18n('error_connection_failed');
  var conMess = vm.checkI18n('error_connection_instructions');
  var okBtn = vm.checkI18n('error_ok_btn');
  if (err && err.responseText !== '') {
    var mess = '';
    try {
      var resText = Ext.JSON.decode(err.responseText, true);
      mess = resText.errorMessage;
    } catch (e$5) {
      mess = (err.status || '') + ' ' + (err.statusText || '');
    }
    if (mess) {
      ABP.view.base.popUp.PopUp.showError(conMess, connection + ' ' + mess, okBtn);
    } else {
      ABP.view.base.popUp.PopUp.showError(conMess, connection, okBtn);
    }
  } else {
    ABP.view.base.popUp.PopUp.showError(conMess, connection, okBtn);
  }
}, authCheck:function() {
  var me = this, vm = me.getView().getViewModel(), jsonData;
  var loginAsUser = vm.get('loginAsUser') || {};
  vm.set('loginAsUser', null);
  if (ABP.util.Config.isPreAuthenticated()) {
    ABP.util.Config.setUsername(ABP.util.Config.getBootstrapConfig().authenticatedUserName);
    if (!me.checkEnvLangAvailability()) {
      if (me.extraFieldsProcessForLoginBypass()) {
        me.doConfiguration();
        me.getViewModel().set('loginTime', Date.now());
      } else {
        me.redirectTo('login', true);
      }
    } else {
      me.redirectTo('login', true);
    }
    return;
  }
  var sessionToken = loginAsUser.sessionToken || ABP.util.SessionStorage.get('sessionToken');
  if (sessionToken) {
    sessionToken = ABP.util.Common.jsonDecode(sessionToken);
    if (sessionToken && sessionToken.refresh_token) {
      var userId = ABP.util.SessionStorage.get('SavedUsername');
      if (userId) {
        this.refreshTokenRelog(sessionToken.refresh_token, userId);
        return;
      }
    }
  }
  var localToken = ABP.util.LocalStorage.get('sessionToken');
  if (localToken) {
    localToken = ABP.util.Common.jsonDecode(localToken);
    if (localToken && localToken.refresh_token) {
      var userId = ABP.util.LocalStorage.get('SavedUsername');
      if (userId) {
        me.getViewModel().set('keepMeSignedIn', true);
        me.refreshTokenRelog(localToken.refresh_token, userId);
        return;
      }
    }
  }
  if (ABP.util.Config.getAuthType() === 'cookie') {
    var savedUserName = ABP.util.LocalStorage.get('SavedUsername');
    var savedEnvironment = ABP.util.LocalStorage.get('SavedEnvironment');
    var keepSignedIn = ABP.util.LocalStorage.getForUser(savedEnvironment, savedUserName, 'keepSignedIn') === 'true';
    if (keepSignedIn || !!ABP.util.SessionStorage.get('SavedUsername')) {
      jsonData = {logonId:savedUserName, environment:savedEnvironment, locale:ABP.util.LocalStorage.get('SavedLanguage')};
      me.authenticate(jsonData, keepSignedIn);
      return;
    }
  }
  me.fireEvent('main_showLoading', 'load_authCheck');
  var autoLoginParams = me.getAutoLoginParams(loginAsUser);
  if (autoLoginParams) {
    vm.set('keepMeSignedIn', true);
    me.fireEvent('main_Authenticate', autoLoginParams, true);
    me.fireEvent('main_showLoading', 'load_log');
    return;
  }
  this.getViewModel().set('keepMeSignedIn', false);
  me.redirectTo('login', true);
  me.fireEvent('main_hideLoading');
}, getExtraSettingsFields:function() {
  var ret;
  var local = ABP.util.LocalStorage.get('settingsextrafields');
  if (local) {
    ret = JSON.parse(local);
  } else {
    ret = this.getViewModel().get('prebootstrapExtraSettingsFilled');
  }
  return ret;
}, getExtraSettingsFieldsAsString:function() {
  var me = this;
  var ret;
  var extra = me.getExtraSettingsFields();
  if (Ext.isString(extra)) {
    ret = extra;
  } else {
    ret = JSON.stringify(extra);
  }
  return ret;
}, getExtraSettingsFieldsFromString:function() {
  var me = this;
  var ret;
  var extra = me.getExtraSettingsFields();
  if (Ext.isString(extra)) {
    ret = JSON.parse(extra);
  } else {
    ret = extra;
  }
  return ret;
}, getExtraLoginFields:function() {
  var ret;
  var local = ABP.util.LocalStorage.get('loginextrafields');
  if (local) {
    ret = local;
  } else {
    ret = this.getViewModel().get('loginExtraFieldsFilled');
  }
  return ret;
}, getExtraLoginFieldsAsString:function() {
  var me = this;
  var ret;
  var extra = me.getExtraLoginFields();
  if (Ext.isString(extra)) {
    ret = extra;
  } else {
    ret = JSON.stringify(extra);
  }
  return ret;
}, getExtraLoginFieldsFromString:function() {
  var me = this;
  var ret;
  var extra = me.getExtraLoginFields();
  if (Ext.isString(extra)) {
    ret = JSON.parse(extra);
  } else {
    ret = extra;
  }
  return ret;
}, isValidServerUrl:function(url) {
  if (!url) {
    return false;
  }
  return /^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*|(?:(?:[a-z\u00a1-\uffff0-9]+_?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(url);
}, getAutoLoginParams:function(loginAsUser) {
  var me = this;
  var vm = me.getViewModel();
  var i;
  var env;
  var forceLogin = ABP.util.LocalStorage.get('forceLogin');
  if (forceLogin === 'true') {
    ABP.util.LocalStorage.set('forceLogin', '');
    return false;
  }
  var envs = vm.get('bootstrapConf.availableEnvironments');
  var preAuthUser = vm.get('bootstrapConf.authenticatedUserName');
  var authType = vm.get('bootstrapConf.settings.authenticationType');
  if (authType === 'integrated' && preAuthUser && envs) {
    var autoEnv = null;
    if (envs.length === 1) {
      autoEnv = envs[0].id;
    } else {
      env = ABP.util.LocalStorage.get('SavedEnvironment');
      if (env !== '' && env !== undefined && env !== null) {
        for (i = 0; i < envs.length; ++i) {
          if (envs[i].id === env) {
            autoEnv = env;
            break;
          }
        }
      }
    }
    if (autoEnv !== null) {
      return {'environment':autoEnv, 'logonId':preAuthUser, 'password':'', 'locale':''};
    }
  }
  var user;
  var pass;
  var env;
  var lang;
  if (loginAsUser && !Ext.Object.isEmpty(loginAsUser)) {
    user = loginAsUser.logonId;
    pass = loginAsUser.password;
    env = loginAsUser.environment;
    lang = loginAsUser.locale;
  } else {
    if (!this.userSelectionPossible() && vm.get('bootstrapConf.settings.canKeepMeSignedIn')) {
      user = ABP.util.LocalStorage.get('SavedUsername');
      pass = ABP.util.LocalStorage.get('SavedPassword');
      env = ABP.util.LocalStorage.get('SavedEnvironment');
      lang = ABP.util.LocalStorage.get('SavedLanguage');
    }
  }
  if (user !== '' && user !== undefined && user !== null && (pass !== '' && pass !== undefined && pass !== null) && (env !== '' && env !== undefined && env !== null) && (lang !== '' && lang !== undefined && lang !== null)) {
    return {'environment':env, 'logonId':user, 'password':pass, 'locale':lang};
  }
  return false;
}, rememberValue:function(opts) {
  var me = this;
  var vm = me.getViewModel();
  var value = '';
  var setLS = opts.orIf || (opts.ifLocalStorageEnabledBy ? vm.get(opts.ifLocalStorageEnabledBy) : false);
  if (setLS === 'true') {
    setLS = true;
  }
  if (setLS === true && (opts.andOnlyIf === undefined || opts.andOnlyIf === true)) {
    value = opts.value;
  }
  ABP.util.LocalStorage.set(opts.toLocalStorageKey, value);
  if (opts.toLoggedInUserLocalStorageKey) {
    ABP.util.LocalStorage.setForLoggedInUser(opts.toLocalStorageKey, value);
  }
}, relaunch:function() {
  var me = this;
  var view = me.getView();
  view.getViewModel().set('bootstrapped', false);
  view.removeAll(true, true);
  view.add({xtype:'loadingscreen', anchor:'100% 100%'});
  me.doBootstrap();
}, doConfiguration:function(locale) {
  var me = this;
  var vm = me.getViewModel();
  var servicesAttempted = vm.get('servicesAttempted');
  if (locale) {
    ABP.util.Config.setLanguage(locale);
  } else {
    locale = ABP.util.Config.getLanguage();
  }
  if (!servicesAttempted) {
    me.fireEvent('main_getSubscriptionServices');
    return;
  }
  var extraFields = vm.get('configurationExtraInfo');
  var extraSettings = me.getExtraSettingsFields();
  ABP.util.Config.setLanguage(locale);
  me.fireEvent('main_showLoading', 'load_load_config', 'fullSize');
  if (ABP.util.LocalStorage.get('OfflineBootstrap') && vm.get('bootstrapConf.offlineAuthenticationType') === 1) {
    if (!ABP.util.LocalStorage.containsForLoggedInUser('OfflinePassword') && !ABP.util.LocalStorage.getForLoggedInUser('OfflinePasswordSkipped')) {
      me.fireEvent('launchCarousel_Maintenance', 'offlinepassword');
      me.fireEvent('main_hideLoading');
      return;
    }
  }
  if (vm.get('switchToOnline') === true) {
    me.fireEvent('container_online_mode');
    vm.set('offlineMode', false);
    vm.set('switchToOnline', null);
  }
  if ((vm.get('isOffline') || vm.get('offlineMode')) && ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')) {
    me.loadSessionConfig(Ext.JSON.decode(ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')));
    return;
  }
  var urlPartTwo = '';
  var i = 0;
  if (locale) {
    urlPartTwo = '/abp/configuration?locale\x3d' + locale + '\x26deviceType\x3d' + Ext.os.deviceType;
  } else {
    urlPartTwo = '/abp/configuration?deviceType\x3d' + Ext.os.deviceType;
  }
  if (extraFields && !Ext.isEmpty(extraFields)) {
    for (i = 0; i < extraFields.length; ++i) {
      urlPartTwo += '\x26' + extraFields[i].fieldId + '\x3d' + extraFields[i].val;
    }
  }
  if (extraSettings && !Ext.isEmpty(extraSettings)) {
    for (i = 0; i < extraSettings.length; ++i) {
      urlPartTwo += '\x26' + extraSettings[i].fieldId + '\x3d' + extraSettings[i].val;
    }
  }
  var url = ABP.util.LocalStorage.get('ServerUrl') + urlPartTwo;
  ABP.util.Ajax.request({url:url, withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, method:'GET', success:function(response) {
    me.fireEvent('main_showLoading', 'load_apply_config', 'fullSize');
    var resp = Ext.JSON.decode(response.responseText);
    if (resp.resultCode === 0) {
      me.loadSessionConfig(resp.configuration);
    } else {
      me.handleLoginFailureResponse(resp, false, 'login_error_configFailure');
      me.redirectTo('login', true);
    }
    me.fireEvent('main_doPostConfiguration');
    me.fireEvent('main_hideLoading');
  }, failure:function(err) {
    me.redirectTo('login', true);
    me.fireEvent('main_hideLoading');
    if (err) {
      if (err.timedout) {
        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.error_timedout'), vm.get('i18n.error_ok_btn'), function() {
          me.fireEvent('login_UserHit');
        });
      } else {
        if (err.responseText !== '') {
          var resText = ABP.util.Common.jsonDecode(err.responseText);
          me.handleLoginFailureResponse(resText, false, 'login_error_configFailure');
        } else {
          ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_configFailure'), vm.get('i18n.error_ok_btn'));
        }
      }
    } else {
      ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_configFailure'), vm.get('i18n.error_ok_btn'));
    }
  }});
}, setupConfiguration:function(config) {
  var me = this;
  var themeFound = false;
  ABP.util.Config.setLoggedIn(true);
  me.getView().getViewModel().set('conf', config);
  me.getViewModel().i18nSet(config.languageResources);
  me.fireEvent('main_AddSession');
  me.initializePlugins();
  me.fireEvent('searchDrop_storeLoad', config.settings);
  me.fireEvent('featureCanvas_hideLoading');
  if (ABP.util.Common.getClassic() && ABP.util.Config.getSessionConfig().settings.enableSearch) {
    if (config.settings.searchInfo && config.settings.searchInfo.length > 0) {
      me.fireEvent('toolbar_addSearchButton');
    }
  }
  if (config.settings.appToolbarTitle) {
    me.fireEvent('container_toolbar_setTitle', config.settings.appToolbarTitle);
  }
  if (config.settings.disableNavMenu) {
    me.fireEvent('toolbar_removeMenuButton');
  }
  if (config.toolbarMenu) {
    me.fireEvent('toolbar_setupConfig', config.toolbarMenu);
  }
  if (Ext.theme.subThemeList && !Ext.isEmpty(Ext.theme.subThemeList)) {
    var savedTheme = ABP.util.LocalStorage.getForLoggedInUser('ChosenTheme');
    var themeFound = false;
    if (config.settings.persistSelectedTheme && savedTheme) {
      themeFound = me.processThemeConfig(savedTheme);
    }
    if (!themeFound && config.settings.defaultTheme) {
      themeFound = me.processThemeConfig(config.settings.defaultTheme);
    }
    if (!themeFound) {
      me.processThemeConfig(Ext.theme.subThemeList[0]);
    }
    if (config.settings.mainMenuSingleExpand !== undefined) {
      me.fireEvent('mainMenu_setSingleExpand', config.settings.mainMenuSingleExpand);
    }
    if (config.settings.mainMenuStartFavoritesOpen !== undefined) {
      if (config.settings.mainMenuStartFavoritesOpen) {
        me.fireEvent('mainmenu_openFavorites');
      }
    }
  }
  if (config.settings.enableMenuRecent) {
    if (config.settings.recents && Ext.isArray(config.settings.recents) && !Ext.isEmpty(config.settings.recents)) {
      me.fireEvent('mainMeun_setRecents', config.settings.recents);
    } else {
      var localRecents = ABP.util.LocalStorage.getForLoggedInUser('ABPCore_recentPages');
      if (localRecents) {
        me.fireEvent('mainMeun_setRecents', Ext.JSON.decode(localRecents));
      }
    }
  }
  if (config.shortcuts) {
    me.processShortcuts(config.shortcuts);
  }
  if (config.headlines) {
    me.processHeadlines(config.headlines);
  }
  me.processSenchaStrings();
  me.fireEvent('main_hideLoading');
}, processThemeConfig:function(theme) {
  var me = this;
  var vm = me.getViewModel();
  var themeFound = false;
  var i = 0;
  if (Ext.theme.subThemeList && !Ext.isEmpty(Ext.theme.subThemeList)) {
    if (theme.indexOf('aptean-theme') === -1) {
      theme = 'aptean-theme-' + theme;
    }
    for (i = 0; i < Ext.theme.subThemeList.length; ++i) {
      if (Ext.theme.subThemeList[i] === theme) {
        ABPTheme.setTheme(theme);
        vm.set('startingTheme', theme);
        themeFound = true;
        break;
      }
    }
  }
  return themeFound;
}, processHeadlines:function(headlines, bootstrap) {
  headlines = headlines || [];
  bootstrap = bootstrap || false;
  var me = this, headline, headlineRead, toAdd = [], loggedIn = ABP.util.Config.getLoggedIn(), length = headlines.length, i = 0;
  if (loggedIn && bootstrap) {
    return;
  }
  for (; i < length; i++) {
    headline = headlines[i];
    headlineRead = loggedIn ? ABP.util.LocalStorage.getForLoggedInUser('hr-' + headline.uniqueId) : ABP.util.LocalStorage.get('hr-' + headline.uniqueId);
    if (!headlineRead) {
      toAdd.push(headline);
    }
  }
  if (toAdd.length > 0) {
    me.fireEvent('container_headlines_show', toAdd);
  }
}, initializePlugins:function() {
  var hash;
  ABP.util.PluginManager.initializeAllPlugins();
  hash = ABP.util.SessionStorage.get('AfterLoginRedirect');
  if (hash) {
    this.redirectTo(hash, true);
    ABP.util.SessionStorage.remove('AfterLoginRedirect');
  } else {
    this.redirectTo('home');
  }
}, getSubscriptionServices:function() {
  var me = this;
  var vm = me.getViewModel();
  var url;
  var subService = ABPServiceManager.getService('subscription');
  if (subService) {
    url = subService.url;
  } else {
    ABPLogger.logWarn('Subscription service was not defined in the application.settings.json - service discovery will be disabled');
    vm.set('servicesAttempted', true);
    me.fireEvent('main_doConfiguration');
    return;
  }
  ABP.util.Ajax.request({url:url, withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, method:'GET', success:function(response) {
    vm.set('servicesAttempted', true);
    var resp = Ext.JSON.decode(response.responseText);
    ABP.Config.setSubscriptions(resp);
    me.fireEvent('main_doConfiguration');
  }, failure:function(err) {
    vm.set('servicesAttempted', true);
    me.fireEvent('main_doConfiguration');
  }});
}, addSession:function() {
  var me = this;
  var view = me.getView();
  this.activeAppId = undefined;
  view.removeAll();
  view.add({xtype:'sessioncanvas'});
}, loginSuccess:function(response, jsonData, loginPass) {
  var me = this;
  var vm = me.getViewModel();
  var keepSignedIn = vm.get('keepMeSignedIn');
  var responseData = Ext.JSON.decode(response.responseText);
  if (responseData.resultCode === 0) {
    me.authenticationLogic(responseData, loginPass, jsonData, keepSignedIn);
  } else {
    if (responseData.resultCode === 1) {
      var canForcePw = me.getViewModel().get('bootstrapConf.settings.canForcePasswordChange');
      if (canForcePw === true || canForcePw === 'true') {
        me.getViewModel().set('forcePasswordChange', jsonData);
        me.fireEvent('launchCarousel_Maintenance', 'forcepassword');
      } else {
        me.handleLoginFailureResponse(r, false, 'login_error_passwordExpired');
        me.redirectTo('login', true);
      }
    } else {
      if (responseData.resultCode === 7) {
        if (responseData.errorDetailed || responseData.errorMessage) {
          vm.set('forcedJson', jsonData);
        }
        me.handleLoginFailureResponse(responseData, true);
      } else {
        me.redirectTo('login', true);
        me.handleLoginFailureResponse(responseData, false);
      }
    }
    me.fireEvent('main_hideLoading');
  }
}, handleLoginFailureResponse:function(r, forceLogin, backupString, popUpCallback) {
  forceLogin = forceLogin || false;
  backupString = backupString || 'login_error_authFailure';
  popUpCallback = popUpCallback || null;
  var buttons = forceLogin ? [{text:'login_forceLogin', event:'main_forceLogin'}, {text:'error_cancel_btn'}] : 'error_ok_btn', errorString = r.errorDetailed || r.errorMessageKey || r.errorMessage, popUpError = errorString || backupString;
  if (!r.suppressErrorMessage) {
    ABP.view.base.popUp.PopUp.showPopup(popUpError, buttons, popUpCallback);
  }
  if (errorString) {
    ABP.util.Logger.logError('Error logging in: ' + errorString);
  }
}, handleNewToken:function(token, keepSignedIn, isRefresh) {
  var me = this, vm = me.getView().getViewModel();
  var expiresIn = token.expires_in > 600 ? (token.expires_in - 300) * 1000 : (token.expires_in - token.expires_in * 0.1) * 1000;
  if (!this.refreshTask) {
    this.refreshTask = new Ext.util.DelayedTask(this.refreshToken, this);
    this.refreshTask.delay(expiresIn);
  } else {
    this.refreshTask.delay(expiresIn, this.refreshToken, this);
  }
  ABP.util.SessionStorage.set('sessionToken', Ext.JSON.encode(token));
  if (keepSignedIn) {
    if (ABP.util.Config.getBootstrapConfig().settings.canKeepMultipleUsersSignedIn) {
      ABP.util.LocalStorage.setForLoggedInUser('sessionToken', Ext.JSON.encode(token));
    } else {
      ABP.util.LocalStorage.set('sessionToken', Ext.JSON.encode(token));
    }
  } else {
    if (isRefresh) {
      if (vm.get('bootstrapConf.settings.canKeepMultipleUsersSignedIn')) {
        if (ABP.util.LocalStorage.getForLoggedInUser('sessionToken')) {
          ABP.util.LocalStorage.setForLoggedInUser('sessionToken', Ext.JSON.encode(token));
        }
      } else {
        if (ABP.util.SessionStorage.get('sessionToken')) {
          ABP.util.SessionStorage.set('sessionToken', Ext.JSON.encode(token));
        }
      }
    } else {
      ABP.util.LocalStorage.remove('sessionToken');
      ABP.util.LocalStorage.removeForLoggedInUser('sessionToken');
    }
  }
}, refreshTokenRelog:function(refresh, user) {
  var me = this, vm = me.getViewModel();
  var refreshToken = refresh;
  var keepSignedIn = vm.get('keepMeSignedIn');
  if (vm.get('isOffline') || vm.get('offlineMode')) {
    return;
  }
  ABP.util.Ajax.request({url:ABP.util.Ajax.getServerUrl() + '/abp/refreshtoken', method:'POST', jsonData:{logonId:user, environment:ABP.util.LocalStorage.get('SavedEnvironment'), refreshToken:refreshToken}, success:function(response, options) {
    var r = Ext.JSON.decode(response.responseText);
    var breakdown = Ext.JSON.decode(r.sessionId);
    if (r.resultCode === 0) {
      ABP.util.Config.setSessionId(breakdown);
      me.handleNewToken(breakdown, keepSignedIn, true);
      ABP.util.Config.setEnvironment(ABP.util.LocalStorage.get('SavedEnvironment'));
      ABP.util.Config.setUsername(user);
      vm.set('loginTime', Date.now());
      me.doConfiguration(ABP.util.LocalStorage.get('SavedLanguage'));
      me.fireEvent('container_authentication_success');
    } else {
      var autoLoginParams = me.getAutoLoginParams();
      if (autoLoginParams) {
        me.getViewModel().set('keepMeSignedIn', true);
        me.fireEvent('main_Authenticate', autoLoginParams, true);
        me.fireEvent('main_showLoading', 'load_log');
      } else {
        me.redirectTo('login', true);
      }
    }
  }, failure:function(response, options) {
    var autoLoginParams = me.getAutoLoginParams();
    if (autoLoginParams) {
      me.getViewModel().set('keepMeSignedIn', true);
      me.fireEvent('main_Authenticate', autoLoginParams, true);
      me.fireEvent('main_showLoading', 'load_log');
    } else {
      me.redirectTo('login', true);
    }
  }});
}, refreshToken:function() {
  var me = this;
  var refreshToken = ABP.util.Config.getOAuthInfo().refresh_token;
  var keepSignedIn = me.getViewModel().get('keepMeSignedIn');
  ABP.util.Ajax.request({url:ABP.util.LocalStorage.get('ServerUrl') + '/abp/refreshtoken', method:'POST', jsonData:{logonId:ABP.util.Config.getUsername(), environment:ABP.util.LocalStorage.get('SavedEnvironment'), refreshToken:refreshToken}, success:function(response, options) {
    var r = Ext.JSON.decode(response.responseText);
    var breakdown = Ext.JSON.decode(r.sessionId);
    if (r.resultCode === 0) {
      ABP.util.Config.setSessionId(breakdown);
      me.handleNewToken(breakdown, keepSignedIn, true);
    } else {
    }
  }, failure:function(response, options) {
  }});
}, activeAppId:undefined, activationRequest:undefined, shutdownInProgress:false, deferredShutdownRequests:[], fireAppEvent:function(appId, eventName, eventArgs, activateApp) {
  var me = this;
  if (appId === 'container') {
    me.fireEventArgs(appId + '_' + eventName, eventArgs instanceof Array ? eventArgs : [eventArgs]);
    return;
  } else {
    if (appId) {
      this.fireEvent('featureCanvas_hideSetting');
      if (activateApp === false || activateApp === 'false') {
        this.fireEvent(appId + '_' + eventName, eventArgs);
        return;
      }
      if (this.activeAppId === undefined || this.activeAppId !== appId) {
        this.activationRequest = {appId:appId, eventName:eventName, eventArgs:eventArgs};
        if (this.activeAppId === undefined) {
          this.activateApp();
        } else {
          this.fireEvent(this.activeAppId + '_unload');
        }
      } else {
        this.fireEvent(appId + '_' + eventName, eventArgs);
      }
    }
  }
}, onAppUnloaded:function(appId, abort) {
  if (this.activeAppId === appId) {
    if (abort === true) {
      Ext.util.Logger.info('Shutdown asynchronously aborted by ' + appId);
      this.abortShutdown();
    } else {
      if (this.shutdownInProgress) {
        this.processShutdownQueue();
      } else {
        if (this.activationRequest) {
          this.fireEvent('thumbbar_hide');
          this.activateApp();
        } else {
          this.activeAppId = undefined;
        }
      }
    }
  }
}, activateApp:function() {
  try {
    var app = ABP.util.PluginManager.getPluginInstance(this.activationRequest.appId);
    if (!app) {
      ABP.util.Logger.logError('Unable to find plugin: ' + this.activationRequest.appId);
      return;
    }
    var cmp = app.getAppComponent();
    this.activeAppId = this.activationRequest.appId;
    this.fireEvent('featureCanvas_showFeature', cmp, 'main_appLoaded', this.activationRequest.appId);
  } catch (err) {
    ABP.util.Logger.logError('Error loading plugin: ' + err.message);
  }
}, onAppLoaded:function(appId) {
  var ar = this.activationRequest;
  if (ar) {
    if (ar.appId === appId) {
      if (ar.eventName) {
        this.fireEvent(ar.appId + '_' + ar.eventName, ar.eventArgs);
      }
    }
  }
}, showLoading:function(stringKey, sizeCls) {
  var me = this;
  var mess = stringKey ? me.getViewModel().get('i18n.' + stringKey) || stringKey : '';
  mess = Ext.String.htmlEncode(mess);
  var obj;
  if (ABP.util.Common.getModern()) {
    obj = {xtype:'apteanloadingscreen', message:mess, messageCls:'sm-loading'};
    me.getView().mask(obj);
  } else {
    obj = me.getLoadingHtml(mess, sizeCls);
    me.getView().mask(obj, 'loading-msg');
  }
}, getLoadingHtml:function(mess, sizeCls) {
  var msg;
  msg = '\x3cdiv class\x3d"abp-loadmask loading-cont ' + (sizeCls || 'fullSize') + '"';
  msg += mess !== undefined ? 'role\x3d"alert" aria-label\x3d"' + mess + '"\x3e' : '\x3e';
  msg += '\x3cdiv class\x3d"bars"\x3e \x3cdiv class\x3d"rect1"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect2"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect3"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect4"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect5"\x3e\x3c/div\x3e\x3c/div\x3e';
  if (mess !== undefined) {
    msg += '\x3cdiv class\x3d"sm-loading" width\x3d"215" height\x3d"37"\x3e' + mess + '\x3c/div\x3e';
  }
  return msg;
}, hideLoading:function() {
  if (ABP.util.Common.getModern()) {
    this.getView().setMasked(false);
  } else {
    this.getView().unmask();
  }
}, abortShutdown:function() {
  this.shutdownInProgress = false;
  this.deferredShutdownRequests = [];
  ABP.util.SessionStorage.remove('SignoutReason');
  this.hideLoading();
}, destroySession:function(reason, force) {
  var pluginsToShutdown, i, pluginToShutdown, shutdownResponse;
  if (Ext.isArray(reason) && reason.length > 1) {
    force = reason[1];
    reason = reason[0];
  } else {
    if (Ext.isBoolean(reason)) {
      force = reason;
      reason = '';
    }
  }
  if (force !== true && this.shutdownInProgress) {
    ABP.util.Logger.logInfo('Shutdown already in progress');
    return;
  }
  this.showLoading('signout_message');
  if (reason) {
    ABP.util.SessionStorage.set('SignoutReason', reason);
    if (reason === 'user init' || reason === ABP.util.Common.geti18nString('session_timeout')) {
      this.getViewModel().set('signout', true);
    }
  }
  if (force === true) {
    this.getViewModel().set('signout', true);
    this.commitDestroySession();
    return;
  }
  this.shutdownInProgress = true;
  this.deferredShutdownRequests = [];
  var pluginsToShutdown = ABP.util.PluginManager.getActivePluginsImplementingFunction('requestShutdown');
  var Logger = Ext.toolkit === 'classic' ? Ext.util.Logger : Ext.Logger;
  for (i = 0; i < pluginsToShutdown.length; i++) {
    pluginToShutdown = pluginsToShutdown[i];
    shutdownResponse = 'PROCEED';
    try {
      shutdownResponse = pluginToShutdown.plugin.requestShutdown();
    } catch (e$6) {
      Logger.warn('Exception while calling requestShutdown on pluginId "' + pluginToShutdown.pluginId + '"');
      Logger.logException(e$6);
    }
    if (shutdownResponse === 'ABORT') {
      Logger.info('Shutdown synchronously aborted by ' + pluginToShutdown.pluginId);
      this.abortShutdown();
      return;
    }
    if (shutdownResponse === 'DEFER') {
      this.deferredShutdownRequests.push({plugin:pluginToShutdown.plugin, pluginId:pluginToShutdown.pluginId, status:'queued'});
    }
  }
  if (this.activeAppId !== undefined) {
    this.fireEvent(this.activeAppId + '_unload');
  } else {
    this.processShutdownQueue();
  }
}, onAppShutdown:function(appId, abort) {
  var req;
  if (this.deferredShutdownRequests && this.deferredShutdownRequests.length > 0) {
    req = this.deferredShutdownRequests.shift();
    if (req.pluginId === appId) {
      if (abort === true) {
        this.abortShutdown();
      } else {
        if (req.status !== 'pending') {
          ABP.util.Logger.logWarn('Unexpected state "' + req.status + '" while processing shutdown response from "' + appId + '"');
        }
        this.processShutdownQueue();
      }
    } else {
      ABP.util.Logger.logWarn('Unexpected main_appShutdown recevied from "' + appId + '": expected shutdown response from "' + req.pluginId + '"');
    }
  } else {
    ABP.util.Logger.logWarn('Unexpected main_appShutdown recevied from "' + appId + '": no deferred shutdown requests.');
  }
}, processShutdownQueue:function() {
  if (!this.deferredShutdownRequests || this.deferredShutdownRequests.length <= 0) {
    this.commitDestroySession();
  } else {
    this.deferredShutdownRequests[0].status = 'pending';
    this.fireEvent(this.deferredShutdownRequests[0].pluginId + '_shutdown');
  }
}, commitDestroySession:function() {
  var me = this;
  me.rememberValue({value:'', toLocalStorageKey:'SavedPassword', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberPassword'});
  ABP.util.SessionStorage.remove('AfterLoginRedirect');
  ABP.util.SessionStorage.remove('sessionToken');
  ABP.util.SessionStorage.remove('SavedUsername');
  ABP.util.LocalStorage.removeForLoggedInUser(ABP.util.Config.getEnvironment(), ABP.util.Config.getUsername());
  ABP.util.LocalStorage.remove('SavedUsername');
  ABP.util.LocalStorage.remove('sessionToken');
  ABP.util.LocalStorage.remove('TenantIdentifier');
  ABP.util.LocalStorage.remove('keepSignedIn');
  ABP.util.LocalStorage.set('forceLogin', 'true');
  me.logout();
}, logout:function() {
  var me = this;
  var url = ABP.util.LocalStorage.get('ServerUrl') + '/abp/logout';
  ABP.util.Ajax.request({url:url, method:'POST', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, timeout:4000, success:function(response) {
    var logoutResponse, logoutUrl;
    ABP.util.Config.setLoggedIn(false);
    if (response && response.responseText) {
      logoutResponse = Ext.JSON.decode(response.responseText);
      if (logoutResponse && !Ext.isEmpty(logoutResponse.redirectUrl)) {
        logoutUrl = logoutResponse.redirectUrl;
      }
    }
    me.logoutComplete(logoutUrl);
  }, failure:function(err) {
    me.logoutComplete();
  }});
}, logoutComplete:function(logoutUrl) {
  var url;
  if (ABP.util.Msal.enabled) {
    ABP.util.Msal.signOut();
    return;
  }
  if (!Ext.isEmpty(logoutUrl)) {
    url = logoutUrl;
  } else {
    url = window.location.href;
    var hashStart = url.lastIndexOf('#');
    if (hashStart !== -1) {
      url = url.substr(0, hashStart);
    }
  }
  window.location = url;
}, forceLogin:function() {
  var me = this;
  var vm = me.getViewModel();
  var forcedJson = vm.get('forcedJson');
  forcedJson.forceLogin = true;
  me.authenticate(forcedJson);
}, addDefaultLanguageStrings:function(strings) {
  this.getViewModel().i18nSetDefaults(strings);
  this.fireEvent('afteraddlanguagestrings');
}, updateLanguageStrings:function(strings) {
  this.getViewModel().i18nSet(strings);
}, switchLanguage:function(newLang) {
  var me = this;
  var vm = me.getViewModel();
  if (newLang.languages) {
    newLang = newLang.languages;
  }
  var urlPartTwo = '/abp/configuration?locale\x3d' + newLang + '\x26deviceType\x3d' + Ext.os.deviceType;
  ABP.util.Ajax.request({url:ABP.util.Ajax.getServerUrl() + urlPartTwo, withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, method:'GET', success:function(response) {
    var resp = Ext.JSON.decode(response.responseText);
    if (resp.resultCode === 0) {
      me.getViewModel().set('conf.languageResources', resp.configuration.languageResources);
      me.getViewModel().set('selected.language', newLang);
      ABP.util.Config.setLanguage(newLang);
      me.getViewModel().i18nSet(resp.configuration.languageResources);
      if (resp.configuration.formatting) {
        me.processFormatting(resp.configuration.formatting);
      }
      me.processSenchaStrings();
      me.rememberValue({value:newLang, toLocalStorageKey:'SavedLanguage', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberLanguage', toLoggedInUserLocalStorageKey:true});
      me.fireEvent('afterSwitchLanguage');
    }
  }, failure:function(err) {
    if (err && err.responseText !== '') {
      var resText = Ext.JSON.decode(err.responseText);
      var mess = resText.errorMessage;
      if (mess) {
        ABP.view.base.popUp.PopUp.showError(mess, vm.get('i18n.error_ok_btn'));
      } else {
        ABP.view.base.popUp.PopUp.showError(vm.get('i18n.login_error_languageFailure'), vm.get('i18n.error_ok_btn'));
      }
    } else {
      ABP.view.base.popUp.PopUp.showError(vm.get('i18n.login_error_languageFailure'), vm.get('i18n.error_ok_btn'));
    }
  }});
}, checkPrebootVsLocalStorage:function(prebootFields) {
  var me = this;
  var local = me.getExtraSettingsFieldsFromString();
  var i = 0;
  var j = 0;
  var foundAll = true;
  var foundCurrent = false;
  for (i; i < prebootFields.length; ++i) {
    foundCurrent = false;
    for (j = 0; j < local.length; ++j) {
      if (prebootFields[i].fieldId === local[j].fieldId) {
        if (local[j].val !== '') {
          foundCurrent = true;
          break;
        }
      }
    }
    if (!foundCurrent) {
      foundAll = false;
      ABP.util.LocalStorage.remove('settingsextrafields');
      break;
    }
  }
  return foundAll;
}, checkEnvLangAvailability:function() {
  var me = this;
  var env = ABP.util.Config.getBootstrapConfig().availableEnvironments;
  var ret = false;
  if (env) {
    if (!Ext.isEmpty(env)) {
      if (env.length > 1) {
        ret = true;
      } else {
        if (!Ext.isEmpty(env[0].languages)) {
          if (env[0].languages.length > 1) {
            ret = true;
          }
        }
        me.getViewModel().set('selected.environment', env[0].id);
      }
    }
  }
  return ret;
}, extraFieldsProcessForLoginBypass:function() {
  var me = this;
  var vm = me.getViewModel();
  var local = ABP.util.LocalStorage.get('loginextrafields');
  var extras = ABP.util.Config.getBootstrapConfig().settings.extraLoginFields;
  var ret = true;
  var extraItter = 0;
  var localItter = 0;
  var configExtras = [];
  var found = false;
  if (extras && extras.length > 0) {
    if (local) {
      local = JSON.parse(local);
      for (extraItter = 0; extraItter < extras.length; ++extraItter) {
        found = false;
        for (localItter = 0; localItter < local.length; ++localItter) {
          if (extras[extraItter].fieldId === local[localItter].fieldId) {
            configExtras.push({fieldId:local[localItter].fieldId, val:local[localItter].val});
            found = true;
            break;
          }
        }
        if (!found) {
          if (extras[extraItter].required) {
            if (extras[extraItter].required === true || extras[extraItter].required === 'true') {
              ret = false;
              break;
            }
          }
        }
      }
      if (!Ext.isEmpty(configExtras) && ret) {
        vm.set('configurationExtraInfo', configExtras);
      }
    } else {
      ret = false;
    }
  } else {
    ret = true;
  }
  return ret;
}, saveExtras:function() {
  this.rememberValue({value:this.getExtraLoginFieldsAsString(), toLocalStorageKey:'loginextrafields', ifLocalStorageEnabledBy:'bootstrapConf.settings.rememberExtraLoginFields'});
}, routingWarningCallback:function(answer) {
  if (answer) {
    this.getViewModel().set('signout', true);
    this.destroySession();
  } else {
    window.history.forward();
  }
}, switchTheme:function(newTheme) {
  var body = Ext.getBody();
  var themeList = Ext.theme.subThemeList;
  var vm = this.getViewModel();
  if (newTheme.themes) {
    newTheme = newTheme.themes;
  }
  for (var theme in themeList) {
    body.removeCls(themeList[theme]);
  }
  vm.set('currentTheme', newTheme);
  body.addCls(newTheme);
  if (ABP.util.Config._sessionConfig.settings.persistSelectedTheme) {
    ABP.util.LocalStorage.setForLoggedInUser('ChosenTheme', newTheme);
  }
}, privates:{initKeyboardBindings:function() {
  if (!ABP.util.Common.getClassic()) {
    return;
  }
  this.keyboardNavigator = new ABP.util.keyboard.Shortcuts({controller:this});
}, processShortcuts:function(shortcuts) {
  if (this.keyboardNavigator) {
    this.keyboardNavigator.addShortcuts(shortcuts);
  }
}, loadBootstrapConfig:function(configuration) {
  var me = this;
  ABP.util.Config.processBootstrapConfig(configuration);
  var vm = me.getView().getViewModel();
  vm.set('bootstrapConf', configuration);
  if (configuration.languageResources && configuration.languageResources.length > 0) {
    me.getViewModel().i18nSet(configuration.languageResources);
  }
  vm.set('bootstrapped', true);
  var envs = vm.getStore('main_environmentStore');
  var aEnvs = configuration.availableEnvironments;
  if (envs) {
    if (aEnvs instanceof Array) {
      envs.getSource().loadData(aEnvs);
    } else {
      envs.getSource().loadData([aEnvs]);
    }
  }
  if (configuration.settings.authenticationType === 'integrated' || configuration.settings.authenticationType === 'cookie' || configuration.settings.authenticationType === 'oauth') {
    ABP.util.Config.setAuthType(configuration.settings.authenticationType);
  } else {
    ABP.util.Logger.logWarn('Unrecognized authenticationType: "' + configuration.authenticationType + '" defaulting to "cookie".');
  }
  if (configuration.headlines) {
    me.processHeadlines(configuration.headlines, true);
  }
  me.fireEvent('container_bootstrap_success');
  if (ABP.util.Msal && ABP.util.Msal.enabled) {
    console.log('TA/DEBUG - ABPMainController - loadBootstrapConfig - me.tokenAuthenticate');
    me.tokenAuthenticate();
    return;
  }
  if (ABP.util.Common.getModern()) {
    if (ABP.util.Config.isDesktop() && configuration && !configuration.supportsDesktop && configuration.desktopUrl && configuration.desktopUrl.trim() !== '') {
      window.location = configuration.desktopUrl;
    } else {
      if (ABP.util.Config.isDesktop() && configuration && !configuration.supportsDesktop) {
        me.redirectTo('nosupport', true);
      } else {
        me.authCheck();
      }
    }
  } else {
    me.authCheck();
  }
}, promptOfflineMode:function(force) {
  var me = this;
  var vm = me.getView().getViewModel();
  if (force) {
    me.setOfflineMode(me, vm);
    return;
  }
  ABP.view.base.popUp.PopUp.showOkCancel('prompt_gooffline_text', 'prompt_gooffline_title', function(result) {
    if (result) {
      me.setOfflineMode(me, vm);
    }
  });
}, promptOnlineMode:function(force) {
  var me = this;
  var vm = me.getView().getViewModel();
  ABP.util.Ajax.request({url:ABP.util.Ajax.getServerUrl() + '/abp/success', method:'GET', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, timeout:4000, success:function(response) {
    if (force) {
      me.setOnlineMode(me, vm);
      return;
    }
    ABP.view.base.popUp.PopUp.showOkCancel('prompt_goonline_text', 'prompt_goonline_title', function(result) {
      if (result) {
        me.setOnlineMode(me, vm);
      } else {
        if (me.offlineCheckTask) {
          me.offlineCheckTask.stop();
        }
      }
    });
  }, failure:function(err) {
    ABP.view.base.popUp.PopUp.showPopup('offline_noconnection', 'error_ok_btn');
  }});
}, handleConnectionStateChange:function(event) {
  var me = this;
  var vm = me.getViewModel();
  var hideHeadline = vm.get('bootstrapConf.hideOfflineHeadline') || false;
  if (event.type === 'offline') {
    vm.set('isOffline', true);
    if (ABP.util.Config.getLoggedIn() === false) {
      vm.set('offlineMode', true);
    }
    me.fireEvent('connectionChange', 'offline');
    if (!hideHeadline) {
      me.fireEvent('container_headlines_show', [{messageKey:'offline_headline_message', uniqueId:'abp_offline_headline', priority:0, single:true}]);
    }
  } else {
    if (event.type === 'online') {
      vm.set('isOffline', false);
      if (ABP.util.Config.getLoggedIn() === false) {
        vm.set('offlineMode', false);
      }
      me.fireEvent('connectionChange', 'online');
      if (!hideHeadline) {
        me.fireEvent('container_headlines_hide', 'abp_offline_headline');
      }
    }
  }
}, setOnlineMode:function(me, vm) {
  if (me.offlineCheckTask) {
    me.offlineCheckTask.stop();
  }
  var passwordPrompt = Ext.create('ABP.view.session.offline.PasswordPrompt', {viewModel:{data:{passwordLabel:vm.get('i18n.offline_password_prompt'), cancelBtnlabel:vm.get('i18n.button_cancel'), okBtnLabel:vm.get('i18n.button_OK')}}});
  passwordPrompt.show();
}, setOfflineMode:function(me, vm) {
  vm.set('offlineMode', true);
  me.fireEvent('container_offline_mode');
  var taskRunner = new Ext.util.TaskRunner;
  me.offlineCheckTask = taskRunner.newTask({run:me.offlineCheck, interval:60 * 1000, scope:me});
  me.offlineCheckTask.start();
  if (ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')) {
    me.loadSessionConfig(Ext.JSON.decode(ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')));
    return;
  }
}, offlineCheck:function() {
  var me = this;
  if (ABP.util.Config.getLoggedIn()) {
    ABP.util.Ajax.request({url:ABP.util.Ajax.getServerUrl() + '/abp/success', method:'GET', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version.major > 9, timeout:4000, success:function(response) {
      me.fireEvent('container_go_online');
    }, failure:function(err) {
    }});
  }
}, loadSessionConfig:function(config) {
  var me = this;
  ABP.util.Config.processSessionConfig(config);
  var pkgItems = ABP.util.Config.getSessionConfig().packages;
  var promises = [];
  me.fireEvent('container_config_processed');
  var vm = me.getViewModel();
  me.verifyProfileImage(config.settings.userConfig.photo);
  if (pkgItems !== undefined && pkgItems.length !== 0) {
    for (var i = 0; i < pkgItems.length; i++) {
      var pkgUrl = pkgItems[i].url;
      var pkgID = pkgItems[i].id;
      if (pkgID == '' || pkgUrl == '') {
        break;
      }
      ABP.util.Config.setPackageURL(pkgUrl);
      var PkgEntry = Ext.util.JSON.decode('{"css":' + true + ', "namespace": "' + pkgID + '" }');
      Ext.manifest.packages[pkgID] = PkgEntry;
      if (!Ext.Package.isLoaded(pkgID)) {
        promises.push(Ext.Package.load(pkgID));
      }
    }
    ABP.util.Config.setPackageURL(null);
  }
  Ext.Promise.all(promises).then(function() {
    me.setupConfiguration(config);
  });
}, offlineAuthenticate:function(jsonData, keepSignedIn) {
  var me = this, vm = me.getView().getViewModel(), offlineAuthType = vm.get('bootstrapConf.offlineAuthenticationType');
  switch(offlineAuthType) {
    case 0:
      if (Ext.isEmpty(ABP.util.LocalStorage.getForUser(jsonData.environment, jsonData.logonId, 'OfflineConfiguration'))) {
        ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
        me.fireEvent('main_hideLoading');
        return;
      }
      break;
    case 1:
      var offlinePasswordHash = ABP.util.LocalStorage.getForUser(jsonData.environment, jsonData.logonId, 'OfflinePassword');
      if (Ext.isEmpty(offlinePasswordHash)) {
        ABP.view.base.popUp.PopUp.showPopup('offline_login_error_noOfflinePassword', 'error_ok_btn');
        me.fireEvent('main_hideLoading');
        return;
      }
      var salt = ABP.util.Sha256.generateSaltForUser(jsonData.logonId, jsonData.environment);
      var enteredPasswordHash = ABP.util.Sha256.sha256(jsonData.password, salt);
      if (enteredPasswordHash !== offlinePasswordHash) {
        ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
        me.fireEvent('main_hideLoading');
        return;
      }
      break;
    case 2:
      var savedPasswordHash = ABP.util.LocalStorage.getForUser(jsonData.environment, jsonData.logonId, 'SavedPasswordHash');
      var salt = ABP.util.Sha256.generateSaltForUser(jsonData.logonId, jsonData.environment);
      var enteredPasswordHash = ABP.util.Sha256.sha256(jsonData.password, salt);
      if (enteredPasswordHash !== savedPasswordHash) {
        ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
        me.fireEvent('main_hideLoading');
        return;
      }
      break;
  }
  vm.set('loginTime', Date.now());
  ABP.util.Config.setUsername(jsonData.logonId);
  ABP.util.Config.setEnvironment(jsonData.environment);
  me.fireEvent('main_doConfiguration', jsonData && jsonData.locale ? jsonData.locale : vm.get('selected.language'));
  me.fireEvent('main_hideLoading');
  return;
}, pendingChangesToggle:function(pendingChanges) {
  var me = this, vm = me.getViewModel();
  vm.set('pendingChanges', pendingChanges);
}, processFormatting:function(formatting) {
  if (formatting.monthNames) {
    Ext.Date.monthNames = formatting.monthNames;
  }
  if (formatting.dayNames) {
    Ext.Date.dayNames = formatting.dayNames;
  }
  if (formatting.decimalSeparator) {
  }
  if (formatting.thousandSeparator) {
  }
}, processSenchaStrings:function() {
  var me = this;
  var vm = me.getViewModel();
  var i18n = vm.getData().i18n;
  Ext.Msg.buttonText = {ok:i18n.s_window_messageBox_buttonText_ok, cancel:i18n.s_window_messageBox_buttonText_cancel, yes:i18n.s_window_messageBox_buttonText_yes, no:i18n.s_window_messageBox_buttonText_no};
  if (ABP.util.Common.getClassic()) {
    Ext.form.field.VTypes.emailText = i18n.s_field_vTypes_emailText;
    Ext.form.field.VTypes.urlText = i18n.s_field_vTypes_urlText;
    Ext.form.field.VTypes.alphaText = i18n.s_field_vTypes_alphaText;
    Ext.form.field.VTypes.alphanumText = i18n.s_field_vTypes_alphanumText;
  }
}, onUpdateUserProfile:function(profile) {
  this.verifyProfileImage(profile.image);
}, verifyProfileImage:function(url) {
  var vm = this.getViewModel();
  if (!url) {
    vm.set('profilePhoto', null);
    return;
  }
  var img = new Image;
  img.onerror = function() {
    vm.set('profilePhoto', null);
  };
  img.onload = function() {
    vm.set('profilePhoto', url);
    ABP.util.LocalStorage.setForLoggedInUser('Photo', url);
  };
  img.src = url;
}}, activeAppFocus:function() {
  var activeApp = this.activeAppId;
  if (activeApp) {
    this.fireAppEvent(activeApp, 'setFocus', null, false);
  }
}, loadApplicationServices:function() {
  var me = this;
  var appSettingsStore = Ext.data.StoreManager.lookup('ABPApplicationServicesStore');
  if (appSettingsStore) {
    appSettingsStore.load({scope:me, callback:function(records, operation, success) {
      if (!success) {
        ABPLogger.logDebug('Failed to load application settings store.');
      } else {
        ABPLogger.logDebug('Loaded application settings store with ' + records.length + ' services.');
      }
    }});
  }
}, afterLoginSuccess:function() {
  var me = this;
  var servicesStore = Ext.data.StoreManager.lookup('ABPApplicationServicesStore');
  if (servicesStore.isLoading()) {
    servicesStore.on('load', this.afterLoginSuccess, me);
  } else {
    servicesStore.un('load', this.afterLoginSuccess, me);
    if (servicesStore.getCount() > 0) {
      servicesStore.each(function(service) {
        ABPServiceManager.registerService(service.getData());
      });
    }
  }
}, reconstructUserSessionObject:function() {
  return {logonId:ABP.util.LocalStorage.get('SavedUsername'), environment:ABP.util.LocalStorage.get('SavedEnvironment'), locale:ABP.util.LocalStorage.get('SavedLanguage'), forceLogin:false};
}});
Ext.define('ABP.view.main.ABPMainModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abpmainmodel', stores:{main_environmentStore:'ABPEnvironmentStore'}, data:{bootstrapConf:{settings:{extraSettingsFields:null}}, bootstrapped:false, conf:{}, forcePasswordChange:{}, prebootstrapExtraSettingsField:{}, prebootstrapExtraSettingsFilled:[], configurationExtraInfo:[], loginExtraFieldsFilled:[], startingLaunchCarouselTab:null, allowAutoShowSelectUser:true, loginAsUser:null, ieTested:false, startingTheme:'', 
offlineMode:false, isOffline:false, hidePreAuthMessage:false, servicesAttempted:false, b2cAuth:null, i18n:{about_applications:'Applications', about_info:'ABP featured applications to offer you appropriate and effective solutions', about_build:'Build: ', about_detail:'more...', about_thirdparty:'Third-Party Attributions', about_title:'About', about_version:'Version:', cardSearch_all:'All', cardSearch_next:'pull\x3cbr\x3eto load\x3cbr\x3emore\x3cbr\x3e', cardSearch_noConfig:'Global Search not configured.  Please consult Admin.', 
cardSearch_noResults:'returned no results', cardSearch_previous:'pull\x3cbr\x3eto load\x3cbr\x3eprevious\x3cbr\x3e', cardSearch_title:'Global Search', error_cancel_btn:'Cancel', error_connection_failed:'Connection Failed', error_connection_instructions:'Please enter a valid url, then hit save.', error_no_btn:'No', error_ok_btn:'OK', error_timedout:'Your request has timed out.  Please try again.', error_yes_btn:'Yes', error_download_failed:'Download Failed', error_upload_failed:'Upload Failed', error_download_failed_fileNotFound:'Unable to download the request file as it can not be found on the server.', 
help_all_products:'All Products', help_allTypes:'All Help Links', help_allProducts:'All Products', help_blocked_Text:'The browser has blocked the following link from being opened. Please click on the link below to open it.', help_blocked_Title:'Show Link', help_text:'Our solutions, services, and support deliver the competitive edge your business needs to succeed today and tomorrow. With our wide array of comprehensive support services, we can quickly and accurately answer your technical questions and keep your business moving forward.', 
help_title:'Help', loading_mask_message:'', load_apply_config:'Applying Configuration', load_authenticating:'Authenticating', load_discovering:'Discovering', load_authCheck:'Checking Authorization', load_extraAuthStep:'', load_load_config:'Loading Configuration', load_log:'Logging In', logger_clear:'Clear Logs', logger_clear_confirmation:'Are you sure you want to clear all logs?', logger_level:'Level', logger_filter:'Filter', logger_nothingtodisplay:'No log items to display.', logger_title:'Logs', 
login_all_fields:'Please fill in all fields', login_back:'Back', login_dockNavigation:'Dock Navigation Menu', login_environment:'Environment', login_error_authFailure:'Authentication Failed', login_error_configFailure:'Configuration Failed', login_error_languageFailure:'Language Configuration Failed', login_error_passwordExpired:'Password has expired. Please contact your system administrator.', login_extraValue:'value not within acceptable range', login_forcepw_back:'Back', login_forcepw_confirmPassword:'Re-enter Password', 
login_forcepw_instructions:'Please enter your new password before signing in.', login_forcepw_newPassword:'New Password', login_forcepw_signIn:'Sign In', login_forcepw_title:'New Password', login_forceLogin:'Force Login', login_forgotpassword:'Forgot your password?', login_keepMeSignedIn:'Keep me signed in', login_language:'Language', login_password:'Password', login_recoverInstructions:'Please enter your email address and choose the environment to reset your password.', login_recoverTitle:'Recover Password', 
login_recover_back:'Back', login_recover_enterNewPassword:'Please enter a new password and confirm by re-entering it.', login_recover_failed:'Password recovery failed', login_recover_id:'Email Address', login_recover_passwordsDoNotMatch:'Passwords do not match. Try again.', login_recover_passwordChangeFailed:'Password change failed', login_recover_send:'Send', login_recover_invalid_email:'Email Address should be in the format "user@example.com"', login_recover_submit_success:'Please check your email for further instructions.', 
login_save:'Save', login_settingsInstructions:'Please enter your server address in the field below. If you do not have this information, please contact your IT administrator.', login_settings_invalidurl:'Please enter a valid server url', login_settingsTitle:'Settings', login_settingsUrlList:'Select a URL', login_login_header:'Login', login_signin_btn:'Sign In', login_url:'URL', login_previousUrls:'Other URLs', login_organization:'Organization', login_email:'Email', login_emailOrOrganisation:'Email / Organisation', 
login_SSOHelp:'Enter your Email or Organisation', login_username:'Username', login_selectUserTitle:'Select Account', login_selectUserInstructions:'Select an account or sign in with another one.', login_selectUserAnotherUser:'Use another account', navMenu_navigation:'Navigation', navMenu_searchbar_emptytext:'Search', navMenu_home:'Home', navMenu_favorites:'Favorites', navMenu_recent:'Recent', navMenu_suggested:'Suggested', navMenu_swapView:'Swap to ', reload_warning:'Reloading this page will cause you to sign out and lose any unsaved data.', 
search_searchText:'Search in', search_advanced:'Advanced', search_apply:'Apply', search_resultsPlaceholder:'Search for items, data, and other collateral here.', search_type:'Search Type', search_toggle:'Toggle Search', selectfield_mobile_done:'Done', sessionMenu_about:'About', sessionMenu_calendar:'Calendar', sessionMenu_chart:'Charts', sessionMenu_clipboard:'Clipboard', sessionMenu_environment:'Environment: ', sessionMenu_help:'Help', sessionMenu_languages:'Language', sessionMenu_logger:'Log', sessionMenu_search:'Search', 
sessionMenu_settings:'Settings', sessionMenu_url:'URLs', sessionMenu_signoff:'Sign Off', sessionMenu_theme:'Theme', sessionMenu_time:'Session Time: ', sessionMenu_user:'User: ', sessionMenu_editPreferences:'Edit Preferences', settingsCanvas_close:'Close', settings_internalLinks:'Internal Links', settings_languages:'Languages', settings_userInfo:'User Information', signout_message:'Signing out...', warn_ie9:'Url must have the same hostname as webpage when using Internet Explorer 9.', inactive_timeout:'You are about to be logged out due to inactivity: ', 
timeout_title:'Session Expiration Warning', session_timeout:'Session expired due to inactivity', session_signoff:'Sign Out', session_retain:'Keep me signed in', ac_widget_picker_default_group_title:'Widgets', ac_switch_dashboard:'Switch Dashboard', button_close:'Close', button_OK:'OK', button_save:'Save', button_cancel:'Cancel', button_yes:'Yes', button_no:'No', button_clear:'Clear', button_done:'Done', button_search:'Search', button_back:'Back', button_next:'Next', button_continue:'Continue', button_delete:'Delete', 
button_favorite:'Favorite', button_unfavorite:'Unfavorite', button_nextTheme:'Next Theme', button_prevTheme:'Previous Theme', sessionMenu_manageFavorites:'Manage Favorites', favorites_title:'Favorites', favorites_expandAll:'Expand All', favorites_collapseAll:'Collapse All', favorites_newGroup:'New Group', favorites_newGroup_emptyText:'Create New Group', favorites_toast_deleteEmptyGroups:'Removed empty favorite groups', favorites_confirmDeleteGroupMsg:'Are you sure you want to delete this group and all of its contents?', 
favorites_confirmDeleteGroupTitle:'Delete this favorite group?', favorites_editPanel_title:'Edit Favorite', favorites_editPanel_name:'Name', favorites_editPanel_source:'Source', favorites_editPanel_moveToGroup:'Move to group', favorites_editPanel_noGroup:'\x3c No Group \x3e', favorites_manager_emptyGroup:'This group is empty.', toolbar_toggleNavigation:'Toggle Navigation', toolbar_search_navigation:'Search Navigation', toolbar_jumpTo:'Jump to', toolbar_placeinapplication:'Place in application', abp_navigation_menu:'Navigation Menu', 
abp_main_content:'Main Content', sessionMenu_manageHeadlines:'Manage Headlines', headlines_title:'Headlines', headlines_new:'New Headline', headlines_column_message:'Message', headlines_label_message:'Message', headlines_column_message_key:'Message key', headlines_label_message_key:'Message key', headlines_column_action:'Action text', headlines_label_action:'Action text', headlines_column_action_key:'Action key', headlines_label_action_key:'Action key', headlines_column_starttime:'Start time', headlines_label_starttime:'Start time', 
headlines_column_endtime:'End time', headlines_label_endtime:'End time', headlines_column_priority:'Priority', headlines_label_priority:'Priority', headlines_priority_info:'Info', headlines_priority_warning:'Warning', headlines_priority_alert:'Alert', headlines_column_published:'Published', headlines_label_published:'Published', headlines_unsaved_changes:'There are headlines which have not been saved. Close anyway?', headlines_delete:'Do you wish to delete this headline?', field_validation_error_blanktext:'This field is required', 
field_validation_error_maxlengthtext:'The maximum length for this field is {0}', field_validation_error_minlengthtext:'The minimum length for this field is {0}', abp_notifications_button_tooltip:'Notifications', abp_notifications_rightpane_title:'Notifications', abp_notifications_label_no_notifications:'No notifications.', abp_notifications_label_no_new_notifications:'No new notifications.', abp_notifications_label_show_history:'Show History', abp_notifications_label_hide_history:'Hide History', 
abp_notifications_label_see_history:'See History', abp_notifications_label_read:'Read', abp_notifications_label_marked_as_read:'Marked as Read', abp_notifications_label_marked_as_unread:'Marked as Unread', abp_notifications_label_removed:'Notification Removed', abp_time_prefix_ago:'', abp_time_suffix_ago:'ago', abp_time_prefix_from_now:'', abp_time_suffix_from_now:'from now', abp_time_seconds:'less than a minute', abp_time_minute:'about a minute', abp_time_minutes:'about {0} minutes', abp_time_hour:'about an hour', 
abp_time_hours:'about {0} hours', abp_time_day:'about a day', abp_time_days:'about {0} days', abp_time_month:'about a month', abp_time_months:'about {0} months', abp_time_year:'about a year', abp_time_years:'about {0} years', abp_short_time_prefix_ago:'', abp_short_time_suffix_ago:'ago', abp_short_time_prefix_from_now:'', abp_short_time_suffix_from_now:'from now', abp_short_time_seconds:'few seconds', abp_short_time_minute:'1 min', abp_short_time_minutes:'{0} mins', abp_short_time_hour:'1 hour', 
abp_short_time_hours:'{0} hours', abp_short_time_day:'1 day', abp_short_time_days:'{0} days', abp_short_time_month:'1 month', abp_short_time_months:'{0} months', abp_short_time_year:'1 year', abp_short_time_years:'{0} years', login_offline_signin_btn:'Offline Sign In', offline_login_instructions:'Please enter an offline password. Use this password to log in while offline. This value is required for offline mode and should differ from your normal login password.', offline_login_password:'Offline Password', 
offline_login_confirmpassword:'Confirm Offline Password', offline_password_prompt:'Enter password', offline_passwords_dont_match:'Passwords do not match', offline_login_error_noOfflinePassword:'Authentication Failed. No offline password exists for this user and environment.', sessionMenu_setOfflinePassword:'Set Offline Password', button_switch_online_mode:'Go Online', button_switch_offline_mode:'Go Offline', prompt_gooffline_text:'Go Offline? Any unsaved data will be lost.', prompt_gooffline_title:'Switch to offline', 
prompt_goonline_text:'Go Online? Any unsaved data will be lost.', prompt_goonline_title:'Switch to online.', offline_passwordPrompt_failure:'Authentication failed, could not go online.', offline_promptpassword_title:'Enter password to go online', offline_noconnection:'Cannot go online, no connection to server.', offline_headline_message:'No connection to the Internet.', abp_filter_empty_text:'Filter...', s_dataValidator_bound_emptyMessage:'Must be present', s_dataValidator_bound_minOnlyMessage:'Value must be greater than {0}', 
s_dataValidator_bound_maxOnlyMessage:'Value must be less than {0}', s_dataValidator_bound_bothMessage:'Value must be between {0} and {1}', s_dataValidator_email_message:'Is not a valid email address', s_dataValidator_exclusion_message:'Is a value that has been excluded', s_dataValidator_ipaddress_message:'Is not a valid IP address', s_dataValidator_format_message:'Is in the wrong format', s_dataValidator_inclusion_message:'Is not in the list of acceptable values', s_dataValidator_length_minOnlyMessage:'Length must be at least {0}', 
s_dataValidator_length_maxOnlyMessage:'Length must be no more than {0}', s_dataValidator_length_bothMessage:'Length must be between {0} and {1}', s_dataValidator_number_message:'Is not a valid number', s_dataValidator_presence_message:'Must be present', s_dataValidator_range_minOnlyMessage:'Must be must be at least {0}', s_dataValidator_range_maxOnlyMessage:'Must be no more than than {0}', s_dataValidator_range_bothMessage:'Must be between {0} and {1}', s_dataValidator_range_nanMessage:'Must be numeric', 
s_grid_plugin_dragText:'{0} selected row{1}', s_abstractView_loading:'Loading...', s_tab_closeText:'Close', s_field_invalidText:'The value in this field is invalid', s_abstractView_loadingText:'Loading...', s_picker_date_todayText:'Today', s_picker_date_nowText:'Now', s_picker_date_minText:'This date is before the minimum date', s_picker_date_maxText:'This date is after the maximum date', s_picker_date_disabledDaysText:'Disabled', s_picker_date_disabledDatesText:'Disabled', s_picker_date_nextText:'Next Month (Control+Right)', 
s_picker_date_prevText:'Previous Month (Control+Left)', s_picker_date_monthYearText:'Choose a month (Control+Up/Down to move years)', s_picker_date_todayTip:'{0} (Spacebar)', s_picker_month_okText:'\x26#160;OK\x26#160;', s_picker_month_cancelText:'Cancel', s_toolbar_paging_beforePageText:'Page', s_toolbar_paging_afterPageText:'of {0}', s_toolbar_paging_firstText:'First Page', s_toolbar_paging_prevText:'Previous Page', s_toolbar_paging_nextText:'Next Page', s_toolbar_paging_lastText:'Last Page', s_toolbar_paging_refreshText:'Refresh', 
s_toolbar_paging_displayMsg:'Displaying {0} - {1} of {2}', s_toolbar_paging_emptyMsg:'No data to display', s_form_basic_waitTitle:'Please Wait...', s_form_field_base_invalidText:'The value in this field is invalid', s_field_text_minLengthText:'The minimum length for this field is {0}', s_field_text_maxLengthText:'The maximum length for this field is {0}', s_field_text_blankText:'This field is required', s_field_text_regexText:'', s_field_number_minText:'The minimum value for this field is {0}', s_field_number_maxText:'The maximum value for this field is {0}', 
s_field_number_nanText:'{0} is not a valid number', s_field_date_disabledDaysText:'Disabled', s_field_date_disabledDatesText:'Disabled', s_field_date_minText:'The date in this field must be after {0}', s_field_date_maxText:'The date in this field must be before {0}', s_field_date_invalidText:'{0} is not a valid date - it must be in the format {1}', s_field_combo_defaultListConfig_loadingText:'Loading...', s_field_vTypes_emailText:'This field should be an e-mail address in the format "user@example.com"', 
s_field_vTypes_urlText:'This field should be a URL in the format "http:/" + "/www.example.com"', s_field_vTypes_alphaText:'This field should only contain letters and _', s_field_vTypes_alphanumText:'This field should only contain letters, numbers and _', s_field_htmlEditor_createLinkText:'Please enter the URL for the link:', s_field_htmlEditor_buttonTips_bold_title:'Bold (Ctrl+B)', s_field_htmlEditor_buttonTips_bold_text:'Make the selected text bold.', s_field_htmlEditor_buttonTips_italic_title:'Italic (Ctrl+I)', 
s_field_htmlEditor_buttonTips_italic_text:'Make the selected text italic.', s_field_htmlEditor_buttonTips_underline_title:'Underline (Ctrl+U)', s_field_htmlEditor_buttonTips_underline_text:'Underline the selected text.', s_field_htmlEditor_buttonTips_increasefontsize_title:'Grow Text', s_field_htmlEditor_buttonTips_increasefontsize_text:'Increase the font size.', s_field_htmlEditor_buttonTips_decreasefontsize_title:'Shrink Text', s_field_htmlEditor_buttonTips_decreasefontsize_text:'Decrease the font size.', 
s_field_htmlEditor_buttonTips_backcolor_title:'Text Highlight Color', s_field_htmlEditor_buttonTips_backcolor_text:'Change the background color of the selected text.', s_field_htmlEditor_buttonTips_forecolor_title:'Font Color', s_field_htmlEditor_buttonTips_forecolor_text:'Change the color of the selected text.', s_field_htmlEditor_buttonTips_justifyleft_title:'Align Text Left', s_field_htmlEditor_buttonTips_justifyleft_text:'Align text to the left.', s_field_htmlEditor_buttonTips_justifycenter_title:'Center Text', 
s_field_htmlEditor_buttonTips_justifycenter_text:'Center text in the editor.', s_field_htmlEditor_buttonTips_justifyright_title:'Align Text Right', s_field_htmlEditor_buttonTips_justifyright_text:'Align text to the right.', s_field_htmlEditor_buttonTips_insertunorderedlist_title:'Bullet List', s_field_htmlEditor_buttonTips_insertunorderedlist_text:'Start a bulleted list.', s_field_htmlEditor_buttonTips_insertorderedlist_title:'Numbered List', s_field_htmlEditor_buttonTips_insertorderedlist_text:'Start a numbered list.', 
s_field_htmlEditor_buttonTips_createlink_title:'Hyperlink', s_field_htmlEditor_buttonTips_createlink_text:'Make the selected text a hyperlink.', s_field_htmlEditor_buttonTips_sourceedit_title:'Source Edit', s_field_htmlEditor_buttonTips_sourceedit_text:'Switch to source editing mode.', s_grid_header_sortAscText:'Sort Ascending', s_grid_header_sortDescText:'Sort Descending', s_grid_header_lockText:'Lock', s_grid_header_unlockText:'Unlock', s_grid_header_columnsText:'Columns', s_grid_groupingFeature_groupByText:'Group by this field', 
s_grid_groupingFeature_showGroupsText:'Show in Groups', s_grid_propertyColumnModel_nameText:'Name', s_grid_propertyColumnModel_valueText:'Value', s_grid_propertyColumnModel_trueText:'true', s_grid_propertyColumnModel_falseText:'false', s_grid_booleanColumn_trueText:'true', s_grid_booleanColumn_falseText:'false', s_grid_booleanColumn_undefinedText:'\x26#160;', s_field_time_minText:'The time in this field must be equal to or after {0}', s_field_time_maxText:'The time in this field must be equal to or before {0}', 
s_field_time_invalidText:'{0} is not a valid time', s_field_checkboxGroup_blankText:'You must select at least one item in this group', s_field_radioGroup_blankText:'You must select one item in this group', s_window_messageBox_buttonText_ok:'OK', s_window_messageBox_buttonText_cancel:'Cancel', s_window_messageBox_buttonText_yes:'Yes', s_window_messageBox_buttonText_no:'No', s_grid_filters_menuFilterText:'Filters', s_grid_filters_boolean_yesText:'Yes', s_grid_filters_boolean_noText:'No', s_grid_filters_date_fields_lt:'Before', 
s_grid_filters_date_fields_gt:'After', s_grid_filters_date_fields_eq:'On', s_grid_filters_list_loadingText:'Loading...', s_grid_filters_number_emptyText:'Enter Number...', s_grid_filters_string_emptyText:'Enter Filter Text...', s_multiSelectorSearch_searchText:'Search...', s_multiSelector_emptyText:'Nothing selected', s_multiSelector_removeRowTip:'Remove this item', s_multiSelector_addToolText:'Search for items to add', aria_tree_level:' level ', aria_badge_count:' count ', aria_badge_updated_count:' updated count '}, 
formatting:{monthNames:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], dayNames:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], decimalSeparator:'.', thousandSeparator:',', currencySign:'$', dateFormat:'m-d-Y'}, injectedSettingsFields:null, keepMeSignedIn:false, loginTime:'', smallScreenThreshold:640, menuDocked:false, name:'ABP', selected:{environment:'', language:''}, signout:false, signoutReason:'', 
smallScreen:false, profilePhoto:''}, checkI18n:function(inString, disableWarning) {
  var me = this;
  var outString = inString;
  if (me.config.data.i18n[inString] != undefined) {
    outString = me.config.data.i18n[inString];
  } else {
    if (!disableWarning) {
      ABP.util.Logger.logInfo("i18n: '" + inString + "' was not found.");
    }
  }
  return outString;
}, i18nSet:function(strings) {
  var me = this;
  var i;
  if (!strings) {
    return;
  }
  var i18n = me.get('i18n');
  if (strings instanceof Array && strings.length > 0) {
    for (i = 0; i < strings.length; ++i) {
      if (strings[i] && strings[i].key && strings[i].value) {
        i18n[strings[i].key] = strings[i].value;
      }
    }
  }
  me.set('i18n', i18n);
}, i18nSetDefaults:function(strings) {
  var me = this;
  var st;
  if (!strings) {
    return;
  }
  var i18n = me.get('i18n');
  if (strings instanceof Object) {
    for (st in strings) {
      if (strings.hasOwnProperty(st)) {
        if (!i18n[st]) {
          i18n[st] = strings[st];
        }
      }
    }
  }
  me.set('i18n', i18n);
}});
Ext.define('ABP.view.session.SessionBannerController', {extend:'Ext.app.ViewController', alias:'controller.sessionbannercontroller', listen:{controller:{'*':{abp_headlines_show:'showHeadlines', abp_headlines_hide:'hideHeadline'}}, component:{'headline':{headline_action:'actionHeadline', headline_read:'readHeadline'}}}, init:function() {
  var me = this;
  me.callParent(arguments);
  var config = ABP.util.Config.getBootstrapConfig();
  if (config && config.headlines) {
    me.fireEvent('main_processHeadlines', config.headlines, true);
  }
}, showHeadlines:function(headlines) {
  var me = this, view = me.getView(), headline, headlineComps = [], length = headlines.length;
  for (var i = 0; i < length; i++) {
    headline = headlines[i];
    headlineComps.push({xtype:'headline', single:!!headline.single, uniqueId:headline.uniqueId, message:headline.message, messageKey:headline.messageKey, priority:headline.priority, actionText:headline.actionText, actionTextKey:headline.actionTextKey});
  }
  if (length > 0) {
    view.insert(0, headlineComps);
  }
}, hideHeadline:function(uniqueId) {
  var me = this;
  var view = me.getView();
  if (view.items && view.items.length === 1) {
    var headline = view.items.getAt(0);
    if (headline.uniqueId === uniqueId) {
      view.remove(headline);
    }
  }
}, actionHeadline:function(headline) {
  var uniqueId = headline.uniqueId;
  this.fireEvent('headline_action', uniqueId);
}, readHeadline:function(headline) {
  var uniqueId = headline.uniqueId, single = headline.single;
  if (!single) {
    if (ABP.util.Config.getLoggedIn()) {
      ABP.util.LocalStorage.setForLoggedInUser('hr-' + uniqueId, true);
    } else {
      ABP.util.LocalStorage.set('hr-' + uniqueId, true);
    }
  }
  this.fireEvent('headline_read', uniqueId);
}});
Ext.define('ABP.view.session.SessionBanner', {extend:'Ext.Container', requires:['ABP.view.session.SessionBannerController'], dock:'top', xtype:'sessionbanner', controller:'sessionbannercontroller', layout:'fit', cls:'session-banner', ariaRole:'banner'});
Ext.define('ABP.view.session.mainMenu.MenuMask', {extend:'Ext.Component', alias:'widget.menumask', itemId:'menu-mask', top:0, left:0, right:0, bottom:0, fullScreen:true, cls:'menumask', hidden:true, initialize:function() {
  this.el.dom.onclick = this.clickHandler;
}, clickHandler:function(mEvent) {
  var me = Ext.getCmp(this.id);
  me.up('sessioncanvas').getController().closeMenu();
}});
Ext.define('ABP.view.session.SessionCanvasController', {extend:'Ext.app.ViewController', alias:'controller.sessioncanvascontroller', requires:['ABP.util.Logger', 'ABP.view.session.mainMenu.MenuMask'], listen:{controller:{'*':{session_configurationUpdated:'syncConfig', session_toggleMenu:'toggleMenu', session_closeMenu:'closeMenu', session_openMenu:'openMenu', session_toggleRightPane:'toggleRightPane', session_closeRightPane:'closeRightPane', searchDrop_storeLoad:'__loadStore'}}, component:{'#searchbarTypeButton':{searchDrop_setSearch:'__setSearch'}}}, 
init:function() {
  if (Ext.toolkit === 'modern') {
    var me = this;
    var view = me.getView();
    view.el.dom.onclick = me.onClick.bind(this);
  }
}, onClick:function(e) {
  var me = this;
  me.fireEvent('session_click', e);
}, syncConfig:function() {
  ABP.util.Logger.logInfo('Configuration updated! Syncing with model...');
}, toggleMenu:function() {
  var me = this;
  var vm = me.getViewModel();
  var view = me.getView();
  var rightPane = view.down('#rightPane');
  var menuButton = view.down('#toolbar-button-menu');
  var open = vm.get('menuOpen');
  var classic = ABP.util.Common.getClassic();
  var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;
  var classicMenuExpand = view.up().down('mainmenu').getViewModel().get('classicMenuExpand');
  if (classic) {
    me.fireEvent('mainMenu_classicToggle');
    if (menuButton) {
      if (classicMenuExpand) {
        menuButton.removeCls('toolbar-toggled');
      } else {
        menuButton.addCls('toolbar-toggled');
        me.focusSearch();
      }
    }
    menuButton.setAriaExpanded(!classicMenuExpand);
  } else {
    if (open) {
      vm.set('menuOpen', !open);
      if (rememberState) {
        ABP.util.LocalStorage.set('mmStateOpen', !open);
      }
      view.closeMenu();
    } else {
      vm.set('menuOpen', !open);
      if (rememberState) {
        ABP.util.LocalStorage.set('mmStateOpen', !open);
      }
      view.openMenu();
      if (ABP.util.Common.getSmallScreen() === true && Ext.toolkit === 'modern') {
        this.closeRightPane();
      }
    }
  }
}, focusSearch:function() {
  var focusConfig = ABP.util.Config.getSessionConfig().settings.enableSearch;
  if (focusConfig === true) {
    var me = this;
    var menu = me.lookupReference('mainMenu');
    var container = menu.lookupReference('abpNavSearchCont');
    var textfield = container.getComponent('navSearchField');
    textfield.focus();
  }
}, openMenu:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var menu = view.down('#mainMenu');
  var menuButton = view.down('#toolbar-button-menu');
  var classic = ABP.util.Common.getClassic();
  if (classic) {
    me.fireEvent('mainMenu_classicOpen');
  } else {
    if (menu && vm) {
      menu.show();
      vm.set('menuOpen', true);
      if (menuButton) {
        menuButton.addCls('toolbar-toggled');
      }
      view.setMasked({xtype:'menumask'});
    }
  }
}, maskForMenu:function() {
  this.getView().setMasked({xtype:'menumask'});
}, closeMenu:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var menu = view.down('#mainMenu');
  var menuButton = view.down('#toolbar-button-menu');
  var classic = ABP.util.Common.getClassic();
  var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;
  if (menuButton) {
    menuButton.removeCls('toolbar-toggled');
  }
  if (classic) {
    me.fireEvent('mainMenu_classicClose');
  } else {
    if (menu && vm) {
      menu.hide();
      vm.set('menuOpen', false);
      view.setMasked(false);
    }
  }
}, toggleRightPane:function() {
  var me = this;
  var vm = me.getViewModel();
  var open = vm.get('rightPaneOpen');
  if (open) {
    me.closeRightPane();
  } else {
    me.openRightPane();
  }
}, openRightPane:function() {
  if (ABP.util.Common.getSmallScreen() === true && Ext.toolkit === 'modern') {
    this.closeMenu();
  }
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var rightPane = view.down('#rightPane');
  var menuButton = view.down('#rpButton');
  if (rightPane && vm) {
    rightPane.show();
    vm.set('rightPaneOpen', true);
    if (menuButton) {
      menuButton.addCls('toolbar-toggled');
      menuButton.addCls('toolbar-button-pressed');
    } else {
      if (Ext.toolkit === 'classic') {
        var activeTab = rightPane.getActiveTab();
        if (activeTab) {
          me.fireEvent('toolbar_addPressedCls', activeTab.unqiueId);
        }
      }
    }
    if (ABP.util.Common.getKeyboardNavigation()) {
      rightPane.applyFocus();
    }
  }
}, closeRightPane:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var rightPane = view.down('#rightPane');
  var menuButton = view.down('#rpButton');
  var rightPaneButtons = view.lookupReference('rightpaneButtons') || view.down('#rightpaneButtons');
  if (rightPane && vm) {
    rightPane.hide();
    vm.set('rightPaneOpen', false);
    if (menuButton) {
      menuButton.removeCls('toolbar-toggled');
      menuButton.removeCls('toolbar-button-pressed');
    }
    if (rightPaneButtons) {
      rightPaneButtons = rightPaneButtons.items.items;
      rightPaneButtons.forEach(function(value) {
        if (value.pressed) {
          value.setPressed(false);
        }
      });
    }
  }
}, __loadStore:function(settings) {
  var me = this;
  var view = me.getView();
  var searchDrop;
  var topContainer;
  var vm;
  var store;
  if (settings.enableSearch && settings.searchInfo) {
    vm = me.getViewModel();
    store = vm.getStore('searchProviders');
    try {
      store.loadData(settings.searchInfo);
      if (ABP.util.Common.getClassic()) {
        me.__constructSearchOptionsMenu(settings.searchInfo, settings.defaultSearch);
      } else {
        me.fireEvent('searchPane_setupSearch', settings);
      }
    } catch (e$7) {
      ABP.util.Logger.logError('search info failed to load into searchProviders store', e$7);
    }
  } else {
    searchDrop = view.down('#searchbarContainer');
    if (searchDrop) {
      topContainer = view.down('#topContainer');
      if (topContainer) {
        topContainer.remove(searchDrop);
      }
    }
  }
}, __constructSearchOptionsMenu:function(searchInfo, defaultSearch) {
  var me = this;
  var menu = [];
  var i = 0;
  var iconString = '';
  var found = false;
  for (i = 0; i < searchInfo.length; ++i) {
    if (searchInfo[i].icon) {
      iconString = me.__makeIconString(searchInfo[i].icon);
    } else {
      iconString = null;
    }
    menu.push({text:searchInfo[i].name, iconCls:iconString, cls:'a-searchtype-' + searchInfo[i].id, searchId:searchInfo[i].id, listeners:{click:'onProviderClick'}});
  }
  me.getViewModel().set('searchBar.menuOptions', menu);
  if (defaultSearch && defaultSearch !== '') {
    for (i = 0; i < menu.length; i++) {
      if (defaultSearch === menu[i].searchId || defaultSearch === menu[i].text) {
        me.__setSearch(menu[i]);
        found = true;
        break;
      }
    }
  }
  if (!found && Ext.isArray(menu) && menu.length > 0) {
    me.__setSearch(menu[0]);
  }
}, __constructSearchOptions:function(searchInfo, defaultSearch) {
  var me = this;
  var i = 0;
  var found = false;
  if (defaultSearch && defaultSearch !== '') {
    for (i = 0; i < searchInfo.length; ++i) {
      if (defaultSearch === searchInfo[i].id || defaultSearch === searchInfo[i].name) {
        me.__setSearch({searchId:searchInfo[i].id, iconCls:me.__makeIconString(searchInfo[i].icon)});
        found = true;
        break;
      }
    }
    if (!found) {
      me.__setSearch({searchId:searchInfo[0].id, iconCls:me.__makeIconString(searchInfo[0].icon)});
    }
  } else {
    me.__setSearch({searchId:searchInfo[0].id, iconCls:me.__makeIconString(searchInfo[0].icon)});
  }
}, __makeIconString:function(icon) {
  var ret = icon;
  var font = icon;
  font = font.split('-');
  ret = font[0] === 'fa' ? 'x-fa ' + icon : icon;
  return ret;
}, __setSearch:function(search) {
  var me = this;
  var vm = me.getViewModel();
  vm.set('searchBar.selectedSearch', search.searchId);
  vm.set('searchBar.selectedSearchCls', search.iconCls);
}});
Ext.define('ABP.view.session.SessionCanvasModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.sessioncanvasmodel', requires:['ABP.store.ABPRecentSearchStore'], data:{menuOpen:false, rightPaneOpen:false, rightPaneTabs:[], searchBar:{Open:false, menuOptions:[], selectedSearchCls:'icon-earth', selectedSearch:'global', val:''}}, stores:{searchProviders:{storeId:'searchStore', model:'ABP.model.SearchModel'}}});
Ext.define('ABP.view.session.about.AboutController', {extend:'Ext.app.ViewController', alias:'controller.about', init:function() {
  var view = this.getView();
  var aboutInfo = ABP.util.PluginManager.getMergedPluginConfigs('aboutInfo');
  Ext.each(aboutInfo, function(info) {
    info.xtype = 'aboutitem';
    info.showIcon = true;
  });
  view.down('#aboutAppsList').add(aboutInfo);
  var thirdPartyAttributions = ABP.util.PluginManager.getMergedPluginConfigs('thirdPartyAttributions');
  thirdPartyAttributions = this.checkForDuplicates(thirdPartyAttributions);
  Ext.each(thirdPartyAttributions, function(info) {
    info.xtype = 'aboutitem';
  });
  if (thirdPartyAttributions.length === 0) {
    view.down('#aboutThirdPartySection').hide();
  } else {
    view.down('#aboutThirdPartyList').add(thirdPartyAttributions);
  }
}, checkForDuplicates:function(thirdPartyAttributions) {
  var ret = [];
  var i = 0;
  var j = 0;
  var found = false;
  var len = thirdPartyAttributions.length;
  var rem = [];
  var remPush = function(obj) {
    var found = false;
    for (var itt = 0; itt < rem.length; ++itt) {
      if (obj === rem[itt]) {
        found = true;
        break;
      }
    }
    if (!found) {
      rem.push(obj);
    }
  };
  var ret = [];
  if (len < 2) {
    ret = thirdPartyAttributions;
  } else {
    for (i; i < len; ++i) {
      found = false;
      for (j = 0; j < thirdPartyAttributions.length; ++j) {
        if (i !== j) {
          if (thirdPartyAttributions[i].name === thirdPartyAttributions[j].name && thirdPartyAttributions[i].version === thirdPartyAttributions[j].version) {
            found = true;
            if (i < j) {
              remPush(j);
            }
          }
        }
      }
    }
    rem.sort();
    for (i = rem.length - 1; i > -1; --i) {
      thirdPartyAttributions.splice(rem[i], 1);
    }
    ret = thirdPartyAttributions;
  }
  return ret;
}, closeClicked:function() {
  this.fireEvent('featureCanvas_hideSetting');
}});
Ext.define('ABP.view.session.about.AboutViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.about', formulas:{viewPercent:{get:function() {
  var width = Ext.Viewport.getWindowWidth();
  var height = Ext.Viewport.getWindowHeight();
  var ssThresh = this.get('smallScreenThreshold');
  var percent = '60%';
  if (width <= ssThresh || height <= ssThresh) {
    percent = '90%';
  }
  return percent;
}}}});
Ext.define('ABP.view.session.accessibility.JumpToBarViewModel', {extend:'Ext.app.ViewModel', requires:['ABP.model.WCAGRegion'], alias:'viewmodel.jumptobar', stores:{targets:{model:'ABP.model.WCAGRegion', data:[{domId:'NavMenu', text:'Main Menu'}, {domId:'GlobalSearch', text:'Global Search'}, {domId:'UserSettings', text:'User Settings'}, {domId:'MainContent', text:'Main Content'}]}}});
Ext.define('ABP.view.session.accessibility.JumpToBarController', {extend:'Ext.app.ViewController', alias:'controller.jumptobar', requires:['ABP.view.session.accessibility.JumpToBarViewModel', 'ABP.model.WCAGRegion'], listen:{controller:{'*':{abp_jumpto_show:'showJumpTo', rightpane_tabadded:'onRightPaneTabAdded', afteraddlanguagestrings:'onAfterAddLangaugeStrings'}}, store:{'#searchStore':{datachanged:'onSearchStoreChanged'}, '#navTree':{datachanged:'onNavMenuChanged'}}}, initViewModel:function(vm) {
  var jumpToTargets = [{id:'MainContent', text:ABP.util.Common.geti18nString('abp_main_content')}, {id:'NavMenu', text:ABP.util.Common.geti18nString('abp_navigation_menu')}];
  var config = ABP.util.Config.getSessionConfig();
  if (config.settings.enableMenuFavorites) {
    jumpToTargets.push({id:'NavMenu-Favourites', text:ABP.util.Common.geti18nString('navMenu_favorites')});
  }
  if (config.settings.enableMenuRecent) {
    jumpToTargets.push({id:'NavMenu-Recents', text:ABP.util.Common.geti18nString('navMenu_recent')});
  }
  jumpToTargets.push({id:'UserSettings', text:ABP.util.Common.geti18nString('sessionMenu_settings')});
  var tabs = ABP.util.Config.getRightPaneTabs();
  Ext.each(tabs, function(i) {
    if (i.hidden) {
      return;
    }
    var text = i.tooltip;
    if (i.tooltipKey) {
      text = ABP.util.Common.geti18nString(i.tooltipKey);
    }
    jumpToTargets.push({id:'RightPane' + i.uniqueId, context:i.uniqueId, text:text});
  });
  vm.storeInfo.targets.loadData(jumpToTargets);
  Ext.data.StoreManager.on('add', function(i, s, id) {
    console.log('Store Added: ' + id);
  });
}, onRightPaneTabAdded:function(id, tab) {
  if (id === 'rightPaneTab_abp-search' || id === 'abp-settings') {
    return;
  }
  if (tab.hidden) {
    return;
  }
  var me = this, vm = me.getViewModel();
  var text = tab.tooltip;
  if (tab.tooltipKey) {
    text = ABP.util.Common.geti18nString(tab.tooltipKey);
  }
  var target = {id:'RightPane' + id, context:id, text:text, textKey:tab.tooltipKey};
  vm.storeInfo.targets.loadData([target], true);
}, onAfterAddLangaugeStrings:function() {
  var me = this, vm = me.getViewModel();
  vm.storeInfo.targets.each(function(data) {
    var textKey = data.get('textKey');
    if (textKey) {
      data.set('text', ABP.util.Common.geti18nString(textKey));
    }
  });
}, onSelection:function(cmp, region) {
  var me = this;
  var id = region.get('id');
  if (Ext.String.startsWith(id, 'GlobalSearch')) {
    me.fireEvent('abp_searchBar_toggleKey', region.get('context'));
  } else {
    if (id == 'NavMenu') {
      me.fireEvent('container_showMenu', true);
      if (ABP.util.Config.getSessionConfig().settings.enableNavSearch) {
        ABP.util.Keyboard.focus('.nav-search-field');
      } else {
        ABP.util.Keyboard.focus('.main-menu .x-abptreelistitem');
      }
    } else {
      if (id === 'NavMenu-Favourites') {
        me.fireEvent('mainmenu_focusFavorites');
      } else {
        if (id === 'NavMenu-Recents') {
          me.fireEvent('mainmenu_focusRecents');
        } else {
          if (id === 'MainContent') {
            ABP.util.Keyboard.focus('.feature-canvas [tabindex]');
          } else {
            if (Ext.String.startsWith(id, 'RightPane')) {
              this.fireEvent('container_rightPane_toggleTab', region.get('context'), true, true);
            } else {
              if (id === 'UserSettings') {
                this.fireEvent('container_rightPane_toggleTab', {name:'abp-settings', uniqueId:'abp-settings', xtype:'settingscontainer', automationCls:'settings-tab'}, true);
                ABP.util.Keyboard.focus('.settings-container .x-panel-body [tabindex]');
              }
            }
          }
        }
      }
    }
  }
  cmp.setValue(null);
}, onFocusEnter:function(cmp, e) {
  var me = this, v = me.getView();
  if (!e.backwards) {
    v.show();
  }
}, onShow:function() {
  var me = this, v = me.getView();
  v.down('#JumpToCombo').focus();
}, onFocusLeave:function() {
  var me = this, v = me.getView();
  v.hide();
}, showJumpTo:function() {
  var me = this, view = me.getView();
  view.show();
}, privates:{onSearchStoreChanged:function(store) {
  var vm = this.getViewModel(), jumpToSearches = [];
  store.each(function(provider) {
    provider.get('name');
    jumpToSearches.push({id:'GlobalSearch' + provider.id, text:provider.get('name'), context:provider.id});
  });
  vm.storeInfo.targets.loadData(jumpToSearches, true);
}, onNavMenuChanged:function(store) {
  var me = this;
  try {
    var navStore = Ext.getStore('navSearch');
    var node = navStore.getNodeById('container_nav-recent');
    if (node && !node.get('hidden')) {
      me.addTarget({id:'NavMenu-Recents', text:ABP.util.Common.geti18nString('navMenu_recent')}, 'NavMenu');
    } else {
      me.hideTarget('NavMenu-Recents');
    }
    var node = navStore.getNodeById('container_nav-favorites');
    if (node && !node.get('hidden')) {
      me.addTarget({id:'NavMenu-Favourites', text:ABP.util.Common.geti18nString('navMenu_favorites')}, 'NavMenu');
    } else {
      me.hideTarget('NavMenu-Favourites');
    }
  } catch (err) {
    ABPLogger.logDebug(err);
  }
}, addTarget:function(target, previousid) {
  var me = this, vm = me.getViewModel(), s = vm.storeInfo.targets;
  var target = s.getById(id);
  if (s) {
    return;
  }
  var insertAt = s.indexOfId(previousid);
  if (insertAt > -1) {
    s.insert(insertAt, target);
  } else {
    s.loadData(target, true);
  }
}, hideTarget:function(id) {
  var me = this, vm = me.getViewModel(), s = vm.storeInfo.targets;
  var target = s.getById(id);
  if (s) {
    s.remove(target);
  }
}}});
Ext.define('ABP.view.session.favorites.FavoritesEditPanelModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.favoritesEditPanel', data:{depthLimit:null, allowItemRename:null, favorites_editPanel_title:'', favorites_editPanel_name:'', favorites_editPanel_source:'', favorites_editPanel_moveToGroup:'', button_cancel:'', button_delete:'', button_save:''}});
Ext.define('ABP.view.session.favorites.FavoritesManagerControllerBase', {extend:'Ext.app.ViewController', init:function() {
  var me = this, view = me.getView();
  var favStoreCopy = me.getFavoritesStoreCopy();
  view.favTree = view.down('#favoritestree');
  view.favTree.setStore(favStoreCopy);
}, getFavoritesStoreCopy:function() {
  var me = this;
  var favoritesCopy = ABP.internal.util.MainMenu.copyFavorites();
  var favStore = Ext.create('Ext.data.TreeStore', {root:{expanded:true, children:favoritesCopy}});
  return favStore;
}, onSaveClick:function() {
  var me = this, toastShown = false, view = me.getView(), favorites = [];
  if (!view.favTree) {
    return;
  }
  var treeStore = view.favTree.getStore();
  var root = treeStore.getRootNode();
  if (root.hasChildNodes()) {
    favorites = me.buildChildNode(root, toastShown);
  }
  me.fireEvent('mainmenu_updateFavorites', favorites);
  me.fireEvent('featureCanvas_hideSetting');
}, onCancelClick:function() {
  this.fireEvent('featureCanvas_hideSetting');
}, privates:{buildChildNode:function(parentNode, toastShown) {
  var node = [], childNode, i, msg, children;
  for (i = 0; i < parentNode.childNodes.length; i++) {
    childNode = parentNode.childNodes[i];
    if (childNode.isLeaf()) {
      node.push(childNode.data);
    } else {
      if (!childNode.hasChildNodes()) {
        if (!toastShown) {
          msg = ABP.util.Common.geti18nString('favorites_toast_deleteEmptyGroups');
          toastShown = true;
          ABP.view.base.toast.ABPToast.show(msg);
        }
        continue;
      }
      children = this.buildChildNode(childNode, toastShown);
      if (children && children.length > 0) {
        node.push({appId:'container', config:{icon:'icon-folder', text:childNode.data.text}, text:childNode.data.text, uniqueId:childNode.id, enabled:true, children:children});
      }
    }
  }
  return node;
}}});
Ext.define('ABP.view.session.favorites.FavoritesManagerEditPanelController', {extend:'Ext.app.ViewController', alias:'controller.favoriteseditpanel', init:function() {
  var me = this, view = me.getView(), favorite = view.getFavorite(), nameField = view.down('#favoriteName'), sourceField = view.down('#favoriteSource'), groupsField = view.down('#favoriteGroups'), favoriteData = favorite.getData();
  nameField.setValue(favoriteData.text);
  sourceField.setValue(me.__getSourceText(favoriteData));
  me.__buildGroups(favorite, groupsField);
}, onCloseClick:function() {
  this.getView().close();
}, onDeleteClick:function() {
  var me = this, view = me.getView(), favorite = view.getFavorite();
  if (favorite.hasChildNodes() === false) {
    favorite.remove();
    view.close();
  } else {
    view.close();
    ABP.view.base.popUp.PopUp.showOkCancel(ABP.util.Common.geti18nString('favorites_confirmDeleteGroupMsg'), ABP.util.Common.geti18nString('favorites_confirmDeleteGroupTitle'), function(result) {
      if (result) {
        favorite.remove(true);
      }
    });
  }
}, onSaveClick:function() {
  var me = this, view = me.getView(), favorite = view.getFavorite(), nameField = view.down('#favoriteName'), groupsField = view.down('#favoriteGroups'), selectedGroup = groupsField.getValue(), treeStore = favorite.getTreeStore();
  if (Ext.isEmpty(nameField.getValue())) {
    return;
  }
  favorite.set('text', nameField.getValue());
  if (selectedGroup) {
    var targetGroup = treeStore.getNodeById(selectedGroup);
    if (!targetGroup) {
      targetGroup = me.__findTargetGroup(treeStore.getRootNode(), selectedGroup);
      if (Ext.isArray(targetGroup) && targetGroup.length === 1) {
        targetGroup = targetGroup[0];
      }
    }
    if (targetGroup) {
      targetGroup.insertChild(0, favorite);
    } else {
      ABP.util.Logger.logWarn('Could not find favorite group' + targetGroup);
    }
  }
  view.close();
}, __buildGroups:function(favorite, groupsField) {
  var depthLimit = ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit');
  var root = favorite.getTreeStore().getRootNode();
  var groups = [{id:'root', text:ABP.util.Common.geti18nString('favorites_editPanel_noGroup')}];
  if (depthLimit === 0 || favorite.isLeaf()) {
    groups = groups.concat(this.__getAllGroupsDeep(root));
  }
  groupsField.setStore(Ext.create('Ext.data.Store', {fields:['id', 'text'], data:groups}));
}, __getAllGroupsDeep:function(node) {
  var me = this, view = me.getView(), favorite = view.getFavorite(), allGroups = [];
  if (!node || node.isLeaf() || node.id === favorite.id) {
    return [];
  } else {
    if (node.id !== 'root') {
      allGroups.push({id:node.id, text:node.getData().text});
    }
    node.eachChild(function(Mynode) {
      allGroups = allGroups.concat(me.__getAllGroupsDeep(Mynode));
    });
  }
  return allGroups;
}, __findTargetGroup:function(node, groupId) {
  var me = this, targetGroup = [];
  if (!node || node.isLeaf()) {
    return [];
  } else {
    if (node.id === groupId) {
      targetGroup.push(node);
    }
    node.eachChild(function(childNode) {
      targetGroup = targetGroup.concat(me.__findTargetGroup(childNode, groupId));
    });
  }
  return targetGroup;
}, __getSourceText:function(favoriteData) {
  var sourceText;
  if (favoriteData.labelKey) {
    sourceText = ABP.util.Common.geti18nString(favoriteData.labelKey);
    if (sourceText) {
      return sourceText;
    }
  }
  if (favoriteData.config) {
    return favoriteData.config.text || favoriteData.text;
  }
  return favoriteData.text;
}});
Ext.define('ABP.view.session.favorites.FavoritesManagerModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.favoritesmanagermodel', data:{favoriteTitle:''}, formulas:{hideEditIcon:{bind:{_depthLimit:'{conf.settings.favorites.depthLimit}', _allowItemRename:'{conf.settings.favorites.allowItemRename}'}, get:function(data) {
  if (data._depthLimit === 1 && data._allowItemRename === false) {
    return true;
  }
  return false;
}}}});
Ext.define('ABP.view.session.feature.FeatureCanvasController', {extend:'Ext.app.ViewController', alias:'controller.featurecanvascontroller', listen:{controller:{'*':{featureCanvas_showFeature:'showFeature', featureCanvas_showSetting:'showSetting', featureCanvas_hideSetting:'hideSetting', featureCanvas_triggerDefaultMenuItem:'triggerDefaultMenuItem', featureCanvas_openSearchBar:'__openSearchBar'}}, component:{'*':{abpHeaderPanel_closeView:'closeView'}}}, showFeature:function(feature, cbEvent, cbEventArgs) {
  var me = this;
  var view = me.getView();
  var appContainer = view.down('#applicationContainer');
  this.__clearAppContainer();
  appContainer.add(feature);
  if (cbEvent) {
    this.fireEvent(cbEvent, cbEventArgs);
  }
}, showSetting:function(feature) {
  var me = this;
  var view = me.getView();
  var settingsContainer = view.down('#settingsContainer');
  settingsContainer.removeAll(true, true);
  this.__setSettingsShow(true);
  settingsContainer.add({xtype:feature});
}, hideSetting:function() {
  var me = this;
  var view = me.getView();
  var settingsContainer = view.down('#settingsContainer');
  this.__setSettingsShow(false);
  settingsContainer.removeAll();
}, closeView:function(feature) {
  var view = this.getView();
  var appChildren = view.down('#applicationContainer').items;
  var settingsChildren = view.down('#settingsContainer').items;
  var isAppChild = appChildren.contains(feature);
  var isSettingsChild = settingsChildren.contains(feature);
  if (isAppChild) {
    this.__clearAppContainer();
  }
  if (isSettingsChild) {
    this.hideSetting();
  }
}, triggerDefaultMenuItem:function() {
  var me = this;
  var loadPageInfo = me.getViewModel().data.conf.settings.loadPage;
  if (loadPageInfo) {
    me.fireEvent('main_fireAppEvent', loadPageInfo.appId, loadPageInfo.event, loadPageInfo.eventArgs);
  } else {
    var navMenu = me.getViewModel().data.conf.navMenu;
    for (var i = 0; i < navMenu.length; ++i) {
      if (navMenu[i].event) {
        me.fireEvent('main_fireAppEvent', navMenu[i].appId, navMenu[i].event, navMenu[i].eventArgs);
        break;
      } else {
        if (navMenu[i].children && navMenu[i].children.length > 0) {
          if (me.lookThroughChildren(navMenu[i].children)) {
            break;
          }
        }
      }
    }
  }
}, lookThroughChildren:function(children) {
  var me = this;
  for (var i = 0; i < children.length; ++i) {
    if (children[i].event) {
      me.fireEvent('main_fireAppEvent', children[i].appId, children[i].event, children[i].eventArgs);
      return true;
    } else {
      if (children[i].children && children[i].children.length > 0) {
        if (me.lookThroughChildren(children[i].children)) {
          return true;
        }
      }
    }
  }
  return false;
}, __setSettingsShow:function(showSettings) {
  var view = this.getView();
  var settingsContainer = view.down('#settingsContainer');
  var appContainer = view.down('#applicationContainer');
  if (showSettings === true) {
    appContainer.hide();
    settingsContainer.show();
  } else {
    if (showSettings === false) {
      settingsContainer.hide();
      appContainer.show();
    }
  }
  view.settingShown = showSettings;
}, __clearAppContainer:function() {
  var view = this.getView();
  var appContainer = view.down('#applicationContainer');
  if (ABP.util.Common.getModern()) {
    appContainer.removeAll(true, true);
  } else {
    appContainer.removeAll();
  }
}, __openSearchBar:function() {
  this.getViewModel().set('searchBar.open', true);
}, interpretSwipe:function(event, element, eOpts) {
  this.component.getController().fireEvent('thumbbar_handleSwipe', event, element, eOpts);
}});
Ext.define('ABP.view.session.feature.FeatureCanvasModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.featurecanvasmodel'});
Ext.define('ABP.view.session.headlines.HeadlinesManagerController', {extend:'Ext.app.ViewController', alias:'controller.headlinesManager', listen:{component:{'*':{headlinesManager_onCancelClick:'onCancelClick'}}}, init:function() {
  var me = this, headlinesGrid = me.lookup('headlinesGrid'), headlinesStore = Ext.getStore('ABPHeadlines');
  headlinesGrid.setStore(headlinesStore);
}, newHeadline:function() {
  var me = this, headlinesGrid = me.lookup('headlinesGrid'), headlinesStore = headlinesGrid.getStore(), newModel = headlinesStore.getModel().create(), rowWidgetPlugin = headlinesGrid.getPlugin('rowwidget');
  headlinesStore.add(newModel);
  var index = headlinesStore.indexOf(newModel);
  rowWidgetPlugin.toggleRow(index, newModel);
}, onCancelClick:function() {
  var me = this, headlinesGrid = me.lookup('headlinesGrid'), headlinesStore = headlinesGrid.getStore(), newRecords = headlinesStore.getNewRecords(), modifiedRecords = headlinesStore.getModifiedRecords();
  if (newRecords.length > 0 || modifiedRecords.length > 0) {
    ABP.view.base.popUp.PopUp.showOkCancel(ABP.util.Common.geti18nString('headlines_unsaved_changes'), ABP.util.Common.geti18nString('headlines_title'), function(result) {
      if (result) {
        headlinesStore.rejectChanges();
        me.fireEvent('featureCanvas_hideSetting');
      }
    });
  } else {
    this.fireEvent('featureCanvas_hideSetting');
  }
}, removeItemClicked:function(grid, rowIndex, colIndex, col, event, record) {
  var me = this;
  ABP.view.base.popUp.PopUp.showOkCancel(ABP.util.Common.geti18nString('headlines_delete'), ABP.util.Common.geti18nString('headlines_title'), function(result) {
    if (result) {
      var headlinesGrid = me.lookup('headlinesGrid'), headlinesStore = headlinesGrid.getStore();
      me.fireEvent('headline_delete', record);
      headlinesStore.remove(record);
      headlinesStore.commitChanges();
    }
  });
}});
Ext.define('ABP.view.session.help.HelpController', {extend:'Ext.app.ViewController', alias:'controller.helpcontroller', listen:{component:{'*':{helpview_intialLoad:'intialLoadDisplay'}}}, closeClicked:function() {
  this.fireEvent('featureCanvas_hideSetting');
}, intialLoadDisplay:function() {
  var me = this;
  var vmData = me.getViewModel().data;
  var types = vmData.helpTypeStore.data.items;
  var records = vmData.helpLinkStore.data.items;
  var items = [];
  var i, j;
  var typeLabel, children;
  var obj;
  if (types) {
    for (i = 0; i < types.length; ++i) {
      typeLabel = types[i].data.type;
      children = [];
      for (j = 0; j < records.length; ++j) {
        if (records[j].data.type === typeLabel) {
          children.push(records[j].data);
        }
      }
      if (children.length > 0) {
        obj = {title:typeLabel, links:children};
        items.push(obj);
      }
    }
    if (items.length > 0) {
      var cardContainer = me.lookupReference('abp-help-tile-container');
      for (i = 0; i < items.length; ++i) {
        cardContainer.add(items[i]);
      }
    }
  }
}, linkClick:function(link) {
  var vm = this.getViewModel();
  var url = link.url;
  var result = window.open(url);
  var blockedTitle = '';
  var blockedString = '';
  var htmlString = '';
  var target = '_blank';
  link.el.blur();
  if (Ext.isEmpty(result) && !ABP.util.Common.isIOSChrome()) {
    blockedTitle = vm.get('i18n.help_blocked_Title');
    blockedString = vm.get('i18n.help_blocked_Text');
    cancelString = vm.get('i18n.error_cancel_btn');
    canButton = Ext.MessageBox.CANCEL;
    canButton.text = cancelString;
    htmlString = Ext.String.format("{0}\x3cBR/\x3e\x3cBR/\x3e\x3cA HREF\x3d'{1}' TARGET\x3d'{2}'\x3e{3}\x3c/A\x3e", blockedString, url, target, url);
    Ext.Msg.show({title:blockedTitle, message:htmlString, buttons:canButton});
  }
}});
Ext.define('ABP.view.session.help.HelpViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.helpviewviewmodel', requires:['ABP.model.HelpLinkModel', 'ABP.model.HelpLinkTypeModel'], data:{appTitle:''}, stores:{helpLinkStore:{model:'ABP.model.HelpLinkModel', storeId:'ABPhelpLinkStore'}, helpTypeStore:{model:'ABP.model.HelpLinkTypeModel', storeId:'ABPhelpLinkTypeStore'}}, LoadStoreData:function() {
  var me = this;
  var plugins = ABP.util.PluginManager.config.registeredPlugins;
  var records = [];
  var types = [];
  var typeObj = {};
  var propt, name, plugAddress, currNav, i, j, links;
  var foundType;
  for (propt in plugins) {
    if (plugins.hasOwnProperty(propt)) {
      name = plugins[propt];
      plugAddress = name.split('.');
      currNav = window;
      typeObj = {};
      prodObj = {};
      for (i = 0; i < plugAddress.length; ++i) {
        currNav = currNav[plugAddress[i]];
      }
      if (currNav.prototype.config.helpLinks && currNav.prototype.config.helpLinks.length > 0) {
        links = currNav.prototype.config.helpLinks;
      } else {
        links = false;
      }
      if (links) {
        for (i = 0; i < links.length; ++i) {
          records.push(links[i]);
          typeObj = {};
          prodObj = {};
          foundType = false;
          for (j = 0; j < types.length; ++j) {
            if (types[j].type === links[i].type) {
              foundType = true;
              break;
            }
          }
          if (!foundType) {
            typeObj.text = typeObj.type = links[i].type;
            types.push(typeObj);
          }
        }
      }
    }
  }
  me.getStore('helpLinkStore').loadData(records);
  me.getStore('helpTypeStore').loadData(types);
}});
Ext.define('ABP.view.session.logger.LoggerController', {extend:'Ext.app.ViewController', alias:'controller.loggerpagecontroller', requires:['ABP.util.filters.Factory'], listen:{controller:{'*':{logger_clearClickAnswer:'__clearClickAnswer'}}}, init:function() {
}, exportClicked:function() {
}, closeClicked:function() {
  this.fireEvent('featureCanvas_hideSetting');
}, clearClicked:function() {
  ABP.view.base.popUp.PopUp.showYesNo('logger_clear_confirmation', 'logger_clear', 'logger_clearClickAnswer');
}, phoneFilterClick:function() {
  var me = this;
  var filterMenu = me.lookupReference('filterMenu');
  var data = filterMenu.floatParentNode.getData();
  filterMenu.setUserCls(ABP.util.Common.getCurrentTheme());
  if (!data.modalMask) {
    var Widget = Ext.Widget;
    var floatRoot = Ext.getFloatRoot();
    var positionEl = filterMenu.getFloatWrap();
    data.modalMask = filterMenu.floatParentNode.createChild({cls:'x-mask abp-modal-mask-transparent'}, positionEl);
    data.modalMask.on({tap:Widget.onModalMaskTap, scope:Widget});
    if (Ext.isiOS && filterMenu.floatParentNode === floatRoot) {
      data.modalMask.on({touchmove:function(e) {
        e.preventDefault();
      }});
    }
  }
  filterMenu.setWidth(me.getView().measure().width);
  filterMenu.showBy(me.getView().header, 'b');
}, __clearClickAnswer:function(answer) {
  var me = this;
  var store;
  var severity;
  if (answer) {
    store = Ext.data.StoreManager.lookup('ABPLoggingStore');
    severity = me.getView().down('#loggerSeverity');
    store.clearFilter();
    store.removeAll();
    severity.setValue('ALL');
  }
}, severityChanged:function(me, newVal) {
  var me = this;
  var store = Ext.data.StoreManager.lookup('ABPLoggingStore');
  if (newVal.data) {
    newVal = newVal.data.value;
  }
  if (newVal !== 'ALL') {
    store.filter('level', newVal);
  } else {
    store.clearFilter();
  }
}, onFilterChanged:function(control, newValue) {
  var store = Ext.data.StoreManager.lookup('ABPLoggingStore');
  store.removeFilter('TextFilter');
  if (!newValue || newValue.length < 2) {
    return;
  }
  var filterFunction = ABP.util.filters.Factory.createStringFilter(newValue, [{name:'message', useSoundEx:true}, {name:'detail', useSoundEx:true}], true);
  store.filter({id:'TextFilter', filterFn:filterFunction});
}, __clearLogFilters:function() {
  var store = Ext.data.StoreManager.lookup('ABPLoggingStore');
  store.clearFilter();
}, destroy:function() {
  this.__clearLogFilters();
  this.callParent();
}});
Ext.define('ABP.view.session.logger.LoggerViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.loggerviewmodel', stores:{severity:{fields:['display', 'value'], data:[{'display':'All Logs', 'value':'ALL'}, {'display':'Info', 'value':'INFO'}, {'display':'Warning', 'value':'WARN'}, {'display':'Accessibility', 'value':'ARIA'}, {'display':'Error', 'value':'ERROR'}, {'display':'Fatal', 'value':'FATAL'}, {'display':'Trace', 'value':'TRACE'}, {'display':'Debug', 'value':'DEBUG'}]}}});
Ext.define('ABP.view.session.mainMenu.ABPTreeListModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abptreelistmodel', stores:{navItems:{type:'tree', root:{expanded:true}}}});
Ext.define('ABP.view.session.mainMenu.ABPTreeListController', {extend:'Ext.app.ViewController', alias:'controller.abptreelistcontroller', listen:{component:{treelistmenu:{itemclick:'onItemClick'}}}, onItemClick:function(treeList, options) {
  var me = this, node = options.node, nodeData = node ? node.getData() : null;
  if (nodeData) {
    if (nodeData.type === 'event' && nodeData.event) {
      me.fireEvent('main_fireAppEvent', nodeData.appId, nodeData.event, nodeData.eventArgs, nodeData.activateApp);
    } else {
      if (nodeData.type === 'route' && nodeData.hash) {
        me.redirectTo(nodeData.hash);
      }
    }
    if (!node.hasChildNodes() && !node.getData().children) {
      if (ABP.util.Common.getClassic() && ABP.util.Config.getSessionConfig().settings.autoHideMenu || ABP.util.Common.getModern()) {
        me.fireEvent('session_closeMenu');
      }
    }
  }
  me.fireEvent('main_activeAppFocus');
}, onManageToolClick:function(e, cmp) {
  e.stopPropagation();
  var item = this.getView().getOverItem();
  if (item._node.get('manageEvent')) {
    this.fireEvent(item._node.get('appId') + '_showSettings', item._node.get('manageEvent'));
  }
}, navigateDownPress:function(event, treelistmenu) {
  var next = this.findNextMenuOption();
  if (next) {
    next.focus();
  }
}, navigateUpPress:function(event, treelistmenu) {
  var prev = this.findPreviousMenuOption();
  if (prev) {
    prev.focus();
  }
}, navigateLeftPress:function(event, treelistmenu) {
  var cmp = Ext.getCmp(event.target.id);
  if (cmp && cmp.collapse) {
    cmp.collapse();
  }
}, navigateRightPress:function(event, treelistmenu) {
  var cmp = Ext.getCmp(event.target.id);
  if (cmp && cmp.expand) {
    cmp.expand();
  }
}, navigateSelect:function(event, treelistmenu) {
  if (ABP.util.Common.getClassic()) {
    var activeEl = document.activeElement;
    activeEl.click();
  } else {
    var cmp = Ext.getCmp(event.target.id);
    cmp.onClick(event);
  }
}, navigateSelectSpecial:function(event, treelistmenu) {
  var activeEl = document.activeElement;
  var cmp = Ext.getCmp(activeEl.id);
  if (cmp && cmp.peelOffElement && cmp.peelOffElement) {
    if (cmp.peelOffElement.dom.href) {
      cmp.peelOffElement.dom.click();
    }
  }
}, navigateSelectShiftTab:function(event) {
  if (Ext.query('.nav-search-field').length > 0 && ABP.util.Config.getSessionConfig().settings.enableNavSearch) {
    ABP.util.Keyboard.focus('.nav-search-field');
  } else {
    var toolbarButtons = Ext.query('a[id^\x3dabpbadgebutton]');
    if (toolbarButtons.length > 0) {
      toolbarButtons[toolbarButtons.length - 1].focus();
    } else {
      ABP.util.Keyboard.focus('.tool-button-left');
    }
  }
}, findNextMenuOption:function() {
  var activeEl = document.activeElement;
  var classList = activeEl.classList;
  var collapsed = classList.contains('x-treelist-item-collapsed');
  var classic = ABP.util.Common.getClassic();
  if (activeEl.lastChild.firstChild && !collapsed) {
    return activeEl.lastChild.firstChild;
  }
  var found = classic ? this.findNextVisibleSibling(activeEl) : this.findNextVisibleSiblingModern(activeEl);
  if (found) {
    return found;
  } else {
    classic ? this.focusNextParentSibling(activeEl) : this.focusNextParentSiblingModern(activeEl);
  }
}, findPreviousMenuOption:function() {
  var activeEl = document.activeElement;
  var found = ABP.util.Common.getClassic() ? this.findPreviousVisibleSibling(activeEl) : this.findPreviousVisibleSiblingModern(activeEl);
  if (found) {
    return found;
  } else {
    var classList = activeEl.classList;
    var top = classList.contains('treeMenu-level-0');
    if (!top) {
      activeEl.parentNode.parentNode.focus();
    } else {
      var parentsLastChild = activeEl.parentNode.lastChild;
      if (parentsLastChild !== activeEl) {
        if (parentsLastChild._extData.isVisible === undefined || parentsLastChild._extData.isVisible) {
          var child = this.checkChildrenVisibility(parentsLastChild);
          if (child) {
            return child;
          } else {
            return parentsLastChild;
          }
        } else {
          var visible = ABP.util.Common.getClassic() ? this.findPreviousVisibleSibling(parentsLastChild) : this.findPreviousVisibleSiblingModern(parentsLastChild);
          if (visible && visible !== activeEl) {
            return visible;
          }
        }
      }
    }
  }
}, findNextVisibleSibling:function(activeEl) {
  var ret = null;
  var testingNode = activeEl;
  for (;;) {
    if (testingNode.nextSibling) {
      testingNode = testingNode.nextSibling;
      if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
        ret = testingNode;
        break;
      }
    } else {
      break;
    }
  }
  return ret;
}, findNextVisibleSiblingModern:function(activeEl) {
  var ret = null;
  var testingNode = activeEl;
  var testingCmp;
  for (;;) {
    if (testingNode.nextSibling) {
      testingNode = testingNode.nextSibling;
      testingCmp = Ext.getCmp(testingNode.id);
      if (!testingCmp.isHidden()) {
        ret = testingNode;
        break;
      }
    } else {
      break;
    }
  }
  return ret;
}, findPreviousVisibleSiblingModern:function(activeEl) {
  var ret = null;
  var testingNode = activeEl.previousSibling;
  var testingCmp;
  var found = false;
  for (;;) {
    if (testingNode) {
      testingCmp = Ext.getCmp(testingNode.id);
      if (!testingCmp.isHidden()) {
        ret = testingNode;
        found = true;
        break;
      }
      testingNode = testingNode.previousSibling;
    } else {
      break;
    }
  }
  if (found) {
    var child = this.checkChildrenVisibility(ret);
    if (child) {
      ret = child;
    }
  }
  return ret;
}, findPreviousVisibleSibling:function(activeEl) {
  var ret = null;
  var testingNode = activeEl.previousSibling;
  var found = false;
  for (;;) {
    if (testingNode) {
      if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
        ret = testingNode;
        found = true;
        break;
      }
      testingNode = testingNode.previousSibling;
    } else {
      break;
    }
  }
  if (found) {
    var child = this.checkChildrenVisibility(ret);
    if (child) {
      ret = child;
    }
  }
  return ret;
}, checkChildrenVisibility:function(foundNode) {
  var classList = foundNode.classList;
  var collapsed = classList.contains('x-treelist-item-collapsed');
  var testingNode;
  var found = false;
  var ret = null;
  if (foundNode.lastChild.firstChild && !collapsed) {
    testingNode = foundNode.lastChild.lastChild;
    for (;;) {
      if (testingNode) {
        if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
          ret = testingNode;
          found = true;
          break;
        }
        testingNode = testingNode.previousSibling;
      } else {
        break;
      }
    }
    if (found) {
      var child = this.checkChildrenVisibility(ret);
      if (child) {
        ret = child;
      }
    }
  }
  return ret;
}, focusNextParentSibling:function(activeEl) {
  var testingNode = activeEl.parentNode.parentNode;
  var found = false;
  for (;;) {
    if (testingNode.nextSibling) {
      testingNode = testingNode.nextSibling;
      if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
        testingNode.focus();
        found = true;
        break;
      }
    } else {
      break;
    }
  }
  if (!found) {
    this.focusFirstMenuOption();
  }
}, focusNextParentSiblingModern:function(activeEl) {
  var testingNode = activeEl.parentNode.parentNode;
  var testingCmp;
  var found = false;
  for (;;) {
    if (testingNode.nextSibling) {
      testingNode = testingNode.nextSibling;
      testingCmp = Ext.getCmp(testingNode.id);
      if (testingCmp && !testingCmp.isHidden()) {
        testingNode.focus();
        found = true;
        break;
      }
    } else {
      break;
    }
  }
  if (!found) {
    this.focusFirstMenuOption();
  }
}, treeListFocus:function() {
  var toFocus = this.findNextMenuOption();
  if (toFocus) {
    toFocus.focus();
  }
}, focusFirstMenuOption:function() {
  var view = this.getView();
  var activeEl = document.activeElement;
  activeEl.blur();
  view.focus();
}});
Ext.define('ABP.view.session.mainMenu.ABPTreeListItem', {extend:'Ext.list.TreeItem', requires:['Ext.list.TreeItem', 'ABP.util.Common'], alias:'widget.abptreelistitem', config:{itemCount:undefined, itemPriority:undefined, showManageTool:false, manageEvent:undefined}, hideMode:'offsets', focusable:true, tabIndex:-1, element:{reference:'element', tag:'li', cls:Ext.baseCSSPrefix + 'treelist-item', children:[{reference:'rowElement', cls:Ext.baseCSSPrefix + 'treelist-row', children:[{tag:'a', tabIndex:-1, 
role:'presentation', reference:'wrapElement', cls:Ext.baseCSSPrefix + 'treelist-item-wrap', 'aria-live':'polite', 'aria-atomic':true, 'aria-relevant':'additions', children:[{reference:'iconElement', cls:Ext.baseCSSPrefix + 'treelist-item-icon'}, {reference:'textElement', 'aria-hidden':true, cls:Ext.baseCSSPrefix + 'treelist-item-text'}, {reference:'shorthandElement', cls:Ext.baseCSSPrefix + 'treelist-item-shorthand'}, {tag:'a', tabIndex:-1, target:'_blank', reference:'peelOffElement', title:'Open in new Tab', 
cls:Ext.baseCSSPrefix + 'treelist-item-tool treelist-tool-peel-off icon-windows'}, {tag:'a', tabIndex:-1, target:'_blank', reference:'manageToolElement', cls:Ext.baseCSSPrefix + 'treelist-item-tool treelist-tool-manage icon-gearwheel'}, {reference:'expanderElement', cls:Ext.baseCSSPrefix + 'treelist-item-expander'}]}]}, {reference:'itemContainer', tag:'ul', cls:Ext.baseCSSPrefix + 'treelist-container'}, {reference:'toolElement', cls:Ext.baseCSSPrefix + 'treelist-item-tool'}]}, constructor:function(config) {
  config = config || {};
  var me = this, node = config.node;
  if (node && node.get('contextMenu')) {
    config.contextMenu = true;
    var pluginType = 'abpcontextmenu';
    config.plugins = config.plugins || {};
    if (Ext.isObject(config.plugins) && !config.plugins[pluginType]) {
      config.plugins[pluginType] = pluginType;
    } else {
      if (Ext.isArray(config.plugins) && !config.plugins.indexOf(pluginType) > -1) {
        config.plugins.push(pluginType);
      }
    }
  }
  me.callParent([config]);
  me.initToolTip(config);
  node = me.getNode();
  var peelOffElement = me.peelOffElement, wrapElement = me.wrapElement, itemHref = node.get('itemHref'), enableMenuPeelOff = ABP.util.Config.getSessionConfig().settings.enableMenuPeelOff, cls = node.get('cls'), itemCount = node.get('itemCount'), itemPriority = node.get('itemPriority'), hidden = node.get('hidden'), showManageTool = node.get('showManageTool'), shorthand = node.get('shorthand'), levelString = ABP.util.Common.geti18nString('aria_tree_level'), ariaText = ABP.util.Aria.encodeAttribute(Ext.String.htmlDecode(node.get('text'))), 
  isSingleCollapse = ABP.util.Config.getSessionConfig().settings.mainMenuSingleExpand;
  if (node && node.parentNode && node.parentNode.id === 'container_nav-recent' && !node.get('children')) {
    me.isToggleEvent = function() {
      return false;
    };
  }
  me.element.set({'aria-label':ariaText + levelString + node.get('depth')});
  if (node.childNodes && node.childNodes.length > 0) {
    me.element.set({'aria-expanded':node.get('expanded')});
  }
  if (peelOffElement) {
    peelOffElement.hide();
    if (!Ext.isEmpty(itemHref) && wrapElement) {
      wrapElement.set({href:itemHref});
      me.element.set({'aria-label':ariaText + levelString + node.get('depth') + ' alt + enter to open in new tab'});
      if (enableMenuPeelOff) {
        peelOffElement.addCls('has-link');
        peelOffElement.set({href:itemHref});
        peelOffElement.show();
        peelOffElement.on({click:function(e) {
          e.stopPropagation();
        }});
      }
    }
  }
  if (!showManageTool) {
    me.manageToolElement.hide();
  } else {
    me.manageToolElement.show();
    me.manageToolElement.on({click:'onManageToolClick'});
  }
  if (shorthand) {
    me.shorthandElement.setHtml(shorthand);
  }
  me.element.addCls(cls);
  me.setItemCount(itemCount);
  me.setItemPriority(itemPriority);
  if (hidden) {
    me.setHidden(hidden);
  }
  if (isSingleCollapse) {
    node.on('collapse', me.onNodeCollapse);
  }
  return me;
}, onNodeCollapse:function(me) {
  var parent = !Ext.isEmpty(me.childNodes);
  if (parent) {
    me.cascade({after:function(node) {
      node.collapse();
    }});
  }
}, onNodeExpand:function(me) {
}, updateText:function(text) {
  this.renderNodeText(text, this.getItemCount(), this.getItemPriority());
}, updateItemCount:function(count) {
  this.renderNodeText(this.getText(), count, this.getItemPriority());
}, updateItemPriority:function(priority) {
  this.renderNodeText(this.getText(), this.getItemCount(), priority);
}, nodeUpdate:function(node, modifiedFieldNames) {
  this.onNodeUpdate(node, modifiedFieldNames);
}, expand:function() {
  var node = this.getNode();
  if (node) {
    node.expand();
    this.element.set({'aria-expanded':node.get('expanded')});
  }
}, collapse:function() {
  var node = this.getNode();
  if (node) {
    node.collapse();
    this.element.set({'aria-expanded':node.get('expanded')});
  }
}, privates:{onNodeUpdate:function(node, modifiedFieldNames) {
  var me = this;
  me.setItemCount(node.data['itemCount']);
  me.setItemPriority(node.data['itemPriority']);
  me.setHidden(node.data['hidden']);
  me.setText(node.data['text']);
}, renderNodeText:function(text, count, priority) {
  var css = null, node = this.getNode(), countString = ABP.util.Common.geti18nString('aria_badge_count'), updatedString = ABP.util.Common.geti18nString('aria_badge_updated_count'), levelString = ABP.util.Common.geti18nString('aria_tree_level'), ariaText = ABP.util.Aria.encodeAttribute(Ext.String.htmlDecode(node.get('text')));
  if (priority === ABP.util.Constants.badgePriority.Info) {
    css = 'priority-normal';
  } else {
    if (priority === ABP.util.Constants.badgePriority.Success) {
      css = 'priority-low';
    } else {
      if (priority === ABP.util.Constants.badgePriority.Warning) {
        css = 'priority-medium';
      } else {
        if (priority === ABP.util.Constants.badgePriority.Alert) {
          css = 'priority-high';
        }
      }
    }
  }
  if (count) {
    this.element.set({'aria-label':ariaText + countString + count + levelString + node.get('depth')});
    this.wrapElement.set({'aria-label':ariaText + updatedString + count});
    if (css) {
      this.textElement.update(text + "\x3cspan class\x3d'nav-item-count " + css + "' aria-label\x3d'" + count + "'\x3e" + count + '\x3c/span\x3e');
    } else {
      this.textElement.update(text + "\x3cspan class\x3d'nav-item-count' style\x3d'background-color: " + priority + "' aria-hidden\x3dtrue\x3e" + count + '\x3c/span\x3e');
    }
  } else {
    this.textElement.update(text);
  }
}, initToolTip:function(config) {
  var me = this;
  var ttString = me.getTooltipText(config);
  var lString = me.getLabelText(config);
  var tipHtml = Ext.htmlEncode(!Ext.isEmpty(ttString) ? ttString : lString || '');
  if (config.shorthand) {
    tipHtml += '\x3cspan class\x3d"shorthand"\x3e' + Ext.htmlEncode(config.shorthand);
  }
  var tipConfig = {target:me.rowElement, html:tipHtml, anchor:'top', showDelay:1000, anchorToTarget:false, listeners:!Ext.isEmpty(ttString) ? undefined : {beforeshow:me.tooltipBeforeShow}};
  if (Ext.toolkit === 'modern') {
    Ext.applyIf(tipConfig, {align:'b'});
  } else {
    Ext.applyIf(tipConfig, {cls:'main-menu'});
  }
  me.tooltip = Ext.create('Ext.tip.ToolTip', tipConfig);
}, getLabelText:function(config) {
  var lString = '', keyString, data = config.node.data, text = data.text, label = data.label, labelKey = data.labelKey;
  if (label && label.length) {
    lString = label;
  } else {
    if (text && text.length) {
      lString = text;
    }
  }
  if (labelKey && labelKey.length) {
    keyString = ABP.util.Common.geti18nString(labelKey);
    if (keyString !== labelKey) {
      lString = keyString;
    }
  }
  return lString;
}, getTooltipText:function(config) {
  var ttString = '', keyString, data = config.node.data, tooltip = data.tooltip, tooltipKey = data.tooltipKey;
  if (tooltip && tooltip.length) {
    ttString = tooltip;
  }
  if (tooltipKey && tooltipKey.length) {
    keyString = ABP.util.Common.geti18nString(tooltipKey);
    if (keyString !== tooltipKey) {
      ttString = keyString;
    }
  }
  return ttString;
}, tooltipBeforeShow:function(scope, eOpts) {
  var el = this.target || this.targetElement, textEl = el.down('.x-treelist-item-text'), textDom = textEl ? textEl.dom : null;
  if (textDom) {
    return textDom.offsetWidth < textDom.scrollWidth;
  }
}}});
Ext.define('ABP.view.overrides.ABPTreeListItemOverride', {override:'ABP.view.session.mainMenu.ABPTreeListItem', onFocus:function() {
  this.addFocusCls();
}, onBlur:function() {
  this.removeFocusCls();
}});
Ext.define('ABP.view.session.mainMenu.ABPTreeList', {extend:'Ext.list.Tree', alias:'widget.treelistmenu', requires:['ABP.view.session.mainMenu.ABPTreeListModel', 'ABP.view.session.mainMenu.ABPTreeListController', 'ABP.view.session.mainMenu.ABPTreeListItem', 'Ext.list.Tree'], viewModel:{type:'abptreelistmodel'}, controller:'abptreelistcontroller', itemId:'treelistmenu', cls:'mainnav-treelist', automationCls:'mainnav-treelist', ui:'dark', docked:'left', width:175, expanderFirst:false, expanderOnly:false, 
focusable:true, tabIndex:0, bind:{singleExpand:'{mainMenuSingleExpand}'}, defaults:{xtype:'abptreelistitem'}, listeners:{focus:'treeListFocus'}, keyMap:{DOWN:'navigateDownPress', UP:'navigateUpPress', LEFT:'navigateLeftPress', RIGHT:'navigateRightPress', ENTER:'navigateSelect', SPACE:'navigateSelect', 'ALT+ENTER':'navigateSelectSpecial', 'ALT+SPACE':'navigateSelectSpecial', 'SHIFT+TAB':'navigateSelectShiftTab'}, indent:12, getIndent:function() {
  return 12;
}});
Ext.define('ABP.view.session.mainMenu.MainMenuController', {extend:'Ext.app.ViewController', alias:'controller.mainmenucontroller', requires:['ABP.util.filters.misc.DuplicateFilter', 'ABP.events.ABPEvents'], useDefaultSelection:true, __favoriteBroadcastChannel:'abp-core-favorite', listen:{controller:{'*':{mainMenu_Populate:'populateMainMenu', container_mobileSessionToggle:'mobileSessionToggle', mainMenu_classicToggle:'classicToggle', mainMenu_classicClose:'classicClose', mainMenu_classicOpen:'classicOpen', 
mainMenu_enableMenuOption:'enableMenuItem', mainMenu_addMenuOption:'addMenuItem', mainMenu_removeMenuOption:'removeMenuItem', mainMenu_updateMenuCount:'onUpdateMenuCount', mainMenu_toggleNav:'__toggleNavType', mainMenu_addRecent:'__addRecent', mainMenu_addFavorite:'__addFavorite', mainMenu_removeFavorite:'__removeFavorite', mainmenu_updateFavorites:'__updateFavorites', mainmenu_focusFavorites:'focusFavorites', mainmenu_focusRecents:'focusRecents', mainMenu_replaceSuggested:'__replaceSuggested', mainMenu_addTreeOption:'__addTreeOption', 
mainMenu_removeTreeOption:'__removeTreeOption', mainMenu_setSingleExpand:'__setSingleExpand', mainMeun_setRecents:'__setRecents', afterSwitchLanguage:'__updateTreeStrings', session_click:'__handleSessionClick', session_toggleMenuShortcuts:'__toggleMenuShortcuts'}}, component:{'*':{miItemClick:'menuButtonClick', seperatorClick:'mobileSessionToggle'}}}, init:function() {
  ABP.util.BroadcastChannel.create('abp-core-favorite', this.onFavoriteMessageRecieved, this);
}, destroy:function() {
  ABP.util.BroadcastChannel.remove('abp-core-favorite');
}, setMicro:function() {
  var me = this;
  var vm = me.getViewModel();
  var micro = vm.get('micro');
  if (micro) {
    vm.set('micro', false);
    vm.set('menuWidth', 175);
    vm.set('sessHeight', 81);
    vm.set('menuFooterCls', 'menu-footer');
  } else {
    vm.set('micro', true);
    vm.set('menuWidth', 40);
    vm.set('sessHeight', 52);
    vm.set('menuFooterCls', 'main-footer-micro');
  }
}, populateMenuNav:function(navItems) {
  var me = this;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var navButtons = [];
  var searchNav, menuItemType;
  var i = 0;
  var config = ABP.util.Config.getSessionConfig();
  var navMenuOrder = config.navMenuOrder;
  var menuItemCount = Object.keys(navMenuOrder).length;
  for (i = 0; i < menuItemCount; i++) {
    menuItemType = null;
    for (var property in navMenuOrder) {
      if (navMenuOrder[property] === i) {
        menuItemType = property;
        break;
      }
    }
    switch(menuItemType) {
      case 'favorites':
        if (config.settings.enableMenuFavorites) {
          navButtons.push(me.buildFavoriteNode(config));
        }
        break;
      case 'recents':
        if (config.settings.enableMenuRecent) {
          navButtons.push(me.buildRecentsNode());
        }
        break;
      case 'suggested':
        if (config.settings.enableMenuSuggested) {
          navButtons.push(me.buildSuggestedNode());
        }
        break;
      case 'navigation':
        var navItemsLen = navItems.length;
        for (var j = 0; j < navItemsLen; ++j) {
          var menu = me.makeMenuTreeItem(navItems[j], 0);
          if (config.firstMenuAtTop && j === 0) {
            navButtons.unshift(menu);
          } else {
            if (navItems[j].isTop) {
              navButtons.unshift(menu);
            } else {
              navButtons.push(menu);
            }
          }
          if (j === navItemsLen - 1) {
            var navLength = navButtons.length - 1;
            vm.set('mainMenu_lastAddedNavItemId', {uniqueId:navButtons[navLength].uniqueId, appId:navButtons[navLength].appId, index:navLength});
          }
        }
        break;
    }
  }
  searchNav = {expanded:true, children:navButtons};
  navStore.setRoot(searchNav);
  me.setSearchStore();
}, buildFavoriteNode:function(config) {
  var favoriteChildren = [];
  var startFavoritesOpen = false;
  var favorites = config.settings.favorites.favoriteItems;
  if (Ext.isString(favorites)) {
    favorites = Ext.JSON.decode(favorites);
  }
  if (Ext.isArray(favorites) && favorites.length === 1 && Ext.isString(favorites[0])) {
    favorites = Ext.JSON.decode(favorites[0]);
  }
  if (favorites && !Ext.isEmpty(favorites)) {
    favoriteChildren = favorites;
  }
  if (config.settings.mainMenuStartFavoritesOpen) {
    startFavoritesOpen = true;
  }
  return this.makeMenuTreeItem({activateApp:false, enabled:true, children:favoriteChildren, hidden:favoriteChildren.length === 0, expanded:startFavoritesOpen, showManageTool:config.settings.enableMenuFavorite, itemId:'NavFavorites', appId:'container', uniqueId:'container_nav-favorites', label:'Favorites', labelKey:'navMenu_favorites', tooltip:'Favorites', tooltipKey:'navMenu_favorites', icon:'icon-favorite'}, 0, false, 'favorite');
}, buildRecentsNode:function() {
  var recents = [];
  return this.makeMenuTreeItem({activateApp:false, enabled:true, children:recents, hidden:recents.length === 0, itemId:'NavRecent', appId:'container', uniqueId:'container_nav-recent', label:'Recent', labelKey:'navMenu_recent', tooltip:'Recent', tooltipKey:'navMenu_recent', icon:'icon-clock'}, 0);
}, buildSuggestedNode:function() {
  var suggestions = [];
  return this.makeMenuTreeItem({activateApp:false, enabled:true, children:suggestions, hidden:suggestions.length === 0, itemId:'NavSuggested', appId:'container', uniqueId:'container_nav-suggested', label:'Suggested', labelKey:'navMenu_suggested', tooltip:'Suggested', tooltipKey:'navMenu_suggested', icon:'icon-lightbulb-off'}, 0);
}, populateMenuTree:function(config) {
  var me = this;
  var vm = me.getViewModel();
  var navTreeStore = vm.getStore('navTree');
  var navTreeButtons = [];
  var treeNav;
  var i = 0;
  if (config) {
    for (i = 0; i < config.length; ++i) {
      navTreeButtons.push(me.makeMenuTreeItem(config[i], 0));
    }
  }
  treeNav = {expanded:true, children:navTreeButtons};
  navTreeStore.setRoot(treeNav);
  me.setSearchStore();
}, makeMenuTreeItem:function(config, level, saveConfig, type) {
  var me = this;
  var vm = me.getViewModel();
  var retItem, uniqueId, text;
  var children = [];
  var iconString = '';
  var font = config.icon;
  var i = 0;
  var automationCls = '';
  var autocls = '';
  var menuCls = '';
  var finalCls = '';
  if (config.data && config.data.serialData) {
    config = config.data.serialData;
    font = config.icon;
  }
  if (config.uniqueId === null || config.uniqueId === undefined || config.uniqueId === '') {
    uniqueId = (type === 'favorite' ? 'fav_' : '') + ABP.util.IdCreator.getId(config);
  } else {
    uniqueId = config.uniqueId;
  }
  if (config.children && config.children.length > 0) {
    for (i; i < config.children.length; i++) {
      children.push(me.makeMenuTreeItem(config.children[i], level + 1, saveConfig, type));
    }
  } else {
    children = undefined;
  }
  if (config.config) {
    iconString = config.config.icon;
    config.label = config.config.text;
  }
  text = config.text ? config.text : me.i18nLookup(config.label, config.labelKey);
  if (font) {
    font = font.split('-');
    iconString = font[0] === 'fa' ? 'x-fa ' + config.icon : config.icon;
    iconString = me.__inspectIconString(iconString);
  }
  if (config.labelKey) {
    automationCls = menuCls + 'a-menu-' + config.labelKey.replace(/_/g, '-');
  } else {
    automationCls = menuCls + 'a-menu-unsafe-' + config.label.replace(/[^A-Za-z]/g, '');
  }
  autocls += 'treeMenu-level-' + level % 5;
  indentCls = 'treeMenu-indent-' + level;
  finalCls = [automationCls, autocls, indentCls];
  if (!config.enabled) {
    finalCls.push('treeMenu-disabled');
  }
  if (type === 'favorite') {
    if (vm.get('conf.settings.favorites.hideIcons') === true && config.uniqueId !== 'container_nav-favorites') {
      iconString = '';
    }
  }
  if (iconString === '') {
    finalCls.push('abp-no-icon');
  }
  retItem = {text:Ext.String.htmlEncode(text), config:{text:text, icon:iconString}, itemId:config.itemId, iconCls:iconString, itemCount:config.itemCount, itemPriority:config.itemPriority, showManageTool:config.showManageTool, manageEvent:config.manageEvent, itemHref:config.itemHref, cls:finalCls, activateApp:config.activateApp, appId:config.appId, expanded:config.expanded ? config.expanded : false, hash:config.hash, contextMenu:config.contextMenu || false, hidden:config.hidden, enabled:config.enabled, 
  event:config.event, eventArgs:config.eventArgs, labelKey:config.labelKey, tooltip:config.tooltip, tooltipKey:config.tooltipKey, shorthand:config.shorthand, type:config.type, id:uniqueId, uniqueId:uniqueId};
  if (saveConfig || saveConfig === undefined) {
    config.uniqueId = uniqueId;
    retItem['serialData'] = config;
  }
  if (children) {
    retItem['children'] = children;
  } else {
    retItem['leaf'] = true;
  }
  return retItem;
}, makeSessionMenuItem:function(config) {
  var uniqueid = config.uniqueId === null || config.uniqueId === undefined || config.uniqueId === '' ? ABP.util.IdCreator.getId(config) : config.appId + '_' + config.uniqueId;
  return {xtype:'menubutton', activateApp:config.activateApp, appId:config.appId, enabled:config.enabled, command:config.event, args:config.eventArgs, icon:config.icon, title:config.label, labelKey:config.labelKey, tooltip:config.tooltip, tooltipKey:config.tooltipKey, type:config.type, uniqueId:uniqueid, hidden:!config.enabled, bind:{width:'{menuWidth}'}};
}, __inspectIconString:function(iconString) {
  var allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /\x3c!--[\s\S]*?--\x3e|<\?(?:php)?[\s\S]*?\?>/gi;
  return iconString.replace(commentsAndPhpTags, '').replace(tags, function(x, y) {
    return allowed.indexOf('\x3c' + y.toLowerCase() + '\x3e') > -1 ? x : '';
  }).replace('/\x3e', '').trim();
}, i18nLookup:function(labelVal, labelKey) {
  var me = this;
  var vm = me.getViewModel();
  var ret = labelVal;
  var look = '';
  if (labelKey) {
    look = vm.get('i18n.' + labelKey);
    if (look) {
      ret = look;
    }
  }
  return ret;
}, onManageToolClick:function(e, cmp) {
  e.stopPropagation();
  var item = this.getView().getOverItem();
  if (item._node.get('manageEvent')) {
    this.fireEvent(item._node.get('appId') + '_showSettings', item._node.get('manageEvent'));
  }
}, populateMainMenu:function(config) {
  var me = this;
  var view = me.getView();
  var docked = me.getViewModel().data.menuDocked;
  var autoHide = me.getViewModel().get('autoHide');
  var firstEnabled = -1;
  var menuItems = [];
  var i, Enabled, unId;
  var focus, button;
  for (i = 0; i < config.length; ++i) {
    Enabled = config[i].enabled ? false : true;
    unId = config[i].uniqueId === null || config[i].uniqueId === undefined || config[i].uniqueId === '' ? ABP.util.IdCreator.getId(config[i]) : config[i].uniqueId;
    if (config[i].enabled && firstEnabled === -1) {
      firstEnabled = i;
    }
    focus = !autoHide && config[i].enabled;
    button = {xtype:'menubutton', uniqueId:unId, icon:config[i].icon, title:config[i].label, labelKey:config[i].labelKey, bind:{labelVal:'{i18n.' + config[i].labelKey + '}'}, command:config[i].event, args:config[i].eventArgs, enabled:config[i].enabled, tooltip:config[i].tooltip, tooltipKey:config[i].tooltipKey, shorthand:config[i].shorthand, type:config[i].type, children:config[i].children, appId:config[i].appId, hidden:config[i].hidden && Enabled, focusable:focus, activateApp:config[i].activateApp, 
    tabIndex:-1};
    if (config[i].children && config[i].children.length > 0) {
      me.fireEvent('submenu_populate', config[i].children, button.uniqueId, button.title);
    }
    menuItems.push(button);
  }
  menuItems.push({flex:1});
  if (!autoHide) {
    menuItems[firstEnabled].tabIndex = 2;
  }
  view.focusItemsCt = me.getViewModel().navSet('navMenu', menuItems);
}, populateSessionMenu:function(config) {
  var me = this;
  var view = me.getView();
  var menuItems = [];
  var logo;
  if (ABP.util.Common.getModern()) {
    logo = {xtype:'component', uniqueId:'apteanLogo', bind:{cls:'{menuFooterCls}'}};
  } else {
    logo = {xtype:'component', itemId:'apteanLogo', uniqueId:'apteanLogo', cls:'menu-footer', bind:{cls:'{menuFooterCls}', width:'{menuWidth}'}, setCls:function(cls) {
      if (cls === 'menu-footer') {
        this.removeCls('main-footer-micro');
        this.addCls(cls);
      } else {
        this.removeCls('menu-footer');
        this.addCls(cls);
      }
    }};
  }
  menuItems.push(logo);
  view.focusItemsCt = me.getViewModel().navSet('sessionMenu', menuItems);
}, languageSubMenu:function(languages) {
  var retArray = [];
  var currLang = this.getViewModel().get('selected.language');
  if (currLang === '') {
    currLang = 'en';
    this.getViewModel().set('selected.language', 'en');
  }
  var i;
  for (i = 0; i < languages.length; ++i) {
    if (languages[i].key !== currLang) {
      retArray.push({label:languages[i].name, labelKey:'languages_' + languages[i].key, event:'switchLanguage', eventArgs:languages[i].key, appId:'container', enabled:true, tooltip:languages[i].name, tooltipKey:'languages_' + languages[i].key, children:undefined, type:'event'});
    }
  }
  return retArray;
}, refreshMainMenu:function() {
  var me = this;
  var config = ABP.util.Config.getSessionConfig();
  me.populateMainMenu(config.navMenu);
  me.populateSessionMenu(config);
}, enableMenuItem:function(appId, uniqueId, isenabled) {
  var me = this;
  var changeMenuItem = me.findMenuItem(appId, uniqueId);
  if (changeMenuItem) {
    if (changeMenuItem.isNode) {
      var view = me.getView();
      var menu = view.down('treelistmenu');
      var row = menu.getItem(changeMenuItem);
      if (row) {
        if (isenabled) {
          changeMenuItem.data.enabled = true;
          row.removeCls('treeMenu-disabled');
        } else {
          changeMenuItem.data.enabled = false;
          row.addCls('treeMenu-disabled');
        }
      }
    } else {
      changeMenuItem.data.enabled = isenabled;
      if (!Ext.isArray(changeMenuItem.data.cls)) {
        changeMenuItem.data.cls = [];
      }
      if (isenabled && Ext.Array.contains(changeMenuItem.data.cls, 'treeMenu-disabled')) {
        Ext.Array.remove(changeMenuItem.data.cls, 'treeMenu-disabled');
      } else {
        if (!isenabled && !Ext.Array.contains(changeMenuItem.data.cls, 'treeMenu-disabled')) {
          Ext.Array.push(changeMenuItem.data.cls, 'treeMenu-disabled');
        }
      }
    }
  } else {
    var sesIndex = me.findSessionMenuItem(appId, uniqueId);
    if (sesIndex) {
      var vm = me.getViewModel();
      var sessionMenu = vm.get('sessionMenu');
      sessionMenu[sesIndex].hidden = !isenabled;
      sessionMenu[sesIndex].enabled = isenabled;
      vm.navSet('sessionMenu', sessionMenu);
    }
  }
}, findMenuItem:function(appId, id, tree) {
  var me = this;
  var vm = me.getViewModel();
  var store;
  var node;
  if (tree) {
    store = vm.getStore('navTree');
  } else {
    store = vm.getStore('navSearch');
  }
  node = store.getNodeById(id);
  if (node == null) {
    if (store.lazyFill) {
      node = me.findTreeStoreItem(store, 'id', id);
    }
  }
  return node;
}, findSessionMenuItem:function(appId, uniqueId) {
  var me = this;
  var vm = me.getViewModel();
  var ses = vm.get('sessionMenu');
  var ret = false;
  for (var i = 0; i < ses.length; ++i) {
    if (appId + '_' + uniqueId === ses[i].uniqueId) {
      ret = i;
    }
  }
  return ret;
}, addMenuItem:function(menuItem, nav, parentAppId, parentId, tree) {
  var me = this;
  var vm = me.getViewModel();
  var store;
  var pNode;
  var testnode;
  var level = 0;
  var sesIndex;
  var sessionMenu;
  if (tree) {
    store = vm.getStore('navTree');
  } else {
    store = vm.getStore('navSearch');
  }
  if (nav) {
    if (parentId) {
      var actualParentId = (parentAppId ? parentAppId + '_' : '') + parentId;
      pNode = this.findMenuItem(null, actualParentId, tree);
      if (pNode) {
        if (pNode.isNode) {
          testnode = pNode;
          for (;;) {
            if (testnode.parentNode.isRoot()) {
              level += 1;
              break;
            } else {
              testnode = testnode.parentNode;
              level += 1;
            }
          }
        } else {
          level = pNode.level;
        }
      } else {
        ABP.util.Logger.logWarn('Cannot add menu node. Could not find parent menu node id "' + actualParentId + '"');
      }
    }
    if (pNode) {
      if (pNode.isNode) {
        pNode.appendChild(me.makeMenuTreeItem(menuItem, level));
      } else {
        if (!Ext.isArray(pNode.data.children)) {
          pNode.data.children = [];
        }
        pNode.data.children.push(me.makeMenuTreeItem(menuItem, level));
        pNode.data.leaf = false;
      }
    } else {
      var lastAddedNodeInfo = vm.get('mainMenu_lastAddedNavItemId');
      if (lastAddedNodeInfo) {
        var newIndex = lastAddedNodeInfo.index + 1;
        var menuItemToAdd = me.makeMenuTreeItem(menuItem, level);
        vm.set('mainMenu_lastAddedNavItemId', {uniqueId:menuItemToAdd.uniqueId, appId:menuItemToAdd.appId, index:newIndex});
        store.getRoot().insertChild(newIndex, menuItemToAdd);
      } else {
        if (store.getRoot()) {
          store.getRoot().appendChild(me.makeMenuTreeItem(menuItem, level));
        } else {
          store.setRoot({expanded:true});
          store.getRoot().appendChild(me.makeMenuTreeItem(menuItem, level));
        }
      }
    }
  } else {
    sesIndex = me.findSessionMenuItem(menuItem.appId, menuItem.uniqueId);
    if (!sesIndex) {
      pNode = me.makeSessionMenuItem(menuItem);
      sessionMenu = vm.get('sessionMenu');
      level = ABP.util.Config.getSessionConfig().settings.enableSignOff ? 2 : 1;
      sessionMenu.splice(sessionMenu.length - level, 0, pNode);
      vm.navSet('sessionMenu', sessionMenu);
    }
  }
  me.setSearchStore();
}, removeMenuItem:function(appId, uniqueId, tree) {
  var me = this;
  var changeMenuItem = me.findMenuItem(appId, uniqueId, tree);
  if (changeMenuItem) {
    if (changeMenuItem.isNode) {
      changeMenuItem.parentNode.removeChild(changeMenuItem);
    } else {
      changeMenuItem.remove();
    }
  } else {
    var sesIndex = me.findSessionMenuItem(appId, uniqueId);
    if (sesIndex) {
      var vm = me.getViewModel();
      var sessionMenu = vm.get('sessionMenu');
      sessionMenu.splice(sesIndex, 1);
      vm.navSet('sessionMenu', sessionMenu);
    }
  }
}, onUpdateMenuCount:function(appId, uniqueId, data) {
  var me = this;
  var vm = me.getViewModel();
  if (!me.__updateMenuCountForTree(appId, uniqueId, false, data)) {
    me.__updateMenuCountForTree(appId, uniqueId, true, data);
  }
  me.__updateMenuCountForTree(appId, 'fav_' + uniqueId, false, data);
  me.__updateMenuCountForTree(appId, 'rec_' + uniqueId, false, data);
  me.__updateMenuCountForTree(appId, 'sug_' + uniqueId, false, data);
  vm.checkFirstRecentForUpdate(uniqueId, data);
}, __updateMenuCountForTree:function(appId, uniqueId, tree, data) {
  var me = this;
  var menuItem = me.findMenuItem(appId, uniqueId, tree);
  if (menuItem) {
    me.__updateMenuCount(menuItem, data);
    return true;
  }
  return false;
}, __updateMenuCount:function(menuItem, data) {
  if (menuItem.isNode) {
    menuItem.beginEdit();
  }
  menuItem.set('itemPriority', data.priority);
  menuItem.set('itemCount', data.count);
  if (menuItem.isNode) {
    menuItem.endEdit();
  }
}, setSelected:function(button) {
  var mButtons = Ext.ComponentQuery.query('menubutton');
  var i;
  for (i = 0; i < mButtons.length; ++i) {
    if (mButtons[i] !== button) {
      mButtons[i].setSelected(false);
    } else {
      mButtons[i].setSelected(true);
    }
  }
}, moveLeft:function() {
  this.fireEvent('featureCanvas_closeAllMenus');
}, moveUp:function() {
  var me = this;
  var view = me.getView();
  if (view.currentFocus === -1) {
    view.currentFocus = 0;
    me.focusByPlace(view.currentFocus);
  } else {
    me.move(true, view.currentFocus);
  }
}, moveDown:function() {
  var me = this;
  var view = me.getView();
  if (view.currentFocus === -1) {
    view.currentFocus = 0;
    me.focusByPlace(view.currentFocus);
  } else {
    me.move(false, view.currentFocus);
  }
}, move:function(up, focus) {
  var me = this;
  var view = me.getView();
  var newFocus;
  var ret;
  if (up) {
    if (focus - 1 >= 0) {
      focus--;
      newFocus = me.findByPlace(focus);
      if (!newFocus.config.enabled) {
        me.move(true, focus);
      } else {
        view.currentFocus = focus;
        me.focusByPlace(view.currentFocus);
      }
    } else {
      view.currentFocus = view.focusItemsCt;
      me.focusByPlace(view.currentFocus);
    }
  } else {
    if (focus + 1 > view.focusItemsCt) {
      view.currentFocus = 0;
      me.focusByPlace(view.currentFocus);
    } else {
      focus++;
      newFocus = me.findByPlace(focus);
      if (!newFocus.config.enabled) {
        me.move(false, focus);
      } else {
        view.currentFocus = focus;
        me.focusByPlace(view.currentFocus);
      }
    }
  }
}, tabHit:function() {
  var me = this;
  if (me.getViewModel().get('autohide')) {
    me.getView().currentFocus = 0;
  }
  me.fireEvent('featureCanvas_focusToToolbar');
}, enterHit:function() {
  var me = this;
  var view = me.getView();
  var currFocus = view.currentFocus;
  if (currFocus !== -1) {
    me.selectByPlace(currFocus);
  }
}, focusByPlace:function(place) {
  var me = this;
  var t = me.findByPlace(place);
  if (t !== null) {
    t.focus();
  }
}, selectByPlace:function(place) {
  var me = this;
  var t = me.findByPlace(place);
  if (t !== undefined) {
    t.clickItem();
  }
}, findByPlace:function(place) {
  var me = this;
  var view = me.getView();
  var nav = view.down('#main_menu_nav');
  var sess = view.down('#main_menu_session');
  var ret = null;
  for (var i = 0, len = nav.items.items.length; i < len; ++i) {
    if (nav.items.items[i].place === place) {
      ret = nav.items.items[i];
      break;
    }
  }
  for (var i = 0, len = sess.items.items.length; i < len; ++i) {
    if (sess.items.items[i].place === place) {
      ret = sess.items.items[i];
      break;
    }
  }
  return ret;
}, UpdateTabIndex:function(startIdx) {
  this.getView().startIdx = startIdx;
  this.getView().dirtyIdx = true;
}, preOpen:function(MouseInitiated) {
  var me = this;
  var view = me.getView();
  view.lastInitMouseBool = MouseInitiated;
  if (me.getViewModel().get('autoHide')) {
    view.addCls('main-menu-open');
  } else {
    view.addCls('main-menu-ah');
  }
  me.assignTabs(true);
  if (!MouseInitiated) {
    me.firstFocus();
  }
}, ahOpen:function() {
  var me = this;
  me.getView().addCls('main-menu-ahOpen');
}, ahClose:function() {
  var me = this;
  me.getView().removeCls('main-menu-ahOpen');
}, assignTabs:function(on) {
  var me = this;
  var view = me.getView();
  var nav = view.down('#main_menu_nav');
  var session = view.down('#main_menu_session');
  for (var i = 0, len = nav.items.items.length; i < len - 1; ++i) {
    nav.items.items[i].focusable = on;
    if (!on && document.activeElement.id === nav.items.items[i].id) {
      document.activeElement.blur();
    }
  }
  if (me.getViewModel().data.dockedMenu) {
    nav.items.items[0].tabIndex = 2;
  }
  for (var i = 0, len = session.items.items.length; i < len; ++i) {
    session.items.items[i].focusable = on;
    if (!on && document.activeElement.id === session.items.items[i].id) {
      document.activeElement.blur();
    }
  }
}, postClose:function() {
  var me = this;
  var view = me.getView();
  if (me.getViewModel().get('autoHide')) {
    view.removeCls('main-menu-open');
  } else {
    view.removeCls('main-menu-ah');
  }
  me.assignTabs(false);
  me.zeroFocus();
}, zeroFocus:function() {
  var view = this.getView();
  view.currentFocus = -1;
}, firstFocus:function() {
  var me = this;
  var view = me.getView();
  view.currentFocus = 0;
  me.focusByPlace(0);
}, reFocus:function() {
  var me = this;
  var view = me.getView();
  me.focusByPlace(view.currentFocus);
}, menuButtonClick:function(Button) {
  var me = this;
  var i;
  var task;
  var trueButton = Button;
  if (trueButton.type === undefined) {
    if (trueButton.config.type) {
      trueButton = trueButton.config;
    }
  }
  switch(trueButton.type) {
    case 'event':
      me.setSelected(Button);
      if (trueButton.children && trueButton.children.length > 0) {
        if (ABP.util.Common.getModern()) {
          me.makeSubMenu(Button);
        } else {
          me.fireEvent('submenu_lineChange', trueButton.uniqueId);
          me.fireEvent('featureCanvas_openSubMenu');
        }
      } else {
        if (ABP.util.Common.getClassic()) {
          if (me.getViewModel().get('autoHide') && Button.xtype !== 'menutoggle') {
            me.fireEvent('session_closeMenu');
          }
        } else {
          me.fireEvent('session_closeMenu');
        }
      }
      if (trueButton.command !== undefined && trueButton.command !== '' && trueButton.command !== null) {
        if (trueButton.appId instanceof Array) {
          for (i = 0; i < trueButton.appId.length; ++i) {
            me.fireEvent('main_fireAppEvent', trueButton.appId[i], trueButton.command[i], trueButton.args[i], trueButton.activateApp);
          }
        } else {
          me.fireEvent('main_fireAppEvent', trueButton.appId, trueButton.command, trueButton.args, trueButton.activateApp);
        }
      }
      break;
    default:
      me.setSelected(trueButton);
      me.fireEvent('submenu_lineChange', trueButton);
      me.fireEvent('featureCanvas_openSubMenu');
      break;
  }
}, makeSubMenu:function(button) {
  var sub = Ext.widget('submenu', {menuButtons:button.getChildren()});
  sub.showBy(button, 'bl-br');
}, mobileSessionToggle:function() {
  var me = this;
  var view = me.getView();
  var sessMenu = view.down('#main_menu_session');
  var sessItems;
  var seperator;
  if (sessMenu) {
    sessItems = sessMenu.innerItems;
    seperator = sessItems[0];
    if (seperator.hasCls('fa-caret-up')) {
      for (var i = 1, len = sessItems.length; i < len; ++i) {
        sessItems[i].show();
      }
      seperator.removeCls('fa-caret-up');
      seperator.addCls('fa-caret-down');
    } else {
      for (var i = 1, len = sessItems.length; i < len; ++i) {
        sessItems[i].hide();
      }
      seperator.removeCls('fa-caret-down');
      seperator.addCls('fa-caret-up');
    }
  }
}, __toggleNavType:function() {
  var me = this;
  var view = me.getView();
  var menu = view.down('treelistmenu');
  var store = menu.getBind().store.getValue().getStoreId();
  if (store === 'navSearch') {
    me.setMenuNavTree();
  } else {
    me.setMenuNavSearch();
  }
}, setMenuNavTree:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var menu = view.down('treelistmenu');
  menu.setBind({store:null});
  menu.setBind({store:'{navTree}'});
  vm.switchNav('tree');
}, setMenuNavSearch:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var menu = view.down('treelistmenu');
  menu.setBind({store:null});
  menu.setBind({store:'{navSearch}'});
  vm.switchNav('search');
}, __sanitizeUniqueId:function(uniqueId) {
  return uniqueId.replace('fav_', '').replace('sug_', '').replace('rec_', '');
}, __prepareObjectForABPAreas:function(object, toPrepend) {
  if (object.data && object.data.serialData) {
    var copy = Ext.clone(object.data.serialData);
    copy.uniqueId = toPrepend + this.__sanitizeUniqueId(copy.uniqueId);
    return copy;
  } else {
    if (object.uniqueId) {
      var copy = Ext.clone(object);
      copy.uniqueId = toPrepend + this.__sanitizeUniqueId(copy.uniqueId);
      return copy;
    } else {
      object.uniqueId = toPrepend + ABP.util.IdCreator.getId(object);
      return object;
    }
  }
}, __addRecent:function(pageInfo) {
  var me = this;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var node = navStore.getNodeById('container_nav-recent');
  var nodeToAdd = {};
  var changes = {};
  if (node) {
    pageInfo = me.__prepareObjectForABPAreas(pageInfo, 'rec_');
    nodeToAdd = me.makeMenuTreeItem(pageInfo, 1, true);
    changes = vm.addRecentPage(nodeToAdd);
    if (changes) {
      if (!Ext.isEmpty(changes.added)) {
        node.insertChild(0, changes.added[0]);
      }
      if (!Ext.isEmpty(changes.removed)) {
        node.removeChild(node.getChildAt(changes.removed[0]));
      }
      me.__checkNodeForChildren(node);
    }
    me.fireEvent('abp_updatedRecents');
    me.__saveRecentsToLocalStorage();
  }
}, __saveRecentsToLocalStorage:function() {
  var me = this;
  var vm = me.getViewModel();
  var recentPages = vm.get('recentPages');
  if (!Ext.isEmpty(recentPages)) {
    var toEncode = [];
    for (var i = 0; i < recentPages.length; ++i) {
      if (recentPages[i].serialData) {
        toEncode.push(recentPages[i].serialData);
      }
    }
    if (!Ext.isEmpty(toEncode)) {
      var jsonEncode = Ext.JSON.encode(recentPages);
      ABP.util.LocalStorage.setForLoggedInUser('ABPCore_recentPages', jsonEncode);
    }
  }
}, __setRecents:function(recentsArray) {
  if (Ext.isArray(recentsArray) && !Ext.isEmpty(recentsArray)) {
    var me = this;
    var vm = me.getViewModel();
    var recentsToPassToModel = [];
    for (var recentsItter = 0; recentsItter < recentsArray.length; recentsItter++) {
      recentsToPassToModel.push(me.makeMenuTreeItem(recentsArray[recentsItter], 1, true));
    }
    var toAdd = vm.setInitialRecents(recentsToPassToModel);
    if (Ext.isArray(toAdd) && !Ext.isEmpty(toAdd)) {
      var navStore = vm.getStore('navSearch');
      var node = navStore.getNodeById('container_nav-recent');
      for (var toAddItter = 0; toAddItter < toAdd.length; toAddItter++) {
        node.appendChild(toAdd[toAddItter]);
      }
      me.__checkNodeForChildren(node);
    }
  }
}, __addFavorite:function(pageInfo, saveRequest) {
  var me = this;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var node = navStore.getNodeById('container_nav-favorites');
  if (node) {
    var id = pageInfo.data.id;
    pageInfo = me.__prepareObjectForABPAreas(pageInfo, 'fav_');
    node.appendChild(me.makeMenuTreeItem(pageInfo, 1, false, 'favorite'));
    var args = {isFavorite:true, appId:pageInfo.appId, nodeId:id};
    if (saveRequest !== false) {
      me.saveFavorites();
      ABP.util.BroadcastChannel.send('abp-core-favorite', args);
    }
    Ext.ABPEvents.fireEvent(ABP.Events.favoritesUpdated, args);
    if (ABP.util.Common.getClassic()) {
      var tree = me.getView().down('treelistmenu');
      var favItem = tree.getItem(node);
      if (favItem) {
        favItem.addCls('animate-starburst');
        setTimeout(function() {
          favItem.removeCls('animate-starburst');
        }, 750);
      }
    }
  }
  me.__checkNodeForChildren(node);
}, __removeFavorite:function(appId, uniqueId, saveRequest) {
  var me = this, nodeToRemove;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var favNode = navStore.getNodeById('container_nav-favorites');
  if (navStore.lazyFill) {
    nodeToRemove = me.findTreeStoreItemInChildren(favNode, 'id', 'fav_' + uniqueId);
  } else {
    nodeToRemove = favNode.findChild('id', 'fav_' + uniqueId, true);
  }
  if (nodeToRemove) {
    this.__removeEmptyParent(nodeToRemove, navStore);
    nodeToRemove.remove();
    var args = {isFavorite:false, appId:appId, nodeId:uniqueId};
    if (saveRequest !== false) {
      me.saveFavorites();
      ABP.util.BroadcastChannel.send('abp-core-favorite', args);
    }
    Ext.ABPEvents.fireEvent(ABP.Events.favoritesUpdated, args);
  }
  if (ABP.util.Common.getClassic() && favNode && favNode.childNodes.length) {
    var tree = me.getView().down('treelistmenu');
    var favItem = tree.getItem(favNode);
    if (favItem) {
      favItem.addCls('animate-starburst-min');
      setTimeout(function() {
        favItem.removeCls('animate-starburst-min');
      }, 750);
    }
  }
}, onFavoriteMessageRecieved:function(msg) {
  var data = msg.data;
  if (data.isFavorite) {
    var node = ABP.util.Common.getMenuItem(data.appId, data.nodeId, false);
    this.__addFavorite(node, false);
  } else {
    this.__removeFavorite(data.appId, data.nodeId, false);
  }
}, __removeEmptyParent:function(node, store) {
  var me = this;
  var favNodeId = 'container_nav-favorites';
  if (store.lazyFill) {
    var parentId = node.isNode ? node.parentNode ? node.parentNode.id : null : node.parentId;
    if (parentId === favNodeId) {
      return;
    }
    var parentNode = me.findTreeStoreItem(store, 'id', parentId);
    if (parentNode) {
      var numChildren = 0;
      if (parentNode.isNode) {
        numChildren += parentNode.childNodes ? parentNode.childNodes.length : 0;
      } else {
        parentNodeData = parentNode;
      }
      var parentNodeData = parentNode.data ? parentNode.data : parentNode;
      if (parentNodeData && Ext.isArray(parentNodeData.children)) {
        numChildren += parentNodeData.children.length;
      }
      if (numChildren === 1) {
        me.__removeEmptyParent(parentNode, store);
        if (parentNode.parentNode && parentNode.parentNode.id === favNodeId) {
          var favoriteRootNode = parentNode.parentNode;
          var favoriteRootNodeChildren = favoriteRootNode.data.children;
          var length = Ext.isArray(favoriteRootNodeChildren) ? favoriteRootNodeChildren.length : 0;
          for (var i = 0; i < length; i++) {
            var currentChild = favoriteRootNodeChildren[i];
            if (currentChild.id === parentNode.id) {
              Ext.Array.removeAt(favoriteRootNodeChildren, i);
            }
          }
        }
        parentNode.remove();
      }
    }
  } else {
    if (!node.parentNode || node.parentNode.id === favNodeId) {
      return;
    }
    if (node.parentNode.childNodes && node.parentNode.childNodes.length === 1) {
      me.__removeEmptyParent(node.parentNode, store);
      node.parentNode.remove();
    }
  }
}, __updateFavorites:function(favoritesArray, saveRequest) {
  var me = this;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var node = navStore.getNodeById('container_nav-favorites');
  var i = 0;
  if (favoritesArray) {
    if (!Ext.isArray(favoritesArray)) {
      if (ABP.util.Common.isJsonString(favoritesArray)) {
        favoritesArray = Ext.JSON.decode(favoritesArray);
      } else {
        favoritesArray = [favoritesArray];
      }
    }
    if (node) {
      node.removeAll();
      node.data.children = [];
    }
    for (i = 0; i < favoritesArray.length; ++i) {
      var copy = me.__prepareObjectForABPAreas(favoritesArray[i], 'fav_');
      node.appendChild(me.makeMenuTreeItem(copy, 1, false, 'favorite'));
    }
    if (saveRequest !== false) {
      me.saveFavorites();
    }
    me.__checkNodeForChildren(node);
    if (ABP.util.Common.getClassic() && node && node.childNodes.length) {
      var tree = me.getView().down('treelistmenu');
      var favItem = tree.getItem(node);
      if (favItem) {
        favItem.addCls('animate-fav-update');
        setTimeout(function() {
          favItem.removeCls('animate-fav-update');
        }, 750);
      }
    }
  }
}, __replaceSuggested:function(pageInfoArray) {
  var me = this;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var node = navStore.getNodeById('container_nav-suggested');
  var i = 0;
  if (node) {
    node.removeAll();
    node.data.children = [];
    if (Ext.isArray(pageInfoArray)) {
      for (i; i < pageInfoArray.length; ++i) {
        var copy = me.__prepareObjectForABPAreas(pageInfoArray[i], 'sug_');
        node.appendChild(me.makeMenuTreeItem(copy, 1));
      }
    } else {
      var copy = me.__prepareObjectForABPAreas(pageInfoArray, 'sug_');
      node.appendChild(me.makeMenuTreeItem(copy, 1));
    }
    if (ABP.util.Config.getSessionConfig().settings.mainMenuSuggestedAutoExpand) {
      if (!node.isExpanded()) {
        node.expand();
      }
    }
    me.__checkNodeForChildren(node);
  }
}, __addTreeOption:function(treeObject) {
  var me = this;
  var i = 0;
  if (!Ext.isArray(treeObject)) {
    me.addMenuItem(treeObject, true, treeObject.parentAppId, treeObject.parentId, true);
  } else {
    for (i; i < treeObject.length; ++i) {
      me.addMenuItem(treeObject[i], true, treeObject[i].parentAppId, treeObject[i].parentId, true);
    }
  }
  me.setSearchStore();
}, __removeTreeOption:function(appId, uniqueId) {
  var me = this;
  me.removeMenuItem(appId, uniqueId, true);
  me.setSearchStore();
}, __checkNodeForChildren:function(node) {
  if (node.childNodes && node.childNodes.length > 0) {
    node.set('hidden', false);
  } else {
    node.set('hidden', true);
  }
}, onSearchKeyDown:function(e) {
  var me = this;
  var keyCode = e.getKey();
  if (keyCode === e.DOWN) {
    me.moveSelectedSearchResult(1);
    e.stopEvent();
  } else {
    if (keyCode === e.UP) {
      me.moveSelectedSearchResult(-1);
      e.stopEvent();
    } else {
      if (keyCode === e.ENTER) {
        if (!me.isSearchResultsVisible()) {
          me.searchNav();
        } else {
          var vm = me.getViewModel();
          var record = vm.get('selectedSearchResult');
          me.fireSearchResultSelected(record);
        }
      } else {
        if (keyCode === e.TAB) {
          if (me.focusSearchResults()) {
            e.stopEvent();
          }
        } else {
          if (keyCode === e.ESC) {
            me.resetSearchField();
          } else {
            if (keyCode === 191 && e.altKey) {
              this.fireEvent('abp_jumpto_show');
              e.stopEvent();
            } else {
              if (keyCode === e.ALT) {
                me.__toggleMenuShortcuts();
                e.stopEvent();
              }
            }
          }
        }
      }
    }
  }
}, onSearchResultsKeyDown:function(e) {
  var me = this;
  var keyCode = e.getKey();
  if (keyCode === e.TAB) {
    var view = this.getView();
    var searchText = view.down('#navSearchField');
    if (searchText) {
      searchText.focus();
    }
    e.stopEvent();
  } else {
    if (keyCode === e.ESC) {
      var view = this.getView();
      me.closeSearchResults();
      var searchText = view.down('#navSearchField');
      if (searchText) {
        searchText.selectText();
        searchText.focus();
      }
    } else {
      if (e.altKey && keyCode === e.ENTER) {
        if (e.record.data.href) {
          e.item.firstElementChild.lastElementChild.click();
        }
      }
    }
  }
}, onSearchResultHighlighted:function(view, node) {
  var me = this;
  var vm = me.getViewModel(), v = me.getView();
  var store = vm.getStore('searchTree');
  var recordIndex = node.dataset['recordindex'];
  var selected = store.getAt(recordIndex);
  vm.set('selectedSearchResult', selected);
}, searchNav:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var searchField = view.down('#navSearchField');
  var searchText = searchField.getValue();
  var searchStore = vm.getStore('searchTree');
  var currentRecordId = me.getSelectedSearchId();
  var useSoundEx = true;
  if (searchText.trim() != '') {
    me.removeSearchFilters(searchStore, false);
    var settings = ABP.util.Config.getSessionConfig().settings;
    if (settings.mainMenuNavSearchDisableSoundex !== undefined) {
      useSoundEx = !settings.mainMenuNavSearchDisableSoundex;
    }
    var filters = [];
    var filterFunction = ABP.util.filters.Factory.createStringFilter(searchText.trim(), [{name:'shorthand', useSoundex:false}, {name:'text', useSoundEx:useSoundEx}], true);
    filters.push({id:'TextFilter', filterFn:filterFunction});
    if (settings.mainMenuNavSearchDuplicateFields) {
      var dupFilterFunction = ABP.util.filters.Factory.createDuplicationFilter(settings.mainMenuNavSearchDuplicateFields);
      filters.push({id:'DupFilter', filterFn:dupFilterFunction});
    }
    ABP.util.Stopwatch.start();
    searchStore.filter(filters);
    ABP.util.Stopwatch.lap('Filter Applied');
    searchStore.sort('text', 'ASC');
    if (!settings.mainMenuNavSearchDisableRelevance) {
      searchStore.sort('_relevance', 'DESC');
    }
    ABP.util.Stopwatch.lap('Store Sorted');
    ABP.util.Stopwatch.stop();
    if (searchStore.getCount() > 0) {
      me.setSelectedSearchId(currentRecordId);
      var searchResults = view.down('#searchResultsView');
      if (searchResults) {
        searchResults.showBy(searchField, 'bl');
      } else {
        me.addNavSearchResultsElement();
        searchResults = view.down('#searchResultsView');
        searchResults.showBy(searchField, 'bl');
      }
      ABP.util.Aria.setExpanded(searchField, true);
      searchField.focus();
    } else {
      me.removeSearchFilters(searchStore, true);
      ABP.util.Aria.setExpanded(searchField, false);
    }
  } else {
    me.removeSearchFilters(searchStore, true);
    ABP.util.Aria.setExpanded(searchField, false);
  }
}, removeSearchFilters:function(store, closePopup) {
  store.removeFilter('TextFilter');
  store.removeFilter('DupFilter');
  if (closePopup) {
    this.closeSearchResults();
  }
}, setSearchStore:function() {
  var me = this;
  var vm = me.getViewModel();
  var searchStore = vm.getStore('searchTree');
  searchStore.removeAll();
  var items = me.buildSearchItemsForStore(vm.getStore('navTree'));
  if (!Ext.isEmpty(items)) {
    searchStore.add(items);
  }
  var items = me.buildSearchItemsForStore(vm.getStore('navSearch'));
  if (!Ext.isEmpty(items)) {
    searchStore.add(items);
  }
}, buildSearchItemsForStore:function(store) {
  var me = this, ret = [];
  var root = store.getRoot();
  Ext.Array.push(ret, me.buildSearchItems(root));
  return ret;
}, buildSearchItems:function(item, hierarchyString) {
  var me = this, ret = [], hierarchyString = hierarchyString ? hierarchyString : '';
  var itemData = item.isNode ? item.data : item;
  if (!item.isRoot || !item.isRoot()) {
    me.buildSearchData(itemData, hierarchyString, ret);
    if (hierarchyString) {
      hierarchyString += ' / ' + itemData.text;
    } else {
      hierarchyString = itemData.text;
    }
  }
  var childNodes = item.childNodes;
  var len = Ext.isArray(childNodes) ? childNodes.length : 0;
  for (var i = 0; i < len; i++) {
    Ext.Array.push(ret, me.buildSearchItems(childNodes[i], hierarchyString));
  }
  var childData = itemData.children;
  var len = Ext.isArray(childData) ? childData.length : 0;
  for (var i = 0; i < len; i++) {
    if (!item.findChild || !item.findChild('id', childData[i].id, false)) {
      Ext.Array.push(ret, me.buildSearchItems(childData[i], hierarchyString));
    }
  }
  return ret;
}, buildSearchData:function(data, hierarchyString, ret) {
  var me = this;
  if (!data) {
    return;
  }
  if (data.event || data.hash || data.itemHref) {
    var item = {appId:data.appId, itemId:data.itemId, text:data.text, hierarchy:hierarchyString, activateApp:data.activateApp, iconCls:data.iconCls, shorthand:data.shorthand, href:data.itemHref};
    if (data.hash) {
      item.hash = data.hash;
    }
    if (data.event) {
      item.event = data.event;
      item.eventArgs = data.eventArgs;
    }
    ret.push(item);
  }
}, findTreeStoreItem:function(store, propertyName, value, comparitorFn, scope, level) {
  var me = this;
  var found = false;
  var root = store.getRoot();
  if (!root) {
    return;
  }
  level = level || 0;
  propertyName = propertyName || 'id';
  var result = me.findTreeStoreItemInChildren(root, propertyName, value, comparitorFn, scope, level);
  return result;
}, findTreeStoreItemInArray:function(items, propertyName, value, comparitorFn, scope, level, parentItem) {
  var me = this;
  var found = false;
  var result;
  if (Ext.isArray(items)) {
    for (var i = 0, len = items.length; i < len && !result; i++) {
      var item = items[i];
      var itemData = item.isNode ? item.data : item;
      var resultCandidate;
      if (comparitorFn) {
        if (!item.isNode) {
          resultCandidate = Ext.create('ABP.data.TreeData', {data:itemData, parentDataArray:items, index:i, level:level, parentId:parentItem ? parentItem.id : null});
          found = comparitorFn.call(scope || me, resultCandidate);
        } else {
          found = comparitorFn.call(scope || me, item);
        }
      } else {
        if (itemData[propertyName] === value) {
          found = true;
        }
      }
      if (found) {
        if (item.isNode) {
          result = item;
        } else {
          if (resultCandidate) {
            result = resultCandidate;
          } else {
            result = Ext.create('ABP.data.TreeData', {data:itemData, parentDataArray:items, index:i, level:level, parentId:parentItem ? parentItem.id : null});
          }
        }
      } else {
        result = me.findTreeStoreItemInChildren(item, propertyName, value, comparitorFn, scope, level + 1);
      }
    }
  }
  return result;
}, findTreeStoreItemInChildren:function(item, propertyName, value, comparitorFn, scope, level) {
  var me = this;
  var result;
  if (Ext.isEmpty(item)) {
    return;
  }
  if (Ext.isArray(item.childNodes) && item.childNodes.length > 0) {
    result = me.findTreeStoreItemInArray(item.childNodes, propertyName, value, comparitorFn, scope, level + 1, item);
  }
  if (!result) {
    var itemData = item.data ? item.data : item;
    if (Ext.isArray(itemData.children) && itemData.children.length > 0) {
      result = me.findTreeStoreItemInArray(itemData.children, propertyName, value, comparitorFn, scope, level + 1, item);
    }
  }
  return result;
}, setSearchStoreOrig:function() {
  var me = this;
  var vm = me.getViewModel();
  var searchStore = vm.getStore('searchTree');
  var navTreeStore = vm.getStore('navTree');
  var navRoot = navTreeStore.getRoot();
  searchStore.removeAll();
  if (navRoot) {
    navRoot.cascade(function(node) {
      var parentNode = node;
      var hierarchy = [];
      var text = '';
      var hierarchyString = '';
      var i = 0;
      if (node.data.event || node.data.hash || node.data.itemHref) {
        for (;;) {
          if (!parentNode.isRoot()) {
            hierarchy.splice(0, 0, parentNode.data.text);
            parentNode = parentNode.parentNode;
          } else {
            break;
          }
        }
        if (!Ext.isEmpty(hierarchy)) {
          for (i = 0; i < hierarchy.length - 1; ++i) {
            if (i !== 0) {
              hierarchyString += ' / ';
            }
            hierarchyString += hierarchy[i];
          }
          text = hierarchy[hierarchy.length - 1];
        }
        var searchMenuItem = {appId:node.data.appId, itemId:node.data.itemId, shorthand:node.data.shorthand, text:text, hierarchy:hierarchyString, activateApp:node.data.activateApp, iconCls:node.data.iconCls};
        if (node.data.hash) {
          searchMenuItem.hash = node.data.hash;
        } else {
          searchMenuItem.event = node.data.event;
          searchMenuItem.eventArgs = node.data.eventArgs;
        }
        searchStore.add(searchMenuItem);
      }
    });
  }
  var x = me.getNavMenuSearchItems();
  if (!Ext.isEmpty(x)) {
    searchStore.add(x);
  }
}, getNavMenuSearchItems:function() {
  var me = this;
  var vm = me.getViewModel();
  var mainNavStore = vm.getStore('navSearch');
  var mainNavRoot = mainNavStore.getRoot();
  var ret = [];
  mainNavRoot.cascade(function(node) {
    var parentNode = node;
    var hierarchy = [];
    var text = '';
    var hierarchyString = '';
    var i = 0;
    if (node.data.event) {
      for (;;) {
        if (!parentNode.isRoot()) {
          hierarchy.splice(0, 0, parentNode.data.text);
          parentNode = parentNode.parentNode;
        } else {
          break;
        }
      }
      if (!Ext.isEmpty(hierarchy)) {
        for (i = 0; i < hierarchy.length - 1; ++i) {
          if (i !== 0) {
            hierarchyString += ' / ';
          }
          hierarchyString += hierarchy[i];
        }
        text = hierarchy[hierarchy.length - 1];
      }
      ret.push({appId:node.data.appId, itemId:node.data.itemId, event:node.data.event, eventArgs:node.data.eventArgs, text:text, hierarchy:hierarchyString, activateApp:node.data.activateApp, iconCls:node.data.iconCls, shorthand:node.data.shorthand});
    }
  });
  return ret;
}, onSearchLostFocus:function(lost, event, eOpts) {
  var me = this;
  var view = me.getView();
  var searchResults = view.down('#searchResultsView');
  var toComp, toId;
  if (event && event.toComponent) {
    toComp = event.toComponent;
    toId = toComp.itemId ? toComp.itemId : toComp.id;
    if (toId && (toId === 'navSearchField' || toId === 'searchResultsView')) {
      return;
    }
  }
  me.closeSearchResults();
}, onSearchResultReactWindowResize:function(width, height, searchResultsView) {
  this.onSearchResultResize(searchResultsView);
}, onSearchResultResize:function(searchResultsView, width, height) {
  if (!searchResultsView || searchResultsView.isHidden() || height === 1) {
    return;
  }
  var calcMaxHeight = Ext.getViewportHeight() - searchResultsView.getY();
  if (searchResultsView.getMaxHeight() !== calcMaxHeight) {
    searchResultsView.setMaxHeight(calcMaxHeight);
  }
}, onSearchResultSelectionChanged:function(cmp, selected) {
  var v = this.getView();
  if (selected.length > 0) {
    ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'), selected[0].id);
    if (selected[0].data.href) {
      var currentElement = cmp.view.getNodeByRecord(selected[0]);
      if (currentElement) {
        this.onIconHover(null, currentElement);
      }
    }
  } else {
    ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'), '');
  }
}, onSearchResultClick:function(clicked) {
  var me = this;
  var targetClassList = clicked.target.className;
  if (targetClassList.indexOf('nav-search-results-new-tab') >= 0) {
    return;
  } else {
    var record = me.getSearchResultRecord(clicked);
    me.fireSearchResultSelected(record);
  }
}, focusResultsFromSearch:function() {
  var me = this;
  var view = me.getView();
  var searchResults = view.down('#searchResultsView');
  if (!searchResults.isHidden()) {
    searchResults.focus();
  }
}, mainmenuTitleImageClick:function(event, element) {
  var me = this;
  me.fireEvent('toolbartop_logoclick', element);
}, mainMenuTitleImageContainerBeforeRender:function(container) {
  var me = this, vm = me.getViewModel(), toolbarTitleImageUrl = vm.get('conf.toolbarTitleImageUrl');
  if (toolbarTitleImageUrl) {
    container.setHtml('\x3cimg class\x3d"mainmenu-title-image" src\x3d"' + Ext.String.htmlEncode(Ext.resolveResource(toolbarTitleImageUrl)) + '" alt\x3d""\x3e');
  }
}, __updateTreeStrings:function() {
  var me = this;
  var vm = me.getViewModel();
  var navStore = vm.getStore('navSearch');
  var treeStore = vm.getStore('navTree');
  var navRoot = navStore.getRoot();
  var treeRoot = treeStore.getRoot();
  var textSetFn = function(node) {
    if (node.data.labelKey) {
      node.set('text', ABP.util.Common.geti18nString(node.data.labelKey));
    }
  };
  if (navRoot) {
    if (navStore.lazyFill) {
      me.eachMenuItemFromStore(navStore, textSetFn, null);
    } else {
      navRoot.cascade(textSetFn);
    }
  }
  if (treeRoot) {
    if (treeStore.lazyFill) {
      me.eachMenuItemFromStore(treeStore, textSetFn, null);
    } else {
      treeRoot.cascade(textSetFn);
    }
  }
  me.setSearchStore();
}, eachMenuItemFromStore:function(store, fn, scope, noDuplicates) {
  var me = this;
  var root = store.getRoot();
  me.eachMenuItem(root, fn, scope, noDuplicates, 0);
}, eachMenuItem:function(item, fn, scope, noDuplicates, level) {
  var me = this;
  if (!item.isRoot || !item.isRoot()) {
    fn.call(scope || me, item);
  }
  var childNodes = item.childNodes;
  var len = Ext.isArray(childNodes) ? childNodes.length : 0;
  for (var i = 0; i < len; i++) {
    me.eachMenuItem(childNodes[i], fn, scope, noDuplicates, level + 1);
  }
  var childData = item.data ? item.data.children : null;
  var len = Ext.isArray(childData) ? childData.length : 0;
  for (var i = 0; i < len; i++) {
    if (noDuplicates && item.findChild && !item.findChild('id', childData[i].id, false) || noDuplicates && !item.findChild || !noDuplicates) {
      var treeData = Ext.create('ABP.data.TreeData', {data:childData[i], parentDataArray:childData, index:i, level:level, parentId:item.id});
      me.eachMenuItem(treeData, fn, scope, noDuplicates, level + 1);
    }
  }
}, __setSingleExpand:function(expandBool) {
  this.getViewModel().set('mainMenuSingleExpand', expandBool);
}, privates:{classicToggle:function() {
  var me = this;
  var vm = me.getViewModel();
  var expanded = vm.get('classicMenuExpand');
  this.setClassicMenuVisibility(!expanded);
}, classicClose:function() {
  this.setClassicMenuVisibility(false);
}, classicOpen:function() {
  this.setClassicMenuVisibility(true);
}, __handleSessionClick:function(e) {
  var me = this;
  var view = me.getView();
  var vm = view.getViewModel();
  var isExpanded = vm.get('classicMenuExpand');
  var sessionCanvas = view.up().up();
  var mainMenu = view.el.dom;
  var mainMenuClicked = e.target == mainMenu || mainMenu.contains(e.target);
  var rightPane = sessionCanvas.down('#rightPane').el.dom;
  var rightPaneClicked = e.target == rightPane || rightPane.contains(e.target);
  var menuButton = sessionCanvas.down('#toolbar-button-menu');
  var menuButtonEl;
  if (menuButton) {
    menuButtonEl = menuButton.el.dom;
  }
  var menuButtonClicked = e.target == menuButtonEl || menuButtonEl.contains(e.target);
  var settingsButton = sessionCanvas.down('#rpButton').el.dom;
  var settingsButtonClicked = e.target == settingsButton || settingsButton.contains(e.target);
  if (!rightPaneClicked && !mainMenuClicked && !menuButtonClicked && !settingsButtonClicked && isExpanded) {
    if (Ext.toolkit === 'classic') {
      me.classicClose();
    } else {
      this.fireEvent('session_closeMenu');
    }
  }
}, focusFavorites:function() {
  var me = this;
  me.focusItemInGroup('container_nav-favorites');
}, focusRecents:function() {
  var me = this;
  me.focusItemInGroup('container_nav-recent');
}, focusItemInGroup:function(id) {
  var me = this;
  me.setClassicMenuVisibility(true);
  var navTree = me.getNavTree();
  if (navTree) {
    var node = navTree.getStore().getNodeById(id);
    if (node) {
      navTree.setSelection(node);
      if (!node.isExpanded()) {
        node.expand();
      }
      me.focusSelected();
      navTree.controller.navigateDownPress();
    }
  }
}, focusSelected:function() {
  var me = this, navTree = me.getNavTree();
  var sel = navTree.getSelection();
  if (!sel) {
    return;
  }
  var el = Ext.query('.x-treelist-item[data-recordid\x3d"' + sel.internalId + '"]');
  if (el && el.length > 0) {
    el[0].focus();
  }
}, getNavTree:function() {
  return this.getView().down('#treelistmenu');
}, setClassicMenuVisibility:function(show) {
  var me = this;
  var vm = me.getViewModel();
  var expanded = vm.get('classicMenuExpand');
  if (show === expanded) {
    return;
  }
  vm.set('classicMenuExpand', show);
  var v = me.getView();
  if (show) {
    v.show();
  } else {
    v.hide();
  }
  var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;
  if (rememberState) {
    ABP.util.LocalStorage.set('mmStateOpen', show);
  }
}, saveFavorites:function() {
  ABP.util.Ajax.request({url:ABP.util.LocalStorage.get('ServerUrl') + '/abp/favorites', method:'PUT', withCredentials:true, cors:Ext.browser.name !== 'IE' || Ext.browser.version > 9, jsonData:ABP.util.Common.getFavorites(), success:function(response) {
    if (response.responseText) {
      var r = Ext.JSON.decode(response.responseText);
      if (!(r.resultCode === 0)) {
        ABP.util.Logger.logError('ERROR: Could not save favorites: ' + r.errorDetail);
      }
    }
  }, failure:function() {
    ABP.util.Logger.logError('ERROR: Could not save favorites');
  }});
}, resetSearchField:function() {
  var me = this;
  me.closeSearchResults();
  var view = me.getView();
  var searchField = view.down('#navSearchField');
  if (searchField) {
    searchField.reset();
  }
}, getHightlightedItem:function() {
  var me = this;
  var view = me.getView();
  var searchResults = view.down('#searchResultsView');
  if (searchResults) {
    return searchResults.getSelection();
  }
  return null;
}, closeSearchResults:function() {
  var me = this;
  var v = me.getView();
  var searchResults = v.down('#searchResultsView');
  if (searchResults) {
    searchResults.hide();
  }
  var vm = me.getViewModel();
  vm.set('selectedSearchResult', null);
  me.useDefaultSelection = true;
}, isSearchResultsVisible:function() {
  var me = this;
  var view = me.getView();
  var searchResults = view.down('#searchResultsView');
  if (searchResults) {
    return searchResults.isVisible();
  } else {
    return false;
  }
}, focusSearchResults:function() {
  var me = this;
  var view = me.getView();
  var searchResults = view.down('#searchResultsView');
  if (searchResults) {
    if (searchResults.isVisible()) {
      return searchResults.focus();
    }
  }
  return false;
}, fireSearchResultSelected:function(record) {
  var me = this;
  if (record && record.data) {
    me.fireEvent('navigation_searchresultselected', record);
    if (record.data.event && record.data.appId) {
      me.fireEvent('main_fireAppEvent', record.data.appId, record.data.event, record.data.eventArgs, record.data.activateApp);
    } else {
      if (record.data.hash) {
        me.redirectTo(record.data.hash);
      }
    }
    me.resetSearchField();
  }
}, moveSelectedSearchResult:function(increment) {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var scrollToTop = false;
  var scrollToBottom = false;
  var currentSelection = vm.get('selectedSearchResult');
  if (!currentSelection) {
    return;
  }
  me.useDefaultSelection = false;
  var store = currentSelection.store;
  var currentIndex = store.indexOf(currentSelection);
  currentIndex = currentIndex + increment;
  if (currentIndex < 0) {
    currentIndex = store.getCount() - 1;
    scrollToBottom = true;
  } else {
    if (currentIndex >= store.getCount()) {
      currentIndex = 0;
      scrollToTop = true;
    }
  }
  var selected = store.getAt(currentIndex);
  vm.set('selectedSearchResult', selected);
  var resultsView = view.down('#searchResultsView');
  if (resultsView) {
    me.onIconKeyNav(resultsView, currentSelection);
  }
  if (!resultsView || !resultsView.getMaxHeight() || resultsView.getHeight() < resultsView.getMaxHeight()) {
    return;
  }
  if (scrollToTop) {
    resultsView.scrollTo(0, 0);
    return;
  } else {
    if (scrollToBottom) {
      resultsView.scrollTo(0, resultsView.getScrollableClientRegion().bottom);
      return;
    }
  }
  var currentItem = resultsView.getNodeByRecord(currentSelection);
  if (!currentItem) {
    return;
  }
  if (increment === 1) {
    if (currentItem.getBoundingClientRect().bottom + currentItem.scrollHeight >= resultsView.getBox().bottom) {
      resultsView.scrollBy(0, currentItem.scrollHeight);
    }
  } else {
    if (increment === -1) {
      if (resultsView.getBox().top >= currentItem.getBoundingClientRect().top - currentItem.scrollHeight) {
        resultsView.scrollBy(0, -currentItem.scrollHeight);
      }
    }
  }
}, getSelectedSearchId:function() {
  var me = this;
  var vm = me.getViewModel();
  var currentSelection = vm.get('selectedSearchResult');
  if (currentSelection) {
    return currentSelection.id;
  }
  return null;
}, setSelectedSearchId:function(id) {
  var me = this, v = me.getView(), vm = me.getViewModel();
  var store = vm.getStore('searchTree');
  if (store.count() === 0) {
    ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'), '');
    return;
  }
  var i = store.find('id', id);
  var selected = store.getAt(0);
  if (i !== -1 && !me.useDefaultSelection) {
    vm.set('selectedSearchResult', store.getAt(i));
  }
  vm.set('selectedSearchResult', selected);
}, addNavSearchResultsElement:function() {
  var me = this;
  var searchCont = me.lookupReference('abpNavSearchCont');
  var showPath = ABP.util.Config.getSessionConfig().settings.navSearchShowPath;
  var tpl = [];
  if (showPath) {
    tpl = ['\x3ctpl for\x3d"."\x3e', '\x3ctpl if\x3d"this.isUnder(xindex)"\x3e', '\x3cdiv id\x3d"{id}" class\x3d"nav-search-results-outer"\x3e', '\x3ctpl if\x3d"this.hasNewTab(href)"\x3e', '\x3cdiv class\x3d"icon-holder"\x3e', '\x3cdiv class\x3d"nav-search-results-icon {iconCls}"\x3e\x3c/div\x3e', '\x3ca class \x3d "nav-search-results-new-tab icon-windows" href\x3d"{href}" target\x3d"_blank" title\x3d"Open in a new tab"\x3e\x3c/a\x3e', '\x3c/div\x3e', '\x3ctpl else\x3e', '\x3cdiv class\x3d"nav-search-results-icon {iconCls}"\x3e\x3c/div\x3e', 
    '\x3c/tpl\x3e', '\x3cdiv class\x3d"nav-search-results-searched"\x3e{text}\x3c/div\x3e', '\x3cdiv class\x3d"nav-search-results-hierarchy"\x3e{hierarchy}\x3c/div\x3e', '\x3c/div\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', {isUnder:function(number) {
      return number <= ABP.util.Config.getSessionConfig().settings.mainMenuNavSearchResultsMax;
    }, hasNewTab:function(href) {
      return Ext.isString(href);
    }}];
  } else {
    tpl = ['\x3ctpl for\x3d"."\x3e', '\x3ctpl if\x3d"this.isUnder(xindex)"\x3e', '\x3cdiv id\x3d"{id}" class\x3d"nav-search-results-outer"\x3e', '\x3cdiv class\x3d"nav-search-results-searched"\x3e{text}\x3c/div\x3e', '\x3c/div\x3e', '\x3c/tpl\x3e', '\x3c/tpl\x3e', {isUnder:function(number) {
      return number <= ABP.util.Config.getSessionConfig().settings.mainMenuNavSearchResultsMax;
    }}];
  }
  var dataview = {xtype:'dataview', floating:true, scrollable:'y', id:'searchResultsView', hidden:true, tabIndex:0, cls:'nav-search-results', overItemCls:'nav-search-highlight', bind:{store:'{searchTree}', selection:'{selectedSearchResult}', minWidth:'{menuWidth*.9}', maxWidth:'{menuWidth*.9*2}'}, tpl:tpl, itemSelector:'div.nav-search-results-outer', listeners:{focusleave:'onSearchLostFocus', highlightitem:'onSearchResultHighlighted', el:{keydown:'onSearchResultsKeyDown'}, resize:'onSearchResultResize', 
  selectionchange:'onSearchResultSelectionChanged', click:{element:'el', fn:'onSearchResultClick'}, mouseover:{element:'el', delegate:'div.nav-search-results-outer', fn:'onIconHover'}, mouseout:{element:'el', delegate:'div.nav-search-results-outer', fn:'onIconHoverExit'}}};
  searchCont.add(dataview);
}, __toggleMenuShortcuts:function() {
  var me = this;
  var v = me.getView();
  var menu = v.down('#treelistmenu');
  if (menu) {
    menu.toggleCls('show-shortcuts');
  }
}, onIconHover:function(event, domElement) {
  var firstChildClass = domElement.firstElementChild.className;
  if (firstChildClass.indexOf('icon-holder') >= 0) {
    var iconHolder = domElement.firstElementChild;
    var normalIcon = iconHolder.firstElementChild;
    var newTabIcon = iconHolder.lastElementChild;
    normalIcon.classList.add('spin-out');
    newTabIcon.classList.add('spin-in');
    Ext.defer(function() {
      normalIcon.style.display = 'none';
      newTabIcon.style.display = 'block';
    }, 75);
  }
}, onIconHoverExit:function(event, domElement) {
  var firstChildClass = domElement.firstElementChild.className;
  if (firstChildClass.indexOf('icon-holder') >= 0) {
    var iconHolder = domElement.firstElementChild;
    var normalIcon = iconHolder.firstElementChild;
    var newTabIcon = iconHolder.lastElementChild;
    newTabIcon.classList.remove('spin-in');
    newTabIcon.classList.add('spin-out');
    normalIcon.classList.remove('spin-out');
    normalIcon.classList.add('spin-in');
    Ext.defer(function() {
      newTabIcon.style.display = 'none';
      normalIcon.style.display = 'block';
    }, 75);
    Ext.defer(function() {
      newTabIcon.classList.remove('spin-out');
      normalIcon.classList.remove('spin-in');
    }, 250);
  }
}, onIconKeyNav:function(resultsView, currentSelection) {
  var me = this;
  var currentElement = resultsView.getNodeByRecord(currentSelection);
  if (currentElement) {
    if (currentElement.firstElementChild.className.indexOf('icon-holder') >= 0) {
      me.onIconHoverExit(null, currentElement);
    }
  }
}, getSearchResultRecord:function(event) {
  var me = this;
  if (Ext.isEmpty(event)) {
    return null;
  }
  if (!Ext.isEmpty(event.record)) {
    return event.record;
  } else {
    if (event.parentEvent && event.target) {
      var target = event.target;
      var targetParent = target.parentElement;
      if (!targetParent) {
        return;
      }
      var vm = me.getViewModel();
      var store = vm.getStore('searchTree');
      return store.getById(targetParent.id);
    }
  }
}}});
Ext.define('ABP.view.session.mainMenu.MainMenuModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.mainmenumodel', requires:['ABP.model.SearchTreeResultsModel'], data:{navMenu:{}, sessionMenu:{}, menuWidth:250, sessHeight:42, menuHeaderHeight:60, menuHeaderCls:'main-menu-top menu-top-title', menuFooterCls:'menu-footer', navAfterCls:'abp-nav-toggle-', treeIcon:'icon-tree', navIcon:'icon-signpost2', navToggleIcon:'abp-nav-toggle-icon-tree', classicMenuExpand:true, hideTreeNav:true, hideSearch:true, 
recentPages:[], firstAddAfterSet:false, selectedSearchResult:null, mainMenuSingleExpand:false}, stores:{navSearch:{type:'tree', storeId:'navSearch', root:{expanded:true}}, navTree:{type:'tree', storeId:'navTree', root:{expanded:true}}, searchTree:{model:'ABP.model.SearchTreeResultsModel', storeId:'searchTree', id:'searchTree'}}, formulas:{micro:{get:function() {
  var width;
  var height;
  var ret = false;
  var isModern = Ext.os.deviceType === 'Phone';
  if (isModern) {
    width = ABP.util.Common.getWindowWidth();
    height = ABP.util.Common.getWindowHeight();
    if (isModern) {
      ret = true;
    }
    this.setMenu(ret);
  }
  return ret;
}}, mainMenuTopLabel:{bind:{_bootstrapConf:'{bootstrapConf.branding.companyName}'}, get:function(data) {
  var ret = '';
  if (data._bootstrapConf) {
    ret = data._bootstrapConf;
  } else {
    ret = 'APTEAN';
  }
  return ret;
}}, mainMenuTitleImageUrl:{bind:{_mainMenuTitleImageUrl:'{conf.toolbarTitleImageUrl}'}, get:function(data) {
  return Ext.isEmpty(data._mainMenuTitleImageUrl) ? null : data._mainMenuTitleImageUrl;
}}}, constructor:function() {
  this.callParent(arguments);
  var lazyFill = ABP.util.Config.getSessionConfig().settings.mainMenuLazyFill;
  this.getStore('navSearch').lazyFill = lazyFill;
  this.getStore('navTree').lazyFill = lazyFill;
}, setMenu:function(micro) {
  var me = this;
  var isClassic = Ext.os.deviceType === 'Tablet' || Ext.os.deviceType === 'Desktop';
  if (!micro) {
    if (isClassic) {
      me.set('menuWidth', 250);
      me.set('menuHeaderHeight', 60);
      me.set('menuHeaderCls', 'main-menu-top menu-top-title');
    } else {
      me.set('menuWidth', 300);
      me.set('menuHeaderHeight', 40);
      me.set('menuHeaderCls', 'main-menu-top menu-top-title-micro');
    }
  } else {
    me.set('menuWidth', '100%');
    me.set('menuHeaderHeight', 40);
    me.set('menuHeaderCls', 'main-menu-top menu-top-title-micro');
  }
}, navSet:function(path, value) {
  var me = this;
  me.set(path, null);
  me.set(path, value);
  return me.resetNav();
}, resetNav:function() {
  var me = this;
  var navCt = 0;
  var i;
  for (i = 0; i < me.data.sessionMenu.length; ++i) {
    if (me.data.sessionMenu[i].xtype === 'menubutton') {
      me.data.sessionMenu[i].place = navCt;
      navCt++;
    }
  }
  return navCt - 1;
}, switchNav:function(type) {
  var me = this;
  if (type === 'tree') {
    me.set('navToggleIcon', me.get('navAfterCls') + me.get('navIcon'));
  } else {
    me.set('navToggleIcon', me.get('navAfterCls') + me.get('treeIcon'));
  }
}, addRecentPage:function(page) {
  var me = this;
  var recentArray = me.get('recentPages');
  var ret = {added:[], removed:[]};
  var sizeDiff = 0;
  var i = 0;
  var firstAddAfterSet = me.get('firstAddAfterSet');
  var duplicateIndex = me.__compareNodeToExistingRecentItems(page);
  var maxVolume = ABP.util.Config.getSessionConfig().settings.mainMenuRecentMaxShown + 1;
  if (firstAddAfterSet) {
    me.set('firstAddAfterSet', false);
  }
  if (duplicateIndex === -1) {
    recentArray.splice(0, 0, page);
    if (recentArray.length > 1) {
      if (!firstAddAfterSet) {
        ret.added.push(recentArray[1]);
      }
      if (recentArray.length > maxVolume) {
        sizeDiff = recentArray.length - maxVolume;
        if (sizeDiff > 0) {
          recentArray.pop();
          ret.removed.push(recentArray.length - 1);
        }
        me.set('recentPages', recentArray);
        return ret;
      } else {
        return ret;
      }
    } else {
      return null;
    }
  } else {
    if (duplicateIndex !== 0) {
      var displacedNode = recentArray[duplicateIndex];
      recentArray.splice(duplicateIndex, 1);
      recentArray.splice(0, 0, displacedNode);
      ret.removed.push(duplicateIndex);
      if (!firstAddAfterSet) {
        ret.added.push(recentArray[1]);
      }
      return ret;
    } else {
      if (!firstAddAfterSet) {
        return null;
      } else {
        ret.removed.push(0);
        return ret;
      }
    }
  }
}, __compareNodeToExistingRecentItems:function(pageInfo) {
  var ret = -1;
  var me = this;
  var recents = me.get('recentPages');
  if (recents && recents.length > 0) {
    for (var i = 0; i < recents.length; ++i) {
      if (recents[i].uniqueId === pageInfo.uniqueId) {
        return i;
      }
    }
  }
  return ret;
}, setInitialRecents:function(recentsArray) {
  var me = this;
  var maxShown = ABP.util.Config.getSessionConfig().settings.mainMenuRecentMaxShown;
  if (recentsArray.length > maxShown) {
    recentsArray.splice(maxShown, recentsArray.length - maxShown);
  }
  me.set('recentPages', recentsArray);
  me.set('firstAddAfterSet', true);
  return recentsArray;
}, checkFirstRecentForUpdate:function(uniqueId, data) {
  var me = this;
  var recents = me.get('recentPages');
  var correctedUnId = Ext.String.startsWith(uniqueId, 'rec_') ? uniqueId : 'rec_' + uniqueId;
  if (!Ext.isEmpty(recents) && recents[0].uniqueId === correctedUnId) {
    recents[0].itemPriority = data.priority;
    recents[0].itemCount = data.count;
  }
}});
Ext.define('ABP.view.session.mainMenu.MenuItemModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.menuitemmodel'});
Ext.define('ABP.view.session.notifications.NotificationBaseController', {extend:'Ext.app.ViewController', onNotificationLinkClick:function() {
  var me = this, view = me.getView(), record = view.getNotificationRecord();
  if (record.event) {
    me.fireEvent(record.event, record.eventArgs);
  }
}, onNotificationDownloadClick:function() {
  var me = this, view = me.getView(), record = view.getNotificationRecord();
  if (record.downloadEvent) {
    me.fireEvent(record.downloadEvent, record.downloadEventArgs);
  }
}, onNotificationFlagClick:function(btn, eOpts) {
  var me = this, view = me.getView(), record = view.getNotificationRecord(), btnPressed = me.__checkBtnPressed(btn);
  if (btnPressed) {
    btn.setIconCls('icon-flag-filled');
    view.addCls('abp-notification-flagged');
  } else {
    btn.setIconCls('icon-signal-flag');
    view.removeCls('abp-notification-flagged');
  }
  record.flagged = btnPressed;
  me.fireEvent('notification_flag_change', record);
  view.setNotificationRecord(record);
  if (btnPressed) {
    me.fireViewEvent('notificationFlag');
  } else {
    me.fireViewEvent('notificationUnflag');
  }
}, __switchToContainer:function(view, newContainer, newContainerCls, activeItem) {
  var me = this, notificationDisplayContainer = me.lookupReference('notificationDisplayContainer');
  view.removeCls('abp-notification-flagged');
  view.addCls(newContainerCls);
  newContainer.setHeight(notificationDisplayContainer.el.getHeight());
  me.__setActiveCardItem(newContainer, activeItem);
}, onNotificationMarkReadClick:function() {
  var me = this, view = me.getView(), record = view.getNotificationRecord(), markedAsReadContainer = me.lookupReference('notificationMarkedAsReadContainer');
  me.__switchToContainer(view, markedAsReadContainer, 'abp-notification-markasread', 1);
  me.__animateFade(markedAsReadContainer, function() {
    me.fireEvent('notification_read', record);
    me.fireViewEvent('notificationRead');
  });
}, onNotificationMarkUnreadClick:function() {
  var me = this, view = me.getView(), record = view.getNotificationRecord(), markedAsUnreadContainer = me.lookupReference('notificationMarkedAsUnreadContainer');
  me.__switchToContainer(view, markedAsUnreadContainer, 'abp-notification-markasunread', 2);
  me.__animateFade(markedAsUnreadContainer, function() {
    me.fireEvent('notification_unread', record);
    me.fireViewEvent('notificationUnread');
  });
}, onNotificationRemoveClick:function() {
  var me = this, view = me.getView(), record = view.getNotificationRecord(), removedContainer = me.lookupReference('notificationRemovedContainer');
  me.__switchToContainer(view, removedContainer, 'abp-notification-removed', 3);
  me.__animateFade(removedContainer, function() {
    me.fireEvent('notification_removed', record);
    me.fireViewEvent('notificationRemove');
  });
}});
Ext.define('ABP.view.session.notifications.NotificationModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abp-notification', data:{notificationTime:undefined, label:undefined, labelTemplate:undefined, labelArgs:undefined, detail:undefined, detailTemplate:undefined, detailArgs:undefined}, formulas:{notificationLabel:function(get) {
  var label = get('label'), labelTemplate = get('labelTemplate'), labelArgs = get('labelArgs'), tempArguments = [];
  if (labelTemplate && labelTemplate.trim().length > 0) {
    tempArguments.push(labelTemplate);
    return Ext.String.format.apply(this, tempArguments.concat(labelArgs));
  } else {
    return label;
  }
}, notificationDetail:function(get) {
  var detail = get('detail'), detailTemplate = get('detailTemplate'), detailArgs = get('detailArgs'), tempArguments = [];
  if (detailTemplate && detailTemplate.trim().length > 0) {
    tempArguments.push(detailTemplate);
    return Ext.String.format.apply(this, tempArguments.concat(detailArgs));
  } else {
    return detail;
  }
}, notificationListOrder:function(get) {
  var index = get('currentNavIndex') + 1;
  var unread = get('unreadNotificationCount');
  var history = get('historyNotificationCount');
  var total = get('displayHistory') ? unread + history : unread;
  return index + ' of ' + total;
}, notificationAdditionalAriaDetail:function(get) {
  var isFlagged = this.getView().config.notificationRecord.flagged;
  var additionalLabel = ' updated ' + get('notificationTime');
  if (isFlagged) {
    additionalLabel += ' notification flagged use F to unflag right and left arrows to navigate available tools ';
  } else {
    additionalLabel += ' use F to flag notification right and left arrows to navigate available tools ';
  }
  return additionalLabel;
}}});
Ext.define('ABP.view.session.notifications.NotificationController', {extend:'ABP.view.session.notifications.NotificationBaseController', requires:['Ext.Anim'], alias:'controller.abp-notification', __checkBtnPressed:function(btn) {
  return btn.isPressed();
}, __setActiveCardItem:function(newContainer, newActiveItem) {
  var me = this, notificationDisplayContainer = me.lookupReference('notificationDisplayContainer');
  notificationDisplayContainer.setHidden(true);
  newContainer.setHidden(false);
}, __animateFade:function(container, afterAnimateFunc) {
  Ext.Anim.run(container, 'fade', {duration:1000, after:afterAnimateFunc});
}});
Ext.define('ABP.view.session.notifications.Notification', {extend:'Ext.Container', requires:['ABP.view.session.notifications.NotificationController', 'ABP.view.session.notifications.NotificationModel', 'ABP.util.RelativeTime'], alias:'widget.abp-notification', controller:'abp-notification', viewModel:{type:'abp-notification'}, config:{notificationRecord:null, filterFlagged:false, category:''}, updateFilterFlagged:function(showFlaggedOnly) {
  var me = this;
  if (!me.notificationRecord) {
    return;
  }
  if (showFlaggedOnly) {
    me.setHidden(!me.notificationRecord.flagged);
  } else {
    me.setHidden(false);
  }
}, cls:'abp-notification', layout:'vbox', items:[{xtype:'container', reference:'notificationDisplayContainer', frame:false, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'container', cls:'abp-notification-header', layout:{type:'hbox'}, width:'100%', items:[{xtype:'button', reference:'notificationLinkButton', cls:'abp-notification-link', ui:'abp-link', automationCls:'notification-link', flex:1, textAlign:'left', bind:{text:'{notificationLabel:htmlEncode}'}, handler:'onNotificationLinkClick'}, 
{xtype:'button', reference:'notificationReadButton', cls:'a-abp-notification-read-button', iconCls:'icon-navigate-cross', handler:'onNotificationMarkReadClick'}]}, {xtype:'component', reference:'notificationDetail', cls:'abp-notification-detail', bind:{html:'{notificationDetail:htmlEncode}'}}, {xtype:'toolbar', cls:'abp-notification-toolbar', items:[{xtype:'component', reference:'notificationToolbarLabel', cls:'abp-notification-toolbar-label'}, '-\x3e', {xtype:'button', reference:'notificationDownloadButton', 
cls:'a-abp-notification-download-button', iconCls:'icon-cloud-download', handler:'onNotificationDownloadClick', hidden:true}, {xtype:'button', reference:'notificationFlagButton', cls:'a-abp-notification-flag-button', iconCls:'icon-signal-flag', enableToggle:true, handler:'onNotificationFlagClick'}, {xtype:'button', reference:'notificationUnreadButton', cls:'a-abp-notification-unread-button', iconCls:'icon-nav-undo', handler:'onNotificationMarkUnreadClick'}, {xtype:'button', reference:'notificationRemoveButton', 
cls:'a-abp-notification-remove-button', iconCls:'icon-directional-arrows-14', handler:'onNotificationRemoveClick'}]}]}, {xtype:'container', reference:'notificationMarkedAsReadContainer', layout:{type:'vbox', align:'center', pack:'center'}, items:[{xtype:'component', cls:'abp-notification-action-label icon-fa-check-circle-o-01', bind:{html:'{i18n.abp_notifications_label_marked_as_read:htmlEncode}'}}], hidden:true}, {xtype:'container', reference:'notificationMarkedAsUnreadContainer', layout:{type:'vbox', 
align:'center', pack:'center'}, items:[{xtype:'component', cls:'abp-notification-action-label icon-nav-undo', bind:{html:'{i18n.abp_notifications_label_marked_as_unread:htmlEncode}'}}], hidden:true}, {xtype:'container', reference:'notificationRemovedContainer', layout:{type:'vbox', align:'center', pack:'center'}, items:[{xtype:'component', cls:'abp-notification-action-label icon-directional-arrows-14', bind:{html:'{i18n.abp_notifications_label_removed:htmlEncode}'}}], hidden:true}], initialize:function() {
  var me = this, vm = me.getViewModel(), record = me.getNotificationRecord(), notificationToolbarLabel = null, notificationFlagButton = null;
  me.callParent(arguments);
  vm.set('label', record.label ? record.label : '');
  if (record.labelKey) {
    vm.bind('{i18n.' + record.labelKey + '}', function(v) {
      vm.set('labelTemplate', v);
    });
  } else {
    vm.set('labelTemplate', '');
  }
  vm.set('labelArgs', record.labelArgs ? record.labelArgs : []);
  vm.set('detail', record.detail ? record.detail : '');
  if (record.detailKey) {
    vm.bind('{i18n.' + record.detailKey + '}', function(v) {
      vm.set('detailTemplate', v);
    });
  } else {
    vm.set('detailTemplate', '');
  }
  vm.set('detailArgs', record.detailArgs ? record.detailArgs : []);
  notificationToolbarLabel = me.lookupReference('notificationToolbarLabel');
  if (record['new']) {
    if (record.time) {
      vm.set('notificationTime', record.time);
    }
    notificationToolbarLabel.setBind({html:'\x3cdiv class\x3d"time abp-time-ago" data-time\x3d"{notificationTime:htmlEncode}"\x3e{notificationTime:formatRelativeTime}\x3c/div\x3e'});
    me.lookupReference('notificationUnreadButton').setHidden(true);
    me.lookupReference('notificationRemoveButton').setHidden(true);
  } else {
    notificationToolbarLabel.setBind({html:'{i18n.abp_notifications_label_read:htmlEncode} \x3cspan class\x3d"icon-check"\x3e\x3c/span\x3e'});
    me.lookupReference('notificationReadButton').setHidden(true);
    me.lookupReference('notificationDownloadButton').setHidden(true);
  }
  if (record.flagged) {
    me.addCls('abp-notification-flagged');
    notificationFlagButton = me.lookupReference('notificationFlagButton');
    notificationFlagButton.setPressed(true);
    notificationFlagButton.setIconCls('icon-flag-filled');
  }
  if (record.event) {
    me.lookupReference('notificationLinkButton').addCls('has-link');
  } else {
    me.lookupReference('notificationLinkButton').disable();
  }
  if (record.downloadEvent) {
    me.lookupReference('notificationDownloadButton').setHidden(false);
  }
}});
Ext.define('ABP.view.session.notifications.NotificationsBaseController', {extend:'ABP.controllers.base.rightPane.RightPanePanelController', requires:['ABP.view.session.notifications.Notification'], listen:{controller:{'*':{abp_notifications_add:'__addNotifications', abp_notifications_remove:'__removeNotifications', abp_notifications_read:'__markNotificationsRead', abp_notifications_unread:'__markNotificationsUnread'}}, component:{'abp-notification':{notificationRead:'__markNotificationRead', notificationUnread:'__markNotificationUnread', 
notificationFlag:'__flagNotification', notificationUnflag:'__unflagNotification', notificationRemove:'__removeNotification', notificationKeyNav:'handleNavKeyDown'}}}, firstLoad:true, init:function() {
  var me = this, vm = me.getViewModel(), notificationSettings = ABP.util.Config.getSessionConfig().settings.notifications;
  vm.set('maxHistory', notificationSettings.maxHistory);
  vm.set('clearBadgeOnActivate', notificationSettings.clearBadgeOnActivate);
  vm.set('ariaNotificationsLabel', 'No new notifications');
  me.fireEvent('container_rightPane_updateBadge', 'abp-notifications', {value:0, priority:ABP.util.Constants.badgePriority.Info});
  ABP.util.RelativeTime.start();
}, __addNotifications:function(source, sourceKey, newNotifications) {
  var me = this, vm = me.getViewModel(), maxHistory = vm.get('maxHistory'), notifications = vm.get('notifications'), notificationRecordToRemove = null;
  Ext.Array.each(newNotifications, function(notification) {
    if (notifications.length === maxHistory) {
      notificationRecordToRemove = notifications.pop();
      me.__removeNotificationFromDisplay(me.__getNotificationComponentForRecord(notificationRecordToRemove));
    }
    notification.source = source;
    notification.sourceKey = sourceKey;
    notifications.unshift(notification);
    me.__addNotificationToDisplay(notification, !me.firstLoad);
  });
  me.firstLoad = false;
  vm.set('notifications', notifications);
  if (notifications.length > 0) {
    me.__setActiveCardItem(2);
  }
}, __addNotificationToDisplay:function(notification, isNew) {
  var me = this, notificationContainer = me.lookupReference('notificationContainer'), sourcePanel = notificationContainer.down('panel[sourcePanelName\x3d"sourcepanel-' + notification.source + '"]'), sourcePanelViewModel, categoryPanel = null, collapseConfig;
  if (!sourcePanel) {
    if (ABP.util.Common.getModern()) {
      collapseConfig = {collapsible:{collapseToolText:null, expandToolText:null, titleCollapse:true, collapsed:false, tool:{automationCls:'notifications-' + notification.source + '-collapse-tool'}}};
    } else {
      collapseConfig = {collapsible:true, collapsed:false, collapseToolText:null, expandToolText:null, titleCollapse:true};
    }
    sourcePanel = notificationContainer.add({xtype:'panel', sourcePanelName:'sourcepanel-' + notification.source, id:'notificationSourcePanel', tabIndex:-1, header:{cls:'abp-notifications-source-panel-header', listeners:{click:me.handleHeaderClick, tap:{element:'element', scope:me, fn:me.handleHeaderClick}}}, viewModel:{type:'abp-notifications-source-panel'}, cls:'abp-notifications-source-panel a-abp-notifications-source-panel', bind:{title:'\x3cspan class\x3d"abp-notification-panel-title"\x3e' + 
    (notification.sourceKey ? '{i18n.' + notification.sourceKey + ':htmlEncode}' : Ext.String.htmlEncode(notification.source)) + '\x3c/span\x3e{sourceNotificationCountDisplay}{sourceNotificationFlagDisplay}', hidden:'{hidePanel}'}, items:[{xtype:'container', reference:'notificationNavComponent', items:[{xtype:'label', id:'notificationsNavLabel', bind:{ariaLabel:'{ariaMainNotificationLabel:ariaEncode}'}}], tabIndex:0, focusable:true, listeners:{keydown:{element:Ext.isModern ? 'element' : 'el', scope:me, 
    fn:me.handleNavKeyDown}}}]});
  }
  sourcePanelViewModel = sourcePanel.getViewModel();
  if (notification['new']) {
    sourcePanelViewModel.incrementUnreadNotificationCount();
    me.fireEvent('container_rightPane_incrementBadge', 'abp-notifications');
  } else {
    sourcePanelViewModel.incrementHistoryNotificationCount();
  }
  if (notification.flagged) {
    sourcePanelViewModel.incrementFlaggedNotificationCount();
  }
  categoryPanel = sourcePanel.down('panel[categoryPanelName\x3d"categorypanel-' + notification.category + '"]');
  if (!categoryPanel) {
    categoryPanel = sourcePanel.add({xtype:'abp-notifications-category-panel', categoryPanelName:'categorypanel-' + notification.category, categoryName:notification.category, categoryNameKey:notification.categoryKey});
  }
  categoryPanel.addNotification(notification, isNew);
}, __removeNotifications:function(removeNotifications) {
  var me = this, vm = me.getViewModel(), notifications = vm.get('notifications');
  Ext.Array.each(removeNotifications, function(removeNotification) {
    Ext.Array.each(notifications, function(notification) {
      if (notification.uniqueId === removeNotification.uniqueId) {
        me.__removeNotificationFromDisplay(me.__getNotificationComponentForRecord({uniqueId:notification.uniqueId}));
        return false;
      }
    });
    notifications = notifications.filter(function(el) {
      return el.uniqueId !== removeNotification.uniqueId;
    });
  });
  vm.set('notifications', notifications);
  if (notifications.length === 0) {
    me.__setActiveCardItem(1);
  }
}, __removeNotificationFromDisplay:function(notificationComponent) {
  var me = this, view = me.getView(), record = notificationComponent.getNotificationRecord(), sourcePanel = view.down('panel[sourcePanelName\x3d"sourcepanel-' + record.source + '"]'), sourcePanelViewModel = sourcePanel.getViewModel(), categoryPanel = sourcePanel.down('panel[categoryPanelName\x3d"categorypanel-' + record.category + '"]');
  if (record['new']) {
    sourcePanelViewModel.decrementUnreadNotificationCount();
    me.fireEvent('container_rightPane_decrementBadge', 'abp-notifications');
  } else {
    sourcePanelViewModel.decrementHistoryNotificationCount();
  }
  if (record.flagged) {
    sourcePanelViewModel.decrementFlaggedNotificationCount();
  }
  categoryPanel.removeNotification(notificationComponent);
}, __markNotificationRead:function(notificationComponent) {
  var me = this, vm = me.getViewModel(), readNotification = notificationComponent.getNotificationRecord(), notifications = vm.get('notifications'), notificationContainer = me.lookupReference('notificationContainer'), sourcePanel = notificationContainer.down('panel[sourcePanelName\x3d"sourcepanel-' + readNotification.source + '"]'), sourcePanelViewModel = sourcePanel.getViewModel(), categoryPanel = sourcePanel.down('panel[categoryPanelName\x3d"categorypanel-' + readNotification.category + '"]');
  Ext.Array.each(notifications, function(notification) {
    if (notification.uniqueId === readNotification.uniqueId) {
      if (notification['new']) {
        notification['new'] = false;
        sourcePanelViewModel.incrementHistoryNotificationCount();
        sourcePanelViewModel.decrementUnreadNotificationCount();
        categoryPanel.markNotificationRead(notificationComponent);
        me.fireEvent('container_rightPane_decrementBadge', 'abp-notifications');
      }
      return false;
    }
  });
  vm.set('notifications', notifications);
}, __markNotificationsRead:function(clearNotifications) {
  var me = this;
  Ext.Array.each(clearNotifications, function(clearNotification) {
    me.__markNotificationRead(me.__getNotificationComponentForRecord({uniqueId:clearNotification.uniqueId}));
  });
}, __markNotificationUnread:function(notificationComponent) {
  var me = this, vm = me.getViewModel(), readNotification = notificationComponent.getNotificationRecord(), notifications = vm.get('notifications'), notificationContainer = me.lookupReference('notificationContainer'), sourcePanel = notificationContainer.down('panel[sourcePanelName\x3d"sourcepanel-' + readNotification.source + '"]'), sourcePanelViewModel = sourcePanel.getViewModel(), categoryPanel = sourcePanel.down('panel[categoryPanelName\x3d"categorypanel-' + readNotification.category + '"]');
  Ext.Array.each(notifications, function(notification) {
    if (notification.uniqueId === readNotification.uniqueId) {
      if (!notification['new']) {
        notification['new'] = true;
        sourcePanelViewModel.incrementUnreadNotificationCount();
        sourcePanelViewModel.decrementHistoryNotificationCount();
        categoryPanel.markNotificationUnread(notificationComponent);
        me.fireEvent('container_rightPane_incrementBadge', 'abp-notifications');
      }
      return false;
    }
  });
  vm.set('notifications', notifications);
}, __markNotificationsUnread:function(newNotifications) {
  var me = this;
  Ext.Array.each(newNotifications, function(newNotification) {
    me.__markNotificationUnread(me.__getNotificationComponentForRecord({uniqueId:newNotification.uniqueId}));
  });
}, __getNotificationComponentForRecord:function(notification) {
  var me = this, notificationContainer = me.lookupReference('notificationContainer');
  return notificationContainer.down('abp-notification[notificationUniqueId\x3d"' + notification.uniqueId + '"]');
}, __flagNotification:function(notificationComponent) {
  var me = this, vm = me.getViewModel(), view = me.getView(), record = notificationComponent.getNotificationRecord(), notifications = vm.get('notifications'), sourcePanel = view.down('panel[sourcePanelName\x3d"sourcepanel-' + record.source + '"]');
  Ext.Array.each(notifications, function(notification) {
    if (notification.uniqueId === record.uniqueId) {
      notification.flagged = true;
      return false;
    }
  });
  vm.set('notifications', notifications);
  sourcePanel.getViewModel().incrementFlaggedNotificationCount();
}, __unflagNotification:function(notificationComponent) {
  var me = this, vm = me.getViewModel(), view = me.getView(), record = notificationComponent.getNotificationRecord(), notifications = vm.get('notifications'), sourcePanel = view.down('panel[sourcePanelName\x3d"sourcepanel-' + record.source + '"]');
  Ext.Array.each(notifications, function(notification) {
    if (notification.uniqueId === record.uniqueId) {
      notification.flagged = false;
      return false;
    }
  });
  vm.set('notifications', notifications);
  sourcePanel.getViewModel().decrementFlaggedNotificationCount();
}, __removeNotification:function(notificationComponent) {
  var me = this, record = notificationComponent.getNotificationRecord();
  me.__removeNotifications([record]);
}, privates:{handleHeaderClick:function(cmp, e) {
  if (e.target && e.target.matches('.abp-notification-panel-flag')) {
    var vm = this.lookupViewModel();
    vm.set('showFlaggedOnly', !vm.data.showFlaggedOnly);
  } else {
    if (e.matches('.abp-notification-panel-flag')) {
      var vm = this.getViewModel();
      vm.set('showFlaggedOnly', !vm.data.showFlaggedOnly);
    }
  }
}, handleNavKeyDown:function(evt, cmp) {
  var me = this;
  evt.stopEvent();
  var categoryNavs = Ext.ComponentQuery.query('#notificationCategoryNavComponent');
  if (categoryNavs && categoryNavs.length > 0) {
    categoryNavs[0].focus();
  }
}}});
Ext.define('ABP.view.session.notifications.NotificationsCategoryController', {extend:'Ext.app.ViewController', alias:'controller.abp-notifications-category-panel', listen:{controller:{'*':{notificationCategory_handleKeyDown:'handleCategoryKeyDown'}}}, addNotification:function(notificationRecord, isNew) {
  var me = this, vm = me.getViewModel(), addToContainer, notificationComponent;
  notificationComponent = {xtype:'abp-notification', justAdded:isNew, componentCls:'a-abp-notification-' + notificationRecord.uniqueId, notificationUniqueId:notificationRecord.uniqueId, notificationRecord:notificationRecord, listeners:{notificationMarkReadClick:'onNotificationMarkReadClick'}, bind:{filterFlagged:'{showFlaggedOnly}', category:'{categoryName}'}};
  if (notificationRecord['new']) {
    vm.incrementUnreadNotificationCount();
    addToContainer = me.lookupReference('unreadNotificationContainer');
  } else {
    vm.incrementHistoryNotificationCount();
    addToContainer = me.lookupReference('historyNotificationContainer');
  }
  vm.notify();
  addToContainer.insert(0, notificationComponent);
}, removeNotification:function(notification) {
  var me = this, vm = me.getViewModel(), removeFromContainer;
  if (notification.getNotificationRecord()['new']) {
    vm.decrementUnreadNotificationCount();
    removeFromContainer = me.lookupReference('unreadNotificationContainer');
  } else {
    vm.decrementHistoryNotificationCount();
    removeFromContainer = me.lookupReference('historyNotificationContainer');
  }
  removeFromContainer.remove(notification);
}, markNotificationRead:function(notification) {
  var me = this, notificationRecord = notification.getNotificationRecord();
  me.removeNotification(notification);
  notificationRecord['new'] = false;
  me.addNotification(notificationRecord);
}, markNotificationUnread:function(notification) {
  var me = this, notificationRecord = notification.getNotificationRecord();
  me.removeNotification(notification);
  notificationRecord['new'] = true;
  me.addNotification(notificationRecord);
}, onShowHistoryClick:function() {
  var me = this, vm = me.getViewModel();
  vm.set('displayHistory', true);
}, onHideHistoryClick:function() {
  var me = this, vm = me.getViewModel();
  vm.set('displayHistory', false);
}, handleCategoryKeyDown:function(evt, cmp, args, categoryName) {
  if (categoryName && categoryName != this.getView().categoryName) {
    evt.stopEvent();
    return;
  }
  var me = this, vm = me.getViewModel(), navIndex = vm.get('currentNavIndex'), historyShown = vm.get('displayHistory'), unread = vm.get('unreadNotificationCount'), history = vm.get('historyNotificationCount'), total = vm.get('displayHistory') ? unread + history : unread;
  if (evt.keyCode === 40 || evt.keyCode === 38) {
    evt.stopEvent();
    if (evt.keyCode === 40) {
      if (navIndex + 1 < total) {
        vm.set('currentNavIndex', navIndex + 1);
        var unreadNotifications = me.lookupReference('unreadNotificationContainer').items.items;
        if (historyShown) {
          var historyNotifications = me.lookupReference('historyNotificationContainer').items.items;
          if (navIndex + 1 > unreadNotifications.length) {
            historyNotifications[navIndex + 1 - unreadNotifications.length].lookupReference('notificationSpecificNavComponent').focus();
          }
          evt.stopEvent();
          return;
        }
        evt.stopEvent();
        unreadNotifications[navIndex + 1].lookupReference('notificationSpecificNavComponent').focus();
      } else {
        if (!categoryName && total > 0) {
          var unreadNotifications = me.lookupReference('unreadNotificationContainer').items.items;
          if (historyShown) {
            var historyNotifications = me.lookupReference('historyNotificationContainer').items.items;
            historyNotifications[navIndex - unreadNotifications.length].lookupReference('notificationSpecificNavComponent').focus();
            evt.stopEvent();
            return;
          }
          evt.stopEvent();
          unreadNotifications[navIndex].lookupReference('notificationSpecificNavComponent').focus();
        } else {
          var catPanels = this.getView().up().query('abp-notifications-category-panel');
          var currIdx = catPanels.indexOf(this.getView());
          if (currIdx + 1 < catPanels.length) {
            catPanels[currIdx + 1].lookupReference('notificationCategoryNavComponent').focus();
          }
          evt.stopEvent();
        }
      }
    }
    if (evt.keyCode === 38) {
      if (navIndex > 0) {
        vm.set('currentNavIndex', navIndex - 1);
        var unreadNotifications = me.lookupReference('unreadNotificationContainer').items.items;
        if (historyShown) {
          var historyNotifications = me.lookupReference('historyNotificationContainer').items;
          historyNotifications[navIndex - 1 - unreadNotifications.length].lookupReference('notificationSpecificNavComponent').focus();
          evt.stopEvent();
          return;
        }
        evt.stopEvent();
        unreadNotifications[navIndex - 1].lookupReference('notificationSpecificNavComponent').focus();
      } else {
        var catPanels = this.getView().up().query('abp-notifications-category-panel');
        var currIdx = catPanels.indexOf(this.getView());
        if (currIdx - 1 >= 0) {
          catPanels[currIdx - 1].lookupReference('notificationCategoryNavComponent').focus();
        }
        evt.stopEvent();
      }
    }
  }
}, onCategoryNavFocus:function() {
  var me = this, vm = me.getViewModel();
  vm.set('currentNavIndex', -1);
}});
Ext.define('ABP.view.session.notifications.NotificationsCategoryPanelViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abp-notifications-category-panel', data:{unreadNotificationCount:0, historyNotificationCount:0, displayHistory:false, categoryName:'', currentNavIndex:0}, formulas:{hidePanel:function(get) {
  return get('unreadNotificationCount') + get('historyNotificationCount') === 0;
}, hideShowHistoryComponent:function(get) {
  return get('historyNotificationCount') === 0 || get('displayHistory');
}, hideHideHistoryComponent:function(get) {
  return get('historyNotificationCount') === 0 || !get('displayHistory');
}, categoryNotificationCountDisplay:function(get) {
  var notificationCount = get('unreadNotificationCount');
  if (notificationCount > 0) {
    if (notificationCount > 99) {
      notificationCount = '99+';
    }
    return '\x3cspan class\x3d"abp-notification-panel-badge"\x3e' + notificationCount + '\x3c/span\x3e';
  }
  return '';
}, ariaCategoryNotificationLabel:function(get) {
  var unreadCount = get('unreadNotificationCount');
  var historyCount = get('historyNotificationCount');
  var label = get('categoryName');
  label += ' unread ' + unreadCount;
  label += historyCount > 0 ? ' history ' + historyCount : '';
  return label;
}, totalNotificationCount:function(get) {
  var unreadCount = get('unreadNotificationCount');
  var historyCount = get('historyNotificationCount');
  var total = get('displayHistory') ? unreadCount + historyCount : unreadCount;
  var idx = get('currentNavIndex') + 1;
  return ' list item ' + idx + ' of ' + total;
}}, incrementUnreadNotificationCount:function() {
  var me = this;
  me.set('unreadNotificationCount', me.get('unreadNotificationCount') + 1);
}, decrementUnreadNotificationCount:function() {
  var me = this;
  me.set('unreadNotificationCount', me.get('unreadNotificationCount') - 1);
}, incrementHistoryNotificationCount:function() {
  var me = this;
  me.set('historyNotificationCount', me.get('historyNotificationCount') + 1);
}, decrementHistoryNotificationCount:function() {
  var me = this, historyNotificationCount = me.get('historyNotificationCount');
  historyNotificationCount--;
  me.set('historyNotificationCount', historyNotificationCount);
  if (historyNotificationCount === 0) {
    me.set('displayHistory', false);
  }
}});
Ext.define('ABP.view.session.notifications.NotificationsSourcePanelViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abp-notifications-source-panel', data:{unreadNotificationCount:0, historyNotificationCount:0, flaggedNotificationCount:0, showFlaggedOnly:false}, formulas:{hidePanel:function(get) {
  return get('unreadNotificationCount') + get('historyNotificationCount') === 0;
}, sourceNotificationCountDisplay:function(get) {
  var notificationCount = get('unreadNotificationCount');
  if (notificationCount > 0) {
    if (notificationCount > 99) {
      notificationCount = '99+';
    }
    return '\x3cspan class\x3d"abp-notification-panel-badge"\x3e' + notificationCount + '\x3c/span\x3e';
  }
  return '';
}, sourceNotificationFlagDisplay:function(get) {
  var flagCount = get('flaggedNotificationCount');
  var flaggedOnly = get('showFlaggedOnly');
  if (flagCount === 0) {
    this.set('showFlaggedOnly', false);
    return '';
  }
  var html = '\x3cspan class\x3d"abp-notification-panel-flag ';
  if (flaggedOnly) {
    html += 'abp-notification-flagged-only';
  }
  html += '"\x3e' + flagCount + '\x3c/span\x3e';
  return html;
}, ariaMainNotificationLabel:function(get) {
  return 'Notifications unread ' + get('unreadNotificationCount') + ' flagged ' + get('flaggedNotificationCount');
}}, incrementUnreadNotificationCount:function() {
  var me = this;
  me.set('unreadNotificationCount', me.get('unreadNotificationCount') + 1);
}, decrementUnreadNotificationCount:function() {
  var me = this;
  me.set('unreadNotificationCount', me.get('unreadNotificationCount') - 1);
}, incrementHistoryNotificationCount:function() {
  var me = this;
  me.set('historyNotificationCount', me.get('historyNotificationCount') + 1);
}, decrementHistoryNotificationCount:function() {
  var me = this;
  me.set('historyNotificationCount', me.get('historyNotificationCount') - 1);
}, incrementFlaggedNotificationCount:function() {
  var me = this;
  me.set('flaggedNotificationCount', me.get('flaggedNotificationCount') + 1);
}, decrementFlaggedNotificationCount:function() {
  var me = this;
  me.set('flaggedNotificationCount', me.get('flaggedNotificationCount') - 1);
}});
Ext.define('ABP.view.session.notifications.NotificationsViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abp-notifications', data:{notifications:[], maxHistory:null, clearBadgeOnActivate:null}});
Ext.define('ABP.view.session.rightPane.RightPaneBaseController', {extend:'Ext.app.ViewController', listen:{controller:{'*':{rightPane_addElement:'addElement', rightPane_toggle:'togglePane', rightPane_toggleTab:'toggleTab', rightPane_initTab:'__initTab', rightPane_handleKeyPress:'handleKeyPress', session_click:'__handleSessionClick'}}}, togglePane:function() {
  this.fireEvent('session_toggleRightPane');
}, addElement:function(pane) {
  var me = this;
  var view = me.getView();
  var viewModel = me.getViewModel();
  if (viewModel.get('rightPaneOpen') === false) {
    me.togglePane();
  }
  var activeTab = view.getActiveTab();
  if (Ext.isString(pane)) {
    pane = {xtype:pane};
  }
  if (pane) {
    activeTab.add(pane);
  }
}, __handleSessionClick:function(e) {
  var me = this;
  var view = me.getView();
  var sessionCanvas = view.up();
  var sessionCanvasVM = sessionCanvas.getViewModel();
  var isExpanded = sessionCanvasVM.get('rightPaneOpen');
  var mainMenu = sessionCanvas.down('#mainMenu').el.dom;
  var mainMenuClicked = e.target == mainMenu || mainMenu.contains(e.target);
  var rightPane = sessionCanvas.down('#rightPane').el.dom;
  var rightPaneClicked = e.target == rightPane || rightPane.contains(e.target);
  var settingsButton = sessionCanvas.down('#rpButton').el.dom;
  var settingsButtonClicked = e.target == settingsButton || settingsButton.contains(e.target);
  var menuButton = sessionCanvas.down('#toolbar-button-menu');
  var menuButtonEl;
  if (menuButton) {
    menuButtonEl = menuButton.el.dom;
  }
  var menuButtonClicked = e.target == menuButtonEl || menuButtonEl.contains(e.target);
  if (!mainMenuClicked && !rightPaneClicked && !settingsButtonClicked && !menuButtonClicked && isExpanded) {
    me.fireEvent('session_closeRightPane');
  }
}, __createTab:function(config, tabItemId) {
  var ariaLabel = null;
  var ret = {itemId:tabItemId, title:config.title, titleKey:config.titleKey, unqiueId:config.uniqueId, layout:'fit', scrollable:'vertical', items:[{xtype:config.xtype}]};
  if (config.tooltipKey) {
    ret.bind = {'ariaLabel':'{i18n.' + config.tooltipKey + ':htmlEncode}'};
  } else {
    if (config.tooltip) {
      ret.ariaLabel = config.tooltip;
    }
  }
  return ret;
}, __getPanelConfig:function(panelItemId) {
  var me = this;
  var view = me.getView();
  var viewModel = view.getViewModel();
  var rightPaneTabs = viewModel.get('rightPaneTabs');
  var config = {};
  var i;
  for (i = 0; i < rightPaneTabs.length; i++) {
    if (rightPaneTabs[i].uniqueId === panelItemId) {
      config = rightPaneTabs[i];
      break;
    }
  }
  return config;
}});
Ext.define('ABP.view.session.rightPane.RightPaneModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.rightpanemodel', data:{tabPrefix:'rightPaneTab_', menuWidth:330}, formulas:{micro:{get:function() {
  var width;
  var height;
  var ssThresh;
  var ret = false;
  var isModern = Ext.os.deviceType === 'Phone';
  if (isModern) {
    width = ABP.util.Common.getWindowWidth();
    height = ABP.util.Common.getWindowHeight();
    if (isModern) {
      ret = true;
    }
    this.setMenu(ret);
  }
  return ret;
}}, iconCls:{bind:'{profilePhoto}', get:function(photoUrl) {
  if (photoUrl) {
    return 'profile-picture';
  }
  return 'icon-user';
}}}, setMenu:function(micro) {
  var me = this;
  var isClassic = Ext.os.deviceType === 'Tablet' || Ext.os.deviceType === 'Desktop';
  if (!micro) {
    if (isClassic) {
      me.set('menuWidth', 250);
    } else {
      me.set('menuWidth', 300);
    }
  } else {
    me.set('menuWidth', '100%');
  }
}});
Ext.define('ABP.view.session.settings.SettingsContainerController', {extend:'ABP.controllers.base.rightPane.RightPanePanelController', alias:'controller.settingscontainer', listen:{controller:{'*':{closeActiveSettingsMenu:'toggleMenuButton', rightPane_toggleTab:'__toggleTab', session_toggleRightPane:'__toggleTab'}}}, init:function() {
  this.constructSettingsMenu();
}, constructSettingsMenu:function() {
  var me = this;
  var settings = ABP.util.Config.getSessionConfig().settings;
  if (!settings) {
    return;
  }
  me.__initSessionTimer();
  me.__setVisibleSettings(settings);
  me.__buildDefaultSettingsView();
  me.__createAppSettings(settings.appSettings);
  me.__buildFavoritesManagerView(settings);
  me.__buildHeadlinesManagerView(settings);
  me.__buildThemeOptions(settings);
  me.__buildLanguageOptions(settings);
  me.__buildAboutView(settings);
  me.__buildHelpView(settings);
  me.__buildLogsView(settings);
  me.__buildOfflineModeToggle();
  me.__buildSignOffButton(settings);
}, closeRightPane:function() {
  this.fireEvent('rightPane_toggle');
}, __initSessionTimer:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var sessionTimeLabel = view.lookupReference('sessionTimeLabel');
  var taskRunner = new Ext.util.TaskRunner;
  var sessionTimeLabel = view.lookupReference('sessionTimeLabel');
  sessionTimeLabel.task = taskRunner.newTask({run:function(vm) {
    try {
      vm.set('now', Date.now());
    } catch (error) {
    }
  }, interval:1000, fireOnStart:true, args:[vm]});
  sessionTimeLabel.task.start();
}, __setVisibleSettings:function(settings) {
  var me = this;
  var vm = me.getViewModel();
  if (settings.settingsPage && Ext.isBoolean(me.__boolConverter(settings.settingsPage.showEnvironment))) {
    vm.set('showEnvironment', settings.settingsPage.showEnvironment);
  }
  if (settings.settingsPage && Ext.isBoolean(me.__boolConverter(settings.settingsPage.showSessionTimer))) {
    vm.set('showSessionTimer', settings.settingsPage.showSessionTimer);
  }
  if (settings.settingsPage && Ext.isBoolean(me.__boolConverter(settings.settingsPage.enableUser))) {
    vm.set('showUserName', settings.settingsPage.enableUser);
  }
}, __buildDefaultSettingsView:function() {
  var me = this, view = me.getView(), displayName = ABP.util.Config.getDisplayName(), hideUserName = displayName === ABP.util.Config.getUsername();
  var canEditProfile = ABP.util.Config.getSessionConfig().settings.userConfig.enableEditProfile;
  var height = 40, ariaRole = 'presentation', focusable = false, cls = 'x-unselectable settings-container-profile-container content-header', overCls = '', tooltip = '';
  if (!hideUserName) {
    cls += ' large-profile-icon';
  }
  if (canEditProfile) {
    height = 70;
    ariaRole = 'button';
    focusable = true;
    cls += ' editable';
    overCls = 'user-profile-over';
    tooltip = ABP.util.Common.geti18nString('sessionMenu_editPreferences');
  }
  var userContainer = {xtype:'container', overCls:overCls, cls:cls, height:height, focusable:focusable, ariaRole:ariaRole, tooltip:tooltip, tabIndex:0, bind:{hidden:'{!showUserName}'}, layout:{type:'hbox', align:'center', pack:'start'}, items:[{xtype:'abpprofileimage', bind:{src:'{profilePhoto}'}, margin:'0 0 0 7', width:height - 10, height:height - 10}, {xtype:'container', layout:'vbox', flex:1, items:[{xtype:'label', margin:'0 0 0 5', flex:2, bind:{html:displayName ? Ext.String.htmlEncode(displayName) : 
  Ext.String.htmlEncode(ABP.util.Config.getUsername())}}, {xtype:'label', margin:'0 0 0 5', flex:1, cls:'user-name', bind:{html:Ext.String.htmlEncode(ABP.util.Config.getUsername()), hidden:hideUserName}}]}]};
  if (canEditProfile) {
    if (ABP.util.Common.getModern()) {
      userContainer.listeners = {click:{element:'element', fn:function() {
        me.onUserProfileClick(this);
      }}};
    } else {
      userContainer.listeners = {element:'el', click:function(e) {
        me.onUserProfileClick(this);
      }, keydown:function(f) {
        if (f.getKey() === f.ENTER) {
          me.onUserProfileClick(this);
        } else {
          if (f.getKey() === f.ESC) {
            me.onCloseUserSettings(this);
          }
        }
      }};
    }
  }
  view.add(userContainer);
}, onCloseUserSettings:function(cmp) {
  this.fireEvent('rightPane_toggle');
}, onUserProfileClick:function(cmp) {
  this.fireEvent(ABP.Events.userProfileEdit, cmp.component);
}, __buildFavoritesManagerView:function(settings) {
  var me = this;
  var view = me.getView();
  if (settings.enableMenuFavorites) {
    view.add({bind:{text:'{i18n.sessionMenu_manageFavorites:htmlEncode}', ariaLabel:'{i18n.sessionMenu_manageFavorites:ariaEncode}'}, automationCls:'toolusermenu-favorites', handler:'launchFavoritesManager'});
  }
}, __buildHeadlinesManagerView:function(settings) {
  var me = this;
  var view = me.getView();
  if (settings.settingsPage && me.__boolConverter(settings.settingsPage.enableHeadlinesManager)) {
    if (ABP.util.Common.getModern()) {
      return;
    }
    me.fireEvent('headline_manager_initialize', Ext.create('Ext.data.Store', {storeId:'ABPHeadlines', autoDestroy:false, fields:['actionText', 'actionTextKey', 'message', 'messageKey', {name:'startTime', type:'date'}, {name:'endTime', type:'date'}, {name:'published', type:'boolean'}, {name:'priority', type:'int'}, 'uniqueId']}));
    view.add({bind:{text:'{i18n.sessionMenu_manageHeadlines:htmlEncode}', ariaLabel:'{i18n.sessionMenu_manageHeadlines:ariaEncode}'}, automationCls:'toolusermenu-headlines', handler:'launchHeadlinesManager'});
  }
}, __buildAboutView:function(settings) {
  var me = this;
  var view = me.getView();
  if (settings.enableAbout || settings.settingsPage.enableAbout) {
    view.add({bind:{text:'{i18n.sessionMenu_about:htmlEncode}', ariaLabel:'{i18n.sessionMenu_about:ariaEncode}'}, automationCls:'toolusermenu-about', handler:'launchAbout'});
  }
}, __buildHelpView:function(settings) {
  var me = this;
  var view = me.getView();
  if (settings.settingsPage.enableHelp) {
    view.add({bind:{text:'{i18n.sessionMenu_help:htmlEncode}', ariaLabel:'{i18n.sessionMenu_help:ariaEncode}'}, automationCls:'toolusermenu-help', handler:'launchHelp'});
  }
}, __buildLogsView:function(settings) {
  var me = this;
  var view = me.getView();
  if (settings.settingsPage.enableLoggerView) {
    view.add({bind:{text:'{i18n.sessionMenu_logger:htmlEncode}', ariaLabel:'{i18n.sessionMenu_logger:ariaEncode}'}, automationCls:'toolusermenu-logger', handler:'launchLogger'});
  }
}, __buildThemeOptions:function(settings) {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var themeOptions = [];
  var i = 0;
  if (settings.settingsPage.enableThemeChange) {
    if (Ext.theme && Ext.theme.subThemeList) {
      var themes = Ext.theme.subThemeList;
      var selected = ABP.util.LocalStorage.getForLoggedInUser('ChosenTheme');
      if (themes) {
        for (i = 0; i < themes.length; ++i) {
          var title = themes[i].split('aptean-theme-')[1];
          title = ABP.util.String.makeHumanReadable(title, '-');
          themeOptions.push({title:title, name:'themes', automationCls:title + '-radio', value:themes[i], checked:selected && selected === themes[i]});
        }
        view.add(me.__createRadialSetting({titleKey:'sessionMenu_theme', automationCls:'toolusermenu-themes', cls:'theme-option', ui:'radiobutton', appId:'container', event:'switchTheme', addToggle:true, options:themeOptions, layout:Ext.toolkit === 'classic' ? 'table' : 'hbox'}));
      }
    }
  }
}, __buildLanguageOptions:function(settings) {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var langmenu = [];
  var currentLanguage = ABP.util.Config.getLanguage();
  var i = 0;
  var env;
  var languages;
  if (settings.settingsPage.enableLanguages) {
    env = vm.get('selected.environment');
    if (env) {
      env = vm.get('main_environmentStore').getById(env);
      if (env && env.data && env.data.languages) {
        languages = env.data.languages;
        for (i = 0; i < languages.length; ++i) {
          langmenu.push({title:Ext.String.htmlEncode(languages[i].name), name:'languages', value:languages[i].key, checked:languages[i].key === currentLanguage});
        }
        view.add(me.__createRadialSetting({titleKey:'sessionMenu_languages', automationCls:'toolusermenu-languages', cls:'language-option', appId:'container', event:'switchLanguage', options:langmenu, layout:'vbox'}));
      }
    }
  }
}, __buildOfflineModeToggle:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  if (ABP.util.LocalStorage.get('OfflineBootstrap')) {
    if (vm.get('bootstrapConf.hideOfflineModeToggle') === true) {
      return;
    }
    if (vm.get('bootstrapConf.offlineAuthenticationType') === 1) {
      view.add({bind:{text:'{i18n.sessionMenu_setOfflinePassword:htmlEncode}', hidden:'{offlineMode}', ariaLabel:'{i18n.sessionMenu_setOfflinePassword}'}, cls:'settings-container-button', ui:'menuitem', uiCls:'light', textAlign:'left', automationCls:'toolusermenu-setofflinepassword', handler:'setOfflinePassword'});
    }
    view.add({bind:{text:'{goOnlineText:htmlEncode}', ariaLabel:'{goOnlineText:ariaEncode:ariaEncode}'}, cls:'settings-container-button', ui:'menuitem', uiCls:'light', textAlign:'left', automationCls:'toolusermenu-swtichonlinestate', handler:'switchOnlineState'});
  }
}, __buildSignOffButton:function(settings) {
  var me = this;
  var view = me.getView();
  if (settings.settingsPage.enableSignOff) {
    view.add({bind:{text:'{i18n.sessionMenu_signoff:htmlEncode}', ariaLabel:'{i18n.sessionMenu_signoff:ariaEncode}'}, automationCls:'toolusermenu-signoff', handler:'logout'});
  }
}, __toggleTab:function(tab) {
  var me = this;
  var sessionTimeLabel, startTask;
  var view = me.getView();
  var vm = view.getViewModel();
  var rightPaneOpen = vm.get('rightPaneOpen');
  sessionTimeLabel = me.lookupReference('sessionTimeLabel');
  me.toggleMenuButton(tab);
  if (Ext.toolkit === 'modern') {
    startTask = rightPaneOpen;
  } else {
    if (tab) {
      startTask = tab.uniqueId === 'abp-settings';
    }
    if (rightPaneOpen === false) {
      startTask = false;
    }
  }
  if (startTask === true && sessionTimeLabel.task.stopped === true) {
    sessionTimeLabel.task.start();
  } else {
    if (startTask === false && sessionTimeLabel.task.stopped === false) {
      sessionTimeLabel.task.stop();
    }
  }
}, launchFavoritesManager:function() {
  if (Ext.toolkit === 'modern') {
    this.fireEvent('rightPane_toggle');
  }
  this.fireEvent('container_showSettings', 'favoritesManager');
}, launchHeadlinesManager:function() {
  if (Ext.toolkit === 'modern') {
    this.fireEvent('rightPane_toggle');
  }
  this.fireEvent('container_showSettings', 'headlinesManager');
}, launchHelp:function() {
  if (Ext.toolkit === 'modern') {
    this.fireEvent('rightPane_toggle');
  }
  this.fireEvent('container_showSettings', 'helpview');
}, launchAbout:function() {
  if (Ext.toolkit === 'modern') {
    this.fireEvent('rightPane_toggle');
  }
  this.fireEvent('container_showSettings', 'about');
}, launchLogger:function() {
  if (Ext.toolkit === 'modern') {
    this.fireEvent('rightPane_toggle');
  }
  this.fireEvent('container_showSettings', 'loggerpage');
}, logout:function() {
  this.fireEvent('main_fireAppEvent', 'container', 'signout', ['user init', false]);
}, setOfflinePassword:function() {
  if (Ext.toolkit === 'modern') {
    this.fireEvent('rightPane_toggle');
  }
  this.fireEvent('container_showSettings', 'offlinepassword');
}, switchOnlineState:function() {
  var me = this, view = me.getView(), vm = view.getViewModel();
  if (vm.get('offlineMode')) {
    me.fireEvent('container_go_online');
  } else {
    me.fireEvent('container_go_offline');
  }
}, __createAppSettings:function(appSettings) {
  if (!appSettings) {
    return;
  }
  var me = this;
  var i = 0;
  for (i = 0; i < appSettings.length; ++i) {
    if (appSettings[i].type === 'check') {
      me.__createCheckSetting(appSettings[i]);
    } else {
      if (appSettings[i].type === 'radial') {
        me.__createRadialSetting(appSettings[i]);
      } else {
        if (appSettings[i].type === 'bool') {
          me.__createCheckSetting(appSettings[i], true);
        } else {
          if (appSettings[i].type === 'event') {
            me.__createButtonSetting(appSettings[i]);
          } else {
            if (appSettings[i].type === 'menu') {
              var menuItemsContainer = {xtype:'container', items:[]};
              var menuItems = {xtype:'container', margin:'0 0 0 7', items:[{xtype:appSettings[i].xtype}]};
              menuItemsContainer.items.push(menuItems);
              me.addMenuButton(menuItemsContainer.items, {title:appSettings[i].title, cls:'settings-container-button'});
            }
          }
        }
      }
    }
  }
}, __createCheckSetting:function(appSetting, bool) {
  var me = this;
  var view = me.getView();
  var checks = [];
  var ci = 0;
  var end = bool ? 1 : appSetting.options.length;
  var padding = bool === true ? '0 0 0 8' : '0 0 0 0';
  for (ci = 0; ci < end; ++ci) {
    checks.push({xtype:'checkbox', indent:false, padding:padding, name:appSetting.options[ci].value, boxLabel:appSetting.options[ci].title, boxLabelAlign:'after', bind:appSetting.options[ci].titleKey ? {boxLabel:'{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}'} : {}, cls:'settings-container-checkfield', automationCls:'toolusermenu-check-' + appSetting.options[ci].value, event:appSetting.appId + '_' + appSetting.event, checked:me.__boolConverter(appSetting.options[ci].checked), listeners:{change:function() {
      var values = {};
      if (Ext.toolkit === 'modern') {
        this.up().items.each(function(item) {
          values[item.name] = item.isChecked();
        });
      } else {
        this.up().items.each(function(item) {
          values[item.name] = item.getValue();
        });
      }
      me.fireEvent(this.event, values);
    }}});
  }
  me.addMenuButton(checks, {layout:appSetting.layout, title:appSetting.title, titleKey:appSetting.titleKey, cls:'settings-container-button', automationCls:'toolusermenu-unsafe-' + appSetting.titleKey || appSetting.title});
}, __createRadialSetting:function(appSetting) {
  var me = this;
  var view = me.getView();
  var btnCls = 'settings-container-button';
  var radialOptions = [];
  var radialMenu;
  var showLabel;
  var ci = 0;
  if (!appSetting.layout) {
    appSetting.layout = 'vbox';
  }
  showLabel = appSetting.layout === 'vbox';
  for (ci = 0; ci < appSetting.options.length; ++ci) {
    var currOption = {xtype:'radiofield', name:appSetting.options[ci].name || 'radField', indent:false, boxLabelAlign:'after', boxLabel:showLabel ? appSetting.options[ci].title : null, cls:'settings-container-radio' + ' ' + appSetting.cls, automationCls:'toolusermenu-radio-' + appSetting.options[ci].value + ' ' + appSetting.cls, event:appSetting.appId + '_' + appSetting.event, checked:me.__boolConverter(appSetting.options[ci].checked), inputValue:appSetting.options[ci].value, ariaRole:'menuitemradio', 
    listeners:{change:function(radio, value) {
      if (value === false) {
        return;
      }
      var values = {};
      values[radio.name] = ABP.util.Common.getModern() ? radio.config.inputValue : radio.inputValue;
      me.fireEvent(this.event, values);
    }, specialkey:function(radio, key) {
      var parent = radio.ownerCt, ev = key.event.key, parentIndex = parent.ownerCt.items.keys.indexOf(parent.id);
      if (ev === 'ArrowLeft' || ev === 'ArrowRight') {
        key.event.preventDefault();
        if (ev === 'ArrowLeft') {
          parent.ownerCt.items.items[parentIndex - 1].click();
        }
      }
    }}};
    if (appSetting.options[ci].titleKey) {
      currOption.bind = {ariaLabel:'{i18n.' + appSetting.options[ci].titleKey + ':ariaEncode}'};
      if (showLabel) {
        currOption.bind.boxLabel = '{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}';
      }
    } else {
      if (appSetting.options[ci].title) {
        currOption.ariaLabel = appSetting.options[ci].title;
      }
    }
    radialOptions.push(currOption);
  }
  btnCls += appSetting.automationCls ? '' : ' a-toolusermenu-unsafe-' + appSetting.titleKey || appSetting.title;
  return me.addMenuButton(radialOptions, {layout:appSetting.layout, title:appSetting.title, titleKey:appSetting.titleKey, cls:btnCls, automationCls:appSetting.automationCls || undefined, listeners:{click:function(button) {
    setTimeout(function() {
      if (!button.nextSibling().hidden) {
        var selected = button.nextSibling().items.items.filter(function(item) {
          return item.checked === true;
        });
        if (selected.length > 0) {
          selected[0].focus();
        } else {
          button.nextSibling().items.items[0].focus();
        }
      }
    }, 100);
  }}, keyMap:{scope:'this', RIGHT:me.__onSpecialKeyPress, LEFT:me.__onSpecialKeyPress}});
}, __onSpecialKeyPress:function(event, button) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    var key = event.event.key, menu = button.nextSibling(), shouldClick = key === 'ArrowRight' && menu.hidden || key === 'ArrowLeft' && !menu.hidden;
    if (shouldClick) {
      button.click();
    }
  }
}, __createButtonSetting:function(appSetting) {
  var me = this;
  var view = me.getView();
  view.add({text:appSetting.title, bind:appSetting.titleKey ? {text:'{i18n.' + appSetting.titleKey + ':htmlEncode}'} : {}, cls:'settings-container-button', ui:'menuitem', uiCls:'light', textAlign:'left', automationCls:'toolusermenu-unsafe-' + appSetting.titleKey || appSetting.title, event:appSetting.event, eventArgs:appSetting.eventArgs, iconCls:appSetting.icon, appId:appSetting.appId, activateApp:appSetting.activateApp, listeners:{click:function(button) {
    this.fireEvent('main_fireAppEvent', button.appId, button.event, button.eventArgs);
  }, tap:function(button) {
    this.fireEvent('main_fireAppEvent', button.appId, button.event, button.eventArgs);
  }, scope:me}});
}, __boolConverter:function(item) {
  if (typeof item === 'string' || item instanceof String) {
    switch(item.toLowerCase()) {
      case 'false':
      case '0':
        return false;
      case 'true':
      case '1':
        return true;
    }
  } else {
    if (Ext.isBoolean(item)) {
      return item;
    } else {
      return false;
    }
  }
}});
Ext.define('ABP.view.session.settings.SettingsContainerModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.settingscontainer', data:{now:Date.now(), showEnv:true, showEnvironment:true, showSessionTimer:true, showUserName:true}, formulas:{username:{get:function() {
  var user = ABP.util.Config.getUsername();
  var allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /\x3c!--[\s\S]*?--\x3e|<\?(?:php)?[\s\S]*?\?>/gi;
  return user.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
    return allowed.indexOf('\x3c' + $1.toLowerCase() + '\x3e') > -1 ? $0 : '';
  }).replace('/\x3e', '').trim();
}}, loggedInTime:{bind:{_loginTime:'{loginTime}', _now:'{now}'}, get:function(data) {
  var diff = data._now - data._loginTime;
  diff = Math.floor(diff / 1000);
  var hh = Math.floor(diff / 3600);
  var mm = Math.floor(diff % 3600 / 60);
  var ss = diff % 60;
  mm = mm < 10 ? '0' + mm : mm;
  ss = ss < 10 ? '0' + ss : ss;
  return hh + ':' + mm + ':' + ss;
}}, environmentName:{bind:{_selected:'{selected.environment}', _envStore:'{main_environmentStore}'}, get:function(data) {
  if (!data._selected) {
    data._selected = ABP.util.Config.getEnvironment();
  }
  var ret = data._selected;
  var env;
  if (data._envStore && data._selected) {
    env = data._envStore.getById(data._selected);
    if (env && env.data && env.data.name) {
      ret = env.data.name;
    }
  } else {
    this.set('showEnv', false);
  }
  if (ret && ret.length > 25) {
    ret = ret.slice(0, 24) + '...';
  }
  return ret;
}}, goOnlineText:{bind:{_goOnline:'{i18n.button_switch_online_mode}', _goOffline:'{i18n.button_switch_offline_mode}', _offlineMode:'{offlineMode}'}, get:function(data) {
  return data._offlineMode ? data._goOnline : data._goOffline;
}}}});
Ext.define('ABP.view.session.settings.SettingsPageController', {extend:'Ext.app.ViewController', alias:'controller.settingspage', init:function() {
  this.fireEvent('container_toolbar_setTitle', 'sessionMenu_settings');
  this.__constructSettingsPage();
}, __constructSettingsPage:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var userItems = [];
  var settings = ABP.util.Config.getSessionConfig().settings;
  var m_items = [];
  var innerItems = [];
  var env;
  var selLang;
  var languages;
  var i = 0;
  m_items.push({xtype:'container', docked:'top', layout:{type:'hbox', pack:'end'}, items:[{xtype:'button', bind:{text:'{i18n.settingsCanvas_close:htmlEncode}'}, focusCls:'', overCls:'', handler:'closeClicked'}]});
  if (settings.settingsPage.enableUser) {
    userItems.push({xtype:'textfield', bind:{label:'{i18n.sessionMenu_user:htmlEncode}'}, cls:'settingspage-field', labelCls:'settingspage-label', labelWidth:'35%', value:Ext.String.htmlEncode(ABP.util.Config.getUsername()), readOnly:true});
  }
  if (settings.settingsPage.showEnvironment) {
    userItems.push({xtype:'textfield', bind:{label:'{i18n.sessionMenu_environment:htmlEncode}', value:'{selected.environment}'}, cls:'settingspage-field', labelCls:'settingspage-label', labelWidth:'45%', readOnly:true});
  }
  if (settings.settingsPage.showSessionTimer) {
    userItems.push({xtype:'textfield', bind:{label:'{i18n.sessionMenu_time:htmlEncode}', value:'{loggedInTime}'}, labelWidth:'45%', cls:'settingspage-field', labelCls:'settingspage-label', readOnly:true});
  }
  if (!Ext.isEmpty(userItems)) {
    m_items.push({xtype:'panel', bind:{title:'{i18n.settings_userInfo}'}, cls:'settings-info-panel', layout:{type:'vbox', align:'stretch'}, items:[userItems]});
  }
  if (settings.enableLanguages) {
    env = vm.get('selected.environment');
    if (env) {
      selLang = vm.get('selected.language');
      env = vm.get('main_environmentStore').getById(env);
      if (env && env.data && env.data.languages) {
        languages = env.data.languages;
        innerItems = [];
        for (i = 0; i < languages.length; ++i) {
          innerItems.push({xtype:'radiofield', name:'languages', value:languages[i].key, label:languages[i].name, cls:'settingspage-field', labelCls:'settingspage-label', checked:selLang === languages[i].key, listeners:{'check':function() {
            me.fireEvent('container_switchLanguage', this.getValue());
          }}});
        }
        if (!Ext.isEmpty(innerItems)) {
          m_items.push({xtype:'formpanel', bind:{title:'{i18n.settings_languages}'}, cls:'settings-info-panel', automationCls:'languages-panel', layout:{type:'vbox', align:'stretch'}, items:innerItems});
        }
      }
    }
  }
  if (settings.appSettings) {
    m_items = m_items.concat(me.getAppSettings(settings.appSettings));
  }
  if (settings.enableHelp || settings.enableAbout || settings.enableLogger) {
    innerItems = [];
    if (settings.enableHelp) {
      innerItems.push({xtype:'button', cls:'settingspage-link-button', bind:{text:'{i18n.sessionMenu_help:htmlEncode}'}, handler:'launchHelp'});
    }
    if (settings.enableAbout) {
      innerItems.push({xtype:'button', cls:'settingspage-link-button', bind:{text:'{i18n.sessionMenu_about:htmlEncode}'}, handler:'launchAbout'});
    }
    if (settings.enableLoggerView) {
      innerItems.push({xtype:'button', cls:'settingspage-link-button', bind:{text:'{i18n.sessionMenu_logger:htmlEncode}'}, handler:'launchLogger'});
    }
    if (!Ext.isEmpty(innerItems)) {
      m_items.push({xtype:'panel', bind:{title:'{i18n.settings_internalLinks}'}, cls:'settings-info-panel', layout:{type:'vbox', align:'stretch'}, items:innerItems});
    }
  }
  view.add(m_items);
}, getAppSettings:function(appSettings) {
  var me = this;
  var ret = [];
  var i = 0;
  for (i = 0; i < appSettings.length; ++i) {
    if (appSettings[i].type) {
      if (appSettings[i].type === 'check') {
        ret.push(me.createCheckSetting(appSettings[i]));
      } else {
        if (appSettings[i].type === 'radial') {
          ret.push(me.createRadialSetting(appSettings[i]));
        } else {
          if (appSettings[i].type === 'bool') {
            ret.push(me.createBoolSetting(appSettings[i]));
          } else {
            if (appSettings[i].type === 'info') {
              ret.push(me.createInfoSetting(appSettings[i]));
            }
          }
        }
      }
    }
  }
  return ret;
}, createCheckSetting:function(appSetting) {
  var me = this;
  var ret;
  var checks = [];
  var ci = 0;
  for (ci = 0; ci < appSetting.options.length; ++ci) {
    checks.push({xtype:'checkboxfield', value:true, name:appSetting.options[ci].value, label:appSetting.options[ci].title, bind:appSetting.options[ci].titleKey ? {label:'{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}'} : {}, cls:'settingspage-field', labelCls:'settingspage-label', event:appSetting.appId + '_' + appSetting.event, checked:appSetting.options[ci].checked === 'true' || appSetting.options[ci].checked === true, listeners:{'check':function() {
      var vals = this.up('formpanel').getValues();
      for (var propt in vals) {
        if (vals.hasOwnProperty(propt)) {
          if (vals[propt] === null) {
            vals[propt] = false;
          }
        }
      }
      me.fireEvent(this.event, vals);
    }, 'uncheck':function() {
      var vals = this.up('formpanel').getValues();
      for (var propt in vals) {
        if (vals.hasOwnProperty(propt)) {
          if (vals[propt] === null) {
            vals[propt] = false;
          }
        }
      }
      me.fireEvent(this.event, vals);
    }}});
  }
  if (!Ext.isEmpty(checks)) {
    ret = {xtype:'formpanel', title:appSetting.title, bind:appSetting.titleKey ? {title:'{i18n.' + appSetting.titleKey + '}'} : {}, cls:'settings-info-panel', layout:{type:'vbox', align:'stretch'}, items:checks};
  }
  return ret;
}, createRadialSetting:function(appSetting) {
  var me = this;
  var ret;
  var rads = [];
  var ci = 0;
  for (ci = 0; ci < appSetting.options.length; ++ci) {
    rads.push({xtype:'radiofield', value:appSetting.options[ci].value, name:'radField', label:appSetting.options[ci].title, bind:appSetting.options[ci].titleKey ? {label:'{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}'} : {}, cls:'settingspage-field', labelCls:'settingspage-label', event:appSetting.appId + '_' + appSetting.event, checked:appSetting.options[ci].checked, listeners:{'check':function() {
      me.fireEvent(this.event, this.up('formpanel').getValues());
    }}});
  }
  if (!Ext.isEmpty(rads)) {
    checkTitle = ABP.util.Common.geti18nString(appSetting.title);
    ret = {xtype:'formpanel', title:appSetting.title, bind:appSetting.titleKey ? {title:'{i18n.' + appSetting.titleKey + '}'} : {}, cls:'settings-info-panel', layout:{type:'vbox', align:'stretch'}, items:rads};
  }
  return ret;
}, createBoolSetting:function(appSetting) {
  var me = this;
  var ret = {xtype:'panel', title:appSetting.title, bind:appSetting.titleKey ? {title:'{i18n.' + appSetting.titleKey + '}'} : {}, cls:'settings-info-panel', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'togglefield', name:appSetting.options[0].value, value:appSetting.options[0].checked, label:appSetting.options[0].title, bind:appSetting.options[0].titleKey ? {label:'{i18n.' + appSetting.options[0].titleKey + ':htmlEncode}'} : {}, cls:'settingspage-field', labelCls:'settingspage-label', event:appSetting.appId + 
  '_' + appSetting.event, listeners:{'change':function(tf, newVal) {
    var name = tf.getName();
    me.fireEvent(this.event, {name:newVal});
  }}}]};
  return ret;
}, createInfoSetting:function(appSetting) {
  var ret = {xtype:'panel', title:appSetting.title, bind:appSetting.titleKey ? {title:'{i18n.' + appSetting.titleKey + '}'} : {}, cls:'settings-info-panel', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'textareafield', cls:'settingspage-field', readOnly:true, maxRows:4, scrollable:'y', value:appSetting.text, bind:appSetting.textKey ? {value:'{i18n.' + appSetting.textKey + '}'} : {}}]};
  return ret;
}, launchHelp:function() {
  this.fireEvent('container_showSettings', 'helpview');
}, launchAbout:function() {
  this.fireEvent('container_showSettings', 'about');
}, launchLogger:function() {
  this.fireEvent('container_showSettings', 'loggerpage');
}, closeClicked:function() {
  this.fireEvent('featureCanvas_hideSetting');
}});
Ext.define('ABP.view.session.settings.SettingsPageModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.settingspage', formulas:{loggedInTime:{bind:{_loginTime:'{loginTime}'}, get:function(data) {
  var diff = Date.now() - data._loginTime;
  diff = Math.floor(diff / 1000);
  var hh = Math.floor(diff / 3600);
  var mm = Math.floor(diff % 3600 / 60);
  var ss = diff % 60;
  mm = mm < 10 ? '0' + mm : mm;
  ss = ss < 10 ? '0' + ss : ss;
  return hh + ':' + mm + ':' + ss;
}}}});
Ext.define('ABP.view.session.subMenu.SubMenuController', {extend:'Ext.app.ViewController', alias:'controller.submenucontroller', subOptionClick:function(button) {
  var me = this;
  var view = me.getView();
  var feature = button.eventArgs;
  if (feature) {
    me.fireEvent('featureCanvas_showSetting', feature);
    me.fireEvent('session_closeMenu');
    view.destroy();
  }
}});
Ext.define('ABP.view.base.popUp.ShowByPopUp', {extend:'Ext.Panel', alias:'widget.abpshowbypopup', cls:'abpshowbypopup', left:0, modal:true, hideOnMaskTap:true, hide:function() {
  this.destroy();
}});
Ext.define('ABP.view.session.toolbarTop.ToolbarTopBaseController', {extend:'Ext.app.ViewController', requires:['ABP.view.base.popUp.ShowByPopUp'], listen:{controller:{'*':{toolbar_addbutton:'addButton', toolbar_addRPButton:'addRPButton', toolbar_addSearchButton:'addSearchButton', toolbar_openSearch:'openSearchBar', toolbar_removeButton:'removeButton', toolbar_removeMenuButton:'removeMenuButton', toolbar_setTitle:'setTitle', toolbar_showBranding:'showBranding', toolbar_setupConfig:'__processConfiguration', 
toolbar_setOverrideTitle:'setOverrideTitle', toolbar_updateButtonIcon:'updateButtonIcon', toolbar_setVisibilityRightPaneButton:'setVisibilityRightPaneButton', toolbar_removePressedCls:'__removePressedCls', toolbar_addPressedCls:'__addPressedCls', toolbar_updateBadge:'__updateBadge', toolbar_incrementBadge:'__incrementBadge', toolbar_decrementBadge:'__decrementBadge', toolbar_clearBadge:'__clearBadge', toolbar_findRightPaneButton:'__findRightPaneButton'}}}, toggleMenu:function() {
  this.fireEvent('session_toggleMenu');
}, toggleRightPane:function() {
  this.fireEvent('session_toggleRightPane');
}, toggleRightPaneButton:function(button) {
  this.fireEvent('rightPane_toggleTab', button.panelConfig, button.pressed);
}, handleRightPaneKeyPress:function(event, button) {
  this.fireEvent('rightPane_handleKeyPress', event, button);
}, openSearchBar:function() {
  var me = this;
  var vm = me.getViewModel();
  vm.set('searchBar.open', true);
  if (Ext.toolkit === 'modern') {
    this.fireEvent('session_closeMenu');
  }
}, __processConfiguration:function(buttons) {
  var me = this;
  var i = 0;
  var func;
  for (i = 0; i < buttons.length; ++i) {
    var func = function() {
      this.fireEvent(buttons[i].event, buttons[i].eventArgs);
    };
    if (buttons[i].side === '' || buttons[i].side === undefined || buttons[i].side === null) {
      buttons[i].side = 'right';
    }
    me.addButton(buttons[i]);
  }
}, buttonId:0, addButton:function(button, icon, func, uniqueId) {
  var me = this;
  var found = null;
  if (button.uniqueId) {
    found = me.getButton(button.uniqueId);
  }
  if (uniqueId) {
    found = me.getButton(uniqueId);
  }
  if (!found) {
    if (button.appId) {
      me.addProperButton(button);
    } else {
      me.addLegacyButton(button, icon, func, uniqueId);
    }
  }
}, addProperButton:function(button) {
  var me = this;
  var view = me.getView();
  var iconString = me.makeIconString(button.icon);
  var unId = button.uniqueId === null || button.uniqueId === undefined ? ABP.util.IdCreator.getId(button) : button.uniqueId;
  var toolSide;
  var toAdd;
  if (!button.side) {
    button.side = 'right';
  }
  if (button.side === 'left') {
    toolSide = view.down('#tool-buttons-left');
    toAdd = {xtype:'button', cls:'tool-button-right toolbar-button a-toolbar-' + button.icon, bind:{height:'{toolbarHeight}'}, command:button.event, uiCls:['dark'], eventArgs:button.eventArgs, uniqueId:unId, iconCls:iconString, focusCls:'', overCls:'toolbar-button-over', handler:button.type === 'event' ? me.buttonEventHandler : me.makeHandler(button.eventArgs), pressedCls:'toolbar-button-pressed'};
    toolSide.add(toAdd);
  } else {
    if (button.side === 'right' || button.side === 'right-right') {
      toolSide = view.down('#tool-buttons-right');
      toAdd = {xtype:'button', cls:'tool-button-right toolbar-button a-toolbar-' + button.icon, bind:{height:'{toolbarHeight}'}, command:button.event, eventArgs:button.eventArgs, uiCls:['dark'], uniqueId:unId, iconCls:iconString, focusCls:'', overCls:'toolbar-button-over', handler:button.type === 'event' ? me.buttonEventHandler : me.makeHandler(button.eventArgs), pressedCls:'toolbar-button-pressed'};
      if (button.side === 'right') {
        toolSide.addButton(toAdd);
      } else {
        toolSide.add(toAdd);
      }
    }
  }
}, addLegacyButton:function(side, icon, func, uniqueId) {
  var me = this;
  var toolSide;
  var button;
  var view = me.getView();
  var iconString = me.makeIconString(icon);
  var unId = uniqueId ? uniqueId : this.buttonId++;
  var myHandler;
  if (func === 'toggleRightPane') {
    myHandler = func;
  } else {
    myHandler = Ext.isFunction(func) ? func : me.makeHandler(func);
  }
  if (side === 'right') {
    toolSide = view.down('#tool-buttons-right');
    button = {xtype:'button', cls:'tool-button-right toolbar-button a-toolbar-' + icon, bind:{height:'{toolbarHeight}'}, uiCls:['dark'], uniqueId:uniqueId, iconCls:iconString, focusCls:'', overCls:'searchbar-button-over', handler:myHandler, pressedCls:'toolbar-button-pressed'};
    if (unId === 'rpButton') {
      button.itemId = unId;
    } else {
      button.bind = {hidden:'{nonControlButtonsHidden}'};
    }
    toolSide.addButton(button);
  } else {
    if (side === 'right-right') {
      toolSide = view.down('#tool-buttons-right');
      button = {xtype:'button', cls:'tool-button-right toolbar-button a-toolbar-' + icon, bind:{height:'{toolbarHeight}'}, uniqueId:uniqueId, iconCls:iconString, focusCls:'', overCls:'searchbar-button-over', handler:myHandler, bind:{hidden:'{nonControlButtonsHidden}'}, pressedCls:'toolbar-button-pressed'};
      toolSide.add(button);
    } else {
      if (side === 'left') {
        toolSide = view.down('#tool-buttons-left');
        button = {xtype:'button', cls:'tool-button-left toolbar-button a-toolbar-' + icon, bind:{height:'{toolbarHeight}'}, uniqueId:uniqueId, iconCls:iconString, handler:myHandler, bind:{hidden:'{nonControlButtonsHidden}'}, pressedCls:'toolbar-button-pressed'};
        toolSide.add(button);
      }
    }
  }
}, addSearchButton:function() {
  var me = this;
  var view = me.getView();
  var toolSide = view.down('#tool-buttons-right');
  if (ABP.util.Common.getModern()) {
    toolSide.add({xtype:'button', cls:'tool-button-right toolbar-button a-toolbar-searchButton', uniqueId:'tbSearchButton', iconCls:'icon-magnifying-glass toolbar-icon', enableToggle:true, bind:{pressed:'{searchBar.open}'}, pressedCls:'toolbar-button-pressed'});
  } else {
    toolSide.addButton({xtype:'searchbar', flex:1});
  }
}, addRPButton:function(info) {
  if (info && info.icon) {
    this.addButton('right', info.icon, 'toggleRightPane', 'rpButton');
  }
}, getButton:function(uniqueId) {
  var me = this;
  var view = me.getView();
  var LButtonGroup = view.down('#tool-buttons-left');
  var RButtonGroup = view.down('#tool-buttons-right');
  var ret = null;
  var button = RButtonGroup.down('[uniqueId\x3d' + uniqueId + ']');
  if (button) {
    ret = button;
  } else {
    button = LButtonGroup.down('[uniqueId\x3d' + uniqueId + ']');
    if (button) {
      ret = button;
    }
  }
  return ret;
}, removeButton:function(uniqueId) {
  var me = this;
  var view = me.getView();
  var LButtonGroup = view.down('#tool-buttons-left');
  var RButtonGroup = view.down('#tool-buttons-right');
  var button = RButtonGroup.down('[uniqueId\x3d' + uniqueId + ']');
  if (button) {
    RButtonGroup.remove(button);
  } else {
    button = LButtonGroup.down('[uniqueId\x3d' + uniqueId + ']');
    if (button) {
      LButtonGroup.remove(button);
    }
  }
}, removeMenuButton:function() {
  var me = this;
  var view = me.getView();
  var LButtonGroup = view.down('#tool-buttons-left');
  var menubutton = view.down('#toolbar-button-menu');
  if (menubutton && LButtonGroup) {
    LButtonGroup.remove(menubutton);
  }
}, updateButtonIcon:function(uniqueId, newIcon) {
  var me = this;
  var view = me.getView();
  var iconString = me.makeIconString(newIcon);
  var LButtonGroup = view.down('#tool-buttons-left');
  var RButtonGroup = view.down('#tool-buttons-right');
  var button = RButtonGroup.down('[uniqueId\x3d' + uniqueId + ']');
  if (button) {
    button.setIconCls(iconString);
  } else {
    button = LButtonGroup.down('[uniqueId\x3d' + uniqueId + ']');
    if (button) {
      button.setIconCls(iconString);
    }
  }
}, makeIconString:function(icon) {
  var ret = icon;
  var font = icon;
  font = font.split('-');
  ret = font[0] === 'fa' ? 'x-fa ' + icon : icon;
  return ret + ' toolbar-icon';
}, buttonEventHandler:function() {
  var me = this;
  me.up('toolbartop').getController().fireEvent(me.command, me.eventArgs);
}, makeHandler:function(type) {
  var ret = function(btn) {
    var pan = Ext.Viewport.add({xtype:'abpshowbypopup', items:[{xtype:type}]});
    pan.showBy(btn);
  };
  return ret;
}, setTitle:function(newTitle) {
  var me = this;
  me.__setSpecificTitle(newTitle, 'toolbarTitle');
}, showBranding:function(show) {
  var me = this, vm = me.getViewModel();
  vm.set('conf.settings.toolbarTitleShowBranding', show);
}, setOverrideTitle:function(newTitle) {
  var me = this;
  me.__setSpecificTitle(newTitle, 'overrideTitle');
}, __setSpecificTitle:function(newTitle, formulaKey) {
  var me = this, vm = me.getViewModel(), formulas = vm.getFormulas();
  newTitle = newTitle || '';
  if (vm.get('i18n.' + newTitle)) {
    formulas[formulaKey] = {bind:'{i18n.' + newTitle + '}', get:function(title) {
      return title;
    }};
    vm.setFormulas(formulas);
    vm.notify();
  } else {
    formulas[formulaKey] = {get:function(get) {
      return newTitle;
    }};
    vm.setFormulas(formulas);
    vm.notify();
    vm.set(formulaKey, newTitle);
  }
  this.centerLabel(this.getView());
}, onResizeToolbar:function(view, width) {
  var me = this;
  var vm = me.getViewModel();
  this.centerLabel(view, width);
}, onAfterLayout:function(view, width, height) {
  this.centerLabel(view);
}, toolbarTitleImageClick:function(event, element) {
  var me = this;
  me.fireEvent('toolbartop_logoclick', element);
}, toolbarTitleImageContainerBeforeRender:function(container) {
  var me = this, vm = me.getViewModel(), toolbarTitleImageUrl = vm.get('conf.toolbarTitleImageUrl');
  if (toolbarTitleImageUrl) {
    container.setHtml('\x3cimg class\x3d"toolbar-title-image" src\x3d"' + Ext.String.htmlEncode(Ext.resolveResource(toolbarTitleImageUrl)) + '" alt\x3d""\x3e');
  }
}, privates:{centerLabel:function(view) {
  var me = this;
  var label = view.down('#toolbarTitle');
  if (!label || !label.text) {
    return;
  }
  var vm = me.getViewModel(), currentX = label.getX(), showBranding = vm.get('conf.settings.toolbarTitleShowBranding'), left;
  if (!showBranding) {
    var labelContainer = view.down('#toolbarTitleContainer'), containerX;
    if (labelContainer) {
      containerX = labelContainer.getX();
    } else {
      containerX = 0;
    }
    if (currentX !== containerX) {
      label.setX(containerX);
    }
  } else {
    var labelWidth = label.getWidth();
    if (labelWidth === 0) {
      labelWidth = ABP.util.Common.measureTextSingleLine(label.text, ABP.util.Constants.BASE_FONT).width;
    }
    left = (Ext.getViewportWidth() - labelWidth) / 2;
    if (currentX !== left) {
      label.setX(left);
    }
  }
}}});
Ext.define('ABP.view.session.toolbarTop.ToolbarTopModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.toolbartopmodel', data:{title:'', overrideTitle:undefined, toolbarHeight:44, toolCls:'', nonControlButtonsHidden:false, userMenu:[], now:Date.now(), showEnv:true, imageWidth:null}, formulas:{micro:{get:function() {
  var width;
  var height;
  var ssThresh;
  var ret = false;
  if (ABP.util.Common.getModern()) {
    width = ABP.util.Common.getWindowWidth();
    height = ABP.util.Common.getWindowHeight();
    ssThresh = this.get('smallScreenThreshold');
    if (width <= ssThresh || height <= ssThresh) {
      ret = true;
    }
  }
  this.setToolSize(ret);
  return ret;
}}, toolbarBrandingCls:{bind:{_brand:'{mainMenuTopLabel}'}, get:function(data) {
  var ret = 'toolbar-top-title';
  if (data._brand) {
    if (data._brand.length <= 7) {
      ret = 'toolbar-top-title';
    } else {
      if (data._brand.length > 7 && data._brand.length < 10) {
        ret = 'toolbar-top-title-med';
      } else {
        ret = 'toolbar-top-title-sm';
      }
    }
  }
  return ret;
}}, toolbarTitle:{bind:{_title:'{title}', _override:'{overrideTitle}'}, get:function(data) {
  var ret = data._title;
  if (data._override) {
    ret = data._override;
    this.set('nonControlButtonsHidden', true);
  } else {
    this.set('nonControlButtonsHidden', false);
  }
  return ret;
}}, toolbarTitleImageUrl:{bind:{_toolbarTitleImageUrl:'{conf.toolbarTitleImageUrl}'}, get:function(data) {
  return Ext.isEmpty(data._toolbarTitleImageUrl) ? null : data._toolbarTitleImageUrl;
}}, toolbarTitleBrandImageShow:{bind:{_toolbarTitleShowBranding:'{conf.settings.toolbarTitleShowBranding}'}, get:function(data) {
  return this.get('toolbarTitleImageUrl') && data._toolbarTitleShowBranding !== false;
}}, toolbarTitleBrandNameShow:{bind:{_toolbarTitleShowBranding:'{conf.settings.toolbarTitleShowBranding}'}, get:function(data) {
  return !this.get('toolbarTitleImageUrl') && data._toolbarTitleShowBranding !== false;
}}, mainMenuTopLabel:{bind:{_bootstrapConf:'{bootstrapConf.branding.companyName}'}, get:function(data) {
  var ret = '';
  if (data._bootstrapConf) {
    ret = data._bootstrapConf;
  } else {
    ret = 'APTEAN';
  }
  return ret;
}}, username:{get:function() {
  var user = ABP.util.Config.getUsername();
  var allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /\x3c!--[\s\S]*?--\x3e|<\?(?:php)?[\s\S]*?\?>/gi;
  return user.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
    return allowed.indexOf('\x3c' + $1.toLowerCase() + '\x3e') > -1 ? $0 : '';
  }).replace('/\x3e', '').trim();
}}, loggedInTime:{bind:{_loginTime:'{loginTime}', _now:'{now}'}, get:function(data) {
  var diff = data._now - data._loginTime;
  diff = Math.floor(diff / 1000);
  var hh = Math.floor(diff / 3600);
  var mm = Math.floor(diff % 3600 / 60);
  var ss = diff % 60;
  mm = mm < 10 ? '0' + mm : mm;
  ss = ss < 10 ? '0' + ss : ss;
  return hh + ':' + mm + ':' + ss;
}}, environmentName:{bind:{_selected:'{selected.environment}', _envStore:'{main_environmentStore}'}, get:function(data) {
  var ret = data._selected;
  var env;
  if (data._envStore && data._selected) {
    env = data._envStore.getById(data._selected);
    if (env && env.data && env.data.name) {
      ret = env.data.name;
    }
  } else {
    this.set('showEnv', false);
  }
  if (ret && ret.length > 25) {
    ret = ret.slice(0, 24) + '...';
  }
  return ret;
}}}, setToolSize:function(micro) {
  var me = this;
  if (micro) {
    me.set('toolbarHeight', 40);
    me.set('toolCls', 'tool-top micro-tool-top');
  } else {
    me.set('toolbarHeight', 44);
    me.set('toolCls', 'tool-top');
  }
}});
Ext.define('ABP.view.session.toolbarTop.search.SearchBarController', {extend:'Ext.app.ViewController', alias:'controller.searchbarcontroller', listen:{controller:{'*':{searchBar_close:'__closeToButton', searchBar_openIn:'__openInBar', abp_searchBar_toggleKey:'onToggleKeyPressed', abp_search_suggestions:'onUpdatedSuggestions'}}}, pendingRequests:0, loadTask:null, initViewModel:function(vm) {
  this.callParent(vm);
  this.initSuggestions();
  this.loadTask = new Ext.util.DelayedTask(this.fireLoadRequest, this);
}, toggleSearchButtonPressed:function() {
  var me = this;
  var vm = me.getViewModel();
  var view = me.getView();
  var open = vm.get('searchBar.open');
  var searchButton = view.down('#searchbarSearchButton');
  if (open) {
    searchButton.removeCls('x-btn-pressed');
  } else {
    searchButton.addCls('x-btn-pressed');
  }
}, onSearchClick:function(options) {
  var me = this;
  var view = me.getView();
  var field = view.lookupReference('searchbarSearchField');
  var visible = field.isVisible();
  var vm = me.getViewModel();
  var searchText, searchHiearchy, instanceId;
  var toggleableGlobalSearch = ABP.Config.canGlobalSearchToggle();
  var shortcut = !Ext.isEmpty(options) ? options.shortcut : false;
  if (toggleableGlobalSearch === false && shortcut) {
    Ext.defer(function(field) {
      field.focus();
    }, 1, me, [field]);
  } else {
    if (toggleableGlobalSearch !== false) {
      me.toggleSearchButtonPressed();
    }
  }
  if (visible) {
    me.hideSuggestions();
    var currentSelection = vm.get('selectedSuggestion');
    if (currentSelection) {
      searchText = currentSelection.get('text');
      searchHiearchy = currentSelection.get('hierarchy');
      instanceId = currentSelection.get('instanceId');
    } else {
      searchText = vm.get('searchBar.val').trim();
    }
    if (searchText.length === 0 || shortcut) {
      return;
    }
    var search = me.getSearchProvider();
    if (me.checkStringLength(searchText, search)) {
      args = searchText;
      if (instanceId) {
        args = [searchText, instanceId];
      }
      me.fireEvent('main_fireAppEvent', search.data.appId, search.data.event, args);
    }
    if (toggleableGlobalSearch === true) {
      me.__closeToButton();
    }
    var recentStore = vm.getStore('recentSearches');
    recentStore.append(search, searchText, searchHiearchy, instanceId);
  } else {
    if (toggleableGlobalSearch === true) {
      me.expandSearchBar();
    }
  }
}, onSearchFieldKeyDown:function(e) {
  var me = this;
  var keyCode = e.getKey();
  if (keyCode === e.DOWN) {
    me.moveSelectedSearchResult(1);
    e.stopEvent();
  } else {
    if (keyCode === e.UP) {
      me.moveSelectedSearchResult(-1);
      e.stopEvent();
    }
  }
}, __openInBar:function() {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var type = view.down('#searchbarTypeButton');
  var text = view.down('#searchbarSearchField');
  me.fireEvent('toolbar_setOverrideTitle', ' ');
  view.setWidth('475');
  view.addCls('searchbaropen');
}, __closeToButton:function(transition) {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var open = vm.get('searchBar.open');
  var text = view.down('#searchbarSearchField');
  if (open) {
    me.fireEvent('toolbar_setOverrideTitle');
    view.setWidth(45);
    view.removeCls('searchbaropen');
    if (!transition) {
      text.setValue();
    }
    me.toggleSearchButtonPressed();
    vm.set('searchBar.open', false);
    me.hideSuggestions();
  }
}, onFocusLeave:function() {
  this.__closeToButton();
}, onSearchFieldFocus:function() {
  this.showSuggestions();
}, onEscKey:function() {
  this.__closeToButton();
}, onEnterKey:function() {
  var me = this;
  var popup = Ext.get('GlobalSuggestionPopup').component;
  var dataview = popup.getComponent('searchPopupDataview');
  var items = dataview.all.elements;
  var length = items.length;
  var record;
  for (var i = 0; i < length; i++) {
    var item = items[i];
    if (item.className.includes('x-item-selected')) {
      record = dataview.store.getAt(i);
      break;
    } else {
      record = null;
    }
  }
  if (Ext.isEmpty(record)) {
    me.onSearchClick();
  } else {
    var click;
    me.onSuggestionClick(click, record);
  }
}, onJumpToKey:function() {
  this.fireEvent('abp_jumpto_show');
}, onSwitchProviderDown:function() {
  this.switchProvider(1);
}, onSwitchProviderUp:function() {
  this.switchProvider(-1);
}, onProviderClick:function(args) {
  this.focusSearchField();
  this.setSearch(args.searchId);
}, onSuggestionClick:function(clicked, record, item, index, e, eOpts) {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  var searchField = view.down('#searchbarSearchField');
  searchField.setValue(record.data.text);
  vm.set('selectedSuggestion', record);
  searchField.suspendEvent('focus');
  me.onSearchClick();
  searchField.suspendEvent('focus');
}, onSearchFieldChange:function(field, newValue, oldValue) {
  var me = this;
  me.refreshSuggestions(newValue);
  var vm = me.getViewModel();
  var view = me.getView();
  var hideLoading = true;
  var search = me.getSearchProvider();
  if (!search || !search.data || !search.data.suggestionEvent) {
    return;
  }
  var searchText = newValue.trim();
  if (searchText.length >= search.data.suggestionThreshold) {
    this.loadTask.delay(200, this.fireLoadRequest, this, [search, searchText]);
  } else {
    this.loadTask.cancel();
    me.removeCustomSuggestions();
  }
  var loading = me.pendingRequests > 0;
  me.showSuggestions(loading);
}, privates:{onUpdatedSuggestions:function(searchId, seachTerm, suggestions, removeCaseInsensitiveDuplicates) {
  var me = this;
  me.pendingRequests = Math.max(me.pendingRequests - 1, 0);
  var vm = me.getViewModel();
  var currentSearchId = vm.get('searchBar.selectedSearch');
  if (currentSearchId !== searchId) {
    return;
  }
  if (!suggestions || suggestions.length === 0) {
    return;
  }
  var suggestionStore = me.getStore('suggestions');
  var recents = [];
  Ext.Array.each(suggestions, function(item) {
    if (suggestionStore.findExact('text', item.text) < 0) {
      recents.push({text:item.text, hierarchy:item.hierarchy, instanceId:item.instanceId, timestamp:0, count:1, isRecent:false});
    }
  });
  suggestionStore.loadData(recents, true);
  me.refreshSuggestions(undefined, removeCaseInsensitiveDuplicates);
}, refreshSuggestions:function(newValue, removeCaseInsensitiveDuplicates) {
  var me = this;
  var vm = me.getViewModel();
  var suggestions = vm.getStore('suggestions');
  if (newValue === undefined) {
    newValue = vm.get('searchBar.val');
  }
  newValue = newValue.trim();
  suggestions.clearFilter();
  if (removeCaseInsensitiveDuplicates) {
    try {
      ABP.util.Common.removeCaseInsensitiveDuplicates(suggestions, 'text');
    } catch (e$8) {
      ABPLogger.logDebug(e$8);
    }
  }
  var sorters = [];
  if (newValue != '') {
    filterFunction = ABP.util.filters.Factory.createStringFilter(newValue, [{name:'text', useSoundEx:false}, {name:'hierarchy', useSoundEx:false}], true, 1);
    suggestions.filter({id:'TextFilter', filterFn:filterFunction});
    sorters.push({property:'_relevance', direction:'DESC'});
  }
  sorters.push({property:'timestamp', direction:'DESC'});
  suggestions.sort(sorters);
  var topNfilter = ABP.util.filters.Factory.createTopNFilter(me.getRecentLength());
  suggestions.filter({id:'TopNFilter', filterFn:topNfilter});
  if (suggestions.count() === 0) {
    return;
  }
  me.showSuggestions();
  var selected = vm.get('selectedSuggestion');
  if (suggestions.indexOf(selected) === -1) {
    vm.set('selectedSuggestion', null);
  }
}, removeCustomSuggestions:function() {
  var me = this;
  var vm = me.getViewModel();
  var suggestions = vm.getStore('suggestions');
  var toRemove = [];
  suggestions.each(function(item) {
    if (!item.data.isRecent) {
      toRemove.push(item);
    }
  });
  suggestions.remove(toRemove);
}, getRecentLength:function() {
  var search = this.getSearchProvider();
  if (search) {
    return search.get('recents');
  } else {
    return 0;
  }
}, getSearchProvider:function() {
  var vm = this.getViewModel();
  var searchId = vm.get('searchBar.selectedSearch');
  var store = Ext.StoreMgr.get('searchStore');
  return store.getById(searchId);
}, moveSelectedSearchResult:function(increment) {
  var me = this;
  var vm = me.getViewModel(), v = me.getView();
  var currentSelection = vm.get('selectedSuggestion');
  var store = vm.getStore('suggestions');
  var currentIndex = -1;
  if (currentSelection) {
    currentIndex = store.indexOf(currentSelection);
    currentIndex = currentIndex + increment;
  } else {
    currentIndex = 0;
    if (increment < 0) {
      currentIndex = store.getCount() - 1;
    }
  }
  var selected = store.getAt(currentIndex);
  vm.set('selectedSuggestion', selected);
  if (selected) {
    ABP.util.Aria.setActiveDecendant(v.down('#searchbarSearchField'), selected.id);
  } else {
    ABP.util.Aria.setActiveDecendant(v.down('#searchbarSearchField'), '');
  }
}, focusSearchField:function() {
  var me = this;
  var text = me.getView().down('#searchbarSearchField');
  if (!text.hidden) {
    text.focus();
  }
}, switchProvider:function(direction) {
  var me = this;
  var vm = me.getViewModel();
  var store = Ext.StoreMgr.get('searchStore');
  var selectedSearch = vm.get('searchBar.selectedSearch');
  var i = store.indexOfId(selectedSearch);
  i = i + direction;
  i = i < 0 ? store.count() - 1 : i;
  i = i >= store.count() ? 0 : i;
  me.setSearch(store.getAt(i));
}, initSuggestions:function() {
  var me = this;
  var vm = me.getViewModel();
  var selectedSearchId = vm.get('searchBar.selectedSearch');
  var recentSearches = me.getStore('recentSearches');
  var suggestions = me.getStore('suggestions');
  suggestions.clearFilter();
  var recents = [];
  recentSearches.each(function(model) {
    if (model.data.searchId == selectedSearchId) {
      recents.push({text:model.data.text, hierarchy:model.data.hierarchy, instanceId:model.data.instanceId, timestamp:model.data.timestamp, count:model.data.count, isRecent:true});
    }
  });
  suggestions.loadData(recents);
  me.setSelectedSuggestionId('');
  me.refreshSuggestions('');
}, setSearch:function(search) {
  if (typeof search === 'string') {
    var store = Ext.StoreMgr.get('searchStore');
    search = store.getById(search);
  }
  if (!search) {
    return;
  }
  var me = this;
  var vm = me.getViewModel();
  vm.set('searchBar.selectedSearch', search.id);
  vm.set('searchBar.selectedSearchCls', search.get('icon'));
  ABP.util.LocalStorage.setForLoggedInUser('DefaultSearch', search.id);
  me.initSuggestions();
}, showSuggestions:function(loading) {
  var me = this;
  var vm = me.getViewModel();
  var view = this.getView();
  var recentSearches = view.down('#GlobalSuggestionPopup');
  recentSearches.alignTarget = searchField;
  if (loading === undefined) {
    loading = me.pendingRequests > 0;
  }
  recentSearches.setMessage(null);
  recentSearches.setLoading(loading);
  if (recentSearches.isVisible()) {
    return;
  }
  var recentStore = vm.getStore('recentSearches');
  if (recentStore.count() === 0 && !loading) {
    return;
  }
  var searchField = view.down('#searchbarSearchField');
  Ext.Function.defer(function(searchField, recentSearches) {
    if (!searchField.isVisible()) {
      return;
    }
    recentSearches.setWidth(searchField.getWidth());
    recentSearches.showBy(searchField, 'bl');
    this.setSelectedSuggestionId('');
    ABP.util.Aria.setExpanded(searchField, true);
    searchField.focus();
  }, 200, this, [searchField, recentSearches]);
}, hideSuggestions:function() {
  var view = this.getView();
  var recentSearches = view.down('#GlobalSuggestionPopup');
  if (recentSearches) {
    recentSearches.hide();
  }
  this.pendingRequests = 0;
  if (this.loadTask) {
    this.loadTask.cancel();
  }
  var searchField = view.down('#searchbarSearchField');
  ABP.util.Aria.setExpanded(searchField, true);
}, ensureSuggestionsHidden:function() {
  var me = this;
  var view = me.getView();
  if (view.hidden === false) {
    me.hideSuggestions();
  }
}, setSelectedSuggestionId:function(id) {
  var me = this;
  var vm = me.getViewModel();
  var store = vm.getStore('suggestions');
  if (store.count() === 0) {
    return;
  }
  var i = store.find('id', id);
  if (i !== -1) {
    vm.set('selectedSuggestion', store.getAt(i));
  } else {
    vm.set('selectedSuggestion', null);
  }
}, checkStringLength:function(inString, record) {
  var me = this;
  var testString = inString.trim();
  var ret = false;
  if (record && record.data.minLength) {
    if (testString.length >= record.data.minLength) {
      ret = true;
    } else {
      if (record.data.minLengthError) {
        ABP.view.base.popUp.PopUp.showError(record.data.minLengthError);
      }
    }
  }
  return ret;
}, expandSearchBar:function() {
  var me = this;
  var vm = me.getViewModel();
  var recentStore = vm.getStore('recentSearches');
  if (!recentStore.isLoaded()) {
    recentStore.load();
  }
  this.initSuggestions();
  me.__openInBar();
  vm.set('searchBar.open', true);
  me.focusSearchField();
}, onToggleKeyPressed:function(args) {
  var me = this;
  if (args) {
    me.setSearch(args);
  }
  var vm = me.getViewModel();
  var open = vm.get('searchBar.open');
  if (!open) {
    me.onSearchClick({shortcut:true});
  }
}, fireLoadRequest:function(search, searchText) {
  var me = this;
  var search = me.getSearchProvider();
  if (me.fireEvent(search.data.appId + '_' + search.data.suggestionEvent, {searchId:search.id, text:searchText})) {
    me.pendingRequests++;
    me.showSuggestions(true);
  }
}, getSuggestions:function() {
  var me = this;
  var view = me.getView();
  var field = view.lookupReference('searchbarSearchField');
  var value = field.value;
  me.onSearchFieldChange(field, value);
}}});
Ext.define('ABP.view.session.toolbarTop.search.SearchBarViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.searchbarmodel', requires:['ABP.model.SearchModel', 'ABP.store.ABPRecentSearchStore'], data:{selectedSuggestion:null}, stores:{recentSearches:{xclass:'ABP.store.ABPRecentSearchStore'}, suggestions:{model:'ABP.model.Suggestion', sortOnLoad:true, sorters:{property:'timestamp', direction:'DESC'}}}, formulas:{emptyText:{bind:{_preSearch:'{i18n.search_searchText}', _selectedSearch:'{searchBar.selectedSearch}'}, 
get:function(data) {
  return data._preSearch + ' ' + data._selectedSearch;
}}, modernWidth:{get:function() {
  var ret = 475;
  if (ABP.util.Common.getSmallScreen()) {
    ret = '100%';
  }
  return ret;
}}, modernDock:{get:function() {
  var ret = null;
  if (ABP.util.Common.getSmallScreen()) {
    ret = 'top';
  }
  return ret;
}}, selectedSearchTextLS:{bind:{__selectedSearch:'{searchBar.selectedSearch}'}, get:function(data) {
  var ss;
  var modern = ABP.util.Common.getModern();
  var ret = '';
  if (modern) {
    ss = ABP.util.Common.getSmallScreen();
    if (!ss) {
      ret = data.__selectedSearch;
    }
  }
  return ret;
}}, showBarMenuButton:{bind:{__open:'{searchBar.open}', __menu:'{searchBar.menuOptions}'}, get:function(data) {
  return data.__open && data.__menu.length > 1;
}}, showDropMenuButton:{bind:{__menu:'{searchProviders}'}, get:function(data) {
  var ret = false;
  if (data.__menu.getCount() < 2) {
    return true;
  }
  return ret;
}}}});
Ext.define('ABP.view.base.abpNumberField.ABPNumberField', {extend:'Ext.field.Number', alias:'widget.abpnumberfield', privates:{getValue:function() {
  this.callParent();
  var maxLength = this.getMaxLength();
  var val = this._value;
  if (!maxLength) {
    return val;
  }
  var valLen = val.toString().length;
  if (valLen > maxLength) {
    ret = val.toString().slice(0, maxLength);
    this.setValue(ret);
  } else {
    ret = val;
  }
  return val;
}}, checkValue:function() {
  var ret = true;
  var val = this._value;
  var maxVal = this.getMaxValue();
  var minVal = this.getMinValue();
  var valString;
  if (minVal && val < minVal) {
    valString = ABP.util.Common.geti18nString('login_extraValue');
    ret = false;
    ABP.view.base.popUp.PopUp.showError(this.getPlaceholder() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
  } else {
    if (maxVal && val > maxVal) {
      valString = ABP.util.Common.geti18nString('login_extraValue');
      ret = false;
      ABP.view.base.popUp.PopUp.showError(this.getPlaceholder() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
    }
  }
  return ret;
}, getErrorString:function() {
  var maxVal = this.getMaxValue();
  var minVal = this.getMinValue();
  var valString = ABP.util.Common.geti18nString('login_extraValue');
  return this.getPlaceholder() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')';
}, syncEmptyCls:function() {
  var val = this._value, empty = val !== undefined && val !== null && val !== '';
  this.toggleCls(this.emptyCls, !empty);
}});
Ext.define('ABP.view.base.components.ExpandPanel', {extend:'Ext.Dialog', requires:['ABP.view.base.components.ExpandPanelViewModel'], alias:'widget.abpexpandpanel', cls:'baseexpandpanel', bodyCls:'x-unselectable', floating:true, modal:true, centered:true, hideOnMaskTap:true, manageBorders:false, draggable:false, config:{parentComponent:undefined, desiredWidth:500, desiredHeight:400, margin:0, fullscreenContainer:undefined}, bumper:10, animationDuration:250, origin:{x:0, y:0, height:100, width:100}, 
tools:[], listeners:{beforeclose:function() {
  var me = this;
  if (me.waitForAnimation) {
    me.animate({duration:me.animationDuration, to:{x:me.origin.x, y:me.origin.y, width:me.origin.width, height:me.origin.height}, callback:function() {
      me.waitForAnimation = false;
      me.close();
    }});
    return false;
  }
}, beforedestroy:function() {
  Ext.Viewport.un('orientationchange', this.onViewportResize, this);
}}, constructor:function(config) {
  config = config || {};
  if (!config.parentComponent) {
    ABP.util.Logger.logError("'parentComponent' not included in config.", 'The parent component must be passed into the base expand panel.');
  }
  this.callParent([config]);
  if (!config.fullscreen) {
    Ext.Viewport.add(this);
  }
}, initialize:function() {
  var me = this;
  me.callParent();
  var parent = me.getParentComponent();
  if (parent) {
    var size = parent.getSize();
    me.origin.width = size.width;
    me.origin.height = size.height;
    me.origin.x = parent.getX();
    me.origin.y = parent.getY();
  }
  me.onViewportResize();
  me.setTools((this.tools || []).concat([{type:'close', iconCls:'icon-navigate-cross', handler:function() {
    me.close();
  }}]));
  Ext.Viewport.on('orientationchange', me.onViewportResize, me);
}, privates:{getMaxSize:function(width, height) {
  var me = this;
  var vpSize = Ext.getBody().getViewSize();
  var maxSize = Ext.clone(vpSize);
  if (Ext.Viewport.getOrientation() === Ext.Viewport.PORTRAIT) {
    if (vpSize.width > vpSize.height) {
      maxSize.height = vpSize.width;
      maxSize.width = vpSize.height;
    }
  } else {
    if (vpSize.width < vpSize.height) {
      maxSize.height = vpSize.width;
      maxSize.width = vpSize.height;
    }
  }
  maxSize.width -= me.bumper * 2;
  maxSize.height -= me.bumper * 2;
  if (!me.fullscreen) {
    maxSize.width = Math.min(me.getDesiredWidth(), maxSize.width);
    maxSize.height = Math.min(me.getDesiredHeight(), maxSize.height);
  }
  return maxSize;
}, onViewportResize:function(vp, orientation, width, height) {
  var me = this;
  var size = me.getMaxSize(width, height);
  var to = {x:null, y:null, width:size.width, height:size.height};
  me.setSize(to.width, to.height);
  if (me.fullscreen) {
    to.y = me.bumper;
    to.x = me.bumper;
    me.setCentered(false);
    me.setX(to.x);
    me.setY(to.y);
  } else {
    me.center();
  }
}, isPhone:function() {
  return Ext.os.deviceType === 'Phone';
}}});
Ext.define('ABP.view.components.LoadingLine', {extend:'Ext.Component', alias:'widget.abploadingline', cls:'abp-loading-line', height:1, hideMode:'offsets', html:'\x3cspan class\x3d"bar1"\x3e\x3c/span\x3e\x3cspan class\x3d"bar2"\x3e\x3c/span\x3e\x3cspan class\x3d"bar3"\x3e\x3c/span\x3e\x3cspan class\x3d"bar4"\x3e\x3c/span\x3e\x3cspan class\x3d"bar5"\x3e\x3c/span\x3e\x3cspan class\x3d"bar6"\x3e\x3c/span\x3e\x3cspan class\x3d"bar7"\x3e\x3c/span\x3e\x3cspan class\x3d"bar8"\x3e\x3c/span\x3e\x3cspan class\x3d"bar9"\x3e\x3c/span\x3e\x3cspan class\x3d"bar10"\x3e\x3c/span\x3e'});
Ext.define('ABP.view.base.rightpane.RightPanePanel', {extend:'Ext.Panel', alias:'widget.baserightpanepanel', scrollable:'vertical', focusableContainer:true, activeMenuButton:null, initialize:function() {
  var me = this;
  me.setTools((me.config.tools || []).concat([{type:'close', automationCls:'rightpanel-btn-close', handler:'baseRightPanePanel_toggleRightPane'}]));
  this.callParent();
}});
Ext.define('ABP.view.base.timePicker.Time', {extend:'Ext.picker.Picker', xtype:'timepicker', requires:['Ext.util.InputBlocker'], config:{yearFrom:1945, yearTo:(new Date).getFullYear(), hourText:'Hour', minuteText:'Minute', periodText:'Period', slotOrder:['hour', 'minute', 'period'], doneButton:true}, initialize:function() {
  this.callParent();
  this.on({scope:this, delegate:'\x3e slot', slotpick:this.onSlotPick});
  this.on({scope:this, show:this.onSlotPick});
}, setValue:function(value, animated) {
  if (Ext.isDate(value)) {
    value = {day:value.getDate(), month:value.getMonth() + 1, year:value.getFullYear()};
  }
  this.callParent([value, animated]);
  this.onSlotPick();
}, getValue:function(useDom) {
  var values = {}, items = this.getItems().items, ln = items.length, daysInMonth, day, month, year, item, i;
  for (i = 0; i < ln; i++) {
    item = items[i];
    if (item instanceof Ext.picker.Slot) {
      values[item.getName()] = item.getValue(useDom);
    }
  }
  if (values.year === null && values.month === null && values.day === null) {
    return null;
  }
  year = Ext.isNumber(values.year) ? values.year : 1;
  month = Ext.isNumber(values.month) ? values.month : 1;
  day = Ext.isNumber(values.day) ? values.day : 1;
  if (month && year && month && day) {
    daysInMonth = this.getDaysInMonth(month, year);
  }
  day = daysInMonth ? Math.min(day, daysInMonth) : day;
  return new Date(year, month - 1, day);
}, updateYearFrom:function() {
  if (this.initialized) {
    this.createSlots();
  }
}, updateYearTo:function() {
  if (this.initialized) {
    this.createSlots();
  }
}, updateMonthText:function(newMonthText, oldMonthText) {
  var innerItems = this.getInnerItems, ln = innerItems.length, item, i;
  if (this.initialized) {
    for (i = 0; i < ln; i++) {
      item = innerItems[i];
      if (typeof item.title == 'string' && item.title == oldMonthText || item.title.html == oldMonthText) {
        item.setTitle(newMonthText);
      }
    }
  }
}, updateDayText:function(newDayText, oldDayText) {
  var innerItems = this.getInnerItems, ln = innerItems.length, item, i;
  if (this.initialized) {
    for (i = 0; i < ln; i++) {
      item = innerItems[i];
      if (typeof item.title == 'string' && item.title == oldDayText || item.title.html == oldDayText) {
        item.setTitle(newDayText);
      }
    }
  }
}, updateYearText:function(yearText) {
  var innerItems = this.getInnerItems, ln = innerItems.length, item, i;
  if (this.initialized) {
    for (i = 0; i < ln; i++) {
      item = innerItems[i];
      if (item.title == this.yearText) {
        item.setTitle(yearText);
      }
    }
  }
}, constructor:function() {
  this.callParent(arguments);
  this.createSlots();
}, createSlots:function() {
  var me = this;
  slotOrder = me.getSlotOrder(), hours = [], minutes = [], period = [], minDisplay = '', i = 0;
  for (i = 0; i < 12; ++i) {
    hours.push({text:i + 1, value:i + 1});
  }
  for (i = 0; i < 60; ++i) {
    if (i < 10) {
      minDisplay = '0' + i;
    } else {
      minDisplay = i;
    }
    minutes.push({text:minDisplay, value:i});
  }
  period = [{text:'am', value:'am'}, {text:'pm', value:'pm'}];
  var slots = [];
  slotOrder.forEach(function(item) {
    slots.push(me.createSlot(item, hours, minutes, period));
  });
  me.setSlots(slots);
}, createSlot:function(name, hours, minutes, period) {
  switch(name) {
    case 'hour':
      return {name:'hour', align:'center', data:hours, title:this.getHourText(), flex:1};
    case 'minute':
      return {name:name, align:'right', data:minutes, title:this.getMinuteText(), flex:1};
    case 'period':
      return {name:'period', align:'center', data:period, title:this.getPeriodText(), flex:1};
  }
}, onSlotPick:function() {
  var value = this.getValue(true), slot = this.getDaySlot(), year = value.getFullYear(), month = value.getMonth(), days = [], daysInMonth, i;
  if (!value || !Ext.isDate(value) || !slot) {
    return;
  }
  this.callParent(arguments);
  daysInMonth = this.getDaysInMonth(month + 1, year);
  for (i = 0; i < daysInMonth; i++) {
    days.push({text:i + 1, value:i + 1});
  }
  if (slot.getStore().getCount() == days.length) {
    return;
  }
  slot.getStore().setData(days);
  var store = slot.getStore(), viewItems = slot.getViewItems(), valueField = slot.getValueField(), index, item;
  index = store.find(valueField, value.getDate());
  if (index == -1) {
    return;
  }
  item = Ext.get(viewItems[index]);
  slot.selectedIndex = index;
  slot.scrollToItem(item);
  slot.setValue(slot.getValue(true));
}, getDaySlot:function() {
  var innerItems = this.getInnerItems(), ln = innerItems.length, i, slot;
  if (this.daySlot) {
    return this.daySlot;
  }
  for (i = 0; i < ln; i++) {
    slot = innerItems[i];
    if (slot.isSlot && slot.getName() == 'day') {
      this.daySlot = slot;
      return slot;
    }
  }
  return null;
}, getDaysInMonth:function(month, year) {
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month - 1];
}, isLeapYear:function(year) {
  return !!((year & 3) === 0 && (year % 100 || year % 400 === 0 && year));
}, onDoneButtonTap:function() {
  var oldValue = this._value, newValue = this.getValue(true), testValue = newValue;
  if (Ext.isDate(newValue)) {
    testValue = newValue.toDateString();
  }
  if (Ext.isDate(oldValue)) {
    oldValue = oldValue.toDateString();
  }
  if (testValue != oldValue) {
    this.fireEvent('change', this, newValue);
  }
  this.hide();
  Ext.util.InputBlocker.unblockInputs();
}});
Ext.define('ABP.view.base.timePicker.TimePicker', {extend:'Ext.field.Picker', xtype:'timepickerfield', requires:['ABP.view.base.timePicker.Time'], config:{ui:'select', picker:true, destroyPickerOnHide:false, dateFormat:''}, applyValue:function(value, oldValue) {
  if (!Ext.isDate(value)) {
    if (value) {
      value = Ext.Date.parse(value, this.getDateFormat());
    } else {
      value = null;
    }
  }
  if (value && oldValue && value.getTime() === oldValue.getTime()) {
    value = undefined;
  }
  return value;
}, updateValue:function(value, oldValue) {
  var me = this, picker = me._picker;
  if (picker && picker.isPicker) {
    picker.setValue(value);
  }
  if (value !== null) {
    me.getComponent().setValue(Ext.Date.format(value, me.getDateFormat()));
  } else {
    me.getComponent().setValue('');
  }
  me.fireEvent('change', me, value, oldValue);
}, applyDateFormat:function(dateFormat) {
  return dateFormat || Ext.util.Format.defaultDateFormat;
}, updateDateFormat:function(newDateFormat) {
  var value = this.getValue();
  if (Ext.isDate(value)) {
    this.getComponent().setValue(Ext.Date.format(value, newDateFormat));
  }
}, getFormattedValue:function(format) {
  var value = this.getValue();
  return Ext.isDate(value) ? Ext.Date.format(value, format || this.getDateFormat()) : '';
}, applyPicker:function(picker, pickerInstance) {
  if (pickerInstance && pickerInstance.isPicker) {
    picker = pickerInstance.setConfig(picker);
  }
  return picker;
}, getPicker:function() {
  var picker = this._picker, value = this.getValue();
  if (picker && !picker.isPicker) {
    picker = Ext.factory(picker, ABP.view.base.timePicker.Time);
    if (value !== null) {
      picker.setValue(value);
    }
  }
  picker.on({scope:this, change:'onPickerChange', hide:'onPickerHide'});
  this._picker = picker;
  return picker;
}, onPickerChange:function(picker, value) {
  var me = this, oldValue = me.getValue();
  me.setValue(value);
  me.fireEvent('select', me, value);
}, onPickerHide:function() {
  var me = this, picker = me.getPicker();
  if (me.getDestroyPickerOnHide() && picker) {
    picker.destroy();
    me._picker = me.getInitialConfig().picker || true;
  }
}, reset:function() {
  this.setValue(this.originalValue);
}, onFocus:function(e) {
  var component = this.getComponent();
  this.fireEvent('focus', this, e);
  if (Ext.os.is.Android4) {
    component.input.dom.focus();
  }
  component.input.dom.blur();
  if (this.getReadOnly()) {
    return false;
  }
  this.isFocused = true;
  this.getPicker().show();
}, destroy:function() {
  var picker = this._picker;
  if (picker && picker.isPicker) {
    picker.destroy();
  }
  this.callParent();
}});
Ext.define('ABP.view.base.timePicker.TimePickerNative', {extend:'ABP.view.base.timePicker.TimePicker', xtype:'timepickernativefield', initialize:function() {
  this.callParent();
}, onFocus:function(e) {
  var me = this;
  if (!(navigator.plugins && navigator.plugins.dateTimePicker)) {
    me.callParent();
    return;
  }
  var success = function(res) {
    me.setValue(res);
  };
  var fail = function(e) {
    console.log('DateTimePicker: error occurred or cancelled: ' + e);
  };
  try {
    var dateTimePickerFunc = navigator.plugins.dateTimePicker.selectTime;
    dateTimePickerFunc(success, fail, {value:me.getValue()});
  } catch (ex) {
    fail(ex);
  }
}});
Ext.define('ABP.view.buttons.BadgeButton', {extend:'Ext.Button', xtype:'abpbadgebutton', config:{badgePriorityCls:null}, setBadgeValue:function(badgeValue) {
  var me = this;
  me.setBadgeText(badgeValue);
}, setBadgePriority:function(badgePriority) {
  var me = this, oldBadgePriorityCls = me.getBadgePriorityCls(), newBadgePriorityCls = null;
  if (oldBadgePriorityCls) {
    me.removeCls(oldBadgePriorityCls);
  }
  if (badgePriority === ABP.util.Constants.badgePriority.Alert) {
    newBadgePriorityCls = 'abp-badge-priority-alert';
  } else {
    if (badgePriority === ABP.util.Constants.badgePriority.Warning) {
      newBadgePriorityCls = 'abp-badge-priority-warning';
    } else {
      if (badgePriority === ABP.util.Constants.badgePriority.Success) {
        newBadgePriorityCls = 'abp-badge-priority-success';
      } else {
        if (badgePriority === ABP.util.Constants.badgePriority.Info) {
          newBadgePriorityCls = 'abp-badge-priority-info';
        }
      }
    }
  }
  me.setBadgePriorityCls(newBadgePriorityCls);
  me.addCls(newBadgePriorityCls);
}, incrementBadge:function(number) {
  var me = this, badgeValue = me.getBadgeText();
  if (badgeValue === null && !number) {
    me.setBadgeText(1);
  }
  if (Ext.isNumber(number)) {
    number = parseInt(number);
    if (number < 0) {
      return;
    }
    me.setBadgeText(badgeValue + number);
  } else {
    me.setBadgeText(++badgeValue);
  }
}, decrementBadge:function(number) {
  var me = this, badgeValue = me.getBadgeText();
  if (badgeValue === null) {
    return;
  }
  if (Ext.isNumber(number)) {
    number = parseInt(number);
    if (number < 0) {
      return;
    } else {
      if (number >= badgeValue) {
        me.setBadgeText(null);
      } else {
        me.setBadgeText(badgeValue - number);
      }
    }
  } else {
    if (badgeValue === 1) {
      me.setBadgeText(null);
    } else {
      me.setBadgeText(--badgeValue);
    }
  }
}, clearBadge:function() {
  var me = this;
  me.setBadgeText(null);
}});
Ext.define('ABP.view.components.ProfileImage', {extend:'Ext.Container', alias:'widget.abpprofileimage', config:{displayName:null, src:null, icon:'icon-user'}, baseCls:'abp-profile-picture', layout:'fit', referenceHolder:true, defaults:{top:0, left:0, height:'100%', width:'100%'}, items:[{xtype:'component', reference:'initials', cls:'abp-profile-picture-icon', html:''}, {xtype:'image', reference:'image', cls:'abp-profile-picture-image', hidden:true, listeners:{error:{fn:function() {
  this.lookupReferenceHolder().showImage(false);
}}}}], initialize:function() {
  var me = this;
  me.callParent();
  me.lookup('initials').addCls(me.getIcon());
}, updateSrc:function() {
  this.renderVisuals();
}, updateDisplayName:function() {
  this.renderVisuals();
}, renderVisuals:function() {
  var me = this;
  var image = me.lookup('image');
  var initials = me.lookup('initials');
  if (me.getSrc()) {
    image.setSrc(me.getSrc());
    me.showImage(true);
  } else {
    image.setSrc(null);
    me.showImage(false);
  }
}, showImage:function(show) {
  var me = this;
  me.lookup('image').setVisibility(show);
  me.lookup('initials').setVisibility(!show);
}});
Ext.define('ABP.view.components.panel.HeaderPanelBase', {extend:'Ext.Panel', alias:'widget.abpheaderpanel', closable:false, scrollable:true, header:{}, items:[], showBack:false, backHandler:Ext.emptyFn, showFilter:false, filterEmptyText:'{i18n.abp_filter_empty_text:htmlEncode}', initialize:function() {
  var me = this;
  var className = me.getCls() || '';
  me.setCls(className + ' abp-header-panel');
  if (me.items.items.length > 0) {
    me.initScrollListener();
  }
  me.initHeaderBar();
  me.callParent();
}, close:function() {
  var view = this;
  view.fireEvent('abpHeaderPanel_closeView', view);
  view.destroy();
}, showBackButton:function() {
  var me = this, backButton = me.down('#backButton');
  if (backButton) {
    backButton.show();
  }
}, hideBackButton:function() {
  var me = this, backButton = me.down('#backButton');
  if (backButton) {
    backButton.hide();
  }
}, privates:{initScrollListener:function() {
  var me = this;
  var layout = me.layout.type;
  var scrollable = me.getScrollable();
  var scrolledEl = me;
  if (layout === 'fit') {
    scrollable = me.items.items[0].getScrollable();
    if (scrollable) {
      scrolledEl = me.items.items[0];
    }
  }
  if (scrollable) {
    scrollable.on('scroll', function(scroller, x, y) {
      if (y > 6) {
        scrolledEl.addCls('abp-scrolled');
      } else {
        scrolledEl.removeCls('abp-scrolled');
      }
    });
  }
}, filterField:function() {
  var me = this;
  return {xtype:'textfield', itemId:'headerFilter', flex:3, maxWidth:300, minWidth:200, reference:'headerFilter', bind:{value:'{headerFilterValue}', placeholder:me.filterEmptyText}, listeners:{change:me.onFilterChanged, scope:me}};
}, backButton:function() {
  var me = this;
  return {xtype:'tool', itemId:'backButton', iconCls:'icon-fa-arrow-left', cls:'back-btn', callback:me.backHandler, bind:{tooltip:'{i18n.button_back:htmlEncode}'}};
}, initHeaderBar:function() {
  var me = this;
  if (me.showFilter) {
    me.getHeader().insert(1, me.filterField());
  }
  if (me.showBack) {
    me.getHeader().insert(0, me.backButton());
  }
}, onFilterChanged:function(textbox, newValue, oldValue) {
  this.fireEvent('abp_header_filterChange', textbox, newValue, oldValue);
}}});
Ext.define('ABP.view.launch.loading.Loading', {extend:'Ext.container.Container', alias:'widget.loadingscreen', componentCls:'launch-canvas', layout:{type:'vbox', align:'center', pack:'center'}, height:'100%', width:'100%', cls:'ABP-preauth-loading', items:[{xtype:'container', height:140, layout:{type:'vbox', align:'center'}, items:[{xtype:'component', html:'\x3cdiv class\x3d"login-hdr"\x3e\x3c/div\x3e', focusable:false}, {xtype:'component', cls:'bootstrap-loading', flex:1, hidden:'{hidePreAuthMessage}', 
html:'Connecting\x3cdiv class\x3d"bootstrap-loading-dot1"\x3e.\x3c/div\x3e\x3cdiv class\x3d"bootstrap-loading-dot2"\x3e.\x3c/div\x3e\x3cdiv class\x3d"bootstrap-loading-dot3"\x3e.\x3c/div\x3e'}]}]});
Ext.define('ABP.view.main.ABPMain', {extend:'Ext.Container', xtype:'app-main', requires:['Ext.MessageBox', 'ABP.view.launch.loading.Loading', 'ABP.view.main.ABPMainModel', 'ABP.view.main.ABPMainController', 'ABP.view.base.abpNumberField.ABPNumberField'], controller:'abpmaincontroller', viewModel:'abpmainmodel', layout:'fit', items:[{xtype:'loadingscreen'}], initialize:function() {
  var me = this;
  document.addEventListener('keydown', me.onKeyDown);
}, onKeyDown:function(e) {
  if (e.keyCode === 90) {
    if (e.ctrlKey && e.shiftKey) {
      ABP.view.base.automation.AutomationHintOverlay.toggle();
    }
  }
}});
Ext.define('ABP.view.session.toolbarTop.ToolbarTopController', {extend:'ABP.view.session.toolbarTop.ToolbarTopBaseController', alias:'controller.toolbartopcontroller', listen:{controller:{'*':{toolbar_updateRightPaneButtonBadge:'__updateRightPaneButtonBadge'}}}, constructRightPane:function(segmentedButtons) {
  var me = this, view = me.getView(), sessionVm = view.up('sessioncanvas').getViewModel(), i, j, rightPaneTabs = [], sessionConfig = ABP.util.Config.getSessionConfig(), notificationsEnabled = sessionConfig.settings.notifications.enabled, enabledRightPaneTabs = sessionConfig.settings.rightPane, registeredRightPaneTabs = ABP.util.Config.config.rightPaneTabs, btnCls = ['toolbar-button', 'toolbar-menu-button', 'toolbar-rpsegment-button'];
  for (i = 0; i < enabledRightPaneTabs.length; i++) {
    for (j = 0; j < registeredRightPaneTabs.length; j++) {
      var configTabName = enabledRightPaneTabs[i];
      if (Ext.isObject(enabledRightPaneTabs[i])) {
        configTabName = enabledRightPaneTabs[i].name;
      }
      if (configTabName === registeredRightPaneTabs[j].name) {
        rightPaneTabs.push(registeredRightPaneTabs[j]);
        break;
      }
    }
  }
  if (!segmentedButtons) {
    segmentedButtons = me.getView().down('rightpaneButtons');
  }
  if (sessionVm) {
    sessionVm.set('rightPaneTabs', rightPaneTabs);
  }
  if (rightPaneTabs.length > 0 || notificationsEnabled) {
    segmentedButtons.add({xtype:'abpbadgebutton', itemId:'rpButton', iconCls:'icon-all toolbar-icon', cls:btnCls.concat(['a-toolbar-rpsegment-abp-rightpane-all']), userCls:['dark', 'medium'], pressedCls:'toolbar-button-pressed', handler:'toggleRightPane'});
  } else {
    segmentedButtons.add({itemId:'rpButton', iconCls:'icon-user toolbar-icon', cls:btnCls, userCls:['dark', 'medium'], pressedCls:'toolbar-button-pressed', handler:'toggleRightPane'});
  }
}, setVisibilityRightPaneButton:function(btnItemId, show) {
  var me = this, view = me.getView(), tabs = view.up().down('#rightPane').innerItems;
  if (btnItemId.indexOf('rightPaneTab_') === -1) {
    btnItemId = 'rightPaneTab_' + btnItemId;
  }
  var tab = tabs.filter(function(item) {
    return item.uniqueId === btnItemId;
  });
  tab = tab && tab.length > 0 ? tab[0] : null;
  if (tab) {
    if (show === true) {
      tab.show();
    } else {
      if (show == false) {
        tab.hide();
      }
    }
  }
}, __addPressedCls:function(btnUniqueId) {
  var me = this, view = me.getView(), segmentedButtons = view.down('rightpaneButtons'), btn = me.__findRightPaneButton(btnUniqueId);
  if (btn) {
    segmentedButtons.setPressedButtons([btn]);
  }
}, __removePressedCls:function() {
  var me = this, view = me.getView(), segmentedButtons = view.up('rightpaneButtons');
  segmentedButtons.setPressedButtons([]);
}, __updateRightPaneButtonBadge:function(value, priority) {
  var me = this, view = me.getView(), segmentedButtons = view.down('#rightpaneButtons');
  var button = segmentedButtons.down('#rpButton');
  if (value >= 100) {
    value = '99+';
  }
  button.setBadgeText(value);
  if (priority) {
    this.__updateRightPaneButtonPriority(button, priority);
  }
}, __updateRightPaneButtonPriority:function(button, priority) {
  var buttonClasses = button.getCls();
  if (buttonClasses) {
    buttonClasses = buttonClasses.filter(function(className, i) {
      return className.indexOf('abp-badge-priority') === -1;
    });
    buttonClasses.push(priority);
    button.setCls(buttonClasses);
  }
}, __findRightPaneButton:function(btnUniqueId) {
  var me = this, view = me.getView(), segmentedButtons = view.down('#rightpaneButtons'), button;
  if (segmentedButtons) {
    button = segmentedButtons.down('#rpButton');
  }
  if (!button) {
    ABP.util.Logger.logWarn('Could not find right pane button ' + btnUniqueId);
  }
  return button;
}, privates:{__updateBadge:function() {
}, __incrementBadge:function() {
}, __decrementBadge:function() {
}, __clearBadge:function() {
}}});
Ext.define('ABP.view.session.toolbarTop.ToolbarTop', {extend:'Ext.TitleBar', alias:'widget.toolbartop', requires:['ABP.view.session.toolbarTop.ToolbarTopController'], viewModel:{type:'toolbartopmodel'}, controller:'toolbartopcontroller', docked:'top', bind:{title:'{toolbarTitle:htmlEncode}', height:'{toolbarHeight}', cls:'{toolCls}'}, titleAlign:'Center', items:[{xtype:'container', align:'left', layout:{type:'hbox', align:'start', pack:'start'}, itemId:'tool-buttons-left', docked:'left', cls:'left-cont', 
items:[{xtype:'button', cls:'tool-button-left toolbar-button a-toolbar-main-menu', ariaLabel:'{i18n.toolbar_toggleNavigation:ariaEncode}', iconCls:'icon-menu toolbar-icon', itemId:'toolbar-button-menu', handler:'toggleMenu', pressedCls:'toolbar-button-pressed', userCls:['dark', 'medium']}]}, {xtype:'segmentedbutton', docked:'right', align:'right', itemId:'rightpaneButtons', bind:{height:'{toolbarHeight}'}, items:[], allowMultiple:false, allowDepress:true, listeners:{initialize:'constructRightPane'}}, 
{xtype:'container', align:'right', layout:{type:'hbox', align:'end', pack:'end'}, itemId:'tool-buttons-right', docked:'right', cls:'right-cont', items:[], addButton:function(buttonToAdd) {
  var me = this;
  me.insert(0, buttonToAdd);
}}]});
Ext.define('ABP.view.session.help.HelpTile', {extend:'Ext.container.Container', alias:'widget.helptile', layout:{type:'vbox', align:'center'}, config:{title:'', links:[]}, minHeight:Ext.os.deviceType === 'Phone' ? 160 : 220, cls:Ext.os.deviceType === 'Phone' ? 'abphelptile-tilebody abphelptile-tilebody_phone' : 'abphelptile-tilebody abphelptile-tilebody_tablet', items:[{xtype:'component', itemId:'abp-helptile-title', cls:'abphelptile-title', width:'90%'}, {xtype:'container', width:'100%', layout:{type:'vbox', 
align:'center'}, cls:'abphelptile-links', itemId:'abp-helptile-body'}], constructor:function(args) {
  var me = this;
  me.callParent(args);
  var items = me.items;
  items = me.getInnerItems();
  me.setTitle(args.title);
  me.setLinks(args.links);
  var linksToAdd = [];
  for (var i = 0; i < args.links.length; ++i) {
    linksToAdd.push({xtype:'button', cls:'link_link' + ' a-help-link-' + args.links[i].product.replace(' ', '-') + '-' + args.links[i].type.replace(' ', '-'), text:args.links[i].name, url:args.links[i].link, handler:'linkClick'});
  }
  for (var i = 0; i < linksToAdd.length; ++i) {
    items[1].add(linksToAdd[i]);
  }
  items[0].setHtml(Ext.htmlEncode(args.title));
}});
Ext.define('ABP.view.session.help.Help', {extend:'ABP.view.components.panel.HeaderPanelBase', alias:'widget.helpview', requires:['ABP.view.session.help.HelpController', 'ABP.view.session.help.HelpViewModel', 'ABP.view.session.help.HelpTile'], viewModel:{type:'helpviewviewmodel'}, controller:'helpcontroller', layout:{type:'vbox', align:'stretch'}, cls:'x-unselectable about-container', height:'100%', width:'100%', scrollable:'y', bind:{title:'{i18n.help_title}'}, closable:true, items:[{xtype:'container', 
cls:Ext.os.deviceType === 'Phone' ? 'help_aptean_header help_aptean_header_phone' : 'help_aptean_header help_aptean_header_tablet', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'component', itemId:'help-aptean-logo', cls:Ext.os.deviceType === 'Phone' ? 'help_aptean_logo help_aptean_logo_phone' : 'help_aptean_logo help_aptean_logo_tablet'}, {xtype:'label', cls:Ext.os.deviceType === 'Phone' ? 'help_aptean_text help_aptean_text_phone' : 'help_aptean_text help_aptean_text_tablet', bind:{html:'{i18n.help_text:htmlEncode}'}}]}, 
{xtype:'container', reference:'abp-help-tile-container', cls:Ext.os.deviceType === 'Phone' ? 'abp-help-tile-container abp-help-tile-container_phone' : 'abp-help-tile-container abp-help-tile-container_tablet', innerCls:'abp-help-tile-container-inner', width:'100%', defaultType:'helptile'}], initialize:function() {
  var me = this;
  me.callParent();
  me.getViewModel().LoadStoreData();
  me.fireEvent('helpview_intialLoad');
}});
Ext.define('ABP.view.session.about.AboutItem', {extend:'Ext.Container', alias:'widget.aboutitem', layout:{type:'vbox', pack:'center', align:'center'}, cls:'x-unselectable about-item-container', config:{showIcon:undefined, icon:undefined, name:undefined, version:undefined, build:undefined, detail:undefined, copyright:undefined}, minHeight:Ext.os.deviceType === 'Phone' ? 200 : 240, cls:Ext.os.deviceType === 'Phone' ? 'x-unselectable about-item-container about-item-container_phone' : 'x-unselectable about-item-container about-item-container_tablet', 
initialize:function() {
  var me = this;
  var linkcls = '';
  var items = [];
  if (me.getShowIcon()) {
    if (me.getIcon()) {
      items.push({xtype:'component', cls:'about-item-icon icon-' + me.getIcon()});
    } else {
      items.push({xtype:'component', cls:'about-item-icon icon-gearwheel'});
    }
  }
  items.push({xtype:'component', cls:'about-item-title', html:me.getName()});
  if (me.getVersion()) {
    items.push({xtype:'component', cls:'about-item-text', bind:{html:'{i18n.about_version:htmlEncode} ' + me.getVersion()}});
  }
  if (me.getBuild()) {
    items.push({xtype:'component', cls:'about-item-text', bind:{html:'{i18n.about_build:htmlEncode} ' + me.getBuild()}});
  }
  if (me.getCopyright()) {
    items.push({xtype:'component', cls:'about-item-text', html:me.getCopyright()});
  }
  if (me.getDetail()) {
    linkcls = 'a-about-' + me.getName().replace(' ', '-');
    items.push({xtype:'component', cls:'about-item-detail' + ' ' + linkcls, bind:{html:'{i18n.about_detail:htmlEncode}'}, listeners:{click:{element:'element', fn:function() {
      ABP.view.base.popUp.PopUp.customPopup(me.getDetail(), me.getName());
    }}}});
  }
  me.setItems(items);
  me.callParent();
}});
Ext.define('ABP.view.session.about.About', {extend:'ABP.view.components.panel.HeaderPanelBase', alias:'widget.about', requires:['ABP.view.session.about.AboutItem', 'ABP.view.session.about.AboutController', 'ABP.view.session.about.AboutViewModel'], controller:'about', viewModel:{type:'about'}, layout:{type:'vbox'}, cls:'x-unselectable', height:'100%', width:'100%', scrollable:'y', bind:{title:'{i18n.about_title}'}, closable:true, items:[{xtype:'container', layout:{type:'hbox', pack:'center'}, width:'100%', 
cls:'about-section-header-container', items:[{xtype:'component', bind:{html:'{i18n.about_applications:htmlEncode}'}, cls:'about-section-header'}]}, {xtype:'container', width:'100%', cls:'about-section', layout:{type:'vbox', align:'center'}, items:[{xtype:'component', bind:{html:'{i18n.about_info:htmlEncode}'}, cls:'about-section-info', width:'100%'}, {xtype:'container', cls:'about-tile-container', cls:Ext.os.deviceType === 'Phone' ? 'about-tile-container about-tile-container_phone' : 'about-tile-container about-tile-container_tablet', 
innerCls:'about-tile-container-inner', width:'100%', itemId:'aboutAppsList', items:[]}]}, {xtype:'container', layout:{type:'hbox', pack:'center'}, width:'100%', cls:'about-section-header-container', items:[{xtype:'component', bind:{html:'{i18n.about_thirdparty:htmlEncode}'}, cls:'about-section-header'}]}, {xtype:'container', width:'100%', cls:'about-section', itemId:'aboutThirdPartySection', layout:{type:'vbox', align:'center'}, items:[{xtype:'container', cls:Ext.os.deviceType === 'Phone' ? 'about-tile-container about-tile-container_phone' : 
'about-tile-container about-tile-container_tablet', innerCls:'about-tile-container-inner', width:'100%', itemId:'aboutThirdPartyList', items:[]}]}]});
Ext.define('ABP.view.session.logger.LoggerPage', {extend:'ABP.view.components.panel.HeaderPanelBase', alias:'widget.loggerpage', requires:['ABP.util.Logger', 'ABP.view.session.logger.LoggerController', 'ABP.view.session.logger.LoggerViewModel'], controller:'loggerpagecontroller', viewModel:{type:'loggerviewmodel'}, layout:{type:'fit'}, scrollable:'y', cls:'about-container', height:'100%', width:'100%', showFilter:Ext.os.deviceType === 'Phone' ? false : true, tools:[{itemId:'clearLog', iconCls:'icon-garbage-can', 
callback:'clearClicked', bind:{tooltip:'{i18n.logger_clear:htmlEncode}'}}], header:Ext.os.deviceType === 'Phone' ? null : {items:[{xtype:'selectfield', bind:{store:'{severity}'}, cls:'logpage-combo', itemId:'loggerSeverity', labelCls:'logpage-combo-label', displayField:'display', valueField:'value', editable:false, autoSelect:true, value:'ALL', listeners:{change:'severityChanged'}}]}, items:[{xtype:'dataview', store:'ABPLoggingStore', margin:'4 4 4 4', flex:1, itemTpl:['\x3cdiv class\x3d"log-item {level:this.cls(values,parent[xindex-2],xindex-1,xcount)}"\x3e' + 
'{date:this.formatDate(values,parent[xindex-2],xindex-1,xcount)}' + '\x3cdiv class\x3d"time-wrap"\x3e' + '\x3cdiv class\x3d"log-item-abrev abp-logger-{level}" title\x3d"{level}"\x3e{level:this.firstChar}\x3c/div\x3e' + '\x3c/div\x3e' + '\x3cdiv class\x3d"line-wrap"\x3e' + '\x3cdiv class\x3d"contents-wrap"\x3e' + '\x3clabel class\x3d"abp-logger-{level}"\x3e{level}\x3c/label\x3e' + '\x3cspan class\x3d"message"\x3e{message}\x3c/span' + '\x3cspan class\x3d"detail"\x3e{detail}\x3c/span\x3e' + '{time:this.formatTime(values,parent[xindex-2],xindex-1,xcount)}' + 
'\x3c/div\x3e' + '\x3c/div\x3e' + '\x3c/div\x3e', {cls:function(value, record, previous, index, count) {
  var cls = '';
  if (!index) {
    cls += ' timeline-item-first';
  }
  if (index > count - 2) {
    cls += ' timeline-item-last';
  }
  return cls;
}, firstChar:function(value) {
  return value.charAt(0).toUpperCase();
}, formatTime:function(value, record, previous, index, count) {
  var formattedValue = Ext.Date.format(new Date(value), 'H:i:s');
  if (formattedValue) {
    return '\x3cdiv class\x3d"log-item-time"\x3e' + formattedValue + '\x3c/div\x3e';
  }
  return '';
}, formatDate:function(value, record, previous, index, count) {
  var formattedValue = this.formatIfDifferent(record, previous, 'j F Y');
  if (formattedValue) {
    return '\x3cdiv class\x3d"timeline-epoch"\x3e' + formattedValue + '\x3c/div\x3e';
  }
  return '';
}, formatIfDifferent:function(current, previous, format) {
  var previousValue = previous && (previous.isModel ? previous.data : previous)['time'];
  var currentValue = current && (current.isModel ? current.data : current)['time'];
  currentValue = new Date(currentValue);
  var currentFormat = Ext.Date.format(currentValue, format);
  if (!previousValue) {
    return currentFormat;
  }
  previousValue = new Date(previousValue);
  var previousFormat = Ext.Date.format(previousValue, format);
  if (currentFormat === previousFormat) {
    return '';
  }
  return currentFormat;
}}]}], listeners:{abp_header_filterChange:'onFilterChanged'}, bind:{title:'{i18n.logger_title}'}, closable:true, initialize:function() {
  var me = this;
  me.callParent();
  if (Ext.os.deviceType === 'Phone') {
    me.add({xtype:'container', cls:'filtermenu-cont', reference:'filterMenu', docked:'top', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', itemId:'headerFilter', flex:2, height:32, margin:'3px 5px 3px 5px', reference:'headerFilter', bind:{value:'{headerFilterValue}', placeholder:'{i18n.abp_filter_empty_text:htmlEncode}'}, listeners:{change:'onFilterChanged'}}, {xtype:'selectfield', flex:1, bind:{store:'{severity}'}, cls:'logpage-combo', itemId:'loggerSeverity', labelCls:'logpage-combo-label', 
    displayField:'display', valueField:'value', editable:false, autoSelect:true, value:'ALL', listeners:{change:'severityChanged'}}]});
  }
}});
Ext.define('ABP.view.session.settings.SettingsPage', {extend:'Ext.Panel', alias:'widget.settingspage', requires:['ABP.view.session.settings.SettingsPageController', 'ABP.view.session.settings.SettingsPageModel'], controller:'settingspage', viewModel:{type:'settingspage'}, layout:{type:'vbox', align:'stretch'}, cls:'x-unselectable settings-container', height:'100%', width:'100%', scrollable:'y', items:[]});
Ext.define('ABP.view.session.toolbarTop.search.SearchSelectorButton', {extend:'Ext.Button', alias:'widget.searchselectorbutton', iconCls:'x-fa fa-hand-lizard-o', itemId:'searchbarTypeButton', cls:'searchbar-button a-searchdrop-typebutton', pressedCls:'searchbar-button-press', config:{handler:function() {
  var picker;
  picker = this.getTabletPicker();
  if (!picker.getParent()) {
    Ext.Viewport.add(picker);
  }
  picker.showBy(this, null);
}, displayField:'name', valueField:'id', iconField:'icon', value:0, store:'{searchProviders}'}, bind:{store:'{searchProviders}', iconCls:'{searchBar.selectedSearchCls}', text:'{selectedSearchTextLS}', hidden:'{showDropMenuButton}'}, setStore:function(store) {
  this.config.store = store;
}, getStore:function() {
  return this.config.store;
}, getIconField:function() {
  return this.iconField;
}, getPicker:function() {
  var me = this, phonePicker = me.phonePicker, config;
  if (!phonePicker) {
    me.phonePicker = phonePicker = Ext.create('Ext.picker.Picker', {slots:[{align:'center', name:'select', valueField:me.getValueField(), displayField:me.getDisplayField(), iconField:me.getIconField(), value:me.getValue(), store:me.getStore(), itemTpl:'\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'picker-item {cls} \x3ctpl if\x3d"extra"\x3e' + Ext.baseCSSPrefix + 'picker-invalid\x3c/tpl\x3e"\x3e\x3cdiv class\x3d"{' + this.config.iconField + '}"\x3e\x3cspan\x3e\x26nbsp\x26nbsp\x26nbsp\x26nbsp{' + this.config.displayField + 
    '}\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e'}], cancelButton:ABP.util.Common.geti18nString('error_cancel_btn'), doneButton:ABP.util.Common.geti18nString('selectfield_mobile_done'), listeners:{change:me.onPickerChange, scope:me}});
  }
  return phonePicker;
}, onPickerChange:function(picker, value) {
  var me = this;
  var store = me.getStore();
  var record = store.getById(value.select);
  var search = {};
  if (record && record.data) {
    search.searchId = record.data.id;
    search.iconCls = me.__makeIconString(record.data.icon);
  }
  me.fireEvent('searchDrop_setSearch', search);
  me.fireEvent('searchDrop_focusSearch');
}, getTabletPicker:function() {
  var me = this, tabletPicker = me.tabletPicker, config;
  if (!tabletPicker) {
    me.tabletPicker = tabletPicker = Ext.create('Ext.Panel', Ext.apply({left:0, top:0, itemId:'findMe', modal:true, cls:Ext.baseCSSPrefix + 'select-overlay', layout:'fit', hideOnMaskTap:true, width:Ext.os.is.Phone ? '14em' : '18em', height:Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10 ? '12em' : Ext.os.is.Phone ? '12.5em' : '22em', items:{xtype:'list', store:me.getStore(), itemTpl:'\x3cspan class\x3d"x-list-label {' + this.config.iconField + '}"\x3e\x26nbsp\x26nbsp\x26nbsp\x26nbsp{' + 
    me.getDisplayField() + ':htmlEncode}\x3c/span\x3e', listeners:{select:me.onListSelect, itemtap:me.onListTap, scope:me}}}, null));
  }
  return tabletPicker;
}, onListSelect:function(item, record) {
  var me = this;
  var search = {};
  if (record && record.data) {
    search.searchId = record.data.id;
    search.iconCls = me.__makeIconString(record.data.icon);
  }
  me.fireEvent('searchDrop_setSearch', search);
  me.fireEvent('searchDrop_focusSearch');
}, onListTap:function(picker) {
  picker.up().hide({type:'fade', out:true, scope:this});
}, __makeIconString:function(icon) {
  var ret = icon;
  var font = icon;
  font = font.split('-');
  ret = font[0] === 'fa' ? 'x-fa ' + icon : icon;
  return ret;
}});
Ext.define('ABP.view.session.toolbarTop.search.SearchPopup', {extend:'Ext.Container', alias:'widget.searchpopup', floated:true, hidden:true, modal:true, hideOnMaskTap:true, tabIndex:0, cls:'abp-popup-list', hidden:true, items:[{xtype:'dataview', tabIndex:0, overItemCls:'abp-popup-item-highlight', bind:{store:'{suggestions}', selection:'{selectedSuggestion}'}, itemTpl:['\x3cdiv class\x3d"abp-popup-list-outer"\x3e', '\x3cdiv class\x3d"abp-popup-list-searched"\x3e{text}\x3c/div\x3e', '\x3cdiv class\x3d"abp-popup-list-hierarchy"\x3e{hierarchy}\x3c/div\x3e', 
'\x3c/div\x3e'], itemSelector:'div.abp-popup-list-outer', listeners:{childtap:'onSuggestionClick'}}, {xtype:'component', itemId:'loading', html:'\x3cdiv class\x3d"abp-loadmask loading-bars"\x3e\x3cdiv class\x3d"bars slim"\x3e \x3cdiv class\x3d"rect1"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect2"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect3"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect4"\x3e\x3c/div\x3e \x3cdiv class\x3d"rect5"\x3e\x3c/div\x3e \x3c/div\x3e\x3c/div\x3e'}], setLoading:function(loading) {
  if (loading) {
    this.down('#loading').show();
  } else {
    this.down('#loading').hide();
  }
}});
Ext.define('ABP.view.session.toolbarTop.search.SearchBar', {extend:'Ext.Container', alias:'widget.searchbar', requires:['ABP.view.session.toolbarTop.search.SearchBarController', 'ABP.view.session.toolbarTop.search.SearchBarViewModel', 'ABP.view.session.toolbarTop.search.SearchSelectorButton', 'ABP.view.session.toolbarTop.search.SearchPopup'], controller:'searchbarcontroller', viewModel:{type:'searchbarmodel'}, height:44, width:'100%', bind:{docked:'{modernDock}', hidden:'{!searchBar.open}'}, listeners:{}, 
cls:'searchbar searchbaropen', layout:{type:'hbox'}, items:[{xtype:'searchselectorbutton', bind:{store:'{searchProviders}'}}, {xtype:'textfield', itemId:'searchbarSearchField', inputType:'search', cls:'searchbar-searchfield a-searchdrop-searchfield', clearable:false, bind:{placeholder:'{emptyText}', value:'{searchBar.val}'}, listeners:{change:'onSearchFieldChange', focus:'onSearchFieldFocus'}, triggers:{search:{iconCls:'icon-magnifying-glass', weight:-2, handler:'onSearchClick'}}, height:38, flex:1}, 
{xtype:'searchpopup', itemId:'GlobalSuggestionPopup'}, {xtype:'button', itemId:'searchbarAdvancedButton', focusCls:'', overCls:'searchbar-button-over', cls:'searchbar-button a-searchdrop-advancedbutton', bind:{text:'{i18n.search_advanced}'}, hidden:true}, {xtype:'button', itemId:'searchbarSearchButton', pressedCls:'searchbar-button-press', cls:'searchbar-button  a-searchdrop-searchbutton', iconCls:'icon-magnifying-glass', width:45, handler:'onSearchClick', hidden:true}]});
Ext.define('ABP.view.session.favorites.FavoritesManagerController', {extend:'ABP.view.session.favorites.FavoritesManagerControllerBase', alias:'controller.favoritesManager', onBackClick:function() {
  var me = this, view = me.getView();
  var favList = view.down('#favoritestree');
  favList.onBackTap();
}, onNavigateBack:function(nestedList, node, lastActiveList) {
  var me = this, view = me.getView(), vm = me.getViewModel();
  if (!node.parentNode) {
    return;
  }
  if (node.parentNode.id === 'root') {
    view.setTitle(vm.get('i18n.favorites_title'));
    view.hideBackButton();
  } else {
    view.setTitle(node.parentNode.get('text'));
  }
  me.__resolvePendingActions(nestedList);
}, addNewGroup:function() {
  var me = this, view = me.getView(), textField = view.down('#newgrouptext'), favList = view.down('#favoritestree');
  textValue = textField.getValue();
  if (!textValue) {
    textField.markInvalid(ABP.util.Common.geti18nString('favorites_newGroup_emptyText'));
    textField.focus();
    return;
  }
  if (favList) {
    var swiper = favList.getPlugin('nestedlistswiper');
    if (swiper) {
      swiper.dismissAll();
    }
  }
  var currentParent = view.favTree.getLastNode();
  if (currentParent) {
    currentParent.insertChild(0, {text:textValue, iconCls:'icon-folder', label:textValue, leaf:false, expanded:false});
  }
  textField.setValue(null);
}, editItemClicked:function(list, action) {
  var allowItemRename = true;
  if (action.record.isLeaf()) {
    allowItemRename = ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename');
  }
  var editPanel = Ext.create('ABP.view.session.favorites.FavoritesManagerEditPanel', {favorite:action.record, treeView:list, viewModel:{data:{allowItemRename:allowItemRename, depthLimit:ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit'), favorites_editPanel_title:ABP.util.Common.geti18nString('favorites_editPanel_title'), favorites_editPanel_name:ABP.util.Common.geti18nString('favorites_editPanel_name'), favorites_editPanel_source:ABP.util.Common.geti18nString('favorites_editPanel_source'), 
  favorites_editPanel_moveToGroup:ABP.util.Common.geti18nString('favorites_editPanel_moveToGroup'), button_cancel:ABP.util.Common.geti18nString('button_cancel'), button_delete:ABP.util.Common.geti18nString('button_delete'), button_save:ABP.util.Common.geti18nString('button_save')}}});
  editPanel.showBy(Ext.getBody(), 'c-c');
}, removeItemClicked:function(list, action) {
  var me = this;
  var favorite = action.record;
  if (favorite.hasChildNodes() === false) {
    favorite.remove();
  } else {
    ABP.view.base.popUp.PopUp.showOkCancel(me.getViewModel().data.i18n.favorites_confirmDeleteGroupMsg, me.getViewModel().data.i18n.favorites_confirmDeleteGroupTitle, function(result) {
      if (result) {
        favorite.remove(true);
      }
    });
  }
}, onListitemTapped:function(nestedList, list, index, target, record) {
  var me = this, view = me.getView();
  if (!record || record.isLeaf()) {
    return;
  }
  view.setTitle(record.get('text'));
  view.showBackButton();
  me.__resolvePendingActions(nestedList);
}, __resolvePendingActions:function(nestedList) {
  var swiper = nestedList.getPlugin('nestedlistswiper');
  if (swiper) {
    swiper.dismissAll();
  }
}});
Ext.define('ABP.view.session.favorites.plugins.NestedListSwiper', {extend:'Ext.plugin.Abstract', alias:'plugin.nestedlistswiper', requires:['Ext.util.DelayedTask'], config:{left:[], right:[], dismissOnTap:true, dismissOnScroll:true, commitDelay:0, widget:{xtype:'listswiperaccordion'}, swipeMax:{single:50, multiple:90}, directionLock:true, target:null}, shadowCls:Ext.baseCSSPrefix + 'listswiper-shadow', init:function(list) {
  var me = this, scrollable = list.getScrollable();
  me.items = [];
  list.on({scope:this, add:'onItemAdd'});
  list.el.on({scope:this, dragstart:'onDragStart', drag:'onDragMove', dragend:'onDragEnd'});
  if (scrollable) {
    scrollable.setX(false);
  }
  me.dismissAllTask = new Ext.util.DelayedTask(me.dismissAll, me);
  me.updateDismissOnScroll(me.getDismissOnScroll());
}, destroy:function() {
  var list = this.cmp;
  list.un({scope:this, add:'onItemAdd'});
  list.el.un({scope:this, dragstart:'onDragStart', drag:'onDragMove', dragend:'onDragEnd'});
  this.callParent();
}, createWidget:function(config) {
  var me = this, leftItems = me.getLeft(), rightItems = me.getRight();
  return Ext.apply({owner:me, defaults:me.defaults, leftActions:leftItems, rightActions:rightItems}, config);
}, onScrollStart:function() {
  if (this.getDismissOnScroll()) {
    this.dismissAll();
  }
}, onItemAdd:function(list, item) {
  item.setTouchAction({panX:false});
}, onItemUpdateData:function(item) {
  Ext.asap(this.resyncItem, this, [item]);
}, onDragStart:function(evt) {
  var me = this, list = me.cmp, record = me.mapToRecord(list, evt), target, translationTarget, renderTarget, item, widget;
  if (!me.hasActions() || evt.absDeltaX < evt.absDeltaY) {
    return;
  }
  if (record) {
    item = me.mapToItem(list, record);
    if (item) {
      widget = item.$swiperWidget;
      if (!widget) {
        widget = me.createWidget(me.getWidget());
        widget.ownerCmp = item;
        target = me.getTarget();
        if (item.isGridRow || target === 'outer') {
          renderTarget = item.el;
          translationTarget = item.el.first();
        } else {
          renderTarget = item.bodyElement;
          translationTarget = item.hasToolZones ? renderTarget.child('.' + Ext.baseCSSPrefix + 'tool-dock') : item.innerElement;
        }
        translationTarget.addCls(me.shadowCls);
        widget.translationTarget = translationTarget;
        renderTarget = translationTarget.parent();
        item.$swiperWidget = widget = Ext.create(widget);
        renderTarget.insertFirst(widget.el);
        widget.setRendered(true);
        if (list.infinite) {
          list.stickItem(item, true);
        }
        this.items.push(item);
      }
      widget.onDragStart(evt);
    }
  }
}, onDragMove:function(evt) {
  var me = this, list = me.cmp, item = me.mapToItem(list, evt), swiperItem;
  if (item) {
    swiperItem = item.$swiperWidget;
    if (!me.hasActions() || !swiperItem) {
      return;
    }
    swiperItem.onDragMove(evt);
  }
}, onDragEnd:function(evt) {
  var me = this, list = me.cmp, item = me.mapToItem(list, evt), swiperItem;
  if (item) {
    swiperItem = item.$swiperWidget;
    if (!me.hasActions() || !swiperItem) {
      return;
    }
    swiperItem.onDragEnd(evt);
  }
}, updateDismissOnScroll:function(value) {
  var list = this.getCmp(), scrollable, listeners;
  if (this.isConfiguring || !list) {
    return;
  }
  scrollable = list.getScrollable();
  if (!scrollable) {
    return;
  }
  listeners = {scrollstart:'onScrollStart', scope:this};
  if (value === true) {
    scrollable.on(listeners);
  } else {
    scrollable.un(listeners);
  }
}, hasActions:function() {
  return this.getLeft() || this.getRight();
}, privates:{destroyItem:function(item) {
  var me = this, list = me.cmp, swiperWidget = item.$swiperWidget, i = me.items.indexOf(item);
  if (i !== -1) {
    me.items.splice(i, 1);
  }
  if (swiperWidget) {
    swiperWidget.destroy();
  }
  item.$swiperWidget = null;
  if (list.infinite && !item.destroyed) {
    list.stickItem(item, null);
  }
}, dismissAll:function() {
  var me = this;
  me.items.map(function(item) {
    return item.$swiperWidget;
  }).forEach(function(swiperItem) {
    swiperItem.dismiss();
  });
}, mapToRecord:function(list, value) {
  var me = this, item = value, el = list.element, dom, rec;
  if (item && item.isEvent) {
    item = item.getTarget(list.itemSelector, el);
  } else {
    if (item && (item.isElement || item.nodeType === 1)) {
      item = Ext.fly(item).findParent(list.itemSelector, el);
    }
  }
  if (item) {
    dom = item.isWidget ? item.el : item;
    dom = dom.dom || dom;
    while (Ext.isFunction(dom.getAttribute) && !dom.getAttribute('data-recordid')) {
      dom = dom.parentNode;
      if (dom === document) {
        return null;
      }
    }
    rec = dom.getAttribute('data-recordid');
    rec = me.__findTreeRecordByInternalId(rec, list);
  }
  return rec || null;
}, mapToItem:function(nestedList, value, as) {
  var me = this;
  var i = 0;
  var record = Ext.isFunction(value.getUniqueId) ? value : me.mapToRecord(nestedList, value);
  if (record && nestedList.getActiveItem()) {
    var list = nestedList.getActiveItem();
    for (i = 0; i < list.dataItems.length; ++i) {
      if (list.dataItems[i].getRecord().getData().id === record.getData().id) {
        return list.dataItems[i];
      }
    }
  }
  return null;
}, __findTreeRecordByInternalId:function(internalId, list) {
  if (!internalId || !list) {
    return;
  }
  var i;
  var store = list.getStore();
  var record = store.getByInternalId(internalId);
  if (!record) {
    var parent = list.getLastNode();
    if (!parent || !parent.childNodes || parent.childNodes.length === 0) {
      return;
    }
    for (i = 0; i < parent.childNodes.length; ++i) {
      if (parent.childNodes[i].internalId == internalId) {
        return parent.childNodes[i];
      }
    }
  }
  return record;
}}});
Ext.define('ABP.view.session.favorites.FavoritesManager', {extend:'ABP.view.components.panel.HeaderPanelBase', controller:'favoritesManager', alias:'widget.favoritesManager', requires:['Ext.data.TreeStore', 'Ext.dataview.NestedList', 'Ext.dataview.listswiper.ListSwiper', 'ABP.view.session.favorites.FavoritesManagerController', 'ABP.view.session.favorites.FavoritesManagerModel', 'ABP.view.session.favorites.plugins.NestedListSwiper'], cls:'favoritesmanager', viewModel:{type:'favoritesmanagermodel'}, 
bind:{title:'{i18n.favorites_title:htmlEncode}'}, height:'100%', width:'100%', closable:true, showBack:true, backHandler:'onBackClick', tools:[{iconCls:'icon-save', handler:'onSaveClick'}], tbar:[{xtype:'textfield', padding:5, flex:1, itemId:'newgrouptext', bind:{placeholder:'{i18n.favorites_newGroup_emptyText}', value:'{favoriteTitle}'}}, {xtype:'button', height:32, bind:{text:'{i18n.favorites_newGroup}', disabled:'{favoriteTitle.length \x3d\x3d\x3d 0}'}, handler:'addNewGroup'}], items:[{xtype:'nestedlist', 
toolbar:false, height:'100%', width:'100%', itemId:'favoritestree', bind:{emptyText:'{i18n.favorites_manager_emptyGroup:htmlEncode}'}, displayField:'text', listConfig:{itemTpl:['\x3cdiv class\x3d"favorite-list-item"\x3e', '\x3cdiv class\x3d"favorite-list-icon {iconCls}"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"favorite-list-text"\x3e{text}\x3c/div\x3e', '\x3c/div\x3e']}, itemConfig:{ripple:true}, plugins:{nestedlistswiper:{commitDelay:1500, dismissOnTap:true, right:[{iconCls:'icon-pencil', cls:'favoriteseditbutton', 
commit:'editItemClicked', width:100}, {iconCls:'icon-navigate-cross', commit:'removeItemClicked', width:100, undoable:true}]}}, listeners:{itemtap:'onListitemTapped', back:'onNavigateBack'}}], listeners:{painted:function() {
  this.hideBackButton();
  var depthLimit = ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit') || 0;
  var allowItemRename = Ext.isBoolean(ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename')) ? ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename') : true;
  if (depthLimit === 1) {
    this.getTbar().hide();
    if (!allowItemRename) {
      var nestedSwiper = this.down('nestedlist').getPlugin('nestedlistswiper');
      nestedSwiper.setRight([{iconCls:'icon-navigate-cross', commit:'removeItemClicked', width:100, undoable:true}]);
    }
  }
}}});
Ext.define('ABP.view.session.thumbbar.ThumbbarController', {extend:'Ext.app.ViewController', alias:'controller.thumbbar', listen:{controller:{'*':{thumbbar_show:'showThumbbar', thumbbar_hide:'hideThumbbar', thumbbar_handleSwipe:'handleSwipe', thumbbar_trayTriggerClick:'trayTriggerClick', thumbbar_post_tray_close:'postTrayClose'}}}, hasAddedOrientationChangeEvent:false, lastConfig:null, tray:null, showThumbbar:function(config) {
  var me = this;
  var vm = me.getViewModel();
  var portrait = ABP.util.Common.getPortrait();
  vm.set('portrait', portrait);
  if (Ext.os.deviceType === 'Phone') {
    if (!me.hasAddedOrientationChangeEvent) {
      Ext.Viewport.on('orientationchange', '__thumbbarOnOrientationChange', me);
      me.hasAddedOrientationChangeEvent = true;
    }
    me.__closeTray();
    if (config) {
      me.lastConfig = config;
      me.__clearBar();
      vm.set('thumbOpen', true);
      if (config.buttons && !Ext.isEmpty(config.buttons)) {
        var capacities = me.__getButtonCapacity(config);
        var productButtonLimit = capacities.bar;
        var trayLimit = capacities.tray;
        if (portrait) {
          if (trayLimit > 0) {
            me.__addTrayTrigger();
            vm.set('overCapacity', true);
            me.__addTrayButtons(config.buttons, productButtonLimit, trayLimit);
          } else {
            vm.set('overCapacity', false);
          }
          for (var i = 0; i < productButtonLimit; ++i) {
            me.__addButton(config.buttons[i]);
          }
          me.getView().show(config.animation);
        } else {
          me.__addTrayButtons(config.buttons, productButtonLimit, trayLimit);
          me.tray.show();
          vm.set('overCapacity', false);
        }
      }
    }
  }
}, hideThumbbar:function(internalHide) {
  var vm = this.getViewModel();
  if (!internalHide) {
    vm.set('thumbOpen', false);
  }
  if (vm.get('trayOpen')) {
    this.__closeTray();
  }
  this.getView().hide();
}, buttonHandler:function(button) {
  if (button) {
    if (button.type && button.type === 'event' && button.event) {
      this.fireEvent(button.appId + '_' + button.event, button.eventArgs);
    } else {
      if (button.type && button.type === 'route' && button.hash) {
        this.redirectTo(button.hash);
      }
    }
  }
}, privates:{__clearBar:function() {
  this.getView().removeAll(true, true);
  if (this.tray) {
    this.tray.getController().__clear();
  }
}, __addButton:function(bConfig) {
  bConfig.cls = ['small'];
  if (!bConfig.handler) {
    bConfig.handler = 'buttonHandler';
  }
  if (bConfig.icon) {
    bConfig.iconCls = bConfig.icon;
    bConfig.icon = null;
  }
  if (!bConfig.text) {
    bConfig.text = ' ';
    ABP.util.Logger.logWarn('Thumbbar button is not using text', 'button using icon:' + bConfig.iconCls);
  }
  bConfig.iconAlign = 'top';
  bConfig.flex = 1;
  this.getView().add(bConfig);
}, __addTrayTrigger:function() {
  var button = this.getView().down('#openTrayButton');
  var session = this.getView().up('sessioncanvas');
  if (!button) {
    this.getView().add({xtype:'button', iconCls:'icon-navigate-up', automationCls:'thumbbartrayopen', handler:'__openTray', cls:'thumbbar-trigger thumbbar-trigger-float', itemId:'openTrayButton', renderTo:session, bind:{hidden:'{!triggerShow}'}, height:14, width:60});
  }
}, __addTrayButtons:function(buttons, productButtonLimit, trayLimit) {
  var me = this;
  var i = 0;
  var barButtons = [];
  var trayButtons = [];
  if (!me.tray) {
    me.tray = me.getView().up('featurecanvas').down('thumbbartray');
  }
  for (i = 0; i < productButtonLimit; ++i) {
    var thisButton = buttons[i];
    thisButton.cls = ['small'];
    if (!thisButton.handler) {
      thisButton.handler = 'buttonHandler';
    }
    if (thisButton.icon) {
      thisButton.iconCls = thisButton.icon;
      thisButton.icon = null;
    }
    if (!thisButton.text) {
      thisButton.text = ' ';
      ABP.util.Logger.logWarn('Thumbbar button is not using text', 'button using icon:' + thisButton.iconCls);
    }
    thisButton.iconAlign = 'top';
    thisButton.flex = 1;
    barButtons.push(thisButton);
  }
  for (i; i < productButtonLimit + trayLimit; ++i) {
    var thisButton = buttons[i];
    thisButton.cls = ['small'];
    if (!thisButton.handler) {
      thisButton.handler = 'buttonHandler';
    }
    if (thisButton.icon) {
      thisButton.iconCls = thisButton.icon;
      thisButton.icon = null;
    }
    thisButton.iconAlign = 'top';
    thisButton.flex = 1;
    trayButtons.push(thisButton);
  }
  if (!Ext.isEmpty(barButtons)) {
    me.tray.getController().__addBarButtons(barButtons);
    me.tray.getController().__addTrayButtons(trayButtons, productButtonLimit);
  }
}}, __getButtonCapacity:function(config) {
  var barCapacity = ABP.util.Common.getPortrait() ? 4 : 6;
  var trayCapacity = 12;
  var buttonCount = config.buttons.length;
  if (buttonCount > barCapacity) {
    if (buttonCount - barCapacity > trayCapacity) {
      var totalCapacity = barCapacity + trayCapacity;
      var detailString = buttonCount + ' buttons provided, capacity for ' + totalCapacity + ', first buttons provided will be shown';
      ABP.util.Logger.logWarn('Too many buttons provided by Thumbbar Config', detailString);
    } else {
      trayCapacity = buttonCount - barCapacity;
    }
  } else {
    if (buttonCount <= barCapacity) {
      barCapacity = buttonCount;
      trayCapacity = 0;
    }
  }
  return {bar:barCapacity, tray:trayCapacity};
}, __openTray:function() {
  var me = this;
  var vm = me.getViewModel();
  var view = me.getView();
  var portrait = ABP.util.Common.getPortrait();
  if (me.tray) {
    me.tray.getController().__openTray(portrait);
    if (portrait) {
      view.addCls('thumbbar-clear');
    }
  }
  vm.set('trayOpen', true);
}, __closeTray:function() {
  var me = this;
  var vm = me.getViewModel();
  if (me.tray) {
    me.tray.getController().__closeTray(ABP.util.Common.getPortrait());
  }
  vm.set('trayOpen', false);
}, postTrayClose:function() {
  var view = this.getView();
  view.removeCls('thumbbar-clear');
}, __thumbbarOnOrientationChange:function(viewport, newOrientation, width, height, options) {
  var me = this;
  var view = me.getView();
  var vm = me.getViewModel();
  if (view && vm.get('thumbOpen')) {
    vm.set('trayOpen', false);
    if (me.tray) {
      me.tray.hide();
      me.__closeTray();
    }
    if (newOrientation === 'landscape') {
      me.hideThumbbar(true);
    }
    me.showThumbbar(me.lastConfig);
  }
}, trayTriggerClick:function() {
  var me = this;
  var vm = me.getViewModel();
  if (vm.get('trayOpen')) {
    me.__closeTray();
  } else {
    me.__openTray();
  }
}, handleSwipe:function(event, component, eOpts) {
  var me = this;
  var vm = me.getViewModel();
  var thumbOpen = vm.get('thumbOpen');
  if (thumbOpen) {
    if (event.direction === 'up') {
      if (!vm.get('trayOpen') && (vm.get('overCapacity') || !vm.get('portrait'))) {
        var endY = event.touch.pageY;
        var distance = event.distance;
        var screenHeight = ABP.util.Common.getWindowHeight();
        var barHeight = 55;
        var initialTouchY = endY + distance;
        if (initialTouchY > screenHeight - barHeight - 40) {
          me.__openTray();
        }
      }
    } else {
      if (event.direction === 'down') {
        if (vm.get('trayOpen')) {
          var endY = event.touch.pageY;
          var distance = event.distance;
          var screenHeight = ABP.util.Common.getWindowHeight();
          var trayHeight = me.tray.element.getHeight();
          var initialTouchY = endY - distance;
          if (initialTouchY > screenHeight - trayHeight - 40) {
            me.__closeTray();
          }
        }
      }
    }
  }
}});
Ext.define('ABP.view.session.thumbbar.ThumbbarModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.thumbbarmodel', data:{overCapacity:false, thumbOpen:false, portrait:null, trayOpen:false}, formulas:{triggerShow:{bind:{_overCapacity:'{overCapacity}', _thumbOpen:'{thumbOpen}', _portrait:'{portrait}', _trayOpen:'{trayOpen}'}, get:function(data) {
  return data._portrait && data._overCapacity && !data._trayOpen;
}}, trayShow:{bind:{_menuOpen:'{menuOpen}', _rpOpen:'{rightPaneOpen}', _trayOpen:'{trayOpen}'}, get:function(data) {
  var cont = this.getView().getController();
  if (data._menuOpen || data._rpOpen) {
    if (data._trayOpen) {
      cont.__closeTray();
    }
  }
}}}});
Ext.define('ABP.view.session.thumbbar.Thumbbar', {extend:'Ext.Toolbar', alias:'widget.thumbbar', requires:['ABP.view.session.thumbbar.ThumbbarController', 'ABP.view.session.thumbbar.ThumbbarModel'], controller:'thumbbar', viewModel:{type:'thumbbarmodel'}, cls:'abp-thumbbar', ui:'thumbbar', layout:{type:'hbox', pack:'space-around'}});
Ext.define('ABP.view.session.thumbbar.ThumbbarTrayController', {extend:'Ext.app.ViewController', alias:'controller.thumbbartray', buttonHandler:function(button) {
  if (button) {
    if (button.type && button.type === 'event' && button.event) {
      this.fireEvent(button.appId + '_' + button.event, button.eventArgs);
    } else {
      if (button.type && button.type === 'route' && button.hash) {
        this.redirectTo(button.hash);
      }
    }
  }
}, __triggerClick:function() {
  this.fireEvent('thumbbar_trayTriggerClick');
}, __addBarButtons:function(buttons) {
  var view = this.getView();
  var buttonBar = view.down('#abpThumbbarTrayBar');
  if (buttonBar) {
    buttonBar.add(buttons);
  }
}, __addTrayButtons:function(buttons, rowLength) {
  var view = this.getView();
  var tray = view.down('#abpThumbbarTrayBottom');
  var rowCounter = 1;
  var currentRow = {xtype:'container', cls:'abp-thumbbar-lower-tray-row', width:'100%', height:55, layout:{type:'hbox', pack:'space-around'}, defaults:{xtype:'button'}};
  if (tray) {
    for (var i = 0; i < buttons.length; i) {
      currentRow.items = [];
      var enoughForFullRow = i + rowLength;
      if (enoughForFullRow <= buttons.length) {
        for (var buttonItter = 0; buttonItter < rowLength; ++buttonItter) {
          currentRow.items.push(buttons[i]);
          ++i;
        }
        tray.add(currentRow);
        rowCounter++;
      } else {
        var loopLength = i !== 0 ? buttons.length % rowLength : buttons.length;
        var difference = rowLength - loopLength;
        for (var buttonItter = 0; buttonItter < loopLength; ++buttonItter) {
          currentRow.items.push(buttons[i]);
          ++i;
        }
        currentRow.items.push({flex:difference});
        tray.add(currentRow);
        rowCounter++;
      }
    }
    view.addCls('thumbbartray-rows-' + rowCounter);
  }
}, __clear:function() {
  var view = this.getView();
  var buttonBar = view.down('#abpThumbbarTrayBar');
  var tray = view.down('#abpThumbbarTrayBottom');
  if (buttonBar) {
    buttonBar.removeAll(true, true);
  }
  if (tray) {
    tray.removeAll(true, true);
  }
  view.removeCls('thumbbartray-rows-1');
  view.removeCls('thumbbartray-rows-2');
  view.removeCls('thumbbartray-rows-3');
}, __openTray:function(portrait) {
  var view = this.getView();
  var trigger = view.down('#closeTrayButton');
  if (portrait) {
    var task = new Ext.util.DelayedTask(this.__portraitAfterShow, this);
    view.addCls('preopen');
    view.show();
    task.delay(50);
  } else {
    view.addCls('tray-open');
  }
  if (trigger) {
    trigger.setIconCls('icon-navigate-down');
  }
}, __portraitAfterShow:function() {
  var view = this.getView();
  view.addCls('tray-open');
  view.removeCls('preopen');
}, __closeTray:function(portrait) {
  var view = this.getView();
  var trigger = view.down('#closeTrayButton');
  if (portrait) {
    var task = new Ext.util.DelayedTask(this.__portraitAfterClose, this);
    view.addCls('preopen');
    view.removeCls('tray-open');
    task.delay(250);
  } else {
    view.removeCls('tray-open');
  }
  if (trigger) {
    trigger.setIconCls('icon-navigate-up');
  }
}, __portraitAfterClose:function() {
  var view = this.getView();
  this.fireEvent('thumbbar_post_tray_close');
  view.hide();
  view.removeCls('preopen');
}});
Ext.define('ABP.view.session.thumbbar.ThumbbarTray', {extend:'Ext.Container', alias:'widget.thumbbartray', requires:['ABP.view.session.thumbbar.ThumbbarTrayController'], controller:'thumbbartray', layout:{type:'vbox'}, width:'100%', cls:'abpthumbbar-tray-noshadow', items:[{xtype:'button', iconCls:'icon-navigate-up', automationCls:'thumbbartrayopen', handler:'__triggerClick', cls:'thumbbar-trigger', itemId:'closeTrayButton', height:14, width:60}, {xtype:'container', cls:'abp-thumbbar', width:'100%', 
height:55, itemId:'abpThumbbarTrayBar', layout:{type:'hbox', pack:'space-around'}, defaults:{xtype:'button'}}, {xtype:'container', cls:'abp-thumbbar-lower-tray', width:'100%', maxHeight:220, itemId:'abpThumbbarTrayBottom', layout:{type:'vbox', pack:'space-around'}}]});
Ext.define('ABP.view.session.feature.FeatureCanvas', {extend:'Ext.Container', alias:'widget.featurecanvas', requires:['ABP.view.session.feature.FeatureCanvasController', 'ABP.view.session.feature.FeatureCanvasModel', 'ABP.view.session.toolbarTop.ToolbarTop', 'ABP.view.session.help.Help', 'ABP.view.session.about.About', 'ABP.view.session.logger.LoggerPage', 'ABP.view.session.settings.SettingsPage', 'ABP.view.session.toolbarTop.search.SearchBar', 'ABP.view.session.favorites.FavoritesManager', 'ABP.view.session.thumbbar.Thumbbar', 
'ABP.view.session.thumbbar.ThumbbarTray'], controller:'featurecanvascontroller', viewModel:{type:'featurecanvasmodel'}, cls:'feature-canvas', itemId:'feature-canvas', ariaRole:'main', autoEl:'main', height:'100%', width:'100%', layout:'vbox', flex:1, settingsShown:false, items:[{xtype:'container', itemId:'topContainer', layout:'vbox', flex:1, height:'100%', width:'100%', items:[{xtype:'container', flex:1, height:'100%', width:'100%', layout:'hbox', itemId:'settingsContainer', hidden:true, items:[]}, 
{xtype:'container', flex:1, height:'100%', width:'100%', layout:'hbox', itemId:'applicationContainer', style:'z-index: 2;', items:[]}]}, {xtype:'thumbbar', docked:'bottom', hidden:true}, {xtype:'thumbbartray', hidden:true}], initialize:function() {
  this.el.on('swipe', this.getController().interpretSwipe);
}});
Ext.define('ABP.view.session.rightPane.RightPaneController', {extend:'ABP.view.session.rightPane.RightPaneBaseController', alias:'controller.rightpanecontroller', listen:{controller:{'*':{toolbar_updateBadge:'__updateBadge', toolbar_incrementBadge:'__incrementBadge', toolbar_decrementBadge:'__decrementBadge', toolbar_clearBadge:'__clearBadge'}}}, __badgePriorityOrder:['abp-badge-priority-info', 'abp-badge-priority-success', 'abp-badge-priority-warning', 'abp-badge-priority-alert'], init:function() {
  var me = this, sessionConfig = ABP.util.Config.getSessionConfig(), displayInitials = ABP.util.Config.getDisplayNameInitials(), profilePicture = ABP.util.Config.getProfilePicture(), notificationsEnabled = sessionConfig.settings.notifications.enabled, rightPaneTabs = [], settingsConfig;
  me.callParent();
  if (notificationsEnabled) {
    me.fireEvent('rightPane_initTab', 'rightPaneTab_abp-notifications', {name:'abp-notifications', uniqueId:'abp-notifications', xtype:'abp-notifications', clearBadgeOnActivate:sessionConfig.settings.notifications.clearBadgeOnActivate, icon:'icon-bell', automationCls:'notifications-tab'});
  }
  rightPaneTabs = this.__getRightPaneTabs();
  if (rightPaneTabs.length > 0) {
    rightPaneTabs.forEach(function(tab, a) {
      me.fireEvent('rightPane_initTab', tab.uniqueId, {name:tab.name, uniqueId:tab.uniqueId, xtype:tab.xtype, icon:tab.icon, automationCls:tab.automationCls});
    });
  }
  if (sessionConfig.settings.enableSearch) {
    me.fireEvent('rightPane_initTab', 'rightPaneTab_abp-search', {name:'abp-search', uniqueId:'abp-search', xtype:'abp-searchpane', icon:'icon-magnifying-glass', titleKey:'sessionMenu_search', automationCls:'search-tab'});
  }
  settingsConfig = {name:'abp-settings', uniqueId:'abp-settings', xtype:'settingscontainer', automationCls:'settings-tab'};
  if (profilePicture) {
    settingsConfig.profilePicture = profilePicture;
  } else {
    if (displayInitials) {
      settingsConfig.title = displayInitials;
    } else {
      settingsConfig.icon = 'icon-user';
    }
  }
  me.fireEvent('rightPane_initTab', 'rightPaneTab_abp-settings', settingsConfig);
}, handleKeyPress:function() {
}, toggleTab:function(panelConfig, open) {
  var me = this, rightPaneOpen = me.getViewModel().get('rightPaneOpen');
  if (Ext.isBoolean(open) && rightPaneOpen !== open) {
    me.togglePane();
  }
  if (open === true) {
    panelIndex = me.__findBadgeTabIndex(panelConfig);
    me.getView().setActiveItem(panelIndex);
  }
}, __getRightPaneTabs:function() {
  var me = this, sessionConfig = ABP.util.Config.getSessionConfig(), i, j, rightPaneTabs = [], enabledRightPaneTabs = sessionConfig.settings.rightPane, registeredRightPaneTabs = ABP.util.Config.config.rightPaneTabs;
  for (i = 0; i < enabledRightPaneTabs.length; i++) {
    for (j = 0; j < registeredRightPaneTabs.length; j++) {
      if (enabledRightPaneTabs[i].name === registeredRightPaneTabs[j].name) {
        rightPaneTabs.push(registeredRightPaneTabs[j]);
        break;
      }
    }
  }
  return rightPaneTabs;
}, __findBadgeTab:function(tabId) {
  var me = this, view = me.getView(), viewModel = view.getViewModel(), tabPrefix = viewModel.get('tabPrefix');
  var panel = view.items.items.filter(function(item) {
    return item.uniqueId === tabPrefix + tabId;
  })[0];
  if (!panel) {
    return false;
  }
  return panel.tab;
}, __findBadgeTabIndex:function(tabId) {
  var me = this, view = me.getView(), viewModel = view.getViewModel(), tabPrefix = viewModel.get('tabPrefix');
  var found = false;
  var i = 0;
  for (i; i < view.items.items.length; ++i) {
    if (view.items.items[i].uniqueId === tabPrefix + tabId) {
      found = i - 1;
      break;
    }
  }
  return found;
}, __initTab:function(uniqueId, tabConfig) {
  var me = this, view = me.getView(), viewModel = view.getViewModel(), tabPrefix = viewModel.get('tabPrefix');
  if (!tabConfig) {
    tabConfig = me.__getPanelConfig(uniqueId);
  }
  if (uniqueId.indexOf(tabPrefix) !== 0) {
    uniqueId = tabPrefix + uniqueId;
  }
  var newTab = me.__createTab(tabConfig, uniqueId);
  view.add(newTab);
}, __createTab:function(config, tabItemId) {
  var tabConfig = {uniqueId:tabItemId, titleKey:config.titleKey, layout:'fit', scrollable:'vertical', items:[{xtype:config.xtype}]};
  if (config.profilePicture) {
    tabConfig.iconCls = 'profile-picture';
    tabConfig.icon = config.profilePicture;
  } else {
    if (config.icon) {
      tabConfig.iconCls = config.icon;
    } else {
      if (config.title) {
        tabConfig.title = config.title;
      }
    }
  }
  if (config.automationCls) {
    tabConfig.tab = tabConfig.tab || {};
    tabConfig.tab.automationCls = config.automationCls;
    if (config.profilePicture) {
      tabConfig.tab.bind = {icon:'{profilePhoto}', iconCls:'{iconCls}'};
    }
  }
  return tabConfig;
}, __getTabBadges:function() {
  var me = this, view = me.getView(), viewModel = view.getViewModel(), tabPrefix = viewModel.get('tabPrefix'), tabs = view.items.items.reduce(function(a, item) {
    if (item.tab) {
      a.push(item.tab);
    }
    return a;
  }, []);
  return tabs;
}, __updateBadge:function(tabId, badgeConfig) {
  var tab = this.__findBadgeTab(tabId);
  if (tab && badgeConfig.value) {
    tab._badgeValue = badgeConfig.value;
    tab.setBadgeText(badgeConfig.value);
  }
  if (tab && badgeConfig.priority) {
    this.__setBadgePriority(tab, badgeConfig.priority);
  }
  this.__updateRPButtonBadge();
}, __incrementBadge:function(tabId, number) {
  if (!number) {
    number = 1;
  }
  var tab = this.__findBadgeTab(tabId);
  if (tab) {
    var previous = parseInt(tab._badgeValue, 10);
    if (!previous) {
      previous = 0;
    }
    previous += number;
    tab._badgeValue = previous;
    if (previous >= 100) {
      previous = '99+';
    }
    tab.setBadgeText(previous);
  }
  this.__updateRPButtonBadge();
}, __decrementBadge:function(tabId, number) {
  if (!number) {
    number = 1;
  }
  var tab = this.__findBadgeTab(tabId);
  if (tab) {
    var previous = parseInt(tab._badgeValue, 10);
    if (!previous) {
      previous = 0;
    }
    if (previous - 1 < 0) {
      previous = 1;
    }
    previous -= number;
    tab._badgeValue = previous;
    if (previous >= 100) {
      previous = '99+';
    }
    tab.setBadgeText(previous);
  }
  this.__updateRPButtonBadge();
}, __clearBadge:function(tabId) {
  var tab = this.__findBadgeTab(tabId);
  if (tab) {
    tab._badgeValue = '';
    tab.setBadgeText('');
  }
  this.__updateRPButtonBadge();
}, __updateRPButtonBadge:function() {
  var me = this;
  var tabs = me.__getTabBadges();
  var priority;
  var badgeTotal = tabs.reduce(function(a, tab) {
    if (tab._badgeValue) {
      var tabValue = parseInt(tab._badgeValue, 10);
      var priorityValue = tab._badgePriority;
      priority = me.__determineHigherPriority(priorityValue, priority);
      if (tabValue) {
        return a + tabValue;
      }
      return a;
    } else {
      return a;
    }
  }, 0);
  me.fireEvent('toolbar_updateRightPaneButtonBadge', badgeTotal, priority);
}, __determineHigherPriority:function(newPriority, currentPriority) {
  var currentPriorityIndex = this.__badgePriorityOrder.indexOf(currentPriority);
  var newPriorityIndex = this.__badgePriorityOrder.indexOf(newPriority);
  if (newPriorityIndex > currentPriorityIndex) {
    currentPriorityIndex = newPriorityIndex;
  }
  return this.__badgePriorityOrder[currentPriorityIndex];
}, __setBadgePriority:function(tab, priority) {
  var newBadgePriorityCls;
  if (priority === ABP.util.Constants.badgePriority.Alert) {
    newBadgePriorityCls = 'abp-badge-priority-alert';
  } else {
    if (priority === ABP.util.Constants.badgePriority.Warning) {
      newBadgePriorityCls = 'abp-badge-priority-warning';
    } else {
      if (priority === ABP.util.Constants.badgePriority.Success) {
        newBadgePriorityCls = 'abp-badge-priority-success';
      } else {
        if (priority === ABP.util.Constants.badgePriority.Info) {
          newBadgePriorityCls = 'abp-badge-priority-info';
        }
      }
    }
  }
  tab._badgePriority = newBadgePriorityCls;
  tab.setCls(newBadgePriorityCls);
}});
Ext.define('ABP.view.session.rightPane.RightPane', {extend:'Ext.tab.Panel', alias:'widget.rightpanecanvas', itemId:'rightPane', requires:['ABP.view.session.rightPane.RightPaneController', 'ABP.view.session.rightPane.RightPaneModel'], controller:'rightpanecontroller', viewModel:{type:'rightpanemodel'}, bind:{minWidth:'{menuWidth}'}, height:'100%', cls:['rightpane'], hidden:true, ui:'transparent', hideAnimation:{type:'slide', out:true, direction:'right'}, showAnimation:{type:'slide', out:false, direction:'left'}});
Ext.define('ABP.view.session.mainMenu.MenuSeperator', {extend:'Ext.Container', alias:'widget.menuseperator', height:25, width:'100%', cls:['sessmenu-mobile-seperator', 'fa', 'fa-caret-down'], initialize:function() {
  this.el.dom.onclick = this.onItemClick;
}, onItemClick:function() {
  var me = Ext.getCmp(this.id);
  me.fireEvent('seperatorClick');
}});
Ext.define('ABP.view.session.mainMenu.MainMenu', {extend:'Ext.Container', alias:'widget.mainmenu', itemId:'mainMenu', reference:'mainMenu', requires:['ABP.view.session.mainMenu.MainMenuController', 'ABP.view.session.mainMenu.MainMenuModel', 'ABP.view.session.mainMenu.MenuSeperator', 'ABP.view.session.mainMenu.ABPTreeList'], controller:'mainmenucontroller', viewModel:{type:'mainmenumodel'}, ui:'abpmainmenu', hidden:'true', bind:{width:'{menuWidth}'}, height:'100%', layout:'vbox', flex:1, automationCls:'main-menu', 
cls:'main-menu', items:[{xtype:'menubutton', uniqueId:'navToggleTree', itemId:'navToggleTree', automationCls:'swap-to-button', icon:'{navToggleIcon}', title:'{navToggleText}', command:'toggleNav', enabled:true, type:'event', appId:'container', bind:{hidden:'{hideTreeNav}'}}, {xtype:'container', flex:1, items:[{xtype:'treelistmenu', scrollable:true, width:'100%', bind:{store:'{navSearch}'}}]}, {xtype:'container', cls:'menu-fade-bottom', itemId:'main_menu_session', dock:'bottom', width:'100%', layout:{type:'vbox', 
align:'stretch'}, bind:{items:'{sessionMenu}'}}], hideAnimation:'slideOut', showAnimation:{type:'slide', out:false, direction:'right'}, initialize:function() {
  var me = this;
  me.callParent();
  var nav = ABP.util.Config.getSessionConfig().navMenu;
  var tree = ABP.util.Config.getSessionConfig().treeMenu;
  var hideTree = ABP.util.Config.getSessionConfig().settings.hideTreeNavigation;
  var controller = me.getController();
  controller.populateMenuNav(nav);
  controller.populateMenuTree(tree);
  if (!tree || hideTree) {
    me.getViewModel().set('hideTreeNav', true);
  }
  var session = ABP.util.Config.getSessionConfig();
  controller.populateSessionMenu(session);
  me.down('#treelistmenu').addCls('main-menu-nav-modern');
  if (!ABP.util.Common.getSmallScreen()) {
    me.onAfter('show', me.afterShow);
  }
}, afterShow:function() {
  this.fireEvent('session_maskSession');
  var focusFirst = ABP.util.Config.getSessionConfig().settings.mainMenuModernFocusFirstOption;
  if (focusFirst) {
    var treelist = this.down('#treelistmenu');
    treelist.getController().focusFirstMenuOption();
  }
}, setMicro:function() {
}});
Ext.define('ABP.view.session.settings.SettingsContainer', {requires:['ABP.view.session.settings.SettingsContainerModel', 'ABP.view.session.settings.SettingsContainerController'], extend:'ABP.view.base.rightpane.RightPanePanel', alias:'widget.settingscontainer', controller:'settingscontainer', viewModel:{type:'settingscontainer'}, height:'100%', scrollable:'vertical', layout:{type:'vbox', pack:'start', align:'left'}, ui:'grey', cls:'settings-container', defaults:{xtype:'button', width:'100%', border:false, 
menu:false, height:40, ui:'menuitem'}, bind:{title:'{i18n.sessionMenu_settings}'}, bbar:{layout:{type:'hbox', pack:'center', align:'middle'}, items:[{xtype:'label', style:{fontWeight:'normal'}, bind:{hidden:'{!showEnv || !showEnvironment}', html:'{i18n.sessionMenu_environment}' + ' {environmentName}'}}, {xtype:'label', reference:'sessionTimeLabel', style:{fontWeight:'normal'}, bind:{hidden:'{!showSessionTimer}', html:'{i18n.sessionMenu_time}' + ' {loggedInTime}'}}]}});
Ext.define('ABP.view.session.searchPane.SearchPaneController', {extend:'Ext.app.ViewController', alias:'controller.abp-searchpane', listen:{controller:{'*':{searchPane_setupSearch:'__setupSearch', searchPane_loadResultObject:'__addSearchObject', abp_search_suggestions:'onUpdatedSuggestions', searchPane_switchProvider:'__switchSearchProvider'}}}, privates:{__setupSearch:function(settings) {
  var me = this;
  var filterbutton = null;
  var vm = me.getViewModel();
  var items = [];
  vm.set('searchInfo', settings.searchInfo);
  if (Ext.isNumber(settings.searchInfo.length)) {
    if (settings.searchInfo.length > 1) {
      if (settings.singleSearchSelection) {
        filterbutton = me.__makeSingleSelectButton(settings.searchInfo);
      } else {
        filterbutton = me.__makeMultiSelectButton(settings.searchInfo);
      }
      vm.set('singleSelect', settings.singleSearchSelection);
    } else {
      filterbutton = null;
    }
  }
  if (filterbutton) {
    items.push(filterbutton);
  }
  items = items.concat(me.__makeSearchAndClose());
  me.lookupReference('abpSearchPaneHeader').add(items);
}, __makeMultiSelectButton:function(searchInfo) {
  var ret = {xtype:'abpbutton', reference:'abp-search-searchselectionbutton', cls:['abp-searchpane-header-button'], margin:'0px 10px 0px 0px', iconCls:'icon-funnel', arrow:false, handler:'__showFilterMenu'};
  this.__setMultiMenu(searchInfo);
  return ret;
}, __setMultiMenu:function(searchInfo) {
  var checks = [];
  var vm = this.getViewModel();
  var selection = vm.get('searchSelection');
  var selectAll = Ext.isEmpty(selection);
  for (var i = 0; i < searchInfo.length; ++i) {
    var selected;
    if (selectAll) {
      selected = true;
    } else {
    }
    checks.push({xtype:'checkboxfield', value:true, appId:searchInfo[i].appId, searchEvent:searchInfo[i].event, icon:searchInfo[i].icon, searchId:searchInfo[i].id, minLength:searchInfo[i].minLength, minLengthError:searchInfo[i].minLengthError, name:searchInfo[i].name, recents:searchInfo[i].recents, suggestionEvent:searchInfo[i].suggestionEvent, suggestionThreshold:searchInfo[i].suggestionThreshold, label:searchInfo[i].name, cls:'abp-search-field', labelCls:'settingspage-label', labelAlign:'right', 
    event:searchInfo[i].appId + '_' + searchInfo[i].event, checked:selected});
  }
  var button = {xtype:'abpbutton', bind:{text:'{i18n.search_apply:htmlEncode}'}, handler:'__updateMultiSelect'};
  var formPanel = {xtype:'formpanel', reference:'abp-search-checkform', items:checks};
  vm.set('filterMenu', [formPanel, button]);
}, __updateMultiSelect:function() {
  this.__hideFilterMenu();
}, __showFilterMenu:function() {
  var me = this;
  var searchSelect = me.lookupReference('searchSelectionMenu');
  var data = searchSelect.floatParentNode.getData();
  searchSelect.setUserCls(ABP.util.Common.getCurrentTheme());
  if (!data.modalMask) {
    var Widget = Ext.Widget;
    var floatRoot = Ext.getFloatRoot();
    var positionEl = searchSelect.getFloatWrap();
    data.modalMask = searchSelect.floatParentNode.createChild({cls:'x-mask abp-modal-mask-transparent'}, positionEl);
    data.modalMask.on({tap:Widget.onModalMaskTap, scope:Widget});
    if (Ext.isiOS && searchSelect.floatParentNode === floatRoot) {
      data.modalMask.on({touchmove:function(e) {
        e.preventDefault();
      }});
    }
  }
  searchSelect.setWidth(me.getView().measure().width);
  searchSelect.showBy(me.lookupReference('abpSearchPaneHeader'), 'b');
}, __hideFilterMenu:function() {
  this.lookupReference('searchSelectionMenu').hide();
  this.lookupReference('abp-search-searchselectionbutton').blur();
}, __makeSingleSelectButton:function(searchInfo) {
  var defaultSearch = ABP.util.LocalStorage.getForLoggedInUser('DefaultSearch');
  if (defaultSearch) {
    defaultSearch = searchInfo[searchInfo.findIndex(function(item) {
      return item.id === defaultSearch;
    })];
    if (!defaultSearch) {
      defaultSearch = searchInfo[0];
    }
  } else {
    defaultSearch = searchInfo[0];
  }
  if (!defaultSearch.icon) {
    icon = 'icon-funnel';
  }
  var ret = {xtype:'abpbutton', reference:'abp-search-searchselectionbutton', cls:['abp-searchpane-header-button'], automationCls:'search-searchselectionbutton', margin:'0px 10px 0px 0px', iconCls:defaultSearch.icon, arrow:false, handler:'__showFilterMenu'};
  this.__setSingleSelectMenu(searchInfo, defaultSearch);
  return ret;
}, __setSingleSelectMenu:function(searchInfo, defaultSearch) {
  var vm = this.getViewModel();
  var menu = [];
  for (var i = 0; i < searchInfo.length; ++i) {
    menu.push({xtype:'abpbutton', appId:searchInfo[i].appId, searchEvent:searchInfo[i].event, searchIcon:searchInfo[i].icon, searchId:searchInfo[i].id, minLength:searchInfo[i].minLength, minLengthError:searchInfo[i].minLengthError, name:searchInfo[i].name, recents:searchInfo[i].recents, suggestionEvent:searchInfo[i].suggestionEvent, suggestionThreshold:searchInfo[i].suggestionThreshold, handler:'__updateSingleSelect', iconCls:searchInfo[i].icon, text:searchInfo[i].name, textAlign:'left', cls:['abp-singleselect-search-button']});
  }
  vm.set('filterMenu', menu);
  vm.set('searchSelection', defaultSearch);
  this.initSuggestions();
}, __updateSingleSelect:function(selection) {
  var icon = selection.config.iconCls;
  var vm = this.getViewModel();
  vm.set('searchSelection', selection.config);
  if (icon) {
    this.lookupReference('abp-search-searchselectionbutton').setIconCls(icon);
  }
  this.__hideFilterMenu();
  this.initSuggestions();
  ABP.util.LocalStorage.setForLoggedInUser('DefaultSearch', selection.config.searchId);
}, __switchSearchProvider:function(searchId) {
  var me = this;
  var vm = me.getViewModel();
  var searchInfo = vm.get('searchInfo');
  var search = searchInfo[searchInfo.findIndex(function(item) {
    return item.id === searchId;
  })];
  if (search) {
    vm.set('searchSelection', search);
    if (search.icon) {
      this.lookupReference('abp-search-searchselectionbutton').setIconCls(search.icon);
    }
  }
}, __makeSearchAndClose:function() {
  return [{xtype:'textfield', reference:'abp-search-searchfield', flex:1, height:32, margin:'3px 0px 3px 0px', cls:['abp-searchpane-header-searchfield'], automationCls:'searchpane-header-searchfield', bind:{placeholder:'{emptyText}'}, triggers:{search:{iconCls:'icon-magnifying-glass', cls:['abp-searchpane-header-trigger'], automationCls:'searchpane-header-trigger-search', handler:'__search'}, clear:{type:'clear', automationCls:'searchpane-header-trigger-clear'}}, listeners:{'action':'__search', change:'onSearchFieldChange', 
  focus:'onSearchFieldFocus', show:function() {
    this.focus();
  }, el:{keydown:'onSearchFieldKeyDown'}}}, {xtype:'abpbutton', cls:['abp-searchpane-header-button'], automationCls:'searchpane-header-close', margin:'0px 0px 0px 10px', iconCls:'icon-navigate-cross', handler:'__closePanel'}];
}, __checkSelection:function() {
  if (this.getViewModel().get('singleSelect')) {
    this.__checkSingleSelect();
  } else {
    this.__checkMultiSelection();
  }
}, __checkSingleSelect:function() {
  var me = this;
  var vm = me.getViewModel();
  var selection = vm.get('searchSelection');
  var menu = vm.get('filterMenu');
  if (selection) {
    for (var i = 0; i < menu.length; ++i) {
      if (menu[i].name === selection.name) {
        if (menu[i].cls.length === 1) {
          menu[i].cls.push('abp-singleselect-search-button-selected');
        }
      } else {
        if (menu[i].cls.length > 1) {
          menu[i].cls = [menu[i].cls[0]];
        }
      }
    }
    vm.set('filterMenu', null);
    vm.set('filterMenu', menu);
  }
}, __checkMultiSelection:function() {
  var me = this;
  var vm = me.getViewModel();
  var selection = vm.get('searchSelection');
}, __addSearchObject:function(object) {
  var me = this;
  var resultsContainer = me.lookupReference('abp-search-results');
  var vm = me.getViewModel();
  var single = vm.get('singleSelect');
  if (single) {
    me.__stopSearchTraceTimer();
    if (object) {
      resultsContainer.removeAll();
      resultsContainer.add(object);
      vm.set('empty', false);
    }
  } else {
  }
}, __startSearchTraceTimer:function() {
}, __stopSearchTraceTimer:function() {
}, __closePanel:function() {
  this.fireEvent('session_toggleRightPane');
}, __search:function() {
  var me = this;
  var vm = me.getViewModel();
  var searchText, searchHiearchy;
  var currentSelection = vm.get('selectedSuggestion');
  if (currentSelection) {
    searchText = currentSelection.get('text');
    searchHiearchy = currentSelection.get('hierarchy');
  } else {
    searchText = me.lookupReference('abp-search-searchfield').getValue();
    searchText = searchText ? searchText.trim() : '';
  }
  var search = me.getSearchProvider();
  if (searchText.length !== 0 && me.checkStringLength(searchText, search)) {
    console.log(search.data.appId + '_' + search.data.event);
    me.fireEvent('main_fireAppEvent', search.data.appId, search.data.event, searchText);
  }
  var recentStore = vm.getStore('recentSearches');
  recentStore.append(search, searchText, searchHiearchy);
  me.hideSuggestions();
}, pendingRequests:0, loadTask:null, initViewModel:function(vm) {
  this.callParent(vm);
  this.initSuggestions();
  this.loadTask = new Ext.util.DelayedTask(this.fireLoadRequest, this);
}, onSearchFieldFocus:function() {
  this.showSuggestions();
}, onSuggestionClick:function(clicked, record, item, index, e, eOpts) {
  var me = this;
  var view = me.getView();
  var searchField = me.lookupReference('abp-search-searchfield');
  searchField.setValue(record.record.data.text);
  me.__search();
}, onSearchFieldChange:function(field, newValue, oldValue) {
  var me = this;
  me.refreshSuggestions(newValue);
  var search = me.getSearchProvider();
  if (!search || !search.data || !search.data.suggestionEvent) {
    return;
  }
  var searchText = newValue.trim();
  if (searchText.length >= search.data.suggestionThreshold) {
    this.loadTask.delay(200, this.fireLoadRequest, this, [search, searchText]);
  } else {
    this.loadTask.cancel();
    me.removeCustomSuggestions();
  }
  var loading = me.pendingRequests > 0;
  me.showSuggestions(loading);
}, onUpdatedSuggestions:function(searchId, seachTerm, suggestions) {
  var me = this;
  me.pendingRequests = Math.max(me.pendingRequests - 1, 0);
  var vm = me.getViewModel();
  var currentSearchId = vm.getSelectedSearchId();
  if (currentSearchId !== searchId) {
    return;
  }
  if (!suggestions || suggestions.length === 0) {
    return;
  }
  var suggestionStore = me.getStore('suggestions');
  var recents = [];
  Ext.Array.each(suggestions, function(item) {
    if (suggestionStore.findExact('text', item.text) < 0) {
      recents.push({text:item.text, hierarchy:item.hierarchy, instanceId:item.instanceId, timestamp:0, count:1, isRecent:false});
    }
  });
  suggestionStore.loadData(recents, true);
  me.refreshSuggestions();
}, refreshSuggestions:function(newValue) {
  var me = this;
  var vm = me.getViewModel();
  var suggestions = vm.getStore('suggestions');
  if (newValue === undefined) {
    newValue = me.lookupReference('abp-search-searchfield').getValue();
    newValue = newValue ? newValue.trim() : '';
  }
  newValue = newValue.trim();
  suggestions.clearFilter();
  var sorters = [];
  if (newValue != '') {
    filterFunction = ABP.util.filters.Factory.createStringFilter(newValue, [{name:'text', useSoundEx:false}, {name:'hierarchy', useSoundEx:false}], true, 1);
    suggestions.filter({id:'TextFilter', filterFn:filterFunction});
    sorters.push({property:'_relevance', direction:'DESC'});
  }
  sorters.push({property:'timestamp', direction:'DESC'});
  suggestions.sort(sorters);
  var topNfilter = ABP.util.filters.Factory.createTopNFilter(me.getRecentLength());
  suggestions.filter({id:'TopNFilter', filterFn:topNfilter});
  if (suggestions.count() === 0) {
    me.hideSuggestions();
    return;
  }
  me.showSuggestions();
  var selected = vm.get('selectedSuggestion');
  if (suggestions.indexOf(selected) === -1) {
    vm.set('selectedSuggestion', null);
  }
}, removeCustomSuggestions:function() {
  var me = this;
  var vm = me.getViewModel();
  var suggestions = vm.getStore('suggestions');
  var toRemove = [];
  suggestions.each(function(item) {
    if (!item.data.isRecent) {
      toRemove.push(item);
    }
  });
  suggestions.remove(toRemove);
}, getRecentLength:function() {
  var search = this.getSearchProvider();
  if (search) {
    return search.get('recents');
  } else {
    return 0;
  }
}, getSearchProvider:function() {
  var vm = this.getViewModel();
  var searchId = vm.getSelectedSearchId();
  var store = Ext.StoreMgr.get('searchStore');
  return store.getById(searchId);
}, focusSearchField:function() {
  var me = this;
  var text = me.lookupReference('abp-search-searchfield');
  if (!text.hidden) {
    text.focus();
  }
}, initSuggestions:function() {
  var me = this;
  var vm = me.getViewModel();
  var selectedSearchId = vm.getSelectedSearchId();
  var recentSearches = me.getStore('recentSearches');
  var suggestions = me.getStore('suggestions');
  if (selectedSearchId) {
    suggestions.clearFilter();
    var recents = [];
    recentSearches.each(function(model) {
      if (model.data.searchId == selectedSearchId) {
        recents.push({text:model.data.text, timestamp:model.data.timestamp, count:model.data.count, isRecent:true});
      }
    });
    suggestions.loadData(recents);
    me.setSelectedSuggestionId('');
    me.refreshSuggestions('');
  }
}, showSuggestions:function(loading) {
  var me = this;
  var vm = me.getViewModel();
  var view = this.getView();
  var recentSearches = me.lookupReference('GlobalSuggestionPopup');
  recentSearches.alignTarget = searchField;
  if (loading === undefined) {
    loading = me.pendingRequests > 0;
  }
  recentSearches.setLoading(loading);
  if (recentSearches.isVisible()) {
    return;
  }
  var recentStore = vm.getStore('recentSearches');
  if (recentStore.count() === 0 && !loading) {
    return;
  }
  var searchField = me.lookupReference('abp-search-searchfield');
  Ext.Function.defer(function(searchField, recentSearches) {
    if (!searchField.isVisible()) {
      return;
    }
    var data = recentSearches.floatParentNode.getData();
    recentSearches.setUserCls(ABP.util.Common.getCurrentTheme());
    if (!data.modalMask) {
      var Widget = Ext.Widget;
      var floatRoot = Ext.getFloatRoot();
      var positionEl = recentSearches.getFloatWrap();
      data.modalMask = recentSearches.floatParentNode.createChild({cls:'x-mask abp-modal-mask-transparent'}, positionEl);
      data.modalMask.on({tap:Widget.onModalMaskTap, scope:Widget});
      if (Ext.isiOS && recentSearches.floatParentNode === floatRoot) {
        data.modalMask.on({touchmove:function(e) {
          e.preventDefault();
        }});
      }
    }
    var isPhone = Ext.os.deviceType === 'Phone';
    var searchInputWrapper = searchField.getParent();
    if (isPhone === true) {
      recentSearches.setWidth('100%');
      recentSearches.showBy(searchField, 'b');
    } else {
      var searchInputWrapper = searchField.getParent();
      var inputWrapperClientRec = searchInputWrapper.el.dom.getBoundingClientRect();
      recentSearches.setWidth(inputWrapperClientRec.width);
      var inputWrapperBottom = inputWrapperClientRec.y + inputWrapperClientRec.height;
      recentSearches.showAt({x:inputWrapperClientRec.x, y:inputWrapperClientRec.y + inputWrapperClientRec.height});
    }
    this.setSelectedSuggestionId('');
    searchField.focus();
  }, 200, this, [searchField, recentSearches]);
}, hideSuggestions:function() {
  var me = this;
  var recentSearches = me.lookupReference('GlobalSuggestionPopup');
  if (recentSearches) {
    recentSearches.hide();
  }
  this.pendingRequests = 0;
  if (this.loadTask) {
    this.loadTask.cancel();
  }
}, setSelectedSuggestionId:function(id) {
  var me = this;
  var vm = me.getViewModel();
  var store = vm.getStore('suggestions');
  if (store.count() === 0) {
    return;
  }
  var i = store.find('id', id);
  if (i !== -1) {
    vm.set('selectedSuggestion', store.getAt(i));
  } else {
    vm.set('selectedSuggestion', null);
  }
}, checkStringLength:function(inString, record) {
  var me = this;
  var testString = inString.trim();
  var ret = false;
  if (record && record.data.minLength) {
    if (testString.length >= record.data.minLength) {
      ret = true;
    } else {
      if (record.data.minLengthError) {
        ABP.view.base.popUp.PopUp.showError(record.data.minLengthError);
      }
    }
  }
  return ret;
}, fireLoadRequest:function(search, searchText) {
  var me = this;
  var search = me.getSearchProvider();
  if (me.fireEvent(search.data.appId + '_' + search.data.suggestionEvent, {searchId:search.id, text:searchText})) {
    me.pendingRequests++;
    me.showSuggestions(true);
  }
}}});
Ext.define('ABP.view.session.searchPane.SearchPaneModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.abp-searchpane', requires:['ABP.model.SearchModel', 'ABP.store.ABPRecentSearchStore'], data:{empty:true, filterMenu:[], searchBar:[], searchInfo:[], searchSelection:null, selectedSuggestion:null, singleSelect:true}, stores:{recentSearches:{xclass:'ABP.store.ABPRecentSearchStore'}, suggestions:{model:'ABP.model.Suggestion', sortOnLoad:true, sorters:{property:'timestamp', direction:'DESC'}}}, formulas:{emptyText:{bind:{_preSearch:'{i18n.search_searchText}', 
_selectedSearch:'{searchSelection}', _singleSelect:'{singleSelect}'}, get:function(data) {
  if (data._singleSelect && data._selectedSearch) {
    return data._preSearch + ' ' + data._selectedSearch.name;
  }
}}}, getSelectedSearchId:function() {
  var me = this;
  if (me.data.singleSelect) {
    if (!me.data.searchSelection) {
      me.data.searchSelection = me.data.searchInfo[0] || me.data.searchSelection;
    }
    if (me.data.searchSelection) {
      return me.data.searchSelection.id ? me.data.searchSelection.id : me.data.searchSelection.searchId;
    } else {
      return null;
    }
  } else {
  }
}});
Ext.define('ABP.view.session.searchPane.SearchPane', {extend:'Ext.Container', requires:['ABP.view.session.searchPane.SearchPaneController', 'ABP.view.session.searchPane.SearchPaneModel', 'ABP.view.session.toolbarTop.search.SearchPopup'], alias:'widget.abp-searchpane', controller:'abp-searchpane', viewModel:{type:'abp-searchpane'}, cls:['abp-searchpane'], layout:'vbox', items:[{xtype:'container', cls:['abp-searchpane-header'], reference:'abpSearchPaneHeader', layout:'hbox', docked:'top', items:[]}, 
{xtype:'container', flex:1, items:[{xtype:'container', reference:'searchSelectionMenu', layout:{type:'vbox', align:'stretch'}, hidden:true, floated:true, modal:true, hideOnMaskTap:true, left:0, bind:{items:'{filterMenu}'}, listeners:{beforeShow:'__checkSelection'}}, {xtype:'searchpopup', reference:'GlobalSuggestionPopup'}, {xtype:'container', cls:['rightpane-content'], bind:{hidden:'{!empty}'}, reference:'abp-search-emptycontent', flex:1, height:'100%', layout:{type:'vbox', align:'center', pack:'center'}, 
items:[{xtype:'component', html:'\x3cdiv class\x3d"icon-magnifying-glass abp-search-resultsplaceholder-icon"\x3e\x3c/div\x3e'}, {xtype:'component', bind:{html:'\x3cdiv class\x3d"abp-search-resultsplaceholder"\x3e{i18n.search_resultsPlaceholder:htmlEncode}\x3c/div\x3e'}}]}, {xtype:'container', cls:['rightpane-content'], bind:{hidden:'{empty}'}, height:'100%', reference:'abp-search-results', flex:1, layout:'fit'}]}]});
Ext.define('ABP.view.session.SessionCanvas', {extend:'Ext.Container', alias:'widget.sessioncanvas', requires:['ABP.view.session.SessionBanner', 'ABP.view.session.SessionCanvasController', 'ABP.view.session.SessionCanvasModel', 'ABP.view.session.feature.FeatureCanvas', 'ABP.view.session.rightPane.RightPane', 'ABP.view.session.mainMenu.MainMenu', 'ABP.view.session.settings.SettingsContainer', 'ABP.view.session.searchPane.SearchPane'], controller:'sessioncanvascontroller', viewModel:{type:'sessioncanvasmodel'}, 
layout:'vbox', items:[{xtype:'sessionbanner', ariaAttributes:{'aria-label':'Headline Message'}, docked:'top'}, {xtype:'toolbartop'}, {xtype:'mainmenu'}, {xtype:'featurecanvas'}, {xtype:'rightpanecanvas'}], openMenu:function() {
  var me = this;
  var menu = me.down('#mainMenu');
  var disabled = ABP.util.Config.getSessionConfig().settings.disableNavMenu;
  var menuButton = me.down('#toolbar-button-menu');
  if (menu && !disabled) {
    menu.show();
    if (menuButton) {
      menuButton.addCls('toolbar-toggled');
    }
  }
}, closeMenu:function() {
  var me = this;
  var menu = me.down('#mainMenu');
  var disabled = ABP.util.Config.getSessionConfig().settings.disableNavMenu;
  var menuButton = me.down('#toolbar-button-menu');
  if (menu && !disabled) {
    menu.hide();
    if (menuButton) {
      menuButton.removeCls('toolbar-toggled');
    }
    me.setMasked(false);
  }
}});
Ext.define('ABP.view.session.favorites.FavoritesManagerEditPanel', {extend:'Ext.Panel', requires:['ABP.view.session.favorites.FavoritesManagerEditPanelController', 'ABP.view.session.favorites.FavoritesEditPanelModel'], alias:'widget.favoriteseditpanel', controller:'favoriteseditpanel', viewModel:{type:'favoritesEditPanel'}, cls:'favoriteseditpanel', bodyCls:'x-unselectable', floated:true, modal:true, bind:{title:'{favorites_editPanel_title:htmlEncode}'}, padding:10, border:true, layout:{type:'vbox', 
align:'center', pack:'center'}, header:{automationCls:'edit-favorites-panel-header'}, config:{favorite:undefined}, tools:[{iconCls:'icon-navigate-cross', handler:'onCloseClick'}], defaults:{labelAlign:'top'}, items:[{xtype:'textfield', width:'100%', allowBlank:false, cls:'a-favorites-editpanel-name', itemId:'favoriteName', bind:{label:'{favorites_editPanel_name:htmlEncode}', disabled:'{!allowItemRename}'}}, {xtype:'textfield', cls:'a-favorites-editpanel-source', width:'100%', editable:false, disabled:true, 
itemId:'favoriteSource', bind:{label:'{favorites_editPanel_source:htmlEncode}', hidden:'{!allowItemRename}'}}, {xtype:'combobox', displayField:'text', width:'100%', valueField:'id', cls:'a-favorites-editpanel-groups', itemId:'favoriteGroups', bind:{label:'{favorites_editPanel_moveToGroup:htmlEncode}', hidden:'{depthLimit \x3d\x3d\x3d 1}'}}], bbar:{padding:10, defaults:{border:false}, items:[{bind:{text:'{button_cancel:htmlEncode}'}, flex:1, automationCls:'favorites-editpanel-bbar-cancel', handler:'onCloseClick'}, 
{bind:{text:'{button_delete:htmlEncode}'}, flex:1, automationCls:'favorites-editpanel-bbar-delete', handler:'onDeleteClick'}, {bind:{text:'{button_save:htmlEncode}'}, flex:1, automationCls:'favorites-editpanel-bbar-save', handler:'onSaveClick'}]}});
Ext.define('ABP.view.session.headlines.Headline', {extend:'Ext.Toolbar', xtype:'headline', cls:'session-headline', ui:'headline', layout:{type:'hbox', pack:'right'}, constructor:function(config) {
  config = config || {};
  var me = this, localizedActionText = config.actionTextKey ? ABP.util.Common.geti18nString(config.actionTextKey) : null, actionText = localizedActionText || config.actionText, priority = Ext.isEmpty(config.priority) ? 0 : config.priority, allowAction = Ext.isEmpty(actionText) ? false : true, localizedMessage = config.messageKey ? ABP.util.Common.geti18nString(config.messageKey) : null, message = localizedMessage || config.message, cls = 'session-headline', extraCls;
  switch(priority) {
    case 0:
      extraCls = 'headline-info';
      break;
    case 1:
      extraCls = 'headline-warning';
      break;
    case 2:
      extraCls = 'headline-alert';
      break;
    default:
      extraCls = 'headline-info';
  }
  config.cls = cls + ' ' + extraCls;
  delete config.priority;
  delete config.actionText;
  delete config.message;
  config.items = [{xtype:'component', itemId:'headlineMessage', cls:'scrollable-overflow', html:message, flex:1}, {xtype:'abpbutton', cls:'headline-button', automationCls:'headline-close-button', hidden:!allowAction, text:actionText, handler:function() {
    var headline = this.up('headline'), sessionBanner = headline.up('sessionbanner');
    headline.fireEvent('headline_action', headline);
    sessionBanner.remove(headline);
  }}, {xtype:'tool', type:'close', handler:function() {
    var headline = this.up('headline'), sessionBanner = headline.up('sessionbanner');
    headline.fireEvent('headline_read', headline);
    sessionBanner.remove(headline);
  }}];
  me.callParent([config]);
}});
Ext.define('ABP.view.session.mainMenu.MenuItem', {extend:'Ext.Container', alias:'widget.menubutton', requires:['ABP.view.session.mainMenu.MenuItemModel'], viewModel:{type:'menuitemmodel'}, config:{icon:'', uniqueId:'', title:'', labelKey:'', labelVal:'', tabId:'', command:'', args:'', enabled:true, tooltip:'', tooltipKey:'', type:'', children:'', place:'', appId:''}, cls:'menu-item mi-Body', layout:'{micro}' ? {type:'hbox', align:'center'} : {type:'vbox', align:'center'}, bind:{height:'{sessHeight}'}, 
items:[{xtype:'component', itemId:'miIcon', html:'icon', cls:'{micro}' ? 'mi-icon-micro' : 'mi-icon'}, {xtype:'component', itemId:'miTitle', html:'Label', cls:'{micro}' ? 'mi-title-micro' : 'mi-title'}], initialize:function() {
  var me = this;
  var iconFont = '';
  var icItem = me.down('#miIcon');
  var tiItem = me.down('#miTitle');
  var font = me.config.icon;
  me.el.dom.onclick = me.onMenuItemClick;
  font = font.split('-');
  iconFont = font[0] === 'fa' ? 'fa ' + me.config.icon : me.config.icon;
  if (icItem) {
    icItem.setHtml('\x3ci class\x3d"' + iconFont + '"\x3e\x3c/i\x3e');
  }
  if (!me.config.labelKey) {
    me.setCls(me.getCls()[0] + ' a-menu-unsafe-' + me.config.title.replace(/[^A-Za-z]/g, ''));
    me.config.labelVal = me.config.title;
    if (tiItem) {
      if (me.config.labelVal) {
        if (me.config.labelVal[0] === '{') {
          tiItem.setBind({html:me.config.labelVal});
        } else {
          tiItem.setHtml(Ext.String.htmlEncode(me.config.labelVal));
        }
      }
    }
  } else {
    me.setCls(me.getCls()[0] + ' a-menu-' + me.config.labelKey.replace(/_/g, '-'));
    if (tiItem) {
      tiItem.setBind({html:'{i18n.' + me.config.labelKey + '}'});
    }
  }
}, onMenuItemClick:function() {
  var me = Ext.getCmp(this.id);
  me.fireEvent('miItemClick', me, true);
}, setSelected:function(doHighlight) {
  if (doHighlight) {
    this.addCls('mi-body-selected');
  } else {
    this.removeCls('mi-body-selected');
  }
}, isSelected:function() {
  return this.hasCls('mi-body-selected');
}, checkLabel:function(checkString) {
  var me = this;
  var myLength = ABP.util.Common.measureTextSingleLine(checkString, 'Arial').width * 1.25;
  var subString = [];
  var manString;
  var i;
  var lastThatFit = '';
  var ret = checkString;
  if (myLength > 140) {
    manString = checkString.split(' ');
    if (manString.length > 2) {
      lastThatFit = manString[0];
      for (i = 1; i < manString.length; i++) {
        if (ABP.util.Common.measureTextSingleLine(lastThatFit + manString[i] + ' ').width * 1.25 < 140) {
          lastThatFit = lastThatFit + ' ' + manString[i];
        } else {
          break;
        }
      }
      subString[0] = lastThatFit;
      subString[1] = manString[i];
      for (i++; i < manString.length; i++) {
        subString[1] = subString[1] + ' ' + manString[i];
      }
      if (ABP.util.Common.measureTextSingleLine(subString[1], 'Arial').width * 1.25 < 140) {
        ret = subString[0] + '\x3cbr\x3e' + subString[1];
        me.down('#miTitle').addCls('mi-double');
        me.addCls('mi-double');
      } else {
        lastThatFit = subString[1][0];
        for (i = 1; i < subString[1].length; ++i) {
          if (ABP.util.Common.measureTextSingleLine(lastThatFit + subString[1][i] + '...', 'Arial').width * 1.25 < 140) {
            lastThatFit = lastThatFit + subString[1][i];
          } else {
            break;
          }
        }
        ret = subString[0] + '\x3cbr\x3e' + lastThatFit + '...';
        me.down('#miTitle').addCls('mi-double');
        me.addCls('mi-double');
      }
    } else {
      if (manString.length === 2) {
        if (ABP.util.Common.measureTextSingleLine(manString[0], 'Arial').width * 1.25 < 140) {
          ret = manString[0] + '\x3cbr\x3e' + manString[1];
          me.down('#miTitle').addCls('mi-double');
          me.addCls('mi-double');
        } else {
          me.down('#miTitle').removeCls('mi-double');
          me.removeCls('mi-double');
        }
      } else {
        for (i = 0; i < checkString.length; i++) {
          if (ABP.util.Common.measureTextSingleLine(lastThatFit + checkString[i], 'Arial').width * 1.25 < 140) {
            lastThatFit = lastThatFit + checkString[i];
          } else {
            break;
          }
        }
        manString[0] = checkString.slice(0, i - 1);
        manString[1] = checkString.slice(i - 1);
        if (ABP.util.Common.measureTextSingleLine(manString[1], 'Arial').width * 1.25 < 140) {
          ret = manString[0] + '-\x3cbr\x3e' + manString[1];
          me.down('#miTitle').addCls('mi-double');
          me.addCls('mi-double');
        } else {
          lastThatFit = manString[1][0];
          for (i = 1; i < manString[1].length; ++i) {
            if (ABP.util.Common.measureTextSingleLine(lastThatFit + manString[1][i] + '...', 'Arial').width * 1.25 < 140) {
              lastThatFit = lastThatFit + manString[1][i];
            } else {
              break;
            }
          }
          ret = manString[0] + '-\x3cbr\x3e' + lastThatFit + '...';
          me.down('#miTitle').addCls('mi-double');
          me.addCls('mi-double');
        }
      }
    }
  } else {
    me.down('#miTitle').removeCls('mi-double');
    me.removeCls('mi-double');
  }
  return ret;
}});
Ext.define('ABP.view.session.notifications.NotificationsController', {extend:'ABP.view.session.notifications.NotificationsBaseController', alias:'controller.abp-notifications', __setActiveCardItem:function(newActiveItem) {
  var me = this, view = me.getView();
  view.setActiveItem(newActiveItem);
}, closeRightPane:function() {
  this.fireEvent('rightPane_toggle');
}});
Ext.define('ABP.view.session.notifications.Notifications', {extend:'ABP.view.base.rightpane.RightPanePanel', requires:['ABP.view.session.notifications.NotificationsController', 'ABP.view.session.notifications.NotificationsViewModel'], alias:'widget.abp-notifications', reference:'abp-notifications', controller:'abp-notifications', viewModel:{type:'abp-notifications'}, ui:'grey', bind:{title:'{i18n.abp_notifications_rightpane_title:htmlEncode}'}, cls:'abp-notifications', layout:'card', items:[{xtype:'label', 
cls:'notifications-no-notifications', bind:{html:'{i18n.abp_notifications_label_no_notifications:htmlEncode}'}}, {xtype:'label', cls:'notifications-no-notifications', bind:{html:'{i18n.abp_notifications_label_no_new_notifications:htmlEncode}'}}, {xtype:'container', cls:'notification-display', reference:'notificationContainer', layout:{type:'vbox', align:'stretch'}, scrollable:'y'}]});
Ext.define('ABP.view.session.notifications.NotificationsCategoryPanel', {extend:'Ext.Panel', alias:'widget.abp-notifications-category-panel', controller:'abp-notifications-category-panel', viewModel:{type:'abp-notifications-category-panel'}, config:{categoryName:null, categoryNameKey:null}, cls:'abp-notifications-category-panel a-abp-notifications-category-panel', showAnimation:{type:'fadeIn', element:this.element}, hideAnimation:{type:'fadeOut', element:this.element}, collapsible:{collapseToolText:null, 
expandToolText:null, collapsed:false, tool:{automationCls:'notifications-category-panel-collapse-tool'}}, bind:{hidden:'{hidePanel}'}, items:[{xtype:'container', layout:'hbox', frame:false, items:[{xtype:'component', reference:'categoryShowHistoryComponent', cls:'notifications-hideshow-history x-unselectable', bind:{html:'{i18n.abp_notifications_label_show_history:htmlEncode}', hidden:'{hideShowHistoryComponent}'}, listeners:{click:{element:'element', fn:'onShowHistoryClick'}}}, {xtype:'component', 
reference:'categoryHideHistoryComponent', cls:'notifications-hideshow-history x-unselectable', bind:{html:'{i18n.abp_notifications_label_hide_history:htmlEncode}', hidden:'{hideHideHistoryComponent}'}, listeners:{click:{element:'element', fn:'onHideHistoryClick'}}}]}, {xtype:'container', reference:'unreadNotificationContainer', cls:'abp-notifications-unread-container'}, {xtype:'container', reference:'historyNotificationContainer', cls:'abp-notifications-history-container', bind:{hidden:'{!displayHistory}'}}], 
initialize:function() {
  var me = this, categoryNameKey = this.getCategoryNameKey(), categoryName = this.getCategoryName();
  this.setBind({hidden:'{hidePanel}', title:'\x3cspan class\x3d"abp-notification-panel-title"\x3e' + (categoryNameKey ? '{i18n.' + categoryNameKey + ':htmlEncode}' : Ext.String.htmlEncode(categoryName)) + '\x3c/span\x3e{categoryNotificationCountDisplay}'});
  me.callParent();
}, addNotification:function(notificationRecord, isNew) {
  var me = this, controller = me.getController();
  controller.addNotification(notificationRecord, isNew);
}, removeNotification:function(notification) {
  var me = this, controller = me.getController();
  controller.removeNotification(notification);
}, markNotificationRead:function(notification) {
  var me = this, controller = me.getController();
  controller.markNotificationRead(notification);
}, markNotificationUnread:function(notification) {
  var me = this, controller = me.getController();
  controller.markNotificationUnread(notification);
}});
Ext.define('ABP.view.session.subMenu.SubMenu', {extend:'Ext.ActionSheet', alias:'widget.submenu', requires:['ABP.view.session.subMenu.SubMenuController'], controller:'submenucontroller', cls:'ABP-submenu', width:175, modal:true, hideOnMaskTap:true, hide:function() {
  this.destroy();
}, initialize:function() {
  var me = this;
  var configButtons = me.menuButtons;
  var buttons = [];
  var currButton = {};
  var i = 0;
  var labelString;
  var vm = Ext.ComponentQuery.query('app-main')[0].getViewModel();
  if (configButtons && configButtons.length > 0) {
    for (i; i < configButtons.length; ++i) {
      currButton = {event:configButtons[i].event, activateApp:configButtons[i].activateApp, eventArgs:configButtons[i].eventArgs, cls:'ABP-submenu-button', pressedCls:'ABP-submenu-buttonpressed', handler:'subOptionClick'};
      if (configButtons[i].labelKey && configButtons[i].labelKey !== '') {
        currButton.text = vm.checkI18n(configButtons[i].labelKey);
        if (currButton.text === configButtons[i].labelKey) {
          currButton.text = configButtons[i].label;
        }
      } else {
        currButton.text = configButtons[i].label;
      }
      buttons.push(currButton);
    }
  }
  if (buttons.length > 0) {
    me.setItems(buttons);
    me.setHeight(40 * buttons.length);
  }
}});
