var assert = require('assert')
var hash = require('commonform-hash')
var normalize = require('../normalize')

// New Component Test
function testComponent () {
  var preamble = {content: ['X']}
  var preambleDigest = hash(preamble)

  var component = {content: ['Y']}
  var componentDigest = hash(component)

  var result = {}
  result[preambleDigest] = preamble
  result[componentDigest] = component

  var heading = 'E'
  var withForms = {
    content: [
      {
        heading: heading,
        preamble: preamble,
        component: component
      }
    ]
  }
  var normalized = {
    content: [
      {
        heading: heading,
        preambleDigest: preambleDigest,
        componentDigest: componentDigest
      }
    ]
  }
  var digest = hash(normalized)
  result[digest] = normalized
  result.root = digest

  assert.deepEqual(
    normalize(withForms),
    result
  )
}

testComponent()

// Original Test

function testCommonForm () {
  var formA = {content: ['A']}
  var formADigest = hash(formA)

  var formB = {
    content: ['B'],
    conspicuous: 'yes'
  }
  var formBDigest = hash(formB)

  var formC = {content: ['C']}
  var formCDigest = hash(formC)

  var formD = {content: ['D']}
  var formDDigest = hash(formD)

  var result = {}
  result[formADigest] = formA
  result[formBDigest] = formB
  result[formCDigest] = formC
  result[formDDigest] = formD

  var first = {
    content: [
      {digest: formADigest},
      {digest: formBDigest}
    ]
  }
  var firstDigest = hash(first)
  result[firstDigest] = first

  var second = {
    content: [
      {digest: formCDigest},
      {digest: formDDigest}
    ]
  }
  var secondDigest = hash(second)
  result[secondDigest] = second

  var rootForm = {
    content: [
      {heading: 'First', digest: firstDigest},
      {digest: secondDigest}
    ]
  }
  var rootHash = hash(rootForm)
  result[hash(rootForm)] = rootForm
  result.root = rootHash

  require('assert').deepEqual(
    normalize({
      content: [
        {
          heading: 'First',
          form: {
            content: [
              {form: formA},
              {form: formB}
            ]
          }
        },
        {
          form: {
            content: [
              {form: formC},
              {form: formD}
            ]
          }
        }
      ]
    }),
    result
  )
}

testCommonForm()
