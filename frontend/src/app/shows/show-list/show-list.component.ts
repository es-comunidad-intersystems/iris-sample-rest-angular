import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Show } from '../shows.model';
import { ShowsService } from '../services/shows.service';
import { MatPaginator, PageEvent } from '@angular/material';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements AfterViewInit {

  shows$: Observable<Show[]>;
  totalResults: number = 0;
  displayedColumns = ['id', 'title', 'description'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private cdr: ChangeDetectorRef,
    private showsService: ShowsService
  ) { }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.getDataPage(this.paginator.pageIndex, this.paginator.pageSize);
  }

  getDataPage(pageIndex: number, pageSize: number) {
    this.cdr.detectChanges();
    this.shows$ = this.showsService.findShows(pageIndex + 1, pageSize).pipe(
      tap(res => {
        this.totalResults = res['total']
      }),
      map(res => res['children'])
    );
  }

  onChangePage(event?: PageEvent) {
    this.getDataPage(event.pageIndex, event.pageSize);
  }

}