var min = 99;
var max = 999999;
var polygonMode = false;

//********************************************************************
var ctx_canvas_down;
var pointArray = [];
var lineArray = [];
var activeLine;
var canvas;
var canvas_down;
var Alarm_Zones = {};
var Alarm_Zone_Temp = {};
var Select_Alarm_Zone=null;
var radar_obj_save = false;
var radar_down_obj_save = false;
var image_save = false;
var Obj_Old={};
var Obj_New={};
var Alarm_Obj_Old = {};
var cont_disp=2;
var Count_Alarm_Zones=0;
//*****************************************************************
var flag_url = false;
var count_check_url = 5;





var imageURL;
var object_status='modify_enable';
var fl_alarm_zome=false;


var color_resive_obj= ['Green','Orange','Yellow','Pink','Indigo','Purple','Maroon','Fuchsia','Olive','Aqua','Grey','Gold','Pink','Teal','DarkRed'];
var text_json_Test= '{"objects":[{"object_id":"1", "quality":"5", "distance_x":"25.1", "distance_y":"115.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}, {"object_id":"2", "quality":"2", "distance_x":"35.1", "distance_y":"215.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}, {"object_id":"3", "quality":"1", "distance_x":"45.1", "distance_y":"315.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}, {"object_id":"4", "quality":"3", "distance_x":"55.1", "distance_y":"415.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}]}';

$(window).on('load', function() {
    document.getElementById("id_Save_Image").disabled=true;
    document.getElementById("id_Scale_Image").disabled=true;
    prototypefabric.initCanvas();
    Resize_Canvas();
});

