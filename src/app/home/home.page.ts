import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

// NGRX
import { Store, select } from "@ngrx/store";
import { AppState, selectUser } from "../store/main-reducer";
import { All } from "../store/main-actions";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  submitted = false;
  loginForm: FormGroup;
  storeInfo;
  credentials: { email?: string; password?: string } = {};
  cu$;

  constructor(private builder: FormBuilder, public store: Store<AppState>) {
    // use the object in the template since it is an observable
    this.storeInfo = this.store.select<any>("app");

    this.store.dispatch(new All().checkAuthAction());
;
    this.cu$ = this.store.pipe(select(selectUser)).subscribe(() => {
      this.store.dispatch(
        new All().fetchFirebaseArrayAction("new-test")
      );
    });
  }

  doLogout() {
    this.store.dispatch(new All().logoutAction());
  }

  doLogin(_credentials) {
    this.submitted = true;

    if (_credentials.valid) {
      this.store.dispatch(new All().loginAction(_credentials.value));
    }
  }

  doCreateUser(_credentials) {
    this.submitted = true;

    if (_credentials.valid) {
      this.store.dispatch(new All().createUserAction(_credentials.value));
    }
  }

  doCreateObject() {
    this.submitted = true;

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
