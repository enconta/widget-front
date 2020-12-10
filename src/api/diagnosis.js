import { Post, Put, Get } from 'api'

class Register {
  static createAccount (data) {
    return Post('/tax_diagnosis/self_service/', data)
  }

  static updateSteps (id) {
    return Put(`/tax_diagnoses/${id}`)
  }

  static askDiagnosisStatus (id) {
    return Get(`/tax_diagnoses/${id}`)
  }

  static createDiagnosis (id) {
    return Post(`/tax_diagnoses/?id=${id}`)
  }
  static SetCurrentStep (id, step) {
    return Put(`/tax_diagnoses/${id}`, step)
  }
}

export default Register
