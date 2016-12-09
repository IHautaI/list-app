var allowedFilenames = new RegExp(/^[A–Za–z0–9._-]+$/);

var addItem = function(){
  $('form[class="form-inline addlist"]').submit(function (e) {
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
       name: obj["name"],
       last: $(e.target).children().length
      }
    })
    .fail(function(){
      alert("There was a problem")
    })
    .done(function(data, status, xhr){
      if(xhr.status == 200){
        $("input[placeholder='new item']")[0].value = "";
        $("#" + obj["name"] + "-elements").append(data);
      }
    });
  });
};
addItem();
