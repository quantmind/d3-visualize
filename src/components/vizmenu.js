import {visuals} from '../core/base';
import slugify from '../utils/slugify';

import {csvFormat} from 'd3-dsv';
import {viewProviders} from 'd3-view';

visuals.events.on('after-init.dropdown', viz => {
    if (!viz.menu) return;
    viz.menu.append('vizmenu');
});

const iconExpand = 'ion-android-expand',
    iconCollapse = 'ion-android-contract',
    iconBookmark = 'ion-ios-star-outline',
    iconBookmarked = 'ion-ios-star',
    iconDropDown = 'ion-ios-keypad-outline',
    iconDropDownOpen = 'ion-ios-keypad',
    iconClose = 'ion-ios-close';


function visualOverLay (visual) {
    if (!visual._overlay) visual._overlay = new VisualOverlay(visual);
    return visual._overlay;
}

function visualId (visual) {
    var title = visual.getModel('title').text;
    if (!title) title = visual.layers[0].getModel('title').text;
    if (title) return slugify(title);
}


function VisualOverlay (visual) {
    this.visual = visual.addVisual({
        type: 'overlay',
        padding: 0,
        margin: '5%',
        active: false,
        title: '',
        expand: {
            location: null
        }
    });
}

VisualOverlay.prototype = {
    show () {
        var viz = this.visual,
            visual = viz.getVisual();
        visual.layers.forEach(layer => {
            if (layer === viz) {
                layer.paper().sel.style('display', 'block');
                layer.activate();
            }
            else layer.deactivate();
        });
        viz.draw();
        return this;
    },
    showText (text) {
        this.visual.setData(text);
        this.show();
        return this;
    },
    showData () {
        var frame = this.dataFrame();
        this.visual.setData(frame);
        this.show();
        return this;
    },
    close () {
        this.visual.setData(null);
        var viz = this.visual,
            visual = viz.getVisual();
        visual.layers.forEach(layer => {
            if (layer === viz) layer.deactivate(() => {
                layer.paper().sel.style('display', 'none');
            });
            else layer.activate();
        });
        visual.redraw(false);
    },
    dataFrame () {
        var visual = this.visual.getVisual();
        let viz, i;

        // First check if a visual is extened
        for (i=0; i<visual.layers.length; ++i) {
            viz = visual.layers[i];
            if (viz.__expanded) return viz._drawArgs[0];
        }
        // get the visual with options primary set to true
        for (i=0; i<visual.layers.length; ++i) {
            viz = visual.layers[i];
            if (viz.options.primary) return viz._drawArgs[0];
        }
        // return the first visual with a frame
        for (i=0; i<visual.layers.length; ++i) {
            viz = visual.layers[i];
            if (viz._drawArgs[0]) return viz._drawArgs[0];
        }
    }
};

export const menuItems = [
    {
        label: 'Expand',
        icon: iconExpand,
        $callback (visual) {
            var sel = visual.select(visual.element.parentNode);
            if (this.icon === iconExpand) {
                this.icon = iconCollapse;
                this.label = 'Collapse';
                this.classes = sel.attr('class');
                sel.attr('class', 'd3-fullpage');
                visual.resize();
            }
            else {
                this.icon = iconExpand;
                this.label = 'Expand';
                sel.attr('class', this.classes);
                visual.fit();
                visual.visualRoot.redraw(false);
            }
        }
    },
    {
        icon: 'ion-information-circled',
        label: 'Description',
        $callback (visual, menu) {
            var overlay = visualOverLay(visual),
                text = 'bo';    // faker.lorem.paragraphs(10);

            menu.dropDownIcon = iconClose;
            menu.preventToggle = closeOverlay;

            viewProviders.require('marked').then(marked => {
                overlay.showText(marked(text));
            });

            function closeOverlay () {
                this.dropDownIcon = iconDropDown;
                this.preventToggle = null;
                overlay.close();
            }
        }
    },
    {
        icon: iconBookmark,
        label: 'Bookmark',
        $init (visual) {
            var id = visualId(visual);
            if (id) {
                var b = window.localStorage.getItem(id);
                if (b) {
                    this.icon = iconBookmarked;
                    this.label = 'Remove bookmark';
                }
            }
        },
        $callback (visual) {
            var id = visualId(visual);
            if (id) {
                var b = window.localStorage.getItem(id);
                if (b) {
                    window.localStorage.removeItem(id);
                    this.icon = iconBookmark;
                    this.label = 'Bookmark';
                } else {
                    window.localStorage.setItem(id, true);
                    this.icon = iconBookmarked;
                    this.label = 'Remove bookmark';
                }
            }
        }
    },
    {
        icon: 'ion-ios-grid-view',
        label: 'Show data',
        $callback (visual, menu) {
            var overlay = visualOverLay(visual);
            menu.dropDownIcon = iconClose;
            menu.preventToggle = closeOverlay;
            overlay.showData();

            function closeOverlay () {
                this.dropDownIcon = iconDropDown;
                this.preventToggle = null;
                overlay.close();
            }
        }
    },
    {
        icon: "ion-android-download",
        label: 'Download data',
        $callback (visual) {
            var overlay = visualOverLay(visual),
                frame = overlay.visual.setData(visual.layers[0]._drawArgs[0]).getData(),
                columns = overlay.visual.getColumns(frame),
                data = frame.data.map(row => {
                    return columns.reduce((o, c) => {
                        o[c.label] = c.formatter(row[c.name]);
                        return o;
                    }, {});
                }),
                csv = encodeURI('data:text/csv;charset=utf-8,' + csvFormat(data)),
                filename = visualId(visual) + '.csv',
                link = document.createElement('a');
            link.setAttribute('href', csv);
            link.setAttribute('download', filename);
            link.click();
        }
    }
];


function dropdown (id) {
    return `
<ul class="navbar-nav flex-row ml-md-auto">
    <li class="nav-item dropdown" d3-class="menuExpanded ? 'show' : null">
        <a id="${id}" class="nav-item mr-md-2" href="#" aria-haspopup="true" d3-attr-aria-expanded="menuExpanded ? 'true' : 'false'" d3-on='$toggleMenu()'>
            <i d3-class="dropDownIcon"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right" d3-class="menuExpanded ? 'show' : null" aria-labelledby="${id}">
            <a d3-for="item in dropDownItems" class="dropdown-item" href="#" d3-on="$menuAction(item)">
                <i d3-class="item.icon" class="mr-2"></i>
                <span d3-html="item.label"></span>
            </a>
        </div>
    </li>
</ul>
`;
}


export default {

    model () {
        return {
            menuExpanded: false,
            dropDownIcon: iconDropDown,
            dropDownItems: menuItems.slice(),
            preventToggle: null,
            $toggleMenu () {
                if (this.$event)
                    this.$event.preventDefault();
                if (this.preventToggle)
                    this.preventToggle();
                else {
                    this.menuExpanded = !this.menuExpanded;
                    if (this.menuExpanded) this.dropDownIcon = iconDropDownOpen;
                    else this.dropDownIcon = iconDropDown;
                }
            },
            $menuAction (item) {
                this.$toggleMenu();
                if (item && item.$callback)
                    item.$callback(this.visual, this);
            }
        };
    },

    render () {
        var model = this.model,
            id = `dropdown-${model.uid}`;
        return this.viewElement(dropdown(id));
    },

    mounted () {
        var visual = this.model.visual;
        this.model.dropDownItems.forEach(item => {
            if (item.$init) item.$init(visual);
        });
    }
};
