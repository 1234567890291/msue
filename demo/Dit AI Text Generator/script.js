const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = prompt("Enter The Open Ai API Key"); 
//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
//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
//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
//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
//new item

const disabledKeys = ["u", "I"];

const showAlert = e => {
    e.preventDefault();
    return alert("Sorry, you can't view or copy source codes this way!");
}

document.addEventListener("contextmenu", e => {
    showAlert(e);
});

document.addEventListener("keydown", e => {
    if (e.ctrlKey && disabledKeys.includes(e.key) || e.key === "F12") {
        showAlert(e);
    }
});


const removePrevBtnStyles = () => {
    const styleTags = document.querySelectorAll("style");
    styleTags.forEach(styleTag => {
        if(styleTag.textContent.indexOf(".download-btn-cn")) styleTag.remove();
    });
}

const createDownloadBtn = () => {
    const downloadBtnExist = document.querySelector(".download-btn-cn");
    if(downloadBtnExist) return;

    const downloadBtn = document.createElement("div");
    downloadBtn.classList.add("download-btn-cn");

    let downloadPostLink = location.href.replace(/\/demos\//, '/');
    downloadPostLink = downloadPostLink.replace(/^\//, '');

    downloadBtn.innerHTML = `<a href="${downloadPostLink}" target="_blank">Download Code Files</a>`;
    document.body.prepend(downloadBtn);
}

const showStickyAd = () => {
    const stickyBtmAd = document.querySelector(".sticky-bottom-ad");
    const closeBtn = stickyBtmAd.querySelector(".close-btn");
    const googleAd = stickyBtmAd.querySelector(".adsbygoogle");
    const isAdLoaded = googleAd?.getAttribute("data-ad-status");
    const isStickyHidden = stickyBtmAd.classList.contains("hide");
    if(window.innerWidth < 700 || isStickyHidden || !isAdLoaded || isAdLoaded === "unfilled") return;

    stickyBtmAd.classList.add("show");

    const hideStickyAd = () => {
        stickyBtmAd.classList.remove("show");
    }

    closeBtn.addEventListener("click", hideStickyAd);
}

const insertStickyAd = () => {
    const stickyBtmAd = document.createElement("div");
    stickyBtmAd.classList.add("sticky-bottom-ad");
    stickyBtmAd.innerHTML = `<div class="ad-body">
                                <div class="close-btn">
                                    <svg viewBox="0 0 48 48" fill="#333"><path d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"></path><path d="M0 0h48v48H0z" fill="none"></path></svg>
                                </div>
                                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2279718596603414"
                                    crossorigin="anonymous"></script>
                                <!-- Demo Sticky Ad -->
                                <ins class="adsbygoogle"
                                    style="display:inline-block;width:728px;height:90px"
                                    data-ad-client="ca-pub-2279718596603414"
                                    data-ad-slot="6378274075">
                                </ins>
                                <script>
                                  (adsbygoogle = window.adsbygoogle || []).push({});
                                </script>
                            </div>`;
    document.body.appendChild(stickyBtmAd);
    (adsbygoogle = window.adsbygoogle || []).push({});
    setTimeout(() => showStickyAd(), 3000);
}
const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
    <img src="images/chatbot.jpg" alt="chatbot-img" width="70px" height="70px"><h1>Dit AI </h1>
                            <p>Start a conversation and explore the power of Dit AI.<br> Your chat history will be displayed here.</p>
                            <p>Founder:<b>Sudais Usmani</b></p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);