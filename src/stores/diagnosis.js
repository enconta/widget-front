import BaseStore from './baseStore'

class DiagnosisStore extends BaseStore {
  constructor () {
    super()
    this.diagnosis = ''
    this.url = ''
    this.userId = ''
    this.actions = {
      STATUS_ASKED: action => {
        this.setDiagnosis(action.data)
        this.setUrl(action.data.diagnosis)
      },
      ACCOUNT_CREATED: action => {
        this.setUserId(action.data)
      },
      CLEAR_CURRENT_DIAGNOSIS: () => {
        this.clearCurrentDiagnosis()
      }
    }
  }

  getDiagnosis () {
    return this.diagnosis
  }

  setDiagnosis (data) {
    this.diagnosis = data.diagnosis
  }

  setUrl (data) {
    this.url = data.quote_signed && data.quote_signed.url
  }
  getUserId () {
    return this.userId
  }
  setUserId (data) {
    this.userId = data.user.id
  }
  getUrl () {
    return this.url
  }
  clearCurrentDiagnosis () {
    this.diagnosis = ''
  }
}

export default DiagnosisStore.getInstance()
