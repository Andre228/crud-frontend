import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";

@Component({
  selector: 'app-grid',
  template: `
    <!--<div class="grid-wrapper">-->
      <!--<div class="grid-row" *ngFor="let row of gridRows">-->
        <!--<div *ngFor="let cell of row | keyvalue; index as i">{{ isShow(cell) }}</div>-->
        <!--&lt;!&ndash;<div class="grid-column"></div>&ndash;&gt;-->
      <!--</div>-->
    <!--</div>-->
      <!--<div>-->
        <!--<table class="table">-->
          <!--<thead class="thead-light">-->
            <!--<tr class="table-header">-->
              <!--<th *ngFor="let header of tableHeaders | keyvalue">-->
                <!--{{ isShowHeaderColumn(header) ? header.value : '' }}-->
              <!--</th>-->
            <!--</tr>-->
          <!--</thead>-->
          <!--<tbody>-->
            <!--<tr class="grid-row" *ngFor="let row of gridRows; let j = index" (click)="onClick(j)">-->
              <!--<td class="grid-cell" *ngFor="let cell of row | keyvalue; index as i">{{ isShow(cell) }}-->
                <!--<span class="trash" *ngIf="i === 0" (click)="delete($event, j)"></span>-->
              <!--</td>-->
            <!--</tr>-->
          <!--</tbody>-->
        <!--</table>-->
      <!--</div>-->
        <table class="content-table">
          <thead>
            <tr>
              <th *ngFor="let header of tableHeaders | keyvalue">
                {{ isShowHeaderColumn(header) ? header.value : '' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row" *ngFor="let row of gridRows; let j = index" (click)="onClick(j)">
              <td class="table-cell" *ngFor="let cell of row | keyvalue; index as i">{{ isShow(cell) }}
                <span class="trash" *ngIf="i === 0" (click)="delete($event, j)"></span>
              </td>
            </tr>
          </tbody>
        </table>
    `
})
export class AppGridComponent implements OnInit, OnChanges {

  @Input() private gridRows: any [] = [];
  @Input() private tableHeaders = {};

  @Output() private clickEvent = new EventEmitter<any>();
  @Output() private deleteEvent = new EventEmitter<any>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {

  }

  ngOnChanges() {
  }

  private onClick(index: number): void {
    this.clickEvent.emit(index);
  }

  private delete(event, index: number): void {
    event.stopPropagation();
    this.deleteEvent.emit(index);
  }

  private isShowHeaderColumn(header): boolean {
    return header.key !== 'id' && header.key !== 'updatedAt' && header.key !== 'deletedAt';
  }

  private isShow(cell) {
    if (cell.key !== 'id' && cell.key !== '1' && cell.key !== 'updatedAt' && cell.key !== 'deletedAt') {
      return cell.value;
    }
  }

}
