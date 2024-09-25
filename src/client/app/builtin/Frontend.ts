import alt from 'alt-client';
import type { IAnyFunction, IFrontendSafeZone, IFrontendState } from '@shared/types';
import natives from 'natives';
import {inject, injectable} from 'inversify';
import {$global} from "@/_magic/inversify.tokens";
import {IConfig} from "@/types";

export type IFrontendStoreType = 'hud' | 'personal_vehicle';

@injectable()
export class Frontend {
    private readonly webView: alt.WebView;
    private _isLoaded: boolean = false;
    private _state: IFrontendState = 'loading';

    constructor(
        @inject($global.config) private readonly config: IConfig
    ) {
        const webView: alt.WebView = new alt.WebView(config.MODE === 'production' ? 'http://resource/client/web/index.html' : 'http://192.168.1.138:5173/');
        this.webView = webView;
        webView.on('safeZone', this.getSafeZone.bind(this));
        // alt.everyTick(() => {
        //     // natives.disableAllControlActions(2);
        //     native.disableControlAction(0, 37, true); // Disable weapon
        // });
    }

    public setStore<T>(dest: IFrontendStoreType, value: T) {
        this.emit('__store__', dest, value);
    }

    public connect(): Promise<void> {
        return new Promise((resolve): void => {
            if (this._isLoaded) {
                resolve();
                this.focus();
                return;
            }
            this.webView.once('mounted', () => {
                this._isLoaded = true;
                this.focus();
                resolve();
                return;
            });
        });
    }

    public focus(): void {
        this.webView.focus();
    }

    public blur(): void {
        this.webView.unfocus();
    }

    public set state(state: IFrontendState) {
        this._state = state;
        this.emit('__state__', state);
    }

    public emit(eventName: string, ...args: unknown[]): void {
        this.webView.emit(eventName, ...args);
    }

    public on(eventName: string, cb: IAnyFunction): void {
        this.webView.on(eventName, cb);
    }

    public off(eventName: string, cb: IAnyFunction): void {
        this.webView.off(eventName, cb);
    }

    public once(eventName: string, cb: IAnyFunction): void {
        this.webView.once(eventName, cb);
    }

    private getSafeZone(): void {
        const safeZoneSize: number = natives.getSafeZoneSize();
        const screenAspectRatio: number = natives.getScreenAspectRatio();
        const dirtyScreenResolution: [void, number, number] = natives.getActualScreenResolution();

        const screenResolution: { width: number; height: number } = {
            width: dirtyScreenResolution[1],
            height: dirtyScreenResolution[2],
        };

        const scaleX: number = 1 / screenResolution.width;
        const scaleY: number = 1 / screenResolution.height;
        const width: number = scaleX * (screenResolution.width / (4 * screenAspectRatio));
        const height: number = scaleY * (screenResolution.height / 5.674);

        const left: number = scaleX * (screenResolution.width * ((1 / 20) * (10 * Math.abs(safeZoneSize - 1))));
        const bottom: number = scaleY * (screenResolution.height * ((1 / 20) * (10 * Math.abs(safeZoneSize - 1))));

        const safeZone: IFrontendSafeZone = {
            x: left * screenResolution.width,
            y: bottom * screenResolution.height,
            width: width * screenResolution.width,
            height: height * screenResolution.height,
        };

        this.webView.emit('safeZone', safeZone);
    }
}
