import { Component, computed, effect, inject, Injector, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Toast } from "primeng/toast";
import { CodeService } from "../../../services/code.service";
import { ScriptService } from "../../../services/script.service";

@Component({
    selector: 'app-toast-code',
    templateUrl: './toast-code.html',
    styleUrls: ['./toast-code.scss'],
    imports: [Toast],
    providers: [MessageService]
})
export default class ToastCodeComponent {
    private scriptService = inject(ScriptService);
    private messageService = inject(MessageService);
    private injector = inject(Injector);

    constructor() {
        effect(() => {
            const errors = this.scriptService.errors();

            if (errors.length > 0) {
                this.showErrorToast(errors);
            } else {
                this.clearToast();
            }
            }, 
            { 
                injector: this.injector 
            }
        );
    }

    private showErrorToast(errors: string[]): void {
        this.clearToast();
        this.messageService.add({
            sticky: true,
            severity: 'error',
            data: errors,
            styleClass: 'backdrop-blur-lg',
        });
    }

    private clearToast(): void {
        this.messageService.clear();
    }
}