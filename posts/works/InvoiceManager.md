---
title: "Invoice Manager"
date: "2023-02-05"
description: "InvoiceManager application"
keywords: FIleManager, GoogleSignIn, PDFKit, UICollectionView, UICollectionViewDiffableDataSource, UITableView, UITableViewDiffableDataSource, UIKit, XCTest
image: https://user-images.githubusercontent.com/98417271/218219528-c6ff4310-edcb-4f69-8d94-eaa3703eca6e.png
---

```swift
/// Key technologies 
FIleManager / GoogleSignIn / PDFKit / UICollectionView /
UICollectionViewDiffableDataSource / UITableView / UITableViewDiffableDataSource / UIKit / XCTest
```

# Introduction

## Backgorund
The application was designed to replace script-baced invoicing system with more efficient iOS invoicing application. The client requests (implemented functionalities) are as follows.
- Import Google Calender schedules.
- According to the schedules, create invoice pdf for each customer.
- Manually create invoice for a customer.
- At first day of months, generate invoices automatically and send mails.
- Store invoice recods to review income.

## My contribution
QATester / iOS Developer

## Roles

- Refactor untestable codes such that they become testable with various techniques to isolate dependencies.
- Implement Unit/UI tests.
- Create PDF generator with PDFKit to replace existing script-based One.
- Implement some UITableViews & UIColletionViews to display users information fetched from Google Calendar.  
  
---------  
  
# Unit Testing Techniques 
This post mainly describes the knowledge and techniques I used throgh testing.

## FIRST principle
Tests must follow "FIRST" principle  

#### Fast
&nbsp;&nbsp; Tests that takes 1/10th of a second to run is a slow unit test.

#### Isolated
&nbsp;&nbsp; Tests have no side effects that would persist beyond the test run.

#### Repeatable
&nbsp;&nbsp; Calling a function with the same input will always yield the same output.

#### Self-verifying
&nbsp;&nbsp; This means using assertions to pass or fail without human verification.

#### Timely
&nbsp;&nbsp; Tests have more value when written before the production code.

## Test Launch Sequence
How tests are launched?
1. Launch the simulator on macOS.
2. Dynamically inject the test bundle into the app.
3. Launch the app in the simulator.
4. Run the tests.
5. Terminate the app.

This gives tests the ecosystem they need to verify interactions with UIKit.  
As part of step 3, UIKit gives the app delegate a chance to set up anything the app needs to launch. This may include things like the following:  

- Setting up core data
- Sending an app-specific key to an analytics service
- Sending a request to fetch data it needs before going to the first screen

These are things we don’t want to have happen while running unit tests, therefore AppDelegate must be bypassed to prevent unintended side-effect

## Bypass AppDelegate
[https://mokacoding.com/blog/prevent-unit-tests-from-loading-app-delegate-in-swift/](https://mokacoding.com/blog/prevent-unit-tests-from-loading-app-delegate-in-swift/)

```swift
// main.swift
import UIKit

private func delegateClassName() -> String? {
  return NSClassFromString("XCTestCase") == nil ? NSStringFromClass(AppDelegate.self) : nil
}

UIApplicationMain(
  CommandLine.argc,
  CommandLine.unsafeArgv,
  nil,
  delegateClassName()
)

// AppDelegate.swift
import UIKit

class AppDelegate: UIResponder, UIApplicationDelegate {
  // ...
}
```

## Example of Difficult Dependencies
Q) What type of tests are difficult (or untestable)?  
A) Ones violate FIRST principle.  

#### F for Fast
  Examples include the following:  
  - Calls to web services
  - Timers

#### I for Isolated
Globals aren’t a problem if they’re read-only, such as string constants. It’s when we can change the value of a global that we run into the challenges of shared mutable state. One test can set a value that affects a following test.  
  
Examples include the following:

  - Global variables and persistent storage  
  - Variables defined outside of any type
  - Singletons
  - Static properties
  - The file system
  - UserDefaults
  - The keychain
  - A local database
  - A remote database
  
We need each test to run in a clean room.  
Earlier test runs or manual testing should not change the outcome of automated tests.  
And automated tests should leave no trace that affect later manual testing.  

#### R for Repeatable
We expect different results for the following:  

  - Current time or date
  - Camera or microphone input
  - Face ID or Touch ID
  - Core Motion sensors  
  - Random numbers
  - External services they can fail
  - Writing to a log file, we can run out of disk space
  - Time zone of the machine running tests when writing tests
  - Analytics
  - Playing audio or video  

# Isolate Dependencies from test code
This section shows some of techniques to isolate difficult dipendencies from test codes.
## Add Backdoor (conditional compilation to isolate singleton)

```swift
// Before Adding Backdoor

class Singleton {
  static let shared = Singleton()
  func doSomething() {}	
}

func main() {
  Singleton.shared.doSomething()
}
```  

```swift
// Backdoor applied

class MySingleton {
  static var shared: MySingleton {
#if DEBUG
    if let stubbedInstance = stubbedInstance {
      return stubbedInstance
    }
#endif
    return instance
  }
	
#if DEBUG
  static var stubbedInstance: MySingleton?
#endif
  
  static let instance = MySingleton()
  func doSomething() {} 
}

func main() {
  MySingleton.stubbedInstance = MySingleton()
  MySingleton.shared.doSomething()
}
```
Note:  
Use this technique when you own singletons.  
But in general, you should avoid mixing test code into production code.  
Conditional compilation makes code hard to read, reason about, and maintain.  

