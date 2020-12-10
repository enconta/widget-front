import _camelCase from 'lodash/camelCase'
import _snakeCase from 'lodash/snakeCase'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _pickBy from 'lodash/pickBy'
import _isEmpty from 'lodash/isEmpty'
import _isEqual from 'lodash/isEqual'
import _transform from 'lodash/transform'
import _get from 'lodash/get'
 import queryString from 'query-string'
import accounting from 'accounting'
import moment from 'moment'
 import { browserHistory } from 'react-router'
import crypto from 'crypto'

import SessionStore from 'stores/session'


// Files
export const FILE_TEMPLATE_URL =
  'https://s3-us-west-2.amazonaws.com/enconta-public/environment/templates/template.xlsx'

// Date formats
export const FULL_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const PERIOD_FORMAT = 'YYYY-MM'

// Binds the passed functions to the passed 'this'
export const binder = (self, ...funcs) => {
  funcs.forEach(func => {
    self[func] = self[func].bind(self)
  })
}

// Funcion para convertir las keys de un objeto o array de objetos a snake o camel case
// dependiendo de la funcion que sea pasada,
// usar los metodos snakeCase y camelCase declarados abajo
const caseConvertor = caseFunction => {
  return function convertCase (object) {
    // TODO: mejorar esta funcion con _mapKeys
    if (_isArray(object)) {
      // Si es un array vacio o cuyo primer elemento no sea un objeto, lo regresa tal cual
      if (object.length > 0 && _isObject(object[0]) === false) return object
      return object.map(convertCase) // Si es un array, regresa un array al que se le aplica esta funcion a cada elemento
    }
    return Object.keys(object) // Saca las keys del objeto en un array
      .reduce(
        (acc, curr) =>
          Object.assign(acc, {
            // Regresa un objeto al que acumulativamente se le asigna un elemento por cada key mapeada
            [caseFunction(curr)]: _isObject(object[curr]) // Regresa el key en snake o camel case dependiendo de la funcion utilizada
              ? convertCase(object[curr]) // Si el valor de esa key es otro objeto, se le aplica esta funcion a ese objeto
              : object[curr] // Si no, se le asigna el valor que ya tenia en el objeto original
          }),
        {}
      )
  }
}

export const camelCase = caseConvertor(_camelCase)
export const snakeCase = caseConvertor(_snakeCase)

// Recursively remove all null properties from an object
// NOTE: This modifies the original object, make a copy instead <- this can be achieved with a reduce,
// check the convert case function to implement it
// - Removes values set to null
// - Removes empty arrays
// - Recursively iterates through objects
export const removeEmpty = obj => {
  Object.entries(obj).forEach(([key, val]) => {
    if (_isArray(val) && val !== null && val.length === 0) delete obj[key]
    else if (_isObject(val)) removeEmpty(val)
    else if (val === null) delete obj[key]
    // Check if parent is empty after initial deleting, if so, delete the parent
    if (_isObject(val) && Object.keys(val).length === 0) delete obj[key]
    if (_isArray(val) && val !== null && val.length === 0) delete obj[key]
  })
  return obj
}

export const currency = (n = 0) => {
  return isNaN(n) ? n : `$${parseFloat(n).toFixed(2)}`
}

// Some amounts require to be sent in cents
// Required by our API
export const amountToCents = amount => {
  return Math.round(accounting.unformat(amount) * 100)
}

// Round numbers using format (don't use native JS rounding, it's not as precise)
// Then format as cents (multiply by 100)
// Required by our API
export const formatCents = amount => {
  return Number(
    accounting.toFixed(
      Number(accounting.unformat(accounting.formatNumber(amount, 2))) * 100
    )
  )
}

// Some amounts require to be sent in cents
// Required by our API
export const taxRateFormat = tax => {
  return accounting.formatMoney(tax / 100, '', 6, '')
}

// Count days between two dates
export const countDays = (startDate, endDate) => {
  let days = 0
  while (moment(startDate).isBefore(endDate)) {
    startDate = moment(startDate).add(1, 'day')
    days++
  }
  return days
}

export const formatNumberToString = (num, minChars) => {
  // Regrsa un numero convertirdo a string con los zeros correspondientes
  // para lograr el minimo de caracteres pasados en el atributo
  return num.toString().length < minChars
    ? formatNumberToString(`0${num}`, minChars)
    : num.toString()
}

// Return the absolute value of a number
export const absolutify = num => Math.abs(accounting.unformat(num))

// Return the amount formated as currency with the $ symbol
export const formatCurrency = amount => accounting.formatMoney(amount, '$ ')

// Format date as API requires when creating new invoices
export const formatDateInvoice = date => moment(date).format(FULL_DATE_FORMAT)

