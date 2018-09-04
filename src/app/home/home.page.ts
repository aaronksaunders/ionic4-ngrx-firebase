import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

// NGRX
import { Store, select } from "@ngrx/store";
import { AppState, selectUser, selectData } from "../store/main-reducer";
import { All } from "../store/main-actions";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  loginForm: FormGroup;
  storeInfo;
  credentials: { email?: string; password?: string } = {};
  cu$;
  data$;

  /**
   *
   * @param store
   */
  constructor(public store: Store<AppState>) {
    // use the object in the template since it is an observable
    this.storeInfo = this.store.select<any>("app");

    // dispatch action to see if we have a current user
    this.store.dispatch(new All().checkAuthAction());

    // create observable for user and for data array
    // that are contained in the store
    this.cu$ = this.store.pipe(select(selectUser));
    this.data$ = this.store.pipe(select(selectData));

    // check and see if we have a user, if so then get the data
    // for the display
    this.store.pipe(select(selectUser)).subscribe(currentUser => {
      if (currentUser) {
        this.store.dispatch(new All().fetchFirebaseArrayAction("new-test"));
      }
    });
  }

  doLogout() {
    this.store.dispatch(new All().logoutAction());
  }

  doLogin(_credentials) {
    if (_credentials.valid) {
      this.store.dispatch(new All().loginAction(_credentials.value));
    }
  }

  doCreateUser(_credentials) {
    if (_credentials.valid) {
      this.store.dispatch(new All().createUserAction(_credentials.value));
    }
  }

  doCreateObject() {
    this.store.dispatch(
      new All().createFirebaseObject({
        objectType: "new-test",
        objectData: {
          created: new Date()
        }
      })
    );
  }
}
