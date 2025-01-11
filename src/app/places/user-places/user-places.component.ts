import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  
    ngOnInit(): void {
      this.isFetching.set(true);
      const subsription = this.httpClient
      .get<{places: Place[] }>('http://localhost:3000/user-places')
      .pipe(catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Something went wrong fetching your favorite places. Please try aain later'))
      }))
      .subscribe({
        next: (resData) => {
          this.places.set(resData.places);
        },
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
  }
