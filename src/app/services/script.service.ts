import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { LoginService } from "./login.service";
import { environment } from "../../environments/environments";
import { lastValueFrom, take } from "rxjs";
import { XmlService } from "./xml.service";
import { MessageService } from "primeng/api";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private _errors = signal<string[]>([]);
    readonly errors = this._errors.asReadonly();
    private http = inject(HttpClient);
    private loginService = inject(LoginService);
    private loadingService = inject(LoadingService);
    private xmlService = inject(XmlService);
    
    async processScript(script: string): Promise<void> {
        this.loadingService.isLoadingRequest.set(true);
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
            this._errors.set([]);
            this.loadingService.isLoadingRequest.set(false);
        } catch (error) {
            const httpError = error as HttpErrorResponse;
            let errors: string[] = [];

            try {
                const body = typeof httpError.error === 'string'
                    ? JSON.parse(httpError.error)
                    : httpError.error;
                if ((error as Error).message.startsWith('User')) {
                    errors = ['Login to use this function'];
                } else {
                    if (Array.isArray(body?.errors)) {
                        errors = body.errors;
                    } else if (typeof body?.message === 'string') {
                        errors = [body.message];
                    } else {
                        errors = ['Unknown error'];
                    }
                }
            } catch (e) {
                errors = ['Could not process error from server'];
            }
            this._errors.set(errors);
            this.loadingService.isLoadingRequest.set(false);
        }
    }

    clearAllErrors(): void {
        this._errors.set([]);
    }
}