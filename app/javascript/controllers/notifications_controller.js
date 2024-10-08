import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["subscribeButton"]

  connect() {
    console.log("Notification controller connected")
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.")
      return
    }

    console.log("Notification permission: ", Notification.permission)
    if (Notification.permission === "granted") {
      this.setupPushManager()
    }
  }

  subscribe(event) {
    event.preventDefault()
    console.log("Subscribing to notifications")
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        this.setupPushManager()
      }
    })
  }

  async setupPushManager() {
    const registration = await navigator.serviceWorker.ready
    const vapidPublicKey = document.querySelector('meta[name="vapid-public-key"]').content
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
    })

    this.saveSubscription(subscription)
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

    if (response.ok) {
      this.subscribeButtonTarget.textContent = "Subscribed"
      this.subscribeButtonTarget.disabled = true
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
