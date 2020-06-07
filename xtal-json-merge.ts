import {XtalInsertJson} from './xtal-insert-json.js';
import {define} from 'trans-render/define.js';
import {mergeDeep} from 'trans-render/mergeDeep.js';
const pass_thru_on_init = 'pass-thru-on-init';



/**
 * Deep merge passed-in JSON into JSON defined within script tag
 * @element xtal-json-merge
 */
export class XtalJSONMerge extends XtalInsertJson {

    static is = 'xtal-json-merge'; 

    // /**
    //  * If set to true, the JSON object will directly go to result during initialization, regardless of debounce value.
    //  * @type{boolean} 
    //  * @attr pass-thru-on-init
    //  */
    // passThruOnInit: boolean;


    merge(dest: object, src: object){
        mergeDeep(dest, src);
    }



    

}
define(XtalJSONMerge);
