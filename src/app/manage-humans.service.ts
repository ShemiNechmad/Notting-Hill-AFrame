import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManageCarsService } from './manage-cars.service';
import { HsouthToWest1 } from './models/humanRoutes';
import { Humans } from './models/humans'

@Injectable({
  providedIn: 'root'
})
export class ManageHumansService {

  public minHumansNumber: number = 6;
  public maxHumansNumber: number = 10;
  public humansSubject = new BehaviorSubject<any>(Humans);
  public humans = Humans;
  public routes = ['HsouthToWest1', 'HsouthToWest1', 'HsouthToWest1', 'HsouthToWest1', 'HsouthToWest1', 'HsouthToWest1'];
  public HsouthToWest1 = HsouthToWest1;
  public trafficLightDirection: string = 'west';
  public trafficLightDirectionSubject: BehaviorSubject<any> = new BehaviorSubject('west');

  constructor(private mc: ManageCarsService) {
    this.mc.trafficLightDirectionSubject.subscribe(d => { this.trafficLightDirection = d });
  }

  manageHumans() {
    let currentHumansNumber = 0;
    this.humans.forEach(h => h.enabled ? currentHumansNumber++ : null);
    if (currentHumansNumber >= this.maxHumansNumber) return;
    if (currentHumansNumber <= this.minHumansNumber) this.createHuman(currentHumansNumber);
    else if (Math.floor(Math.random() * 2) === 1) this.createHuman(currentHumansNumber);
  }

  createHuman(currentHumansNumber: number) {
    let humanDisabled = false;
    let human = null;
    do {
      let humanIndex = Math.floor(Math.random() * 10);
      human = this.humans[humanIndex];
      if (!human.enabled) humanDisabled = true;
    }
    while (!humanDisabled)

    human.dir = this.routes[Math.floor(Math.random() * 6)];
    human.route = this[human.dir];
    human.position = JSON.parse(JSON.stringify(human.route.start));
    let positionX; let positionZ;
    switch (human.dir) {
      case 'HsouthToWest1':
        let numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && h.dir === 'HsouthToWest1' ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: 180, z: 0 };
        if (currentHumansNumber < 6) human.position.z = 40;
        positionZ = human.position.z;
        this.humans.forEach(h => {
          if (h.enabled && h.dir === 'HsouthToWest1' &&  positionZ - h.position.z < 3)
            positionZ = positionZ + (8 * numberOfEnabled);
        })
        human.position.z = positionZ;
        break;
    }
    human.enabled = true;
    this.humanWalking(human);
  }

  humanWalking(human: any) {
    switch (human.dir) {
      //SOUTH TO WEST
      case 'HsouthToWest1':
        if (human.position.z > human.route.turningPoint1.z) {
          human.position.z = human.position.z - human.speed;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 100);
          return;
        }
        else if (human.position.x > human.route.end.x) {
          human.position.x = human.position.x - human.speed;
          human.rotation.y = -90;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 100);
          return;
        }
        else {
          human.enabled = false;
          this.humansSubject.next(this.humans);
          return;
        }
    }

  }
}