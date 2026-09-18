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


## Step 4: MAP E/R Diagrams to Tables
## EVENT TYPE

| Attribute         | Key    |
| ----------------- | ------ |
| `Event_Type_Code` | **PK** |
| `Event_Type`      |        |

## Table:

EVENT_TYPE(
    Event_Type_Code PK,
    Event_Type
)

## EVENT

| Attribute           | Key    |
| ------------------- | ------ |
| `Event_Code`        | **PK** |
| `Event_Name`        |        |
| `Event_Type_Code`   | **FK** |
| `Location`          |        |
| `Start_Date`        |        |
| `End_Date`          |        |
| `Event_Description` |        |
| `Number_of_People`  |        |
| `Staffing_Required` |        |
| `Employee_ID`       | **FK** |

## Table:

EVENT(
- Event_Code PK,
- Event_Name,
- Event_Type_Code FK,
-  Location,
- Start_Date,
-   End_Date,
-  Event_Description,
-   Number_of_People,
-   Staffing_Required,
-   Employee_ID FK
)

## Step 5: Normalize the tables to 3NF

EVENT_TYPE
- Event_Type_Code PK
-  Event_Type


EVENT
- Event_Code PK
-   Event_Name
-  Event_Type_Code FK
- Location
- Start_Date
- End_Date
- Event_Description
- Number_of_People
- Staffing_Required
- Employee_ID FK


EMPLOYEE

- Employee_ID PK
- First_Name
- Last_Name
- Title
- Phone


ATTENDEE

- Attendee_ID PK
- Attendee_Name
- Address


FEE_SCHEDULE

- Fee_Schedule_ID PK
- Event_ID FK
- Fee_Description
- Fee_Amount


PAYMENT

- Payment_ID PK
- Event_Code FK
- Payment_Amount
- Payment_Date
- Payment_Method_ID FK


PAYMENT_METHOD

- Payment_Method_ID PK
- Payment_Method_Description

## Step 6: Primary and Foreign Keys

| Table              | Primary Key (PK)    | Foreign Key (FK)                  |
| ------------------ | ------------------- | --------------------------------- |
| **EVENT_TYPE**     | `Event_Type_Code`   | —                                 |
| **EVENT**          | `Event_Code`        | `Event_Type_Code`, `Employee_ID`  |
| **EMPLOYEE**       | `Employee_ID`       | —                                 |
| **ATTENDEE**       | `Attendee_ID`       | —                                 |
| **FEE_SCHEDULE**   | `Fee_Schedule_ID`   | `Event_ID`                        |
| **PAYMENT**        | `Payment_ID`        | `Event_Code`, `Payment_Method_ID` |
| **PAYMENT_METHOD** | `Payment_Method_ID` | —                                 |

## Step 7: Relationship Between Tables

EVENT_TYPE
    │
    │ 1 : M
    ▼
  EVENT
    │
    ├──────── M : 1 ──────── EMPLOYEE
    │
    ├──────── 1 : M ──────── FEE_SCHEDULE
    │
    └──────── 1 : M ──────── PAYMENT
                                  │
                                  │ M : 1
                                  ▼
                           PAYMENT_METHOD



# SHOP HERE 

**STEP ONE:** **Entities**

The main entities are:

- Category
- Item
- Supplier
- Employee
- Purchase Order
- Shipment Method
- Purchase Order Item

---

**STEP TWO:** **Attributes**

### CATEGORY

* Category_Number (PK)
* Category_Name

### ITEM

* Item_Number (PK)
* Item_Description
* Item_Category_Number (FK)
* Serial_Number
* Unit_Price
* Reorder_Level

### SUPPLIER

* Supplier_Code (PK)
* Supplier_Name
* Address
* Phone_Number
* Country_of_Origin
* Shipment_Mode_Number (FK)
* Shipment_Mode

### EMPLOYEE

* Employee_ID (PK)

### PURCHASE_ORDER

* Purchase_Order_ID (PK)
* Supplier_ID (FK)
* Employee_ID (FK)
* Order_Date
* Shipment_Date
* Quantity
* Shipment_Method_ID (FK)
* Freight_Charge

### SHIPMENT_METHOD

* Shipment_Method_ID (PK)
* Shipment_Method

### PURCHASE_ORDER_ITEM

* Purchase_Order_ID (PK, FK)
* Item_Number (PK, FK)
* Quantity

---

# 3. ER Diagram

