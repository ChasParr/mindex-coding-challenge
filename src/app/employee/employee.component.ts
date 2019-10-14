import {Component, Input, Output, EventEmitter} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  constructor(private employeeService: EmployeeService) {
  }
    // this employee's data
    @Input() employee:Employee;
    // this employee's direct reports
    @Input() directReports:Array<Employee>;
    
    // data for all Employees (needed to find total # of subordinates)
    employees: Employee[] = [];
    
    // total number of subordinates
    all_subordinates:number;
    // not sure if this is instead supposed to be a list of actual employee data, the requirements don't clarify
    // I would probably rather store this data in the employee objects themselves
    
    ngOnInit(){
        // get all the employee data up front so I don't have to make requests in the recursive function
      this.employeeService.getAll()
          .pipe(
            reduce((emps, e: Employee) => emps.concat(e), []),
            map(emps => this.employees = emps),
            catchError(this.handleError.bind(this))
          ).subscribe(
          result => {
            if(this.employee.directReports){
                // get the total number of employees reporting
                this.all_subordinates = this.getSubord(this.employee.directReports);
                // get the employee data of direct reports
                this.directReports = this.employees.filter(x => this.employee.directReports.includes(x.id));
            } else {
                this.all_subordinates = 0;
            }
          });
        // this seems really bad, especially as the number of employees scales
        // probably a performance bottleneck
        // I think fixing it would either require changes on the service end 
        // or getting the data from the employee-list, where it's already requested
        
    }
    
    // recursively gets the total number of subordinates to this employee
    getSubord(directSub: Array<number>):number {
        let count: number = 0;
        for(let i:number = 0; i < directSub.length; i++){
            // get the employee with id = directSub[i]
            // relies on having full employee array
            let subEmp: Employee = this.employees.filter(x => x.id == directSub[i])[0];
            
            // only recur if current employee has subordinates
            if (subEmp && subEmp.directReports){
                count += this.getSubord(subEmp.directReports);
            }
            // add the current employee
            count++;
        }
        return count;
    }
    
  private handleError(e: Error | any): void {
    console.error(e);
  }
    
    // hides direct reports title if employee has none
    hideReports() {
        return {hidden: !this.employee.directReports};
    }
    
    // EventEmitters to pass CRUD requests up to employee-list
    @Output() notifyEdit: EventEmitter<Employee> = new EventEmitter<Employee>();
    @Output() notifyDel: EventEmitter<Employee> = new EventEmitter<Employee>();
    // there's probably a better way to do this using only one EventEmitter/function
    // maybe passing an object containing an operation string as well
    // but this works so is not a priority
    
    // functions to use the EventEmitters
    editReport(rep){
        console.log('edit ' + rep.id);
        this.notifyEdit.emit(rep);
    }
    
    deleteReport(rep){
        console.log('delete ' + rep.id);
        this.notifyDel.emit(rep);
    }
}
