import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js?v=1')
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }
}
