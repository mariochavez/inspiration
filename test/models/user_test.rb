require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "it is valid" do
    subject = User.new(user_params)

    assert_predicate subject, :valid?
  end

  test "it is invalid" do
    subject = User.new(user_params(email: nil, password: nil))

    refute_predicate subject, :valid?
    assert_predicate subject.errors[:email], :present?
    assert_predicate subject.errors[:password], :present?
  end

  def user_params(attrs = {})
    {
      email: "test@mail.com",
      password: "passwordtest"
    }.merge(attrs)
  end
end
