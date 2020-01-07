import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-link',
  templateUrl: './navigation-link.component.html',
  styleUrls: ['./navigation-link.component.css']
})
export class NavigationLinkComponent implements OnInit {
  @Input() routerLink: string;
  @Input() iconName: string;
  @Input() caption: string;
  @Input() navigationCaptionClass: string = '';

  @Output() onClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  displayIcon(): boolean {
    return !!this.iconName;
  }

  getCaptionClass(): string {
    return 'caption ' + this.navigationCaptionClass;
  }

  onLinkClick() {
    if (this.onClick) {
      this.onClick.emit();
    }
  }
}
