import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  @Output()
  miningBuffer = new EventEmitter<number>();

  @Output()
  ethnicGroupSenegal = new EventEmitter<number>();

  @Output()
  ethnicGroupCongo = new EventEmitter<number>();

  @Output()
  ethnicGroupKenya = new EventEmitter<number>();

  @Output()
  typeOfViolence = new EventEmitter<number>();

}

