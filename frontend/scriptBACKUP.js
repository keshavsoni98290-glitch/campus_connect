/* =========================================================
   CAMPUS CONNECT - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

let currentPage = "home";

function showPage(pageName) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    // Show selected page
    const selectedPage = document.getElementById(pageName + "-page");

    if (selectedPage) {
        selectedPage.classList.add("active-page");
        currentPage = pageName;
    }

    // Back button
    const backButton = document.getElementById("backButton");

    if (backButton) {
        if (pageName === "home") {
            backButton.style.visibility = "hidden";
        } else {
            backButton.style.visibility = "visible";
        }
    }

    // Close team panels when changing page
    if (pageName !== "discover") {
        closeTeamPanels();
    }
}


/* =========================================================
   BACK BUTTON
   ========================================================= */

function goBack() {

    if (currentPage === "home") {
        return;
    }

    showPage("home");
}


/* =========================================================
   NAVBAR BUTTONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Navbar navigation
    document.querySelectorAll(".nav-links button").forEach(button => {

        button.addEventListener("click", function () {

            const page = this.getAttribute("data-page");

            if (page) {
                showPage(page);
            }

        });

    });

    // Start with home page
    showPage("home");


    /* =====================================================
       STUDENT SEARCH
       ===================================================== */

    const studentSearch = document.getElementById("studentSearch");

    if (studentSearch) {

        studentSearch.addEventListener("input", function () {

            filterStudents();

        });

    }


    /* =====================================================
       STUDENT FILTER
       ===================================================== */

    const studentFilter = document.getElementById("studentFilter");

    if (studentFilter) {

        studentFilter.addEventListener("change", function () {

            filterStudents();

        });

    }


    /* =====================================================
       COMMUNITY SEARCH
       ===================================================== */

    const communitySearch = document.getElementById("communitySearch");

    if (communitySearch) {

        communitySearch.addEventListener("input", function () {

            renderCommunities();

        });

    }


    /* =====================================================
       COMMUNITY CATEGORY BUTTONS
       ===================================================== */

    document.querySelectorAll(".category").forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".category").forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            renderCommunities();

        });

    });


    /* =====================================================
       CREATE COMMUNITY BUTTONS
       ===================================================== */

    const createCommunityBtn =
        document.getElementById("createCommunityBtn");

    const createCommunityBottom =
        document.getElementById("createCommunityBottom");

    if (createCommunityBtn) {
        createCommunityBtn.addEventListener(
            "click",
            createCommunity
        );
    }

    if (createCommunityBottom) {
        createCommunityBottom.addEventListener(
            "click",
            createCommunity
        );
    }


    /* =====================================================
       INITIAL DATA
       ===================================================== */

    renderCommunities();

});


/* =========================================================
   TEAM PANEL FUNCTIONS
   ========================================================= */

function closeTeamPanels() {

    const joinPanel = document.getElementById("joinTeamPanel");
    const createPanel = document.getElementById("createTeamPanel");

    if (joinPanel) {
        joinPanel.classList.remove("active");
        joinPanel.style.display = "none";
    }

    if (createPanel) {
        createPanel.classList.remove("active");
        createPanel.style.display = "none";
    }
}


