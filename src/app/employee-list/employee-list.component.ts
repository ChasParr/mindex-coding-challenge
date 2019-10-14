import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import {CrudDialogueComponent} from '../crud-dialogue/crud-dialogue.component';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
      this.updateEmployees();
  }


  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
    
    updateEmployees(): void {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      ).subscribe();
        
    }
    
    // open dialog when a CRUD operation is requested
  openDialog(op: String, emp: Employee): void {
    const dialogRef = this.dialog.open(CrudDialogueComponent, {
      data: {operation: op, employee: emp}
    });

    dialogRef.afterClosed().subscribe(result => {
        // handle the result of the dialog
        if(result.op === 'del'){
            // delete employee
            // it's unclear if this is supposed to delete the employee or just remove them from the list of direct reports
            // I went with deleting the employee since there was a command for it in the service
            this.employeeService.remove(result.emp)
                .pipe(
                catchError(this.handleError.bind(this))
                ).subscribe(result =>{
                    // update employees to reload the cards with corrected data
                    this.updateEmployees();
                });
        }
        if(result.op === 'save'){
            // save updated employee
            this.employeeService.save(result.emp)
                .pipe(
                catchError(this.handleError.bind(this))
                ).subscribe(result =>{
                    // update employees to reload the cards with corrected data
                    this.updateEmployees();
                    // I don't like requesting all employees just to make sure everything updates correctly
                    // I would rather selectively update the data that's been changed, but I'm not sure the best way to do that
                    // or just change it locally, but that risks deviations from the data on the server
                });
        }
    });
  }
}
