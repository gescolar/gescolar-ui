import { GrowMessageService } from './grow-message.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageComponent } from './message/message.component';

@NgModule({
  imports: [
    CommonModule,
    GrowMessageService
  ],
  declarations: [MessageComponent,
    GrowMessageService],
  exports: [MessageComponent,
    GrowMessageService]

})
export class SharedModule { }