function openJoinTeam() {

    const joinPanel = document.getElementById("joinTeamPanel");
    const createPanel = document.getElementById("createTeamPanel");

    if (!joinPanel) return;

    if (createPanel) {
        createPanel.style.display = "none";
        createPanel.classList.remove("active");
    }

    joinPanel.style.display = "block";

    setTimeout(() => {
        joinPanel.classList.add("active");
    }, 10);

    joinPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function openCreateTeam() {

    const joinPanel = document.getElementById("joinTeamPanel");
    const createPanel = document.getElementById("createTeamPanel");

    if (!createPanel) return;

    if (joinPanel) {
        joinPanel.style.display = "none";
        joinPanel.classList.remove("active");
    }

    createPanel.style.display = "block";

    setTimeout(() => {
        createPanel.classList.add("active");
    }, 10);

    createPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   JOIN TEAM
   ========================================================= */

function requestToJoinTeam(teamName) {

    const confirmed = confirm(
        "Send request to join " + teamName + "?"
    );

    if (!confirmed) {
        return;
    }

    // Find clicked button
    const buttons = document.querySelectorAll(".team-join-btn");

    buttons.forEach(button => {

        if (
            button.getAttribute("onclick") &&
            button.getAttribute("onclick").includes(teamName)
        ) {

            button.textContent = "Request Sent";
            button.disabled = true;
            button.classList.add("request-sent");

        }

    });

    alert(
        "Your request to join " +
        teamName +
        " has been sent successfully!"
    );
}


/* =========================================================
   CREATE TEAM
   ========================================================= */

function createTeam() {

    const nameInput =
        document.getElementById("newTeamName");

    const skillInput =
        document.getElementById("newTeamSkill");

    const descriptionInput =
        document.getElementById("newTeamDescription");

    if (!nameInput || !skillInput || !descriptionInput) {
        return;
    }

    const teamName = nameInput.value.trim();
    const skills = skillInput.value.trim();
    const description = descriptionInput.value.trim();

    // Validation
    if (teamName === "") {

        alert("Please enter a team name.");
        nameInput.focus();
        return;

    }

    if (skills === "") {

        alert("Please enter the skills required.");
        skillInput.focus();
        return;

    }

    if (description === "") {

        alert("Please describe what your team is building.");
        descriptionInput.focus();
        return;

    }


    // Create initials
    const initials = teamName
        .split(" ")
        .filter(word => word.length > 0)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");


    // Create new team card
    const teamList =
        document.getElementById("teamList");

    if (teamList) {

        const newTeam = document.createElement("div");

        newTeam.className = "team-card";

        newTeam.setAttribute(
            "data-team-search",
            (
                teamName +
                " " +
                skills +
                " " +
                description
            ).toLowerCase()
        );

        newTeam.innerHTML = `

            <div class="team-card-main">

                <div class="team-avatar">
                    ${initials || "TM"}
                </div>

                <div>

                    <h3>${escapeHTML(teamName)}</h3>

                    <p>Created by You</p>

                    <div class="student-tags">

                        <span>${escapeHTML(skills)}</span>

                        <span>1/5 Members</span>

                    </div>

                </div>

            </div>

            <button
                class="connect-btn team-join-btn"
                disabled>
                Your Team
            </button>

        `;

        teamList.prepend(newTeam);
    }


    // Clear form
    nameInput.value = "";
    skillInput.value = "";
    descriptionInput.value = "";


    alert(
        "Team '" +
        teamName +
        "' has been created successfully!"
    );


    // Open join panel so user can see team
    openJoinTeam();
}


/* =========================================================
   TEAM SEARCH
   ========================================================= */

function filterTeams() {

    const searchInput =
        document.getElementById("teamSearch");

    const searchText =
        searchInput ?
        searchInput.value.toLowerCase().trim() :
        "";

    const teams =
        document.querySelectorAll(".team-card");

    teams.forEach(team => {

        const searchableText =
            team.getAttribute("data-team-search") ||
            team.textContent;

        if (
            searchableText
                .toLowerCase()
                .includes(searchText)
        ) {

            team.style.display = "";

        } else {

            team.style.display = "none";

        }

    });
}


/* =========================================================
   TEAM REQUESTS
   ========================================================= */

function handleTeamRequest(button, status) {

    if (!button) return;

    const requestCard =
        button.closest(".request-card");

    if (!requestCard) return;

    const studentNameElement =
        requestCard.querySelector(".request-info h3");

    const studentName =
        studentNameElement ?
        studentNameElement.textContent :
        "Student";


    if (status === "approved") {

        requestCard.innerHTML = `

            <div class="team-avatar">✓</div>

            <div class="request-info">

                <h3>${escapeHTML(studentName)}</h3>

                <p>
                    Request approved successfully.
                </p>

            </div>

            <div class="request-status approved">
                Approved
            </div>

        `;

    }


    if (status === "rejected") {

        requestCard.innerHTML = `

            <div class="team-avatar">×</div>

            <div class="request-info">

                <h3>${escapeHTML(studentName)}</h3>

                <p>
                    Request has been rejected.
                </p>

            </div>

            <div class="request-status rejected">
                Rejected
            </div>

        `;

    }

}


/* =========================================================
   DISCOVER STUDENTS - BACKEND / MYSQL
   ========================================================= */

let discoverStudents = [];


/* =========================================================
   GET AUTH TOKEN
   ========================================================= */

function getAuthToken() {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("campusConnectToken") ||
        localStorage.getItem("jwtToken") ||
        null
    );
}


/* =========================================================
   STUDENT INITIALS
   ========================================================= */

function getStudentInitials(name) {

    if (!name) return "CC";

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}


/* =========================================================
   LOAD STUDENTS FROM BACKEND
   ========================================================= */

async function loadDiscoverStudents() {

    const studentGrid =
        document.querySelector(".student-grid");

    if (!studentGrid) return;

    const token = getAuthToken();

    if (!token) {

        studentGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
                color:#64748b;
            ">
                Please login to discover students.
            </div>
        `;

        return;
    }


    /* LOADING */

    studentGrid.innerHTML = `
        <div style="
            grid-column:1/-1;
            text-align:center;
            padding:40px;
            color:#64748b;
        ">
            Loading students...
        </div>
    `;


    try {

        const response = await fetch(
            "http://localhost:5000/api/users",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to fetch students"
            );
        }


        discoverStudents =
            Array.isArray(data.users)
                ? data.users
                : [];


        renderDiscoverStudents();


    } catch (error) {

        console.error(
            "Discover students error:",
            error
        );


        studentGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
                color:#ef4444;
            ">
                Failed to load students.

                <br>

                <small>
                    Please make sure you are logged in
                    and backend is running.
                </small>
            </div>
        `;
    }
}


/* =========================================================
   RENDER STUDENTS
   ========================================================= */

function renderDiscoverStudents() {

    const studentGrid =
        document.querySelector(".student-grid");

    if (!studentGrid) return;


    /* NO STUDENTS */

    if (discoverStudents.length === 0) {

        studentGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
                color:#64748b;
            ">
                No other students found yet.
            </div>
        `;

        return;
    }


    /* CREATE CARDS */

    studentGrid.innerHTML =
        discoverStudents.map(student => {

            const initials =
                getStudentInitials(student.name);


            const searchData = [

                student.name,
                student.college,
                student.course,
                student.year,
                student.bio,
                student.looking_for,
                student.availability

            ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


            return `

                <div
                    class="student-card"
                    data-user-id="${student.id}"
                    data-student-search="${searchData}"
                >

                    <div class="student-avatar">
                        ${initials}
                    </div>


                    <div>

                        <h3>
                            ${student.name || "Student"}
                        </h3>


                        <p>
                            ${student.course || "Student"}

                            ${
                                student.year
                                    ? " • Year " + student.year
                                    : ""
                            }
                        </p>


                        <div class="student-tags">

                            ${
                                student.college
                                    ? `<span>${student.college}</span>`
                                    : ""
                            }

                            ${
                                student.looking_for
                                    ? `<span>${student.looking_for}</span>`
                                    : ""
                            }

                        </div>


                        ${
                            student.bio
                                ? `<p>${student.bio}</p>`
                                : ""
                        }


                       <div class="student-actions">

    <div class="student-actions">

    <button
        class="connect-btn"
        data-user-id="${student.id}"
    >
        Connect
    </button>

    



    <button
        class="message-btn"
        data-user-id="${student.id}"
        data-user-name="${student.name || "Student"}"
    >
        Message
    </button>


                    </div>

                </div>

            `;

        }).join("");


    filterStudents();
}


/* =========================================================
   STUDENT SEARCH + FILTER
   ========================================================= */

function filterStudents() {

    const searchInput =
        document.getElementById("studentSearch");

    const filterSelect =
        document.getElementById("studentFilter");


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const selectedFilter =
        filterSelect
            ? filterSelect.value
            : "all";


    const students =
        document.querySelectorAll(".student-card");


    students.forEach(student => {

        const searchableText =
            student.getAttribute(
                "data-student-search"
            ) ||
            student.textContent;


        const text =
            searchableText.toLowerCase();


        const matchesSearch =
            text.includes(searchText);


        let matchesFilter = true;


        if (selectedFilter !== "all") {

            switch (selectedFilter) {

                case "web":

                    matchesFilter =
                        text.includes("web") ||
                        text.includes("react") ||
                        text.includes("node") ||
                        text.includes("javascript");

                    break;


                case "ai":

                    matchesFilter =
                        text.includes("ai") ||
                        text.includes("machine learning") ||
                        text.includes("ml") ||
                        text.includes("python");

                    break;


                case "design":

                    matchesFilter =
                        text.includes("design") ||
                        text.includes("ui") ||
                        text.includes("ux") ||
                        text.includes("figma") ||
                        text.includes("graphic");

                    break;


                case "dsa":

                    matchesFilter =
                        text.includes("dsa") ||
                        text.includes("programming") ||
                        text.includes("cpp") ||
                        text.includes("c++");

                    break;


                case "startup":

                    matchesFilter =
                        text.includes("startup") ||
                        text.includes("business") ||
                        text.includes("entrepreneur");

                    break;
            }
        }


        if (
            matchesSearch &&
            matchesFilter
        ) {

            student.style.display = "";

        } else {

            student.style.display = "none";

        }

    });
}


/* =========================================================
   OPEN DISCOVER + LOAD BACKEND DATA
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const discoverButton =
            event.target.closest(
                ".cc-home-secondary"
            );


        if (
            discoverButton &&
            discoverButton.textContent.includes(
                "Discover Students"
            )
        ) {

            setTimeout(
                () => {
                    loadDiscoverStudents();
                },
                100
            );

        }

    }
);


/* =========================================================
   SEARCH INPUT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const studentSearch =
            document.getElementById(
                "studentSearch"
            );


        if (studentSearch) {

            studentSearch.addEventListener(
                "input",
                filterStudents
            );

        }


        const studentFilter =
            document.getElementById(
                "studentFilter"
            );


        if (studentFilter) {

            studentFilter.addEventListener(
                "change",
                filterStudents
            );

        }

    }
);


/* =========================================================
   COMMUNITIES DATA
   ========================================================= */

let communities = [

    {
        name: "Coding & Programming",
        category: "Technology",
        icon: "💻",
        members: 245,
        active: 38,
        description:
            "A community for students interested in coding, programming and software development."
    },

    {
        name: "AI & Machine Learning",
        category: "Technology",
        icon: "🤖",
        members: 189,
        active: 27,
        description:
            "Learn and discuss Artificial Intelligence, Machine Learning and new AI technologies."
    },

    {
        name: "Startup & Entrepreneurship",
        category: "Career & Business",
        icon: "🚀",
        members: 156,
        active: 21,
        description:
            "Connect with students interested in startups, entrepreneurship and business ideas."
    },

    {
        name: "UI/UX & Design",
        category: "Creative",
        icon: "🎨",
        members: 132,
        active: 19,
        description:
            "Share design ideas, improve your UI/UX skills and collaborate with creative students."
    },

    {
        name: "Photography & Media",
        category: "Creative",
        icon: "📸",
        members: 118,
        active: 15,
        description:
            "For photography, videography, editing and media enthusiasts."
    },

    {
        name: "Gaming Community",
        category: "Entertainment",
        icon: "🎮",
        members: 210,
        active: 34,
        description:
            "Connect with gamers, discuss games and build gaming communities."
    },

    {
        name: "Fitness & Sports",
        category: "Sports & Fitness",
        icon: "🏋️",
        members: 143,
        active: 22,
        description:
            "A community for fitness, sports and healthy lifestyle enthusiasts."
    }

];


let selectedCommunity = null;


/* =========================================================
   RENDER COMMUNITIES
   ========================================================= */

function renderCommunities() {

    const grid =
        document.getElementById("communityGrid");

    if (!grid) return;


    const searchInput =
        document.getElementById("communitySearch");

    const searchText =
        searchInput ?
        searchInput.value.toLowerCase().trim() :
        "";


    const activeCategory =
        document.querySelector(".category.active");


    const category =
        activeCategory ?
        activeCategory.getAttribute("data-category") :
        "All";


    const filtered =
        communities.filter(community => {

            const matchesSearch =
                community.name
                    .toLowerCase()
                    .includes(searchText) ||
                community.description
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                category === "All" ||
                community.category === category;


            return matchesSearch && matchesCategory;

        });


    grid.innerHTML = "";


    if (filtered.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                <div>🔍</div>

                <h2>No communities found</h2>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    filtered.forEach((community, index) => {

        const card =
            document.createElement("div");

        card.className = "community-card";


        card.innerHTML = `

            <div class="community-icon">
                ${community.icon}
            </div>

            <span class="community-category">
                ${escapeHTML(community.category)}
            </span>

            <h3>
                ${escapeHTML(community.name)}
            </h3>

            <p>
                ${escapeHTML(community.description)}
            </p>

            <div class="community-card-stats">

                <span>
                    👥 ${community.members} Members
                </span>

                <span>
                    🟢 ${community.active} Active
                </span>

            </div>

            <button
                class="primary-btn"
                onclick="openCommunity(${communities.indexOf(community)})">
                View Community
            </button>

        `;


        grid.appendChild(card);

    });

}


/* =========================================================
   OPEN COMMUNITY
   ========================================================= */

function openCommunity(index) {

    selectedCommunity =
        communities[index];


    if (!selectedCommunity) {
        return;
    }


    // Basic information
    const detailName =
        document.getElementById("detailName");

    const detailCategory =
        document.getElementById("detailCategory");

    const detailMembers =
        document.getElementById("detailMembers");

    const detailActive =
        document.getElementById("detailActive");

    const detailDescription =
        document.getElementById("detailDescription");

    const detailIcon =
        document.getElementById("detailIcon");


    if (detailName) {
        detailName.textContent =
            selectedCommunity.name;
    }


    if (detailCategory) {
        detailCategory.textContent =
            selectedCommunity.category;
    }


    if (detailMembers) {
        detailMembers.textContent =
            selectedCommunity.members;
    }


    if (detailActive) {
        detailActive.textContent =
            selectedCommunity.active;
    }


    if (detailDescription) {
        detailDescription.textContent =
            selectedCommunity.description;
    }


    if (detailIcon) {
        detailIcon.textContent =
            selectedCommunity.icon;
    }


    // Reset community tab
    openCommunityTab("about");


    // Show page
    showPage("community-detail");


    // Load content
    renderCommunityOverview();
    renderCommunityMembers();
    renderCommunityEvents();
    renderCommunityDiscussions();

}


/* =========================================================
   JOIN COMMUNITY
   ========================================================= */

const joinCommunityButton =
    document.getElementById("joinCommunityBtn");


if (joinCommunityButton) {

    joinCommunityButton.addEventListener(
        "click",
        function () {

            if (!selectedCommunity) {
                return;
            }


            if (
                this.textContent.trim() ===
                "Joined"
            ) {

                return;

            }


            this.textContent = "Joined ✓";

            this.classList.add("joined");


            selectedCommunity.members++;

            const detailMembers =
                document.getElementById("detailMembers");

            if (detailMembers) {

                detailMembers.textContent =
                    selectedCommunity.members;

            }


            alert(
                "You joined " +
                selectedCommunity.name +
                "!"
            );

        }
    );

}


/* =========================================================
   COMMUNITY TABS
   ========================================================= */

function openCommunityTab(tabName) {

    const contents =
        document.querySelectorAll(
            ".community-tab-content"
        );


    contents.forEach(content => {

        content.classList.remove("active");

    });


    const tabs =
        document.querySelectorAll(
            ".community-tab"
        );


    tabs.forEach(tab => {

        tab.classList.remove("active");

    });


    const selectedContent =
        document.getElementById(
            tabName + "Tab"
        );


    if (selectedContent) {

        selectedContent.classList.add("active");

    }


    const selectedButton =
        document.querySelector(
            `.community-tab[data-tab="${tabName}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("active");

    }


    if (tabName === "chat") {
        loadGroupMessages();
    }

}


document.addEventListener("click", function (event) {

    const tab =
        event.target.closest(".community-tab");

    if (!tab) return;

    const tabName =
        tab.getAttribute("data-tab");

    if (tabName) {

        openCommunityTab(tabName);

    }

});


/* =========================================================
   COMMUNITY CHAT
   ========================================================= */

let groupMessages = [

    {
        name: "Rahul",
        message: "Anyone working on an AI project?",
        time: "10:30 AM"
    },

    {
        name: "Ananya",
        message: "Yes! I am working on a computer vision project.",
        time: "10:34 AM"
    }

];


function loadGroupMessages() {

    const container =
        document.getElementById("groupMessages");

    if (!container) return;


    container.innerHTML = "";


    groupMessages.forEach(message => {

        const messageDiv =
            document.createElement("div");

        messageDiv.className = "group-message";


        messageDiv.innerHTML = `

            <strong>
                ${escapeHTML(message.name)}
            </strong>

            <p>
                ${escapeHTML(message.message)}
            </p>

            <small>
                ${escapeHTML(message.time)}
            </small>

        `;


        container.appendChild(messageDiv);

    });


    container.scrollTop =
        container.scrollHeight;

}


function sendGroupMessage() {

    const input =
        document.getElementById("groupInput");

    if (!input) return;


    const message =
        input.value.trim();


    if (message === "") {
        return;
    }


    const now =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    groupMessages.push({

        name: "You",

        message: message,

        time: now

    });


    input.value = "";


    loadGroupMessages();

}


/* =========================================================
   DISCUSSIONS
   ========================================================= */

let discussions = [

    {
        author: "Karan",
        text: "What technology should we use for our next project?"
    },

    {
        author: "Simran",
        text: "Does anyone want to collaborate on a Java project?"
    }

];


function renderCommunityOverview() {

    const container =
        document.getElementById(
            "overviewDiscussions"
        );

    if (!container) return;


    container.innerHTML = "";


    discussions
        .slice(0, 3)
        .forEach(post => {

            const div =
                document.createElement("div");

            div.className =
                "discussion-preview";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(post.author)}
                </strong>

                <p>
                    ${escapeHTML(post.text)}
                </p>

            `;


            container.appendChild(div);

        });

}


function renderCommunityDiscussions() {

    const container =
        document.getElementById(
            "fullDiscussions"
        );

    if (!container) return;


    container.innerHTML = "";


    discussions.forEach(post => {

        const div =
            document.createElement("div");

        div.className =
            "discussion-preview";


        div.innerHTML = `

            <strong>
                ${escapeHTML(post.author)}
            </strong>

            <p>
                ${escapeHTML(post.text)}
            </p>

        `;


        container.appendChild(div);

    });

}


function focusCreatePost() {

    openCommunityTab("discussions");


    const input =
        document.getElementById(
            "newPostInput"
        );


    if (input) {

        setTimeout(() => {

            input.focus();

        }, 100);

    }

}


function createDiscussionPost() {

    const input =
        document.getElementById(
            "newPostInput"
        );


    if (!input) return;


    const text =
        input.value.trim();


    if (text === "") {

        alert("Please write something first.");

        input.focus();

        return;

    }


    discussions.unshift({

        author: "You",

        text: text

    });


    input.value = "";


    renderCommunityDiscussions();

    renderCommunityOverview();


    alert("Discussion posted successfully!");

}


/* =========================================================
   COMMUNITY MEMBERS
   ========================================================= */

function renderCommunityMembers() {

    const grid =
        document.getElementById(
            "memberGrid"
        );

    if (!grid) return;


    const members = [

        {
            initials: "KM",
            name: "Karan Mehta",
            role: "AI Enthusiast"
        },

        {
            initials: "AV",
            name: "Ananya Verma",
            role: "UI/UX Designer"
        },

        {
            initials: "RS",
            name: "Rahul Sharma",
            role: "Web Developer"
        },

        {
            initials: "SK",
            name: "Simran Kaur",
            role: "Java Developer"
        },

        {
            initials: "AS",
            name: "Aditya Singh",
            role: "Full Stack Developer"
        },

        {
            initials: "MG",
            name: "Mehak Gupta",
            role: "Data Science Student"
        }

    ];


    grid.innerHTML = "";


    members.forEach(member => {

        const card =
            document.createElement("div");

        card.className = "member-card";


        card.innerHTML = `

            <div class="student-avatar">
                ${member.initials}
            </div>

            <div>

                <h3>
                    ${escapeHTML(member.name)}
                </h3>

                <p>
                    ${escapeHTML(member.role)}
                </p>

                <button
                    class="connect-btn">
                    Connect
                </button>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================================================
   EVENTS
   ========================================================= */

let communityEvents = [

    {
        title: "Campus Hackathon",
        date: "28 September 2026",
        description:
            "Build innovative solutions with students."
    },

    {
        title: "AI Workshop",
        date: "5 October 2026",
        description:
            "Learn the basics of Artificial Intelligence."
    }

];


function renderCommunityEvents() {

    const overview =
        document.getElementById(
            "overviewEvents"
        );

    const full =
        document.getElementById(
            "fullEvents"
        );


    if (overview) {

        overview.innerHTML = "";


        communityEvents
            .slice(0, 2)
            .forEach(event => {

                const div =
                    document.createElement("div");

                div.className =
                    "event-preview";


                div.innerHTML = `

                    <h3>
                        ${escapeHTML(event.title)}
                    </h3>

                    <p>
                        📅 ${escapeHTML(event.date)}
                    </p>

                `;


                overview.appendChild(div);

            });

    }


    if (full) {

        full.innerHTML = "";


        communityEvents.forEach(event => {

            const div =
                document.createElement("div");

            div.className =
                "event-preview";


            div.innerHTML = `

                <h3>
                    ${escapeHTML(event.title)}
                </h3>

                <p>
                    📅 ${escapeHTML(event.date)}
                </p>

                <p>
                    ${escapeHTML(event.description)}
                </p>

            `;


            full.appendChild(div);

        });

    }

}


function createEvent() {

    const title =
        prompt("Enter event name:");

    if (!title || title.trim() === "") {
        return;
    }


    const date =
        prompt("Enter event date:");

    if (!date || date.trim() === "") {
        return;
    }


    const description =
        prompt("Enter event description:");


    communityEvents.push({

        title: title.trim(),

        date: date.trim(),

        description:
            description ?
            description.trim() :
            "New community event."

    });


    renderCommunityEvents();


    alert("Event created successfully!");

}


/* =========================================================
   PROJECTS
   ========================================================= */

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            ".project-card .secondary-btn"
        );


    if (!button) return;


    if (
        button.textContent
            .trim()
            .toLowerCase()
            .includes("join")
    ) {

        button.textContent =
            "Joined ✓";

        button.disabled = true;

        button.classList.add("joined");

        alert(
            "You joined the project successfully!"
        );

    }

});


function createProject() {

    const projectName =
        prompt("Enter project name:");

    if (
        !projectName ||
        projectName.trim() === ""
    ) {

        return;

    }


    alert(
        "Project '" +
        projectName.trim() +
        "' created successfully!"
    );

}


/* =========================================================
   RESOURCES
   ========================================================= */

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            ".resource-card .secondary-btn"
        );


    if (!button) return;


    const card =
        button.closest(".resource-card");


    const title =
        card ?
        card.querySelector("h3") :
        null;


    if (title) {

        alert(
            "Opening resource: " +
            title.textContent
        );

    }

});


