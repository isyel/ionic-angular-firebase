import { Injectable } from '@angular/core';
import { ToastController, Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {
  loading: any = {};

  constructor(private toastController: ToastController, private platform: Platform,
    private loadingController: LoadingController) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: this.platform.is('desktop') ? 'top' : 'bottom',
      buttons: [{
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Toast Dismissed');
          }
        }
      ]
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 2000,
      message: 'Please Wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoader() {
    await this.loading.dismiss()
  }
}
