import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { NavigationLayer } from "../../pages/docs/components/data/navigation-options";
import { settingsLayers } from "../../pages/docs/components/data/settings-options";
import { TableModule } from 'primeng/table';
import { PickListModule } from 'primeng/picklist';
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../icon/icon";
import { FormsModule } from '@angular/forms';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { ApiKeyService } from "../../services/api-key.service";
import { ChipModule } from 'primeng/chip';
import { LoadingService } from "../../services/loading.service";
import LoadComponent from "../load/load";
import { MessageService } from "primeng/api";
import { Toast } from "primeng/toast";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.html',
    styleUrls: ['./settings.scss'],
    imports: [TableModule, PickListModule, ButtonModule, ChipModule, CommonModule, FormsModule, PopoverModule, TooltipModule, IconComponent, LoadComponent, Toast],
    providers: [TableModule, PickListModule, ButtonModule, ChipModule, MessageService]
})
export default class SettingsModalComponent implements OnInit {
    private apiKeyService = inject(ApiKeyService);
    loadingService = inject(LoadingService);
    private messageService = inject(MessageService);
    @ViewChild('op') op!: Popover;

    selectedItem = signal<NavigationLayer>(settingsLayers[0].childs![0]);
    keys = signal<any[]>([]);
    allOrigins: string[] = [];
    newOrigins: string[] = [];
    manualOrigin: string | null = null;

    private showCopied: boolean = false;

    get navigationLayers(): NavigationLayer[] {
        return settingsLayers;
    }

    async ngOnInit(): Promise<void> {
        await this.getListOfKeys();
    }

    selectItem(item: NavigationLayer): void {
        let selectedItem = item;
        if (item.childs && item.childs?.length > 0) {
            selectedItem = item.childs[0];
        }
        this.selectedItem.set(selectedItem);
    }

    isItemSelected(item: NavigationLayer): boolean {
        return this.selectedItem().id === item.id;
    }

    addNewOrigins(): void {
        if (this.newOrigins.length === 0) return;

        this.allOrigins = [
        ...new Set([...this.allOrigins, ...this.newOrigins])
        ].slice(0, 5);

        this.newOrigins = [];
    }

    addManualOrigin(): void {
        if (!this.manualOrigin) return;

        const trimmed = this.manualOrigin.trim();
        if (!trimmed) return;

        const normalized = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : `http://${trimmed}`;

        if (this.allOrigins.length >= 5) {
            this.manualOrigin = '';
            return;
        }

        if (!this.allOrigins.includes(normalized)) {
            this.allOrigins.push(normalized);
        }

        this.manualOrigin = '';
    }

    filterOrigins(origin: any): void {
        this.allOrigins = this.allOrigins.filter(o => o !== origin);
    }

    async createNewKey(): Promise<void> {
        if (this.allOrigins.length === 0 || this.allOrigins.length >= 5) {
            return;
        }
        await this.apiKeyService.addNewApiKey(this.allOrigins);
        this.allOrigins = [];
        await this.getListOfKeys();
    }

    async getListOfKeys(): Promise<void> {
        this.keys.set(await this.apiKeyService.listApiKeys());
    }

    copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccessToast();
            this.showCopied = true;
            setTimeout(() => this.showCopied = false, 1500);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    showSuccessToast(): void {
        this.messageService.add({
            sticky: false,
            life: 2000,
            summary: 'Key copied!',
            severity: 'success'
        });
    }

    showPopover(event: any): void {
        this.op.toggle(event);
    }

    deleteKey(keyId: string): void {
        this.apiKeyService.deleteKey(keyId);
        this.keys.update((keys) => keys.filter((key: any) => key.keyId !== keyId));
    }

    renewKey(keyId: string): void {
    this.apiKeyService.renewKey(keyId).then((updatedKey) => {
        if (!updatedKey) return;

        this.keys.update((keys) =>
        keys.map((k) => (k.keyId === keyId ? updatedKey : k))
        );
    });
    }
}