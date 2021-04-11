import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {wrap} from 'xtal-element/lib/with-path.js';

type X = XtalJsonInsert;
/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-insert
 * @event value-changed
 *  
 */
export class XtalJsonInsert extends HTMLElement implements ReactiveSurface{
    static is = 'xtal-json-insert';

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);

    disabled: boolean | undefined;

    /**
     * @type {object}
     * ⚡inserted-prop-changed
     * The inserted the input property with the JSON inside the script tag.
     * 
     */
    value: any;

    /**
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     * @type {object}
     */
    refs: object;

    /**
     * @private
     */
    rawInsertedProp: object;




    /**
     * Pass in a function to handle the resulting merged object, rather than using events.
     * @type {function}
     * 
     */
    postInsertCallbackFn: (mergedObj: any, t: X) => any;


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
    objectToInsert: object;

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

export const parse =  ({ stringToParse, disabled, self, refs, delay }: X) => {
    if (stringToParse === undefined || disabled) return;

    setTimeout(() => {
        try {
            if (refs) {
                self.objectToInsert = JSON.parse(stringToParse, (key, val) => {
                    if (typeof val !== 'string') return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            } else {
                if (!self.objectToInsert) self.objectToInsert = JSON.parse(stringToParse);
            }
            self.stringToParse = undefined;
        } catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, delay === undefined ? 0 : delay);


};

export const wrapAndInsert =  ({ objectToInsert, withPath, self, disabled, delay }: X) => {
    if (disabled || objectToInsert === undefined) return;
    const wrappedObject = wrap(objectToInsert, withPath);
    self.rawInsertedProp = wrappedObject
};

export const postMergeCallback = ({ rawInsertedProp, self, disabled, postInsertCallbackFn: postMergeCallbackFn }: X) => {
    if (disabled || rawInsertedProp === undefined) return;
    let newVal = undefined;

    if (postMergeCallbackFn) {
        newVal = postMergeCallbackFn(rawInsertedProp, self);
        if (!newVal) return;
    }
    const val = newVal ? newVal : rawInsertedProp;
    self[slicedPropDefs.propLookup.value.alias] = val;
};

const propActions = [parse, wrapAndInsert, postMergeCallback] as PropAction[];

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
};

const objProp3: PropDef = {
    ...objProp1,
    parse: true
};

const objStr1: PropDef = {
    ...baseProp,
    type: String,
}

const propDefMap: PropDefMap<X> = {
    refs: objProp1, objectToInsert: objProp1, stringToParse: objProp1, rawInsertedProp: objProp1,
    value: objProp2
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);

xc.letThereBeProps(XtalJsonInsert, slicedPropDefs, 'onPropChange');

xc.define(XtalJsonInsert);