import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginService } from "./login.service";
import { environment } from "../../environments/environments";
import { lastValueFrom, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiKeyService {
    private http = inject(HttpClient);
    private loginService = inject(LoginService);

    async addNewApiKey(origins: string[]): Promise<void> {
        try {
            const headers = await this.loginService.getAuthorizationHeaders();

            const request$ = this.http.post(
                `${environment.API_PATH}/keys/create`, 
                { allowedOrigins: origins }, 
                { headers }
            ).pipe(
                take(1)
            );
            const result = await lastValueFrom(request$);
            console.log("API Key created successfully:", result);
        } catch (error) {
            console.error("Error while trying to add api key:", error);
        }
    }

    async listApiKeys(): Promise<any> {
        try {
            const headers = await this.loginService.getAuthorizationHeaders();

            const request$ = this.http.get(
                `${environment.API_PATH}/keys`, 
                { headers }
            ).pipe(
                take(1)
            );  
            const result = await lastValueFrom(request$);    
            return result;      
        } catch (error) {
            console.error("Error while trying to list apis keys:", error);
        }
    }
}