var prototypefabric = new function () {
    this.initCanvas = function () {
        var element = $('#c'); // ещё пригодится для обработки событий
        canvas = new fabric.Canvas('c',{renderOnAddRemove: false}); canvas.scale = 1;//обязательно для массштабирования
        canvas_grid_bottom = new fabric.Canvas('id_Canv_Grid_Bottom_Canv',{renderOnAddRemove: false}); canvas_grid_bottom.scale = 1;//обязательно для массштабирования
        canvas_grid_left = new fabric.Canvas('id_Canv_Grid_Left_Canv',{renderOnAddRemove: false});   canvas_grid_left.scale = 1;//обязательно для массштабирования

        canvas_down = new fabric.Canvas('c2',{renderOnAddRemove: false}); canvas.scale = 1;
        var container = $(canvas.wrapperEl);
        pointArray[0]=[];
        ctx_canvas_down    = canvas_down.getContext('2d');
        //Перемещаем координаты
        //var ctx = canvas.getContext('2d');
        //ctx.translate(parseInt(canvas.width, 10)/2, canvas.height);
        //canvas.setWidth($(window).width());
        //canvas.setHeight($(window).height()-$('#nav-bar').height());
        //canvas.selection = false;
        /*########################################################################################################## MOUSE:DOWN */
        /*########################################################################################################## MOUSE:DOWN */
        /*########################################################################################################## MOUSE:DOWN */
        /*########################################################################################################## MOUSE:DOWN */
        /*########################################################################################################## MOUSE:DOWN */
        canvas.on('mouse:down', function (options) {

/*            var ctx = canvas_down.getContext('2d');
            var imgData1 = ctx.getImageData(options.e.layerX, options.e.layerY, 1, 1).data;
            console.info(imgData1);*/

            canvas.sendBackwards(radar_obj_save);
            if(image_save){canvas.sendBackwards(image_save);}

            if (options.target && options.target.id == pointArray[0].id) {
                prototypefabric.polygon.generatePolygon(pointArray);
            }
            if (polygonMode) {
                prototypefabric.polygon.addPoint(options);
            }

            if((fl_draw_scale_line=='start_draw_line')||(fl_draw_scale_line=='draw_line')){scaling.line.addPoint(options);}
            if ((fl_draw_scale_line=='modify_line')&&(options.target && options.target.id == arr_pointLine[0].id)) {scaling.line.addPoint(options);}
            if ((fl_draw_scale_line=='modify_line')&&(options.target && options.target.id == arr_pointLine[1].id)) {scaling.line.addPoint(options);}
            if(fl_draw_scale_line=='modify_point_0'){scaling.line.addPoint(options);}
            if(fl_draw_scale_line=='modify_point_1'){scaling.line.addPoint(options);}
        });

        /*########################################################################################################## MOUSEWHEEL */
        /*########################################################################################################## MOUSEWHEEL */
        /*########################################################################################################## MOUSEWHEEL */
        /*########################################################################################################## MOUSEWHEEL */
        /*########################################################################################################## MOUSEWHEEL */
        // Масштабирование колесом мыши
        container.mousewheel(function(event, delta, deltaX, deltaY) {



            if(fl_alarm_zome==false){

                var offset = element.offset(), // положение холста на странице
                    centerX = event.pageX - offset.left, // координата x центра масштабирования
                    centerY = event.pageY - offset.top, // координата y центра масштабирования
                    zoomStep = Math.pow(1.1, deltaY); // шаг масштабирования, удобный для пользователя.


                anchor_x = centerX; anchor_y = centerY; scale_to_set = scale_sc * zoomStep;
                scale_wind.setScale(scale_sc * zoomStep, centerX, centerY);
                canvas.renderAll();
            // Отключим скролл страницы
            event.preventDefault();}
            return false;
        });
        /*########################################################################################################## MOUSE:UP */
        /*########################################################################################################## MOUSE:UP */
        /*########################################################################################################## MOUSE:UP */
        /*########################################################################################################## MOUSE:UP */
        /*########################################################################################################## MOUSE:UP */
        canvas.on('mouse:up', function (options) {

        });
        /*########################################################################################################## MOUSE:MOVE */
        /*########################################################################################################## MOUSE:MOVE */
        /*########################################################################################################## MOUSE:MOVE */
        /*########################################################################################################## MOUSE:MOVE */
        /*########################################################################################################## MOUSE:MOVE */
        canvas.on('mouse:move', function (options) {

            if(activeLine && activeLine.class == "line"){
                var pointer = canvas.getPointer(options.e);
                activeLine.set({ x2: pointer.x, y2: pointer.y });

                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x:pointer.x,
                    y:pointer.y
                }

                activeShape.set({
                    points: points
                });
                canvas.renderAll();
            }

            if(fl_draw_scale_line=='draw_line'){
                var pointer = canvas.getPointer(options.e);
                active_scale_line.set({ x2: pointer.x, y2: pointer.y });
                canvas.renderAll();
            }
            if(fl_draw_scale_line=='modify_point_0'){
                var pointer = canvas.getPointer(options.e);
                active_scale_line.set({ x1: pointer.x, y1: pointer.y });
                arr_pointLine[0].set({ left: pointer.x, top: pointer.y });
                canvas.renderAll();
            }
            if(fl_draw_scale_line=='modify_point_1'){
                var pointer = canvas.getPointer(options.e);
                active_scale_line.set({ x2: pointer.x, y2: pointer.y });
                arr_pointLine[1].set({ left: pointer.x, top: pointer.y });
                canvas.renderAll();
            }


        });

        /*########################################################################################################## OBJECT:SELECTED */
        /*########################################################################################################## OBJECT:SELECTED*/
        /*########################################################################################################## OBJECT:SELECTED*/
        /*########################################################################################################## OBJECT:SELECTED*/
        /*########################################################################################################## OBJECT:SELECTED*/
        canvas.on('object:selected', function(options) {
            if(options.target==image_save){
                canvas.sendBackwards(options.target); canvas.setActiveObject(radar_obj_save);

                if(active_scale_line) {
                    Left_Img = image_save.get('left');
                    Top_Img = image_save.get('top');
                }
                return;}
        });
        /*########################################################################################################## OBJECT:MOVING */
        /*########################################################################################################## OBJECT:MOVING*/
        /*########################################################################################################## OBJECT:MOVING*/
        /*########################################################################################################## OBJECT:MOVING*/
        /*########################################################################################################## OBJECT:MOVING*/
        canvas.on('object:moving', function(options) {
            options.target.setCoords();
            document.getElementById('Obj_Distance_X').value=options.target.get('left');
            document.getElementById('Obj_Distance_Y').value=options.target.get('top');

            if(options.target==image_save) {
                canvas.sendBackwards(options.target); canvas.setActiveObject(radar_obj_save);

            if (active_scale_line){
                //active_scale_line.set({left: active_scale_line.get('left')+image_save.get('left')-Left_Img, top: active_scale_line.get('top')+image_save.get('top')-Top_Img});
                //arr_pointLine[0].set({left: arr_pointLine[0].get('left')+image_save.get('left')-Left_Img, top: });
                //arr_pointLine[1].set({left: arr_pointLine[1].get('left')+image_save.get('left')-Left_Img, top: arr_pointLine[1].get('top')+image_save.get('top')-Top_Img});

                var left=[], top=[];
                left[0]=arr_pointLine[0].get('left');
                left[1]=arr_pointLine[1].get('left');
                top[0]=arr_pointLine[0].get('top');
                top[1]=arr_pointLine[1].get('top');
                canvas.remove(arr_pointLine[0],arr_pointLine[1]);
                arr_pointLine[0].left=left[0]+image_save.get('left')-Left_Img;
                arr_pointLine[1].left=left[1]+image_save.get('left')-Left_Img;
                arr_pointLine[0].top=top[0]+image_save.get('top')-Top_Img;
                arr_pointLine[1].top=top[1]+image_save.get('top')-Top_Img;
                canvas.add(arr_pointLine[0],arr_pointLine[1]);
                active_scale_line.set({ x1: arr_pointLine[0].get('left'), y1: arr_pointLine[0].get('top'), x2: arr_pointLine[1].get('left'), y2: arr_pointLine[1].get('top') });

                Left_Img=image_save.get('left');
                Top_Img=image_save.get('top');
            }
                return;
            }



        });

        /*########################################################################################################## BUTTON:CLEAR */
        /*########################################################################################################## BUTTON:CLEAR*/
        /*########################################################################################################## BUTTON:CLEAR*/
        /*########################################################################################################## BUTTON:CLEAR*/
        /*########################################################################################################## BUTTON:CLEAR*/
        fabric.util.addListener(window, 'keyup', function (e) {
            if ((e.keyCode === 27)&&(pointArray.length>1)) {prototypefabric.polygon.generatePolygon(pointArray);}
        });

    };
};


