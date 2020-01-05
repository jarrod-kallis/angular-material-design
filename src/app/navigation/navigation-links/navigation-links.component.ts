import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-links',
  templateUrl: './navigation-links.component.html',
  styleUrls: ['./navigation-links.component.css']
})
export class NavigationLinksComponent implements OnInit {
  @Input() displayIcons: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  displayIcon(): boolean {
    return this.displayIcons;
  }
}
