import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleComponent } from './components/example/example.component';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// services
import { GoogleAnalyticsEventsService } from './services/GoogleAnalyticsEvents/GoogleAnalyticsEvents.service';
import { ExampleService } from './services/example/example.service';
import { AlertsService } from './services/alerts/alerts.service';
import { BabiesService } from './services/babies/babies.service';

// Components
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GlobalNavbarComponent } from './components/global-navbar/global-navbar.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { HomeComponent } from './components/home/home.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { NewNameComponent } from './components/new-name/new-name.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PodiumComponent } from './components/podium/podium.component';
import { PhotosParentsComponent } from './components/photos-parents/photos-parents.component';
import { RulesComponent } from './components/rules/rules.component';
import { ConfettiComponent } from './components/confetti/confetti.component';

@NgModule({
	declarations: [
		AppComponent,
		ExampleComponent,
		NotFoundComponent,
		GlobalNavbarComponent,
		AlertsComponent,
		HomeComponent,
		DiscoverComponent,
		NewNameComponent,
		WelcomeComponent,
		PodiumComponent,
		PhotosParentsComponent,
		RulesComponent,
		ConfettiComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		LoadingBarHttpClientModule,
		LoadingBarHttpModule,
		LoadingBarRouterModule,
		FontAwesomeModule,
		ReactiveFormsModule,
		FormsModule,
	],
	providers: [
		GoogleAnalyticsEventsService,
		Title,
		ExampleService,
		AlertsService,
		BabiesService,
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
