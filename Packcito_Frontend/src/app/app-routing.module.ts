import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { FeedComponent } from './components/feed/feed.component';
import { PackComponent } from './components/pack/pack.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  { path: 'log-in', component: LogInComponent}, 
  { path: 'profile/:id', component: ProfileComponent}, 
  { path: 'feed', component: FeedComponent}, 
  { path: 'pack/:packId', component: PackComponent},
  { path: 'dashboard', component: DashboardComponent}, 
  { path: 'profile-details', component: ProfileDetailsComponent},
  { path: 'post/:id', component: PostComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
