$(document).ready(function() {

  // Get all the articles
  // $.getJSON("/all", function(data) {
  //   $.each(data, function(index, value) {
  //     var item = $('<div class="article-item">');
  //     item.append(value.title);

  //     $('#articles').append(item);
  //   });
  // });


  // Save an article
  $(document).on("click", ".btn-save", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var articleId = $(this).parents('.article-item').data("id");

    // Ajax PUT request for the save route
    $.ajax({
      method: "PUT",
      url: "/save/" + articleId,
    }).then(function(data) {
      if (data.saved) {
        Materialize.toast('Article added to Saved Articles', 3000);
        $("[data-id='" + data._id + "']").fadeOut(1000); 
      }
    });
  });

  // Save an article
  $(document).on("click", ".btn-unsave", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var articleId = $(this).parents('.article-item').data("id");

    // Ajax PUT request for the save route
    $.ajax({
      method: "PUT",
      url: "/unsave/" + articleId,
    }).then(function(data) {
      if (data.saved) {
        Materialize.toast('Article Removed from Saved Articles', 3000);
        $("[data-id='" + data._id + "']").fadeOut(1000); 
      }
    });
  });

});