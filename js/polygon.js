


prototypefabric.polygon = {
    drawPolygon : function() {
        polygonMode = true;
        pointArray = [];
        lineArray = [];
        activeLine = false;
    },
    addPoint : function(options) {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var id = new Date().getTime() + random;
        var pointer = canvas.getPointer(options.e);

        if(pointArray.length){var pt = activeShape.get("points"); var points = [pt[pointArray.length].x,pt[pointArray.length].y,pointer.x,pointer.y];}
        else{var points = [pointer.x,pointer.y,pointer.x,pointer.y];}


        var circle = new fabric.Circle({
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: points[0],
            top: points[1],
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            id:id
        });
        if(pointArray.length == 0){
            circle.set({
                fill:'red'
            })
        }

        var line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: 'black',
            stroke: 'black',
            class:'line',
            originX:'center',
            originY:'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
        });
        if(activeShape){
            var pos = canvas.getPointer(options.e);
            var points = activeShape.get("points");
            points.push({
                x: pointer.x,
                y: pointer.y
            });

            var polygon = new fabric.Polygon(points,{
                stroke:'#333333',
                strokeWidth:1,
                //fill: '#cccccc',
                fill: 'yellow',
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                perPixelTargetFind: true,
                evented: false
            });

            canvas.remove(activeShape);
            canvas.add(polygon);
            activeShape = polygon;
            canvas.renderAll();
        }
        else{
            var polyPoint = [{x:pointer.x,y:pointer.y}];

            var polygon = new fabric.Polygon(polyPoint,{
                stroke:'#333333',
                strokeWidth:1,
                fill: '#cccccc',
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                perPixelTargetFind: true,
                evented: false
            });
            activeShape = polygon;
            canvas.add(polygon);

        }
        activeLine = line;

        pointArray.push(circle);
        lineArray.push(line);

        canvas.add(circle);
        canvas.add(line);
        canvas.selection = false;
    },
    generatePolygon : function(pointArray){
        var points = new Array();
        $.each(pointArray,function(index,point){
            points.push({
                x:point.left,
                y:point.top
            });
            canvas.remove(point);
        });
        $.each(lineArray,function(index,line){
            canvas.remove(line);
        });
        canvas.remove(activeShape).remove(activeLine);
        var points_line = [points[0].x,points[0].y,points[pointArray.length-1].x,points[pointArray.length-1].y];

               $.each(lineArray,function(index,line){line.set({strokeWidth: 6});});

        var lineend = new fabric.Line(points_line, {
            strokeWidth: 6,
            fill: 'black',
            stroke: 'black',
            class:'line',
            originX:'center',
            originY:'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
        });
        //canvas.add(linet);

        var polygon = new fabric.Polygon(points,{
            stroke:'black',
            strokeWidth:0,
            fill: 'none',
            opacity: 0.1,
            hasBorders: false,
            perPixelTargetFind: true,
            hasControls: false
        });


        var group = new fabric.Group([lineend,polygon], {});
        for(var i=0;i<(lineArray.length-1);i++){group.addWithUpdate(lineArray[i]);}
        group.set({evented: false,selectable: false});
        canvas.add(group);


        var fill_clr='rgb('+(1<<Count_Alarm_Zones)*15+', 0, 0)';
        var polygon_down = new fabric.Polygon(points,{
            stroke: fill_clr,
            strokeWidth:0,
            fill: fill_clr,
            opacity: 18/255,
            hasBorders: false,
            perPixelTargetFind: true,
            hasControls: false
        });

        //canvas_down.add(polygon_down);

        Alarm_Zone_Temp['polygon']=group;
        Alarm_Zone_Temp['polygon_down']=polygon_down;

        Render_All_Canvas();
        AddAlarmZones(Count_Alarm_Zones);
        PageState('draw_alarm_zone_end');
        //add_pyligon_alarm_zone(Count_Alarm_Zones);

        activeLine = false;
        activeShape = null;
        polygonMode = false;
        canvas.selection = true;

    }
};

