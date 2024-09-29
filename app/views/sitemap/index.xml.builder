xml.instruct! :xml, version: "1.0", encoding: "UTF-8"
xml.urlset xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" do
  xml.url do
    xml.loc root_url
    xml.changefreq "daily"
    xml.priority 1.0
  end

  @photos.each do |photo|
    xml.url do
      xml.loc photo_url(photo)
      xml.lastmod photo.updated_at&.iso8601
      xml.changefreq "weekly"
      xml.priority 0.8
    end
  end
end
