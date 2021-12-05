import {triggerAPI} from 'src/api/APIManager';

export async function bookAppointment(payload: any) {
  try {
    const apiConfig = {
      method: 'POST',
      endPoint: 'bookAppointment',
    };
    const responseData = await triggerAPI(apiConfig, payload);
    return responseData.booking_datails;
  } catch (error) {
    throw error;
  }
}

export async function getBookings(payload: any) {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getBookings',
    };
    const responseData = await triggerAPI(apiConfig, payload);
    return responseData.bookings;
  } catch (error) {
    throw error;
  }
}
