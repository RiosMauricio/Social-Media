import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogInService } from 'src/app/services/log-in.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  constructor(private loginService: LogInService, private router: Router) { 
    if (loginService.userLoggedIn() == false) {
      this.router.navigate(['log-in']);
    }
  }

  ngOnInit(): void {
  }

}
