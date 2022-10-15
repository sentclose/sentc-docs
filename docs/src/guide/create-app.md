# Application

## Create an account

1. Got to [https://api.sentc.com/dashboard/register](https://api.sentc.com/dashboard/register) and fill in the account information:
- Email
- First name
- Last name
- Company (optional)

2. Choose a password
3. Confirm the password
4. Fill out the captcha to prove that you are not a bot
5. Click register

After registration, you will receive an email. Please click on the link in the email to verify your email address.

Then you are ready to create applications.

## Create an app

1. When you are on the main dashboard page, click of the New App button in the right corner.
2. You can choose an app name (the name will be displayed on the dashboard to find your app easier).
3. Optional change the app options or file options. To change the app options click on the app options name and then options panel will open. The same for file options. 
Default are: files disabled and only user register and user delete are only accessible with your secret token. See App options for more.
4. After you will get your app tokens (public and secret) and jwt keys (sign and verify). 
You can download every important keys and tokens as .env file.

## App tokens and keys

After registration, you will get your app tokens and the jwt keys.

### Jwt keys

With the jwt keys you can create a jwt which is valid for your app at the sentc api (with the sign key) or verify a jwt (with the verify key).
The jwt is structured the following:

:::: tabs type:card

::: tab Javascript

````json lines
{
    aud: string,
    sub: string,
    exp: number,
    iat: number,

	internal_user_id: string,
	group_id: string,
	device_id: string,
	device_identifier: string,
	fresh: boolean
}
````

:::

::::

- sub is the app id (which is double-checked on the api)
- internal_user_id is user id at sentc api
- group_id is the user device group (this value can be ignored)
- device_id the actual logged in device of the user
- fresh, after login the user will get a fresh token. When the tokens refresh, 
the jwt is not fresh anymore. A fresh jwt is needed to delete a user, but the sdk will log in the user again before delete to get a fresh jwt

### App tokens

With the public app token we know that you are accessing the api via the frontend. With the secret token we know it is the backend. 
App tokens are hashed after creation on the backend and can't recover. 
To renew the app tokens keep in mind that you need to update the public app token for your sdk too.


## App options

In the app option you can control which token can access which endpoint. 
The default values are public token for every endpoint except for register and delete user. 
Because sentc only stores the required data, only the username and the encrypted keys, 
you may need more values from your users, like an e-mail or the full name.

To change the options, just click in the row of the endpoint to public, secret or block (which means no token can access this endpoint).

You can also choose other fast options to click on LAX button to allow the public token access for all endpoints.

## App file options

Default is none. No file handling from sentc.

If you choose Sentc api then you are using the sentc api storage. No more configuration from your side is needed.

### Own backend

Own backend enables you to store the files at your backend storage (so you don't need to pay our storages prices). 
Please set the files delete endpoint from your backend, 
which we will call with a delete request and the deleted file part names in the body as json array:

````json
["name_0", "name_1", "name_2"]
````

A file got many parts and every part got an id. This id is in the array.

We are deleting the files with a worker, so there can be many file parts at once.

You can also set a token, so you know that the request comes from the sentc api to delete your files.

See [Files](/guide/file/) for more about file handling in sentc.