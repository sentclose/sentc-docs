# File handling

::: danger
File handling will be available after the beta.
:::

Handling large encrypted files can be difficult, especially in the browser.

Large files are generally too big to encrypt all at once and can potentially overload system memory. 
To solve this issue, one solution is to use a stream to encrypt and decrypt files one piece at a time. 
However, browsers cannot send file streams through requests.

Another solution is to chunk the file into smaller pieces and encrypt each piece before sending it to storage. 
This allows encrypted files to be sent from the browser, but requires managing multiple files instead of just one. 
In addition to handling uploads, file deletion must also be managed, including deleting the individual pieces.

::: tip Sentc solution

Sentc offers a solution for handling large encrypted files. 
In the client, Sentc chunks the file and encrypts each piece. 
These encrypted pieces are then sent to our API storage or your storage.

We save all the part IDs associated with your file, allowing you to fetch the complete file from our backend as if it were a single file. 
Additionally, you can delete the file as if it were a single file, and Sentc will manage the deletion of the individual encrypted pieces.

:::

## Encrypt and upload a file

With Sentc, files can be encrypted for a group or for a single user. 
We recommend encrypting files for a group, as this allows all group members to download and decrypt the file.

For each file, Sentc creates a new key that is used for encryption. To encrypt and upload a file for a group, follow these steps:

::: warning
It is important to store the `file id` to fetch the file later
:::

:::: tabs#p

@tab Javascript
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

For another user:
````ts
const output = await user.createFile(file, false, "<other-user-id>");
````

@tab Flutter

Create a file with the file object:

```dart
FileCreateOutput output = await group.createFile(file: file);
```

Create a file with a path:

```dart
FileCreateOutput output = await group.createFileWithPath(path: "<path-to-your-file>");
```

The output is from type FileCreateOutput.

```dart
class FileCreateOutput {
  final String fileId;
  final String masterKeyId;
  final String? encryptedFileName;

  const FileCreateOutput(this.fileId, this.masterKeyId, this.encryptedFileName);
}
```

For another user:

````dart
FileCreateOutput output = await group.createFileWithPath(path: "<path-to-your-file>", replyId: "<other-user-id>");
````

@tab Rust

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.create_file_with_file(jwt, file, None, None, None).await.unwrap();
}
````

For another user:

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, file: File)
{
	let output = user.create_file_with_file(file, None, None, false).await.unwrap();
}
````

Create a file with a path:

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, path: &str)
{
	let output = group.create_file_with_path(jwt, path, None, None).await.unwrap();
}
````

For another user:

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, path: &str)
{
	let output = user.create_file_with_path(path, None, None).await.unwrap();
}
````

::::

To also sign a file, set the 'sign' parameter to 'true' in the function. This will use the user's sign key. 
Note that this is not necessary when handling files only within your application and not from any other apps. 

When downloading and verifying the file, you will also need to store the user ID to fetch the right verify key

:::: tabs#p

@tab Javascript
```typescript
// file must be the javascript File which extend from Blob
const output = await group.createFile(file, true);
```

For another user:
````ts
const output = await user.createFile(file, true, "<other-user-id>");
````

@tab Flutter

```dart
FileCreateOutput output = await group.createFile(file: file, sign: true);
```

Or with a path:

```dart
FileCreateOutput output = await group.createFileWithPath(path: "<path-to-your-file>", sign: true);
```

For another user:

````dart
FileCreateOutput output = await group.createFileWithPath(path: "<path-to-your-file>", replyId: "<other-user-id>", sign: true);
````

@tab Rust

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.create_file_with_file(jwt, file, None, None, Some(sign_key)).await.unwrap();
}
````

For another user:

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, file: File)
{
	let output = user.create_file_with_file(file, None, None, true).await.unwrap();
}
````

::::

:::: tabs#p

@tab Javascript

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

@tab Flutter

::: tip Upload progress
To see the actual upload progress pass in the create file function a closure:

```dart
void Function(double progress)
```

```dart
FileCreateOutput output = await group.createFile(
  file: file,
  sign: false,
  uploadCallback: (progress) {
    print(progress);
  }
);
```

This will print the progress to the console.
:::

@tab Rust
::: tip Upload progress
To see the actual upload progress pass in the create file function a closure:

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.create_file_with_file_and_upload_progress(jwt, file, None, None, None, |progress| {
		//do something with the progress
	}).await.unwrap();
}
````
:::

::::

:::: tabs#p

@tab Javascript

::: tip Cancel upload
To cancel the upload just set this static variable to true:

````typescript
import {Uploader} from "@sentclose/sentc";

