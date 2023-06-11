# Getting started

## What is sentc

Sentc is an end-to-end encryption SDK with user and group management.

End-to-end encryption can be difficult to develop and maintain. 
Fortunately, Sentc gives you full control of your application and provides easy-to-use encryption for groups or between users. 
We also provide multi-device support, where a user can have multiple devices under one account but with different login identifiers and passwords for each device.

::: tip
Sentc can also be used with another backend, such as Firebase or your own.

You can configure your app to call some functions only from the backend using your secret token.
For backend-only function calls, use the equivalent of the function with a 
`prepare` or `done` prefix, such as `prepareRegister()` instead of `register` 
and call your backend with the data from `prepareRegister` or `doneRegister()` after registration.

See more at [own backend](/guide/backend-only/)
:::

Sentc is currently available for JavaScript in the browser, but we are also working on a Flutter SDK and more.

## Quick start

Create an account and an app. Use the public API token in your SDK options.

### Install the sdk.

:::: tabs type:card

::: tab Javascript

It is also available directly in the browser via CDN.

<code-group>
<code-block title="NPM" active>

```bash
npm install @sentclose/sentc
```
</code-block>

<code-block title="YARN">

```bash
yarn add @sentclose/sentc
```
</code-block>

<code-block title="Browser">

```html
<script src="https://cdn.jsdelivr.net/npm/@sentclose/sentc/dist/sentc.min.js"></script>
```
</code-block>
</code-group>

::: warning

#### Module bundler

The core SDK uses WebAssembly (WASM) in the browser.

If you are using a module bundler like Webpack and you are not using the browser import,
please refer to the module bundler WASM configuration in our documentation.
[see Module bundler](/guide/module-bundler/)

:::

::::

### Initialize the SDK. 
This function checks if the user is logged in and verifies the JSON Web Token (JWT).

:::: tabs type:card

::: tab Javascript
For javascript it is also necessary to load the wasm file.

<code-group>
<code-block title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

//init the javascript client
await Sentc.init({
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
        await sentc.init({
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

::: tip Ready
You are now ready to register, log in, delete a user, or a group.
:::

:::: tabs type:card

::: tab Javascript

::: warning
Every function that makes a request (in JavaScript with a Promise) will throw an error if the request or server output is not correct.

We have noted when the function will also throw an error.
:::

::::

## Examples

The following examples are minimal code blocks. To see more, including their configurations, please refer to the documentation for each part.

### Register and login user

You can register a user from the client. 
It is also possible to register a user from your own backend. 
Please refer to the User documentation for more information.

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

### Login a user

Log in a user with their username and password. 
After login, the user receives a JSON Web Token (JWT). It is also possible to implement login functionality for your own backend.

After logging in, you will receive a user object.

:::: tabs type:card

::: tab Javascript

<code-group>
<code-block title="Installed" active>

```ts
import Sentc from "@sentclose/sentc";

const user = await Sentc.login("username", "password");
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
        
        const user = await sentc.login("username", "password");
    }

    run();
</script>
```
</code-block>
</code-group>

:::

::::

### Create a group

You can create a group using the user object. The group keys are automatically encrypted by the user keys.

With the group object, you can encrypt/decrypt content, invite or delete members, and perform key rotation. 
For more information, please refer to the Groups documentation.

:::: tabs type:card

::: tab Javascript

This is the same for installed and browser.

```ts
//the user obj from login
const group_id = await user.createGroup();

//now fetch the group
const group = await user.getGroup(group_id);
```

:::

::::

### Encrypt in a group

You can perform encryption and decryption of raw data or strings in a group.

:::: tabs type:card

::: tab Javascript

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

:::

::::