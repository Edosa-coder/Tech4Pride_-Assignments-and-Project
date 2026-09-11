**Showman House**

**STEP ONE:** **Entities**
- Event
- Fee Schedule
- Attendee
- Employee
- Payment
- Payment method



 **STEP TWO:** **Attributes**

**Event**

- Event Code — Primary Key

- Event Name

- Event Type Code — Foreign Key

- Location

- Start Date

- End Date

- Event Description

- Number of People

- Staffing Required

**Fee Schedule**

- Fee Schedule ID
- Event ID
- Fee Description
- Fee Amount

**Attendee**

- Attendee ID
- Attendee Name
- Address

**Employee**

- Employee ID
- First Name
- Last Name
- Title 
- Phone

**Payment**

- Payment Amount
- Payment Date
- Payment Method ID

**Payment Method** 

- Payment Method ID
- Payment Method Description


## Step 3: ER Diagram

```mermaid
erDiagram
  EVENT_TYPE ||--o{ EVENT : categorizes
  EMPLOYEE ||--o{ EVENT : manages
  EVENT ||--o{ FEE_SCHEDULE : has
  FEE_SCHEDULE ||--o{ PAYMENT : "paid via"
  ATTENDEE ||--o{ PAYMENT : makes

  EVENT_TYPE {
    string event_type_code PK
    string event_type
  }
  EVENT {
    string event_code PK
    string event_name
    string event_type_code FK
    string employee_id FK
    string location
    date start_date
    date end_date
    string description
    int number_of_people
    int staffing_required
  }
  EMPLOYEE {
    string employee_id PK
    string first_name
    string last_name
    string title
    string phone
  }
  ATTENDEE {
    string attendee_id PK
    string attendee_name
    string address
  }
  FEE_SCHEDULE {
    string fee_schedule_id PK
    string event_code FK
    string fee_description
    decimal fee_amount
  }
  PAYMENT {
    string payment_id PK
    string fee_schedule_id FK
    string attendee_id FK
    decimal payment_amount
    date payment_date
    string payment_method_id
    string payment_method_desc
  }
 ```