Uploader.cancel_upload = true;
````

This will cancel the actual upload of a file. But this won't delete the file.
:::

@tab Flutter

::: tip Cancel upload
To cancel the upload just set this static variable to true:

```dart
Uploader.cancelUpload = true;
```

This will cancel the actual upload of a file. But this won't delete the file.
:::

::::


## Download and decrypt a file

To download a file, simply use its file ID. 
The file key may be encrypted using either another created key or a group key. 
The file creator will always provide you with the master key ID.

:::: tabs#p

@tab Javascript

```typescript
const [url, meta_info, file_key] = await group.downloadFile(file_id);
```

- This will return the file blob url, so you can use it in the browser, like set the url as an image src or download the file.
- meta info are from type FileMetaInformation. Most of the info is not really relevant for your application, just for sentc. 

````typescript
interface FileMetaInformation {
	file_id: string,
    master_key_id: string,
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
To download a file just make a 'fake' a-tag and click it. Just get the file name from the meta info to show it in the browser for download.

````typescript
const [url, meta_info, file_key] = await group.downloadFile(file_id);

const a = document.createElement("a");
a.download = meta_info.file_name;
a.href = url;
a.click();
````

Download file for another user:

```typescript
const [url, meta_info, file_key] = await user.downloadFile(file_id);
```

:::

@tab Flutter

Download a file with path. If the file exists, a number will be added to the filename: 
- file -> file(1) -> file(2), and so on.

```dart
DownloadResult result = await group.downloadFile(path: "<your-download-path>", fileId: fileId);
```

Download with file object.

```dart
DownloadResult result = await group.downloadFileWithFile(file: file, fileId: fileId);
```

- The file will be stored at your local. The user can then access it. 
- Using download with a file object can be handy if you just want to show an image, so you can store it on the tmp dir on the device.
- meta info are from type FileMetaInformation. Most of the info is not really relevant for your application, just for sentc.

```dart
class DownloadResult {
  final FileMetaInformation meta;
  final SymKey key;

  DownloadResult(this.meta, this.key);
}

class FileMetaInformation {
  final String fileId;
  final String masterKeyId;
  final String? belongsTo;
  final BelongsToType belongsToType;
  final String encryptedKey;
  final String encryptedKeyAlg;
  final List<FilePartListItem> partList;
  String? fileName;
  final String? encryptedFileName;

  FileMetaInformation({
    required this.fileId,
    required this.masterKeyId,
    this.belongsTo,
    required this.belongsToType,
    required this.encryptedKey,
    required this.encryptedKeyAlg,
    required this.partList,
    this.fileName,
    this.encryptedFileName,
  });
}
```

Download file for another user:

```dart
DownloadResult result = await user.downloadFile(path: "<your-download-path>", fileId: fileId);
```

@tab Rust

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.download_file(jwt, file, "file_id", None, None).await.unwrap();
}
````

Download file for another user:

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser, file: File)
{
	let output = user.download_file(file, "file_id", None, None).await.unwrap();
}
````

::::

To also verify the file by put in the right verify key. Make sure you save the user id from the creator of the file when uploading a file.