/*########################################################################################################## Create_Radar */
/*########################################################################################################## Create_Radar */
/*########################################################################################################## Create_Radar */
/*########################################################################################################## Create_Radar */
/*########################################################################################################## Create_Radar Z*/
function Create_Radar() {
    var
        rdr_height = document.getElementById('Radar_Height').value,
        rdr_offset_x = document.getElementById('Radar_Offset_X').value,
        rdr_offset_y = document.getElementById('Radar_Offset_Y').value,
        rdr_azimuth_angle = document.getElementById('Radar_Azimuth_Angle').value,
        rdr_elevation_angle = document.getElementById('Radar_Elevation_Angle').value,

        radar_height = Math.floor((parseInt(rdr_height, 10)/350)*canvas.height),
        radar_width = (radar_height*Math.tan(parseInt(rdr_azimuth_angle, 10) * Math.PI/360))*2,
        radar_left = Math.floor((parseInt(rdr_offset_x, 10)/300)*canvas.width-radar_width/2),
        radar_top = Math.floor((parseInt(rdr_offset_y, 10)/350)*canvas.height),
        radar_angle = Math.floor(parseInt(rdr_elevation_angle, 10)),
        radar_fill = 'blue';

    scale_wind.setScale(0.9, 100, 100); canvas.renderAll();

    radar_left+=parseInt(canvas.width, 10)/2;
    radar_top+=canvas.height;
    radar_angle+=180;


    function createTriangle(x, y, angle)
    {
        var pos = fabric.util.rotatePoint(
            new fabric.Point(x, y),
            new fabric.Point(x+radar_width/2, y),
            fabric.util.degreesToRadians(angle)
        );
        return new fabric.Triangle(
            {
                width: radar_width,
                height: radar_height,
                selectable: false,//запрещаем выделение
                fill: radar_fill,
                opacity: 0.5,
                left: pos.x,
                top: pos.y,
                evented: false, //курсор
                hasControls: false,
                hasBorders: false,
                angle: angle,
                id: 'radar'
            });
    }

    if(radar_obj_save){canvas.remove(radar_obj_save);canvas_down.remove(radar_down_obj_save);}
    var triangle = createTriangle(radar_left, radar_top, radar_angle);
    canvas.add(triangle);
    var triangle_down=createTriangle(radar_left, radar_top, radar_angle);
    triangle_down.set({opacity: 10/255});
    canvas_down.add(triangle_down);
    radar_obj_save=triangle;
    radar_down_obj_save=triangle_down;

    Render_All_Canvas();

    object_db.delete_row('radar');
    object_db.add_row('radar','{"objects":['+JSON.stringify(triangle)+']}', '0', '0', '0', '0', rdr_height, rdr_offset_x, rdr_offset_y, rdr_azimuth_angle, rdr_elevation_angle);
}
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj Z*/
function Paint_Resive_Obj() {
    //document.getElementById('Obj_Data').value =text_json_Test;
    var display_alr_page=document.getElementById('id_Alarm_Text');
    var contact = JSON.parse(text_json_Test);
    var num_obj = contact.objects.length;
    var alarm_str="ALARM!!!!!<br>";
    var i,int,fl_new_alarm=false;
    var Alarm_Obj_New={};
    var circle_obj_resive;
    var now_date_time  = new Date().toLocaleString().replace(/\./gi, "/").replace(/\,/gi, " ");

    scale_wind.setScale(0.9, anchor_x, anchor_y);
    alarm_str="ALARM!!!!!<br>";
    var color={};
    for (i in Obj_Old) {color[Obj_Old[i]['color']]=Obj_Old[i]['color'];}
    for(i=0;i<num_obj;i++) {
        var id = contact.objects[i].object_id;
        Obj_New[id]={};
        Obj_New[id]['id'] = contact.objects[i].object_id;
        Obj_New[id]['type'] = contact.objects[i].object_type;
        Obj_New[id]['x'] = Math.floor((contact.objects[i].distance_x*canvas.width)/300) + canvas.width/2;
        Obj_New[id]['y'] = canvas.height - Math.floor((contact.objects[i].distance_y*canvas.height)/350);

        if (id in Obj_Old) {Obj_New[id]['color'] = Obj_Old[id]['color'];}
        else {for(var ii in color_resive_obj){if(!(color_resive_obj[ii] in color)) {Obj_New[id]['color'] = color[color_resive_obj[ii]]=color_resive_obj[ii]; break;}}}
    }

    for(i in Obj_Old) {canvas.remove(Obj_Old[i]['object']);}
    Obj_Old={};


    for(i in Obj_New) {

        circle_obj_resive = new fabric.Circle({
            strokeWidth: 0,
            radius: 10, fill: Obj_New[i]['color'],
            originX: 'center',
            originY: 'center',
            left: Obj_New[i]['x'],
            top: Obj_New[i]['y'],
            hasBorders: false,
            perPixelTargetFind: true,
            hasControls: false,
            id: Obj_New[i]['id']
        });


        var x = Obj_New[i]['x'];
        var x1 = x - 10;
        var x2 = x + 10;
        var y = Obj_New[i]['y'];
        var y1 = y - 10;
        var y2 = y + 10;

        var Point={};
        Point[0]=ctx_canvas_down.getImageData(x1, y, 1, 1).data;
        Point[1]=ctx_canvas_down.getImageData(x1, y, 1, 1).data;
        Point[2]=ctx_canvas_down.getImageData(x1, y, 1, 1).data;
        Point[3]=ctx_canvas_down.getImageData(x1, y, 1, 1).data;

        if ((Point[0][3] > 17) || (Point[1][3] > 17) || (Point[2][3] > 17) || (Point[3][3] > 17)) {
            var name_zone_alarm=[];

            for (int=0; int<4; int++) {
                if (Point[int][3] > 17) {
                    var clr_temp = Point[int][3]*Point[int][0] / 16;
                    clr_temp = (Math.round(clr_temp / 5) * 5) / 15;
                    if(clr_temp>25){clr_temp=Math.ceil(clr_temp);}else{clr_temp=Math.floor(clr_temp);}

                    for (var alrm_ind = 0; alrm_ind < 5; alrm_ind++) {
                        if (((1 << alrm_ind) & clr_temp) && (name_zone_alarm.indexOf(Alarm_Zones[alrm_ind]['name']) == -1)) {
                            name_zone_alarm.push(Alarm_Zones[alrm_ind]['name']);

                        }
                    }
                }
            }

            var name_zone_for_history='';

            for (int in name_zone_alarm){name_zone_for_history+=name_zone_alarm[int]+', ';}
            name_zone_for_history=name_zone_for_history.slice(0,-2);

            alarm_str+=Check_Alarm_Zones(name_zone_alarm,Obj_New[i]['id']);

            Alarm_Obj_New[i]={};
            Alarm_Obj_New[i]['alarm_zone']=name_zone_for_history;
            Alarm_Obj_New[i]['object_type']=Obj_New[i]['type'];
            Alarm_Obj_New[i]['object_id']=  Obj_New[i]['id'];
            Alarm_Obj_New[i]['distance_x']= Obj_New[i]['x'];
            Alarm_Obj_New[i]['distance_y']= Obj_New[i]['y'];
            Alarm_Obj_New[i]['time_alarm']=now_date_time;
            Alarm_Obj_New[i]['id_row_db']= new Date().getTime();
        }

        Obj_Old[i]={};
        Obj_Old[i]['object']=circle_obj_resive;
        Obj_Old[i]['x']=    Obj_New[i]['x'];
        Obj_Old[i]['y']=    Obj_New[i]['y'];
        Obj_Old[i]['color']=Obj_New[i]['color'];
        Obj_Old[i]['id']=   Obj_New[i]['id'];
    }
  //****************************** HISTORY****************************************************
    var temp_arr=[]; for(i in Alarm_Obj_Old){temp_arr.push(Alarm_Obj_Old[i]['alarm_zone']);}
    var Alarm_Obj_New_Temp={};
    for(i in Alarm_Obj_New){
        if(temp_arr.indexOf(Alarm_Obj_New[i]['alarm_zone'])==-1){ fl_new_alarm=true;
            alarm_history_db.add_row(Alarm_Obj_New[i]['id_row_db'], Alarm_Obj_New[i]['alarm_zone'], now_date_time, Alarm_Obj_New[i]['object_type'], Alarm_Obj_New[i]['object_id'], Alarm_Obj_New[i]['distance_x'], Alarm_Obj_New[i]['distance_y']);
            Alarm_Obj_New_Temp[i]={};
            Alarm_Obj_New_Temp[i]=Alarm_Obj_New[i];
            //alarm_history_tbl.add_row(1, true, Alarm_Obj_New[i]['name zone for history tbl'], now_date_time, Alarm_Obj_New[i]['object type'], Alarm_Obj_New[i]['object id'], Alarm_Obj_New[i]['distance x'], Alarm_Obj_New[i]['distance y']);
        }
    }

    if(fl_new_alarm){Show_Tabl_Alarm_History(true,Alarm_Obj_New_Temp);}


    //if(fl_new_alarm){alarm_history_tbl.sort(1);alarm_history_tbl.sort(1);}
    //****************************** PAGE TEXT ALARM****************************************************
    for (i in Alarm_Obj_Old) {if (!(i in Alarm_Obj_New)){alarm_str+=Check_Alarm_Zones_Outside(i); delete Alarm_Obj_Old[i];}}


    for (i in Alarm_Obj_New){
        if(!(i in Alarm_Obj_Old)){Alarm_Obj_Old[i]={};}
        Alarm_Obj_Old[i]['alarm_zone']=Alarm_Obj_New[i]['alarm_zone'];
        Alarm_Obj_Old[i]['object_type']=Alarm_Obj_New[i]['object_type'];
        Alarm_Obj_Old[i]['object_id']=Alarm_Obj_New[i]['object_id'];
        Alarm_Obj_Old[i]['distance_x']=Alarm_Obj_New[i]['distance_x'];
        Alarm_Obj_Old[i]['distance_y']=Alarm_Obj_New[i]['distance_y'];
    }



    if(alarm_str!="ALARM!!!!!<br>"){display_alr_page.innerHTML=alarm_str; cont_disp=2;}
    else{cont_disp--; if(cont_disp==0){display_alr_page.innerHTML='';}}


    for (i in Obj_Old){canvas.add(Obj_Old[i]['object']);}
    if(scale_to_set!=1){scale_wind.setScale(scale_to_set, anchor_x, anchor_y);}
    canvas.renderAll();
    object_list_tbl.change_row(contact);


}

