import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  async share() {
    if (navigator.share) {
      const shareText = document.querySelector('[data-share]')
      let text = document.querySelector('meta[name="description"]').getAttribute('content')

      if (shareText) {
        text = shareText.innerText;
      }

      try {
        await navigator.share({
          title: document.title,
          text: text,
          url: window.location.href
        });
      } catch (error) {
        // Nothing to do here. Share might be cancelled by the user.
      }
    } else {
      // Fallback: copy URL to clipboard if Web Share API isn't supported
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('URL copied to clipboard!');
      } catch (err) {
        // Nothing to do here.
      }
    }
  }
}
