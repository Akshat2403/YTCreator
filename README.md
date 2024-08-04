# YTCreator

---

Welcome to YTCreator, a revolutionary platform designed to streamline the video upload process for YouTube creators. Our goal is to enhance the collaboration between creators and their editors, ensuring that high-quality, edited content is seamlessly uploaded to YouTube with minimal effort. 
It is built using Node.js, Express.js, Next.js, Prisma ORM, and PostgreSQL.

---

## Features

- **Creator-Editor Collaboration**: YTCreator allows YouTube creators to map their accounts with designated editors. This setup facilitates a smooth workflow where editors can directly upload edited videos to the creator's dashboard.
- **Secure Video Uploads**: Once an editor uploads an edited video to the YTCreator platform, it awaits the creator's authorization. This ensures that creators have full control over the content before it goes live on their YouTube channel.
- **Simplified Authorization Process**: Creators receive notifications when a new video is uploaded by their editor. With just a few clicks, creators can review, approve, and authorize the video for direct upload to their YouTube channel.
- **Direct Integration with YouTube**: After authorization, the video is automatically uploaded to the creator's YouTube channel without the need for additional steps. This direct integration reduces the time and effort required for video publishing.
---

## Run Locally

Clone the project

```bash
  git clone https://github.com/Akshat2403/YTCreator
```

Go to the project directory

```bash
  cd YTCreator
```

Install dependencies

In Client

```bash
  cd client
  npm i
```

In Server
```bash
  cd server
  npm i
```

#### Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the server directory

`DATABASE_URL`: `Your PostgreSQL DATABASE_URL`

`JWT_SECRETKEY`:`JWT_SECRETKEY`

Migrate the Schema

```bash
  cd server
```

```bash
  npx prisma migrate dev
```

Run Client

```bash
  cd client
```

```bash
  npm run dev
```
Run Server

```bash
  cd server
```

```bash
  npx tsx index.ts
```

Open your web browser and visit http://localhost:3000 to access YTCreator.

---

## Usage (Testing)

1. Make sure you have completed the installation steps mentioned in the README.
2. Open your web browser.In the address bar, enter http://localhost:3000.

4. Sign Up for a account

- Click on the "New to YTCreator" link.
- Provide the required information, such as username and password, to create a new account.
- During SignUp process, you can choose roles as Creator and Editor respectively.

5. Log in to your account:

- Click on the "Log In" link
- Enter your credentials (username and password) to log in to your account.

6. As a Creator, please follow these steps:

- After Login you can create,read,update and delete the jobs from your Dashboard.
- For each job, you have choose a designated editor which can be linked to your account in the profile page.
- Each job can be assigned to only one editor at a time and can be seen by the editor on his dashboard.
- After getting a job assigned, a editor can upload the edited video to the job marking the status as Uploaded.
- The Creator can either Complete the job that is upload the video to Youtube or update the job demarking it as pending.
- Befor uploading the video on Youtube, the creator has to add the credentials from the profile page which can be generated from Google Cloud console under the Youtube api section ref?????????? 
- Along with the credentials, the creator has to provide a secret key(which can't be restored late to Secure the credentials).
- For uploading the video, Select the job you want to complete and click the upload button, where you have to provide the secret key for authorizing the upload and fill/update the necessary details such title, description etc and hit the upload button after adding the secret key again to the form.

7. As a editor, please follow these steps:

- All the jobs assigned to the editor will be displayed on the dashboard.
- The details of the job are provided in the additional comments section of the job.
- After editing the video, editor can upload the video by filling the editor upload form of the respective job.
- The creator can complete the job by uploading it to Youtube or can demark it as pending with new comments for any changes.
---

## Screenshots

#### Dashboard

![Dashboard](https://github.com/user-attachments/assets/c0699ee2-d83c-4af8-8d7b-f4b6c5229854)

#### Login Screen

![Login](https://github.com/user-attachments/assets/2ebca576-1bc6-4184-a612-d9883fd2e43b)

#### SignUp Screen

![SignUp](https://github.com/user-attachments/assets/9031197a-207d-4e52-9c18-ffe4de7f65bc)

#### Profile Screen

![Profile](https://github.com/user-attachments/assets/f8b77513-f06b-434c-81f9-32f4e339c7be)

#### Create/Update Job
![Job](https://github.com/user-attachments/assets/a8ec2139-a221-4e3d-b0d6-008596a9a717)

#### Upload Screen

![Upload](https://github.com/user-attachments/assets/c8340865-a04f-4eb7-8c13-875e9bfd7aa6)


#### Editor Upload Form

![Uploadyoutube](https://github.com/user-attachments/assets/2b9ad05f-585a-4de2-88d7-ea236e65b25b)
