import {Component, OnDestroy, OnInit, NgModule} from "@angular/core";
import {Subject, Observable, ReplaySubject, BehaviorSubject, Subscription} from "rxjs/Rx";

import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {$WebSocket as WebSocket} from 'angular2-websocket/angular2-websocket'
import {Config} from "../shared/config/env.config";
import {Station} from "../models/index";
import * as _ from 'lodash'
import {Subscribable} from "rxjs/Observable";
import * as Immutable from 'immutable';

@Component({
  moduleId: module.id,
  selector: 'dashboard-component',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private webSocket: WebSocket = new WebSocket(Config.WS_API + '/feed');
  private _stations: Station[] = new Array<Station>();

  constructor() {
  }

  stationUpdates: Subscription;

  ngOnInit() {
    const RIGHT_EVENTS = ['station_update'];

    let allEvents: Observable<any> = this.webSocket.getDataStream().asObservable();
    let [liveEvents, rightEvents] = allEvents
      .map((messageEvent: MessageEvent, index: number) => JSON.parse(messageEvent.data))
      .partition((what: any) => RIGHT_EVENTS.includes(_.get<string>(what, 'type', undefined)));

    let stationUpdates = liveEvents.map(this.stationToLiveEvent)
      .filter((liveEvent: any) => _.get<string>(liveEvent, 'type', undefined) === 'station_update')
      .map((liveEvent: any) => liveEvent.station)
      .subscribe((station: Station) => this.setStation(station));
  }

  get stations(): ArrayLike<Station> {
    return this._stations
  }

  ngOnDestroy() {
    this.stationUpdates.unsubscribe()
  }

  stationToLiveEvent(liveEvent: any): Station {
    liveEvent['station'] = Station.fromObject(_.get<any>(liveEvent, 'record', {}));
    return liveEvent
  }

  setStation(station: Station): void {
    let index = this._stations.findIndex((stationInArray: Station) => station.key === stationInArray.key);
    if (index === -1) this._stations.push(station);
    this._stations[index] = station
  }

  currentStation: Station = new Station();

  openStation(event: Event, key: String): void {
    if(event && event.preventDefault) event.preventDefault();
    this.currentStation = this._stations.find((station: Station) => station.key === key);
  }
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: DashboardComponent}
    ])
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}

@NgModule({
  imports: [CommonModule, DashboardRoutingModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DashboardModule {

}


