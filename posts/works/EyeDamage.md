---
title: "Eye Damage"
date: "2023-02-08"
description: "EyeDamage application"
keywords: ActivityKit, MVVM, UserNotifications, PostgreSQL, Structured Concurrency, SwiftUI, UIBezierPath, Vapor, Vapor_Queues, XCTest
image: https://user-images.githubusercontent.com/98417271/218219331-8d3727f2-ad37-4df9-9f54-f1a145ac80a1.jpg
---

```swift
/// Key technologies 
ActivityKit / MVVM / UserNotifications / PostgreSQL / Structured Concurrency /
SwiftUI / UIBezierPath / Vapor / Vapor_Queues / XCTest
```

# Release
I published the app to the App Store!🎉  
[App Store Links](https://apps.apple.com/us/app/eyedamage/id1658452227)  

![eyedamage_appstore{700:149/100}](https://user-images.githubusercontent.com/98417271/218229201-1cf45546-8cd4-4745-aeba-0c1c2d888d15.png)

# Introduction

## Backgorund
There are various apps to discourage smartphone use. Some of them discourage smartphone use by giving rewards to users such as character items, based on the amount of time they do not use their phones. But I have had the experience of that backfired because I was looking forward to the rewards. I thought, for some people including me, the inclusion of game elements may in fact cause people rather to be distracted by their phones. And I wondered, instead of rewarding people, If I gave them a punishment based on use time, people would refrain from using their phones.

## Solution
In this app, I feature a creepy eye on lock screen, blood vessels of which bleed according to smartphone usage during bedtime. With Live Activities that was introduced in iOS 16, the application can reflect smartphone usage to the eye icon in real time manner.
In addition, I implemented summary report functionality so that users can identify trends about their smartphone usage time. This will help them to understand when they use their phones too much, how tired their eyes feel when they use them too much, etc.

## Features
- LocalNotifications
- PushNotifications
- LiveActivities
- Local data persistence (Store daily usage reports with FileMnager)

## Requirements
- Swift: version 5.6
- iOS: 16.1 or later
- Vapor: version 4.0

## Repository
[EyeDamage Repository](https://github.com/YIshihara11201/Eye_Damage)

## Usage
1. You will set bed time and wakeup time on the Setting tab.

![setting{300:250/444}](https://user-images.githubusercontent.com/98417271/218219856-cba96af3-0f83-4b6c-8aaa-4eded5d342cf.png)

2. Once you set the time, you will receive notification at the bedtime.  

3. When you tap the notification, time recording starts. After the moment, every time you unlock smartphone (and open the application), the app records the time you start using smartphone.

4. Before you stop using smartphone, you will tap sleep button, which will records the timing you will go to sleep.  

5. At the same timing as 3., Live Activity is triggered and you will see an eye on the lock screen, which will bloodshoot as you spend time using smartphone.

![eye{300:250/444}](https://user-images.githubusercontent.com/98417271/217737501-564dccb4-298d-4bb9-b4bc-00f5efdb5986.png)

# Takeaways
## Problem
With default specification, Live Activity is terminated 8 hours after it is triggered. \(see [Apple documentation](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities)\).  
Its state properties are thrown away as well. With this behaviour, when you get up in the morning, you will see an icon saying "you spent 0 min 0 sec" without some devices like the image below.

![initial_eye_state{250:236/100}](https://user-images.githubusercontent.com/98417271/218220218-1973dc07-7619-440b-83ac-3e6ca29bffd6.png)

## Solution for the problem
I solved this problem using silent remote notification and Vapor/Queues.  
The idea is to send a signal 5 minutes before Live Activity is forced to terminated, and thereby retain the eye icon state for next morning.  
While user is sleeping, application will receive a silent notification in the background and use a method to terminate Live Activity in a notification delegate method. This will prevent the lock screen from being reset the next morning.

I used following technologies to achieve this.  
- Vapor/Queues (to schedule a futer task)  
- Silent Remote Notification (notify an application something from server side when user application is not in foreground)  

## 1. Schedule future tasks
With Vapor/Queues, you can set a task regulary or at specific timing.  

- **Job**
Tasks are defined by the Job or AsyncJob protocol.
```swift
struct ActivityInfo: Codable {
  let pushToken: String
}

struct BackgroundLiveActivitiesUpdateJob: AsyncJob {
  typealias Payload = ActivityInfo
  
  func dequeue(_ context: Queues.QueueContext, _ payload: ActivityInfo) async throws {
    // this method will send silent remote notification to a client
    try await APNSManager.sendBackgroundNotification(token: payload.pushToken, client: APNSManager.getClient(), activityInfo: payload)
  }
}
```

- **Registering a Job**
After modeling a job you must add it to your configuration section like this:

```swift
// in configure method, register Job
let bgLiveActivityJob = BackgroundLiveActivitiesUpdateJob()
app.queues.add(bgLiveActivityJob)
```

- **Running Workers in-process**
To run a worker in the same process as your application (as opposed to starting a whole separate server to handle it), call the convenience methods on Application:
```swift
// in configure method, run worker
try app.queues.startInProcessJobs(on: .default)
```

- **Dispatching Jobs**
To dispatch a queue job, you need access to an instance of Application or Request.  
You will most likely be dispatching jobs inside of a route handler:  
With delayUntil argument, you can specify time to trigger the job
```swift
// inside route handler function
try await req.queue.dispatch(
  BackgroundLiveActivitiesUpdateJob.self,
  activityInfo,
  delayUntil: dispatchDate
)
```  
  
## 2. Send Silent Remote Notification
You can receive remote notification using 
```swift
func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) async -> UIBackgroundFetchResult 
```

Inside the delegate, I ended the ongoing Live Activity.  
This will keep the eye icon up-to-date even 8 hours after its start.  
```swift
func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) async -> UIBackgroundFetchResult {
    await Activities.terminateActivity()
    return .noData // always return no data (regardless termination succeeds or not)
}
```
