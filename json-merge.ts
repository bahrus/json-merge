(function () {
const with_path = 'with-path';
const delay = 'delay';
const pass_thru_on_init = 'pass-thru-on-init';
const input = 'input';
const pass_to = 'pass-to';
interface ICssKeyMapper{
    cssSelector: string;
    propMapper: {[key: string]: string[]}
}
class JSONMerge extends HTMLElement {

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
            pass_to,
        ]
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
        this._upgradeProperties([delay, 'withPath', 'passThruOnInit', 'input', 'refs', pass_to]);
        this._connected = true;
        this.onInputChange(this._input);
    }
    /**
    * Fired when a transform is in progress.
    *
    * @event transform
    */
    _input: object;
/******************************  Properties ********************************8 */
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        this.onInputChange(val);
    }

    _mergedProp: object;
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
            composed: true,
        } as CustomEventInit);
        if(this.cssKeyMappers){
            this.cssKeyMappers.forEach(cssKeyMapper =>{
                const targetEls = this.getParent().querySelectorAll(cssKeyMapper.cssSelector);
                for(let i = 0, ii = targetEls.length; i < ii; i++){
                    const targetEl = targetEls[i];
                    for(var key in cssKeyMapper.propMapper){
                        const pathSelector = cssKeyMapper.propMapper[key];
                        let context = mergedObjectChangedEvent;
                        pathSelector.forEach(path =>{
                            if(context) context = context[path];
                        });
                        targetEl[key] = context;
                    }
                }
            })
        }
        this.dispatchEvent(mergedObjectChangedEvent);
    }

    _refs: object;
    get refs() {
        return this._refs;
    }
    set refs(val) {
        this._refs = val;
        //this.onPropsChange();
    }


/**********************End properties **************************************/
/******************** Attributes *********************** */
    _withPath: string;
    get withPath() {
        return this._withPath;
    }
    set withPath(val) {
        this.setAttribute(with_path, val);
    }

    _delay: number;
    get delay(){
        return this._delay;
    }
    set delay(newVal: number){
        this.setAttribute(delay, newVal.toString());
    }

    _passThruOnInit: boolean;
    get passThruOnInit(){
        return this._passThruOnInit;
    }

    set passThruOnInit(val){
        if(val){
            this.setAttribute(pass_thru_on_init, '');
        }else{
            this.removeAttribute(pass_thru_on_init);
        } 
    }

    _passTo: string;
    get passTo(){
        return this._passTo;
    }
    set passTo(val){
        this.setAttribute(pass_to, val);
    }
/********************End Attributes ******************************/
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
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
            case pass_to:
                this._passTo = newVal;
                if(newVal){
                    this.parsePassTo();
                }else{
                    this.cssKeyMappers = null;
                }
                
                break;
        }
        
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

    postLoadJson(mergedObj){
        if (this._objectsToMerge && mergedObj) {
            for (let i = 0, ii = this._objectsToMerge.length; i < ii; i++) {
                const objToMerge = this._objectsToMerge[i];
                switch (typeof (objToMerge)) {
                    case 'object':
                        this.mergeDeep(mergedObj, objToMerge);
                        break;
                    default:
                        throw 'TODO:  error message'

                }
            }
        }

        this.mergedProp = mergedObj;
    }

    getParent(){
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
        if (typeof target !== 'object') return;
        if (typeof source !== 'object') return;
        for (const key in source) {
            const sourceVal = source[key];
            const targetVal = target[key];
            if (!sourceVal) continue; //TODO:  null out property?
            if (!targetVal) {
                target[key] = sourceVal;
                continue;
            }
            if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                //warning!! code below not yet tested
                if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined') continue;
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
    cssKeyMappers : ICssKeyMapper[];
    parsePassTo(){
        // const iPosOfOpenBrace = this._passTo.lastIndexOf('{');
        // if(iPosOfOpenBrace < 0) return;
        this.cssKeyMappers = [];
        const endsWithBrace = this._passTo.endsWith('}');
        const adjustedPassTo = this._passTo + (endsWithBrace ? ';' : '');
        const splitPassTo = adjustedPassTo.split('};');
        splitPassTo.forEach(passTo =>{
            const splitPassTo2 = passTo.split('{');
            const tokens = splitPassTo2[1].split(';');
            const propMapper = {};
            tokens.forEach(token =>{
                const nameValuePair = token.split(':');
                propMapper[nameValuePair[0]] = nameValuePair[1].split('.');
            })
            this.cssKeyMappers.push({
                cssSelector: splitPassTo2[0],
                propMapper: propMapper
            });
        })
        // this._cssSelector = this._passTo.substr(0, iPosOfOpenBrace);
        // const propMapperString = this._passTo.substring(iPosOfOpenBrace + 1, this._passTo.length - 1);
        
    }
}

customElements.define(JSONMerge.is, JSONMerge);

})();