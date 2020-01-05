import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrls: ['./navigation-toolbar.component.css']
})
export class NavigationToolbarComponent implements OnInit {
  @Output() onToggleSideNav = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSideNavMenuClick() {
    this.onToggleSideNav.emit();
  }
}
