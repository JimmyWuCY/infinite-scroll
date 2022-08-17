import { Component, OnInit } from '@angular/core';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';


@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.css']
})
export class InfiniteScrollComponent implements OnInit {

  array: Array<any> = [];
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  private direction = "";
  private sum = 200;

  constructor(
  ) { }

  ngOnInit(): void {
    this.addItems(0, this.sum, "push");
  }

  addItems(startIndex: number, endIndex: number, _method: any) {
    for (let i = 0; i < this.sum; ++i) {
      this.array[_method]([i, " ", this.generateWord()].join(""));
    }
  }

  onScrollDown() {
    console.log("scrolled down!!");
    const start = this.sum;
    this.sum += 20;
    this.addItems(start, this.sum, "push");

    this.direction = "down";
  }

  // onUp() {
  //   console.log("scrolled up!");
  //   const start = this.sum;
  //   this.sum += 20;
  //   this.addItems(start, this.sum, "unshift");

  //   this.direction = "up";
  // }
  generateWord() {
    return Math.random();
  }

}
