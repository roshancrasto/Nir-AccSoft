import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Donor {
  donorId: number;
  donorName: string;
  mobileNumber: string;
  dPlace: string;
  dAddr1: string;
  dAddr2: string;
  dAddr3: string;
  dCity: string;
  dState: string;
  isUdyavarParish: boolean;
  panNumber: string;
  email: string;
  remarks: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private apiUrl = environment.apiUrl + '/Donor';

  constructor(private http: HttpClient) { }

  getDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.apiUrl);
  }

  createDonor(donor: Partial<Donor>): Observable<any> {
    return this.http.post(this.apiUrl, donor);
  }

  updateDonor(id: number, donor: Donor): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, donor);
  }

  deleteDonor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
