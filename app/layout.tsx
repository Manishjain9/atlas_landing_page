import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atlas — The Donor CRM Built for Catholic Dioceses',
  description:
    'Atlas is built natively on GiveCentral\'s giving infrastructure, designed around the Diocese → Parish → Household hierarchy. Early access preview 2026.',
  openGraph: {
    title: 'Atlas — The Donor CRM Built for Catholic Dioceses',
    description:
      'The only CRM built natively for Catholic diocese stewardship. Native GiveCentral integration, AI-powered donor insights, and real parish hierarchy.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,600&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}

        {/* Pageview tracking */}
        <Script id="gc-analytics-pageview" strategy="afterInteractive">{`
          (function() {
            var ref = document.referrer ? '&ref=' + encodeURIComponent(document.referrer) : '';
            fetch(
              'https://gc-analytics.mj90155.workers.dev/track?p=' + encodeURIComponent(location.pathname) + ref,
              { method: 'POST', keepalive: true }
            ).catch(function() {});
          })();
        `}</Script>

        {/* Event tracking — forms, CTA clicks, time on page */}
        <Script id="gc-analytics-events" strategy="afterInteractive">{`
          (function() {
            var BASE = 'https://gc-analytics.mj90155.workers.dev/event';
            var startTime = Date.now();

            function sendEvent(type, label, value) {
              fetch(BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
                body: JSON.stringify({
                  type: type,
                  page: location.pathname,
                  label: label || '',
                  value: value || ''
                })
              }).catch(function() {});
            }

            document.addEventListener('submit', function(e) {
              var form = e.target;
              var label = form.getAttribute('data-analytics-label')
                        || form.getAttribute('id')
                        || form.getAttribute('name')
                        || 'form';
              sendEvent('form_submit', label);
            }, true);

            document.addEventListener('click', function(e) {
              var el = e.target.closest('[data-analytics-cta]');
              if (el) {
                sendEvent('cta_click', el.getAttribute('data-analytics-cta') || el.innerText.trim().slice(0, 50));
                // ── Also treat form submit button clicks as form_submit ──
                if (el.type === 'submit') {
                  var form = el.closest('form');
                  if (form) {
                    var formLabel = form.getAttribute('data-analytics-label') || form.getAttribute('id') || 'form';
                    sendEvent('form_submit', formLabel);
                  }
                }
              }
            }, true);

            window.addEventListener('beforeunload', function() {
              var seconds = Math.round((Date.now() - startTime) / 1000);
              if (seconds > 2) sendEvent('time_on_page', location.pathname, String(seconds));
            });
          })();
        `}</Script>

      </body>
    </html>
  );
}