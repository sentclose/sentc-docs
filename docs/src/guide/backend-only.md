# Own backend processing

For every endpoint you can decide which token can access it in the app options.

The default settings are everything with the public token but register and user delete are set to secret token. 
See more at [Create an app](/guilde/create-app/).

This gives you the flexibility to store more data about the user and just send the data we need for a user to our backend.

In general, every main function in sentc got two equivalent functions with a `prepare` and a `done` prefix.

:::: tabs type:card

::: tab Javascript
::: tip Example
````javascript
import Sentc from "@sentclose/sentc";

const user_id = await Sentc.register("username", "password");

//no promise here
//call this before you do the request to your backend
const input = Sentc.prepareRegister("username", "password");

//call this after you call the api. in the client
const user_id = Sentc.doneRegister("server_output");
````
:::

::::

Call the `prepare` function in the client to get the needed server input for our api.
Then make a request to our api from your backend with our secret token.

## Response

The response from our api is always structured the same. It is in json format.

Successfully response:

````json
{
	"status": true,
	"result": "<a message or the fetched values>"
}
````

Failed responses:

````json lines
{
	"status": false,
	"err_msg": "<text of the error message from the api>",
	"err_code": 0 //api error code as number
}
````

The `done` functions will check every server response like this to get the right result.

## Authentification

For some requests a jwt is needed. Just pass the jwt in Authorization header as Bearer token.

````
Header name: Authorization
Header value: Bearer <the_jwt>
````

## App token

For every request, you must send your app token. The sdk will send your public app token automatically.
Send it with an x-sentc-app-token header:

```
Header name: x-sentc-app-token
Header value: <your_app_token>
```

Use your public token for every frontend related requests and your secret token only for requests from your backend.

## User

::: tip
The default app settings for user register are from another backend because sentc won't save other data then the keys and the username.
:::

There is no need for an auth header for registration and login.

### Register

When creating an account, call the prepare function and send the input string to our api to the endpoint with a post request: `https://api.sentc.com/api/v1/register`

:::: tabs type:card

::: tab Javascript
````javascript
import Sentc from "@sentclose/sentc";
//call this before you do the request to your backend
const input = Sentc.prepareRegister("username", "password");
````
:::

::::

After your user registration call this function in the client, to check the response:

:::: tabs type:card

::: tab Javascript

````javascript
import Sentc from "@sentclose/sentc";

const user_id = Sentc.doneRegister("server_output");
````
::: warning
This function will throw an error if the server output is not correct.
:::

::::

Or simply check the status of the json response in your backend.

### Login

Login involved multiple requests and data sharing. 
The best option is to just login in the client and call your backend to get more data. Just check the jwt from the user. 

Another approach might be to just use your own backend login and then login in the client again to the sentc api.

The sentc api login is a very safe way to login because the password will never leave the client of your user.

::: tip Jwt check
You can simply check the jwt from the sentc api with your jwt public key see more at [Create an app](/guilde/create-app/).
:::

### Register device

Prepare register device is analog to first user register. 
But the validation of the register over a logged in device is still the same as we show in user [here](/guide/user/#register-device).

Send the input to our api to the endpoint with a post request, without a jwt: `https://api.sentc.com/api/v1/user/prepare_register_device`

:::: tabs type:card

::: tab Javascript
````javascript
import Sentc from "@sentclose/sentc";

const input = Sentc.prepareRegisterDeviceStart("identifier", "password");
````
:::

::::

To check in the client if the request was correct, use the `done` function with the server output:

:::: tabs type:card

::: tab Javascript

````javascript
import Sentc from "@sentclose/sentc";

const input = Sentc.doneRegisterDeviceStart("server_output");
````
::: warning
This function will throw an error if the server output is not correct.
:::

::::

## Group

::: danger
Do not forget to send an Authorization header with the Jwt as Bearer value.
:::

### Create group

Call the prepare function from the user object because we need the user keys.

Send this input to this endpoint with a post request: `https://api.sentc.com/api/v1/group`

The input contains all client related values are need to create a group, like group keys and the encrypted group key by users public key.

You will get back the group id was result from the api request.

:::: tabs type:card

::: tab Javascript
```ts
const input = user.prepareGroupCreate();
```
:::

::::

### Delete group

To delete a group call this endpoint with the jwt in header and a delete request: `https://api.sentc.com/api/v1/group/<group_id>` 

## Refreshing the jwt

Like we said in [user - Authentification and JWT](/guide/user/#authentification-and-jwt) there are three different strategies to handle the refreshing.

### Refresh directly by the sdk

This is the default method.
Both the refresh and the jwt are stored in the client. When calling the api and the jwt is invalid this token is used.

### Refresh from a cookie

In this case, a request is happened to your endpoint. The old jwt will be in an Authorization header.
Call the refresh endpoint from your backend with a put request: `https://api.sentc.com/api/v1/refresh` with the old jwt token as Authorization Bearer header.

Set in the options when init the client the refresh endpoint option to cookie.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

//init the javascript client
await Sentc.init({
    app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi",  // <-- your app token
    refresh: {
        endpoint: 0, // or REFRESH_ENDPOINT.cookie for typescript
        endpoint_url: "<your_endpoint>"
    }
});
```
</code-block>

<code-block title="Browser">
```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
           refresh: { 
               endpoint: 1,
               endpoint_url: "<your_endpoint>"
           }
        });
    }

    run();
</script>
```
</code-block>
</code-group>
:::

::::

To get the refresh token, just get it from the user object after login. The token won't store in the client, just in the object.
Then put the refresh token in a cookie.

### Refresh with a function

The sdk won't send any requests for refreshing jwt in this case.
Instead, you can define a function to refresh the jwt, maybe do the refresh directly in your backend.

:::: tabs type:card

::: tab Javascript

Define a function which returns a promise and get the old jwt.

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

//init the javascript client
await Sentc.init({
    app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi",  // <-- your app token
    refresh: {
        endpoint: 1, // or REFRESH_ENDPOINT.cookie_fn for typescript
        endpoint_fn: (old_jwt: string) => Promise<string>
    }
});
```
</code-block>

<code-block title="Browser">
```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
           refresh: { 
               endpoint: 1,
               endpoint_fn: (old_jwt: string) => Promise<string>
           }
        });
    }

    run();
</script>
```
</code-block>
</code-group>
:::

::::

::: tip
This are all recommended endpoints to call from your backend, if you need to.
:::