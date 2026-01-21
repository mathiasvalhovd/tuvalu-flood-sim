export const flowchartNodes = [
  {
    id: 'registration',
    step: 1,
    title: 'Registration',
    shortDescription: 'Enter the ballot lottery',
    icon: 'clipboard',
    position: { x: 50, y: 8 },
    costs: {
      amount: 25,
      currency: 'AUD',
      refundable: false
    },
    timing: 'June - July (1 month window)',
    details: [
      'Submit application during open ballot window',
      'Non-refundable registration fee of $25 AUD',
      'Must hold valid Tuvaluan passport',
      'Must be 18 years or older',
      'Can include dependants in registration'
    ],
    familyExample: {
      text: 'Tavita and Mele register their family of three, paying $25 AUD. They wait anxiously for results, knowing only 280 families will be selected.',
      emotion: 'hopeful'
    },
    next: ['ballot-result']
  },
  {
    id: 'ballot-result',
    step: 2,
    title: 'Ballot Lottery',
    shortDescription: '280 slots drawn randomly',
    icon: 'lottery',
    position: { x: 50, y: 28 },
    costs: null,
    timing: 'Results announced after ballot closes',
    details: [
      'Random selection from all registrants',
      'Only 280 visas available per year',
      'Selection is not guaranteed',
      'No priority given for previous attempts'
    ],
    familyExample: {
      text: 'The family checks results online. Their hearts race as they search for their registration number among the 280 selected.',
      emotion: 'anxious'
    },
    next: ['selected', 'not-selected']
  },
  {
    id: 'selected',
    step: '3a',
    title: 'Selected',
    shortDescription: 'Proceed to visa application',
    icon: 'check',
    position: { x: 30, y: 48 },
    branch: 'success',
    costs: null,
    timing: '60 days to apply from notification',
    details: [
      'Notification sent to successful applicants',
      'Must apply within strict 60-day window',
      'No extensions granted',
      'Begin gathering required documents immediately'
    ],
    familyExample: {
      text: 'Joy! The Apinelu family is selected. But the clock starts now—they only have 60 days to complete everything.',
      emotion: 'relieved'
    },
    next: ['visa-application']
  },
  {
    id: 'not-selected',
    step: '3b',
    title: 'Not Selected',
    shortDescription: 'Can re-register next year',
    icon: 'retry',
    position: { x: 70, y: 48 },
    branch: 'retry',
    costs: {
      amount: 25,
      currency: 'AUD',
      refundable: false,
      note: 'Must pay again to re-enter'
    },
    timing: 'Wait until next ballot window',
    details: [
      'Registration fee is not refunded',
      'Can apply again in subsequent years',
      'No priority given for previous attempts',
      'Must pay full registration fee again'
    ],
    familyExample: {
      text: 'In this scenario, the family is not selected. Their $25 is gone, and they must wait another year—then pay again to try once more.',
      emotion: 'disappointed'
    },
    next: ['registration']
  },
  {
    id: 'visa-application',
    step: 4,
    title: 'Visa Application',
    shortDescription: 'Submit documents and fees',
    icon: 'document',
    position: { x: 30, y: 68 },
    branch: 'success',
    costs: {
      primary: { amount: 200, currency: 'AUD', refundable: false },
      dependant: { amount: 50, currency: 'AUD', refundable: false, per: 'person' },
      example: 'Family of 3: $200 + $100 = $300'
    },
    timing: 'Within the 60-day window',
    details: [
      'Primary applicant: $200 AUD visa fee',
      'Each dependant: $50 AUD visa fee',
      'Health assessments required (additional cost)',
      'Character checks required',
      'All fees are non-refundable'
    ],
    familyExample: {
      text: 'The family pays $200 for Tavita, plus $50 each for Mele and their daughter Litia. Total visa cost: $300 AUD—plus health examinations.',
      emotion: 'determined'
    },
    next: ['relocation']
  },
  {
    id: 'relocation',
    step: 5,
    title: 'Relocation',
    shortDescription: 'Move to Australia',
    icon: 'plane',
    position: { x: 30, y: 88 },
    branch: 'success',
    costs: {
      items: [
        { name: 'Flights', note: 'Self-funded' },
        { name: 'Accommodation', note: 'Self-funded' },
        { name: 'Living expenses', note: 'Self-funded' }
      ]
    },
    timing: 'After visa approval',
    details: [
      'All relocation costs are entirely self-funded',
      'No government assistance for moving',
      'Must arrange own flights from Tuvalu',
      'Must secure initial accommodation',
      'Need savings for living expenses until employed'
    ],
    familyExample: {
      text: 'The family sells what they can, says goodbye to their island home, and boards a flight to Australia. They arrive with hope—but limited savings to start their new life.',
      emotion: 'bittersweet'
    },
    next: null
  }
]

export const flowchartConnections = [
  { from: 'registration', to: 'ballot-result', type: 'solid' },
  { from: 'ballot-result', to: 'selected', type: 'solid', label: 'Selected' },
  { from: 'ballot-result', to: 'not-selected', type: 'dashed', label: 'Not Selected' },
  { from: 'selected', to: 'visa-application', type: 'solid' },
  { from: 'not-selected', to: 'registration', type: 'dashed', label: 'Re-apply', curved: true },
  { from: 'visa-application', to: 'relocation', type: 'solid' }
]

export const costSummary = {
  minimum: {
    singlePerson: {
      registration: 25,
      visa: 200,
      total: 225
    },
    familyOfThree: {
      registration: 25,
      visa: 300,
      total: 325
    }
  },
  additional: [
    'Health assessments',
    'Character checks',
    'Flights to Australia',
    'Initial accommodation',
    'Living expenses until employment'
  ],
  warning: 'All fees are non-refundable—even if not selected or visa is denied'
}

export const familyProfile = {
  names: {
    father: 'Tavita',
    mother: 'Mele',
    daughter: 'Litia'
  },
  description: 'A Tuvaluan family of three navigating the Falepili Union pathway',
  image: '/images/story/P1.jpg'
}
