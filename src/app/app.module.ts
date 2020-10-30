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
import { CookieService } from 'ngx-cookie-service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

// services
import { GoogleAnalyticsEventsService } from './services/GoogleAnalyticsEvents/GoogleAnalyticsEvents.service';
import { EmailsService } from './services/emails/emails.service';
import { AlertsService } from './services/alerts/alerts.service';

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
import { EmailComponent } from './components/email/email.component';
import { AccountComponent } from './components/account/account.component';
import { FormInfoUpdateComponent } from './components/form-info-update/form-info-update.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { UpdateAliasComponent } from './components/update-alias/update-alias.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		NotFoundComponent,
		GlobalNavbarComponent,
		AlertsComponent,
		HomeComponent,
		LoginComponent,
		ComposeComponent,
		EmailComponent,
		AccountComponent,
		FormInfoUpdateComponent,
		UpdatePasswordComponent,
		UpdateAliasComponent,
		ResetPasswordComponent,
		SafeHtmlPipe
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
		SocketIoModule.forRoot(config),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		GoogleAnalyticsEventsService,
		Title,
		EmailsService,
		AlertsService,
		CookieService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
