import {google} from 'googleapis'
import {v4 as uuid} from "uuid"

const scheduleEvent = async ( vendorEmail , vendorName , date)=>{
  let attendeeEmail="attende@gmail.com"
  let attendeeName="attendee"
  let token=''
  // we can save the token in the db and fetch when needed. Same goes with attendeeEmail and attendeeName
  // we can put any sales person email as provided by the company to attend the meeting 

  const tokens = JSON.parse(token)
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
   )
   oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({
    version: "v3",
    auth:process.env.GOOGLE_CALENDER_API_KEY
  })

  try {
    const calenderEvent = await calendar.events.insert({
      calendarId:"primary",
      auth:oauth2Client,
      conferenceDataVersion:1,
      requestBody:{
        summary:`Sales Team meeting for productX`,
        description:`Meeting scheduled for sale of productx with ${attendeeName} `,
        start:{
          dateTime: `${date}T15:00:00+05:30`,
          timeZone:'Asia/Kolkata',
        },
        end:{
          dateTime: `${date}T16:00:00+05:30`,
          timeZone:"Asia/Kolkata"
        },
        conferenceData:{
          createRequest: {
            requestId: uuid(),
          }
        },
        attendees:[
          { email: vendorEmail },
          { email: attendeeEmail }
        ]
      }
    })
    const meetLink = calenderEvent.data.hangoutLink
    return meetLink
  } catch (error) {
    console.error("Schedule error" , error)
}}

export default scheduleEvent