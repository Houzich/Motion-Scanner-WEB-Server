(function() {
    var element = $('#canvas'), // ещё пригодится для обработки событий
        canvas = new fabric.Canvas(element.get(0), {
            selection: false, // отключим возможность выбора группы
            scale: 1, // установим масштаб по умолчанию
            renderOnAddRemove: false, // отключим авто-отрисовку, чтобы увеличить скорость для большого числа меток
            moveCursor: 'default', // сбросим курсоры, чтобы не отвлекали
            hoverCursor: 'default'
        });

    var baseWidth = 0, // начальная ширина
        baseHeight = 0, // начальная высота
        baseScale = 1, // начальный мастшаб

        width = 0, // текущая ширина
        height = 0, // текущая высота
        transX = 0, // текущее смещение по оси x
        transY = 0, // текущее смещение по оси y
        scale = 1; // текущий масштаб в целом

    var applyTransform = function() {
        var maxTransX,
            maxTransY,
            minTransX,
            minTransY,
            group;

        // Рассчитаем пороговые значения для смещения по оси x
        if (baseWidth * scale <= width) {
            // Карта целиком помещается на холст
            maxTransX = (width - baseWidth * scale) / (2 * scale);
            minTransX = (width - baseWidth * scale) / (2 * scale);
        } else {
            // Не влазит
            maxTransX = 0;
            minTransX = (width - baseWidth * scale) / scale;
        }
        // Ограничим смещение пороговыми значениями
        if (transX > maxTransX) {
            transX = maxTransX;
        } else if (transX < minTransX) {
            transX = minTransX;
        }

        // То же самое для оси y
        if (baseHeight * scale <= height) {
            maxTransY = (height - baseHeight * scale) / (2 * scale);
            minTransY = (height - baseHeight * scale) / (2 * scale);
        } else {
            maxTransY = 0;
            minTransY = (height - baseHeight * scale) / scale;
        }
        if (transY > maxTransY) {
            transY = maxTransY;
        } else if (transY < minTransY) {
            transY = minTransY;
        }

        // Сгруппируем все объекты на холсте и применим трансформацию
        group = new fabric.Group(canvas.getObjects());
        group.scaleX = scale / canvas.scale;
        group.scaleY = scale / canvas.scale;
        group.left = group.getWidth() / 2 + transX * scale;
        group.top = group.getHeight() / 2 + transY * scale;
        group.destroy();

        // Обновим глобальный масштаб на холсте
        canvas.scale = scale;

        // Отрисуем холст с изменёнными объектами
        canvas.renderAll();
    };

    var setScale = function(scaleToSet, anchorX, anchorY) {
        var zoomMax = 5, // максимально 5-ти кратное увеличение
            zoomMin = 1, // минимальное увеличение - реальный размер картинки
            zoomStep; // необходимое изменение масштаба

        // Ограничим масштаб, если нужно
        if (scaleToSet > zoomMax * baseScale) {
            scaleToSet = zoomMax * baseScale;
        } else if (scaleToSet < zoomMin * baseScale) {
            scaleToSet = zoomMin * baseScale;
        }

        // Центр масштабирования - точка, которая должна остаться на месте.
        // Задаётся параметрами anchorX и anchorY.
        // По сути это должна быть позиция курсора в момент масштабирования.
        if (typeof anchorX != 'undefined' && typeof anchorY != 'undefined') {
            zoomStep = scaleToSet / scale;
            // Рассчитаем, на сколько нужно сместить все объекты,
            // чтобы центр масштабирования остался на месте.
            transX -= (zoomStep - 1) / scaleToSet * anchorX;
            transY -= (zoomStep - 1) / scaleToSet * anchorY;
        }

        // Установим текущий масштаб
        scale = scaleToSet;

        // Применим трансформацию
        applyTransform();
    };

    var bindContainerEvents = function() {
        var mouseDown = false,
            oldPageX,
            oldPageY,
            container = $(canvas.wrapperEl);

        container.mousemove(function(e) {
            // Непосредственно перемещение
            if (mouseDown) {
                // Рассчитываем смещение с учётом масштаба
                transX -= (oldPageX - e.pageX) / scale;
                transY -= (oldPageY - e.pageY) / scale;

                // Применим трансформацию
                applyTransform();

                // Ну и сохраним положение
                oldPageX = e.pageX;
                oldPageY = e.pageY;
                return false;
            }
        }).mousedown(function(e) {
            // Установим положение в начале перемещения по карте
            mouseDown = true;
            oldPageX = e.pageX;
            oldPageY = e.pageY;
            return false;
        });

        $('body').mouseup(function() {
            mouseDown = false;
        });

        // Масштабирование колесом мыши
        container.mousewheel(function(event, delta, deltaX, deltaY) {
            var offset = element.offset(), // положение холста на странице
                centerX = event.pageX - offset.left, // координата x центра масштабирования
                centerY = event.pageY - offset.top, // координата y центра масштабирования
                zoomStep = Math.pow(1.3, deltaY); // шаг масштабирования, удобный для пользователя.

            setScale(scale * zoomStep, centerX, centerY);

            // Отключим скролл страницы
            event.preventDefault();
        });

        canvas.on('mouse:down', function(options) {
            addExtendZone(options.e);
        }).on('mouse:move', function(options) {
            drawZone(options.e);
        });
        $(document).on('dblclick', finishZone).on('keydown', undoZonePoint);
    };

    var markerColor = '#2567d5';

    var currentEditingZone;
    // Вспомогательная функция для получения координат, учитывающих текущий масштаб
    var convertPointToRelative = function(point, object) {
        return {
            x: (point.x - object.left) / scale,
            y: (point.y - object.top) / scale
        };
    };

    var addExtendZone = function(mouseEvent) {
        if (window.isEditing || !window.isZoneEditing)
            return;
        var position = canvas.getPointer(mouseEvent);

        // Новая точка уже существующей зоны
        if (currentEditingZone) {
            currentEditingZone.points.push(convertPointToRelative(position, currentEditingZone));
            return;
        }
        // Новая зона - сделаем сразу 3 точки, тогда визуально зона будет линией
        currentEditingZone = new fabric.Polygon(
            [{
                x: 0,
                y: 0
            }, {
                x: 1,
                y: 1
            }, {
                x: -1,
                y: -1
            }], {
                scaleX: scale,
                scaleY: scale,
                left: position.x,
                top: position.y,
                fill: new fabric.Color(markerColor).setAlpha(0.3).toRgba(),
                stroke: '#2e69b6',
            });

        canvas.add(currentEditingZone);
        canvas.renderAll();
    };

    var drawZone = function(mouseEvent) {
        var points;
        if (currentEditingZone) {
            // При перемещении мыши меняем только последнюю точку
            points = currentEditingZone.points;
            points[points.length - 1] = convertPointToRelative(canvas.getPointer(mouseEvent), currentEditingZone);
            canvas.renderAll();
        }
    };

    var finishZone = function() {
        if (!currentEditingZone) {
            return;
        }

        // Уберём последнюю точку, так как клик двойной
        currentEditingZone.points.pop();
        currentEditingZone = null;
    };

    var undoZonePoint = function(event) {
        // Только backspace и delete
        if (currentEditingZone && (event.which == 8 || event.which == 46)) {
            var points = currentEditingZone.points,
                isDeleted = points.length <= 3;
            points[points.length - 2] = points[points.length - 1];
            points.pop();
            // Отмена зоны вообще
            if (isDeleted) {
                canvas.remove(currentEditingZone);
                currentEditingZone = null;
            }
            canvas.renderAll();
            event.preventDefault();
        }
    };

    var bindContainerTouchEvents = function() {
        var touchStartScale, // масштаб в момент первого прикосновения
            touchStartDistance, // расстояние между точками первого касания
            container = $(canvas.wrapperEl),
            touchX,
            touchY,
            centerTouchX,
            centerTouchY,
            lastTouchesLength,
            handleTouchEvent = function(e) {
                var touches = e.originalEvent.touches,
                    offset,
                    currentScale,
                    transXOld,
                    transYOld;

                if (e.type == 'touchstart') {
                    lastTouchesLength = 0;
                }

                if (touches.length == 1) {
                    if (lastTouchesLength == 1) {
                        transXOld = transX;
                        transYOld = transY;
                        transX -= (touchX - touches[0].pageX) / scale;
                        transY -= (touchY - touches[0].pageY) / scale;
                        applyTransform();
                        if (transXOld != transX || transYOld != transY) {
                            e.preventDefault();
                        }
                    }
                    touchX = touches[0].pageX;
                    touchY = touches[0].pageY;
                } else if (touches.length == 2) {
                    if (lastTouchesLength == 2) {
                        currentScale = Math.sqrt(
                                Math.pow(touches[0].pageX - touches[1].pageX, 2) +
                                Math.pow(touches[0].pageY - touches[1].pageY, 2)
                            ) / touchStartDistance;
                        setScale(
                            touchStartScale * currentScale,
                            centerTouchX,
                            centerTouchY
                        );
                        e.preventDefault();
                    } else {
                        offset = element.offset();
                        if (touches[0].pageX > touches[1].pageX) {
                            centerTouchX = touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2;
                        } else {
                            centerTouchX = touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2;
                        }
                        if (touches[0].pageY > touches[1].pageY) {
                            centerTouchY = touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2;
                        } else {
                            centerTouchY = touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2;
                        }
                        centerTouchX -= offset.left;
                        centerTouchY -= offset.top;
                        touchStartScale = scale;
                        touchStartDistance = Math.sqrt(
                            Math.pow(touches[0].pageX - touches[1].pageX, 2) +
                            Math.pow(touches[0].pageY - touches[1].pageY, 2)
                        );
                    }
                }

                lastTouchesLength = touches.length;
            };

        container.bind('touchstart', handleTouchEvent);
        container.bind('touchmove', handleTouchEvent);
    };

    fabric.util.loadImage('http://www.radugapark.ru/upload/root/image/new%20plan(1).jpg', function(img) {
        var map = new fabric.Image(img),
            curBaseScale;
        if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
            bindContainerTouchEvents();
        } else {
            bindContainerEvents();
        }

        // Установим начальные и текущие размеры
        baseWidth = map.width;
        baseHeight = map.height;
        width = element.width();
        height = element.height();

        // Отключим любую возможность редактирования и выбора карты как объекта на холсте
        map.set({
            hasRotatingPoint: false,
            hasBorders: false,
            hasControls: false,
            lockScalingY: true,
            lockScalingX: true,
            selectable: false,
            left: map.width / 2,
            top: map.height / 2,
            originX: 'center',
            originY: 'center'
        });
        canvas.add(map);

        // Отмасштабируем, чтобы сразу видеть всё карту
        curBaseScale = baseScale;
        if (width / height > baseWidth / baseHeight) {
            baseScale = height / baseHeight;
        } else {
            baseScale = width / baseWidth;
        }
        scale *= baseScale / curBaseScale;
        transX *= baseScale / curBaseScale;
        transY *= baseScale / curBaseScale;

        canvas.setWidth(width);
        canvas.setHeight(height);

        applyTransform();

        // Метки на карте, добавим позднее
        createMarkers();
    });

    var addMarker = function(point, text) {
        var marker;
        // Сама метка
        if (window.isElevatorMarker) {
            var circle = new fabric.Circle({
                    radius: 22.5
                }),
                path1 = new fabric.Path('M31,31h-2L15,17H9c-1.1027832,0-2,0.8971558-2,2c0,1.1027832,0.8972168,2,2,2h2l14,14h6c1.1027832,0,2-0.8972168,2-2C33,31.8971558,32.1027832,31,31,31z', {
                    originX: 'center',
                    originY: 'center',
                    fill: markerColor
                }),
                path2 = new fabric.Path('M22.5,2C11.1782227,2,2,11.1781616,2,22.5S11.1782227,43,22.5,43S43,33.8218384,43,22.5S33.8217773,2,22.5,2z M26.5,7C27.8806152,7,29,8.1192627,29,9.5c0,1.3806763-1.1193848,2.5-2.5,2.5c-1.3807373,0-2.5-1.1193237-2.5-2.5C24,8.1192627,25.1192627,7,26.5,7z M26.5,13.0023804c1.380249-0.0330811,2.5,0.2385864,2.5,3s0,8,0,8l-6-7C23,17.0023804,25.0908203,13.0361938,26.5,13.0023804z M31,38h-7L10,24H9c-2.7614746,0-5-2.2385864-5-5s2.2385254-5,5-5h7l14,14h1c2.7613525,0,5,2.2385864,5,5S33.7613525,38,31,38z', {
                    originX: 'center',
                    originY: 'center',
                    fill: markerColor
                });
            marker = new fabric.Group([circle, path1, path2], {
                width: 40,
                height: 80,
                scaleX: scale,
                scaleY: scale,
                left: point.x,
                top: point.y,
                originX: 'center',
                originY: 'center',
                fill: markerColor,

                text: text // сохраним текст в объекте для импорта/экспорта
            });
        } else {
            marker = new fabric.Path('m 11,-19.124715 c -8.2234742,0 -14.8981027,-6.676138 -14.8981027,-14.9016 0,-5.633585 3.35732837,-10.582599 6.3104192,-14.933175 C 4.5507896,-52.109948 9.1631953,-59.34619 11,-61.92345 c 1.733396,2.518329 6.760904,9.975806 8.874266,13.22971 3.050966,4.697513 6.023837,8.647788 6.023837,14.667425 0,8.225462 -6.674629,14.9016 -14.898103,14.9016 z m 0,-9.996913 c 2.703016,0 4.903568,-2.201022 4.903568,-4.904687 0,-2.703664 -2.200552,-4.873493 -4.903568,-4.873493 -2.7030165,0 -4.903568,2.169829 -4.903568,4.873493 0,2.703665 2.2005515,4.904687 4.903568,4.904687 z"', {
                width: 40,
                height: 80,
                scaleX: scale,
                scaleY: scale,
                left: point.x,
                top: point.y,
                originX: 'center',
                originY: 'center',
                fill: markerColor,
                stroke: '#2e69b6',
                text: text // сохраним текст в объекте для импорта/экспорта
            })
        }
        // Текст
        var textObject = new fabric.Text(text, {
                fontSize: 30,
                originX: 'center',
                fill: markerColor,
                originY: 'center'
            }),
            // Обёртка вокруг текста
            background = new fabric.Rect({
                width: 100,
                height: 40,
                originX: 'center',
                originY: 'center',
                fill: 'white',
                stroke: 'black'
            }),
            // Сгруппируем их для правильного позиционирования
            textGroup = new fabric.Group([background, textObject], {
                scaleX: scale,
                scaleY: scale,
                left: point.x + 20 * scale, // при смещении необходимо учитывать масштаб
                top: point.y - 30 * scale // при смещении необходимо учитывать масштаб
            });

        canvas.add(marker);
        canvas.add(textGroup);
    };

    var createMarkers = function() {
        var markersCount = 0;

        // Флаг режима редактирования
        window.isEditing = false;

        // Создание новой метки
        canvas.on('mouse:down', function(options) {
            var position;

            if (!window.isEditing) {
                return;
            }
            // Получим абсолютную координату на холсте
            position = canvas.getPointer(options.e);
            // Текст - номер и случайное число
            addMarker(position, '#' + markersCount++ + ':' + Math.round(Math.random() * 1000));
            // Не забываем отрисовку
            canvas.renderAll();
        });
    };

    var doActionWithCanvasReset = function(action) {
        // Сохраним текущее состояние
        var prevScale = scale,
            prevTransX = transX,
            prevTransY = transY;

        // Сбросим состояние до начального
        scale = 1;
        transX = 0;
        transY = 0;

        // Применим транформацию
        applyTransform();

        action();

        // Восстановим состояние
        scale = prevScale;
        transX = prevTransX;
        transY = prevTransY;

        // Применим обратную трансформацию
        applyTransform();

        // Наконец, отрисуем, всё что есть
        canvas.renderAll();
    }

    window.export = function() {
        doActionWithCanvasReset(function() {
            var markers = [];

            $.each(canvas.getObjects(), function() {
                // Сохраним только сами маркеры, игнорируя всё остальное
                if (this.type == 'path') {
                    // Нет смысла сохранять все свойства, возьмём только нужные
                    markers.push({
                        left: this.left,
                        top: this.top,
                        text: this.text
                    });
                };
            });
            $('#markersData').val(JSON.stringify(markers));
        });
    };

    window.import = function() {
        var markersData = $('#markersData').val();
        if (!markersData) {
            return;
        }
        var markers = JSON.parse(markersData),
            objects = canvas.getObjects(),
            count = objects.length;

        // Удалим все объекты, кроме картинки (индекс 0)
        for (var i = 1; i < count; i++) {
            // Объект из массива удаляется, поэтому индекс всегда 1
            canvas.remove(objects[1]);
        };

        doActionWithCanvasReset(function() {
            $.each(markers, function() {
                addMarker({
                    x: this.left,
                    y: this.top
                }, this.text);
            });
        });
    };
})();
