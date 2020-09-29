var map_num = {};
    var table;
    var level_list = [];
    function get_html(){
        query = "add_ACAO.php?url=" + $('#url_input').val();
        $('option').remove();
        map_num = {};
        level_list = [];
        $.ajax({
            url: query,
            success: function(data){
                get_bmstable(data)
            },
            error: function(){
                console.log("error");
            }
        })
    }   
    function get_bmstable(data){
        for(var i = 0; i < $(data).length; i++){
            var elem = $(data)[i];
            if(typeof elem.name !== 'undefined'){
                if(elem.name === "bmstable"){
                    var bmstable = $(data)[i].content;
                }
            }
        }
        if(bmstable.split('/')[0] != "http:"){
            var u = $('#url_input').val();
            var split = u.split('/');
            var base = "";
            for(var i = 0; i < split.length-1; i++){
                var part = split[i] + "/";
                base += part;
            }
            query = "add_ACAO.php?url=" + base + bmstable;
        }else{
            query = "add_ACAO.php?url=" + bmstable;
        }

        $.get(query,function(data){
            data_json = JSON.parse(data);
            var data_url = data_json.data_url;
            var symbol = data_json.symbol;
            var level_order_exists = typeof data_json.level_order !== 'undefined' ? true : false;
            if(level_order_exists){
                var level_order = data_json.level_order;
                level_order.forEach(function(elem){
                    map_num[symbol + elem] = [];
                    // level_list.push(symbol + elem);
                });
            }
            if(data_url.split('/')[0] != "http:"){
                query = "add_ACAO.php?url=" + base + data_url;
            }else{
                query = "add_ACAO.php?url=" + data_url;
            }
            $.get(query, function(data){
                data_json = JSON.parse(data);
                var flag = false;
                table = data_json;
                for(var i = 0; i < data_json.length; i++){
                    var newLevel = true;
                    if(!level_order_exists){
                        for(var key in map_num){
                            if(key == symbol + data_json[i].level){
                                newLevel = false;
                                break;
                            }
                        }
                        if(newLevel){
                            map_num[symbol + data_json[i].level] = [];
                            // level_list.push(symbol + data_json[i].level);
                        }
                        newLevel = true;
                    }
                    for(var key in map_num){
                        if(key == symbol + data_json[i].level){
                            map_num[key].push(i);
                            flag = true;
                        }
                    }
                    if(!flag){
                        console.log("invalid level value found.");
                    }
                }
                flag = false;
                var idx = 0;
                for(var key in map_num){
                    var select = document.getElementById("level");
                    var option = document.createElement("option");
                    option.text = key;
                    option.value = idx;
                    select.appendChild(option);
                    idx++;
                }
            });
        });  
    }
function start(){
        var level_text = $("#level option:selected").text();
        var level_val = $("#level").val();
        var rand = Math.floor(Math.random() * map_num[level_text].length);
        var idx = map_num[level_text][rand];
        $('#result').text(table[idx].title);
    }