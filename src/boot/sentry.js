import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

Sentry.init({
  dsn: 'https://7cb0bdb0c734418ebb3149d570b2514d@sentry.io/1764000',
  integrations: [ new Integrations.Vue({ Vue, attachProps: true }) ],
  beforeSend(event, hint) {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id })
    }
    return event
  }
})
