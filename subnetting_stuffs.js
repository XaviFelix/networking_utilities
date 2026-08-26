// test definitions
const subnet_mask_tests = [
    "255.255.255.0",
    "255.255.240.0",
    "255.255.0.255",
    "255.253.0.0",
    "0.0.0.0"
];

//NOTE: helper functions: dotted-decimal string -> 32bit int form
const ip_to_int = str => str.trim().split(".").reduce((acc, octet, i) => acc | (octet << (24 - i * 8)), 0);



//NOTE: IPV4 network checker
function isValidIPv4(str) {
    if (typeof str !== "string") return false;
    var parts = str.trim().split(".");
    if (parts.length !== 4) return false;
    return parts.every(function (p) {
        return /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/.test(p);
    });
}

//NOTE: validation logic for subnet masks

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
    const flattened_mask = ip_to_int(mask);

    if (flattened_mask === 0) return false; // all zeros is invalid

    const inverted = ~flattened_mask;
    return (inverted & (inverted + 1)) === 0;
};


//NOTE: validation logic for ip/gatway ips (checking to see if they are in the range of the subnet mask).

// time complex: O(1)
// ip and gw are usable together when: they share a network under the mask
const in_range = (ip, gw, mask) => {
    const mask_int = ip_to_int(mask);
    const ip_int = ip_to_int(ip);
    const gw_int = ip_to_int(gw);

    const network_int = ip_int & mask_int;
    const broadcast_int = network_int | ~mask_int;
    const is_usable_host = addr_int => addr_int !== network_int && addr_int !== broadcast_int;

    const same_network = network_int === (gw_int & mask_int);

    return same_network && ip_int !== gw_int && is_usable_host(ip_int) && is_usable_host(gw_int);
};


//TODO: run tests here

// console.log(in_range("192.168.10.45", "192.168.10.1", "255.255.255.0"));
// console.log(in_range("192.168.10.45", "192.168.11.1", "255.255.255.0"));
// console.log(in_range("192.168.10.0", "192.168.10.1", "255.255.255.0"));
// console.log(in_range("192.168.10.5", "192.168.10.5", "255.255.255.0"));
// console.log(in_range("192.168.10.255", "192.168.10.5", "255.255.255.0"));
// console.log(in_range("209.214.23.145", "209.214.23.174", "255.255.255.240"));
console.log(in_range("209.214.23.157", "209.214.23.158", "255.255.255.252"));


subnet_mask_tests.forEach(mask => {

    if (!is_valid_mask_v2(mask)) {
        console.log(`${mask}\t\t is not a valid subnet mask!`);
    } else
        console.log(`${mask}\t\t is a valid subnet mask.`);
});
