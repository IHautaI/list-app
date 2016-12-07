$('a[class=drop]').click(function (e) {
  e.preventDefault();
  var target = $(e.target).attr("href");
  var item = target.slice(1, target.length);
  var list = $(e.target).attr("list");
  var idx = $(e.target).attr("value");

  $.ajax({
    type: "POST",
    url: "/list/drop",
    data: {
     item: item,
     name: list
    }
  })
  .fail(function(){alert("There was a problem")
  })
  .done(function(data, status, xhr){

    if(xhr.status == 200){
      var id = "#" + list + "-" + idx;
      $(id).remove();
    }
  });

});
