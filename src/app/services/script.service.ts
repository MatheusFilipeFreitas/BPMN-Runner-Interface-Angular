import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginService } from "./login.service";
import { environment } from "../../environments/environments";
import { lastValueFrom, take } from "rxjs";
import { XmlService } from "./xml.service";

@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private http = inject(HttpClient);
    private loginService = inject(LoginService);
    private xmlService = inject(XmlService);
    
    async processScript(script: string): Promise<void> {
        try {
            const headers = await this.loginService.getAuthorizationHeaders();

            const textHeaders = headers.set('Content-Type', 'text/plain')
                                .set('Accept', 'application/xml');

            const request$ = this.http.post(
            `${environment.API_PATH}/script/execute`,
            script,
            { headers: textHeaders, responseType: 'text' }
            ).pipe(take(1));

            const result = await lastValueFrom(request$);
            this.xmlService.setNewXmlContent(result);
        } catch (error) {
            console.error('Error while trying to process script:', error);
        }
    }

}