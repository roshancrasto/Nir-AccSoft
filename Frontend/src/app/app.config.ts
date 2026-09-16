import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './core/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';

import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorDefaultOptions, MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { routes } from './app.routes';

registerLocaleData(localeIn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: { showFirstLastButtons: true } as MatPaginatorDefaultOptions }
  ]
};
