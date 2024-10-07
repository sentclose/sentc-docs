# User

Sentc provides secure registration and login capabilities out of the box, 
but we do not store any additional data about the user. 
If you require additional information, such as an email address or full name, you can register the user from your own backend.

Please refer to the [own backend](/guide/advanced/backend-only/) section for more information.

Users are required for encryption/decryption and group joining. 
Each user has a public and private key, as well as a sign and verify key. 
These keys are not available through the API, as they are encrypted using the provided password, 
which the API does not have access to.

A user account can have multiple devices with different logins, but any device can access the user's keys. 

Using Multi-factor auth with an authentication app is also possible.

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

@tab Flutter
```dart
await Sentc.register("username", "password");
```

::: warning
This function will also throw an error if the **chosen username already exists** within your app.
:::

@tab Rust
````rust
use sentc::keys::StdUser;

async fn register()
{
	let user_id = StdUser::register("the-username", "the-password").await.unwrap();
}
````

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

@tab Rust
````rust
use sentc::user::generate_register_data;

fn main()
{
	let (username, password) = generate_register_data().unwrap();
}
````

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

@tab Flutter
```dart
bool available = await Sentc.checkUserIdentifierAvailable("identifier");
```

@tab Rust
````rust
use sentc::user::net::check_user_name_available;

async fn example()
{
	let available = check_user_name_available("base_url", "app_token", "user_identifier").await.unwrap();
}
````

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

@tab Flutter
```dart
String input = await Sentc.prepareRegister("identifier", "password");
```

@tab Rust
````rust
fn example()
{
	let input = StdUser::prepare_register("identifier", "password").unwrap();
}
````

::::

See more at [own backend](/guide/advanced/backend-only/)

## Login

To log in, you just need to provide the identifier (i.e., username, email, or random number) and the password that was used during registration. 
The user will then be logged in to the device associated with the given identifier.

The password is not sent to the API, so we cannot access or retrieve the user's password. 
This is accomplished by using a password derivation function in the client instead of on the server.

If the identifier or the password is incorrect, this function will throw an error.

The Login function returns an either the user type or data for the mfa validation process.

If you disabled the Mfa in the app options then you can force login to get just the user object back.

