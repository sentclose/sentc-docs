# Content

It is possible to create very complex groups and subgroups as well groups connected to [groups](/guide/group/). 
Managing content within this connections can be very challenging.

Sentc comes with an ID system to store identifier of your content related to a group.
This Ids can be fetched via the sentc api.
If a user has access to a group he/she is also able to fetch the Ids. 

- You can fetch all content to a user from all groups/connected-groups/child-groups where the user got access
- Fetch only content in a group and its subgroups

The Ids can only be set with your secret token from your backend to make sure that the Ids are direct related to your content.

## Create content

To store the Ids make a POST request to the following url, with the users jwt: `https://api.sentc.com/api/v1/content/<group-id>`. <br>
See at [own backend](/guilde/backend-only/) how to make requests to the sentc api.

The following body is needed:

```json lines
{
	item: string,
	category: Option<String>
}
```

- Item is the Identifier of your content to fetch it later
- Category can be any string. See below how it works

## Delete content

To delete an ID, use this url: `https://api.sentc.com/api/v1/content/item/<ID>` with ID as the content id to delete.
This endpoint can also only be used with your secret token from your backend, not the client. A jwt is also required.

## Fetch content

Fetching can be done in the client with the public token or on the server. 
Items are ordered by the created time in DESC mode (the newest comes first).
You can specify how many items should the api give back. 
You can enable the endpoints to control how many items should be fetched via the [App options](/guide/create-app).

- `https://api.sentc.com/api/v1/content/<items-limit>/all/<last-fetched-time>/<last-id>`

Pass in the `<last-fetched-time>` (the timestamp of the last fetched item) and the id of the last item

The `<items-limit>` defines how many items the api maximal returns and is controlled with the App options. 
Set one of the following:

- The `small` returns max 20 items
- The `med` returns max 50 items
- The `large` returns max 70 items
- The `xlarge` returns max 100 items

The `all` endpoints means, fetch every content related to a user, where the user got access to. 
All groups where the user is member, their child-groups and the connected groups of the groups and child groups.

It returns a list with the following list items:

```json lines
{
    id: string,
    item: string, 
    belongs_to_group: Option<String>,
    belongs_to_user: Option<String>,
    creator: string, 
    time: number,
    category: Option<String>,
    access_from_group: Option<String>
}
```

- `id` is the internal sentc id of your item and is used to fetch it with the requests
- `item` is the Identifier you choose at creating content
- `belongs_to_group` is optional and contains the group id if the content was created in a group
- `belongs_to_user` is optional and contains the user id if the content was created for a specific user
- `creator` the sentc api id of the user who created the item
- `time` the created time of the item. This is used to fetch the content with the requests
- `category` is optional and contains the category of the content if it was set
- `access_from_group` is optional and contains the group id from where the user can access the content if the content was created in a connected-group

### Fetch content in a group

The endpoints are almost as the same as fetching all content but a `<group-id>` is required.

- `https://api.sentc.com/api/v1/content/group/<group-id>/<items-limit>/all/<last-fetched-time>/<last-id>`

To simplify the fetching in groups you can also fetch it from the sdk:

:::: tabs#p

@tab Javascript

```ts
// all options are optional but required to fetch more content 
// or content (last_fetched_item) in a category (cat_id)
const list: ListContentItem[] = await group.fetchContent({
	last_fetched_item: ListContentItem,
	cat_id: string,
	limit: CONTENT_FETCH_LIMIT
});

//to fetch the next page
const list_page_two: ListContentItem[] = await group.fetchContent({
	last_fetched_item: list[list.length-1],
	cat_id: string,
	limit: CONTENT_FETCH_LIMIT
});
```

The List item object

```ts
interface ListContentItem
{
	id: string,
	item: string,
	belongs_to_group?: string,
	belongs_to_user?: string,
	creator: string,
	time: number,
	category?: string,
	access_from_group?: string,
}

const enum CONTENT_FETCH_LIMIT {
	small = "small",
	medium = "med",
	large = "large",
	x_large = "xlarge"
}
```

@tab Flutter
```dart
// all options are optional but required to fetch more content 
// or content (lastFetchedItem) in a category (catId)
List<ListContentItem> list = await group.fetchContent();

//to fetch the next page
List<ListContentItem> listPageTwo = await group.fetchContent(
    lastFetchedItem: list.last
);
```

The List item object

```dart
class ListContentItem {
  final String id;
  final String item;
  final String? belongsToGroup;
  final String? belongsToUser;
  final String creator;
  final String time;
  final String? category;
  final String? accessFromGroup;

  const ListContentItem({
    required this.id,
    required this.item,
    this.belongsToGroup,
    this.belongsToUser,
    required this.creator,
    required this.time,
    this.category,
    this.accessFromGroup,
  });
}

enum ContentFetchLimit {
  Small,
  Medium,
  Large,
  XLarge,
}
```
::::

## Categories

As mentioned above, content can be stored with a category. 
This helps to fetch just the content of a specific category instead of fetching all content.

An example could be a chat and cloud platform, where all chat messages Ids are stored under the chat category and all files in the cloud under file category.
In the frontend it is possible to fetch just the chat messages or just the files.

When creating new content just set a category in the body like this:

```json lines
{
	item: "my-chat-message-id",
	category: "chat"
}
```

Category can be any string.

### Fetching content with category

The url and request is almost the same as the normal fetch or group fetch. 
It is still a GET request and the items limit, last fetched time and last fetched id should be set.

- `https://api.sentc.com/api/v1/content/small/<category>/<last-fetched-time>/<last-id>`

At `<category>` set your category to fetch.

To fetch content in groups:

- `https://api.sentc.com/api/v1/content/group/<group-id>/small/<category>/<last-fetched-time>/<last-id>`

To fetch the content with the sdk for groups use:

:::: tabs#p

@tab Javascript

```ts
const list: ListContentItem[] = await group.fetchContent({
	last_fetched_item: ListContentItem,
	cat_id: "<category>",
	limit: CONTENT_FETCH_LIMIT
});

//to fetch the next page
const list_page_two: ListContentItem[] = await group.fetchContent({
	last_fetched_item: list[list.length-1],
	cat_id: "<category>",
	limit: CONTENT_FETCH_LIMIT
});
```

@tab Flutter
```dart
List<ListContentItem> list = await group.fetchContent(
  catId: "<category>"
);

//to fetch the next page
List<ListContentItem> listPageTwo = await group.fetchContent(
    lastFetchedItem: list.last,
    catId: "<category>"
);
```
::::