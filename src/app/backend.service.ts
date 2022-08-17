import { Injectable } from '@angular/core';
import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    ) { }

  private WEB_SERVICE_PATH = "/webservice/";

  /**
   *
   * @param webServiceApiName WebService的API名稱
   * @param input 須送給WebService的內容，格式:Json
   *
   * 範例:
   * ```
   *   BackendService.post<ReferenceData>('GetReferenceData',{}).subscribe( response => {
   *     console.log(response);
   *   });
   * ```
   */
  post<T extends BackendResponseInfo>(webServiceApiName: string, input: {}) {
    return this.httpClient.post<T>(this.WEB_SERVICE_PATH + webServiceApiName, this.generateRequestBody(input))
      .pipe(
        catchError((err) => {
          alert(`發生網路問題[${webServiceApiName}] Error Code: ${err.status} \r請稍後再試或與本公司聯絡`);
          throw new Error(`發生網路問題 Error Code: ${err.status}`);
        }),
        filter(response => {
        if (response.RetCode !== '0000') {

          const errorMessage =
            `操作失敗[${response.RetCode}]:${webServiceApiName}\r原因: ${response.RetMsg}`;
          console.error(errorMessage);
          alert(errorMessage);
          throw new Error(errorMessage);
        }
        return true;
      }));
  }

  /**
   *
   * @param webServiceApiName WebService的API名稱
   * @param input 須送給WebService的內容，格式:Json
   *
   * 範例:
   * ```
   *   BackendService.postWithoutCheckError<ReferenceData>('GetReferenceData',{}).subscribe( response => {
   *     console.log(response);
   *   });
   * ```
   */
  postWithoutCheckError<T>(webServiceApiName: string, input: {}) {
    return this.httpClient.post<T>(this.WEB_SERVICE_PATH + webServiceApiName, this.generateRequestBody(input));
  }

  postWithBlobType<T>(webServiceApiName: string, input: {}): Observable<Blob> {
    return this.httpClient
      .post(this.WEB_SERVICE_PATH + webServiceApiName, this.generateRequestBody(input), { responseType: 'blob' })
      .pipe(catchError((err) => {

        if (err.status === 404) {
          alert(`找不到此檔案，請與本公司聯絡`);
          throw new Error(`發生網路問題 Error Code: ${err.status}`);
        }

        alert(`發生網路問題[${webServiceApiName}] Error Code: ${err.status} \r請稍後再試或與本公司聯絡`);
        throw new Error(`發生網路問題 Error Code: ${err.status}`);
      }));
  }

  /**
   *
   * @param webServiceApiName WebService的API名稱
   * @param input 送給WebService的內容(可有可無)，格式:Json
   *
   * 範例:
   * ```
   *   BackendService.get<ReferenceData>('GetReferenceData').subscribe( response => {
   *     console.log(response);
   *   });
   * ```
   */
  get<T>(webServiceApiName: string, input?: {}) {
    if (!input) {
      input = {};
    }

    return this.httpClient.get<T>(this.WEB_SERVICE_PATH + webServiceApiName, { params: this.generateRequestBody(input) });
  }

  /**
   *
   * @param webServiceApiName WebService的API名稱
   * 取得WebService的完整URL
   *
   * 範例:
   * ```
   *  const url = BackendService.getBackEndUrl('GetReferenceData');
   *  console.log(url) // /webservice/WebFrontEnd.asmx/GetReferenceData
   * ```
   */
  getBackEndUrl(webServiceApiName: string) {
    return this.WEB_SERVICE_PATH + webServiceApiName;
  }

  private generateRequestBody(input: {
    [key: string]: any
  }) {

    // encoder是為了解決base64加密所產生+號會被置換成空白的問題
    return new HttpParams({
      encoder: {
        encodeKey(k: string): string { return encodeURIComponent(k); },
        encodeValue(v: string): string { return encodeURIComponent(v); },
        decodeKey(k: string): string { return decodeURIComponent(k); },
        decodeValue(v: string) { return decodeURIComponent(v); }
      } as HttpParameterCodec
    })
      .set('input', JSON.stringify(input));
  }

}

export interface BackendResponseInfo {
  RetCode: string;
  RetMsg: string;
}
