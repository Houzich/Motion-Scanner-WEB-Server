var savTO=null;    // handle of click setTimeOut
var arr_pointLine = new Array();
var fl_draw_scale_line = false;
var active_scale_line;


var activeShape = false;
var Left_Img = 0;
var Top_Img=0;

$(window).on('load', function() {
    scaling.initScaling();
    /*########################################################################################################## BUTTON:SAFE IMAGE */
    /*########################################################################################################## BUTTON:SAFE IMAGE*/
    /*########################################################################################################## BUTTON:SAFE IMAGE*/
    /*########################################################################################################## BUTTON:SAFE IMAGE*/
    /*########################################################################################################## BUTTON:SAFE IMAGE*/
    document.getElementById('id_Save_Image').addEventListener('click', function () {
        image_save.set({hasControls: false, hasBorders: false, evented: false, selectable: false});
        Render_All_Canvas();
        PageState('save_image');
    });



});

var scaling = new function () {
    this.initScaling = function () {
        /*########################################################################################################## BUTTON:SCALE IMAGE */
        /*########################################################################################################## BUTTON:SCALE IMAGE*/
        /*########################################################################################################## BUTTON:SCALE IMAGE*/
        /*########################################################################################################## BUTTON:SCALE IMAGE*/
        /*########################################################################################################## BUTTON:SCALE IMAGE*/
        document.getElementById('id_Scale_Image').addEventListener('click', function () {
            if (image_save) {canvas.sendBackwards(image_save);}
            Render_All_Canvas();
            PageState('scale_image');
        });

        /*########################################################################################################## BUTTON:SCALE LINE */
        /*########################################################################################################## BUTTON:SCALE LINE*/
        /*########################################################################################################## BUTTON:SCALE LINE*/
        /*########################################################################################################## BUTTON:SCALE LINE*/
        /*########################################################################################################## BUTTON:SCALE LINE*/
        document.getElementById('id_Scale_Line').addEventListener('click', function () {
            if (image_save) {canvas.sendBackwards(image_save);}
            image_save.set({hoverCursor:'default'});
            scaling.line.drawlineStart();
            PageState('scale_line');
        });
        /*########################################################################################################## BUTTON:SCALE DISTANCE */
        /*########################################################################################################## BUTTON:SCALE DISTANCE*/
        /*########################################################################################################## BUTTON:SCALE DISTANCE*/
        /*########################################################################################################## BUTTON:SCALE DISTANCE*/
        /*########################################################################################################## BUTTON:SCALE DISTANCE*/
        document.getElementById('id_Scale_Distance').addEventListener('click', function () {
            scaling.line.ScaleDistance();
            scaling.line.Delline();
            Render_All_Canvas();
            PageState('scale_distance');
        });


    }

};

scaling.line = {
    drawlineStart : function() {
        fl_draw_scale_line='start_draw_line';
        if(active_scale_line){canvas.remove(active_scale_line); $.each(arr_pointLine,function(index,point){canvas.remove(point);});}
        active_scale_line=false;
        arr_pointLine.length = 0;
        canvas.renderAll();
    },
    Delline : function() {
        fl_draw_scale_line = false;
        if(active_scale_line){canvas.remove(active_scale_line); $.each(arr_pointLine,function(index,point){canvas.remove(point);});}
        active_scale_line=false;
        arr_pointLine.length = 0;
    },
    addPoint : function(options) {
        var id_line = 'id_Line_Scaling';
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var id_point = new Date().getTime() + random;
        var pointer = canvas.getPointer(options.e);
        var circle = new fabric.Circle({
            radius: 7,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: pointer.x,
            top: pointer.y,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            hoverCursor:'pointer',
            originX:'center',
            originY:'center',
            opacity: 0.15,
            id:id_point
        });


        if (fl_draw_scale_line=='start_draw_line') {
            arr_pointLine[0]=circle;
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
            var line = new fabric.Line(points, {
                strokeWidth: 2,
                fill: 'black',
                stroke: 'black',
                class: 'line',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            canvas.add(line);
            canvas.add(circle);

            active_scale_line=line;
            canvas.selection = false;
            fl_draw_scale_line='draw_line';

        } else if (fl_draw_scale_line=='draw_line') {
            arr_pointLine[1]=circle;
            active_scale_line.set({ x2: pointer.x, y2: pointer.y });
            canvas.selection = false;
            fl_draw_scale_line='modify_line';
            canvas.add(circle);
            canvas.renderAll();
            scaling.line.DisplayLineDistance();
            document.getElementById("id_Scale_Distance_Inpt").disabled=false;
            document.getElementById("id_Scale_Distance").disabled=false;
            image_save.set({hoverCursor:'move'});
        }else if (fl_draw_scale_line=='modify_line') {
            if (options.target && options.target.id == arr_pointLine[0].id) {savTO = new Date().getTime(); fl_draw_scale_line='modify_point_0';}
            if (options.target && options.target.id == arr_pointLine[1].id) {savTO = new Date().getTime(); fl_draw_scale_line='modify_point_1';}

        }else if (fl_draw_scale_line=='modify_point_0') {
            active_scale_line.set({ x1: pointer.x, y1: pointer.y });
            canvas.remove(arr_pointLine[0]);
            arr_pointLine[0].left=pointer.x;
            arr_pointLine[0].top=pointer.y;
            canvas.add(arr_pointLine[0]);
            canvas.selection = false;
            canvas.renderAll();
            var now  = new Date().getTime();
            if ((now - savTO) > 100) {fl_draw_scale_line='modify_line';}
            scaling.line.DisplayLineDistance();
        }else if (fl_draw_scale_line=='modify_point_1') {
            active_scale_line.set({ x2: pointer.x, y2: pointer.y });
            canvas.remove(arr_pointLine[1]);
            arr_pointLine[1].left=pointer.x;
            arr_pointLine[1].top=pointer.y;
            canvas.add(arr_pointLine[1]);
            canvas.selection = false;
            canvas.renderAll();
            var now  = new Date().getTime();
            if ((now - savTO) > 100) {fl_draw_scale_line='modify_line';}
            scaling.line.DisplayLineDistance();
        }
    },

    ScaleDistance : function() {
        var user_dist=document.getElementById('id_Scale_Distance_Inpt').value;
        var dx=(arr_pointLine[1].left-arr_pointLine[0].left)*300/canvas.width/canvas.scale;
        var dy=(arr_pointLine[1].top-arr_pointLine[0].top)*350/canvas.height/canvas.scale;
        var line_dist= Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        var new_scale_img=image_save.scaleX*user_dist/line_dist;
        image_save.scaleX=new_scale_img;
        image_save.scaleY=new_scale_img;
    },

    DisplayLineDistance : function() {
        var dx=(arr_pointLine[1].left-arr_pointLine[0].left)*300/canvas.width/canvas.scale;
        var dy=(arr_pointLine[1].top-arr_pointLine[0].top)*350/canvas.height/canvas.scale;
        document.getElementById('id_Scale_Distance_Inpt').value = (Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))).toFixed(2);
    }


};

















