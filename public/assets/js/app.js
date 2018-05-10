$(function () {
  // Grab the articles as a json
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });

  // Whenever someone clicks a save article button
  $(".save-button").on("click", function (event) {
    console.log("saving article");
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
      })
      .then(function (data) {
        console.log(data);
      });
  });

  // Whenever someone clicks a save note button
  $(".note-button").on("click", function (event) {
    console.log("saving note");
    var thisId = $(this).attr("data-id");
    var div1 = $("<div>");
    div1.addClass("bootbox");
    div1.addClass("modal");
    div1.addClass("fade in");
    div1.attr("tabIndex", "-1");
    div1.attr("role", "dialog");
    div1.attr("style", "display: block;");
    $("#articles").append(div1);


    var div2 = $("<div>");
    div2.addClass("modal-dialog");
    div2.addClass("modal-content");
    div2.addClass("modal-body");
    div1.append(div2);

    var button = $("<button>");
    button.attr("type", "button");
    button.addClass("bootbox-close-button");
    button.addClass("close");
    button.attr("data-dismis", "modal");
    button.attr("aria-hidden", "true");
    button.attr("style", "margin-top: -10px;");
    div2.append(button);

    var div3 = $("<div>");
    div3.addClass("bootbox-body");
    div2.append(div3);

    var div4 = $("<div>");
    div4.addClass("container-fluid");
    div4.addClass("container-fluid");
    div3.append(div4);

    var div5 = $("<div>");
    div5.addClass("text-center");
    div5.append($("<h4>").text("Notes For Article: " + thisId));

    var ul = $("<ul>");
    ul.addClass("list-group");
    ul.addClass("note-container");
    div5.append(ul);

    var li = $("<li>");
    li.addClass("list-group-item");
    li.text("No notes for this article yet.");
    ul.append(li);
    div5.append(ul);

    var textArea = $("<textarea>");
    textArea.attr("placeholder", "New Note");
    textArea.attr("rows", "4");
    textArea.attr("cols", "60");

    div5.append(textArea);

    var button = $("<button>");
    button.attr("type", "button");
    button.addClass("btn");
    button.addClass("btn-success");
    button.addClass("save");
    button.text("Save Note");
    div5.append(button);

    // <div class="modal-backdrop fade in"></div>

    // Now make an ajax call for the Article
    // $.ajax({
    //     method: "POST",
    //     url: "/articles/note/" + thisId
    //   })
    //   .then(function (data) {
    //     console.log(data);
    //   });
  });



  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
})