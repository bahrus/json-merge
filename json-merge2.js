const with_path = 'with-path';
const delay = 'delay';
const pass_thru_on_init = 'pass-thru-on-init';
const input = 'input';
export class JSONMerge extends HTMLElement {
    static get is() { return 'json-merge'; }
    static get observedAttributes() {
        return [
            /**
             * Wrap the incoming object inside a new empty object, with key equal to this value.
             * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
             * and with-path = 'myPath'
             * then the source object which be merged into is:
             * {myPath: {foo: 'hello', bar: 'world'}}
             */
            'with-path',
            /**
             * Wait this long before passing the value
             */
            'delay',
            /**
             * If set to true, the JSON object will directly go to result during initialization
             */
            'pass-thru-on-init',
            input,
        ];
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
    connectedCallback() {
        this._upgradeProperties([delay, 'withPath', 'passThruOnInit', 'input', 'refs']);
    }
    /******************************  Properties ********************************8 */
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        this.onInputChange(val);
    }
    get mergedObject() {
        return this._mergedObject;
    }
    set mergedObject(val) {
        this._mergedObject = val;
        const mergedObjectChangedEvent = new CustomEvent('merged-object-changed', {
            detail: {
                value: val
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(mergedObjectChangedEvent);
    }
    get refs() {
        return this._refs;
    }
    set refs(val) {
        this._refs = val;
        //this.onPropsChange();
    }
    get withPath() {
        return this._withPath;
    }
    set withPath(val) {
        this.setAttribute(with_path, val);
    }
    get delay() {
        return this._delay;
    }
    set delay(newVal) {
        this.setAttribute(delay, newVal.toString());
    }
    get passThruOnInit() {
        return this._passThruOnInit;
    }
    set passThruOnInit(val) {
        if (val) {
            this.setAttribute(pass_thru_on_init, '');
        }
        else {
            this.removeAttribute(pass_thru_on_init);
        }
    }
    /********************End Attributes ******************************/
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case with_path:
                this._withPath = newVal;
                break;
            case pass_thru_on_init:
                this._passThruOnInit = newVal !== null;
                break;
            case delay:
                this._delay = parseFloat(newVal);
                break;
            case input:
                this.input = JSON.parse(newVal);
                break;
        }
    }
    onInputChange(newVal) {
        let mergedObj;
        if (this._withPath) {
            mergedObj = {};
            const splitPath = this._withPath.split('.');
            const lenMinus1 = splitPath.length - 1;
            splitPath.forEach((pathToken, idx) => {
                if (idx === lenMinus1) {
                    mergedObj[pathToken] = newVal;
                }
                else {
                    mergedObj = mergedObj[pathToken] = {};
                }
            });
        }
        else {
            mergedObj = newVal;
        }
        this.loadJSON(() => {
            this.postLoadJson(mergedObj);
        });
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
        this.mergedObject = mergedObj;
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
                            console.log(key);
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
    loadJSON(callBack) {
        const scriptTag = this.querySelector('script[type="application\/json"]');
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON(callBack);
            }, 100);
            return;
        }
        const stringToParse = scriptTag.innerText;
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
                this._objectsToMerge = JSON.parse(stringToParse);
            }
        }
        catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
        callBack();
        //return this._objectsToMerge;
    }
}
customElements.define(JSONMerge.is, JSONMerge);
//# sourceMappingURL=json-merge2.js.map