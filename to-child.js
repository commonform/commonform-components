module.exports = function (element) {
  var returned = {
    form: {
      content: [
        'As a ', {use: 'Component'}, ':',
        {form: element.preamble},
        {form: element.component}
      ]
    }
  }
  if (element.hasOwnProperty('heading')) {
    returned.heading = element.heading
  }
  return returned
}
