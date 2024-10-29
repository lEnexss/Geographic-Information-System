import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private _miningBuffer: number = 0;

  get miningBuffer(): number {
    return this._miningBuffer;
  }

  set miningBuffer(value: number) {
    this._miningBuffer = value;
    console.log(`Mining buffer changed to: ${value}`);
  }

  ///
  private _ethnicGroupSenegal: number = 1;

  get ethnicGroupSenegal(): number {
    return this._ethnicGroupSenegal;
  }

  set ethnicGroupSenegal(value: number) {
    this._ethnicGroupSenegal = value;
    console.log(`Ethnic group changed to: ${value}`);
  }

  private _ethnicGroupCongo: number = 1;

  get ethnicGroupCongo(): number {
    return this._ethnicGroupCongo;
  }

  set ethnicGroupCongo(value: number) {
    this._ethnicGroupCongo = value;
    console.log(`Ethnic group changed to: ${value}`);
  }

  private _ethnicGroupKenya: number = 1;

  get ethnicGroupKenya(): number {
    return this._ethnicGroupKenya;
  }

  set ethnicGroupKenya(value: number) {
    this._ethnicGroupKenya = value;
    console.log(`Ethnic group changed to: ${value}`);
  }

  ///
  private _typeOfViolence: number = 1;

  get typeOfViolence(): number {
    return this._typeOfViolence;
  }

  set typeOfViolence(value: number) {
    this._typeOfViolence = value;
    console.log(`Type of violence changed to: ${value}`);
  }

}


  