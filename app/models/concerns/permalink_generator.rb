module PermalinkGenerator
  extend ActiveSupport::Concern

  def generate_permalink
    self.permalink = ensure_unique_permalink("#{author}-#{project}".strip.parameterize)
  end

  private

  def ensure_unique_permalink(permalink)
    base_permalink = permalink
    counter = 1

    while self.class.exists?(permalink: permalink)
      permalink = "#{base_permalink}-#{counter}"
      counter += 1
    end

    permalink
  end
end
