/*******************************************************************************
 * Copyright 2020 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    window.CQ = window.CQ || {};
    window.CQ.CoreComponents = window.CQ.CoreComponents || {};
    window.CQ.CoreComponents.container = window.CQ.CoreComponents.container || {};
    window.CQ.CoreComponents.container.utils = {};

    /**
     * Utilities for Container Components (accordion, tabs)
     *
     * @namespace
     * @alias CQ.CoreComponents.container.utils
     * @type {{}}
     */
    window.CQ.CoreComponents.container.utils = {

        /**
         * Removes the hash from the URL.
         */
        removeUrlHash: function() {
            history.replaceState(undefined, undefined, " ");
        },

        /**
         * Updates the URL hash with the panel ID without scrolling to it.
         *
         * @param {Object} component The container component (e.g. Accordion, Carousel, Tabs).
         * @param {String} itemType The type of the item as defined in the component.
         * @param {Number} index The index of the container item
         */
        updateUrlHash: function(component, itemType, index) {
            if (component && component._elements && component._elements[itemType] &&
                component._elements[itemType][index] && component._elements[itemType][index].id) {
                var ID = component._elements[itemType][index].id;
                history.replaceState(undefined, undefined, "#" + ID);
            }
        },

        /**
         * Returns the index of the component item (accordion, carousel, tabs) that:
         * - either corresponds to the deep link in the URL fragment
         * - or contains the element that corresponds to the deep link in the URL fragment
         *
         * @param {Object} component The container component (Accordion, Carousel or Tabs).
         * @param {String} itemType The type of the item as defined in the component.
         * @param {String} itemContentType The type of the item content as defined in the component.
         * @returns {Number} the index within the items array if the item exists, -1 otherwise.
         */
        getDeepLinkItemIdx: function(component, itemType, itemContentType) {
            if (window.location.hash) {
                var deepLinkId = window.location.hash.substring(1);
                if (deepLinkId && document.getElementById(deepLinkId) &&
                    component && component._config && component._config.element &&
                    component._elements[itemType] &&
                    component._config.element.querySelector("[id='" + deepLinkId + "']")) {
                    for (var i = 0; i < component._elements[itemType].length; i++) {
                        var item = component._elements[itemType][i];
                        var itemContentContainsId = false;
                        if (component._elements[itemContentType]) {
                            var itemContent = component._elements[itemContentType][i];
                            itemContentContainsId = itemContent && itemContent.querySelector("[id='" + deepLinkId + "']");
                        }
                        if (item.id === deepLinkId || itemContentContainsId) {
                            return i;
                        }
                    }
                }
                return -1;
            }
            return -1;
        },

        /**
         * Returns the item of the container component (accordion, carousel, tabs) that:
         * - either corresponds to the deep link in the URL fragment
         * - or contains the element that corresponds to the deep link in the URL fragment
         *
         * @param {Object} component The Accordion or Tabs component.
         * @param {String} itemType The type of the item as defined in the component.
         * @param {String} itemContentType The type of the item content as defined in the component.
         * @returns {Object} the item if it exists, undefined otherwise.
         */
        getDeepLinkItem: function(component, itemType, itemContentType) {
            var idx = window.CQ.CoreComponents.container.utils.getDeepLinkItemIdx(component, itemType, itemContentType);
            if (component && component._elements && component._elements[itemType]) {
                return component._elements[itemType][idx];
            }
        },

        /**
         * Scrolls the browser on page reload (if URI contains URI fragment) to the item of the container component (accordion, tabs)
           that corresponds to the deep link in the URI fragment.
         * This method fixes the issue existent with Chrome and related browsers, which are not scrolling on page reload (if URI contains URI fragment)
           to the element that corresponds to the deep link in the URI fragment.
         * Small setTimeout is needed, otherwise the scrolling will not work on Chrome.
         */
        scrollToAnchor: function() {
            setTimeout(function() {
                if (window.location.hash) {
                    var id = decodeURIComponent(window.location.hash.substring(1));
                    var anchorElement = document.getElementById(id);
                    if (anchorElement && anchorElement.offsetTop) {
                        anchorElement.scrollIntoView();
                    }
                }
            }, 100);
        }
    };
}());

