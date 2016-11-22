/**
 * Created by 1234 on 07.11.2016.
 */
//var Object_Database = openDatabase("ObjectDB1", "1.0", "Object Database", 1024 * 1024 * 5);

$(window).on('load', function() {
    object_db.init();
});

var object_db = new function () {
    var Object_Database;
    this.init = function () {
        if (typeof(openDatabase) !== 'undefined') {
            object_db.open();
            object_db.create_table();
            object_db.get_data();
            //object_db.delete_table();
        }
        else { alert(' Ваш браузер не поддерживает технологию Web SQL ');}


        $('#id_Clear_Object_Database').click(function () {object_db.delete_table();object_db.create_table();object_db.get_data();});
    };

    // Для удобства помещаем функцию в глобальную переменную
    this.open = function () {
        Object_Database = openDatabase("ObjectDBf", "1.0", "Object Database", 1024 * 1024 * 5);
        if(!Object_Database){alert("Failed to connect to database.");}
        // название БД, версия, описание, размер
    };

    // Создаем таблицу
    this.create_table = function () {
        Object_Database.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS todo (ID INTEGER PRIMARY KEY ASC,type TEXT,object TEXT,name TEXT,color TEXT,alrm_type TEXT,alrm_url TEXT,radar_height TEXT,radar_offset_x TEXT,radar_offset_y TEXT,radar_azimuth_angle TEXT,radar_elevation_angle TEXT)", []);
        });
    };

    // Удаляем таблицу
    this.delete_table = function () {
        Object_Database.transaction(function (tx) {
            tx.executeSql("DROP TABLE IF EXISTS todo", []);
        });
    };

    // функция добавления записи
    this.add_row = function (Type, Object, Name, Color, AlrmType, AlrmUrl, RadarHeight, RadarOffsetX, RadarOffsetY, RadarAzimuthAngle, RadarElevationAngle) {
        Object_Database.transaction(function (tx) {
            tx.executeSql("INSERT INTO todo (type,object,name,color,alrm_type,alrm_url,radar_height,radar_offset_x,radar_offset_y,radar_azimuth_angle,radar_elevation_angle) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [Type, Object, Name, Color, AlrmType, AlrmUrl, RadarHeight, RadarOffsetX, RadarOffsetY, RadarAzimuthAngle, RadarElevationAngle]);
        });
    };

    // получение данных из БД
    this.get_data = function () {
        var i,type,obj,obj_name,obj_color,obj_alrm_type,obj_alrm_url,rdr_height,rdr_offset_x,rdr_offset_y,rdr_azimuth_angle,rdr_elevation_angle,todo_id,fl_radar=false;
        Object_Database.transaction(function (tx) {
            tx.executeSql("SELECT * FROM todo", [], function (tx, result) {
                for (i = 0; i < result.rows.length; i++) {
                        obj = result.rows.item(i).object;
                        obj_name = result.rows.item(i).name;
                        obj_color = result.rows.item(i).color;
                        obj_alrm_type = result.rows.item(i).alrm_type;
                        obj_alrm_url = result.rows.item(i).alrm_url;
                        rdr_height = result.rows.item(i).radar_height;
                        rdr_offset_x = result.rows.item(i).radar_offset_x;
                        rdr_offset_y = result.rows.item(i).radar_offset_y;
                        rdr_azimuth_angle = result.rows.item(i).radar_azimuth_angle;
                        rdr_elevation_angle = result.rows.item(i).radar_elevation_angle;
                        type = result.rows.item(i).type;
                        todo_id = result.rows.item(i).ID;

                    if(type=="radar"){
                        //var radr={objects:[{type:"text", originX:"center", originY:"center", left:100, top:60, width:200, height:30, fill:"rgb(0,0,0)", overlayFill:null, stroke:null, strokeWidth:1, strokeDashArray:null, scaleX:1, scaleY:1, angle:0, flipX:false, flipY:false, opacity:1, selectable:true, hasControls:true, hasBorders:true, hasRotatingPoint:true, transparentCorners:true, perPixelTargetFind:false, shadow:null, visible:true, text:"Test Text", fontSize:30, fontWeight:"normal", fontFamily:"Arial", fontStyle:"", lineHeight:1.3, textDecoration:"", textShadow:"", textAlign:"left", strokeStyle:"", backgroundColor:"", textBackgroundColor:"", useNative:true}]};
                        var radr=JSON.parse(obj);
                        var radr_obj=fabric.util.getKlass(radr.objects[0].type).fromObject(radr.objects[0]);
                        radr_obj.set({evented: false,selectable: false,hasControls: false, hasBorders: false});
                        canvas.add(radr_obj);
                        var radr_obj_down=fabric.util.getKlass(radr.objects[0].type).fromObject(radr.objects[0]);
                        radr_obj_down.set({evented: false,selectable: false,opacity: 10/255});
                        canvas_down.add(radr_obj_down);
                        radar_obj_save=radr_obj;
                        radar_down_obj_save=radr_obj_down;
                        fl_radar=true; showRadar(rdr_height, rdr_offset_x, rdr_offset_y, rdr_azimuth_angle, rdr_elevation_angle, fl_radar);
                    }else{
                        var polygon=JSON.parse(obj);
                        var group_obj=[];

                        for(var h=0;h<polygon.alarm_zone[0].objects.length;h++){
                            group_obj.push(fabric.util.getKlass(polygon.alarm_zone[0].objects[h].type).fromObject(polygon.alarm_zone[0].objects[h]));
                        }

                        var group = new fabric.Group(group_obj, {left:polygon.alarm_zone[0].left, top:polygon.alarm_zone[0].top, fill:obj_color,stroke:obj_color, evented: false,selectable: false});
                        var polygon_obj_down=fabric.util.getKlass(polygon.alarm_zone[1].type).fromObject(polygon.alarm_zone[1]);

                        var fill_clr='rgb('+(1<<Count_Alarm_Zones)*15+', 0,0)';
                        polygon_obj_down.set({stroke: fill_clr,fill: fill_clr,opacity: 18/255});
                        //console.info(fill_clr,Count_Alarm_Zones);

                        if(obj_alrm_url.length<3){obj_alrm_url='';}
                        Alarm_Zones[Count_Alarm_Zones]={};
                        Alarm_Zones[Count_Alarm_Zones]['name']=obj_name;
                        Alarm_Zones[Count_Alarm_Zones]['color']=obj_color;
                        Alarm_Zones[Count_Alarm_Zones]['type_alarm']=obj_alrm_type;
                        Alarm_Zones[Count_Alarm_Zones]['url']=obj_alrm_url;
                        Alarm_Zones[Count_Alarm_Zones]['polygon']=group;
                        Alarm_Zones[Count_Alarm_Zones]['polygon_down']=polygon_obj_down;

                        DisplayAlarmZones(null);

                        Count_Alarm_Zones++;
                        canvas.add(group);
                        canvas_down.add(polygon_obj_down);
                    }
                }
                Render_All_Canvas();
                if(!fl_radar){showRadar('360.0', '0.0', '0.0', '60.0', '0.0',fl_radar);}
            });
        });
        //alarm_history_tbl.sort(1);
    };

    // удаление записей из таблицы
    this.delete_row = function (type) {
        Object_Database.transaction(function (tx) {
            tx.executeSql("DELETE FROM todo WHERE type=?", [type]);
        });
    };


    // размещаем созданные записи на странице
    function showRadar(rdr_height, rdr_offset_x, rdr_offset_y, rdr_azimuth_angle, rdr_elevation_angle, fl_radar) {
        $('#Radar_Height').val(rdr_height);
        $('#Radar_Offset_X').val(rdr_offset_x);
        $('#Radar_Offset_Y').val(rdr_offset_y);
        $('#Radar_Azimuth_Angle').val(rdr_azimuth_angle);
        $('#Radar_Elevation_Angle').val(rdr_elevation_angle);
        if(!fl_radar){Create_Radar();}
    }
};

