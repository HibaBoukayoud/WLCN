import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { VisualizationComponent } from './pages/visualization/visualization.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { DopplerRangeComponent } from './components/doppler-range/doppler-range.component';
import { AngleRangeComponent } from './components/angle-range/angle-range.component';
import { TargetCounterComponent } from './components/target-counter/target-counter.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    VisualizationComponent,
    StatisticsComponent,
    DopplerRangeComponent,
    AngleRangeComponent,
    TargetCounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
