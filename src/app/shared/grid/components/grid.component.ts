import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";

@Component({
  selector: 'app-grid',
  template: `
    <div class="container">
      <div *ngIf="isLoading" class="spinner-border text-primary" role="status">
        <span class="sr-only"></span>
      </div>
      <div *ngIf="!isLoading">
        <nav>
          <div class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add</button>
          </div>
        </nav>
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th *ngFor="let header of gridRows[0] | keyvalue">{{header.key}}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="grid-row" *ngFor="let row of gridRows" (click)="onClick(row)">
            <!--<th scope="row">{{j+1}}</th>-->
              <td *ngFor="let cell of row | keyvalue">{{cell.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `
})
export class AppGridComponent implements OnInit, OnChanges {

  @Input() private gridRows: any [] = [];

  @Output() private clickEvent = new EventEmitter<any>();

  private isLoading: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {

  }

  ngOnChanges() {
    if ( this.gridRows.length > 0) {
      this.isLoading = false;
    }
  }

  private onClick(rowData): void {
    this.clickEvent.emit(rowData);
  }


}
