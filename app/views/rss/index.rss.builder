xml.instruct! :xml, version: "1.0"
xml.rss version: "2.0" do
  xml.channel do
    xml.title t("name")
    xml.description "#{t("title")} | #{t("description")}"
    xml.link root_url

    @photos.each do |photo|
      xml.item do
        xml.title photo.author
        xml.description photo.meta_description
        xml.pubDate photo.published_at&.to_formatted_s(:rfc822)
        xml.link photo_url(photo)
        xml.guid photo_url(photo)
        xml.enclosure url: rails_blob_url(photo.image.variant(:page)), length: photo.image.variant(:page).blob.byte_size, type: "image/jpeg"
      end
    end
  end
end
