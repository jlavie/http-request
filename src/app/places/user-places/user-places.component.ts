import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;
  
    ngOnInit(): void {
      this.isFetching.set(true);
      const subsription = this.placesService
      .loadUserPlaces()
      .subscribe({
        error: (error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });
  
      this.destroyRef.onDestroy(() => {
        subsription.unsubscribe();
      })
    }

    onRemovePlace(selectedPlace: Place) {
      const subscription = this.placesService.removeUserPlace(selectedPlace)
        .subscribe({
          next: (resData) => console.log(resData),
        });
  
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        })
    }  
  }
