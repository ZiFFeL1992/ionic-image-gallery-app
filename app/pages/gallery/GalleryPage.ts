import {Alert, Modal, NavController, Page} from "ionic-angular";

import {PhotoViewerViewController} from "./PhotoViewerViewController";
import {PhotoViewer} from "./PhotoViewer";
import {TRANSITION_IN_KEY} from "./PhotoViewerTransition";
import {UnsplashItUtil} from "../../utils/UnsplashItUtil";
import {ImageEntity} from "../../utils/ImageEntity";

@Page({
  template: `
    <ion-navbar *navbar primary>
        <ion-title>Image Gallery</ion-title>
        <ion-buttons end>
            <button (click)="loadGallery()">
                <ion-icon name="refresh"></ion-icon>
            </button>
        </ion-buttons>
    </ion-navbar>
    <ion-content>

      <div [virtualScroll]="images">
        <div *virtualItem="let imageEntity" class="image-container"
          [style.width]="IMAGE_SIZE + 'px'" [style.height]="IMAGE_SIZE + 'px'"
          (click)="imageClicked(imageEntity, $event)">
          <ion-img [src]="imageEntity.mediumSizeUrl" class="image" tappable></ion-img>
        </div>
      </div>
    </ion-content>
  `
})
export class GalleryPage {

  private images:ImageEntity[];
  private NUM_IMAGES:number = 500;
  private MIN_NUM_COLUMNS:number = 3;
  private MARGIN:number = 10;
  private IMAGE_SIZE:number;
  private galleryLoaded:boolean;

  constructor(private navController:NavController, private unsplashItUtil:UnsplashItUtil) {
    this.images = [];
    this.galleryLoaded = false;
  }

  onPageWillEnter(){
    this.IMAGE_SIZE = this.setDimensions();
    if ( ! this.galleryLoaded ){
      this.loadGallery();
    }
  }

  loadGallery(){
    this.galleryLoaded = true;
    this.unsplashItUtil.getListOfImages(this.IMAGE_SIZE).then(imageEntities =>{
      this.images = imageEntities;
    });
  }

  setDimensions(){
    let screenWidth = window.innerWidth;
    var potentialNumColumns = Math.floor(screenWidth/120);
    let NUM_COLUMNS = potentialNumColumns > this.MIN_NUM_COLUMNS ? potentialNumColumns : this.MIN_NUM_COLUMNS;
    return Math.floor(window.innerWidth/NUM_COLUMNS);
  }

  imageClicked(imageEntity:ImageEntity, event:Event){
    var rect = (<HTMLElement>event.target).getBoundingClientRect();
    let modal = Modal.create(PhotoViewer, {
      imageEntity:imageEntity
    });
    this.navController.present(modal, {
      ev: {
        startX: rect.left,
        startY: rect.top,
        width: rect.width,
        height: rect.height
      },
      animation: "photoViewerEnter"
    });
  }
}
