import { Component, OnInit, ContentChild, ViewChildren, ViewChild, QueryList, ElementRef, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { SwipeableDirective } from '../swipeable.directive';
import $ from 'jquery';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngx-swiper',
  templateUrl: './ngx-swiper.component.html',
  styleUrls: ['./ngx-swiper.component.css']
})
export class NgxSwiperComponent implements OnInit {

  @ContentChild(SwipeableDirective) swipeableTemplate: TemplateRef<any>;

  @ViewChildren("swipeableItems") swipeableItems: QueryList<ElementRef>;
  @ViewChild("scroller") scroller: ElementRef;

  @Input() swipeableData: any[];
  @Input() move: Observable<any>;

  @Output() newCentered: EventEmitter<any> = new EventEmitter<any>();

  private centered: HTMLElement;

  public offsetX: number;
  private lastDist: number = 0;

  constructor() { }

  ngOnInit() {
    if (this.move) {
      this.move.subscribe(m => {
        if(m.direction == 'forward') {
          this.forwards(m.count);
        } else if (m.direction == 'back') {
          this.backwards(m.count);
        }
      });
    }
  }

  onPanStart(event) {
    $('body').css("user-select", "none");
    this.offsetX = this.swipeableItems.first.nativeElement.offsetLeft;
  }

  onPan(event) {
    this.swipeableItems.forEach(si => {
      $(si.nativeElement).css({ left: this.offsetX + (event.distance * (event.offsetDirection == 2 ? -1 : 1)) });
    });
  }

  onPanEnd(event) {
    $('body').css("user-select", "auto");
    this.offsetX = this.swipeableItems.first.nativeElement.offsetLeft;
    this.lastDist = 0;
  }

  forwards(count) {
    let list = this.swipeableItems.toArray().map(si => si.nativeElement);
    let index = list.indexOf(this.centered);
    index = index + count >= list.length ? list.length - 1 : index + count;
    this.centerItemByIndex(index);
  }

  backwards(count) {
    let list = this.swipeableItems.toArray().map(si => si.nativeElement);
    let index = list.indexOf(this.centered);
    index = index - count < 0 ? 0 : index - count;
    this.centerItemByIndex(index);
  }

  centerItemByIndex(index: number) {
    this.centerItem(this.swipeableItems.toArray()[index].nativeElement);
  }

  centerItem(element: HTMLElement) {
    let targetWidth = element.offsetWidth;
    let scrollerWidth = this.scroller.nativeElement.offsetWidth;
    let pixelsToAnimate = element.offsetLeft + targetWidth/2 - scrollerWidth/2;

    if(Math.abs(pixelsToAnimate) < 2)
      return;

    let animated = false;
    this.swipeableItems.forEach(si => {
      animated = $(si.nativeElement).is(':animated');
    });

    if (animated)
      return;

    let index = this.swipeableItems.toArray().map(si => si.nativeElement).indexOf(element);
    if (this.swipeableData[index]['disabled']) {
      return;
    }
    this.centered = element;
    this.newCentered.emit({ index: index, data: this.swipeableData[index]});

    this.swipeableData.forEach(sd => {
      sd['centered'] = false;
    });

    this.swipeableData[index]['centered'] = true;

    this.swipeableItems.map(si => si.nativeElement).forEach(ne => {
      $(ne).animate({ left: "-=" + pixelsToAnimate + "px" });
    });
  }
}
