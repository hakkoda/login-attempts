var fs = require("fs");

// node-geoip found at https://github.com/bluesmoon/node-geoip
var geoip = require("geoip-lite");

require("readline").createInterface({
    input: fs.createReadStream("ips.txt")
}).on("line", (line) => {
    var ip = line.trim();
    var geo = geoip.lookup(ip);
    var city = geo.city === "" ? "unknown" : geo.city;
    var region = geo.region === "" ? "unknown" : geo.region;
    fs.appendFile("detailed.txt", `${geo.country} ${ip}: ${city}, ${region}, ${geo.country}\n`, (err) => {
        if (err) {
            throw err;
        }
    });
}).on("close", function() {
    console.log("finished ips");
});
