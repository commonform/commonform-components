var assert = require('assert')
var toChild = require('../to-child')

var preamble = {content: ['preamble']}
var component = {content: ['component']}

assert.deepEqual(
  toChild({
    preamble: preamble,
    component: component
  }),
  {
    form: {
      content: [
        'As a ', {use: 'Component'}, ':',
        {form: preamble},
        {form: component}
      ]
    }
  }
)
