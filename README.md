# Decentrilized Live-chat
## Description:
A live chat using GUNjs as a decentrilized database and to handle real time synchronisation.  
the users should be able to make and account and message everyone and scroll up in the chat to view previous messages  

## Functions:
The user should be able to make an account with a username, phone number and password and Use the chat function after login in their account  
Each user should also be able to create a chat with any other user by looking up their username  
If a user is an admin he has access to the admin dashboard allowing him to delete all messages  

## Environment Variables:
```PORT```: The Port on which the server runs on  
```MONGODB_URL```: The URL to connect to the database for the user data  
```JWT_KEY```:The encryption key for the JWT  

## **Deployment**
This application is deployed using the free tier of render.com
- [Deployed Website](https://lich-z34n.onrender.com/)  

Website is deployed with the free tier of render, may take some time to load  



## Authentication:
Users have a login and register page  
To Create a User and set as admin you need to modify the entry in the database itself
While registering the users should answer security auestions to be able to recover their account  
After loging in the user should be able to logout and destroy the cookie  
### Admin Credentials:
Username: ```admin```  
Password: ```123456```

### User Credentials:
Username: ```user```  
Password: ```123456```

## toolkit:
### Backend:
-Express
-Nodejs

### Database:
For the User data: MongoDB Atlas  
For Group metadata: MongoDB Atlas  
For the messages: GUN  

### Frontend:
- HTML5  
- CSS3  
- Javascript  


