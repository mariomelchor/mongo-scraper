$(document).ready(function() {

  // initialize modal
  $('.modal').modal();  

  // initialize masonry
  var $grid = $('.article-grid').masonry({
    itemSelector: '.article-item',
    columnWidth: '.article-sizer',
    percentPosition: true,
    initLayout: true,
  });

  $grid.masonry();

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
      if (data) {
        Materialize.toast('Article added to Saved Articles', 3000);
        $("[data-id='" + data._id + "']").remove();
        $grid.masonry();
      }
    });
  });

  // UnSave an article
  $(document).on("click", ".btn-unsave", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var articleId = $(this).parents('.article-item').data("id");

    // Ajax PUT request for the save route
    $.ajax({
      method: "PUT",
      url: "/unsave/" + articleId,
    }).then(function(data) {
      if (data) {
        Materialize.toast('Article Removed from Saved Articles', 3000);
        $("[data-id='" + data._id + "']").remove(); 
        $grid.masonry();
      }
    });
  });

  // Add Comment
  $(document).on("click", ".add-comment", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var articleId = $(this).parents('.article-item').data("id");
    var articleTitle = $(this).parents('.article-item').find(".card-title a").text();
    console.log(articleTitle);
    $('#save-comment').attr('data-article', articleId);
    $('.comment-article-title').text(articleTitle);

    // Remove comments
    $("#comments").empty();

    $.ajax({
      method: "GET",
      url: "/articles/" + articleId
    })
    .done(function(data) {
      console.log(data);
      if (data.comment.length > 0) {
        $.each(data.comment, function( index, value ) {
          $("#comments").append('<li class="collection-item"><div class="chip"><img src="images/anonymous.png" alt="Anonymous"> Anonymous</div>' + value.comment + '<a href="#" id="remove-comment" class="right" data-comment="'+ value._id +'"><i class="material-icons orange-text">delete</i></a></li>');
        });
      } else {
        $("#comments").append('<li class="collection-item">No Comments</li>');
      }
    });
  
  });

  // Save a comment
  $(document).on("click", "#save-comment", function(e){
    e.preventDefault();

    var articleId = $(this).data("article");
    var comment = $("#comment").val();

    console.log(comment);

    // Ajax PUT request for the comments route
    $.ajax({
      method: "POST",
      url: "/comments/" + articleId,
      data        : {
        "comment": comment
      },
      dataType    : 'json',
    }).then(function(data) {
      if (data) {
        Materialize.toast('Comment has been Saved', 3000);
        $("#comment").val('');
        $('.modal').modal('close');
      }
    });
  
  });

  // Remove comment
  $(document).on("click", "#remove-comment", function(e){
    e.preventDefault();

    var commentId = $(this).data("comment");

    // Ajax PUT request for the removing comments
    $.ajax({
      method: "PUT",
      url: "/comments/remove/" + commentId,
      dataType    : 'json',
    }).then(function(data) {
      if (data) {
        Materialize.toast('Comment has been Removed', 3000);
        $('.modal').modal('close');
      }
    });
  
  });

});