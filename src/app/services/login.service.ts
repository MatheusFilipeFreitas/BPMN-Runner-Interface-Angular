import { HttpHeaders } from "@angular/common/http";
import { computed, effect, inject, Injectable, Injector, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from "@angular/fire/auth";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private auth: Auth = inject(Auth);
    private injector = inject(Injector);
    private user$ = user(this.auth);

    private user = toSignal(this.user$, { initialValue: null });
    readonly isLoggedIn = computed(() => this.user() != null );

    constructor() {
        effect(() => {
        }, { injector: this.injector });
    }
    
    login() {
        signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    logout() {
        signOut(this.auth);
    }

    async getAuthorizationHeaders(): Promise<HttpHeaders> {
        const user = this.user();
        if (!user) {
            console.error("Could not get logged user credentials");
            return Promise.reject(new Error("User not logged in"));
        }

        try {
            const token = await user.getIdToken(); 

            if (!token) {
                return Promise.reject(new Error("Could not retrieve ID token"));
            }

            return new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

        } catch (error) {
            console.error("Error getting ID token:", error);
            return Promise.reject(error);
        }
    }
}