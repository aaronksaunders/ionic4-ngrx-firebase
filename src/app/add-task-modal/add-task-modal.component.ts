import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-add-task-modal",
  templateUrl: "./add-task-modal.component.html",
  styleUrls: ["./add-task-modal.component.scss"]
})
export class AddTaskModalComponent implements OnInit {
  customActionSheetOptions: any = {
    header: "Colors",
    subHeader: "Select your favorite color"
  };

  task = {};
  value: any;

  constructor(public modalController: ModalController) {}

  ngOnInit() {
    console.log(this.value);
  }

  dismissModal() {
    this.modalController.dismiss({ ...this.task });
  }

  cancelModal() {
    this.modalController.dismiss({ cancelled: true });
  }
}
