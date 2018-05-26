import {XtalInsertJson} from './xtal-insert-json.js';
(function () {
const delay = 'delay';
const pass_thru_on_init = 'pass-thru-on-init';

const pass_to = 'pass-to';
interface ICssKeyMapper{
    cssSelector: string;
    propMapper: {[key: string]: string[]}
}
class XtalJSONMerge extends XtalInsertJson {

    static get is() { return 'xtal-json-merge'; }
    static get observedAttributes() {
        return super.observedAttributes.concat( [
            /**
             * Wait this long before passing the value
             */
            'delay',
            /**
             * If set to true, the JSON object will directly go to result during initialization
             */
            'pass-thru-on-init',
            pass_to,
        ]);
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
   // _connected: boolean;
    connectedCallback() {
        this._upgradeProperties([delay, 'withPath', 'passThruOnInit', 'refs', pass_to, 'postMergeCallbackFn']);
        super.connectedCallback();
        //this.onInputChange(this._input);
    }
    /**
    * Fired when a transform is in progress.
    *
    * @event transform
    */
    
/******************************  Properties ********************************8 */
    

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
            composed: false,
        } as CustomEventInit);
        if(this._postMergeCallbackFn){
            this._postMergeCallbackFn(mergedObjectChangedEvent, this);
            return;
        }
        if(this.cssKeyMappers){
            this.cssKeyMappers.forEach(cssKeyMapper =>{
                const targetEls = this.getParent().querySelectorAll(cssKeyMapper.cssSelector);
                for(let i = 0, ii = targetEls.length; i < ii; i++){
                    const targetEl = targetEls[i];
                    for(const key in cssKeyMapper.propMapper){
                        const pathSelector = cssKeyMapper.propMapper[key];
                        let context = mergedObjectChangedEvent;
                        pathSelector.forEach(path =>{
                            if(context) context = context[path];
                        });
                        targetEl[key] = context;
                    }
                }
            })
            return;
        }
        this.dispatchEvent(mergedObjectChangedEvent);
    }



    _postMergeCallbackFn: (c: CustomEvent, t: XtalJSONMerge) => void;
    get postMergeCallbackFn(){
        return this._postMergeCallbackFn;
    }
    set postMergeCallbackFn(val){
        this._postMergeCallbackFn;
    }

/**********************End properties **************************************/
/******************** Attributes *********************** */


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
        super.attributeChangedCallback(name, oldVal, newVal)
        switch (name) {
            
            case pass_thru_on_init:
                this._passThruOnInit = newVal !== null;
                break;
            case delay:
                this._delay = parseFloat(newVal);
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
   
    
    cssKeyMappers : ICssKeyMapper[];
    parsePassTo(){
        // const iPosOfOpenBrace = this._passTo.lastIndexOf('{');
        // if(iPosOfOpenBrace < 0) return;
        this.cssKeyMappers = [];
        const endsWithBrace = this._passTo.endsWith('}');
        const adjustedPassTo = this._passTo + (endsWithBrace ? ';' : '');
        const splitPassTo = adjustedPassTo.split('};');
        splitPassTo.forEach(passTo =>{
            if(!passTo) return;
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
        
    }
}

customElements.define(XtalJSONMerge.is, XtalJSONMerge);

})();