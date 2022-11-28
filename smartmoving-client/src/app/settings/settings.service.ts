import { Injectable } from '@angular/core';
import { ApiClientService } from '../core/api-client.service';
import { CompanySettingsModel } from '../generated/Settings/Company/company-settings-model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(
      private apiClient: ApiClientService
  ) {
  }


  // Company services
  getCompanyDetails() {
    return this.apiClient.get<CompanySettingsModel>(`settings/company`);
  }

  updateCompanyDetails(payload: CompanySettingsModel) {
    return this.apiClient.put<CompanySettingsModel>(`settings/company`, payload);
  }


}
