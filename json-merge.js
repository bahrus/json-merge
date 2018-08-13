
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        to$(number) {
            const mod = number % 2;
            return (number - mod) / 2 + '-' + mod;
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
const input = 'input';
const with_path = 'with-path';
const delay = 'delay';
/**
 * `xtal-insert-json`
 *  Combine passed-in JSON with JSON defined within script tag
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalInsertJson extends XtallatX(HTMLElement) {
    static get is() { return 'xtal-insert-json'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            delay,
            with_path,
            input
        ]);
    }
    /**
    * @type {object}
    * An object that should be merged with the JSON inside the element
    **/
    get input() {
        return this._input;
    }
    set input(val) {
        if (this._delay) {
            setTimeout(() => {
                this._input = val;
                this.onPropChange();
            }, this._delay);
        }
        else {
            this._input = val;
            this.onPropChange();
        }
    }
    /**
     * @type {object}
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     *
     */
    get refs() {
        return this._refs;
    }
    set refs(val) {
        this._refs = val;
        delete this._objectsToMerge;
        this.onPropChange();
    }
    /**
     * @type {object}
     * ⚡merged-prop-changed
     * The result of merging the input property with the JSON inside the script tag.
     *
     */
    get mergedProp() {
        return this._mergedProp;
    }
    set mergedProp(val) {
        //this.updateResultProp(val, 'merged-prop', '_mergedProp', this._postMergeCallbackFn);
        let newVal = val;
        if (this._postMergeCallbackFn) {
            newVal = this._postMergeCallbackFn(val, this);
            if (!newVal)
                return;
        }
        this.value = this._mergedProp = newVal;
        this.de('merged-prop', { value: newVal });
    }
    /**
     * @type {function}
     * Pass in a function to handle the resulting merged object, rather than using events.
     */
    get postMergeCallbackFn() {
        return this._postMergeCallbackFn;
    }
    set postMergeCallbackFn(val) {
        this._postMergeCallbackFn;
    }
    /**
    * @type {string}
    * object inside a new empty object, with key equal to this value.
    * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
    * and with-path = 'myPath'
    * then the source object which be merged into is:
    * {myPath: {foo: 'hello', bar: 'world'}}
    */
    get withPath() {
        return this._withPath;
    }
    set withPath(val) {
        this.attr(with_path, val);
    }
    /**
     * @type {number}
     * Number of milliseconds to wait before passing the input on for processing.
     */
    get delay() {
        return this._delay;
    }
    set delay(newVal) {
        this.attr(delay, newVal.toString());
    }
    /*-------------------------------------------End Attributes -------------------------------*/
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case input:
                this.input = JSON.parse(newVal);
                break;
            case with_path:
                this._withPath = newVal;
                break;
            case delay:
                this._delay = parseFloat(newVal);
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropChange();
    }
    /**
     * @type {array}
     * The object array that is to be merged.
     */
    get objectsToMerge() { return this._objectsToMerge; }
    set objectsToMerge(val) {
        this._objectsToMerge = val;
    }
    loadJSON(callBack) {
        const scriptTag = this.querySelector('script[type="application\/json"]');
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON(callBack);
            }, 100);
            return;
        }
        const stringToParse = scriptTag.innerText;
        if (!this._objectsToMerge) {
            try {
                if (this.refs) {
                    this._objectsToMerge = JSON.parse(stringToParse, (key, val) => {
                        if (typeof val !== 'string')
                            return val;
                        if (!val.startsWith('${refs.') || !val.endsWith('}'))
                            return val;
                        const realKey = val.substring(7, val.length - 1);
                        return this.refs[realKey];
                    });
                }
                else {
                    if (!this._objectsToMerge)
                        this._objectsToMerge = JSON.parse(stringToParse);
                }
            }
            catch (e) {
                console.error("Unable to parse " + stringToParse);
            }
        }
        callBack();
        //return this._objectsToMerge;
    }
    postLoadJson(mergedObj) {
        if (this._objectsToMerge && mergedObj) {
            for (let i = 0, ii = this._objectsToMerge.length; i < ii; i++) {
                const objToMerge = this._objectsToMerge[i];
                Object.assign(mergedObj, objToMerge);
            }
        }
        this.mergedProp = mergedObj;
    }
    onPropChange() {
        if (!this._connected || this._disabled || !this._input)
            return;
        // if(typeof(this._withPath) === 'undefined') return;
        let mergedObj;
        if (this._withPath) {
            mergedObj = {};
            const splitPath = this._withPath.split('.');
            const lenMinus1 = splitPath.length - 1;
            splitPath.forEach((pathToken, idx) => {
                if (idx === lenMinus1) {
                    mergedObj[pathToken] = this._input;
                }
                else {
                    mergedObj = mergedObj[pathToken] = {};
                }
            });
        }
        else {
            mergedObj = this._input;
        }
        this.loadJSON(() => {
            this.postLoadJson(mergedObj);
        });
    }
    connectedCallback() {
        this._upgradeProperties([delay, input, 'refs', 'withPath', 'postMergeCallbackFn']);
        this._connected = true;
        this.onPropChange();
    }
}
if (!customElements.get(XtalInsertJson.is)) {
    customElements.define(XtalInsertJson.is, XtalInsertJson);
}
const pass_thru_on_init = 'pass-thru-on-init';
/**
 * `xtal-json-merge`
 *  Merge passed-in JSON into JSON defined within script tag
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalJSONMerge extends XtalInsertJson {
    static get is() { return 'xtal-json-merge'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'pass-thru-on-init',
        ]);
    }
    // _connected: boolean;
    connectedCallback() {
        this._upgradeProperties(['passThruOnInit']);
        super.connectedCallback();
        //this.onInputChange(this._input);
    }
    /**
     * @type{boolean}
     * If set to true, the JSON object will directly go to result during initialization, regardless of debounce value.
     */
    get passThruOnInit() {
        return this._passThruOnInit;
    }
    set passThruOnInit(val) {
        this.attr(pass_thru_on_init, val, '');
    }
    // _passTo: string;
    // get passTo(){
    //     return this._passTo;
    // }
    // set passTo(val){
    //     this.setAttribute(pass_to, val);
    // }
    /********************End Attributes ******************************/
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
            case pass_thru_on_init:
                this._passThruOnInit = newVal !== null;
                break;
        }
    }
    postLoadJson(mergedObj) {
        if (this._objectsToMerge && mergedObj) {
            for (let i = 0, ii = this._objectsToMerge.length; i < ii; i++) {
                const objToMerge = this._objectsToMerge[i];
                switch (typeof (objToMerge)) {
                    case 'object':
                        this.mergeDeep(mergedObj, objToMerge);
                        break;
                    default:
                        throw 'TODO:  error message';
                }
            }
        }
        this.mergedProp = mergedObj;
    }
    getParent() {
        return this.parentElement;
    }
    /**
     * Deep merge two objects.
     * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
     * @param target
     * @param source
     *
     */
    mergeDeep(target, source) {
        if (typeof target !== 'object')
            return;
        if (typeof source !== 'object')
            return;
        for (const key in source) {
            const sourceVal = source[key];
            const targetVal = target[key];
            if (!sourceVal)
                continue; //TODO:  null out property?
            if (!targetVal) {
                target[key] = sourceVal;
                continue;
            }
            if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                //warning!! code below not yet tested
                if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined')
                    continue;
                for (var i = 0, ii = sourceVal.length; i < ii; i++) {
                    const srcEl = sourceVal[i];
                }
                continue;
            }
            switch (typeof sourceVal) {
                case 'object':
                    switch (typeof targetVal) {
                        case 'object':
                            this.mergeDeep(targetVal, sourceVal);
                            break;
                        default:
                            target[key] = sourceVal;
                            break;
                    }
                    break;
                default:
                    target[key] = sourceVal;
            }
        }
        return target;
    }
}
customElements.define(XtalJSONMerge.is, XtalJSONMerge);
    })();  
        