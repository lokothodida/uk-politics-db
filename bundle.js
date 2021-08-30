const emptyObject = Object.freeze({
});
function isUndef(v) {
    return v === undefined || v === null;
}
function isDef(v) {
    return v !== undefined && v !== null;
}
function isTrue(v) {
    return v === true;
}
function isFalse(v) {
    return v === false;
}
function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol' || typeof value === 'boolean';
}
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
const _toString = Object.prototype.toString;
function toRawType(value) {
    return _toString.call(value).slice(8, -1);
}
function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
}
function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]';
}
function isValidArrayIndex(val) {
    const n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
}
function isPromise(val) {
    return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function';
}
function toString(val) {
    return val == null ? '' : Array.isArray(val) || isPlainObject(val) && val.toString === _toString ? JSON.stringify(val, null, 2) : String(val);
}
function toNumber(val) {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
}
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for(let i = 0; i < list.length; i++){
        map[list[i]] = true;
    }
    return expectsLowerCase ? (val)=>map[val.toLowerCase()]
     : (val)=>map[val]
    ;
}
const isBuiltInTag = makeMap('slot,component', true);
const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}
const camelizeRE = /-(\w)/g;
const camelize = cached((str)=>{
    return str.replace(camelizeRE, (_, c)=>c ? c.toUpperCase() : ''
    );
});
const capitalize = cached((str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cached((str)=>{
    return str.replace(hyphenateRE, '-$1').toLowerCase();
});
function polyfillBind(fn, ctx) {
    function boundFn(a) {
        const l = arguments.length;
        return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    }
    boundFn._length = fn.length;
    return boundFn;
}
function nativeBind(fn, ctx) {
    return fn.bind(ctx);
}
const bind = Function.prototype.bind ? nativeBind : polyfillBind;
function toArray(list, start) {
    start = start || 0;
    let i = list.length - start;
    const ret = new Array(i);
    while(i--){
        ret[i] = list[i + start];
    }
    return ret;
}
function extend(to, _from) {
    for(const key in _from){
        to[key] = _from[key];
    }
    return to;
}
function toObject(arr) {
    const res = {
    };
    for(let i = 0; i < arr.length; i++){
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
}
function noop(a, b, c) {
}
const no = (a, b, c)=>false
;
const identity = (_)=>_
;
function genStaticKeys(modules) {
    return modules.reduce((keys, m)=>{
        return keys.concat(m.staticKeys || []);
    }, []).join(',');
}
function looseEqual(a, b) {
    if (a === b) return true;
    const isObjectA = isObject(a);
    const isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a);
            const isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) {
                return a.length === b.length && a.every((e, i)=>{
                    return looseEqual(e, b[i]);
                });
            } else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            } else if (!isArrayA && !isArrayB) {
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                return keysA.length === keysB.length && keysA.every((key)=>{
                    return looseEqual(a[key], b[key]);
                });
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b);
    } else {
        return false;
    }
}
function looseIndexOf(arr, val) {
    for(let i = 0; i < arr.length; i++){
        if (looseEqual(arr[i], val)) return i;
    }
    return -1;
}
function once1(fn) {
    let called = false;
    return function() {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    };
}
const SSR_ATTR = 'data-server-rendered';
const ASSET_TYPES = [
    'component',
    'directive',
    'filter'
];
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
];
var config = {
    optionMergeStrategies: Object.create(null),
    silent: false,
    productionTip: "development" !== 'production',
    devtools: "development" !== 'production',
    performance: false,
    errorHandler: null,
    warnHandler: null,
    ignoredElements: [],
    keyCodes: Object.create(null),
    isReservedTag: no,
    isReservedAttr: no,
    isUnknownElement: no,
    getTagNamespace: noop,
    parsePlatformTagName: identity,
    mustUseProp: no,
    async: true,
    _lifecycleHooks: LIFECYCLE_HOOKS
};
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
function isReserved(str) {
    const c = (str + '').charCodeAt(0);
    return c === 36 || c === 95;
}
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
function parsePath(path) {
    if (bailRE.test(path)) {
        return;
    }
    const segments = path.split('.');
    return function(obj) {
        for(let i = 0; i < segments.length; i++){
            if (!obj) return;
            obj = obj[segments[i]];
        }
        return obj;
    };
}
const hasProto = '__proto__' in {
};
const inBrowser = typeof window !== 'undefined';
const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIE = UA && /msie|trident/.test(UA);
const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
const isEdge = UA && UA.indexOf('edge/') > 0;
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
const isFF = UA && UA.match(/firefox\/(\d+)/);
const nativeWatch = {
}.watch;
let supportsPassive = false;
if (inBrowser) {
    try {
        const opts = {
        };
        Object.defineProperty(opts, 'passive', {
            get () {
                supportsPassive = true;
            }
        });
        window.addEventListener('test-passive', null, opts);
    } catch (e) {
    }
}
let _isServer;
const isServerRendering = ()=>{
    if (_isServer === undefined) {
        if (!inBrowser && !inWeex && typeof global !== 'undefined') {
            _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
        } else {
            _isServer = false;
        }
    }
    return _isServer;
};
const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
const hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
let _Set;
if (typeof Set !== 'undefined' && isNative(Set)) {
    _Set = Set;
} else {
    _Set = class Set1 {
        constructor(){
            this.set = Object.create(null);
        }
        has(key) {
            return this.set[key] === true;
        }
        add(key) {
            this.set[key] = true;
        }
        clear() {
            this.set = Object.create(null);
        }
    };
}
let warn = noop;
let tip = noop;
let generateComponentTrace = noop;
let formatComponentName = noop;
{
    const hasConsole = typeof console !== 'undefined';
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = (str)=>str.replace(classifyRE, (c)=>c.toUpperCase()
        ).replace(/[-_]/g, '')
    ;
    warn = (msg, vm)=>{
        const trace = vm ? generateComponentTrace(vm) : '';
        if (config.warnHandler) {
            config.warnHandler.call(null, msg, vm, trace);
        } else if (hasConsole && !config.silent) {
            console.error(`[Vue warn]: ${msg}${trace}`);
        }
    };
    tip = (msg, vm)=>{
        if (hasConsole && !config.silent) {
            console.warn(`[Vue tip]: ${msg}` + (vm ? generateComponentTrace(vm) : ''));
        }
    };
    formatComponentName = (vm, includeFile)=>{
        if (vm.$root === vm) {
            return '<Root>';
        }
        const options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm;
        let name = options.name || options._componentTag;
        const file = options.__file;
        if (!name && file) {
            const match = file.match(/([^/\\]+)\.vue$/);
            name = match && match[1];
        }
        return (name ? `<${classify(name)}>` : `<Anonymous>`) + (file && includeFile !== false ? ` at ${file}` : '');
    };
    const repeat = (str, n)=>{
        let res = '';
        while(n){
            if (n % 2 === 1) res += str;
            if (n > 1) str += str;
            n >>= 1;
        }
        return res;
    };
    generateComponentTrace = (vm)=>{
        if (vm._isVue && vm.$parent) {
            const tree = [];
            let currentRecursiveSequence = 0;
            while(vm){
                if (tree.length > 0) {
                    const last = tree[tree.length - 1];
                    if (last.constructor === vm.constructor) {
                        currentRecursiveSequence++;
                        vm = vm.$parent;
                        continue;
                    } else if (currentRecursiveSequence > 0) {
                        tree[tree.length - 1] = [
                            last,
                            currentRecursiveSequence
                        ];
                        currentRecursiveSequence = 0;
                    }
                }
                tree.push(vm);
                vm = vm.$parent;
            }
            return '\n\nfound in\n\n' + tree.map((vm1, i)=>`${i === 0 ? '---> ' : repeat(' ', 5 + i * 2)}${Array.isArray(vm1) ? `${formatComponentName(vm1[0])}... (${vm1[1]} recursive calls)` : formatComponentName(vm1)}`
            ).join('\n');
        } else {
            return `\n\n(found in ${formatComponentName(vm)})`;
        }
    };
}let uid = 0;
class Dep {
    constructor(){
        this.id = uid++;
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        remove(this.subs, sub);
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    notify() {
        const subs = this.subs.slice();
        if (!config.async) {
            subs.sort((a, b)=>a.id - b.id
            );
        }
        for(let i = 0, l = subs.length; i < l; i++){
            subs[i].update();
        }
    }
}
Dep.target = null;
const targetStack = [];
function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}
class VNode {
    constructor(tag1, data1, children1, text1, elm, context, componentOptions, asyncFactory){
        this.tag = tag1;
        this.data = data1;
        this.children = children1;
        this.text = text1;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.fnContext = undefined;
        this.fnOptions = undefined;
        this.fnScopeId = undefined;
        this.key = data1 && data1.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    }
    get child() {
        return this.componentInstance;
    }
}
const createEmptyVNode = (text1 = '')=>{
    const node = new VNode();
    node.text = text1;
    node.isComment = true;
    return node;
};
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
}
function cloneVNode(vnode) {
    const cloned = new VNode(vnode.tag, vnode.data, vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned;
}
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];
methodsToPatch.forEach(function(method) {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observeArray(inserted);
        ob.dep.notify();
        return result;
    });
});
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
let shouldObserve = true;
function toggleObserving(value) {
    shouldObserve = value;
}
class Observer {
    constructor(value1){
        this.value = value1;
        this.dep = new Dep();
        this.vmCount = 0;
        def(value1, '__ob__', this);
        if (Array.isArray(value1)) {
            if (hasProto) {
                protoAugment(value1, arrayMethods);
            } else {
                copyAugment(value1, arrayMethods, arrayKeys);
            }
            this.observeArray(value1);
        } else {
            this.walk(value1);
        }
    }
    walk(obj) {
        const keys = Object.keys(obj);
        for(let i = 0; i < keys.length; i++){
            defineReactive$$1(obj, keys[i]);
        }
    }
    observeArray(items) {
        for(let i = 0, l = items.length; i < l; i++){
            observe(items[i]);
        }
    }
}
function protoAugment(target, src) {
    target.__proto__ = src;
}
function copyAugment(target, src, keys) {
    for(let i = 0, l = keys.length; i < l; i++){
        const key = keys[i];
        def(target, key, src[key]);
    }
}
function observe(value1, asRootData) {
    if (!isObject(value1) || value1 instanceof VNode) {
        return;
    }
    let ob;
    if (hasOwn(value1, '__ob__') && value1.__ob__ instanceof Observer) {
        ob = value1.__ob__;
    } else if (shouldObserve && !isServerRendering() && (Array.isArray(value1) || isPlainObject(value1)) && Object.isExtensible(value1) && !value1._isVue) {
        ob = new Observer(value1);
    }
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob;
}
function defineReactive$$1(obj, key, val, customSetter, shallow) {
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }
    const getter = property && property.get;
    const setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key];
    }
    let childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value1 = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value1)) {
                        dependArray(value1);
                    }
                }
            }
            return value1;
        },
        set: function reactiveSetter(newVal) {
            const value1 = getter ? getter.call(obj) : val;
            if (newVal === value1 || newVal !== newVal && value1 !== value1) {
                return;
            }
            if (customSetter) {
                customSetter();
            }
            if (getter && !setter) return;
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            childOb = !shallow && observe(newVal);
            dep.notify();
        }
    });
}
function set(target, key, val) {
    if (isUndef(target) || isPrimitive(target)) {
        warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`);
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    const ob = target.__ob__;
    if (target._isVue || ob && ob.vmCount) {
        warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val;
}
function del(target, key) {
    if (isUndef(target) || isPrimitive(target)) {
        warn(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`);
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1);
        return;
    }
    const ob = target.__ob__;
    if (target._isVue || ob && ob.vmCount) {
        warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
        return;
    }
    if (!hasOwn(target, key)) {
        return;
    }
    delete target[key];
    if (!ob) {
        return;
    }
    ob.dep.notify();
}
function dependArray(value1) {
    for(let e, i = 0, l = value1.length; i < l; i++){
        e = value1[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}
const strats = config.optionMergeStrategies;
{
    strats.el = strats.propsData = function(parent, child, vm, key) {
        if (!vm) {
            warn(`option "${key}" can only be used during instance ` + 'creation with the `new` keyword.');
        }
        return defaultStrat(parent, child);
    };
}function mergeData(to, from) {
    if (!from) return to;
    let key, toVal, fromVal;
    const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
    for(let i = 0; i < keys.length; i++){
        key = keys[i];
        if (key === '__ob__') continue;
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            set(to, key, fromVal);
        } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
            mergeData(toVal, fromVal);
        }
    }
    return to;
}
function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
        if (!childVal) {
            return parentVal;
        }
        if (!parentVal) {
            return childVal;
        }
        return function mergedDataFn() {
            return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
        };
    } else {
        return function mergedInstanceDataFn() {
            const instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
            const defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            } else {
                return defaultData;
            }
        };
    }
}
strats.data = function(parentVal, childVal, vm) {
    if (!vm) {
        if (childVal && typeof childVal !== 'function') {
            warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
            return parentVal;
        }
        return mergeDataOrFn(parentVal, childVal);
    }
    return mergeDataOrFn(parentVal, childVal, vm);
};
function mergeHook(parentVal, childVal) {
    const res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [
        childVal
    ] : parentVal;
    return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
    const res = [];
    for(let i = 0; i < hooks.length; i++){
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
        }
    }
    return res;
}
LIFECYCLE_HOOKS.forEach((hook)=>{
    strats[hook] = mergeHook;
});
function mergeAssets(parentVal, childVal, vm, key) {
    const res = Object.create(parentVal || null);
    if (childVal) {
        assertObjectType(key, childVal, vm);
        return extend(res, childVal);
    } else {
        return res;
    }
}
ASSET_TYPES.forEach(function(type) {
    strats[type + 's'] = mergeAssets;
});
strats.watch = function(parentVal, childVal, vm, key) {
    if (parentVal === nativeWatch) parentVal = undefined;
    if (childVal === nativeWatch) childVal = undefined;
    if (!childVal) return Object.create(parentVal || null);
    {
        assertObjectType(key, childVal, vm);
    }
    if (!parentVal) return childVal;
    const ret = {
    };
    extend(ret, parentVal);
    for(const key1 in childVal){
        let parent = ret[key1];
        const child = childVal[key1];
        if (parent && !Array.isArray(parent)) {
            parent = [
                parent
            ];
        }
        ret[key1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [
            child
        ];
    }
    return ret;
};
strats.props = strats.methods = strats.inject = strats.computed = function(parentVal, childVal, vm, key) {
    if (childVal && "development" !== 'production') {
        assertObjectType(key, childVal, vm);
    }
    if (!parentVal) return childVal;
    const ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) extend(ret, childVal);
    return ret;
};
strats.provide = mergeDataOrFn;
const defaultStrat = function(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};
function checkComponents(options) {
    for(const key in options.components){
        validateComponentName(key);
    }
}
function validateComponentName(name) {
    if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
        warn('Invalid component name: "' + name + '". Component names ' + 'should conform to valid custom element name in html5 specification.');
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
        warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
    }
}
function normalizeProps(options, vm) {
    const props = options.props;
    if (!props) return;
    const res = {
    };
    let i, val, name;
    if (Array.isArray(props)) {
        i = props.length;
        while(i--){
            val = props[i];
            if (typeof val === 'string') {
                name = camelize(val);
                res[name] = {
                    type: null
                };
            } else {
                warn('props must be strings when using array syntax.');
            }
        }
    } else if (isPlainObject(props)) {
        for(const key in props){
            val = props[key];
            name = camelize(key);
            res[name] = isPlainObject(val) ? val : {
                type: val
            };
        }
    } else {
        warn(`Invalid value for option "props": expected an Array or an Object, ` + `but got ${toRawType(props)}.`, vm);
    }
    options.props = res;
}
function normalizeInject(options, vm) {
    const inject = options.inject;
    if (!inject) return;
    const normalized = options.inject = {
    };
    if (Array.isArray(inject)) {
        for(let i = 0; i < inject.length; i++){
            normalized[inject[i]] = {
                from: inject[i]
            };
        }
    } else if (isPlainObject(inject)) {
        for(const key in inject){
            const val = inject[key];
            normalized[key] = isPlainObject(val) ? extend({
                from: key
            }, val) : {
                from: val
            };
        }
    } else {
        warn(`Invalid value for option "inject": expected an Array or an Object, ` + `but got ${toRawType(inject)}.`, vm);
    }
}
function normalizeDirectives(options) {
    const dirs = options.directives;
    if (dirs) {
        for(const key in dirs){
            const def$$1 = dirs[key];
            if (typeof def$$1 === 'function') {
                dirs[key] = {
                    bind: def$$1,
                    update: def$$1
                };
            }
        }
    }
}
function assertObjectType(name, value1, vm) {
    if (!isPlainObject(value1)) {
        warn(`Invalid value for option "${name}": expected an Object, ` + `but got ${toRawType(value1)}.`, vm);
    }
}
function mergeOptions(parent, child, vm) {
    {
        checkComponents(child);
    }
    if (typeof child === 'function') {
        child = child.options;
    }
    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);
    if (!child._base) {
        if (child.extends) {
            parent = mergeOptions(parent, child.extends, vm);
        }
        if (child.mixins) {
            for(let i = 0, l = child.mixins.length; i < l; i++){
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
    }
    const options = {
    };
    let key;
    for(key in parent){
        mergeField(key);
    }
    for(key in child){
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    function mergeField(key1) {
        const strat = strats[key1] || defaultStrat;
        options[key1] = strat(parent[key1], child[key1], vm, key1);
    }
    return options;
}
function resolveAsset(options, type, id, warnMissing) {
    if (typeof id !== 'string') {
        return;
    }
    const assets = options[type];
    if (hasOwn(assets, id)) return assets[id];
    const camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) return assets[camelizedId];
    const PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
    const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if (warnMissing && !res) {
        warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
    }
    return res;
}
function validateProp(key, propOptions, propsData, vm) {
    const prop = propOptions[key];
    const absent = !hasOwn(propsData, key);
    let value1 = propsData[key];
    const booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
        if (absent && !hasOwn(prop, 'default')) {
            value1 = false;
        } else if (value1 === '' || value1 === hyphenate(key)) {
            const stringIndex = getTypeIndex(String, prop.type);
            if (stringIndex < 0 || booleanIndex < stringIndex) {
                value1 = true;
            }
        }
    }
    if (value1 === undefined) {
        value1 = getPropDefaultValue(vm, prop, key);
        const prevShouldObserve = shouldObserve;
        toggleObserving(true);
        observe(value1);
        toggleObserving(prevShouldObserve);
    }
    {
        assertProp(prop, key, value1, vm, absent);
    }
    return value1;
}
function getPropDefaultValue(vm, prop, key) {
    if (!hasOwn(prop, 'default')) {
        return undefined;
    }
    const def1 = prop.default;
    if (isObject(def1)) {
        warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
    }
    if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
        return vm._props[key];
    }
    return typeof def1 === 'function' && getType(prop.type) !== 'Function' ? def1.call(vm) : def1;
}
function assertProp(prop, name, value1, vm, absent) {
    if (prop.required && absent) {
        warn('Missing required prop: "' + name + '"', vm);
        return;
    }
    if (value1 == null && !prop.required) {
        return;
    }
    let type = prop.type;
    let valid = !type || type === true;
    const expectedTypes = [];
    if (type) {
        if (!Array.isArray(type)) {
            type = [
                type
            ];
        }
        for(let i = 0; i < type.length && !valid; i++){
            const assertedType = assertType(value1, type[i], vm);
            expectedTypes.push(assertedType.expectedType || '');
            valid = assertedType.valid;
        }
    }
    const haveExpectedTypes = expectedTypes.some((t)=>t
    );
    if (!valid && haveExpectedTypes) {
        warn(getInvalidTypeMessage(name, value1, expectedTypes), vm);
        return;
    }
    const validator = prop.validator;
    if (validator) {
        if (!validator(value1)) {
            warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
        }
    }
}
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;
function assertType(value1, type, vm) {
    let valid;
    const expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
        const t = typeof value1;
        valid = t === expectedType.toLowerCase();
        if (!valid && t === 'object') {
            valid = value1 instanceof type;
        }
    } else if (expectedType === 'Object') {
        valid = isPlainObject(value1);
    } else if (expectedType === 'Array') {
        valid = Array.isArray(value1);
    } else {
        try {
            valid = value1 instanceof type;
        } catch (e) {
            warn('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
            valid = false;
        }
    }
    return {
        valid,
        expectedType
    };
}
const functionTypeCheckRE = /^\s*function (\w+)/;
function getType(fn) {
    const match = fn && fn.toString().match(functionTypeCheckRE);
    return match ? match[1] : '';
}
function isSameType(a, b) {
    return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
    }
    for(let i = 0, len = expectedTypes.length; i < len; i++){
        if (isSameType(expectedTypes[i], type)) {
            return i;
        }
    }
    return -1;
}
function getInvalidTypeMessage(name, value1, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}".` + ` Expected ${expectedTypes.map(capitalize).join(', ')}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value1);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && isExplicable(typeof value1) && !isBoolean(expectedType, receivedType)) {
        message += ` with value ${styleValue(value1, expectedType)}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
        message += `with value ${styleValue(value1, receivedType)}.`;
    }
    return message;
}
function styleValue(value1, type) {
    if (type === 'String') {
        return `"${value1}"`;
    } else if (type === 'Number') {
        return `${Number(value1)}`;
    } else {
        return `${value1}`;
    }
}
const EXPLICABLE_TYPES = [
    'string',
    'number',
    'boolean'
];
function isExplicable(value1) {
    return EXPLICABLE_TYPES.some((elem)=>value1.toLowerCase() === elem
    );
}
function isBoolean(...args) {
    return args.some((elem)=>elem.toLowerCase() === 'boolean'
    );
}
function handleError(err, vm, info) {
    pushTarget();
    try {
        if (vm) {
            let cur = vm;
            while(cur = cur.$parent){
                const hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for(let i = 0; i < hooks.length; i++){
                        try {
                            const capture = hooks[i].call(cur, err, vm, info) === false;
                            if (capture) return;
                        } catch (e) {
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        globalHandleError(err, vm, info);
    } finally{
        popTarget();
    }
}
function invokeWithErrorHandling(handler, context1, args, vm, info) {
    let res;
    try {
        res = args ? handler.apply(context1, args) : handler.call(context1);
        if (res && !res._isVue && isPromise(res) && !res._handled) {
            res.catch((e)=>handleError(e, vm, info + ` (Promise/async)`)
            );
            res._handled = true;
        }
    } catch (e) {
        handleError(e, vm, info);
    }
    return res;
}
function globalHandleError(err, vm, info) {
    if (config.errorHandler) {
        try {
            return config.errorHandler.call(null, err, vm, info);
        } catch (e) {
            if (e !== err) {
                logError(e, null, 'config.errorHandler');
            }
        }
    }
    logError(err, vm, info);
}
function logError(err, vm, info) {
    {
        warn(`Error in ${info}: "${err.toString()}"`, vm);
    }
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
        console.error(err);
    } else {
        throw err;
    }
}
let isUsingMicroTask = false;
const callbacks = [];
let pending = false;
function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for(let i = 0; i < copies.length; i++){
        copies[i]();
    }
}
let timerFunc;
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = ()=>{
        p.then(flushCallbacks);
        if (isIOS) setTimeout(noop);
    };
    isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) || MutationObserver.toString() === '[object MutationObserverConstructor]')) {
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true
    });
    timerFunc = ()=>{
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
    isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = ()=>{
        setImmediate(flushCallbacks);
    };
} else {
    timerFunc = ()=>{
        setTimeout(flushCallbacks, 0);
    };
}
function nextTick(cb, ctx) {
    let _resolve;
    callbacks.push(()=>{
        if (cb) {
            try {
                cb.call(ctx);
            } catch (e) {
                handleError(e, ctx, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise((resolve)=>{
            _resolve = resolve;
        });
    }
}
let mark;
let measure;
{
    const perf = inBrowser && window.performance;
    if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
        mark = (tag1)=>perf.mark(tag1)
        ;
        measure = (name, startTag, endTag)=>{
            perf.measure(name, startTag, endTag);
            perf.clearMarks(startTag);
            perf.clearMarks(endTag);
        };
    }
}let initProxy;
{
    const allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' + 'require');
    const warnNonPresent = (target, key)=>{
        warn(`Property or method "${key}" is not defined on the instance but ` + 'referenced during render. Make sure that this property is reactive, ' + 'either in the data option, or for class-based components, by ' + 'initializing the property. ' + 'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
    };
    const warnReservedPrefix = (target, key)=>{
        warn(`Property "${key}" must be accessed with "$data.${key}" because ` + 'properties starting with "$" or "_" are not proxied in the Vue instance to ' + 'prevent conflicts with Vue internals. ' + 'See: https://vuejs.org/v2/api/#data', target);
    };
    const hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);
    if (hasProxy) {
        const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
        config.keyCodes = new Proxy(config.keyCodes, {
            set (target, key, value) {
                if (isBuiltInModifier(key)) {
                    warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`);
                    return false;
                } else {
                    target[key] = value;
                    return true;
                }
            }
        });
    }
    const hasHandler = {
        has (target, key) {
            const has = key in target;
            const isAllowed = allowedGlobals(key) || typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data);
            if (!has && !isAllowed) {
                if (key in target.$data) warnReservedPrefix(target, key);
                else warnNonPresent(target, key);
            }
            return has || !isAllowed;
        }
    };
    const getHandler = {
        get (target, key) {
            if (typeof key === 'string' && !(key in target)) {
                if (key in target.$data) warnReservedPrefix(target, key);
                else warnNonPresent(target, key);
            }
            return target[key];
        }
    };
    initProxy = function initProxy1(vm) {
        if (hasProxy) {
            const options = vm.$options;
            const handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
            vm._renderProxy = new Proxy(vm, handlers);
        } else {
            vm._renderProxy = vm;
        }
    };
}const seenObjects = new _Set();
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
}
function _traverse(val, seen) {
    let i, keys;
    const isA = Array.isArray(val);
    if (!isA && !isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
        return;
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }
    if (isA) {
        i = val.length;
        while(i--)_traverse(val[i], seen);
    } else {
        keys = Object.keys(val);
        i = keys.length;
        while(i--)_traverse(val[keys[i]], seen);
    }
}
const normalizeEvent = cached((name)=>{
    const passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    const once$$1 = name.charAt(0) === '~';
    name = once$$1 ? name.slice(1) : name;
    const capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
        name,
        once: once$$1,
        capture,
        passive
    };
});
function createFnInvoker(fns, vm) {
    function invoker() {
        const fns1 = invoker.fns;
        if (Array.isArray(fns1)) {
            const cloned = fns1.slice();
            for(let i = 0; i < cloned.length; i++){
                invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
            }
        } else {
            return invokeWithErrorHandling(fns1, null, arguments, vm, `v-on handler`);
        }
    }
    invoker.fns = fns;
    return invoker;
}
function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
    let name, def$$1, cur, old, event;
    for(name in on){
        def$$1 = cur = on[name];
        old = oldOn[name];
        event = normalizeEvent(name);
        if (isUndef(cur)) {
            warn(`Invalid handler for event "${event.name}": got ` + String(cur), vm);
        } else if (isUndef(old)) {
            if (isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur, vm);
            }
            if (isTrue(event.once)) {
                cur = on[name] = createOnceHandler(event.name, cur, event.capture);
            }
            add(event.name, cur, event.capture, event.passive, event.params);
        } else if (cur !== old) {
            old.fns = cur;
            on[name] = old;
        }
    }
    for(name in oldOn){
        if (isUndef(on[name])) {
            event = normalizeEvent(name);
            remove$$1(event.name, oldOn[name], event.capture);
        }
    }
}
function mergeVNodeHook(def1, hookKey, hook) {
    if (def1 instanceof VNode) {
        def1 = def1.data.hook || (def1.data.hook = {
        });
    }
    let invoker;
    const oldHook = def1[hookKey];
    function wrappedHook() {
        hook.apply(this, arguments);
        remove(invoker.fns, wrappedHook);
    }
    if (isUndef(oldHook)) {
        invoker = createFnInvoker([
            wrappedHook
        ]);
    } else {
        if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
            invoker = oldHook;
            invoker.fns.push(wrappedHook);
        } else {
            invoker = createFnInvoker([
                oldHook,
                wrappedHook
            ]);
        }
    }
    invoker.merged = true;
    def1[hookKey] = invoker;
}
function extractPropsFromVNodeData(data1, Ctor, tag1) {
    const propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
        return;
    }
    const res = {
    };
    const { attrs , props  } = data1;
    if (isDef(attrs) || isDef(props)) {
        for(const key in propOptions){
            const altKey = hyphenate(key);
            {
                const keyInLowerCase = key.toLowerCase();
                if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
                    tip(`Prop "${keyInLowerCase}" is passed to component ` + `${formatComponentName(tag1 || Ctor)}, but the declared prop name is` + ` "${key}". ` + `Note that HTML attributes are case-insensitive and camelCased ` + `props need to use their kebab-case equivalents when using in-DOM ` + `templates. You should probably use "${altKey}" instead of "${key}".`);
                }
            }
            checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
        }
    }
    return res;
}
function checkProp(res, hash, key, altKey, preserve) {
    if (isDef(hash)) {
        if (hasOwn(hash, key)) {
            res[key] = hash[key];
            if (!preserve) {
                delete hash[key];
            }
            return true;
        } else if (hasOwn(hash, altKey)) {
            res[key] = hash[altKey];
            if (!preserve) {
                delete hash[altKey];
            }
            return true;
        }
    }
    return false;
}
function simpleNormalizeChildren(children1) {
    for(let i = 0; i < children1.length; i++){
        if (Array.isArray(children1[i])) {
            return Array.prototype.concat.apply([], children1);
        }
    }
    return children1;
}
function normalizeChildren(children1) {
    return isPrimitive(children1) ? [
        createTextVNode(children1)
    ] : Array.isArray(children1) ? normalizeArrayChildren(children1) : undefined;
}
function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}
function normalizeArrayChildren(children1, nestedIndex) {
    const res = [];
    let i, c, lastIndex, last;
    for(i = 0; i < children1.length; i++){
        c = children1[i];
        if (isUndef(c) || typeof c === 'boolean') continue;
        lastIndex = res.length - 1;
        last = res[lastIndex];
        if (Array.isArray(c)) {
            if (c.length > 0) {
                c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`);
                if (isTextNode(c[0]) && isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + c[0].text);
                    c.shift();
                }
                res.push.apply(res, c);
            }
        } else if (isPrimitive(c)) {
            if (isTextNode(last)) {
                res[lastIndex] = createTextVNode(last.text + c);
            } else if (c !== '') {
                res.push(createTextVNode(c));
            }
        } else {
            if (isTextNode(c) && isTextNode(last)) {
                res[lastIndex] = createTextVNode(last.text + c.text);
            } else {
                if (isTrue(children1._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
                    c.key = `__vlist${nestedIndex}_${i}__`;
                }
                res.push(c);
            }
        }
    }
    return res;
}
function initProvide(vm) {
    const provide = vm.$options.provide;
    if (provide) {
        vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
    }
}
function initInjections(vm) {
    const result = resolveInject(vm.$options.inject, vm);
    if (result) {
        toggleObserving(false);
        Object.keys(result).forEach((key)=>{
            {
                defineReactive$$1(vm, key, result[key], ()=>{
                    warn(`Avoid mutating an injected value directly since the changes will be ` + `overwritten whenever the provided component re-renders. ` + `injection being mutated: "${key}"`, vm);
                });
            }
        });
        toggleObserving(true);
    }
}
function resolveInject(inject, vm) {
    if (inject) {
        const result = Object.create(null);
        const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);
        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            if (key === '__ob__') continue;
            const provideKey = inject[key].from;
            let source = vm;
            while(source){
                if (source._provided && hasOwn(source._provided, provideKey)) {
                    result[key] = source._provided[provideKey];
                    break;
                }
                source = source.$parent;
            }
            if (!source) {
                if ('default' in inject[key]) {
                    const provideDefault = inject[key].default;
                    result[key] = typeof provideDefault === 'function' ? provideDefault.call(vm) : provideDefault;
                } else {
                    warn(`Injection "${key}" not found`, vm);
                }
            }
        }
        return result;
    }
}
function resolveSlots(children1, context1) {
    if (!children1 || !children1.length) {
        return {
        };
    }
    const slots = {
    };
    for(let i = 0, l = children1.length; i < l; i++){
        const child = children1[i];
        const data1 = child.data;
        if (data1 && data1.attrs && data1.attrs.slot) {
            delete data1.attrs.slot;
        }
        if ((child.context === context1 || child.fnContext === context1) && data1 && data1.slot != null) {
            const name = data1.slot;
            const slot = slots[name] || (slots[name] = []);
            if (child.tag === 'template') {
                slot.push.apply(slot, child.children || []);
            } else {
                slot.push(child);
            }
        } else {
            (slots.default || (slots.default = [])).push(child);
        }
    }
    for(const name in slots){
        if (slots[name].every(isWhitespace)) {
            delete slots[name];
        }
    }
    return slots;
}
function isWhitespace(node) {
    return node.isComment && !node.asyncFactory || node.text === ' ';
}
function isAsyncPlaceholder(node) {
    return node.isComment && node.asyncFactory;
}
function normalizeScopedSlots(slots, normalSlots, prevSlots) {
    let res;
    const hasNormalSlots = Object.keys(normalSlots).length > 0;
    const isStable = slots ? !!slots.$stable : !hasNormalSlots;
    const key = slots && slots.$key;
    if (!slots) {
        res = {
        };
    } else if (slots._normalized) {
        return slots._normalized;
    } else if (isStable && prevSlots && prevSlots !== emptyObject && key === prevSlots.$key && !hasNormalSlots && !prevSlots.$hasNormal) {
        return prevSlots;
    } else {
        res = {
        };
        for(const key1 in slots){
            if (slots[key1] && key1[0] !== '$') {
                res[key1] = normalizeScopedSlot(normalSlots, key1, slots[key1]);
            }
        }
    }
    for(const key1 in normalSlots){
        if (!(key1 in res)) {
            res[key1] = proxyNormalSlot(normalSlots, key1);
        }
    }
    if (slots && Object.isExtensible(slots)) {
        slots._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res;
}
function normalizeScopedSlot(normalSlots, key, fn) {
    const normalized = function() {
        let res = arguments.length ? fn.apply(null, arguments) : fn({
        });
        res = res && typeof res === 'object' && !Array.isArray(res) ? [
            res
        ] : normalizeChildren(res);
        let vnode = res && res[0];
        return res && (!vnode || res.length === 1 && vnode.isComment && !isAsyncPlaceholder(vnode)) ? undefined : res;
    };
    if (fn.proxy) {
        Object.defineProperty(normalSlots, key, {
            get: normalized,
            enumerable: true,
            configurable: true
        });
    }
    return normalized;
}
function proxyNormalSlot(slots, key) {
    return ()=>slots[key]
    ;
}
function renderList(val, render) {
    let ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
        ret = new Array(val.length);
        for(i = 0, l = val.length; i < l; i++){
            ret[i] = render(val[i], i);
        }
    } else if (typeof val === 'number') {
        ret = new Array(val);
        for(i = 0; i < val; i++){
            ret[i] = render(i + 1, i);
        }
    } else if (isObject(val)) {
        if (hasSymbol && val[Symbol.iterator]) {
            ret = [];
            const iterator = val[Symbol.iterator]();
            let result = iterator.next();
            while(!result.done){
                ret.push(render(result.value, ret.length));
                result = iterator.next();
            }
        } else {
            keys = Object.keys(val);
            ret = new Array(keys.length);
            for(i = 0, l = keys.length; i < l; i++){
                key = keys[i];
                ret[i] = render(val[key], key, i);
            }
        }
    }
    if (!isDef(ret)) {
        ret = [];
    }
    ret._isVList = true;
    return ret;
}
function renderSlot(name, fallbackRender, props, bindObject) {
    const scopedSlotFn = this.$scopedSlots[name];
    let nodes;
    if (scopedSlotFn) {
        props = props || {
        };
        if (bindObject) {
            if (!isObject(bindObject)) {
                warn('slot v-bind without argument expects an Object', this);
            }
            props = extend(extend({
            }, bindObject), props);
        }
        nodes = scopedSlotFn(props) || (typeof fallbackRender === 'function' ? fallbackRender() : fallbackRender);
    } else {
        nodes = this.$slots[name] || (typeof fallbackRender === 'function' ? fallbackRender() : fallbackRender);
    }
    const target = props && props.slot;
    if (target) {
        return this.$createElement('template', {
            slot: target
        }, nodes);
    } else {
        return nodes;
    }
}
function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
}
function isKeyNotMatch(expect, actual) {
    if (Array.isArray(expect)) {
        return expect.indexOf(actual) === -1;
    } else {
        return expect !== actual;
    }
}
function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
    const mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
        return isKeyNotMatch(builtInKeyName, eventKeyName);
    } else if (mappedKeyCode) {
        return isKeyNotMatch(mappedKeyCode, eventKeyCode);
    } else if (eventKeyName) {
        return hyphenate(eventKeyName) !== key;
    }
    return eventKeyCode === undefined;
}
function bindObjectProps(data1, tag1, value2, asProp, isSync) {
    if (value2) {
        if (!isObject(value2)) {
            warn('v-bind without argument expects an Object or Array value', this);
        } else {
            if (Array.isArray(value2)) {
                value2 = toObject(value2);
            }
            let hash;
            for(const key in value2){
                if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
                    hash = data1;
                } else {
                    const type = data1.attrs && data1.attrs.type;
                    hash = asProp || config.mustUseProp(tag1, type, key) ? data1.domProps || (data1.domProps = {
                    }) : data1.attrs || (data1.attrs = {
                    });
                }
                const camelizedKey = camelize(key);
                const hyphenatedKey = hyphenate(key);
                if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
                    hash[key] = value2[key];
                    if (isSync) {
                        const on = data1.on || (data1.on = {
                        });
                        on[`update:${key}`] = function($event) {
                            value2[key] = $event;
                        };
                    }
                }
            }
        }
    }
    return data1;
}
function renderStatic(index, isInFor) {
    const cached1 = this._staticTrees || (this._staticTrees = []);
    let tree = cached1[index];
    if (tree && !isInFor) {
        return tree;
    }
    tree = cached1[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this);
    markStatic(tree, `__static__${index}`, false);
    return tree;
}
function markOnce(tree, index, key) {
    markStatic(tree, `__once__${index}${key ? `_${key}` : ``}`, true);
    return tree;
}
function markStatic(tree, key, isOnce) {
    if (Array.isArray(tree)) {
        for(let i = 0; i < tree.length; i++){
            if (tree[i] && typeof tree[i] !== 'string') {
                markStaticNode(tree[i], `${key}_${i}`, isOnce);
            }
        }
    } else {
        markStaticNode(tree, key, isOnce);
    }
}
function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
}
function bindObjectListeners(data1, value2) {
    if (value2) {
        if (!isPlainObject(value2)) {
            warn('v-on without argument expects an Object value', this);
        } else {
            const on = data1.on = data1.on ? extend({
            }, data1.on) : {
            };
            for(const key in value2){
                const existing = on[key];
                const ours = value2[key];
                on[key] = existing ? [].concat(existing, ours) : ours;
            }
        }
    }
    return data1;
}
function resolveScopedSlots(fns, res, hasDynamicKeys, contentHashKey) {
    res = res || {
        $stable: !hasDynamicKeys
    };
    for(let i = 0; i < fns.length; i++){
        const slot = fns[i];
        if (Array.isArray(slot)) {
            resolveScopedSlots(slot, res, hasDynamicKeys);
        } else if (slot) {
            if (slot.proxy) {
                slot.fn.proxy = true;
            }
            res[slot.key] = slot.fn;
        }
    }
    if (contentHashKey) {
        res.$key = contentHashKey;
    }
    return res;
}
function bindDynamicKeys(baseObj, values) {
    for(let i = 0; i < values.length; i += 2){
        const key = values[i];
        if (typeof key === 'string' && key) {
            baseObj[values[i]] = values[i + 1];
        } else if (key !== '' && key !== null) {
            warn(`Invalid value for dynamic directive argument (expected string or null): ${key}`, this);
        }
    }
    return baseObj;
}
function prependModifier(value2, symbol) {
    return typeof value2 === 'string' ? symbol + value2 : value2;
}
function installRenderHelpers(target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
}
function FunctionalRenderContext(data1, props, children1, parent, Ctor) {
    const options = Ctor.options;
    let contextVm;
    if (hasOwn(parent, '_uid')) {
        contextVm = Object.create(parent);
        contextVm._original = parent;
    } else {
        contextVm = parent;
        parent = parent._original;
    }
    const isCompiled = isTrue(options._compiled);
    const needNormalization = !isCompiled;
    this.data = data1;
    this.props = props;
    this.children = children1;
    this.parent = parent;
    this.listeners = data1.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = ()=>{
        if (!this.$slots) {
            normalizeScopedSlots(data1.scopedSlots, this.$slots = resolveSlots(children1, parent));
        }
        return this.$slots;
    };
    Object.defineProperty(this, 'scopedSlots', {
        enumerable: true,
        get () {
            return normalizeScopedSlots(data1.scopedSlots, this.slots());
        }
    });
    if (isCompiled) {
        this.$options = options;
        this.$slots = this.slots();
        this.$scopedSlots = normalizeScopedSlots(data1.scopedSlots, this.$slots);
    }
    if (options._scopeId) {
        this._c = (a, b, c, d)=>{
            const vnode = createElement(contextVm, a, b, c, d, needNormalization);
            if (vnode && !Array.isArray(vnode)) {
                vnode.fnScopeId = options._scopeId;
                vnode.fnContext = parent;
            }
            return vnode;
        };
    } else {
        this._c = (a, b, c, d)=>createElement(contextVm, a, b, c, d, needNormalization)
        ;
    }
}
installRenderHelpers(FunctionalRenderContext.prototype);
function createFunctionalComponent(Ctor, propsData, data1, contextVm, children1) {
    const options = Ctor.options;
    const props = {
    };
    const propOptions = options.props;
    if (isDef(propOptions)) {
        for(const key in propOptions){
            props[key] = validateProp(key, propOptions, propsData || emptyObject);
        }
    } else {
        if (isDef(data1.attrs)) mergeProps(props, data1.attrs);
        if (isDef(data1.props)) mergeProps(props, data1.props);
    }
    const renderContext = new FunctionalRenderContext(data1, props, children1, contextVm, Ctor);
    const vnode = options.render.call(null, renderContext._c, renderContext);
    if (vnode instanceof VNode) {
        return cloneAndMarkFunctionalResult(vnode, data1, renderContext.parent, options, renderContext);
    } else if (Array.isArray(vnode)) {
        const vnodes = normalizeChildren(vnode) || [];
        const res = new Array(vnodes.length);
        for(let i = 0; i < vnodes.length; i++){
            res[i] = cloneAndMarkFunctionalResult(vnodes[i], data1, renderContext.parent, options, renderContext);
        }
        return res;
    }
}
function cloneAndMarkFunctionalResult(vnode, data1, contextVm, options, renderContext) {
    const clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
        (clone.devtoolsMeta = clone.devtoolsMeta || {
        }).renderContext = renderContext;
    }
    if (data1.slot) {
        (clone.data || (clone.data = {
        })).slot = data1.slot;
    }
    return clone;
}
function mergeProps(to, from) {
    for(const key in from){
        to[camelize(key)] = from[key];
    }
}
const componentVNodeHooks = {
    init (vnode, hydrating) {
        if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
            const mountedNode = vnode;
            componentVNodeHooks.prepatch(mountedNode, mountedNode);
        } else {
            const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        }
    },
    prepatch (oldVnode, vnode) {
        const options = vnode.componentOptions;
        const child = vnode.componentInstance = oldVnode.componentInstance;
        updateChildComponent(child, options.propsData, options.listeners, vnode, options.children);
    },
    insert (vnode) {
        const { context: context1 , componentInstance  } = vnode;
        if (!componentInstance._isMounted) {
            componentInstance._isMounted = true;
            callHook(componentInstance, 'mounted');
        }
        if (vnode.data.keepAlive) {
            if (context1._isMounted) {
                queueActivatedComponent(componentInstance);
            } else {
                activateChildComponent(componentInstance, true);
            }
        }
    },
    destroy (vnode) {
        const { componentInstance  } = vnode;
        if (!componentInstance._isDestroyed) {
            if (!vnode.data.keepAlive) {
                componentInstance.$destroy();
            } else {
                deactivateChildComponent(componentInstance, true);
            }
        }
    }
};
const hooksToMerge = Object.keys(componentVNodeHooks);
function createComponent1(Ctor, data1, context1, children1, tag1) {
    if (isUndef(Ctor)) {
        return;
    }
    const baseCtor = context1.$options._base;
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
    }
    if (typeof Ctor !== 'function') {
        {
            warn(`Invalid Component definition: ${String(Ctor)}`, context1);
        }
        return;
    }
    let asyncFactory1;
    if (isUndef(Ctor.cid)) {
        asyncFactory1 = Ctor;
        Ctor = resolveAsyncComponent(asyncFactory1, baseCtor);
        if (Ctor === undefined) {
            return createAsyncPlaceholder(asyncFactory1, data1, context1, children1, tag1);
        }
    }
    data1 = data1 || {
    };
    resolveConstructorOptions(Ctor);
    if (isDef(data1.model)) {
        transformModel(Ctor.options, data1);
    }
    const propsData = extractPropsFromVNodeData(data1, Ctor, tag1);
    if (isTrue(Ctor.options.functional)) {
        return createFunctionalComponent(Ctor, propsData, data1, context1, children1);
    }
    const listeners = data1.on;
    data1.on = data1.nativeOn;
    if (isTrue(Ctor.options.abstract)) {
        const slot = data1.slot;
        data1 = {
        };
        if (slot) {
            data1.slot = slot;
        }
    }
    installComponentHooks(data1);
    const name = Ctor.options.name || tag1;
    const vnode = new VNode(`vue-component-${Ctor.cid}${name ? `-${name}` : ''}`, data1, undefined, undefined, undefined, context1, {
        Ctor,
        propsData,
        listeners,
        tag: tag1,
        children: children1
    }, asyncFactory1);
    return vnode;
}
function createComponentInstanceForVnode(vnode, parent) {
    const options = {
        _isComponent: true,
        _parentVnode: vnode,
        parent
    };
    const inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render;
        options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options);
}
function installComponentHooks(data1) {
    const hooks = data1.hook || (data1.hook = {
    });
    for(let i = 0; i < hooksToMerge.length; i++){
        const key = hooksToMerge[i];
        const existing = hooks[key];
        const toMerge = componentVNodeHooks[key];
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
        }
    }
}
function mergeHook$1(f1, f2) {
    const merged = (a, b)=>{
        f1(a, b);
        f2(a, b);
    };
    merged._merged = true;
    return merged;
}
function transformModel(options, data1) {
    const prop = options.model && options.model.prop || 'value';
    const event = options.model && options.model.event || 'input';
    (data1.attrs || (data1.attrs = {
    }))[prop] = data1.model.value;
    const on = data1.on || (data1.on = {
    });
    const existing = on[event];
    const callback = data1.model.callback;
    if (isDef(existing)) {
        if (Array.isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
            on[event] = [
                callback
            ].concat(existing);
        }
    } else {
        on[event] = callback;
    }
}
const ALWAYS_NORMALIZE = 2;
function createElement(context1, tag1, data1, children1, normalizationType, alwaysNormalize) {
    if (Array.isArray(data1) || isPrimitive(data1)) {
        normalizationType = children1;
        children1 = data1;
        data1 = undefined;
    }
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context1, tag1, data1, children1, normalizationType);
}
function _createElement(context1, tag1, data1, children1, normalizationType) {
    if (isDef(data1) && isDef(data1.__ob__)) {
        warn(`Avoid using observed data object as vnode data: ${JSON.stringify(data1)}\n` + 'Always create fresh vnode data objects in each render!', context1);
        return createEmptyVNode();
    }
    if (isDef(data1) && isDef(data1.is)) {
        tag1 = data1.is;
    }
    if (!tag1) {
        return createEmptyVNode();
    }
    if (isDef(data1) && isDef(data1.key) && !isPrimitive(data1.key)) {
        {
            warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context1);
        }
    }
    if (Array.isArray(children1) && typeof children1[0] === 'function') {
        data1 = data1 || {
        };
        data1.scopedSlots = {
            default: children1[0]
        };
        children1.length = 0;
    }
    if (normalizationType === 2) {
        children1 = normalizeChildren(children1);
    } else if (normalizationType === 1) {
        children1 = simpleNormalizeChildren(children1);
    }
    let vnode, ns;
    if (typeof tag1 === 'string') {
        let Ctor;
        ns = context1.$vnode && context1.$vnode.ns || config.getTagNamespace(tag1);
        if (config.isReservedTag(tag1)) {
            if (isDef(data1) && isDef(data1.nativeOn) && data1.tag !== 'component') {
                warn(`The .native modifier for v-on is only valid on components but it was used on <${tag1}>.`, context1);
            }
            vnode = new VNode(config.parsePlatformTagName(tag1), data1, children1, undefined, undefined, context1);
        } else if ((!data1 || !data1.pre) && isDef(Ctor = resolveAsset(context1.$options, 'components', tag1))) {
            vnode = createComponent1(Ctor, data1, context1, children1, tag1);
        } else {
            vnode = new VNode(tag1, data1, children1, undefined, undefined, context1);
        }
    } else {
        vnode = createComponent1(tag1, data1, context1, children1);
    }
    if (Array.isArray(vnode)) {
        return vnode;
    } else if (isDef(vnode)) {
        if (isDef(ns)) applyNS(vnode, ns);
        if (isDef(data1)) registerDeepBindings(data1);
        return vnode;
    } else {
        return createEmptyVNode();
    }
}
function applyNS(vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
        ns = undefined;
        force = true;
    }
    if (isDef(vnode.children)) {
        for(let i = 0, l = vnode.children.length; i < l; i++){
            const child = vnode.children[i];
            if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== 'svg')) {
                applyNS(child, ns, force);
            }
        }
    }
}
function registerDeepBindings(data1) {
    if (isObject(data1.style)) {
        traverse(data1.style);
    }
    if (isObject(data1.class)) {
        traverse(data1.class);
    }
}
function initRender(vm) {
    vm._vnode = null;
    vm._staticTrees = null;
    const options = vm.$options;
    const parentVnode = vm.$vnode = options._parentVnode;
    const renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    vm._c = (a, b, c, d)=>createElement(vm, a, b, c, d, false)
    ;
    vm.$createElement = (a, b, c, d)=>createElement(vm, a, b, c, d, true)
    ;
    const parentData = parentVnode && parentVnode.data;
    {
        defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, ()=>{
            !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm);
        }, true);
        defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, ()=>{
            !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm);
        }, true);
    }
}
let currentRenderingInstance = null;
function renderMixin(Vue) {
    installRenderHelpers(Vue.prototype);
    Vue.prototype.$nextTick = function(fn) {
        return nextTick(fn, this);
    };
    Vue.prototype._render = function() {
        const vm = this;
        const { render , _parentVnode  } = vm.$options;
        if (_parentVnode) {
            vm.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
        }
        vm.$vnode = _parentVnode;
        let vnode;
        try {
            currentRenderingInstance = vm;
            vnode = render.call(vm._renderProxy, vm.$createElement);
        } catch (e) {
            handleError(e, vm, `render`);
            if (vm.$options.renderError) {
                try {
                    vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                } catch (e1) {
                    handleError(e1, vm, `renderError`);
                    vnode = vm._vnode;
                }
            } else {
                vnode = vm._vnode;
            }
        } finally{
            currentRenderingInstance = null;
        }
        if (Array.isArray(vnode) && vnode.length === 1) {
            vnode = vnode[0];
        }
        if (!(vnode instanceof VNode)) {
            if (Array.isArray(vnode)) {
                warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
            }
            vnode = createEmptyVNode();
        }
        vnode.parent = _parentVnode;
        return vnode;
    };
}
function ensureCtor(comp, base) {
    if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === 'Module') {
        comp = comp.default;
    }
    return isObject(comp) ? base.extend(comp) : comp;
}
function createAsyncPlaceholder(factory, data1, context1, children1, tag1) {
    const node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = {
        data: data1,
        context: context1,
        children: children1,
        tag: tag1
    };
    return node;
}
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp;
    }
    if (isDef(factory.resolved)) {
        return factory.resolved;
    }
    const owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        factory.owners.push(owner);
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp;
    }
    if (owner && !isDef(factory.owners)) {
        const owners = factory.owners = [
            owner
        ];
        let sync = true;
        let timerLoading = null;
        let timerTimeout = null;
        owner.$on('hook:destroyed', ()=>remove(owners, owner)
        );
        const forceRender = (renderCompleted)=>{
            for(let i = 0, l = owners.length; i < l; i++){
                owners[i].$forceUpdate();
            }
            if (renderCompleted) {
                owners.length = 0;
                if (timerLoading !== null) {
                    clearTimeout(timerLoading);
                    timerLoading = null;
                }
                if (timerTimeout !== null) {
                    clearTimeout(timerTimeout);
                    timerTimeout = null;
                }
            }
        };
        const resolve = once1((res)=>{
            factory.resolved = ensureCtor(res, baseCtor);
            if (!sync) {
                forceRender(true);
            } else {
                owners.length = 0;
            }
        });
        const reject = once1((reason)=>{
            warn(`Failed to resolve async component: ${String(factory)}` + (reason ? `\nReason: ${reason}` : ''));
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender(true);
            }
        });
        const res = factory(resolve, reject);
        if (isObject(res)) {
            if (isPromise(res)) {
                if (isUndef(factory.resolved)) {
                    res.then(resolve, reject);
                }
            } else if (isPromise(res.component)) {
                res.component.then(resolve, reject);
                if (isDef(res.error)) {
                    factory.errorComp = ensureCtor(res.error, baseCtor);
                }
                if (isDef(res.loading)) {
                    factory.loadingComp = ensureCtor(res.loading, baseCtor);
                    if (res.delay === 0) {
                        factory.loading = true;
                    } else {
                        timerLoading = setTimeout(()=>{
                            timerLoading = null;
                            if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                factory.loading = true;
                                forceRender(false);
                            }
                        }, res.delay || 200);
                    }
                }
                if (isDef(res.timeout)) {
                    timerTimeout = setTimeout(()=>{
                        timerTimeout = null;
                        if (isUndef(factory.resolved)) {
                            reject(`timeout (${res.timeout}ms)`);
                        }
                    }, res.timeout);
                }
            }
        }
        sync = false;
        return factory.loading ? factory.loadingComp : factory.resolved;
    }
}
function getFirstComponentChild(children1) {
    if (Array.isArray(children1)) {
        for(let i = 0; i < children1.length; i++){
            const c = children1[i];
            if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                return c;
            }
        }
    }
}
function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    const listeners = vm.$options._parentListeners;
    if (listeners) {
        updateComponentListeners(vm, listeners);
    }
}
let target;
function add(event, fn) {
    target.$on(event, fn);
}
function remove$1(event, fn) {
    target.$off(event, fn);
}
function createOnceHandler(event, fn) {
    const _target = target;
    return function onceHandler() {
        const res = fn.apply(null, arguments);
        if (res !== null) {
            _target.$off(event, onceHandler);
        }
    };
}
function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm;
    updateListeners(listeners, oldListeners || {
    }, add, remove$1, createOnceHandler, vm);
    target = undefined;
}
function eventsMixin(Vue) {
    const hookRE = /^hook:/;
    Vue.prototype.$on = function(event, fn) {
        const vm = this;
        if (Array.isArray(event)) {
            for(let i = 0, l = event.length; i < l; i++){
                vm.$on(event[i], fn);
            }
        } else {
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            if (hookRE.test(event)) {
                vm._hasHookEvent = true;
            }
        }
        return vm;
    };
    Vue.prototype.$once = function(event, fn) {
        const vm = this;
        function on() {
            vm.$off(event, on);
            fn.apply(vm, arguments);
        }
        on.fn = fn;
        vm.$on(event, on);
        return vm;
    };
    Vue.prototype.$off = function(event, fn) {
        const vm = this;
        if (!arguments.length) {
            vm._events = Object.create(null);
            return vm;
        }
        if (Array.isArray(event)) {
            for(let i = 0, l = event.length; i < l; i++){
                vm.$off(event[i], fn);
            }
            return vm;
        }
        const cbs = vm._events[event];
        if (!cbs) {
            return vm;
        }
        if (!fn) {
            vm._events[event] = null;
            return vm;
        }
        let cb;
        let i = cbs.length;
        while(i--){
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break;
            }
        }
        return vm;
    };
    Vue.prototype.$emit = function(event) {
        const vm = this;
        {
            const lowerCaseEvent = event.toLowerCase();
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(`Event "${lowerCaseEvent}" is emitted in component ` + `${formatComponentName(vm)} but the handler is registered for "${event}". ` + `Note that HTML attributes are case-insensitive and you cannot use ` + `v-on to listen to camelCase events when using in-DOM templates. ` + `You should probably use "${hyphenate(event)}" instead of "${event}".`);
            }
        }
        let cbs = vm._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            const args = toArray(arguments, 1);
            const info = `event handler for "${event}"`;
            for(let i = 0, l = cbs.length; i < l; i++){
                invokeWithErrorHandling(cbs[i], vm, args, vm, info);
            }
        }
        return vm;
    };
}
let activeInstance = null;
let isUpdatingChildComponent = false;
function setActiveInstance(vm) {
    const prevActiveInstance = activeInstance;
    activeInstance = vm;
    return ()=>{
        activeInstance = prevActiveInstance;
    };
}
function initLifecycle(vm) {
    const options = vm.$options;
    let parent = options.parent;
    if (parent && !options.abstract) {
        while(parent.$options.abstract && parent.$parent){
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;
    vm.$children = [];
    vm.$refs = {
    };
    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}
function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode, hydrating) {
        const vm = this;
        const prevEl = vm.$el;
        const prevVnode = vm._vnode;
        const restoreActiveInstance = setActiveInstance(vm);
        vm._vnode = vnode;
        if (!prevVnode) {
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
        } else {
            vm.$el = vm.__patch__(prevVnode, vnode);
        }
        restoreActiveInstance();
        if (prevEl) {
            prevEl.__vue__ = null;
        }
        if (vm.$el) {
            vm.$el.__vue__ = vm;
        }
        if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
            vm.$parent.$el = vm.$el;
        }
    };
    Vue.prototype.$forceUpdate = function() {
        const vm = this;
        if (vm._watcher) {
            vm._watcher.update();
        }
    };
    Vue.prototype.$destroy = function() {
        const vm = this;
        if (vm._isBeingDestroyed) {
            return;
        }
        callHook(vm, 'beforeDestroy');
        vm._isBeingDestroyed = true;
        const parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm);
        }
        if (vm._watcher) {
            vm._watcher.teardown();
        }
        let i = vm._watchers.length;
        while(i--){
            vm._watchers[i].teardown();
        }
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--;
        }
        vm._isDestroyed = true;
        vm.__patch__(vm._vnode, null);
        callHook(vm, 'destroyed');
        vm.$off();
        if (vm.$el) {
            vm.$el.__vue__ = null;
        }
        if (vm.$vnode) {
            vm.$vnode.parent = null;
        }
    };
}
function mountComponent(vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode;
        {
            if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
                warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
            } else {
                warn('Failed to mount component: template or render function not defined.', vm);
            }
        }
    }
    callHook(vm, 'beforeMount');
    let updateComponent;
    if (config.performance && mark) {
        updateComponent = ()=>{
            const name = vm._name;
            const id = vm._uid;
            const startTag = `vue-perf-start:${id}`;
            const endTag = `vue-perf-end:${id}`;
            mark(startTag);
            const vnode = vm._render();
            mark(endTag);
            measure(`vue ${name} render`, startTag, endTag);
            mark(startTag);
            vm._update(vnode, hydrating);
            mark(endTag);
            measure(`vue ${name} patch`, startTag, endTag);
        };
    } else {
        updateComponent = ()=>{
            vm._update(vm._render(), hydrating);
        };
    }
    new Watcher(vm, updateComponent, noop, {
        before () {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook(vm, 'beforeUpdate');
            }
        }
    }, true);
    hydrating = false;
    if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook(vm, 'mounted');
    }
    return vm;
}
function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    {
        isUpdatingChildComponent = true;
    }
    const newScopedSlots = parentVnode.data.scopedSlots;
    const oldScopedSlots = vm.$scopedSlots;
    const hasDynamicScopedSlot = !!(newScopedSlots && !newScopedSlots.$stable || oldScopedSlots !== emptyObject && !oldScopedSlots.$stable || newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key || !newScopedSlots && vm.$scopedSlots.$key);
    const needsForceUpdate = !!(renderChildren || vm.$options._renderChildren || hasDynamicScopedSlot);
    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode;
    if (vm._vnode) {
        vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;
    if (propsData && vm.$options.props) {
        toggleObserving(false);
        const props = vm._props;
        const propKeys = vm.$options._propKeys || [];
        for(let i = 0; i < propKeys.length; i++){
            const key = propKeys[i];
            const propOptions = vm.$options.props;
            props[key] = validateProp(key, propOptions, propsData, vm);
        }
        toggleObserving(true);
        vm.$options.propsData = propsData;
    }
    listeners = listeners || emptyObject;
    const oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
    if (needsForceUpdate) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context);
        vm.$forceUpdate();
    }
    {
        isUpdatingChildComponent = false;
    }
}
function isInInactiveTree(vm) {
    while(vm && (vm = vm.$parent)){
        if (vm._inactive) return true;
    }
    return false;
}
function activateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = false;
        if (isInInactiveTree(vm)) {
            return;
        }
    } else if (vm._directInactive) {
        return;
    }
    if (vm._inactive || vm._inactive === null) {
        vm._inactive = false;
        for(let i = 0; i < vm.$children.length; i++){
            activateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'activated');
    }
}
function deactivateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = true;
        if (isInInactiveTree(vm)) {
            return;
        }
    }
    if (!vm._inactive) {
        vm._inactive = true;
        for(let i = 0; i < vm.$children.length; i++){
            deactivateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'deactivated');
    }
}
function callHook(vm, hook) {
    pushTarget();
    const handlers = vm.$options[hook];
    const info = `${hook} hook`;
    if (handlers) {
        for(let i = 0, j = handlers.length; i < j; i++){
            invokeWithErrorHandling(handlers[i], vm, null, vm, info);
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
    }
    popTarget();
}
const queue = [];
const activatedChildren = [];
let has = {
};
let circular = {
};
let waiting = false;
let flushing = false;
let index = 0;
function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = {
    };
    {
        circular = {
        };
    }
    waiting = flushing = false;
}
let currentFlushTimestamp = 0;
let getNow = Date.now;
if (inBrowser && !isIE) {
    const performance = window.performance;
    if (performance && typeof performance.now === 'function' && getNow() > document.createEvent('Event').timeStamp) {
        getNow = ()=>performance.now()
        ;
    }
}
function flushSchedulerQueue() {
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher, id;
    queue.sort((a, b)=>a.id - b.id
    );
    for(index = 0; index < queue.length; index++){
        watcher = queue[index];
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
        if (has[id] != null) {
            circular[id] = (circular[id] || 0) + 1;
            if (circular[id] > 100) {
                warn('You may have an infinite update loop ' + (watcher.user ? `in watcher with expression "${watcher.expression}"` : `in a component render function.`), watcher.vm);
                break;
            }
        }
    }
    const activatedQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();
    resetSchedulerState();
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);
    if (devtools && config.devtools) {
        devtools.emit('flush');
    }
}
function callUpdatedHooks(queue1) {
    let i = queue1.length;
    while(i--){
        const watcher = queue1[i];
        const vm = watcher.vm;
        if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'updated');
        }
    }
}
function queueActivatedComponent(vm) {
    vm._inactive = false;
    activatedChildren.push(vm);
}
function callActivatedHooks(queue1) {
    for(let i = 0; i < queue1.length; i++){
        queue1[i]._inactive = true;
        activateChildComponent(queue1[i], true);
    }
}
function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
            queue.push(watcher);
        } else {
            let i = queue.length - 1;
            while(i > index && queue[i].id > watcher.id){
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }
        if (!waiting) {
            waiting = true;
            if (!config.async) {
                flushSchedulerQueue();
                return;
            }
            nextTick(flushSchedulerQueue);
        }
    }
}
let uid$2 = 0;
class Watcher {
    constructor(vm, expOrFn, cb1, options, isRenderWatcher){
        this.vm = vm;
        if (isRenderWatcher) {
            vm._watcher = this;
        }
        vm._watchers.push(this);
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb1;
        this.id = ++uid$2;
        this.active = true;
        this.dirty = this.lazy;
        this.deps = [];
        this.newDeps = [];
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        this.expression = expOrFn.toString();
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
                warn(`Failed watching path: "${expOrFn}" ` + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }
    get() {
        pushTarget(this);
        let value2;
        const vm1 = this.vm;
        try {
            value2 = this.getter.call(vm1, vm1);
        } catch (e) {
            if (this.user) {
                handleError(e, vm1, `getter for watcher "${this.expression}"`);
            } else {
                throw e;
            }
        } finally{
            if (this.deep) {
                traverse(value2);
            }
            popTarget();
            this.cleanupDeps();
        }
        return value2;
    }
    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }
    cleanupDeps() {
        let i = this.deps.length;
        while(i--){
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else if (this.sync) {
            this.run();
        } else {
            queueWatcher(this);
        }
    }
    run() {
        if (this.active) {
            const value2 = this.get();
            if (value2 !== this.value || isObject(value2) || this.deep) {
                const oldValue = this.value;
                this.value = value2;
                if (this.user) {
                    const info = `callback for watcher "${this.expression}"`;
                    invokeWithErrorHandling(this.cb, this.vm, [
                        value2,
                        oldValue
                    ], this.vm, info);
                } else {
                    this.cb.call(this.vm, value2, oldValue);
                }
            }
        }
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    depend() {
        let i = this.deps.length;
        while(i--){
            this.deps[i].depend();
        }
    }
    teardown() {
        if (this.active) {
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this);
            }
            let i = this.deps.length;
            while(i--){
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    }
}
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
function proxy(target1, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target1, key, sharedPropertyDefinition);
}
function initState(vm1) {
    vm1._watchers = [];
    const opts = vm1.$options;
    if (opts.props) initProps(vm1, opts.props);
    if (opts.methods) initMethods(vm1, opts.methods);
    if (opts.data) {
        initData(vm1);
    } else {
        observe(vm1._data = {
        }, true);
    }
    if (opts.computed) initComputed(vm1, opts.computed);
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm1, opts.watch);
    }
}
function initProps(vm1, propsOptions) {
    const propsData = vm1.$options.propsData || {
    };
    const props = vm1._props = {
    };
    const keys = vm1.$options._propKeys = [];
    const isRoot = !vm1.$parent;
    if (!isRoot) {
        toggleObserving(false);
    }
    for(const key in propsOptions){
        keys.push(key);
        const value2 = validateProp(key, propsOptions, propsData, vm1);
        {
            const hyphenatedKey = hyphenate(key);
            if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
                warn(`"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`, vm1);
            }
            defineReactive$$1(props, key, value2, ()=>{
                if (!isRoot && !isUpdatingChildComponent) {
                    warn(`Avoid mutating a prop directly since the value will be ` + `overwritten whenever the parent component re-renders. ` + `Instead, use a data or computed property based on the prop's ` + `value. Prop being mutated: "${key}"`, vm1);
                }
            });
        }
        if (!(key in vm1)) {
            proxy(vm1, `_props`, key);
        }
    }
    toggleObserving(true);
}
function initData(vm1) {
    let data1 = vm1.$options.data;
    data1 = vm1._data = typeof data1 === 'function' ? getData(data1, vm1) : data1 || {
    };
    if (!isPlainObject(data1)) {
        data1 = {
        };
        warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm1);
    }
    const keys = Object.keys(data1);
    const props = vm1.$options.props;
    const methods = vm1.$options.methods;
    let i = keys.length;
    while(i--){
        const key = keys[i];
        {
            if (methods && hasOwn(methods, key)) {
                warn(`Method "${key}" has already been defined as a data property.`, vm1);
            }
        }
        if (props && hasOwn(props, key)) {
            warn(`The data property "${key}" is already declared as a prop. ` + `Use prop default value instead.`, vm1);
        } else if (!isReserved(key)) {
            proxy(vm1, `_data`, key);
        }
    }
    observe(data1, true);
}
function getData(data1, vm1) {
    pushTarget();
    try {
        return data1.call(vm1, vm1);
    } catch (e) {
        handleError(e, vm1, `data()`);
        return {
        };
    } finally{
        popTarget();
    }
}
const computedWatcherOptions = {
    lazy: true
};
function initComputed(vm1, computed) {
    const watchers = vm1._computedWatchers = Object.create(null);
    const isSSR = isServerRendering();
    for(const key in computed){
        const userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        if (getter == null) {
            warn(`Getter is missing for computed property "${key}".`, vm1);
        }
        if (!isSSR) {
            watchers[key] = new Watcher(vm1, getter || noop, noop, computedWatcherOptions);
        }
        if (!(key in vm1)) {
            defineComputed(vm1, key, userDef);
        } else {
            if (key in vm1.$data) {
                warn(`The computed property "${key}" is already defined in data.`, vm1);
            } else if (vm1.$options.props && key in vm1.$options.props) {
                warn(`The computed property "${key}" is already defined as a prop.`, vm1);
            } else if (vm1.$options.methods && key in vm1.$options.methods) {
                warn(`The computed property "${key}" is already defined as a method.`, vm1);
            }
        }
    }
}
function defineComputed(target1, key, userDef) {
    const shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef);
        sharedPropertyDefinition.set = noop;
    } else {
        sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key) : createGetterInvoker(userDef.get) : noop;
        sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function() {
            warn(`Computed property "${key}" was assigned to but it has no setter.`, this);
        };
    }
    Object.defineProperty(target1, key, sharedPropertyDefinition);
}
function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    };
}
function createGetterInvoker(fn) {
    return function computedGetter() {
        return fn.call(this, this);
    };
}
function initMethods(vm1, methods) {
    const props = vm1.$options.props;
    for(const key in methods){
        {
            if (typeof methods[key] !== 'function') {
                warn(`Method "${key}" has type "${typeof methods[key]}" in the component definition. ` + `Did you reference the function correctly?`, vm1);
            }
            if (props && hasOwn(props, key)) {
                warn(`Method "${key}" has already been defined as a prop.`, vm1);
            }
            if (key in vm1 && isReserved(key)) {
                warn(`Method "${key}" conflicts with an existing Vue instance method. ` + `Avoid defining component methods that start with _ or $.`);
            }
        }
        vm1[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm1);
    }
}
function initWatch(vm1, watch) {
    for(const key in watch){
        const handler = watch[key];
        if (Array.isArray(handler)) {
            for(let i = 0; i < handler.length; i++){
                createWatcher(vm1, key, handler[i]);
            }
        } else {
            createWatcher(vm1, key, handler);
        }
    }
}
function createWatcher(vm1, expOrFn1, handler, options1) {
    if (isPlainObject(handler)) {
        options1 = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = vm1[handler];
    }
    return vm1.$watch(expOrFn1, handler, options1);
}
function stateMixin(Vue) {
    const dataDef = {
    };
    dataDef.get = function() {
        return this._data;
    };
    const propsDef = {
    };
    propsDef.get = function() {
        return this._props;
    };
    {
        dataDef.set = function() {
            warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
        };
        propsDef.set = function() {
            warn(`$props is readonly.`, this);
        };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);
    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;
    Vue.prototype.$watch = function(expOrFn1, cb1, options1) {
        const vm1 = this;
        if (isPlainObject(cb1)) {
            return createWatcher(vm1, expOrFn1, cb1, options1);
        }
        options1 = options1 || {
        };
        options1.user = true;
        const watcher = new Watcher(vm1, expOrFn1, cb1, options1);
        if (options1.immediate) {
            const info = `callback for immediate watcher "${watcher.expression}"`;
            pushTarget();
            invokeWithErrorHandling(cb1, vm1, [
                watcher.value
            ], vm1, info);
            popTarget();
        }
        return function unwatchFn() {
            watcher.teardown();
        };
    };
}
let uid$3 = 0;
function initMixin(Vue) {
    Vue.prototype._init = function(options1) {
        const vm1 = this;
        vm1._uid = uid$3++;
        let startTag, endTag;
        if (config.performance && mark) {
            startTag = `vue-perf-start:${vm1._uid}`;
            endTag = `vue-perf-end:${vm1._uid}`;
            mark(startTag);
        }
        vm1._isVue = true;
        if (options1 && options1._isComponent) {
            initInternalComponent(vm1, options1);
        } else {
            vm1.$options = mergeOptions(resolveConstructorOptions(vm1.constructor), options1 || {
            }, vm1);
        }
        {
            initProxy(vm1);
        }
        vm1._self = vm1;
        initLifecycle(vm1);
        initEvents(vm1);
        initRender(vm1);
        callHook(vm1, 'beforeCreate');
        initInjections(vm1);
        initState(vm1);
        initProvide(vm1);
        callHook(vm1, 'created');
        if (config.performance && mark) {
            vm1._name = formatComponentName(vm1, false);
            mark(endTag);
            measure(`vue ${vm1._name} init`, startTag, endTag);
        }
        if (vm1.$options.el) {
            vm1.$mount(vm1.$options.el);
        }
    };
}
function initInternalComponent(vm1, options1) {
    const opts = vm1.$options = Object.create(vm1.constructor.options);
    const parentVnode = options1._parentVnode;
    opts.parent = options1.parent;
    opts._parentVnode = parentVnode;
    const vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;
    if (options1.render) {
        opts.render = options1.render;
        opts.staticRenderFns = options1.staticRenderFns;
    }
}
function resolveConstructorOptions(Ctor) {
    let options1 = Ctor.options;
    if (Ctor.super) {
        const superOptions = resolveConstructorOptions(Ctor.super);
        const cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
            Ctor.superOptions = superOptions;
            const modifiedOptions = resolveModifiedOptions(Ctor);
            if (modifiedOptions) {
                extend(Ctor.extendOptions, modifiedOptions);
            }
            options1 = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
            if (options1.name) {
                options1.components[options1.name] = Ctor;
            }
        }
    }
    return options1;
}
function resolveModifiedOptions(Ctor) {
    let modified;
    const latest = Ctor.options;
    const sealed = Ctor.sealedOptions;
    for(const key in latest){
        if (latest[key] !== sealed[key]) {
            if (!modified) modified = {
            };
            modified[key] = latest[key];
        }
    }
    return modified;
}
function Vue(options1) {
    if (!(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options1);
}
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
function initUse(Vue1) {
    Vue1.use = function(plugin) {
        const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        }
        const args = toArray(arguments, 1);
        args.unshift(this);
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args);
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this;
    };
}
function initMixin$1(Vue1) {
    Vue1.mixin = function(mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
}
function initExtend(Vue1) {
    Vue1.cid = 0;
    let cid = 1;
    Vue1.extend = function(extendOptions) {
        extendOptions = extendOptions || {
        };
        const Super = this;
        const SuperId = Super.cid;
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {
        });
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId];
        }
        const name = extendOptions.name || Super.options.name;
        if (name) {
            validateComponentName(name);
        }
        const Sub = function VueComponent(options1) {
            this._init(options1);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub['super'] = Super;
        if (Sub.options.props) {
            initProps$1(Sub);
        }
        if (Sub.options.computed) {
            initComputed$1(Sub);
        }
        Sub.extend = Super.extend;
        Sub.mixin = Super.mixin;
        Sub.use = Super.use;
        ASSET_TYPES.forEach(function(type) {
            Sub[type] = Super[type];
        });
        if (name) {
            Sub.options.components[name] = Sub;
        }
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        Sub.sealedOptions = extend({
        }, Sub.options);
        cachedCtors[SuperId] = Sub;
        return Sub;
    };
}
function initProps$1(Comp) {
    const props = Comp.options.props;
    for(const key in props){
        proxy(Comp.prototype, `_props`, key);
    }
}
function initComputed$1(Comp) {
    const computed = Comp.options.computed;
    for(const key in computed){
        defineComputed(Comp.prototype, key, computed[key]);
    }
}
function initAssetRegisters(Vue1) {
    ASSET_TYPES.forEach((type)=>{
        Vue1[type] = function(id, definition) {
            if (!definition) {
                return this.options[type + 's'][id];
            } else {
                if (type === 'component') {
                    validateComponentName(id);
                }
                if (type === 'component' && isPlainObject(definition)) {
                    definition.name = definition.name || id;
                    definition = this.options._base.extend(definition);
                }
                if (type === 'directive' && typeof definition === 'function') {
                    definition = {
                        bind: definition,
                        update: definition
                    };
                }
                this.options[type + 's'][id] = definition;
                return definition;
            }
        };
    });
}
function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag);
}
function matches(pattern, name) {
    if (Array.isArray(pattern)) {
        return pattern.indexOf(name) > -1;
    } else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1;
    } else if (isRegExp(pattern)) {
        return pattern.test(name);
    }
    return false;
}
function pruneCache(keepAliveInstance, filter) {
    const { cache , keys , _vnode  } = keepAliveInstance;
    for(const key in cache){
        const entry = cache[key];
        if (entry) {
            const name = entry.name;
            if (name && !filter(name)) {
                pruneCacheEntry(cache, key, keys, _vnode);
            }
        }
    }
}
function pruneCacheEntry(cache, key, keys, current) {
    const entry = cache[key];
    if (entry && (!current || entry.tag !== current.tag)) {
        entry.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
}
const patternTypes = [
    String,
    RegExp,
    Array
];
var KeepAlive = {
    name: 'keep-alive',
    abstract: true,
    props: {
        include: patternTypes,
        exclude: patternTypes,
        max: [
            String,
            Number
        ]
    },
    methods: {
        cacheVNode () {
            const { cache , keys , vnodeToCache , keyToCache  } = this;
            if (vnodeToCache) {
                const { tag: tag1 , componentInstance , componentOptions: componentOptions1  } = vnodeToCache;
                cache[keyToCache] = {
                    name: getComponentName(componentOptions1),
                    tag: tag1,
                    componentInstance
                };
                keys.push(keyToCache);
                if (this.max && keys.length > parseInt(this.max)) {
                    pruneCacheEntry(cache, keys[0], keys, this._vnode);
                }
                this.vnodeToCache = null;
            }
        }
    },
    created () {
        this.cache = Object.create(null);
        this.keys = [];
    },
    destroyed () {
        for(const key in this.cache){
            pruneCacheEntry(this.cache, key, this.keys);
        }
    },
    mounted () {
        this.cacheVNode();
        this.$watch('include', (val)=>{
            pruneCache(this, (name)=>matches(val, name)
            );
        });
        this.$watch('exclude', (val)=>{
            pruneCache(this, (name)=>!matches(val, name)
            );
        });
    },
    updated () {
        this.cacheVNode();
    },
    render () {
        const slot = this.$slots.default;
        const vnode = getFirstComponentChild(slot);
        const componentOptions1 = vnode && vnode.componentOptions;
        if (componentOptions1) {
            const name = getComponentName(componentOptions1);
            const { include , exclude  } = this;
            if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
                return vnode;
            }
            const { cache , keys  } = this;
            const key = vnode.key == null ? componentOptions1.Ctor.cid + (componentOptions1.tag ? `::${componentOptions1.tag}` : '') : vnode.key;
            if (cache[key]) {
                vnode.componentInstance = cache[key].componentInstance;
                remove(keys, key);
                keys.push(key);
            } else {
                this.vnodeToCache = vnode;
                this.keyToCache = key;
            }
            vnode.data.keepAlive = true;
        }
        return vnode || slot && slot[0];
    }
};
var builtInComponents = {
    KeepAlive
};
function initGlobalAPI(Vue1) {
    const configDef = {
    };
    configDef.get = ()=>config
    ;
    {
        configDef.set = ()=>{
            warn('Do not replace the Vue.config object, set individual fields instead.');
        };
    }
    Object.defineProperty(Vue1, 'config', configDef);
    Vue1.util = {
        warn,
        extend,
        mergeOptions,
        defineReactive: defineReactive$$1
    };
    Vue1.set = set;
    Vue1.delete = del;
    Vue1.nextTick = nextTick;
    Vue1.observable = (obj)=>{
        observe(obj);
        return obj;
    };
    Vue1.options = Object.create(null);
    ASSET_TYPES.forEach((type)=>{
        Vue1.options[type + 's'] = Object.create(null);
    });
    Vue1.options._base = Vue1;
    extend(Vue1.options.components, builtInComponents);
    initUse(Vue1);
    initMixin$1(Vue1);
    initExtend(Vue1);
    initAssetRegisters(Vue1);
}
initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
    get () {
        return this.$vnode && this.$vnode.ssrContext;
    }
});
Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
});
Vue.version = '2.6.14';
const isReservedAttr = makeMap('style,class');
const acceptValue = makeMap('input,textarea,option,select,progress');
const mustUseProp = (tag1, type, attr)=>{
    return attr === 'value' && acceptValue(tag1) && type !== 'button' || attr === 'selected' && tag1 === 'option' || attr === 'checked' && tag1 === 'input' || attr === 'muted' && tag1 === 'video';
};
const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
const isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
const convertEnumeratedValue = (key, value2)=>{
    return isFalsyAttrValue(value2) || value2 === 'false' ? 'false' : key === 'contenteditable' && isValidContentEditableValue(value2) ? value2 : 'true';
};
const isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,' + 'truespeed,typemustmatch,visible');
const xlinkNS = 'http://www.w3.org/1999/xlink';
const isXlink = (name)=>{
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};
const getXlinkProp = (name)=>{
    return isXlink(name) ? name.slice(6, name.length) : '';
};
const isFalsyAttrValue = (val)=>{
    return val == null || val === false;
};
function genClassForVnode(vnode) {
    let data1 = vnode.data;
    let parentNode = vnode;
    let childNode = vnode;
    while(isDef(childNode.componentInstance)){
        childNode = childNode.componentInstance._vnode;
        if (childNode && childNode.data) {
            data1 = mergeClassData(childNode.data, data1);
        }
    }
    while(isDef(parentNode = parentNode.parent)){
        if (parentNode && parentNode.data) {
            data1 = mergeClassData(data1, parentNode.data);
        }
    }
    return renderClass(data1.staticClass, data1.class);
}
function mergeClassData(child, parent) {
    return {
        staticClass: concat(child.staticClass, parent.staticClass),
        class: isDef(child.class) ? [
            child.class,
            parent.class
        ] : parent.class
    };
}
function renderClass(staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass, stringifyClass(dynamicClass));
    }
    return '';
}
function concat(a, b) {
    return a ? b ? a + ' ' + b : a : b || '';
}
function stringifyClass(value2) {
    if (Array.isArray(value2)) {
        return stringifyArray(value2);
    }
    if (isObject(value2)) {
        return stringifyObject(value2);
    }
    if (typeof value2 === 'string') {
        return value2;
    }
    return '';
}
function stringifyArray(value2) {
    let res = '';
    let stringified;
    for(let i = 0, l = value2.length; i < l; i++){
        if (isDef(stringified = stringifyClass(value2[i])) && stringified !== '') {
            if (res) res += ' ';
            res += stringified;
        }
    }
    return res;
}
function stringifyObject(value2) {
    let res = '';
    for(const key in value2){
        if (value2[key]) {
            if (res) res += ' ';
            res += key;
        }
    }
    return res;
}
const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
};
const isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');
const isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
const isPreTag = (tag1)=>tag1 === 'pre'
;
const isReservedTag = (tag1)=>{
    return isHTMLTag(tag1) || isSVG(tag1);
};
function getTagNamespace(tag1) {
    if (isSVG(tag1)) {
        return 'svg';
    }
    if (tag1 === 'math') {
        return 'math';
    }
}
const unknownElementCache = Object.create(null);
function isUnknownElement(tag1) {
    if (!inBrowser) {
        return true;
    }
    if (isReservedTag(tag1)) {
        return false;
    }
    tag1 = tag1.toLowerCase();
    if (unknownElementCache[tag1] != null) {
        return unknownElementCache[tag1];
    }
    const el = document.createElement(tag1);
    if (tag1.indexOf('-') > -1) {
        return unknownElementCache[tag1] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
    } else {
        return unknownElementCache[tag1] = /HTMLUnknownElement/.test(el.toString());
    }
}
const isTextInputType = makeMap('text,number,password,search,email,tel,url');
function query(el) {
    if (typeof el === 'string') {
        const selected = document.querySelector(el);
        if (!selected) {
            warn('Cannot find element: ' + el);
            return document.createElement('div');
        }
        return selected;
    } else {
        return el;
    }
}
function createElement$1(tagName, vnode) {
    const elm1 = document.createElement(tagName);
    if (tagName !== 'select') {
        return elm1;
    }
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
        elm1.setAttribute('multiple', 'multiple');
    }
    return elm1;
}
function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
}
function createTextNode(text1) {
    return document.createTextNode(text1);
}
function createComment(text1) {
    return document.createComment(text1);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(node) {
    return node.tagName;
}
function setTextContent(node, text1) {
    node.textContent = text1;
}
function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
}
var nodeOps = Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
});
var ref = {
    create (_, vnode) {
        registerRef(vnode);
    },
    update (oldVnode, vnode) {
        if (oldVnode.data.ref !== vnode.data.ref) {
            registerRef(oldVnode, true);
            registerRef(vnode);
        }
    },
    destroy (vnode) {
        registerRef(vnode, true);
    }
};
function registerRef(vnode, isRemoval) {
    const key = vnode.data.ref;
    if (!isDef(key)) return;
    const vm1 = vnode.context;
    const ref1 = vnode.componentInstance || vnode.elm;
    const refs = vm1.$refs;
    if (isRemoval) {
        if (Array.isArray(refs[key])) {
            remove(refs[key], ref1);
        } else if (refs[key] === ref1) {
            refs[key] = undefined;
        }
    } else {
        if (vnode.data.refInFor) {
            if (!Array.isArray(refs[key])) {
                refs[key] = [
                    ref1
                ];
            } else if (refs[key].indexOf(ref1) < 0) {
                refs[key].push(ref1);
            }
        } else {
            refs[key] = ref1;
        }
    }
}
const emptyNode = new VNode('', {
}, []);
const hooks = [
    'create',
    'activate',
    'update',
    'remove',
    'destroy'
];
function sameVnode(a, b) {
    return a.key === b.key && a.asyncFactory === b.asyncFactory && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error));
}
function sameInputType(a, b) {
    if (a.tag !== 'input') return true;
    let i;
    const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
}
function createKeyToOldIdx(children1, beginIdx, endIdx) {
    let i, key;
    const map = {
    };
    for(i = beginIdx; i <= endIdx; ++i){
        key = children1[i].key;
        if (isDef(key)) map[key] = i;
    }
    return map;
}
function createPatchFunction(backend) {
    let i, j;
    const cbs = {
    };
    const { modules , nodeOps: nodeOps1  } = backend;
    for(i = 0; i < hooks.length; ++i){
        cbs[hooks[i]] = [];
        for(j = 0; j < modules.length; ++j){
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
    }
    function emptyNodeAt(elm1) {
        return new VNode(nodeOps1.tagName(elm1).toLowerCase(), {
        }, [], undefined, elm1);
    }
    function createRmCb(childElm, listeners) {
        function remove$$1() {
            if (--remove$$1.listeners === 0) {
                removeNode(childElm);
            }
        }
        remove$$1.listeners = listeners;
        return remove$$1;
    }
    function removeNode(el) {
        const parent = nodeOps1.parentNode(el);
        if (isDef(parent)) {
            nodeOps1.removeChild(parent, el);
        }
    }
    function isUnknownElement$$1(vnode, inVPre) {
        return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some((ignore)=>{
            return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
        })) && config.isUnknownElement(vnode.tag);
    }
    let creatingElmInVPre = 0;
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index1) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            vnode = ownerArray[index1] = cloneVNode(vnode);
        }
        vnode.isRootInsert = !nested;
        if (createComponent2(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return;
        }
        const data1 = vnode.data;
        const children1 = vnode.children;
        const tag1 = vnode.tag;
        if (isDef(tag1)) {
            {
                if (data1 && data1.pre) {
                    creatingElmInVPre++;
                }
                if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
                    warn('Unknown custom element: <' + tag1 + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
                }
            }
            vnode.elm = vnode.ns ? nodeOps1.createElementNS(vnode.ns, tag1) : nodeOps1.createElement(tag1, vnode);
            setScope(vnode);
            {
                createChildren(vnode, children1, insertedVnodeQueue);
                if (isDef(data1)) {
                    invokeCreateHooks(vnode, insertedVnodeQueue);
                }
                insert(parentElm, vnode.elm, refElm);
            }
            if (data1 && data1.pre) {
                creatingElmInVPre--;
            }
        } else if (isTrue(vnode.isComment)) {
            vnode.elm = nodeOps1.createComment(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        } else {
            vnode.elm = nodeOps1.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
    }
    function createComponent2(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i1 = vnode.data;
        if (isDef(i1)) {
            const isReactivated = isDef(vnode.componentInstance) && i1.keepAlive;
            if (isDef(i1 = i1.hook) && isDef(i1 = i1.init)) {
                i1(vnode, false);
            }
            if (isDef(vnode.componentInstance)) {
                initComponent(vnode, insertedVnodeQueue);
                insert(parentElm, vnode.elm, refElm);
                if (isTrue(isReactivated)) {
                    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                }
                return true;
            }
        }
    }
    function initComponent(vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
            insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
            vnode.data.pendingInsert = null;
        }
        vnode.elm = vnode.componentInstance.$el;
        if (isPatchable(vnode)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            setScope(vnode);
        } else {
            registerRef(vnode);
            insertedVnodeQueue.push(vnode);
        }
    }
    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i1;
        let innerNode = vnode;
        while(innerNode.componentInstance){
            innerNode = innerNode.componentInstance._vnode;
            if (isDef(i1 = innerNode.data) && isDef(i1 = i1.transition)) {
                for(i1 = 0; i1 < cbs.activate.length; ++i1){
                    cbs.activate[i1](emptyNode, innerNode);
                }
                insertedVnodeQueue.push(innerNode);
                break;
            }
        }
        insert(parentElm, vnode.elm, refElm);
    }
    function insert(parent, elm1, ref$$1) {
        if (isDef(parent)) {
            if (isDef(ref$$1)) {
                if (nodeOps1.parentNode(ref$$1) === parent) {
                    nodeOps1.insertBefore(parent, elm1, ref$$1);
                }
            } else {
                nodeOps1.appendChild(parent, elm1);
            }
        }
    }
    function createChildren(vnode, children1, insertedVnodeQueue) {
        if (Array.isArray(children1)) {
            {
                checkDuplicateKeys(children1);
            }
            for(let i1 = 0; i1 < children1.length; ++i1){
                createElm(children1[i1], insertedVnodeQueue, vnode.elm, null, true, children1, i1);
            }
        } else if (isPrimitive(vnode.text)) {
            nodeOps1.appendChild(vnode.elm, nodeOps1.createTextNode(String(vnode.text)));
        }
    }
    function isPatchable(vnode) {
        while(vnode.componentInstance){
            vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag);
    }
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for(let i1 = 0; i1 < cbs.create.length; ++i1){
            cbs.create[i1](emptyNode, vnode);
        }
        i = vnode.data.hook;
        if (isDef(i)) {
            if (isDef(i.create)) i.create(emptyNode, vnode);
            if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
        }
    }
    function setScope(vnode) {
        let i1;
        if (isDef(i1 = vnode.fnScopeId)) {
            nodeOps1.setStyleScope(vnode.elm, i1);
        } else {
            let ancestor = vnode;
            while(ancestor){
                if (isDef(i1 = ancestor.context) && isDef(i1 = i1.$options._scopeId)) {
                    nodeOps1.setStyleScope(vnode.elm, i1);
                }
                ancestor = ancestor.parent;
            }
        }
        if (isDef(i1 = activeInstance) && i1 !== vnode.context && i1 !== vnode.fnContext && isDef(i1 = i1.$options._scopeId)) {
            nodeOps1.setStyleScope(vnode.elm, i1);
        }
    }
    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for(; startIdx <= endIdx; ++startIdx){
            createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
        }
    }
    function invokeDestroyHook(vnode) {
        let i1, j1;
        const data1 = vnode.data;
        if (isDef(data1)) {
            if (isDef(i1 = data1.hook) && isDef(i1 = i1.destroy)) i1(vnode);
            for(i1 = 0; i1 < cbs.destroy.length; ++i1)cbs.destroy[i1](vnode);
        }
        if (isDef(i1 = vnode.children)) {
            for(j1 = 0; j1 < vnode.children.length; ++j1){
                invokeDestroyHook(vnode.children[j1]);
            }
        }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
        for(; startIdx <= endIdx; ++startIdx){
            const ch = vnodes[startIdx];
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
                    removeAndInvokeRemoveHook(ch);
                    invokeDestroyHook(ch);
                } else {
                    removeNode(ch.elm);
                }
            }
        }
    }
    function removeAndInvokeRemoveHook(vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
            let i1;
            const listeners = cbs.remove.length + 1;
            if (isDef(rm)) {
                rm.listeners += listeners;
            } else {
                rm = createRmCb(vnode.elm, listeners);
            }
            if (isDef(i1 = vnode.componentInstance) && isDef(i1 = i1._vnode) && isDef(i1.data)) {
                removeAndInvokeRemoveHook(i1, rm);
            }
            for(i1 = 0; i1 < cbs.remove.length; ++i1){
                cbs.remove[i1](vnode, rm);
            }
            if (isDef(i1 = vnode.data.hook) && isDef(i1 = i1.remove)) {
                i1(vnode, rm);
            } else {
                rm();
            }
        } else {
            removeNode(vnode.elm);
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx, idxInOld, vnodeToMove, refElm;
        const canMove = !removeOnly;
        {
            checkDuplicateKeys(newCh);
        }
        while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
            if (isUndef(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx];
            } else if (isUndef(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                canMove && nodeOps1.insertBefore(parentElm, oldStartVnode.elm, nodeOps1.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                canMove && nodeOps1.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                if (isUndef(idxInOld)) {
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                } else {
                    vnodeToMove = oldCh[idxInOld];
                    if (sameVnode(vnodeToMove, newStartVnode)) {
                        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                        oldCh[idxInOld] = undefined;
                        canMove && nodeOps1.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                    } else {
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (oldStartIdx > oldEndIdx) {
            refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        } else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function checkDuplicateKeys(children1) {
        const seenKeys = {
        };
        for(let i1 = 0; i1 < children1.length; i1++){
            const vnode = children1[i1];
            const key = vnode.key;
            if (isDef(key)) {
                if (seenKeys[key]) {
                    warn(`Duplicate keys detected: '${key}'. This may cause an update error.`, vnode.context);
                } else {
                    seenKeys[key] = true;
                }
            }
        }
    }
    function findIdxInOld(node, oldCh, start, end) {
        for(let i1 = start; i1 < end; i1++){
            const c = oldCh[i1];
            if (isDef(c) && sameVnode(node, c)) return i1;
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index1, removeOnly) {
        if (oldVnode === vnode) {
            return;
        }
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            vnode = ownerArray[index1] = cloneVNode(vnode);
        }
        const elm1 = vnode.elm = oldVnode.elm;
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
            if (isDef(vnode.asyncFactory.resolved)) {
                hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
            } else {
                vnode.isAsyncPlaceholder = true;
            }
            return;
        }
        if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
            vnode.componentInstance = oldVnode.componentInstance;
            return;
        }
        let i1;
        const data1 = vnode.data;
        if (isDef(data1) && isDef(i1 = data1.hook) && isDef(i1 = i1.prepatch)) {
            i1(oldVnode, vnode);
        }
        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (isDef(data1) && isPatchable(vnode)) {
            for(i1 = 0; i1 < cbs.update.length; ++i1)cbs.update[i1](oldVnode, vnode);
            if (isDef(i1 = data1.hook) && isDef(i1 = i1.update)) i1(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) updateChildren(elm1, oldCh, ch, insertedVnodeQueue, removeOnly);
            } else if (isDef(ch)) {
                {
                    checkDuplicateKeys(ch);
                }
                if (isDef(oldVnode.text)) nodeOps1.setTextContent(elm1, '');
                addVnodes(elm1, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            } else if (isDef(oldCh)) {
                removeVnodes(oldCh, 0, oldCh.length - 1);
            } else if (isDef(oldVnode.text)) {
                nodeOps1.setTextContent(elm1, '');
            }
        } else if (oldVnode.text !== vnode.text) {
            nodeOps1.setTextContent(elm1, vnode.text);
        }
        if (isDef(data1)) {
            if (isDef(i1 = data1.hook) && isDef(i1 = i1.postpatch)) i1(oldVnode, vnode);
        }
    }
    function invokeInsertHook(vnode, queue1, initial) {
        if (isTrue(initial) && isDef(vnode.parent)) {
            vnode.parent.data.pendingInsert = queue1;
        } else {
            for(let i1 = 0; i1 < queue1.length; ++i1){
                queue1[i1].data.hook.insert(queue1[i1]);
            }
        }
    }
    let hydrationBailed = false;
    const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
    function hydrate(elm1, vnode, insertedVnodeQueue, inVPre) {
        let i1;
        const { tag: tag1 , data: data1 , children: children1  } = vnode;
        inVPre = inVPre || data1 && data1.pre;
        vnode.elm = elm1;
        if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
            vnode.isAsyncPlaceholder = true;
            return true;
        }
        {
            if (!assertNodeMatch(elm1, vnode, inVPre)) {
                return false;
            }
        }
        if (isDef(data1)) {
            if (isDef(i1 = data1.hook) && isDef(i1 = i1.init)) i1(vnode, true);
            if (isDef(i1 = vnode.componentInstance)) {
                initComponent(vnode, insertedVnodeQueue);
                return true;
            }
        }
        if (isDef(tag1)) {
            if (isDef(children1)) {
                if (!elm1.hasChildNodes()) {
                    createChildren(vnode, children1, insertedVnodeQueue);
                } else {
                    if (isDef(i1 = data1) && isDef(i1 = i1.domProps) && isDef(i1 = i1.innerHTML)) {
                        if (i1 !== elm1.innerHTML) {
                            if (typeof console !== 'undefined' && !hydrationBailed) {
                                hydrationBailed = true;
                                console.warn('Parent: ', elm1);
                                console.warn('server innerHTML: ', i1);
                                console.warn('client innerHTML: ', elm1.innerHTML);
                            }
                            return false;
                        }
                    } else {
                        let childrenMatch = true;
                        let childNode = elm1.firstChild;
                        for(let i2 = 0; i2 < children1.length; i2++){
                            if (!childNode || !hydrate(childNode, children1[i2], insertedVnodeQueue, inVPre)) {
                                childrenMatch = false;
                                break;
                            }
                            childNode = childNode.nextSibling;
                        }
                        if (!childrenMatch || childNode) {
                            if (typeof console !== 'undefined' && !hydrationBailed) {
                                hydrationBailed = true;
                                console.warn('Parent: ', elm1);
                                console.warn('Mismatching childNodes vs. VNodes: ', elm1.childNodes, children1);
                            }
                            return false;
                        }
                    }
                }
            }
            if (isDef(data1)) {
                let fullInvoke = false;
                for(const key in data1){
                    if (!isRenderedModule(key)) {
                        fullInvoke = true;
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        break;
                    }
                }
                if (!fullInvoke && data1['class']) {
                    traverse(data1['class']);
                }
            }
        } else if (elm1.data !== vnode.text) {
            elm1.data = vnode.text;
        }
        return true;
    }
    function assertNodeMatch(node, vnode, inVPre) {
        if (isDef(vnode.tag)) {
            return vnode.tag.indexOf('vue-component') === 0 || !isUnknownElement$$1(vnode, inVPre) && vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
        } else {
            return node.nodeType === (vnode.isComment ? 8 : 3);
        }
    }
    return function patch(oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) {
            if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
            return;
        }
        let isInitialPatch = false;
        const insertedVnodeQueue = [];
        if (isUndef(oldVnode)) {
            isInitialPatch = true;
            createElm(vnode, insertedVnodeQueue);
        } else {
            const isRealElement = isDef(oldVnode.nodeType);
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
            } else {
                if (isRealElement) {
                    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR);
                        hydrating = true;
                    }
                    if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                            invokeInsertHook(vnode, insertedVnodeQueue, true);
                            return oldVnode;
                        } else {
                            warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
                        }
                    }
                    oldVnode = emptyNodeAt(oldVnode);
                }
                const oldElm = oldVnode.elm;
                const parentElm = nodeOps1.parentNode(oldElm);
                createElm(vnode, insertedVnodeQueue, oldElm._leaveCb ? null : parentElm, nodeOps1.nextSibling(oldElm));
                if (isDef(vnode.parent)) {
                    let ancestor = vnode.parent;
                    const patchable = isPatchable(vnode);
                    while(ancestor){
                        for(let i1 = 0; i1 < cbs.destroy.length; ++i1){
                            cbs.destroy[i1](ancestor);
                        }
                        ancestor.elm = vnode.elm;
                        if (patchable) {
                            for(let i2 = 0; i2 < cbs.create.length; ++i2){
                                cbs.create[i2](emptyNode, ancestor);
                            }
                            const insert1 = ancestor.data.hook.insert;
                            if (insert1.merged) {
                                for(let i3 = 1; i3 < insert1.fns.length; i3++){
                                    insert1.fns[i3]();
                                }
                            }
                        } else {
                            registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                    }
                }
                if (isDef(parentElm)) {
                    removeVnodes([
                        oldVnode
                    ], 0, 0);
                } else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode);
                }
            }
        }
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm;
    };
}
var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives(vnode) {
        updateDirectives(vnode, emptyNode);
    }
};
function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
        _update(oldVnode, vnode);
    }
}
function _update(oldVnode, vnode) {
    const isCreate = oldVnode === emptyNode;
    const isDestroy = vnode === emptyNode;
    const oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    const newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);
    const dirsWithInsert = [];
    const dirsWithPostpatch = [];
    let key, oldDir, dir;
    for(key in newDirs){
        oldDir = oldDirs[key];
        dir = newDirs[key];
        if (!oldDir) {
            callHook$1(dir, 'bind', vnode, oldVnode);
            if (dir.def && dir.def.inserted) {
                dirsWithInsert.push(dir);
            }
        } else {
            dir.oldValue = oldDir.value;
            dir.oldArg = oldDir.arg;
            callHook$1(dir, 'update', vnode, oldVnode);
            if (dir.def && dir.def.componentUpdated) {
                dirsWithPostpatch.push(dir);
            }
        }
    }
    if (dirsWithInsert.length) {
        const callInsert = ()=>{
            for(let i = 0; i < dirsWithInsert.length; i++){
                callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
            }
        };
        if (isCreate) {
            mergeVNodeHook(vnode, 'insert', callInsert);
        } else {
            callInsert();
        }
    }
    if (dirsWithPostpatch.length) {
        mergeVNodeHook(vnode, 'postpatch', ()=>{
            for(let i = 0; i < dirsWithPostpatch.length; i++){
                callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
            }
        });
    }
    if (!isCreate) {
        for(key in oldDirs){
            if (!newDirs[key]) {
                callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
            }
        }
    }
}
const emptyModifiers = Object.create(null);
function normalizeDirectives$1(dirs, vm1) {
    const res = Object.create(null);
    if (!dirs) {
        return res;
    }
    let i, dir;
    for(i = 0; i < dirs.length; i++){
        dir = dirs[i];
        if (!dir.modifiers) {
            dir.modifiers = emptyModifiers;
        }
        res[getRawDirName(dir)] = dir;
        dir.def = resolveAsset(vm1.$options, 'directives', dir.name, true);
    }
    return res;
}
function getRawDirName(dir) {
    return dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {
    }).join('.')}`;
}
function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
    const fn = dir.def && dir.def[hook];
    if (fn) {
        try {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        } catch (e) {
            handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`);
        }
    }
}
var baseModules = [
    ref,
    directives
];
function updateAttrs(oldVnode, vnode) {
    const opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
        return;
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return;
    }
    let key, cur, old;
    const elm1 = vnode.elm;
    const oldAttrs = oldVnode.data.attrs || {
    };
    let attrs = vnode.data.attrs || {
    };
    if (isDef(attrs.__ob__)) {
        attrs = vnode.data.attrs = extend({
        }, attrs);
    }
    for(key in attrs){
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
            setAttr(elm1, key, cur, vnode.data.pre);
        }
    }
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
        setAttr(elm1, 'value', attrs.value);
    }
    for(key in oldAttrs){
        if (isUndef(attrs[key])) {
            if (isXlink(key)) {
                elm1.removeAttributeNS(xlinkNS, getXlinkProp(key));
            } else if (!isEnumeratedAttr(key)) {
                elm1.removeAttribute(key);
            }
        }
    }
}
function setAttr(el, key, value2, isInPre) {
    if (isInPre || el.tagName.indexOf('-') > -1) {
        baseSetAttr(el, key, value2);
    } else if (isBooleanAttr(key)) {
        if (isFalsyAttrValue(value2)) {
            el.removeAttribute(key);
        } else {
            value2 = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
            el.setAttribute(key, value2);
        }
    } else if (isEnumeratedAttr(key)) {
        el.setAttribute(key, convertEnumeratedValue(key, value2));
    } else if (isXlink(key)) {
        if (isFalsyAttrValue(value2)) {
            el.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else {
            el.setAttributeNS(xlinkNS, key, value2);
        }
    } else {
        baseSetAttr(el, key, value2);
    }
}
function baseSetAttr(el, key, value2) {
    if (isFalsyAttrValue(value2)) {
        el.removeAttribute(key);
    } else {
        if (isIE && !isIE9 && el.tagName === 'TEXTAREA' && key === 'placeholder' && value2 !== '' && !el.__ieph) {
            const blocker = (e)=>{
                e.stopImmediatePropagation();
                el.removeEventListener('input', blocker);
            };
            el.addEventListener('input', blocker);
            el.__ieph = true;
        }
        el.setAttribute(key, value2);
    }
}
var attrs1 = {
    create: updateAttrs,
    update: updateAttrs
};
function updateClass(oldVnode, vnode) {
    const el = vnode.elm;
    const data1 = vnode.data;
    const oldData = oldVnode.data;
    if (isUndef(data1.staticClass) && isUndef(data1.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
        return;
    }
    let cls = genClassForVnode(vnode);
    const transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass));
    }
    if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
    }
}
var klass = {
    create: updateClass,
    update: updateClass
};
const validDivisionCharRE = /[\w).+\-_$\]]/;
function parseFilters(exp) {
    let inSingle = false;
    let inDouble = false;
    let inTemplateString = false;
    let inRegex = false;
    let curly = 0;
    let square = 0;
    let paren = 0;
    let lastFilterIndex = 0;
    let c, prev, i, expression, filters;
    for(i = 0; i < exp.length; i++){
        prev = c;
        c = exp.charCodeAt(i);
        if (inSingle) {
            if (c === 39 && prev !== 92) inSingle = false;
        } else if (inDouble) {
            if (c === 34 && prev !== 92) inDouble = false;
        } else if (inTemplateString) {
            if (c === 96 && prev !== 92) inTemplateString = false;
        } else if (inRegex) {
            if (c === 47 && prev !== 92) inRegex = false;
        } else if (c === 124 && exp.charCodeAt(i + 1) !== 124 && exp.charCodeAt(i - 1) !== 124 && !curly && !square && !paren) {
            if (expression === undefined) {
                lastFilterIndex = i + 1;
                expression = exp.slice(0, i).trim();
            } else {
                pushFilter();
            }
        } else {
            switch(c){
                case 34:
                    inDouble = true;
                    break;
                case 39:
                    inSingle = true;
                    break;
                case 96:
                    inTemplateString = true;
                    break;
                case 40:
                    paren++;
                    break;
                case 41:
                    paren--;
                    break;
                case 91:
                    square++;
                    break;
                case 93:
                    square--;
                    break;
                case 123:
                    curly++;
                    break;
                case 125:
                    curly--;
                    break;
            }
            if (c === 47) {
                let j = i - 1;
                let p;
                for(; j >= 0; j--){
                    p = exp.charAt(j);
                    if (p !== ' ') break;
                }
                if (!p || !validDivisionCharRE.test(p)) {
                    inRegex = true;
                }
            }
        }
    }
    if (expression === undefined) {
        expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
        pushFilter();
    }
    function pushFilter() {
        (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
        lastFilterIndex = i + 1;
    }
    if (filters) {
        for(i = 0; i < filters.length; i++){
            expression = wrapFilter(expression, filters[i]);
        }
    }
    return expression;
}
function wrapFilter(exp, filter) {
    const i = filter.indexOf('(');
    if (i < 0) {
        return `_f("${filter}")(${exp})`;
    } else {
        const name = filter.slice(0, i);
        const args = filter.slice(i + 1);
        return `_f("${name}")(${exp}${args !== ')' ? ',' + args : args}`;
    }
}
function baseWarn(msg, range) {
    console.error(`[Vue compiler]: ${msg}`);
}
function pluckModuleFunction(modules, key) {
    return modules ? modules.map((m)=>m[key]
    ).filter((_)=>_
    ) : [];
}
function addProp(el, name, value2, range, dynamic) {
    (el.props || (el.props = [])).push(rangeSetItem({
        name,
        value: value2,
        dynamic
    }, range));
    el.plain = false;
}
function addAttr(el, name, value2, range, dynamic) {
    const attrs1 = dynamic ? el.dynamicAttrs || (el.dynamicAttrs = []) : el.attrs || (el.attrs = []);
    attrs1.push(rangeSetItem({
        name,
        value: value2,
        dynamic
    }, range));
    el.plain = false;
}
function addRawAttr(el, name, value2, range) {
    el.attrsMap[name] = value2;
    el.attrsList.push(rangeSetItem({
        name,
        value: value2
    }, range));
}
function addDirective(el, name, rawName, value2, arg, isDynamicArg, modifiers, range) {
    (el.directives || (el.directives = [])).push(rangeSetItem({
        name,
        rawName,
        value: value2,
        arg,
        isDynamicArg,
        modifiers
    }, range));
    el.plain = false;
}
function prependModifierMarker(symbol, name, dynamic) {
    return dynamic ? `_p(${name},"${symbol}")` : symbol + name;
}
function addHandler(el, name, value2, modifiers, important, warn1, range, dynamic) {
    modifiers = modifiers || emptyObject;
    if (warn1 && modifiers.prevent && modifiers.passive) {
        warn1('passive and prevent can\'t be used together. ' + 'Passive handler can\'t prevent default event.', range);
    }
    if (modifiers.right) {
        if (dynamic) {
            name = `(${name})==='click'?'contextmenu':(${name})`;
        } else if (name === 'click') {
            name = 'contextmenu';
            delete modifiers.right;
        }
    } else if (modifiers.middle) {
        if (dynamic) {
            name = `(${name})==='click'?'mouseup':(${name})`;
        } else if (name === 'click') {
            name = 'mouseup';
        }
    }
    if (modifiers.capture) {
        delete modifiers.capture;
        name = prependModifierMarker('!', name, dynamic);
    }
    if (modifiers.once) {
        delete modifiers.once;
        name = prependModifierMarker('~', name, dynamic);
    }
    if (modifiers.passive) {
        delete modifiers.passive;
        name = prependModifierMarker('&', name, dynamic);
    }
    let events;
    if (modifiers.native) {
        delete modifiers.native;
        events = el.nativeEvents || (el.nativeEvents = {
        });
    } else {
        events = el.events || (el.events = {
        });
    }
    const newHandler = rangeSetItem({
        value: value2.trim(),
        dynamic
    }, range);
    if (modifiers !== emptyObject) {
        newHandler.modifiers = modifiers;
    }
    const handlers = events[name];
    if (Array.isArray(handlers)) {
        important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
        events[name] = important ? [
            newHandler,
            handlers
        ] : [
            handlers,
            newHandler
        ];
    } else {
        events[name] = newHandler;
    }
    el.plain = false;
}
function getRawBindingAttr(el, name) {
    return el.rawAttrsMap[':' + name] || el.rawAttrsMap['v-bind:' + name] || el.rawAttrsMap[name];
}
function getBindingAttr(el, name, getStatic) {
    const dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
    if (dynamicValue != null) {
        return parseFilters(dynamicValue);
    } else if (getStatic !== false) {
        const staticValue = getAndRemoveAttr(el, name);
        if (staticValue != null) {
            return JSON.stringify(staticValue);
        }
    }
}
function getAndRemoveAttr(el, name, removeFromMap) {
    let val;
    if ((val = el.attrsMap[name]) != null) {
        const list = el.attrsList;
        for(let i = 0, l = list.length; i < l; i++){
            if (list[i].name === name) {
                list.splice(i, 1);
                break;
            }
        }
    }
    if (removeFromMap) {
        delete el.attrsMap[name];
    }
    return val;
}
function getAndRemoveAttrByRegex(el, name) {
    const list = el.attrsList;
    for(let i = 0, l = list.length; i < l; i++){
        const attr = list[i];
        if (name.test(attr.name)) {
            list.splice(i, 1);
            return attr;
        }
    }
}
function rangeSetItem(item, range) {
    if (range) {
        if (range.start != null) {
            item.start = range.start;
        }
        if (range.end != null) {
            item.end = range.end;
        }
    }
    return item;
}
function genComponentModel(el, value2, modifiers) {
    const { number , trim  } = modifiers || {
    };
    const baseValueExpression = '$$v';
    let valueExpression = baseValueExpression;
    if (trim) {
        valueExpression = `(typeof ${baseValueExpression} === 'string'` + `? ${baseValueExpression}.trim()` + `: ${baseValueExpression})`;
    }
    if (number) {
        valueExpression = `_n(${valueExpression})`;
    }
    const assignment = genAssignmentCode(value2, valueExpression);
    el.model = {
        value: `(${value2})`,
        expression: JSON.stringify(value2),
        callback: `function (${baseValueExpression}) {${assignment}}`
    };
}
function genAssignmentCode(value2, assignment) {
    const res = parseModel(value2);
    if (res.key === null) {
        return `${value2}=${assignment}`;
    } else {
        return `$set(${res.exp}, ${res.key}, ${assignment})`;
    }
}
let len, str, chr, index$1, expressionPos, expressionEndPos;
function parseModel(val) {
    val = val.trim();
    len = val.length;
    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
        index$1 = val.lastIndexOf('.');
        if (index$1 > -1) {
            return {
                exp: val.slice(0, index$1),
                key: '"' + val.slice(index$1 + 1) + '"'
            };
        } else {
            return {
                exp: val,
                key: null
            };
        }
    }
    str = val;
    index$1 = expressionPos = expressionEndPos = 0;
    while(!eof()){
        chr = next();
        if (isStringStart(chr)) {
            parseString(chr);
        } else if (chr === 91) {
            parseBracket(chr);
        }
    }
    return {
        exp: val.slice(0, expressionPos),
        key: val.slice(expressionPos + 1, expressionEndPos)
    };
}
function next() {
    return str.charCodeAt(++index$1);
}
function eof() {
    return index$1 >= len;
}
function isStringStart(chr1) {
    return chr1 === 34 || chr1 === 39;
}
function parseBracket(chr1) {
    let inBracket = 1;
    expressionPos = index$1;
    while(!eof()){
        chr1 = next();
        if (isStringStart(chr1)) {
            parseString(chr1);
            continue;
        }
        if (chr1 === 91) inBracket++;
        if (chr1 === 93) inBracket--;
        if (inBracket === 0) {
            expressionEndPos = index$1;
            break;
        }
    }
}
function parseString(chr1) {
    const stringQuote = chr1;
    while(!eof()){
        chr1 = next();
        if (chr1 === stringQuote) {
            break;
        }
    }
}
let warn$1;
const RANGE_TOKEN = '__r';
const CHECKBOX_RADIO_TOKEN = '__c';
function model(el, dir, _warn) {
    warn$1 = _warn;
    const value2 = dir.value;
    const modifiers = dir.modifiers;
    const tag1 = el.tag;
    const type = el.attrsMap.type;
    {
        if (tag1 === 'input' && type === 'file') {
            warn$1(`<${el.tag} v-model="${value2}" type="file">:\n` + `File inputs are read only. Use a v-on:change listener instead.`, el.rawAttrsMap['v-model']);
        }
    }
    if (el.component) {
        genComponentModel(el, value2, modifiers);
        return false;
    } else if (tag1 === 'select') {
        genSelect(el, value2, modifiers);
    } else if (tag1 === 'input' && type === 'checkbox') {
        genCheckboxModel(el, value2, modifiers);
    } else if (tag1 === 'input' && type === 'radio') {
        genRadioModel(el, value2, modifiers);
    } else if (tag1 === 'input' || tag1 === 'textarea') {
        genDefaultModel(el, value2, modifiers);
    } else if (!config.isReservedTag(tag1)) {
        genComponentModel(el, value2, modifiers);
        return false;
    } else {
        warn$1(`<${el.tag} v-model="${value2}">: ` + `v-model is not supported on this element type. ` + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.', el.rawAttrsMap['v-model']);
    }
    return true;
}
function genCheckboxModel(el, value2, modifiers) {
    const number = modifiers && modifiers.number;
    const valueBinding = getBindingAttr(el, 'value') || 'null';
    const trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
    const falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
    addProp(el, 'checked', `Array.isArray(${value2})` + `?_i(${value2},${valueBinding})>-1` + (trueValueBinding === 'true' ? `:(${value2})` : `:_q(${value2},${trueValueBinding})`));
    addHandler(el, 'change', `var $$a=${value2},` + '$$el=$event.target,' + `$$c=$$el.checked?(${trueValueBinding}):(${falseValueBinding});` + 'if(Array.isArray($$a)){' + `var $$v=${number ? '_n(' + valueBinding + ')' : valueBinding},` + '$$i=_i($$a,$$v);' + `if($$el.checked){$$i<0&&(${genAssignmentCode(value2, '$$a.concat([$$v])')})}` + `else{$$i>-1&&(${genAssignmentCode(value2, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')})}` + `}else{${genAssignmentCode(value2, '$$c')}}`, null, true);
}
function genRadioModel(el, value2, modifiers) {
    const number = modifiers && modifiers.number;
    let valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? `_n(${valueBinding})` : valueBinding;
    addProp(el, 'checked', `_q(${value2},${valueBinding})`);
    addHandler(el, 'change', genAssignmentCode(value2, valueBinding), null, true);
}
function genSelect(el, value2, modifiers) {
    const number = modifiers && modifiers.number;
    const selectedVal = `Array.prototype.filter` + `.call($event.target.options,function(o){return o.selected})` + `.map(function(o){var val = "_value" in o ? o._value : o.value;` + `return ${number ? '_n(val)' : 'val'}})`;
    const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    let code = `var $$selectedVal = ${selectedVal};`;
    code = `${code} ${genAssignmentCode(value2, assignment)}`;
    addHandler(el, 'change', code, null, true);
}
function genDefaultModel(el, value2, modifiers) {
    const type = el.attrsMap.type;
    {
        const value3 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
        const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
        if (value3 && !typeBinding) {
            const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
            warn$1(`${binding}="${value3}" conflicts with v-model on the same element ` + 'because the latter already expands to a value binding internally', el.rawAttrsMap[binding]);
        }
    }
    const { lazy , number , trim  } = modifiers || {
    };
    const needCompositionGuard = !lazy && type !== 'range';
    const event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';
    let valueExpression = '$event.target.value';
    if (trim) {
        valueExpression = `$event.target.value.trim()`;
    }
    if (number) {
        valueExpression = `_n(${valueExpression})`;
    }
    let code = genAssignmentCode(value2, valueExpression);
    if (needCompositionGuard) {
        code = `if($event.target.composing)return;${code}`;
    }
    addProp(el, 'value', `(${value2})`);
    addHandler(el, event, code, null, true);
    if (trim || number) {
        addHandler(el, 'blur', '$forceUpdate()');
    }
}
function normalizeEvents(on) {
    if (isDef(on[RANGE_TOKEN])) {
        const event = isIE ? 'change' : 'input';
        on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
        delete on[RANGE_TOKEN];
    }
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
        on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
        delete on[CHECKBOX_RADIO_TOKEN];
    }
}
let target$1;
function createOnceHandler$1(event, handler, capture) {
    const _target = target$1;
    return function onceHandler() {
        const res = handler.apply(null, arguments);
        if (res !== null) {
            remove$2(event, onceHandler, capture, _target);
        }
    };
}
const useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
function add$1(name, handler, capture, passive) {
    if (useMicrotaskFix) {
        const attachedTimestamp = currentFlushTimestamp;
        const original = handler;
        handler = original._wrapper = function(e) {
            if (e.target === e.currentTarget || e.timeStamp >= attachedTimestamp || e.timeStamp <= 0 || e.target.ownerDocument !== document) {
                return original.apply(this, arguments);
            }
        };
    }
    target$1.addEventListener(name, handler, supportsPassive ? {
        capture,
        passive
    } : capture);
}
function remove$2(name, handler, capture, _target) {
    (_target || target$1).removeEventListener(name, handler._wrapper || handler, capture);
}
function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return;
    }
    const on = vnode.data.on || {
    };
    const oldOn = oldVnode.data.on || {
    };
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
}
var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
};
let svgContainer;
function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
        return;
    }
    let key, cur;
    const elm1 = vnode.elm;
    const oldProps = oldVnode.data.domProps || {
    };
    let props = vnode.data.domProps || {
    };
    if (isDef(props.__ob__)) {
        props = vnode.data.domProps = extend({
        }, props);
    }
    for(key in oldProps){
        if (!(key in props)) {
            elm1[key] = '';
        }
    }
    for(key in props){
        cur = props[key];
        if (key === 'textContent' || key === 'innerHTML') {
            if (vnode.children) vnode.children.length = 0;
            if (cur === oldProps[key]) continue;
            if (elm1.childNodes.length === 1) {
                elm1.removeChild(elm1.childNodes[0]);
            }
        }
        if (key === 'value' && elm1.tagName !== 'PROGRESS') {
            elm1._value = cur;
            const strCur = isUndef(cur) ? '' : String(cur);
            if (shouldUpdateValue(elm1, strCur)) {
                elm1.value = strCur;
            }
        } else if (key === 'innerHTML' && isSVG(elm1.tagName) && isUndef(elm1.innerHTML)) {
            svgContainer = svgContainer || document.createElement('div');
            svgContainer.innerHTML = `<svg>${cur}</svg>`;
            const svg = svgContainer.firstChild;
            while(elm1.firstChild){
                elm1.removeChild(elm1.firstChild);
            }
            while(svg.firstChild){
                elm1.appendChild(svg.firstChild);
            }
        } else if (cur !== oldProps[key]) {
            try {
                elm1[key] = cur;
            } catch (e) {
            }
        }
    }
}
function shouldUpdateValue(elm1, checkVal) {
    return !elm1.composing && (elm1.tagName === 'OPTION' || isNotInFocusAndDirty(elm1, checkVal) || isDirtyWithModifiers(elm1, checkVal));
}
function isNotInFocusAndDirty(elm1, checkVal) {
    let notInFocus = true;
    try {
        notInFocus = document.activeElement !== elm1;
    } catch (e) {
    }
    return notInFocus && elm1.value !== checkVal;
}
function isDirtyWithModifiers(elm1, newVal) {
    const value2 = elm1.value;
    const modifiers = elm1._vModifiers;
    if (isDef(modifiers)) {
        if (modifiers.number) {
            return toNumber(value2) !== toNumber(newVal);
        }
        if (modifiers.trim) {
            return value2.trim() !== newVal.trim();
        }
    }
    return value2 !== newVal;
}
var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
};
const parseStyleText = cached(function(cssText) {
    const res = {
    };
    const listDelimiter = /;(?![^(]*\))/g;
    const propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function(item) {
        if (item) {
            const tmp = item.split(propertyDelimiter);
            tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return res;
});
function normalizeStyleData(data1) {
    const style = normalizeStyleBinding(data1.style);
    return data1.staticStyle ? extend(data1.staticStyle, style) : style;
}
function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) {
        return toObject(bindingStyle);
    }
    if (typeof bindingStyle === 'string') {
        return parseStyleText(bindingStyle);
    }
    return bindingStyle;
}
function getStyle(vnode, checkChild) {
    const res = {
    };
    let styleData;
    if (checkChild) {
        let childNode = vnode;
        while(childNode.componentInstance){
            childNode = childNode.componentInstance._vnode;
            if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
                extend(res, styleData);
            }
        }
    }
    if (styleData = normalizeStyleData(vnode.data)) {
        extend(res, styleData);
    }
    let parentNode1 = vnode;
    while(parentNode1 = parentNode1.parent){
        if (parentNode1.data && (styleData = normalizeStyleData(parentNode1.data))) {
            extend(res, styleData);
        }
    }
    return res;
}
const cssVarRE = /^--/;
const importantRE = /\s*!important$/;
const setProp = (el, name, val)=>{
    if (cssVarRE.test(name)) {
        el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
        el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
        const normalizedName = normalize(name);
        if (Array.isArray(val)) {
            for(let i = 0, len1 = val.length; i < len1; i++){
                el.style[normalizedName] = val[i];
            }
        } else {
            el.style[normalizedName] = val;
        }
    }
};
const vendorNames = [
    'Webkit',
    'Moz',
    'ms'
];
let emptyStyle;
const normalize = cached(function(prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && prop in emptyStyle) {
        return prop;
    }
    const capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(let i = 0; i < vendorNames.length; i++){
        const name = vendorNames[i] + capName;
        if (name in emptyStyle) {
            return name;
        }
    }
});
function updateStyle(oldVnode, vnode) {
    const data1 = vnode.data;
    const oldData = oldVnode.data;
    if (isUndef(data1.staticStyle) && isUndef(data1.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
        return;
    }
    let cur, name;
    const el = vnode.elm;
    const oldStaticStyle = oldData.staticStyle;
    const oldStyleBinding = oldData.normalizedStyle || oldData.style || {
    };
    const oldStyle = oldStaticStyle || oldStyleBinding;
    const style = normalizeStyleBinding(vnode.data.style) || {
    };
    vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({
    }, style) : style;
    const newStyle = getStyle(vnode, true);
    for(name in oldStyle){
        if (isUndef(newStyle[name])) {
            setProp(el, name, '');
        }
    }
    for(name in newStyle){
        cur = newStyle[name];
        if (cur !== oldStyle[name]) {
            setProp(el, name, cur == null ? '' : cur);
        }
    }
}
var style = {
    create: updateStyle,
    update: updateStyle
};
const whitespaceRE = /\s+/;
function addClass(el, cls) {
    if (!cls || !(cls = cls.trim())) {
        return;
    }
    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(whitespaceRE).forEach((c)=>el.classList.add(c)
            );
        } else {
            el.classList.add(cls);
        }
    } else {
        const cur = ` ${el.getAttribute('class') || ''} `;
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            el.setAttribute('class', (cur + cls).trim());
        }
    }
}
function removeClass(el, cls) {
    if (!cls || !(cls = cls.trim())) {
        return;
    }
    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(whitespaceRE).forEach((c)=>el.classList.remove(c)
            );
        } else {
            el.classList.remove(cls);
        }
        if (!el.classList.length) {
            el.removeAttribute('class');
        }
    } else {
        let cur = ` ${el.getAttribute('class') || ''} `;
        const tar = ' ' + cls + ' ';
        while(cur.indexOf(tar) >= 0){
            cur = cur.replace(tar, ' ');
        }
        cur = cur.trim();
        if (cur) {
            el.setAttribute('class', cur);
        } else {
            el.removeAttribute('class');
        }
    }
}
function resolveTransition(def$$1) {
    if (!def$$1) {
        return;
    }
    if (typeof def$$1 === 'object') {
        const res = {
        };
        if (def$$1.css !== false) {
            extend(res, autoCssTransition(def$$1.name || 'v'));
        }
        extend(res, def$$1);
        return res;
    } else if (typeof def$$1 === 'string') {
        return autoCssTransition(def$$1);
    }
}
const autoCssTransition = cached((name)=>{
    return {
        enterClass: `${name}-enter`,
        enterToClass: `${name}-enter-to`,
        enterActiveClass: `${name}-enter-active`,
        leaveClass: `${name}-leave`,
        leaveToClass: `${name}-leave-to`,
        leaveActiveClass: `${name}-leave-active`
    };
});
const hasTransition = inBrowser && !isIE9;
const TRANSITION = 'transition';
const ANIMATION = 'animation';
let transitionProp = 'transition';
let transitionEndEvent = 'transitionend';
let animationProp = 'animation';
let animationEndEvent = 'animationend';
if (hasTransition) {
    if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        transitionProp = 'WebkitTransition';
        transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        animationProp = 'WebkitAnimation';
        animationEndEvent = 'webkitAnimationEnd';
    }
}
const raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : (fn)=>fn()
;
function nextFrame(fn) {
    raf(()=>{
        raf(fn);
    });
}
function addTransitionClass(el, cls) {
    const transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
        transitionClasses.push(cls);
        addClass(el, cls);
    }
}
function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
        remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
}
function whenTransitionEnds(el, expectedType, cb1) {
    const { type , timeout , propCount  } = getTransitionInfo(el, expectedType);
    if (!type) return cb1();
    const event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    let ended = 0;
    const end = ()=>{
        el.removeEventListener(event, onEnd);
        cb1();
    };
    const onEnd = (e)=>{
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
        }
    };
    setTimeout(()=>{
        if (ended < propCount) {
            end();
        }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
}
const transformRE = /\b(transform|all)(,|$)/;
function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    const transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    const animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    } else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    } else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
        propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
    return {
        type,
        timeout,
        propCount,
        hasTransform
    };
}
function getTimeout(delays, durations) {
    while(delays.length < durations.length){
        delays = delays.concat(delays);
    }
    return Math.max.apply(null, durations.map((d, i)=>{
        return toMs(d) + toMs(delays[i]);
    }));
}
function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}
function enter(vnode, toggleDisplay) {
    const el = vnode.elm;
    if (isDef(el._leaveCb)) {
        el._leaveCb.cancelled = true;
        el._leaveCb();
    }
    const data1 = resolveTransition(vnode.data.transition);
    if (isUndef(data1)) {
        return;
    }
    if (isDef(el._enterCb) || el.nodeType !== 1) {
        return;
    }
    const { css , type , enterClass , enterToClass , enterActiveClass , appearClass , appearToClass , appearActiveClass , beforeEnter , enter: enter1 , afterEnter , enterCancelled , beforeAppear , appear , afterAppear , appearCancelled , duration  } = data1;
    let context1 = activeInstance;
    let transitionNode = activeInstance.$vnode;
    while(transitionNode && transitionNode.parent){
        context1 = transitionNode.context;
        transitionNode = transitionNode.parent;
    }
    const isAppear = !context1._isMounted || !vnode.isRootInsert;
    if (isAppear && !appear && appear !== '') {
        return;
    }
    const startClass = isAppear && appearClass ? appearClass : enterClass;
    const activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
    const toClass = isAppear && appearToClass ? appearToClass : enterToClass;
    const beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    const enterHook = isAppear ? typeof appear === 'function' ? appear : enter1 : enter1;
    const afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    const enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;
    const explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);
    if (explicitEnterDuration != null) {
        checkDuration(explicitEnterDuration, 'enter', vnode);
    }
    const expectsCSS = css !== false && !isIE9;
    const userWantsControl = getHookArgumentsLength(enterHook);
    const cb1 = el._enterCb = once1(()=>{
        if (expectsCSS) {
            removeTransitionClass(el, toClass);
            removeTransitionClass(el, activeClass);
        }
        if (cb1.cancelled) {
            if (expectsCSS) {
                removeTransitionClass(el, startClass);
            }
            enterCancelledHook && enterCancelledHook(el);
        } else {
            afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
    });
    if (!vnode.data.show) {
        mergeVNodeHook(vnode, 'insert', ()=>{
            const parent = el.parentNode;
            const pendingNode = parent && parent._pending && parent._pending[vnode.key];
            if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
                pendingNode.elm._leaveCb();
            }
            enterHook && enterHook(el, cb1);
        });
    }
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
        addTransitionClass(el, startClass);
        addTransitionClass(el, activeClass);
        nextFrame(()=>{
            removeTransitionClass(el, startClass);
            if (!cb1.cancelled) {
                addTransitionClass(el, toClass);
                if (!userWantsControl) {
                    if (isValidDuration(explicitEnterDuration)) {
                        setTimeout(cb1, explicitEnterDuration);
                    } else {
                        whenTransitionEnds(el, type, cb1);
                    }
                }
            }
        });
    }
    if (vnode.data.show) {
        toggleDisplay && toggleDisplay();
        enterHook && enterHook(el, cb1);
    }
    if (!expectsCSS && !userWantsControl) {
        cb1();
    }
}
function leave(vnode, rm) {
    const el = vnode.elm;
    if (isDef(el._enterCb)) {
        el._enterCb.cancelled = true;
        el._enterCb();
    }
    const data1 = resolveTransition(vnode.data.transition);
    if (isUndef(data1) || el.nodeType !== 1) {
        return rm();
    }
    if (isDef(el._leaveCb)) {
        return;
    }
    const { css , type , leaveClass , leaveToClass , leaveActiveClass , beforeLeave , leave: leave1 , afterLeave , leaveCancelled , delayLeave , duration  } = data1;
    const expectsCSS = css !== false && !isIE9;
    const userWantsControl = getHookArgumentsLength(leave1);
    const explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);
    if (isDef(explicitLeaveDuration)) {
        checkDuration(explicitLeaveDuration, 'leave', vnode);
    }
    const cb1 = el._leaveCb = once1(()=>{
        if (el.parentNode && el.parentNode._pending) {
            el.parentNode._pending[vnode.key] = null;
        }
        if (expectsCSS) {
            removeTransitionClass(el, leaveToClass);
            removeTransitionClass(el, leaveActiveClass);
        }
        if (cb1.cancelled) {
            if (expectsCSS) {
                removeTransitionClass(el, leaveClass);
            }
            leaveCancelled && leaveCancelled(el);
        } else {
            rm();
            afterLeave && afterLeave(el);
        }
        el._leaveCb = null;
    });
    if (delayLeave) {
        delayLeave(performLeave);
    } else {
        performLeave();
    }
    function performLeave() {
        if (cb1.cancelled) {
            return;
        }
        if (!vnode.data.show && el.parentNode) {
            (el.parentNode._pending || (el.parentNode._pending = {
            }))[vnode.key] = vnode;
        }
        beforeLeave && beforeLeave(el);
        if (expectsCSS) {
            addTransitionClass(el, leaveClass);
            addTransitionClass(el, leaveActiveClass);
            nextFrame(()=>{
                removeTransitionClass(el, leaveClass);
                if (!cb1.cancelled) {
                    addTransitionClass(el, leaveToClass);
                    if (!userWantsControl) {
                        if (isValidDuration(explicitLeaveDuration)) {
                            setTimeout(cb1, explicitLeaveDuration);
                        } else {
                            whenTransitionEnds(el, type, cb1);
                        }
                    }
                }
            });
        }
        leave1 && leave1(el, cb1);
        if (!expectsCSS && !userWantsControl) {
            cb1();
        }
    }
}
function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
        warn(`<transition> explicit ${name} duration is not a valid number - ` + `got ${JSON.stringify(val)}.`, vnode.context);
    } else if (isNaN(val)) {
        warn(`<transition> explicit ${name} duration is NaN - ` + 'the duration expression might be incorrect.', vnode.context);
    }
}
function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val);
}
function getHookArgumentsLength(fn) {
    if (isUndef(fn)) {
        return false;
    }
    const invokerFns = fn.fns;
    if (isDef(invokerFns)) {
        return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
    } else {
        return (fn._length || fn.length) > 1;
    }
}
function _enter(_, vnode) {
    if (vnode.data.show !== true) {
        enter(vnode);
    }
}
var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove (vnode, rm) {
        if (vnode.data.show !== true) {
            leave(vnode, rm);
        } else {
            rm();
        }
    }
} : {
};
var platformModules = [
    attrs1,
    klass,
    events,
    domProps,
    style,
    transition
];
const modules = platformModules.concat(baseModules);
const patch = createPatchFunction({
    nodeOps,
    modules
});
if (isIE9) {
    document.addEventListener('selectionchange', ()=>{
        const el = document.activeElement;
        if (el && el.vmodel) {
            trigger(el, 'input');
        }
    });
}
const directive = {
    inserted (el, binding, vnode, oldVnode) {
        if (vnode.tag === 'select') {
            if (oldVnode.elm && !oldVnode.elm._vOptions) {
                mergeVNodeHook(vnode, 'postpatch', ()=>{
                    directive.componentUpdated(el, binding, vnode);
                });
            } else {
                setSelected(el, binding, vnode.context);
            }
            el._vOptions = [].map.call(el.options, getValue);
        } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
            el._vModifiers = binding.modifiers;
            if (!binding.modifiers.lazy) {
                el.addEventListener('compositionstart', onCompositionStart);
                el.addEventListener('compositionend', onCompositionEnd);
                el.addEventListener('change', onCompositionEnd);
                if (isIE9) {
                    el.vmodel = true;
                }
            }
        }
    },
    componentUpdated (el, binding, vnode) {
        if (vnode.tag === 'select') {
            setSelected(el, binding, vnode.context);
            const prevOptions = el._vOptions;
            const curOptions = el._vOptions = [].map.call(el.options, getValue);
            if (curOptions.some((o, i)=>!looseEqual(o, prevOptions[i])
            )) {
                const needReset = el.multiple ? binding.value.some((v)=>hasNoMatchingOption(v, curOptions)
                ) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
                if (needReset) {
                    trigger(el, 'change');
                }
            }
        }
    }
};
function setSelected(el, binding, vm1) {
    actuallySetSelected(el, binding, vm1);
    if (isIE || isEdge) {
        setTimeout(()=>{
            actuallySetSelected(el, binding, vm1);
        }, 0);
    }
}
function actuallySetSelected(el, binding, vm1) {
    const value2 = binding.value;
    const isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value2)) {
        warn(`<select multiple v-model="${binding.expression}"> ` + `expects an Array value for its binding, but got ${Object.prototype.toString.call(value2).slice(8, -1)}`, vm1);
        return;
    }
    let selected, option;
    for(let i = 0, l = el.options.length; i < l; i++){
        option = el.options[i];
        if (isMultiple) {
            selected = looseIndexOf(value2, getValue(option)) > -1;
            if (option.selected !== selected) {
                option.selected = selected;
            }
        } else {
            if (looseEqual(getValue(option), value2)) {
                if (el.selectedIndex !== i) {
                    el.selectedIndex = i;
                }
                return;
            }
        }
    }
    if (!isMultiple) {
        el.selectedIndex = -1;
    }
}
function hasNoMatchingOption(value2, options1) {
    return options1.every((o)=>!looseEqual(o, value2)
    );
}
function getValue(option) {
    return '_value' in option ? option._value : option.value;
}
function onCompositionStart(e) {
    e.target.composing = true;
}
function onCompositionEnd(e) {
    if (!e.target.composing) return;
    e.target.composing = false;
    trigger(e.target, 'input');
}
function trigger(el, type) {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
}
function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
}
var show = {
    bind (el, { value  }, vnode) {
        vnode = locateNode(vnode);
        const transition$$1 = vnode.data && vnode.data.transition;
        const originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
        if (value && transition$$1) {
            vnode.data.show = true;
            enter(vnode, ()=>{
                el.style.display = originalDisplay;
            });
        } else {
            el.style.display = value ? originalDisplay : 'none';
        }
    },
    update (el, { value , oldValue  }, vnode) {
        if (!value === !oldValue) return;
        vnode = locateNode(vnode);
        const transition$$1 = vnode.data && vnode.data.transition;
        if (transition$$1) {
            vnode.data.show = true;
            if (value) {
                enter(vnode, ()=>{
                    el.style.display = el.__vOriginalDisplay;
                });
            } else {
                leave(vnode, ()=>{
                    el.style.display = 'none';
                });
            }
        } else {
            el.style.display = value ? el.__vOriginalDisplay : 'none';
        }
    },
    unbind (el, binding, vnode, oldVnode, isDestroy) {
        if (!isDestroy) {
            el.style.display = el.__vOriginalDisplay;
        }
    }
};
var platformDirectives = {
    model: directive,
    show
};
const transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [
        Number,
        String,
        Object
    ]
};
function getRealChild(vnode) {
    const compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children));
    } else {
        return vnode;
    }
}
function extractTransitionData(comp) {
    const data1 = {
    };
    const options1 = comp.$options;
    for(const key in options1.propsData){
        data1[key] = comp[key];
    }
    const listeners = options1._parentListeners;
    for(const key1 in listeners){
        data1[camelize(key1)] = listeners[key1];
    }
    return data1;
}
function placeholder(h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
        return h('keep-alive', {
            props: rawChild.componentOptions.propsData
        });
    }
}
function hasParentTransition(vnode) {
    while(vnode = vnode.parent){
        if (vnode.data.transition) {
            return true;
        }
    }
}
function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag;
}
const isNotTextNode = (c)=>c.tag || isAsyncPlaceholder(c)
;
const isVShowDirective = (d)=>d.name === 'show'
;
var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render (h) {
        let children1 = this.$slots.default;
        if (!children1) {
            return;
        }
        children1 = children1.filter(isNotTextNode);
        if (!children1.length) {
            return;
        }
        if (children1.length > 1) {
            warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
        }
        const mode = this.mode;
        if (mode && mode !== 'in-out' && mode !== 'out-in') {
            warn('invalid <transition> mode: ' + mode, this.$parent);
        }
        const rawChild = children1[0];
        if (hasParentTransition(this.$vnode)) {
            return rawChild;
        }
        const child = getRealChild(rawChild);
        if (!child) {
            return rawChild;
        }
        if (this._leaving) {
            return placeholder(h, rawChild);
        }
        const id = `__transition-${this._uid}-`;
        child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;
        const data1 = (child.data || (child.data = {
        })).transition = extractTransitionData(this);
        const oldRawChild = this._vnode;
        const oldChild = getRealChild(oldRawChild);
        if (child.data.directives && child.data.directives.some(isVShowDirective)) {
            child.data.show = true;
        }
        if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) && !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
            const oldData = oldChild.data.transition = extend({
            }, data1);
            if (mode === 'out-in') {
                this._leaving = true;
                mergeVNodeHook(oldData, 'afterLeave', ()=>{
                    this._leaving = false;
                    this.$forceUpdate();
                });
                return placeholder(h, rawChild);
            } else if (mode === 'in-out') {
                if (isAsyncPlaceholder(child)) {
                    return oldRawChild;
                }
                let delayedLeave;
                const performLeave = ()=>{
                    delayedLeave();
                };
                mergeVNodeHook(data1, 'afterEnter', performLeave);
                mergeVNodeHook(data1, 'enterCancelled', performLeave);
                mergeVNodeHook(oldData, 'delayLeave', (leave1)=>{
                    delayedLeave = leave1;
                });
            }
        }
        return rawChild;
    }
};
const props1 = extend({
    tag: String,
    moveClass: String
}, transitionProps);
delete props1.mode;
var TransitionGroup = {
    props: props1,
    beforeMount () {
        const update = this._update;
        this._update = (vnode, hydrating)=>{
            const restoreActiveInstance = setActiveInstance(this);
            this.__patch__(this._vnode, this.kept, false, true);
            this._vnode = this.kept;
            restoreActiveInstance();
            update.call(this, vnode, hydrating);
        };
    },
    render (h) {
        const tag1 = this.tag || this.$vnode.data.tag || 'span';
        const map = Object.create(null);
        const prevChildren = this.prevChildren = this.children;
        const rawChildren = this.$slots.default || [];
        const children1 = this.children = [];
        const transitionData = extractTransitionData(this);
        for(let i = 0; i < rawChildren.length; i++){
            const c = rawChildren[i];
            if (c.tag) {
                if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                    children1.push(c);
                    map[c.key] = c;
                    (c.data || (c.data = {
                    })).transition = transitionData;
                } else {
                    const opts = c.componentOptions;
                    const name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
                    warn(`<transition-group> children must be keyed: <${name}>`);
                }
            }
        }
        if (prevChildren) {
            const kept = [];
            const removed = [];
            for(let i1 = 0; i1 < prevChildren.length; i1++){
                const c = prevChildren[i1];
                c.data.transition = transitionData;
                c.data.pos = c.elm.getBoundingClientRect();
                if (map[c.key]) {
                    kept.push(c);
                } else {
                    removed.push(c);
                }
            }
            this.kept = h(tag1, null, kept);
            this.removed = removed;
        }
        return h(tag1, null, children1);
    },
    updated () {
        const children1 = this.prevChildren;
        const moveClass = this.moveClass || (this.name || 'v') + '-move';
        if (!children1.length || !this.hasMove(children1[0].elm, moveClass)) {
            return;
        }
        children1.forEach(callPendingCbs);
        children1.forEach(recordPosition);
        children1.forEach(applyTranslation);
        this._reflow = document.body.offsetHeight;
        children1.forEach((c)=>{
            if (c.data.moved) {
                const el = c.elm;
                const s = el.style;
                addTransitionClass(el, moveClass);
                s.transform = s.WebkitTransform = s.transitionDuration = '';
                el.addEventListener(transitionEndEvent, el._moveCb = function cb1(e) {
                    if (e && e.target !== el) {
                        return;
                    }
                    if (!e || /transform$/.test(e.propertyName)) {
                        el.removeEventListener(transitionEndEvent, cb1);
                        el._moveCb = null;
                        removeTransitionClass(el, moveClass);
                    }
                });
            }
        });
    },
    methods: {
        hasMove (el, moveClass) {
            if (!hasTransition) {
                return false;
            }
            if (this._hasMove) {
                return this._hasMove;
            }
            const clone = el.cloneNode();
            if (el._transitionClasses) {
                el._transitionClasses.forEach((cls)=>{
                    removeClass(clone, cls);
                });
            }
            addClass(clone, moveClass);
            clone.style.display = 'none';
            this.$el.appendChild(clone);
            const info = getTransitionInfo(clone);
            this.$el.removeChild(clone);
            return this._hasMove = info.hasTransform;
        }
    }
};
function callPendingCbs(c) {
    if (c.elm._moveCb) {
        c.elm._moveCb();
    }
    if (c.elm._enterCb) {
        c.elm._enterCb();
    }
}
function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
}
function applyTranslation(c) {
    const oldPos = c.data.pos;
    const newPos = c.data.newPos;
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
        c.data.moved = true;
        const s = c.elm.style;
        s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`;
        s.transitionDuration = '0s';
    }
}
var platformComponents = {
    Transition,
    TransitionGroup
};
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);
Vue.prototype.__patch__ = inBrowser ? patch : noop;
Vue.prototype.$mount = function(el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
};
if (inBrowser) {
    setTimeout(()=>{
        if (config.devtools) {
            if (devtools) {
                devtools.emit('init', Vue);
            } else {
                console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
            }
        }
        if (config.productionTip !== false && typeof console !== 'undefined') {
            console[console.info ? 'info' : 'log'](`You are running Vue in development mode.\n` + `Make sure to turn on production mode when deploying for production.\n` + `See more tips at https://vuejs.org/guide/deployment.html`);
        }
    }, 0);
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
const buildRegex = cached((delimiters)=>{
    const open = delimiters[0].replace(regexEscapeRE, '\\$&');
    const close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
});
function parseText(text1, delimiters) {
    const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text1)) {
        return;
    }
    const tokens = [];
    const rawTokens = [];
    let lastIndex = tagRE.lastIndex = 0;
    let match, index1, tokenValue;
    while(match = tagRE.exec(text1)){
        index1 = match.index;
        if (index1 > lastIndex) {
            rawTokens.push(tokenValue = text1.slice(lastIndex, index1));
            tokens.push(JSON.stringify(tokenValue));
        }
        const exp = parseFilters(match[1].trim());
        tokens.push(`_s(${exp})`);
        rawTokens.push({
            '@binding': exp
        });
        lastIndex = index1 + match[0].length;
    }
    if (lastIndex < text1.length) {
        rawTokens.push(tokenValue = text1.slice(lastIndex));
        tokens.push(JSON.stringify(tokenValue));
    }
    return {
        expression: tokens.join('+'),
        tokens: rawTokens
    };
}
function transformNode(el, options1) {
    const warn1 = options1.warn || baseWarn;
    const staticClass = getAndRemoveAttr(el, 'class');
    if (staticClass) {
        const res = parseText(staticClass, options1.delimiters);
        if (res) {
            warn1(`class="${staticClass}": ` + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.', el.rawAttrsMap['class']);
        }
    }
    if (staticClass) {
        el.staticClass = JSON.stringify(staticClass);
    }
    const classBinding = getBindingAttr(el, 'class', false);
    if (classBinding) {
        el.classBinding = classBinding;
    }
}
function genData(el) {
    let data1 = '';
    if (el.staticClass) {
        data1 += `staticClass:${el.staticClass},`;
    }
    if (el.classBinding) {
        data1 += `class:${el.classBinding},`;
    }
    return data1;
}
var klass$1 = {
    staticKeys: [
        'staticClass'
    ],
    transformNode,
    genData
};
function transformNode$1(el, options1) {
    const warn1 = options1.warn || baseWarn;
    const staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
        {
            const res = parseText(staticStyle, options1.delimiters);
            if (res) {
                warn1(`style="${staticStyle}": ` + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.', el.rawAttrsMap['style']);
            }
        }
        el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }
    const styleBinding = getBindingAttr(el, 'style', false);
    if (styleBinding) {
        el.styleBinding = styleBinding;
    }
}
function genData$1(el) {
    let data1 = '';
    if (el.staticStyle) {
        data1 += `staticStyle:${el.staticStyle},`;
    }
    if (el.styleBinding) {
        data1 += `style:(${el.styleBinding}),`;
    }
    return data1;
}
var style$1 = {
    staticKeys: [
        'staticStyle'
    ],
    transformNode: transformNode$1,
    genData: genData$1
};
let decoder;
var he = {
    decode (html) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = html;
        return decoder.textContent;
    }
};
const isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr');
const canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');
const isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;
const isPlainTextElement = makeMap('script,style,textarea', true);
const reCache = {
};
const decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
};
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;
const isIgnoreNewlineTag = makeMap('pre,textarea', true);
const shouldIgnoreFirstNewline = (tag1, html)=>tag1 && isIgnoreNewlineTag(tag1) && html[0] === '\n'
;
function decodeAttr(value2, shouldDecodeNewlines) {
    const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value2.replace(re, (match)=>decodingMap[match]
    );
}
function parseHTML(html, options1) {
    const stack = [];
    const expectHTML = options1.expectHTML;
    const isUnaryTag$$1 = options1.isUnaryTag || no;
    const canBeLeftOpenTag$$1 = options1.canBeLeftOpenTag || no;
    let index1 = 0;
    let last, lastTag;
    while(html){
        last = html;
        if (!lastTag || !isPlainTextElement(lastTag)) {
            let textEnd = html.indexOf('<');
            if (textEnd === 0) {
                if (comment.test(html)) {
                    const commentEnd = html.indexOf('-->');
                    if (commentEnd >= 0) {
                        if (options1.shouldKeepComment) {
                            options1.comment(html.substring(4, commentEnd), index1, index1 + commentEnd + 3);
                        }
                        advance(commentEnd + 3);
                        continue;
                    }
                }
                if (conditionalComment.test(html)) {
                    const conditionalEnd = html.indexOf(']>');
                    if (conditionalEnd >= 0) {
                        advance(conditionalEnd + 2);
                        continue;
                    }
                }
                const doctypeMatch = html.match(doctype);
                if (doctypeMatch) {
                    advance(doctypeMatch[0].length);
                    continue;
                }
                const endTagMatch = html.match(endTag);
                if (endTagMatch) {
                    const curIndex = index1;
                    advance(endTagMatch[0].length);
                    parseEndTag(endTagMatch[1], curIndex, index1);
                    continue;
                }
                const startTagMatch = parseStartTag();
                if (startTagMatch) {
                    handleStartTag(startTagMatch);
                    if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                        advance(1);
                    }
                    continue;
                }
            }
            let text1, rest, next1;
            if (textEnd >= 0) {
                rest = html.slice(textEnd);
                while(!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)){
                    next1 = rest.indexOf('<', 1);
                    if (next1 < 0) break;
                    textEnd += next1;
                    rest = html.slice(textEnd);
                }
                text1 = html.substring(0, textEnd);
            }
            if (textEnd < 0) {
                text1 = html;
            }
            if (text1) {
                advance(text1.length);
            }
            if (options1.chars && text1) {
                options1.chars(text1, index1 - text1.length, index1);
            }
        } else {
            let endTagLength = 0;
            const stackedTag = lastTag.toLowerCase();
            const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
            const rest = html.replace(reStackedTag, function(all, text1, endTag1) {
                endTagLength = endTag1.length;
                if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                    text1 = text1.replace(/<!\--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                }
                if (shouldIgnoreFirstNewline(stackedTag, text1)) {
                    text1 = text1.slice(1);
                }
                if (options1.chars) {
                    options1.chars(text1);
                }
                return '';
            });
            index1 += html.length - rest.length;
            html = rest;
            parseEndTag(stackedTag, index1 - endTagLength, index1);
        }
        if (html === last) {
            options1.chars && options1.chars(html);
            if (!stack.length && options1.warn) {
                options1.warn(`Mal-formatted tag at end of template: "${html}"`, {
                    start: index1 + html.length
                });
            }
            break;
        }
    }
    parseEndTag();
    function advance(n) {
        index1 += n;
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index1
            };
            advance(start[0].length);
            let end, attr;
            while(!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))){
                attr.start = index1;
                advance(attr[0].length);
                attr.end = index1;
                match.attrs.push(attr);
            }
            if (end) {
                match.unarySlash = end[1];
                advance(end[0].length);
                match.end = index1;
                return match;
            }
        }
    }
    function handleStartTag(match) {
        const tagName1 = match.tagName;
        const unarySlash = match.unarySlash;
        if (expectHTML) {
            if (lastTag === 'p' && isNonPhrasingTag(tagName1)) {
                parseEndTag(lastTag);
            }
            if (canBeLeftOpenTag$$1(tagName1) && lastTag === tagName1) {
                parseEndTag(tagName1);
            }
        }
        const unary = isUnaryTag$$1(tagName1) || !!unarySlash;
        const l = match.attrs.length;
        const attrs1 = new Array(l);
        for(let i = 0; i < l; i++){
            const args = match.attrs[i];
            const value2 = args[3] || args[4] || args[5] || '';
            const shouldDecodeNewlines = tagName1 === 'a' && args[1] === 'href' ? options1.shouldDecodeNewlinesForHref : options1.shouldDecodeNewlines;
            attrs1[i] = {
                name: args[1],
                value: decodeAttr(value2, shouldDecodeNewlines)
            };
            if (options1.outputSourceRange) {
                attrs1[i].start = args.start + args[0].match(/^\s*/).length;
                attrs1[i].end = args.end;
            }
        }
        if (!unary) {
            stack.push({
                tag: tagName1,
                lowerCasedTag: tagName1.toLowerCase(),
                attrs: attrs1,
                start: match.start,
                end: match.end
            });
            lastTag = tagName1;
        }
        if (options1.start) {
            options1.start(tagName1, attrs1, unary, match.start, match.end);
        }
    }
    function parseEndTag(tagName1, start, end) {
        let pos, lowerCasedTagName;
        if (start == null) start = index1;
        if (end == null) end = index1;
        if (tagName1) {
            lowerCasedTagName = tagName1.toLowerCase();
            for(pos = stack.length - 1; pos >= 0; pos--){
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break;
                }
            }
        } else {
            pos = 0;
        }
        if (pos >= 0) {
            for(let i = stack.length - 1; i >= pos; i--){
                if (i > pos || !tagName1 && options1.warn) {
                    options1.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
                        start: stack[i].start,
                        end: stack[i].end
                    });
                }
                if (options1.end) {
                    options1.end(stack[i].tag, start, end);
                }
            }
            stack.length = pos;
            lastTag = pos && stack[pos - 1].tag;
        } else if (lowerCasedTagName === 'br') {
            if (options1.start) {
                options1.start(tagName1, [], true, start, end);
            }
        } else if (lowerCasedTagName === 'p') {
            if (options1.start) {
                options1.start(tagName1, [], false, start, end);
            }
            if (options1.end) {
                options1.end(tagName1, start, end);
            }
        }
    }
}
const onRE = /^@|^v-on:/;
const dirRE = /^v-|^@|^:|^#/;
const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
const stripParensRE = /^\(|\)$/g;
const dynamicArgRE = /^\[.*\]$/;
const argRE = /:(.*)$/;
const bindRE = /^:|^\.|^v-bind:/;
const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
const slotRE = /^v-slot(:|$)|^#/;
const lineBreakRE = /[\r\n]/;
const whitespaceRE$1 = /[ \f\t\r\n]+/g;
const invalidAttributeRE = /[\s"'<>\/=]/;
const decodeHTMLCached = cached(he.decode);
const emptySlotScopeToken = `_empty_`;
let warn$2;
let delimiters;
let transforms;
let preTransforms;
let postTransforms;
let platformIsPreTag;
let platformMustUseProp;
let platformGetTagNamespace;
let maybeComponent;
function createASTElement(tag1, attrs1, parent) {
    return {
        type: 1,
        tag: tag1,
        attrsList: attrs1,
        attrsMap: makeAttrsMap(attrs1),
        rawAttrsMap: {
        },
        parent,
        children: []
    };
}
function parse1(template, options1) {
    warn$2 = options1.warn || baseWarn;
    platformIsPreTag = options1.isPreTag || no;
    platformMustUseProp = options1.mustUseProp || no;
    platformGetTagNamespace = options1.getTagNamespace || no;
    const isReservedTag1 = options1.isReservedTag || no;
    maybeComponent = (el)=>!!(el.component || el.attrsMap[':is'] || el.attrsMap['v-bind:is'] || !(el.attrsMap.is ? isReservedTag1(el.attrsMap.is) : isReservedTag1(el.tag)))
    ;
    transforms = pluckModuleFunction(options1.modules, 'transformNode');
    preTransforms = pluckModuleFunction(options1.modules, 'preTransformNode');
    postTransforms = pluckModuleFunction(options1.modules, 'postTransformNode');
    delimiters = options1.delimiters;
    const stack = [];
    const preserveWhitespace = options1.preserveWhitespace !== false;
    const whitespaceOption = options1.whitespace;
    let root;
    let currentParent;
    let inVPre = false;
    let inPre = false;
    let warned = false;
    function warnOnce(msg, range) {
        if (!warned) {
            warned = true;
            warn$2(msg, range);
        }
    }
    function closeElement(element) {
        trimEndingWhitespace(element);
        if (!inVPre && !element.processed) {
            element = processElement(element, options1);
        }
        if (!stack.length && element !== root) {
            if (root.if && (element.elseif || element.else)) {
                {
                    checkRootConstraints(element);
                }
                addIfCondition(root, {
                    exp: element.elseif,
                    block: element
                });
            } else {
                warnOnce(`Component template should contain exactly one root element. ` + `If you are using v-if on multiple elements, ` + `use v-else-if to chain them instead.`, {
                    start: element.start
                });
            }
        }
        if (currentParent && !element.forbidden) {
            if (element.elseif || element.else) {
                processIfConditions(element, currentParent);
            } else {
                if (element.slotScope) {
                    const name = element.slotTarget || '"default"';
                    (currentParent.scopedSlots || (currentParent.scopedSlots = {
                    }))[name] = element;
                }
                currentParent.children.push(element);
                element.parent = currentParent;
            }
        }
        element.children = element.children.filter((c)=>!c.slotScope
        );
        trimEndingWhitespace(element);
        if (element.pre) {
            inVPre = false;
        }
        if (platformIsPreTag(element.tag)) {
            inPre = false;
        }
        for(let i = 0; i < postTransforms.length; i++){
            postTransforms[i](element, options1);
        }
    }
    function trimEndingWhitespace(el) {
        if (!inPre) {
            let lastNode;
            while((lastNode = el.children[el.children.length - 1]) && lastNode.type === 3 && lastNode.text === ' '){
                el.children.pop();
            }
        }
    }
    function checkRootConstraints(el) {
        if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(`Cannot use <${el.tag}> as component root element because it may ` + 'contain multiple nodes.', {
                start: el.start
            });
        }
        if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.', el.rawAttrsMap['v-for']);
        }
    }
    parseHTML(template, {
        warn: warn$2,
        expectHTML: options1.expectHTML,
        isUnaryTag: options1.isUnaryTag,
        canBeLeftOpenTag: options1.canBeLeftOpenTag,
        shouldDecodeNewlines: options1.shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: options1.shouldDecodeNewlinesForHref,
        shouldKeepComment: options1.comments,
        outputSourceRange: options1.outputSourceRange,
        start (tag, attrs, unary, start, end) {
            const ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);
            if (isIE && ns === 'svg') {
                attrs = guardIESVGBug(attrs);
            }
            let element = createASTElement(tag, attrs, currentParent);
            if (ns) {
                element.ns = ns;
            }
            {
                if (options1.outputSourceRange) {
                    element.start = start;
                    element.end = end;
                    element.rawAttrsMap = element.attrsList.reduce((cumulated, attr)=>{
                        cumulated[attr.name] = attr;
                        return cumulated;
                    }, {
                    });
                }
                attrs.forEach((attr)=>{
                    if (invalidAttributeRE.test(attr.name)) {
                        warn$2(`Invalid dynamic argument expression: attribute names cannot contain ` + `spaces, quotes, <, >, / or =.`, {
                            start: attr.start + attr.name.indexOf(`[`),
                            end: attr.start + attr.name.length
                        });
                    }
                });
            }
            if (isForbiddenTag(element) && !isServerRendering()) {
                element.forbidden = true;
                warn$2('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + `<${tag}>` + ', as they will not be parsed.', {
                    start: element.start
                });
            }
            for(let i = 0; i < preTransforms.length; i++){
                element = preTransforms[i](element, options1) || element;
            }
            if (!inVPre) {
                processPre(element);
                if (element.pre) {
                    inVPre = true;
                }
            }
            if (platformIsPreTag(element.tag)) {
                inPre = true;
            }
            if (inVPre) {
                processRawAttrs(element);
            } else if (!element.processed) {
                processFor(element);
                processIf(element);
                processOnce(element);
            }
            if (!root) {
                root = element;
                {
                    checkRootConstraints(root);
                }
            }
            if (!unary) {
                currentParent = element;
                stack.push(element);
            } else {
                closeElement(element);
            }
        },
        end (tag, start, end) {
            const element = stack[stack.length - 1];
            stack.length -= 1;
            currentParent = stack[stack.length - 1];
            if (options1.outputSourceRange) {
                element.end = end;
            }
            closeElement(element);
        },
        chars (text, start, end) {
            if (!currentParent) {
                {
                    if (text === template) {
                        warnOnce('Component template requires a root element, rather than just text.', {
                            start
                        });
                    } else if (text = text.trim()) {
                        warnOnce(`text "${text}" outside root element will be ignored.`, {
                            start
                        });
                    }
                }
                return;
            }
            if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
                return;
            }
            const children1 = currentParent.children;
            if (inPre || text.trim()) {
                text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
            } else if (!children1.length) {
                text = '';
            } else if (whitespaceOption) {
                if (whitespaceOption === 'condense') {
                    text = lineBreakRE.test(text) ? '' : ' ';
                } else {
                    text = ' ';
                }
            } else {
                text = preserveWhitespace ? ' ' : '';
            }
            if (text) {
                if (!inPre && whitespaceOption === 'condense') {
                    text = text.replace(whitespaceRE$1, ' ');
                }
                let res;
                let child;
                if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
                    child = {
                        type: 2,
                        expression: res.expression,
                        tokens: res.tokens,
                        text
                    };
                } else if (text !== ' ' || !children1.length || children1[children1.length - 1].text !== ' ') {
                    child = {
                        type: 3,
                        text
                    };
                }
                if (child) {
                    if (options1.outputSourceRange) {
                        child.start = start;
                        child.end = end;
                    }
                    children1.push(child);
                }
            }
        },
        comment (text, start, end) {
            if (currentParent) {
                const child = {
                    type: 3,
                    text,
                    isComment: true
                };
                if (options1.outputSourceRange) {
                    child.start = start;
                    child.end = end;
                }
                currentParent.children.push(child);
            }
        }
    });
    return root;
}
function processPre(el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
        el.pre = true;
    }
}
function processRawAttrs(el) {
    const list = el.attrsList;
    const len1 = list.length;
    if (len1) {
        const attrs2 = el.attrs = new Array(len1);
        for(let i = 0; i < len1; i++){
            attrs2[i] = {
                name: list[i].name,
                value: JSON.stringify(list[i].value)
            };
            if (list[i].start != null) {
                attrs2[i].start = list[i].start;
                attrs2[i].end = list[i].end;
            }
        }
    } else if (!el.pre) {
        el.plain = true;
    }
}
function processElement(element, options1) {
    processKey(element);
    element.plain = !element.key && !element.scopedSlots && !element.attrsList.length;
    processRef(element);
    processSlotContent(element);
    processSlotOutlet(element);
    processComponent(element);
    for(let i = 0; i < transforms.length; i++){
        element = transforms[i](element, options1) || element;
    }
    processAttrs(element);
    return element;
}
function processKey(el) {
    const exp = getBindingAttr(el, 'key');
    if (exp) {
        {
            if (el.tag === 'template') {
                warn$2(`<template> cannot be keyed. Place the key on real elements instead.`, getRawBindingAttr(el, 'key'));
            }
            if (el.for) {
                const iterator = el.iterator2 || el.iterator1;
                const parent = el.parent;
                if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
                    warn$2(`Do not use v-for index as key on <transition-group> children, ` + `this is the same as not using keys.`, getRawBindingAttr(el, 'key'), true);
                }
            }
        }
        el.key = exp;
    }
}
function processRef(el) {
    const ref1 = getBindingAttr(el, 'ref');
    if (ref1) {
        el.ref = ref1;
        el.refInFor = checkInFor(el);
    }
}
function processFor(el) {
    let exp;
    if (exp = getAndRemoveAttr(el, 'v-for')) {
        const res = parseFor(exp);
        if (res) {
            extend(el, res);
        } else {
            warn$2(`Invalid v-for expression: ${exp}`, el.rawAttrsMap['v-for']);
        }
    }
}
function parseFor(exp) {
    const inMatch = exp.match(forAliasRE);
    if (!inMatch) return;
    const res = {
    };
    res.for = inMatch[2].trim();
    const alias = inMatch[1].trim().replace(stripParensRE, '');
    const iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
        res.alias = alias.replace(forIteratorRE, '').trim();
        res.iterator1 = iteratorMatch[1].trim();
        if (iteratorMatch[2]) {
            res.iterator2 = iteratorMatch[2].trim();
        }
    } else {
        res.alias = alias;
    }
    return res;
}
function processIf(el) {
    const exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
        el.if = exp;
        addIfCondition(el, {
            exp: exp,
            block: el
        });
    } else {
        if (getAndRemoveAttr(el, 'v-else') != null) {
            el.else = true;
        }
        const elseif = getAndRemoveAttr(el, 'v-else-if');
        if (elseif) {
            el.elseif = elseif;
        }
    }
}
function processIfConditions(el, parent) {
    const prev = findPrevElement(parent.children);
    if (prev && prev.if) {
        addIfCondition(prev, {
            exp: el.elseif,
            block: el
        });
    } else {
        warn$2(`v-${el.elseif ? 'else-if="' + el.elseif + '"' : 'else'} ` + `used on element <${el.tag}> without corresponding v-if.`, el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']);
    }
}
function findPrevElement(children1) {
    let i = children1.length;
    while(i--){
        if (children1[i].type === 1) {
            return children1[i];
        } else {
            if (children1[i].text !== ' ') {
                warn$2(`text "${children1[i].text.trim()}" between v-if and v-else(-if) ` + `will be ignored.`, children1[i]);
            }
            children1.pop();
        }
    }
}
function addIfCondition(el, condition) {
    if (!el.ifConditions) {
        el.ifConditions = [];
    }
    el.ifConditions.push(condition);
}
function processOnce(el) {
    const once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
        el.once = true;
    }
}
function processSlotContent(el) {
    let slotScope;
    if (el.tag === 'template') {
        slotScope = getAndRemoveAttr(el, 'scope');
        if (slotScope) {
            warn$2(`the "scope" attribute for scoped slots have been deprecated and ` + `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` + `can also be used on plain elements in addition to <template> to ` + `denote scoped slots.`, el.rawAttrsMap['scope'], true);
        }
        el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if (slotScope = getAndRemoveAttr(el, 'slot-scope')) {
        if (el.attrsMap['v-for']) {
            warn$2(`Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` + `(v-for takes higher priority). Use a wrapper <template> for the ` + `scoped slot to make it clearer.`, el.rawAttrsMap['slot-scope'], true);
        }
        el.slotScope = slotScope;
    }
    const slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
        el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
        if (el.tag !== 'template' && !el.slotScope) {
            addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
        }
    }
    {
        if (el.tag === 'template') {
            const slotBinding = getAndRemoveAttrByRegex(el, slotRE);
            if (slotBinding) {
                {
                    if (el.slotTarget || el.slotScope) {
                        warn$2(`Unexpected mixed usage of different slot syntaxes.`, el);
                    }
                    if (el.parent && !maybeComponent(el.parent)) {
                        warn$2(`<template v-slot> can only appear at the root level inside ` + `the receiving component`, el);
                    }
                }
                const { name , dynamic  } = getSlotName(slotBinding);
                el.slotTarget = name;
                el.slotTargetDynamic = dynamic;
                el.slotScope = slotBinding.value || emptySlotScopeToken;
            }
        } else {
            const slotBinding = getAndRemoveAttrByRegex(el, slotRE);
            if (slotBinding) {
                {
                    if (!maybeComponent(el)) {
                        warn$2(`v-slot can only be used on components or <template>.`, slotBinding);
                    }
                    if (el.slotScope || el.slotTarget) {
                        warn$2(`Unexpected mixed usage of different slot syntaxes.`, el);
                    }
                    if (el.scopedSlots) {
                        warn$2(`To avoid scope ambiguity, the default slot should also use ` + `<template> syntax when there are other named slots.`, slotBinding);
                    }
                }
                const slots = el.scopedSlots || (el.scopedSlots = {
                });
                const { name , dynamic  } = getSlotName(slotBinding);
                const slotContainer = slots[name] = createASTElement('template', [], el);
                slotContainer.slotTarget = name;
                slotContainer.slotTargetDynamic = dynamic;
                slotContainer.children = el.children.filter((c)=>{
                    if (!c.slotScope) {
                        c.parent = slotContainer;
                        return true;
                    }
                });
                slotContainer.slotScope = slotBinding.value || emptySlotScopeToken;
                el.children = [];
                el.plain = false;
            }
        }
    }
}
function getSlotName(binding) {
    let name = binding.name.replace(slotRE, '');
    if (!name) {
        if (binding.name[0] !== '#') {
            name = 'default';
        } else {
            warn$2(`v-slot shorthand syntax requires a slot name.`, binding);
        }
    }
    return dynamicArgRE.test(name) ? {
        name: name.slice(1, -1),
        dynamic: true
    } : {
        name: `"${name}"`,
        dynamic: false
    };
}
function processSlotOutlet(el) {
    if (el.tag === 'slot') {
        el.slotName = getBindingAttr(el, 'name');
        if (el.key) {
            warn$2(`\`key\` does not work on <slot> because slots are abstract outlets ` + `and can possibly expand into multiple elements. ` + `Use the key on a wrapping element instead.`, getRawBindingAttr(el, 'key'));
        }
    }
}
function processComponent(el) {
    let binding;
    if (binding = getBindingAttr(el, 'is')) {
        el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
        el.inlineTemplate = true;
    }
}
function processAttrs(el) {
    const list = el.attrsList;
    let i, l, name, rawName, value2, modifiers, syncGen, isDynamic;
    for(i = 0, l = list.length; i < l; i++){
        name = rawName = list[i].name;
        value2 = list[i].value;
        if (dirRE.test(name)) {
            el.hasBindings = true;
            modifiers = parseModifiers(name.replace(dirRE, ''));
            if (modifiers) {
                name = name.replace(modifierRE, '');
            }
            if (bindRE.test(name)) {
                name = name.replace(bindRE, '');
                value2 = parseFilters(value2);
                isDynamic = dynamicArgRE.test(name);
                if (isDynamic) {
                    name = name.slice(1, -1);
                }
                if (value2.trim().length === 0) {
                    warn$2(`The value for a v-bind expression cannot be empty. Found in "v-bind:${name}"`);
                }
                if (modifiers) {
                    if (modifiers.prop && !isDynamic) {
                        name = camelize(name);
                        if (name === 'innerHtml') name = 'innerHTML';
                    }
                    if (modifiers.camel && !isDynamic) {
                        name = camelize(name);
                    }
                    if (modifiers.sync) {
                        syncGen = genAssignmentCode(value2, `$event`);
                        if (!isDynamic) {
                            addHandler(el, `update:${camelize(name)}`, syncGen, null, false, warn$2, list[i]);
                            if (hyphenate(name) !== camelize(name)) {
                                addHandler(el, `update:${hyphenate(name)}`, syncGen, null, false, warn$2, list[i]);
                            }
                        } else {
                            addHandler(el, `"update:"+(${name})`, syncGen, null, false, warn$2, list[i], true);
                        }
                    }
                }
                if (modifiers && modifiers.prop || !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
                    addProp(el, name, value2, list[i], isDynamic);
                } else {
                    addAttr(el, name, value2, list[i], isDynamic);
                }
            } else if (onRE.test(name)) {
                name = name.replace(onRE, '');
                isDynamic = dynamicArgRE.test(name);
                if (isDynamic) {
                    name = name.slice(1, -1);
                }
                addHandler(el, name, value2, modifiers, false, warn$2, list[i], isDynamic);
            } else {
                name = name.replace(dirRE, '');
                const argMatch = name.match(argRE);
                let arg = argMatch && argMatch[1];
                isDynamic = false;
                if (arg) {
                    name = name.slice(0, -(arg.length + 1));
                    if (dynamicArgRE.test(arg)) {
                        arg = arg.slice(1, -1);
                        isDynamic = true;
                    }
                }
                addDirective(el, name, rawName, value2, arg, isDynamic, modifiers, list[i]);
                if (name === 'model') {
                    checkForAliasModel(el, value2);
                }
            }
        } else {
            {
                const res = parseText(value2, delimiters);
                if (res) {
                    warn$2(`${name}="${value2}": ` + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.', list[i]);
                }
            }
            addAttr(el, name, JSON.stringify(value2), list[i]);
            if (!el.component && name === 'muted' && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
                addProp(el, name, 'true', list[i]);
            }
        }
    }
}
function checkInFor(el) {
    let parent = el;
    while(parent){
        if (parent.for !== undefined) {
            return true;
        }
        parent = parent.parent;
    }
    return false;
}
function parseModifiers(name) {
    const match = name.match(modifierRE);
    if (match) {
        const ret = {
        };
        match.forEach((m)=>{
            ret[m.slice(1)] = true;
        });
        return ret;
    }
}
function makeAttrsMap(attrs2) {
    const map = {
    };
    for(let i = 0, l = attrs2.length; i < l; i++){
        if (map[attrs2[i].name] && !isIE && !isEdge) {
            warn$2('duplicate attribute: ' + attrs2[i].name, attrs2[i]);
        }
        map[attrs2[i].name] = attrs2[i].value;
    }
    return map;
}
function isTextTag(el) {
    return el.tag === 'script' || el.tag === 'style';
}
function isForbiddenTag(el) {
    return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
}
const ieNSBug = /^xmlns:NS\d+/;
const ieNSPrefix = /^NS\d+:/;
function guardIESVGBug(attrs2) {
    const res = [];
    for(let i = 0; i < attrs2.length; i++){
        const attr = attrs2[i];
        if (!ieNSBug.test(attr.name)) {
            attr.name = attr.name.replace(ieNSPrefix, '');
            res.push(attr);
        }
    }
    return res;
}
function checkForAliasModel(el, value2) {
    let _el = el;
    while(_el){
        if (_el.for && _el.alias === value2) {
            warn$2(`<${el.tag} v-model="${value2}">: ` + `You are binding v-model directly to a v-for iteration alias. ` + `This will not be able to modify the v-for source array because ` + `writing to the alias is like modifying a function local variable. ` + `Consider using an array of objects and use v-model on an object property instead.`, el.rawAttrsMap['v-model']);
        }
        _el = _el.parent;
    }
}
function preTransformNode(el, options1) {
    if (el.tag === 'input') {
        const map = el.attrsMap;
        if (!map['v-model']) {
            return;
        }
        let typeBinding;
        if (map[':type'] || map['v-bind:type']) {
            typeBinding = getBindingAttr(el, 'type');
        }
        if (!map.type && !typeBinding && map['v-bind']) {
            typeBinding = `(${map['v-bind']}).type`;
        }
        if (typeBinding) {
            const ifCondition = getAndRemoveAttr(el, 'v-if', true);
            const ifConditionExtra = ifCondition ? `&&(${ifCondition})` : ``;
            const hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
            const elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
            const branch0 = cloneASTElement(el);
            processFor(branch0);
            addRawAttr(branch0, 'type', 'checkbox');
            processElement(branch0, options1);
            branch0.processed = true;
            branch0.if = `(${typeBinding})==='checkbox'` + ifConditionExtra;
            addIfCondition(branch0, {
                exp: branch0.if,
                block: branch0
            });
            const branch1 = cloneASTElement(el);
            getAndRemoveAttr(branch1, 'v-for', true);
            addRawAttr(branch1, 'type', 'radio');
            processElement(branch1, options1);
            addIfCondition(branch0, {
                exp: `(${typeBinding})==='radio'` + ifConditionExtra,
                block: branch1
            });
            const branch2 = cloneASTElement(el);
            getAndRemoveAttr(branch2, 'v-for', true);
            addRawAttr(branch2, ':type', typeBinding);
            processElement(branch2, options1);
            addIfCondition(branch0, {
                exp: ifCondition,
                block: branch2
            });
            if (hasElse) {
                branch0.else = true;
            } else if (elseIfCondition) {
                branch0.elseif = elseIfCondition;
            }
            return branch0;
        }
    }
}
function cloneASTElement(el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent);
}
var model$1 = {
    preTransformNode
};
var modules$1 = [
    klass$1,
    style$1,
    model$1
];
function text2(el, dir) {
    if (dir.value) {
        addProp(el, 'textContent', `_s(${dir.value})`, dir);
    }
}
function html(el, dir) {
    if (dir.value) {
        addProp(el, 'innerHTML', `_s(${dir.value})`, dir);
    }
}
var directives$1 = {
    model,
    text: text2,
    html
};
const baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag,
    isUnaryTag,
    mustUseProp,
    canBeLeftOpenTag,
    isReservedTag,
    getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
};
let isStaticKey;
let isPlatformReservedTag;
const genStaticKeysCached = cached(genStaticKeys$1);
function optimize(root, options1) {
    if (!root) return;
    isStaticKey = genStaticKeysCached(options1.staticKeys || '');
    isPlatformReservedTag = options1.isReservedTag || no;
    markStatic$1(root);
    markStaticRoots(root, false);
}
function genStaticKeys$1(keys) {
    return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' + (keys ? ',' + keys : ''));
}
function markStatic$1(node) {
    node.static = isStatic(node);
    if (node.type === 1) {
        if (!isPlatformReservedTag(node.tag) && node.tag !== 'slot' && node.attrsMap['inline-template'] == null) {
            return;
        }
        for(let i = 0, l = node.children.length; i < l; i++){
            const child = node.children[i];
            markStatic$1(child);
            if (!child.static) {
                node.static = false;
            }
        }
        if (node.ifConditions) {
            for(let i1 = 1, l1 = node.ifConditions.length; i1 < l1; i1++){
                const block = node.ifConditions[i1].block;
                markStatic$1(block);
                if (!block.static) {
                    node.static = false;
                }
            }
        }
    }
}
function markStaticRoots(node, isInFor) {
    if (node.type === 1) {
        if (node.static || node.once) {
            node.staticInFor = isInFor;
        }
        if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
            node.staticRoot = true;
            return;
        } else {
            node.staticRoot = false;
        }
        if (node.children) {
            for(let i = 0, l = node.children.length; i < l; i++){
                markStaticRoots(node.children[i], isInFor || !!node.for);
            }
        }
        if (node.ifConditions) {
            for(let i = 1, l = node.ifConditions.length; i < l; i++){
                markStaticRoots(node.ifConditions[i].block, isInFor);
            }
        }
    }
}
function isStatic(node) {
    if (node.type === 2) {
        return false;
    }
    if (node.type === 3) {
        return true;
    }
    return !!(node.pre || !node.hasBindings && !node.if && !node.for && !isBuiltInTag(node.tag) && isPlatformReservedTag(node.tag) && !isDirectChildOfTemplateFor(node) && Object.keys(node).every(isStaticKey));
}
function isDirectChildOfTemplateFor(node) {
    while(node.parent){
        node = node.parent;
        if (node.tag !== 'template') {
            return false;
        }
        if (node.for) {
            return true;
        }
    }
    return false;
}
const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
const fnInvokeRE = /\([^)]*?\);*$/;
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
const keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [
        8,
        46
    ]
};
const keyNames = {
    esc: [
        'Esc',
        'Escape'
    ],
    tab: 'Tab',
    enter: 'Enter',
    space: [
        ' ',
        'Spacebar'
    ],
    up: [
        'Up',
        'ArrowUp'
    ],
    left: [
        'Left',
        'ArrowLeft'
    ],
    right: [
        'Right',
        'ArrowRight'
    ],
    down: [
        'Down',
        'ArrowDown'
    ],
    'delete': [
        'Backspace',
        'Delete',
        'Del'
    ]
};
const genGuard = (condition)=>`if(${condition})return null;`
;
const modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard(`$event.target !== $event.currentTarget`),
    ctrl: genGuard(`!$event.ctrlKey`),
    shift: genGuard(`!$event.shiftKey`),
    alt: genGuard(`!$event.altKey`),
    meta: genGuard(`!$event.metaKey`),
    left: genGuard(`'button' in $event && $event.button !== 0`),
    middle: genGuard(`'button' in $event && $event.button !== 1`),
    right: genGuard(`'button' in $event && $event.button !== 2`)
};
function genHandlers(events1, isNative1) {
    const prefix = isNative1 ? 'nativeOn:' : 'on:';
    let staticHandlers = ``;
    let dynamicHandlers = ``;
    for(const name in events1){
        const handlerCode = genHandler(events1[name]);
        if (events1[name] && events1[name].dynamic) {
            dynamicHandlers += `${name},${handlerCode},`;
        } else {
            staticHandlers += `"${name}":${handlerCode},`;
        }
    }
    staticHandlers = `{${staticHandlers.slice(0, -1)}}`;
    if (dynamicHandlers) {
        return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`;
    } else {
        return prefix + staticHandlers;
    }
}
function genHandler(handler) {
    if (!handler) {
        return 'function(){}';
    }
    if (Array.isArray(handler)) {
        return `[${handler.map((handler1)=>genHandler(handler1)
        ).join(',')}]`;
    }
    const isMethodPath = simplePathRE.test(handler.value);
    const isFunctionExpression = fnExpRE.test(handler.value);
    const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));
    if (!handler.modifiers) {
        if (isMethodPath || isFunctionExpression) {
            return handler.value;
        }
        return `function($event){${isFunctionInvocation ? `return ${handler.value}` : handler.value}}`;
    } else {
        let code = '';
        let genModifierCode = '';
        const keys = [];
        for(const key in handler.modifiers){
            if (modifierCode[key]) {
                genModifierCode += modifierCode[key];
                if (keyCodes[key]) {
                    keys.push(key);
                }
            } else if (key === 'exact') {
                const modifiers = handler.modifiers;
                genModifierCode += genGuard([
                    'ctrl',
                    'shift',
                    'alt',
                    'meta'
                ].filter((keyModifier)=>!modifiers[keyModifier]
                ).map((keyModifier)=>`$event.${keyModifier}Key`
                ).join('||'));
            } else {
                keys.push(key);
            }
        }
        if (keys.length) {
            code += genKeyFilter(keys);
        }
        if (genModifierCode) {
            code += genModifierCode;
        }
        const handlerCode = isMethodPath ? `return ${handler.value}.apply(null, arguments)` : isFunctionExpression ? `return (${handler.value}).apply(null, arguments)` : isFunctionInvocation ? `return ${handler.value}` : handler.value;
        return `function($event){${code}${handlerCode}}`;
    }
}
function genKeyFilter(keys) {
    return `if(!$event.type.indexOf('key')&&` + `${keys.map(genFilterCode).join('&&')})return null;`;
}
function genFilterCode(key) {
    const keyVal = parseInt(key, 10);
    if (keyVal) {
        return `$event.keyCode!==${keyVal}`;
    }
    const keyCode = keyCodes[key];
    const keyName = keyNames[key];
    return `_k($event.keyCode,` + `${JSON.stringify(key)},` + `${JSON.stringify(keyCode)},` + `$event.key,` + `${JSON.stringify(keyName)}` + `)`;
}
function on(el, dir) {
    if (dir.modifiers) {
        warn(`v-on without argument does not support modifiers.`);
    }
    el.wrapListeners = (code)=>`_g(${code},${dir.value})`
    ;
}
function bind$1(el, dir) {
    el.wrapData = (code)=>{
        return `_b(${code},'${el.tag}',${dir.value},${dir.modifiers && dir.modifiers.prop ? 'true' : 'false'}${dir.modifiers && dir.modifiers.sync ? ',true' : ''})`;
    };
}
var baseDirectives = {
    on,
    bind: bind$1,
    cloak: noop
};
class CodegenState {
    constructor(options1){
        this.options = options1;
        this.warn = options1.warn || baseWarn;
        this.transforms = pluckModuleFunction(options1.modules, 'transformCode');
        this.dataGenFns = pluckModuleFunction(options1.modules, 'genData');
        this.directives = extend(extend({
        }, baseDirectives), options1.directives);
        const isReservedTag1 = options1.isReservedTag || no;
        this.maybeComponent = (el)=>!!el.component || !isReservedTag1(el.tag)
        ;
        this.onceId = 0;
        this.staticRenderFns = [];
        this.pre = false;
    }
}
function generate(ast, options2) {
    const state = new CodegenState(options2);
    const code = ast ? ast.tag === 'script' ? 'null' : genElement(ast, state) : '_c("div")';
    return {
        render: `with(this){return ${code}}`,
        staticRenderFns: state.staticRenderFns
    };
}
function genElement(el, state) {
    if (el.parent) {
        el.pre = el.pre || el.parent.pre;
    }
    if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state);
    } else if (el.once && !el.onceProcessed) {
        return genOnce(el, state);
    } else if (el.for && !el.forProcessed) {
        return genFor(el, state);
    } else if (el.if && !el.ifProcessed) {
        return genIf(el, state);
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
        return genChildren(el, state) || 'void 0';
    } else if (el.tag === 'slot') {
        return genSlot(el, state);
    } else {
        let code;
        if (el.component) {
            code = genComponent(el.component, el, state);
        } else {
            let data1;
            if (!el.plain || el.pre && state.maybeComponent(el)) {
                data1 = genData$2(el, state);
            }
            const children1 = el.inlineTemplate ? null : genChildren(el, state, true);
            code = `_c('${el.tag}'${data1 ? `,${data1}` : ''}${children1 ? `,${children1}` : ''})`;
        }
        for(let i = 0; i < state.transforms.length; i++){
            code = state.transforms[i](el, code);
        }
        return code;
    }
}
function genStatic(el, state) {
    el.staticProcessed = true;
    const originalPreState = state.pre;
    if (el.pre) {
        state.pre = el.pre;
    }
    state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`);
    state.pre = originalPreState;
    return `_m(${state.staticRenderFns.length - 1}${el.staticInFor ? ',true' : ''})`;
}
function genOnce(el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
        return genIf(el, state);
    } else if (el.staticInFor) {
        let key = '';
        let parent = el.parent;
        while(parent){
            if (parent.for) {
                key = parent.key;
                break;
            }
            parent = parent.parent;
        }
        if (!key) {
            state.warn(`v-once can only be used inside v-for that is keyed. `, el.rawAttrsMap['v-once']);
            return genElement(el, state);
        }
        return `_o(${genElement(el, state)},${state.onceId++},${key})`;
    } else {
        return genStatic(el, state);
    }
}
function genIf(el, state, altGen, altEmpty) {
    el.ifProcessed = true;
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
}
function genIfConditions(conditions, state, altGen, altEmpty) {
    if (!conditions.length) {
        return altEmpty || '_e()';
    }
    const condition = conditions.shift();
    if (condition.exp) {
        return `(${condition.exp})?${genTernaryExp(condition.block)}:${genIfConditions(conditions, state, altGen, altEmpty)}`;
    } else {
        return `${genTernaryExp(condition.block)}`;
    }
    function genTernaryExp(el) {
        return altGen ? altGen(el, state) : el.once ? genOnce(el, state) : genElement(el, state);
    }
}
function genFor(el, state, altGen, altHelper) {
    const exp = el.for;
    const alias = el.alias;
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';
    if (state.maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key) {
        state.warn(`<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` + `v-for should have explicit keys. ` + `See https://vuejs.org/guide/list.html#key for more info.`, el.rawAttrsMap['v-for'], true);
    }
    el.forProcessed = true;
    return `${altHelper || '_l'}((${exp}),` + `function(${alias}${iterator1}${iterator2}){` + `return ${(altGen || genElement)(el, state)}` + '})';
}
function genData$2(el, state) {
    let data1 = '{';
    const dirs = genDirectives(el, state);
    if (dirs) data1 += dirs + ',';
    if (el.key) {
        data1 += `key:${el.key},`;
    }
    if (el.ref) {
        data1 += `ref:${el.ref},`;
    }
    if (el.refInFor) {
        data1 += `refInFor:true,`;
    }
    if (el.pre) {
        data1 += `pre:true,`;
    }
    if (el.component) {
        data1 += `tag:"${el.tag}",`;
    }
    for(let i = 0; i < state.dataGenFns.length; i++){
        data1 += state.dataGenFns[i](el);
    }
    if (el.attrs) {
        data1 += `attrs:${genProps(el.attrs)},`;
    }
    if (el.props) {
        data1 += `domProps:${genProps(el.props)},`;
    }
    if (el.events) {
        data1 += `${genHandlers(el.events, false)},`;
    }
    if (el.nativeEvents) {
        data1 += `${genHandlers(el.nativeEvents, true)},`;
    }
    if (el.slotTarget && !el.slotScope) {
        data1 += `slot:${el.slotTarget},`;
    }
    if (el.scopedSlots) {
        data1 += `${genScopedSlots(el, el.scopedSlots, state)},`;
    }
    if (el.model) {
        data1 += `model:{value:${el.model.value},callback:${el.model.callback},expression:${el.model.expression}},`;
    }
    if (el.inlineTemplate) {
        const inlineTemplate = genInlineTemplate(el, state);
        if (inlineTemplate) {
            data1 += `${inlineTemplate},`;
        }
    }
    data1 = data1.replace(/,$/, '') + '}';
    if (el.dynamicAttrs) {
        data1 = `_b(${data1},"${el.tag}",${genProps(el.dynamicAttrs)})`;
    }
    if (el.wrapData) {
        data1 = el.wrapData(data1);
    }
    if (el.wrapListeners) {
        data1 = el.wrapListeners(data1);
    }
    return data1;
}
function genDirectives(el, state) {
    const dirs = el.directives;
    if (!dirs) return;
    let res = 'directives:[';
    let hasRuntime = false;
    let i, l, dir, needRuntime;
    for(i = 0, l = dirs.length; i < l; i++){
        dir = dirs[i];
        needRuntime = true;
        const gen = state.directives[dir.name];
        if (gen) {
            needRuntime = !!gen(el, dir, state.warn);
        }
        if (needRuntime) {
            hasRuntime = true;
            res += `{name:"${dir.name}",rawName:"${dir.rawName}"${dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''}${dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''}${dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''}},`;
        }
    }
    if (hasRuntime) {
        return res.slice(0, -1) + ']';
    }
}
function genInlineTemplate(el, state) {
    const ast = el.children[0];
    if (el.children.length !== 1 || ast.type !== 1) {
        state.warn('Inline-template components must have exactly one child element.', {
            start: el.start
        });
    }
    if (ast && ast.type === 1) {
        const inlineRenderFns = generate(ast, state.options);
        return `inlineTemplate:{render:function(){${inlineRenderFns.render}},staticRenderFns:[${inlineRenderFns.staticRenderFns.map((code)=>`function(){${code}}`
        ).join(',')}]}`;
    }
}
function genScopedSlots(el, slots, state) {
    let needsForceUpdate = el.for || Object.keys(slots).some((key)=>{
        const slot = slots[key];
        return slot.slotTargetDynamic || slot.if || slot.for || containsSlotChild(slot);
    });
    let needsKey = !!el.if;
    if (!needsForceUpdate) {
        let parent = el.parent;
        while(parent){
            if (parent.slotScope && parent.slotScope !== emptySlotScopeToken || parent.for) {
                needsForceUpdate = true;
                break;
            }
            if (parent.if) {
                needsKey = true;
            }
            parent = parent.parent;
        }
    }
    const generatedSlots = Object.keys(slots).map((key)=>genScopedSlot(slots[key], state)
    ).join(',');
    return `scopedSlots:_u([${generatedSlots}]${needsForceUpdate ? `,null,true` : ``}${!needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``})`;
}
function hash(str1) {
    let hash1 = 5381;
    let i = str1.length;
    while(i){
        hash1 = hash1 * 33 ^ str1.charCodeAt(--i);
    }
    return hash1 >>> 0;
}
function containsSlotChild(el) {
    if (el.type === 1) {
        if (el.tag === 'slot') {
            return true;
        }
        return el.children.some(containsSlotChild);
    }
    return false;
}
function genScopedSlot(el, state) {
    const isLegacySyntax = el.attrsMap['slot-scope'];
    if (el.if && !el.ifProcessed && !isLegacySyntax) {
        return genIf(el, state, genScopedSlot, `null`);
    }
    if (el.for && !el.forProcessed) {
        return genFor(el, state, genScopedSlot);
    }
    const slotScope = el.slotScope === emptySlotScopeToken ? `` : String(el.slotScope);
    const fn = `function(${slotScope}){` + `return ${el.tag === 'template' ? el.if && isLegacySyntax ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined` : genChildren(el, state) || 'undefined' : genElement(el, state)}}`;
    const reverseProxy = slotScope ? `` : `,proxy:true`;
    return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`;
}
function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
    const children1 = el.children;
    if (children1.length) {
        const el1 = children1[0];
        if (children1.length === 1 && el1.for && el1.tag !== 'template' && el1.tag !== 'slot') {
            const normalizationType = checkSkip ? state.maybeComponent(el1) ? `,1` : `,0` : ``;
            return `${(altGenElement || genElement)(el1, state)}${normalizationType}`;
        }
        const normalizationType = checkSkip ? getNormalizationType(children1, state.maybeComponent) : 0;
        const gen = altGenNode || genNode;
        return `[${children1.map((c)=>gen(c, state)
        ).join(',')}]${normalizationType ? `,${normalizationType}` : ''}`;
    }
}
function getNormalizationType(children1, maybeComponent1) {
    let res = 0;
    for(let i = 0; i < children1.length; i++){
        const el = children1[i];
        if (el.type !== 1) {
            continue;
        }
        if (needsNormalization(el) || el.ifConditions && el.ifConditions.some((c)=>needsNormalization(c.block)
        )) {
            res = 2;
            break;
        }
        if (maybeComponent1(el) || el.ifConditions && el.ifConditions.some((c)=>maybeComponent1(c.block)
        )) {
            res = 1;
        }
    }
    return res;
}
function needsNormalization(el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
}
function genNode(node, state) {
    if (node.type === 1) {
        return genElement(node, state);
    } else if (node.type === 3 && node.isComment) {
        return genComment(node);
    } else {
        return genText(node);
    }
}
function genText(text3) {
    return `_v(${text3.type === 2 ? text3.expression : transformSpecialNewlines(JSON.stringify(text3.text))})`;
}
function genComment(comment1) {
    return `_e(${JSON.stringify(comment1.text)})`;
}
function genSlot(el, state) {
    const slotName = el.slotName || '"default"';
    const children1 = genChildren(el, state);
    let res = `_t(${slotName}${children1 ? `,function(){return ${children1}}` : ''}`;
    const attrs2 = el.attrs || el.dynamicAttrs ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map((attr)=>({
            name: camelize(attr.name),
            value: attr.value,
            dynamic: attr.dynamic
        })
    )) : null;
    const bind$$1 = el.attrsMap['v-bind'];
    if ((attrs2 || bind$$1) && !children1) {
        res += `,null`;
    }
    if (attrs2) {
        res += `,${attrs2}`;
    }
    if (bind$$1) {
        res += `${attrs2 ? '' : ',null'},${bind$$1}`;
    }
    return res + ')';
}
function genComponent(componentName, el, state) {
    const children1 = el.inlineTemplate ? null : genChildren(el, state, true);
    return `_c(${componentName},${genData$2(el, state)}${children1 ? `,${children1}` : ''})`;
}
function genProps(props1) {
    let staticProps = ``;
    let dynamicProps = ``;
    for(let i = 0; i < props1.length; i++){
        const prop = props1[i];
        const value2 = transformSpecialNewlines(prop.value);
        if (prop.dynamic) {
            dynamicProps += `${prop.name},${value2},`;
        } else {
            staticProps += `"${prop.name}":${value2},`;
        }
    }
    staticProps = `{${staticProps.slice(0, -1)}}`;
    if (dynamicProps) {
        return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`;
    } else {
        return staticProps;
    }
}
function transformSpecialNewlines(text3) {
    return text3.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
const prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b');
const unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');
const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
function detectErrors(ast, warn1) {
    if (ast) {
        checkNode(ast, warn1);
    }
}
function checkNode(node, warn1) {
    if (node.type === 1) {
        for(const name in node.attrsMap){
            if (dirRE.test(name)) {
                const value2 = node.attrsMap[name];
                if (value2) {
                    const range = node.rawAttrsMap[name];
                    if (name === 'v-for') {
                        checkFor(node, `v-for="${value2}"`, warn1, range);
                    } else if (name === 'v-slot' || name[0] === '#') {
                        checkFunctionParameterExpression(value2, `${name}="${value2}"`, warn1, range);
                    } else if (onRE.test(name)) {
                        checkEvent(value2, `${name}="${value2}"`, warn1, range);
                    } else {
                        checkExpression(value2, `${name}="${value2}"`, warn1, range);
                    }
                }
            }
        }
        if (node.children) {
            for(let i = 0; i < node.children.length; i++){
                checkNode(node.children[i], warn1);
            }
        }
    } else if (node.type === 2) {
        checkExpression(node.expression, node.text, warn1, node);
    }
}
function checkEvent(exp, text3, warn1, range) {
    const stripped = exp.replace(stripStringRE, '');
    const keywordMatch = stripped.match(unaryOperatorsRE);
    if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
        warn1(`avoid using JavaScript unary operator as property name: ` + `"${keywordMatch[0]}" in expression ${text3.trim()}`, range);
    }
    checkExpression(exp, text3, warn1, range);
}
function checkFor(node, text3, warn1, range) {
    checkExpression(node.for || '', text3, warn1, range);
    checkIdentifier(node.alias, 'v-for alias', text3, warn1, range);
    checkIdentifier(node.iterator1, 'v-for iterator', text3, warn1, range);
    checkIdentifier(node.iterator2, 'v-for iterator', text3, warn1, range);
}
function checkIdentifier(ident, type, text3, warn1, range) {
    if (typeof ident === 'string') {
        try {
            new Function(`var ${ident}=_`);
        } catch (e) {
            warn1(`invalid ${type} "${ident}" in expression: ${text3.trim()}`, range);
        }
    }
}
function checkExpression(exp, text3, warn1, range) {
    try {
        new Function(`return ${exp}`);
    } catch (e) {
        const keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
        if (keywordMatch) {
            warn1(`avoid using JavaScript keyword as property name: ` + `"${keywordMatch[0]}"\n  Raw expression: ${text3.trim()}`, range);
        } else {
            warn1(`invalid expression: ${e.message} in\n\n` + `    ${exp}\n\n` + `  Raw expression: ${text3.trim()}\n`, range);
        }
    }
}
function checkFunctionParameterExpression(exp, text3, warn1, range) {
    try {
        new Function(exp, '');
    } catch (e) {
        warn1(`invalid function parameter expression: ${e.message} in\n\n` + `    ${exp}\n\n` + `  Raw expression: ${text3.trim()}\n`, range);
    }
}
function generateCodeFrame(source, start = 0, end = source.length) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for(let i = 0; i < lines.length; i++){
        count += lines[i].length + 1;
        if (count >= start) {
            for(let j = i - 2; j <= i + 2 || end > count; j++){
                if (j < 0 || j >= lines.length) continue;
                res.push(`${j + 1}${repeat(` `, 3 - String(j + 1).length)}|  ${lines[j]}`);
                const lineLength = lines[j].length;
                if (j === i) {
                    const pad = start - (count - lineLength) + 1;
                    const length = end > count ? lineLength - pad : end - start;
                    res.push(`   |  ` + repeat(` `, pad) + repeat(`^`, length));
                } else if (j > i) {
                    if (end > count) {
                        const length = Math.min(end - count, lineLength);
                        res.push(`   |  ` + repeat(`^`, length));
                    }
                    count += lineLength + 1;
                }
            }
            break;
        }
    }
    return res.join('\n');
}
function repeat(str1, n) {
    let result = '';
    if (n > 0) {
        while(true){
            if (n & 1) result += str1;
            n >>>= 1;
            if (n <= 0) break;
            str1 += str1;
        }
    }
    return result;
}
function createFunction(code, errors) {
    try {
        return new Function(code);
    } catch (err) {
        errors.push({
            err,
            code
        });
        return noop;
    }
}
function createCompileToFunctionFn(compile) {
    const cache = Object.create(null);
    return function compileToFunctions(template, options2, vm1) {
        options2 = extend({
        }, options2);
        const warn$$1 = options2.warn || warn;
        delete options2.warn;
        {
            try {
                new Function('return 1');
            } catch (e) {
                if (e.toString().match(/unsafe-eval|CSP/)) {
                    warn$$1('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
                }
            }
        }
        const key = options2.delimiters ? String(options2.delimiters) + template : template;
        if (cache[key]) {
            return cache[key];
        }
        const compiled = compile(template, options2);
        {
            if (compiled.errors && compiled.errors.length) {
                if (options2.outputSourceRange) {
                    compiled.errors.forEach((e)=>{
                        warn$$1(`Error compiling template:\n\n${e.msg}\n\n` + generateCodeFrame(template, e.start, e.end), vm1);
                    });
                } else {
                    warn$$1(`Error compiling template:\n\n${template}\n\n` + compiled.errors.map((e)=>`- ${e}`
                    ).join('\n') + '\n', vm1);
                }
            }
            if (compiled.tips && compiled.tips.length) {
                if (options2.outputSourceRange) {
                    compiled.tips.forEach((e)=>tip(e.msg, vm1)
                    );
                } else {
                    compiled.tips.forEach((msg)=>tip(msg, vm1)
                    );
                }
            }
        }
        const res = {
        };
        const fnGenErrors = [];
        res.render = createFunction(compiled.render, fnGenErrors);
        res.staticRenderFns = compiled.staticRenderFns.map((code)=>{
            return createFunction(code, fnGenErrors);
        });
        {
            if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                warn$$1(`Failed to generate render function:\n\n` + fnGenErrors.map(({ err , code  })=>`${err.toString()} in\n\n${code}\n`
                ).join('\n'), vm1);
            }
        }
        return cache[key] = res;
    };
}
function createCompilerCreator(baseCompile) {
    return function createCompiler(baseOptions1) {
        function compile(template, options2) {
            const finalOptions = Object.create(baseOptions1);
            const errors = [];
            const tips = [];
            let warn1 = (msg, range, tip1)=>{
                (tip1 ? tips : errors).push(msg);
            };
            if (options2) {
                if (options2.outputSourceRange) {
                    const leadingSpaceLength = template.match(/^\s*/)[0].length;
                    warn1 = (msg, range, tip1)=>{
                        const data1 = {
                            msg
                        };
                        if (range) {
                            if (range.start != null) {
                                data1.start = range.start + leadingSpaceLength;
                            }
                            if (range.end != null) {
                                data1.end = range.end + leadingSpaceLength;
                            }
                        }
                        (tip1 ? tips : errors).push(data1);
                    };
                }
                if (options2.modules) {
                    finalOptions.modules = (baseOptions1.modules || []).concat(options2.modules);
                }
                if (options2.directives) {
                    finalOptions.directives = extend(Object.create(baseOptions1.directives || null), options2.directives);
                }
                for(const key in options2){
                    if (key !== 'modules' && key !== 'directives') {
                        finalOptions[key] = options2[key];
                    }
                }
            }
            finalOptions.warn = warn1;
            const compiled = baseCompile(template.trim(), finalOptions);
            {
                detectErrors(compiled.ast, warn1);
            }
            compiled.errors = errors;
            compiled.tips = tips;
            return compiled;
        }
        return {
            compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        };
    };
}
const createCompiler = createCompilerCreator(function baseCompile(template, options2) {
    const ast = parse1(template.trim(), options2);
    if (options2.optimize !== false) {
        optimize(ast, options2);
    }
    const code = generate(ast, options2);
    return {
        ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    };
});
const { compile: compile1 , compileToFunctions  } = createCompiler(baseOptions);
let div;
function getShouldDecode(href) {
    div = div || document.createElement('div');
    div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
    return div.innerHTML.indexOf('&#10;') > 0;
}
const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;
const idToTemplate = cached((id)=>{
    const el = query(id);
    return el && el.innerHTML;
});
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function(el, hydrating) {
    el = el && query(el);
    if (el === document.body || el === document.documentElement) {
        warn(`Do not mount Vue to <html> or <body> - mount to normal elements instead.`);
        return this;
    }
    const options2 = this.$options;
    if (!options2.render) {
        let template = options2.template;
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = idToTemplate(template);
                    if (!template) {
                        warn(`Template element not found or is empty: ${options2.template}`, this);
                    }
                }
            } else if (template.nodeType) {
                template = template.innerHTML;
            } else {
                {
                    warn('invalid template option:' + template, this);
                }
                return this;
            }
        } else if (el) {
            template = getOuterHTML(el);
        }
        if (template) {
            if (config.performance && mark) {
                mark('compile');
            }
            const { render , staticRenderFns  } = compileToFunctions(template, {
                outputSourceRange: "development" !== 'production',
                shouldDecodeNewlines,
                shouldDecodeNewlinesForHref,
                delimiters: options2.delimiters,
                comments: options2.comments
            }, this);
            options2.render = render;
            options2.staticRenderFns = staticRenderFns;
            if (config.performance && mark) {
                mark('compile end');
                measure(`vue ${this._name} compile`, 'compile', 'compile end');
            }
        }
    }
    return mount.call(this, el, hydrating);
};
function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    } else {
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}
Vue.compile = compileToFunctions;
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[vue-router] ${message}`);
    }
}
function warn1(condition, message) {
    if (!condition) {
        typeof console !== 'undefined' && console.warn(`[vue-router] ${message}`);
    }
}
function extend1(a, b) {
    for(const key in b){
        a[key] = b[key];
    }
    return a;
}
const encodeReserveRE = /[!'()*]/g;
const encodeReserveReplacer = (c)=>'%' + c.charCodeAt(0).toString(16)
;
const commaRE = /%2C/g;
const encode = (str1)=>encodeURIComponent(str1).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',')
;
function decode(str1) {
    try {
        return decodeURIComponent(str1);
    } catch (err) {
        {
            warn1(false, `Error decoding "${str1}". Leaving it intact.`);
        }
    }
    return str1;
}
function resolveQuery(query1, extraQuery = {
}, _parseQuery) {
    const parse1 = _parseQuery || parseQuery;
    let parsedQuery;
    try {
        parsedQuery = parse1(query1 || '');
    } catch (e) {
        warn1(false, e.message);
        parsedQuery = {
        };
    }
    for(const key in extraQuery){
        const value2 = extraQuery[key];
        parsedQuery[key] = Array.isArray(value2) ? value2.map(castQueryParamValue) : castQueryParamValue(value2);
    }
    return parsedQuery;
}
const castQueryParamValue = (value2)=>value2 == null || typeof value2 === 'object' ? value2 : String(value2)
;
function parseQuery(query1) {
    const res = {
    };
    query1 = query1.trim().replace(/^(\?|#|&)/, '');
    if (!query1) {
        return res;
    }
    query1.split('&').forEach((param)=>{
        const parts = param.replace(/\+/g, ' ').split('=');
        const key = decode(parts.shift());
        const val = parts.length > 0 ? decode(parts.join('=')) : null;
        if (res[key] === undefined) {
            res[key] = val;
        } else if (Array.isArray(res[key])) {
            res[key].push(val);
        } else {
            res[key] = [
                res[key],
                val
            ];
        }
    });
    return res;
}
function stringifyQuery(obj) {
    const res = obj ? Object.keys(obj).map((key)=>{
        const val = obj[key];
        if (val === undefined) {
            return '';
        }
        if (val === null) {
            return encode(key);
        }
        if (Array.isArray(val)) {
            const result = [];
            val.forEach((val2)=>{
                if (val2 === undefined) {
                    return;
                }
                if (val2 === null) {
                    result.push(encode(key));
                } else {
                    result.push(encode(key) + '=' + encode(val2));
                }
            });
            return result.join('&');
        }
        return encode(key) + '=' + encode(val);
    }).filter((x)=>x.length > 0
    ).join('&') : null;
    return res ? `?${res}` : '';
}
const trailingSlashRE = /\/?$/;
function createRoute(record, location, redirectedFrom, router) {
    const stringifyQuery1 = router && router.options.stringifyQuery;
    let query1 = location.query || {
    };
    try {
        query1 = clone(query1);
    } catch (e) {
    }
    const route = {
        name: location.name || record && record.name,
        meta: record && record.meta || {
        },
        path: location.path || '/',
        hash: location.hash || '',
        query: query1,
        params: location.params || {
        },
        fullPath: getFullPath(location, stringifyQuery1),
        matched: record ? formatMatch(record) : []
    };
    if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery1);
    }
    return Object.freeze(route);
}
function clone(value2) {
    if (Array.isArray(value2)) {
        return value2.map(clone);
    } else if (value2 && typeof value2 === 'object') {
        const res = {
        };
        for(const key in value2){
            res[key] = clone(value2[key]);
        }
        return res;
    } else {
        return value2;
    }
}
const START = createRoute(null, {
    path: '/'
});
function formatMatch(record) {
    const res = [];
    while(record){
        res.unshift(record);
        record = record.parent;
    }
    return res;
}
function getFullPath({ path , query: query1 = {
} , hash: hash1 = ''  }, _stringifyQuery) {
    const stringify = _stringifyQuery || stringifyQuery;
    return (path || '/') + stringify(query1) + hash1;
}
function isSameRoute(a, b, onlyPath) {
    if (b === START) {
        return a === b;
    } else if (!b) {
        return false;
    } else if (a.path && b.path) {
        return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && (onlyPath || a.hash === b.hash && isObjectEqual(a.query, b.query));
    } else if (a.name && b.name) {
        return a.name === b.name && (onlyPath || a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params));
    } else {
        return false;
    }
}
function isObjectEqual(a = {
}, b = {
}) {
    if (!a || !b) return a === b;
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    return aKeys.every((key, i)=>{
        const aVal = a[key];
        const bKey = bKeys[i];
        if (bKey !== key) return false;
        const bVal = b[key];
        if (aVal == null || bVal == null) return aVal === bVal;
        if (typeof aVal === 'object' && typeof bVal === 'object') {
            return isObjectEqual(aVal, bVal);
        }
        return String(aVal) === String(bVal);
    });
}
function isIncludedRoute(current, target1) {
    return current.path.replace(trailingSlashRE, '/').indexOf(target1.path.replace(trailingSlashRE, '/')) === 0 && (!target1.hash || current.hash === target1.hash) && queryIncludes(current.query, target1.query);
}
function queryIncludes(current, target1) {
    for(const key in target1){
        if (!(key in current)) {
            return false;
        }
    }
    return true;
}
function handleRouteEntered(route) {
    for(let i = 0; i < route.matched.length; i++){
        const record = route.matched[i];
        for(const name in record.instances){
            const instance = record.instances[name];
            const cbs = record.enteredCbs[name];
            if (!instance || !cbs) continue;
            delete record.enteredCbs[name];
            for(let i1 = 0; i1 < cbs.length; i1++){
                if (!instance._isBeingDestroyed) cbs[i1](instance);
            }
        }
    }
}
var View = {
    name: 'RouterView',
    functional: true,
    props: {
        name: {
            type: String,
            default: 'default'
        }
    },
    render (_, { props , children , parent , data  }) {
        data.routerView = true;
        const h = parent.$createElement;
        const name = props.name;
        const route = parent.$route;
        const cache = parent._routerViewCache || (parent._routerViewCache = {
        });
        let depth = 0;
        let inactive = false;
        while(parent && parent._routerRoot !== parent){
            const vnodeData = parent.$vnode ? parent.$vnode.data : {
            };
            if (vnodeData.routerView) {
                depth++;
            }
            if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
                inactive = true;
            }
            parent = parent.$parent;
        }
        data.routerViewDepth = depth;
        if (inactive) {
            const cachedData = cache[name];
            const cachedComponent = cachedData && cachedData.component;
            if (cachedComponent) {
                if (cachedData.configProps) {
                    fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
                }
                return h(cachedComponent, data, children);
            } else {
                return h();
            }
        }
        const matched = route.matched[depth];
        const component = matched && matched.components[name];
        if (!matched || !component) {
            cache[name] = null;
            return h();
        }
        cache[name] = {
            component
        };
        data.registerRouteInstance = (vm1, val)=>{
            const current = matched.instances[name];
            if (val && current !== vm1 || !val && current === vm1) {
                matched.instances[name] = val;
            }
        };
        (data.hook || (data.hook = {
        })).prepatch = (_, vnode)=>{
            matched.instances[name] = vnode.componentInstance;
        };
        data.hook.init = (vnode)=>{
            if (vnode.data.keepAlive && vnode.componentInstance && vnode.componentInstance !== matched.instances[name]) {
                matched.instances[name] = vnode.componentInstance;
            }
            handleRouteEntered(route);
        };
        const configProps = matched.props && matched.props[name];
        if (configProps) {
            extend1(cache[name], {
                route,
                configProps
            });
            fillPropsinData(component, data, route, configProps);
        }
        return h(component, data, children);
    }
};
function fillPropsinData(component, data2, route, configProps) {
    let propsToPass = data2.props = resolveProps(route, configProps);
    if (propsToPass) {
        propsToPass = data2.props = extend1({
        }, propsToPass);
        const attrs2 = data2.attrs = data2.attrs || {
        };
        for(const key in propsToPass){
            if (!component.props || !(key in component.props)) {
                attrs2[key] = propsToPass[key];
                delete propsToPass[key];
            }
        }
    }
}
function resolveProps(route, config1) {
    switch(typeof config1){
        case 'undefined':
            return;
        case 'object':
            return config1;
        case 'function':
            return config1(route);
        case 'boolean':
            return config1 ? route.params : undefined;
        default:
            {
                warn1(false, `props in "${route.path}" is a ${typeof config1}, ` + `expecting an object, function or boolean.`);
            }
    }
}
function resolvePath(relative, base, append) {
    const firstChar = relative.charAt(0);
    if (firstChar === '/') {
        return relative;
    }
    if (firstChar === '?' || firstChar === '#') {
        return base + relative;
    }
    const stack = base.split('/');
    if (!append || !stack[stack.length - 1]) {
        stack.pop();
    }
    const segments = relative.replace(/^\//, '').split('/');
    for(let i = 0; i < segments.length; i++){
        const segment = segments[i];
        if (segment === '..') {
            stack.pop();
        } else if (segment !== '.') {
            stack.push(segment);
        }
    }
    if (stack[0] !== '') {
        stack.unshift('');
    }
    return stack.join('/');
}
function parsePath1(path) {
    let hash1 = '';
    let query1 = '';
    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
        hash1 = path.slice(hashIndex);
        path = path.slice(0, hashIndex);
    }
    const queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
        query1 = path.slice(queryIndex + 1);
        path = path.slice(0, queryIndex);
    }
    return {
        path,
        query: query1,
        hash: hash1
    };
}
function cleanPath(path) {
    return path.replace(/\/\//g, '/');
}
var isarray = Array.isArray || function(arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
};
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse2;
var compile_1 = compile2;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;
var PATH_REGEXP = new RegExp([
    '(\\\\.)',
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');
function parse2(str1, options2) {
    var tokens = [];
    var key = 0;
    var index1 = 0;
    var path = '';
    var defaultDelimiter = options2 && options2.delimiter || '/';
    var res;
    while((res = PATH_REGEXP.exec(str1)) != null){
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str1.slice(index1, offset);
        index1 = offset + m.length;
        if (escaped) {
            path += escaped[1];
            continue;
        }
        var next1 = str1[index1];
        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var modifier = res[6];
        var asterisk = res[7];
        if (path) {
            tokens.push(path);
            path = '';
        }
        var partial = prefix != null && next1 != null && next1 !== prefix;
        var repeat1 = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var delimiter = res[2] || defaultDelimiter;
        var pattern = capture || group;
        tokens.push({
            name: name || key++,
            prefix: prefix || '',
            delimiter: delimiter,
            optional: optional,
            repeat: repeat1,
            partial: partial,
            asterisk: !!asterisk,
            pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
        });
    }
    if (index1 < str1.length) {
        path += str1.substr(index1);
    }
    if (path) {
        tokens.push(path);
    }
    return tokens;
}
function compile2(str1, options2) {
    return tokensToFunction(parse2(str1, options2), options2);
}
function encodeURIComponentPretty(str1) {
    return encodeURI(str1).replace(/[\/?#]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeAsterisk(str1) {
    return encodeURI(str1).replace(/[?#]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function tokensToFunction(tokens, options2) {
    var matches1 = new Array(tokens.length);
    for(var i = 0; i < tokens.length; i++){
        if (typeof tokens[i] === 'object') {
            matches1[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options2));
        }
    }
    return function(obj, opts) {
        var path = '';
        var data2 = obj || {
        };
        var options3 = opts || {
        };
        var encode1 = options3.pretty ? encodeURIComponentPretty : encodeURIComponent;
        for(var i1 = 0; i1 < tokens.length; i1++){
            var token = tokens[i1];
            if (typeof token === 'string') {
                path += token;
                continue;
            }
            var value2 = data2[token.name];
            var segment;
            if (value2 == null) {
                if (token.optional) {
                    if (token.partial) {
                        path += token.prefix;
                    }
                    continue;
                } else {
                    throw new TypeError('Expected "' + token.name + '" to be defined');
                }
            }
            if (isarray(value2)) {
                if (!token.repeat) {
                    throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value2) + '`');
                }
                if (value2.length === 0) {
                    if (token.optional) {
                        continue;
                    } else {
                        throw new TypeError('Expected "' + token.name + '" to not be empty');
                    }
                }
                for(var j = 0; j < value2.length; j++){
                    segment = encode1(value2[j]);
                    if (!matches1[i1].test(segment)) {
                        throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
                    }
                    path += (j === 0 ? token.prefix : token.delimiter) + segment;
                }
                continue;
            }
            segment = token.asterisk ? encodeAsterisk(value2) : encode1(value2);
            if (!matches1[i1].test(segment)) {
                throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
            }
            path += token.prefix + segment;
        }
        return path;
    };
}
function escapeString(str1) {
    return str1.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}
function escapeGroup(group) {
    return group.replace(/([=!:$\/()])/g, '\\$1');
}
function attachKeys(re, keys) {
    re.keys = keys;
    return re;
}
function flags(options2) {
    return options2 && options2.sensitive ? '' : 'i';
}
function regexpToRegexp(path, keys) {
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for(var i = 0; i < groups.length; i++){
            keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                partial: false,
                asterisk: false,
                pattern: null
            });
        }
    }
    return attachKeys(path, keys);
}
function arrayToRegexp(path, keys, options2) {
    var parts = [];
    for(var i = 0; i < path.length; i++){
        parts.push(pathToRegexp(path[i], keys, options2).source);
    }
    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options2));
    return attachKeys(regexp, keys);
}
function stringToRegexp(path, keys, options2) {
    return tokensToRegExp(parse2(path, options2), keys, options2);
}
function tokensToRegExp(tokens, keys, options2) {
    if (!isarray(keys)) {
        options2 = keys || options2;
        keys = [];
    }
    options2 = options2 || {
    };
    var strict = options2.strict;
    var end = options2.end !== false;
    var route = '';
    for(var i = 0; i < tokens.length; i++){
        var token = tokens[i];
        if (typeof token === 'string') {
            route += escapeString(token);
        } else {
            var prefix = escapeString(token.prefix);
            var capture = '(?:' + token.pattern + ')';
            keys.push(token);
            if (token.repeat) {
                capture += '(?:' + prefix + capture + ')*';
            }
            if (token.optional) {
                if (!token.partial) {
                    capture = '(?:' + prefix + '(' + capture + '))?';
                } else {
                    capture = prefix + '(' + capture + ')?';
                }
            } else {
                capture = prefix + '(' + capture + ')';
            }
            route += capture;
        }
    }
    var delimiter = escapeString(options2.delimiter || '/');
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;
    if (!strict) {
        route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
    }
    if (end) {
        route += '$';
    } else {
        route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
    }
    return attachKeys(new RegExp('^' + route, flags(options2)), keys);
}
function pathToRegexp(path, keys, options2) {
    if (!isarray(keys)) {
        options2 = keys || options2;
        keys = [];
    }
    options2 = options2 || {
    };
    if (path instanceof RegExp) {
        return regexpToRegexp(path, keys);
    }
    if (isarray(path)) {
        return arrayToRegexp(path, keys, options2);
    }
    return stringToRegexp(path, keys, options2);
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;
const regexpCompileCache = Object.create(null);
function fillParams(path, params, routeMsg) {
    params = params || {
    };
    try {
        const filler = regexpCompileCache[path] || (regexpCompileCache[path] = pathToRegexp_1.compile(path));
        if (typeof params.pathMatch === 'string') params[0] = params.pathMatch;
        return filler(params, {
            pretty: true
        });
    } catch (e) {
        {
            warn1(typeof params.pathMatch === 'string', `missing param for ${routeMsg}: ${e.message}`);
        }
        return '';
    } finally{
        delete params[0];
    }
}
function normalizeLocation(raw, current, append, router) {
    let next2 = typeof raw === 'string' ? {
        path: raw
    } : raw;
    if (next2._normalized) {
        return next2;
    } else if (next2.name) {
        next2 = extend1({
        }, raw);
        const params = next2.params;
        if (params && typeof params === 'object') {
            next2.params = extend1({
            }, params);
        }
        return next2;
    }
    if (!next2.path && next2.params && current) {
        next2 = extend1({
        }, next2);
        next2._normalized = true;
        const params = extend1(extend1({
        }, current.params), next2.params);
        if (current.name) {
            next2.name = current.name;
            next2.params = params;
        } else if (current.matched.length) {
            const rawPath = current.matched[current.matched.length - 1].path;
            next2.path = fillParams(rawPath, params, `path ${current.path}`);
        } else {
            warn1(false, `relative params navigation requires a current route.`);
        }
        return next2;
    }
    const parsedPath = parsePath1(next2.path || '');
    const basePath = current && current.path || '/';
    const path = parsedPath.path ? resolvePath(parsedPath.path, basePath, append || next2.append) : basePath;
    const query1 = resolveQuery(parsedPath.query, next2.query, router && router.options.parseQuery);
    let hash1 = next2.hash || parsedPath.hash;
    if (hash1 && hash1.charAt(0) !== '#') {
        hash1 = `#${hash1}`;
    }
    return {
        _normalized: true,
        path,
        query: query1,
        hash: hash1
    };
}
const toTypes = [
    String,
    Object
];
const eventTypes = [
    String,
    Array
];
const noop1 = ()=>{
};
let warnedCustomSlot;
let warnedTagProp;
let warnedEventProp;
var Link = {
    name: 'RouterLink',
    props: {
        to: {
            type: toTypes,
            required: true
        },
        tag: {
            type: String,
            default: 'a'
        },
        custom: Boolean,
        exact: Boolean,
        exactPath: Boolean,
        append: Boolean,
        replace: Boolean,
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: {
            type: String,
            default: 'page'
        },
        event: {
            type: eventTypes,
            default: 'click'
        }
    },
    render (h) {
        const router = this.$router;
        const current = this.$route;
        const { location , route , href  } = router.resolve(this.to, current, this.append);
        const classes = {
        };
        const globalActiveClass = router.options.linkActiveClass;
        const globalExactActiveClass = router.options.linkExactActiveClass;
        const activeClassFallback = globalActiveClass == null ? 'router-link-active' : globalActiveClass;
        const exactActiveClassFallback = globalExactActiveClass == null ? 'router-link-exact-active' : globalExactActiveClass;
        const activeClass = this.activeClass == null ? activeClassFallback : this.activeClass;
        const exactActiveClass = this.exactActiveClass == null ? exactActiveClassFallback : this.exactActiveClass;
        const compareTarget = route.redirectedFrom ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router) : route;
        classes[exactActiveClass] = isSameRoute(current, compareTarget, this.exactPath);
        classes[activeClass] = this.exact || this.exactPath ? classes[exactActiveClass] : isIncludedRoute(current, compareTarget);
        const ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null;
        const handler = (e)=>{
            if (guardEvent(e)) {
                if (this.replace) {
                    router.replace(location, noop1);
                } else {
                    router.push(location, noop1);
                }
            }
        };
        const on1 = {
            click: guardEvent
        };
        if (Array.isArray(this.event)) {
            this.event.forEach((e)=>{
                on1[e] = handler;
            });
        } else {
            on1[this.event] = handler;
        }
        const data2 = {
            class: classes
        };
        const scopedSlot = !this.$scopedSlots.$hasNormal && this.$scopedSlots.default && this.$scopedSlots.default({
            href,
            route,
            navigate: handler,
            isActive: classes[activeClass],
            isExactActive: classes[exactActiveClass]
        });
        if (scopedSlot) {
            if (!this.custom) {
                !warnedCustomSlot && warn1(false, 'In Vue Router 4, the v-slot API will by default wrap its content with an <a> element. Use the custom prop to remove this warning:\n<router-link v-slot="{ navigate, href }" custom></router-link>\n');
                warnedCustomSlot = true;
            }
            if (scopedSlot.length === 1) {
                return scopedSlot[0];
            } else if (scopedSlot.length > 1 || !scopedSlot.length) {
                {
                    warn1(false, `<router-link> with to="${this.to}" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.`);
                }
                return scopedSlot.length === 0 ? h() : h('span', {
                }, scopedSlot);
            }
        }
        {
            if ('tag' in this.$options.propsData && !warnedTagProp) {
                warn1(false, `<router-link>'s tag prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link.`);
                warnedTagProp = true;
            }
            if ('event' in this.$options.propsData && !warnedEventProp) {
                warn1(false, `<router-link>'s event prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link.`);
                warnedEventProp = true;
            }
        }
        if (this.tag === 'a') {
            data2.on = on1;
            data2.attrs = {
                href,
                'aria-current': ariaCurrentValue
            };
        } else {
            const a = findAnchor(this.$slots.default);
            if (a) {
                a.isStatic = false;
                const aData = a.data = extend1({
                }, a.data);
                aData.on = aData.on || {
                };
                for(const event in aData.on){
                    const handler1 = aData.on[event];
                    if (event in on1) {
                        aData.on[event] = Array.isArray(handler1) ? handler1 : [
                            handler1
                        ];
                    }
                }
                for(const event1 in on1){
                    if (event1 in aData.on) {
                        aData.on[event1].push(on1[event1]);
                    } else {
                        aData.on[event1] = handler;
                    }
                }
                const aAttrs = a.data.attrs = extend1({
                }, a.data.attrs);
                aAttrs.href = href;
                aAttrs['aria-current'] = ariaCurrentValue;
            } else {
                data2.on = on1;
            }
        }
        return h(this.tag, data2, this.$slots.default);
    }
};
function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
        const target1 = e.currentTarget.getAttribute('target');
        if (/\b_blank\b/i.test(target1)) return;
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    return true;
}
function findAnchor(children2) {
    if (children2) {
        let child;
        for(let i = 0; i < children2.length; i++){
            child = children2[i];
            if (child.tag === 'a') {
                return child;
            }
            if (child.children && (child = findAnchor(child.children))) {
                return child;
            }
        }
    }
}
let _Vue;
function install(Vue1) {
    if (install.installed && _Vue === Vue1) return;
    install.installed = true;
    _Vue = Vue1;
    const isDef1 = (v)=>v !== undefined
    ;
    const registerInstance = (vm1, callVal)=>{
        let i = vm1.$options._parentVnode;
        if (isDef1(i) && isDef1(i = i.data) && isDef1(i = i.registerRouteInstance)) {
            i(vm1, callVal);
        }
    };
    Vue1.mixin({
        beforeCreate () {
            if (isDef1(this.$options.router)) {
                this._routerRoot = this;
                this._router = this.$options.router;
                this._router.init(this);
                Vue1.util.defineReactive(this, '_route', this._router.history.current);
            } else {
                this._routerRoot = this.$parent && this.$parent._routerRoot || this;
            }
            registerInstance(this, this);
        },
        destroyed () {
            registerInstance(this);
        }
    });
    Object.defineProperty(Vue1.prototype, '$router', {
        get () {
            return this._routerRoot._router;
        }
    });
    Object.defineProperty(Vue1.prototype, '$route', {
        get () {
            return this._routerRoot._route;
        }
    });
    Vue1.component('RouterView', View);
    Vue1.component('RouterLink', Link);
    const strats1 = Vue1.config.optionMergeStrategies;
    strats1.beforeRouteEnter = strats1.beforeRouteLeave = strats1.beforeRouteUpdate = strats1.created;
}
const inBrowser1 = typeof window !== 'undefined';
function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap, parentRoute) {
    const pathList = oldPathList || [];
    const pathMap = oldPathMap || Object.create(null);
    const nameMap = oldNameMap || Object.create(null);
    routes.forEach((route)=>{
        addRouteRecord(pathList, pathMap, nameMap, route, parentRoute);
    });
    for(let i = 0, l = pathList.length; i < l; i++){
        if (pathList[i] === '*') {
            pathList.push(pathList.splice(i, 1)[0]);
            l--;
            i--;
        }
    }
    {
        const found = pathList.filter((path)=>path && path.charAt(0) !== '*' && path.charAt(0) !== '/'
        );
        if (found.length > 0) {
            const pathNames = found.map((path)=>`- ${path}`
            ).join('\n');
            warn1(false, `Non-nested routes must include a leading slash character. Fix the following routes: \n${pathNames}`);
        }
    }
    return {
        pathList,
        pathMap,
        nameMap
    };
}
function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
    const { path , name  } = route;
    {
        assert(path != null, `"path" is required in a route configuration.`);
        assert(typeof route.component !== 'string', `route config "component" for path: ${String(path || name)} cannot be a ` + `string id. Use an actual component instead.`);
        warn1(!/[^\u0000-\u007F]+/.test(path), `Route with path "${path}" contains unencoded characters, make sure ` + `your path is correctly encoded before passing it to the router. Use ` + `encodeURI to encode static segments of your path.`);
    }
    const pathToRegexpOptions = route.pathToRegexpOptions || {
    };
    const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);
    if (typeof route.caseSensitive === 'boolean') {
        pathToRegexpOptions.sensitive = route.caseSensitive;
    }
    const record = {
        path: normalizedPath,
        regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
        components: route.components || {
            default: route.component
        },
        alias: route.alias ? typeof route.alias === 'string' ? [
            route.alias
        ] : route.alias : [],
        instances: {
        },
        enteredCbs: {
        },
        name,
        parent,
        matchAs,
        redirect: route.redirect,
        beforeEnter: route.beforeEnter,
        meta: route.meta || {
        },
        props: route.props == null ? {
        } : route.components ? route.props : {
            default: route.props
        }
    };
    if (route.children) {
        {
            if (route.name && !route.redirect && route.children.some((child)=>/^\/?$/.test(child.path)
            )) {
                warn1(false, `Named Route '${route.name}' has a default child route. ` + `When navigating to this named route (:to="{name: '${route.name}'"), ` + `the default child route will not be rendered. Remove the name from ` + `this route and use the name of the default child route for named ` + `links instead.`);
            }
        }
        route.children.forEach((child)=>{
            const childMatchAs = matchAs ? cleanPath(`${matchAs}/${child.path}`) : undefined;
            addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
        });
    }
    if (!pathMap[record.path]) {
        pathList.push(record.path);
        pathMap[record.path] = record;
    }
    if (route.alias !== undefined) {
        const aliases = Array.isArray(route.alias) ? route.alias : [
            route.alias
        ];
        for(let i = 0; i < aliases.length; ++i){
            const alias = aliases[i];
            if (alias === path) {
                warn1(false, `Found an alias with the same value as the path: "${path}". You have to remove that alias. It will be ignored in development.`);
                continue;
            }
            const aliasRoute = {
                path: alias,
                children: route.children
            };
            addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path || '/');
        }
    }
    if (name) {
        if (!nameMap[name]) {
            nameMap[name] = record;
        } else if (!matchAs) {
            warn1(false, `Duplicate named routes definition: ` + `{ name: "${name}", path: "${record.path}" }`);
        }
    }
}
function compileRouteRegex(path, pathToRegexpOptions) {
    const regex = pathToRegexp_1(path, [], pathToRegexpOptions);
    {
        const keys = Object.create(null);
        regex.keys.forEach((key)=>{
            warn1(!keys[key.name], `Duplicate param keys in route with path: "${path}"`);
            keys[key.name] = true;
        });
    }
    return regex;
}
function normalizePath(path, parent, strict) {
    if (!strict) path = path.replace(/\/$/, '');
    if (path[0] === '/') return path;
    if (parent == null) return path;
    return cleanPath(`${parent.path}/${path}`);
}
function createMatcher(routes, router) {
    const { pathList , pathMap , nameMap  } = createRouteMap(routes);
    function addRoutes(routes1) {
        createRouteMap(routes1, pathList, pathMap, nameMap);
    }
    function addRoute(parentOrRoute, route) {
        const parent = typeof parentOrRoute !== 'object' ? nameMap[parentOrRoute] : undefined;
        createRouteMap([
            route || parentOrRoute
        ], pathList, pathMap, nameMap, parent);
        if (parent && parent.alias.length) {
            createRouteMap(parent.alias.map((alias)=>({
                    path: alias,
                    children: [
                        route
                    ]
                })
            ), pathList, pathMap, nameMap, parent);
        }
    }
    function getRoutes() {
        return pathList.map((path)=>pathMap[path]
        );
    }
    function match(raw, currentRoute, redirectedFrom) {
        const location = normalizeLocation(raw, currentRoute, false, router);
        const { name  } = location;
        if (name) {
            const record = nameMap[name];
            {
                warn1(record, `Route with name '${name}' does not exist`);
            }
            if (!record) return _createRoute(null, location);
            const paramNames = record.regex.keys.filter((key)=>!key.optional
            ).map((key)=>key.name
            );
            if (typeof location.params !== 'object') {
                location.params = {
                };
            }
            if (currentRoute && typeof currentRoute.params === 'object') {
                for(const key in currentRoute.params){
                    if (!(key in location.params) && paramNames.indexOf(key) > -1) {
                        location.params[key] = currentRoute.params[key];
                    }
                }
            }
            location.path = fillParams(record.path, location.params, `named route "${name}"`);
            return _createRoute(record, location, redirectedFrom);
        } else if (location.path) {
            location.params = {
            };
            for(let i = 0; i < pathList.length; i++){
                const path = pathList[i];
                const record = pathMap[path];
                if (matchRoute(record.regex, location.path, location.params)) {
                    return _createRoute(record, location, redirectedFrom);
                }
            }
        }
        return _createRoute(null, location);
    }
    function redirect(record, location) {
        const originalRedirect = record.redirect;
        let redirect1 = typeof originalRedirect === 'function' ? originalRedirect(createRoute(record, location, null, router)) : originalRedirect;
        if (typeof redirect1 === 'string') {
            redirect1 = {
                path: redirect1
            };
        }
        if (!redirect1 || typeof redirect1 !== 'object') {
            {
                warn1(false, `invalid redirect option: ${JSON.stringify(redirect1)}`);
            }
            return _createRoute(null, location);
        }
        const re = redirect1;
        const { name , path  } = re;
        let { query: query1 , hash: hash1 , params  } = location;
        query1 = re.hasOwnProperty('query') ? re.query : query1;
        hash1 = re.hasOwnProperty('hash') ? re.hash : hash1;
        params = re.hasOwnProperty('params') ? re.params : params;
        if (name) {
            const targetRecord = nameMap[name];
            {
                assert(targetRecord, `redirect failed: named route "${name}" not found.`);
            }
            return match({
                _normalized: true,
                name,
                query: query1,
                hash: hash1,
                params
            }, undefined, location);
        } else if (path) {
            const rawPath = resolveRecordPath(path, record);
            const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`);
            return match({
                _normalized: true,
                path: resolvedPath,
                query: query1,
                hash: hash1
            }, undefined, location);
        } else {
            {
                warn1(false, `invalid redirect option: ${JSON.stringify(redirect1)}`);
            }
            return _createRoute(null, location);
        }
    }
    function alias(record, location, matchAs) {
        const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`);
        const aliasedMatch = match({
            _normalized: true,
            path: aliasedPath
        });
        if (aliasedMatch) {
            const matched = aliasedMatch.matched;
            const aliasedRecord = matched[matched.length - 1];
            location.params = aliasedMatch.params;
            return _createRoute(aliasedRecord, location);
        }
        return _createRoute(null, location);
    }
    function _createRoute(record, location, redirectedFrom) {
        if (record && record.redirect) {
            return redirect(record, redirectedFrom || location);
        }
        if (record && record.matchAs) {
            return alias(record, location, record.matchAs);
        }
        return createRoute(record, location, redirectedFrom, router);
    }
    return {
        match,
        addRoute,
        getRoutes,
        addRoutes
    };
}
function matchRoute(regex, path, params) {
    const m = path.match(regex);
    if (!m) {
        return false;
    } else if (!params) {
        return true;
    }
    for(let i = 1, len1 = m.length; i < len1; ++i){
        const key = regex.keys[i - 1];
        if (key) {
            params[key.name || 'pathMatch'] = typeof m[i] === 'string' ? decode(m[i]) : m[i];
        }
    }
    return true;
}
function resolveRecordPath(path, record) {
    return resolvePath(path, record.parent ? record.parent.path : '/', true);
}
const Time = inBrowser1 && window.performance && window.performance.now ? window.performance : Date;
function genStateKey() {
    return Time.now().toFixed(3);
}
let _key = genStateKey();
function getStateKey() {
    return _key;
}
function setStateKey(key) {
    return _key = key;
}
const positionStore = Object.create(null);
function setupScroll() {
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    const protocolAndPath = window.location.protocol + '//' + window.location.host;
    const absolutePath = window.location.href.replace(protocolAndPath, '');
    const stateCopy = extend1({
    }, window.history.state);
    stateCopy.key = getStateKey();
    window.history.replaceState(stateCopy, '', absolutePath);
    window.addEventListener('popstate', handlePopState);
    return ()=>{
        window.removeEventListener('popstate', handlePopState);
    };
}
function handleScroll(router, to, from, isPop) {
    if (!router.app) {
        return;
    }
    const behavior = router.options.scrollBehavior;
    if (!behavior) {
        return;
    }
    {
        assert(typeof behavior === 'function', `scrollBehavior must be a function`);
    }
    router.app.$nextTick(()=>{
        const position = getScrollPosition();
        const shouldScroll = behavior.call(router, to, from, isPop ? position : null);
        if (!shouldScroll) {
            return;
        }
        if (typeof shouldScroll.then === 'function') {
            shouldScroll.then((shouldScroll1)=>{
                scrollToPosition(shouldScroll1, position);
            }).catch((err)=>{
                {
                    assert(false, err.toString());
                }
            });
        } else {
            scrollToPosition(shouldScroll, position);
        }
    });
}
function saveScrollPosition() {
    const key = getStateKey();
    if (key) {
        positionStore[key] = {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    }
}
function handlePopState(e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
        setStateKey(e.state.key);
    }
}
function getScrollPosition() {
    const key = getStateKey();
    if (key) {
        return positionStore[key];
    }
}
function getElementPosition(el, offset) {
    const docEl = document.documentElement;
    const docRect = docEl.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
        x: elRect.left - docRect.left - offset.x,
        y: elRect.top - docRect.top - offset.y
    };
}
function isValidPosition(obj) {
    return isNumber(obj.x) || isNumber(obj.y);
}
function normalizePosition(obj) {
    return {
        x: isNumber(obj.x) ? obj.x : window.pageXOffset,
        y: isNumber(obj.y) ? obj.y : window.pageYOffset
    };
}
function normalizeOffset(obj) {
    return {
        x: isNumber(obj.x) ? obj.x : 0,
        y: isNumber(obj.y) ? obj.y : 0
    };
}
function isNumber(v) {
    return typeof v === 'number';
}
const hashStartsWithNumberRE = /^#\d/;
function scrollToPosition(shouldScroll, position) {
    const isObject1 = typeof shouldScroll === 'object';
    if (isObject1 && typeof shouldScroll.selector === 'string') {
        const el = hashStartsWithNumberRE.test(shouldScroll.selector) ? document.getElementById(shouldScroll.selector.slice(1)) : document.querySelector(shouldScroll.selector);
        if (el) {
            let offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {
            };
            offset = normalizeOffset(offset);
            position = getElementPosition(el, offset);
        } else if (isValidPosition(shouldScroll)) {
            position = normalizePosition(shouldScroll);
        }
    } else if (isObject1 && isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
    }
    if (position) {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                left: position.x,
                top: position.y,
                behavior: shouldScroll.behavior
            });
        } else {
            window.scrollTo(position.x, position.y);
        }
    }
}
const supportsPushState = inBrowser1 && function() {
    const ua = window.navigator.userAgent;
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
        return false;
    }
    return window.history && typeof window.history.pushState === 'function';
}();
function pushState(url, replace) {
    saveScrollPosition();
    const history = window.history;
    try {
        if (replace) {
            const stateCopy = extend1({
            }, history.state);
            stateCopy.key = getStateKey();
            history.replaceState(stateCopy, '', url);
        } else {
            history.pushState({
                key: setStateKey(genStateKey())
            }, '', url);
        }
    } catch (e) {
        window.location[replace ? 'replace' : 'assign'](url);
    }
}
function replaceState(url) {
    pushState(url, true);
}
function runQueue(queue1, fn, cb1) {
    const step = (index1)=>{
        if (index1 >= queue1.length) {
            cb1();
        } else {
            if (queue1[index1]) {
                fn(queue1[index1], ()=>{
                    step(index1 + 1);
                });
            } else {
                step(index1 + 1);
            }
        }
    };
    step(0);
}
const NavigationFailureType = {
    redirected: 2,
    aborted: 4,
    cancelled: 8,
    duplicated: 16
};
function createNavigationRedirectedError(from, to) {
    return createRouterError(from, to, NavigationFailureType.redirected, `Redirected when going from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`);
}
function createNavigationDuplicatedError(from, to) {
    const error = createRouterError(from, to, NavigationFailureType.duplicated, `Avoided redundant navigation to current location: "${from.fullPath}".`);
    error.name = 'NavigationDuplicated';
    return error;
}
function createNavigationCancelledError(from, to) {
    return createRouterError(from, to, NavigationFailureType.cancelled, `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`);
}
function createNavigationAbortedError(from, to) {
    return createRouterError(from, to, NavigationFailureType.aborted, `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`);
}
function createRouterError(from, to, type, message) {
    const error = new Error(message);
    error._isRouter = true;
    error.from = from;
    error.to = to;
    error.type = type;
    return error;
}
const propertiesToLog = [
    'params',
    'query',
    'hash'
];
function stringifyRoute(to) {
    if (typeof to === 'string') return to;
    if ('path' in to) return to.path;
    const location = {
    };
    propertiesToLog.forEach((key)=>{
        if (key in to) location[key] = to[key];
    });
    return JSON.stringify(location, null, 2);
}
function isError(err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1;
}
function isNavigationFailure(err, errorType) {
    return isError(err) && err._isRouter && (errorType == null || err.type === errorType);
}
function resolveAsyncComponents(matched) {
    return (to, from, next2)=>{
        let hasAsync = false;
        let pending1 = 0;
        let error = null;
        flatMapComponents(matched, (def1, _, match, key)=>{
            if (typeof def1 === 'function' && def1.cid === undefined) {
                hasAsync = true;
                pending1++;
                const resolve = once2((resolvedDef)=>{
                    if (isESModule(resolvedDef)) {
                        resolvedDef = resolvedDef.default;
                    }
                    def1.resolved = typeof resolvedDef === 'function' ? resolvedDef : _Vue.extend(resolvedDef);
                    match.components[key] = resolvedDef;
                    pending1--;
                    if (pending1 <= 0) {
                        next2();
                    }
                });
                const reject = once2((reason)=>{
                    const msg = `Failed to resolve async component ${key}: ${reason}`;
                    warn1(false, msg);
                    if (!error) {
                        error = isError(reason) ? reason : new Error(msg);
                        next2(error);
                    }
                });
                let res;
                try {
                    res = def1(resolve, reject);
                } catch (e) {
                    reject(e);
                }
                if (res) {
                    if (typeof res.then === 'function') {
                        res.then(resolve, reject);
                    } else {
                        const comp = res.component;
                        if (comp && typeof comp.then === 'function') {
                            comp.then(resolve, reject);
                        }
                    }
                }
            }
        });
        if (!hasAsync) next2();
    };
}
function flatMapComponents(matched, fn) {
    return flatten(matched.map((m)=>{
        return Object.keys(m.components).map((key)=>fn(m.components[key], m.instances[key], m, key)
        );
    }));
}
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
const hasSymbol1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
function isESModule(obj) {
    return obj.__esModule || hasSymbol1 && obj[Symbol.toStringTag] === 'Module';
}
function once2(fn) {
    let called = false;
    return function(...args) {
        if (called) return;
        called = true;
        return fn.apply(this, args);
    };
}
class History1 {
    constructor(router, base){
        this.router = router;
        this.base = normalizeBase(base);
        this.current = START;
        this.pending = null;
        this.ready = false;
        this.readyCbs = [];
        this.readyErrorCbs = [];
        this.errorCbs = [];
        this.listeners = [];
    }
    listen(cb) {
        this.cb = cb;
    }
    onReady(cb, errorCb) {
        if (this.ready) {
            cb();
        } else {
            this.readyCbs.push(cb);
            if (errorCb) {
                this.readyErrorCbs.push(errorCb);
            }
        }
    }
    onError(errorCb) {
        this.errorCbs.push(errorCb);
    }
    transitionTo(location, onComplete, onAbort) {
        let route;
        try {
            route = this.router.match(location, this.current);
        } catch (e) {
            this.errorCbs.forEach((cb2)=>{
                cb2(e);
            });
            throw e;
        }
        const prev = this.current;
        this.confirmTransition(route, ()=>{
            this.updateRoute(route);
            onComplete && onComplete(route);
            this.ensureURL();
            this.router.afterHooks.forEach((hook)=>{
                hook && hook(route, prev);
            });
            if (!this.ready) {
                this.ready = true;
                this.readyCbs.forEach((cb2)=>{
                    cb2(route);
                });
            }
        }, (err)=>{
            if (onAbort) {
                onAbort(err);
            }
            if (err && !this.ready) {
                if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
                    this.ready = true;
                    this.readyErrorCbs.forEach((cb2)=>{
                        cb2(err);
                    });
                }
            }
        });
    }
    confirmTransition(route, onComplete, onAbort) {
        const current = this.current;
        this.pending = route;
        const abort = (err)=>{
            if (!isNavigationFailure(err) && isError(err)) {
                if (this.errorCbs.length) {
                    this.errorCbs.forEach((cb2)=>{
                        cb2(err);
                    });
                } else {
                    warn1(false, 'uncaught error during route navigation:');
                    console.error(err);
                }
            }
            onAbort && onAbort(err);
        };
        const lastRouteIndex = route.matched.length - 1;
        const lastCurrentIndex = current.matched.length - 1;
        if (isSameRoute(route, current) && lastRouteIndex === lastCurrentIndex && route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]) {
            this.ensureURL();
            return abort(createNavigationDuplicatedError(current, route));
        }
        const { updated , deactivated , activated  } = resolveQueue(this.current.matched, route.matched);
        const queue1 = [].concat(extractLeaveGuards(deactivated), this.router.beforeHooks, extractUpdateHooks(updated), activated.map((m)=>m.beforeEnter
        ), resolveAsyncComponents(activated));
        const iterator = (hook, next2)=>{
            if (this.pending !== route) {
                return abort(createNavigationCancelledError(current, route));
            }
            try {
                hook(route, current, (to)=>{
                    if (to === false) {
                        this.ensureURL(true);
                        abort(createNavigationAbortedError(current, route));
                    } else if (isError(to)) {
                        this.ensureURL(true);
                        abort(to);
                    } else if (typeof to === 'string' || typeof to === 'object' && (typeof to.path === 'string' || typeof to.name === 'string')) {
                        abort(createNavigationRedirectedError(current, route));
                        if (typeof to === 'object' && to.replace) {
                            this.replace(to);
                        } else {
                            this.push(to);
                        }
                    } else {
                        next2(to);
                    }
                });
            } catch (e) {
                abort(e);
            }
        };
        runQueue(queue1, iterator, ()=>{
            const enterGuards = extractEnterGuards(activated);
            const queue2 = enterGuards.concat(this.router.resolveHooks);
            runQueue(queue2, iterator, ()=>{
                if (this.pending !== route) {
                    return abort(createNavigationCancelledError(current, route));
                }
                this.pending = null;
                onComplete(route);
                if (this.router.app) {
                    this.router.app.$nextTick(()=>{
                        handleRouteEntered(route);
                    });
                }
            });
        });
    }
    updateRoute(route) {
        this.current = route;
        this.cb && this.cb(route);
    }
    setupListeners() {
    }
    teardown() {
        this.listeners.forEach((cleanupListener)=>{
            cleanupListener();
        });
        this.listeners = [];
        this.current = START;
        this.pending = null;
    }
}
function normalizeBase(base1) {
    if (!base1) {
        if (inBrowser1) {
            const baseEl = document.querySelector('base');
            base1 = baseEl && baseEl.getAttribute('href') || '/';
            base1 = base1.replace(/^https?:\/\/[^\/]+/, '');
        } else {
            base1 = '/';
        }
    }
    if (base1.charAt(0) !== '/') {
        base1 = '/' + base1;
    }
    return base1.replace(/\/$/, '');
}
function resolveQueue(current, next2) {
    let i;
    const max = Math.max(current.length, next2.length);
    for(i = 0; i < max; i++){
        if (current[i] !== next2[i]) {
            break;
        }
    }
    return {
        updated: next2.slice(0, i),
        activated: next2.slice(i),
        deactivated: current.slice(i)
    };
}
function extractGuards(records, name, bind1, reverse) {
    const guards = flatMapComponents(records, (def1, instance, match, key)=>{
        const guard = extractGuard(def1, name);
        if (guard) {
            return Array.isArray(guard) ? guard.map((guard1)=>bind1(guard1, instance, match, key)
            ) : bind1(guard, instance, match, key);
        }
    });
    return flatten(reverse ? guards.reverse() : guards);
}
function extractGuard(def1, key) {
    if (typeof def1 !== 'function') {
        def1 = _Vue.extend(def1);
    }
    return def1.options[key];
}
function extractLeaveGuards(deactivated) {
    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}
