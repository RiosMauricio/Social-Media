import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LogInService } from 'src/app/services/log-in.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  id!: number; 
  sessionUser = new User; 
  sessionActive!: boolean; 
  constructor(private loginService: LogInService, private router: Router, private userService: UserService) { 
    this.sessionUser = new User(); 
  }

  ngOnInit(): void {
    if (this.loginService.userLoggedIn() == false){
      this.sessionActive = false; 
    }else{
      this.sessionActive = true; 
    }
    this.id = this.loginService.userLoggedId()!
  }

  async viewProfile(){
    await this.router.navigate(['/profile/'+this.id])
    console.log("hola")
    window.location.reload();
  }

  logOut(){
    this.loginService.logOut();
    this.router.navigate(['/log-in']);
    console.log("sesion cerrada")
  }
}
