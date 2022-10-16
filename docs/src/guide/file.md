# File handling

::: danger
File handling will be available after the beta.
:::

Handling large encrypted files can be hard and not trivial as specially in the browser.

Large files are generally too big to encrypt them as once. The file might be load completely into the memory.

One solution is to use a stream. Only one piece of a file will be read and encrypt at a time. 
This will solve the memory problem, but browsers can't send file streams through requests.

Another solution is to just chunk a file and encrypt each piece and then sending this piece as one file to the storage. 
We can send now encrypted files from the browser too, but now we need to deal with multiple files not just one. 
We need to handle the upload but also handle the deletion of a file. THe pieces must be deleted as well.

::: tip Sentc solution
Sentc chunks the files in the client and will encrypt them. Then these parts are sent to our api storage **or to your storage**. 

We will save all part ids to your file and if you need the file you can just fetch it from our backend as if it is one file. 
You can also delete the file as if it is one file and not a pile of pieces.
:::

## Encrypt and upload a file

Files can be encrypted for a group (which is recommended) 
or from one user to another (but here the sender can't decrypt the file **only the receiver**).

A new key will be created for each file which will encrypt the file.

In the following a file will be created, encrypted and uploaded for a group, so every group member can download and decrypt it.

::: warning
It is important to store not only the `file id` but the `master key id` which was used to encrypt the file.
This can be the group key id or a user key.
:::

:::: tabs type:card

::: tab Javascript
```typescript
// file must be the javascript File which extend from Blob
const output = await group.createFile(file);
```

The output is from type FileCreateOutput.

````typescript
interface FileCreateOutput
{
	file_id: string,
	master_key_id: string,
	encrypted_file_name: string
}
````
:::

::::

To also sign a file set sign to true in the function parameter. This will use the users sign key. 
This is normally not necessary when handling the files only from your applications and not from any other apps.

You need to store the user id too to fetch the right verify key when downloading and verify the file.

:::: tabs type:card

::: tab Javascript
```typescript
// file must be the javascript File which extend from Blob
const output = await group.createFile(file, true);
```
:::

::::

:::: tabs type:card

::: tab Javascript

::: tip Upload progress
To see the actual upload progress pass in the create file function a closure:

````typescript
(progress: number) => void
````

````typescript
const output = await group.createFile(file, false, (progress: number) => {
	console.log("Upload: " + progress);
});
````

This will print the progress to the console. But you can use any other js element.
:::

::::

:::: tabs type:card

::: tab Javascript

::: tip Cancel upload
To cancel the upload just set this static variable to true:

````typescript
import {Uploader} from "@sentclose/sentc";

Uploader.cancel_upload = true;
````

This will cancel the actual upload of a file. But this won't delete the file.
:::

::::


## Download and decrypt a file

To download a file, not only the file id is needed but the master key id too, which was needed to encrypt the file key.
A file key could be encrypted by another created key or a group key. The file create will always give you the master key id back.

:::: tabs type:card

::: tab Javascript

```typescript
const [url, meta_info, file_key] = await group.downloadFile(file_id, master_key_id);
```

- This fill return the file blob url, so you can use it in the browser, like set the url as an image src or download the file.
- meta info are from type FileMetaInformation. Most of the info is not really relevant for your application, just for sentc. 

````typescript
interface FileMetaInformation {
	file_id: string,
	belongs_to?: string,
	belongs_to_type: any,
	key_id: string,
	part_list: {
		part_id: string,
		sequence: number,
		extern_storage: boolean
	}[],
	file_name?: string,
	encrypted_file_name?: string
}
````

- the file key is the key which was used to encrypt the file. 

::: warning
sentc is using the indexeddb to save each file part in the browser.

There is a limit to store just up to 2 gb into the indexeddb in many browser.
:::

::: tip Download a file in a browser
To download a file just make a 'fake' a-tag and click it. Just get the file name from the meta info to show it in the borwser for download.

````typescript
const [url, meta_info, file_key] = await group.downloadFile(file_id, master_key_id);

const a = document.createElement("a");
a.download = meta_info.file_name;
a.href = url;
a.click();
````
:::

::::

To also verify the file by put in the right verify key. Make sure you save the user id from the creator of the file when uploading a file.

To get the user verify key just fetch it see [user - Public user information](/guide/user/#public-user-information)

:::: tabs type:card

::: tab Javascript

```typescript
const [url, meta_info, file_key] = await group.downloadFile(file_id, master_key_id, verify_key);
```

:::

::::

:::: tabs type:card

::: tab Javascript

::: tip Download progress
To see the actual download progress pass in the download file function a closure:

````typescript
(progress: number) => void
````

````typescript
//no verify key in this case, just pass in an empty string
const output = await group.downloadFile(file, master_key_id, '', (progress: number) => {
	console.log("Download: " + progress);
});
````

This will print the progress to the console. But you can use any other js element.
:::

::::

:::: tabs type:card

::: tab Javascript

::: tip Cancel download
To cancel the download just set this static variable to true:

````typescript
import {Downloader} from "@sentclose/sentc";

Downloader.cancel_download = true;
````

This will cancel the actual download of a file.
:::

::::

## Delete a file

Just pass in the file id of the file to delete.

:::: tabs type:card

::: tab Javascript

````typescript
await group.deleteFile(file_id);
````
:::

::::

## Setting up your storage

In the [app options](/guide/create-app/) it is possible to use an own storage for file upload and download.
For default, you are using the sentc storage, and you get paid for every gb per month.

If you have your own storage (like aws s3, etc.) you can simply the `delete`, `download` and `upload` urls to this storage.

Every part will now uploaded and download from your storage.

If a file gets deleted we will call your backend storage to delete this file. 
We are stacking the delete process to delete a bunch of files at once.

In summery:

1. Set your own upload and download endpoint in the app option in the sdk
2. Prepare your upload endpoint to get multiple parameters through the url
3. Call the sentc api to register the file part. You will get an id back, this id will be used to delete the file part.
4. Set the delete endpoint and an optional token in your app file options in the dashboard

See an example for using your own storage: [here](https://gitlab.com/sentclose/sentc/sdk-examples)

### Set your upload and download url in the sentc init options

:::: tabs type:card

::: tab Javascript

````typescript
await Sentc.init({
	app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
	file_part_url: "<your_url_to_your_storage>"
});
````
:::

::::

We are using the same url for upload and download but with different Http methods:

- upload: Method post
- download: Method get

To update your url just set the file part url in the options. The uploader will upload the parts to the new url. 
The downloader will then try to download the part from the new url. 

Make sure to transfer your data to the new url.

### When uploading file parts to your url, register the file part at sentc api 

Call this endpoint when the upload is done: `https://api.sentc.com/api/v1/file/part/<session_id>/<file_part_sequence>/<end>`
This endpoint needs your secret token and should only be called from your backend.

- session_id is the id of the file upload session, this is a string.
- file_part_sequence is the sequence of the file part when downloading and decrypting the file. if this is wrong then the file can't be decrypted anymore.
- end is a boolean. Pass in false if the file upload has not finished yet or true if it is.

The sdk will call your endpoint with these values in the url as parameter. 
A request might look like: `https://your_url.com/<session_id>/<file_part_sequence>/<end>` 
or `https://your_url.com/abc_123/0/false` or `https://your_url.com/abc_123/1/true`

Just extract the values and call the sentc api to register the file part, so sentc can download the file. 
In the example above: `https://api.sentc.com/api/v1/file/part/abc_123/0/false` and `https://api.sentc.com/api/v1/file/part/abc_123/1/true`

### After calling the sentc api you will get back the file part id

This id is used to fetch and delete a part. 
Please store the id or rename your file part to this id.

### Alternative workflow

You can also call the sentc api first to register a part and then read the request body.
Then you will get the right id, and you can name your file correctly.


### Set the delete endpoint for file parts 

This endpoint will be called with a `delete` request and the deleted file part names in the body as json array:

````json
["name_0", "name_1", "name_2"]
````

See more here [app options](/guide/create-app/).

You can also set a token for us, so you know that the request comes really from our api to delete the files.

### When downloading a part the part id is in the url

The sdk will call your endpoint with a get request and the part id in the url. And except the encrypted file part as bytes.

`https://your_url.com/<part_id>`