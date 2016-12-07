$('form[class="form-inline add"]').submit(function (e) {
  e.preventDefault();

  var flat = function(obj){
    return function(inp){
      $.each(inp, function(i, input){
          obj[input.name] = input.value;
      });
    };
  };

  var obj = {};
  var flatten = flat(obj);

  var traverse = function(inp){
    flatten(inp.serializeArray());

    if(inp.children[0] != null){
      $.each(inp.children, traverse);
    }
  };

  traverse($(e.target));

  $.ajax({
    type: "POST",
    url: "/list/add",
    data: {
     item: obj["item"],
     name: obj["name"]
    }
  })
  .fail(function(){
    alert("There was a problem")
  })
  .done(function(data, status, xhr){
    if(xhr.status == 200){
      $("#" + obj["name"]).trigger('shown.bs.tab');
    }
  });

});