## Subclass and Override (add a layer of indirection around singleton)
```swift
// Before Subclassing and Overriding

class Act {
  static let shared = Act()
  func doSomething() {}
}

class ExampleVC: UIViewController {
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    Act.shared.doSomething()
  }
}

class ExampleVCTests: XCTestCase {
  func test_viewDidAppear() {
    let sut = ExampleVC() // this contains singleton, violates isolation principle
      sut.loadViewIfNeeded()
      sut.viewDidAppear(false)
   }
}
```

```swift
// Subclassing and Overriding applied

class Act {
  static let shared = Act()
  func doSomething() {}
}

// extract singleton to method for later overriding
class ExampleVC: UIViewController {
  func act() -> Act { Act.shared }
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    Act.shared.doSomething()
  }
}

class TestableOverrideVC: ExampleVC {
  override func act() -> Act {
    Act()
  }
}

class OverrideVCTests: XCTestCase {
  func test_viewDidAppear() {
    let sut = TestableOverrideVC() // singleton is isolated now
    sut.loadViewIfNeeded()
    sut.viewDidAppear(false)
  }
}
```
Note  
Use this technique when do not you own singletons. 

The idea is to create a subclass of production code that lives only in test code, or a test-specific subclass.  
It gives us a way to override methods that are problematic for testing.

Subclass and Override Method can only be applied to a class that permits subclassing:  
- Swift doesn’t allow subclassing of structs.
- The final modifier prevents classes from having subclasses. Remove it to apply this technique.
- Storyboard-based view controllers can’t be subclassed because the storyboard stores an instance of a predetermined type.  
  

## Inject Instances Through Properties
```swift
// Dependency injection(through property) applied

class InstancePropertyVC: UIViewController {
  lazy var act = Act.shared
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    act.doSomething()
  }
}

class InstancePropertyVCTests: XCTestCase {
  func test_viewDidAppear() {
    let sut = InstancePropertyVC()
    sut.act = Act() // singleton is isolated now
    sut.loadViewIfNeeded()
    sut.viewDidAppear(false)
  }
}
```
  
  
## Extract protocol and inject Fake object
```swift
// Extract behaviour into protocol for a dependency(persistence, etc...)

protocol UserDefaultsProtocol {
  func object(forKey defaultName: String) -> Any?
  func set(_ value: Any?, forKey defaultName: String)
  func value(forKey key: String) -> Any?
}
```

```swift
// Define Fake-class implementing the protocol

class FakeUserDefaults: UserDefaultsProtocol {
  var store: [String: Any] = [:]
  
  func object(forKey defaultName: String) -> Any? {
    if let obj = store[defaultName] {
      return obj
    }
    
    return nil
  }
  
  func set(_ value: Any?, forKey defaultName: String) {
    store[defaultName] = value
  }
  
  func value(forKey key: String) -> Any? {
    if let val = store[key] {
      return val
    }
    
    return nil
  }
}
```

```swift
// Declare the dependency as a Protocol-type variable inside main Class

class ExampleViewModel: ObservableObject {
  let userDefaults: UserDefaultsProtocol = UserDefaults.standard
}
```

```swift
// Replace dependency with Fake inside test code

final class ExampleViewModelTests: XCTesst {
  private var sut: ExampleViewModel!
  
  override func setUpWithError() throws {
    try super.setUpWithError()
    sut = ExampleViewModel()
    sut.userDefaults = FakeUserDefaults()
  }
}
```  
  
  
## Wrapper class
Built-in methods like Data().write(url: URL) have persisting side-effect throughout Tests.  
Suppose that Data() is an output of another built-in method, it cannot be replaced with protocol-type object.  
In this situation, using wrapper class, you can add indirection layer and seperate dependencies.  

```swift
// Before removing dependency

struct SomeViewModel: ObservableObject {
  static func getData() -> Data {
    ...
  }
  
  static func write(url: URL) throws {
    let data = getData()
    try data.write(to: url) // this has side effect to test environment, which violates FIRST principle (I for Isolation)
  }
}

// Test code
final class SomeViewModelTests: XCTesst {
  private var sut: SomeViewModel!
  
  override func setUpWithError() throws {
    try super.setUpWithError()
    sut = SomeViewModel()
  }

  ...
  
  func test_write() throws {
    try sut.write(url: URL(fileURLWithPath: "dummy_path")) // this is not testable as having persisting side-effect
  }
}
```

```swift
// Introduce Wrapper class for Data class

protocol DataHandlerProtocol {
  func write(data: Data, url: URL, options: Data.WritingOptions) throws
}

class DataHandler: DataHandlerProtocol {
  func write(data: Data, url: URL, options: Data.WritingOptions) throws {
    try data.write(to: url, options: options)
  }
}
```

```swift
// declare Wrapper class in production code

struct SomeViewModel: ObservableObject {
  static var dataHandler: DataHandlerProtocol = DataHandler()
  
  static func getData() -> Data {
    ...
  }
  
  static func saveFile(url: URL) throws {
    let data = getData()
    try dataHandler.write(data: data, url: fileURL, options: []) // use wrapper object
  }
}
```

```swift
// Create Fake Wrapper class and inject to test code

class FakeDataHandler: DataHandlerProtocol {
  var files: [String: Data] = [:] // use local variable as a storage, instead of persisting store
  
  func write(data: Data, url: URL, options: Data.WritingOptions) throws { 
    files[url.absoluteString] = data
  }	
}

// Test code
final class SomeViewModelTests: XCTesst {

  private var sut: SomeViewModel!
  
  override func setUpWithError() throws {
    try super.setUpWithError()
    sut = SomeViewModel()
    sut.dataHandler = FakeDataHandler() // dependency is removed!
  }
 
  ...
  
  func test_write() throws {
    let data = sut.getData()
    try sut.write(data: data, url: URL(fileURLWithPath: "dummy_path"), options: [])

    XCTAssertEqual(sut.files.first, data)
  }
}
```
