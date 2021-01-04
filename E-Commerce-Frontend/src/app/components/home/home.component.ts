import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import {Router} from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private productService: ProductService, private router : Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((prod:ServerResponse)=>{
      this.products=prod.products;
      console.log(this.products);
    })
  }

  selectProduct(productId:number){
    this.router.navigate(['/product',productId]);
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

}
