import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreDbService } from '../providers/firestore-db/firestore-db.service';
import { WidgetUtilService } from '../providers/widget-util/widget-util.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  productList: Array<any> = [];
  productAvailable: boolean = false;

  constructor( private router: Router, private firestoreDbService: FirestoreDbService, 
    private widgetUtilService: WidgetUtilService) {
    this.getProductList();
  }

  goToUserAccount() {
    this.router.navigate(['/account']);
  }
  
  getProductList(event = null) {
    this.productAvailable = false;
    this.firestoreDbService.getAllData('products').subscribe((result) => {
      console.log(result);
      this.productList = result;
      this.productAvailable = true;
      this.handleRefresher(event);
    }, error => {
      this.productAvailable = true;
      this.widgetUtilService.presentToast(error.message);
      this.handleRefresher(event);
    })
  }

  handleRefresher(event) {
    if(event) {
      event.target.complete();
    }
  }

  doRefresh(event) {
    this.getProductList(event)

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  openAddProductPage() {
    this.router.navigate(['/add-product']);
  }

  openProductDetailPage(productId) {
    this.router.navigate(['/product-detail', productId]);
  }
}
