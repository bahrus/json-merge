import {XtalInsertJson} from './xtal-insert-json.js';
import {define} from 'trans-render/define.js';
import {mergeDeep} from 'trans-render/mergeDeep.js';
const pass_thru_on_init = 'pass-thru-on-init';



/**
 * Deep merge passed-in JSON into JSON defined within script tag
 * @element xtal-json-merge
 */
export class XtalJSONMerge extends XtalInsertJson {

    static get is() { return 'xtal-json-merge'; }
    static get observedAttributes() {
        return super.observedAttributes.concat( [

            'pass-thru-on-init',
        ]);
    }


   // _connected: boolean;
    connectedCallback() {
        this.propUp(['passThruOnInit']);
        super.connectedCallback();
        //this.onInputChange(this._input);
    }
    /**

    
/* ----------------------------- Attributes ----------------------------------------------- */


   

    _passThruOnInit: boolean;

    get passThruOnInit(){
        return this._passThruOnInit;
    }

    /**
     * If set to true, the JSON object will directly go to result during initialization, regardless of debounce value.
     * @type{boolean} 
     * @attr pass-thru-on-init
     */
    set passThruOnInit(val){
        this.attr(pass_thru_on_init, val, '');
    }

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
                        mergeDeep(mergedObj, objToMerge);
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


   
    

}
define(XtalJSONMerge);
