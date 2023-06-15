# Searchable encryption

When the data is fully end-to-end encrypted, nobody even the server can decrypt and read / analyse the data.
This makes it very hard to query the data without loading everything all at once, decrypt in the client and then fulfill the query.

With Sentc you can create searchable encryption from your keywords. At the api Sentc searches for all matching keywords.

Hmac is used to create hashes from the keywords in the client, which can then be searched. 
Hmac makes it also harder to re calculate the hash.

Searchable is only possible for groups.

You can choose if you want to hash the full keyword or each character. 

Hashing the full word can be helpful if you want to store credit-card numbers. 
In this case you will only find a match if you pass in the full number

When hashing each character you can search for similar results. 
You can also set a limit of how many characters will be hashed. 
For no limit, all characters will be hashed.
It will only find words from the start to bottom, the word smart and smith will be
- matched for: `s` or `sm` 
- but not for: `m` or `t`.

## Create

The keywords are hashed in the client but can only be sent to the api with your secret token, to make sure that it matches your content.

There are two ways to create it:

- light way: only create the hashes from your keywords, you need to set the other values at your backend before sending it to the sentc api. This can be used when you just create the new content and got no identifier.
- complete: pass in an identifier or reference to your content

### Light

:::: tabs#p

@tab Javascript

```ts
//the data string are the key word what you want to hash.
//the full flag is here set on false
//limit is 5 -> only the first 5 characters will be hashed

const input_for_server = group.prepareCreateSearchableItemLight("<your-key-word>", false, 5);
```

The input contains:

```ts
interface PrepareSearchableLight
{
	hashes: string[],
	alg: string,
	key_id: string
}
```

@tab Flutter

```dart
//the data string are the key word what you want to hash.
//the full flag is here set on false
//limit is 5 -> only the first 5 characters will be hashed

SearchCreateDataLight inputForServer = await group.prepareCreateSearchableItemLight("<your-key-word>", false, 5);
```

`SearchCreateDataLight` contains:

```dart
class SearchCreateDataLight {
  final List<String> hashes;
  final String alg;
  final String keyId;

  const SearchCreateDataLight({
    required this.hashes,
    required this.alg,
    required this.keyId,
  });
}
```

::::

Send the hashed, the alg and the key id to th sentc api with the following values:

- `item_ref`: The Identifier of your record in your backend. This will be returned for each match
- `category`: Optional to just search in one category [see content categories for more](/guide/content/)

The full json looks like this:

```json lines
{
  item_ref: string,
  hashes: Array<string>,
  alg: string, 
  key_id: string,
  category: Option<String>
}
```

### Complete

In this scenario, you must set all values directly in the client even item_ref and category. 
The output is a string that can be sent directly to the sentc api, but only with your secret token, so send it to your backend first!

:::: tabs#p

@tab Javascript

```ts
//the data string are the key word what you want to hash.
//the full flag is here set on false
//category is optional and can be null or undefined
//limit is 5 -> only the first 5 characters will be hashed

const input = group.prepareCreateSearchableItem("<item-ref>", "<your-key-word>", false, "<catagory>", 5);
```

@tab Flutter
```dart
//the data string are the key word what you want to hash.
//the full flag is here set on false
//category is optional and can be null or undefined
//limit is 5 -> only the first 5 characters will be hashed

String input = await group.prepareCreateSearchableItem("<item-ref>", "<your-key-word>", false, "<catagory>", 5);
```

::::

### Send it to the sentc api

Use the following endpoint with a POST request to send your json encoded data to the sentc api to register the key word.

- `https://api.sentc.com/api/v1/search/group/<group-id>`
- Set for `<group-id>` the corresponding group
- Send the user jwt, [see more at own backend](/guide/backend-only/). The jwt is needed to check if the user got access to this group.

## Delete keywords

To delete keywords, send a DELETE request to the following url:

- `https://api.sentc.com/search/group/<group-id>/<item-ref>`
- Set for `<item-ref>` the identifier which was used at the creation step
- Send the user jwt, [see more at own backend](/guide/backend-only/)

### Delete keywords in one category

Instead of deleting all keywords for the group, you can just delete keywords in one category.

Use the following url with a DELETE request:

- `https://api.sentc.com/search/group/<group-id>/<item-ref>/<category>`
- Set for `<category>` the category where the keywords should be deleted

## Search

You can only find matches of keywords that are created in the actual group. It is not possible to find matches outside or global in your app.

:::: tabs#p

@tab Javascript
```ts
const items: ListSearchItem[] = await group.searchItem("<the-keyword>");

//to fetch the next page, use the last fetched item
const items_page_two = await group.searchItem("<the-keyword>", items[items.length-1]);
```

The content is:

```ts
interface ListSearchItem
{
    id: string,
    item_ref: string,
    time: number
}
```

@tab Flutter
```dart
List<ListSearchItem> items = await group.searchItem("<the-keyword>");

//to fetch the next page, use the last fetched item
List<ListSearchItem> itemsPageTwo = await group.searchItem("<the-keyword>", items.last);
```

The class is:

```dart
class ListSearchItem {
  final String id;
  final String itemRef;
  final String time;

  const ListSearchItem({
    required this.id,
    required this.itemRef,
    required this.time,
  });
}
```
::::

The identifier or reference to your item is in `item_ref`. The `id` and `time` are needed to fetch more pages. 
The items are ordered by id, the last comes first. 
Now you can fetch the real content from your backend.

To do the search from your backend use the following url with a GET request and the users JWT:

- `https://api.sentc.com/search/group/<group-id>/all/<last-fetched-item>/<last-id>?search=<the-key-word>`

### Search in category

To only show the identifier in a category pass in the category in the group search function.

:::: tabs#p

@tab Javascript
```ts
const items: ListSearchItem[] = await group.searchItem("<the-keyword>", undefined, "<category>");

//to fetch the next page, use the last fetched item
const items_page_two = await group.searchItem("<the-keyword>", items[items.length-1], "<category>");
```

@tab Flutter
```dart
List<ListSearchItem> items = await group.searchItem("<the-keyword>", null, "<category>");

//to fetch the next page, use the last fetched item
List<ListSearchItem> itemsPageTwo = await group.searchItem("<the-keyword>", items.last, "<category>");
```
::::

To do the search from your backend use the following url with a GET request and the users JWT:

- `https://api.sentc.com/search/group/<group-id>/<category>/<last-fetched-item>/<last-id>?search=<the-key-word>`