/* =========================================================
   CREATE COMMUNITY
   ========================================================= */

function createCommunity() {

    const name =
        prompt("Enter community name:");

    if (!name || name.trim() === "") {
        return;
    }


    const category =
        prompt(
            "Enter category:\nTechnology\nCareer & Business\nCreative\nEntertainment\nSports & Fitness"
        );


    if (!category || category.trim() === "") {
        return;
    }


    const description =
        prompt("Enter community description:");


    communities.push({

        name: name.trim(),

        category: category.trim(),

        icon: "🌟",

        members: 1,

        active: 1,

        description:
            description ?
            description.trim() :
            "A new campus community."

    });


    renderCommunities();


    alert(
        "Community '" +
        name.trim() +
        "' created successfully!"
    );

}


/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

document.addEventListener("keydown", function (event) {

    // Group chat
    if (
        event.key === "Enter" &&
        document.activeElement &&
        document.activeElement.id ===
        "groupInput"
    ) {

        event.preventDefault();

        sendGroupMessage();

    }


    // Discussion post
    if (
        event.key === "Enter" &&
        document.activeElement &&
        document.activeElement.id ===
        "newPostInput"
    ) {

        event.preventDefault();

        createDiscussionPost();

    }

});


/* =========================================================
   HTML SECURITY HELPER
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

window.addEventListener("load", function () {

    showPage("home");

});


/* =========================================================
   HOME PAGE PROTOTYPE ACTIONS
   ========================================================= */

