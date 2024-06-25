# Pin npm packages by running ./bin/importmap

pin "application"

pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "trix", preload: false
pin "@rails/activestorage", to: "activestorage.esm.js", preload: false
pin "@rails/actiontext", to: "actiontext.esm.js", preload: false

pin "el-transition", preload: false # @0.0.7

pin_all_from "app/javascript/controllers", under: "controllers", preload: false
