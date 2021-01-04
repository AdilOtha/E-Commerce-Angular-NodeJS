import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: true } }]
})
export class HeaderComponent implements OnInit {

  cartData:CartModelServer;
  cartTotal:number;
  constructor(public cartService:CartService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total=>{
      this.cartTotal = total;
    })

    this.cartService.cartDataObs$.subscribe(data=>{
      this.cartData = data;
    })
  }



}
