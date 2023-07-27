# User

The light sdk provides secure user register and login as well as group management. 
We are not storing any additional information about the user only the necessary data for login.
If you require additional information, such as an email address or full name, you can register the user from your own backend.

Please refer to the [own backend](/guide/advanced/backend-only/) section for more information.

The registration and login processes are mostly the same as from the end-to-end encryption sdk. 
The only difference is that there are no user keys only device keys.

## Register

The username/identifier can be anything, such as a name, email address, or random number.
The username is only required to log in to the correct device.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

await Sentc.register("username", "password");
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
        
        await sentc.register("username", "password");
    }

    run();
</script>
```
</code-group-item>
</code-group>

::: warning
This function will also throw an error if the **chosen username already exists** within your app.
:::

@tab Flutter
```dart
await Sentc.register("username", "password");
```

::: warning
This function will also throw an error if the **chosen username already exists** within your app.
:::

::::

The username and password can also be generated to ensure a unique and secure login for each device.
The following function will create a random device name and password.
However, these values are not stored, so please ensure that they are securely stored on the user's device.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

const [device_identifier, device_pw] = Sentc.generateRegisterData();

await Sentc.register(device_identifier, device_pw);
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
        
        const [device_identifier, device_pw] = sentc.generateRegisterData();
        
        await sentc.register(device_identifier, device_pw);
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter
```dart
GeneratedRegisterData data = await Sentc.generateRegisterData();

await Sentc.register(data.identifier, data.password);
```

The data looks like this:

```dart
class GeneratedRegisterData {
  final String identifier;
  final String password;
}
```

::::

The registration process will throw an error if the chosen username is already taken.
To check if a username is still available, you can use the following function,
which will return true if the username is still available:

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

const available = await Sentc.checkUserIdentifierAvailable("identifier");
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
        
        const available = await sentc.checkUserIdentifierAvailable("identifier");
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter
```dart
bool available = await Sentc.checkUserIdentifierAvailable("identifier");
```

::::

::: tip
The default app settings for user registration are designed to be used with your own backend,
as Sentc will not store any data other than the keys and username.

The following code shows how to register a user from your backend.
:::

## Own backend

If you are using your own backend to store additional user information,
you can use the prepare function to prepare the registration data.
Then, send the output to our API with a POST request to the following endpoint: `https://api.sentc.com/api/v1/register`

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

//call this in the client
const input = await Sentc.prepareRegister("identifier", "password");
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
        
        const input = await sentc.prepareRegister("identifier", "password");
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter
```dart
String input = await Sentc.prepareRegister("identifier", "password");
```

::::

See more at [own backend](/guide/advanced/backend-only/)

## Login

To log in, you just need to provide the identifier (i.e., username, email, or random number) and the password that was used during registration.
The user will then be logged in to the device associated with the given identifier.

The password is not sent to the API, so we cannot access or retrieve the user's password.
This is accomplished by using a password derivation function in the client instead of on the server.

If the identifier or the password is incorrect, this function will throw an error.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

const user = await Sentc.login("identifier", "password");
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
        
        const user = await sentc.login("identifier", "password");
    }

    run();
