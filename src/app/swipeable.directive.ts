import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[swipeable]'
})
export class SwipeableDirective {

  constructor(public template: TemplateRef<any>) { }

}
