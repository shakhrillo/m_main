# GMR Scrap

## Installation

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Create a `.env` file. You can use the `.env.example` file as a template and fill in the necessary values.

Install the dependencies:

Run application:

You can change the .env APP_ENVIRONMENT variable to `production` to deploy or `development` to run locally.

npm run setup

Client firebase configuration:

Get the firebase configuration value from the firebase console and replace the values in the `client/src/firebaseConfig.json` file. You can use the `client/src/firebaseConfig.example.json` file as a template.

Firebase service account configuration:
To get your Firebase service account configuration, follow these steps:
1. Go to Firebase Console
Open Firebase Console.
Select your project.
2. Navigate to Service Accounts
In the left menu, click on Project settings (gear icon ⚙️).
Go to the Service accounts tab.
3. Generate a New Private Key
Click Generate new private key.
This will download a JSON file containing your Firebase service account credentials.
4. Save the JSON file in the root directory of the project and rename it to `firebaseServiceAccount.json`.

You can use the `firebaseServiceAccount.example.json` file as a template.



