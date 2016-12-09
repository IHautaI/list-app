var addList = function(){
  $('form[action="/add"]').submit(function (e) {
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

    if(allowedFilenames.test(obj["name"])){

      $.ajax({
        type: "POST",
        url: "/add",
        data: {
          name: obj['name']
        }
      })
      .fail(function(){
        alert("There was a problem")
      })
      .done(function(data, status, xhr){
        $("ul[role='tablist']").append('<li><a href="#' + obj['name'] + '" data-toggle="tab">' + obj['name'] + '</a></li>');
      })
      .then(function(){
        main(true);
        // addItem();
        // dropItem();
      })
      .then(function(){
        $("a[href='#" + obj['name'] + "']").trigger('shown.bs.tab');
      });
    } else {
      alert("bad filename given! try again...");
    }
  });
};
addList();
