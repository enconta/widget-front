import { Get } from 'api'

class Plan {
  static GetPlanRemainingDays (id) {
    return Get(`/user_plans/${id}`)
  }
}

export default Plan