document.addEventListener("click", function(event) {

    // AI Matchmaker - Find My Matches
    const aiButton =
        event.target.closest(".cc-home-primary");

    if (
        aiButton &&
        aiButton.textContent.includes("Find My Matches")
    ) {

        showPage("matches");

    }


    // Discover Students
    const discoverButton =
        event.target.closest(".cc-home-secondary");

    if (
        discoverButton &&
        discoverButton.textContent.includes("Discover Students")
    ) {

        showPage("discover");

    }


    // Home page team - Request to Join
    const teamButton =
        event.target.closest(
            ".cc-home-team .cc-home-primary"
        );

    if (
        teamButton &&
        teamButton.textContent.includes("Request to Join")
    ) {

        const team =
            teamButton.closest(".cc-home-team");

        const name =
            team ?
            team.querySelector("h3") :
            null;

        if (
            name &&
            typeof requestToJoinTeam === "function"
        ) {

            requestToJoinTeam(
                name.textContent.trim()
            );

        }

    }

});

/* =========================================================
   CAMPUS CONNECT - DAY/NIGHT MODE
   ========================================================= */

(function setupThemeToggle() {
    function initTheme() {
        const toggle = document.getElementById("themeToggle");
        if (!toggle) return;

        const savedTheme = localStorage.getItem("campusConnectTheme");
        const darkMode = savedTheme === "dark";

        document.body.classList.toggle("dark-mode", darkMode);
        toggle.textContent = darkMode ? "☀" : "☾";
        toggle.setAttribute(
            "aria-label",
            darkMode ? "Switch to light mode" : "Switch to dark mode"
        );
        toggle.title = darkMode ? "Light mode" : "Dark mode";
    }

    function toggleTheme() {
        const toggle = document.getElementById("themeToggle");
        if (!toggle) return;

        const darkMode = !document.body.classList.contains("dark-mode");
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem(
            "campusConnectTheme",
            darkMode ? "dark" : "light"
        );

        toggle.textContent = darkMode ? "☀" : "☾";
        toggle.setAttribute(
            "aria-label",
            darkMode ? "Switch to light mode" : "Switch to dark mode"
        );
        toggle.title = darkMode ? "Light mode" : "Dark mode";
    }

    document.addEventListener("DOMContentLoaded", function () {
        initTheme();

        const toggle = document.getElementById("themeToggle");
        if (toggle) {
            toggle.addEventListener("click", toggleTheme);
        }
    });
})();


