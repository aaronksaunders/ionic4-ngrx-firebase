import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, RouteReuseStrategy, Routes } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// FORMS
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// NGRX
import { StoreModule } from "@ngrx/store";
import { mainAppStoreReducer } from '../app/store/main-reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from "@ngrx/effects";
import { MainEffects } from "./store/main-effects";
import { AddTaskModalComponent } from './add-task-modal/add-task-modal.component';


@NgModule({
  declarations: [AppComponent, AddTaskModalComponent],
  entryComponents: [
    AddTaskModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    StoreModule.forRoot({ app: mainAppStoreReducer }),
    IonicModule.forRoot(),
    AppRoutingModule,
    EffectsModule.forRoot([MainEffects]),
    StoreDevtoolsModule.instrument()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
