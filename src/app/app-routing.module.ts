import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { NewNameComponent } from './components/new-name/new-name.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RulesComponent } from './components/rules/rules.component';

const routes: Routes = [
	{ path: 'app', component: HomeComponent },
	{ path: 'discover', component: DiscoverComponent },
	{ path: 'new-name', component: NewNameComponent },
	{ path: 'rules', component: RulesComponent },
	{ path: '', component: HomeComponent },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
