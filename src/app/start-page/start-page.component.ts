import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  public gameState = 'start';

  constructor(private router: Router, private ms: MainService) { }

  ngOnInit() {
  }


  startGame() {
    this.ms.changeGameState('playing');
    this.router.navigate(['crossing']);
  }

}