// Return string with human dates
export const prettyDate = (
  d,
  dateInputFormat = DATE_FORMAT,
  shortMonth = false,
  lowerCaseMonth = true,
  separator = ' de '
) => {
  // Revisar fechas inválidas
  if (
    typeof d === 'undefined' ||
    d === null ||
    !moment(d, dateInputFormat).isValid()
  ) {
    return ''
  }
  const year = moment(d, dateInputFormat).format('YYYY')
  // Meses
  let month = shortMonth
    ? MONTHS_SHORT[Number(moment(d, dateInputFormat).format('M')) - 1]
    : MONTHS_CATALOG[Number(moment(d, dateInputFormat).format('M')) - 1]
  if (lowerCaseMonth) month = month.toLowerCase()
  return `${moment(d, dateInputFormat).format(
    'D'
  )}${separator}${month}${separator}${year}`
}

export const getHour = (d, showSeconds = false) => {
  let format = showSeconds ? 'HH:mm:ss' : 'HH:mm'
  return moment(d).format(format)
}

// Return string with human dates (for periods only)
export const prettyPeriod = (
  d,
  dateInputFormat = DATE_FORMAT,
  shortMonth = false,
  separator = ' de '
) => {
  // Revisar fechas inválidas
  if (
    typeof d === 'undefined' ||
    d === null ||
    !moment(d, dateInputFormat).isValid()
  ) {
    return ''
  }
  // Meses
  let month = shortMonth
    ? MONTHS_SHORT[Number(moment(d, dateInputFormat).format('M')) - 1]
    : MONTHS_CATALOG[Number(moment(d, dateInputFormat).format('M')) - 1]
  return `${month}${separator}${moment(d, dateInputFormat).format('YYYY')}`
}

export const prettyDiffPeriod = (
  initialDate,
  finalDate,
  shortMonth,
  separator = '-'
) => {
  if (!moment(initialDate).isValid() || !moment(finalDate).isValid()) {
    throw new Error('prettyDiffPeriod recibe dos instancias de moment validas')
  }

  const initialMonth = shortMonth
    ? MONTHS_SHORT[Number(moment(initialDate).format('M')) - 1]
    : MONTHS_CATALOG[Number(moment(initialDate).format('M')) - 1]

  const finalMonth = shortMonth
    ? MONTHS_SHORT[Number(moment(finalDate).format('M')) - 1]
    : MONTHS_CATALOG[Number(moment(finalDate).format('M')) - 1]
  return `${initialMonth} ${separator} ${finalMonth} ${finalDate.format(
    'YYYY'
  )}`
}

// Leftpad
export const leftpad = (str, len, pad = ' ') => {
  str = String(str)
  let i = -1
  len = len - str.length
  while (++i < len) {
    str = pad + str
  }
  return str
}

// Return a formatted amount
export const money = (amount, symbol = '') =>
  accounting.formatMoney(amount, symbol, 2)

// Return a query string for the url filters and pages, receives an object, if empty object is received it returns an empty string
export const stringifyQuery = params => {
  const _filters = _pickBy(params, filter => {
    if (typeof filter === 'string') return filter.length > 0
    return true
  })
  // Add the query params
  return !_isEmpty(_filters) ? `?${queryString.stringify(_filters)}` : ''
}