/*******************************************************************************
 * Copyright 2019 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2019 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined;
    if (!containerUtils) {
        // eslint-disable-next-line no-console
        console.warn("Accordion: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page.");
    }
    var dataLayerEnabled;
    var dataLayer;
    var delay = 100;

    var NS = "cmp";
    var IS = "accordion";

    var keyCodes = {
        ENTER: 13,
        SPACE: 32,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var cssClasses = {
        button: {
            disabled: "cmp-accordion__button--disabled",
            expanded: "cmp-accordion__button--expanded"
        },
        panel: {
            hidden: "cmp-accordion__panel--hidden",
            expanded: "cmp-accordion__panel--expanded"
        }
    };

    var dataAttributes = {
        item: {
            expanded: "data-cmp-expanded"
        }
    };

    var properties = {
        /**
         * Determines whether a single accordion item is forced to be expanded at a time.
         * Expanding one item will collapse all others.
         *
         * @memberof Accordion
         * @type {Boolean}
         * @default false
         */
        "singleExpansion": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        }
    };

    /**
     * Accordion Configuration.
     *
     * @typedef {Object} AccordionConfig Represents an Accordion configuration
     * @property {HTMLElement} element The HTMLElement representing the Accordion
     * @property {Object} options The Accordion options
     */

    /**
     * Accordion.
     *
     * @class Accordion
     * @classdesc An interactive Accordion component for toggling panels of related content
     * @param {AccordionConfig} config The Accordion configuration
     */
    function Accordion(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Accordion.
         *
         * @private
         * @param {AccordionConfig} config The Accordion configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            if (that._elements["item"]) {
                // ensures multiple element types are arrays.
                that._elements["item"] = Array.isArray(that._elements["item"]) ? that._elements["item"] : [that._elements["item"]];
                that._elements["button"] = Array.isArray(that._elements["button"]) ? that._elements["button"] : [that._elements["button"]];
                that._elements["panel"] = Array.isArray(that._elements["panel"]) ? that._elements["panel"] : [that._elements["panel"]];

                if (that._properties.singleExpansion) {
                    var expandedItems = getExpandedItems();
                    // multiple expanded items annotated, display the last item open.
                    if (expandedItems.length > 1) {
                        toggle(expandedItems.length - 1);
                    }
                }

                refreshItems();
                bindEvents();
                scrollToDeepLinkIdInAccordion();
            }
            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Accordion component
                 * - if so, route the "navigate" operation to enact a navigation of the Accordion based on index data
                 */
                window.CQ.CoreComponents.MESSAGE_CHANNEL = window.CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                window.CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-accordion" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            // switch to single expansion mode when navigating in edit mode.
                            var singleExpansion = that._properties.singleExpansion;
                            that._properties.singleExpansion = true;
                            toggle(message.data.index);

                            // revert to the configured state.
                            that._properties.singleExpansion = singleExpansion;
                        }
                    }
                });
            }
        }

        /**
         * Displays the panel containing the element that corresponds to the deep link in the URI fragment
         * and scrolls the browser to this element.
         */
        function scrollToDeepLinkIdInAccordion() {
            if (containerUtils) {
                var deepLinkItemIdx = containerUtils.getDeepLinkItemIdx(that, "item", "item");
                if (deepLinkItemIdx > -1) {
                    var deepLinkItem = that._elements["item"][deepLinkItemIdx];
                    if (deepLinkItem && !deepLinkItem.hasAttribute(dataAttributes.item.expanded)) {
                        // if single expansion: close all accordion items
                        if (that._properties.singleExpansion) {
                            for (var j = 0; j < that._elements["item"].length; j++) {
                                if (that._elements["item"][j].hasAttribute(dataAttributes.item.expanded)) {
                                    setItemExpanded(that._elements["item"][j], false, true);
                                }
                            }
                        }
                        // expand the accordion item containing the deep link
                        setItemExpanded(deepLinkItem, true, true);
                    }
                    var hashId = window.location.hash.substring(1);
                    if (hashId) {
                        var hashItem = document.querySelector("[id='" + hashId + "']");
                        if (hashItem) {
                            hashItem.scrollIntoView();
                        }
                    }
                }
            }
        }

        /**
         * Caches the Accordion elements as defined via the {@code data-accordion-hook="ELEMENT_NAME"} markup API.
         *
         * @private
         * @param {HTMLElement} wrapper The Accordion wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own accordion elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Sets up properties for the Accordion based on the passed options.
         *
         * @private
         * @param {Object} options The Accordion options
         */
        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    var property = properties[key];
                    var value = null;

                    if (options && options[key] != null) {
                        value = options[key];

                        // transform the provided option
                        if (property && typeof property.transform === "function") {
                            value = property.transform(value);
                        }
                    }

                    if (value === null) {
                        // value still null, take the property default
                        value = properties[key]["default"];
                    }

                    that._properties[key] = value;
                }
            }
        }

        /**
         * Binds Accordion event handling.
         *
         * @private
         */
        function bindEvents() {
            window.addEventListener("hashchange", scrollToDeepLinkIdInAccordion, false);
            var buttons = that._elements["button"];
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    (function(index) {
                        buttons[i].addEventListener("click", function(event) {
                            toggle(index);
                            focusButton(index);
                        });
                        buttons[i].addEventListener("keydown", function(event) {
                            onButtonKeyDown(event, index);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles button keydown events.
         *
         * @private
         * @param {Object} event The keydown event
         * @param {Number} index The index of the button triggering the event
         */
        function onButtonKeyDown(event, index) {
            var lastIndex = that._elements["button"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        focusButton(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        focusButton(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    focusButton(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    focusButton(lastIndex);
                    break;
                case keyCodes.ENTER:
                case keyCodes.SPACE:
                    event.preventDefault();
                    toggle(index);
                    focusButton(index);
                    break;
                default:
                    return;
            }
        }

        /**
         * General handler for toggle of an item.
         *
         * @private
         * @param {Number} index The index of the item to toggle
         */
        function toggle(index) {
            var item = that._elements["item"][index];
            if (item) {
                if (that._properties.singleExpansion) {
                    // ensure only a single item is expanded if single expansion is enabled.
                    for (var i = 0; i < that._elements["item"].length; i++) {
                        if (that._elements["item"][i] !== item) {
                            var expanded = getItemExpanded(that._elements["item"][i]);
                            if (expanded) {
                                setItemExpanded(that._elements["item"][i], false);
                            }
                        }
                    }
                }
                setItemExpanded(item, !getItemExpanded(item));

                if (dataLayerEnabled) {
                    var accordionId = that._elements.self.id;
                    var expandedItems = getExpandedItems()
                        .map(function(item) {
                            return getDataLayerId(item);
                        });

                    var uploadPayload = { component: {} };
                    uploadPayload.component[accordionId] = { shownItems: expandedItems };

                    var removePayload = { component: {} };
                    removePayload.component[accordionId] = { shownItems: undefined };

                    dataLayer.push(removePayload);
                    dataLayer.push(uploadPayload);
                }
            }
        }

        /**
         * Sets an item's expanded state based on the provided flag and refreshes its internals.
         *
         * @private
         * @param {HTMLElement} item The item to mark as expanded, or not expanded
         * @param {Boolean} expanded true to mark the item expanded, false otherwise
         * @param {Boolean} keepHash true to keep the hash in the URL, false to update it
         */
        function setItemExpanded(item, expanded, keepHash) {
            if (expanded) {
                item.setAttribute(dataAttributes.item.expanded, "");
                var index = that._elements["item"].indexOf(item);
                if (!keepHash && containerUtils) {
                    containerUtils.updateUrlHash(that, "item", index);
                }
                if (dataLayerEnabled) {
                    dataLayer.push({
                        event: "cmp:show",
                        eventInfo: {
                            path: "component." + getDataLayerId(item)
                        }
                    });
                }

            } else {
                item.removeAttribute(dataAttributes.item.expanded);
                if (!keepHash && containerUtils) {
                    containerUtils.removeUrlHash();
                }
                if (dataLayerEnabled) {
                    dataLayer.push({
                        event: "cmp:hide",
                        eventInfo: {
                            path: "component." + getDataLayerId(item)
                        }
                    });
                }
            }
            refreshItem(item);
        }

        /**
         * Gets an item's expanded state.
         *
         * @private
         * @param {HTMLElement} item The item for checking its expanded state
         * @returns {Boolean} true if the item is expanded, false otherwise
         */
        function getItemExpanded(item) {
            return item && item.dataset && item.dataset["cmpExpanded"] !== undefined;
        }

        /**
         * Refreshes an item based on its expanded state.
         *
         * @private
         * @param {HTMLElement} item The item to refresh
         */
        function refreshItem(item) {
            var expanded = getItemExpanded(item);
            if (expanded) {
                expandItem(item);
            } else {
                collapseItem(item);
            }
        }

        /**
         * Refreshes all items based on their expanded state.
         *
         * @private
         */
        function refreshItems() {
            for (var i = 0; i < that._elements["item"].length; i++) {
                refreshItem(that._elements["item"][i]);
            }
        }

        /**
         * Returns all expanded items.
         *
         * @private
         * @returns {HTMLElement[]} The expanded items
         */
        function getExpandedItems() {
            var expandedItems = [];

            for (var i = 0; i < that._elements["item"].length; i++) {
                var item = that._elements["item"][i];
                var expanded = getItemExpanded(item);
                if (expanded) {
                    expandedItems.push(item);
                }
            }

            return expandedItems;
        }

        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as expanded
         */
        function expandItem(item) {
            var index = that._elements["item"].indexOf(item);
            if (index > -1) {
                var button = that._elements["button"][index];
                var panel = that._elements["panel"][index];
                button.classList.add(cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function() {
                    button.setAttribute("aria-expanded", true);
                }, delay);
                panel.classList.add(cssClasses.panel.expanded);
                panel.classList.remove(cssClasses.panel.hidden);
                panel.setAttribute("aria-hidden", false);
            }
        }

        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is not expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as not expanded
         */
        function collapseItem(item) {
            var index = that._elements["item"].indexOf(item);
            if (index > -1) {
                var button = that._elements["button"][index];
                var panel = that._elements["panel"][index];
                button.classList.remove(cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function() {
                    button.setAttribute("aria-expanded", false);
                }, delay);
                panel.classList.add(cssClasses.panel.hidden);
                panel.classList.remove(cssClasses.panel.expanded);
                panel.setAttribute("aria-hidden", true);
            }
        }

        /**
         * Focuses the button at the provided index.
         *
         * @private
         * @param {Number} index The index of the button to focus
         */
        function focusButton(index) {
            var button = that._elements["button"][index];
            button.focus();
        }
    }

    /**
     * Reads options data from the Accordion wrapper element, defined via {@code data-cmp-*} data attributes.
     *
     * @private
     * @param {HTMLElement} element The Accordion element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {HTMLElement} item the accordion item
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(item) {
        if (item) {
            if (item.dataset.cmpDataLayer) {
                return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
            } else {
                return item.id;
            }
        }
        return null;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Accordion components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Accordion({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Accordion({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    if (containerUtils) {
        window.addEventListener("load", containerUtils.scrollToAnchor, false);
    }

}());

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
/* global
    CQ
 */
(function() {
    "use strict";

    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined;
    if (!containerUtils) {
        // eslint-disable-next-line no-console
        console.warn("Tabs: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page.");
    }
    var dataLayerEnabled;
    var dataLayer;

    var NS = "cmp";
    var IS = "tabs";

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        active: {
            tab: "cmp-tabs__tab--active",
            tabpanel: "cmp-tabs__tabpanel--active"
        }
    };

    /**
     * Tabs Configuration
     *
     * @typedef {Object} TabsConfig Represents a Tabs configuration
     * @property {HTMLElement} element The HTMLElement representing the Tabs
     * @property {Object} options The Tabs options
     */

    /**
     * Tabs
     *
     * @class Tabs
     * @classdesc An interactive Tabs component for navigating a list of tabs
     * @param {TabsConfig} config The Tabs configuration
     */
    function Tabs(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Tabs
         *
         * @private
         * @param {TabsConfig} config The Tabs configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            cacheElements(config.element);
            that._active = getActiveIndex(that._elements["tab"]);

            if (that._elements.tabpanel) {
                refreshActive();
                bindEvents();
                scrollToDeepLinkIdInTabs();
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Tabs component
                 * - if so, route the "navigate" operation to enact a navigation of the Tabs based on index data
                 */
                CQ.CoreComponents.MESSAGE_CHANNEL = CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-tabs" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Displays the panel containing the element that corresponds to the deep link in the URI fragment
         * and scrolls the browser to this element.
         */
        function scrollToDeepLinkIdInTabs() {
            if (containerUtils) {
                var deepLinkItemIdx = containerUtils.getDeepLinkItemIdx(that, "tab", "tabpanel");
                if (deepLinkItemIdx > -1) {
                    var deepLinkItem = that._elements["tab"][deepLinkItemIdx];
                    if (deepLinkItem && that._elements["tab"][that._active].id !== deepLinkItem.id) {
                        navigateAndFocusTab(deepLinkItemIdx, true);
                    }
                    var hashId = window.location.hash.substring(1);
                    if (hashId) {
                        var hashItem = document.querySelector("[id='" + hashId + "']");
                        if (hashItem) {
                            hashItem.scrollIntoView();
                        }
                    }
                }
            }
        }

        /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        function getActiveIndex(tabs) {
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(selectors.active.tab)) {
                        return i;
                    }
                }
            }
            return 0;
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Tabs wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own tab elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Binds Tabs event handling
         *
         * @private
         */
        function bindEvents() {
            window.addEventListener("hashchange", scrollToDeepLinkIdInTabs, false);
            var tabs = that._elements["tab"];
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    (function(index) {
                        tabs[i].addEventListener("click", function(event) {
                            navigateAndFocusTab(index, true);
                        });
                        tabs[i].addEventListener("keydown", function(event) {
                            onKeyDown(event);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["tab"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusTab(index - 1, true);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusTab(index + 1, true);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusTab(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusTab(lastIndex, true);
                    break;
                default:
                    return;
            }
        }

        /**
         * Refreshes the tab markup based on the current {@code Tabs#_active} index
         *
         * @private
         */
        function refreshActive() {
            var tabpanels = that._elements["tabpanel"];
            var tabs = that._elements["tab"];

            if (tabpanels) {
                if (Array.isArray(tabpanels)) {
                    for (var i = 0; i < tabpanels.length; i++) {
                        if (i === parseInt(that._active)) {
                            tabpanels[i].classList.add(selectors.active.tabpanel);
                            tabpanels[i].removeAttribute("aria-hidden");
                            tabs[i].classList.add(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", true);
                            tabs[i].setAttribute("tabindex", "0");
                        } else {
                            tabpanels[i].classList.remove(selectors.active.tabpanel);
                            tabpanels[i].setAttribute("aria-hidden", true);
                            tabs[i].classList.remove(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", false);
                            tabs[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one tab
                    tabpanels.classList.add(selectors.active.tabpanel);
                    tabs.classList.add(selectors.active.tab);
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        function navigate(index) {
            that._active = index;
            refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         * @param {Boolean} keepHash true to keep the hash in the URL, false to update it
         */
        function navigateAndFocusTab(index, keepHash) {
            var exActive = that._active;
            if (!keepHash && containerUtils) {
                containerUtils.updateUrlHash(that, "tab", index);
            }
            navigate(index);
            focusWithoutScroll(that._elements["tab"][index]);

            if (dataLayerEnabled) {

                var activeItem = getDataLayerId(that._elements.tabpanel[index]);
                var exActiveItem = getDataLayerId(that._elements.tabpanel[exActive]);

                dataLayer.push({
                    event: "cmp:show",
                    eventInfo: {
                        path: "component." + activeItem
                    }
                });

                dataLayer.push({
                    event: "cmp:hide",
                    eventInfo: {
                        path: "component." + exActiveItem
                    }
                });

                var tabsId = that._elements.self.id;
                var uploadPayload = { component: {} };
                uploadPayload.component[tabsId] = { shownItems: [activeItem] };

                var removePayload = { component: {} };
                removePayload.component[tabsId] = { shownItems: undefined };

                dataLayer.push(removePayload);
                dataLayer.push(uploadPayload);
            }
        }
    }

    /**
     * Reads options data from the Tabs wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Tabs element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {HTMLElement} item the accordion item
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(item) {
        if (item) {
            if (item.dataset.cmpDataLayer) {
                return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
            } else {
                return item.id;
            }
        }
        return null;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Tabs components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Tabs({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Tabs({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    if (containerUtils) {
        window.addEventListener("load", containerUtils.scrollToAnchor, false);
    }

}());

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
/* global
    CQ
 */
(function() {
    "use strict";

    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined;
    if (!containerUtils) {
        // eslint-disable-next-line no-console
        console.warn("Tabs: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page.");
    }
    var dataLayerEnabled;
    var dataLayer;

    var NS = "cmp";
    var IS = "tabs";

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        active: {
            tab: "cmp-tabs__tab--active",
            tabpanel: "cmp-tabs__tabpanel--active"
        }
    };

    /**
     * Tabs Configuration
     *
     * @typedef {Object} TabsConfig Represents a Tabs configuration
     * @property {HTMLElement} element The HTMLElement representing the Tabs
     * @property {Object} options The Tabs options
     */

    /**
     * Tabs
     *
     * @class Tabs
     * @classdesc An interactive Tabs component for navigating a list of tabs
     * @param {TabsConfig} config The Tabs configuration
     */
    function Tabs(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Tabs
         *
         * @private
         * @param {TabsConfig} config The Tabs configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            cacheElements(config.element);
            that._active = getActiveIndex(that._elements["tab"]);

            if (that._elements.tabpanel) {
                refreshActive();
                bindEvents();
                scrollToDeepLinkIdInTabs();
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Tabs component
                 * - if so, route the "navigate" operation to enact a navigation of the Tabs based on index data
                 */
                CQ.CoreComponents.MESSAGE_CHANNEL = CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-tabs" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Displays the panel containing the element that corresponds to the deep link in the URI fragment
         * and scrolls the browser to this element.
         */
        function scrollToDeepLinkIdInTabs() {
            if (containerUtils) {
                var deepLinkItemIdx = containerUtils.getDeepLinkItemIdx(that, "tab", "tabpanel");
                if (deepLinkItemIdx > -1) {
                    var deepLinkItem = that._elements["tab"][deepLinkItemIdx];
                    if (deepLinkItem && that._elements["tab"][that._active].id !== deepLinkItem.id) {
                        navigateAndFocusTab(deepLinkItemIdx, true);
                    }
                    var hashId = window.location.hash.substring(1);
                    if (hashId) {
                        var hashItem = document.querySelector("[id='" + hashId + "']");
                        if (hashItem) {
                            hashItem.scrollIntoView();
                        }
                    }
                }
            }
        }

        /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        function getActiveIndex(tabs) {
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(selectors.active.tab)) {
                        return i;
                    }
                }
            }
            return 0;
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Tabs wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own tab elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Binds Tabs event handling
         *
         * @private
         */
        function bindEvents() {
            window.addEventListener("hashchange", scrollToDeepLinkIdInTabs, false);
            var tabs = that._elements["tab"];
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    (function(index) {
                        tabs[i].addEventListener("click", function(event) {
                            navigateAndFocusTab(index);
                        });
                        tabs[i].addEventListener("keydown", function(event) {
                            onKeyDown(event);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["tab"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusTab(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusTab(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusTab(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusTab(lastIndex);
                    break;
                default:
                    return;
            }
        }

        /**
         * Refreshes the tab markup based on the current {@code Tabs#_active} index
         *
         * @private
         */
        function refreshActive() {
            var tabpanels = that._elements["tabpanel"];
            var tabs = that._elements["tab"];

            if (tabpanels) {
                if (Array.isArray(tabpanels)) {
                    for (var i = 0; i < tabpanels.length; i++) {
                        if (i === parseInt(that._active)) {
                            tabpanels[i].classList.add(selectors.active.tabpanel);
                            tabpanels[i].removeAttribute("aria-hidden");
                            tabs[i].classList.add(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", true);
                            tabs[i].setAttribute("tabindex", "0");
                        } else {
                            tabpanels[i].classList.remove(selectors.active.tabpanel);
                            tabpanels[i].setAttribute("aria-hidden", true);
                            tabs[i].classList.remove(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", false);
                            tabs[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one tab
                    tabpanels.classList.add(selectors.active.tabpanel);
                    tabs.classList.add(selectors.active.tab);
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        function navigate(index) {
            that._active = index;
            refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         * @param {Boolean} keepHash true to keep the hash in the URL, false to update it
         */
        function navigateAndFocusTab(index, keepHash) {
            var exActive = that._active;
            if (!keepHash && containerUtils) {
                containerUtils.updateUrlHash(that, "tab", index);
            }
            navigate(index);
            focusWithoutScroll(that._elements["tab"][index]);

            if (dataLayerEnabled) {

                var activeItem = getDataLayerId(that._elements.tabpanel[index]);
                var exActiveItem = getDataLayerId(that._elements.tabpanel[exActive]);

                dataLayer.push({
                    event: "cmp:show",
                    eventInfo: {
                        path: "component." + activeItem
                    }
                });

                dataLayer.push({
                    event: "cmp:hide",
                    eventInfo: {
                        path: "component." + exActiveItem
                    }
                });

                var tabsId = that._elements.self.id;
                var uploadPayload = { component: {} };
                uploadPayload.component[tabsId] = { shownItems: [activeItem] };

                var removePayload = { component: {} };
                removePayload.component[tabsId] = { shownItems: undefined };

                dataLayer.push(removePayload);
                dataLayer.push(uploadPayload);
            }
        }
    }

    /**
     * Reads options data from the Tabs wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Tabs element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {HTMLElement} item the accordion item
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(item) {
        if (item) {
            if (item.dataset.cmpDataLayer) {
                return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
            } else {
                return item.id;
            }
        }
        return null;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Tabs components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Tabs({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Tabs({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    if (containerUtils) {
        window.addEventListener("load", containerUtils.scrollToAnchor, false);
    }

}());

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined;
    if (!containerUtils) {
        // eslint-disable-next-line no-console
        console.warn("Tabs: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page.");
    }
    var dataLayerEnabled;
    var dataLayer;

    var NS = "cmp";
    var IS = "carousel";

    var keyCodes = {
        SPACE: 32,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var properties = {
        /**
         * Determines whether the Carousel will automatically transition between slides
         *
         * @memberof Carousel
         * @type {Boolean}
         * @default false
         */
        "autoplay": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * Duration (in milliseconds) before automatically transitioning to the next slide
         *
         * @memberof Carousel
         * @type {Number}
         * @default 5000
         */
        "delay": {
            "default": 5000,
            "transform": function(value) {
                value = parseFloat(value);
                return !isNaN(value) ? value : null;
            }
        },
        /**
         * Determines whether automatic pause on hovering the carousel is disabled
         *
         * @memberof Carousel
         * @type {Boolean}
         * @default false
         */
        "autopauseDisabled": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        }
    };

    /**
     * Carousel Configuration
     *
     * @typedef {Object} CarouselConfig Represents a Carousel configuration
     * @property {HTMLElement} element The HTMLElement representing the Carousel
     * @property {Object} options The Carousel options
     */

    /**
     * Carousel
     *
     * @class Carousel
     * @classdesc An interactive Carousel component for navigating a list of generic items
     * @param {CarouselConfig} config The Carousel configuration
     */
    function Carousel(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Carousel
         *
         * @private
         * @param {CarouselConfig} config The Carousel configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            that._active = 0;
            that._paused = false;

            if (that._elements.item) {
                refreshActive();
                bindEvents();
                resetAutoplayInterval();
                refreshPlayPauseActions();
                scrollToDeepLinkIdInCarousel();
            }

            // TODO: This section is only relevant in edit mode and should move to the editor clientLib
            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Carousel component
                 * - if so, route the "navigate" operation to enact a navigation of the Carousel based on index data
                 */
                window.CQ = window.CQ || {};
                window.CQ.CoreComponents = window.CQ.CoreComponents || {};
                window.CQ.CoreComponents.MESSAGE_CHANNEL = window.CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                window.CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-carousel" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Displays the slide containing the element that corresponds to the deep link in the URI fragment
         * and scrolls the browser to this element.
         */
        function scrollToDeepLinkIdInCarousel() {
            if (containerUtils) {
                var deepLinkItemIdx = containerUtils.getDeepLinkItemIdx(that, "item", "item");
                if (deepLinkItemIdx > -1) {
                    var deepLinkItem = that._elements["item"][deepLinkItemIdx];
                    if (deepLinkItem && that._elements["item"][that._active].id !== deepLinkItem.id) {
                        navigateAndFocusIndicator(deepLinkItemIdx, true);
                        // pause the carousel auto-rotation
                        pause();
                    }
                    var hashId = window.location.hash.substring(1);
                    if (hashId) {
                        var hashItem = document.querySelector("[id='" + hashId + "']");
                        if (hashItem) {
                            hashItem.scrollIntoView();
                        }
                    }
                }
            }
        }

        /**
         * Caches the Carousel elements as defined via the {@code data-carousel-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Carousel wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + "Hook" + capitalized];
                if (that._elements[key]) {
                    if (!Array.isArray(that._elements[key])) {
                        var tmp = that._elements[key];
                        that._elements[key] = [tmp];
                    }
                    that._elements[key].push(hook);
                } else {
                    that._elements[key] = hook;
                }
            }
        }

        /**
         * Sets up properties for the Carousel based on the passed options.
         *
         * @private
         * @param {Object} options The Carousel options
         */
        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    var property = properties[key];
                    var value = null;

                    if (options && options[key] != null) {
                        value = options[key];

                        // transform the provided option
                        if (property && typeof property.transform === "function") {
                            value = property.transform(value);
                        }
                    }

                    if (value === null) {
                        // value still null, take the property default
                        value = properties[key]["default"];
                    }

                    that._properties[key] = value;
                }
            }
        }

        /**
         * Binds Carousel event handling
         *
         * @private
         */
        function bindEvents() {
            window.addEventListener("hashchange", scrollToDeepLinkIdInCarousel, false);
            if (that._elements["previous"]) {
                that._elements["previous"].addEventListener("click", function() {
                    var index = getPreviousIndex();
                    navigate(index);
                    if (dataLayerEnabled) {
                        dataLayer.push({
                            event: "cmp:show",
                            eventInfo: {
                                path: "component." + getDataLayerId(that._elements.item[index])
                            }
                        });
                    }
                });
            }

            if (that._elements["next"]) {
                that._elements["next"].addEventListener("click", function() {
                    var index = getNextIndex();
                    navigate(index);
                    if (dataLayerEnabled) {
                        dataLayer.push({
                            event: "cmp:show",
                            eventInfo: {
                                path: "component." + getDataLayerId(that._elements.item[index])
                            }
                        });
                    }
                });
            }

            var indicators = that._elements["indicator"];
            if (indicators) {
                for (var i = 0; i < indicators.length; i++) {
                    (function(index) {
                        indicators[i].addEventListener("click", function(event) {
                            navigateAndFocusIndicator(index);
                            // pause the carousel auto-rotation
                            pause();
                        });
                    })(i);
                }
            }

            if (that._elements["pause"]) {
                if (that._properties.autoplay) {
                    that._elements["pause"].addEventListener("click", onPauseClick);
                }
            }

            if (that._elements["play"]) {
                if (that._properties.autoplay) {
                    that._elements["play"].addEventListener("click", onPlayClick);
                }
            }

            that._elements.self.addEventListener("keydown", onKeyDown);

            if (!that._properties.autopauseDisabled) {
                that._elements.self.addEventListener("mouseenter", onMouseEnter);
                that._elements.self.addEventListener("mouseleave", onMouseLeave);
            }

            // for accessibility we pause animation when a element get focused
            var items = that._elements["item"];
            if (items) {
                for (var j = 0; j < items.length; j++) {
                    items[j].addEventListener("focusin", onMouseEnter);
                    items[j].addEventListener("focusout", onMouseLeave);
                }
            }
        }

        /**
         * Handles carousel keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["indicator"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusIndicator(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusIndicator(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusIndicator(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusIndicator(lastIndex);
                    break;
                case keyCodes.SPACE:
                    if (that._properties.autoplay && (event.target !== that._elements["previous"] && event.target !== that._elements["next"])) {
                        event.preventDefault();
                        if (!that._paused) {
                            pause();
                        } else {
                            play();
                        }
                    }
                    if (event.target === that._elements["pause"]) {
                        that._elements["play"].focus();
                    }
                    if (event.target === that._elements["play"]) {
                        that._elements["pause"].focus();
                    }
                    break;
                default:
                    return;
            }
        }

        /**
         * Handles carousel mouseenter events
         *
         * @private
         * @param {Object} event The mouseenter event
         */
        function onMouseEnter(event) {
            clearAutoplayInterval();
        }

        /**
         * Handles carousel mouseleave events
         *
         * @private
         * @param {Object} event The mouseleave event
         */
        function onMouseLeave(event) {
            resetAutoplayInterval();
        }

        /**
         * Handles pause element click events
         *
         * @private
         * @param {Object} event The click event
         */
        function onPauseClick(event) {
            pause();
            that._elements["play"].focus();
        }

        /**
         * Handles play element click events
         *
         * @private
         * @param {Object} event The click event
         */
        function onPlayClick() {
            play();
            that._elements["pause"].focus();
        }

        /**
         * Pauses the playing of the Carousel. Sets {@code Carousel#_paused} marker.
         * Only relevant when autoplay is enabled
         *
         * @private
         */
        function pause() {
            that._paused = true;
            clearAutoplayInterval();
            refreshPlayPauseActions();
        }

        /**
         * Enables the playing of the Carousel. Sets {@code Carousel#_paused} marker.
         * Only relevant when autoplay is enabled
         *
         * @private
         */
        function play() {
            that._paused = false;

            // If the Carousel is hovered, don't begin auto transitioning until the next mouse leave event
            var hovered = false;
            if (that._elements.self.parentElement) {
                hovered = that._elements.self.parentElement.querySelector(":hover") === that._elements.self;
            }
            if (that._properties.autopauseDisabled || !hovered) {
                resetAutoplayInterval();
            }

            refreshPlayPauseActions();
        }

        /**
         * Refreshes the play/pause action markup based on the {@code Carousel#_paused} state
         *
         * @private
         */
        function refreshPlayPauseActions() {
            setActionDisabled(that._elements["pause"], that._paused);
            setActionDisabled(that._elements["play"], !that._paused);
        }

        /**
         * Refreshes the item markup based on the current {@code Carousel#_active} index
         *
         * @private
         */
        function refreshActive() {
            var items = that._elements["item"];
            var indicators = that._elements["indicator"];

            if (items) {
                if (Array.isArray(items)) {
                    for (var i = 0; i < items.length; i++) {
                        if (i === parseInt(that._active)) {
                            items[i].classList.add("cmp-carousel__item--active");
                            items[i].removeAttribute("aria-hidden");
                            indicators[i].classList.add("cmp-carousel__indicator--active");
                            indicators[i].setAttribute("aria-selected", true);
                            indicators[i].setAttribute("tabindex", "0");
                        } else {
                            items[i].classList.remove("cmp-carousel__item--active");
                            items[i].setAttribute("aria-hidden", true);
                            indicators[i].classList.remove("cmp-carousel__indicator--active");
                            indicators[i].setAttribute("aria-selected", false);
                            indicators[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one item
                    items.classList.add("cmp-carousel__item--active");
                    indicators.classList.add("cmp-carousel__indicator--active");
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Retrieves the next active index, with looping
         *
         * @private
         * @returns {Number} Index of the next carousel item
         */
        function getNextIndex() {
            return that._active === (that._elements["item"].length - 1) ? 0 : that._active + 1;
        }

        /**
         * Retrieves the previous active index, with looping
         *
         * @private
         * @returns {Number} Index of the previous carousel item
         */
        function getPreviousIndex() {
            return that._active === 0 ? (that._elements["item"].length - 1) : that._active - 1;
        }

        /**
         * Navigates to the item at the provided index
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         * @param {Boolean} keepHash true to keep the hash in the URL, false to update it
         */
        function navigate(index, keepHash) {
            if (index < 0 || index > (that._elements["item"].length - 1)) {
                return;
            }

            that._active = index;
            refreshActive();

            if (!keepHash && containerUtils) {
                containerUtils.updateUrlHash(that, "item", index);
            }

            if (dataLayerEnabled) {
                var carouselId = that._elements.self.id;
                var activeItem = getDataLayerId(that._elements.item[index]);
                var updatePayload = { component: {} };
                updatePayload.component[carouselId] = { shownItems: [activeItem] };

                var removePayload = { component: {} };
                removePayload.component[carouselId] = { shownItems: undefined };

                dataLayer.push(removePayload);
                dataLayer.push(updatePayload);
            }

            // reset the autoplay transition interval following navigation, if not already hovering the carousel
            if (that._elements.self.parentElement) {
                if (that._elements.self.parentElement.querySelector(":hover") !== that._elements.self) {
                    resetAutoplayInterval();
                }
            }
        }

        /**
         * Navigates to the item at the provided index and ensures the active indicator gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         * @param {Boolean} keepHash true to keep the hash in the URL, false to update it
         */
        function navigateAndFocusIndicator(index, keepHash) {
            navigate(index, keepHash);
            focusWithoutScroll(that._elements["indicator"][index]);

            if (dataLayerEnabled) {
                dataLayer.push({
                    event: "cmp:show",
                    eventInfo: {
                        path: "component." + getDataLayerId(that._elements.item[index])
                    }
                });
            }
        }

        /**
         * Starts/resets automatic slide transition interval
         *
         * @private
         */
        function resetAutoplayInterval() {
            if (that._paused || !that._properties.autoplay) {
                return;
            }
            clearAutoplayInterval();
            that._autoplayIntervalId = window.setInterval(function() {
                if (document.visibilityState && document.hidden) {
                    return;
                }
                var indicators = that._elements["indicators"];
                if (indicators !== document.activeElement && indicators.contains(document.activeElement)) {
                    // if an indicator has focus, ensure we switch focus following navigation
                    navigateAndFocusIndicator(getNextIndex(), true);
                } else {
                    navigate(getNextIndex(), true);
                }
            }, that._properties.delay);
        }

        /**
         * Clears/pauses automatic slide transition interval
         *
         * @private
         */
        function clearAutoplayInterval() {
            window.clearInterval(that._autoplayIntervalId);
            that._autoplayIntervalId = null;
        }

        /**
         * Sets the disabled state for an action and toggles the appropriate CSS classes
         *
         * @private
         * @param {HTMLElement} action Action to disable
         * @param {Boolean} [disable] {@code true} to disable, {@code false} to enable
         */
        function setActionDisabled(action, disable) {
            if (!action) {
                return;
            }
            if (disable !== false) {
                action.disabled = true;
                action.classList.add("cmp-carousel__action--disabled");
            } else {
                action.disabled = false;
                action.classList.remove("cmp-carousel__action--disabled");
            }
        }
    }

    /**
     * Reads options data from the Carousel wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Carousel element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {HTMLElement} item the accordion item
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(item) {
        if (item) {
            if (item.dataset.cmpDataLayer) {
                return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
            } else {
                return item.id;
            }
        }
        return null;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Carousel components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Carousel({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Carousel({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
    if (containerUtils) {
        window.addEventListener("load", containerUtils.scrollToAnchor, false);
    }

}());

/*******************************************************************************
 * Copyright 2017 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
if (window.Element && !Element.prototype.closest) {
    // eslint valid-jsdoc: "off"
    Element.prototype.closest =
        function(s) {
            "use strict";
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var el      = this;
            var i;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {
                    // continue
                }
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            "use strict";
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var i       = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
                // continue
            }
            return i > -1;
        };
}

if (!Object.assign) {
    Object.assign = function(target, varArgs) { // .length of function is 2
        "use strict";
        if (target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

(function(arr) {
    "use strict";
    arr.forEach(function(item) {
        if (Object.prototype.hasOwnProperty.call(item, "remove")) {
            return;
        }
        Object.defineProperty(item, "remove", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/*******************************************************************************
 * Copyright 2016 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "image";

    var EMPTY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    var LAZY_THRESHOLD_DEFAULT = 0;
    var SRC_URI_TEMPLATE_WIDTH_VAR = "{.width}";
    var SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY = "width={width}";
    var SRC_URI_TEMPLATE_DPR_VAR = "{dpr}";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        image: '[data-cmp-hook-image="image"]',
        map: '[data-cmp-hook-image="map"]',
        area: '[data-cmp-hook-image="area"]'
    };

    var lazyLoader = {
        "cssClass": "cmp-image__image--is-loading",
        "style": {
            "height": 0,
            "padding-bottom": "" // will be replaced with % ratio
        }
    };

    var properties = {
        /**
         * An array of alternative image widths (in pixels).
         * Used to replace a {.width} variable in the src property with an optimal width if a URI template is provided.
         *
         * @memberof Image
         * @type {Number[]}
         * @default []
         */
        "widths": {
            "default": [],
            "transform": function(value) {
                var widths = [];
                value.split(",").forEach(function(item) {
                    item = parseFloat(item);
                    if (!isNaN(item)) {
                        widths.push(item);
                    }
                });
                return widths;
            }
        },
        /**
         * Indicates whether the image should be rendered lazily.
         *
         * @memberof Image
         * @type {Boolean}
         * @default false
         */
        "lazy": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * Indicates image is DynamicMedia image.
         *
         * @memberof Image
         * @type {Boolean}
         * @default false
         */
        "dmimage": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * The lazy threshold.
         * This is the number of pixels, in advance of becoming visible, when an lazy-loading image should begin
         * to load.
         *
         * @memberof Image
         * @type {Number}
         * @default 0
         */
        "lazythreshold": {
            "default": 0,
            "transform": function(value) {
                var val =  parseInt(value);
                if (isNaN(val)) {
                    return LAZY_THRESHOLD_DEFAULT;
                }
                return val;
            }
        },
        /**
         * The image source.
         *
         * Can be a simple image source, or a URI template representation that
         * can be variable expanded - useful for building an image configuration with an alternative width.
         * e.g. '/path/image.coreimg{.width}.jpeg/1506620954214.jpeg'
         *
         * @memberof Image
         * @type {String}
         */
        "src": {
            "transform": function(value) {
                return decodeURIComponent(value);
            }
        }
    };

    var devicePixelRatio = window.devicePixelRatio || 1;

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }
        return options;
    }

    function Image(config) {
        var that = this;

        var smartCrops = {};

        var useAssetDelivery = false;
        var srcUriTemplateWidthVar = SRC_URI_TEMPLATE_WIDTH_VAR;

        function init(config) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            // check if asset delivery is used
            if (config.options.src && config.options.src.indexOf(SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY) >= 0) {
                useAssetDelivery = true;
                srcUriTemplateWidthVar = SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY;
            }

            setupProperties(config.options);
            cacheElements(config.element);
            // check image is DM asset; if true try to make req=set
            if (config.options.src && Object.prototype.hasOwnProperty.call(config.options, "dmimage") && (config.options["smartcroprendition"] === "SmartCrop:Auto")) {
                smartCrops = CMP.image.dynamicMedia.getAutoSmartCrops(config.options.src);
            }

            if (!that._elements.noscript) {
                return;
            }

            that._elements.container = that._elements.link ? that._elements.link : that._elements.self;

            unwrapNoScript();

            if (that._properties.lazy) {
                addLazyLoader();
            }

            if (that._elements.map) {
                that._elements.image.addEventListener("load", onLoad);
            }

            window.addEventListener("resize", onWindowResize);
            ["focus", "click", "load", "transitionend", "animationend", "scroll"].forEach(function(name) {
                document.addEventListener(name, that.update);
            });

            that._elements.image.addEventListener("cmp-image-redraw", that.update);

            that._interSectionObserver = new IntersectionObserver(function(entries, interSectionObserver) {
                entries.forEach(function(entry) {
                    if (entry.intersectionRatio > 0) {
                        that.update();
                    }
                });
            });
            that._interSectionObserver.observe(that._elements.self);

            that.update();
        }

        function loadImage() {
            var hasWidths = (that._properties.widths && that._properties.widths.length > 0) || Object.keys(smartCrops).length > 0;
            var replacement;
            if (Object.keys(smartCrops).length > 0) {
                var optimalWidth = getOptimalWidth(Object.keys(smartCrops), false);
                replacement = smartCrops[optimalWidth];
            } else {
                replacement = hasWidths ? (that._properties.dmimage ? "" : ".") + getOptimalWidth(that._properties.widths, true) : "";
            }
            if (useAssetDelivery) {
                replacement = replacement !== "" ? ("width=" + replacement.substring(1)) : "";
            }
            var url = that._properties.src.replace(srcUriTemplateWidthVar, replacement);
            url = url.replace(SRC_URI_TEMPLATE_DPR_VAR, devicePixelRatio);

            var imgSrcAttribute = that._elements.image.getAttribute("src");

            if (url !== imgSrcAttribute) {
                if (imgSrcAttribute === null || imgSrcAttribute === EMPTY_PIXEL) {
                    that._elements.image.setAttribute("src", url);
                } else {
                    var urlTemplateParts = that._properties.src.split(srcUriTemplateWidthVar);
                    // check if image src was dynamically swapped meanwhile (e.g. by Target)
                    var isImageRefSame = imgSrcAttribute.startsWith(urlTemplateParts[0]);
                    if (isImageRefSame && urlTemplateParts.length > 1) {
                        isImageRefSame = imgSrcAttribute.endsWith(urlTemplateParts[urlTemplateParts.length - 1]);
                    }
                    if (isImageRefSame) {
                        that._elements.image.setAttribute("src", url);
                        if (!hasWidths) {
                            window.removeEventListener("scroll", that.update);
                        }
                    }
                }
            }
            if (that._lazyLoaderShowing) {
                that._elements.image.addEventListener("load", removeLazyLoader);
            }
            that._interSectionObserver.unobserve(that._elements.self);
        }

        function getOptimalWidth(widths, useDevicePixelRatio) {
            var container = that._elements.self;
            var containerWidth = container.clientWidth;
            while (containerWidth === 0 && container.parentNode) {
                container = container.parentNode;
                containerWidth = container.clientWidth;
            }

            var dpr = useDevicePixelRatio ? devicePixelRatio : 1;
            var optimalWidth = containerWidth * dpr;
            var len = widths.length;
            var key = 0;

            while ((key < len - 1) && (widths[key] < optimalWidth)) {
                key++;
            }

            return widths[key].toString();
        }

        function addLazyLoader() {
            var width = that._elements.image.getAttribute("width");
            var height = that._elements.image.getAttribute("height");

            if (width && height) {
                var ratio = (height / width) * 100;
                var styles = lazyLoader.style;

                styles["padding-bottom"] = ratio + "%";

                for (var s in styles) {
                    if (Object.prototype.hasOwnProperty.call(styles, s)) {
                        that._elements.image.style[s] = styles[s];
                    }
                }
            }
            that._elements.image.setAttribute("src", EMPTY_PIXEL);
            that._elements.image.classList.add(lazyLoader.cssClass);
            that._lazyLoaderShowing = true;
        }

        function unwrapNoScript() {
            var markup = decodeNoscript(that._elements.noscript.textContent.trim());
            var parser = new DOMParser();

            // temporary document avoids requesting the image before removing its src
            var temporaryDocument = parser.parseFromString(markup, "text/html");
            var imageElement = temporaryDocument.querySelector(selectors.image);
            imageElement.removeAttribute("src");
            that._elements.container.insertBefore(imageElement, that._elements.noscript);

            var mapElement = temporaryDocument.querySelector(selectors.map);
            if (mapElement) {
                that._elements.container.insertBefore(mapElement, that._elements.noscript);
            }

            that._elements.noscript.parentNode.removeChild(that._elements.noscript);
            if (that._elements.container.matches(selectors.image)) {
                that._elements.image = that._elements.container;
            } else {
                that._elements.image = that._elements.container.querySelector(selectors.image);
            }

            that._elements.map = that._elements.container.querySelector(selectors.map);
            that._elements.areas = that._elements.container.querySelectorAll(selectors.area);
        }

        function removeLazyLoader() {
            that._elements.image.classList.remove(lazyLoader.cssClass);
            for (var property in lazyLoader.style) {
                if (Object.prototype.hasOwnProperty.call(lazyLoader.style, property)) {
                    that._elements.image.style[property] = "";
                }
            }
            that._elements.image.removeEventListener("load", removeLazyLoader);
            that._lazyLoaderShowing = false;
        }

        function isLazyVisible() {
            if (that._elements.container.offsetParent === null) {
                return false;
            }

            var wt = window.pageYOffset;
            var wb = wt + document.documentElement.clientHeight;
            var et = that._elements.container.getBoundingClientRect().top + wt;
            var eb = et + that._elements.container.clientHeight;

            return eb >= wt - that._properties.lazythreshold && et <= wb + that._properties.lazythreshold;
        }

        function resizeAreas() {
            if (that._elements.areas && that._elements.areas.length > 0) {
                for (var i = 0; i < that._elements.areas.length; i++) {
                    var width = that._elements.image.width;
                    var height = that._elements.image.height;

                    if (width && height) {
                        var relcoords = that._elements.areas[i].dataset.cmpRelcoords;
                        if (relcoords) {
                            var relativeCoordinates = relcoords.split(",");
                            var coordinates = new Array(relativeCoordinates.length);

                            for (var j = 0; j < coordinates.length; j++) {
                                if (j % 2 === 0) {
                                    coordinates[j] = parseInt(relativeCoordinates[j] * width);
                                } else {
                                    coordinates[j] = parseInt(relativeCoordinates[j] * height);
                                }
                            }

                            that._elements.areas[i].coords = coordinates;
                        }
                    }
                }
            }
        }

        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + "Hook" + capitalized];
                that._elements[key] = hook;
            }
        }

        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    var property = properties[key];
                    if (options && options[key] != null) {
                        if (property && typeof property.transform === "function") {
                            that._properties[key] = property.transform(options[key]);
                        } else {
                            that._properties[key] = options[key];
                        }
                    } else {
                        that._properties[key] = properties[key]["default"];
                    }
                }
            }
        }

        function onWindowResize() {
            that.update();
            resizeAreas();
        }

        function onLoad() {
            resizeAreas();
        }

        that.update = function() {
            if (that._properties.lazy) {
                if (isLazyVisible()) {
                    loadImage();
                }
            } else {
                loadImage();
            }
        };

        if (config && config.element) {
            init(config);
        }
    }

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Image({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector("body");
        var observer         = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Image({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    /*
        on drag & drop of the component into a parsys, noscript's content will be escaped multiple times by the editor which creates
        the DOM for editing; the HTML parser cannot be used here due to the multiple escaping
     */
    function decodeNoscript(text) {
        text = text.replace(/&(amp;)*lt;/g, "<");
        text = text.replace(/&(amp;)*gt;/g, ">");
        return text;
    }

})();

/*******************************************************************************
 * Copyright 2017 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "search";

    var DELAY = 300; // time before fetching new results when the user is typing a search string
    var LOADING_DISPLAY_DELAY = 300; // minimum time during which the loading indicator is displayed
    var PARAM_RESULTS_OFFSET = "resultsOffset";

    var keyCodes = {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        ARROW_UP: 38,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        item: {
            self: "[data-" + NS + "-hook-" + IS + '="item"]',
            title: "[data-" + NS + "-hook-" + IS + '="itemTitle"]',
            focused: "." + NS + "-search__item--is-focused"
        }
    };

    var properties = {
        /**
         * The minimum required length of the search term before results are fetched.
         *
         * @memberof Search
         * @type {Number}
         * @default 3
         */
        minLength: {
            "default": 3,
            transform: function(value) {
                value = parseFloat(value);
                return isNaN(value) ? null : value;
            }
        },
        /**
         * The maximal number of results fetched by a search request.
         *
         * @memberof Search
         * @type {Number}
         * @default 10
         */
        resultsSize: {
            "default": 10,
            transform: function(value) {
                value = parseFloat(value);
                return isNaN(value) ? null : value;
            }
        }
    };

    var idCount = 0;

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function toggleShow(element, show) {
        if (element) {
            if (show !== false) {
                element.style.display = "block";
                element.setAttribute("aria-hidden", false);
            } else {
                element.style.display = "none";
                element.setAttribute("aria-hidden", true);
            }
        }
    }

    function serialize(form) {
        var query = [];
        if (form && form.elements) {
            for (var i = 0; i < form.elements.length; i++) {
                var node = form.elements[i];
                if (!node.disabled && node.name) {
                    var param = [node.name, encodeURIComponent(node.value)];
                    query.push(param.join("="));
                }
            }
        }
        return query.join("&");
    }

    function mark(node, regex) {
        if (!node || !regex) {
            return;
        }

        // text nodes
        if (node.nodeType === 3) {
            var nodeValue = node.nodeValue;
            var match = regex.exec(nodeValue);

            if (nodeValue && match) {
                var element = document.createElement("mark");
                element.className = NS + "-search__item-mark";
                element.appendChild(document.createTextNode(match[0]));

                var after = node.splitText(match.index);
                after.nodeValue = after.nodeValue.substring(match[0].length);
                node.parentNode.insertBefore(element, after);
            }
        } else if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++) {
                // recurse
                mark(node.childNodes[i], regex);
            }
        }
    }

    function Search(config) {
        if (config.element) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");
        }

        this._cacheElements(config.element);
        this._setupProperties(config.options);

        this._action = this._elements.form.getAttribute("action");
        this._resultsOffset = 0;
        this._hasMoreResults = true;

        this._elements.input.addEventListener("input", this._onInput.bind(this));
        this._elements.input.addEventListener("focus", this._onInput.bind(this));
        this._elements.input.addEventListener("keydown", this._onKeydown.bind(this));
        this._elements.clear.addEventListener("click", this._onClearClick.bind(this));
        document.addEventListener("click", this._onDocumentClick.bind(this));
        this._elements.results.addEventListener("scroll", this._onScroll.bind(this));

        this._makeAccessible();
    }

    Search.prototype._displayResults = function() {
        if (this._elements.input.value.length === 0) {
            toggleShow(this._elements.clear, false);
            this._cancelResults();
        } else if (this._elements.input.value.length < this._properties.minLength) {
            toggleShow(this._elements.clear, true);
        } else {
            this._updateResults();
            toggleShow(this._elements.clear, true);
        }
    };

    Search.prototype._onScroll = function(event) {
        // fetch new results when the results to be scrolled down are less than the visible results
        if (this._elements.results.scrollTop + 2 * this._elements.results.clientHeight >= this._elements.results.scrollHeight) {
            this._resultsOffset += this._properties.resultsSize;
            this._displayResults();
        }
    };

    Search.prototype._onInput = function(event) {
        var self = this;
        self._cancelResults();
        // start searching when the search term reaches the minimum length
        this._timeout = setTimeout(function() {
            self._displayResults();
        }, DELAY);
    };

    Search.prototype._onKeydown = function(event) {
        var self = this;

        switch (event.keyCode) {
            case keyCodes.TAB:
                if (self._resultsOpen()) {
                    toggleShow(self._elements.results, false);
                    self._elements.input.setAttribute("aria-expanded", "false");
                }
                break;
            case keyCodes.ENTER:
                event.preventDefault();
                if (self._resultsOpen()) {
                    var focused = self._elements.results.querySelector(selectors.item.focused);
                    if (focused) {
                        focused.click();
                    }
                }
                break;
            case keyCodes.ESCAPE:
                self._cancelResults();
                break;
            case keyCodes.ARROW_UP:
                if (self._resultsOpen()) {
                    event.preventDefault();
                    self._stepResultFocus(true);
                }
                break;
            case keyCodes.ARROW_DOWN:
                if (self._resultsOpen()) {
                    event.preventDefault();
                    self._stepResultFocus();
                } else {
                    // test the input and if necessary fetch and display the results
                    self._onInput();
                }
                break;
            default:
                return;
        }
    };

    Search.prototype._onClearClick = function(event) {
        event.preventDefault();
        this._elements.input.value = "";
        toggleShow(this._elements.clear, false);
        toggleShow(this._elements.results, false);
        this._elements.input.setAttribute("aria-expanded", "false");
    };

    Search.prototype._onDocumentClick = function(event) {
        var inputContainsTarget =  this._elements.input.contains(event.target);
        var resultsContainTarget = this._elements.results.contains(event.target);

        if (!(inputContainsTarget || resultsContainTarget)) {
            toggleShow(this._elements.results, false);
            this._elements.input.setAttribute("aria-expanded", "false");
        }
    };

    Search.prototype._resultsOpen = function() {
        return this._elements.results.style.display !== "none";
    };

    Search.prototype._makeAccessible = function() {
        var id = NS + "-search-results-" + idCount;
        this._elements.input.setAttribute("aria-owns", id);
        this._elements.results.id = id;
        idCount++;
    };

    Search.prototype._generateItems = function(data, results) {
        var self = this;

        data.forEach(function(item) {
            var el = document.createElement("span");
            el.innerHTML = self._elements.itemTemplate.innerHTML;
            el.querySelectorAll(selectors.item.title)[0].appendChild(document.createTextNode(item.title));
            el.querySelectorAll(selectors.item.self)[0].setAttribute("href", item.url);
            results.innerHTML += el.innerHTML;
        });
    };

    Search.prototype._markResults = function() {
        var nodeList = this._elements.results.querySelectorAll(selectors.item.self);
        var escapedTerm = this._elements.input.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp("(" + escapedTerm + ")", "gi");

        for (var i = this._resultsOffset - 1; i < nodeList.length; ++i) {
            var result = nodeList[i];
            mark(result, regex);
        }
    };

    Search.prototype._stepResultFocus = function(reverse) {
        var results = this._elements.results.querySelectorAll(selectors.item.self);
        var focused = this._elements.results.querySelector(selectors.item.focused);
        var newFocused;
        var index = Array.prototype.indexOf.call(results, focused);
        var focusedCssClass = NS + "-search__item--is-focused";

        if (results.length > 0) {

            if (!reverse) {
                // highlight the next result
                if (index < 0) {
                    results[0].classList.add(focusedCssClass);
                    results[0].setAttribute("aria-selected", "true");
                } else if (index + 1 < results.length) {
                    results[index].classList.remove(focusedCssClass);
                    results[index].setAttribute("aria-selected", "false");
                    results[index + 1].classList.add(focusedCssClass);
                    results[index + 1].setAttribute("aria-selected", "true");
                }

                // if the last visible result is partially hidden, scroll up until it's completely visible
                newFocused = this._elements.results.querySelector(selectors.item.focused);
                if (newFocused) {
                    var bottomHiddenHeight = newFocused.offsetTop + newFocused.offsetHeight - this._elements.results.scrollTop - this._elements.results.clientHeight;
                    if (bottomHiddenHeight > 0) {
                        this._elements.results.scrollTop += bottomHiddenHeight;
                    } else {
                        this._onScroll();
                    }
                }

            } else {
                // highlight the previous result
                if (index >= 1) {
                    results[index].classList.remove(focusedCssClass);
                    results[index].setAttribute("aria-selected", "false");
                    results[index - 1].classList.add(focusedCssClass);
                    results[index - 1].setAttribute("aria-selected", "true");
                }

                // if the first visible result is partially hidden, scroll down until it's completely visible
                newFocused = this._elements.results.querySelector(selectors.item.focused);
                if (newFocused) {
                    var topHiddenHeight = this._elements.results.scrollTop - newFocused.offsetTop;
                    if (topHiddenHeight > 0) {
                        this._elements.results.scrollTop -= topHiddenHeight;
                    }
                }
            }
        }
    };

    Search.prototype._updateResults = function() {
        var self = this;
        if (self._hasMoreResults) {
            var request = new XMLHttpRequest();
            var url = self._action + "?" + serialize(self._elements.form) + "&" + PARAM_RESULTS_OFFSET + "=" + self._resultsOffset;

            request.open("GET", url, true);
            request.onload = function() {
                // when the results are loaded: hide the loading indicator and display the search icon after a minimum period
                setTimeout(function() {
                    toggleShow(self._elements.loadingIndicator, false);
                    toggleShow(self._elements.icon, true);
                }, LOADING_DISPLAY_DELAY);
                if (request.status >= 200 && request.status < 400) {
                    // success status
                    var data = JSON.parse(request.responseText);
                    if (data.length > 0) {
                        self._generateItems(data, self._elements.results);
                        self._markResults();
                        toggleShow(self._elements.results, true);
                        self._elements.input.setAttribute("aria-expanded", "true");
                    } else {
                        self._hasMoreResults = false;
                    }
                    // the total number of results is not a multiple of the fetched results:
                    // -> we reached the end of the query
                    if (self._elements.results.querySelectorAll(selectors.item.self).length % self._properties.resultsSize > 0) {
                        self._hasMoreResults = false;
                    }
                } else {
                    // error status
                }
            };
            // when the results are loading: display the loading indicator and hide the search icon
            toggleShow(self._elements.loadingIndicator, true);
            toggleShow(self._elements.icon, false);
            request.send();
        }
    };

    Search.prototype._cancelResults = function() {
        clearTimeout(this._timeout);
        this._elements.results.scrollTop = 0;
        this._resultsOffset = 0;
        this._hasMoreResults = true;
        this._elements.results.innerHTML = "";
        this._elements.input.setAttribute("aria-expanded", "false");
    };

    Search.prototype._cacheElements = function(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            var capitalized = IS;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var key = hook.dataset[NS + "Hook" + capitalized];
            this._elements[key] = hook;
        }
    };

    Search.prototype._setupProperties = function(options) {
        this._properties = {};

        for (var key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                var property = properties[key];
                if (options && options[key] != null) {
                    if (property && typeof property.transform === "function") {
                        this._properties[key] = property.transform(options[key]);
                    } else {
                        this._properties[key] = options[key];
                    }
                } else {
                    this._properties[key] = properties[key]["default"];
                }
            }
        }
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Search({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Search({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();

/*******************************************************************************
 * Copyright 2016 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "formText";
    var IS_DASH = "form-text";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var properties = {
        /**
         * A validation message to display if there is a type mismatch between the user input and expected input.
         *
         * @type {String}
         */
        constraintMessage: "",
        /**
         * A validation message to display if no input is supplied, but input is expected for the field.
         *
         * @type {String}
         */
        requiredMessage: ""
    };

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function FormText(config) {
        if (config.element) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");
        }

        this._cacheElements(config.element);
        this._setupProperties(config.options);

        this._elements.input.addEventListener("invalid", this._onInvalid.bind(this));
        this._elements.input.addEventListener("input", this._onInput.bind(this));
    }

    FormText.prototype._onInvalid = function(event) {
        event.target.setCustomValidity("");
        if (event.target.validity.typeMismatch) {
            if (this._properties.constraintMessage) {
                event.target.setCustomValidity(this._properties.constraintMessage);
            }
        } else if (event.target.validity.valueMissing) {
            if (this._properties.requiredMessage) {
                event.target.setCustomValidity(this._properties.requiredMessage);
            }
        }
    };

    FormText.prototype._onInput = function(event) {
        event.target.setCustomValidity("");
    };

    FormText.prototype._cacheElements = function(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS_DASH + "]");
        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            var capitalized = IS;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var key = hook.dataset[NS + "Hook" + capitalized];
            this._elements[key] = hook;
        }
    };

    FormText.prototype._setupProperties = function(options) {
        this._properties = {};

        for (var key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                var property = properties[key];
                if (options && options[key] != null) {
                    if (property && typeof property.transform === "function") {
                        this._properties[key] = property.transform(options[key]);
                    } else {
                        this._properties[key] = options[key];
                    }
                } else {
                    this._properties[key] = properties[key]["default"];
                }
            }
        }
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new FormText({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new FormText({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();

;(function($, undefined) {
    var $btnScroll = $('.scrollToTop');

    $(window).scroll('scroll', function(){
        $btnScroll.toggleClass('d-none', $(this).scrollTop() <= 175)
    });

    $btnScroll.click(function() {
        window.scrollTo({top:0, behavior: "smooth"});
    });
})($ || jQuery);
; (function (siteTour, $) {

	$(document).ready(function () {
		const $tourComp = $('.cmp-mnet-sitetour');

		if ($tourComp.length < 1)
			return;

		const tours = $tourComp.toArray().map(authorPreview).map(extractTours);

		//var tour = tours[tours.length-1]; //Play the last tour.
		const tour = tours[0]; // Play the first tour.
		if (tour.isActive) {
			const { myTour } = makeSiteTour(tour);
			//console.log(siteTour);

			if(!myTour.isTourValid()) 
				return;

			if (!tour.completed)
				myTour.start();
		} else {

		}
	});


	/* Functions */

	function makeSiteTour(tour) {
		//TODO-FUTURE multiple tours on same page.
		const myTour = new SiteTour(tour.steps, {
			onExit: () => markComplete(tour),
			replayIcon: {
				display: `<i class="fa fa-question-circle" aria-hidden="true"></i>`,
				id: tour.id,
				name: tour.name,
				container: document.querySelector('.content-body')
			}
		});

		return { myTour };
	}

	function markComplete(tour) {
		const obj = { tourId: tour.id, tourName: tour.name }
		$.ajax({
			async: false,
			url: "/bin/portal/sitetour/complete",
			type: 'POST',
			data: { data: JSON.stringify(obj) },
			global: false,
			failure: function (result) {
				window.alert("Something went wrong. Please contact the help desk, or an administrator.");
			}
		}).done(function (res) {
			//console.log(res);
		});
	}

	function authorPreview(cmpTour) {
		const $steps = $(cmpTour).find('[data-tour-step-preview]');

		if(!$steps.length)
			return cmpTour;

		$steps.toArray().forEach(validateStep);

		return cmpTour;
	}

	function validateStep(step) {
		const selector = $(step.querySelector('[data-step-preview-element]')).data('step-preview-element');
		if(!selector || selector=="")
			return;
		
		try {
			const potentialElement = document.querySelector(selector);
			
			if(!potentialElement || potentialElement == null) {
				throw "Failed to find element.";
			}
		} catch (ex) {
			step.parentElement.querySelector('[data-tour-auth-error]').classList.remove('d-none');
			step.classList.add('border-danger');
		}
	}

	function extractTours(cmpTour) {
		const $el = $(cmpTour).find('[data-site-tour]');

		const tour = {
			id: $el.data('tour-id'),
			name: $el.data('tour-name'),
			isActive: $el.data('tour-isactive'),
			completed: $el.data('tour-completed'),
			steps: $el.find('[data-tour-step]').toArray().map(extractSteps)
		}

		return tour;
	}

	function extractSteps(cmpStep) {
		const $step = $(cmpStep);

		const step = {
			title: $step.data('step-header'),
			selector: $step.data('step-element'),
			body: $step.html().trim()
		};

		return step;
	}

})(window.mnet_SiteTour = window.mnet_SiteTour || {}, $ || $CQ || jQuery);
;(function(notifyBell, $, undefined) {

	if ($('#notifyLinkIcon').length) {
		$(document).on('click', '#notifyLinkIcon', function () {
	        window.location = '/content/mnet-portal/en/notifications.html';
	    });
	}

    if ($('#notifyViewAll').length) {
	    notifyToggleSetup('#notifyRecent', '.notify__list_recent', '.notify__list_older');
	    notifyToggleSetup('#notifyOlder', '.notify__list_older', '.notify__list_recent');
	
	    $(document).on('click', '#notifyViewAll', function () {
	        window.location = '/content/mnet-portal/en/notifications.html';
	    });

	    _InitializePopup();

    }

    function generateLiNone(current) {
        var message = current ? 'recent' : 'older';
        return $('<li></li>').addClass('d-flex').text('All ' + message + ' notifications have been read.');
    }
    
    function generateLiContent(subject, url, timestamp, indicator) {
        var $subject = $('<a></a>').addClass('col-8 p-0').attr('href', url).attr('target', '_self').html(subject);
        var $time = $('<span></span>').addClass('col-3 my-auto').text(timestamp);
        var $indicator = $(indicator).addClass('col-1 my-auto');
        return $('<li></li>').addClass('row pb-1').append($indicator).append($subject).append($time);
    }
    
    function _InitializePopup() {
    	var $badge = $('.badge-notify');
    	var count = $badge.attr('data-count');
    	
    	if (count == "0") {
            $(document).on('click', '#bellLink', function () {
                window.location = '/content/mnet-portal/en/notifications.html';
            });
    	} else {

        	var $bell = $('.notify__bell');
        	var $content = $('.notify__content');
	        var popoverContent = $content.clone().removeClass("sr-only").get(0);

	        var popoverTriggerList = [].slice.call(document.querySelectorAll('.notify__bell[data-bs-toggle="popover"]'))
	        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl, {
		            container: '.header',
		            html: true,
		            placement: 'bottom',
		            trigger: 'click',
		            content: popoverContent,
		            template: '<div class="popover popover--notify" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
		        });
	        })
	        
	        $bell.on('show.bs.popover', function() {
	        	if($content.data('loaded') == true)
	        		return;
	        	
	        	jQuery.ajax({
	                async: true,
	                url: '/bin/portal/notifications/bell',
	                type: 'GET',
	                data: "",
	                success: function(result) {
	                	//console.log(result);
	                	_ProcessNotifications(result);
	                },
	        		statusCode: {
	        			500: function() {
	        				console.log("Notifications Server Error. Please contact the Help Desk, if this issue continues");
	        			}
	        		}
	            }).fail(function (result) {
	            	console.log("Failed", result)
	            });
		    });
		    
		    
		    $bell.on('shown.bs.popover', function() {
		        //Default back to recent notifications on re-open
		        $('#notifyRecent').click();
		        $('.popover--notify #notifyRecent').addClass('active'); 
		    });

    	}
    }
    
    function _ProcessNotifications(data) {
        if(data.error != "")
            return;
        
    
        var $content = $('.notify__content');
        var $listRecent = $content.find('.notify__list_recent');
        var $listOlder = $content.find('.notify__list_older');
    
        var now = moment();
        var weekBefore = now.clone().subtract(7, 'days').startOf('day');
    
        $.each(data.notifications, function (i, notif) {
            var date = moment(notif.dateString);
            
            var url = '/content/mnet-portal/en/notifications.html?n=' + notif.id + '&s=' + notif.systemId; 
            
            var indicator = "";
            
            switch(notif.systemId) {
                case 1://marinenent
                    indicator = '<i class="fa fa-book d-none d-sm-inline" title="MarineNet" style="color: #000066;"></i>';
                    break;
                case 2:// library
                    indicator = '<i class="fa fa-book d-none d-sm-inline" title="Library" style="color: #000066;"></i>';
                    break;
                case 3:// mvs
                    indicator = '<i class="fa fa-video d-none d-sm-inline" title="MarineNet Video Services" style="color: #000066;"></i>';
                    break;
                case 4:// moodle
                    indicator = '<i class="fa fa-graduation-cap d-none d-sm-inline" title="Instructor-Led Courses" style="color: #000066;"></i>';
                    break;
                default: 
                    indicator = "";
                    break;
            }
            
            var $li = generateLiContent(notif.subject, url, date.from(now), indicator);
    
            if (date.isAfter(weekBefore))
                $listRecent.append($li);
            else
                $listOlder.append($li);
        });
    
        if ($listRecent.children().length == 0)
            $listRecent.append(generateLiNone(true));
    
        if ($listOlder.children().length == 0)
            $listOlder.append(generateLiNone(false));
        
        $content.data('loaded', true);
    }
    
    function notifyToggleSetup(btnId, showList, hideList) {
        $(document).on('click', btnId, function (e) {
            var $list = $(showList);
    
            if (!$list.hasClass('show')) {
                $('.notify-when-btn').removeClass('active');
                $(e.target).addClass('active');
                
                $(hideList).removeClass('show').addClass('hide');
                $list.removeClass('hide').addClass('show');
            }
    
        });
    }

})(window.mnet_NotificationBell = window.mnet_NotificationBell || {}, $ || jQuery);
;(function($) { // Closure and jQuery resolver
    "use strict"
    $(function() { // Document ready

        var NS = ".CS";
        var componentSelector = ".cmp-mnet-catalog";
        var searchControlsSelector = componentSelector + "__search-controls";
        var EVT_SEARCH = "EXECUTE_SEARCH";
        var EVT_SEARCH_SMALL_DELAY = "EXECUTE_SEARCH_SMALL_DELAY";
        var EVT_SEARCH_LONG_DELAY = "EXECUTE_SEARCH_LONG_DELAY";
        var doSearchDelayLong = 1250; // Wait this number of milliseconds before doing a search.
        var doSearchDelayShort = 750;
        var pagingDelay = 150;

        var SearchComponent = null; // Unused. Just here to give the JSDocs some context.

        var $components = $(componentSelector);
        const IS_EMBEDDED = typeof $components.data('isembedded') !== 'undefined'; //If we have this property, we are embedded
        const MODIFY_URL = typeof $components.data('preventurlmodify') === 'undefined'; //If we don't have this property, modify our url.
        const IS_VIEW_ORG = typeof $components.data('orgid') !== 'undefined'; //If we have this property, we are viewing an org specific catalog.

        if ($('.contentcatalog').length === 0) return;

        // Get all the template markup
        $components.each(function() {
            var templates = {};
            $(this)
                .find('script[type*="template/"]')
                    .each(function() {
                        var $this = $(this);
                        var templateName = $this.attr("type").split("/")[1];
                        var $template = $($this.remove().html()).removeClass("d-none");
                        templates[templateName] = $template;
                    })
                    .end()
                .data("templates", templates);
        });

        // Hook up events

        // If there's only one catalog component, hook up the scroll loader
        if ($components.length === 1) {
            var lastScrollTop = 0;

            // Debounce the call to the pager to it doesn't fire needlessly hundreds of times.
            //Works if component is in the main document.
            $(window).on("scroll" + NS, _.debounce(function(e) {
                var st = $(this).scrollTop();
                // Check the direction of the scroll. Only execute the paging call if we are
                // scrolling down the page.
                if (st > lastScrollTop) {
                    _executePaging.call($components);
                }
                lastScrollTop = st;
            }, pagingDelay));

            //Works for external components, long as they pass their caller.
            $(window).on("scroll-external" + NS, _.debounce(function(e, addditonalData) {
                var st = $(addditonalData.el).scrollTop();
                // Check the direction of the scroll. Only execute the paging call if we are
                // scrolling down the page.
                if (st > lastScrollTop) {
                    _executePaging.call($components);
                }
                lastScrollTop = st;
            }, pagingDelay));
        }



        var popoverWhiteList = $.fn.tooltip.Constructor.Default.allowList;

        popoverWhiteList.button = ['data-action'];
        // Enable any popovers
        $components.find('[data-bs-toggle="popover"]')
            .filter('[data-action="reset"]').each(function() {
                $(this).popover({
                    placement: "bottom",
                    html: true,
                    container: $(this).closest(searchControlsSelector),
                    title: "<small>Are you sure?</small>",
                    content: '<div class="btn-group" role="group" aria-label="Confirm search reset">\n' +
                        '  <button data-action="do-reset" type="button" class="btn btn-primary btn-sm">Okay</button>\n' +
                        '  <button data-action="cancel-reset" type="button" class="btn btn-secondary btn-sm">Cancel</button>\n' +
                        '</div>',
                    whiteList: popoverWhiteList
                });
            })
            .on("shown.bs.popover", function(e) {
                $("body").on("click" + NS, function(e) {
                    if ($(e.target).closest(".popover").length === 0) {
                        $(this).find('.popover.show').popover('hide');
                    }
                })
            })
            .on("hide.bs.popover", function(e) {
                $("body").off("click" + NS);
            })
            .end()
            .not('[data-action="reset"]').popover();


        // Pay attention to keypress and clicks on the search controls
        // and register the debounced custom search event.
        $(searchControlsSelector)
            .on("keypress" + NS, searchControlsSelector + "__input", _handleTextSearch)
            .on("click" + NS, searchControlsSelector + "__input :submit", _handleTextSearch)
            .on("change" + NS, searchControlsSelector + "__content-types :checkbox", _handleContentTypeSelection)
            .on("change" + NS, ":checkbox", function(e) {
                // Have we clicked on a checkbox? It'll be a filter option.
                // Make sure all the related checkboxes to this one are properly
                // updated, etc.
                var name = _handleCheckBoxes.call(this);
                if (name) {

                    // We switched content type.
                    if (name === "type") {
                        var $ct = $(e.delegateTarget).find(':checkbox[name="type"]:checked');
                        // If the content type has been switched to something that's not "all", clear the filters
                        // (which updates the pills then executes a search),then jump out.
                        if ($ct.length > 1 || ($ct.length === 1 && $ct.val() !== "all")) {
                            _clearFilters.call(e.delegateTarget, e);
                            return;
                        }
                    }
                    // There was a change in the checkboxes (the name identifies what was changed),
                    // update the selected filter pills. If the change was a content type switch
                    // or a sorting, don't bother updating the filter pills. They won't change.
                    if (name !== "type" && name !== "sort") _updateActiveFilterPills.call(this);

                    // Then trigger the search. This is debounced, so the checkbox change event
                    // might be fired again before an actual search is done.
                    if (name === "type" || name === "sort") {
                        $(this).trigger(EVT_SEARCH_SMALL_DELAY, name);
                    } else {
                        $(this).trigger(EVT_SEARCH_LONG_DELAY, name);
                    }
                }
            })
            .on("click" + NS, ".btn.toggle-filter", function(e) {
                // We clicked a Toggle Filter button
                // Make sure all the related checkboxes to this button
                // are properly updated, etc.
                var type = $(this).attr("data-type");
                var key = $(this).attr("data-key");
                var name = $(this).attr("data-name");
                var value = $(this).val();

                if (type === "advanced-filter") {
                    var selector = searchControlsSelector + " input[type='checkbox'][data-type='" + type + "'][data-key='" + key + "'][name='" + name + "'][value='" + value + "']";
                    var $target = $(selector);
                    $target.prop("checked", !$target.prop("checked")).trigger("change");
                }
            })
            .on("click" + NS, '[data-action="do-reset"],[data-action="cancel-reset"]', _resetSearch)
            .on("click" + NS, '[data-action="clear-filters"]', _clearFilters)
            .on("click" + NS, '[data-action="remove-filter"]', _removeFilter)
            .on("click" + NS, '.dropdown-menu', function(e) { e.stopPropagation() })
            .on(EVT_SEARCH_LONG_DELAY + NS, _.debounce(_doSearch, doSearchDelayLong))
            .on(EVT_SEARCH_SMALL_DELAY + NS, _.debounce(_doSearch, doSearchDelayShort))
            .on(EVT_SEARCH + NS, _doSearch)
            .on(EVT_SEARCH + '-external'+ NS, function (e){
                //Trigger search on Org Catalog loaded.
                e.stopPropagation();
                _initialSearch.call($(this).closest(componentSelector))
            })
            .each(function() {
                if(!IS_EMBEDDED) //Don't auto search if we're embedded
                    _initialSearch.call($(this).closest(componentSelector));
            })

        /**
         * Clears all keywords, selected categories/filters, content types, and sort
         * @callback
         * @private
         */
        function _resetSearch(e) { //TODO FIX... Tim thinks it's bugged.
            //console.debug("_resetSearch()");

            e && e.preventDefault() & e.stopImmediatePropagation();

            var $link = $(e.currentTarget);
            var action = $link.data("action");

            if (action === "cancel-reset") {
                var $popover = $link.closest(".popover");
                //$popover.popover('hide');
                $('.cmp-mnet-catalog__search-controls [data-action="reset"]').click();
                return;
            }

            var $cmp = $(this);

            var queryString = location.search || "";

            if (queryString.startsWith("?"))  queryString = queryString.substr(1);

            var newPairs = [];

            queryString.split("&").forEach(function(pair, i, arr) {
                if (["sterms", "contentTypes", "sort", "isACE", "isCEU",
                    "isRRC", "isProctored", "isAnnualTraining", "isPME", "mvsMedia", "filters"].indexOf(pair.split("=")[0]) === -1) {
                    newPairs.push(pair);
                }
            });

            var newQueryString = newPairs.length > 0 ? "?" + newPairs.join("&") : "";
            var newHref = location.pathname + newQueryString;

            if (newHref === location.pathname + location.search) {
                if(!IS_EMBEDDED)
                    location.reload();
                else
                    _initialSearch.call($cmp, $(this).closest(componentSelector));
            } else {
                location.href = location.pathname + newQueryString;
            }

        }

        /**
         * Perform an initial search pulling data out of the query string as the parameters
         * @this SearchComponent
         * @private
         */
        function _initialSearch() {
            //console.debug("_initialSearch()");
            var $cmp = $(this);

            var obj = {};
            obj.advanceFilters = {isACE: null, isCEU: null, isRRC: null, isProctored: null, isAudioOnly: null, isAnnualTraining: null, isPME: null};

            if(MODIFY_URL) {
                function getParam(name) {
                    var url = window.location.href;
                    name = name.replace(/[\[\]]/g, '\\$&');
                    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                        results = regex.exec(url);
                    if (!results) return null;
                    if (!results[2]) return '';
                    return decodeURIComponent(results[2].replace(/\+/g, ' '));
                }
    
                //The initial filters set by dialog.
                var sterms = getParam("sterms");
                var contentTypes = getParam("contentTypes");
                var sort = parseInt(getParam("sort"));
                var filter = getParam('filters');
                var isACE = parseInt(getParam("isACE"));
                var isCEU = parseInt(getParam("isCEU"));
                var isRRC = parseInt(getParam("isRRC"));
                var isProctored = parseInt(getParam("isProctored"));
                var isAnnualTraining = parseInt(getParam("isAnnualTraining"));
                var mvsMedia = parseInt(getParam("mvsMedia"));
                var isPME = parseInt(getParam("isPME"));
                
    
                if (contentTypes) {
                    obj.contentTypes = contentTypes.split(",");
                    obj.contentTypes.forEach(function(val, x, arr) {
                        arr[x] = parseInt(val) ? "1" : "0";
                    });
                }
    
                //var obj = {contentTypes: _getContentTypes.call($cmp)};
    
                if(!isNaN(sort))
                    obj.sort = sort;
    
                if(filter && filter !== "")
                    obj.filters = filter.split(",");
    
                if(!isNaN(isACE))
                    obj.advanceFilters.isACE = isACE;
                if(!isNaN(isCEU))
                    obj.advanceFilters.isCEU = isCEU;
                if(!isNaN(isRRC))
                    obj.advanceFilters.isRRC = isRRC;
                if(!isNaN(isProctored))
                    obj.advanceFilters.isProctored = isProctored;
                if(!isNaN(isAnnualTraining))
                    obj.advanceFilters.isAnnualTraining = isAnnualTraining;
                if(!isNaN(mvsMedia))
                    obj.advanceFilters.isAudioOnly = mvsMedia;
                if(!isNaN(isPME))
                    obj.advanceFilters.isPME = isPME;
    
                if (sterms)
                    obj.searchTerms = decodeURIComponent(sterms);

                if(IS_VIEW_ORG)
                    obj.orgId = $cmp.data('orgid');
            }            

            _executeQuery.call($cmp, "init=1&searchResult=" + encodeURIComponent(JSON.stringify(obj)));
        }

        /**
         * Handles when text is entered
         * @callback
         * @param e
         * @private
         */
        function _handleTextSearch(e) {
            //console.debug("_handleTextSearch()", e);

            // Handle the entered text is this is an event callback and we pressed enter,
            // or this was called without an event.
            if (e && (e.type === "click" || e.which === 13) || !e) {

                var $searchControls = $(this).closest(searchControlsSelector);
                var $textbox = $searchControls.find('[type="search"]');

                e && e.preventDefault();

                var previousValue = $textbox.data("previousValue");
                var currentValue = $textbox.val().trim();

                // If this is a new text search, or something else was previously entered,
                // reset the sort to Most Relevant
                if (currentValue && (!previousValue || (previousValue !== currentValue))) {
                    var $cmp = $textbox.closest(componentSelector);

                    $cmp.find('.dropdown-item[data-type="relevance"]')
                        .toggleClass("d-none", currentValue === "")
                        .find(":checkbox")
                            .attr("disabled", currentValue === "")
                            .prop("checked", currentValue !== "")
                }

                e && $textbox
                        .data("previousValue", currentValue)
                        .trigger(EVT_SEARCH, "text"); // Execute the search immediately
            }
        }

        /**
         * Handles the selection of the content type.
         * @callback
         * @param e
         * @private
         */
        function _handleContentTypeSelection(e) {
            //console.debug("_handleContentType(e)", e);
            e && e.stopImmediatePropagation();

            var $checkbox = $(this);
            var $dropdown = $checkbox.closest(".dropdown-menu");
            var $cmp = $dropdown.closest(componentSelector);
            var $everyCheckbox = $dropdown.find(":checkbox");
            var $otherCheckboxes = $everyCheckbox.not(this);
            var checkboxVal = $checkbox.val();
            var $allCheckbox = $everyCheckbox.filter('[value="all"]');

            $cmp.data("search-canceled", true);

            if (checkboxVal === "all") { // We clicked the "All" content type
                // It doesn't matter whether the "all" checkbox was checked or unchecked, the action is the same:
                // a) Uncheck all other checkboxes
                // b) Check the "all" checkbox.
                $otherCheckboxes.prop("checked", false);
                $checkbox.prop("checked", true);
            } else { // We clicked a checkbox other than "all"
                // First, uncheck "all" (it might not be checked). We might be re-checking it again later.
                $allCheckbox.prop("checked", false);
                // If nothing is selected, check "all".
                if ($everyCheckbox.filter(":checked").length === 0) {
                    $allCheckbox.prop("checked", true);
                }
            }

            $cmp.data("search-canceled", false);

            // Trigger a search only if this callback was triggered as an event.
            e && $(this).trigger(EVT_SEARCH_LONG_DELAY, "type");

        }

        /**
         * Makes sure checkboxes act like radio buttons (or not) and records whether anything has changed.
         * @returns {boolean|*}
         * @this SearchComponent
         * @private
         */
        function _handleCheckBoxes() {
            //console.debug("_handleCheckBoxes()");

            var $checkbox = $(this); // The clicked check box
            var $dropdownItem = $checkbox.closest(".dropdown-item");
            var $dropdownMenu = $checkbox.closest(".dropdown-menu");
            var $dropdown = $dropdownItem.closest(".dropdown"); // Currently, the dropdown is how these are contained
            var $selectionGroup = $checkbox.closest("[data-selection-group]");
            var name = $checkbox.attr("name"); // The check box's name
            var isCategoryFilter = $dropdown.closest('[data-type="category-filter"]').length > 0;
            var isMulti = $checkbox.attr("data-multi") === "true";
            var isDefault = $checkbox.attr("data-default") === "true";
            var isChecked = $checkbox.prop("checked");
            var isSelectionGroupParent = $checkbox.attr("data-selection-group-parent") === "true";
            var $boxes = $selectionGroup.length ?
                            $selectionGroup.find(':checkbox[name="' + name + '"]')
                                :
                            $dropdown.find(':checkbox[name="' + name + '"]'); // All check boxes with the same name
            var $otherBoxes = $boxes.not($checkbox.get(0)); // All the check boxes with the same name, excluding this one
            var $dropdownButton = $("#" + $dropdownMenu.attr("aria-labelledby"));

            /*console.debug("-----------------------------------");
            console.debug("name", name);
            console.debug("isMulti", isMulti);
            console.debug("isDefault", isDefault);
            console.debug("isChecked", isChecked);
            console.debug("checkbox", this);
            console.debug("has selection group", $selectionGroup.length > 0);
            console.debug("-----------------------------------");*/

            // Store what the previous value was before this possible change.
            $dropdown.data("previousValue", $dropdown.data("currentValue"));

            // If this checkbox is inside a selection group, the rules change a little.
            if ($selectionGroup.length) {
                // The clicked item is inside a selection group and it is checked.
                // $boxes are all the items inside the selection group including the clicked one.
                // $otherBoxes are all the boxes inside the selection group excluding the clicked one.
                if (isChecked) {
                    // If this checkbox wants to be the only selected item, or this is the selection
                    // group parent (basically the checkbox in a group which is the "parent"), uncheck
                    // all the other boxes inside the selection group.
                    if (!isMulti || isSelectionGroupParent) {
                        $otherBoxes
                            .filter('[name="' + name + '"]')
                            .prop("checked", false);
                    }
                    // Uncheck selection group parents
                    var $startParent = !isSelectionGroupParent ? $dropdownItem : $dropdownItem.parent();
                    $startParent.parentsUntil('[data-type="category-filter"]').each(function () {
                        $(this).find(':checkbox[data-selection-group-parent]').first()
                            .filter('[name="' + name + '"]')
                            .prop("checked", false);
                    });
                }
            // If this checkbox wants to be the only one selected, uncheck the others
            } else if (!isMulti) {
                $otherBoxes
                    //.filter('[data-multi!="true"]')
                    .filter('[name="' + name + '"]')
                        .prop("checked", false);
            } else {
            // This checkbox doesn't want to be the only one selected, but we still
            // need to uncheck the ones that do
                $otherBoxes
                    .filter('[name="' + name + '"][data-multi="false"]')
                        .prop("checked", false);
            }

            // If this checkbox has been unchecked we need to inspect whether it's the default option
            if (!isChecked) {
                // Is this checkbox the default option?
                if (isDefault) {
                    // ... recheck it
                    $checkbox.prop("checked", true);
                } else if (!isMulti) {
                    // This is not the default item nor is it an item that can have multiple items selected.
                    // Find the default item and check it. It's usually the first one.
                    $otherBoxes.filter('[data-default="true"]:not([disabled])').first().prop("checked", true);
                }
            }

            var checkedValues = $dropdown.find(":checkbox").serialize();

            var buttonLabel = $dropdownButton.length &&
                                $dropdown.find(":checkbox:checked[data-button-label]").attr("data-button-label");

            if (buttonLabel) $dropdownButton.find("span").html(buttonLabel);

            $dropdown
                .data("currentValue", checkedValues)
                .data("changed", $dropdown.data("previousValue") !== checkedValues);

            return $dropdown.data("changed") === true && name;

        }

        /**
         * Remove a selected filter.
         * @callback
         * @param e - Event from the handler
         * @private
         */
        function _removeFilter(e) {
            //console.debug("_removeFilter()");
            e.preventDefault();

            var $searchControls = $(this).closest(searchControlsSelector);
            var $pill = $(this).closest('[data-type="active-filter-option"]');
            if ($pill.length === 0) {
                //console.warn("No active filter option found.");
                return;
            }
            var name = $pill.attr("data-filter");
            var value = $pill.attr("data-filter-option");
            var $checkbox = $(this).closest(searchControlsSelector)
                .find(':checkbox[name="' +name + '"][value="' + value + '"]:checked');
            var found = $checkbox.length > 0;
            var invalid = $pill.attr("data-invalid"); // We're removing an invalid filter.

            $pill.fadeOut(250, function() {
                $(this).remove();
                if (found) {
                    $checkbox.prop("checked", false);
                    _handleCheckBoxes.call($checkbox);
                }
                if (found || invalid ) {
                    $searchControls.trigger(EVT_SEARCH);
                }
            });
        }

        /**
         * Clear all selected filters.
         * @callback
         * @param e
         * @private
         */
        function _clearFilters(e) {
            //console.debug("_clearFilters()");
            e.preventDefault();
            $(this)
                .closest(componentSelector)
                .find(".cmp-mnet-catalog__filters :checkbox:checked")
                .prop("checked", false);
            _updateActiveFilterPills.call(this, true);
            $(this).trigger(EVT_SEARCH);
        }

        /**
         * Update the pills to match selected filters
         * @this SearchComponent
         * @private
         */
        function _updateActiveFilterPills(wipe) {
            //console.debug("_updateActiveFilterPills()");

            //TODO: Look into NOT unilaterally cleaning up pills for which there is no existing category filter.
            //      This is to handle those use cases where a category filter is selected, then a keyword search
            //      is applied, removing the category as a selectable filter. It's not obvious what's happened.
            //      Maybe mark the active, but useless, pill as being no longer relevant.
            var $this = $(this);
            var $component = $this.closest(componentSelector);
            var $searchControls = $component.find(searchControlsSelector);
            var $pillZone = $searchControls.find('[data-zone="active-filter-options"]');
            var templates = $component.data("templates");

            // Chances are, a filter was selected (as opposed to deselected) so we'll
            // always get the template to create a new pill even if we wind up not using it
            if (!templates) {
                console.error("No templates available to create filter pills.");
                return;
            }
            var $template = templates["active-filter-option"];

            if (!$template) {
                console.error("No template available for the filter pill.");
                return;
            }

            // Get the selected filters
            var $selectedFilterOptions = $searchControls.find('[data-zone="filters"] :checkbox:checked');

            // Do two passes. The first pass will remove any pills that don't match what's selected.
            // The second pass will add new pills that are missing.

            // Pass #1 - remove pills.
            // If there are no selected filter options, and "wipe" is true,
            // then just remove 'em all in one sweep.
            if ($selectedFilterOptions.length === 0 && wipe) {
                $pillZone.find('[data-type="active-filter-option"]').remove();
            } else {
                // First, look for any "invalid" pills. These would be category filters from a previous
                // search that were absent but had been used in the search prior to the previous. This
                // new search means they've moved on, but chose to not clear the invalid pill(s). We'll
                // do it for them.
                $pillZone.find('[data-type="active-filter-option"][data-invalid]')
                    .remove();
                // Second, run through the pills again and see if there are any ones to mark as invalid
                // or remove (dependent on the "wipe" argument).
                $pillZone.find('[data-type="active-filter-option"]').each(function() {
                    var $pill = $(this);
                    var filterName = $pill.attr("data-filter");
                    var filterValue = $pill.attr("data-filter-option");
                    if ($selectedFilterOptions
                            .filter('[name="' + filterName + '"][value="' + filterValue + '"]').length === 0) {
                        if (wipe) {
                            $pill.remove();
                        } else {
                            // A pill is here that's not part of the selected options. This might be a remnant
                            // from a previous search that now means this category filter is invalid. The user
                            // also probably got back zero results.
                            // Mark the pull as invalid.
                            $pill
                                .attr("data-invalid", true)
                                .addClass("badge-pill--invalid");
                        }
                    }

                });
            }

            // Pass #2 - add new pills
            $selectedFilterOptions.each(function() {
                var $checkbox = $(this);
                if ($pillZone
                        .find(
                            '[data-type="active-filter-option"][data-filter="' + $checkbox.attr("name") + '"][data-filter-option="' + $checkbox.val() + '"]'
                        ).length === 0) {

                    var $newPill = $template.clone();
                    
                    
                    
                    //Ken: APPSCAN - can this line be .text instead
                    //Tim: This just returns text, making it .text.
                    $newPill.attr({
                                "data-filter": $checkbox.attr("name"),
                                "data-filter-option": $checkbox.attr("value")
                            })
                            .find('[data-property="filter-option-title"]')
                                .text(
                                    $checkbox.attr("data-pill-title") ||
                                    $checkbox.next('[data-property="filter-option-title"]').html() ||
                                    $checkbox.closest("label")
                                        .next('[data-property="filter-option-title"]').html());
                    
                    $pillZone.append($newPill);

                }
            });

            if ($pillZone.children('[data-type="active-filter-option"]').length >  0) {
                $pillZone.parent().attr("style", "");
            } else {
                $pillZone.parent().attr("style", "display:none !important");
            }

        }

        /**
         * Perform a search. Collects input from the Search Component.
         * @callback
         * @param e - The event passed from the caller
         * @param type - Extra info about the type of search being performed
         * @private
         */
        function _doSearch(e, type) {
            //console.debug("_doSearch", e, "type", type);

            var $search = $(this).closest(searchControlsSelector);
            var $cmp = $search.closest(".cmp-mnet-catalog");

            if ($cmp.data("search-canceled")) {
                //console.debug("Search was canceled");
                $cmp.data("search-canceled", false);
                return;
            }

            var filterOrSortFlag = ['sort', 'ace', 'ceu', 'rrc', 'proctored', 'mvs-type'];
            var searchQuery = "";
            var searchTerms = ($search.find(':input[name="terms"]').val() || "").trim();
            var sortVal = _getSortValue.call($search);
            var advancedFilterObj = _getAdvancedFilters.call($search);
            var categoryFilterObj = _getCategoryFilters.call($search);
            var contentTypeObj = _getContentTypes.call($search);

            var obj = {};

            if (searchTerms || type === "text") {
                obj["searchTerms"] = searchTerms;
            }

            if (sortVal) {
                if (sortVal === "2" && !searchTerms) {
                    sortVal = "0";
                }
                obj['sort'] = sortVal;
            }

            if (advancedFilterObj) {
                obj['advanceFilters'] = advancedFilterObj;
            }

            if (categoryFilterObj) {
                obj['filters'] = categoryFilterObj;
            }

            if (contentTypeObj) {
                obj["contentTypes"] = contentTypeObj;
            }

            if (filterOrSortFlag.indexOf(type) === -1) {
                searchQuery = "init=1&";
            }

            if(IS_VIEW_ORG)
                obj.orgId = $cmp.data('orgid');
            
            searchQuery += "searchResult=" + encodeURIComponent(JSON.stringify(obj));

            _executeQuery.call($cmp, searchQuery);

        }

        function _getSortValue() {
            var $search = $(this);
            return $search.find(':checkbox[name="sort"]:checked').first().val();
        }

        /**
         * Retrieves the selected content type(s) from the Search Component.
         * @this SearchComponent
         * @returns {Array} - An array of 0 and 1s
         * @private
         */
        function _getContentTypes() {
            //console.debug("_getContentTypes()");

            var $search = $(this);
            var order = ["mnet", "moodle", "mvs", "library"];
            var all = $search.find(':checkbox[name="type"][value="all"]:checked').length > 0;

            return $.map(order, function(name) {
                return $search.find(':checkbox[name="type"][value="' + name + '"]' + (!all ? ":checked" : "")).length ? "1" : "0";
            });

        }

        /**
         * Sets the selected content types in the Search Component based on the passed array. Usually
         * done after a search and the UI is refreshing.
         * @this SearchComponent
         * @param selectedTypes
         * @private
         */
        function _setContentTypes(selectedTypes) {
            //console.debug("_setContentTypes()", selectedTypes);

            var $search = $(this);

            if (!selectedTypes || !Array.isArray(selectedTypes) || selectedTypes.length < 4) {
                selectedTypes = [1, 1, 1, 1];
            }

            var order = ["mnet", "moodle", "mvs", "library"];

            $search.find(':checkbox[name="type"]').prop("checked", false);

            order.forEach(function(name, x) {
                if (selectedTypes[x] === 1) {
                    $search.find(':checkbox[name="type"][value="' + name + '"]').prop("checked", true);
                }
            });

            var $allContentType = $search.find(':checkbox[name="type"][value="all"]');
            var $allContentTypes = $search.find(':checkbox[name="type"][value!="all"]');
            var optionCount = $allContentTypes.length;
            var $selectedContentTypes = $allContentTypes.filter(":checked");
            var selectedOptionCount = $selectedContentTypes.length;

            if (optionCount === selectedOptionCount) {
                $allContentType.prop("checked", true);
                $allContentTypes.prop("checked", false);
            }

            var $dropdownMenu = $allContentType.closest(".dropdown-menu");
            var $dropdownButton = $("#" + $dropdownMenu.attr("aria-labelledby"));
            var buttonLabelArr = [];

            if ($allContentType.prop("checked")) {
                buttonLabelArr.push($allContentType.attr("data-button-label") || "All");
            } else {
                $selectedContentTypes.each(function() {
                    buttonLabelArr.push($(this).attr("data-button-label"));
                });
            }

            if (buttonLabelArr.length === 0) buttonLabelArr = ["All"];

            
            //Ken: APPSCAN - can this line be .text instead
            //Tim: This just returns text, making it .text.
            $dropdownButton.find("span").text(buttonLabelArr.sort().join(", "));
        }

        /**
         * Retrieves the selected "advanced" filters in an array.
         * @this SearchComponent
         * @returns {Object|null}
         * @private
         */
        function _getAdvancedFilters() {
            //console.debug("_getAdvancedFilters()");

            var $search = $(this);
            var obj = {};

            $search.find('[data-type="advanced-filter"]:checkbox:checked').each(function() {
                obj[$(this).attr("data-key") || $(this).attr("name")] = Number($(this).val());
            });

            if ($.isEmptyObject(obj)) return null;

            return obj;
        }

        /**
         * Retrieves the selected category filters in an array.
         * @this SearchComponent
         * @returns {null|Array}
         * @private
         */
        function _getCategoryFilters() {
            //console.debug("_getCategoryFilters()");

            var $search = $(this);
            var obj = [];

            $search.find('[data-type="category-filter"] :checkbox:checked').each(function() {
                obj.push($(this).val());
            });

            if (obj.length == 0) return null;

            return obj;
        }

        /**
         * Loads more content when the user scrolls to the bottom of a page.
         * @callback
         * @this SearchComponent
         * @private
         */
        function _executePaging() {
            //console.debug("_executePaging()");

            var $cmp = $(this);
            var $pagingLoader = $cmp.find(".paging-loader");

            if ($cmp.data("active-paging")) {
                //console.debug("Paging still active");
                return;
            }

            if (_isScrolledIntoView($pagingLoader.get(0))) {

                var $contentArea = $cmp.find("#displayContent");

                if ($contentArea.find("li").length < $cmp.data("total")) {

                    $pagingLoader.removeClass("invisible").fadeIn("fast");

                    var page = Number($contentArea.attr('data-page'));
                    var obj = {
                        pageNum: page + 1,
                        sort: _getSortValue.call($cmp)
                    };

                    $contentArea.attr('data-page', page + 1);
                    $cmp.data("active-paging", true);

                    var searchQuery = "searchResult=" + JSON.stringify(obj);

                    _executeQuery.call($cmp, searchQuery, function(data) {
                        $contentArea.append(data.catItems);
                        _updateCount.call($cmp, data);
                        $pagingLoader.addClass("invisible");
                        $cmp.data("active-paging", false);
                    }, true);
                }
            }
        }

        /**
         * Starts the Ajax query that initiates a catalog search.
         * @this SearchComponent
         * @param data - The search parameters including terms, categories, sort order, etc.
         * @param handler - An optional alternate handler to call after the Ajax query successfully completes.
         * @private
         */
        function _executeQuery(data, handler, paging) {
            //console.debug("_executeQuery()");

            var $cmp = $(this);

            //Note: replacing '+' literal with the unicoded value so that it's not replaced with a space by urlencoder.
            data = "cmpPath=" + $cmp.data("resource-path") + "&" + data.replace('+', '%2B');
            //console.log(data);

            if (!paging) $(".catalog-loading-overlay", $cmp).LoadingOverlay("show");

            jQuery.ajax({
                type: "POST",
                url: '/bin/portal/catalog/search',
                data: data,
                success: handler,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: "json"
            }).done(function(data) {
                // Second success call. Update query string and refresh the UI based off data
                // we received from the query.
                //console.debug("Search query finished", data);

                if(data.status) {
                    var showNone = data.total === 0;
                    var sterms = data.term;
                    var sort = data.sort;
                    var contentTypes = data.contentTypes && Array.isArray(data.contentTypes) && data.contentTypes.join(",");
                    var filter = data.filters.join(',');

                    var isACE = data.isACE;
                    var isCEU = data.isCEU;
                    var isRRC = data.isRRC;
                    var isProctored = data.isProctored;
                    var isAnnualTraining = data.isAnnualTraining;
                    var isPME = data.isPME;
                    var mvsMedia = data.isAudioOnly;

                    if (!handler) {
                        $cmp.data("total", data.total || 0);

                        $("#displayNoResults", $cmp).toggle(showNone);

                        //Ken: APPSCAN - can this line be .text instead
                        //Tim: This uses actual html returned from the Serlvet, representing the Catalog's Items markup. Needs to be .html() currently.
                        $("#displayContent", $cmp)
                            .attr("data-page", 1)
                            .html(data.catItems);

                        //Toggle visibility of Sort By: Relevant cause does not always show.
                        $cmp.find('.dropdown-item[data-type="relevance"]')
                            .toggleClass("d-none", data.term === "")
                            .find(":checkbox").attr("disabled", data.term === "");

                        //We're allowed to modify the url.
                        if(MODIFY_URL) {
                            const updatedUrl = new URL(location);
                            updatedUrl.search = '';

                            updatedUrl.searchParams.set('from', 'aem');

                            //TODO - Need to find parameters we want to keep for things like OrgId... 
                            
                            var regAuthorTest = /\bwcmmode=disabled;*\b/;
                            if (location.href.match(regAuthorTest)) {
                                updatedUrl.searchParams.set('wcmmode', 'disabled');
                            }
    
                            if (sterms !== "")
                                updatedUrl.searchParams.set('sterms', encodeURIComponent(sterms));
                            
                            if (sort !== 0)
                                updatedUrl.searchParams.set('sort', encodeURIComponent(sort));
                            
                            if (contentTypes)
                                updatedUrl.searchParams.set('contentTypes', decodeURIComponent(contentTypes));
                            
                            if (filter !== "")
                                updatedUrl.searchParams.set('filters', encodeURIComponent(filter));
                            
                            if (isACE >= 0)
                                updatedUrl.searchParams.set('isACE', encodeURIComponent(isACE));
                            if (isCEU >= 0)
                                updatedUrl.searchParams.set('isCEU', encodeURIComponent(isCEU));
                            if (isRRC >= 0)
                                updatedUrl.searchParams.set('isRRC', encodeURIComponent(isRRC));
                            if (isProctored >= 0)
                                updatedUrl.searchParams.set('isProctored', encodeURIComponent(isProctored));
                            if (isAnnualTraining >=0)
                                updatedUrl.searchParams.set('isAnnualTraining', encodeURIComponent(isAnnualTraining));
                            if (mvsMedia >= 0)
                                updatedUrl.searchParams.set('mvsMedia', encodeURIComponent(mvsMedia));
                            if (isPME >=0)
                                updatedUrl.searchParams.set('isPME', encodeURIComponent(isPME));
    
                            history.pushState(null, 'MarineNet Catalog', updatedUrl);
                        }                        

                        _refreshUI.call($cmp, data);
                    } else {
                        //console.log("alternate handler");
                    }

                    //We successfully updated, passing the displayResults to external calls for processing.
                    if(IS_EMBEDDED)
                        $(document).trigger('catalogContentResExternal', [{displayResults: $("#displayContent", $cmp), paging}]);
                } else {
                    console.warn("Bad status?", data);
                    $cmp.data("active-paging", false);
                }
            }).fail(function(result) {
                window.alert("Something went wrong with catalog. Please contact the help desk, or an administrator.");
            }).always(function() {
                if (!paging) $(".catalog-loading-overlay", $cmp).LoadingOverlay("hide");
            })
        }

        /**
         * Refresh the UI after a search.
         * Updates the selected content types, search terms, sort order, and filters.
         * @this SearchComponent
         * @param data - The JSON data retrieved from _executeQuery()
         * @private
         */
        function _refreshUI(data) {
            //console.debug("_refreshUI()");

            var $cmp = $(this);
            var $searchControls = $cmp.find(searchControlsSelector);

            // Update the total and current load count
            _updateCount.call($cmp, data);

            // Update the search controls
            $searchControls.find('[type="search"][name="terms"]').val(data.term || "");
            $searchControls.find(':checkbox[name="sort"]').prop("checked", false)
                .filter('[value="' + (data.sort || 0) + '"]').prop("checked", true);

            _setContentTypes.call($searchControls, data.contentTypes);

            // Update the advanced filters
            ["isACE", "isCEU", "isRRC", "isAudioOnly", "isProctored", "isAnnualTraining", "isPME"].forEach(function(key) {
                _handleCheckBoxes.call(
                    $searchControls.find(':checkbox[data-type="advanced-filter"][data-key="' + key + '"]').prop("checked", false)
                        .filter('[value="' + data[key] + '"]').prop("checked", true)
                );
            });

            // Rebuild the category filters
            if (data.catCategories != null) {
                _buildCategories.call($cmp, data);
            }

            // Update whether any filters pills should be showing.
            _updateActiveFilterPills.call($cmp);

        }

        /**
         * Update the paging / total count info
         * @this CatalogSearch
         * @param {Object} data - The data object retrieved from the catalog servlet
         * @private
         */
        function _updateCount(data) {
            var $cmp = $(this);

            $cmp.find(".cmp-mnet-catalog__count__total").text(data.status && data.total || "0");
            $cmp.find(".cmp-mnet-catalog__count__current")
                .text(data.status && $cmp.find(".cmp-mnet-catalog__items .card").length || "0");
        }

        /**
         * Builds the category filters
         * @this CatalogSearch
         * @param {Object} data - The data object retrieved from the catalog servlet
         * @private
         */
        function _buildCategories(data) {
            //console.debug("_buildCategories()", data);

            var $cmp = $(this);
            var $searchControls = $cmp.find(searchControlsSelector);
            var $filterZone = $searchControls.find('[data-zone="filters"]');
            var categoryData = data.catCategories;
            var selectedFilters = data.filters;
            var templates = $cmp.data("templates");
            var $template = templates["category"];

            if (categoryData == null || categoryData.length === 0) {
                $filterZone.find('[data-type="category-filter"]').remove();
                return;
            }

            if ($template == null || $template.length === 0) {
                return;
            }

            var $collection = $([]);
            var template = $template.get(0).outerHTML;

            var isSingleLevel = false;
            var isMultiLevel = false;

            if (data.catCategories.length === 1) {
                data.catCategories[0].Categories.forEach(function (subcat) {
                    if (subcat['Categories'] != null &&
                        Array.isArray(subcat['Categories']) && subcat['Categories'].length > 0) {
                        isMultiLevel = true;
                    } else {
                        isSingleLevel = true;
                    }
                });
                //console.log("isSingleLevel", isSingleLevel, "isMultiLevel", isMultiLevel);
            } else {
                // There are multiple root categories. Sort them.
                _sortCategoryData(data.catCategories);
            }

            if (data.catCategories.length > 1 || (isSingleLevel && !isMultiLevel)) {
            // There are multiple root categories back which means we're looking at more than one
            // (and probably all) content types OR we're looking at a single content type which has
            // sent back a single category with single-depth subcats. We render this just like we would
            // multiple root categories (except there's one of them).
            // Show drop downs for each category and array the inner items in a tree-like fashion.
                data.catCategories.forEach(function(catData) {
                    var $category = $(template
                                        .replaceAll("%root_name%",
                                            data.catCategories.length > 1 ? catData.Name : 'Categories')
                                        .replaceAll("%root_id%", catData.Id));
                    var $dropdownMenu = $category.find(".dropdown-menu");
                    var dropdownItemTpl = $dropdownMenu.find(".dropdown-item").remove().get(0).outerHTML;

                    if (data.catCategories.length > 1) {
                        var $item = $(
                            dropdownItemTpl
                                .replaceAll("%path%", catData.Id + ":" + catData.Id + ":" + catData.Proxy)
                                .replaceAll("%name%", "All"))
                            .find(":checkbox").attr({
                                "data-multi": "false",
                                "data-pill-title": catData.Name,
                                "data-selection-group-parent": "true"
                            }).end();
                        $dropdownMenu.append($item);
                        $dropdownMenu.append('<div class="dropdown-divider"></div>');
                    }
                    _sortCategoryData(catData.Categories);
                    $dropdownMenu.append(_gatherItems(catData.Categories, catData.Id, 0, dropdownItemTpl));

                    $collection = $collection.add($category);
                });
            } else {
            // One root category has come through and it's not single depth.
                var rootCat = data.catCategories[0];

                if (isMultiLevel && isSingleLevel) {
                    // There are both single- and multi-depth subcats. Move all the single depths into
                    // a new fake category.
                    var fakeCat = {
                        Id: 0,
                        Name: "Categories",
                        SortOrder: -1,
                        ItemCount: 0,
                        Categories: [],
                        fake: true
                    }
                    for (var x=rootCat.Categories.length-1;x>=0;x--) {
                        var catData = rootCat.Categories[x];
                        if (catData['Categories'] == null ||
                            (Array.isArray(catData['Categories']) && catData['Categories'].length ===0)) {
                            fakeCat.Categories.push(rootCat.Categories.splice(x, 1)[0]);
                        }
                    }
                    rootCat.Categories.push(fakeCat);
                }

                _sortCategoryData(rootCat.Categories);

                rootCat.Categories.forEach(function(catData) {
                    var $category = $(template
                        .replaceAll("%root_name%", catData.Name)
                        .replaceAll("%root_id%", rootCat.Id + ":" + catData.Id));
                    var $dropdownMenu = $category.find(".dropdown-menu");
                    var dropdownItemTpl = $dropdownMenu.find(".dropdown-item").remove().get(0).outerHTML;

                    if (catData.fake === 'undefined' || !catData.fake) {
                        var $item = $(
                            dropdownItemTpl
                                .replaceAll("%path%", rootCat.Id + ":" + catData.Id + ":" + catData.Proxy)
                                .replaceAll("%name%", "All"))
                            .find(":checkbox").attr({
                                "data-multi": "false",
                                "data-pill-title": catData.Name,
                                "data-selection-group-parent": "true"
                            }).end();
                        $dropdownMenu.append($item);
                        $dropdownMenu.append('<div class="dropdown-divider"></div>');
                    }
                    $dropdownMenu.append(_gatherItems(catData.Categories, rootCat.Id, 0, dropdownItemTpl));

                    $collection = $collection.add($category);
                });
            }

            // build toggle filters
            $template = templates["toggle"];
            template = $template.get(0).outerHTML;
            var $togData = $([]);
			// Annual Training Toggle
            $togData = $togData.add({ Name: "Annual Training", Id: "annualtraining", Key: "isAnnualTraining", Value: "1" });
            $togData = $togData.add({ Name: "PME", Id: "pme", Key: "isPME", Value: "1" });
            for (var i = 0; i < $togData.length; i++) {
                var togStyle = data[$togData[i].Key] === 1 ? "btn-success" : "";
				var $toggle = $(template
					.replaceAll("%root_name%", $togData[i].Name)
					.replaceAll("%root_id%", $togData[i].Id)
                    .replaceAll("%root_key%", $togData[i].Key)
                    .replaceAll("%root_value%", $togData[i].Value)
                    .replaceAll("%btn_style%", togStyle)
                    .replaceAll("%d-none%", 'd-none'));

                $collection = $collection.add($toggle);
            }


            $filterZone
                .find('[data-type="category-filter"]')
                    .remove();
            $filterZone
                .find('[data-type="toggle-filter"]')
                    .remove();
            $filterZone
                .append($collection);

            if (data.filters != null && Array.isArray(data.filters) && data.filters.length > 0) {
                data.filters.forEach(function(filterVal) {
                    $filterZone.find(':checkbox[value="' + filterVal + '"]').prop("checked", true);
                })
            }

            // Recursively gather the items to appear in a category drop down.
            function _gatherItems(categories, rootId, level, tpl) {
                var $list = $([]);
                if (categories == null) return $list;
                var theLevel = ((level + 1) * 10) + "px";

                _sortCategoryData(categories);

                categories.forEach(function(cat) {
                    var $item = $(
                        tpl.replaceAll("%path%", rootId + ":" + cat.Id + ":" + cat.Proxy).replaceAll("%name%", cat.Name)
                    ).find("label").css("padding-left", theLevel).end();

                    if (cat.Categories != null && cat.Categories.length > 0) {
                        var $group = $('<div data-selection-group />');

                        $item.find(":checkbox").attr({"data-multi": "true", "data-selection-group-parent": "true"});
                        $group.append($item);

                        $group.append(_gatherItems(cat.Categories, rootId, level + 1, tpl));

                        $list = $list.add($group);
                    } else {
                        $list = $list.add($item);
                    }

                });

                return $list;
            }
        }

        /**
         * Sorts the category data retrieved from the Catalog Servlet
         * @param categories
         * @private
         */
        function _sortCategoryData(categories) {
            //console.debug("_sortCategoryData()");

            if (categories && Array.isArray(categories) && categories.length > 1) {
                categories.sort(_comparo);
            }

            function _comparo(a, b) {
                var sortOrderA = parseInt(a.SortOrder) || 0;
                var sortOrderB = parseInt(b.SortOrder) || 0;

                if (sortOrderA === sortOrderB) {
                    var titleA = (a.Name || "zzzz").toLowerCase().trim();
                    var titleB = (b.Name || "zzzz").toLowerCase().trim();
                    //console.log("Title sort: " + titleA + " --- " + titleB);
                    return titleA.localeCompare(titleB);
                } else {
                    //console.log("Sort order: " + a.Name + "(" + sortOrderA + ") --- " + b.Name + "(" + sortOrderB + ")");
                    return sortOrderA > sortOrderB ? 1 : -1;
                }
            }
        }

        function _isScrolledIntoView(elem)
        {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
    });
})($ || jQuery);

/**
	Execute Search.
*/

(function() {
    $(document).on('keypress', '#ctl00_txtSearch', function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
        	siteSearch();
        }
    });
	
	$(document).on('click', '#ctl00_btnSearch', siteSearch);
	
	function siteSearch() {
		var strSrchBx = encodeURIComponent(document.getElementById('ctl00_txtSearch').value);		
        var url = "/content/mnet-portal/en/catalog.html?sterms=" + strSrchBx + "&from=aem";
        
        window.location.href = url;
	}
})();
/** Scroll to help panel */

(function($, undefined) {
    function scroll() {
        // The panel id is within the hash for the page.
        const panelId = window.location.hash;

        if(panelId != "") {
            // The panel itself.
            const $panel = $('.cmp-helpcenterpanel > ' + panelId + ' > .collapse');
            // Overall card.
            const $card = $panel.parent();


            if($panel.length) {
                // Get the header height, or default to 60 (it should be 60).
                const headerHeight = $('#student > .header .fixed-top').outerHeight() || 60;
                // Add some padding to the top.
                const customOffset = -10;
                // Get our current location on the page.
                const panelY = $card.offset().top;

                // The location we want to scroll to.
                const targetY = panelY - headerHeight + customOffset;

                // Scroll to the card
                $('html, body').animate({ scrollTop: targetY }, 'smooth', function() {
                    // After we scroll, open the panel.
                    new bootstrap.Collapse($panel[0], {toggle: true})
                });
            }
        }

        // If another hashlink is clicked on the same page, repeat the process.
        $(window).one('hashchange', function () {
            scroll();
        });
    }

    scroll();
})(jQuery || $);
/**
	Add additional styling to helpComponents
*/

(function() {
	$('.cmp-helppage table, .cmp-faqpage table').addClass("table table-bordered table-sm table-striped");
    $('.cmp-helppage table td, .cmp-faqpage table td').addClass("align-middle");
})();
/**
	Add additional styling to help video components
*/

(function() {
	$('[data-video-info]').each(function () {
	    var $container = $(this);
	    if($container.find('video').length)
	        return;
	    var data = JSON.parse($container.attr('data-video-info'));
	    $('<video></video>').attr('src', data.src).attr('width', data.w).attr('height', data.h).attr('controls', 'controls').attr('class', 'mnet-rte-video').appendTo($container);
	});
})();
/**
	Keep session Alive Script.
*/

//moved to sessionTimeoutRedirect.js
(function() {
 $.ajaxSetup({ cache: false });

 //Auto adjusting copyright year.
 var copyDate = (new Date()).getFullYear();
 if(copyDate && !Number.isNaN(copyDate))
	 $('#mnet-footer_copy_date').text((new Date()).getFullYear());
})();

(function() {

    function handleReload(path, script) {
        const $iframe = $(path);
        if($iframe.length == 0)
            return;
        
        $iframe.on('load', function() {
            script($iframe, $iframe[0].src, $iframe.contents());
        })
    }

    function clickReload($iframe, url, $doc) {
        $doc.on('click', '.tyMessage a', function(e) {
            e.preventDefault();
            $iframe[0].src = url;
        });
    }

    /** Reload Notification Setting Form */
    handleReload('iframe[data-form-page-path="/content/forms/af/marinenet-portal/notifications/notification-settings"]', function($iframe, url, $doc) {
        clickReload($iframe, url, $doc);

        //On submission being pressed: wait x amount of time, then check message.
        $doc.find('button.submit').click(function () {
            setTimeout(function() {
                var $myBody = $doc.find("body");
                const myText = $myBody[0].innerText;

                var testagainst = 'Thank you for submitting';
                //if we have a thank you, reset the url.
                if (myText.startsWith(testagainst)) {
                    setTimeout(function() {
                        $iframe[0].src = url;
                    }, 1250);
                }
            }, 1250);
        });
    });

    /** Reload File Upload Form */
    handleReload('iframe[data-form-page-path="/content/forms/af/marinenet-portal/library/library-item-form"]', function($iframe, url, $doc) {
        clickReload($iframe, url, $doc)
    });

})();

(function() {  
    $(document).ready(function () {
        //Quick patch for tab header...
        var $li = $('.cmp-tabs--mnet_header_tabs .cmp-tabs__tab');
        if($li.length != 0) {
            $.each($li, function() {
                var $i = $(this);
                var $h2 = $('<h2>').text($i.text());
                $i.html($h2);
            })
            //var text = $li.text();
        }
    });
})();
;(function($,undefinded){
    $(document).on('show.bs.popover show.bs.dropdown', '.ecosystemstatus, .notify__bell, #tblLoggedIn', function () {
        $('.popover--notify, .popover--ecosystemstatus').removeClass('show');
        $('#dropdownMenuLink').dropdown('hide');
    });
})(jQuery||$)
;(function(pendingactionsIcon, $, undefined) {



})(window.mnet_PendingActionsIcon = window.mnet_PendingActionsIcon || {}, $ || jQuery);
;(function($,undefinded){
	
	var lastActivity = new Date();
	var expireMilliseconds = 59 * 60 * 1000; //59 minutes
	var timeoutTimer = setTimeout(checkTimeout, expireMilliseconds);

	//determines if the session has timed out.  Checks agains SessionCheckerHandler.ashx.  
	//If its timed out, redirect to logout.else, reset timer to check agian
	function checkTimeout() {

	    // the marinenet endpoint to session checker - returns session expiration time
	    var url = document.getElementById('sessionCheckUrl').value + "?u=" + uuidv4();
	
	    try {
	        jQuery.ajax({
	            type: 'GET',
	            url: url,
	            data: null,
	            dataType: 'text',
	            contentType: 'application/x-www-form-urlencoded',
	            xhrFields: { withCredentials: true },
	            success: function (res) {
	                //console.log(res);                
	                var timeoutTime;
	                try {
	                    timeoutTime = new Date(Date.parse(res));
	                } catch (e) {
	                }
	                if (timeoutTime instanceof Date && !isNaN(timeoutTime)) {
	                    var currentDate = new Date();
	                    var timeDiff = timeoutTime.getTime() - currentDate.getTime();
	                    if (timeDiff <= 60000) {
	                        //less than a minute or already expired -- logout
	                        window.location.href = document.timerform.redirectedUrl.value;
	                    } else {
	                        clearTimeout(timeoutTimer); //kill timer
	                        timeoutTimer = setTimeout(checkTimeout, timeDiff); //reset to try again at current expiration
	                    }
	                } else {
	                    console.log('checkTimeout - not a date: ' + res);
	                    //timeoutTime not real - try again in 5 mins
	                    clearTimeout(timeoutTimer); //kill timer
	                    timeoutTimer = setTimeout(checkTimeout, 5 * 60 * 1000); //reset to 5 mins          
	                }
	            },
	            error: function (xhr, status, errorThrown) {
	                //console.log(xhr);
	                console.log(status);
	                console.log(errorThrown);
	            }
	        });
	    } catch (err) {
	        console.log(err);
	    }
	}
	
	function uuidv4() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	        return v.toString(16);
	    });
	}
	
	
	
	
    //anytime the user is active set lastActivity
    jQuery('body').bind('mousemove mousedown keyup touchstart scroll', function (event) {
        lastActivity = new Date();
    });


    function setHeartbeat() {
        setTimeout(heartbeat, 5 * 60 * 1000); // every 5 min
    }

    function heartbeat() {
		//We're not logged in and so have no heatbeat.
		if(document.getElementById('heatbeatUrl') === null)
			return;
		
        var url = document.getElementById('heatbeatUrl').value + "?u=" + uuidv4(); // the marinenet endpoint to refresh handler

        //console.log('last activity: ' + lastActivity);
        var currentDate = new Date();
        //console.log('current date: ' + currentDate);
        var timeDiff = currentDate.getTime() - lastActivity.getTime(); // This will give difference in milliseconds
        //console.log('time diff: ' + timeDiff);
        var diffInMinutes = Math.floor(timeDiff / 60000);
        //console.log('min diff: ' + diffInMinutes);

        if (diffInMinutes < 5) {
            //user is active w/in last 5 minutes so call heartbeat to keep session alive
            try {
                jQuery.ajax({
                    type: 'GET',
                    url: url,
                    data: null,
                    dataType: 'text',
                    contentType: 'application/x-www-form-urlencoded',
                    xhrFields: { withCredentials: true },
                    success: function (res) {
                        //console.log(res); //We don't need to print the results on sucess.. at least locally.
                        clearTimeout(timeoutTimer); //kill timer
                        timeoutTimer = setTimeout(checkTimeout, expireMilliseconds); //reset timer to 59 mins
                        setHeartbeat();
                    },
                    error: function (xhr, status, errorThrown) {
                        //console.log(xhr);
                        //console.log(status); //TODO re-enable
                        //console.log(errorThrown); //typically blank
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

    }



    heartbeat(); // initialize heatbeat
	
	
	
	
	
		
})(jQuery||$)
;(function ($, undefinded) {
	//We're logged in do nothing.
	if (document.getElementById("heatbeatUrl") !== null) return;

	function login(force = false) {
		const loc = encodeURIComponent(window.location.pathname + window.location.search);
		$.ajax({
			url: '/bin/portal/session/login',
			type:"POST",
			data: {data: loc, force},
			dataType: 'json',
			async: false,
			xhrFields: { withCredentials: true }
		}).then(function(result) {
			//console.log(result, result.url);
			window.location.href = result.url;
		}).catch(function (error, _, _) {
			//console.log(error);
		});
	}

	//Login Button pressed, force us to login
	$(document).on('click', '#session_login', function() {
		login(true);
	});

})($ || jQuery);

;(function($) {
    "use strict"

    $(function() {

        $('.ecosystemstatus')
            .each(function() { _Provision.call(this); })
            .on("show.bs.popover", ".btn", function(e) { $(this).data("popover", true); })
            .on("hide.bs.popover", ".btn", function(e) { $(this).removeData("popover"); })

    });

    function _Hide() {
        $(this)
            .children(".btn")
                .popover("dispose")
                .removeData("popover")
            .end()
            .removeClass("show")
    }

    function _Provision(data) {
        //console.log("_Provision()", data);

        var $ecosystemStatus = $(this);
        var $content = $ecosystemStatus.find(".ecosystemstatus__content");
        var $services = $content.find(".ecosystemstatus__services");
        var $outages = $content.find(".ecosystemstatus__upcomingoutages");

        if (data == null) {

            if (($services.find("ul>li").length || $outages.find("ul>li").length) > 0) {
                data = {
                    "enabled": true,
                    "prefilled": true,
                    "services": true,
                    "upcomingOutages": true
                };
            }

        }


        if (!data || !data.enabled || (!data.services && !data.upcomingOutages)) {
            //console.log("Nothing to show. Hide the ecosystem status stuff.");

            _Hide.call($ecosystemStatus);

        } else if (data.enabled) {
            //console.log("Provision the ecosystem status");

            if (data.lastModified) {
                var lastModified = new Date(data.lastModified);

                if (!$ecosystemStatus.data("lastModified")) {
                    //console.log("No last modified date");
                    $ecosystemStatus.data("lastModified", lastModified);
                } else if (lastModified.toString() == $ecosystemStatus.data("lastModified").toString()) {
                    if ($ecosystemStatus.hasClass("show")) return;
                } else {
                    //console.log("There's a change.", lastModified, $ecosystemStatus.data("lastModified"));
                    $ecosystemStatus.data("lastModified", lastModified);
                }
            }

            if (!data.prefilled) {

                $services.find("ul").remove();
                $outages.find("ul").remove();

                if (data.services && data.services.length) {
                    var $ul = $('<ul class="d-table w-100" />');

                    $.map(data.services, function (service, idx) {
                        $('<li class="d-table-row ecosystemstatus__service" />')
                            .append(
                                $('<span class="d-table-cell pe-3 w-50 ecosystemstatus__service__name"></span>')
                                    .text(service.name)
                            )
                            .append(
                                $('<span class="ml-auto ecosystemstatus__service__status"></span>')
                                    .append(
                                        service.status.toLowerCase() == 'up' ?
                                            '<i class="fas fa-angle-double-up" aria-hidden="true"></i>' :
                                            '<i class="fas fa-angle-double-down" aria-hidden="true"></i>'
                                    )
                                    .append("&nbsp;" + service.status)
                            )
                            .addClass("ecosystemstatus__service--" + service.status)
                            .appendTo($ul);
                    });
                    $services
                        .append($ul)
                        .removeClass("d-none");
                } else {
                    $services.addClass("d-none");
                }

                if (data.upcomingOutages && data.upcomingOutages.length) {

                    var $ul = $('<ul class="d-table w-100" />');

                    $.map(data.upcomingOutages, function (outage, idx) {
                        var start = moment(outage.start);
                        var end = moment(outage.end);
                        var isSameDay = start.isSame(end, 'day');

                        var $li = $('<li class="d-table-row ecosystemstatus__outage" />')
                            .append($('<span class="d-table-cell pe-3 ecosystemstatus__outage__text"></span>')
                                .text(outage.text));

                        $li.append(
                            $('<span class="d-table-cell text-nowrap ecosystemstatus__outage__start-end"></span>')
                                .text(
                                    start.format('MMM Do YYYY, HH:mm') + " to " +
                                    (isSameDay ? end.format('HH:mm') : end.format('MMM Do YYYY, HH:mm'))
                                )
                        ).appendTo($ul);
                    });
                    $outages
                        .append($ul)
                        .removeClass("d-none");
                } else {
                    $outages.addClass("d-none");
                }

            }/* else {
                console.log("Prefilled!");
            }*/

            var popoverContent = $content.clone().removeClass("sr-only").get(0);
            var $btn = $ecosystemStatus.children('.btn-link');

            $btn
                .popover('dispose')
                .popover({
                    container: '.header',
                    html: true,
                    placement: 'bottom',
                    trigger: 'click',
                    content: popoverContent,
                    template: '<div class="popover popover--ecosystemstatus" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
                }) && $btn.data("popover") && $btn.popover("show");
            
            // Hide the popover initially on mobile view.
            $btn.on('inserted.bs.popover', function() {
                const popoverId= $(this).attr('aria-describedby');
                
                if (popoverId && window.innerWidth <= 992) {
                    const $popover = $('#' + popoverId);
                    $popover.css('visibility', 'hidden');
                }
            });

            // Show the popover and ensure it's centered on mobile view.
            $btn.on('shown.bs.popover', function() {
                const popoverId = $(this).attr('aria-describedby');
                
                if (popoverId && window.innerWidth <= 992) {
                    const $popover = $('#' + popoverId);
        
                    const windowHeight = window.innerHeight;
                    const popoverHeight = $popover.outerHeight();
                    const topPosition = (windowHeight / 2) - (popoverHeight / 2);
                    const leftPosition = '50%';
        
                    $popover.css({
                        top: topPosition + 'px',
                        left: leftPosition,
                        transform: `translateX(-50%)`,
                        visibility: 'visible'
                    });

                    $popover.toggleClass('position-fixed')
                }
            });

            // Ensure the popover disappeares when not being interacted with on mobile view.
            $(document).on('click', function(event) {
                if(!$(event.target).closest('.btn-link', '.popover').length) {
                    $btn.popover("hide");
                }
            });

            $ecosystemStatus
                .addClass("show");

        }
    }

})($ || jQuery);
;(function($) {
    "use strict"

    $(function() {

        $('.article-listing')
            .on("click", ".dropdown--sort .dropdown-item", function(e) {
                var $this = $(this);
                var $dropdown = $this.closest('.dropdown');
                var $articleListing = $dropdown.closest('.article-listing');
                var path = $dropdown.data("path");
                var q = $(this).attr("href").split("?");

                if (!q.length || q.length === 1) {
                    return true;
                } else {
                    e.preventDefault();
                    path += "?" + q[1];
                    var $div = $('<div />').load(
                        path,
                        function(r, s, x) {
                            if (status !== "error") {
                                var $contents = $div.unwrap();
                                $articleListing
                                    .empty()
                                    .append($contents.children());
                            }
                        }
                    );
                }
            });
    });

})($ || jQuery);
(function() {
    $(document).ready(function() {
		//Workaround for custom logo header on the tabs. Actual Solution extends tab component, to make it a configurable option. This just manipulates some dom-elements with a custom policy as a P.O.C

		var tabs = $('.cmp-tabs--coi .cmp-tabs');

        if(tabs.length != 0) {
            var headers = tabs.find('.cmp-tabs__tab');
            var bodies = tabs.find('.cmp-tabs__tabpanel');
            
            bodies.each(function (i, el) {
                var imgWrapper = $(el).find('div.image.coi-tab-header');
                var img = imgWrapper.find('.cmp-image__image');
                var title = imgWrapper.find('.cmp-image__title');
            
                var header = $(headers[i]);
                if(imgWrapper.length != 0) {
                    header.html("");
                }
            
                header.addClass("coi-tab-header");
                header.append(img, title);
            
                imgWrapper.remove();
            });
        }

    });
})();
﻿jQuery(function ($) {
    
    //footer stuff
    var $footerBtn = $(".footer_expander_btn");

    $footerBtn.click(function () {

        $(".footer_content").toggleClass("footer_content--show");
        window.scrollTo(0, document.body.scrollHeight);
    });
    
    /* Chevron up/down for panels */
    $(".page-toggle-link").click(function () {
        $(this).find(".chev").toggleClass("fa-chevron-up fa-chevron-down");
    });
    /* end Chevron up/down for panels */

    $("a.profileMenu").click(function() {       
        var $drop = $("div.profile_drop");       
        if ($drop) {       
            var height = $(window).height() - 60;       
            //console.log($(window).height());       
            $drop.css("max-height", height + "px");       
        }       
    });
        
});

jQuery(function () {
    jQuery("img[alt],[title]").tooltip({

        content: function () {
            var element = jQuery(this);
            if (element.is("[title]")) {
                if (element.attr("title").length)
                    return element.attr("title")
                else {
                    return element.attr("alt");
                }
            }
            if (element.is("[img]")) {
                return element.attr("alt");
            }
        }
    });

});

﻿//the purpose of this function is to allow the enter key to 
//point to the correct button to click.
function doEnterKeyClick(buttonName,e)
{
    var key;

    if(window.event)
        key = window.event.keyCode;     //IE
    else
        key = e.which;     //firefox
   
    if (key == 13)
    {
        //Get the button the user wants to have clicked
        var btn = document.getElementById(buttonName);
        if (btn != null)
        { //If we find the button click it
            btn.click();
            event.keyCode = 0
        }
    }
}

/**
 * DHTML date validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
// Declaring valid date character, minimum year and maximum year
var dtCh= "/";
var minYear=1900;
var maxYear=2100;

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary (year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
   } 
   return this
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12)
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)
	var strMonth=dtStr.substring(0,pos1)
	var strDay=dtStr.substring(pos1+1,pos2)
	var strYear=dtStr.substring(pos2+1)
	strYr=strYear
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		return false
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		return false
	}
return true
}

function ValidateDate(dateField){
	var dt=dateField;
	if (dt.value != "")
	{
	    if (isDate(dt.value)==false)
	    {
            var lblDate = document.getElementById("lblDateFormat");
            lblDate.className = "red";
		    return false
	    }
	}
    var lblDate = document.getElementById("lblDateFormat");
    lblDate.className = "";
    return true
 }
 
 function contentStandardChangeConfirmation(ddl){
    var txtDefaultValue = document.getElementById(ddl.id.replace(/ddList/,"txtList"));
    var answer = confirm("Changing the standard can adversely affect course launching.\nDo you want to continue with this change?");
    if (!answer)
        ddl.selectedIndex = txtDefaultValue.value;
    else
        txtDefaultValue.value = ddl.selectedIndex;
}


﻿//jQuery(document).ready(function () {

//    jQuery(window).resize(function () {
//        fixFooter();
//    });
//    fixFooter();


//});

//function fixFooter() {
//    var windowHeight = jQuery(window).height();
//    var contentHeight = jQuery(".content-body").outerHeight(true);
//    var navHeight = jQuery(".navbar-nav").outerHeight(true) + jQuery(".sidemenu_spacer").outerHeight(true);
//    var footerHeight = Math.floor(jQuery("footer").height());
//    var windowGap = windowHeight - (2 + contentHeight + footerHeight);
//    var navGap = navHeight - (2 + contentHeight);

//    //alert("windowHeight:" + windowHeight + " contentHeight:" + contentHeight + " navHeight:" + navHeight + " footerHeight:" + footerHeight + " windowGap:" + windowGap + " navGap:" + navGap);

//    //if (navHeight > contentHeight && navHeight > windowHeight) {
//    //navigation bar is larger than window and content, add to gap to push down footer
//    //    windowGap = windowGap + (navHeight - contentHeight);
//    //}
//    if (navGap > 0 && windowGap > 0 && navGap > windowGap) {
//        windowGap = navGap;
//    }

//    //alert("new windowGap:" + windowGap);

//    if (windowGap < 0) { //default to 0px margin if no move needed.
//        windowGap = 0;
//    }

//    //alert("final windowGap:" + windowGap);

//    jQuery("footer").css("margin-top", windowGap);
//}

//used to open browser test in a new window
function openBrowserTest() {
    var path = window.location.protocol + "//" + window.location.host + "/MarineNet/browsertest/browserlog.aspx";
    newwindow = window.open(path, "_blank", "location=no,resizable=yes,scrollbars=yes");
    if (window.focus) { newwindow.focus(); }
    return false;
}

