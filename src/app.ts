// import { inject } from 'aurelia-framework';
import Sortable from 'sortablejs';

export class App {
  public message = 'SortableJS Aurelia Example';

  public el: HTMLElement;

  attached() {
    this.el = document.getElementById('sortable-items');
    if (this.el) {
      Sortable.create(this.el);
    }
  }

}
