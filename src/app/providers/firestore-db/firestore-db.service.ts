import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDbService {

  constructor(private db: AngularFirestore) { }

  getAllData(collectionId) {
    //return this.db.collection('products').valueChanges();
    return this.db.collection(collectionId).snapshotChanges().pipe(
      map( doArray => {
        return doArray.map( doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          }
        });
      })
    );
  }

  async insertData(collectionId, data) {
    try {
      const result = await this.db.collection(collectionId).add(data);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDataById(collectionId, docId) {
    try {
      const result = await this.db.collection(collectionId).doc(docId).ref.get();
      console.log("==result in getbyId: ", result);
      if (result.exists) {
        return result.data();
      } else {
        throw new Error("Data not found with given id");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateData(collectionId, docId, updatedData) {
    try {
      const result = this.db.doc(`${collectionId}/${docId}`).update(updatedData);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteData(collectionId, docId) {
    try {
      const result = this.db.doc(`${collectionId}/${docId}`).delete();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
