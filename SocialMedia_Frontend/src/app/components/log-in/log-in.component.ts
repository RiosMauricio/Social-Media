import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Category } from 'src/app/models/category';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { LogInService } from 'src/app/services/log-in.service';;
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  newUser = new User; 
  logUser = new User; 
  categories = new FormControl('');
  categoriesList: Category[] = [];
  valid = false; 
  passwordInvalid = false; 

  constructor(private router: Router, private userService: UserService, 
    private categoryService: CategoryService, private loginService: LogInService, private route: ActivatedRoute) {
    this.newUser = new User(); 
    this.logUser = new User(); 
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((result)=>{
      this.categoriesList = result.data.category; 
    })
  }

  async createUser(){
    this.newUser.categories = this.categories.value
    this.newUser.description = "Hola!, Bienvenido a mi perfil"
     this.userService.createUser(this.newUser).subscribe(async (result: any)=>{
      console.log(result, "usuario generado con exito"); 
      this.valid = true; 
      if(this.valid == true){
        console.log("El usuario fue creado.  Inicie sesion. ")
      }else{
        console.log("datos para crear usuario incorrectos")
      }
    })
  }

  login():void{
    this.loginService.postLogin(this.logUser.email, this.logUser.password).subscribe(async (data: any)=>{
      if(data.status == 0){
        this.passwordInvalid = true; 
        console.log("email de usuario o contraseña incorrectos.")
      }
      else if(data.status == 1){
        var user = data.user
        sessionStorage.setItem("id", user.id); 
        sessionStorage.setItem("username", user.username); 
        sessionStorage.setItem("email", user.email); 
        sessionStorage.setItem("token", data.token); 
        await this.router.navigate(['/profile/'+user.id])
      }
    })
  }

}
