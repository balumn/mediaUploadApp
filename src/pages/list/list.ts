import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataPage } from '../data/data';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',

})
export class ListPage {
  
  // declarations
  public selectedItem: any;
  public icons: string[];
  public db: SQLiteObject;
  public items = [];
  public ids = [];
  public param: Object;
  public pushPage: any;
  public data: any;
  public item;
  public apple:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite) {
    // initializations
    this.items = [];
    this.data;
    this.ids = [];
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        //try - listing farmer --success
        db.executeSql('select fid,fname from farmers', {})
          .then((data) => {
            JSON.stringify(data);
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                  this.items.push({ name: data.rows.item(i).fname });
            }
          }
          });

        // try - creating data-mappping table 
        db.executeSql('CREATE TABLE IF NOT EXISTS media(ffname TEXT,ftype TEXT,floc TEXT(100),ts TIMESTAMP,FOREIGN KEY(ffid) REFERENCES farmers(fname) ON DELETE CASCADE)', {})
          .then(() => {
          });
      });

  } //end of constructor

  // itemTapped(btnidd) {
  //   this.apple = btnidd
  //   alert(this.apple);
  //   this.navCtrl.push(DataPage, {
  //     ffid: 'apsp'
  //   });

  // }

  setMeLive(bye){
     this.navCtrl.push(DataPage, {
      par: bye.name
    });

  }
}
