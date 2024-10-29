import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureCollection } from 'geojson';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams()
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  /*
  calls the default dbtest route from the backend
  */ 

  // Method to get mining data //
  public miningData(buffer : number): Observable<FeatureCollection>  {
    const url = environment.api + '/real/mining?buffer=' + buffer;
    return this.http.get<FeatureCollection>(url, httpOptions);
  }

    // Method to get ethnic data Senegal
    public ethnicDataSenegal(ethnic_group: number): Observable<ArrayBuffer> {
      const requestUrl = environment.api + '/real/ethnic?ethnic_group=' + ethnic_group;
      return this.http.get(requestUrl, { responseType: "arraybuffer" });
    }

  // Method to get ethnic data Congo
  public ethnicDataCongo(ethnic_group: number): Observable<ArrayBuffer> {
    const requestUrl = environment.api + '/real/ethnic?ethnic_group=' + ethnic_group;
    return this.http.get(requestUrl, { responseType: "arraybuffer" });
  }

  // Method to get ethnic data Kenya
  public ethnicDataKenya(ethnic_group: number): Observable<ArrayBuffer> {
    const requestUrl = environment.api + '/real/ethnic?ethnic_group=' + ethnic_group;
    return this.http.get(requestUrl, { responseType: "arraybuffer" });
  }

  // Method to get conflict data
  public conflictData(type_of_violence: number): Observable<FeatureCollection>  {
    const url = environment.api + '/real/conflict?type_of_violence=' + type_of_violence;

    return this.http.get<FeatureCollection>(url, httpOptions);
  }

}
