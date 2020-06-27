import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreDbService } from '../providers/firestore-db/firestore-db.service';
import { WidgetUtilService } from '../providers/widget-util/widget-util.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EDITPRODUCT } from '../constants/formValidationMessage';
import { HelperService } from '../providers/helper.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  productDetail: any = {};
  productId: string = '';
  productDetailAvailable: boolean = false;
  productDetailList: Array<any> = [];
  showEditProductForm: boolean = false;
  
  editProductForm: FormGroup;
  name: FormControl;
  price: FormControl;
  brand: FormControl;
  size: FormControl;
  formError: any = {
    name: "",
    price: "",
    brand: "",
    size: ""
  };
  validationMessage: any = EDITPRODUCT;
  showEditProductSpinner: boolean = false;
  showloginWithGoogleSpinner: boolean = false;
  showDeleteProductSpinner: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private firestoreDbService: FirestoreDbService,
    private widgetUtilService: WidgetUtilService, private helperService: HelperService,
    private router: Router) {
    this.activatedRoute.params.subscribe((result) => {
      console.log(result);
      this.productId = result.id;
      this.getProductDetail();
    });
   }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  createFormControl() {
    this.name = new FormControl('', [Validators.required]);
    this.price = new FormControl('', [Validators.required]);
    this.brand = new FormControl('', [Validators.required]);
    this.size = new FormControl('', [Validators.required]);
  }

  createForm() {
    this.editProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      brand: this.brand,
      size: this.size
    })
    this.editProductForm.valueChanges.subscribe(data => this.onFormValuesChanged(data))
  }
  
  onFormValuesChanged(data) {
    this.formError = this.helperService.prepareValidationMessage(this.editProductForm, this.validationMessage, this.formError);
    console.log('===formError: ', this.formError);
  }

  async getProductDetail() {
    this.productDetailAvailable = false;
    try {
      const result = await this.firestoreDbService.getDataById('products', this.productId)
      console.log("product detail: ", result);
      this.productDetail = result;
      this.productDetailList = [];
      for (const key in this.productDetail) {
        this.productDetailList.push({
          name: key,
          value: this.productDetail[key]
        })
      }
      this.productDetailAvailable = true;
    } catch (error) {
      this.productDetailAvailable = true;
      this.widgetUtilService.presentToast(error.message);
      throw new Error(error);
    }
  }
  
  resetForm() {
    this.editProductForm.reset();
    this.formError = {
      name: "",
      price: "",
      brand: "",
      size: ""
    };
  }

  openEditProductForm() {
    this.resetForm();
    this.showEditProductForm = true;
    for (const key in this.editProductForm.controls) {
      console.log(key);
      this.editProductForm.controls[key].setValue(this.productDetail[key]);
    }
  }

  cancelEdit() {
    this.showEditProductForm = false;
  }

  async updateProduct() {
    this.showEditProductSpinner = true;
    try {
      const updatedProductDetails = {};
      for (const formField in this.editProductForm.controls) {
        const control = this.editProductForm.controls[formField]
        if(control.dirty) {
          updatedProductDetails[formField] = control.value;
        }
      }
      console.log("updatedProductDetails =", updatedProductDetails);
      await this.firestoreDbService.updateData('products', this.productId, updatedProductDetails);
      await this.getProductDetail();
      await this.openEditProductForm();
      this.widgetUtilService.presentToast("Product Updated Succesfully");
      this.showEditProductSpinner = false;
      this.showEditProductForm = false;
    } catch (error) {
      this.showEditProductSpinner = false;
      this.widgetUtilService.presentToast(error.message);
      throw new Error(error);
    }
  }

  deleteProduct() {
    this.widgetUtilService.presentAlertConfirm(
      'Delete Product', 
      `Are you sure you want to delete ${this.productDetail.name}?`,
      [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Okay',
          handler: async () => {
            this.showDeleteProductSpinner = true;
            try {
              await this.firestoreDbService.deleteData('products', this.productId);
              this.widgetUtilService.presentToast("Product Deleted");
              this.showDeleteProductSpinner = false;
              this.router.navigate(['/']);
            } catch (error) {
              this.showDeleteProductSpinner = false;
              this.widgetUtilService.presentToast(error.message);
            }
          }
        }
      ]);
  }

}
