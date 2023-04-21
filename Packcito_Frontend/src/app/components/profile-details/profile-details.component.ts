import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { CategoryService } from 'src/app/services/category.service';
import { LogInService } from 'src/app/services/log-in.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  image: any

  id!: string; 
  actualPassword: string = ""
  newPassword: string=""

  userCategories: Category[] = [] //Categorias del usuario en sesion
  userCategoriesName: String[] = [] //Nombre de las categorias del usuario en sesion
  categories = new FormControl('');
  categoriesList: Category[] = []; //nuevas categorias que el usuario puede ingresar

  changePassword = false; 
  editingProfilePhoto = false; 
  editingBanner = false; 

  logUser = new User; 
  modifiedUser: any; //usuario modificado con los nuevos datos a guardar
  modifiedPassword = {actualPassword:"", newPassword:""}

  constructor(private userService: UserService, private loginService: LogInService, private categoryService: CategoryService, private router: Router, private cdr: ChangeDetectorRef) {
    this.logUser = new User();
    if(loginService.userLoggedIn()==false){
      this.router.navigate(['log-in']);
    }
   }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((result)=>{
      this.categoriesList = result.data.category; 
    })

    this.id = this.loginService.userLoggedId()!
    this.getUser(); 

    this.userService.getUserCategories(this.id).subscribe((result:any)=>{
      for(var i=0; i<result.data.categories.length; i++){
        this.userCategories.push(result.data.categories[i].A)
        this.categoryService.getCategory(result.data.categories[i].A).subscribe((result)=>{
          this.userCategoriesName.push(result.data.category.name)
        })
      }
      console.log(this.userCategoriesName) 
    })
}

  getUser(){
    this.userService.getUser(this.id).subscribe((result)=>{
      this.logUser = result.data.user; 
      if(this.logUser.profilePhoto.startsWith("uploads\\")){
        this.logUser.profilePhoto = this.logUser.profilePhoto.split("\\")[1]
      }
      if(this.logUser.banner.startsWith("uploads\\")){
        this.logUser.banner = this.logUser.banner.split("\\")[1]
      }
      console.log(this.logUser)
    })
  }

  updateProfile(){
    this.modifiedUser = this.logUser;
    if(this.categories.value == ""){
      this.modifiedUser.categories = this.userCategories;
      console.log(this.userCategories)
    }else{
      this.modifiedUser.categories = this.categories.value;
    }
    this.userService.updateUser(this.modifiedUser).subscribe((result)=>{
      console.log(result)
      console.log(this.modifiedUser)
    })
  }

  selectImage($event: any){
    console.log($event.target)
    const file = $event.target.files[0]; 
      this.image = file
      console.log(this.image)
  }

  updateProfilePhoto(){
    if(this.editingProfilePhoto == true){
      const formData = new FormData(); 
    formData.append('file', this.image); 

    this.userService.updateProfilePhoto(this.logUser.id, formData).subscribe((result: any) => {
      this.logUser.profilePhoto = result.filename;
      // Detectar cambios para actualizar la vista
      this.cdr.detectChanges();
    })
    }
    this.editingProfilePhoto = false; 
  }

  updateBanner(){
    if(this.editingBanner == true){
      const formData = new FormData(); 
    formData.append('file', this.image); 

    this.userService.updateBanner(this.logUser.id, formData).subscribe((result: any) => {
      this.logUser.banner = result.filename;
      // Detectar cambios para actualizar la vista
      this.cdr.detectChanges();
    })
    }
    this.editingBanner = false; 
  }

  updatePassword(){
    this.modifiedPassword.actualPassword = this.actualPassword;
    this.modifiedPassword.newPassword = this.newPassword;

    this.userService.updatePassword(this.logUser.id, this.modifiedPassword).subscribe((result)=>{
      console.log(result)
    })
    console.log(this.modifiedPassword)
  }
}