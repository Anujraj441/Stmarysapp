// --- NEW API KEY INJECTED ---
const GEMINI_API_KEY = "AIzaSyCyzUjgGUNkkzV0jIoDNC3aHH-c4GLnVuE"; 
let currentUserRole = null; 
let studentProfile = {}; 

let globalTeachers = []; 
let pendingRequests = []; 
let approvedStudents = []; 

// --- ALL BATCHES ACTIVATED FOR ADMIN ---
const allBatches = [
    { id: 'NUR', name: 'Nursery', desc: 'Tap to open group messaging' },
    { id: 'LKG', name: 'LKG', desc: 'Tap to open group messaging' },
    { id: 'UKG', name: 'UKG', desc: 'Tap to open group messaging' },
    { id: 'C1', name: 'Class 1', desc: 'Tap to open group messaging' },
    { id: 'C2', name: 'Class 2', desc: 'Tap to open group messaging' },
    { id: 'C3', name: 'Class 3', desc: 'Tap to open group messaging' },
    { id: 'C4', name: 'Class 4', desc: 'Tap to open group messaging' },
    { id: 'C5', name: 'Class 5', desc: 'Tap to open group messaging' },
    { id: 'C6', name: 'Class 6', desc: 'Tap to open group messaging' },
    { id: 'C7', name: 'Class 7', desc: 'Tap to open group messaging' },
    { id: 'C8', name: 'Class 8', desc: 'Tap to open group messaging' },
    { id: 'C9', name: 'Class 9', desc: 'Tap to open group messaging' },
    { id: 'C10', name: 'Class 10', desc: 'Tap to open group messaging' }
];

window.onload = () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
        setTimeout(() => splash.remove(), 500); 
        showScreen('login-screen');
    }, 2500);
};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(event && event.currentTarget && event.currentTarget.classList.contains('nav-item')) {
        event.currentTarget.classList.add('active');
    }
}

function processLogin() {
    const email = document.getElementById('email-input').value.trim();
    if (!email) { alert('Boss, please enter an email to proceed.'); return; }

    const teacher = globalTeachers.find(t => t.email === email);
    if (teacher) {
        studentProfile = teacher;
        finalizeLogin('teacher');
        return;
    }

    const approved = approvedStudents.find(s => s.email === email);
    if (approved) {
        studentProfile = approved;
        finalizeLogin('student');
        return;
    }

    const pending = pendingRequests.find(s => s.email === email);
    if (pending) {
        document.getElementById('pending-class-display').textContent = pending.className;
        showScreen('pending-screen');
        return;
    }

    studentProfile = { email: email }; 
    showScreen('profile-screen');
}

function goToAdminRegistration() {
    showScreen('admin-register-screen');
}

function submitStudentProfile() {
    const name = document.getElementById('prof-name').value;
    const cls = document.getElementById('prof-class').value;
    if(!name || !cls) { alert("Sir, please enter at least Name and Class."); return; }

    const newStudent = {
        email: studentProfile.email,
        name: name,
        className: cls,
        roll: document.getElementById('prof-roll').value || 'N/A',
        father: document.getElementById('prof-father').value || 'N/A',
        mother: document.getElementById('prof-mother').value || 'N/A',
        dp: `https://ui-avatars.com/api/?name=${name}&background=27428f&color=fff&size=100`
    };

    pendingRequests.push(newStudent); 
    document.getElementById('pending-class-display').textContent = cls;
    showScreen('pending-screen');
}

function verifyAndLoginAdmin() {
    const enteredCode = document.getElementById('admin-code').value;
    const adminName = document.getElementById('admin-name').value;
    if (enteredCode !== '8472915603847291') { alert("Access Denied: Incorrect Admin Code."); return; }
    if (!adminName) { alert("Please provide Admin Name."); return; }

    studentProfile = {
        name: adminName,
        className: 'All Batches', 
        roll: 'ADMIN',
        father: document.getElementById('admin-father').value || 'N/A',
        dob: document.getElementById('admin-dob').value || 'N/A',
        dp: `https://ui-avatars.com/api/?name=${adminName}&background=d92a3b&color=fff&size=100` 
    };
    finalizeLogin('principal');
}

