# Own backend processing

For each endpoint, you can specify which token is required to access it in the app options.

By default, all endpoints can be accessed using the public token, except for "register" and "user delete", 
which require the secret token. For more information, please refer to the "[Create an app](/guide/create-app/)" documentation.

This feature provides flexibility for storing additional user data in your own backend while only sending necessary data to the sentc backend.

In general, every main function in sentc has two equivalent functions with a `prepare` and `done` prefix.

:::: tabs#p

@tab Javascript
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

@tab Flutter
::: tip Example
```dart
//call this before you do the request to your backend
final input = await Sentc.prepareRegister("username", "password");

//call this after you call the api. in the client
final userId = await Sentc.doneRegister("server_output");
```
:::

@tab Rust
:::tip Example
````rust
use sentc::keys::StdUser;
use sentc::user::done_register;

async fn register()
{
	//normal register
	let user_id = StdUser::register("the-username", "the-password").await.unwrap();
}

fn example()
{
	//no future here
	//call this before you do the request to your backend
	let input = StdUser::prepare_register("identifier", "password").unwrap();
}

fn done(input: &str)
{
	//call this after you call the api. in the client

	let user_id = done_register(input).unwrap();
}
````
:::

::::

To retrieve the necessary server input for your API, call the `prepare` function in the client. 
Once you have this input, make a request to your own backend API using the secret token provided by sentc.

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

## Authentication

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

:::: tabs#p

@tab Javascript
````javascript
import Sentc from "@sentclose/sentc";
//call this before you do the request to your backend
const input = Sentc.prepareRegister("username", "password");
````

@tab Flutter

```dart
//call this before you do the request to your backend
final input = await Sentc.prepareRegister("username", "password");
```

@tab Rust

````rust
use sentc::keys::StdUser;

fn example()
{
	//no future here
	//call this before you do the request to your backend
	let input = StdUser::prepare_register("identifier", "password").unwrap();
}
````

::::

After your user registration call this function in the client, to check the response:

:::: tabs#p

@tab Javascript

````javascript
import Sentc from "@sentclose/sentc";

const user_id = Sentc.doneRegister("server_output");
````
::: warning
This function will throw an error if the server output is not correct.
:::

@tab Flutter

```dart
//call this after you call the api. in the client
final userId = await Sentc.doneRegister("server_output");
```

::: warning
This function will throw an error if the server output is not correct.
:::

@tab Rust

::: warning
This function will throw an error if the server output is not correct.
:::

````rust
use sentc::user::done_register;

fn done(output: &str)
{
	//call this after you call the api. in the client
	let user_id = done_register(output).unwrap();
}
````

::::

Or simply check the status of the json response in your backend.

### Login

Logging in involves multiple requests and data sharing. 
The recommended approach is to simply log in on the client-side and then call your backend to retrieve additional data. 
You can verify the JWT token from the user to ensure security.

Alternatively, you can use your own backend's login process and then log in again to the sentc API on the client-side.

The sentc API login is a highly secure process because the user's password never leaves their client device.

::: tip Jwt check
You can simply check the jwt from the sentc api with your jwt public key see more at [Create an app](/guide/create-app/).
:::

### Register device

