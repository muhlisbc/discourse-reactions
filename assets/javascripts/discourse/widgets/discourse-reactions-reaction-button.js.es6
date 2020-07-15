import { iconNode } from "discourse-common/lib/icon-library";
import { h } from "virtual-dom";
import { createWidget } from "discourse/widgets/widget";
import { later, cancel } from "@ember/runloop";

let _laterHoverHandlers = {};

export default createWidget("discourse-reactions-reaction-button", {
  tagName: "div.discourse-reactions-reaction-button",

  buildKey: attrs => `discourse-reactions-reaction-button-${attrs.post.id}`,

  click() {
    this._cancelHoverHandler();

    if (!this.site.mobileView) {
      this.callWidgetFunction("toggleLike");
    }
  },

  mouseOver(event) {
    this._cancelHoverHandler();

    if (!this.site.mobileView) {
      _laterHoverHandlers[this.attrs.post.id] = later(
        this,
        this._hoverHandler,
        event,
        500
      );
    }
  },

  mouseOut() {
    this._cancelHoverHandler();

    if (!this.site.mobileView) {
      this.callWidgetFunction("scheduleCollapse");
    }
  },

  html(attrs) {
    const mainReactionIcon = this.siteSettings.discourse_reactions_like_icon;
    const hasPositivelyReacted = attrs.post.user_positively_reacted;
    const icon = hasPositivelyReacted
      ? mainReactionIcon
      : `far-${mainReactionIcon}`;

    return h(`button.btn-toggle-reaction.btn-icon.no-text`, [iconNode(icon)]);
  },

  _cancelHoverHandler() {
    const handler = _laterHoverHandlers[this.attrs.post.id];
    handler && cancel(handler);
  },

  _hoverHandler(event) {
    this.callWidgetFunction("cancelCollapse");
    this.callWidgetFunction("toggleReactions", event);
  }
});
