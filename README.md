[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

# \<json-merge\>

json-merge is a dependency free web component.  It may make more sense to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps, as opposed to the JavaScript, code-centric / functional approach of (P)React / LitHTML / HyperHTML / SkateJS, etc.  Especially if the renderer wildly renders everything at the slightest provocation (I think).  And if you love writing boilerplate code over and over again, this component is definitely not for you.

json-merge can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

For productivity purposes, we would typically want the configuration to be as physically close to the markup tag where the grid is placed. 

[In the context of any of the code-centric frameworks mentioned above, it is anyone's guess what is meant by "declarative" these days, rendering the entire point of this component seem quaint or weird.  Sorry about that.]

Some components, like the Vaadin grid, choose to configure this via light children.  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it.  The declarative, side-effect-free configuration needs to be passed in as a property, together with the actual dynamic data.  This component helps with that, so that boilerplate / risky code can be avoided.  In particular, it a promotes a way to separate the declarative configuration from the code.

It enforces the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [https://www.ampproject.org/docs/reference/components/amp-bind](other examples of embedding JSON as part of the markup).

The JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<json-merge>
<script type="application/json">
//JSON goes here
</script>
```

During the parsing of the JSON, you can insert dynamic fields, if they are passed to the refs property of json-merge:

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="{{formatters}}" wrap-object-with-path="data" mergedObject="{{gridOptions}}">
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
<my-grid gridOptions="[[gridOptions]]"></my-grid>
```

By default, the mergedObject property / event raises an event containing the merged object.

One can raise the objection that using an event handler to pass data between components violates some philophical tenet or other, or that it is less efficient.  If this is a concern, you can instead provide a callback function, which will skip the event-based approach:

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="[[formatters]]" wrap-object-with-path="data" post-merge-callback-fn="[[renderGrid]]">
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
<my-grid gridOptions="[[gridOptions]]">
```

You can also alternatively specify where to pass it to (if you don't want to rely on whatever framework is there in the background:)

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="[[formatters]]" wrap-object-with-path="data" pass-to="myGrid{gridOptions:detail.mergedObject}">
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
<my-grid gridOptions="[[gridOptions]]">
```

The query for myGrid will begin from the parent DOM element (or shadowRoot fragment).
