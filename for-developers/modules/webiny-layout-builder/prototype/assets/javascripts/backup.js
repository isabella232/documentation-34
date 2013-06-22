parentElement = null;
placeholderHeight = '41px';
//cursorPosition = {bottom: 20, right: 20};
cursorPosition = {top: 20, right: 20};

$(function () {
    createHandlers();
    /**
     * Preset list, acts as sortable to avoid multi-placeholders problem
     */
    $("#presets").sortable({
        items: "li.grid-preset",
        connectWith: "#layout-container, #layout-container .droppable-inner",
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
            if (ui.item.is('li.grid-preset') && $('.element-placeholder-highlight').closest('#layout-container').is('fieldset')) {
                var items = getGridHtml(ui.item);
                items.insertAfter($('.element-placeholder-highlight').prev());
            }
        },
        stop: function (e, ui) {
            $("#presets").sortable("cancel");
        }
    }).disableSelection();

    /**
     * Attributes list, acts as sortable to avoid multi-placeholders problem
     */
    $("#attributes").sortable({
        opacity: 0.5,
        items: "li.attribute",
        connectWith: ".droppable-inner",
        placeholder: "attribute-placeholder-highlight",
        cursorAt: cursorPosition,
        helper: function (e) {
            return $('<div class="attribute-helper">' + $(e.toElement).html() + '</div>');
        },
        start: function (e, ui) {
            // Do not hide source item
            ui.placeholder.height(placeholderHeight);
            ui.item.show();
        },
        beforeStop: function (e, ui) {
            // Check if placeholder is located in the target list
            if (ui.item.is('li.attribute') && $('.attribute-placeholder-highlight').closest('#layout-container').is('fieldset')) {
                var items = getAttributeHtml(ui.item);
                items.insertAfter($('.attribute-placeholder-highlight').prev());
            }
        },
        stop: function (e, ui) {
            $("#attributes").sortable("cancel");
        }
    }).disableSelection();
});

function createHandlers() {
    // Outer list sortable
    $("#layout-container").sortable({
        items: ".sortable",
        placeholder: "droppable-placeholder",
        forcePlaceholderSize: true,
        handle: ".sortable-header",
        opacity: 0.5,
        connectWith: ".connectedSortable",
        tolerance: "pointer",
        toleranceElement: $("div.sortable-header"),
        scroll: true,
        refreshPositions: true,
        cursorAt: cursorPosition,
        helper: function (e) {
            return $('<div class="element-helper">Element helper</div>');
        },
        start: function (e, ui) {
            ui.helper.outerHeight(placeholderHeight);
            ui.placeholder.height(placeholderHeight);
        },
        stop: function (event, ui) {
            if (ui.item.hasClass('grid-preset')) {
                ui.item.remove();
            }
        },
        beforeStop: function (e, ui) {
            if (ui.item.hasClass('grid-preset')) {
                var items = getGridHtml(ui.item);
                items.insertAfter($('.droppable-placeholder').prev());
            }
        },
        receive: function (e, ui) {
            createHandlers();
        }
    }).disableSelection();

    // Nested list sortable (breaks attribute sortable if HANDLE is set)
    $("#layout-container .droppable-inner").sortable({
        items: ".sortable",
        placeholder: "droppable-placeholder",
        forcePlaceholderSize: true,
        opacity: 0.5,
        connectWith: ".connectedSortable",
        cursorAt: cursorPosition,
        helper: function (e) {
            return $('<div class="element-helper">Element helper</div>');
        },
        start: function (e, ui) {
            ui.helper.outerHeight(placeholderHeight);
            ui.placeholder.height(placeholderHeight);
        },
        stop: function (event, ui) {
            if (ui.item.hasClass('grid-preset')) {
                ui.item.remove();
            }
        },
        beforeStop: function (e, ui) {
            if (ui.item.hasClass('grid-preset')) {
                var items = getGridHtml(ui.item);
                items.insertAfter($('.droppable-placeholder').prev());
            }
        },
        receive: function (e, ui) {
            createHandlers();
        }
    }).disableSelection();

    // Makes attributes inside grid columns sortable (white placeholders)
    $('.droppable-inner').sortable({
        placeholder: "attribute-placeholder-highlight",
        items: ".attribute, .sortable",
        opacity: 0.5,
        cursorAt: cursorPosition,
        helper: function (e) {
            // if it's an attribute being dragged - hide attribute placeholder in main container
            if ($(e.toElement).hasClass('attribute')) {
                $('#layout-container').addClass('hide-placeholder');
                return $('<div class="attribute-helper">' + $(e.toElement).html() + '</div>');
            } else {
                // If it's not attribute - get parent '.sortable' to check for proper classes
                var sortable = $(e.toElement).closest('.sortable');
                if (sortable.hasClass('html-element')) {
                    $('#layout-container').addClass('hide-placeholder');
                    return $('<div class="attribute-helper">Element helper</div>');
                } else {
                    $('#layout-container').removeClass('hide-placeholder');
                    return $('<div class="element-helper">Element helper</div>');
                }
            }
        },
        connectWith: ".droppable-inner, #layout-container",
        // Store parent element as both attribute and grid row can be dropped here, but only grid row is allowed
        beforeStop: function (e, ui) {
            parentElement = ui.placeholder.parent();
        },
        stop: function (event, ui) {
            // prevent illegal attribute drop here - TODO: create array of forbidden classes
            if ((ui.item.hasClass('attribute') || ui.item.hasClass('html-element')) && parentElement.is('fieldset')) {
                $('.droppable-inner').sortable("cancel");
                $('#layout-container').removeClass('hide-placeholder');
            }

            if (ui.item.is('li.attribute')) {
                ui.item.remove();
            }

            parentElement = null;
        },
        receive: function (e, ui) {
            createHandlers();
        },

        start: function(e, ui){
            ui.helper.outerHeight(placeholderHeight);
            ui.placeholder.height(placeholderHeight);
        }
    }).disableSelection();

    // Makes grid columns inside 1 grid row sortable (yellow placeholders)
    $("#layout-container .sortable-container").sortable({
        opacity: 0.5,
        items: ".grid-column",
        tolerance: "pointer",
        handle: ".grid-column-header",
        cursorAt: cursorPosition,
        // Nested listeners
        stop: function (event, ui) {
            if (ui.item.hasClass('grid-preset')) {
                ui.item.remove();
            }
        },
        beforeStop: function (e, ui) {
            if (ui.item.hasClass('grid-preset')) {
                var items = getGridHtml(ui.item);
                items.insertAfter($('.attribute-placeholder-highlight').prev());
            }
        },
        receive: function (e, ui) {
            createHandlers();
        }
    }).disableSelection();
}

function getGridHtml(item) {
    var classes = item.attr('data-grid').split('-');
    var items = '';
    $.each(classes, function (index, value) {
        var tpl = $('#element-tpl').html();
        items += tpl.replace(/{x}/g, value);
    });
    return $('<div class="sortable"><div class="sortable-header"><span class="remove-row" onclick="$(this).closest(\'.sortable\').remove()"></span></div><div class="sortable-container">' + items + '<div class="clear"></div></div><div class="clear"></div></div>');
}

function getAttributeHtml(item) {
    return $('<div class="attribute">' + item.text() + '<span class="remove-attribute" onclick="$(this).parent().remove()"></span></div>');
}