::: tip
You can learn more about Multi-factor and how your users can enable it [below](/guide/e2ee/user/#multi-factor-authentication).
:::

### Login forced

With this method the sdk will just return the user object or throw an exception or error
if the user enabled mfa because this must be handled in order to get the user data.

:::: tabs#p

@tab Javascript

For js, just set an optional flag to true in the login function.

```ts
import Sentc from "@sentclose/sentc";

const user = await Sentc.login("identifier", "password", true);
```

@tab Flutter

For flutter, use the function loginForced instead of login.

```dart
User user = await Sentc.loginForced("identifier", "password");
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example()
{
	let user = StdUser::login_forced("base_url".to_string(), "app_token", "username", "password").await.unwrap();
}
````

::::

### Login with mfa handling

:::: tabs#p

@tab Javascript

For typescript, we are using the [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions).

An object with two properties is returned from the function: `kind` and `u`. 

- `kind` described if it is the user class (mfa not active) or the data for the mfa process (mfa activated).
- `u` contains either the user class (for no mfa) or the data for the mfa process (if mfa enabled).

For `mfaLogin` use the token from the authentication app and the user information.

```ts
import Sentc from "@sentclose/sentc";

let user: User;
const user_data: LoginUser = await Sentc.login("identifier", "password");

//to check if the user enabled mfa:
if (user_data.kind === "mfa") {
	//if true then user enabled mfa and this must be handeled
	//here with the token from the auth app from the user
	user = await Sentc.mfaLogin("<token-from-mfa-app>", user_data.u);
} else {
	user = user_data.u;
}
```

::: warning
This function will also throw an error if the **username is not found** or the **password is incorrect**.
:::

@tab Flutter

For Dart, we are using a sealed class `LoginUser`.  

A class extend by two subclasses: `MfaLogin` and `UserLogin`.

- `MfaLogin` contains the data for the mfa process
- `UserLogin` contains the User class
- both classes got a property u which holds each data.

For `mfaLogin` use the token from the authentication app and the user information class.

```dart
late User user;

LoginUser userData = await Sentc.login("identifier", "password");

if (userData is MfaLogin) {
    //if true then user enabled mfa and this must be handeled
    //here with the token from the auth app from the user
    user = await Sentc.mfaLogin("<token-from-mfa-app>", userData.u);
} else if (userData is UserLogin){
    //another if because dart would not know which type userData has
    user = userData.u;
}
```

::: warning
This function will also throw an error if the **username is not found** or the **password is incorrect**.
:::

@tab Rust
For rust an enum is returned with either the User data or mfa data.

````rust
use sentc::keys::{StdUser, StdUserLoginReturn};

async fn login()
{
	let login_res = StdUser::login("base_url".to_string(), "app_token", "username", "password").await.unwrap();

	//check if the enum is PreLoginOut::Otp, if so call mfa_login with the token from the user auth device
	match login_res {
		StdUserLoginReturn::Direct(user) => {
			//the user
		}
		StdUserLoginReturn::Otp(data) => {
			//handle otp
		}
	}
}
````

::::

### Login auth token

If the user enabled mfa, you must handle it so that the user can continue the login process.

In the above examples we already used the function that works with the auth app of the user.

:::: tabs#p

@tab Javascript

If it is right, then the user must create a token. 
The `user_data` is needed for the process, so store it somewhere until the user entered the mfa token. 

```ts
import Sentc from "@sentclose/sentc";

let user: User;
const user_data: LoginUser = await Sentc.login("identifier", "password");

//to check if the user enabled mfa:
if (user_data.kind === "mfa") {
	user = await Sentc.mfaLogin("<token-from-mfa-app>", user_data.u);
}
```

@tab Flutter

If it is right, then the user must create a token.
The `userData` is needed for the process, so store it somewhere until the user entered the mfa token.

```dart
late User user;

LoginUser userData = await Sentc.login("identifier", "password");

if (userData is MfaLogin) {
    user = await Sentc.mfaLogin("<token-from-mfa-app>", userData.u);
}
```

@tab Rust
````rust
use sentc::keys::{StdUser, StdPrepareLoginOtpOutput, StdUserLoginReturn};

async fn login()
{
	let login_res = StdUser::login("base_url".to_string(), "app_token", "username", "password").await.unwrap();

	let user = match login_res {
		StdUserLoginReturn::Direct(user) => {
			user
		}
		StdUserLoginReturn::Otp(data) => {
			//get the token first
			mfa_login("<token-from-mfa-app>".to_string(), data).await
		}
	};
}

//token from the auth app
async fn mfa_login(token: String, login_data: StdPrepareLoginOtpOutput) -> StdUser
{
	StdUser::mfa_login("base_url".to_string(), "app_token", token, "username", login_data).await.unwrap()
}
````

::::

### Login with recovery key

If the user is not able to create the token (e.g. the device is broken or stolen), then the user can also log in with a recovery key. 
These keys are obtained after mfa was enabled. If the user uses one key then the key gets deleted and can't be used again.

:::: tabs#p

@tab Javascript

```ts
import Sentc from "@sentclose/sentc";

let user: User;
const user_data: LoginUser = await Sentc.login("identifier", "password");

//to check if the user enabled mfa:
if (user_data.kind === "mfa") {
	user = await Sentc.mfaRecoveryLogin("<recovery-key>", user_data.u);
}
```

@tab Flutter

```dart
late User user;

LoginUser userData = await Sentc.login("identifier", "password");

if (userData is MfaLogin) {
    user = await Sentc.mfaRecoveryLogin("<recovery-key>", userData.u);
}
```

@tab Rust
````rust
use sentc::keys::{StdUser, StdPrepareLoginOtpOutput, StdUserLoginReturn};

async fn login()
{
	let login_res = StdUser::login("base_url".to_string(), "app_token", "username", "password").await.unwrap();

	let user = match login_res {
		StdUserLoginReturn::Direct(user) => {
			user
		}
		StdUserLoginReturn::Otp(data) => {
			//get the token first
			mfa_recovery_login("<recovery-key>".to_string(), data).await
		}
	};
}

//token from the auth app
async fn mfa_recovery_login(recovery_key: String, login_data: StdPrepareLoginOtpOutput) -> StdUser
{
	StdUser::mfa_recovery_login("base_url".to_string(), "app_token", recovery_key, "username", login_data).await.unwrap()
}
````

::::

### User object

After successfully logging in, you will receive a user object, which is required to perform all user actions, such as creating a group.

:::: tabs#p

@tab Javascript
You can obtain the actual user object by calling the init function as follows:

```ts
import Sentc from "@sentclose/sentc";

//init the javascript client
const user = await Sentc.init({
    app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"  // <-- your app token
});
```

Alternatively, you can obtain the actual user object by calling the getActualUser() function. This function will not check the JWT.

```ts
import Sentc from "@sentclose/sentc";

const user = await Sentc.getActualUser();
```

@tab Flutter
You can obtain the actual user object by calling the init function as follows:

```dart
//nullable user object.
final user = await Sentc.init(appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi");
```

Alternatively, you can obtain the actual user object by calling the getActualUser() function. This function will not check the JWT.

```dart
final user = await Sentc.getActualUser();
```

@tab Rust
You can export the user struct either when owning the struct or from its ref and import it with the parse fn from
String:

````rust
use sentc::keys::StdUser;

fn example(user: StdUser)
{
	let export = user.to_string().unwrap();

	//don't forget the type
	let imported_user: StdUser = export.parse().unwrap();
}

fn example_ref(user: &StdUser)
{
	let export = user.to_string_ref().unwrap();

	let imported_user: StdUser = export.parse().unwrap();
}
````

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

:::: tabs#p

@tab Javascript
To get the data, just access the data in the user class.

The devices are from type UserDeviceList

```ts
//user from login
const refresh_token = user.data.refresh_token;
const user_id = user.data.user_id;
const device_id = user.data.device_id;
```

@tab Flutter
To get the data, just access the data in the user class.

```dart
String refreshToken = user.refreshToken;
String userId = user.userId;
String deviceId = user.deviceId;
```

@tab Rust
To get the data, just access the data in the user struct.

````rust
fn example_ref(user: &StdUser)
{
    let refresh_token = user.get_refresh_token();
    let user_id = user.get_user_id();
    let device_id = user.get_device_id();
}
````

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

### Refresh the jwt

:::: tabs#p
@tab Javascript

The javascript sdk will always automatically check the jwt before each request and refresh the jwt if needed.

@tab Flutter
The javascript sdk will always automatically check the jwt before each request and refresh the jwt if needed.

@tab Rust
If a function returned this error: SentcError::JwtExpired then
you have to refresh the jwt to make the request. Jwt needs to be refreshed manually.

````rust
use sentc::keys::StdUser;

async fn refresh_jwt(user: &mut StdUser)
{
	let fresh_jwt = user.refresh_jwt().await.unwrap();
}
````
::::

## Multi-Factor authentication

Sentc uses Time-based one-time password (Totp) for Multi-factor auth. These tokens can easily be generated by any totp generator app like google authenticator, authy or free otp.

A secret is generated alone side with six recovery keys (just in case if the user lost access to the auth device). 
The user should print out or store the recovery keys to still get access to the account.

The auth app needs the secret and information about the used algorithm. 
The simplest way is to get an otpauth url and transform it into a qr code, so the auth app can scan it.

The mfa is bind to all devices in the user account not just the actual one. 

The user must be logged in, in order to activate mfa and has to enter the password again.
`issuer` and `audience` are needed for the auth app. Issuer can be your app name and audience the username email or something else.

:::: tabs#p

@tab Javascript

The url is for the auth app and the recovery_keys is an array of all six keys.

```ts
const [url, revocery_keys] = await user.registerOtp("<issuer>", "<audience>", "<password>");
```

@tab Flutter

The url is for the auth app and the recoveryKeys is a list of all six keys.

```dart
final (user, recoveryKeys) = await user.registerOtp("<issuer>", "<audience>", "<password>");
```

@tab Rust

````rust
use sentc::keys::StdUser;

//get the user object after login
async fn example(user: &mut StdUser)
{
	let (url, recover_codes) = user.register_otp("issuer", "audience", "password", None, None).await.unwrap();
}
````

::::

### Reset mfa

If the user only got one recovery key left or the device with the auth app ist stolen or lost then resetting the mfa is the best practice

The old recovery keys and the old secret will be deleted and replaced by new one. 
The return values are the same as in the register process.

The user also needs to enter a totp from an auth app or a recovery key in order to reset it. 
This will make sure that only a person with access can change it.

:::: tabs #p

@tab Javascript

The last parameter `mfa_recovery` is for the function to know if a recovery key (true) or a normal totp (false) is used. 
This value is required if a token is set.

```ts
//with totp
const [url, recovery_keys] = await user.resetOtp("<issuer>", "<audience>", "<password>", "<totp>", false)
```

```ts
//with recovery key
const [url, recovery_keys] = await user.resetOtp("<issuer>", "<audience>", "<password>", "<recovery_key>", true)
```

@tab Flutter

The last parameter `mfaRecovery` is for the function to know if a recovery key (true) or a normal totp (false) is used.
This value is required if a token is set.

```dart
//with totp
final (url, recoveryKeys) = await user.resetOtp("<issuer>", "<audience>", "<password>", "<totp>", false); 
```

```dart
//with recovery key
final (url, recoveryKeys) = await user.resetOtp("<issuer>", "<audience>", "<password>", "<recovery_key>", true); 
```

@tab Rust

The last parameter is for the function to know if a recovery key (Some(true)) or a normal top (None) is used.

````rust
use sentc::keys::StdUser;

async fn reset_otp(user: &StdUser)
{
	let (url, recover_codes) = user.reset_otp("issuer", "audience", "password", Some("token from auth app".to_string()), None).await.unwrap();
}
````

::::

### Disable mfa

To disable the mfa use this function:

A totp or recovery key is also needed.

:::: tabs#p

@tab Javascript

```ts
//with totp
await user.disableOtp("<password>", "<totp>", false)
```

```ts
//with recovery key
await user.disableOtp("<password>", "<recovery_key>", true)
```

@tab Flutter

```dart
//with totp
await user.disableOtp("<password>", "<totp>", false); 
```

```dart
//with recovery key
await user.disableOtp("<password>", "<recovery_key>", true); 
```

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &mut StdUser)
{
	user.disable_otp("password", Some("token from auth app".to_string()), None).await.unwrap();
}
````

::::

### Get totp recovery keys

To get the recovery keys so the user can later store them:

A totp or recovery key is also needed.

:::: tabs#p

@tab Javascript

```ts
//with totp
const keys = await user.getOtpRecoverKeys("<password>", "<totp>", false)
```

```ts
//with recovery key
const keys = await user.getOtpRecoverKeys("<password>", "<recovery_key>", true)
```

@tab Flutter

```dart
//with totp
List<String> keys = await user.getOtpRecoverKeys("<password>", "<totp>", false); 
```

```dart
//with recovery key
List<String> keys = await user.getOtpRecoverKeys("<password>", "<recovery_key>", true); 
```

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let keys = user.get_otp_recover_keys("password", Some("token from auth app".to_string()), None).await.unwrap();
}
````

::::

Alternative you can disable the mfa from your backend, e.g. if the user looses the recovery keys and the device access. 
[See here for more details](/guide/advanced/backend-only#disable-mfa-from-server)

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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn start_register_new_device()
{
	let server_res = StdUser::register_device_start("base_url".to_string(), "app_token", "device_identifier", "device_password").await.unwrap();
}
````

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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, server_res: String)
{
	user.register_device(server_res).await.unwrap();
}
````

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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let list = user.get_devices(None).await.unwrap();
}
````

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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let list = user.get_devices(Some(&list.last().unwrap())).await.unwrap();
}
````

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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.change_password("old_password", "new_password", Some("auth_token_if_any".to_string()), None).await.unwrap();
}
````

::: warning
This function will also throw an error if **the old password was not correct**
:::

::::

If the user enabled mfa then you also need to enter the token or a recovery key.

:::: tabs#p

@tab Javascript

```ts
//with totp
await user.changePassword("old_password", "new_password", "<totp>", false);
```

```ts
//with recovery key
await user.changePassword("old_password", "new_password", "<recovery_key>", true);
```

@tab Flutter

```dart
//with totp
await user.changePassword("old_password", "new_password", "<totp>", false);
```

```dart
//with recovery key
await user.changePassword("old_password", "new_password", "<recovery_key>", true);
```

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.change_password("old_password", "new_password", Some("auth_token_if_any".to_string()), None).await.unwrap();
    
    //with recovery key
	user.change_password("old_password", "new_password", Some("recovery_key".to_string()), Some(true)).await.unwrap();
}
````

::::

## Reset password

To reset a password, the user must be logged in on the device. 
A normal reset without being logged in is not possible without losing access to all data because the user must have access to the device keys. 
If the user doesn't have access, they can no longer decrypt the information because the sentc API doesn't have access to the keys either.

When resetting the password, the secret keys of the device will be encrypted again with the new password.

:::: tabs#p

@tab Javascript

```ts
await user.resetPassword("new_password");
```

@tab Flutter
```dart
await user.resetPassword("new_password");
```

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.reset_password("new_password").await.unwrap();
}
````

::::

## Reset user password with data loss

To reset the user password from your backend call this endpoint (for the request configuration see more at [own backend](/guide/advanced/backend-only/))
- `https://api.sentc.com/api/v1/user/forced/reset_user` with a put request
- the data is the same string that the user got from the `prepareRegister` function.
- All user devices will be deleted and the user can't decrypt any of the old data or any of the data inside groups but the user stays in all groups.
- The user has to be re invited to all groups see more here: [re invite](/guide/e2ee/group/#re-invite)


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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &mut StdUser)
{
	user.update_user("new_user_name".to_string()).await.unwrap();
}
````

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

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, device_id: &str)
{
	user.delete_device("password", device_id, None, None).await.unwrap();
}
````

::: warning
This function will also throw an error if **the password was not correct**
:::

::::

If the user enabled mfa then you also need to enter the token or a recovery key.

:::: tabs#p

@tab Javascript

```ts
//with totp
await user.deleteDevice("password", "device_id", "<totp>", false);
```

```ts
//with recovery key
await user.deleteDevice("password", "device_id", "<recovery_key>", true);
```

@tab Flutter

```dart
//with totp
await user.deleteDevice("password", "device_id", "<totp>", false);
```

```dart
//with recovery key
await user.deleteDevice("password", "device_id", "<recovery_key>", true);
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, device_id: &str)
{
	user.delete_device("password", device_id, Some("auth_token_if_any".to_string()), None).await.unwrap();

    //with recovery key
	user.delete_device("password", device_id, Some("recovery_key".to_string()), Some(true)).await.unwrap();
}
````

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

@tab Rust
````rust
use sentc::keys::StdUser;

fn example(user: &StdUser)
{
	let device_id = user.get_device_id();
}
````

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

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.delete("password", None, None).await.unwrap();
}
````

::: warning
This function will also throw an error if **the password was not correct**
:::

::::

If the user enabled mfa then you also need to enter the token or a recovery key.

:::: tabs#p

@tab Javascript

```ts
//with totp
await user.deleteUser("password", "<totp>", false);
```

```ts
//with recovery key
await user.deleteUser("password", "<recovery_key>", true);
```

@tab Flutter

```dart
//with totp
await user.deleteUser("password", "<totp>", false);
```

```dart
//with recovery key
await user.deleteUser("password", "<recovery_key>", true);
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.delete("password", Some("auth_token_if_any".to_string()), None).await.unwrap();

    //with recovery key
	user.delete("password", Some("recovery_key".to_string()), Some(true)).await.unwrap();
}
````

