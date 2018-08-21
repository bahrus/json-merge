import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { define } from 'xtal-latx/define.js';
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
export class XtalInsertJson extends XtallatX(HTMLElement) {
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
define(XtalInsertJson);
//# sourceMappingURL=xtal-insert-json.js.map