import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})

export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: []},
    byCountry: { term: '', countries: []},
    byRegion: { region: undefined, countries: []}
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStorage', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(){
    if (!localStorage.getItem('cacheStorage')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStorage')!);
  }

  searchCountryByAlphaCode( code: string): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null),
        catchError( () => of((null)) )
      );
  }

  searchByCapital(term: string): Observable<Country[]>{
    return this.http.get<Country[]>(`${this.apiUrl}/capital/${term}`)
      .pipe(
        tap(countries => this.cacheStore.byCapital = {term, countries}),
        tap( () =>  this.saveToLocalStorage()),
        catchError( () => of([]))
      );
  }

  searchByCountry(term: string): Observable<Country[]>{
    return this.http.get<Country[]>(`${this.apiUrl}/name/${term}`)
      .pipe(
        tap(countries => this.cacheStore.byCountry = {term, countries}),
        tap( () =>  this.saveToLocalStorage()),
        catchError( () => of([]))
      );
  }

  searchByRegion(term: Region): Observable<Country[]>{
    return this.http.get<Country[]>(`${this.apiUrl}/region/${term}`)
      .pipe(
        tap(countries => this.cacheStore.byRegion = {region: term, countries}),
        tap( () =>  this.saveToLocalStorage()),
        catchError( () => of([]))
      );
  }

}
