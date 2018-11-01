import {XtalInsertJson} from './xtal-insert-json.js';
import {define} from 'xtal-latx/define.js';
import {mergeDeep} from 'xtal-latx/mergeDeep.js'
const pass_thru_on_init = 'pass-thru-on-init';



/**
 * `xtal-json-merge`
 *  Merge passed-in JSON into JSON defined within script tag
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
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
    }

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
