# Database with encrypted values

Like it was mentioned in [searchable](/guide/e2ee/searchable/) and [sortable](/guide/e2ee/sortable/) 
you can still use your database to query data to the customer without the need to decrypt it first and then doing queries like 
searching for a value, getting the exact results or returning a sorted list of values.

Use searchable encryption to get either the exact data match or multiple data to a searched value 
and sortable encryption to do range queries like `ORDER BY name`.

Because sortable encryption won't encrypt your full data it should not be used for exact matches.

The best thing is that you don't need to modify your database or just different functions. 
Both technics can be used with the native database query functions like you would do with not encrypted data.

The example below is a relational database like mysql, sqlite or postgres but this will also work for nosql databases.

## The tables

Use a normal table for your data like you would do without encryption.

Table: user:

| id  | first_name | last_name | age |
|-----|------------|-----------|-----|
| 123 | Jon        | Snow      | 24  |
| 124 | John       | Snowing   | 55  |
| 125 | Johnny     | Depp      | 60  |

In the real world the data is end-to-end encrypted in your group. The problem, you can't do anything with it, except storing them.

### Searchable

Create a 2nd table for the search hashes of each column you want to query and link it to your users table.

Table: user_hash:

| item_id | hash                  |
|---------|-----------------------|
| 123     | `hash of Jon`         |
| 123     | `another hash of Jon` |
| 124     | `hash of John`        |
| 125     | `hash of Johnny`      |

Now create the hashes like this:

:::: tabs#p

@tab Javascript

```ts
const hashes_jon = group.createSearchRaw("Jon");

const hashes_john = group.createSearchRaw("John");

const hashes_johnnny = group.createSearchRaw("Johnny");
```

@tab Flutter

```dart
final hashesJon = await group.createSearchRaw("Jon");

final hashesJohn = await group.createSearchRaw("John");

final hashesJohnny = await group.createSearchRaw("Johnny");

```

::::

You can also set a boolean flag in your hashes table for the last hash of a word.
The last item in the hashes list is also the hash of the exact word.

This helps to do queries where you need the equal value and not all values like this.

| item_id | hash                  | last_hash |
|---------|-----------------------|-----------|
| 123     | `hash of Jon`         | false     |
| 123     | `another hash of Jon` | true      |
| 124     | `hash of John`        | false     |
| 125     | `hash of Johnny`      | false     |

If you want to only got the exact values test if the last is true.

### Sort/Order able

If you also want to query the last name create a second table for the hashes of the last name 
or create a column with a flag that identifies to what column the hash is for, for the id.

To do range queries expand the users table by a column of a value that you want to do the range query. Like if you want to `ORDER BY` first_name, 
then create another column with the sortable first_name.

| id  | first_name  | last_name   | age         | order_first_name |
|-----|-------------|-------------|-------------|------------------|
| 123 | `encrypted` | `encrypted` | `encrypted` | 1267             |
| 124 | `encrypted` | `encrypted` | `encrypted` | 1268             |               
| 124 | `encrypted` | `encrypted` | `encrypted` | 1269             |

Now create the sortable column like this:

:::: tabs#p

@tab Javascript

```ts
const sort_jon = group.encryptSortableRawString("Jon");
const sort_john = group.encryptSortableRawString("John");
const sort_johnny = group.encryptSortableRawString("Johnny");
```

@tab Flutter

For flutter, it is a future

```dart
final sortJon = await group.encryptSortableRawString("Jon");
final sortJohn = await group.encryptSortableRawString("John");
final sortJohnny = await group.encryptSortableRawString("Johnny");
```

::::


## Query

To get now the data just use the normal database queries.

To get all users order by name:

```sql
SELECT id, first_name, last_name, age FROM users ORDER BY order_first_name
```

This data can then decrypt by the group key.

To get the exact data you need to create a hash in the client first and then search it:

:::: tabs#p

@tab Javascript

```ts
const hash = group.search("jo");
```

@tab Flutter

```dart
final hash = await group.search("jo");
```

::::

```sql
SELECT id, first_name, last_name, age 
FROM users u, user_hash uh 
WHERE 
    u.id = uh.item_id AND 
    hash = ?
```

The result would be all three users because everyone begins with `jo`.

To get exact values just check if it is the last hash (of the full word).

```sql
SELECT id, first_name, last_name, age 
FROM users u, user_hash uh 
WHERE 
    u.id = uh.item_id AND last_hash = TRUE AND
    hash = ?
```

For the hash of `John` only the data with id 124 will be returned but not johnny (id 125).