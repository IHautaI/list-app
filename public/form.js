var allowedFilenames = /^([\w0–9._-])+$/;

var flat = function(inp, obj){
  $.each(inp, function(i, input){
    obj[input.name] = input.value;
  });
};

var traverse = function(inp, obj){
  flat(inp.serializeArray(), obj);

  if(inp.children[0] != null){
    $.each(inp.children, function(item){traverse(item, obj)});
  }
};

var addItem = function(){
  $('form[class="form-inline addlist"]').submit(function (e) {
    e.preventDefault();

    var obj = {};
    traverse($(e.target), obj);

    $.ajax({
      type: "POST",
      url: "/list/add",
      data: {
       item: obj["item"],
       name: obj["name"],
       length: $("#" + obj["name"] + "-elements").children().length
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
    }).then(function(){
      changeItem();
      dropItem();
    });

  });
};

var changeItem = function(){
  $('form[action="/change"]').submit(function(e){
    e.preventDefault();

    var obj = {};
    traverse($(e.target), obj);

    $.ajax({
      type: "POST",
      url: "/list/change",
      data: {
        name: obj["name"],
        index: obj["index"],
        value: obj["value"]
      }
    })
    .fail(function(){alert("failed to change entry!")});
  });
};

var dropItem = function(){
  $('a[class=drop]').click(function (e) {
    e.preventDefault();

    var ct = $(e.currentTarget);

    var target = ct.attr("href");
    var item = target.slice(1, target.length);
    var list = ct.attr("list");
    var idx = ct.attr("value");
    console.log(item);
    console.log(list);
    console.log(idx);

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
        $("#" + list).html(data);
      }
    })
    .then(function(){
      addItem();
      dropItem();
      changeItem();
    });

  });

};

var main = function(){
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href"); // activated tab

    if ($(target).is(':empty')) {
      $.ajax({
        type: "GET",
        url: "/list/" + target.slice(1,target.length)
      })
      .fail(function(data){
          alert("There was a problem");
      })
      .done(function(data, status, xhr){
        $(target).html(data);
      })
      .then(function(){
        addItem();
        dropItem();
        changeItem();
      });
    };
  });
};

var addList = function(){
  $('form[action="/add"]').submit(function (e) {
    e.preventDefault();

    var obj = {};
    traverse($(e.target), obj);
    console.log("addList");
    console.log(obj)

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
        $("ul[role='tablist']").append('<li><a href="#' + obj['name'] + '" data-toggle="tab" aria-expanded="false">' + obj['name'] + '</a></li>');
        $(".tab-content").append('<div id="' + obj['name'] + '" class="tab-pane"></div>');
      })
      .then(function(){
        main();
      })
      .then(function(){
        $("a[href='#" + obj['name'] + "']").trigger('click');
        $("input[placeholder='new list']")[0].value = "";
      });
    } else {
      alert("bad filename give!  try again..");
    }
  });
};

main();
addList();
