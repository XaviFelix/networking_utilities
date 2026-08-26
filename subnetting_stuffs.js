// test definitions
const subnet_mask = "255.255.255.0";
const subnet_mask_2 = "255.255.240.0";
const subnet_mask_3 = "255.255.0.255";
const subnet_mask_4 = "255.253.0.0";

//TODO: need to check for all octets to be filled in (already set by my server tho)
const subnet_mask_tests = [
    "255.255.255.0",
    "255.255.240.0",
    "255.255.0.255",
    "255.253.0.0",
    "0.0.0.0"
];

// IPV4 format checker
function isValidIPv4(str) {
    if (typeof str !== "string") return false;
    var parts = str.trim().split(".");
    if (parts.length !== 4) return false;
    return parts.every(function (p) {
        return /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/.test(p);
    });
}

// validation logic for subnet masks

// time complex: O(b)
const is_valid_mask = mask => {
    const split_mask = mask.split(".");
    let shift_amnt = 24;

    // flattened mask as a 32bit int
    const flattened_mask = split_mask.reduce((acc, curr_octet) => {
        acc += curr_octet << shift_amnt;
        shift_amnt -= 8;
        return acc;
    }, 0);

    // convert the 32bit int to a binary string
    const convert_to_binary_str = num => (num >>> 0).toString(2).padStart(32, '0');
    const bin_str = convert_to_binary_str(flattened_mask);

    // ensure the 32bit bin str is not all zeros
    const all_zeros = [...bin_str].every(char => char === '0');

    return !bin_str.includes("01") && !all_zeros; // is contiguous and not all zeros
};


// time comlex: O(1)
const is_valid_mask_v2 = mask => {
    const split_mask = mask.split(".");

    const flattened_mask = split_mask.reduce((acc, curr_octet, i) => {
        return acc | (curr_octet << (24 - i * 8));
    }, 0);

    if (flattened_mask === 0) return false; // all zeros is invalid

    const inverted = ~flattened_mask;
    return (inverted & (inverted + 1)) === 0;
};


//TODO: validation logic for ip/gatway ips.
// 1) new IP must be in the network ID when combined with mask
// 2) GW and device cannot use the network ID, host address or broadcast address
// 3) both device IP and gateway IP cannot have the same IP!
const current_ip = "192.168.10.45";
const is_ip_inrange = ip => {
    return true;
};


// run tests here
subnet_mask_tests.forEach(mask => {

    if (!is_valid_mask_v2(mask)) {
        console.log(`${mask}\t\t is not a valid subnet mask!`);
    } else
        console.log(`${mask}\t\t is a valid subnet mask.`);
});
