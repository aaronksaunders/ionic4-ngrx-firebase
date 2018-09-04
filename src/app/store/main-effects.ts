import { Injectable } from "@angular/core";

import * as actions from "./main-actions";

import { of, from } from "rxjs";
import { Observable } from "rxjs";
// import "rxjs/Rx";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, tap, switchMap } from "rxjs/operators";
import { Action } from "@ngrx/store";
import API from "./firestore-services";

@Injectable()
export class MainEffects {
  constructor(
    private action$: Actions // public auth$: AngularFireAuth, // public af: AngularFireDatabase
  ) {
    //console.log(this.auth$.auth.currentUser);
  }
  // @Effect({ dispatch: false })
  // logActions$ = this.action$.do(action => {
  //   console.log("logActions$", action);
  // });

  @Effect()
  login: Observable<Action> = this.action$.ofType(actions.LOGIN).pipe(
    map((action: any) => ({ ...action.payload })),
    switchMap(({ email, password }) => {
      return from(API.auth({ email, password })).pipe(
        map((authData: any) => {
          if (authData && authData.error) throw authData.error;
          return { type: actions.LOGIN_SUCCESS, payload: authData.user };
        }),
        catchError(err =>
          of({ type: actions.LOGIN_FAILED, payload: err.message })
        )
      );
    })
  );

  @Effect()
  logOut: Observable<Action> = this.action$.ofType(actions.LOGOUT).pipe(
    //map((action: any) => ({ ...action.payload })),
    switchMap(() => {
      return from(API.signOut()).pipe(
        map((authData: any) => {
          if (authData && authData.error) throw authData.error;
          return { type: actions.LOGOUT_SUCCESS, payload: authData };
        }),
        catchError(err =>
          of({ type: actions.LOGOUT_FAILED, payload: err.message })
        )
      );
    })
  );

  @Effect()
  createUser: Observable<Action> = this.action$
    .ofType(actions.CREATE_USER)
    .pipe(
      map((action: any) => ({ ...action.payload })),
      switchMap(userInfo => {
        return from(API.createUser(userInfo)).pipe(
          map((authData: any) => {
            if (authData && authData.error) throw authData.error;
            return { type: actions.CREATE_USER_SUCCESS, payload: authData };
          }),
          catchError(err =>
            of({ type: actions.CREATE_USER_FAILED, payload: err.message })
          )
        );
      })
    );

  @Effect()
  createFBObject$: Observable<Action> = this.action$
    // Listen for the 'CREATE_FIREBASE_OBJECT' action
    .ofType(actions.CREATE_FIREBASE_OBJECT)
    .pipe(
      map((action: any) => ({ ...action.payload })),
      switchMap(({ objectData, objectType }) => {
        return from(API.addObject(objectType, objectData)).pipe(
          map((_result: any) => {
            return {
              type: actions.CREATE_FIREBASE_OBJECT_SUCCESS,
              payload: { ...objectData, id: _result.id }
            };
          }),
          catchError(err =>
            of({
              type: actions.CREATE_FIREBASE_OBJECT_FAILED,
              payload: err.message
            })
          )
        );
      })
    );

  @Effect()
  getFBArray$: Observable<Action> = this.action$
    // Listen for the 'GET_FIREBASE_ARRAY' action
    .ofType(actions.GET_FIREBASE_ARRAY)
    .pipe(
      map((action: any) => ({ ...action.payload })),
      switchMap(({ objectType }) => {
        return from(API.fetchObjects(objectType)).pipe(
          map(_result => {
            let r = [];

            _result.docs.forEach(i => {
              r.push({
                id: i.id,
                ...i.data()
              });
            });

            return {
              type: actions.GET_FIREBASE_ARRAY_SUCCESS,
              payload: r
            };
          }),
          catchError(err =>
            of({
              type: actions.GET_FIREBASE_ARRAY_FAILED,
              payload: err.message
            })
          )
        );
      })
    );

  @Effect()
  checkAuth: Observable<Action> = this.action$.ofType(actions.CHECK_AUTH).pipe(
    // @see https://www.learnrxjs.io/operators/transformation/switchmap.html
    switchMap(() => {
      // convert promise to observable, then get the results
      return from(API.checkAuth()).pipe(
        map((authData: any) => {
          if (authData && authData.error) throw authData.error;
          return { type: actions.CHECK_AUTH_SUCCESS, payload: authData };
        }),
        catchError(err =>
          of({ type: actions.CHECK_AUTH_FAILED, payload: err.message })
        )
      );
    })
  );