function finalizeLogin(role) {
    currentUserRole = role;
    const badge = document.getElementById('role-badge');
    badge.textContent = role.toUpperCase();
    
    document.getElementById('main-header').classList.remove('hidden');
    document.getElementById('bottom-nav').classList.remove('hidden');
    
    document.querySelector('.nav-batches').classList.remove('hidden');
    document.querySelector('.nav-profile').classList.remove('hidden');
    document.querySelector('.nav-jarvis').classList.remove('hidden');

    if (role === 'principal') {
        document.querySelector('.nav-staff').classList.remove('hidden');
        document.querySelector('.nav-requests').classList.remove('hidden');
    } else if (role === 'teacher') {
        document.querySelector('.nav-staff').classList.add('hidden'); 
        document.querySelector('.nav-requests').classList.remove('hidden'); 
    } else {
        document.querySelector('.nav-staff').classList.add('hidden');
        document.querySelector('.nav-requests').classList.add('hidden');
    }

    renderBatches();
    showScreen('dashboard-screen');
}

function signOut() {
    currentUserRole = null;
    studentProfile = {};
    document.getElementById('main-header').classList.add('hidden');
    document.getElementById('bottom-nav').classList.add('hidden');
    document.getElementById('email-input').value = '';
    showScreen('login-screen');
}

function registerTeacher() {
    const name = document.getElementById('staff-name').value;
    const email = document.getElementById('staff-email').value;
    const cls = document.getElementById('staff-class').value;
    const dob = document.getElementById('staff-dob').value;

    if(!name || !email) { alert("Name and Email are mandatory for Staff!"); return; }

    globalTeachers.push({
        email: email, name: name, className: cls, dob: dob,
        dp: `https://ui-avatars.com/api/?name=${name}&background=28a745&color=fff&size=100`
    });

    alert(`${name} has been assigned to ${cls}. They can now login.`);
    document.getElementById('staff-name').value = '';
    document.getElementById('staff-email').value = '';
}