// Creates a custom object used to call the GA library
export const createGaEvent = (category, action, label, value) => {
  // Create the base obj
  const gaEvent = {
    category,
    action
  }
  // Return only option params in provided
  if (label) gaEvent.label = label
  if (value) gaEvent.value = value
  // Just return the created object
  return gaEvent
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const difference = (object, base) => {
  function changes (object, base) {
    return _transform(
      object,
      function (result, value, key) {
        if (!_isEqual(value, base[key])) {
          result[key] =
            _isObject(value) && _isObject(base[key])
              ? changes(value, base[key])
              : value
        }
      },
      Object.create(null)
    )
  }
  return changes(object, base)
}

/**
 * Return boolean if has Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const hasDifference = (object, base) => {
  return !_isEmpty(difference(object, base))
}

export const formatFile = async files => {
  const [fileUpload] = files

  if (!fileUpload) {
    throw new Error('No ha podido leer el archivo, porfavor inténtalo de nuevo')
  }

  const name = fileUpload.name
    ? extensionFileRex.replace(
      fileUpload.name,
      fileUpload.name.match(extensionFileRex)[0].toLowerCase()
    )
    : 'key'

  const f64 = await toBase64(fileUpload)
  const contentType = f64.result.split(';base64')[0].replace('data:', '')
  const file64 = f64.result.split(',')[1]

  return { file64, name, contentType }
}

export const toBase64 = file => {
  return new Promise((resolve, reject) => {
    let reader = new window.FileReader()
    reader.onloadend = e => {
      if (e.target.error) {
        reject(e.target.error)
      }

      resolve({
        fileName: file.name,
        result: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Return the month name and it adjust the month number with two numbers
 */
export const getMonthLabel = month => {
  if (month < 10 && String(month).length === 1) {
    month = `0${month}`
  }
  return _get(MONTHS.find(({ id }) => id === String(month)), ['label'], '')
}
/**
 *Returns true If date is expired. If date is 1 or more days after the expiration date
 *Returns false if date is equal or is many days before the expiration date.
 * @param {Moment} expirationDate
 */
export const isExpired = expirationDate => {
  const currentDate = moment()
  return expirationDate.diff(currentDate, 'days') < 0
}

/** Sort numbers, it helps to sort receiving the smaller number and the greater number, and
 sorted with respect to all the different elements
 */
export const ascendingOrder = (less, greater) => {
  return less - greater
}

/**
 * Handle links to specific URL
 * Ir works for goback when the current view has paginator
 * @param {*} url
 */
export const handleURL = url => {
  browserHistory.push(url)
}

/**
 * It return to previous view if the current view doesn't has paginator
 */
export const handleBack = () => {
  browserHistory.goBack()
}

/**
 * It's used to validate required fields in forms
 * @param {Set} requiredFields
 * @param {object} component
 */
export const validateAll = (requiredFields, component) => {
  const nonFalsyFields = [...requiredFields].filter(Boolean)
  const validatedFields = nonFalsyFields.map(form =>
    form.validate.call(component)
  )
  const allValidationsSucceeded = validatedFields.every(field => field)
  return allValidationsSucceeded
}

/**
 * It's used to cipher text
 */
export const encryptData = text => {
  const algorithm = 'aes-256-cbc'
  const iv = process.env.INITIALIZATION_VECTOR
  const key = process.env.ENCRYPTION_KEY
  const textToBase64 = window.btoa(text)

  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(textToBase64)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return encrypted.toString('base64').trim()
}

/* Generic onChange to handle the inputs for general data form
 * @private
 * @typedef {React.ChangeEvent<HTMLInputElement> | Object | string} Input
 * @param {string} field - Input id to save
 * @returns {function(Input): void} - Value will save in the state
 */
export const handleInputs = (component, field) => event => {
  const value = event && event.nativeEvent ? event.target.value : event
  component.setState({
    [field]: value
  })
}

/**
 * This function helps the SAT Product Code Select Searcher used in Invoices and Inventories
 * It rename the properties so they can be used in the Select Field
 * @param {array} obj.products
 */
export const parseProducts = ({ products }) => {
  return products
    .map(element => ({
      value: element.clave_prod_serv,
      label: element.description
    }))
    .filter(element => element.label)
}

/**
 * This function helps the SAT Units Code Select Searcher used in Invoices and Inventories
 * It rename the properties so they can be used in the Select Field
 * @param {array} obj.units
 */
export const parseUnits = ({ units }) => {
  return units
    .map(element => ({
      value: element.unit_code,
      label: element.name
    }))
    .filter(element => element.label)
}

export const replaceUnderScore = string => {
  return string.replace(/_/g, ' ')
}

export const resetScroll = () => {
  window.scrollTo(0, 0)
}
export const checkFeatureFlags = (features, url, key) => {
  if (!features.find(feature => feature.key === key)) {
    return browserHistory.push(url)
  }
}

/**
 *
 * @param {string} modal
 * @param {object} component
 */
export const handleModals = (modal, component) => {
  component.setState(state => ({ [modal]: !state[modal] }))
}

export const getCurrentServer = () => {
  switch (process.env.API_SERVER) {
    case 'https://api.enconta.com':
      return 'production'
    case 'https://api-staging.enconta.com':
      return 'staging'
    default:
      return 'local'
  }
}

/**
 * Helps avoiding to type an space at the beginning of the input and avoid to send empty string to DB
 * @param {string} string
 */
export const avoidBlankSpace = string => {
  return string.replace(/^\s+/g, '')
}

/*
 * Helps to know if the warning advertisement(production or staging) active
 */
export const isWarningActivated = () => {
  const currentServer = getCurrentServer()
  return currentServer === 'production' || currentServer === 'staging'
}

/*
 * Checks if an specific string contains a number
 */
export const hasANumber = string => {
  return string.match(/\d/g)
}

/*
 * Checks if an specific string contains capital letter
 */
export const hasCapitalLetter = string => {
  return string.match('.*[A-Z].*')
}

/*
 * Checks if the password contains the correct length
 */
export const getPasswordLengthValid = string => {
  if (string.length >= 6) {
    return true
  }
}

/*
 * Toggles state to controle password visibility
 */
export const toggleShowHidePassword = (component, field) => {
  component.setState(state => ({ [field]: !state[field] }))
}

export const isDisabledInvoiceLabeling = status => {
  const plan = getClientsPlan()
  return status === 'cancelled' || plan === 'free'
}

export const getClientsPlan = () => {
  const { plan } = SessionStore.getCurrentEntity()
  return plan
}

export const askRemainingPlanDays = () => {
  const { id, plan } = SessionStore.getCurrentEntity()
  if (plan === 'free_premium') {
    PlanActions.getPlanRemainingDays(id)
  }
}

export const getPlanName = () => {
  switch (getClientsPlan()) {
    case 'free':
      return 'Freemium'
    case 'free_premium':
    case 'premium':
      return 'Premium'
    case 'integral_service':
      return 'Servicio integral'
  }
}
