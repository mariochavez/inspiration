# app/helpers/pagination_helper.rb
module PaginationHelper
  include Pagy::Frontend

  def render_responsive_pagination(pagy)
    return unless pagy.pages > 1

    tag.nav(class: "flex items-center justify-between px-4 sm:px-0", aria: {label: "Pagination"}) do
      tag.div(class: "flex w-0 flex-1") do
        prev_link(pagy)
      end +
        tag.div(class: "hidden md:flex md:flex-1 md:items-center md:justify-center gap-2", data: {test_id: "pagination-numbers"}) do
          page_links(pagy).join.html_safe
        end +
        tag.div(class: "flex w-0 flex-1 justify-end") do
          next_link(pagy)
        end
    end
  end

  private

  def prev_link(pagy)
    if pagy.prev
      link_to pagy_url_for(pagy, pagy.prev), class: nav_link_classes do
        prev_link_content
      end
    else
      tag.span(class: nav_link_classes(disabled: true)) do
        prev_link_content
      end
    end
  end

  def next_link(pagy)
    if pagy.next
      link_to pagy_url_for(pagy, pagy.next), class: nav_link_classes do
        next_link_content
      end
    else
      tag.span(class: nav_link_classes(disabled: true)) do
        next_link_content
      end
    end
  end

  def prev_link_content
    tag.svg(class: "h-5 w-5 mr-3", viewBox: "0 0 20 20", fill: "currentColor", aria: {hidden: "true"}) do
      tag.path("fill-rule": "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", "clip-rule": "evenodd")
    end + tag.span(t("pagination.previous"))
  end

  def next_link_content
    tag.span(t("pagination.next")) +
      tag.svg(class: "h-5 w-5 ml-3", viewBox: "0 0 20 20", fill: "currentColor", aria: {hidden: "true"}) do
        tag.path("fill-rule": "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", "clip-rule": "evenodd")
      end
  end

  def page_links(pagy)
    pagy.series.map do |item|
      case item
      when :gap
        tag.span(t("pagination.truncate"), class: "px-4 py-2 text-sm font-medium text-skin-base")
      else
        link_to item, pagy_url_for(pagy, item), class: token_list("px-4 py-2 text-sm text-skin-base rounded-md hover:bg-gray-100", {"border border-gray-300": item.to_i == pagy.page})
      end
    end
  end

  def nav_link_classes(disabled: false)
    token_list("inline-flex items-center px-4 py-2 text-sm text-skin-base rounded-md", {"text-skin-dimmed cursor-not-allowed": disabled, "hover:bg-gray-100": !disabled})
  end
end
