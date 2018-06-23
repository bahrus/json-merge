import {XtalInsertJson} from './xtal-insert-json.js';
(function () {

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
        return super.observedAttributes.concat( [

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
    * Fired when a transform is in progress.
    *
    * @event transform
    */
    
/* ----------------------------- Attributes ----------------------------------------------- */


   

    _passThruOnInit: boolean;
    /**
     * @type{boolean} 
     * If set to true, the JSON object will directly go to result during initialization, regardless of debounce value.
     */
    get passThruOnInit(){
        return this._passThruOnInit;
    }

    set passThruOnInit(val){
        this.attr(pass_thru_on_init, val, '');
m    }

    // _passTo: string;
    // get passTo(){
    //     return this._passTo;
    // }
    // set passTo(val){
    //     this.setAttribute(pass_to, val);
    // }
/********************End Attributes ******************************/
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal)
        switch (name) {
            
            case pass_thru_on_init:
                this._passThruOnInit = newVal !== null;
                break;
        }
        
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
   
    

}

customElements.define(XtalJSONMerge.is, XtalJSONMerge);

})();