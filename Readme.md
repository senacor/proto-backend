# Prototyping Backend

This is a Generic Backend based on Node, Typescript and Express, to support quick prototyping efforts across multiple 
frontends.

**DISCLAIMER:** This Backend is made for prototyping only and is **NOT** intended for production purposes. 
It lacks security, performance and robustness for productive use.

## Development

- written for node18, other versions probably compatible, too
- `npm install` to install dependencies
- `npm run test` to run tests
- `npm run build` to transpile code to `dist` directory
- `npm run start` to start express server (currently no watch mode)
- `npm run build_start` as a shortcut for `npm run build` and `npm run start`

## Usage

This backend exposes a websocket API and an http API to access one common storage. 
The storage is in-memory, so the data is lost on a server-restart.

### Data Storage

The data storage is JSON based an can dynamically handle different object structures.

For the examples below, suppose a storage to look like this:

```JSON
{
  "ONE": {
    "A": true,
    "B": "someString"
  },
  "TWO": ["foo", "bar"],
  "THREE": 100
}
```

### Websocket API

#### Connection
- You can connect to `ws://localhost:8999`
  - A success message of type `CONNECTION_ESTABLISHED` will be sent back.

#### Requests
- Request Message format: `{ type: RequestType, body?: string }`
- The Different possible values of `RequestType` are described below.

**`PING`:** 

Body is ignored, returns a simple `PONG` message: 
- Request: `{"type":"PING"}`
- Response: `{"type":"PONG","_clientId":"928c6932-0c99-40b7-8795-bd0703ed0c51"}`

**`SUBSCRIPTION`:** 
- Subscribe to a specific first-level element of the storage (e.g. "ONE", but not "ONE.A"). 
- Everytime, this element or any children are updated, the updated data is sent back with a `SUBSCRIPTION_UPDATE` event.
- Can be called multiple times to manually get the latest content 
- Example 1: 
  - Request: `{"type":"SUBSCRIPTION", "body": "ONE"}`
  - Response: `{"type":"SUBSCRIPTION_ESTABLISHED","body":{"A": true,"B":"someString"},"_clientId":"928c6932-0c99-40b7-8795-bd0703ed0c51"}`
- Example 2: 
  - Request: `{"type":"SUBSCRIPTION", "body": "FOUR"}`
  - Response: `{"type":"SUBSCRIPTION_ESTABLISHED","_clientId":"928c6932-0c99-40b7-8795-bd0703ed0c51"}`
    - No `body` field, as there no first-level element named `FOUR`.
- Example 3:
  - Request: `{"type":"SUBSCRIPTION"}`
  - Response: `{"type":"ERROR","body":"SUBSCRIPTION Requests need a body string that does not contain a '/' character","_clientId":"928c6932-0c99-40b7-8795-bd0703ed0c51"}`


#### Responses
- Response Message format: { type: ResponseType, body?: string | JSON, _clientId: uuid }
- The Different possible values of `ResponseType` are described below.

**`PONG`:** See `PING` request. Message body never exists.

**`SUBSCRIPTION_ESTABLISHED`:** See `SUBSCRIPTION` request. Message body is always JSON if it exists.

**`SUBSCRIPTION_UPDATE`:**

- Message sent to all subscribed clients when a value changes inside the subscribed object.
- Message Body is always JSON
- Example :
  - Subscribed Clients:
    - Client A is subscribed to `ONE`
    - Client B is subscribed to `ONE` and `TWO`
    - Client C is subscribed to `THREE`
  - Update of `ONE/A` via HTTP PUT request to `false`
  - Clients A and B receive this message: `{"type":"SUBSCRIPTION_ESTABLISHED","body":{"A": false,"B":"someString"},"_clientId":"<Each Client's ID>"}`
  - Client C does not receive any message

**`CONNECTION_ESTABLISHED`:**
- Initial message on connection success
- Message body never exists.
- Example: `{"type":"CONNECTION_ESTABLISHED","_clientId":"4c1f629f-cc88-48d2-b4b0-9164f7de8f7d"}`

**`ERROR`:**
- Error response in case something goes wrong
- Message body is always a string
- Example: See `SUBSCRIPTION` Request #3


### HTTP API

- The HTTP API exposes a GET and PUT endpoint that can be used to read and write data to the storage.
- Every level of the storage can be accessed via the URI, e.g. `GET /ONE/A`
- 

#### GET Endpoint - Examples

- `curl http://localhost:8998` => status: `200`, body: `{"ONE": {"A": true,"B":"someString"},"TWO": ["foo", "bar"], "THREE": 100}` 
- `curl http://localhost:8998/ONE` => status: `200`, body: `{"A": true,"B":"someString"}` 
- `curl http://localhost:8998/ONE/A` => status: `200`, body: `true` 
- `curl http://localhost:8998/ONE/B` => status: `200`, body: `someString` 
- `curl http://localhost:8998/TWO` => status: `200`, body: `["foo", "bar"]` 
- `curl http://localhost:8998/TWO/0` => status: `200`, body: `foo` 
- `curl http://localhost:8998/FOUR` => status: `200`, no body
- `curl http://localhost:8998/FOUR/FOO` => status: `500`, body: default HTML Error Page

#### PUT endpoint
- PUT endpoint only allows writing of JSON containers (array or object). Writing of strings, booleans or numbers is not supported.
- Examples (always assuming the example structure as a base):
  - Update first level value
    - `curl http://localhost:8998/ONE -X PUT --data '{"A": false,"B":"someString"}' -H 'Content-Type: application/json'`
    - Updates sotrage accordingly
    - Notifies all clients that subscribed to `ONE` with message: `{"ONE": {"A": false,"B":"someString"}}`
    - Returns code `200` with the data input as updated in the body: `{"A": false,"B":"someString"}`
  - Update lower level value:
    - `curl http://localhost:8998/ONE/C -X PUT --data '["item1", "item2"]' -H 'Content-Type: application/json'`
    - Updates sotrage accordingly
    - Notifies all clients that subscribed to `ONE` with `{"ONE": {"A": true,"B":"someString", "C": ["item1", "item2"]}}`
    - Returns code `200` with the data input as updated in the body: `["item1", "item2"]}`
  - Update array value:
    - `curl http://localhost:8998/TWO/1 -X PUT --data '["item1", "item2"]' -H 'Content-Type: application/json'`
    - Updates sotrage accordingly
    - Notifies all clients that subscribed to `TWO` with `{"TWO": ["foo", ["item1", "item2"]]}`
    - Returns code `200` with the data input as updated in the body: `["item1", "item2"]}`
