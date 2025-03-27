import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() onYes = new EventEmitter;
  @Output() onNo = new EventEmitter;

  yes(){
    this.onYes.emit();
  }

   no(){
    this.onNo.emit();
   }
}
