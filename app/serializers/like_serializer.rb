class LikeSerializer < ActiveModel::Serializer
  attributes :id, :liked_user_id, :liked_post_id
  has_one :liked_user
  has_one :liked_post
end
