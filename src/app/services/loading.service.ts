import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isLoading = signal<boolean>(false);
    isModalLoading = signal<boolean>(false);
    isLoadingRequest = signal<boolean>(false);
}