/* =========================================================
   CAMPUS CONNECT - REAL CONNECTION REQUEST SYSTEM
   ========================================================= */

(function setupRealConnectionRequests() {

    let sentRequests = [];
    let receivedRequests = [];

    /* =========================
       AUTH TOKEN
       ========================= */

    function getToken() {
        return getAuthToken();
    }


    /* =========================
       INITIALS
       ========================= */

    function getInitials(name) {

        if (!name) return "CC";

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }


    /* =========================
       LOAD SENT REQUESTS
       ========================= */

    async function loadSentRequests() {

        const token = getToken();

        if (!token) return;

        try {

            const response = await fetch(
                "http://localhost:5000/api/connections/sent",
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load sent requests"
                );
            }

            sentRequests =
                Array.isArray(data.requests)
                    ? data.requests
                    : [];

            updateConnectionUI();

        } catch (error) {

            console.error(
                "Load sent requests error:",
                error
            );
        }
    }


    /* =========================
       LOAD RECEIVED REQUESTS
       ========================= */

    async function loadReceivedRequests() {

        const token = getToken();

        if (!token) return;

        try {

            const response = await fetch(
                "http://localhost:5000/api/connections/received",
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load received requests"
                );
            }

            receivedRequests =
                Array.isArray(data.requests)
                    ? data.requests
                    : [];

            updateConnectionUI();

        } catch (error) {

            console.error(
                "Load received requests error:",
                error
            );
        }
    }


    /* =========================
       UPDATE BELL + PANEL
       ========================= */

    function updateConnectionUI() {

        const badge =
            document.getElementById(
                "connectionRequestCount"
            );

        const list =
            document.getElementById(
                "connectionRequestsList"
            );

        const subtitle =
            document.getElementById(
                "requestPanelSubtitle"
            );

        if (!list) return;


        /* ONLY PENDING RECEIVED REQUESTS */
        const pendingReceived =
            receivedRequests.filter(
                request =>
                    request.status === "pending"
            );


        /* BADGE = INCOMING REQUESTS */
        if (badge) {

            if (pendingReceived.length > 0) {

                badge.textContent =
                    pendingReceived.length;

                badge.style.display = "flex";

            } else {

                badge.textContent = "";

                badge.style.display = "none";
            }
        }


        list.innerHTML = "";


        /* =========================
           INCOMING REQUESTS
           ========================= */

        if (pendingReceived.length > 0) {

            if (subtitle) {

                subtitle.textContent =
                    pendingReceived.length === 1
                        ? "1 request received"
                        : pendingReceived.length +
                          " requests received";
            }


            pendingReceived.forEach(request => {

                const item =
                    document.createElement("div");

                item.className =
                    "connection-request-item";


                item.innerHTML = `

                    <div class="connection-request-avatar">
                        ${escapeHTML(
                            getInitials(request.name)
                        )}
                    </div>

                    <div class="connection-request-info">

                        <strong>
                            ${escapeHTML(
                                request.name ||
                                "Student"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                request.course ||
                                "Campus Student"
                            )}
                            • Pending
                        </small>

                    </div>

                    <div class="connection-request-actions">

                        <button
                            type="button"
                            class="connection-accept"
                            data-connection-id="${request.id}">
                            Accept
                        </button>

                        <button
                            type="button"
                            class="connection-reject"
                            data-connection-id="${request.id}">
                            Reject
                        </button>

                    </div>

                `;

                list.appendChild(item);

            });

            return;
        }


        /* =========================
           NO INCOMING REQUESTS
           ========================= */

        if (subtitle) {

            subtitle.textContent =
                sentRequests.filter(
                    request =>
                        request.status === "pending"
                ).length > 0
                    ? "No incoming requests"
                    : "No requests";
        }


        list.innerHTML = `

            <div class="empty-requests">

                No incoming connection requests.

                <br>

                Find students and send a request
                to connect.

            </div>

        `;
    }


    /* =========================
       SEND CONNECTION REQUEST
       ========================= */

    async function sendRequest(button) {

        if (!button || button.disabled) {
            return;
        }

        const receiverId =
            Number(
                button.getAttribute(
                    "data-user-id"
                )
            );

        if (!receiverId) {
            return;
        }

        const token = getToken();

        if (!token) {
            alert("Please login first.");
            return;
        }


        button.disabled = true;
        button.textContent = "Sending...";


        try {

            const response = await fetch(
                "http://localhost:5000/api/connections",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        receiverId: receiverId
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to send request"
                );
            }


            button.textContent =
                "Request Sent";

            button.classList.add(
                "request-sent"
            );


            await loadSentRequests();

            alert(
                "Connection request sent successfully!"
            );


        } catch (error) {

            console.error(
                "Send connection error:",
                error
            );

            button.disabled = false;

            button.textContent =
                "Connect";

            alert(
                error.message ||
                "Failed to send connection request."
            );
        }
    }


    /* =========================
       ACCEPT REQUEST
       ========================= */

    async function acceptRequest(
        connectionId
    ) {

        const token = getToken();

        if (!token) return;


        try {

            const response = await fetch(
                `http://localhost:5000/api/connections/${connectionId}/accept`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to accept request"
                );
            }


            alert(
                "Connection request accepted!"
            );


            await loadReceivedRequests();

        } catch (error) {

            console.error(
                "Accept request error:",
                error
            );

            alert(
                error.message ||
                "Failed to accept request."
            );
        }
    }


    /* =========================
       REJECT REQUEST
       ========================= */

    async function rejectRequest(
        connectionId
    ) {

        const token = getToken();

        if (!token) return;


        try {

            const response = await fetch(
                `http://localhost:5000/api/connections/${connectionId}/reject`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to reject request"
                );
            }


            await loadReceivedRequests();

        } catch (error) {

            console.error(
                "Reject request error:",
                error
            );

            alert(
                error.message ||
                "Failed to reject request."
            );
        }
    }


    /* =========================
       CONNECT BUTTON CLICK
       ========================= */

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".student-card .connect-btn"
                );

            if (!button) return;

            if (
                button.textContent
                    .trim()
                    .toLowerCase()
                    .includes("request sent")
            ) {
                return;
            }

            event.preventDefault();

            sendRequest(button);
        }
    );


    /* =========================
       ACCEPT BUTTON
       ========================= */

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".connection-accept"
                );

            if (!button) return;

            event.preventDefault();

            const connectionId =
                Number(
                    button.getAttribute(
                        "data-connection-id"
                    )
                );

            if (connectionId) {
                acceptRequest(
                    connectionId
                );
            }
        }
    );


    /* =========================
       REJECT BUTTON
       ========================= */

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".connection-reject"
                );

            if (!button) return;

            event.preventDefault();

            const connectionId =
                Number(
                    button.getAttribute(
                        "data-connection-id"
                    )
                );

            if (connectionId) {
                rejectRequest(
                    connectionId
                );
            }
        }
    );


    /* =========================
       BELL BUTTON
       ========================= */

    document.addEventListener(
        "DOMContentLoaded",
        function() {

            const requestButton =
                document.getElementById(
                    "connectionRequestsBtn"
                );

            const closeButton =
                document.getElementById(
                    "closeRequestsPanel"
                );


            if (requestButton) {

                requestButton.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        const panel =
                            document.getElementById(
                                "connectionRequestsPanel"
                            );

                        if (!panel) return;

                        panel.classList.toggle(
                            "open"
                        );

                        if (
                            panel.classList.contains(
                                "open"
                            )
                        ) {

                            loadReceivedRequests();

                        }

                    }
                );
            }


            if (closeButton) {

                closeButton.addEventListener(
                    "click",
                    function() {

                        const panel =
                            document.getElementById(
                                "connectionRequestsPanel"
                            );

                        if (panel) {
                            panel.classList.remove(
                                "open"
                            );
                        }

                    }
                );
            }


            /* Initial load */

            loadSentRequests();

            loadReceivedRequests();

        }
    );

})();
/* =========================================================
   LOGIN - BACKEND / JWT
   =========================
   ================================ */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");
        const button = document.getElementById("loginSubmitBtn");

        if (!email || !password) {
            message.textContent = "Please enter email and password.";
            message.style.color = "#ef4444";
            return;
        }

        button.disabled = true;
        button.textContent = "Logging in...";
        message.textContent = "";

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            /* SAVE JWT TOKEN */
            localStorage.setItem("token", data.token);
            setupAdminAccess(); 


            message.textContent = "Login successful!";
            message.style.color = "#16a34a";

            button.textContent = "Logged In ✓";

            /* Close login modal */
            setTimeout(function () {

                    const modal =
                        document.getElementById("loginModal");

                    if (modal) {
                        modal.style.display = "none";
                    }

                }, 700);

                console.log("JWT token saved successfully.");

            } catch (error) {

                console.error("Login error:", error);

                message.textContent =
                    error.message || "Login failed.";

                message.style.color = "#ef4444";

                button.disabled = false;
                button.textContent = "Login";
            }

        });

    });
    /* =========================================================
    MY PROFILE - BACKEND / MYSQL
    ========================================================= */

    async function loadMyProfile() {

        const token = getAuthToken();

        if (!token) {
            console.log("No login token found.");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/profile",
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load profile"
                );
            }

            const user = data.user;

            /* PROFILE NAME */
            const profileName = document.querySelector(
                ".profile-card h2"
            );

            if (profileName) {
                profileName.textContent =
                    user.name || "Student";
            }


            /* PROFILE AVATAR / INITIALS */
            const profileAvatar = document.querySelector(
                ".profile-card .profile-avatar"
            );

            if (profileAvatar) {
                profileAvatar.textContent =
                    getStudentInitials(user.name);
            }


            /* PROFILE COURSE */
            const profileCourse = document.querySelector(
                ".profile-card h2 + p"
            );

            if (profileCourse) {
                profileCourse.textContent =
                    user.course || "Student";
            }

            console.log("My profile loaded:", user);

        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

        }
    }


    /* LOAD PROFILE AFTER PAGE LOAD */
    document.addEventListener(
        "DOMContentLoaded",
        function () {
            loadMyProfile();
        }
    );
    /* =========================================================
    REAL 1-TO-1 MESSAGING SYSTEM
    ========================================================= */




    /* ================= LOAD CONVERSATION ================= */

