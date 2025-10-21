import { NavigationLayer } from "./navigation-options";

export const settingsLayers: NavigationLayer[] = [
    {
        id: 'api-keys',
        title: 'Keys',
        childs: [
            { id: 'api-keys >> manage', title: 'Manage Api Keys' }
        ]
    }
]