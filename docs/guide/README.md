# What is sentc

Sentc is an end-to-end encryption SDK with user and group management.

::: tip
Sentc now supports post-quantum cryptography with CRYSTALS Kyber and CRYSTALS Dilithium. [See more here](/protocol/).

CRYSTALS Kyber is used in hybrid with x25519

CRYSTALS Dilithium is used in hybrid with ed25519
:::

End-to-end encryption can be challenging to develop and maintain. 
Fortunately, Sentc gives you full control of your application and provides easy-to-use encryption for groups or between users. 

Sentc uses a flexible protocol to be able to change the underlying encryption algorithm in the feature. 
To ensure backward compatibility, data encrypted with the older algorithm can still be decrypted, but new data will be encrypted by the newest.

::: tip
There is also a sdk version without the encryption but with the user and group management. 
This is very helpful to create secure login systems and to group users to manage their access to resources. 

See more at [sdk-light](/guide/light/)
:::

::: tip
Sentc can also be used with another backend, such as Firebase or your own.

You can configure your app to call some functions only from the backend using your secret token.
For backend-only function calls, use the equivalent of the function with a 
`prepare` or `done` prefix, such as `prepareRegister()` instead of `register` 
and call your backend with the data from `prepareRegister` or `doneRegister()` after registration.

See more at [own backend](/guide/advanced/backend-only/)
:::

Sentc is currently available for JavaScript in the browser and flutter on android and windows (linux will follow), but we are also working on more.

## Contact

If you want to learn more, just contact me [contact@sentclose.com](mailto:contact@sentclose.com).


## Quick start

### Playground

User and group functionalities can be tested in our [playground](/playground/) without creating an account.

### Create an account and an app

To use the sdk, you need a public and secret token.

The public token will be used in your sdk at the frontend, and the secret token should only be used at your backend. 
You can set what function should be called with which token.

