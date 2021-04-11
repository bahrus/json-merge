import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {wrap} from 'xtal-element/lib/with-path.js';
import { getSlicedPropDefs } from './node_modules/xtal-element/lib/getSlicedPropDefs';

type X = XtalJsonMerge;

/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-merge
 * @event value-changed
 *  
 */
export class XtalJsonMerge extends HTMLElement{
    static is = 'xtal-json-merge';

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
    rawMergedProp: object;
}

const propActions = [] as PropAction[];

const propDefMap: PropDefMap<X> = {

};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);

xc.letThereBeProps(XtalJsonMerge, slicedPropDefs, 'onPropChange')