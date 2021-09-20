import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { eastToSouth, southToEast, southToWest, westToEast } from './models/routes';
import { Vehicles } from './models/vehicles';

@Injectable({
  providedIn: 'root'
})
export class ManageCarsService {

  public minVehiclesNumber: number = 6;
  public maxVehiclesNumber: number = 10;
  public vehiclesSubject = new BehaviorSubject<any>(Vehicles);
  public vehicles = Vehicles;
  public routes = ['westToEast', 'westToEast', 'southToWest', 'southToEast', 'eastToSouth', 'eastToSouth'];
  public southToWest = southToWest;
  public southToEast = southToEast;
  public eastToSouth = eastToSouth;
  public westToEast = westToEast;
  public trafficLightDirection: string = 'west';
  public trafficLightDirectionSubject: BehaviorSubject<any> = new BehaviorSubject('west');

  constructor() {
    this.manageTrafficLight();
  }

  manageTrafficLight() {
    setTimeout(() => {
      if (this.trafficLightDirection === 'west') this.trafficLightDirection = 'south';
      else if (this.trafficLightDirection === 'south') this.trafficLightDirection = 'east';
      else if (this.trafficLightDirection === 'east') this.trafficLightDirection = 'west';
      this.trafficLightDirectionSubject.next(this.trafficLightDirection);
      this.manageTrafficLight();
    }, 15000);
  }

  manageVehicles() {
    let currentVehiclesNumber = 0;
    this.vehicles.forEach(v => v.enabled ? currentVehiclesNumber++ : null);
    if (currentVehiclesNumber >= this.maxVehiclesNumber) return;
    if (currentVehiclesNumber <= this.minVehiclesNumber) this.createVehicle(currentVehiclesNumber);
    else if (Math.floor(Math.random() * 2) === 1) this.createVehicle(currentVehiclesNumber);
  }

  createVehicle(currentVehiclesNumber: number) {
    let vehicleDisabled = false;
    let vehicle = null;
    do {
      let vehicleIndex = Math.floor(Math.random() * 10);
      vehicle = this.vehicles[vehicleIndex];
      if (!vehicle.enabled) vehicleDisabled = true;
    }
    while (!vehicleDisabled)

    vehicle.dir = this.routes[Math.floor(Math.random() * 6)];
    vehicle.route = this[vehicle.dir];
    vehicle.position = JSON.parse(JSON.stringify(vehicle.route.start));
    let positionX; let positionZ;
    switch (vehicle.dir) {
      case 'southToWest':
        vehicle.rotation = { x: 0, y: -90, z: 0 };
        if (currentVehiclesNumber < 4) vehicle.position.z = 40;
        positionZ = vehicle.position.z;
        this.vehicles.forEach(v => { v.enabled && v.dir === 'southToWest' && v.position.z - positionZ < 10 ? positionZ = positionZ + 12 : null; })
        vehicle.position.z = positionZ;
        break;
      case 'southToEast':
        vehicle.rotation = { x: 0, y: -90, z: 0 };
        if (currentVehiclesNumber < 4) vehicle.position.z = 30;
        positionZ = vehicle.position.z;
        this.vehicles.forEach(v => { v.enabled && v.dir === 'southToEast' && v.position.z - positionZ < 10 ? positionZ = positionZ + 12 : null; })
        vehicle.position.z = positionZ;
        break;
      case 'westToEast':
        vehicle.rotation = { x: 0, y: 180, z: 0 };
        if (currentVehiclesNumber < 4) vehicle.position.x = -30;
        positionX = vehicle.position.x;
        this.vehicles.forEach(v => { v.enabled && v.dir === 'westToEast' && v.position.x - positionX < 10 && v.position.x - positionX > 0 ? positionX = positionX - 20 : null; })
        vehicle.position.x = positionX;
        break;
      case 'eastToSouth':
        vehicle.rotation = { x: 0, y: 8, z: 0 };
        if (currentVehiclesNumber < 4) { vehicle.position.x = 40; vehicle.position.z = -3.6 };
        positionZ = vehicle.position.z;
        positionX = vehicle.position.x;
        this.vehicles.forEach(v => {
          if (v.enabled && v.dir === 'eastToSouth' && v.position.x - positionX < 8) { positionX = positionX + 10; positionZ = positionZ - 1.3 }
        })
        vehicle.position.x = positionX;
        vehicle.position.z = positionZ;
        break;
    }
    vehicle.enabled = true;
    this.vehicleOnRoad(vehicle);
  }

