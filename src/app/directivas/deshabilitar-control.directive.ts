import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDeshabilitarControl]'
})
export class DeshabilitarControlDirective {

  
  constructor( private ngControl : NgControl ) { }

  @Input()
  set disableControl( condition : boolean ){
    const accion = condition ? 'disable' : 'enable';
    this.ngControl.control[accion]();
    
  }

}
