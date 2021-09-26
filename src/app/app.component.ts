import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public bgSound = new Audio();


  constructor(private router: Router) {
    this.bgSound.src = "assets/images/queenswaySound.mp3";
    this.bgSound.load();
    this.bgSound.loop = true;


    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        if (data.url === "/crossing") {
          this.bgSound.play();
        }
        else this.bgSound.pause();
      }
    })
  }


  ngOnInit() {
  }

}