1. Got to [https://api.sentc.com/dashboard/register](https://api.sentc.com/dashboard/register) and create an account. You will be redirected to the account dashboard.
2. Verify the email. We email you to make sure that your email address belongs to you.
3. In your dashboard click on the blue button: New App. You will get the app tokens and the first jwt keys.

Now you are ready to use the sdk.

See [this guide](/guide/create-app/) for more information.

### Install the sdk.

:::: tabs#p

@tab Javascript

It is also available directly in the browser via CDN. 

::: tip
The Node.js client sdk is almost as the same as the browser sdk, but instead of using Uint8Array for binary, it uses Node's Buffer.

:::

<code-group>
<code-group-item title="NPM" active>

```bash:no-line-numbers
npm install @sentclose/sentc
```
</code-group-item>

<code-group-item title="YARN">

```bash:no-line-numbers
yarn add @sentclose/sentc
```
</code-group-item>

<code-group-item title="Browser">

```html:no-line-numbers
<script src="https://cdn.jsdelivr.net/npm/@sentclose/sentc/dist/sentc.min.js"></script>
```
</code-group-item>
<code-group-item title="Node js">

```bash:no-line-numbers
npm install @sentclose/sentc-nodejs
```
</code-group-item>
</code-group>

<br>

::: warning

#### Module bundler

The core SDK uses WebAssembly (WASM) in the browser.

If you are using a module bundler like Webpack and you are not using the browser import,
please refer to the module bundler WASM configuration in our documentation.
[See Module bundler](/guide/advanced/module-bundler/)

:::

@tab Flutter

```bash:no-line-numbers
flutter pub add sentc
```

@tab Rust


```bash:no-line-numbers
cargo add sentc
```

Please choose an implementation of the algorithms. There are StdKeys, FIPS, or Rec keys. The impl cannot work together.

- StdKeys (feature = std_keys) are a pure rust implementation of the algorithms. They can be used on the web with wasm
  and on mobile.
- FIPS keys (feature = fips_keys) are FIPS approved algorithms used from Openssl Fips. This impl does not support post-quantum.
- Rec keys (feature = rec_keys) or recommended keys are a mix of FIPS keys for the classic algorithms and oqs (for post-quantum).

The net feature is necessary for the requests to the backend. The library reqwest is used to do it.

::::

### Initialize the SDK. 
This function checks if the user is logged in and verifies the JSON Web Token (JWT).

:::: tabs#p

@tab Javascript
For javascript it is also necessary to load the wasm file.

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

//init the javascript client
await Sentc.init({
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
        await sentc.init({
           app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi" // <-- your app token
        });
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter

For flutter, it will load the dynamic libraries for each platform.

```dart
await Sentc.init(appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi");
```

#### Secure storage

The standard storage for keys is shared preferences. This is, however, not secure and will leave the keys unencrypted on your device.

We also provide another storage solution with [flutter_secure_storage](https://github.com/mogol/flutter_secure_storage). 
This will encrypt the keys and store them into a keychain.

Install the storage:

```bash:no-line-numbers
flutter pub add sentc_flutter_secure_storage
```

and then replace the storage in the option.

```dart
import 'package:sentc/sentc.dart';
import 'package:sentc_flutter_secure_storage/sentc_flutter_secure_storage.dart';

void main() async {
  
  await Sentc.init(
    appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi",   // <-- your app token
    storage: SecureStorage(), //init with the other storage
  );
}
```

Please follow the instruction of [flutter_secure_storage](https://github.com/mogol/flutter_secure_storage). 

You can also create a FlutterSecureStorage object and pass it in `SecureStorage()`. This can be useful if you must set options to your storage.

```dart
import 'package:sentc/sentc.dart';
import 'package:sentc_flutter_secure_storage/sentc_flutter_secure_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() async {
  //set other android option to use android encryptedSharedPreferences (only for Android >= V5)
  AndroidOptions getAndroidOptions() => const AndroidOptions(
    encryptedSharedPreferences: true,
  );

  final storage = FlutterSecureStorage(aOptions: getAndroidOptions());
  
  await Sentc.init(
    appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi",
    storage: SecureStorage(storage), //set the storage with options
  );
}
```

@tab Rust

No init needed for the rust sdk

::::

::: tip Ready
You are now ready to register, log in, delete a user, or a group.
:::

:::: tabs#p

@tab Javascript

::: warning
Every function that makes a request (in JavaScript with a Promise) will throw an error if the request or server output is not correct.

We have noted when the function will also throw an error.

The Error is a JSON string that can be decoded into the Error type:

```ts
interface SentcError
{
	status: string,
	error_message: string
}
```
:::

@tab Flutter

::: warning
Every function that makes a request will throw an error if the request or server output is not correct.

The Error is a string that can be transpiled into the `SentcError` class:

```dart
try {
  //some function that returns the Sentc error
} catch (e) {
  final err = SentcError.fromError(e);

  //do something with the error
}
```
:::

::::

## Examples

The following examples are minimal code blocks. To see more, including their configurations, please refer to the documentation for each part.

### Register and login user

You can register a user from the client. 
It is also possible to register a user from your own backend. 
Please refer to the User documentation for more information.

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

@tab Flutter

```dart
await Sentc.register("username", "password");
```

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example()
{
	let user_id = StdUser::register("base_url".to_string(), "app_token".to_string(), "the-username", "the-password").await.unwrap();
}
````

::::

### Log in a user

Log in a user with their username and password. The user can also enable Multi-factor auth. [Learn more here](/guide/e2ee/user)
After login, the user receives a JSON Web Token (JWT).

After logging in, you will receive a user object.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

//login a user, ignoring possible Multi-factor auth
const user = await Sentc.login("username", "password", true);
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

		//log in a user, ignoring possible Multi-factor auth
        const user = await sentc.login("username", "password", true);
    }

    run();
</script>
```
</code-group-item>
</code-group>

@tab Flutter

```dart
//login a user, ignoring possible Multi-factor auth
final user = await Sentc.loginForced("username", "password");
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

### Create a group

You can create a group using the user object. The user keys automatically encrypt the group keys.

With the group object, you can encrypt/decrypt content, invite or delete members, and perform key rotation. 
For more information, please refer to the Groups documentation.

:::: tabs#p

@tab Javascript

This is the same for installed and browser.

```ts
//the user obj from login
const group_id = await user.createGroup();

//now fetch the group
const group = await user.getGroup(group_id);
```

@tab Flutter

```dart
//the user obj from login
final groupId = await user.createGroup();

//now fetch the group
final group = await user.getGroup(groupId);
```

@tab Rust

````rust
use sentc::keys::{StdUser, StdGroup};

async fn example()
{
	//create a group
	let group_id = user.create_group(false).await.unwrap();

	//get a group. first check if there is any data that the user needs before decrypting the group keys.
	let (data, res) = user.prepare_get_group("group_id", None).await.unwrap();

	//if no data, then just decrypt the group keys
	assert!(matches!(res, GroupFetchResult::Ok));

	let group = user.done_get_group(data, None, None).unwrap();
}
````

::::

### Encrypt in a group

You can perform encryption and decryption of raw data or strings in a group.

:::: tabs#p

@tab Javascript

For javascript the format for raw data is Uint8Array.

```ts
//the group obj from getGroup
const encrypted_string = await group.encryptString("hello there!");

//now every user in the group can decrypt the string
const decrypted_string = await group.decryptString(encrypted_string);

console.log(decrypted_string);  //hello there!

//or raw data

const encrypted = await group.encrypt(new Uint8Array([1,1,1,1]));

const decrypted = await group.decrypt(encrypted);
```

@tab Flutter

```dart
//encrypt a string for the group
final encryptedString = await group.encryptString("hello there!");
  
//now every user in the group can decrypt the string
final decryptedString = await group.decryptString(encryptedString);

//or raw data

final encrypted = await group.encrypt(Uint8List.fromList(elements));

final decrypted = await group.decrypt(encrypted);
```

@tab Rust

````rust
use sentc::keys::StdGroup;

fn example()
{
	//encrypt a string for the group
	let encrypted = group.encrypt_string_sync("hello there!").unwrap();

	//now every user in the group can decrypt the string
	let decrypted = group.decrypt_string_sync(encrypted, None).unwrap();

	//or raw data
	let encrypted = group.encrypt_sync([0u8;4]).unwrap();

    let decrypted = group.decrypt_sync(encrypted, None).unwrap();
}
````

::::