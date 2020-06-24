import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountdownListComponent } from './countdown-list/countdown-list.component';
import { EventCreateComponent } from './event-create/event-create.component';


const routes: Routes = [
  { path: '', redirectTo: '/countdown-list', pathMatch: 'full' },
  { path: 'countdown-list', component: CountdownListComponent },
  {
    path: 'new-event',
    component: EventCreateComponent,
    outlet: 'modal'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
