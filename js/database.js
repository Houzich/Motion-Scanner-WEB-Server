/**
 * Created by 1234 on 06.11.2016.
 */
$(window).on('load', function() {
    alarm_history_db.init();
});


var alarm_history_db = new function () {
    var Alarm_History_Database;
    this.init = function () {
        if (typeof(openDatabase) !== 'undefined') {
            alarm_history_db.open();
            alarm_history_db.create_table();
            //alarm_history_db.get_data();
            alarm_history_db.get_data_arr();
        }
        else {
            alert(' Ваш браузер не поддерживает технологию Web SQL ');
        }


        $('#id_Clear_Alarm_History').click(function () {
            alarm_history_db.delete_table();
            alarm_history_db.create_table();
            alarm_history_db.get_data_arr();
        });





    };

    // Для удобства помещаем функцию в глобальную переменную
    this.open = function () {
        Alarm_History_Database = openDatabase("AlarmList", "1.0", "Alarm List History", 1024 * 1024 * 5);
        if(!Alarm_History_Database){alert("Failed to connect to database.");}
        //console.info(Alarm_List.init.db);
        // название БД, версия, описание, размер
    };

    // Создаем таблицу
    this.create_table = function () {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS todo (ID INTEGER PRIMARY KEY ASC,alarm_zone TEXT,time_alarm VARCHAR,object_type TEXT,object_id TEXT,distance_x TEXT,distance_y TEXT)", []);
        });
    };

    // Создаем таблицу
    this.delete_table = function () {
        var tbl = document.getElementById("id_Alarm_List_Tbody");
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("DROP TABLE IF EXISTS todo", []);
        });
        while (tbl.firstChild) {tbl.removeChild(tbl.firstChild);}
    };

/*    // функция добавления записи
    this.add_row = function (AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY) {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("INSERT INTO todo (alarm_zone,time_alarm,object_type,object_id,distance_x,distance_y) VALUES (?,?,?,?,?,?)", [AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY]
                /!*,showAllTodo(true,AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY)*!/);
        });
    };*/

    // функция добавления записи
    this.add_row = function (Id, AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY) {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("INSERT INTO todo (ID,alarm_zone,time_alarm,object_type,object_id,distance_x,distance_y) VALUES (?,?,?,?,?,?,?)", [Id, AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY]
                /*,showAllTodo(true,AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY)*/);
        });
    };



    // получение данных из БД
    this.get_data = function () {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("SELECT * FROM todo ORDER BY time_alarm ASC", [], function (tx, result) {
                for (var i = 0; (i<result.rows.length)&&(i<20); i++) {
                //for (var i = 0; i<result.rows.length; i++) {
                    alarm_zone = result.rows.item(i).alarm_zone;
                    time_alarm = result.rows.item(i).time_alarm;
                    object_type = result.rows.item(i).object_type;
                    object_id = result.rows.item(i).object_id;
                    distance_x = result.rows.item(i).distance_x;
                    distance_y = result.rows.item(i).distance_y;
                    todo_id = result.rows.item(i).ID;
                    showAllTodo(false,alarm_zone, time_alarm, object_type, object_id, distance_x, distance_y, todo_id);
                }
            });
        });
    };


    // получение данных из БД
    this.get_data_arr = function () {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("SELECT * FROM todo ORDER BY time_alarm ASC", [], function (tx, result) {
                var Tbl={};
                for (var i = 0; (i<result.rows.length)&&(i<20); i++) {
                    Tbl[i]={};
                    Tbl[i]["alarm_zone"] = result.rows.item(i).alarm_zone;
                    Tbl[i]["time_alarm"] = result.rows.item(i).time_alarm;
                    Tbl[i]["object_type"] = result.rows.item(i).object_type;
                    Tbl[i]["object_id"] = result.rows.item(i).object_id;
                    Tbl[i]["distance_x"] = result.rows.item(i).distance_x;
                    Tbl[i]["distance_y"] = result.rows.item(i).distance_y;
                    Tbl[i]["id_row_db"] = result.rows.item(i).ID;
                }
                Show_Tabl_Alarm_History(false,Tbl);
                alarm_history_tbl.sort(1);
            });
        });
    };


    // удаление записей из таблицы
    this.delete_row = function (id) {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("DELETE FROM todo WHERE ID=?", [id]);
        });
    };


    // размещаем созданные записи на странице
    function showAllTodo(fl_highlight,alarm_zone, time_alarm, object_type, object_id, distance_x, distance_y, todo_id) {
        /*        $('ul.list').append(
         '<li><div class="todo_item"><span class="todo_text">' + alarm_zone + '</span>' +
         '<span class="todo_text">' + time_alarm + '</span>' +
         '<span class="todo_text">' + object_type + '</span>' +
         '<span class="todo_text">' + object_id + '</span>' +
         '<span class="todo_text">' + distance_x + '</span>' +
         '<a id="delete"> Удалить </a><span class="todo_text">' + distance_y + '</span>' +
         '<input  value="' + todo_id + '" type="hidden"><div class="clear"></div></div></li>');

         $('li:last').addClass('highlight').delay(1000).queue(function(next){ $(this).removeClass('highlight'); next(); });*/
        alarm_history_tbl.add_row(1,fl_highlight, alarm_zone, time_alarm, object_type, object_id, distance_x, distance_y);
    }

};


function DelRowAlarmHistory(x,id) {
    var tbl = document.getElementById("id_Alarm_List_Tbody");
    alarm_history_db.delete_row(id);

    while (tbl.firstChild) {tbl.removeChild(tbl.firstChild);}

    if (typeof(openDatabase) !== 'undefined') {
        alarm_history_db.init();
    }
    else {
        $('#bodyWrapper').html('<h2 class="error_message"> Ваш браузер не поддерживает технологию Web SQL </h2>');
    }
}

// размещаем созданные записи на странице
function Show_Tabl_Alarm_History(fl_highlight,tbl_arr) {
    alarm_history_tbl.add_row_arr(fl_highlight,tbl_arr);
}