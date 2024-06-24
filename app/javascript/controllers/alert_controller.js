import { Controller } from "@hotwired/stimulus"
import { toggle } from "el-transition"

export default class extends Controller {
  static targets = []

  connect() {
    this.timeout = setTimeout(() => {
      this.dismiss()
    }, 5000)

    toggle(this.element)
  }

  dismiss() {
    clearTimeout(this.timeout)

    toggle(this.element, false, () => {
      this.element.remove()
    })
  }
}
