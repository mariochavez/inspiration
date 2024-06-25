class AboutController < ApplicationController
  include JsonLdGenerator
  include MetaTagsGenerator

  def show
    set_meta
  end

  private

  def set_meta(resource = nil)
    @json_ld = generate_json_ld(resource)
    generate_meta_tags(resource) if resource.present?
  end
end
