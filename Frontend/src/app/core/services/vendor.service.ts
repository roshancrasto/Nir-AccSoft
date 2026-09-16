import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendor {
  vendorId: number;
  vendorName: string;
  contactNumber: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = environment.apiUrl + '/Vendor';

  constructor(private http: HttpClient) { }

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl);
  }

  createVendor(vendor: Partial<Vendor>): Observable<any> {
    return this.http.post(this.apiUrl, vendor);
  }

  updateVendor(id: number, vendor: Vendor): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vendor);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