```mermaid
erDiagram

    CATEGORY ||--o{ ITEM : "contains"

    SUPPLIER ||--o{ PURCHASE_ORDER : "receives"

    EMPLOYEE ||--o{ PURCHASE_ORDER : "creates"

    SHIPMENT_METHOD ||--o{ PURCHASE_ORDER : "uses"

    PURCHASE_ORDER ||--o{ PURCHASE_ORDER_ITEM : "contains"

    ITEM ||--o{ PURCHASE_ORDER_ITEM : "appears_in"

    CATEGORY {
        int Category_Number PK
        string Category_Name
    }

    ITEM {
        int Item_Number PK
        string Item_Description
        int Item_Category_Number FK
        string Serial_Number
        decimal Unit_Price
        int Reorder_Level
    }

    SUPPLIER {
        int Supplier_Code PK
        string Supplier_Name
        string Address
        string Phone_Number
        string Country_of_Origin
        int Shipment_Mode_Number FK
        string Shipment_Mode
    }

    EMPLOYEE {
        int Employee_ID PK
    }

    PURCHASE_ORDER {
        int Purchase_Order_ID PK
        int Supplier_ID FK
        int Employee_ID FK
        date Order_Date
        date Shipment_Date
        int Quantity
        int Shipment_Method_ID FK
        decimal Freight_Charge
    }

    SHIPMENT_METHOD {
        int Shipment_Method_ID PK
        string Shipment_Method
    }

    PURCHASE_ORDER_ITEM {
        int Purchase_Order_ID PK
        int Item_Number PK
        int Quantity
    }
```

---

# 4. Map the ER Diagram to Tables
CATEGORY

## CATEGORY

| Attribute         | Key    |
| ----------------- | ------ |
| `Category_Number` | **PK** |
| `Category_Name`   |        |

## ITEM

| Attribute              | Key    |
| ---------------------- | ------ |
| `Item_Number`          | **PK** |
| `Item_Description`     |        |
| `Item_Category_Number` | **FK** |
| `Serial_Number`        |        |
| `Unit_Price`           |        |
| `Reorder_Level`        |        |

## SUPPLIER

| Attribute              | Key    |
| ---------------------- | ------ |
| `Supplier_Code`        | **PK** |
| `Supplier_Name`        |        |
| `Address`              |        |
| `Phone_Number`         |        |
| `Country_of_Origin`    |        |
| `Shipment_Mode_Number` | **FK** |
| `Shipment_Mode`        |        |

## EMPLOYEE

| Attribute     | Key    |
| ------------- | ------ |
| `Employee_ID` | **PK** |

## PURCHASE_ORDER

| Attribute            | Key    |
| -------------------- | ------ |
| `Purchase_Order_ID`  | **PK** |
| `Supplier_ID`        | **FK** |
| `Employee_ID`        | **FK** |
| `Order_Date`         |        |
| `Shipment_Date`      |        |
| `Quantity`           |        |
| `Shipment_Method_ID` | **FK** |
| `Freight_Charge`     |        |

## SHIPMENT_METHOD

| Attribute            | Key    |
| -------------------- | ------ |
| `Shipment_Method_ID` | **PK** |
| `Shipment_Method`    |        |

## PURCHASE_ORDER_ITEM

| Attribute           | Key        |
| ------------------- | ---------- |
| `Purchase_Order_ID` | **PK, FK** |
| `Item_Number`       | **PK, FK** |
| `Quantity`          |            |

---

# STEP 5. Normalize the Tables to 3NF

Final 3NF Tables
CATEGORY

-------------------------
- Category_Number (PK)
- Category_Name


ITEM
-------------------------
- Item_Number (PK)
- Item_Description
- Item_Category_Number (FK)
- Serial_Number
- Unit_Price
- Reorder_Level


SUPPLIER
-------------------------
- Supplier_Code (PK)
- Supplier_Name
- Address
- Phone_Number
- Country_of_Origin
- Shipment_Mode_Number (FK)


SHIPMENT_MODE
-------------------------
- Shipment_Mode_Number (PK)
- Shipment_Mode


EMPLOYEE
-------------------------
- Employee_ID (PK)


PURCHASE_ORDER
-------------------------
- Purchase_Order_ID (PK)
- Supplier_ID (FK)
- Employee_ID (FK)
- Order_Date
- Shipment_Date
- Quantity
- Shipment_Method_ID (FK)
- Freight_Charge


SHIPMENT_METHOD
-------------------------
- Shipment_Method_ID (PK)
- Shipment_Method


PURCHASE_ORDER_ITEM
-------------------------
- Purchase_Order_ID (PK, FK)
- Item_Number (PK, FK)
- Quantity

## STEP 6. Primary Keys and Foreign Keys



| Table              | Primary Key (PK)    | Foreign Key (FK)                  |
| ------------------ | ------------------- | --------------------------------- |
| **EVENT_TYPE**     | `Event_Type_Code`   | —                                 |
| **EVENT**          | `Event_Code`        | `Event_Type_Code`, `Employee_ID`  |
| **EMPLOYEE**       | `Employee_ID`       | —                                 |
| **ATTENDEE**       | `Attendee_ID`       | —                                 |
| **FEE_SCHEDULE**   | `Fee_Schedule_ID`   | `Event_ID`                        |
| **PAYMENT**        | `Payment_ID`        | `Event_Code`, `Payment_Method_ID` |
| **PAYMENT_METHOD** | `Payment_Method_ID` | —                                 |

``
## STEP 7. Relationships between Tables
 