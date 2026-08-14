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


function getNetwork(phone) {

    // If the phone number is 10 figures, add 0 before it
    if (phone.length === 10) {
        phone = "0" + phone;
    }

    // Get first 4 digits
    let prefix = phone.slice(0, 4);


    // MTN
    if (
        prefix === "0803" ||
        prefix === "0806" ||
        prefix === "0810" ||
        prefix === "0703" ||
        prefix === "0706" ||
        prefix === "0903" ||
        prefix === "0906"
    ) {
        return "MTN";
    }


    // AIRTEL
    if (
        prefix === "0802" ||
        prefix === "0808" ||
        prefix === "0812" ||
        prefix === "0708" ||
        prefix === "0701" ||
        prefix === "0901" ||
        prefix === "0904" ||
        prefix === "0912"
    ) {
        return "Airtel";
    }


    // GLO
    if (
        prefix === "0805" ||
        prefix === "0807" ||
        prefix === "0811" ||
        prefix === "0815" ||
        prefix === "0905" ||
        prefix === "0915"
    ) {
        return "Glo";
    }


    // 9mobile
    if (
        prefix === "0809" ||
        prefix === "0817" ||
        prefix === "0818" ||
        prefix === "0908" ||
        prefix === "0909"
    ) {
        return "9mobile";
    }

    return null;
}


let phoneNumbers = [
    "My name is Edosa, my 49815671345 number is 08176604821, 2348012345678 +2348012345678",
    "07035671345 09012345678 09032345678 8134312272 01242345678 is the 45671345 phone number"
];

// Loop through each sentence
for (let j = 0; j < phoneNumbers.length; j++) {

    // Put each sentence into separate words
    let words = phoneNumbers[j].split(" ");

    // Loop through each word
    for (let i = 0; i < words.length; i++) {

        // CONVERT PHONE NUMBER
        let originalPhone = words[i];
        let phone = convertPhoneNumber(originalPhone);

        if (!phone) continue;
        let valid = true;

        // Characters must be digits/numbers only
        for (let k = 0; k < phone.length; k++) {
            if (phone[k] < "0" || phone[k] > "9") {
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


        // RESULT
        if (valid) {

            let network = getNetwork(phone);

        console.log(
                originalPhone +
                " -> " +
                true +
                " -> " +
                network
            );

        } else {

            console.log(
                originalPhone +
                " -> " +
                false
            );
        }
    }
}
