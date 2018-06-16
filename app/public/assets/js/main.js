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



});