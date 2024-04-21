## ABOUT THE PROJECT
Users can set their properties (house, building ..) for sale or they can check for some property to buy.
With online payment.
In this project i have used many functionalities and i wanted to implement the maximum of functionalities, so that you can discover and reach the maximum of situations and requirements for web development.

Technologies used: Node.js express.js, Mysql (using Sequelize.js ORM), React js and Bootstrap5 (i have worked on UI and make it responsive).
This project containing Admin and user Dashboards ( authorization by user role ). User  Dashbord didn't have the same view as admin dashboard

- React router dom to manage Routes in react, using Private and Public routes, Persist user login so the user state didn't lost when visiting another site or when refresh page
- React styled components.
- JWT: access and refresh tokens, store refresh token in DB and cookies to generate new accessToken when the old one has expired.
- Nodemailer: In Contact form. and Sending email to user for account activation.
- Online payment. with Failed or Succes message
- Upload files with multer.
- Import data from XML files.
- CRUD
- Products Filter (by min/max price, space, number of rooms...)
- Articles Filter (By Date posting)
- Image Carousel Slider with "react-slick" and "slick-carousel"

## INSTALL PROJECT LOCALLY
Open new Terminal and execute these commands:

     git clone https://github.com/Hosni-Abbes/node-react-mysql__Real-Estate.git
     cd server
     npm i
   
   Note: In server i used .env to store my environement variables, so you need to create yours:
   my .env looks like this:
   
          PORT=5000
          BASE_URL=http://127.0.0.1:5000
          FRONT_BASE_URL=http://localhost:3000          
          JWT_SECRET=your_jwt_access_key
          JWT_REFRESH=your_jwt_refresh_key          
          XML_FILE=Path_to_uploads_folder
          EMAIL_USER=your_email (needed for nodemailer service "gmail" )
          EMAIL_PASS=your_app_password (needed for nodemailer service "gmail" )          
          PAYMENT_URL=https://api.preprod.konnect.network/api/v2/payments (i used Konnect api for online payment)
          GATEWAY_URL=https://gateway.sandbox.konnect.network/pay?theme=light
          PAYMENT_API_KEY=your_payement_api_key
          PAYMENT_WALLET=your_wallet
          PAYMENT_CURRENCY=TND
   
After installation completed:
  
     npm run dev
 

In anoter terminal

     cd client
     npm i

   
   After installation completed:

    npm start
