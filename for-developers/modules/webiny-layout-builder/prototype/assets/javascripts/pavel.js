$(function () {
    createDroppable();

    $("#presets li").draggable({
        helper: "clone"
    }).disableSelection();

    /** ELEMENTS **/
    $("#attributes li").draggable({
        helper: "clone",
        cursor: "move"
    }).disableSelection();

});

function createDroppable() {
    setTimeout(function () {
        $(".droppable-outer").droppable({
                activeClass: "ui-state-hover",
                hoverClass: "ui-state-active",
                tolerance: "pointer",
                drop: function (e, ui) {
                    if (ui.draggable.hasClass('grid-preset')) {
                        var items = getGridHtml(ui.draggable);
                        appendnow(items, this);
                    } else {
                        ui.draggable.appendTo($(this)).fadeIn();
                    }
                    createDroppable();
                }
            }
        );

        $('#layout-container').sortable({
            items: "div.sortable",
            placeholder: "droppable-placeholder",
            handle: "div.sortable-header",
            start: function (e, ui) {
                ui.placeholder.height(ui.item.height());
            },
            receive: function (e, ui) {
                console.log("Sortable receive!");
                if (ui.item.hasClass('grid-preset')) {
                    var items = getGridHtml(ui.item);
                    items.appendTo(this);
                } else {
                    ui.item.appendTo($(this));
                }
                createDroppable();
            }
        });

        $('.sortable-container').sortable({
            items: '.droppable-inner'
        });
    }, 200);
}

function appendnow(item, whereto) {
    item.appendTo(whereto).find('.droppable-inner').droppable({
        // and this droppable  should be greedy to intercept events
        greedy: true,
        accept: '.sortable, li.grid-preset',
        activeClass: "ui-state-hover",
        hoverClass: "ui-state-active",
        drop: function (e, ui) {
            console.log("Inner droppable drop!");
            if (ui.draggable.hasClass('grid-preset')) {
                var items = getGridHtml(ui.draggable);
                items.appendTo(this);
            } else {
                ui.draggable.appendTo($(this)).remove();
            }
            createDroppable();
        },
        over: function (e, ui) {
            $('.droppable-placeholder').hide();
        },
        out: function (e, ui) {
            $('.droppable-placeholder').show();
        }
    });
}

// Parse templates
function getGridHtml(item) {
    var classes = item.attr('data-grid').split('-');
    var items = '';
    $.each(classes, function (index, value) {
        var tpl = $('#element-tpl').html();
        items += tpl.replace(/{x}/g, value);
    });
    return $('<div class="sortable"><div class="sortable-header"></div><div class="sortable-container">' + items + '<div class="clear"></div></div><div class="clear"></div></div>');
}