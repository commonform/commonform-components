var hash = require('commonform-hash')

var normalize = function (form, formsList) {
  var content = form.content
  var results = content.reduce(function (output, element) {
    if (element.hasOwnProperty('form')) {
      var results = normalize(element.form, output.forms)
      var child = results.object
      var newChild = {digest: child.digest}
      if (element.hasOwnProperty('heading')) {
        newChild.heading = element.heading
      }
      output.content.push(newChild)
      return {
        forms: results.forms,
        content: output.content
      }
    } else if (element.hasOwnProperty('component')) {
      var normalizedPreamble = normalize(element.preamble, output.forms)
      var preamble = normalizedPreamble.object
      var normalizedComponent = normalize(element.component, output.forms)
      var component = normalizedComponent.object
      var newElement = {
        preambleDigest: preamble.digest,
        componentDigest: component.digest
      }
      if (element.hasOwnProperty('heading')) {
        newElement.heading = element.heading
      }
      output.content.push(newElement)
      return {
        forms: output.forms,
        content: output.content
      }
    } else {
      output.content.push(element)
      return output
    }
  }, {forms: formsList, content: []})
  var newForm = {content: results.content}
  if (form.hasOwnProperty('conspicuous')) {
    newForm.conspicuous = form.conspicuous
  }
  newForm.digest = hash(newForm)
  results.forms.push(newForm)
  return {
    object: newForm,
    forms: results.forms
  }
}

module.exports = function (form) {
  var normalized = normalize(form, []).forms
  // Note the index of the last form in the list, the root.
  var rootIndex = normalized.length - 1
  return normalized.reduce(function (results, form, index) {
    var digest = form.digest
    delete form.digest
    results[digest] = form
    // Set the root digest to the 'root' property.
    if (index === rootIndex) results.root = digest
    return results
  }, {})
}
