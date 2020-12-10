import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import SessionStore from './api/appStorage'

const logRocketInit = () => {
  const data = SessionStore.getAllSessionData()
  if (!data) return

  const user = SessionStore.getUserData()
  if (!user) return

  const { role } = user
  const onProduction =
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '0.0.0.0' &&
    process.env.NODE_ENV === 'production' &&
    (role === 'account_holder' || role === 'customer_service')

  if (onProduction) {
    LogRocket.init('enconta/enconta', {
      console: {
        isEnabled: true
      }
    })
    setupLogRocketReact(LogRocket)
  }
}

export default logRocketInit
