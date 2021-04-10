import { xc } from 'xtal-element/lib/XtalCore.js';
import { wrap } from 'xtal-element/lib/with-path.js';
/**
 * Parse and publish JSON contained inside.
 * @element xtal-json-insert
 *
 */
export class XtalJsonInsert extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    connectedCallback() {
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
        this.loadJSON();
    }
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
    merge(dest, src) {
        Object.assign(dest, src);
    }
    loadJSON() {
        const scriptTag = this.querySelector('script[type="application\/json"]');
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON();
            }, 100);
            return;
        }
        this.stringToParse = scriptTag.innerText;
    }
}
XtalJsonInsert.is = 'xtal-json-insert';
export const parse = ({ stringToParse, disabled, self, refs, delay }) => {
    if (stringToParse === undefined || disabled)
        return;
    setTimeout(() => {
        try {
            if (refs) {
                self.objectToInsert = JSON.parse(stringToParse, (key, val) => {
                    if (typeof val !== 'string')
                        return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}'))
                        return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            }
            else {
                if (!self.objectToInsert)
                    self.objectToInsert = JSON.parse(stringToParse);
            }
            self.stringToParse = undefined;
        }
        catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, delay === undefined ? 0 : delay);
};
export const wrapAndMerge = ({ objectToInsert, withPath, self, disabled, delay }) => {
    if (disabled || objectToInsert === undefined)
        return;
    const wrappedObject = wrap(objectToInsert, withPath);
    self.rawMergedProp = wrappedObject;
};
export const postMergeCallback = ({ rawMergedProp, self, disabled, postMergeCallbackFn }) => {
    if (disabled || rawMergedProp === undefined)
        return;
    let newVal = undefined;
    if (postMergeCallbackFn) {
        newVal = postMergeCallbackFn(rawMergedProp, self);
        if (!newVal)
            return;
    }
    const val = newVal ? newVal : rawMergedProp;
    self[slicedPropDefs.propLookup.mergedProp.alias] = val;
    self[slicedPropDefs.propLookup.value.alias] = val;
};
const propActions = [parse, wrapAndMerge, postMergeCallback];
const baseProp = {
    dry: true,
    async: true,
};
const objProp1 = {
    ...baseProp,
    type: Object
};
const objProp2 = {
    ...objProp1,
    notify: true,
    obfuscate: true,
};
const objProp3 = {
    ...objProp1,
    parse: true
};
const objStr1 = {
    ...baseProp,
    type: String,
};
const propDefMap = {
    refs: objProp1, objectToInsert: objProp1, stringToParse: objProp1, rawMergedProp: objProp1,
    mergedProp: objProp2, value: objProp2
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalJsonInsert, slicedPropDefs, 'onPropChange');
xc.define(XtalJsonInsert);
