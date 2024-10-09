import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["subscribeButton", "unsubscribeButton", "subscribeIcon", "unsubscribeIcon"]
  static values = { subscribe: String, unsubscribe: String }

  connect() {
    if (!("Notification" in window)) {
      return
    }

    this.updateButtonState(true)
  }

  async updateButtonState(startup = false) {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      this.subscribeButtonTarget.classList.add("hidden")
      this.unsubscribeButtonTarget.classList.remove("hidden")
      if (!startup) this.unsubscribeIconTarget.classList.add("animate-ping")
    } else {
      this.subscribeButtonTarget.classList.remove("hidden")
      this.unsubscribeButtonTarget.classList.add("hidden")
      if (!startup) this.subscribeIconTarget.classList.add("animate-ping")
    }

    if (!startup) {
      const timeoutId = setTimeout(() => {
        this.unsubscribeIconTarget.classList.remove("animate-ping")
        this.subscribeIconTarget.classList.remove("animate-ping")
        clearTimeout(timeoutId);
      }, 1000)
    }
  }

  async subscribe(event) {
    event.preventDefault()

    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      await this.setupPushManager()
      this.updateButtonState()
    }
  }

  async unsubscribe(event) {
    event.preventDefault()

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      await this.deleteSubscription(subscription.endpoint)
      this.updateButtonState()
    }
  }

  async setupPushManager() {
    const registration = await navigator.serviceWorker.ready
    const vapidPublicKey = document.querySelector('meta[name="vapid-public-key"]').content
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
    })

    await this.saveSubscription(subscription)
  }

  async saveSubscription(subscription) {
    const response = await fetch(this.subscribeValue, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ subscription: subscription.toJSON() })
    })

    if (!response.ok) {
      throw new Error("Failed to save subscription")
    }
  }

  async deleteSubscription(endpoint) {
    const response = await fetch(this.unsubscribeValue, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ endpoint: endpoint })
    })

    if (!response.ok) {
      throw new Error("Failed to save subscription")
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}
