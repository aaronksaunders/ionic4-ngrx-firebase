import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

// NGRX
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectUser,
  selectData,
  selectDataAction
} from "../store/main-reducer";
import {
  All,
  CREATE_FIREBASE_OBJECT_SUCCESS,
  DELETE_FIREBASE_OBJECT_SUCCESS,
  UPDATE_FIREBASE_OBJECT_SUCCESS
} from "../store/main-actions";
import { ModalController, ToastController } from "@ionic/angular";
import { AddTaskModalComponent } from "../add-task-modal/add-task-modal.component";

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
  constructor(
    public store: Store<AppState>,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
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

    // check and see if we have successfully added an object, if so
    // display success alert and clear flag on state
    this.store.pipe(select(selectDataAction)).subscribe(action => {
      if (action) {
        console.log(action);

        if (action.action) {
          let message = "";
          switch (action.action) {
            case CREATE_FIREBASE_OBJECT_SUCCESS:
              message = "Object Created Successfully";
              break;

            case DELETE_FIREBASE_OBJECT_SUCCESS:
              message = "Object Deleted Successfully";
              break;

            case UPDATE_FIREBASE_OBJECT_SUCCESS:
              message = "Object Updated Successfully";
              break;

            default:
              break;
          }
          this.doToast(message);
          this.store.dispatch(new All().clearSuccessAction());
        }
      }
    });
  }

  async doToast(_message) {
    const toast = await this.toastController.create({
      message: _message,
      duration: 2000
    });
    toast.present();
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

  doCreateObject(_inputData) {
    this.store.dispatch(
      new All().createFirebaseObject({
        objectType: "new-test",
        objectData: {
          ..._inputData,
          created: new Date()
        }
      })
    );
  }

  doDeleteObject(_inputData) {
    this.store.dispatch(
      new All().deleteFirebaseObject({
        objectType: "new-test",
        objectId: _inputData.id
      })
    );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddTaskModalComponent,
      componentProps: { value: 123, next : 'foo' }
    });
    modal.onDidDismiss().then((d: any) => this.handleModalDismiss(d));
    return await modal.present();
  }

  handleModalDismiss = ({ data }) => {
    if (data.cancelled) {
      // alert that user cancelled
    } else {
      //save the data
      this.doCreateObject(data);
    }
  };
}
