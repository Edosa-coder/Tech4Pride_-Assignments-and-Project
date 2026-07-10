**###ASSIGNMENT - Akpede Samuel Edosa**

This is a detailed explanation of the following terms as requested,
*SOLID*
SOLID is a set of five object-oriented design principles that help developers create software that is easier to understand, maintain, and extend.

1. Single Responsibility Principle (SRP)
A class or module should have only one reason to change. Each class should focus on a single responsibility.

2. Open/Closed Principle (OCP)
Software entities should be open for extension but closed for modification. New functionality should be added without changing existing code.

3. Liskov Substitution Principle (LSP)
Objects of a superclass should be replaceable with objects of its subclasses without breaking the program.

4. Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they do not use. Create smaller, focused interfaces.

5. Dependency Inversion Principle (DIP)
High-level modules should not depend on low-level modules. Both should depend on abstractions.
DRY (Don't Repeat Yourself)
DRY means avoiding duplication of logic, code, and knowledge in a system.

Benefits:
- Easier maintenance
- Fewer bugs
- Better consistency

Example:
Instead of writing the same validation code in multiple places, create a reusable function.

KISS (Keep It Simple, Stupid)
KISS encourages developers to keep solutions as simple as possible.

Benefits:
- Easier debugging
- Improved readability
- Faster development

Example:
Use a straightforward loop when it solves the problem instead of creating a complex architecture.
YAGNI (You Aren't Gonna Need It)
YAGNI advises developers not to build features until they are actually needed.

Benefits:
- Saves development time
- Reduces complexity
- Avoids maintaining unused code

Example:
Do not create support for ten user roles when the application currently needs only two.
Separation of Concerns (SoC)
Separation of Concerns means dividing a system into distinct sections, each responsible for a specific concern.

Examples:
- UI handles presentation.
- Business logic handles rules.
- Database layer handles data storage.

Benefits:
- Better maintainability
- Easier testing
- Improved scalability


Convention over Configuration
Convention over Configuration means software should follow sensible defaults so developers write less configuration code.

Benefits:
- Faster development
- Consistency across projects
- Reduced complexity

Examples:
Frameworks like Django and Ruby on Rails automatically use standard project structures and naming conventions.
Internet Protocol (IP)
Internet Protocol (IP) is a set of rules that governs how data is sent and received over the internet. Every device connected to a network is assigned a unique identifier known as an IP address.
Examples of IP addresses include:
IPv4: 192.168.1.1
IPv4: 8.8.8.8
IPv6: 2001:0db8:85a3::8a2e:0370:7334
IP addresses function similarly to home addresses. Just as a postal service needs an address to deliver a package, the internet needs an IP address to deliver data to the correct device. The functions are addressing, routing and packet delivery.
Transmission Control Protocol (TCP)
TCP is a communication protocol that works alongside IP to ensure reliable data transmission between devices.
While IP focuses on locating devices and routing packets, TCP ensures that the packets:
Arrive successfully
Arrive in the correct order
Are retransmitted if lost

Why TCP is Important
During internet communication, packets may:
Get lost
Arrive late
Arrive out of sequence
TCP manages these issues automatically.
Fetch API
The Fetch API is a modern JavaScript interface used to make HTTP requests from a web browser to a server.
It allows web applications to:
Retrieve data from servers
Send data to servers
Communicate with APIs
Update web pages dynamically without reloading.










