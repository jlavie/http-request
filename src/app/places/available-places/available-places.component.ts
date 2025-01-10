import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const subsription = this.httpClient
    .get<{places: Place[] }>('http://localhost:3000/places')
    .subscribe({
      next: (resData) => {
        this.places.set(resData.places);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });
    // const subsription = this.httpClient
    // .get<{places: Place[] }>('http://localhost:3000/places', {
    //   observe: 'event'
    // })
    // .subscribe({
    //   next: (event) => {
    //     console.log(event);
    //   }
    // });

    this.destroyRef.onDestroy(() => {
      subsription.unsubscribe();
    })
  }
}
