here we use the express and node js and for password encryption we use  bycrpt and for database i use mongodb and use cloudinary for storing the image and give us the link and jwt(jsonwebtoken) is use for creating the token 
<!-- Doctor Phase -->
$v=http://localhost:3000

POST : $v/api/doctors/createRegistration

Form-data payload:
Key                      Type                Value (Example Data)
name                     Text                Dr.Deepak mahajan 
registrationNo           Text                MED123456
registrationDate         Text                2026-05-12
password                 Text                SecurePassword123
stateMedicalCouncil      Text                Medical Council of California
gmail                    Text                dr.johndoe@gmail.com
certificate              File                selection


Response :
{
    "success": true,
    "doctor": {
        "name": "Dr.Deepak mahajan",
        "registrationNo": "MED123456",
        "registrationDate": "2026-05-12T00:00:00.000Z",
        "certificate": "https://res.cloudinary.com/dea6funtz/image/upload/v1784266459/Doctors/ni3ssmioyvk9ltd59dnz.png",
        "password": "$2b$10$djIqnq7YdphW3YaqnyraBuTNt3pbYZpTGH7FiJKqUDCgi0bqNhdZG",
        "stateMedicalCouncil": "Medical Council of California",
        "gmail": "dr.johndoe@gmail.com",
        "verificationStatus": "Pending",
        "_id": "6a59beed46b37e30fde76e71",
        "timeCreated": "2026-07-17T05:34:37.939Z",
        "__v": 0
    }
}





POST : $v/api/doctors/createBasic

Form-data payload:
Key                      Type                Value (Example Data)
name                     Text                Dr.Deepak mahajan     
doctorId                 Text                6a59beed46b37e30fde76e71
experience               Text                10
specification            Text                Cardiology
language                 Text                English, Spanish
fee                      Text                150
image                    File                selection
contactNo                Text                +0123456789

response:
{
    "success": true,
    "doctor": {
        "doctorId": "6a59beed46b37e30fde76e71",
        "name": "Dr.Deepak mahajan  ",
        "experience": 10,
        "image": "https://res.cloudinary.com/dea6funtz/image/upload/v1784266736/Doctors/irud9qcylvsx2g7ksn6w.png",
        "specification": "Cardiology",
        "language": [
            "English, Spanish"
        ],
        "contactNo": "+1234567890",
        "category": "Specialist",
        "fee": 150,
        "_id": "6a59c00346b37e30fde76e72",
        "timeCreated": "2026-07-17T05:39:15.080Z",
        "__v": 0
    }
}


POST : $v/api/doctors/Doctorlocation
Json Payload :
{
  "doctorId": "6a59c00346b37e30fde76e72", 
  "longitude": -118.2437,
  "latitude": 34.0522,
  "streetAddress": "123 Medical Center Blvd, Suite 400",
  "landmark": "Opposite City General Hospital",
  "city": "Los Angeles",
  "state": "California",
  "zip": 90001
}
response : 
{
    "message": "doctor location added succesfully",
    "saving": {
        "doctorId": "6a59c00346b37e30fde76e72",
        "longitude": -118.2437,
        "latitude": 34.0522,
        "streetAddress": "123 Medical Center Blvd, Suite 400",
        "landmark": "Opposite City General Hospital",
        "city": "Los Angeles",
        "state": "California",
        "zip": 90001,
        "_id": "6a59c1a846b37e30fde76e77",
        "__v": 0
    }
}



POST : $v/api/doctors/DoctorSchedule

Json Payload :
{
  "doctorId": "6a59c00346b37e30fde76e72",
  "weekly": [
    {
      "day": "Monday",
      "start": "09:00 AM",
      "end": "05:00 PM",
      "isOpen": true
    },
    {
      "day": "Wednesday",
      "start": "09:00 AM",
      "end": "01:00 PM",
      "isOpen": true
    },
    {
      "day": "Sunday",
      "start": "00:00 AM",
      "end": "00:00 AM",
      "isOpen": false
    }
  ]
}

response:
{
    "message": "Doctor added the weekly schedule successfully",
    "saving": {
        "doctorId": "6a59c00346b37e30fde76e72",
        "weekly": [
            {
                "day": "Monday",
                "start": "09:00 AM",
                "end": "05:00 PM",
                "isOpen": true,
                "_id": "6a59c1e246b37e30fde76e79"
            },
            {
                "day": "Wednesday",
                "start": "09:00 AM",
                "end": "01:00 PM",
                "isOpen": true,
                "_id": "6a59c1e246b37e30fde76e7a"
            },
            {
                "day": "Sunday",
                "start": "00:00 AM",
                "end": "00:00 AM",
                "isOpen": false,
                "_id": "6a59c1e246b37e30fde76e7b"
            }
        ],
        "_id": "6a59c1e246b37e30fde76e78",
        "__v": 0
    }
}










POST : $v/api/doctors/DoctorLogin

json Payload:
{
  "gmail": "dr.johndoe@gmail.com",
  "password": "SecurePassword123"
}

response:
{
    "message": "login successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTliZWVkNDZiMzdlMzBmZGU3NmU3MSIsImlhdCI6MTc4NDI2NzI5NX0.5HppE7QxvEkVOdCuKkeeO2eZN8KBD3GmvEmn7RsNI0E"
}