async function loadConversation(userId, userName) {

    const token = getAuthToken();

    if (!token) {
        console.log("No authentication token found.");
        return;
    }

    activeChatUserId = Number(userId);
    activeChatUserName = userName;

    const chatUserName =
        document.getElementById("chatUserName");

    const chatUserStatus =
        document.getElementById("chatUserStatus");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatAvatar =
        document.querySelector(".chat-user-avatar");

    if (chatUserName) {
        chatUserName.textContent = userName;
    }

    if (chatUserStatus) {
        chatUserStatus.textContent = "Conversation";
    }

    if (chatAvatar) {
        chatAvatar.textContent =
            getStudentInitials(userName);
    }

    if (!chatMessages) return;

    chatMessages.innerHTML = `
        <div class="chat-placeholder">
            <div>⏳</div>
            <p>Loading messages...</p>
        </div>
    `;

    try {

        const response = await fetch(
            `http://localhost:5000/api/messages/${userId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load conversation"
            );
        }

        renderChatMessages(
            data.messages || []
        );

    } catch (error) {

        console.error(
            "Load conversation error:",
            error
        );

        chatMessages.innerHTML = `
            <div class="chat-placeholder">
                <div>⚠️</div>
                <p>${error.message}</p>
            </div>
        `;
    }
}


/* ================= LOAD CONVERSATION LIST ================= */

async function loadConversationList() {

    const conversationList =
        document.getElementById("conversationList");

    if (!conversationList) return;

    const token = getAuthToken();

    if (!token) return;

    try {

        const response = await fetch(
            "http://localhost:5000/api/users",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load users"
            );
        }

        const users = Array.isArray(data.users)
            ? data.users
            : [];

        if (users.length === 0) {

            conversationList.innerHTML = `
                <div class="no-conversations">
                    <span>💬</span>
                    <p>No conversations yet</p>
                </div>
            `;

            return;
        }

        conversationList.innerHTML = users.map(user => `

            <div
                class="conversation-item"
                data-user-id="${user.id}"
                data-user-name="${escapeHTML(
                    user.name || "Student"
                )}"
            >

                <div class="conversation-avatar">
                    ${getStudentInitials(
                        user.name || "Student"
                    )}
                </div>

                <div class="conversation-info">

                    <h4>
                        ${escapeHTML(
                            user.name || "Student"
                        )}
                    </h4>

                    <p>Click to open chat</p>

                </div>

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "Conversation list error:",
            error
        );

        conversationList.innerHTML = `
            <div class="no-conversations">
                <span>⚠️</span>
                <p>Unable to load conversations</p>
            </div>
        `;
    }
}


