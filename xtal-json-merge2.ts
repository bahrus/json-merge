import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {wrap} from 'xtal-element/lib/with-path.js';
import {mergeDeep} from 'trans-render/lib/mergeDeep.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
type X = XtalJsonMerge;

/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-merge
 * @event value-changed
 *  
 */
export class XtalJsonMerge extends HTMLElement implements ReactiveSurface{
    static is = 'xtal-json-merge';
    static observedAttributes = ['disabled', 'input'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);

    disabled: boolean | undefined;

    value: any;

    /**
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     * @type {object}
     */
    refs: object;

    onPropChange(n: string, prop: PropDef, newVal: any){
        this.reactor.addToQueue(prop, newVal);
    }

    /**
     * @private
     * Prior to manipulation from callback
     */
    rawMergedObject: object;

    /**
     * An object that should be merged with the JSON inside the element
     * @type {object}
     * @attr
     **/
    input: object;

    /**
     * Pass in a function to handle the resulting merged object, rather than using events.
     * @type {function}
     * 
     */
    postMergeCallbackFn: (mergedObj: any, t: XtalJsonMerge) => any;

    /**
     * Number of milliseconds to wait before passing the input on for processing.
     * @type {number}
     * 
     */
     delay: number;

    /**
     * @private
     */     
     stringToParse: string;

    /**
     * The object to insert.
     * @type {array}
     * 
     */
     objectToMergeInputInto: object;

    /**
    * object inside a new empty object, with key equal to this value.
    * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
    * and with-path = 'myPath'
    * then the source object which be merged into is:
    * {myPath: {foo: 'hello', bar: 'world'}}
    * @attr with-path
    */
    withPath!: string;

     connectedCallback(){
         this.style.display = 'none';
         xc.hydrate(this, slicedPropDefs);
         this.loadJSON();
     }

     loadJSON() {
        const scriptTag = this.querySelector('script[type="application\/json"]') as HTMLScriptElement;
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON();
            }, 100);
            return;
        }
        this.stringToParse = scriptTag.innerText;
    }


}

const linkObjectToMergeInputInto = ({stringToParse, disabled, refs, self}: X) => {
    setTimeout(() => {
        try{
            if(refs !== undefined){
                self.objectToMergeInputInto = JSON.parse(stringToParse, (key, val) => {
                    if (typeof val !== 'string') return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            }else{
                self.objectToMergeInputInto = JSON.parse(stringToParse);
            }
        }catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, self.delay ?? 0);
};

const wrapAndMerge = ({input, objectToMergeInputInto, withPath, self, disabled, delay}: X) => {
    const wrappedObject = wrap(input, withPath);
    self.rawMergedObject = mergeDeep(objectToMergeInputInto, wrappedObject);  
};

const applyCallback =({rawMergedObject, postMergeCallbackFn, self}: X) => {
    const key = slicedPropDefs.propLookup.value.alias;
    if(postMergeCallbackFn !== undefined){
        self[key] = postMergeCallbackFn(rawMergedObject, self);
    }else{
        self[key] = rawMergedObject;
    }
}

const propActions = [linkObjectToMergeInputInto, wrapAndMerge, applyCallback] as PropAction[];
const baseProp: PropDef = {
    dry: true,
    async: true,
};
const objProp1: PropDef = {
    ...baseProp,
    type: Object
};

const objProp2: PropDef = {
    ...objProp1,
    notify: true,
    obfuscate: true,
};

const objProp3: PropDef= {
    ...objProp1,
    stopReactionsIfFalsy: true,
}

const objStr1: PropDef = {
    ...baseProp,
    type: String,
}

const propDefMap: PropDefMap<X> = {
    disabled: {
        ...baseProp,
        stopReactionsIfTruthy: true
    },
    value: objProp2,
    refs: objProp1,
    rawMergedObject: objProp1,
    stringToParse: objStr1,
    withPath: objStr1,
    objectToMergeInputInto: objProp3,
    postMergeCallbackFn: objProp1,
    input: {
        ...objProp3,
        parse: true,
    }
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);

xc.letThereBeProps(XtalJsonMerge, slicedPropDefs, 'onPropChange');

xc.define(XtalJsonMerge);