function extractUpdateHooks(updated) {
    return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
}
function bindGuard(guard, instance) {
    if (instance) {
        return function boundRouteGuard() {
            return guard.apply(instance, arguments);
        };
    }
}
function extractEnterGuards(activated) {
    return extractGuards(activated, 'beforeRouteEnter', (guard, _, match, key)=>{
        return bindEnterGuard(guard, match, key);
    });
}
function bindEnterGuard(guard, match, key) {
    return function routeEnterGuard(to, from, next2) {
        return guard(to, from, (cb2)=>{
            if (typeof cb2 === 'function') {
                if (!match.enteredCbs[key]) {
                    match.enteredCbs[key] = [];
                }
                match.enteredCbs[key].push(cb2);
            }
            next2(cb2);
        });
    };
}
class HTML5History extends History1 {
    constructor(router1, base1){
        super(router1, base1);
        this._startLocation = getLocation(this.base);
    }
    setupListeners() {
        if (this.listeners.length > 0) {
            return;
        }
        const router2 = this.router;
        const expectScroll = router2.options.scrollBehavior;
        const supportsScroll = supportsPushState && expectScroll;
        if (supportsScroll) {
            this.listeners.push(setupScroll());
        }
        const handleRoutingEvent = ()=>{
            const current = this.current;
            const location = getLocation(this.base);
            if (this.current === START && location === this._startLocation) {
                return;
            }
            this.transitionTo(location, (route)=>{
                if (supportsScroll) {
                    handleScroll(router2, route, current, true);
                }
            });
        };
        window.addEventListener('popstate', handleRoutingEvent);
        this.listeners.push(()=>{
            window.removeEventListener('popstate', handleRoutingEvent);
        });
    }
    go(n) {
        window.history.go(n);
    }
    push(location, onComplete, onAbort) {
        const { current: fromRoute  } = this;
        this.transitionTo(location, (route)=>{
            pushState(cleanPath(this.base + route.fullPath));
            handleScroll(this.router, route, fromRoute, false);
            onComplete && onComplete(route);
        }, onAbort);
    }
    replace(location, onComplete, onAbort) {
        const { current: fromRoute  } = this;
        this.transitionTo(location, (route)=>{
            replaceState(cleanPath(this.base + route.fullPath));
            handleScroll(this.router, route, fromRoute, false);
            onComplete && onComplete(route);
        }, onAbort);
    }
    ensureURL(push) {
        if (getLocation(this.base) !== this.current.fullPath) {
            const current = cleanPath(this.base + this.current.fullPath);
            push ? pushState(current) : replaceState(current);
        }
    }
    getCurrentLocation() {
        return getLocation(this.base);
    }
}
function getLocation(base2) {
    let path = window.location.pathname;
    const pathLowerCase = path.toLowerCase();
    const baseLowerCase = base2.toLowerCase();
    if (base2 && (pathLowerCase === baseLowerCase || pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0)) {
        path = path.slice(base2.length);
    }
    return (path || '/') + window.location.search + window.location.hash;
}
class HashHistory extends History1 {
    constructor(router2, base2, fallback){
        super(router2, base2);
        if (fallback && checkFallback(this.base)) {
            return;
        }
        ensureSlash();
    }
    setupListeners() {
        if (this.listeners.length > 0) {
            return;
        }
        const router3 = this.router;
        const expectScroll = router3.options.scrollBehavior;
        const supportsScroll = supportsPushState && expectScroll;
        if (supportsScroll) {
            this.listeners.push(setupScroll());
        }
        const handleRoutingEvent = ()=>{
            const current = this.current;
            if (!ensureSlash()) {
                return;
            }
            this.transitionTo(getHash(), (route)=>{
                if (supportsScroll) {
                    handleScroll(this.router, route, current, true);
                }
                if (!supportsPushState) {
                    replaceHash(route.fullPath);
                }
            });
        };
        const eventType = supportsPushState ? 'popstate' : 'hashchange';
        window.addEventListener(eventType, handleRoutingEvent);
        this.listeners.push(()=>{
            window.removeEventListener(eventType, handleRoutingEvent);
        });
    }
    push(location, onComplete, onAbort) {
        const { current: fromRoute  } = this;
        this.transitionTo(location, (route)=>{
            pushHash(route.fullPath);
            handleScroll(this.router, route, fromRoute, false);
            onComplete && onComplete(route);
        }, onAbort);
    }
    replace(location, onComplete, onAbort) {
        const { current: fromRoute  } = this;
        this.transitionTo(location, (route)=>{
            replaceHash(route.fullPath);
            handleScroll(this.router, route, fromRoute, false);
            onComplete && onComplete(route);
        }, onAbort);
    }
    go(n) {
        window.history.go(n);
    }
    ensureURL(push) {
        const current = this.current.fullPath;
        if (getHash() !== current) {
            push ? pushHash(current) : replaceHash(current);
        }
    }
    getCurrentLocation() {
        return getHash();
    }
}
function checkFallback(base3) {
    const location = getLocation(base3);
    if (!/^\/#/.test(location)) {
        window.location.replace(cleanPath(base3 + '/#' + location));
        return true;
    }
}
function ensureSlash() {
    const path = getHash();
    if (path.charAt(0) === '/') {
        return true;
    }
    replaceHash('/' + path);
    return false;
}
function getHash() {
    let href = window.location.href;
    const index1 = href.indexOf('#');
    if (index1 < 0) return '';
    href = href.slice(index1 + 1);
    return href;
}
function getUrl(path) {
    const href = window.location.href;
    const i = href.indexOf('#');
    const base3 = i >= 0 ? href.slice(0, i) : href;
    return `${base3}#${path}`;
}
function pushHash(path) {
    if (supportsPushState) {
        pushState(getUrl(path));
    } else {
        window.location.hash = path;
    }
}
function replaceHash(path) {
    if (supportsPushState) {
        replaceState(getUrl(path));
    } else {
        window.location.replace(getUrl(path));
    }
}
class AbstractHistory extends History1 {
    constructor(router3, base3){
        super(router3, base3);
        this.stack = [];
        this.index = -1;
    }
    push(location, onComplete, onAbort) {
        this.transitionTo(location, (route)=>{
            this.stack = this.stack.slice(0, this.index + 1).concat(route);
            this.index++;
            onComplete && onComplete(route);
        }, onAbort);
    }
    replace(location, onComplete, onAbort) {
        this.transitionTo(location, (route)=>{
            this.stack = this.stack.slice(0, this.index).concat(route);
            onComplete && onComplete(route);
        }, onAbort);
    }
    go(n) {
        const targetIndex = this.index + n;
        if (targetIndex < 0 || targetIndex >= this.stack.length) {
            return;
        }
        const route = this.stack[targetIndex];
        this.confirmTransition(route, ()=>{
            const prev = this.current;
            this.index = targetIndex;
            this.updateRoute(route);
            this.router.afterHooks.forEach((hook)=>{
                hook && hook(route, prev);
            });
        }, (err)=>{
            if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
                this.index = targetIndex;
            }
        });
    }
    getCurrentLocation() {
        const current = this.stack[this.stack.length - 1];
        return current ? current.fullPath : '/';
    }
    ensureURL() {
    }
}
class VueRouter {
    constructor(options2 = {
    }){
        this.app = null;
        this.apps = [];
        this.options = options2;
        this.beforeHooks = [];
        this.resolveHooks = [];
        this.afterHooks = [];
        this.matcher = createMatcher(options2.routes || [], this);
        let mode = options2.mode || 'hash';
        this.fallback = mode === 'history' && !supportsPushState && options2.fallback !== false;
        if (this.fallback) {
            mode = 'hash';
        }
        if (!inBrowser1) {
            mode = 'abstract';
        }
        this.mode = mode;
        switch(mode){
            case 'history':
                this.history = new HTML5History(this, options2.base);
                break;
            case 'hash':
                this.history = new HashHistory(this, options2.base, this.fallback);
                break;
            case 'abstract':
                this.history = new AbstractHistory(this, options2.base);
                break;
            default:
                {
                    assert(false, `invalid mode: ${mode}`);
                }
        }
    }
    match(raw, current, redirectedFrom) {
        return this.matcher.match(raw, current, redirectedFrom);
    }
    get currentRoute() {
        return this.history && this.history.current;
    }
    init(app) {
        assert(install.installed, `not installed. Make sure to call \`Vue.use(VueRouter)\` ` + `before creating root instance.`);
        this.apps.push(app);
        app.$once('hook:destroyed', ()=>{
            const index1 = this.apps.indexOf(app);
            if (index1 > -1) this.apps.splice(index1, 1);
            if (this.app === app) this.app = this.apps[0] || null;
            if (!this.app) this.history.teardown();
        });
        if (this.app) {
            return;
        }
        this.app = app;
        const history = this.history;
        if (history instanceof HTML5History || history instanceof HashHistory) {
            const handleInitialScroll = (routeOrError)=>{
                const from = history.current;
                const expectScroll = this.options.scrollBehavior;
                const supportsScroll = supportsPushState && expectScroll;
                if (supportsScroll && 'fullPath' in routeOrError) {
                    handleScroll(this, routeOrError, from, false);
                }
            };
            const setupListeners = (routeOrError)=>{
                history.setupListeners();
                handleInitialScroll(routeOrError);
            };
            history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
        }
        history.listen((route)=>{
            this.apps.forEach((app)=>{
                app._route = route;
            });
        });
    }
    beforeEach(fn) {
        return registerHook(this.beforeHooks, fn);
    }
    beforeResolve(fn) {
        return registerHook(this.resolveHooks, fn);
    }
    afterEach(fn) {
        return registerHook(this.afterHooks, fn);
    }
    onReady(cb, errorCb) {
        this.history.onReady(cb, errorCb);
    }
    onError(errorCb) {
        this.history.onError(errorCb);
    }
    push(location, onComplete, onAbort) {
        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject)=>{
                this.history.push(location, resolve, reject);
            });
        } else {
            this.history.push(location, onComplete, onAbort);
        }
    }
    replace(location, onComplete, onAbort) {
        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject)=>{
                this.history.replace(location, resolve, reject);
            });
        } else {
            this.history.replace(location, onComplete, onAbort);
        }
    }
    go(n) {
        this.history.go(n);
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    getMatchedComponents(to) {
        const route = to ? to.matched ? to : this.resolve(to).route : this.currentRoute;
        if (!route) {
            return [];
        }
        return [].concat.apply([], route.matched.map((m)=>{
            return Object.keys(m.components).map((key)=>{
                return m.components[key];
            });
        }));
    }
    resolve(to, current, append) {
        current = current || this.history.current;
        const location = normalizeLocation(to, current, append, this);
        const route = this.match(location, current);
        const fullPath = route.redirectedFrom || route.fullPath;
        const base4 = this.history.base;
        const href = createHref(base4, fullPath, this.mode);
        return {
            location,
            route,
            href,
            normalizedTo: location,
            resolved: route
        };
    }
    getRoutes() {
        return this.matcher.getRoutes();
    }
    addRoute(parentOrRoute, route) {
        this.matcher.addRoute(parentOrRoute, route);
        if (this.history.current !== START) {
            this.history.transitionTo(this.history.getCurrentLocation());
        }
    }
    addRoutes(routes) {
        {
            warn1(false, 'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.');
        }
        this.matcher.addRoutes(routes);
        if (this.history.current !== START) {
            this.history.transitionTo(this.history.getCurrentLocation());
        }
    }
}
function registerHook(list, fn) {
    list.push(fn);
    return ()=>{
        const i = list.indexOf(fn);
        if (i > -1) list.splice(i, 1);
    };
}
function createHref(base4, fullPath, mode1) {
    var path = mode1 === 'hash' ? '#' + fullPath : fullPath;
    return base4 ? cleanPath(base4 + '/' + path) : path;
}
VueRouter.install = install;
VueRouter.version = '3.5.2';
VueRouter.isNavigationFailure = isNavigationFailure;
VueRouter.NavigationFailureType = NavigationFailureType;
VueRouter.START_LOCATION = START;
if (inBrowser1 && window.Vue) {
    window.Vue.use(VueRouter);
}
Vue.use(VueRouter);
const SQL = await initSqlJs({
    locateFile: (file)=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`
});
const db = new SQL.Database(new Uint8Array([]));
const HomePage = (db1)=>({
        data () {
            return {
                query: "",
                results: []
            };
        },
        template: `<div>
        <h1>UK Politics DB</h1>
        <p>Write your SQL queries into the below space and hit <code>Execute</code> to see results.</p>
        <div><textarea v-model="query"></textarea></div>
        <button v-on:click.prevent="execute">Execute</button>

        <table v-for="result in results">
            <thead>
                <tr>
                    <th v-for="column in result.columns">{{column}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in result.values">
                    <td v-for="field in row">{{field}}</td>
                </tr>
            </tbody>
        </table>
    </div>`,
        methods: {
            execute () {
                try {
                    this.results = db1.exec(this.query);
                } catch (err) {
                    alert(`Failed to execute query: ${err.message}`);
                }
            }
        }
    })
;
new Vue({
    router: new VueRouter({
        routes: [
            {
                path: "/",
                component: HomePage(db)
            }, 
        ]
    })
}).$mount("#app");
