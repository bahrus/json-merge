import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
/**
 * Combine passed-in JSON with JSON defined within script tag
 * @element xtal-insert-json
 *  
 */
export class XtalInsertJson extends HTMLElement implements ReactiveSurface{
    static is = 'xtal-insert-json';

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);


    value: any;

    /**
     * An object that should be merged with the JSON inside the element
     * @type {object}
     * @attr
     **/
    input: object;

    /**
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     * @type {object}
     */
    refs: object;

    rawMergedProp: object;

    /**
     * @type {object}
     * ⚡merged-prop-changed
     * The result of merging the input property with the JSON inside the script tag.
     * 
     */
    mergedProp: object;


    /**
     * Pass in a function to handle the resulting merged object, rather than using events.
     * @type {function}
     * 
     */
    postMergeCallbackFn: (mergedObj: any, t: XtalInsertJson) => any;


    /**
     * Number of milliseconds to wait before passing the input on for processing.
     * @type {number}
     * 
     */
    delay: number;

    stringToParse: string;


    /**
     * The object array that is to be merged.
     * @type {array}
     * 
     */
    objectsToMerge: object[];

    connectedCallback(){
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
    }

    onPropChange(n: string, prop: PropDef, newVal: any){
        this.reactor.addToQueue(prop, newVal);
    }

    merge(dest: object, src: object) {
        Object.assign(dest, src);
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

const parse =  ({ stringToParse, disabled, self, refs, delay }: XtalInsertJson) => {
    if (stringToParse === undefined || disabled) return;

    setTimeout(() => {
        try {
            if (refs) {
                self.objectsToMerge = JSON.parse(stringToParse, (key, val) => {
                    if (typeof val !== 'string') return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            } else {
                if (!self.objectsToMerge) self.objectsToMerge = JSON.parse(stringToParse);
            }
            self.stringToParse = undefined;
        } catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, delay === undefined ? 0 : delay);


};

const wrapAndMerge =  ({ input, objectsToMerge, withPath, self, disabled, delay }: XtalInsertJson) => {
    if (disabled || input === undefined || objectsToMerge === undefined) return;
    const wrappedObject = self.wrap(input);
    objectsToMerge.forEach(objToMerge => {
        self.merge(wrappedObject, objToMerge);
    })
    self.rawMergedProp = wrappedObject
};

const postMergeCallback = ({ rawMergedProp, self, disabled, postMergeCallbackFn }: XtalInsertJson) => {
    if (disabled || rawMergedProp === undefined) return;
    let newVal = undefined;

    if (postMergeCallbackFn) {
        newVal = postMergeCallbackFn(rawMergedProp, self);
        if (!newVal) return;
    }
    self.mergedProp = newVal ? newVal : rawMergedProp;
};

const propActions = [] as PropAction[];

const baseProp : PropDef = {
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
    echoTo: 'value'
};

const objProp3: PropDef = {
    ...objProp1,
    parse: true
};

const propDefMap: PropDefMap<XtalInsertJson> = {
    refs: objProp1, objectsToMerge: objProp1, stringToParse: objProp1, rawMergedProp: objProp1,
    mergedProp: objProp2, input: objProp3, value: objProp2
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);

xc.letThereBeProps(XtalInsertJson, slicedPropDefs, 'onPropChange');

xc.define(XtalInsertJson);