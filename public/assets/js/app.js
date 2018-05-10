$(function () {
  // Grab the articles as a json
  $.getJSON("/", function (data) {
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


  function renderNotesList(data) {
    // This function handles rendering note list items to our notes modal
    // Setting up an array of notes to render after finished
    // Also setting up a currentNote variable to temporarily store each note
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // If we have no notes, just display a message explaing this
      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
      notesToRender.push(currentNote);
    }
    else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs an li element to contain our noteText and a delete button
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        // Store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }


  function handleArticleNotes(id) {
    // This function handles opending the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the panel element the delete button sits inside
    
    // Grab any notes with this headline/article id
    $.get("/articles/" + id).then(function(data) {
      // Constructing our initial HTML to add to the notes modal
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
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: id,
        notes: data || []
      };
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  }


  // Whenever someone clicks a save note button
  $(".note-button").on("click", function (event) {
    handleArticleNotes($(this).attr("data-id"));
  });



  // When you click the savenote button
  $(document).on("click", ".btn.save", function () {
    // Grab the id associated with the article from the submit button
    var noteData = $(this).data("article");
    var thisId = noteData._id;
    var newNote = $(".bootbox-body textarea").val().trim();
    // If we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };     
      $.ajax({
        method: "POST",
        url: "/articles/note/" + thisId,
        data: newNote
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // When complete, close the modal
        bootbox.hideAll();
         // Empty the notes section
        $("#notes").empty();
      });
    }
  });
})