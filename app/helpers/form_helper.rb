module FormHelper
  def text_field_for(form, field, options = {})
    container_class = {class: class_names("sm:col-span-6", error: field_error?(form, field))}.merge(options.delete(:container_class) || {})
    label_class = {class: "label"}.merge(options.delete(:label_class) || {})

    input_class = {class: "input #{options.delete(:class)}".strip}
    input_options = {autocomplete: :off, maxlength: 60}.merge(options)
    input_options.merge!(input_class)

    content_tag :div, container_class do
      concat(form.label(field, label_class))
      concat(content_tag(:div, class: "mt-2") { form.text_field(field, input_options) })
      concat(error_for(form, field))
    end
  end

  def error_for(form, field)
    return unless field_error?(form, field)
    content_tag :p, form.object.errors[field].first, class: "help help-error"
  end

  def field_error?(form, field)
    form.object.respond_to?(:errors) && form.object.errors.include?(field)
  end
end
