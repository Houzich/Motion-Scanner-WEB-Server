
var baseWidth_sc = 0, // начальная ширина
    baseHeight_sc= 0, // начальная высота
    baseScale_sc = 1, // начальный масштаб

    //safe_group_scale = 0,
    group_scale_left = 0,
    group_scale_top = 0,

    anchor_x = 0,
    anchor_y = 0,
    scale_to_set = 1,

    scale_obj=1,


    group_scale_left_obj = 0,
    group_scale_top_obj = 0,

    width_sc = 0, // текущая ширина
    height_sc = 0, // текущая высота
    transX_sc = 0, // текущее смещение по оси x
    transY_sc = 0, // текущее смещение по оси y
    scale_sc = 1; // текущий масштаб в целом





$(window).on('load', function() {
    scale_wind.initScale();


});

var scale_wind = new function () {
    this.initScale = function () {
        // Установим начальные и текущие размеры

/*        var group = new fabric.Group(canvas.getObjects());
        baseWidth = group.getWidth();
        baseHeight = group.getHeight();
        group.destroy();*/

        transX_sc = 0;
        transY_sc = 0;
        scale_sc = 1;
        baseWidth_sc = canvas.width;
        baseHeight_sc = canvas.height;
        width_sc = canvas.width;
        height_sc = canvas.height;


    };
    this.setScale = function (scaleToSet, anchorX, anchorY) {
        var zoomMax = 5, // максимально 5-ти кратное увеличение
            zoomMin =  1, // минимальное увеличение - реальный размер картинки
            zoomStep; // необходимое изменение масштаба

        // Ограничим масштаб, если нужно
        if (scaleToSet > zoomMax * baseScale_sc) {
            scaleToSet = zoomMax * baseScale_sc;
        } else if (scaleToSet < zoomMin * baseScale_sc) {
            scaleToSet = zoomMin * baseScale_sc;
        }

        // Центр масштабирования - точка, которая должна остаться на месте.
        // Задаётся параметрами anchorX и anchorY.
        // По сути это позиция курсора в момент масштабирования.
        if (typeof anchorX != 'undefined' && typeof anchorY != 'undefined') {
            zoomStep = scaleToSet / scale_sc;
            // Рассчитаем, на сколько нужно сместить все объекты, чтобы центр масштабирования остался на месте.
            transX_sc -= (zoomStep-1) / scaleToSet * anchorX;
            transY_sc -= (zoomStep-1) / scaleToSet * anchorY;
        } else {transX_sc=0;transY_sc=0;}

        scale_sc = scaleToSet;
        grid.drawgrid.GridBottom(anchorX,scale_sc);
        grid.drawgrid.GridLeft(anchorY,scale_sc);

        applyTransform();
    };

    var applyTransform = function () {
        var maxTransX,
            maxTransY,
            minTransX,
            minTransY,
            group;


        // Рассчитаем пороговые значения для смещения по оси x
        if (baseWidth_sc * scale_sc <= width_sc) {
            // Карта целиком помещается на холст
            maxTransX = (width_sc - baseWidth_sc * scale_sc) / (2 * scale_sc);
            minTransX = (width_sc - baseWidth_sc * scale_sc) / (2 * scale_sc);
        } else {
            // Не влазит
            maxTransX = 0;
            minTransX = (width_sc - baseWidth_sc * scale_sc) / scale_sc;
        }


        // Ограничим смещение пороговыми значениями
        if (transX_sc > maxTransX) {
            transX_sc = maxTransX;
        } else if (transX_sc < minTransX) {
            transX_sc = minTransX;
        }

        // То же самое для оси y
        if (baseHeight_sc * scale_sc <= height_sc) {
            maxTransY = (height_sc - baseHeight_sc * scale_sc) / (2 * scale_sc);
            minTransY = (height_sc - baseHeight_sc * scale_sc) / (2 * scale_sc);
        } else {
            maxTransY = 0;
            minTransY = (height_sc - baseHeight_sc * scale_sc) / scale_sc;
        }
        if (transY_sc > maxTransY) {
            transY_sc = maxTransY;
        } else if (transY_sc < minTransY) {
            transY_sc = minTransY;
        }


        // Сгруппируем все объекты на холсте и применим трансформацию
        group = new fabric.Group(canvas.getObjects());
        //for(var i=0;i<obj_resive_old_remove.length;i++) {group.removeWithUpdate(obj_resive_old_remove[i]);}

        if(canvas.scale==1.0) {group_scale_left=group.getWidth()/2-group.left; group_scale_top=group.getHeight()/2-group.top;}
        group.scaleX = scale_sc / canvas.scale;
        group.scaleY = scale_sc / canvas.scale;
        group.left = group.getWidth() / 2 + (transX_sc-group_scale_left) * scale_sc;
        group.top = group.getHeight() / 2 + (transY_sc-group_scale_top) * scale_sc;
        group_scale=scale_sc / canvas.scale;
        group.destroy();


        canvas.scale = scale_sc;
        //canvas.renderAll();

    };

    this.initScale_Obj = function () {
        var group;

        scale_obj_old=1;
        scale_obj=1;
    };

    this.applyTransform_Obj = function (scaleToSet, anchorX, anchorY, group_obj) {
        var
            baseWidth_obj = 0, // начальная ширина
            baseHeight_obj= 0, // начальная высота
            baseScale_obj = 1; // начальный масштаб
        var
            baseWidth_obj = canvas.width,
            baseHeight_obj = canvas.height,
            width_obj = canvas.width,
            height_obj = canvas.height,
            transX_obj=0,
            transY_obj=0;

        var maxTransX,
            maxTransY,
            minTransX,
            minTransY,
            group;

        var zoomMax = 5, // максимально 5-ти кратное увеличение
            zoomMin =  1, // минимальное увеличение - реальный размер картинки
            zoomStep; // необходимое изменение масштаба

        // Ограничим масштаб, если нужно
        if (scaleToSet > zoomMax * baseScale_obj) {
            scaleToSet = zoomMax * baseScale_obj;
        } else if (scaleToSet < zoomMin * baseScale_obj) {
            scaleToSet = zoomMin * baseScale_obj;
        }

        // Центр масштабирования - точка, которая должна остаться на месте.
        // Задаётся параметрами anchorX и anchorY.
        // По сути это позиция курсора в момент масштабирования.
        if (typeof anchorX != 'undefined' && typeof anchorY != 'undefined') {
            zoomStep = scaleToSet / scale_obj;
            // Рассчитаем, на сколько нужно сместить все объекты, чтобы центр масштабирования остался на месте.
            transX_obj -= (zoomStep-1) / scaleToSet * anchorX;
            transY_obj -= (zoomStep-1) / scaleToSet * anchorY;
        } else {transX_obj=0;transY_obj=0;}

        scale_obj = scaleToSet;



        // Рассчитаем пороговые значения для смещения по оси x
        if (baseWidth_obj * scale_obj <= width_obj) {
            // Карта целиком помещается на холст
            maxTransX = (width_obj - baseWidth_obj * scale_obj) / (2 * scale_obj);
            minTransX = (width_obj - baseWidth_obj * scale_obj) / (2 * scale_obj);
        } else {
            // Не влазит
            maxTransX = 0;
            minTransX = (width_obj - baseWidth_obj * scale_obj) / scale_obj;
        }


        // Ограничим смещение пороговыми значениями
        if (transX_obj > maxTransX) {
            transX_obj = maxTransX;
        } else if (transX_obj < minTransX) {
            transX_obj = minTransX;
        }

        // То же самое для оси y
        if (baseHeight_obj * scale_obj <= height_obj) {
            maxTransY = (height_obj - baseHeight_obj * scale_obj) / (2 * scale_obj);
            minTransY = (height_obj - baseHeight_obj * scale_obj) / (2 * scale_obj);
        } else {
            maxTransY = 0;
            minTransY = (height_obj - baseHeight_obj * scale_obj) / scale_obj;
        }
        if (transY_obj > maxTransY) {
            transY_obj = maxTransY;
        } else if (transY_obj < minTransY) {
            transY_obj = minTransY;
        }


        // Сгруппируем все объекты на холсте и применим трансформацию
        //group = new fabric.Group();
        group = new fabric.Group(canvas.getObjects());
        //for(i=0;i<obj_resive_old_remove.length;i++){group.addWithUpdate(obj_resive_old_remove[i]);}
        if(scale_obj_old==1.0)
        {group_scale_left_obj=group.getWidth()/2-group.left; group_scale_top_obj=group.getHeight()/2-group.top;}
        group.scaleX = scale_obj / scale_obj_old;
        group.scaleY = scale_obj / scale_obj_old;
        group.left = group.getWidth() / 2 + (transX_obj-group_scale_left_obj) * scale_obj;
        group.top = group.getHeight() / 2 + (transY_obj-group_scale_top_obj) * scale_obj;
        group.destroy();
        scale_obj_old=scale_obj;

    };












};


