</script>
```
</code-group-item>
</code-group>

::: warning
This function will also throw an error if the **username is not found** or the **password is incorrect**.
:::

@tab Flutter
```dart
User user = await Sentc.login("identifier", "password");
```

::: warning
This function will also throw an error if the **username is not found** or the **password is incorrect**.
:::

::::

After successfully logging in, you will receive a user object, which is required to perform all user actions, such as creating a group.

You can obtain the actual user object by calling the init function as follows:

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

//init the javascript client
const user = await Sentc.init({
    app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"  // <-- your app token
});
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        const user = await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter
```dart
//nullable user object.
final user = await Sentc.init(appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi");
```

::::

Alternatively, you can obtain the actual user object by calling the getActualUser() function. This function will not check the JWT.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

const user = await Sentc.getActualUser();
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    const sentc = window.Sentc.default;

    async function run() {
        const user = await sentc.getActualUser();
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter
```dart
final user = await Sentc.getActualUser();
```

::::

## The User Data

The data contains all information about the user account and the device that sentc needs. 
Keys are not included unlike the end-to-end encryption sdk.

For the device:
- Asymmetric key pairs only for the device.
- Device ID.

For user account:
- The actual JWT for this session.
- The refresh token for this session.
- User ID

To get the data, just access the data in the user class.

:::: tabs#p

@tab Javascript
The devices are from type UserDeviceList

```ts
//user from login
const refresh_token = user.data.refresh_token;
const user_id = user.data.user_id;
const device_id = user.data.device_id;
```

@tab Flutter
```dart
String refreshToken = user.refreshToken;
String userId = user.userId;
String deviceId = user.deviceId;
```

::::

## Authentication and JWT

After logging in, the user receives a JSON Web Token (JWT) to authenticate with the sentc API.
This JWT is only valid for 5 minutes.
But don't worry, the SDK will automatically refresh the JWT when the user tries to make a request with an invalid JWT.

To refresh the JWT, a refresh token is needed. This token is obtained during the login process.

There are three strategies to refresh a JWT.
However, this is only necessary if you must use HTTP-only cookies for the browser.
If you are using other implementations, stick with the default.

See more at [own backend](/guide/advanced/backend-only/)

## Register Device

To register a new device, the user must be logged in on another device.
The process has three parts: preparing the data on the new device, sending the data to the logged-in device, and adding the new device.

To produce the input on the new device, follow these steps. The identifier and password could be generated the same way as during user registration.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

const input = await Sentc.registerDeviceStart("device_identifier", "device_pw");
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    const sentc = window.Sentc.default;

    async function run() {
        const input = await sentc.registerDeviceStart("device_identifier", "device_pw");
    }

    run();
</script>
```
</code-group-item>
</code-group>

::: warning
This function will also throw an error if the **username still exists for your app**
:::

@tab Flutter
```dart
String input = await Sentc.registerDeviceStart("device_identifier", "device_pw");
```

::: warning
This function will also throw an error if the **username still exists for your app**
:::

::::

Send the Input to the Logged-In Device (possibly through a QR code, which the logged-in device can scan), and call this function with the input.

:::: tabs#p

@tab Javascript
```ts
//the user obj from login
await user.registerDevice(input);
```

@tab Flutter
```dart
//the user obj from login
await user.registerDevice(input);
```

::::

This will ensure that only the user's devices have access to the user's data.

After this, the user can log in on the new device.

## Get devices

The device list can be fetched through pagination.

:::: tabs#p

@tab Javascript

```ts
const devices = await user.getDevices();
```

The devices are an array and each item is from type UserDeviceList

````ts
interface UserDeviceList
{
	device_id: string,
	time: number,
	device_identifier: string
}
````

@tab Flutter
```dart
List<UserDeviceList> devices = await user.getDevices();
```

The devices are a list of class UserDeviceList

```dart
class UserDeviceList {
  final String deviceId;
  final String time;
  final String deviceIdentifier;
}

```

::::

To fetch the next pages, simply call this function with the last fetched device.

:::: tabs#p

@tab Javascript
The devices are from type UserDeviceList

```ts
const last_item = devices[devices.length - 1];

const devices_page_two = await user.getDevices(last_item);
```

@tab Flutter
The devices are from type UserDeviceList

```dart
List<UserDeviceList> devicesPageTwo = await user.getDevices(devices.last);
```

::::

## Change password

The user must enter the old and new passwords.

:::: tabs#p

@tab Javascript

```ts
await user.changePassword("old_password", "new_password");
```
::: warning
This function will also throw an error if **the old password was not correct**
:::

@tab Flutter
```dart
await user.changePassword("old_password", "new_password");
```

::: warning
This function will also throw an error if **the old password was not correct**
:::

::::

## Reset password

Unlike in the end-to-end encryption sdk, the user don't have to be logged in for resetting the password. 
For security reasons this process can only be done with your backend (with the secret token) and not from your frontend (public token).

To prepare the reset, register the actual user device again with a new password:

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

//call this in the client
const input = await Sentc.prepareRegister("identifier", "password");
```
</code-group-item>

<code-group-item title="Browser">

```html
<script>
    //init the wasm
    const sentc = window.Sentc.default;

    async function run() {
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
        
        const input = await sentc.prepareRegister("identifier", "password");
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter
```dart
String input = await Sentc.prepareRegister("identifier", "password");
```

::::

Then send this data to the sentc api reset password endpoint from your backend. 
This is important because we don't do any checks about if the user got the permission to reset a password (like owning the email address, etc.), this must be done by your backend.

If you validate the password reset request, then send the input to the following endpoint: `https://api.sentc.com/api/v1/user/reset_pw_light`


## Update user or device identifier

This will change the user identifier. The function will throw an error if the identifier is not available.
Only the identifier of the actual device will be changed.

:::: tabs#p

@tab Javascript

```ts
await user.updateUser("new_identifier");
```
::: warning
This function will also throw an error if **the identifier still exists for your app**
:::

@tab Flutter
```dart
await user.updateUser("new_identifier");
```

::: warning
This function will also throw an error if **the identifier still exists for your app**
:::

::::

## Log out

After logging out, all local data will be deleted from the client.

:::: tabs#p

@tab Javascript

```ts
await user.logOut();
```

@tab Flutter
```dart
await user.logOut();
```

::::


## Delete device

To delete a device, a device password from any device and the device ID are needed.
The ID can be obtained from the user data or by fetching the device list.

:::: tabs#p

@tab Javascript

```ts
await user.deleteDevice("password", "device_id");
```
::: warning
This function will also throw an error if **the password was not correct**
:::

@tab Flutter
```dart
await user.deleteDevice("password", "device_id");
```

::: warning
This function will also throw an error if **the password was not correct**
:::

::::

Get the device id from the user data:

:::: tabs#p

@tab Javascript
```ts
//user from login
const device_id = user.data.device_id;
```

@tab Flutter
```dart
String deviceId = user.deviceId;
```

::::

## Delete account

To delete the entire account, use any device password.

:::: tabs#p

@tab Javascript

```ts
await user.deleteUser("password");
```
::: warning
This function will also throw an error if **the password was not correct**
:::

@tab Flutter
```dart
await user.deleteUser("password");
```

::: warning
This function will also throw an error if **the password was not correct**
:::

::::