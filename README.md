[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

# \<json-merge\>

json-merge is a dependency free web component.  It may make more sense to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps, as opposed to the JavaScript, code-centric / functional approach of (P)React / LitHTML / HyperHTML / SkateJS, etc.  

It's also useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

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
<json-merge  input="[[jsonInput]]" refs="{{formatters}}" wrap-object-with-path="data" mergedObject="{{mergedObject}}">
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
```