/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
/*########################################################################################################## Paint_Resive_Obj */
function Render_All_Canvas() {
if(radar_obj_save){
    canvas.sendToBack(radar_obj_save);
    if(image_save){canvas.sendToBack(image_save);}
    canvas_down.bringToFront(radar_down_obj_save);
} else{
    canvas.renderAll();
    canvas_down.renderAll();
}
}
/*########################################################################################################## Check_Alarm_Zones */
/*########################################################################################################## Check_Alarm_Zones */
/*########################################################################################################## Check_Alarm_Zones */
/*########################################################################################################## Check_Alarm_Zones */
/*########################################################################################################## Check_Alarm_Zones */
function Check_Alarm_Zones(alarm_zones,obj_id) {
    var i,ii,obj_inside=[],obj_in=[],obj_out=[],name_zone_old,txt_alarm="";
    if (obj_id in Alarm_Obj_Old) {
        //alert("obj_id существует.");
        for(i in Alarm_Zones){
            ii=jQuery.inArray(Alarm_Zones[i]['name'], alarm_zones);
            if ((ii != -1)&&(Alarm_Zones[i]['name']==alarm_zones[ii])&&(Alarm_Zones[i]["type_alarm"]==0)) {
                obj_inside.push(alarm_zones[ii]);
                //if(Alarm_Zones[ii]["url"]!=''){send_act(obj_id+": INSIDE "+alarm_zones[ii]);}
            }
        }
        for(i in Alarm_Obj_Old[obj_id]['zones']) {
            name_zone_old = Alarm_Obj_Old[obj_id]['zones'][i];
            for(ii in Alarm_Zones){
                if((Alarm_Zones[ii]['name']==name_zone_old)&&(Alarm_Zones[ii]["type_alarm"]==1)&&(alarm_zones.indexOf(name_zone_old)==-1))
                {obj_out.push(name_zone_old);
                    if(Alarm_Zones[ii]["url"]!=''){send_act(Alarm_Zones[ii]["url"]+"?"+obj_id+":_OUT_"+name_zone_old);}
                }
            }
        }
    } else {
        for(i in Alarm_Zones){
            ii=jQuery.inArray(Alarm_Zones[i]['name'], alarm_zones);
            if ((ii != -1)&&(Alarm_Zones[i]['name']==alarm_zones[ii])&&(Alarm_Zones[i]["type_alarm"]==2)) {
                obj_in.push(alarm_zones[ii]);
                if(Alarm_Zones[ii]["url"]!=''){send_act(Alarm_Zones[ii]["url"]+"?"+obj_id+":_IN_"+alarm_zones[ii]);}
            }
            if ((ii != -1)&&(Alarm_Zones[i]['name']==alarm_zones[ii])&&(Alarm_Zones[i]["type_alarm"]==0)) {
                obj_inside.push(alarm_zones[ii]);
                if(Alarm_Zones[ii]["url"]!=''){send_act(Alarm_Zones[ii]["url"]+"?"+obj_id+":_INSIDE_"+alarm_zones[ii]);}
            }
        }
    }

    //delete Alarm_Obj_Old[obj_id];
    if(!(obj_id in Alarm_Obj_Old)){Alarm_Obj_Old[obj_id]={};}
    Alarm_Obj_Old[obj_id]['zones']={};

    for(i in alarm_zones) {
        Alarm_Obj_Old[obj_id]['zones'][i]=alarm_zones[i];
    }

 if((obj_inside.length)||(obj_in.length)){
    txt_alarm="ID:"+obj_id;

     if(obj_in.length){
         txt_alarm+= "  IN:";
         for(i in obj_in){
             txt_alarm+=obj_in[i]+", ";
         }
         txt_alarm=txt_alarm.slice(0,-2);
     }
     if(obj_inside.length){
         txt_alarm+= "  INSIDE:";
         for(i in obj_inside){
             txt_alarm+=obj_inside[i]+", ";
         }
         txt_alarm=txt_alarm.slice(0,-2);
     }
     if(obj_out.length){
         txt_alarm+= "  OUT:";
         for(i in obj_out){
             txt_alarm+=obj_out[i]+", ";
         }
         txt_alarm=txt_alarm.slice(0,-2);
     }
 }

if (txt_alarm){return  txt_alarm+"<br>";}else{return txt_alarm;}


}
/*########################################################################################################## Check_Alarm_Zones_Outside */
/*########################################################################################################## Check_Alarm_Zones_Outside */
/*########################################################################################################## Check_Alarm_Zones_Outside */
/*########################################################################################################## Check_Alarm_Zones_Outside */
/*########################################################################################################## Check_Alarm_Zones_Outside */
function Check_Alarm_Zones_Outside(obj_id) {
    var i,ii,obj_out=[],name_zone_old,txt_alarm="";

        //alert("obj_id существует.");
        for(i in Alarm_Obj_Old[obj_id]['zones']){name_zone_old=Alarm_Obj_Old[obj_id]['zones'][i];


         for(ii in Alarm_Zones){
         if((Alarm_Zones[ii]['name']==name_zone_old)&&(Alarm_Zones[ii]['type_alarm']==1))
         {obj_out.push(name_zone_old);
         if(Alarm_Zones[ii]['url']!=''){send_act(Alarm_Zones[ii]['url']+"?"+obj_id+":_OUT_"+name_zone_old);}
         }
         }
         }


        if(obj_out.length){
            txt_alarm="ID:"+obj_id;
            txt_alarm+= "  OUT:";
            for(i in obj_out){
                txt_alarm+=obj_out[i]+", ";
            }
            txt_alarm=txt_alarm.slice(0,-2);
        }

    if (txt_alarm){return  txt_alarm+"<br>";}else{return txt_alarm;}

}



