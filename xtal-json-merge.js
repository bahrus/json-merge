import { XtalInsertJson } from './xtal-insert-json.js';
import { define } from 'trans-render/define.js';
import { mergeDeep } from 'trans-render/mergeDeep.js';
const pass_thru_on_init = 'pass-thru-on-init';
/**
 * Deep merge passed-in JSON into JSON defined within script tag
 * @element xtal-json-merge
 */
let XtalJSONMerge = /** @class */ (() => {
    class XtalJSONMerge extends XtalInsertJson {
        // /**
        //  * If set to true, the JSON object will directly go to result during initialization, regardless of debounce value.
        //  * @type{boolean} 
        //  * @attr pass-thru-on-init
        //  */
        // passThruOnInit: boolean;
        merge(dest, src) {
            mergeDeep(dest, src);
        }
    }
    XtalJSONMerge.is = 'xtal-json-merge';
    return XtalJSONMerge;
})();
export { XtalJSONMerge };
define(XtalJSONMerge);
