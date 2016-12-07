$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var target = $(e.target).attr("href") // activated tab

  if ($(target).is(':empty')) {
    $.ajax({
      type: "GET",
      url: "/list/" + target.slice(1,target.length)
    })
    .fail(function(data){
        alert("There was a problem");
    })
    .done(function(data){
      $(target).html(data);

      $.ajax({
        url: "/public/dropform.js",
        datatype: "script"
      })

      $.ajax({
        url: "/public/addform.js",
        datatype: "script"
      })
    });
  }

});
