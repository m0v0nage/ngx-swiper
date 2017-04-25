import { Component, OnInit, ContentChild, ViewChildren, ViewChild, QueryList, ElementRef, TemplateRef, Input } from '@angular/core';
import { SwipeableDirective } from '../swipeable.directive';
import $ from 'jquery';

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

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    console.log(this.swipeableTemplate);
  }

  ngAfterViewInit() {
    console.log(this.swipeableItems);
  }

  centerItem(event) {
    let target = event.currentTarget;
    let targetWidth = target.offsetWidth;
    let scrollerWidth = this.scroller.nativeElement.offsetWidth;
    let pixelsToAnimate = target.offsetLeft + targetWidth/2 - scrollerWidth/2;

	if(Math.abs(pixelsToAnimate) < 2)
	  return;

	let animated = false;
	this.swipeableItems.forEach(si => {
	  animated = $(si.nativeElement).is(':animated');
	});

	if (animated)
	  return;

    this.swipeableItems.map(si => si.nativeElement).forEach(ne => {
      $(ne).animate({ left: "-=" + pixelsToAnimate + "px" });
    });
  }
}
