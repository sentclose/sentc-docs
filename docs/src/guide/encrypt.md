# Encryption and decryption

Encryption can be done by the user or the group object. 
A new symmetric key for encryption can be created for a user or a group too.

## Encrypt for a group

The group will encrypt everything with the actual used group key. 
After a [key rotation](/guide/group/#key-rotation) the new group key is used to encrypt new content, 
but the old one can still be used to decrypt the content. 

::: tip
Sentc will handle the key management for you: when which key should be used to encrypt and which key must be used to decrypt.
:::

## Encrypt for a user

When encrypting for a user, the content is encrypted with the users public key. Please keep in mind, that public / private key encryption can't handle large amount of data.
The best practices is to use a symmetric key to encrypt the content and then encrypt the symmetric key with the user public key (like in groups).

For user encrypt, the **reply user id is needed** to encrypt the content for the user

::: tip
We highly recommend creating a group even for user to user communication (1:1). 
Then the user who encrypt the data is also able to decrypt the data later without any configuration.

Just auto invite the other user and use stop invite for this group. [See more at group - Auto invite](/guide/group/#invite-more-user).
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

This is a special case because otherwise you must use an utf-8 reader to read the text as bytes and then encrypt these bytes.

Sentc will handle this for you with the string encrypt functions.

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

## Create a new symmetric key

You can also create a new key to encrypt the content. This can helpful for asymmetric encryption, where the data length is very limited.

When creating a new key for a group then this key will be encrypted by the actual group key. 
For another user, the key will be encrypted be the users public key.

You don't need to store this key, because sentc will handle this for you. You can just fetch the key. 
Just make sure to store the used key id and the master key id which was used to encrypt the key for the encrypted content to fetch it later to decrypt it.

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

## Encrypt and decrypt with a registered key

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

## Fetch a key

When you saved the master key id (the key is which was used to encrypt the key) and the key id then you can fetch the key.

Make sure that the user got access to the master key (like group member, or it was his/her public key used to encrypt).

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