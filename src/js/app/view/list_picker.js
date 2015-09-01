'use strict';

import _ from 'underscore';
import $ from 'jquery';

import Modal from './modal';

/**
 * List picker modal, takes the following parameters:
 *
 *  +   list : an array of tuples [content (string), key]
 *  +   useFilter : wether or not to display the search bar
 *  +   submit: the callback
 *
 * All tags will have the data attributes value, key and index
 * The callback is called with the key (which is the content if key is
 * undefined)
 */
export default Modal.extend({

    events: {
        'click li': 'click',
        'keyup input': 'filter'
    },

    init: function ({list, submit, useFilter}) {
        this.list = list.map(([c, k], i) => [c, k || c, i]);
        this._list = this.list;
        this.submit = submit;
        this.useFilter = !!useFilter;
        _.bindAll(this, 'filter');
    },

    filter: _.throttle(function (evt) {
        const value = evt.currentTarget.value.toLowerCase();
        if (!value || value === "") {
            this._list = this.list;
        }

        this._list = this.list.filter(([content]) => {
            return content.toLowerCase().indexOf(value) > -1;
        });

        this.update();
    }, 50),

    makeList: function () {
        const $ul = $(`<ul></ul>`);
        this._list.forEach(function ([content, key, index]) {
            $ul.append($(
                `<li data-value='${content}' data-key='${key}' data-index='${index}'>${content}</li>`));
        });
        return $ul;
    },

    update: function () {
        this.$content.find('ul').remove();
        this.$content.append(this.makeList());
    },

    content: function () {
        const $content = $(`<div class='ListPicker'></div>`);

        if (this.useFilter) {
            $content.append(`<input type="text" placeholder='Search'/>`);
        }

        $content.append(this.makeList());
        this.$content = $content;
        return $content;
    },

    click: function (evt) {
        const key = evt.currentTarget.dataset.key;
        this.submit(key);
        this.close();
    }
});