function send_act_HandleServerResponse(){}


/*########################################################################################################## send_act */
/*########################################################################################################## send_act */
/*########################################################################################################## send_act */
/*########################################################################################################## send_act */
/*########################################################################################################## send_act */
function send_act(alrm){
    var st=alrm;
    var req_alrm=new XMLHttpRequest();
    req_alrm.open('GET',st,true);
    req_alrm.onreadystatechange = send_act_HandleServerResponse; // Подключаем функцию для обработки данных
    req_alrm.send();
}



/*########################################################################################################## Modify_Alarm_Zone */
/*########################################################################################################## Modify_Alarm_Zone */
/*########################################################################################################## Modify_Alarm_Zone */
/*########################################################################################################## Modify_Alarm_Zone */
/*########################################################################################################## Modify_Alarm_Zone */
function Modify_Alarm_Zone() {
    if(document.getElementById('id_Modify_Alarm_Zone').value == 'Modify'){
        ModifyAlarmZone(Select_Alarm_Zone);
        PageState('modify_alarm_zone');
        object_status = 'modify_enable';
        count_check_url=5;
    } else {



        document.getElementById("id_Modify_Alarm_Zone").disabled = true;
        if (flag_url == false) {
            count_check_url = 5;
            flag_url = 'wait';
            validate_url();
        }
        if (flag_url != 'wait') {
            document.getElementById("id_Modify_Alarm_Zone").disabled = false;
        }
        if (flag_url == 'err') {
            flag_url = false;
            return false;
        }
        if (flag_url != 'ok') {
            return false;
        }


        flag_url = false;
        if (object_status == 'object_add') {
            SaveAddAlarmZone(Count_Alarm_Zones);
        }
        else if (object_status == 'modify_enable') {
            SaveModifyAlarmZone(Select_Alarm_Zone);
        }

        object_status = 'modify_enable';
        Select_Alarm_Zone=null;
        DisplayAlarmZones(Select_Alarm_Zone);
        PageState('save_alarm_zone');
    }
}




