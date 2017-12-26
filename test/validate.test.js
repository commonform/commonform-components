var validate = require('../validate')
var assert = require('assert')

/* New Component Tests */

assert(
  validate.form(
    {
      content: [
        {
          heading: 'First Component',
          preamble: {content: ['This is a preamble.']},
          component: {content: ['This is a component.']}
        }
      ]
    }
  )
)

assert(
  validate.form(
    {
      content: [
        {
          // No heading
          preamble: {
            content: [
              {
                form: {
                  content: [
                    {definition: 'Company'},
                    ' means SomeCo, Inc.'
                  ]
                }
              }
            ]
          },
          component: {
            content: [
              {use: 'Company'},
              ' will do the business.'
            ]
          }
        }
      ]
    }
  )
)

/* Old Form Tests */

assert(
  validate.form(
    {
      content: [
        'Any dispute or controversy arising under this ',
        {use: 'Agreement'},
        ' (a ',
        {definition: 'Dispute'},
        ') shall be resolved exclusively by arbitration under ',
        {reference: 'Arbitration Rules'},
        ' in either:',
        {
          form: {
            content: [
              'New York City; or'
            ]
          }
        },
        {
          form: {
            content: [
              'Chicago, Illinois.'
            ]
          }
        }
      ],
      conspicuous: 'yes'
    }
  )
)

assert(
  !validate.form({
    content: []
  })
)

assert(
  validate.form(
    {
      content: [
        'New York City'
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: 'New York City'
    }
  )
)

assert(
  validate.form(
    {
      content: [
        'The product comes "as is".'
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'The product comes “as is”.'
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'The parties will litigate ',
        'in San Francisco.'
      ]
    }
  )
)

assert(
  validate.form(
    {
      content: [
        'The parties will litigate in San Francisco.'
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        ' The parties will litigate in San Francisco.'
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'The parties will litigate in San Francisco. '
      ]
    }
  )
)

assert(
  validate.definition(
    {definition: 'Applicable Law'}
  )
)

assert(
  validate.form(
    {
      content: [
        {definition: 'Securities Act'},
        ' means the Securities Act of 1933.'
      ]
    }
  )
)

assert(
  validate.form(
    {
      content: [
        'The ',
        {definition: 'Purchase Price'},
        ' is $1.00.'
      ]
    }
  )
)

assert(
  validate.use(
    {use: 'Subject Assets'}
  )
)

assert(
  validate.form(
    {
      content: [
        {use: 'Purchaser'},
        ' will place the ',
        {use: 'Subject Assets'},
        ' in escrow.'
      ]
    }
  )
)

assert(
  validate.blank(
    {blank: ''}
  )
)

assert(
  validate.form(
    {
      content: [
        'The purchase price is ',
        {blank: ''},
        '.'
      ]
    }
  )
)

assert(
  !validate.blank(
    {blank: '$10'}
  )
)

assert(
  !validate.form(
    {
      content: [
        'The parties will litigate this contract only in ',
        {blank: ''},
        {blank: ''},
        '.'
      ]
    }
  )
)

assert(
  validate.form(
    {
      content: [
        'The parties will litigate this contract only in ',
        {blank: ''},
        '.'
      ]
    }
  )
)

assert(
  validate.reference(
    {reference: 'Payment Terms'}
  )
)

assert(
  validate.form(
    {
      content: [
        'The escrow will be managed pursuant to ',
        {reference: 'Escrow Procedure'},
        '.'
      ]
    }
  )
)

assert(
  validate.child(
    {
      form: {
        content: [
          'Text in the child form.'
        ]
      }
    }
  )
)

assert(
  validate.child(
    {
      heading: 'Warranty Disclaimer',
      form: {
        content: [
          'The software comes without warranty, express or implied.'
        ],
        conspicuous: 'yes'
      }
    }
  )
)

assert(
  validate.form(
    {
      content: [
        {use: 'Confidential Information'},
        ' does not include:',
        {
          form: {
            content: [
              'public information'
            ]
          }
        },
        {
          form: {
            content: [
              'information received from others'
            ]
          }
        },
        {
          form: {
            content: [
              'independent developments'
            ]
          }
        }
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'this is a space -> ',
        {
          form: {
            content: ['child form text']
          }
        }
      ]
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        {
          form: {
            content: ['child form text']
          }
        },
        ' <- that was a space'
      ]
    }
  )
)

assert(
  validate.form(
    {
      content: [
        'Damages will be limited to $10.'
      ],
      conspicuous: 'yes'
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'Damages will be limited to $10.'
      ],
      conspicuous: true
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'Damages will be limited to $10.'
      ],
      conspicuous: null
    }
  )
)

assert(
  !validate.form(
    {
      content: [
        'There are no third-party beneficiaries.'
      ],
      extra: false
    }
  )
)

assert(
  !validate.definition({
    definition: 'Purchase Price',
    other: 'property'
  })
)

assert(
  !validate.definition({
    use: 'Purchase Price',
    plural: false
  })
)

assert(
  !validate.definition({
    reference: 'Termination',
    underline: 'dashed'
  })
)

assert(
  !validate.definition({
    blank: '',
    placeholder: 'three weeks'
  })
)

var invalidForm = function () {}
invalidForm.content = [
  'Example string content.'
]
assert(
  !validate.form(invalidForm)
)

var invalidChild = function () {}
invalidChild.form = {
  content: [
    'Example string content.'
  ]
}
assert(
  !validate.child(invalidChild)
)
