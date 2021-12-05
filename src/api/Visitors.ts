import {triggerAPI} from 'src/api/APIManager';

export async function addVisitor(payload: any) {
  const apiConfig = {
    method: 'POST',
    endPoint: 'addVisitor',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  return responseData.visitor;
}

export async function getVisitors(payload: any) {
  const apiConfig = {
    method: 'GET',
    endPoint: 'getVisitors',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  return responseData.visitors;
}

export async function updateVisitor(payload: any) {
  const apiConfig = {
    method: 'PUT',
    endPoint: 'updateVisitor',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  console.log('response');

  console.log(responseData);
  return responseData.visitor;
}

export async function deleteVisitor(payload: any) {
  const apiConfig = {
    method: 'DELETE',
    endPoint: 'deleteVisitor',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  console.log(responseData);
  return responseData;
}
