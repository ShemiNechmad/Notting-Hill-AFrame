import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManageCarsService } from './manage-cars.service';
import { HeastToSouth1, HeastToWest1, HsouthToEast1, HsouthToWest1, HwestToEast1, HwestToNorth1 } from './models/humanRoutes';
import { Humans } from './models/humans'

@Injectable({
  providedIn: 'root'
})
export class ManageHumansService {

  public minHumansNumber: number = 8;
  public maxHumansNumber: number = 10;
  public humansSubject = new BehaviorSubject<any>(Humans);
  public humans = Humans;
  public routes = ['HeastToWest1', 'HsouthToEast1', 'HwestToEast1', 'HeastToSouth1', 'HsouthToWest1', 'HwestToNorth1'];
  public HsouthToWest1 = HsouthToWest1;
  public HeastToWest1 = HeastToWest1;
  public HwestToEast1 = HwestToEast1;
  public HwestToNorth1 = HwestToNorth1;
  public HsouthToEast1 = HsouthToEast1;
  public HeastToSouth1 = HeastToSouth1;
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
    let numberOfEnabled = 0;
    switch (human.dir) {
      case 'HsouthToWest1':
        numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && h.dir === 'HsouthToWest1' ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: 180, z: 0 };
        if (currentHumansNumber < 6) human.position.z = 40;
        positionZ = human.position.z;
        this.humans.forEach(h => {
          if (h.enabled && h.dir === 'HsouthToWest1' && positionZ - h.position.z < 3)
            positionZ = positionZ + (8 * numberOfEnabled);
        })
        human.position.z = positionZ;
        break;
      case 'HsouthToEast1':
        numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && h.dir === 'HsouthToEast1' ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: 180, z: 0 };
        if (currentHumansNumber < 6) human.position.z = 40;
        positionZ = human.position.z;
        this.humans.forEach(h => {
          if (h.enabled && h.dir === 'HsouthToEast1' && positionZ - h.position.z < 3)
            positionZ = positionZ + (8 * numberOfEnabled);
        })
        human.position.z = positionZ;
        break;
      case 'HeastToSouth1':
        numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && h.dir === 'HeastToSouth1' ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: -90, z: 0 };
        if (currentHumansNumber < 6) {
          human.position.x = 30;
          human.position.z = 4.5;
        }
        positionX = human.position.x;
        positionZ = human.position.z;
        this.humans.forEach(h => {
          if (h.enabled && h.dir === 'HeastToSouth1' && positionX - h.position.x < 3 && positionX - h.position.x > 0) {
            positionX = positionX + (8 * numberOfEnabled);
            positionZ = positionZ - (1.5 * numberOfEnabled);
          }
        })
        human.position.x = positionX;
        human.position.z = positionZ;
        break;
      case 'HwestToEast1':
        numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && (h.dir === 'HwestToEast1' || h.dir === 'HwestToNorth1') ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: 90, z: 0 };
        if (currentHumansNumber < 6) human.position.x = -30;
        positionX = human.position.x;
        this.humans.forEach(h => {
          if (h.enabled && (h.dir === 'HwestToEast1' || h.dir === 'HwestToNorth1') && h.position.x - positionX < 3 && h.position.x - positionX > 0)
            positionX = positionX - (8 * numberOfEnabled);
        })
        human.position.x = positionX;
        break;
      case 'HwestToNorth1':
        numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && (h.dir === 'HwestToNorth1' || h.dir === 'HwestToEast1') ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: 90, z: 0 };
        if (currentHumansNumber < 6) human.position.x = -30;
        positionX = human.position.x;
        this.humans.forEach(h => {
          if (h.enabled && (h.dir === 'HwestToNorth1' || h.dir === 'HwestToEast1') && h.position.x - positionX < 3 && h.position.x - positionX > 0)
            positionX = positionX - (8 * numberOfEnabled);
        })
        human.position.x = positionX;
        break;
      case 'HeastToWest1':
        numberOfEnabled = 0;
        this.humans.forEach(h => { h.enabled && (h.dir === 'HeastToWest1' || h.dir === 'HeastToNorth1') ? numberOfEnabled++ : null; });
        human.rotation = { x: 0, y: 278, z: 0 };
        positionX = human.position.x;
        positionZ = human.position.z;
        this.humans.forEach(h => {
          if (h.enabled && (h.dir === 'HeastToWest1' || h.dir === 'HeastToNorth1') && positionX - h.position.x < 3 && positionX - h.position.x > 0) {
            positionX = positionX + (8 * numberOfEnabled);
            positionZ = positionZ - (1.5 * numberOfEnabled);
          }
        })
        human.position.x = positionX;
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
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else if (human.position.x > human.route.end.x) {
          human.position.x = human.position.x - human.speed;
          human.rotation.y = -90;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else {
          human.enabled = false;
          this.humansSubject.next(this.humans);
          return;
        }
      //SOUTH TO EAST
      case 'HsouthToEast1':
        if (human.position.z > human.route.turningPoint1.z) {
          human.position.z = human.position.z - human.speed;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else if (human.position.x < human.route.end.x) {
          human.position.x = human.position.x + human.speed;
          human.position.z = human.position.z - human.speed / 7.4;
          human.rotation.y = 90;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else {
          human.enabled = false;
          this.humansSubject.next(this.humans);
          return;
        }
      // EAST TO SOUTH
      case 'HeastToSouth1':
        if (human.position.x > human.route.turningPoint1.x) {
          human.position.x = human.position.x - human.speed;
          human.position.z = human.position.z + human.speed / 7.4;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else if (human.position.z < human.route.end.z) {
          human.position.z = human.position.z + human.speed;
          human.rotation.y = 0;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else {
          human.enabled = false;
          this.humansSubject.next(this.humans);
          return;
        }
      // EAST TO WEST
      case 'HeastToWest1':
        if (human.position.x > human.route.turningPoint1.x) {
          human.position.x = human.position.x - human.speed;
          human.position.z = human.position.z + human.speed / 7.4;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else if (human.position.x > human.route.end.x) {
          human.position.x = human.position.x - human.speed;
          human.rotation.y = 270;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else {
          human.enabled = false;
          this.humansSubject.next(this.humans);
          return;
        }
      //WEST TO EAST
      case 'HwestToEast1':
        if (human.position.x < human.route.turningPoint1.x) {
          human.position.x = human.position.x + human.speed;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else if (human.position.x < human.route.end.x) {
          human.position.x = human.position.x + human.speed;
          human.position.z = human.position.z - human.speed / 7.4;
          human.rotation.y = 98;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else {
          human.enabled = false;
          this.humansSubject.next(this.humans);
          return;
        }
      // WEST TO NORTH
      case 'HwestToNorth1':
        if (human.position.x < human.route.turningPoint1.x) {
          human.position.x = human.position.x + human.speed;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
          return;
        }
        else if (human.position.z > human.route.end.z) {
          human.position.z = human.position.z - human.speed;
          human.rotation.y = 180;
          this.humansSubject.next(this.humans);
          setTimeout(() => { this.humanWalking(human); }, 80);
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