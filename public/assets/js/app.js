$(function () {
  // Grab the articles as a json
  $.getJSON("/", function (data) {
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });

  // Save button click handling
  $(".save-button").on("click", function (event) {
    console.log("saving article");
    var thisId = $(this).attr("data-id");

    // ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
      })
      .then(function (data) {
        console.log(data);
      });
  });

  //modal notes view
  function displayNote(data) {
    var notesToDisplay = [];
    console.log("Display Note: ");
    console.log(data.notes.notes);
    var currentNote;
    if (!data.notes.notes.length) {
      // No notes returned
      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
      notesToDisplay.push(currentNote);
    }
    else {
       data.notes.notes.forEach(note => {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            note.body,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        // Store the note id on button
        currentNote.children("button").data("note-id", note._id);
        // Add currentNote to the notesToDisplay array
        notesToDisplay.push(currentNote);
      })
    }
    $(".note-container").append(notesToDisplay);
  }

  // handle notes modal
  function handleArticleNotes(id) {
    $.get("/articles/" + id).then(function(data) {
      console.log("Note: ");
      console.log(data);
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: id,
        notes: data || []
      };
      $(".btn.save").data("article", noteData);
      displayNote(noteData);
    });
  }

  //show notes
  $(".note-button").on("click", function (event) {
    handleArticleNotes($(this).attr("data-id"));
  });

  //delete note button
  $(document).on("click", ".note-delete", function () {
    // Grab the id associated with the note from the x button
    var noteId = $(this).data("note-id");
    console.log("NoteId: ")
    console.log(noteId);
    if (noteId) {  
      $.ajax({
        method: "POST",
        url: "/articles/note/clear/" + noteId
      }).then(function () {
        bootbox.hideAll();
      });
    }
  });
})

//savenote button
$(document).on("click", ".btn.save", function () {
  // Grab the id associated with the article from the submit button
  var article = $(this).data("article");
  var thisId = article._id;
  var newNote = {body: $(".bootbox-body textarea").val().trim()};
  console.log(newNote);
  if (newNote) {  
    $.ajax({
      method: "POST",
      url: "/articles/note/" + thisId,
      data: newNote
    }).then(function () {
      bootbox.hideAll();
    });
  }
});