The "Prepare register device" function is similar to the initial user registration process. 
However, the validation for device registration is the same as described in the "User" section [here](/guide/user/#register-device).

To register a device, send the necessary input to our API endpoint 
using a POST request without a JWT at: `https://api.sentc.com/api/v1/user/prepare_register_device`

:::: tabs#p

@tab Javascript
````javascript
import Sentc from "@sentclose/sentc";

const input = Sentc.prepareRegisterDeviceStart("identifier", "password");
````

@tab Flutter

```dart
final input = await Sentc.prepareRegisterDeviceStart("identifier", "password");
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example()
{
	let input = StdUser::prepare_register_device_start("device_identifier", "device_password").unwrap();
}
````

::::

To check in the client if the request was correct, use the `done` function with the server output:

:::: tabs#p

@tab Javascript

````javascript
import Sentc from "@sentclose/sentc";

const input = Sentc.doneRegisterDeviceStart("server_output");
````
::: warning
This function will throw an error if the server output is not correct.
:::

@tab Flutter

```dart
final input = await Sentc.doneRegisterDeviceStart("server_output");
```

@tab Rust

````rust
use sentc::user::done_register_device_start;

fn example(server_output: &str)
{
	let input = done_register_device_start(server_output).unwrap();
}
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

To create a group, call the "prepare" function from the user object as we need the user keys.

Send the necessary input to this endpoint using a POST request: `https://api.sentc.com/api/v1/group`

The input should contain all the client-related values needed to create a group, 
such as group keys and the encrypted group key by the user's public key.

Upon successful API request, the resulting group ID will be returned.

:::: tabs#p

@tab Javascript
```ts
const input = user.prepareGroupCreate();
```

@tab Flutter

```dart
final input = await user.prepareGroupCreate();
```

@tab Rust

````rust
use sentc::keys::StdUser;

fn example()
{
	let input = StdUser::prepare_create_group().unwrap();
}
````

::::

### Delete group

To delete a group call this endpoint with the jwt in header and a delete request: `https://api.sentc.com/api/v1/group/<group_id>` 

### Check group access

At your backend you can also check if a user got access to a group. 
Use this endpoint: `https://api.sentc.com/api/v1/group/<group_id>/light` with a GET request.

The response is either an error with status code 310 or a json object:

```
{
    "group_id",
    "parent_group_id",
    "rank",
    "created_time",
    "joined_time",
    "is_connected_group",
    "access_by"
}
```

Access by describes how the user access this group. Either direct, as member of a parent group or from a connected group.

## Refreshing the jwt

Like we said in [user - Authentification and JWT](/guide/user/#authentification-and-jwt) there are three different strategies to handle the refreshing.

### Refresh directly by the sdk

This is the default method.
Both the refresh and the jwt are stored in the client. When calling the api and the jwt is invalid this token is used.

### Refresh from a cookie

In this scenario, a request is made to your endpoint with the old JWT token included in the Authorization header. 
To refresh the token, make a PUT request to the refresh endpoint on the sentc API from your backend: `https://api.sentc.com/api/v1/refresh`. 
Include the old JWT token in the Authorization Bearer header.

When initializing the client, set the refresh endpoint option to "cookie" in the options.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

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
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
           refresh: { 
               endpoint: 0,
               endpoint_url: "<your_endpoint>"
           }
        });
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter

```dart
await Sentc.init(
  appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi",
  refreshOptions: RefreshOptions(
    endpoint: RefreshOption.cookie,
    endpointUrl: "<your_endpoint>"
  ),
);
```

@tab Rust

With the rust sdk you need to refresh it manually

::::

To get the refresh token, just get it from the user object after login. The token won't store in the client, just in the object.
Then put the refresh token in a cookie.

### Refresh with a function

The sdk won't send any requests for refreshing jwt in this case.
Instead, you can define a function to refresh the jwt, maybe do the refresh directly in your backend.

:::: tabs#p

@tab Javascript

Define a function which returns a promise and get the old jwt.

<code-group>
<code-group-item title="Installed" active>

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
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
           refresh: { 
               endpoint: 1,
               endpoint_fn: (old_jwt) => Promise<string>
           }
        });
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter

```dart
await Sentc.init(
  appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
  refreshOptions: RefreshOptions(
    endpoint: RefreshOption.cookieFn,
    endpointFn: (String oldJwt) {
      //do something with the old jwt
    }
  ),
);
```

@tab Rust

With the rust sdk you need to refresh it manually

::::

::: tip
This are all recommended endpoints to call from your backend, if you need to.
:::

## Disable Mfa from server

To disable the Multi-factor auth from your backend for a user call this endpoint: `https://api.sentc.com/api/v1/user/forced/disable_otp`
with a delete request and the following body:

```json lines
{
	"user_identifier": "<user to disable otp>"
}
```

## Delete all user sessions

This can be helpful when the user changes their password to force all devices to log out and in again. 
Keep in mind the devices that are logged in with device key and password to use the same from the device storage.

delete request with endpoint: `https://api.sentc.com/api/v1/user/forced/sessions`

```json lines
{
	"user_identifier": "<user id>"
}
```