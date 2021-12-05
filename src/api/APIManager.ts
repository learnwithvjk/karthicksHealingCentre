const baseUrl = 'https://us-central1-karthick-acupuncture.cloudfunctions.net';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';

function getQueryString(obj: any): string {
  const keys = Object.keys(obj);
  let queryParams = undefined as unknown as string;
  keys.forEach((key: string) => {
    const value =
      typeof obj[key] === 'object'
        ? JSON.stringify(obj[key])
        : obj[key].toString();
    const valueWithKey = `${key}=${value}`;
    queryParams = queryParams ? `${queryParams}&${valueWithKey}` : valueWithKey;
  });
  return queryParams;
}

export async function triggerAPI(apiConfig: any, payload: any = undefined) {
  const bodyParam = payload?.bodyParams
    ? JSON.stringify(payload?.bodyParams)
    : null;
  const endPointUrl = `${baseUrl}/${apiConfig.endPoint}`;
  const endPointUrlWithQueryParams = payload?.queryParams
    ? `${endPointUrl}?${getQueryString(payload?.queryParams)}`
    : endPointUrl;
  console.log(endPointUrlWithQueryParams);
  return fetch(endPointUrlWithQueryParams, {
    method: apiConfig.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: bodyParam,
  })
    .then(async (response: any) => {
      console.log('api success');
      const jsonData = await response.json().catch((err: any) => {
        console.log('err while converting response to json');
        throw err;
      });
      if (jsonData.status_code !== 200) {
        throw jsonData.status_message;
      }
      return jsonData;
    })
    .catch(error => {
      console.log('api failed');
      throw error;
    });
}
