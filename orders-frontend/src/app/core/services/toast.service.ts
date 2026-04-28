import { Injectable, signal } from '@angular/core';

export interface Toast {
  key: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly DISMISS_DELAY_MS = 4000;

  readonly toasts = signal<Toast[]>([]);

  success(key: string): void {
    this.add({ key, type: 'success' });
  }

  error(key: string): void {
    this.add({ key, type: 'error' });
  }

  private add(toast: Toast): void {
    this.toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => this.remove(toast), this.DISMISS_DELAY_MS);
  }

  private remove(toast: Toast): void {
    this.toasts.update(toasts => toasts.filter(t => t !== toast));
  }
}
