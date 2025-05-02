import { Component } from '@angular/core';
import { GalleryComponent } from './gallery/gallery.component';

@Component({
  selector: 'app-root',
  imports: [GalleryComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
