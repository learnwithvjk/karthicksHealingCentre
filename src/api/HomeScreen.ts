import {triggerAPI} from 'src/api/APIManager';

export async function getYoutubeVideos() {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getYoutubeVideos',
    };
    const responseData = await triggerAPI(apiConfig);
    return responseData.videos;
  } catch (error) {
    throw error;
  }
}

export async function getClinicDetails() {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getClinicDetails',
    };
    const responseData = await triggerAPI(apiConfig);
    return responseData.clinics;
  } catch (error) {
    throw error;
  }
}

export async function getSliderImages() {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getSliderImages',
    };
    const responseData = await triggerAPI(apiConfig);
    return responseData.slider_images;
  } catch (error) {
    throw error;
  }
}
