import { bindable, inject } from 'aurelia-framework';
import Sortable from 'sortablejs';

@inject(Element)
export class SortableCustomAttribute {
    @bindable enabled = true;
    @bindable options;
    element;
    sortable;

    _listeners = [
        { key: 'add', listener: event => this.dispatch('sortable-add', event)},
        { key: 'end', listener: event => this.dispatch('sortable-end', event)},
        { key: 'filter', listener: event => this.dispatch('sortable-filter', event)},
        { key: 'move', listener: event => this.dispatch('sortable-move', event)},
        { key: 'remove', listener: event => this.dispatch('sortable-remove', event)},
        { key: 'sort', listener: event => this.dispatch('sortable-sort', event)},
        { key: 'start', listener: event => this.dispatch('sortable-start', event)},
        { key: 'update', listener: event => this.dispatch('sortable-update', event)},
    ];

    constructor(element) {
        this.element = element;
    }

    attached() {
        if (this.enabled) {
            this._createSortable();
        }
    }

    detached() {
        this._removeSortable();
    }

    /** @private */
    _createSortable() {
        if (this.sortable) return;

        const defaultOptions = {
            animation: 200,
            fallbackOnBody: true,
            fallbackTolerance: 3,
            ghostClass: 'fqa-dragdroppable-insert',
        };

        this.sortable = Sortable.create(this.element, Object.assign(defaultOptions, this.options || {}));
        for (const listener of this._listeners) {
            Sortable.utils.on(this.element, listener.key, listener.listener);
        }
    }

    /** @private */
    _removeSortable() {
        for (const listener of this._listeners) {
            Sortable.utils.off(this.element, listener.key, listener.listener);
        }

        if (this.sortable) {
            this.sortable.destroy();
            this.sortable = undefined;
        }
    }

    dispatch(name, event) {
        // Don't send events if the item hasn't moved.
        if (event.from === event.to && event.oldDraggableIndex === event.newDraggableIndex) return;
        // Don't send events if the target sortable is different.
        if (this.element !== event.to) return;
        this.element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: event }));
    }

    /** @protected */
    enabledChanged() {
        if (this.enabled) {
            this._createSortable();
        } else {
            this._removeSortable();
        }
    }
}
