module SwitchLocale
  extend ActiveSupport::Concern

  included do
    around_action :switch_locale
  end

  private

  def switch_locale(&action)
    locale = extract_locale_from_accept_language_header
    I18n.with_locale(locale, &action)
  end

  def extract_locale_from_accept_language_header
    accepted_language = request.env["HTTP_ACCEPT_LANGUAGE"]
    return I18n.default_locale if accepted_language.nil?

    accepted_language = accepted_language.gsub(/\s+/, "")

    # Try to match the browser language with our available locales
    browser_locales = accepted_language.split(",").flat_map { |l| l.split(";q=") }.sort_by { |q| -q }
    browser_locales.filter_map { |l| I18n.available_locales.find { |al| al.to_s == l.downcase } }.first || I18n.default_locale
  end
end
