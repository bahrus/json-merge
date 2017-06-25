[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

# \<json-merge\>

Polymer component designed to merge JSON objects into other objects.

The primary motivation for this component is as follows:

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

Some of them, like the Vaadin grid, choose to configure this via light children.  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper it.  The configuration needs to be passed in as a property, together with the actual dynamic data.  This component helps with that, so that boilerplate code can be avoided.

It enforces the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [https://www.ampproject.org/docs/reference/components/amp-bind] (other examples of allowing JSON to be embedded within a page).

<!--
```
<custom-element-demo>
  <template>
                  <link rel="import" href="../json-merge-sync.html">
          
          <dom-module id="my-component">
            <template>
              <div>Input:</div>
              <textarea id="textA" value="{{taInput::input}}" rows="10" cols="40">
[
  {"name": "Harry Potter", "age":"13"},
  {"name": "Albus Dumbledore", "age":"279"}
]
              </textarea>
              <br>
              <div>See markup to see json text that is getting merged...</div>
              <br>
              <json-merge  watch="[[jsonInput]]" wrap-object-with-path="data" result="{{mergedObject}}">
                <script type="application/json">
                [{
                  "columns":[
                      {"id": "index",       "name": "Index",      "field": "index"},
                      {"id": "isActive",    "name": "Active",     "field": "isActive"},
                      {"id": "balance",     "name": "Balance",    "field": "balance", "formatter":  "${refs.testFormatter}"},
                      {"id": "age",         "name": "Age",        "field": "age"},
                      {"id": "eyeColor",    "name": "Eye Color",  "field": "eyeColor"},
                      {"id": "name",        "name": "Name",       "field": "name"},
                      {"id": "gender",      "name": "Gender",     "field": "gender"},
                      {"id": "company",     "name":"Company",     "field": "company"}
                  ],
                  "gridOptions":{
                      "enableCellNavigation": true,
                      "enableColumnReorder": false
                  }
                }]
                </script>
              </json-merge>
              <div>Output:</div>
              <textarea rows="15" cols="80">[[mergedObjectStringified]]</textarea>
            </template>
          </dom-module>
          <script>
            class MyComponent extends Polymer.Element{
              static get is(){return 'my-component';}
              static get properties(){
                return {
                  taInput: {
                    type: String,
                    observer: 'convertTextAreaToJSON'
                  },
                  jsonInput:{
                    type: Object
                  },
                  mergedObject:{
                    type: Object,
                    observer: 'onMergedObjectChanges'
                  },
                  mergedObjectStringified:{
                    type: String,
                  }
                }
              }
              convertTextAreaToJSON(){
                try{
                  var json = JSON.parse(this.$.textA.value);
                  this.jsonInput = json;
                }catch(e){
                  console.warn({invalidJson:e});
                }
                
              }
              onMergedObjectChanges(){
                this.mergedObjectStringified = JSON.stringify(this.mergedObject);
              }
              ready(){
                super.ready();
                this.convertTextAreaToJSON();
              }
            }
            customElements.define(MyComponent.is, MyComponent);
          </script>
          <my-component></my-component>
  </template>
</custom-element-demo>
```
-->
```html
<my-component></my-component>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
