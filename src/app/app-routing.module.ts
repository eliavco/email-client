import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ComposeComponent } from './components/compose/compose.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { EmailComponent } from './components/email/email.component';
import { AccountComponent } from './components/account/account.component';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
	{ path: 'app', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'compose', component: ComposeComponent, canActivate: [AuthGuard] },
	{ path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'email/:emailId', component: EmailComponent, canActivate: [AuthGuard] },
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
