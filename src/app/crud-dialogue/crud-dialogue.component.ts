// I forgot Dialog and Dialogue were different things, and once I realized it I figured it was probably too much trouble to chamge
import { Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {Employee} from '../employee';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-dialogue',
  templateUrl: './crud-dialogue.component.html',
  styleUrls: ['./crud-dialogue.component.css']
})
export class CrudDialogueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CrudDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    firstName = new FormControl('');
    lastName = new FormControl('');
    position = new FormControl('');
    compensation = new FormControl(0);

  ngOnInit() {
      this.firstName.setValue(this.data.employee.firstName);
      this.lastName.setValue(this.data.employee.lastName);
      this.position.setValue(this.data.employee.position);
      this.compensation.setValue(this.data.employee.compensation);
  }
    
    // hide the version of the modal not requested
    hideEdit() {
        return {hidden: this.data.operation != 'edit'}
    }
    
    hideDel() {
        return {hidden: this.data.operation != 'del'}
    }
    // I feel like this should probably be two different components?
    // I wasn't sure so I just followed the instructions
    // there's also probably a way to do this with just one function
    // maybe have the data include the id of the element to show
    
    // pass the updated employee data to employee-list when the modal closes
    save() {
        let newEmp: Employee = this.data.employee;
        newEmp.firstName = this.firstName.value;
        newEmp.lastName = this.lastName.value;
        newEmp.position = this.position.value;
        newEmp.compensation = this.compensation.value;
        this.dialogRef.close({op:"save", emp: newEmp});
    }
    // there's probably a more elegant way to do this using form grouping and a submit button
    
    // pass the delete request to employee-list when the modal closes
    delete(employee: Employee) {
        this.dialogRef.close({op:"del", emp: employee});
        
    }


}
