import { xc } from 'xtal-element/lib/XtalCore.js';
import { wrap } from 'xtal-element/lib/with-path.js';
/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-insert
 * @event value-changed
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
export const wrapAndInsert = ({ objectToInsert, withPath, self, disabled, delay }) => {
    if (disabled || objectToInsert === undefined)
        return;
    const wrappedObject = wrap(objectToInsert, withPath);
    self.rawInsertedProp = wrappedObject;
};
export const postMergeCallback = ({ rawInsertedProp, self, disabled, postInsertCallbackFn: postMergeCallbackFn }) => {
    if (disabled || rawInsertedProp === undefined)
        return;
    let newVal = undefined;
    if (postMergeCallbackFn) {
        newVal = postMergeCallbackFn(rawInsertedProp, self);
        if (!newVal)
            return;
    }
    const val = newVal ? newVal : rawInsertedProp;
    self[slicedPropDefs.propLookup.value.alias] = val;
};
const propActions = [parse, wrapAndInsert, postMergeCallback];
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
    refs: objProp1, objectToInsert: objProp1, stringToParse: objProp1, rawInsertedProp: objProp1,
    value: objProp2
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalJsonInsert, slicedPropDefs, 'onPropChange');
xc.define(XtalJsonInsert);
