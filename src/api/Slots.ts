import {triggerAPI} from 'src/api/APIManager';

export async function getSlots() {
  const apiConfig = {
    method: 'GET',
    endPoint: 'getSlots',
  };
  const responseData = await triggerAPI(apiConfig);
  return responseData.slots;
}
