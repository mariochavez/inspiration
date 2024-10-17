module ApplicationHelper
  def scaled_dimensions(original_width, original_height, max_size)
    scaling_factor = if original_width > original_height
      max_size.to_f / original_width
    else
      max_size.to_f / original_height
    end

    new_width = (original_width * scaling_factor).round
    new_height = (original_height * scaling_factor).round

    {width: "#{new_width}px", height: "#{new_height}px"}
  end
end