/* ================= CONVERSATION CLICK ================= */
document.addEventListener("click", function(event) {

    const conversation =
        event.target.closest(".conversation-item");

    if (!conversation) return;

    const userId =
        conversation.dataset.userId;

    const userName =
        conversation.dataset.userName;

    loadConversation(
        Number(userId),
        userName
    );

});
/* ================= RENDER MESSAGES ================= */

function renderChatMessages(messages) {

    const chatMessages =
        document.getElementById("chatMessages");

    if (!chatMessages) return;

    if (!messages.length) {

        chatMessages.innerHTML = `
            <div class="chat-placeholder">
                <div>💬</div>
                <h3>No messages yet</h3>
                <p>Send the first message.</p>
            </div>
        `;

        return;
    }

    const currentUserId = getCurrentUserId();

    console.log("Current User ID:", currentUserId);

    chatMessages.innerHTML = messages.map(message => {

        const isSent =
            Number(message.sender_id) === Number(currentUserId);

        const time = message.created_at
            ? new Date(message.created_at).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
            : "";

        return `
            <div class="message-bubble ${isSent ? "sent" : "received"}">

                ${escapeMessageHTML(message.message)}

                <span class="message-time">
                    ${time}
                </span>

            </div>
        `;

    }).join("");

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* ================= SEND MESSAGE ================= */

async function sendDMMessage(event) {

    event.preventDefault();

    if (!activeChatUserId) {
        alert("Please select a conversation first.");
        return;
    }

    const token = getAuthToken();

    const input =
        document.getElementById("messageInput");

    const sendButton =
        document.getElementById("sendMessageBtn");

    if (!input || !token) return;

    const message = input.value.trim();

    if (!message) return;

    sendButton.disabled = true;

    try {

        const response = await fetch(
            "http://localhost:5000/api/messages",
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    receiverId: activeChatUserId,
                    message: message
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Message could not be sent"
            );
        }

        input.value = "";

        await loadConversation(
            activeChatUserId,
            activeChatUserName
        );

    } catch (error) {

        console.error("Send message error:", error);

        alert(error.message);

    } finally {

        sendButton.disabled = false;

        input.focus();
    }
}


/* ================= SAFE MESSAGE TEXT ================= */

function escapeMessageHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================= CURRENT USER ID ================= */

function getCurrentUserId() {

    const token = getAuthToken();

    if (!token) {
        return null;
    }

    try {

        const payload =
            JSON.parse(
                atob(token.split(".")[1])
            );

        return Number(
            payload.userId ||
            payload.id ||
            payload.sub
        );

    } catch (error) {

        console.error(
            "Could not decode JWT:",
            error
        );

        return null;
    }
}


/* ================= MESSAGE FORM ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const messageForm =
            document.getElementById("messageForm");

        if (messageForm) {

            messageForm.addEventListener(
                "submit",
                sendDMMessage
            );
        }

    }
);
/* =========================================================
   DISCOVER → MESSAGE BUTTON
========================================================= */

document.addEventListener("click", function (event) {

    const button = event.target.closest(".message-btn");

    if (!button) return;

    event.preventDefault();

    const userId = Number(button.dataset.userId);
    const userName =
        button.dataset.userName || "Student";

    if (!userId) return;

    console.log(
        "MESSAGE BUTTON CLICKED:",
        userId,
        userName
    );

    /* ================= OPEN MESSAGES PAGE ================= */

    const messagesNav =
        document.querySelector('[data-page="messages"]');

    if (messagesNav) {

        messagesNav.click();

    } else {

        document
            .querySelectorAll(".page")
            .forEach(page => {
                page.classList.remove("active");
            });

        const messagesPage =
            document.getElementById("messages-page");

        if (messagesPage) {
            messagesPage.classList.add("active");
        }
    }


    /* ================= LOAD SELECTED CHAT ================= */

    setTimeout(() => {

        loadConversation(
            userId,
            userName
        );

    }, 100);

});


/* =========================================================
   LOAD DISCOVER STUDENTS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadDiscoverStudents();

});
/* =========================================================
   CAMPUS CONNECT - PRIVATE DM SYSTEM
   ========================================================= */

let activeChatUserId = null;
let activeChatUserName = "";


/* OPEN CONVERSATION */

async function loadConversation(userId, userName) {

    const token = getAuthToken();

    if (!token) {
        alert("Please login first.");
        return;
    }

    activeChatUserId = Number(userId);
    activeChatUserName = userName || "Student";

    const chatUserName =
        document.getElementById("chatUserName");

    const chatUserStatus =
        document.getElementById("chatUserStatus");

    const chatMessages =
        document.getElementById("chatMessages");

    if (chatUserName) {
        chatUserName.textContent =
            activeChatUserName;
    }

    if (chatUserStatus) {
        chatUserStatus.textContent =
            "Private conversation";
    }

    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="chat-placeholder">
                <div>⏳</div>
                <p>Loading messages...</p>
            </div>
        `;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/messages/" +
            activeChatUserId,
            {
                method: "GET",
                headers: {
                    "Authorization":
                        "Bearer " + token,
                    "Content-Type":
                        "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load conversation"
            );
        }

        renderChatMessages(
            data.messages || []
        );

    } catch (error) {

        console.error(
            "Conversation loading error:",
            error
        );

        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="chat-placeholder">
                    <div>⚠️</div>
                    <p>
                        ${escapeHTML(error.message)}
                    </p>
                </div>
            `;
        }

    }

}


/* RENDER MESSAGES */

function renderChatMessages(messages) {

    const chatMessages =
        document.getElementById("chatMessages");

    if (!chatMessages) return;

    if (!messages.length) {

        chatMessages.innerHTML = `
            <div class="chat-placeholder">
                <div>💬</div>

                <h3>
                    Start a conversation
                </h3>

                <p>
                    Send the first message.
                </p>
            </div>
        `;

        return;
    }

    const currentUserId =
        getCurrentUserId();

    console.log(
        "Current User ID:",
        currentUserId
    );

    chatMessages.innerHTML =
        messages.map(message => {

            const isSent =
                Number(message.sender_id) ===
                Number(currentUserId);

            const time =
                message.created_at
                    ? new Date(
                        message.created_at
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                    : "";

            return `
                <div class="message-bubble ${
                    isSent
                        ? "sent"
                        : "received"
                }">

                    ${escapeMessageHTML(
                        message.message
                    )}

                    <span class="message-time">
                        ${time}
                    </span>

                </div>
            `;

        }).join("");

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* SEND MESSAGE */

async function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );

    if (!input) return;

    const message =
        input.value.trim();

    if (!message) return;

    if (!activeChatUserId) {

        alert(
            "Please select a conversation first."
        );

        return;
    }

    const token =
        getAuthToken();

    if (!token) {

        alert("Please login first.");

        return;
    }

    const sendButton =
        document.getElementById(
            "sendMessageBtn"
        );

    if (sendButton) {
        sendButton.disabled = true;
    }

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/messages",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        receiverId:
                            Number(
                                activeChatUserId
                            ),

                        message:
                            message
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to send message"
            );

        }

        input.value = "";

        await loadConversation(
            activeChatUserId,
            activeChatUserName
        );

    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        alert(
            error.message ||
            "Failed to send message."
        );

    } finally {

        if (sendButton) {
            sendButton.disabled = false;
        }

    }

}


