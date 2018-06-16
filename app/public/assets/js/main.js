$(function () {



    $('.save').on('click', function (event) {
        event.preventDefault();

        if ($(this).hasClass('btn-info')) {
            $(this).removeClass("btn-info");
            $(this).addClass("btn-success");
            $(this).text("Saved");

            let articleID = { id: $(this).data("id") };
            console.log(articleID);

            $.ajax({
                url: '/save',
                type: 'PUT',
                data: articleID,
                success: function (data) {
                    console.log(`Article ${articleID.id} Marked as Saved`)
                }
            });

        } else {
            $(this).removeClass("btn-success");
            $(this).addClass("btn-info");
            $(this).text("Save");

            let articleID = { id: $(this).data("id") };
            console.log(articleID);

            $.ajax({
                url: '/unsave',
                type: 'PUT',
                data: articleID,
                success: function (data) {
                    console.log(`Article ${articleID.id} No Longer Saved`)
                }
            });
        }

    })

    $('.add-comment').on('click', function (event) {

        let articleID = $(this).data("id")

        let commentBox = $('<div>')

        event.preventDefault();
        $(commentBox).html(`
        <form>
        <div class="form-group">
          <label>New Comment</label>
          <input type="text" class="form-control" placeholder="Enter title" id="title">
        </div>
        <div class="input-group">
          <textarea class="form-control" aria-label="With textarea" placeholder="Enter comment" id="body"></textarea>
        </div>
        <br>
        <button type="submit" class="submit btn btn-primary">Add</button>
      </form>`)

      $('.comment-box').append(commentBox);

        $('.submit').on('click', function (event) {
            event.preventDefault();
            let newComment = {
                title: $('#title').val().trim(),
                body: $('#body').val().trim()
            }

            $.ajax({
                type: "POST",
                url: "/articles/"+articleID,
                data: newComment
            }).then(function (data) {
                console.log("Comment added");
                $('#comment-box').hide();
            });


        })
    });



});