import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const firestoreInstance = admin.firestore();

const calculateAge = (dateOfBirth:string) :number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth as string);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getResponseObj = (statusMessage:string, statusCode:number,
    obj:any = undefined ) =>{
  return {
    status_message: statusMessage,
    status_code: statusCode,
    ...obj,
  };
};

const log =functions.logger.log;
const errLog=functions.logger.error;
const karthickConstId = "KarthicksVisitorId";


export const addVisitor = functions.https.onRequest(
    async (request, response) => {
      log("Triggered addVisitor method with request:",
          request.body);
      try {
        log("Starting to calculate age of",
            request.body.date_of_birth);

        const age = calculateAge(request.body.date_of_birth);
        log("calculated age is:", age);
        const newVisitor = {
          "uid": request.body.uid,
          "visitor_name": request.body.visitor_name,
          "phone_number": request.body.phone_number,
          "date_of_birth": request.body.date_of_birth,
          "gender": request.body.gender,
          "age": age,
          "created_time": new Date().toISOString(),
          "is_deleted": false,
        };
        log("new visitor is", newVisitor);

        const visitorRef = await firestoreInstance.collection("Visitors")
            .add(newVisitor);

        log("visitor added successfully:", visitorRef.id);

        // This is a duplicate of data in DB so removed
        // await firestoreInstance.collection("Visitors")
        // .doc(visitorRef.id).set({
        //   ...newVisitor,
        //   visitor_id: visitorRef.id,
        // });

        log("visitor id updated successfully:");
        const visitor = {
          ...newVisitor,
          visitor_id: visitorRef.id,
        };
        const responseObj = getResponseObj("visitor added successfully", 200, {
          visitor: visitor,
        });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    }
);

export const getVisitors = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered getVisitor method with request:",
            request.query);
        if (!request.query || !request.query.uid) {
          throw new Error("required params not sent");
        }
        const visitorCollection = firestoreInstance
            .collection("Visitors").where("is_deleted", "==",
            request.query!.deleted? true:false
            );

        let filteredCollection;

        if (request.query.uid) {
          filteredCollection = request.query!.uid === karthickConstId ?
          visitorCollection :
          visitorCollection.where("uid", "==", request.query.uid);
        }

        const filteredVisitorsList = filteredCollection ?
        await filteredCollection.get() : [];

        const visitorsList = [] as Array<any>;
        filteredVisitorsList.forEach((visitor) => {
          // visitor.data() => gives data() gives visitor details
          // visitor.id => gives document id
          const visitorDetails = {...visitor.data(), visitor_id: visitor.id};
          visitorsList.push(visitorDetails);
        });
        log("Filtered Collection is",
            visitorsList);
        const responseObj = getResponseObj("visitors recived successfully", 200,
            {
              visitors: visitorsList,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const updateVisitor = functions.https.onRequest(
    async (request, response) => {
      try {
        log("updateVisitor method with request:",
            request.body);
        if (!request.body || !request.body.uid || !request.body.visitor_id) {
          throw new Error("required params not sent");
        }
        const visitorDocument = firestoreInstance
            .collection("Visitors").doc(request.body.visitor_id as string);

        const visitorDocumentGet = await visitorDocument.get();
        if (!visitorDocumentGet.exists) {
          throw new Error("No such visitor found");
        }

        const visitorDocuementData = visitorDocumentGet.data();
        log("document data", visitorDocuementData);
        if (visitorDocuementData!.uid !== request.body.uid ) {
          throw new Error("Not authorised to edit this visitor");
        }

        const updatedaData = {
          ...visitorDocuementData,
          ...request.body,
          age: calculateAge(request.body.date_of_birth),
        };

        await visitorDocument.update(updatedaData);

        log("updatedData:", updatedaData);

        const responseObj = getResponseObj("visitor updated successfully",
            200, {
              visitor: updatedaData,
            });
        response.send(responseObj);
        log("sent response:", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const deleteVisitor= functions.https.onRequest(
    async (request, response) => {
      try {
        log("deleteVisitor method with request:",
            request.query);
        if (!request.query || !request.query.uid || !request.query.visitor_id) {
          throw new Error("required params not sent");
        }

        const visitorDocument = firestoreInstance
            .collection("Visitors").doc(request.query.visitor_id as string);

        const visitorDocumentGet = await visitorDocument.get();
        if (!visitorDocumentGet.exists) {
          throw new Error("No such visitor found");
        }

        const visitorDocuementData = visitorDocumentGet.data();
        log("document data", visitorDocuementData);
        if (visitorDocuementData!.uid !== request.query.uid ) {
          throw new Error("Not authorised to delete this visitor");
        }

        const updatedaData = {
          ...visitorDocuementData,
          is_deleted: true,
        };

        await visitorDocument.update(updatedaData);

        log("updated is delted status", updatedaData);

        const responseObj = getResponseObj("visitor deleted successfully",
            200, {
              visitor: updatedaData,
            });
        response.send(responseObj);
        log("sent response:", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });


export const getSlots = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered getSlots method with request:",
            request.query);

        const dateCollection = firestoreInstance
            .collection("Slots").where("is_deleted", "==",
              request.query!.deleted? true:false
            ).orderBy("order");


        const dateCollectionList = await dateCollection.get();

        const dateList = [] as Array<any>;

        log("dateCollectionList.size", dateCollectionList.size);

        for await (const selectedDateDocumentObj of dateCollectionList.docs ) {
          const dateDocument = firestoreInstance
              .collection("Slots").doc(selectedDateDocumentObj.id);


          const timingCollectionList = await dateDocument
              .collection("timing").orderBy("order").get();


          const timings = [] as Array<any>;
          for await (const timeSlotObj of timingCollectionList.docs ) {
            const slotData = {...timeSlotObj.data(), slot_time: timeSlotObj.id};
            timings.push(slotData);
          }

          const dataFields = selectedDateDocumentObj.data();
          const dateData = {
            slot_date: selectedDateDocumentObj.id,
            ...dataFields,
            timings: timings,
          };
          dateList.push(dateData);
        }
        // dateCollectionList.forEach(async (selectedDateDocumentObj) => {
        // });
        log("Filtered Collection is",
            dateList);
        const responseObj = getResponseObj("slots recived successfully", 200,
            {
              slots: dateList,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const bookAppointment = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered bookAppointment method with request:",
            request.body);
        if (!request.body || !request.body.uid ||
         !request.body.visitor_id || !request.body.visit_type ||
         request.body.visit_type === "clinic" && (!request.body.slot_date || !request.body.slot_time)
        ) {
          throw new Error("required params not sent");
        }
        let newBooking = {
          "cause": request.body.cause ? request.body.cause: null,
          "visitor_id": request.body.visitor_id,
          "is_cancelled": false,
          "visit_type": request.body.visit_type,
          "uid": request.body.uid,
        } as any;
        if (request.body.visit_type === "clinic") {
          log("checking if slot is available:");

          const dateDocumentRef = firestoreInstance.collection("Slots")
              .doc(request.body.slot_date);
          const dateDocumentData :any=(await dateDocumentRef.get()).data();
          const holiday :boolean= dateDocumentData.is_holiday;
          if (holiday) {
            throw new Error("Cant book on an unavailable date");
          }
          const timingDocumentRef = dateDocumentRef.
              collection("timing").doc(request.body.slot_time);
          const availCountData:any= (await timingDocumentRef.get()).data();
          const availCount:number = availCountData.available_count;

          if (availCount<=0) {
            throw new Error("All bookings in this slot is full try another slot");
          }

          log(`verifications stats, isHoliday: ${holiday} 
          and availCountData: ${availCount}`);

          await timingDocumentRef.update({available_count: availCount-1});
          log("updated available count: ", availCount-1);

          newBooking = {
            ...newBooking,
            "slot_date": request.body.slot_date,
            "slot_time": request.body.slot_time,
          };
        }
        log("newly booked obj: ", newBooking);
        const bookingsDocumentRef = await firestoreInstance
            .collection("Bookings").add(newBooking);

        const visitorDocument = firestoreInstance
            .collection("Visitors").doc(request.body.visitor_id);
        const visitorDocumentGet = await visitorDocument.get();
        const visitorDocuementData = visitorDocumentGet.data();

        log("booking made successfully", bookingsDocumentRef.id );
        const bookingDetails = {
          ...newBooking,
          "booking_id": bookingsDocumentRef.id,
          "visitor_name": visitorDocuementData!.visitor_name,
          "phone_number": visitorDocuementData!.phone_number,
          "date_of_birth": visitorDocuementData!.date_of_birth,
          "gender": visitorDocuementData!.gender,
          "age": visitorDocuementData!.age,
        };

        const responseObj = getResponseObj("booked successfully",
            200, {
              booking_datails: bookingDetails,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });


export const getBookings = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered getBookings method with request:",
            request.query);
        if (!request.query || !request.query.uid) {
          throw new Error("required params not sent");
        }
        const bookingstCollectionRef = firestoreInstance
            .collection("Bookings");

        let filteredBookingCollection;

        if (request.query.uid) {
          filteredBookingCollection = request.query!.uid === karthickConstId ?
          bookingstCollectionRef :
          bookingstCollectionRef.where("uid", "==", request.query.uid);
        }

        const filteredBookingList = filteredBookingCollection ?
          await filteredBookingCollection.get() :[] as unknown as FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;

        const bookingsList = [] as Array<any>;

        log("filteredBookingList.size", filteredBookingList.size);
        for await (const booking of filteredBookingList.docs ) {
          const bookingData = booking.data();
          const visitorDocument = firestoreInstance
              .collection("Visitors").doc(bookingData.visitor_id);
          const visitorDocumentGet = await visitorDocument.get();
          const visitorDocuementData = visitorDocumentGet.data();
          const bookingDetails = {
            ...bookingData,
            "booking_id": booking.id,
            "visitor_name": visitorDocuementData!.visitor_name,
            "phone_number": visitorDocuementData!.phone_number,
            "date_of_birth": visitorDocuementData!.date_of_birth,
            "gender": visitorDocuementData!.gender,
            "age": visitorDocuementData!.age,
          };
          bookingsList.push(bookingDetails);
        }
        log("Filtered Collection is",
            bookingsList);
        const responseObj = getResponseObj("bookings recived successfully", 200,
            {
              bookings: bookingsList,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch (error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const getYoutubeVideos = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered getYoutubeVideos method with request:",
            request);
        const videos = [];
        const videosCollectionRef = await firestoreInstance
            .collection("Videos").get();
        log("videosCollectionRef.size", videosCollectionRef.size);
        for await (const video of videosCollectionRef.docs ) {
          const videoData = video.data();
          videos.push(videoData.video_id);
        }
        const responseObj = getResponseObj("videos collected successfully", 200,
            {
              videos: videos,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch ( error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const getClinicDetails = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered getClinicDetails method with request:",
            request);
        const clinics = [];
        const clinicsCollectionRef = await firestoreInstance
            .collection("ClinicDetails").get();
        log("videosCollectionRef.size", clinicsCollectionRef.size);
        for await (const video of clinicsCollectionRef.docs ) {
          const clinicData = video.data();
          clinics.push(clinicData);
        }
        const responseObj = getResponseObj("clinics collected successfully", 200,
            {
              clinics: clinics,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch ( error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const getSliderImages = functions.https.onRequest(
    async (request, response) => {
      try {
        log("Triggered getSliderImages method with request:",
            request);
        const sliderImages = [];
        const sliderImagesCollectionRef = await firestoreInstance
            .collection("SliderImages").get();
        log("getSliderImages.size", sliderImagesCollectionRef.size);
        for await (const image of sliderImagesCollectionRef.docs ) {
          const sliderImageData = image.data();
          sliderImages.push(sliderImageData);
        }
        const responseObj = getResponseObj("slider Images collected successfully", 200,
            {
              slider_images: sliderImages,
            });
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch ( error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

const initializeDefaults=async () => {
  log("Triggered initializeDefaults");
  const defaultData = {
    available_count: 5,
    online_available_count: 5,
    timings: [
      "7am-8am",
      "8am-9am",
      "9am-10am",
      "6pm-7pm",
      "7pm-8pm",
      "8pm-9pm",
    ],
    stop_booking: false,
    no_of_days: 7,
  };

  await firestoreInstance.collection("Defaults").doc("slots").set(defaultData);
  log("default slot data:: ", defaultData);

  const staticValues = {
    last_date_order: 0,
  };
  await firestoreInstance.collection("Defaults").doc("staticValues").set(staticValues);
  log("staticValues data:: ", staticValues);
};

const initializeSlots= async () => {
  log("Triggered initializeSlots");
  const defaultSlotRef = await firestoreInstance
      .collection("Defaults").doc("slots").get();
  const defaultSlotData = defaultSlotRef.data();
  log("default slot data:: ", defaultSlotData);
  const noOfDaysToAdd = defaultSlotData!.no_of_days;
  const currentDate = new Date();
  let index=1;
  while ( index<=noOfDaysToAdd) {
    currentDate.setDate(new Date().getDate()+index);
    const documentId = currentDate.toDateString().toString();
    const newDateDocument= {"is_holiday": defaultSlotData!.stop_booking, "is_deleted": false, "order": index};
    await firestoreInstance.collection("Slots").doc(documentId).set(newDateDocument);
    let slotOrder = 1;
    for await (const timing of defaultSlotData!.timings ) {
      const newSlotDocument = {
        available_count: defaultSlotData!.available_count,
        online_available_count: defaultSlotData!.online_available_count,
        order: slotOrder,
      };
      await firestoreInstance.collection("Slots").doc(documentId).collection("timing").doc(timing).set(newSlotDocument);
      slotOrder++;
    }
    index++;
  }
  const defaultStaticValuesRef = firestoreInstance
      .collection("Defaults").doc("staticValues");
  await defaultStaticValuesRef.set({last_date_order: defaultSlotData!.no_of_days});
};

export const initializeDataBase= functions.https.onRequest(
    async (request, response) => {
      try {
        await initializeDefaults();
        await initializeSlots();
        const responseObj = getResponseObj("Datas Manipulated successfully", 200);
        response.send(responseObj);
        log("response sent successfully", responseObj);
      } catch ( error) {
        errLog(error);
        const errorResponseObj =getResponseObj(error.message ? error.message : error.toString(), 500 );
        response.send(errorResponseObj);
      }
    });

export const slotUpdatePubSub = functions.pubsub.schedule("59 23 * * *").timeZone("Asia/Kolkata").onRun(async (context) => {
  try {
    log("Triggered slotUpdatePubSub");
    const defaultStaticValuesRef = firestoreInstance.collection("Defaults").doc("staticValues");

    const defaultStaticValuesSnap = await defaultStaticValuesRef.get();
    const defaultSlotRef = await firestoreInstance.collection("Defaults").doc("slots").get();
    const defaultSlotData = defaultSlotRef.data();

    const currentDate = new Date();
    currentDate.setDate(new Date().getDate()+1);// +1 because the server is in US
    const oldestActiveDateDocuementId = currentDate.toDateString().toString();
    await firestoreInstance.collection("Slots").doc(oldestActiveDateDocuementId).update({"is_deleted": true});
    const defaultStaticValuesData = defaultStaticValuesSnap.data();

    log("updated old document as deleted ");


    currentDate.setDate(new Date().getDate()+defaultSlotData!.no_of_days+1); // +1 because the server is in US
    const documentId = currentDate.toDateString().toString();
    log("latest document id", documentId);

    const newDateDocument= {"is_holiday": defaultSlotData!.stop_booking, "is_deleted": false, "order": defaultStaticValuesData!.last_date_order+1};
    await defaultStaticValuesRef.update({last_date_order: defaultStaticValuesData!.last_date_order+1});
    await firestoreInstance.collection("Slots").doc(documentId).set(newDateDocument);
    log("added new date document");

    let slotOrder = 1;
    for await (const timing of defaultSlotData!.timings ) {
      const newSlotDocument = {
        available_count: defaultSlotData!.available_count,
        online_available_count: defaultSlotData!.online_available_count,
        order: slotOrder,
      };
      await firestoreInstance.collection("Slots").doc(documentId).collection("timing").doc(timing).set(newSlotDocument);
      slotOrder++;
    }
    log("added time slot documents");
  } catch ( error) {
    errLog(error);
  }
});
