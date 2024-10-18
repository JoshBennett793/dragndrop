// import { inject } from 'aurelia-framework';
import Sortable from 'sortablejs';

export class App {
  public message = 'SortableJS Aurelia Example';

  public el: HTMLElement;

  public sortableItems = [
    { label: 'one' },
    { label: 'two' },
    {
      label: 'three',
      children: [
        { label: 'child 1' },
        { label: 'child 2' },
        { label: 'child 3' },
        { label: 'child 4' }],
    },
  ];
}
