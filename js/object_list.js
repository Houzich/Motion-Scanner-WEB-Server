/**
 * Created by 1234 on 26.10.2016.
 */

$(window).on('load', function() {
    object_list_tbl.init({1:"val1", 2:"val2", 3:"val3", 4:"val4",5:"val5", 6:"val6", 7:"val7",8:"val8", 9:"val9", 10:"val10",11:"val11"},
        function (row, fieldName) { /* Ф-ция должна возвращать HTMLElement тип - поле формы */
            var ELEMENT = document.createElement("INPUT");

            ELEMENT.name = fieldName + "[]";
            ELEMENT.type = 'text';
            ELEMENT.max = 100;
            ELEMENT.min = 0;

            return ELEMENT;
        });
});

var object_list_tbl = new function () {
    var rowTpl      = document.createElement("TR");

    this.init = function (fields, creatorCallback) {
        var ELEMENT, TD, rowNum=0;
        /* Строим шаблон строки таблицы один раз, в дальнейшем будем просто его клонировать */
        for(var field in fields) {
            if (false === fields.hasOwnProperty(field)) { continue; }
            TD = document.createElement("TD");

            if (creatorCallback) {
                ELEMENT = creatorCallback(rowNum, fields[field])
            } else {
                ELEMENT = document.createElement("INPUT");
                ELEMENT.name = fields[field] + "[]";
                //ELEMENT.setAttribute('class', 'obj_list_inpt');
            }

            TD.appendChild(ELEMENT).className = "obj_list_inpt";
            rowTpl.appendChild(TD);

            rowNum += 1;
        }
    };

    // Вешаем обработчик на элемент управления кол-вом строк
    this.change_row = function (rows_data) {
        var DataRows = rows_data,
            htmlTBody   = document.getElementById("id_Table_Object_Tbody"),
            NumRows = DataRows.objects.length;

        /* Отслеживаем отрицательные значения а то мало ли какие там значения в option понаставят */
        NumRows = NumRows < 0 ? 0 : NumRows;
        /* Удаляем те строки которые есть. */
        while(htmlTBody.firstChild) {
            htmlTBody.removeChild(htmlTBody.firstChild);
        }
        for (var i = 0; i < NumRows; i++) {
            htmlTBody.appendChild(rowTpl.cloneNode(true));
        }

        // Фактически, ниже это инициализация таблицы:
        // Содержимое ячеек помещается внутрь текстовых
        // полей, а в последнюю ячейку кажой строки, помещаются
        // нопки "удалить" и "добавить" Функция является
        // "вызываемой немедленно"
        return (function() {

            var
                tableRows = document.getElementById("id_Table_Object_Tbody").rows;

            // Мы имеем дело с двумерным массивом: table.rows[...].cells[...]
            // Поэетому сдесь вложенный цикл. Внешний цикл "шагает" по строкам...
            // Внутренний цикл "шагает" по ячейкам:
            for (var i = 0; i < NumRows; i++) {
                tableRows[i].cells[0].firstChild.value=(i+1)+".";
                tableRows[i].cells[1].firstChild.value = DataRows.objects[i].object_id;
                tableRows[i].cells[2].firstChild.value = DataRows.objects[i].quality;
                tableRows[i].cells[3].firstChild.value = DataRows.objects[i].distance_x;
                tableRows[i].cells[4].firstChild.value = DataRows.objects[i].distance_y;
                tableRows[i].cells[5].firstChild.value = DataRows.objects[i].velocity_x;
                tableRows[i].cells[6].firstChild.value = DataRows.objects[i].velocity_y;
                tableRows[i].cells[7].firstChild.value = DataRows.objects[i].object_type;
                tableRows[i].cells[8].firstChild.value = DataRows.objects[i].distance_polar;
                tableRows[i].cells[9].firstChild.value = DataRows.objects[i].speed_polar;
                tableRows[i].cells[10].firstChild.value = DataRows.objects[i].angle;
            }

        }());

    };
};



