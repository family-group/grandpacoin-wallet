const purpose = "m/44'";
// our picked unused number for GrandpaCoin.
// picked from: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinType = "/1313'";
const account = "/0'"
const change = "/0"

const mainPath = purpose + coinType + account + change;

export default {
    mainPath
};