::::

## Public user information

Only the newest public key is used. You can just fetch the newest public key or a verify key by id.

Public key:

:::: tabs#p

@tab Javascript

```ts
import Sentc from "@sentclose/sentc";

const key = await Sentc.getUserPublicKey("<user_id>");
```

This returns the public key data.

```ts
interface UserPublicKeyData {
	public_key: string,
	public_key_id: string,
	public_key_sig_key_id?: string,
	verified: boolean
}
```

@tab Flutter
```dart
PublicKeyData key = await Sentc.getUserPublicKey("<user_id>");
```

This returns the public key data.

```dart
class PublicKeyData {
  final String publicKeyId;
  final String publicKey;
  final String? publicKeySigKeyId;
  bool verified;
}
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, user_id: &str)
{
	let public_key = user.get_user_public_key_data(user_id).await.unwrap();
}
````

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

@tab Flutter
```dart
String key = await Sentc.getUserVerifyKey("<user_id>", "<verify_key_id>");
```

@tab Rust
````rust
use sentc::keys::StdUser;
use sentc::crypto_common::user::UserVerifyKeyData;

async fn example(user: &StdUser, user_id: &str, verify_key_id: &str)
{
	let verify_key: UserVerifyKeyData = user.get_user_verify_key_data(user_id, verify_key_id).await.unwrap();
}
````

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
```

