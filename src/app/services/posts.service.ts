import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
// import * as firebase from "firebase/app";
// import  firebase  from 'firebase/app';
import "firebase/compat/firestore";
import * as firebase from "firebase/compat/app";

// import * as firebase from 'firebase/firestore';
import 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private afs: AngularFirestore) {}

  loadFeatured() {
    return this.afs
      .collection('posts', ref => ref.where('isFeatured', '==', true).limit(4) )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadLatest() {
    return this.afs
      .collection('posts', ref => ref.orderBy('createdAt') )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadCategoryPosts(categoryId : any) {
    return this.afs
      .collection('posts', ref => ref.where('category.categoryId', '==', categoryId).limit(4) )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }
  loadOnePost(postId: any){
    return this.afs.doc(`posts/${postId}`).valueChanges();
  }
  loadSimilar(catId:any){
    return this.afs
    .collection('posts', ref => ref.where('categor.categoryId', '==', catId).limit(4) )
    .snapshotChanges()
    .pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        });
      })
    );
  }
  
  countViews(postId:any){
    // firebase.initializeApp();
    
    // const db = firebase.firestore();
    const viewsCount = {
      // views: db.FieldValue.increment(1)
      views: firebase.default.firestore.fieldValue.increment(1)
    }
    this.afs.doc(`posts/${postId}`).update(viewsCount).then(() =>{
      console.log('views count updated.....!');      
    });
  }
}
