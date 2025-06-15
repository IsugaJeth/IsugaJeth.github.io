const tabStates = {
  "_about-me": { tabs: [], active: null },
  "_projects": { tabs: [], active: null }
};


const projectVideoUrls = {
  'Project 1': '',
  'Project 2': 'https://www.youtube.com/embed/S_sC7oPJX8c?si=leAYX8xn0xACArvZ.',
  'Project 3': 'https://youtube.com/embed/D7KFDbxjgpE?si=dRGODFD90j9_My7v'
};

function saveStateToLocalStorage() {
  localStorage.setItem('tabStates', JSON.stringify(tabStates));
}

function loadStateFromLocalStorage() {
  const saved = localStorage.getItem('tabStates');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.keys(tabStates).forEach(key => {
      if (parsed[key]) {
        tabStates[key] = parsed[key];
      }
    });
  }
}

function setMainTab(tabId) {
  document.querySelectorAll('.main-tab').forEach(el => el.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';

  const mainSidebar = document.getElementById('main-sidebar');
  const projectsSidebar = document.getElementById('projects-sidebar');
  const skillsSidebar = document.getElementById('skills-sidebar');
  const videoSidebar = document.getElementById('video-sidebar');
  const subtabs = document.getElementById('subtabs');
  const mainNav = document.getElementById('main-nav');

  mainSidebar.style.display = 'none';
  projectsSidebar.style.display = 'none';
  skillsSidebar.style.display = 'none';
  videoSidebar.style.display = 'none';

  subtabs.style.display = 'none';
  subtabs.innerHTML = '';
  document.querySelectorAll('.tab-content').forEach(el => el.remove());

  if (mainNav && mainNav.classList.contains('active')) {
    mainNav.classList.remove('active');
  }

  if (tabId === '_about-me') {
    mainSidebar.style.display = 'block';
    subtabs.style.display = 'flex';

    const state = tabStates[tabId];

    if (state.tabs.length === 0) {
      openTab('bio');
    } else {
      state.tabs.forEach(tabName => createTab(tabName, false, '_about-me'));
      if (state.active) switchTab(state.active);
    }
  } else if (tabId === '_projects') {
    projectsSidebar.style.display = 'block';
    subtabs.style.display = 'flex';

    const state = tabStates[tabId];

    if (state.tabs.length === 0) {
      openProject('Project 1'); 
    } else {
      state.tabs.forEach(tabName => createTab(tabName, false, '_projects'));
      if (state.active) switchTab(state.active);
    }
  } else {
    skillsSidebar.style.display = 'none';
    videoSidebar.style.display = 'none';
  }
}

function openTab(name) {
  const currentMainTab = getCurrentMainTab();
  const state = tabStates[currentMainTab];

  if (document.getElementById(`tab-${name}`)) {
    switchTab(name);
    return;
  }

  state.tabs.push(name);
  state.active = name;
  createTab(name, true, currentMainTab);

  saveStateToLocalStorage();
}

function closeTab(name) {
  const currentMainTab = getCurrentMainTab();
  const state = tabStates[currentMainTab];
  const skillsSidebar = document.getElementById('skills-sidebar');
  const videoSidebar = document.getElementById('video-sidebar');
  const projectVideoFrame = document.getElementById('project-video-frame');

  const index = state.tabs.indexOf(name);
  if (index > -1) state.tabs.splice(index, 1);

  if (state.active === name) {
    state.active = state.tabs[state.tabs.length - 1] || null;
  }

  const tabElement = document.getElementById(`tab-${name}`);
  const contentElement = document.getElementById(`content-${name}`);
  if (tabElement) tabElement.remove();
  if (contentElement) contentElement.remove();

  if (state.active) {
    switchTab(state.active);
  } else {
    skillsSidebar.style.display = 'none';
    videoSidebar.style.display = 'none';
    if (projectVideoFrame) projectVideoFrame.src = "";
  }

  saveStateToLocalStorage();
}

function switchTab(name) {
  const currentMainTab = getCurrentMainTab();
  const state = tabStates[currentMainTab];
  const skillsSidebar = document.getElementById('skills-sidebar');
  const videoSidebar = document.getElementById('video-sidebar');
  const projectVideoFrame = document.getElementById('project-video-frame');

  state.active = name;

  document.querySelectorAll('.subtab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));

  const tab = document.getElementById(`tab-${name}`);
  const content = document.getElementById(`content-${name}`);

  if (tab) tab.classList.add('active');
  if (content) content.classList.add('active-tab');

  skillsSidebar.style.display = 'none'; 
  videoSidebar.style.display = 'none'; 
  if (projectVideoFrame) projectVideoFrame.src = ""; 

  if (currentMainTab === '_about-me') {
    if (name === 'bio') {
      skillsSidebar.style.display = 'block';
    }
  } else if (currentMainTab === '_projects') {
    const videoUrl = projectVideoUrls[name];
    if (videoUrl) {
      videoSidebar.style.display = 'block';
      if (projectVideoFrame) projectVideoFrame.src = videoUrl;
    }
  }

  saveStateToLocalStorage();
}

function createTab(name, switchTo = true, tabType) {
  const subtabs = document.getElementById('subtabs');
  const editor = document.getElementById('editor');

  const tab = document.createElement('div');
  tab.className = 'subtab';
  tab.id = `tab-${name}`;
  tab.innerHTML = `${name} <span class="close" onclick="closeTab('${name}')">x</span>`;
  tab.onclick = () => switchTab(name);
  subtabs.appendChild(tab);

  const content = document.createElement('div');
  content.className = 'tab-content';
  content.id = `content-${name}`;

  let paragraph = '';
  if (tabType === '_about-me') {
    switch (name) {
      case 'bio':
        paragraph = `<pre class="pre-large">/**
 * About me Jethro Isuga
 * Portfolio
 *
 * I am 20 year old and i have experience working with Microsoft Word and foundational
 * Skills in front-end web development using <span style = "Color: red">HTML</span>, <span style = "Color: yellow">CSS</span>, and <span style = "Color: blue">JavaScript</span>
 * I’m also learning <span style = "Color: orange">Java</span> and exploring <strong>object-oriented programming</strong>
 * I'm familiar with development tools like <u>Android Studio,</u>
 * <u>Visual Studio Code,</u> <u>NetBeans, and Microsoft Word</u>.
 * <strong><i>My goal is to grow into a Cybersecurity analyst or software developer.</strong></i>
 */</pre>`;
        break;
      case 'high-school':
        paragraph = `<pre class="pre-large">/**
 * High School days
 *
 * I graduated from <span style = "Color: red">University of the East</span>, where I first developed
 * An interest in computers and basic programming.
 * Although there was no IT-focused program available during my earlier years,
 * I pursued my interest by enrolling in the ICT - Illustration and Animation track
 * In senior high school to further develop my skills.
 */ </pre>`;
        break;
      case 'university':
        paragraph = `<pre class="pre-large">/**
 * University
 *
 * I became interested and study at <span style="color: rgba(30, 144, 255, 0.7);">National University - MOA</span>,
 * In software development, cybersecurity, and computer systems.
 * Where I’m exploring and learning my skills computer laboratories and knowledgeable IT teachers.
 * This experience inspired me to pursue my studies there, Currently,
 * I am enhancing my knowledge in software development, cybersecurity,
 * And computer systems by engaging in a comprehensive academic program and practical
 * Learning experiences, thereby equipping myself for a career in the technology
 * Industry.
 */</pre>`;
        break;
      default:
        paragraph = `<pre class="pre-large">/* ${name} content goes here */</pre>`;
    }
  } else if (tabType === '_projects') {
    switch (name) {
      case 'Project 1':
        paragraph = `<pre class="pre-large">/**
 * Portfolio Website
 *
 * This project is a personal portfolio website built using <span style="color: red;">HTML</span>, <span style="color: yellow;">CSS</span>, and <span style="color: blue;">JavaScript</span>.
 * It features a responsive design and dynamic tab functionality to showcase
 * My skills and projects. The design mimics a code editor interface.
 */</pre>`;
        break;
      case 'Project 2':
        paragraph = `<pre class="pre-large">/**
 * Library Management System with Simple Database
 *
 * This project is Databas System developed
 * using <span style="color: orange;">Java</span> in Netbeans.
 * It is a system designed to to manage various 
 * Library operations, encompassing user
 * Authentication, book management, member 
 * Administration, and transaction handling.
 * It features robust user authentication,
 * Comprehensive book and member management, 
 * And efficient handling of borrowing and 
 * Return transactions.
 */</pre>`;
        break;
      case 'Project 3':
        paragraph = `<pre class="pre-large">/**
 * Genshin Wiki
 *
 * This project is an Android Application developed 
 * using <span style="color: orange;">Java</span> in Android Studio.
 * It demonstrate the integration of multiple core
 * Functionalities of android such as activity
 * Navigation, user interface design, button 
 * Interactions and the use of multimedia.
 */</pre>`;
        break;
      default:
        paragraph = `<pre class="pre-large">/* ${name} content goes here */</pre>`;
    }
  }

  content.innerHTML = paragraph;
  editor.appendChild(content);

  if (switchTo) switchTab(name);
}

function getCurrentMainTab() {
  const visibleMain = Array.from(document.querySelectorAll('.main-tab'))
    .find(el => el.style.display === 'block');
  return visibleMain ? visibleMain.id : null;
}

function openProject(projectId) {
  const currentMainTab = getCurrentMainTab();
  const state = tabStates[currentMainTab];

  if (document.getElementById(`tab-${projectId}`)) {
    switchTab(projectId);
    return;
  }

  if (currentMainTab !== '_projects') {
    setMainTab('_projects');
  }

  state.tabs.push(projectId);
  state.active = projectId;
  createTab(projectId, true, '_projects');

  saveStateToLocalStorage();
}

loadStateFromLocalStorage();
setMainTab('_home');

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = document.getElementById('mobile-menu');
  const mainNav = document.getElementById('main-nav');

  if (mobileMenu && mainNav) {
    mobileMenu.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
});
