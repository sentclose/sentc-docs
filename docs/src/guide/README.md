# Getting started

## What is sentc

Sentc is an end-to-end encryption sdk with user and group management.

End-to-end encryption can be hard to develop and hard to maintain. 
Lucky there is sentc which gives you full control of your application and provides easy to use encryption in group or from user to user.
We are also provide multi device support, were a user can have multiple devices in one account, but with different login identifier and password for each device.

Sentc can also be used with another backend like firebase or your own. 
You can configure your app to call some functions just from the backend with your secret token.
For backend only function call the equivalent of the function with a `prepare` or `done` prefix like: `prepareRegister()` instead of `register` and call your backend with the data of `prepareRegister`. 
`doneRegister()` after registration.

Sentc is available for javascript in the browser at the moment, but we are working on a flutter sdk and many more.

## Quick start

Create an account and an app. Use the public ap token in your sdk options.

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

#### Module bundler

The core sdk uses wasm in the browser.

When you are using a module bundler like webpack and you are not using the browser import then [see here](/guide/module-bundler/) for the module bundler wasm configuration.

:::

::::

### Initialize the sdk. 
This checks if the user is logged in and checks the jwt

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

Now you are ready to register, login, delete a user or a group.

## Examples

The following examples are just minimal code blocks. To see more incl. their configuration, please see the documentation for each part.

### Register and login user

Register a user from the client. It is also possible to register a user from your own backend, see User documentation for more.

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

Login a user with the used username and password. After login the user gets a JWT. A login for your own backend is also possible.

After login you get a user object back.

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

A group can be created with the user object. The group keys are encrypted by the user keys automatically.

With the group obj you can encrypt/decrypt content, invite or delete member and do key rotation. For more see Groups.

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

There are encryption and decryption of raw data or of strings.

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