var array = require('is-array')
var contiguous = require('contiguous')
var object = require('is-object')
var string = require('is-string')

var keyCount = function (argument) {
  return Object.keys(argument).length
}

var hasProperty = function (argument, key, predicate) {
  return (
    argument.hasOwnProperty(key) &&
    predicate(argument[key])
  )
}

var text = (function () {
  var ASCII_PRINTABLE_RE = /^[\x20-\x7E]*$/

  return function (argument) {
    return (
      string(argument) &&
      argument.length > 0 &&
      argument.indexOf('  ') < 0 &&
      ASCII_PRINTABLE_RE.test(argument)
    )
  }
})()

var term = function (argument) {
  return (
    text(argument) &&
    argument[0] !== ' ' &&
    argument[argument.length - 1] !== ' '
  )
}

var simpleObject = function (permittedKey) {
  return function (argument) {
    return (
      object(argument) &&
      keyCount(argument) === 1 &&
      hasProperty(argument, permittedKey, term)
    )
  }
}

exports.term = exports.heading = exports.value = term

var definition = exports.definition = simpleObject('definition')
var reference = exports.reference = simpleObject('reference')
var use = exports.use = simpleObject('use')

function isEmptyString (argument) {
  return argument === ''
}

var blank = exports.blank = function (argument) {
  return (
    object(argument) &&
    keyCount(argument) === 1 &&
    hasProperty(argument, 'blank', isEmptyString) &&
    true
  )
}

var form

var child = exports.child = function (argument) {
  return (
    object(argument) &&
    hasProperty(argument, 'form', form) &&
    (
      keyCount(argument) === 1 ||
      (
        keyCount(argument) === 2 &&
        hasProperty(argument, 'heading', term)
      )
    ) &&
    true
  )
}

var component = exports.component = function (argument) {
  return (
    object(argument) &&
    hasProperty(argument, 'preamble', form) &&
    hasProperty(argument, 'component', form) &&
    (
      keyCount(argument) === 2 ||
      (
        keyCount(argument) === 3 &&
        hasProperty(argument, 'heading', term)
      )
    ) &&
    true
  )
}

var content = exports.content = (function () {
  var predicates = [blank, child, component, definition, reference, text, use]

  return function (argument) {
    return predicates.some(function (predicate) {
      return predicate(argument)
    })
  }
})()

form = exports.form = (function () {
  var leadingSpaceString = function (argument) {
    return (
      string(argument) &&
      argument[0] === ' '
    )
  }

  var terminalSpaceString = function (argument) {
    return (
      string(argument) &&
      argument[argument.length - 1] === ' '
    )
  }

  var looksLikeAChild = function (argument) {
    return argument.hasOwnProperty('form')
  }

  var spaceAbuttingChild = function (elements) {
    var lastIndex = elements.length - 1
    return elements.some(function (element, index, list) {
      if (!string(element)) {
        return false
      } else {
        if (index > 0) {
          var elementBefore = list[index - 1]
          var childBefore = looksLikeAChild(elementBefore)
          if (childBefore && leadingSpaceString(element)) {
            return true
          }
        }
        if (index < lastIndex) {
          var elementAfter = list[index + 1]
          var childAfter = looksLikeAChild(elementAfter)
          if (childAfter && terminalSpaceString(element)) {
            return true
          }
        }
        return false
      }
    })
  }

  return function (argument) {
    return (
      object(argument) &&
      hasProperty(argument, 'content', function (elements) {
        return (
          array(elements) &&
          elements.length > 0 &&
          elements.every(content) &&
          !contiguous(elements, string) &&
          !contiguous(elements, blank) &&
          !spaceAbuttingChild(elements) &&
          !leadingSpaceString(elements[0]) &&
          !terminalSpaceString(elements[elements.length - 1])
        )
      }) &&
      (
        keyCount(argument) === 1 ||
        (
          keyCount(argument) === 2 &&
          argument.conspicuous === 'yes'
        )
      ) &&
      true
    )
  }
})()
