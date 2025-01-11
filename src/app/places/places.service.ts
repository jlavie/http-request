import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong fetching places. Please try again later')
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places', 
      'Something went wrong fetching your favorite places. Please try again later'
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces.places),
      })
    )
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update(prevPlaces => [...prevPlaces, place]);
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id
    })
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{places: Place[] }>(url)
      .pipe(catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage))
      }))
  }
}
