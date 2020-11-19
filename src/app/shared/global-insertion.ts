import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appGlobalInsertion]',
})
export class GlobalInsertionDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
