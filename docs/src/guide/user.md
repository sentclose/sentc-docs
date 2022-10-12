# User

Sentc provides secure registration and login out of the box, but we don't store any data about the user.
If you need more values to store about the user like E-mail or Full name you can register the user from your own backend. 

See more at [own backend](/guide/backend-only/)

Users are needed to encrypt / decrypt and join groups. A user got public/private key and sign/verify key. 
The keys are not available for the api because they are encrypted with the given password, which the api won't know. 

A user account can have multiple devices with different logins but any device can access the user keys.

## Register

The first register is also the first device register. See register a device for more.

The username / identifier can be anything, like a name, an email or a random number. 
The name is only needed to log in to the right device.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

await Sentc.register("username", "password");
```
</code-block>

<code-block title="Browser">
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
</code-block>
</code-group>

:::

::::

The username and password can be generated too, to get a unique and secure login for each device. 
The following function will create a random device name and password. 
But they are not stored, so store them on the device of the user.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

const [device_identifier, device_pw] = Sentc.generateRegisterData();

await Sentc.register(device_identifier, device_pw);
```
</code-block>

<code-block title="Browser">
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
</code-block>
</code-group>

:::

::::

The registration will throw an error if the username is already taken. There is a way to check if the name is taken. 
This function will return true is the name is still available:

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

const available = await Sentc.checkUserIdentifierAvailable("identifier");
```
</code-block>

<code-block title="Browser">
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
</code-block>
</code-group>

:::

::::

### Own backend

When you are using your own backend to store more information about the user, you can just use the prepare function. 
Send the output to our api with a post request to this endpoint: `https://api.sentc.com/api/v1/register`

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

const input = await Sentc.prepareRegister("identifier", "password");
```
</code-block>

<code-block title="Browser">
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
</code-block>
</code-group>

:::

::::

See more at [own backend](/guide/backend-only/)

## Login

The login just use the identifier and the password which was used for registration. 
The user will be logged in to the device with the given identifier. 

The used password won't be sent to the api, so we can't grab the passwords of the user. 
This is done by using a password derivation function right in the client and not on the server. 

This function will throw an error if the identifier or the password are not correct.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

const user = await Sentc.login("identifier", "password");
```
</code-block>

<code-block title="Browser">
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
</code-block>
</code-group>

:::

::::

After successfully logged in you get a user object back which is needed to fulfill all user action, like creating a group.

You can still get the actual user object by calling the init function like this:

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

//init the javascript client
const user = await Sentc.init({
    app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"  // <-- your app token
});
```
</code-block>

<code-block title="Browser">
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
</code-block>
</code-group>
:::

::::


or by calling get actual user function. This function won't check the jwt.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

const user = await Sentc.getActualUser();
```
</code-block>

<code-block title="Browser">
```html
<script>
    const sentc = window.Sentc.default;

    async function run() {
        const user = await sentc.getActualUser();
    }

    run();
</script>
```
</code-block>
</code-group>
:::

::::

## The user data

The data contains all information about the user account and the device, sentc needs.

For the device:
- asymmetric key pairs only for the device
- device id

For user account:
- asymmetric key pairs for the account (which is also used to join a group)
- the actual jwt for this session
- the refresh token for this session
- user id

To get the data just access the data in the user class.

:::: tabs type:card

::: tab Javascript
The devices are from type UserDeviceList

```ts
//user from login
const refresh_token = user.data.refresh_token;
const user_id = user.data.user_id;
const device_id = user.data.device_id;
```
:::

::::

## Authentification and JWT

After login the user received a json web token (jwt) to authenticate at the sentc api. This jwt is only valid for 5 min.
But don't worry the sdk will refresh the jwt automatically when the users try to do a request with an invalid jwt.

For refreshing the jwt a refresh token is needed. This token is obtained by the login too.

There are 3 strategies to refresh a jwt. 
However, this is only necessary if you must use http-only cookies for the browser.
If you are using other implementations, go with the default.

See more at [own backend](/guide/backend-only/)


## Register device

To register a new device, the user must be logged in on another device.
The process has three parts: prepare the data on the new device, send the data to the logged in device and add the new device.

On the new device do this to produce the input. The identifier and the password could be generated the way we showed at register user.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>
```ts
import Sentc from "@sentclose/sentc";

const input = await Sentc.registerDeviceStart("device_identifier", "device_pw");
```
</code-block>

<code-block title="Browser">
```html
<script>
    const sentc = window.Sentc.default;

    async function run() {
        const input = await sentc.registerDeviceStart("device_identifier", "device_pw");
    }

    run();
</script>
```
</code-block>
</code-group>
:::

::::

Send the input to the logged in device (maybe through a QR code, the logged in device just scans the qr code) and call this function with the input.

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
await user.registerDevice(input);
```
:::

::::

This will make sure that only the devices of the user got access to the user data.

After this the user can just log in on the new device.

## Get devices

The device list can be fetched via pagination.

:::: tabs type:card

::: tab Javascript

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

:::

::::

To fetch the next pages, just call this function with the last fetched device.

:::: tabs type:card

::: tab Javascript
The devices are from type UserDeviceList

```ts
const last_item = devices[devices.length - 1];

const devices = await user.getDevices(last_item);
```
:::

::::

## Change password

The user must enter the old and the new password.

:::: tabs type:card

::: tab Javascript

```ts
await user.changePassword("old_password", "new_password");
```
:::

::::

## Reset password

To reset a password the user must be logged in on the device. 
A normal reset without logged in is not possible because the user must have access to the device keys. 
If the user doesn't have access he/she can't decrypt the information anymore because the sentc api got not access to the keys too.

When resetting the password, the secret keys of the device will be encrypted again with the new password.

:::: tabs type:card

::: tab Javascript

```ts
await user.resetPassword("new_password");
```
:::

::::

## Update user or device identifier

This will change the user identifier. The function will throw an error if the identifier is not available. 
Only the identifier of the actual device will be changed.

:::: tabs type:card

::: tab Javascript

```ts
await user.updateUser("new_identifier");
```
:::

::::

## Log out

After logout, every local data will be deleted from the client.

:::: tabs type:card

::: tab Javascript

```ts
await user.logOut();
```
:::

::::


## Delete device

To delete a device the device password and the device id are needed to delete the device. The id can be got from the user data 
or from fetching the device list.

:::: tabs type:card

::: tab Javascript

```ts
await user.deleteDevice("password", "device_id");
```
:::

::::

Get the device id from the user data:

:::: tabs type:card

::: tab Javascript
The devices are from type UserDeviceList

```ts
//user from login
const device_id = user.data.device_id;
```
:::

::::

## Delete account

To delete the whole account, use any device password. 

:::: tabs type:card

::: tab Javascript

```ts
await user.deleteUser("password");
```
:::

::::