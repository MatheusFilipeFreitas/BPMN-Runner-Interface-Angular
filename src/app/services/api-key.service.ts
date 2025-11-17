import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginService } from "./login.service";
import { environment } from "../../environments/environments";
import { lastValueFrom, take } from "rxjs";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn: 'root'
})
export class ApiKeyService {
    private http = inject(HttpClient);
    private loadingService = inject(LoadingService);
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
        } catch (error) {
            console.error("Error while trying to add api key:", error);
        }
    }

    async listApiKeys(): Promise<any> {
        try {
            this.loadingService.isModalLoading.set(true);
            const headers = await this.loginService.getAuthorizationHeaders();

            const request$ = this.http.get(
                `${environment.API_PATH}/keys`, 
                { headers }
            ).pipe(
                take(1)
            );  
            const result = await lastValueFrom(request$);   
            this.loadingService.isModalLoading.set(false); 
            return result;      
        } catch (error) {
            console.error("Error while trying to list apis keys:", error);
        }
    }

    async deleteKey(keyId: string): Promise<void> {
        try {
            this.loadingService.isModalLoading.set(true);
            const headers = await this.loginService.getAuthorizationHeaders();

            const request$ = this.http.delete(
                `${environment.API_PATH}/keys/delete/${keyId}`,
                { headers }
            ).pipe(
                take(1)
            );
            await lastValueFrom(request$);
            this.loadingService.isModalLoading.set(false);
        } catch (error) {
            console.error("Error while trying to delete key:", error);
        }
    }

    async renewKey(keyId: string): Promise<any> {
        try {
            this.loadingService.isModalLoading.set(true);
            const headers = await this.loginService.getAuthorizationHeaders();

            const request$ = this.http.put(
                `${environment.API_PATH}/keys/renew/${keyId}`, null, { headers }
            ).pipe(
                take(1)
            );
            const result = await lastValueFrom(request$);
            this.loadingService.isModalLoading.set(false);
            return result;
        } catch (error) {
            console.error("Error while trying to renew key:", error);
        }
    }
}