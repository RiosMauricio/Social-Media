import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { FeedComponent } from './components/feed/feed.component';
import { PackComponent } from './components/pack/pack.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { PackFormComponent } from './components/pack-form/pack-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostComponent } from './components/post/post.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LogInComponent,
    FeedComponent,
    PackComponent,
    DashboardComponent,
    ProfileDetailsComponent,
    NavbarComponent,
    PackFormComponent,
    PostComponent,
    PostFormComponent,
    SubscriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule, BrowserAnimationsModule,
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    MatInputModule, 
    MatSelectModule, 
    MatTabsModule, 
    MatCardModule, 
    MatButtonModule,
    MatCheckboxModule, 
    MatChipsModule, 
    MatToolbarModule, 
    MatGridListModule,
    MatDialogModule, 
    MatIconModule, 
    MatMenuModule, 
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
