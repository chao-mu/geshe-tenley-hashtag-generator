$(document).ready(function () {
  $(".generate-and-copy").click(function () {
    var form = $(this).closest(".hashtag-form");

    generated = [];
    append = [];

    var official = getValue(form, "#official:checked");
    if (official === "yes") {
      append.push(["geshetenley"]);
    }

    var location = getValue(form, "#location");
    if (location !== "") {
      var location_pieces = tokenize(location);
      generated.push(location_pieces[0]);
      generated.push(location_pieces.join(""));
    }

    var origin = getValue(form, "#origin");
    if (origin !== "") {
      generated.push(tokenize(origin).join(""));
    }

    var topics = getValue(form, "#topic");
		var topic_quotes_tags = [];
		var topic_plain_tags = [];
    if (topics !== "") {
      tokenize(topics).forEach(function (topic) {
        topic_quotes_tags.push(topic);
        topic_plain_tags.push(topic + "quotes");
      });
    }

    var is_quote = getValue(form, "#quote:checked") === "yes";

    var very_popular = rejectQuoteRelated(
      !is_quote,
      ["buddhism", "dharma", "buddhist", "inspirationalquotes", "insight"]
    );

    var moderately_popular = rejectQuoteRelated(
      !is_quote,
      ["selfimprovementquotes", "buddhismquotes", "buddhistquotes", "tibetanbuddhism", "insightful", "ancientknowledge"]
    );

    var niche = rejectQuoteRelated(
      !is_quote,
      ["buddhismphilosophy", "buddhistphilosophy", "buddhistteachings", "buddhism101"]
    );

    var max_size = 11 - append.length;
    var last_size = generated.length;
    while (generated.length < max_size) {
      if (is_quote) {
        topic_quotes_tags = subsample(topic_quotes_tags, generated, 2, max_size);
      } else {
        topic_plain_tags = subsample(topic_plain_tags, generated, 1, max_size);
      }

      moderately_popular = subsample(moderately_popular, generated, 1, max_size);
      niche = subsample(niche, generated, 1, max_size);
      topic_plain_tags = subsample(topic_plain_tags, generated, 1, max_size);
      very_popular = subsample(very_popular, generated, 1, max_size);

      generated = [...new Set(generated)];

      // Break potential infinite loop if too many candidates (i.e. size stopped increasing)
      if (last_size >= generated.length) {
        break;
      }

      last_size = generated.length;
    }

    append.forEach(function (tag) {
      generated.push(tag);
    });

    var text = generated.map(function (tag) { return "#" + tag; }).join(" ");
    var output_el = $("#hashtagOutput");
    output_el.val(text);
    output_el.select();
    document.execCommand("copy");
    var badge = $(".copied-badge");
    badge.hide();
    badge.removeClass("d-none");
    badge.fadeIn();
  });
});

function rejectQuoteRelated(apply, arr) {
  if (apply) {
    return arr.filter(function(tag) { return !/quote/.exec(tag); });
  } else {
    return arr;
  }
}

function getValue(form, field_selector) {
  var val = form.find(field_selector).val();
  return typeof val === "string" ? trim(val) : val;
}

function tokenize(str) {
  return trim(str).toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
}

function trim(str) {
  return str.replace(/^\s+|\s$/g);
}

function subsample(from, to, size, max_size) {
  size = Math.min(max_size - to.length, size);
  if (size <= 0) {
    return from;
  }

	from = shuffle(from);
	var new_els = from.slice(0, size);
	from = from.slice(size);

  new_els.forEach(function (el) { to.push(el); });

	return from;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
