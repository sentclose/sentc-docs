# User

Sentc provides secure registration and login capabilities out of the box, 
but we do not store any additional data about the user. 
If you require additional information, such as an email address or full name, you can register the user from your own backend.

Please refer to the [own backend](/guide/backend-only/) section for more information.

Users are required for encryption/decryption and group joining. 
Each user has a public and private key, as well as a sign and verify key. 
These keys are not available through the API, as they are encrypted using the provided password, 
which the API does not have access to.

A user account can have multiple devices with different logins, but any device can access the user's keys.

## Register

The first registration is also considered the first device registration. 
Please refer to the "Register a Device" section for more information.

The username/identifier can be anything, such as a name, email address, or random number. 
The username is only required to log in to the correct device.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

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

::::

The username and password can also be generated to ensure a unique and secure login for each device. 
The following function will create a random device name and password. 
However, these values are not stored, so please ensure that they are securely stored on the user's device.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

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

::::

The registration process will throw an error if the chosen username is already taken. 
To check if a username is still available, you can use the following function, 
which will return true if the username is still available:

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

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

::::

::: tip
The default app settings for user registration are designed to be used with your own backend, 
as Sentc will not store any data other than the keys and username. 

The following code shows how to register a user from your backend.
:::

### Own backend

If you are using your own backend to store additional user information, 
you can use the prepare function to prepare the registration data. 
Then, send the output to our API with a POST request to the following endpoint: `https://api.sentc.com/api/v1/register`

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

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

::::

See more at [own backend](/guide/backend-only/)

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
import Sentc from "@sentclose/sentc";

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

::::

After successfully logging in, you will receive a user object, which is required to perform all user actions, such as creating a group.

You can obtain the actual user object by calling the init function as follows:

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

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

::::

Alternatively, you can obtain the actual user object by calling the getActualUser() function. This function will not check the JWT.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

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

::::

## The User Data

The data contains all information about the user account and the device that sentc needs.

For the device:
- Asymmetric key pairs only for the device.
- Device ID.

For user account:
- Asymmetric key pairs for the account (which are also used to join a group).
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

::::

## Authentication and JWT

After logging in, the user receives a JSON Web Token (JWT) to authenticate with the sentc API. 
This JWT is only valid for 5 minutes. 
But don't worry, the SDK will automatically refresh the JWT when the user tries to make a request with an invalid JWT.

To refresh the JWT, a refresh token is needed. This token is obtained during the login process.

There are three strategies to refresh a JWT. 
However, this is only necessary if you must use HTTP-only cookies for the browser. 
If you are using other implementations, stick with the default.

See more at [own backend](/guide/backend-only/)


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

::::

Send the Input to the Logged-In Device (possibly through a QR code, which the logged-in device can scan), and call this function with the input.

:::: tabs#p

@tab Javascript
```ts
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

::::

To fetch the next pages, simply call this function with the last fetched device.

:::: tabs#p

@tab Javascript
The devices are from type UserDeviceList

```ts
const last_item = devices[devices.length - 1];

const devices = await user.getDevices(last_item);
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

::::

## Reset password

To reset a password, the user must be logged in on the device. 
A normal reset without being logged in is not possible because the user must have access to the device keys. 
If the user doesn't have access, he/she can no longer decrypt the information because the sentc API doesn't have access to the keys either.

When resetting the password, the secret keys of the device will be encrypted again with the new password.

:::: tabs#p

@tab Javascript

```ts
await user.resetPassword("new_password");
```

::::

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

::::

## Log out

After logging out, all local data will be deleted from the client.

:::: tabs#p

@tab Javascript

```ts
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

::::

Get the device id from the user data:

:::: tabs#p

@tab Javascript
The devices are from type UserDeviceList

```ts
//user from login
const device_id = user.data.device_id;
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

::::

## Public user information

Only the newest public key is used. You can just fetch the newest public key or a verify key by id.

Public key:

:::: tabs#p

@tab Javascript

```ts
import Sentc from "@sentclose/sentc";

//this retuns the key and the key id
const {key, id} = await Sentc.getUserPublicKey("<user_id>");
```

::::

Verify Key:

This key can only be fetched by id because to verify data you need a specific verify key.

:::: tabs#p

@tab Javascript

```ts
import Sentc from "@sentclose/sentc";

//this retuns just the key
const key = await Sentc.getUserVerifyKey("<user_id>", "<verify_key_id>");
```

::::

## Create safety number

A safety number (or public fingerprint) can be used to check if another user is the real user. 
Both users can create a safety number with each other and can then check if the number is the same. 
This check should be done live in person or via video chat.

:::: tabs#p

@tab Javascript
```ts
const number = await user.createSafetyNumber({
	user_id: "<user_to_compare_id>",
	verify_key_id: "<the_verify_key_id_to_compare>"
});

//the other user side
const number_2 = await user.createSafetyNumber({
	user_id: "<user_to_compare_id>",
	verify_key_id: "<the_verify_key_id_to_compare>"
});
```

@tab Flutter
```dart
final number = await await user.createSafetyNumber(
  UserVerifyKeyCompareInfo(
    "<user_to_compare_id>", 
    "<the_verify_key_id_to_compare>",
  ),
);

//the other user side
final number2 = await await user.createSafetyNumber(
  UserVerifyKeyCompareInfo(
    "<user_to_compare_id>", 
    "<the_verify_key_id_to_compare>",
  ),
);
```

::::

## Verify a users public key

To make sure that the public key which is used to encrypt the group keys really belongs to the user, this key can be verified.
A safety number can be helpful to check if the verify key is the right one.

:::: tabs#p

@tab Javascript
```ts
//fetch a public key of a user
const public_key = await sentc.getUserPublicKey(user_id);

//now verify if this key is from the same user
const verify: boolean = await sentc.verifyUserPublicKey(user_id, public_key);
```

@tab Flutter
```dart
final publicKey = await Sentc.getUserPublicKey(userId);

final verify = await Sentc.verifyUserPublicKey(userId, publicKey);
```

::::

To check the right verify key of this public key the user can get it:

:::: tabs#p

@tab Javascript
```ts
const public_key = await sentc.getUserPublicKey(user_id);

const verify_key_id = public_key.public_key_sig_key_id;

//create a safety number with this key
const number = await user.createSafetyNumber({
	user_id: user_id,
	verify_key_id: verify_key_id
});

const verify: boolean = await sentc.verifyUserPublicKey(user_id, public_key);
```

@tab Flutter
```dart
final publicKey = await Sentc.getUserPublicKey(userId);

final verifyKeyId = publicKey.publicKeySigKeyId;

//create a safety number with this key
final number = await user.createSafetyNumber(
  UserVerifyKeyCompareInfo(userId, verifyKeyId),
);

final verify = await Sentc.verifyUserPublicKey(userId, publicKey);
```

::::
