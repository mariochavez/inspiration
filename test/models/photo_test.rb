require "test_helper"

class PhotoTest < ActiveSupport::TestCase
  test "it is valid" do
    subject = Photo.new(photo_params)

    assert_predicate subject, :save
  end

  test "it is invalid" do
    subject = Photo.new(photo_params(author: nil, image: nil))

    refute_predicate subject, :valid?
  end

  def photo_params(attrs = {})
    {
      author: "Kelli Connell",
      project: "Pictures for Chariz",
      url: "https://kelliconnell.com",
      description: "A photo of two people who look alike",
      image: file_fixture("photo.jpg")
    }.merge(attrs)
  end
end
