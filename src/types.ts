import { WebSocket } from 'ws';

export type JsonObject = { [x: string]: JsonNode }

export type JsonNode =
  | string
  | number
  | boolean
  | JsonObject
  | Array<JsonNode>

export type HttpHandlerResult = {
  body: JsonNode
  statusCode: number
}

export type WebSocketWithId = { clientId: string, socket: WebSocket}

export type WsInboundMessageType = 'PING' | 'SUBSCRIPTION'

export type WsInboundMessage = {
  type: WsInboundMessageType,
  body?: string
}

export type WsOutboundMessageType =
  | 'CONNECTION_ESTABLISHED'
  | 'PONG'
  | 'SUBSCRIPTION_ESTABLISHED'
  | 'SUBSCRIPTION_UPDATE'
  | 'ERROR'

export type WsOutboundMessage = {
  type: WsOutboundMessageType,
  _clientId: string
  body?: JsonNode
}