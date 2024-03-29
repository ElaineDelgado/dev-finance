/* Modal ==== */
/*
function initModal() {  
    const modal = document.querySelector('.modal-overlay')
    const openModalButton = document.querySelector('a.new')
    const closeModalButton = document.querySelector('a.cancel')

    function toggleModal() {
        modal.classList.toggle('active')
    }
    
    openModalButton.addEventListener('click', toggleModal)
    closeModalButton.addEventListener('click', toggleModal)
}
initModal();*/

const Modal = {
  open() {
    // Abrir modal
    // Adicionar a class active ao modal
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close() {
    // fechar o modal
    // remover a class active do modal
    document.querySelector('.modal-overlay').classList.remove('active')
  },
}

/* Transacoes ===============*/
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },

  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions),
    )
  },
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income
  },
  expenses() {
    let expense = 0
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },
  total() {
    return Transaction.incomes() + Transaction.expenses()
  },
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
                    <td class="description">${transaction.description}</td>
                    <td class="${cssClass}">${amount}</td>
                    <td class:="date">${transaction.date}</td>
                    <td><img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt=""></td>                   
                    `
    return html
  },

  updateBalance() {
    document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes(),
    )

    document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses(),
    )

    document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total(),
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  },
}

/* Formatando a moeda:  */
const Utils = {
  formatAmount(value) {
    value = value * 100
    return Math.round(value)
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '' //se o valor for negativo adiciona sinal -

    value = String(value).replace(/\D/g, '') //remove qualquer caeactere que nao seja numero

    value = Number(value) / 100 //divide por cem para criar os centavos

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return signal + value
  },
}

/* Pegando dados dos formulários */
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos.')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    return {
      description,
      amount,
      date,
    }
  },

  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction) // salvar
      Form.clearFields() // limpar formulario
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  },
}

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })
    /* ou
     * Transaction.all.forEach(DOM.addTransaction)
     */
    DOM.updateBalance()

    Storage.set(Transaction.all)
  },

  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()

/* ========= Dark Mode ========*/
const darkmodeBtn = document.querySelector('.btn-toggle')
let darkMode = localStorage.getItem('darkMode')
const imgTheme = document.querySelectorAll('.btn-toggle img')

const enableDarkMode = () => {
  document.documentElement.classList.add('dark-mode')

  localStorage.setItem('darkMode', 'enabled')
}

const disableDarkMode = () => {
  document.documentElement.classList.remove('dark-mode')

  localStorage.setItem('darkMode', null)
}

if (darkMode === 'enabled') {
  enableDarkMode()
}

darkmodeBtn.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode')
  if (darkMode !== 'enabled') {
    enableDarkMode()
    console.log(darkMode)
  } else {
    disableDarkMode()
    console.log(darkMode)
  }
})

//Função para mudar imagem do botão dark-mode de acordo com o tema escolhido
function activeItem() {
  imgTheme.forEach((image) => {
    image.classList.toggle('active')
  })
}

imgTheme.forEach((item) => {
  item.addEventListener('click', activeItem)
})
