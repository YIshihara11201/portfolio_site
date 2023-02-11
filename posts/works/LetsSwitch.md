---
title: "Let's Switch"
date: "2023-02-04"
description: "Let's Switch application"
keywords: GCD, MVVM, UserNotifications, PostgreSQL, Structured Concurrency, SwiftUI, Vapor, WebSockets 
image: https://user-images.githubusercontent.com/98417271/218219606-7959f413-2e4b-4cfb-bd66-2d478868aa12.png
---

```swift
/// Key technologies 
GCD / MVVM / UserNotifications / PostgreSQL /
Structured Concurrency / SwiftUI / Vapor / WebSockets
```

## Release
I published the app to the App Store!🎉  
[App Store Links](https://apps.apple.com/us/app/lets-switch/id1662123590)  

![App Store screenshots{700:157/100}](https://user-images.githubusercontent.com/98417271/218228757-01e623f4-418a-4884-903f-4f5dd93bff9d.png)  

## Introduction

### Backgorund
Switching tasks is always hard, especially you are studying, learning new things on your own. Once you finish studying math, you must feel unwilling to start reading history textbook. Without some kind of pressure, switching tasks is painstaking. I always feel guilty after realizing how valuable the time I was procrastinating was.

### Solution
This application takes advantage of peer pressure that you gain when you declare to do something in front of others. You will register your task in advance for some time slots in a day to match other user’s task. When the time comes, you are invited to matching room, there, you can send and receive ale to and from your partner, which will boost your motivation.

### Features
- PushNotifications
- WebSockets
- Database management for task scheduling with Vapor

### Requirements
- Swift: version 5.6
- iOS: 16.1 or later
- Vapor: version 4.0

### Repository
  [Let's Switch Repository](https://github.com/YIshihara11201/Lets_Switch)

## Usage

1. You will register a task. According to registration state, you will see different messages.


![slots{700:194/100}](https://user-images.githubusercontent.com/98417271/217910252-30dd857f-5a7b-4ea6-b293-41a8927171fe.png)

2. One minute before the registered time, you will receive push notification and can enter the matching room.

3. In the matching room, you and your partner can send ale to cheer up each other.

![demo{250:100/216}](https://user-images.githubusercontent.com/98417271/218219662-45b462de-f01c-4d3a-9c21-6249fc50ba26.gif)

4. You made a commitment, and will have no way to procrastinate switching tasks.

## Takeaways

Actual implementation considering dividing websocket rooms
```swift
// Server side implementation

enum WebSocketSendOption {
  case sender(WebSocket), all((WebSocket, UUID))
}

class WebSocketController {
  var clients: [UUID: [WebSocket]] // seperate websocket room according to id
  
  init() {
    self.clients = [:]
  }
  
  func webSocket(req: Request, socket: WebSocket) {
    let id = req.query[UUID.self, at: "id"]!
    self.connect(socket, id: id)
  }
  
  func connect(_ ws: WebSocket, id: UUID) { // register a client to room (specified by id)
    if clients[id] == nil {
      clients[id] = []
    } else {
      clients[id] = clients[id]!.filter({
        !$0.isClosed
      })
      
      if clients[id] == nil {
        clients[id] = []
      }
    }
    
    clients[id]!.append(ws)
    
    ws.onBinary { [weak self] ws, buffer in
      guard let self = self, 
            let data = buffer.getData(at: buffer.readerIndex, length: buffer.readableBytes) else { 
              return
            }
      self.onData(ws, data)
    }
    
    ws.onText { [weak self] ws, text in
      guard let self = self, let data = text.data(using: .utf8) else { return }
      self.onData(ws, data)
    }
		
    self.send(message: Handshake(), to: .sender(ws))
  }
  
  func send<T: Codable>(message: T, to sendOption: WebSocketSendOption) {
    do {
      let targets: [WebSocket] = {
        switch sendOption {
          case .sender(let ws):         // send to single client
            return [ws]
          case .all((let ws, let id)):  // send to all clients in the room of id
            guard let clients = clients[id] else {
              return []
            }
            
            // skip send to self
            return clients.filter { $0 !== ws }
        }
      }()
      
      let encoder = JSONEncoder()
      let data = try encoder.encode(message)
			
      targets.forEach {
        $0.send(raw: data, opcode: .binary)
      }
    } catch {
      logger.report(error: error)
    }
  }
	
  func onData(_ ws: WebSocket, _ data: Data) {
    let decoder = JSONDecoder()
    do {
      let sinData = try decoder.decode(SinData.self, from: data)
      switch sinData.type {
        case .ale:
          guard let id = UUID(uuidString: try decoder.decode(Ale.self, from: data).id) else { break }
          send(message: AleResponse(), to: .all((ws, id)))
        default:
          break
      }
    } catch {
      fatalError("\(error)")
    }
  }
}

extension WebSocketController: RouteCollection {
  func boot(routes: RoutesBuilder) throws {
    routes.webSocket("socket", onUpgrade: self.webSocket)
  }
}
```

```swift
// Client side implementation

final class WebSocketController {
  private let wsURLString = "someurl.ca"
  private let session: URLSession
  private let decoder = JSONDecoder()
  private let encoder = JSONEncoder()
  
  var socket: URLSessionWebSocketTask!
  var id: UUID
	
  init(id: UUID) {
    self.id = id
    self.session = URLSession(configuration: .default)
  }
  
  func connect() {
    self.socket = session.webSocketTask(with: URL(string: "ws://\(wsURLString)/socket?id=\(id)")!)
    self.listen()
    self.socket.resume()
  }
  
  func listen() {
    self.socket.receive { [weak self] (result) in
      guard let self = self else { return }
      switch result {
        case .failure(let error):
          print(error)
          self.socket.cancel(with: .goingAway, reason: nil)
          self.connect()
          return
        case .success(let message):
          switch message {
            case .data(let data):
              self.handle(data)
            case .string(let str):
              guard let data = str.data(using: .utf8) else { return }
              self.handle(data)
            @unknown default:
              break
          }
        }
        
      self.listen() // once communication successed, prepare for next one
    }
  }
  
  func handle(_ data: Data) {
    do {
      let sinData = try decoder.decode(SinData.self, from: data)
      switch sinData.type {
        case .handshake:
          print("Shook the hand")
        case .aleResponse:
          self.handleAleResponse()
        default:
          break
      }
    } catch {
      print(error)
    }
  }
  
  func handleAleResponse() {
    print("handling ale")
    DispatchQueue.main.async {
      // notify the application that it received an ale message from websocket communication
      NotificationCenter.default.post(name: Notification.Name.thumbsUpReceivedNotification, object: nil) 
    }
  }
  
  func sendAle() {
    let message = Ale(id: id.uuidString)
    do {
      let data = try encoder.encode(message)
        self.socket.send(.data(data)) { (err) in
          if err != nil {
            print(err.debugDescription)
          }
        }
    } catch {
      print(error)
    }
  }
}

// Websocket Communication types
enum MessageType: String, Codable {
  case handshake, ale, aleResponse
}

struct SinData: Codable {
  let type: MessageType
}

struct Handshake: Codable {
  var type = MessageType.handshake
}

struct Ale: Codable {
  var type = MessageType.ale
  var id: String
}

struct AleResponse: Codable {
  var type = MessageType.aleResponse
}
```