  vehicleOnRoad(vehicle: any) {
    //AVOIDING BUMP TO A FRONT VEHICLE CODE.
    let stopFunction = false;
    switch (vehicle.dir) {
      case 'southToWest':
        this.vehicles.forEach(v => {
          if (v.enabled && v.dir === 'southToWest' && v.id != vehicle.id && vehicle.position.z - v.position.z < 7
            && vehicle.position.z - v.position.z > 0 && Math.abs(vehicle.position.x - v.position.x) < 7) {
            stopFunction = true;
          }
        })
        break;
      case 'southToEast':
        this.vehicles.forEach(v => {
          if (v.enabled && v.dir === 'southToEast' && v.id != vehicle.id && vehicle.position.z - v.position.z < 8
            && vehicle.position.z - v.position.z > 0 && Math.abs(vehicle.position.x - v.position.x) < 8) {
            stopFunction = true;
          }
        })
        break;
      case 'eastToSouth':
        this.vehicles.forEach(v => {
          if (v.enabled && v.dir === 'eastToSouth' && v.id != vehicle.id && vehicle.position.x - v.position.x < 7
            && vehicle.position.x - v.position.x > 0 && Math.abs(vehicle.position.z - v.position.z) < 7) {
            stopFunction = true;
          }
        })
        break;
      case 'westToEast':
        this.vehicles.forEach(v => {
          if (v.enabled && (v.dir === 'westToEast' || v.dir === 'southToEast') && v.id != vehicle.id && v.position.x - vehicle.position.x < 8
            && v.position.x - vehicle.position.x > 0 && Math.abs(v.position.z - vehicle.position.z) < 8 ) {
            stopFunction = true; 
          }
        })
        break;
    }
    if (stopFunction) {
      setTimeout(() => { this.vehicleOnRoad(vehicle); }, 500);
      return;
    }
    ///////////////////////////////////////////////////////////////////////
    switch (vehicle.dir) {
      //SOUTH TO WEST
      case 'southToWest':
        if (vehicle.position.z > vehicle.route.trafficLight.z) {
          vehicle.position.z = vehicle.position.z - vehicle.speed;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.z > vehicle.route.crossing1.z) {
          if (this.trafficLightDirection != 'south') {
            setTimeout(() => { this.vehicleOnRoad(vehicle); }, 500);
            return;
          }
          vehicle.position.z = vehicle.position.z - vehicle.speed;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.z > vehicle.route.crossing2.z) {
          vehicle.position.z = vehicle.position.z - vehicle.speed;
          vehicle.position.x = vehicle.position.x - vehicle.speed;
          vehicle.rotation.y = -45;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x < vehicle.route.crossing2.x) {
          if (vehicle.position.x < vehicle.route.end.x) {
            vehicle.enabled = false;
            this.vehiclesSubject.next(this.vehicles);
            return;
          }
          vehicle.position.x = vehicle.position.x - vehicle.speed;
          vehicle.rotation.y = 0;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        break;
      // SOUTH TO EAST
      case 'southToEast':
        if (vehicle.position.z > vehicle.route.trafficLight.z) {
          vehicle.position.z = vehicle.position.z - vehicle.speed;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.z > vehicle.route.crossing1.z) {
          if (this.trafficLightDirection != 'south') {
            setTimeout(() => { this.vehicleOnRoad(vehicle); }, 500);
            return;
          }
          vehicle.position.z = vehicle.position.z - vehicle.speed;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.z > vehicle.route.crossing2.z) {
          vehicle.position.z = vehicle.position.z - vehicle.speed;
          vehicle.position.x = vehicle.position.x + vehicle.speed;
          vehicle.rotation.y = 215;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x > vehicle.route.crossing2.x) {
          if (vehicle.position.x > vehicle.route.end.x) {
            vehicle.enabled = false;
            this.vehiclesSubject.next(this.vehicles);
            return;
          }
          vehicle.position.x = vehicle.position.x + vehicle.speed;
          vehicle.position.z = vehicle.position.z - vehicle.speed / 7.4;
          vehicle.rotation.y = 188;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        break;
      // EAST TO SOUTH
      case 'eastToSouth':
        if (vehicle.position.x > vehicle.route.trafficLight.x) {
          vehicle.position.x = vehicle.position.x - vehicle.speed;
          vehicle.position.z = vehicle.position.z + vehicle.speed / 7.4;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x > vehicle.route.crossing1.x) {
          if (this.trafficLightDirection != 'east') {
            setTimeout(() => { this.vehicleOnRoad(vehicle); }, 500);
            return;
          }
          vehicle.position.x = vehicle.position.x - vehicle.speed;
          vehicle.position.z = vehicle.position.z + vehicle.speed / 7.4;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x > vehicle.route.crossing2.x) {
          vehicle.position.z = vehicle.position.z + vehicle.speed;
          vehicle.position.x = vehicle.position.x - vehicle.speed;
          vehicle.rotation.y = 45;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x < vehicle.route.crossing2.x) {
          if (vehicle.position.z > vehicle.route.end.z) {
            vehicle.enabled = false;
            this.vehiclesSubject.next(this.vehicles);
            return;
          }
          vehicle.position.z = vehicle.position.z + vehicle.speed;
          vehicle.rotation.y = 90;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        break;
      // WEST TO EAST
      case 'westToEast':
        if (vehicle.position.x < vehicle.route.trafficLight.x) {
          vehicle.position.x = vehicle.position.x + vehicle.speed;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x < vehicle.route.crossing1.x) {
          if (this.trafficLightDirection != 'west') {
            setTimeout(() => { this.vehicleOnRoad(vehicle); }, 500);
            return;
          }
          vehicle.position.x = vehicle.position.x + vehicle.speed;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x < vehicle.route.crossing2.x) {
          vehicle.position.x = vehicle.position.x + vehicle.speed;
          vehicle.position.z = vehicle.position.z - vehicle.speed / 7.4;
          vehicle.rotation.y = 188;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        else if (vehicle.position.x > vehicle.route.crossing2.x) {
          if (vehicle.position.x > vehicle.route.end.x) {
            vehicle.enabled = false;
            this.vehiclesSubject.next(this.vehicles);
            return;
          }
          vehicle.position.x = vehicle.position.x + vehicle.speed;
          vehicle.position.z = vehicle.position.z - vehicle.speed / 7.4;
          vehicle.rotation.y = 188;
          this.vehiclesSubject.next(this.vehicles);
          setTimeout(() => { this.vehicleOnRoad(vehicle); }, 50);
          return;
        }
        break;
    }
  }
}
