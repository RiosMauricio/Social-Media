import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Package } from 'src/app/models/package';
import { LogInService } from 'src/app/services/log-in.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-pack-form',
  templateUrl: './pack-form.component.html',
  styleUrls: ['./pack-form.component.css']
})
export class PackFormComponent implements OnInit {
  imageUrl: any
  file!: File
  loggedUserId!: number
  pack = new Package;

  constructor(private logInService: LogInService,private packageService: PackageService, private cdr: ChangeDetectorRef) { 
    this.pack = new Package()
  }

  ngOnInit(): void {
    this.loggedUserId = this.logInService.userLoggedId()!
    console.log(this.loggedUserId)
    this.pack.price = 0;
    this.pack.icon = "defaultPackage.png"
  }

  createPackage(){
    this.packageService.createPackage(this.loggedUserId , this.pack, this.file).subscribe((result: any)=>{
      console.log("guardado", result)      
    })
  }

  selectImage($event: any){
    this.file = $event.target.files[0]; 
    this.pack.icon = this.file.name;
  
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
  }

}
