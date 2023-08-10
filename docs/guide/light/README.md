# Introduction

This is a separate sdk package containing only the user and group management but without the encryption and key management.

## Quick start

To use the light sdk you also need a public and secret app token. 
The same token and app can be used for both, end-to-end encryption sdk and light sdk.

1. Got to [https://api.sentc.com/dashboard/register](https://api.sentc.com/dashboard/register) and create an account. You will be redirected to the account dashboard.
2. Verify the email. We email you to make sure that your email address belongs to you.
3. In your dashboard click on the blue button: New App. You will get the app tokens and the first jwt keys.

Now you are ready to use the sdk.

See [this guide](/guide/create-app/) for more information.

### Install the sdk.

:::: tabs#p

@tab Javascript

It is also available directly in the browser via CDN.

<code-group>
<code-group-item title="NPM" active>

```bash:no-line-numbers
npm install @sentclose/sentc-light
```
</code-group-item>

<code-group-item title="YARN">

```bash:no-line-numbers
yarn add @sentclose/sentc
```
</code-group-item>

<code-group-item title="Browser">

```html:no-line-numbers
<script src="https://cdn.jsdelivr.net/npm/@sentclose/sentc-light/dist/sentc.min.js"></script>
```
</code-group-item>
</code-group>

<br>

::: warning

#### Module bundler

The core SDK uses WebAssembly (WASM) in the browser.

If you are using a module bundler like Webpack and you are not using the browser import,
please refer to the module bundler WASM configuration in our documentation.
[see Module bundler](/guide/advanced/module-bundler/)

:::

@tab Flutter

```bash:no-line-numbers
flutter pub add sentc
```

::::

### Initialize the SDK.
This function checks if the user is logged in and verifies the JSON Web Token (JWT).

:::: tabs#p

@tab Javascript
For javascript it is also necessary to load the wasm file.

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

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

::::

::: tip Ready
You are now ready to register, log in, delete a user, or a group.
:::

:::: tabs#p

@tab Javascript

::: warning
Every function that makes a request (in JavaScript with a Promise) will throw an error if the request or server output is not correct.

We have noted when the function will also throw an error.

The Error is a json string which can be decoded into the Error type:

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

The Error is a string which can be transpiled into the `SentcError` class:

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

@tab Flutter

```dart
await Sentc.register("username", "password");
```

::::

### Login a user

Log in a user with their username and password. The user can also enable Multi-factor auth. [learn more here](/guide/light/user)
After login, the user receives a JSON Web Token (JWT).

After logging in, you will receive a user object.

:::: tabs#p

@tab Javascript

<code-group>
<code-group-item title="Installed" active>

```ts
import Sentc from "@sentclose/sentc-light";

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

		//login a user, ignoring possible Multi-factor auth
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

::::

### Create a group

You can create a group using the user object. The group keys are automatically encrypted by the user keys.

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

::::
