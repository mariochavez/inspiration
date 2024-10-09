import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["subscribeButton", "unsubscribeButton"]

  connect() {
    if (!("Notification" in window)) {
      return
    }

    this.updateButtonState()
  }

  async updateButtonState() {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      this.subscribeButtonTarget.classList.add("hidden")
      this.unsubscribeButtonTarget.classList.remove("hidden")
    } else {
      this.subscribeButtonTarget.classList.remove("hidden")
      this.unsubscribeButtonTarget.classList.add("hidden")
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
    const response = await fetch("/push_subscriptions", {
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
    const response = await fetch("/push_subscriptions", {
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
