import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

declare var cordova: any;

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {
  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  @ViewChild('myimage') myImage: any;
  public farmerId;
  public farmerName;
  public items = [];
  private blue: string;
  images = [];
  lastImage: string = null;
  loading: Loading;
  public newFileName;
  public fpath:string;
  public fncount:number = 0;
  public timestamp:string;

  constructor(public navCtrl: NavController,
    private file: File,
    public navParams: NavParams,
    public sqlite: SQLite,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public platform: Platform,
    private filePath: FilePath,
    public toastCtrl: ToastController,
  ) {

    this.farmerName = this.navParams.get('par');
    this.blue = this.farmerName;

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        //try - listing farmer --success
        db.executeSql('select fid,fname from farmers where fname = ?', [this.blue])
          .then((data) => {
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.items.push({ id: data.rows.item(i).fid });
              }
            }

          });

        // try - creating data-mappping table 
        db.executeSql('CREATE TABLE IF NOT EXISTS media(ffid INTEGER,ftype TEXT,floc TEXT(100),ts TIMESTAMP,FOREIGN KEY(ffid) REFERENCES farmers(fid) ON DELETE CASCADE)', {})
          .then(() => {
          });
      });
  }

  returnId(rid) {
    this.farmerId = rid.id;
    alert("farmerId" + this.farmerId)
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {

            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, () => {
      this.presentToast('Error while selecting image.');
    });
  }
  private createFileName() {
    this.fncount = this.fncount + 1
    var d = new Date(),
      n = d.getDate(),
      a = d.getMonth(),
      b = d.getFullYear(),
      c = d.getMinutes(),
      e = d.getHours(),
      f = d.getSeconds();
      this.newFileName = this.blue + n + "-" + a + "-" + b + "-" + this.fncount + ".jpg";
      this.timestamp = n + "-" + a + "-" + b + "--" + e + ":" + c + ":" + f + d.getMilliseconds();
    return this.newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.fpath = cordova.file.externalRootDirectory + "FarmersFz";
    this.file.copyFile(namePath, currentName, this.fpath, newFileName).then(() => {
      this.lastImage = newFileName;
    }, () => {
      this.presentToast('Error while storing file.');
    });
    // try inserting data into media table
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
    db.executeSql('INSERT INTO media (ftype,floc,ts) VALUES(?,?,?)', ["image/jpg",this.fpath,this.timestamp])
    .then((data) => {
    },() => {
      this.presentToast('Error while storing file.');
    });
  });

  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  moveFileToExternalStorage(fileName: string) {
    // Determine paths
    let externalStoragePath: string =
      cordova.file.externalDataDirectory;
    let currentPath: string =
      cordova.file.applicationStorageDirectory + "files/";
    // Extract filename
    fileName = fileName.split("/").pop();
    fileName = this.blue
    // Move the file
    this.file.moveFile(currentPath, fileName,
      externalStoragePath, fileName).then(_ => {
        this.toastCtrl.create(
          {
            message: "Saved one photo",
            position: "bottom",
            duration: 2000
          }
        ).present();
      });

  }

}