class ChatsController < ApplicationController
  before_filter :authenticate_user!

  def show
    render_ember
  end

  def create
    if params.has_key?(:message) && !current_user.ninja_banned?
      MessageBus.publish "/chat/lobby", {
        id: params[:id],
        message: params[:message],
        formattedMessage: MessageFormatter.format_message(params[:message]),
        username: current_user.name,
        time: Time.now.iso8601(0)
      }
    end

    render json: true
  end

  def ping
    json = {}

    # Get online users.
    $redis.with do |conn|
      time = Time.now.to_i
      conn.zadd "chat_online", time, current_user.id
      active_user_ids = conn.zrangebyscore "chat_online", time-60, "+inf"
      active_users = User.where(id: active_user_ids).order(:id)
      json[:online_users] = active_users.map do |user|
        {
          username: user.name,
          avatar: user.avatar.url(:thumb_small)
        }
      end
    end

    # Get last chat message ID.
    json[:last_message_id] = MessageBus.last_id("/chat/lobby")

    render json: json
  end
end
