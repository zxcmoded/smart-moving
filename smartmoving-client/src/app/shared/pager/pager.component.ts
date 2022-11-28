import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PageRequestModel } from 'app/generated/Paging/page-request-model';
import { PageViewModel } from 'app/generated/Paging/page-view-model';

export class PageRequestModelEx extends PageRequestModel {
  static create(page: number, pageSize: number) {
    const pageRequest = new PageRequestModelEx();
    pageRequest.page = page;
    pageRequest.pageSize = pageSize;
    return pageRequest;
  }

  queryString() {
    let query = `page=${this.page}&pageSize=${this.pageSize}`;

    if (this.sort) {
      query = `${query}&sort=${encodeURIComponent(this.sort)}`;
    }

    return query;
  }
}

@Component({
  selector: 'sm-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Output() showPage = new EventEmitter<PageRequestModelEx>();
  @Input() pageSize = 50;
  @Input() maxPagesToShow = 20;
  @Input() alwaysShow = false;

  @Input() currentPage: PageViewModel<any>;

  constructor() { }

  ngOnInit() {
    this.goToPage(1);
  }

  enumeratePages() {
    if (!this.currentPage) {
      return [1];
    }

    let pageCountToShow = this.currentPage.totalPages;
    let offset = 0;

    if (this.currentPage.totalPages > this.maxPagesToShow) {
      pageCountToShow = this.maxPagesToShow;
      offset = this.currentPage.pageNumber - Math.ceil(pageCountToShow / 2);

      if (offset + pageCountToShow > this.currentPage.totalPages) {
        offset = this.currentPage.totalPages - pageCountToShow;
      }

      offset = offset < 0 ? 0 : offset;
    }

    return Array(pageCountToShow).fill(0).map((_, index) => (index + 1) + offset);
  }

  goToPage(page: number) {
    let sanitizedPage = page;
    let sanitizedPageSize = this.pageSize;

    if (!this.currentPage) {
      sanitizedPage = 1;
    } else {
      sanitizedPage = page < 2 ? 1 :
                      page > this.currentPage.totalPages ? this.currentPage.totalPages : page;
      sanitizedPageSize = this.currentPage.pageSize;
    }

    const pageRequest = new PageRequestModelEx();
    pageRequest.pageSize = sanitizedPageSize;
    pageRequest.page = sanitizedPage;

    this.showPage.emit(pageRequest);
  }

  goToNextPage() {
    if (this.currentPage.lastPage) {
      return;
    }

    this.goToPage(this.currentPage.pageNumber + 1);
  }

  goToPreviousPage() {
    if (this.currentPage.pageNumber <= 1) {
      return;
    }

    this.goToPage(this.currentPage.pageNumber - 1);
  }
}
