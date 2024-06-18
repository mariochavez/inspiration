Rack::Attack.enabled = !Rails.env.test?

# Throttle requests from a single IP to 5 requests per second
Rack::Attack.throttle("req/ip", limit: 5, period: 1.second) do |req|
  req.ip
end

# Rack::Attack.throttle('limit logins per email', limit: 5, period: 1.minute) do |req|
#   if req.path == '/login' && req.post?
#     req.params['email']
#   end
# end

# Rack::Attack.blocklist("block script kidz") do |req|
#   CGI.unescape(req.query_string) =~ %r{/etc/passwd} ||
#   req.path.include?("/etc/passwd") ||
#   req.path.include?("wp-admin") ||
#   req.path.include?("wp-login")
# end