  // @Effect()
  // logout$ = this.action$
  //   .ofType(actions.LOGOUT)
  //   .do(action => console.log(`Received ${action.type}`))
  //   .switchMap(() => this.auth$.auth.signOut())
  //   // If successful, dispatch success action with result
  //   .map((res: any) => ({ type: actions.LOGOUT_SUCCESS, payload: null }))
  //   // If request fails, dispatch failed action
  //   .catch((res: any) =>
  //     Observable.of({ type: actions.LOGOUT_FAILED, payload: res })
  //   );

  // @Effect()
  // deleteFBObject$ = this.action$
  //   // Listen for the 'DELETE_FIREBASE_OBJECT' action
  //   .ofType(actions.DELETE_FIREBASE_OBJECT)
  //   .map(toPayload)
  //   .switchMap(payload => {
  //     console.log("in deleteFBObject$", payload);
  //     return this.doDeleteFirebaseObject(payload);
  //   })
  //   .map(({ $key }) => {
  //     return {
  //       type: actions.DELETE_FIREBASE_OBJECT_SUCCESS,
  //       payload: { $key }
  //     };
  //   })
  //   .catch(error => {
  //     console.log("error", error);
  //     return of({
  //       type: actions.DELETE_FIREBASE_OBJECT_FAILED,
  //       payload: error
  //     });
  //   });

  // @Effect()
  // getFBArray$ = this.action$
  //   .ofType(actions.GET_FIREBASE_ARRAY, actions.CREATE_FIREBASE_OBJECT_SUCCESS)

  //   .do(action => console.log(`Received ${action.type}`))
  //   .switchMap(payload => {
  //     return this.doFirebaseLoadArray(payload)
  //       .map(items => {
  //         console.log(items);
  //         return {
  //           type: actions.GET_FIREBASE_ARRAY_SUCCESS,
  //           payload: items.map(i => {
  //             return {
  //               $key: i.key,
  //               ...i.payload.val()
  //             };
  //           })
  //         };
  //       })
  //       .catch(error => {
  //         return of({
  //           type: actions.GET_FIREBASE_ARRAY_FAILED,
  //           payload: error
  //         });
  //       });
  //   });

  // @Effect()
  // getFBObject$ = this.action$
  //   // Listen for the 'GET_FIREBASE_OBJECT' action
  //   .ofType(actions.GET_FIREBASE_OBJECT)
  //   .map(toPayload)
  //   .switchMap(payload => {
  //     return this.doFirebaseLoadObject(payload)
  //       .map(item => {
  //         console.log(item);
  //         return { type: actions.GET_FIREBASE_OBJECT_SUCCESS, payload: item };
  //       })
  //       .catch(error => {
  //         return of({
  //           type: actions.GET_FIREBASE_OBJECT_FAILED,
  //           payload: error
  //         });
  //       });
  //   });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // MOVE ALL OF THIS TO A SEPERATE SERVICE
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // doAuth(_creds) {
  //   console.log("in do auth", _creds);
  //   // return this.auth$.auth.signInWithEmailAndPassword(
  //   //   _creds.email,
  //   //   _creds.password
  //   // );
  //   return new Promise(resolve => {
  //     resolve(true);
  //   });
  // }

  // doCreateUser(_creds) {
  //   return this.auth$.auth.createUserWithEmailAndPassword(
  //     _creds.email,
  //     _creds.password
  //   );
  // }

  // /**
  //  *
  //  *
  //  * @param {any} { objectType, objectData }
  //  * @returns
  //  * @memberof MainEffects
  //  */
  // doCreateFirebaseObject({ objectType, objectData }) {
  //   // key an id for the object
  //   let key = this.af.database
  //     .ref()
  //     .child(objectType)
  //     .push().key;

  //   // create the object as an update with the path
  //   // and the key info
  //   var updates = {};
  //   updates[`${objectType}/${key}`] = objectData;

  //   // update the database
  //   return this.af.database
  //     .ref()
  //     .update(updates)
  //     .then(() => {
  //       return {
  //         objectType,
  //         objectData,
  //         key
  //       };
  //     });
  // }

  // doDeleteFirebaseObject({ objectType, $key }) {
  //   // key an id for the object
  //   return this.af
  //     .list(objectType)
  //     .remove($key)
  //     .then(() => {
  //       return { $key };
  //     });
  // }

  // doFirebaseLoadArray(_params) {
  //   var path = _params.payload.path;
  //   return this.af
  //     .list(path)
  //     .snapshotChanges()
  //     .take(1);
  // }

  // doFirebaseLoadObject(_params) {
  //   return this.af
  //     .object(_params.path)
  //     .valueChanges()
  //     .take(1);
  // }
}
