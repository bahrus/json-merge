import { xc } from 'xtal-element/lib/XtalCore.js';
import { wrap } from 'xtal-element/lib/with-path.js';
import { mergeDeep } from 'trans-render/lib/mergeDeep.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-merge
 * @event value-changed
 *
 */
export class XtalJsonMerge extends HTMLElement {
    //https://wicg.github.io/custom-state-pseudo-class/#:~:text=A%20custom%20state%20pseudo%20class%20contains%20just%20one,like%20x-foo%3Ais%20%28%3A--state1%2C%20%3A--state2%29%2C%20x-foo%3Anot%20%28%3A--state2%29%2C%20and%20x-foo%3A--state1%3A--state2.
    constructor() {
        super();
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
        const aThis = this;
        console.log(aThis.attachInternals);
        if (aThis.attachInternals !== undefined) {
            (aThis)._internals = aThis.attachInternals();
        }
    }
    attributeChangedCallback(n, ov, nv) {
        passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
    connectedCallback() {
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
        this.loadJSON();
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
XtalJsonMerge.is = 'xtal-json-merge';
XtalJsonMerge.observedAttributes = ['disabled', 'input'];
const linkObjectToMergeInputInto = ({ stringToParse, disabled, refs, self }) => {
    setTimeout(() => {
        try {
            if (refs !== undefined) {
                self.objectToMergeInputInto = JSON.parse(stringToParse, (key, val) => {
                    if (typeof val !== 'string')
                        return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}'))
                        return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            }
            else {
                self.objectToMergeInputInto = JSON.parse(stringToParse);
            }
        }
        catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, self.delay ?? 0);
};
const wrapAndMerge = ({ input, objectToMergeInputInto, withPath, self, disabled, delay }) => {
    const wrappedObject = wrap(input, withPath);
    self.rawMergedObject = mergeDeep(objectToMergeInputInto, wrappedObject);
};
const applyCallback = ({ rawMergedObject, postMergeCallbackFn, self }) => {
    const key = slicedPropDefs.propLookup.value.alias;
    if (postMergeCallbackFn !== undefined) {
        self[key] = postMergeCallbackFn(rawMergedObject, self);
    }
    else {
        self[key] = rawMergedObject;
    }
};
const propActions = [linkObjectToMergeInputInto, wrapAndMerge, applyCallback];
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
    stopReactionsIfFalsy: true,
};
const objStr1 = {
    ...baseProp,
    type: String,
};
const propDefMap = {
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
