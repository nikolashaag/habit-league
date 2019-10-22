import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
console.log('process.env', process.env)
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://7cb0bdb0c734418ebb3149d570b2514d@sentry.io/1764000',
    debug: true,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
    beforeSend(event, hint) {
      if (event.message === 'Bug report') {
        Sentry.showReportDialog({
          eventId: event.event_id,
          title: 'Send us a bug report',
          subtitle: 'Our team will be notified'
        })
      }
      return event
    }
  })
}
