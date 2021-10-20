import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public gameState: BehaviorSubject<string> = new BehaviorSubject('start');
  public bgSound = new Audio();
  public bgSoundCurrentTime: any = 0;


  constructor() { 
    this.bgSound.src = "assets/images/queenswaySound.mp3";
    this.bgSound.loop = true;
    this.bgSound.addEventListener('loadeddata', () => {
      if (this.bgSound.readyState >=3) this.bgSound.currentTime = this.bgSoundCurrentTime;
    });
  }

  changeGameState(gameState: string) {
    this.gameState.next(gameState);
  }

  startBackGroundSound() {
    this.bgSound.load();
    this.bgSound.play();
  }

  stopBackGroundSound() {
    this.bgSoundCurrentTime = this.bgSound.currentTime;
    this.bgSound.pause();
  }
}
