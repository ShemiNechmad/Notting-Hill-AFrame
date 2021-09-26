import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public gameState: BehaviorSubject<string> = new BehaviorSubject('start');

  constructor() { }

  changeGameState(gameState: string) {
    this.gameState.next(gameState);
  }
}