The other side:

```ts
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
```

The other side:

```dart
final number2 = await await user.createSafetyNumber(
  UserVerifyKeyCompareInfo(
    "<user_to_compare_id>", 
    "<the_verify_key_id_to_compare>",
  ),
);
```

@tab Rust
````rust
use sentc::keys::StdUser;
use sentc::crypto_common::user::UserVerifyKeyData;

fn example(user: &StdUser, other_user_id: &str, other_user_key: &UserVerifyKeyData)
{
	let number = user.create_safety_number_sync(Some(other_user_id), Some(other_user_key)).unwrap();
}
````

The other side:

````rust
use sentc::keys::StdUser;
use sentc::crypto_common::user::UserVerifyKeyData;

fn example(user: &StdUser, first_user_id: &str, first_user_key: &UserVerifyKeyData)
{
	let number2 = user.create_safety_number_sync(Some(first_user_id), Some(first_user_key)).unwrap();
}
````

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

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, user_id: &str)
{
	//fetch a public key of a user
	let public_key = user.get_user_public_key_data(user_id).await.unwrap();

	let verify = StdUser::verify_user_public_key("base_url".to_string(), "app_token", user_id, &public_key).await.unwrap();
}
````

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

@tab Rust
````rust
use sentc::keys::StdUser;
use sentc::crypto_common::user::{UserVerifyKeyData, UserPublicKeyData};

async fn example(user: &StdUser, user_id: &str)
{
	//fetch a public key of a user
	let public_key: UserPublicKeyData = user.get_user_public_key_data(user_id).await.unwrap();

	//is an Option
	let verify_key_id = public_key.public_key_sig_key_id.unwrap();

	let verify_key: UserVerifyKeyData = user.get_user_verify_key_data(user_id, verify_key_id).await.unwrap();

	//create a safety number with this key
	let number = user.create_safety_number_sync(Some(user_id), Some(&verify_key)).unwrap();

	let verify = StdUser::verify_user_public_key("base_url".to_string(), "app_token", user_id, &public_key).await.unwrap();
}
````

::::