/* MESSAGE FORM */



document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".message-btn");

        if (!button) return;

        event.preventDefault();

        const userId =
            Number(button.dataset.userId);

        const userName =
            button.dataset.userName || "Student";

        console.log(
            "MESSAGE BUTTON CLICKED:",
            userId,
            userName
        );

        const messagesNav =
            document.querySelector(
                '[data-page="messages"]'
            );

        if (messagesNav) {
            messagesNav.click();
        }

        /* Load conversation list */
        loadConversationList();

        /* Open selected conversation */
        setTimeout(() => {

            loadConversation(
                userId,
                userName
            );

        }, 150);

    }
);


/* ESCAPE MESSAGE HTML */

function escapeMessageHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
/* =========================================================
   ADMIN PANEL
   ========================================================= */

function getJwtPayload() {
    try {
        const token = getAuthToken();

        if (!token) {
            return null;
        }

        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        return JSON.parse(atob(parts[1]));
    } catch (error) {
        console.error("JWT decode error:", error);
        return null;
    }
}


/* =========================
   ADMIN ACCESS
   ========================= */

function setupAdminAccess() {
    const adminNavBtn = document.getElementById("adminNavBtn");

    if (!adminNavBtn) {
        return;
    }

    const payload = getJwtPayload();

    if (payload && payload.role === "admin") {
        adminNavBtn.style.display = "inline-flex";
    } else {
        adminNavBtn.style.display = "none";
    }
}


/* =========================
   ADMIN STATS
   ========================= */

async function loadAdminStats() {
    const token = getAuthToken();

    if (!token) {
        console.error("No authentication token found.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/admin/stats", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Admin stats error:", data);
            return;
        }

        if (!data.success || !data.stats) {
            console.error("Invalid admin stats response:", data);
            return;
        }

        const stats = data.stats;

        const totalUsers = document.getElementById("adminTotalUsers");
        const totalCommunities = document.getElementById("adminTotalCommunities");
        const totalConnections = document.getElementById("adminTotalConnections");
        const totalMessages = document.getElementById("adminTotalMessages");

        if (totalUsers) {
            totalUsers.textContent = stats.totalUsers ?? 0;
        }

        if (totalCommunities) {
            totalCommunities.textContent = stats.totalCommunities ?? 0;
        }

        if (totalConnections) {
            totalConnections.textContent = stats.totalConnections ?? 0;
        }

        if (totalMessages) {
            totalMessages.textContent = stats.totalMessages ?? 0;
        }

        console.log("Admin stats loaded:", stats);

    } catch (error) {
        console.error("Failed to load admin stats:", error);
    }
}


/* =========================
   OPEN USER MANAGEMENT
   ========================= */

function openAdminUsers() {
    const payload = getJwtPayload();

    if (!payload || payload.role !== "admin") {
        alert("Access denied. Admin only.");
        return;
    }

    showPage("admin-users");

    setTimeout(() => {
        loadAdminUsers();
    }, 100);
}


/* =========================
   LOAD ADMIN USERS
   ========================= */

async function loadAdminUsers() {
    const token = getAuthToken();

    if (!token) {
        console.error("No authentication token found.");
        return;
    }

    const searchInput = document.getElementById("adminUserSearch");
    const tableContainer = document.getElementById("adminUsersTableContainer");
    const countElement = document.getElementById("adminUsersCount");

    const search = searchInput
        ? searchInput.value.trim()
        : "";

    if (tableContainer) {
        tableContainer.innerHTML = `
            <div class="admin-users-loading">
                Loading users...
            </div>
        `;
    }

    try {
        let url = "http://localhost:5000/api/admin/users";

        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load users.");
        }

        if (!data.success) {
            throw new Error(data.message || "Failed to load users.");
        }

        renderAdminUsers(data.users || []);

    } catch (error) {
        console.error("Admin users error:", error);

        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="admin-users-error">
                    Failed to load users.
                </div>
            `;
        }

        if (countElement) {
            countElement.textContent = "Unable to load users";
        }
    }
}


/* =========================
   RENDER ADMIN USERS
   ========================= */

function renderAdminUsers(users) {
    const tableContainer = document.getElementById(
        "adminUsersTableContainer"
    );

    const countElement = document.getElementById(
        "adminUsersCount"
    );

    if (!tableContainer) {
        return;
    }

    if (countElement) {
        countElement.textContent =
            `${users.length} user${users.length === 1 ? "" : "s"} found`;
    }

    if (!users.length) {
        tableContainer.innerHTML = `
            <div class="admin-users-empty">
                No users found.
            </div>
        `;

        return;
    }

    let rows = "";

    users.forEach((user) => {

        const roleClass =
            user.role === "admin"
                ? "admin-role"
                : "student-role";

        rows += `
            <tr>
                <td>
                    <strong>${escapeAdminHTML(user.name || "N/A")}</strong>
                </td>

                <td>
                    ${escapeAdminHTML(user.email || "N/A")}
                </td>

                <td>
                    ${escapeAdminHTML(user.college || "N/A")}
                </td>

                <td>
                    ${escapeAdminHTML(user.course || "N/A")}
                </td>

                <td>
                    ${escapeAdminHTML(user.year || "N/A")}
                </td>

                <td>
                    <span class="admin-user-role ${roleClass}">
                        ${escapeAdminHTML(user.role || "student")}
                    </span>
                </td>
            </tr>
        `;
    });

    tableContainer.innerHTML = `
        <div class="admin-table-wrapper">
            <table class="admin-users-table">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>College</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>
        </div>
    `;
}


/* =========================
   ESCAPE HTML
   ========================= */

function escapeAdminHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   ADMIN NAVIGATION
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

    setupAdminAccess();

    const adminNavBtn =
        document.getElementById("adminNavBtn");

    if (adminNavBtn) {

        adminNavBtn.addEventListener("click", function () {

            const payload = getJwtPayload();

            if (!payload || payload.role !== "admin") {
                alert("Access denied. Admin only.");
                return;
            }

            setTimeout(() => {
                loadAdminStats();
            }, 100);

        });

    }


    /* =========================
       ADMIN SEARCH - ENTER KEY
       ========================= */

    const adminSearch =
        document.getElementById("adminUserSearch");

    if (adminSearch) {

        adminSearch.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                event.preventDefault();
                loadAdminUsers();
            }

        });

    }

});
function openAdminCommunities() {
    showPage("communities");
}   