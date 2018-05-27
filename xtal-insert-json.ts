
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
export class XtalInsertJson extends HTMLElement{
    static get is() { return 'xtal-insert-json';}
    static get observedAttributes() {
        return [
           delay, 
           with_path,
           input
        ];
    }
    /*----------------------------------------- Properties ------------------------------------ */
    _input: object;
     /**
     * @type {object}
     * An object that should be merged with the JSON inside the element
     **/
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        if(this._delay){
            setTimeout(() =>{
                this.onInputChange(val);
            }, this._delay);
        }else{
            this.onInputChange(val);
        }
        
    }

    _refs: object;
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
        //this.onPropsChange();
    }

    _mergedProp: object;
    /**
     * @type {object}
     * The result of merging the input property with the JSON inside the script tag.
     */
    get mergedProp() {
        return this._mergedProp;
    }
    set mergedProp(val) {
        this._mergedProp = val;
        const mergedObjectChangedEvent = new CustomEvent('merged-prop-changed', {
            detail:{
                value: val
            },
            bubbles: true,
            composed: false,
        } as CustomEventInit);
        this.dispatchEvent(mergedObjectChangedEvent);
    }
    /*------------------------------------------End properties ----------------------------------*/
    /*----------------------------------------- Attributes --------------------------------------*/
    _withPath: string;
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
        this.setAttribute(with_path, val);
    }
    _delay: number;
    /**
     * @type {number}
     * Number of milliseconds to wait before passing the input on for processing.
     */
    get delay(){
        return this._delay;
    }
    set delay(newVal: number){
        this.setAttribute(delay, newVal.toString());
    }

    /*-------------------------------------------End Attributes -------------------------------*/
    
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
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
    }
    _objectsToMerge: Function[];
    loadJSON(callBack: any) {
        const scriptTag = this.querySelector('script[type="application\/json"]') as HTMLScriptElement;
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
                    if (typeof val !== 'string') return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                    const realKey = val.substring(7, val.length - 1);
                    return this.refs[realKey];
                });
            } else {
                this._objectsToMerge = JSON.parse(stringToParse);
            }

        } catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
        callBack();
        //return this._objectsToMerge;
    }
    postLoadJson(mergedObj){
        if (this._objectsToMerge && mergedObj) {
            for (let i = 0, ii = this._objectsToMerge.length; i < ii; i++) {
                const objToMerge = this._objectsToMerge[i];
                Object.assign(mergedObj, objToMerge);
            }
        }

        this.mergedProp = mergedObj;
    }
    onInputChange(newVal){
        if(!this._connected) return;
        let mergedObj;
        if (this._withPath) {
            mergedObj = {};
            const splitPath = this._withPath.split('.');
            const lenMinus1 = splitPath.length - 1;
            splitPath.forEach((pathToken, idx) => {
                if(idx === lenMinus1){
                    mergedObj[pathToken] = newVal;
                }else{
                    mergedObj = mergedObj[pathToken] = {};
                }
            })
        } else {
            mergedObj = newVal;
        }
        this.loadJSON(() =>{
            this.postLoadJson(mergedObj);
        });

    }
    _upgradeProperties(props: string[]) {
        props.forEach(prop => {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        })

    }
    _connected: boolean;
    connectedCallback() {
        this._upgradeProperties([delay, input, 'refs', 'withPath']);
        this._connected = true;
        this.onInputChange(this._input);
    }
}
if(!customElements.get(XtalInsertJson.is)){
    customElements.define(XtalInsertJson.is, XtalInsertJson);
}