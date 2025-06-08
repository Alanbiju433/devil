const pages = {
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3'),
};

const bgMusic = document.getElementById('bg-music');

function showPage(pageId) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageId].classList.add('active');
}

function playBackgroundMusic() {
    const playOnInteraction = () => {
        bgMusic.play().catch(() => {});
        window.removeEventListener('click', playOnInteraction);
        window.removeEventListener('mousemove', playOnInteraction);
    };
    window.addEventListener('click', playOnInteraction);
    window.addEventListener('mousemove', playOnInteraction);
}

document.getElementById('rsvpYesButton').addEventListener('click', () => {
    pages.page1.classList.add('fade-out');
    bgMusic.play().catch(() => {});
    setTimeout(() => {
        showPage('page2');
        startPresentation();
    }, 1000);
});

const noMessages = [
    "We will miss you!",
    "Hope to see you next time.",
    "Thank you for letting us know.",
];
let noIndex = 0;

document.getElementById('rsvpNoButton').addEventListener('click', () => {
    const responseElem = document.getElementById('response');
    responseElem.textContent = noMessages[noIndex];
    noIndex = (noIndex + 1) % noMessages.length;
});

const presentationSlides = [
    {
        image: 'images/wedding1.jpg',
        title: 'Our Story',
        message: 'How we met and fell in love.'
    },
    {
        image: 'images/wedding2.jpg',
        title: 'The Proposal',
        message: 'A magical moment to remember.'
    },
    {
        image: 'images/wedding3.jpg',
        title: 'The Big Day',
        message: 'Join us to celebrate our wedding.'
    },
    {
        image: 'images/wedding4.jpg',
        title: 'Venue & Date',
        message: 'Details about the ceremony and reception.'
    },
    {
        image: 'images/wedding5.jpg',
        title: 'RSVP',
        message: 'Please confirm your attendance.',
        showYesButton: true
    }
];

let currentSlideIndex = 0;
let nextButtonTimeout;

function startPresentation() {
    currentSlideIndex = 0;
    showSlide(currentSlideIndex);
}

function showSlide(index) {
    const slide = presentationSlides[index];
    const slideImage = document.getElementById('slideImage');
    const slideTitle = document.getElementById('slideTitle');
    const slideMessage = document.getElementById('slideMessage');
    const nextButton = document.getElementById('nextButton');

    slideImage.src = slide.image;
    slideTitle.textContent = slide.title;
    slideMessage.textContent = slide.message;
    nextButton.style.display = 'none';

    clearTimeout(nextButtonTimeout);
    nextButtonTimeout = setTimeout(() => {
        nextButton.style.display = 'inline-block';
        if (slide.showYesButton) {
            nextButton.textContent = 'Confirm RSVP 💖';
        } else {
            nextButton.textContent = 'Next';
        }
    }, 2000);

    nextButton.onclick = () => {
        if (currentSlideIndex < presentationSlides.length - 1) {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
        } else {
            showPage('page3');
            nextButton.style.display = 'none';
        }
    };
}

window.addEventListener('load', () => {
    playBackgroundMusic();

    const chatBox = document.getElementById('chatBox');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // Simple chat functionality without WebSocket
    function addMessage(message, sender) {
        const messageElem = document.createElement('div');
        const senderLabel = document.createElement('span');
        senderLabel.style.fontWeight = 'bold';
        senderLabel.style.marginRight = '8px';
        senderLabel.textContent = sender === 'user' ? 'You:' : 'Guest:';
        messageElem.appendChild(senderLabel);
        const messageText = document.createTextNode(message);
        messageElem.appendChild(messageText);
        messageElem.className = sender === 'user' ? 'user-message' : 'other-message';
        chatMessages.appendChild(messageElem);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

sendButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            // Send message to server
            fetch('http://localhost:3000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Message sent to server:', data);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