To get the user verify key just fetch it see [user - Public user information](/guide/user/#public-user-information)

:::: tabs#p

@tab Javascript

```typescript
const [url, meta_info, file_key] = await group.downloadFile(file_id, verify_key);
```

@tab Flutter

```dart
DownloadResult result = await group.downloadFile(path: "<your-download-path>", fileId: fileId, verifyKey: verifyKey);
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.download_file(jwt, file, "file_id", Some(verify_key), None).await.unwrap();
}
````

::::

:::: tabs#p

@tab Javascript

::: tip Download progress
To see the actual download progress pass in the download file function a closure:

````typescript
(progress: number) => void
````

````typescript
//no verify key in this case, just pass in an empty string
const output = await group.downloadFile(file, '', (progress: number) => {
	console.log("Download: " + progress);
});
````

This will print the progress to the console. But you can use any other js element.
:::

@tab Flutter

::: tip Download progress
To see the actual download progress pass in the download file function a closure:

```dart
void Function(double progress)
```

```dart
DownloadResult result = await group.downloadFile(path: "<your-download-path>", fileId: fileId, updateProgressCb: (progress) {
  print(progress);
});
```
:::

@tab Rust

::: tip Download progress
To see the actual download progress pass in the download file function a closure:


````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.download_file_with_progress(jwt, file, "file_id", |progress| {
		//do something with the progress
	}, None, None).await.unwrap();
}
````

:::

::::

:::: tabs#p

@tab Javascript

::: tip Cancel download
To cancel the download just set this static variable to true:

````typescript
import {Downloader} from "@sentclose/sentc";

Downloader.cancel_download = true;
````

This will cancel the actual download of a file.
:::

@tab Flutter

::: tip Cancel download
To cancel the download just set this static variable to true:

```dart
Downloader.cancelDownload = true;
```
:::

::::

## Delete a file

Just pass in the file id of the file to delete.

:::: tabs#p

@tab Javascript

````typescript
await group.deleteFile(file_id);
````

@tab Flutter

```dart
await group.deleteFile(fileId);
```

@tab Rust

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str)
{
	let output = group.delete_file(jwt, "file_id").await.unwrap();
}
````

::::

## Setting up your storage

In the [app options](/guide/create-app/), you can choose to use your own storage for file upload and download. 
By default, the SDK uses sentc storage, and you are charged per GB per month for its usage.

If you have your own storage solution, such as AWS S3, you can simply update the `delete`, `download` and `upload` URLs to point to your own storage. 
This will allow all file parts to be uploaded and downloaded directly from your storage.

If a file is deleted, we will call your backend storage to delete the corresponding file. 
The delete process can be stacked to delete multiple files at once.

In summery:

1. Set up your own upload and download endpoints in the app options within the SDK.
2. Configure your upload endpoint to receive multiple parameters through the URL.
3. Call the sentc API to register the file part, and you will receive an ID that can be used to delete the file part.
4. Set up the delete endpoint and an optional token in your app's file options within the dashboard.

See an example for using your own storage: [here](https://gitlab.com/sentclose/sentc/sdk-examples/own-backend-storage)

### Set your upload and download url in the sentc init options

:::: tabs#p

@tab Javascript

````typescript
await Sentc.init({
	app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
	file_part_url: "<your_url_to_your_storage>"
});
````

@tab Flutter

```dart
await Sentc.init(appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", filePartUrl: "<your_url_to_your_storage>");
```

@tab Rust

In rust, you need to pass in the url with the parameter:

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str, file: File)
{
	let output = group.download_file(jwt, file, "file_id", None, Some("file_url")).await.unwrap();
}
````

::::

We use the same URL for both upload and download, but with different HTTP methods:

- Upload: Method post
- Download: Method get


To update your URL, simply set the file part URL in the options. 
The uploader will automatically upload the parts to the new URL, 
and the downloader will attempt to download the parts from the new URL.

Please ensure that you transfer your data to the new URL.

### When uploading file parts to your url, register the file part at sentc api 

Call this endpoint when the upload is done: 
- `https://api.sentc.com/api/v1/file/part/<session_id>/<file_part_sequence>/<end>/<user_id>`

This endpoint needs your secret token and should only be called from your backend. See [own backend](/guide/advanced/backend-only) for sending the token as header.

```
Header name: x-sentc-app-token
Header value: <your_app_token>
```

- session_id is the id of the file upload session, this is a string.
- file_part_sequence is the sequence of the file part when downloading and decrypting the file. if this is wrong then the file can't be decrypted anymore.
- end is a boolean. Pass in false if the file upload has not finished yet or true if it is.
- user_id is the user that uploaded the file.

The sdk will call your endpoint with these values in the url as parameter and the user id from the user jwt or elsewhere.
A request might look like: 
- `https://your_url.com/<session_id>/<file_part_sequence>/<end>` 
- or `https://your_url.com/abc_123/0/false` 
- or `https://your_url.com/abc_123/1/true`

Just extract the values and call the sentc api to register the file part, so sentc can download the file. 
In the example above: 
- `https://api.sentc.com/api/v1/file/part/abc_123/0/false/<user_id>` 
- and `https://api.sentc.com/api/v1/file/part/abc_123/1/true/<user_id>`

### After calling the sentc api you will get back the file part id

This id is used to fetch and delete a part. 
Please store the id or rename your file part to this id.

Return the success result as json to the sdk: `{"status":true,"result":"Success"}`.

### Alternative workflow

You can also call the sentc api first to register a part and then read the request body.
Then you will get the right id, and you can name your file correctly.


### Set to delete endpoint for file parts 

This endpoint will be called with a `post` request and the deleted file part names in the body as json array:

````json
["name_0", "name_1", "name_2"]
````

See more here [app options](/guide/create-app/).

You can also set a token for us, so you know that the request comes really from our api to delete the files.

### When downloading a part the part id is in the url

The sdk will call your endpoint with a get request and the part id in the url. 
And except the encrypted file part as bytes.

`https://your_url.com/<part_id>`