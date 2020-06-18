import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// services
import { GoogleAnalyticsEventsService } from './services/GoogleAnalyticsEvents/GoogleAnalyticsEvents.service';
import { ExampleService } from './services/example/example.service';
import { AlertsService } from './services/alerts/alerts.service';
import { BabiesService } from './services/babies/babies.service';

// Utils
import { JwtInterceptor } from './utils/jwt.interceptor';
import { ErrorInterceptor } from './utils/error.interceptor';

// Components
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GlobalNavbarComponent } from './components/global-navbar/global-navbar.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ComposeComponent } from './components/compose/compose.component';

@NgModule({
	declarations: [
		AppComponent,
		NotFoundComponent,
		GlobalNavbarComponent,
		AlertsComponent,
		HomeComponent,
		LoginComponent,
		ComposeComponent
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
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
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
