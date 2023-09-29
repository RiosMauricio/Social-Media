import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionService } from 'src/app/services/subscription.service';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriberId!: number;
  subscribedToId!: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    this.subscriberId = this.data.subscriberId; 
    this.subscribedToId = this.data.subscribedToId
  }

  subscribe(){
    this.subscriptionService.subscribe(this.subscriberId, this.subscribedToId).subscribe((result: any)=>{
        console.log(result)
    })
    window.location.reload(); 
  }

}
