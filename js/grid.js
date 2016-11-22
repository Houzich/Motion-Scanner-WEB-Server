var canvas_grid_bottom;
var canvas_grid_left;


$(window).on('load', function() {
    grid.initGrid();
    grid.drawgrid.GridBottom(canvas.width/2,1);
    grid.drawgrid.GridLeft(canvas.height/2,1);

});

var grid = new function () {
    this.initGrid = function () {

        /*########################################################################################################## BUTTON:TEST SCALE X */
        /*########################################################################################################## BUTTON:TEST SCALE X*/
        /*########################################################################################################## BUTTON:TEST SCALE X*/
        /*########################################################################################################## BUTTON:TEST SCALE X*/
        /*########################################################################################################## BUTTON:TEST SCALE X*/
        document.getElementById('id_Test_Point_X_Butt').addEventListener('click', function() {
            var POINT_X=Math.floor(document.getElementById('id_Test_Point_X_Inpt').value);
            var SCALE_X=document.getElementById('id_Test_Scale_X_Inpt').value;

            grid.drawgrid.GridBottom_Test(POINT_X,SCALE_X);
        });




     }

};


grid.drawgrid = {
    /*########################################################################################################## GRID BOTTOM */
    /*########################################################################################################## GRID BOTTOM*/
    /*########################################################################################################## GRID BOTTOM*/
    /*########################################################################################################## GRID BOTTOM*/
    /*########################################################################################################## GRID BOTTOM*/
    GridBottom: function (p_x,sc_x) {
            var POINT_X=Math.floor(p_x);
            var SCALE_X=sc_x;
            var step_GRID_X=canvas.width/30;
            var ind_step_POINT_X=Math.round(POINT_X/step_GRID_X);
            var step_scale_GRID_X=step_GRID_X*SCALE_X;
            var quan_step_scale_GRID_X_left=Math.round(POINT_X/step_scale_GRID_X)+1;
            var quan_step_scale_GRID_X_right=Math.round((canvas.width-POINT_X)/step_scale_GRID_X);
            var offset_left_scale_POINT_X=(POINT_X-ind_step_POINT_X*step_GRID_X)*SCALE_X;
            var offset_right_scale_POINT_X=((ind_step_POINT_X+1)*step_GRID_X-POINT_X)*SCALE_X;
            var x,y,i,txt="none";
            canvas_grid_bottom.clear();
            for(i=0; i<quan_step_scale_GRID_X_left;i++){
                x=Math.round(POINT_X-offset_left_scale_POINT_X-step_scale_GRID_X*i);
                if((ind_step_POINT_X-i)%5==0){y=15;txt=""+(ind_step_POINT_X-i)*10-150+"";}
                else{y=10;txt="none";}

                var line_grid = new fabric.Line([x,0,x,y], {
                    //strokeWidth: 1,
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

                if(txt!='none'){
                    var text = new fabric.Text(txt, { left: x, top: y+3, fontSize: 10, originX: 'center', evented: false, selectable: false});
                    if(i==(quan_step_scale_GRID_X_left-1)){text.set({originX: 'left'});}
                    canvas_grid_bottom.add(text);
                }
                canvas_grid_bottom.add(line_grid);
            }


            for(i=0; i<quan_step_scale_GRID_X_right;i++){
                x=Math.round(POINT_X+offset_right_scale_POINT_X+step_scale_GRID_X*i);
                //console.info(quan_step_scale_GRID_X_right,x);
                if((ind_step_POINT_X+i+1)%5==0){y=15;txt=""+(ind_step_POINT_X+i+1)*10-150+"";}
                else{y=10;txt="none";}

                var line_grid = new fabric.Line([x,0,x,y], {
                    //strokeWidth: 1,
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

                if(txt!='none'){
                    var text = new fabric.Text(txt, { left: x, top: y+3, fontSize: 10, originX: 'center', evented: false, selectable: false});
                    if(i==(quan_step_scale_GRID_X_right-1)){text.set({originX: 'right'});}
                    canvas_grid_bottom.add(text);
                }
                canvas_grid_bottom.add(line_grid);
            }
        canvas_grid_bottom.renderAll();
    },

    GridLeft: function (p_y,sc_y) {
        var POINT_Y=Math.floor(p_y);
        var SCALE_Y=sc_y;
        var step_GRID_Y=canvas.height/35;
        var ind_step_POINT_Y=Math.round(POINT_Y/step_GRID_Y);
        var step_scale_GRID_Y=step_GRID_Y*SCALE_Y;
        var quan_step_scale_GRID_Y_top=Math.round(POINT_Y/step_scale_GRID_Y)+1;
        var quan_step_scale_GRID_Y_bottom=Math.round((canvas.height-POINT_Y)/step_scale_GRID_Y);
        var offset_top_scale_POINT_Y=(POINT_Y-ind_step_POINT_Y*step_GRID_Y)*SCALE_Y;
        var offset_bottom_scale_POINT_Y=((ind_step_POINT_Y+1)*step_GRID_Y-POINT_Y)*SCALE_Y;
        var x,y,i,txt="none";
        canvas_grid_left.clear();

        for(i=0; i<quan_step_scale_GRID_Y_top;i++){
            y=Math.round(POINT_Y-offset_top_scale_POINT_Y-step_scale_GRID_Y*i);
            //console.info(quan_step_scale_GRID_Y_top,y);
            if((ind_step_POINT_Y-i)%5==0){x=canvas_grid_left.width-15;txt=""+(35-ind_step_POINT_Y+i)*10+"";}
            else{x=canvas_grid_left.width-10;txt="none";}

            var line_grid = new fabric.Line([x,y,canvas_grid_left.width,y], {
                //strokeWidth: 1,
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

            if(txt!='none'){
                var text = new fabric.Text(txt, { left: x-3, top: y, fontSize: 10, originX: 'right', originY: 'center', evented: false, selectable: false});
                if(i==(quan_step_scale_GRID_Y_top-1)){text.set({originY: 'top'});}
                canvas_grid_left.add(text);
            }
            canvas_grid_left.add(line_grid);
        }


        for(i=0; i<quan_step_scale_GRID_Y_bottom;i++){
            y=Math.round(POINT_Y+offset_bottom_scale_POINT_Y+step_scale_GRID_Y*i);
            //console.info(quan_step_scale_GRID_Y_bottom,y,ind_step_POINT_Y);
            if((ind_step_POINT_Y+i+1)%5==0){x=canvas_grid_left.width-15;txt=""+(35-(ind_step_POINT_Y+1+i))*10+"";}
            else{x=canvas_grid_left.width-10;txt="none";}

            var line_grid = new fabric.Line([x,y,canvas_grid_left.width,y], {
                //strokeWidth: 1,
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

            if(txt!='none'){
                var text = new fabric.Text(txt, { left: x-3, top: y, fontSize: 10, originX: 'right', originY: 'center', evented: false, selectable: false});
                if(i==(quan_step_scale_GRID_Y_bottom-1)){text.set({originY: 'bottom'});}
                canvas_grid_left.add(text);
            }
            canvas_grid_left.add(line_grid);
        }

        canvas_grid_left.renderAll();
    }

};

















