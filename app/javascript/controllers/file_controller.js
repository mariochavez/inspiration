import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["fileInput", "container", "preview", "placeholder", "help"]
  static values = { maxSize: Number, image: String, validationMessage: String, url: String }

  connect() {
    if (this.hasFileInputTarget) {
      this.fileInputTarget.addEventListener("change", this.fileSelected.bind(this))
    }

    this.helpTarget.innerText = this.validationMessageValue
  }

  disconnect() {
    if (this.hasFileInputTarget) {
      this.fileInputTarget.removeEventListener("change", this.fileSelected.bind(this))
    }
  }

  select(event) {
    event.preventDefault();
    this.fileInputTarget.click();
  }

  fileSelected(event) {
    if (event.target.files.length > 0) {
      this.processFile(event.target.files[0])
    }
  }

  processFile(file) {
    if (file.size > this.maxSizeValue) {
      this.fileInputTarget.value = ""
      this.element.setAttribute("data-image-error", true)
    } else {
      this.element.removeAttribute("data-image-error")
      this.previewTarget.setAttribute("src", URL.createObjectURL(file))
      this.containerTarget.setAttribute("data-image-loaded", true)
    }
  }
}
