# Introduction

I setup my system at home to allow remote connections so that I could log into
my machine while I was at work.  After a few weeks I examines my logged to see
who was attempting to log into my system and the following is an overview of my
findings.

# The Analysis

There were multiple attempts to access my machine remotely from 95 different IP
addresses.  The _detailed.txt_ file lists all the IP addresses that attempted to
access my machine.  I have included extra information on where the IP address is
from.  I was surprised and saddened to see that over half the IP addresses came
from China.  

I included an additional file named _users.txt_ which includes a list of user
names that were used in the login attempt.  My original logs showed the majority
of attempts were for the most obvious, _root_.  There were some other names that
were used that seemed pretty creative though such as:

- Test
- demo
- jenkins
- git
- music
- media
- qa
- svn

I thought these names were creative because I could see someone creating user
accounts for any of these names.  It might be worth it to browse that file and
see what other names were attempted.

# Getting the Info

The SSH login data is found at /var/log/auth.log.  You'll see entries such as
the following in there:


    Feb  5 07:36:05 Computer sshd[18855]: Failed password for root from 223.99.60.49 port 58235 ssh2
    Feb  5 07:36:06 Computer sshd[18857]: Failed password for root from 58.218.199.133 port 47921 ssh2
    Feb  5 07:36:06 Computer sshd[18853]: Failed password for root from 218.65.30.238 port 37514 ssh2
    Feb  5 07:36:06 Computer sshd[18853]: error: maximum authentication attempts exceeded for root from 218.65.30.238 port 37514 ssh2 [preauth]
    Feb  5 07:36:06 Computer sshd[18853]: Disconnecting: Too many authentication failures [preauth]
    
I massaged the entries in order to extract the IP addresses and the user names
that were used in the login attempts.  I created two files.  One with the IP
address and another with user names.  I then create a Node.js script to analyze
the IP addresses in order to see the point of origin.  I installed the
_node-geoip_ module to help in the IP address analysis.  There was no particular
reason to select this module other than it was the first one I found in a google
search.  This module worked perfectly for me and was simple to use.  The
following script is all that I ran in order to analyze the IP addresses:

```javascript
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
}
```

Once the detailed analysis was placed in the _detailed.txt_ file, I did a little
extra massaging to get the entries ordered by country.
