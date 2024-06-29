# Email Audit [![Netlify Status](https://api.netlify.com/api/v1/badges/c45a1b80-7a0a-4dcf-9c95-dd287509049c/deploy-status)](https://app.netlify.com/sites/email-audit/deploys)

Email Audit is a system used to audit all emails sent from within an organization. In the event of security incidents (such as leakage of sensitive information via emails), this system will be used by the organization's auditing department to retrieve and verify the emails of the concerning parties through its admin console.

## Project Setup

Before starting the development or building the project, make sure you are in the correct project folder (i.e., the `react` folder). Also, refer to the additional tasks and challenges on the `challenge_details/CHALLENGE.md` file.

## Development

To start with the development, initially install the dependencies and then run the project in the development mode.

```bash
npm install
npm run dev
```

After running these commands, navigate to the port that was displayed on the terminal. The app should be running after the development build is finished.

## Build

To generate a production version, use the following command:

```bash
npm run build
```

You can run the newly built app locally with `npm run preview`.

## Features

This project is in an early phase, so the features are not yet complete. At the moment, it will display mocked email data from `fake-data.ts` to simulate an API response. It also doesn't have any kind of pagination at the moment, but we plan to support it in the future, as well as allowing the user to set how many items to show per page.

Since checking date and time is crucial in an auditing process, table rows have alternating background colors between dates to make it easier to distinguish emails sent on different dates. Our users are diverse and have many different device configurations, so we need to make sure the UI doesn't break when viewed at any screen size. However, since we haven't implemented a _mobile version_ of the design yet, we understand that the information cannot be consumed well on very small screen sizes.
