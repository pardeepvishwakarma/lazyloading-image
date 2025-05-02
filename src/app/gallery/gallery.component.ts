import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements OnInit {

  @ViewChild('anchor', { static: false }) anchor!: ElementRef;

  public images: any[] = [];
  public query: string = '';
  public page: number = 1;
  public loading = false;
  public selectedImage: any = null;
  private observer!: IntersectionObserver;

  /**
   * Creates an instance of GalleryComponent.
   * @param {HttpClient} http
   * @memberof GalleryComponent
   */
  constructor(private http: HttpClient) { }

  /**
   * Angular lifecycle
   *
   * @memberof GalleryComponent
   */
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.setupObserver();
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && this.query) {
        this.page++;
        this.fetchImages();
      }
    });

    if (this.anchor) {
      this.observer.observe(this.anchor.nativeElement);
    }
  }

  /**
   * Method to hit when search from input
   *
   * @memberof GalleryComponent
   */
  public onSearch(): void {
    this.page = 1;
    this.images = [];
    this.fetchImages();
  }

  /**
   * Increase page count and load more item with API call 
   *
   * @return {*} 
   * @memberof GalleryComponent
   */
  public loadMore(): void {
    if (this.loading) return;
    this.page++;
    this.fetchImages();
  }

  /**
   * Method to fetch data
   *
   * @return {*}  {void}
   * @memberof GalleryComponent
   */
  public fetchImages(): void {
    if (!this.query) return;
    this.loading = true;
    this.http.get(`https://pixabay.com/api/?key=${environment.apiKey}&q=${this.query}&image_type=photo&page=${this.page}&per_page=20`)
      .subscribe((res: any) => {
        this.images = [...this.images, ...res.hits];
        this.loading = false;
      });
  }

  /**
   * Method to set selected image for popup
   *
   * @param {*} [image]
   * @memberof GalleryComponent
   */
  public selectImage(image?: any): void {
    if (image) {
      this.selectedImage = image;
    } else {
      this.selectedImage = null;
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
