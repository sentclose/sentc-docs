---
home: true
heroImage: /Sentc.png
tagline: Encryption as a service
actionText: Quick Start →
actionLink: /guide/
features:
- title: Easy to use encryption
  details: Create highly secure applications with a few lines of code
- title: Group management
  details: Create groups where every member can encrypt content for all other member, incl. key rotation to renew the keys but still using the old ones.
- title: User management
  details: Register and login users securely and easy.
footer: Made by  with ❤️
---

:::: tabs type:card

::: tab Javascript

Easy to install:

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

</code-group>

:::
Easy to use, installed or in the browser:

<code-group>
<code-block title="JS" active>
```js
import Sentc from "@sentclose/sentc";

//init the javascript client
await Sentc.init({
app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"  // <-- your app token
});

//register a user
await Sentc.register("username", "password");

//login a user
const user = await Sentc.login("username", "password");

//create a group
const group_id = await user.createGroup();

//load a group. returned a group obj for every user.
const group = await user.getGroup(group_id);

//encrypt a string for the group
const encrypted_string = await group.encryptString("hello there!");

//now every user in the group can decrypt the string
const decrypted_string = await group.decryptString(encrypted_string);
			
console.log(decrypted_string);  //hello there!
```
</code-block>

<code-block title="Browser">
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sentc example</title>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/@sentclose/sentc/dist/sentc.min.js"></script>

    <script>
        //init the wasm
        const sentc = window.Sentc.default;

        async function run() {
            //use your public token as the app token.
            // if a user is already logged in, this function will return the logged-in user
            await sentc.init({
                app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"
            });
			
            //now you are ready to go
            //register a user:
            await sentc.register("username", "password");
			
            //log in a user
            const user = await sentc.login("username", "password");
			
            //create a group
            const group_id = await user.createGroup();
			
            //load a group. returned a group obj for every user.
            const group = await user.getGroup(group_id);
			
            //encrypt a string for the group
            const encrypted_string = await group.encryptString("hello there!");
			
            //now every user in the group can decrypt the string
            const decrypted_string = await group.decryptString(encrypted_string);
			
            console.log(decrypted_string);  //hello there!
        }
		
        run();
    </script>
</body>
</html>
```
</code-block>

</code-group>
::::