/**
 * Created by 1234 on 21.11.2016.
 */

$(window).on('load', function() {

    /*########################################################################################################## BUTTON:ADD ALARM ZONE */
    /*########################################################################################################## BUTTON:ADD ALARM ZONE*/
    /*########################################################################################################## BUTTON:ADD ALARM ZONE*/
    /*########################################################################################################## BUTTON:ADD ALARM ZONE*/
    /*########################################################################################################## BUTTON:ADD ALARM ZONE*/
    document.getElementById('id_Creat_Alarm_Zone').addEventListener('click', function() {
        DisplayAlarmZones(null);
        if(Count_Alarm_Zones>4){alert("Max Alarm Zones!!!"); PageState('creat_alarm_zone_max'); return false;}//если зон уже 5 выходим.
        scale_wind.setScale(0.9, 100, 100); canvas.renderAll();
        scale_to_set=1;
        prototypefabric.polygon.drawPolygon();
        fl_alarm_zome=true;
        PageState('creat_alarm_zone');
    });
    /*########################################################################################################## BUTTON:DELETE */
    /*########################################################################################################## BUTTON:DELETE*/
    /*########################################################################################################## BUTTON:DELETE*/
    /*########################################################################################################## BUTTON:DELETE*/
    /*########################################################################################################## BUTTON:DELETE*/
    document.getElementById('id_Delete_Alarm_Zone').addEventListener('click', function() {
        var i,t;
        if(Select_Alarm_Zone>=0){
            canvas.remove(Alarm_Zones[Select_Alarm_Zone]['polygon']);
            canvas_down.remove(Alarm_Zones[Select_Alarm_Zone]['polygon_down']);
            for(i in Alarm_Zones){object_db.delete_row(""+i+"");}

            delete Alarm_Zones[Select_Alarm_Zone];
            t=0;for(i in Alarm_Zones){Alarm_Zones[t]=Alarm_Zones[i]; if(t!=i){delete Alarm_Zones[i];} t++;}

            for(i in Alarm_Zones){object_db.add_row(""+i+"",'{"alarm_zone":['+JSON.stringify(Alarm_Zones[i]['polygon'])+','+JSON.stringify(Alarm_Zones[i]['polygon_down'])+']}',Alarm_Zones[i]['name'],Alarm_Zones[i]['color'], '0', '0', '0', '0', '0');}

            Alarm_Zone_Select=null;

            fl_alarm_zome=false;
            Count_Alarm_Zones--;
            DisplayAlarmZones(null);
            PageState('delete_alarm_zone');
            Render_All_Canvas();
        }

    }, false);
    /*########################################################################################################## BUTTON:MODIFY */
    /*########################################################################################################## BUTTON:MODIFY*/
    /*########################################################################################################## BUTTON:MODIFY*/
    /*########################################################################################################## BUTTON:MODIFY*/
    /*########################################################################################################## BUTTON:MODIFY*/
    document.getElementById('id_Modify_Alarm_Zone').addEventListener('click', function() {
        Modify_Alarm_Zone();
    }, false);

    /*########################################################################################################## BUTTON:LOAD IMAGE */
    /*########################################################################################################## BUTTON:LOAD IMAGE*/
    /*########################################################################################################## BUTTON:LOAD IMAGE*/
    /*########################################################################################################## BUTTON:LOAD IMAGE*/
    /*########################################################################################################## BUTTON:LOAD IMAGE*/
    document.getElementById('id_Upload_Image').addEventListener("change", function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function (img) {
                var oImg = img.set({left: 0, top: 0, angle: 0,  id: 'image_forward'}).scale(1);
                if(image_save){canvas.remove(image_save);}
                canvas.add(oImg);
                image_save=oImg;
                canvas.sendBackwards(image_save);canvas.setActiveObject(radar_obj_save);
                imageURL = canvas.toDataURL({format: 'png', quality: 0.8});
            });
            document.getElementById("id_Save_Image").disabled=false;
            document.getElementById("id_Scale_Image").disabled=false;

        };
        reader.readAsDataURL(file);
        PageState('load_image');
    });

    /*########################################################################################################## BUTTON:Create_Radar */
    /*########################################################################################################## BUTTON:Create_Radar*/
    /*########################################################################################################## BUTTON:Create_Radar*/
    /*########################################################################################################## BUTTON:Create_Radar*/
    /*########################################################################################################## BUTTON:Create_Radar*/
    document.getElementById('id_Create_Radar').addEventListener('click', function(){
        Create_Radar();
    });







});


