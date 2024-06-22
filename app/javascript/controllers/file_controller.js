import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["fileInput", "container", "preview", "placeholder"]
  static values = { maxSize: Number, image: String, validationMessage: String, url: String }

  connect() {
    if (this.hasFileInputTarget) {
      this.fileInputTarget.addEventListener("change", this.fileSelected.bind(this))
    }
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
      this.containerTarget.querySelectorAll(".help-error").forEach(error => error.remove())
      this.validateFile(event.target.files[0])
    }
  }

  validateFile(file) {
    console.log(file)

    if (file.size > this.maxSizeValue) {
      this.fileInputTarget.value = ""
      this.addError()
      this.clearPreview()
    } else {
      this.loadPreview(file)
    }
  }

  addError() {
    const messageNode = document.createElement("p");
    messageNode.classList.add("help", "help-error");
    messageNode.innerText = this.validationMessageValue;

    this.containerTarget.appendChild(messageNode)
  }

  clearPreview() {
    this.containerTarget.removeAttribute("data-image-loaded")
    this.previewTarget.setAttribute("src", "")
  }

  loadPreview(file) {
    this.previewTarget.setAttribute("src", URL.createObjectURL(file))
    this.containerTarget.setAttribute("data-image-loaded", true)
  }
}