function loadRequests() {
    const container = document.getElementById('requests-list-container');
    container.innerHTML = '';

    let visibleRequests = pendingRequests;
    if (currentUserRole === 'teacher') {
        visibleRequests = pendingRequests.filter(req => req.className === studentProfile.className);
    }

    if (visibleRequests.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding: 20px;">No pending requests.</p>`;
        return;
    }

    visibleRequests.forEach((req) => {
        const card = document.createElement('div');
        card.className = 'request-card';
        card.innerHTML = `
            <div class="request-info">
                <strong>${req.name}</strong> (Roll: ${req.roll})<br>
                <span style="color:#666; font-size:0.8rem;">Class: ${req.className} | Email: ${req.email}</span>
            </div>
            <div class="request-actions">
                <button class="success-btn" onclick="approveStudent('${req.email}')"><i class="fa-solid fa-check"></i> Approve</button>
                <button class="danger-btn" onclick="denyStudent('${req.email}')"><i class="fa-solid fa-xmark"></i> Decline</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function approveStudent(email) {
    const studentIndex = pendingRequests.findIndex(s => s.email === email);
    if (studentIndex > -1) {
        approvedStudents.push(pendingRequests[studentIndex]);
        pendingRequests.splice(studentIndex, 1);
        loadRequests(); 
        alert("Student Approved successfully!");
    }
}

function denyStudent(email) {
    const studentIndex = pendingRequests.findIndex(s => s.email === email);
    if (studentIndex > -1) {
        pendingRequests.splice(studentIndex, 1);
        loadRequests();
        alert("Student Request Declined.");
    }
}

function loadMyProfile() {
    document.getElementById('user-dp-preview').src = studentProfile.dp;
    document.getElementById('display-user-name').textContent = studentProfile.name;
    document.getElementById('display-user-role').textContent = currentUserRole.toUpperCase();
    
    const detailsContainer = document.getElementById('user-details-container');
    let detailsHTML = '';
    if(currentUserRole === 'student') {
        detailsHTML += `<div class="user-detail-row"><span class="user-detail-label">Class</span><span class="user-detail-val">${studentProfile.className}</span></div>`;
        detailsHTML += `<div class="user-detail-row"><span class="user-detail-label">Roll No.</span><span class="user-detail-val">${studentProfile.roll}</span></div>`;
        detailsHTML += `<div class="user-detail-row"><span class="user-detail-label">Father</span><span class="user-detail-val">${studentProfile.father}</span></div>`;
    } else if(currentUserRole === 'teacher') {
        detailsHTML += `<div class="user-detail-row"><span class="user-detail-label">Assigned Class</span><span class="user-detail-val">${studentProfile.className}</span></div>`;
        detailsHTML += `<div class="user-detail-row"><span class="user-detail-label">Email</span><span class="user-detail-val">${studentProfile.email}</span></div>`;
    } else {
        detailsHTML += `<div class="user-detail-row"><span class="user-detail-label">Father</span><span class="user-detail-val">${studentProfile.father}</span></div>`;
    }
    detailsContainer.innerHTML = detailsHTML;
}

function updateDP(event) {
    if (event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = e => { studentProfile.dp = e.target.result; document.getElementById('user-dp-preview').src = studentProfile.dp; };
        reader.readAsDataURL(event.target.files[0]);
    }
}

function renderBatches() {
    const container = document.getElementById('batch-list-container');
    container.innerHTML = ''; 
    let batchesToDisplay = allBatches;
    
    if (currentUserRole !== 'principal') {
        batchesToDisplay = allBatches.filter(b => b.name === studentProfile.className);
    }

    batchesToDisplay.forEach(batch => {
        const card = document.createElement('div');
        card.className = 'batch-card';
        card.onclick = () => openChat(batch.name);
        card.innerHTML = `
            <div class="batch-icon">${batch.id}</div>
            <div class="batch-info"><h4>${batch.name}</h4><p style="font-size: 0.75rem; color: #888;">${batch.desc}</p></div>
            <i class="fa-solid fa-chevron-right" style="margin-left:auto; color:#ccc;"></i>
        `;
        container.appendChild(card);
    });
}

function openChat(batchName) {
    document.getElementById('chat-room-name').textContent = batchName;
    const chatInput = document.getElementById('chat-input-area');
    
    if (currentUserRole === 'student') chatInput.classList.add('hidden'); 
    else chatInput.classList.remove('hidden');
    
    showScreen('chat-screen');
}

function sendMessage() {
    const input = document.getElementById('message-input');
    if (!input.value.trim()) return;
    const container = document.getElementById('chat-messages-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message sent';
    msgDiv.textContent = input.value.trim();
    container.appendChild(msgDiv);
    input.value = ''; 
    container.scrollTop = container.scrollHeight;
}

function handleJarvisEnter(event) { if (event.key === "Enter") askJarvis(); }

async function askJarvis() {
    const inputField = document.getElementById('jarvis-input');
    const userText = inputField.value.trim();
    if (!userText) return;

    const container = document.getElementById('jarvis-messages-container');
    const userMsg = document.createElement('div');
    userMsg.className = 'message sent';
    userMsg.textContent = userText;
    container.appendChild(userMsg);
    inputField.value = '';
    container.scrollTop = container.scrollHeight;

    const thinkingId = 'think-' + Date.now();
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message received flex-message';
    thinkingMsg.id = thinkingId;
    thinkingMsg.innerHTML = `<div class="bot-avatar"><i class="fa-solid fa-robot"></i></div><div class="text thinking-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    container.appendChild(thinkingMsg);
    container.scrollTop = container.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: userText }] }] })
        });
        const data = await response.json();
        const jarvisReply = data.candidates[0].content.parts[0].text;
        document.getElementById(thinkingId).remove();
        
        const botMsg = document.createElement('div');
        botMsg.className = 'message received flex-message';
        botMsg.innerHTML = `<div class="bot-avatar"><i class="fa-solid fa-robot"></i></div><div class="text"></div>`;
        botMsg.querySelector('.text').innerText = jarvisReply; 
        container.appendChild(botMsg);
    } catch (error) {
        document.getElementById(thinkingId).remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message received flex-message';
        errorMsg.innerHTML = `<div class="bot-avatar" style="background: var(--red-alert);"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="text">Sir, API connection error. Please check the network.</div>`;
        container.appendChild(errorMsg);
    }
    container.scrollTop = container.scrollHeight;
}
  
