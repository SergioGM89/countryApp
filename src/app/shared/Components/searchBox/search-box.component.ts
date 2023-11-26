import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['./search-box.component.css'],
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer = new Subject<string>();

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    this.debouncer
    .pipe(
      debounceTime(300)
      )
      .subscribe( value => {
        this.onDebounce.emit(value);
      })
    }

  ngOnDestroy(): void {
    console.log('destruido');
  }

  onKeyPress( searchTerm: string ): void {
    this.debouncer.next(searchTerm);
  }
}
