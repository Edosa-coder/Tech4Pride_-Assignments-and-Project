

function convertPhoneNumber(phone) {
    if (phone.startsWith("+234")) {
        phone = "0" + phone.slice(4);
    } else if (phone.startsWith("234")) {
        phone = "0" + phone.slice(3);
    } else if (phone.startsWith("0")) {
        // Do nothing
    } else {
        return null;
    }

    return phone;
}

let phone = "+2348176604821";

// Convert the number first
phone = convertPhoneNumber(phone);

if (phone === null) {
    console.log("Phone number must start with +234, 234 or 0.");
} else if (phone.length !== 11) {
    console.log("Phone number must be 11 digits.");
} else {
    let valid = true;

    // Check that all characters are numbers
    for (let i = 0; i < phone.length; i++) {
        if (phone[i] < "0" || phone[i] > "9") {
            valid = false;
        }
    }

    // Check the network prefix
    let prefix = phone.slice(0, 3);

    if (
        prefix !== "070" &&
        prefix !== "080" &&
        prefix !== "081" &&
        prefix !== "090" &&
        prefix !== "091"
    ) {
        valid = false;
    }

    if (valid) {
        console.log("Valid Nigerian phone number.");
    } else {
        console.log("Invalid phone number.");
    }
}
