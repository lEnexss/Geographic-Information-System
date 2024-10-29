import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//add other angular material modules () here
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsComponent } from './components/controls/controls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Nico's imports
import { FormsModule } from '@angular/forms';
import { MapComponent } from './components/map/map.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select'; 
import { MatTreeModule } from "@angular/material/tree";   
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    MapComponent // Nico's import
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    BrowserAnimationsModule,
    // Nico's imports
    FormsModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule,
    MatTreeModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
