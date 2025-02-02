import {FrameworkConfiguration} from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('resources/attributes/sortable', 'resources'),
    PLATFORM.moduleName('resources/binding-behaviors/stoppropagation', 'resources'),
  ]);
}
