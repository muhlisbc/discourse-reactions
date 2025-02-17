import { test } from "qunit";
import { acceptance, exists } from "discourse/tests/helpers/qunit-helpers";
import { default as ReactionsTopics } from "../fixtures/reactions-topic-fixtures";
import { visit } from "@ember/test-helpers";

acceptance("Discourse Reactions - Disabled", function (needs) {
  needs.user();

  needs.settings({
    discourse_reactions_enabled: false,
  });

  needs.pretender((server, helper) => {
    const topicPath = "/t/374.json";
    server.get(topicPath, () => helper.response(ReactionsTopics[topicPath]));
  });

  test("Does not show reactions controls", async (assert) => {
    await visit("/t/topic_with_reactions_and_likes/374");

    assert.notOk(
      exists(".discourse-reactions-actions"),
      "reactions controls are not shown"
    );
  });
});
