import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataPage } from '../pages/data/data';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { MediaCapture } from '@ionic-native/media-capture';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { AddFPage } from '../pages/add-f/add-f';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DataPage,
    AddFPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name:'farm',
      driverOrder:['indexeddb', 'sqlite', 'websql']
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DataPage,
    AddFPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    MediaCapture,
    StreamingMedia, 
    File,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    Base64,
    FilePath,
    Transfer,



  ]
})
export class AppModule {}
