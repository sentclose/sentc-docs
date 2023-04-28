# Encryption and decryption

Encryption can be performed by either the user or the group object. 
Additionally, a new symmetric key can be generated for encryption purposes for either a user or a group.

## Encrypt for a group

When encrypting content for a group, the content will be encrypted using the group's current key. 
In the event of a [key rotation](/guide/group/#key-rotation), the new group key will be used to encrypt new content, 
while the previous key can still be used to decrypt previously encrypted content.

::: tip
Sentc will handle key management for you, determining which key should be used for encryption and which key should be used for decryption.
:::

## Encrypt for a user

When encrypting content for a user, the content is encrypted using the user's public key. 
However, it is important to note that public/private key encryption may not be suitable for handling large amounts of data. 
To address this, best practice is to use a symmetric key to encrypt the content, 
and then encrypt the symmetric key with the user's public key (as with groups).

When encrypting content for a user, the reply user ID is required.

::: tip
We highly recommend creating a group even for one-on-one user communication. 
This allows the user who encrypts the data to also decrypt it later without any additional configuration. 
To achieve this, simply auto-invite the other user and use the "stop invite" feature for this group. 

For more information on auto-invite functionality, please see the [auto invite](/guide/group/#invite-more-user). section.
:::

## Encrypt raw data

Raw data are bytes.

:::: tabs type:card

::: tab Javascript
For javascript, Uint8Arrays are used for raw data.

For a group:
```ts
const encrypted = await group.encrypt(new Uint8Array([1,1,1,1]));
```

For a user:

```ts
const encrypted = await user.encrypt(new Uint8Array([1,1,1,1]), "<reply_id>");
```

Example to load a file as Uint8Array with the file reader:

```typescript
function fileParse(file: Blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = (e) => {
			//@ts-ignore -> is read as array buffer
            resolve(e.target.result);
		};

		reader.onerror = (e) => {
			reject(e);
		};

		reader.readAsArrayBuffer(file);
	});
}

//Blob can be a javascript file element too
async function fileLoadingAndEncryption(file: Blob) {
	const uint8arrayFile = await fileParse(file);

	//get the group obj from outside of the function
	const encryptedFile = await group.encrypt(uint8arrayFile);
	
	//do domething with the encrypted file
}
```

::: tip
For file upload you can also use the sentc [file handling](/guide/file/)
:::

::::

## Decrypt raw data

For groups this is the same way around like encrypting data. Every group member can encrypt the data.

:::: tabs type:card

::: tab Javascript
For javascript, Uint8Arrays are used for raw data. The encrypted data should be a Uint8Array too.

```ts
const decrypted = await group.decrypt(encrypted);
```
:::

::::

For user this is a little more complicated. Only the user which user id was used in encrypt can decrypt the content.

But the right key is automatically fetched by sentc.

:::: tabs type:card

::: tab Javascript
For javascript, Uint8Arrays are used for raw data. The encrypted data should be a Uint8Array too.

```ts
const decrypted = await user.decrypt(encrypted);
```
:::

::::

## Encrypt strings

Encrypting strings is a special case, as it requires converting the text to bytes using an UTF-8 reader before encryption.

To simplify this process, Sentc offers string encryption functions that handle this conversion for you.

:::: tabs type:card

::: tab Javascript

For a group:
```ts
const encrypted = await group.encryptString("hello there!");
```

For a user:

```ts
const encrypted = await user.encryptString("hello there!", "<reply_id>");
```

:::

::::

## Decrypt strings

The same as decrypt raw data but this time with a string as encrypted data.

:::: tabs type:card

::: tab Javascript

The encrypted strings are strings too.

For a group:
```ts
const decrypted = await group.decryptString(encrypted);
```

For a user:

```ts
const decrypted = await user.decryptString(encrypted);
```

:::

::::

## Register a key

In addition to using existing keys, you can also create a new key specifically for encrypting content. 
This can be particularly useful for asymmetric encryption, where data length is limited.

### Create a new symmetric key

When creating a new key for a group, the key will be encrypted using the group's current key. 
For another user, the key will be encrypted using the user's public key.

There is no need to store this key, as Sentc will handle this for you. 
Simply fetch the key and store the used key ID and the master key ID that was used to encrypt the key for the encrypted content, 
in order to fetch it later for decryption.

::: tip
For sentc file handling, the sdk will create a new key for every file the same way
:::

:::: tabs type:card

::: tab Javascript

The key is from type SymKey and has the `encrypt` and `decrypt` functions too

For a group:
```ts
const key = await group.registerKey();

const key_id = key.key_id;
const master_key_id = key.master_key_id;
```

For a user:

```ts
const key = await user.registerKey();

const key_id = key.key_id;
const master_key_id = key.master_key_id;
```

:::

::::

### Encrypt and decrypt with a registered key

This works the same as group encrypt, decrypt.

:::: tabs type:card

::: tab Javascript

No promise here.

```ts
//encrypt
const encrypted = key.encrypt(data);

//decrypt
const decrypted = key.decrypt(encrypted);
```

:::

::::

### Fetch a key

If you have saved the master key ID (the key that was used to encrypt the key) and the key ID, you can fetch the key.

However, it is important to ensure that the user has access to the master key 
(such as being a group member or having their public key used for encryption).

:::: tabs type:card

::: tab Javascript

For group:

```ts
//encrypt
const key = await group.fetchKey("<key_id>", "<master_key_id>");
```

For user:

```ts
//encrypt
const key = await user.fetchKey("<key_id>", "<master_key_id>");
```
:::

::::

## Sign and verify the encrypted data

Sentc offers the ability to sign data after encryption and verify data before decryption. 
This ensures the authenticity of the encrypted data and protects against potential tampering.

### Sign

For sign, the newest sign key of the user is used.

:::: tabs type:card

::: tab Javascript

For a group:
```ts
//just set sign to true

const encrypted = await group.encryptString("hello there!", true);
```

For a user:

```ts
const encrypted = await user.encryptString("hello there!", "<reply_id>", true);
```

:::

::::

### Verify

For verify, the right verify key is fetched, but you need to save the id of the user who encrypted the content.

:::: tabs type:card

::: tab Javascript

For a group:
```ts
//just set sign to true

const decrypted = await group.decryptString(encrypted, true, "<user_id>");
```

For a user:

```ts
const decrypted = await user.decryptString(encrypted, true, "<user_id>");
```

:::

::::