require "test_helper"

class Api::V1::AuthenticationControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_authentication_index_url
    assert_response :success
  end

  test "should get create" do
    get api_v1_authentication_create_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_authentication_destroy_url
    assert_response :success
  end
end
