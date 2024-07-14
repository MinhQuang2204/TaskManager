# Task Manager

This project is a Task Management System designed to streamline the process of creating, managing, and tracking tasks within an organization. The system allows users to assign tasks, set deadlines, and engage in discussions, all in one centralized platform.

## Features

- **User Authentication:** Secure login and registration for users.
- **Task Management:** Create, edit, and delete tasks with detailed descriptions, start and end dates, and times.
- **Status Tracking:** Track task status through different stages: backlog, todo, doing, and done.
- **User Assignment:** Assign tasks to multiple users and designate followers for task updates.
- **File Attachments:** Upload and manage files related to tasks.
- **Discussions:** Engage in threaded discussions for each task.

## Technologies Used

- **Frontend:** React, Redux, Material-UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Date Handling:** Moment.js

## Installation

To get this project up and running on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MinhQuang2204/TaskManager.git
   cd TaskManager

2. **Install dependencies:**  
   go to each individial folder and run yarn or yarn install
   - Backend
   ```bash
   cd server 
   yarn install
   ```
   - Frontend
   ```bash
   cd ../frontend
   yarn install
   ```
3. **Run the application:**  
   go back to root folder and run
   - Backend
   ```bash
      node server/server.js
   ```
   - Frontend
   ```bash
      yarn run dev
   ```
## Usage
1. Register an account or log in if you already have one.
2. Create a new task by providing the necessary details such as task name, description, start and end dates, and assigning it to users.
3. Upload any relevant files to the task.
4. Engage in discussions with your team members to ensure everyone is on the same page.
5. Track the status of the task from creation to completion.
   





