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

## Authentification and JWT

After login the user received a json web token (jwt) to authenticate at the sentc api. This jwt is only valid for 5 min.
But don't worry the sdk will refresh the jwt automatically when the users try to do a request with an invalid jwt.

For refreshing the jwt a refresh token is needed. This token is obtained by the login too.

There are 3 strategies to refresh a jwt. 
However, this is only necessary if you must use http-only cookies for the browser.
If you are using other implementations, go with the default.

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

See more at [own backend](/guide/backend-only/)

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
