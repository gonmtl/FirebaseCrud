import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

import {Product} from '../models/product';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productsCollection: AngularFirestoreCollection<Product>;
  products: Observable<Product[]>;
  productsDoc: AngularFirestoreDocument<Product>;
  constructor(public db: AngularFirestore) {
    // this.products = db.collection('products').valueChanges();

    this.productsCollection = this.db.collection('products');
    this.products = this.productsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Product;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  getProducts() {
    return this.products;
  }

  addProduct(product: Product) {
    this.productsCollection.add(product);
  }

  updateProduct(product: Product) {
    this.productsDoc = this.db.doc(`products/${product.id}`);
    this.productsDoc.update(product);
  }

  deleteProduct(product: Product) {
  this.productsDoc = this.db.doc(`products/${product.id}`);
  this.productsDoc.delete();
  }
}
