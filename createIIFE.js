const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'with-path.js', xl + 'xtal-latx.js', 'xtal-insert-json.js', 'xtal-json-merge.js'], 'json-merge.js');