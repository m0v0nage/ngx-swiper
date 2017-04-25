import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSwiperComponent } from './app/ngx-swiper/ngx-swiper.component';
import { SwipeableDirective } from './app/swipeable.directive';

export * from './app/ngx-swiper/ngx-swiper.component';
export * from './app/swipeable.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
	  NgxSwiperComponent,
	  SwipeableDirective
  ],
  exports: [
	  NgxSwiperComponent,
	  SwipeableDirective
  ]
})
export class NgxSwiperModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxSwiperModule
    };
  }
}
