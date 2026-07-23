# Sending Emails via Amazon Simple Email Service

-- If you send a connection request to somebody, how to send a email to users. For that we will use Amazon SES

-- Amazon Simple Email Service -> Sign in to the console -> region Mumbai -> Search for "Iam" -> users -> create user -> name -> Attach policies directly -> search amazon ses -> Select AmazonSESFullAccess -> Next -> user created. Go to AWS Console and search for SES -> Amazon SES -> Account dashboard -> View get setup page -> Create identity -> Identity type "Domain" -> Enter devtinder.in -> Easy DKIM -> RSA_2048_BIT -> Enabled (both) -> Create Identity.

-- If no domain name -- Verify an email address - Go to amazon ses -> Create Identity -> Email address -> verify using link . AWS Verifies sender's email ids

-- Cloudflare -> DNS Records -> Copy the CNAME DNS Record and value from Amazon SES and paste it in cloudflare DNS Records -> Turn off proxy. Create another CNAME Record. Create 3 DNS Records. AWS will verify that devtinder is our domain. It takes 10 min. Identity verifies. DNS Configuration successful

-- Amazon SES -> Go to getsetup page -> Request production access -> Website url ( https://devtinder.in/) -> Additional contacts -> support@namastedev.com -> acknowledge -> Submit

-- Amazon SES -> IAM -> Users -> Security credentials -> Create an access key -> select other -> next -> create access key -> copy the secret access key -> devtider-backend code -> .env file -> AWS_SES_SECRET="the key" , copy the access key and store as AWS_ACCESS_KEY="access key" -> Done.

-- Go to AWS SES NODEJS DOC -> Send Email using Amazon SES -> Sending an email code.

-- Install AWS SDK V3 - AWS - Documentation -> AWS SDK for javascript -> Get started with Node js -> code examples -> Amazon ses -> Send Email.

-- Inside utils folder -> create sesClient.js file -> copy code of sesClient.js from git repo "aws-doc-sdk-examples" -> install the package before running the code -> npm i @aws-sdk/client-ses -> change import and export style to require and module.exports -> const {SESCient} = require("@aws-sdk/client-ses") -> module.exports = {sesClient} -> change REGION to "ap-south-1".

-- Configure your SES Client in v3 -> add accesskey -> const sesClient = new SESClient({ region: REGION , credentials : { accessKeyId: process.env.AWS_ACCESS_KEY , secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY}})

-- ses SEND Email -> Inside utils folder -> create sesSendEmail.js file -> copy code of ses_sendemail.js from git repo "aws-doc-sdk-examples" -> change import and export style to require and module.exports -> but add your verified identities (domain name and email address), else email will not go through sandbox.

-- Test your code - if i send a connection request, it should send me an email.

-- Inside request.js file, import sendEmail file by writing const sendEmail = require("../utils/sendEmail") -> inside the api "/request/send/:status/:toUserId"

-- After the line .save() , write const emailRes = await sendEmail.run(), console.log(emailRes) to check

-- Restart your server -> npm run dev -> click on interested of an usercard and get api response under networks tab -> check your email to receive and email from aws.

-- To make our mail dynamic -- Inside sendEmail.js file -- const run = async (subject, body){ ..., subject , body} ,
const sendEmailBodyCommand = (toAddress, fromAddress, subject, body) {... , Subject: {.. Data: subject}, Body: {{Data: `<h1>${body}</h1>`}}}
write a custom message or the response inside run, const emailRes = await sendEmail.run(here)

-- Check your or the emails of the receiver to receive the customised email from the aws that "somebody is interested in the receiver"

-- create your .env file in the aws machine as our github code doesnot have th dotenv file which contains the secret keys needed to run our code.

-- login to your machine by ssh

-- Run git pull to get the lastest pushed code from github. restart pm2 or stop and start fresh.

-- sudo nano .env to edit the .env file, add the contents of env file.

-- restart pm2 and refresh devtinder.in/login and explore.

-- Always keep your pem files safe.

-- Add the parameter "toEmailId" in the line const run = async (subject, body, toEmailId)

# Scheduling Cron Jobs in NodeJs

-- Installing node cron
-- Learning about cron expression syntax - crontab.guru
-- Schedule a job
-- date-fns
-- Find all the unique email ids who have got connection request in previous day
-- Send Email
-- Explore queue mechanism to send bulk emails or
-- Amazon SES Bulk emails
-- Make sendEmail function dynamic
-- bee-queue && bull npm packages

# Payment Gateway Integration ft. Razorpay

-- Sign up to RazorPay & complete KYC
-- Created a UI for premium page.
-- Created an api for create order in backend
-- Check "Razorpay documentation node js" and "npm i razorpay" in backend, follow Integrate With Razorpay Payment Gateway
-- Added my key and secret in env file
-- Initialised razorpay in utils
-- Created order on RazorPay
-- Created Schema and Model
-- Saved the order in payments collection
-- Make the API dynamic (passing gold, silver memberships)
-- Setup Razorpay webhook on your live api . localhost won't work here. Go to razorpay website dashboard -> accounts & settings -> webhooks -> Add new webhook -> webhook url (https://devTinder.in/api/payment/webhook), secret, check payment fail, captured -> create webhook.

-- Ref - https://github.com/razorpay/razorpay-node/tree/master/documents
-- Ref - https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/#integrate-with-razorpay-payment-gateway
-- Ref - https://razorpay.com/docs/webhooks/validate-test?search-string=validate%20and%20test
-- Ref - https://razorpay.com/docs/webhooks/payments/
-- Push, Deploy and Test your code

## The flow

-- Pay Now button calls your backend's create-order API. The backend uses RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to authenticate with Razorpay's servers and creates an order there. Razorpay returns an orderId, which the backend sends back to the frontend (along with the public RAZORPAY_KEY_ID).

-- After receiving the orderId, Frontend should open the razorpay dialog box
-- Once the payment is successful, razorpay will send a webhook to us
-- "webhook" is what api should razorpay call if a payment is success or fail. Whenever there will be a successful transaction, the webhook url will be called.
-- Payment is verified by calling an api from frontend and UI is updated for payment success or failure.

Note --
Webhook is the server-to-server notification for payment success/failure (this is the reliable source of truth, not the frontend redirect).
Why webhooks matter at all — a user could close the browser tab right after paying, before the frontend gets a chance to confirm anything. The webhook guarantees your backend still finds out and updates the payment status, independent of what the frontend does. That's the actual reason localhost doesn't work for webhooks — Razorpay's servers need a publicly reachable URL to call.

# Real Time Chat using Websocket(Socket.io)

-- Build the UI for a chat window /chat/:targetUserId
-- Setup socket.io in backend
-- npm i socket.io
-- Setup frontend socket.io-client
-- Initialise the chat
-- createSocketConnection
-- Listen to events
-- Homework: Improve the UI (chat window as new chats get hidden)
-- Homework: Fix Security Bug - auth in web sockets
-- Homework: Fix bug - iF I'm not a friend, then I should not be able to send messsage
-- Homework: feat: Show Green Symbol when online, last seen 2 hours ago
-- Homework: Limit messages when fetching from DB
-- Similar Project Ideas: Tic tac toe, chess game, typeracer

## Notes

-- socket.on(...) = "I'm listening on this channel"
-- socket.emit(...) = "I'm broadcasting on this channel"
-- The event name string = the channel name — both sides must say the exact same word or they never hear each other
-- Why rooms? (so messages only go to the two people chatting, not everyone)