/*########################################################################################################## window.onresize */
/*########################################################################################################## window.onresize */
/*########################################################################################################## window.onresize */
/*########################################################################################################## window.onresize */
/*########################################################################################################## window.onresize */
window.onresize = function(){
    Resize_Canvas();
};
/*########################################################################################################## Resize_Canvas */
/*########################################################################################################## Resize_Canvas */
/*########################################################################################################## Resize_Canvas */
/*########################################################################################################## Resize_Canvas */
/*########################################################################################################## Resize_Canvas */
function Resize_Canvas() {
    var canv_temp,context,tempContext;
    var tempCanvas = document.createElement('canvas');

    canv_temp = document.getElementById('id_Canv_Grid_Bottom_Canv');
    context = canv_temp.getContext('2d');
    tempCanvas.width = 700;
    tempCanvas.height = 30;
    tempContext = tempCanvas.getContext("2d");

    tempContext.drawImage(context.canvas, 0, 0);
    canv_temp.width = 700;
    canv_temp.height = 30;
    context.drawImage(tempContext.canvas, 0, 0);
    canvas_grid_bottom.renderAll();

    canv_temp = document.getElementById('id_Canv_Grid_Left_Canv');
    context = canv_temp.getContext('2d');
    tempCanvas.width = 35;
    tempCanvas.height = 525;
    tempContext = tempCanvas.getContext("2d");

    tempContext.drawImage(context.canvas, 0, 0);
    canv_temp.width = 35;
    canv_temp.height = 525;
    context.drawImage(tempContext.canvas, 0, 0);
    canvas_grid_left.renderAll();

    canv_temp = document.getElementById('c');
    context = canv_temp.getContext('2d');
    tempCanvas.width = 700;
    tempCanvas.height = 525;
    tempContext = tempCanvas.getContext("2d");

    tempContext.drawImage(context.canvas, 0, 0);
    canv_temp.width = 700;
    canv_temp.height = 525;
    context.drawImage(tempContext.canvas, 0, 0);
    canvas.renderAll();

    canv_temp = document.getElementById('c2');
    context = canv_temp.getContext('2d');
    tempCanvas.width = 700;
    tempCanvas.height = 525;
    tempContext = tempCanvas.getContext("2d");

    tempContext.drawImage(context.canvas, 0, 0);
    canv_temp.width = 700;
    canv_temp.height = 525;
    context.drawImage(tempContext.canvas, 0, 0);
    canvas.renderAll();

}