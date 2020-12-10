/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import {browserHistory} from 'react-router'
import AppSignal from 'appsignal'
import {ErrorBoundary} from '@appsignal/react'
import {getCurrentServer, isWarningActivated, getClientsPlan} from 'utils'
import AppStorage from 'api/appStorage'
import classNames from 'classnames'
import moment from 'moment-timezone'
import ReactGA from 'react-ga'

import Topbar from 'shared/topbar'
import NotificationsContainer from 'shared/notifications'
import AppWideNotification from 'shared/appWideNotification'
import Footer from 'shared/footer'
import ChatButton from 'shared/appWideNotification/button'

import SessionStore from 'stores/session'

// prettier-ignore
const loadZenDesk = () => {
  window.zEmbed ||
    (function (e, t) {
      var n
      var o
      var d
      var i
      var s
      var a = []
      var r = document.createElement('iframe')
      ;(window.zEmbed = function () {
        a.push(arguments)
      }),
      (window.zE = window.zE || window.zEmbed),
      (r.src = 'javascript:false'),
      (r.title = ''),
      (r.role = 'presentation'),
      ((r.frameElement || r).style.cssText = 'display: none'),
      (d = document.getElementsByTagName('script')),
      (d = d[d.length - 1]),
      d.parentNode.insertBefore(r, d),
      (i = r.contentWindow),
      (s = i.document)
      try {
        o = s
      } catch (e) {
        ;(n = document.domain),
        (r.src =
            'javascript:var d=document.open();d.domain="' + n + '";void(0);'),
        (o = s)
      }
      ;(o.open()._l = function () {
        var e = this.createElement('script')
        n && (this.domain = n),
        (e.id = 'js-iframe-async'),
        (e.src = 'https://assets.zendesk.com/embeddable_framework/main.js'),
        (this.t = +new Date()),
        (this.zendeskHost = 'enconta.zendesk.com'),
        (this.zEQueue = a),
        this.body.appendChild(e)
      }),
      o.write('<body onload="document._l();">'),
      o.close()
    })() // eslint-disable-line
}

const App = props => {

  let title = props.children.props.route.title
    ? `${props.children.props.route.title} - Enconta`
    : 'Enconta'

  const plan = getClientsPlan()
  const isVisibleZenDesk =
    plan !== 'free' &&
    plan !== 'free_premium' &&
    getCurrentServer() === 'production'

  if (isVisibleZenDesk) {
    loadZenDesk()
  }
  const currentEntity = SessionStore.getCurrentEntity()
  const {legal_type: legalType, rfc, email} = currentEntity

  const warning = isWarningActivated()

  const displayChatbutton =
    legalType === 'individual' && plan === 'integral_service'
  moment.tz.setDefault('America/Mexico_City')
  if (!email.includes('@enconta.com') && !email.includes('@resuelve.mx')) {
    ReactGA.set({dimension4: rfc})
    ReactGA.set({dimension5: plan})
    ReactGA.set({dimension6: email})
  }

  return (
    <ErrorBoundary
      instance={AppSignal}
      fallback={() => {
        browserHistory.push('/500')
      }}
    >
      <DocumentTitle title={title}>
        <div className='app-content'>
          <Topbar pathname={props.location.pathname} />
          <div
            className={classNames('main-container', {
              'main-container--warning-active': warning
            })}
          >
            <div className='main-container__children'>
              <AppWideNotification />
              {props.children}
            </div>

            <Footer />
          </div>
          {displayChatbutton && <ChatButton />}
          <NotificationsContainer />
        </div>
      </DocumentTitle>
    </ErrorBoundary>
  )
}

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

export default App
