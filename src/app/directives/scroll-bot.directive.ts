import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[ScrollBot]'
})
export class ScrollBotDirective {

  constructor(private _el: ElementRef) { }
  public scrollToBottom() {
    const el: HTMLDivElement = this._el.nativeElement;
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
    // try {
    //   this._el.nativeElement.scrollTop = this._el.nativeElement.scrollHeight;
    // } catch(err) { }
  }
}
