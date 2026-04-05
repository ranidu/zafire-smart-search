
const mockAccounts = [
  { accountNo: 'ACC-001', holderName: 'John Tan Wei Ming', status: 'Active', type: 'Savings' },
  { accountNo: 'ACC-002', holderName: 'John Lim Ah Kow', status: 'Active', type: 'Current' },
  { accountNo: 'ACC-003', holderName: 'Sarah Chen Mei Ling', status: 'Closed', type: 'Savings' },
  { accountNo: 'ACC-004', holderName: 'David Wong Kok Keong', status: 'Frozen', type: 'Fixed Deposit' },
  { accountNo: 'ACC-005', holderName: 'Priya Nair Suresh', status: 'Active', type: 'Savings' },
]

const mockCustomers = [
  { customerId: 'CUST-001', fullName: 'John Tan Wei Ming', segment: 'Premium', kycStatus: 'Verified' },
  { customerId: 'CUST-002', fullName: 'Sarah Chen Mei Ling', segment: 'Standard', kycStatus: 'Pending' },
  { customerId: 'CUST-003', fullName: 'Rahul Sharma', segment: 'Private Banking', kycStatus: 'Verified' },
  { customerId: 'CUST-004', fullName: 'Lisa Johansson', segment: 'Premium', kycStatus: 'Verified' },
  { customerId: 'CUST-005', fullName: 'Ahmad bin Hassan', segment: 'Standard', kycStatus: 'Expired' },
]

const mockTransactions = [
  { txnId: 'TXN-001', description: 'Wire Transfer to HSBC', date: '01 Apr 2026', amount: 'SGD 15,000', status: 'Completed' },
  { txnId: 'TXN-002', description: 'FX Conversion USD/SGD', date: '31 Mar 2026', amount: 'USD 8,500', status: 'Completed' },
  { txnId: 'TXN-003', description: 'Wire Transfer to DBS', date: '30 Mar 2026', amount: 'SGD 3,200', status: 'Pending' },
  { txnId: 'TXN-004', description: 'SWIFT Payment to Barclays', date: '28 Mar 2026', amount: 'GBP 5,000', status: 'Failed' },
  { txnId: 'TXN-005', description: 'FX Conversion EUR/SGD', date: '27 Mar 2026', amount: 'EUR 2,000', status: 'Completed' },
]

const mapAccount = (item) => ({
  id: item.accountNo,
  type: 'account',
  title: item.holderName,
  subtitle: item.accountNo,
  badge: item.status,
  metadata: { accountType: item.type },
})

const mapCustomer = (item) => ({
  id: item.customerId,
  type: 'customer',
  title: item.fullName,
  subtitle: item.customerId,
  badge: item.kycStatus,
  metadata: { segment: item.segment },
})

const mapTransaction = (item) => ({
  id: item.txnId,
  type: 'transaction',
  title: item.description,
  subtitle: item.date,
  badge: item.amount,
  metadata: { status: item.status },
})

const filters = [
  { id: 'account', label: 'Accounts', value: 'account' },
  { id: 'customer', label: 'Customers', value: 'customer' },
  { id: 'transaction', label: 'Transactions', value: 'transaction' },
]

const datasetMap = {
  account: { data: mockAccounts, mapper: mapAccount, searchField: 'holderName' },
  customer: { data: mockCustomers, mapper: mapCustomer, searchField: 'fullName' },
  transaction: { data: mockTransactions, mapper: mapTransaction, searchField: 'description' },
}

let activeFilter = null // null = All

function search(query, filterValue) {
  const q = query.toLowerCase()

  if (filterValue && datasetMap[filterValue]) {
    const { data, mapper, searchField } = datasetMap[filterValue]
    return data
      .filter(item => item[searchField].toLowerCase().includes(q))
      .map(mapper)
  }

  return Object.values(datasetMap).flatMap(({ data, mapper, searchField }) =>
    data
      .filter(item => item[searchField].toLowerCase().includes(q))
      .map(mapper)
  )
}

const smartSearch = document.getElementById('smartSearch')
const eventLog = document.getElementById('eventLog')
const themeToggle = document.getElementById('themeToggle')

smartSearch.filters = filters

smartSearch.addEventListener('searchChange', (e) => {
  const { query, filter } = e.detail

  if (!query.trim()) {
    smartSearch.results = []
    return
  }

  const results = search(query, filter)
  smartSearch.results = results
})

smartSearch.addEventListener('searchFilter', (e) => {
  activeFilter = e.detail?.filter?.value ?? null
})

smartSearch.addEventListener('searchClear', () => {
  smartSearch.results = []
})

smartSearch.addEventListener('searchSelect', (e) => {
  const result = e.detail?.result
  if (!result) return

  const selectedCard = document.getElementById('selectedCard')
  const selectedResult = document.getElementById('selectedResult')

  const metaEntries = Object.entries(result.metadata || {})
    .map(([k, v]) => `<span class="selected-result__meta-key">${k}:</span> <span class="selected-result__meta-value">${v}</span>`)
    .join('')

  selectedResult.innerHTML = `
    <div class="selected-result__row">
      <span class="selected-result__type">${result.type}</span>
      <span class="selected-result__badge">${result.badge ?? ''}</span>
    </div>
    <div class="selected-result__title">${result.title}</div>
    <div class="selected-result__subtitle">${result.subtitle ?? ''}</div>
    ${metaEntries ? `<div class="selected-result__meta">${metaEntries}</div>` : ''}
  `
  selectedCard.style.display = ''
})

smartSearch.addEventListener('searchClear', () => {
  const selectedCard = document.getElementById('selectedCard')
  selectedCard.style.display = 'none'
})

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark')
  smartSearch.theme = isDark ? 'dark' : 'light'
  themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode'
})