tabsCounter = 0;
fieldsetCounter = 0 ;

$(function () {
    /**
     * Preset list, acts as sortable to avoid multi-placeholders problem
     */
    $("#elements").sortable({
        items: "li.element",
        connectWith: "#layout-container .droppable-inner",
        placeholder: "element-placeholder-highlight",
        opacity: 0.5,
        cursorAt: cursorPosition,
        helper: function (e) {
            return $('<div class="element-helper">' + $(e.toElement).html() + '</div>');
        },
        start: function (e, ui) {
            // Do not hide source item
            ui.placeholder.height(placeholderHeight);
            ui.item.show();
        },
        beforeStop: function (e, ui) {
            // Check if placeholder is located in the target list
            if (ui.item.is('li.element') && $('.element-placeholder-highlight').closest('#layout-container').is('fieldset')) {
                var items = getElementHtml(ui.item);
                items.insertAfter($('.element-placeholder-highlight').prev());
                $("#tabs-" + tabsCounter).tabs();

            }
        },
        stop: function (e, ui) {
            $("#elements").sortable("cancel");
        }
    }).disableSelection();
});

function getElementHtml(item) {
    if (item.attr('data-type') == 'tabs') {
        tabsCounter++;
        var tpl = $('#tabs-tpl').html();
        tpl = tpl.replace(/{x}/g, tabsCounter);
        return $($.trim(tpl));
    }
    if (item.attr('data-type') == 'fieldset') {
        fieldsetCounter++;
        var tpl = $('#fieldset-tpl').html();
        tpl = tpl.replace(/{x}/g, fieldsetCounter);
        return $($.trim(tpl));
    }
}