import { xc } from 'xtal-element/lib/XtalCore.js';
/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-merge
 * @event value-changed
 *
 */
export class XtalJsonMerge extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
}
XtalJsonMerge.is = 'xtal-json-merge';
const propActions = [];
const propDefMap = {};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalJsonMerge, slicedPropDefs, 'onPropChange');
