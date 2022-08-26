import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Citizen } from './citizen';

@Injectable()
export class CitizenService {

    citizenNames: string[] = [
        "David De Gea",
        "Victor Lindelof",
        "Harry Maguire",
        "Lisandro Martinez",
        "Bruno Fernandes",
        "Anthony Martial",
        "Marcus Rashford",
        "Mason Greenwood",
        "Tyrich Malacia",
        "Tom Heaton",
        "Christian Eriksen",
        "Fred",
        "Scott McTominay",
        "Anthony Elanga",
        "Cristiano Ronaldo",
        "Arron Wan-Bissaka",
        "Diogo Dalot",
        "Luke Shaw",
        "Brandon Williams",
        "Dean Henderson",
        "Tahith Chong",
        "Raphael Varane",
        "Jadon Sancho",
        "Alejandro Garnacho",
        "Jack Grealish",
        "Phil Foden",
        "Eering Haaland",
        "Kevin De Bruyne",
        "Gabriel Jesus",
        "Lionel Messi",
    ];
    private url: string = "http://103.229.41.59/api/services/app/Citizen/";
    constructor(private http: HttpClient) { }

    getCitizens(max: Number, skip?: Number) {
        const params = new HttpParams()
            .set('SkipCount', skip.toString())
            .set('MaxResultCount', max.toString());
        return this.http.get<any>(this.url.concat('GetAllCitizen'), { params: params });
    }

    createOrUpdateCitizen(citizen: Citizen): Observable<Citizen> {
        return this.http.post<any>(this.url.concat('CreateOrUpdateCitizen'),
            citizen);
    }

    deleteCitizen(id: Number) {
        const params = new HttpParams()
            .set('id', id.toString());
        return this.http.delete<any>(this.url.concat('DeleteCitizen'), { params: params });
    }


    generateId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateName() {
        return this.citizenNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generateAddress() {
        return Math.floor(Math.random() * Math.floor(299) + 1).toString();
    }

    generateNationality() {
        return Math.floor(Math.random() * Math.floor(75) + 1).toString();
    }
    generateIdNum() {
        return Math.floor(Math.random() * Math.floor(75) + 1).toString();
    }
    generatePhoneNumber() {
        return Math.floor(Math.random() * Math.floor(75) + 1).toString();
    }

    generateGender() {
        return Math.floor(Math.random() * Math.floor(5) + 1).toString();
    }
}