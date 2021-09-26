import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManageCarsService } from 'src/app/manage-cars.service';
import { ManageHumansService } from 'src/app/manage-humans.service';
import * as AFRAME from 'aframe';
import { MainService } from 'src/app/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crossing-site',
  templateUrl: './crossing-site.component.html',
  styleUrls: ['./crossing-site.component.scss']
})
export class CrossingSiteComponent implements OnInit, AfterViewInit {


  private sub: Subscription = new Subscription(null);
  public vehicles: any = [];
  public humans: any = [];
  gameState: string = 'start';
  @ViewChild('camera', { static: false }) camera: ElementRef;
  @ViewChild('rig', { static: false }) rig: ElementRef;
  @ViewChild('sky', { static: false }) sky: any;

  constructor(private cdr: ChangeDetectorRef, private mc: ManageCarsService, private mh: ManageHumansService, private ms: MainService, private router: Router) {
    this.ms.gameState.subscribe(data => { data === 'start' ? this.router.navigate(['']) : this.gameState = 'playing'; });
  }




  ngOnInit() {

  }

  ngAfterViewInit() {
    // this.rig.nativeElement.setAttribute('position', {x:170, y:0, z:-10});
    this.mc.manageVehicles();
    this.mh.manageHumans();
    // console.log(this.rig.nativeElement.getAttribute('position'));

    // this.camera.nativeElement.setAttribute('position', {x: 6, y: 6, z: 6});
    // AFRAME.registerComponent('camera-listener', {
    //   tick: function () {
    //     let camera = this.el.sceneEl.camera.el;
    //     console.log(camera.getAttribute('position'));
    //     camera.getAttribute('rotation');
    //   }
    // });
    // this.camera.object3D.rotation.set(
    //   THREE.Math.degToRad(15),
    //   THREE.Math.degToRad(30),
    //   THREE.Math.degToRad(90)
    // ); 
    this.sub.add(this.mc.vehiclesSubject.subscribe(data => {
      this.vehicles = data;
      this.cdr.detectChanges();
      this.updateVehicles();
    }));
    this.sub.add(this.mh.humansSubject.subscribe(data => {
      this.humans = data;
      this.cdr.detectChanges();
      this.updateHumans();
    }));
    this.manageSky();
  }

  ngAfterViewChecked(): void {

  }

  manageSky(y: number = 0) {
    if (this.router.url != "/crossing") return;
    let sky: any = document.getElementById('sky');
    y = y + 0.2;
    sky.object3D.rotation.set(
      AFRAME.THREE.Math.degToRad(0),
      AFRAME.THREE.Math.degToRad(y),
      AFRAME.THREE.Math.degToRad(0)
    );
    if (y >= 360) y = 0;
    setTimeout(() => {
      this.manageSky(y);
    }, 100);
  }


  updateVehicles() {
    this.vehicles.forEach(item => {
      if (item.enabled) {
        let v: any = document.getElementById(item.id);
        if (!v.getAttribute('src')) v.setAttribute('src', item.src);
        v.setAttribute('position', item.position);
        v.setAttribute('scale', item.scale);
        v.object3D.rotation.set(
          AFRAME.THREE.Math.degToRad(item.rotation.x),
          AFRAME.THREE.Math.degToRad(item.rotation.y),
          AFRAME.THREE.Math.degToRad(item.rotation.z)
        );
      }
    })
  }

  updateHumans() {
    this.humans.forEach(item => {
      if (item.enabled) {
        let v: any = document.getElementById(item.id);
        if (!v.getAttribute('src')) v.setAttribute('src', item.src);
        v.setAttribute('position', item.position);
        v.setAttribute('scale', item.scale);
        v.object3D.rotation.set(
          AFRAME.THREE.Math.degToRad(item.rotation.x),
          AFRAME.THREE.Math.degToRad(item.rotation.y),
          AFRAME.THREE.Math.degToRad(item.rotation.z)
        );
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
