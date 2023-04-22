import { Component, OnInit } from '@angular/core';
import { Package } from 'src/app/models/package';
import { LogInService } from 'src/app/services/log-in.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-pack-form',
  templateUrl: './pack-form.component.html',
  styleUrls: ['./pack-form.component.css']
})
export class PackFormComponent implements OnInit {
  loggedUserId!: number
  pack = new Package;

  constructor(private logInService: LogInService,private packageService: PackageService) { 
    this.pack = new Package()
  }

  ngOnInit(): void {
    this.loggedUserId = this.logInService.userLoggedId()!
    console.log(this.loggedUserId)
  }

  createPackage(){
    this.packageService.createPackage(this.loggedUserId , this.pack).subscribe((result: any)=>{
      
    })
  }

}
