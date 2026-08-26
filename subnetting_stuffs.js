// test definitions
const subnet_mask = "255.255.255.0";
const subnet_mask_2 = "255.255.240.0";
const subnet_mask_3 = "255.255.0.255";
const subnet_mask_4 = "255.253.0.0";

//TODO: need to check for all octets to be filled in
const subnet_mask_tests = [
    "255.255.255.0",
    "255.255.240.0",
    "255.255.0.255",
    "255.253.0.0",
    "0.0.0.0"
];


// validation logic

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


// run tests here
subnet_mask_tests.forEach(mask => {

    if(!is_valid_mask(mask)) {
        console.log(`${mask}\t\t is not a valid subnet mask!`);
    } else
        console.log(`${mask}\t\t is a valid subnet mask.`);
});
