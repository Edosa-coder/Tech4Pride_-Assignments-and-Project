function convertPhoneNumber(phone) {
    if (phone.startsWith("+234")) {
        phone = "0" + phone.slice(4);
    } else if (phone.startsWith("234")) {
        phone = "0" + phone.slice(3);
    } else if (phone.startsWith("0")) {
        // Do nothing
    } else if (phone.length === 10) {
        // Already 10 digits
    } else {
        return null;
    }

    return phone;
}


let phoneNumbers = [
    "+2348176604821",
    "2348176604821",
    "08176604821",
    "8176604821",
    "07012345678",
    "9012345678",
    "1234567890",
    "08012A45678",
    "081234567890",
    "ABCDEFGHIJJ"
];

for (let j = 0; j < phoneNumbers.length; j++) {

    let phone = phoneNumbers[j];

    // Convert the number first
    phone = convertPhoneNumber(phone);

    if (phone === null) {
        console.log(phoneNumbers[j] + "   Invalid format");
    } else if (phone.length !== 10 && phone.length !== 11) {
        console.log(phoneNumbers[j] + "   Phone number must be 10 or 11 digits.");
    } else {

        let valid = true;

        // Characters must be digits/numbers only
        for (let i = 0; i < phone.length; i++) {
            if (phone[i] < "0" || phone[i] > "9") {
                valid = false;
            }
        }

        // Check the network prefix
        let prefix;

        if (phone.length === 11) {
            prefix = phone.slice(0, 3);
        } else {
            prefix = phone.slice(0, 2);
        }

        if (
            prefix !== "070" &&
            prefix !== "080" &&
            prefix !== "081" &&
            prefix !== "090" &&
            prefix !== "091" &&
            prefix !== "70" &&
            prefix !== "80" &&
            prefix !== "81" &&
            prefix !== "90" &&
            prefix !== "91"
        ) {
            valid = false;
        }

        if (valid) {
            console.log(phoneNumbers[j] + "  Valid Nigerian phone number.");
        } else {
            console.log(phoneNumbers[j] + "  Invalid phone number.");
        }
    }
}