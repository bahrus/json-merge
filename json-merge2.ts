export class JSONMerge extends HTMLElement{
    static get is() { return 'json-merge'; }
    static get observedAttributes(){
        return [
            /**
             * Wrap the incoming object inside a new empty object, with key equal to this value.
             * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
             * and wrap-object-with-path = 'myPath'
             * then the source object which be merged into is:
             * {myPath: {foo: 'hello', bar: 'world'}}
             */
            'wrap-object-with-path',
            /**
             * Wait this long before passing the value
             */
            'delay',
            /**
             * If set to true, the JSON object will directly go to result during initalization
             */
            'passThruOnInit'
        ]
    }
            /**
            * Fired when a transform is in progress.
            *
            * @event transform
            */
}