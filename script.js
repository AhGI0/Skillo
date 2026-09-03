/* Skillio application state + roadmap engine.
 * TODO: Replace local roadmap generation with an AI API.
 */
(() => {
  "use strict";

  const STORAGE_KEY = "skillioState.v1";
  const THEME_KEY = "skillioTheme.v1";

  const RESOURCES = {
    web: [
      {title:"MDN Web Docs", provider:"MDN", type:"Documentation", duration:"Self-paced", difficulty:"All levels", url:"https://developer.mozilla.org/en-US/docs/Learn_web_development"},
      {title:"MDN Core Web Development", provider:"MDN", type:"Curriculum", duration:"Self-paced", difficulty:"Beginner → Intermediate", url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core"},
      {title:"freeCodeCamp", provider:"freeCodeCamp", type:"Interactive course", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://www.freecodecamp.org/learn/"},
      {title:"The Odin Project", provider:"The Odin Project", type:"Curriculum", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://www.theodinproject.com/paths"},
      {title:"JavaScript.info", provider:"javascript.info", type:"Guide", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://javascript.info/"},
      {title:"web.dev", provider:"Google", type:"Guides", duration:"Self-paced", difficulty:"All levels", url:"https://web.dev/learn/"},
      {title:"React Learn", provider:"React", type:"Documentation", duration:"Self-paced", difficulty:"Intermediate", url:"https://react.dev/learn"},
      {title:"GitHub Skills", provider:"GitHub", type:"Interactive", duration:"Short courses", difficulty:"Beginner → Intermediate", url:"https://skills.github.com/"}
    ],
    python: [
      {title:"Python Tutorial", provider:"Python.org", type:"Documentation", duration:"Self-paced", difficulty:"Beginner", url:"https://docs.python.org/3/tutorial/"},
      {title:"Python Standard Library", provider:"Python.org", type:"Reference", duration:"Reference", difficulty:"Intermediate", url:"https://docs.python.org/3/library/"},
      {title:"CS50P", provider:"Harvard", type:"Course", duration:"~10 weeks", difficulty:"Beginner", url:"https://cs50.harvard.edu/python/"},
      {title:"Automate the Boring Stuff", provider:"Al Sweigart", type:"Book", duration:"Self-paced", difficulty:"Beginner", url:"https://automatetheboringstuff.com/"},
      {title:"Real Python", provider:"Real Python", type:"Tutorials", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://realpython.com/"},
      {title:"Exercism Python", provider:"Exercism", type:"Practice", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://exercism.org/tracks/python"}
    ],
    ai: [
      {title:"Python Tutorial", provider:"Python.org", type:"Documentation", duration:"Self-paced", difficulty:"Beginner", url:"https://docs.python.org/3/tutorial/"},
      {title:"NumPy Learn", provider:"NumPy", type:"Documentation", duration:"Self-paced", difficulty:"Beginner → Intermediate", url:"https://numpy.org/learn/"},
      {title:"scikit-learn User Guide", provider:"scikit-learn", type:"Documentation", duration:"Reference", difficulty:"Intermediate", url:"https://scikit-learn.org/stable/user_guide.html"},
      {title:"PyTorch Tutorials", provider:"PyTorch", type:"Practice", duration:"Self-paced", difficulty:"Intermediate → Advanced", url:"https://pytorch.org/tutorials/"},
      {title:"Hugging Face Course", provider:"Hugging Face", type:"Course", duration:"Self-paced", difficulty:"Intermediate → Advanced", url:"https://huggingface.co/learn"},
      {title:"Kaggle Learn", provider:"Kaggle", type:"Interactive", duration:"Short lessons", difficulty:"Beginner → Intermediate", url:"https://www.kaggle.com/learn"},
      {title:"DeepLearning.AI", provider:"DeepLearning.AI", type:"Courses", duration:"Self-paced", difficulty:"Intermediate → Advanced", url:"https://www.deeplearning.ai/courses/"}
    ],
    data: [
      {title:"Kaggle Learn", provider:"Kaggle", type:"Interactive", duration:"Short lessons", difficulty:"Beginner → Advanced", url:"https://www.kaggle.com/learn"},
      {title:"SQLBolt", provider:"SQLBolt", type:"Interactive", duration:"Short lessons", difficulty:"Beginner", url:"https://sqlbolt.com/"},
      {title:"Python Tutorial", provider:"Python.org", type:"Documentation", duration:"Self-paced", difficulty:"Beginner", url:"https://docs.python.org/3/tutorial/"},
      {title:"Pandas User Guide", provider:"pandas", type:"Documentation", duration:"Reference", difficulty:"Intermediate", url:"https://pandas.pydata.org/docs/user_guide/index.html"},
      {title:"scikit-learn User Guide", provider:"scikit-learn", type:"Documentation", duration:"Reference", difficulty:"Intermediate", url:"https://scikit-learn.org/stable/user_guide.html"},
      {title:"Microsoft Learn: Power BI", provider:"Microsoft", type:"Learning path", duration:"Self-paced", difficulty:"Beginner → Intermediate", url:"https://learn.microsoft.com/en-us/training/powerplatform/power-bi/"},
      {title:"Tableau Training", provider:"Tableau", type:"Training", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://www.tableau.com/learn/training"},
      {title:"Mode SQL Tutorial", provider:"Mode", type:"Tutorial", duration:"Self-paced", difficulty:"Beginner → Intermediate", url:"https://mode.com/sql-tutorial/"}
    ],
    cloud: [
      {title:"AWS Skill Builder", provider:"AWS", type:"Course", duration:"Self-paced", difficulty:"All levels", url:"https://skillbuilder.aws/"},
      {title:"AWS Documentation", provider:"AWS", type:"Documentation", duration:"Reference", difficulty:"All levels", url:"https://docs.aws.amazon.com/"},
      {title:"Microsoft Learn: Azure", provider:"Microsoft", type:"Learning", duration:"Self-paced", difficulty:"All levels", url:"https://learn.microsoft.com/en-us/azure/"},
      {title:"Google Cloud Skills Boost", provider:"Google Cloud", type:"Labs", duration:"Self-paced", difficulty:"All levels", url:"https://www.cloudskillsboost.google/"},
      {title:"Docker Get Started", provider:"Docker", type:"Documentation", duration:"Self-paced", difficulty:"Beginner", url:"https://docs.docker.com/get-started/"},
      {title:"Kubernetes Basics", provider:"Kubernetes", type:"Interactive tutorial", duration:"Self-paced", difficulty:"Intermediate", url:"https://kubernetes.io/docs/tutorials/kubernetes-basics/"},
      {title:"Terraform Tutorials", provider:"HashiCorp", type:"Tutorials", duration:"Self-paced", difficulty:"Intermediate", url:"https://developer.hashicorp.com/terraform/tutorials"}
    ],
    devops: [
      {title:"Docker Get Started", provider:"Docker", type:"Documentation", duration:"Self-paced", difficulty:"Beginner", url:"https://docs.docker.com/get-started/"},
      {title:"Kubernetes Basics", provider:"Kubernetes", type:"Interactive tutorial", duration:"Self-paced", difficulty:"Intermediate", url:"https://kubernetes.io/docs/tutorials/kubernetes-basics/"},
      {title:"GitHub Actions", provider:"GitHub", type:"Documentation", duration:"Self-paced", difficulty:"Intermediate", url:"https://docs.github.com/en/actions"},
      {title:"Terraform Tutorials", provider:"HashiCorp", type:"Tutorials", duration:"Self-paced", difficulty:"Intermediate", url:"https://developer.hashicorp.com/terraform/tutorials"},
      {title:"Prometheus Docs", provider:"Prometheus", type:"Documentation", duration:"Reference", difficulty:"Intermediate → Advanced", url:"https://prometheus.io/docs/"},
      {title:"roadmap.sh DevOps", provider:"roadmap.sh", type:"Roadmap", duration:"Reference", difficulty:"Beginner → Advanced", url:"https://roadmap.sh/devops"}
    ],
    design: [
      {title:"Figma Learn", provider:"Figma", type:"Course", duration:"Self-paced", difficulty:"Beginner", url:"https://help.figma.com/hc/en-us/categories/360002051613"},
      {title:"Material Design", provider:"Google", type:"Guidelines", duration:"Reference", difficulty:"All levels", url:"https://m3.material.io/"},
      {title:"Nielsen Norman Group", provider:"NN/g", type:"Articles", duration:"Self-paced", difficulty:"All levels", url:"https://www.nngroup.com/articles/"},
      {title:"Figma Community", provider:"Figma", type:"Templates & practice", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://www.figma.com/community"},
      {title:"Laws of UX", provider:"Jon Yablonski", type:"Reference", duration:"Short read", difficulty:"Beginner → Intermediate", url:"https://lawsofux.com/"}
    ],
    security: [
      {title:"OWASP Web Security Testing Guide", provider:"OWASP", type:"Guide", duration:"Reference", difficulty:"Intermediate → Advanced", url:"https://owasp.org/www-project-web-security-testing-guide/stable/"},
      {title:"PortSwigger Web Security Academy", provider:"PortSwigger", type:"Labs", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://portswigger.net/web-security"},
      {title:"OWASP Top 10", provider:"OWASP", type:"Reference", duration:"Short read", difficulty:"Beginner → Intermediate", url:"https://owasp.org/www-project-top-ten/"},
      {title:"OverTheWire", provider:"OverTheWire", type:"Practice", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://overthewire.org/wargames/"},
      {title:"picoCTF", provider:"Carnegie Mellon", type:"Practice", duration:"Self-paced", difficulty:"Beginner → Advanced", url:"https://picoctf.org/"}
    ]
  };

  const PATH_META = {
    frontend:{title:"Frontend Developer", icon:"⌘", desc:"Build accessible, responsive and interactive web applications.", theme:"web"},
    backend:{title:"Backend Developer", icon:"◈", desc:"Design APIs, databases and reliable server-side systems.", theme:"web"},
    fullstack:{title:"Full-Stack Developer", icon:"◆", desc:"Go from browser to database and ship complete products.", theme:"web"},
    ai:{title:"AI Engineer", icon:"✦", desc:"Build intelligent applications with ML, deep learning and LLMs.", theme:"ai"},
    ml:{title:"Machine Learning Engineer", icon:"⌁", desc:"Turn data into production machine learning systems.", theme:"ai"},
    python:{title:"Python Developer", icon:"🐍", desc:"Learn Python from fundamentals to production-ready apps.", theme:"python"},
    javascript:{title:"JavaScript Developer", icon:"JS", desc:"Master modern JavaScript and build real applications.", theme:"web"},
    react:{title:"React Developer", icon:"⚛", desc:"Build component-driven frontends with React.", theme:"web"},
    data_science:{title:"Data Scientist", icon:"◫", desc:"Use statistics, Python and ML to answer real questions with data.", theme:"data"},
    data_analyst:{title:"Data Analyst", icon:"▥", desc:"Turn raw data into insights, dashboards and decisions.", theme:"data"},
    devops:{title:"DevOps Engineer", icon:"∞", desc:"Automate delivery, infrastructure and reliable operations.", theme:"cloud"},
    cloud:{title:"Cloud Engineer", icon:"☁", desc:"Build secure, scalable workloads in the cloud.", theme:"cloud"},
    cybersecurity:{title:"Cybersecurity", icon:"◇", desc:"Learn security fundamentals, testing and defensive thinking.", theme:"security"},
    ux:{title:"UI/UX Designer", icon:"✎", desc:"Design useful, accessible and delightful digital experiences.", theme:"design"}
  };

  const PHASE_TEMPLATES = {
    frontend: [
      ["Web Foundations","Understand the web and build solid HTML/CSS foundations.",[
        ["How the Web Works","Understand browsers, servers, URLs and HTTP.",20,"Beginner",[],["web"]],
        ["HTML Fundamentals","Create structured pages with semantic HTML.",35,"Beginner",[0],["web"]],
        ["Semantic HTML","Use meaningful elements and document structure.",30,"Beginner",[1],["web"]],
        ["Forms","Build accessible, useful forms.",30,"Beginner",[2],["web"]],
        ["CSS Fundamentals","Style pages with the cascade, selectors and layout.",40,"Beginner",[1],["web"]],
        ["Flexbox","Build one-dimensional layouts confidently.",35,"Beginner",[4],["web"]],
        ["CSS Grid","Create robust two-dimensional layouts.",40,"Beginner",[5],["web"]],
        ["Responsive Design","Adapt interfaces across devices.",35,"Beginner",[6],["web"]],
        ["Accessibility","Build inclusive interfaces with semantics and keyboard support.",30,"Intermediate",[7],["web"]]
      ]],
      ["JavaScript","Make the browser interactive and learn programming fundamentals.",[
        ["Variables & Data Types","Store and work with information in JavaScript.",30,"Beginner",[8],["web"]],
        ["Conditions","Control program flow with boolean logic.",25,"Beginner",[9],["web"]],
        ["Loops","Repeat work safely with iteration.",25,"Beginner",[10],["web"]],
        ["Functions","Create reusable blocks with parameters and return values.",45,"Beginner",[11],["web"]],
        ["Arrays & Objects","Model collections and structured data.",45,"Beginner",[12],["web"]],
        ["DOM","Read and update the page with JavaScript.",45,"Beginner",[13],["web"]],
        ["Events","Respond to user interactions.",35,"Beginner",[14],["web"]],
        ["Async JavaScript","Understand callbacks, promises and async/await.",50,"Intermediate",[15],["web"]],
        ["Fetch API","Consume external APIs from the browser.",35,"Intermediate",[16],["web"]],
        ["Modern JavaScript","Use modules, destructuring and modern syntax.",40,"Intermediate",[17],["web"]]
      ]],
      ["Git & Developer Tools","Work like a professional developer.",[
        ["Git Basics","Track and manage source code history.",30,"Beginner",[18],["web"]],
        ["GitHub","Publish code and collaborate remotely.",30,"Beginner",[19],["web"]],
        ["Branches & Pull Requests","Work safely with branches and review.",35,"Intermediate",[20],["web"]],
        ["CLI & Debugging","Use the terminal and browser tools to diagnose issues.",40,"Intermediate",[21],["web"]]
      ]],
      ["React","Build component-driven frontend applications.",[
        ["React Fundamentals","Understand JSX, rendering and component thinking.",45,"Intermediate",[22],["web"]],
        ["Components & Props","Compose reusable UI pieces.",40,"Intermediate",[23],["web"]],
        ["State & Hooks","Build interactive stateful experiences.",50,"Intermediate",[24],["web"]],
        ["Routing & Forms","Create multi-view apps and robust forms.",50,"Intermediate",[25],["web"]],
        ["API Integration","Connect React apps to backend services.",45,"Intermediate",[26],["web"]],
        ["Performance & Architecture","Structure maintainable, fast applications.",55,"Advanced",[27],["web"]]
      ]],
      ["Projects","Turn knowledge into proof.",[
        ["Project: Landing Page","Recreate a polished responsive landing page.",120,"Beginner",[28],["web"],"project"],
        ["Project: Weather App","Build an API-powered weather experience.",240,"Intermediate",[29],["web"],"project"],
        ["Project: Analytics Dashboard","Create a responsive dashboard with real data.",360,"Intermediate",[30],["web"],"project"],
        ["Project: E-commerce Frontend","Build product browsing, cart and responsive UI.",600,"Advanced",[31],["web"],"project"],
        ["Project: Portfolio","Ship a personal portfolio that tells your story.",360,"Intermediate",[32],["web"],"project"]
      ]],
      ["Job Ready","Package your work and prepare to apply.",[
        ["Portfolio Polish","Present your strongest projects with context.",120,"Intermediate",[33],["web"]],
        ["GitHub Profile","Make your repositories easy to evaluate.",60,"Beginner",[34],["web"]],
        ["CV & LinkedIn","Translate projects into evidence and outcomes.",90,"Beginner",[35],["web"]],
        ["Interview Preparation","Practice technical and behavioral interviews.",180,"Intermediate",[36],["web"]],
        ["Job Applications","Create a consistent, targeted application workflow.",120,"Beginner",[37],["web"]]
      ]]
    ],
    backend: [
      ["Programming Foundations","Learn the core thinking needed for server-side development.",[
        ["Python / JavaScript Foundations","Choose a language and master syntax, data and control flow.",90,"Beginner",[],["python"]],
        ["Functions & Modules","Organize reusable application logic.",50,"Beginner",[0],["python"]],
        ["HTTP & APIs","Understand requests, responses, headers and status codes.",55,"Beginner",[1],["web"]]
      ]],
      ["Backend Core","Build APIs backed by durable data.",[
        ["REST API Design","Design predictable API endpoints.",60,"Intermediate",[2],["web"]],
        ["Databases & SQL","Model relational data and query it with SQL.",90,"Intermediate",[3],["data"]],
        ["Authentication","Implement sessions, tokens and access control.",90,"Intermediate",[4],["web"]],
        ["Validation & Error Handling","Make APIs robust and predictable.",50,"Intermediate",[5],["web"]],
        ["Testing","Test business logic and endpoints.",75,"Intermediate",[6],["web"]]
      ]],
      ["Production","Turn an API into a reliable service.",[
        ["Caching","Reduce latency and repeated work.",60,"Advanced",[7],["web"]],
        ["Background Jobs","Move slow work out of request cycles.",60,"Advanced",[8],["web"]],
        ["Docker","Containerize services consistently.",70,"Intermediate",[9],["cloud"]],
        ["Deployment","Ship your backend to a production environment.",100,"Intermediate",[10],["cloud"]]
      ]],
      ["Projects","Prove your backend skills.",[
        ["Project: REST API","Build a documented CRUD API.",300,"Intermediate",[11],["web"],"project"],
        ["Project: Auth Service","Build a secure authentication service.",360,"Advanced",[12],["web"],"project"],
        ["Project: Production App","Deploy a complete backend with persistence.",600,"Advanced",[13],["cloud"],"project"]
      ]]
    ],
    ai: [
      ["Python","Build the programming foundation for AI.",[
        ["Python Fundamentals","Learn syntax, data structures and control flow.",60,"Beginner",[],["python"]],
        ["Functions & OOP","Build reusable and structured Python programs.",70,"Beginner",[0],["python"]],
        ["NumPy & Data Handling","Work efficiently with numerical data.",60,"Beginner",[1],["data"]]
      ]],
      ["Mathematics & Data","Build intuition for the math behind models.",[
        ["Statistics","Understand distributions, variance, sampling and evaluation.",90,"Intermediate",[2],["data"]],
        ["Linear Algebra","Learn vectors, matrices and transformations.",120,"Intermediate",[3],["data"]],
        ["Data Preparation","Clean, transform and split real datasets.",80,"Intermediate",[4],["data"]]
      ]],
      ["Machine Learning","Learn the model-building loop.",[
        ["Supervised Learning","Train models for prediction and classification.",120,"Intermediate",[5],["ai"]],
        ["Model Evaluation","Choose metrics and avoid common evaluation mistakes.",70,"Intermediate",[6],["ai"]],
        ["Feature Engineering","Create useful model inputs.",90,"Intermediate",[7],["ai"]],
        ["Unsupervised Learning","Explore clustering and representation methods.",90,"Intermediate",[8],["ai"]]
      ]],
      ["Deep Learning & LLMs","Build modern neural and language-model applications.",[
        ["Neural Networks","Understand layers, activations and training.",120,"Intermediate",[9],["ai"]],
        ["PyTorch","Build and train neural networks in code.",140,"Advanced",[10],["ai"]],
        ["Transformers","Understand the architecture behind modern language models.",130,"Advanced",[11],["ai"]],
        ["LLM Engineering","Use prompting, retrieval and evaluation patterns.",120,"Advanced",[12],["ai"]]
      ]],
      ["AI Projects","Turn models into useful products.",[
        ["Project: Prediction App","Train and deploy a small ML model.",300,"Intermediate",[13],["ai"],"project"],
        ["Project: Computer Vision","Build an image classification prototype.",420,"Advanced",[14],["ai"],"project"],
        ["Project: RAG Assistant","Build a retrieval-augmented application.",500,"Advanced",[15],["ai"],"project"]
      ]],
      ["Deployment & Career","Make AI systems usable in the real world.",[
        ["Model Serving","Expose inference behind an API.",100,"Advanced",[16],["web"]],
        ["Monitoring","Track drift, latency and model behavior.",80,"Advanced",[17],["cloud"]],
        ["AI Portfolio","Document experiments and outcomes clearly.",120,"Intermediate",[18],["web"]]
      ]]
    ],
    data_science: [
      ["Python & SQL","Learn the languages of data work.",[
        ["Python for Data","Use Python for analysis and automation.",70,"Beginner",[],["python"]],
        ["SQL Foundations","Query structured data confidently.",75,"Beginner",[0],["data"]],
        ["Pandas","Transform and analyze tabular datasets.",80,"Intermediate",[1],["data"]]
      ]],
      ["Statistics","Learn to reason from data.",[
        ["Descriptive Statistics","Summarize distributions and relationships.",70,"Beginner",[2],["data"]],
        ["Probability","Reason about uncertainty and random events.",90,"Intermediate",[3],["data"]],
        ["Experimentation","Design and interpret controlled experiments.",90,"Intermediate",[4],["data"]]
      ]],
      ["Machine Learning","Build predictive models.",[
        ["Regression","Predict continuous outcomes.",90,"Intermediate",[5],["ai"]],
        ["Classification","Predict categories and understand tradeoffs.",90,"Intermediate",[6],["ai"]],
        ["Model Evaluation","Measure, compare and validate models.",70,"Intermediate",[7],["ai"]]
      ]],
      ["Projects","Create a portfolio of analyses.",[
        ["Project: Business Analysis","Answer a real business question with data.",240,"Intermediate",[8],["data"],"project"],
        ["Project: ML Case Study","Build, evaluate and explain a predictive model.",360,"Intermediate",[9],["ai"],"project"],
        ["Project: End-to-End Portfolio","Create a polished end-to-end data project.",480,"Advanced",[10],["data"],"project"]
      ]]
    ],
    ux: [
      ["UX Foundations","Learn how people, problems and products connect.",[
        ["User Research","Gather evidence about people and their needs.",90,"Beginner",[],["design"]],
        ["Problem Framing","Turn observations into useful problem statements.",60,"Beginner",[0],["design"]],
        ["Information Architecture","Organize content so people can find what matters.",90,"Beginner",[1],["design"]]
      ]],
      ["Interface Design","Turn structure into usable interfaces.",[
        ["Visual Hierarchy","Use typography, spacing and contrast intentionally.",80,"Beginner",[2],["design"]],
        ["Figma Foundations","Create and edit digital interface designs.",60,"Beginner",[3],["design"]],
        ["Design Systems","Create reusable visual and interaction patterns.",100,"Intermediate",[4],["design"]],
        ["Accessibility","Design interfaces that work for more people.",60,"Intermediate",[5],["design"]]
      ]],
      ["Prototyping & Testing","Validate ideas before they become expensive.",[
        ["Wireframing","Explore structure quickly.",60,"Beginner",[6],["design"]],
        ["Prototyping","Build realistic interaction flows.",90,"Intermediate",[7],["design"]],
        ["Usability Testing","Learn from users and iterate.",80,"Intermediate",[8],["design"]]
      ]],
      ["Portfolio","Show how you think, not just what you made.",[
        ["Case Study: Mobile App","Document research, decisions and outcomes.",240,"Intermediate",[9],["design"],"project"],
        ["Case Study: Web Product","Design a complete web product experience.",300,"Intermediate",[10],["design"],"project"],
        ["Portfolio & Presentation","Package your work for opportunities.",180,"Intermediate",[11],["design"],"project"]
      ]]
    ]
  };

  const defaultPath = "frontend";

  let state = loadState();
  let selectedPath = state.roadmap?.id ? state.roadmap.id : defaultPath;
  let currentNodeId = null;
  let currentProjectId = null;

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function deepClone(v){ return JSON.parse(JSON.stringify(v)); }

  function loadState(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw) return JSON.parse(raw);
    } catch(e){}
    return {user:{goal:""},roadmap:null,progress:{completedLessons:[],completedProjects:[],projectChecks:{},currentLesson:"",totalHours:0,streak:0,lastActiveDate:"",roadmapCreationDate:""}};
  }
  function saveState(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function todayKey(){ return new Date().toISOString().slice(0,10); }

  function addDays(dateKey, delta){
    const d = new Date(dateKey+"T00:00:00"); d.setDate(d.getDate()+delta); return d.toISOString().slice(0,10);
  }

  function touchActivity(){
    const today = todayKey();
    if(state.progress.lastActiveDate !== today){
      if(state.progress.lastActiveDate === addDays(today,-1)) state.progress.streak = Math.max(1,(state.progress.streak||0)+1);
      else state.progress.streak = 1;
      state.progress.lastActiveDate = today;
    }
    saveState();
  }

  function inferPath(goal){
    const g = String(goal||"").toLowerCase();
    const tests = [
      ["cybersecurity",["cybersecurity","cyber security","penetration","ethical hacking","security engineer"]],
      ["ux",["ui/ux","ux","ui designer","product designer","figma"]],
      ["devops",["devops","site reliability","sre"]],
      ["cloud",["cloud","aws","azure","gcp"]],
      ["data_science",["data scientist","data science","machine learning","ml engineer","machine learning engineer"]],
      ["data_analyst",["data analyst","analytics analyst","business analyst"]],
      ["ai",["ai engineer","artificial intelligence","llm","genai","generative ai"]],
      ["react",["react developer","learn react","react.js","reactjs"]],
      ["javascript",["javascript developer","learn javascript","js developer"]],
      ["python",["python developer","learn python","python programming"]],
      ["fullstack",["full-stack","full stack"]],
      ["backend",["backend","back-end","server-side"]],
      ["frontend",["frontend","front-end","web developer","website developer"]]
    ];
    for(const [id,words] of tests) if(words.some(w=>g.includes(w))) return id;
    if(g.includes("developer")) return "fullstack";
    return null;
  }

  function starterCandidates(goal){
    const all = Object.entries(PATH_META);
    const q = String(goal||"").toLowerCase();
    return all.filter(([id,m]) => m.title.toLowerCase().includes(q) || id.includes(q)).slice(0,6);
  }

  // Compact, path-specific starter curricula for every built-in path.
  const EXTRA_TEMPLATES = {
    javascript: [
      ["Language Foundations","Learn the language before you build with it.",[["Syntax & Variables","Expressions, statements, variables and strict mode.",35,"Beginner",[],["web"]],["Data Types","Primitives, objects, coercion and equality.",40,"Beginner",[0],["web"]],["Control Flow","Conditions, loops and error-safe branching.",40,"Beginner",[1],["web"]],["Functions","Parameters, scope, closures and return values.",50,"Beginner",[2],["web"]]]],
      ["Collections & Objects","Model information and transform it cleanly.",[["Arrays","Create, transform, search and reduce collections.",45,"Beginner",[3],["web"]],["Objects","Work with properties, methods and object patterns.",45,"Beginner",[4],["web"]],["Destructuring & Spread","Write modern, expressive JavaScript.",35,"Intermediate",[5],["web"]],["Modules","Split code into reusable modules.",40,"Intermediate",[6],["web"]]]],
      ["Browser JavaScript","Connect language knowledge to the browser.",[["DOM","Read and update the document.",45,"Beginner",[7],["web"]],["Events","Build interaction-driven interfaces.",35,"Beginner",[8],["web"]],["Async JavaScript","Promises, async/await and error handling.",50,"Intermediate",[9],["web"]],["Fetch & APIs","Consume external APIs and JSON.",40,"Intermediate",[10],["web"]]]],
      ["Projects","Turn fluency into proof.",[["Project: Quiz App","Build a browser app with state and events.",240,"Intermediate",[11],["web"],"project"],["Project: API Dashboard","Build a data-driven browser application.",360,"Intermediate",[12],["web"],"project"]]]
    ],
    react: [
      ["JavaScript Prerequisites","React is easier when JavaScript fundamentals are solid.",[["Modern JavaScript","Modules, destructuring, array methods and async code.",70,"Intermediate",[],["web"]],["DOM & Events","Understand the browser model React abstracts.",60,"Intermediate",[0],["web"]]]],
      ["React Core","Build component-driven interfaces.",[["React Fundamentals","JSX, rendering and component thinking.",50,"Intermediate",[1],["web"]],["Props & Composition","Compose reusable UI through data flow.",45,"Intermediate",[2],["web"]],["State & Events","Build interactive experiences with state.",55,"Intermediate",[3],["web"]],["Hooks","Use useState, useEffect and custom hooks appropriately.",60,"Intermediate",[4],["web"]]]],
      ["Production React","Structure apps that can grow.",[["Routing","Build multiple application views.",50,"Intermediate",[5],["web"]],["Forms & Validation","Handle user input reliably.",50,"Intermediate",[6],["web"]],["API Integration","Connect UI to remote data.",50,"Intermediate",[7],["web"]],["Performance","Avoid unnecessary work and improve UX.",55,"Advanced",[8],["web"]]]],
      ["Projects","Create portfolio-quality React work.",[["Project: Dashboard","Build a responsive analytics interface.",360,"Intermediate",[9],["web"],"project"],["Project: Product App","Build browsing, state and API flows.",500,"Advanced",[10],["web"],"project"],["Project: Portfolio","Ship a polished personal site.",360,"Intermediate",[11],["web"],"project"]]]
    ],
    fullstack: [
      ["Web Foundations","Master the browser and core programming.",[["HTML & CSS","Build semantic, responsive interfaces.",70,"Beginner",[],["web"]],["JavaScript","Learn programming and browser interaction.",90,"Beginner",[0],["web"]],["Git & GitHub","Track work and collaborate.",45,"Beginner",[1],["web"]]]],
      ["Frontend","Build production-ready user interfaces.",[["React Fundamentals","Build with components and state.",90,"Intermediate",[2],["web"]],["Routing & Forms","Build useful application flows.",75,"Intermediate",[3],["web"]],["API Integration","Connect frontend to services.",60,"Intermediate",[4],["web"]]]],
      ["Backend & Data","Build services and persistent systems.",[["Node / Backend Fundamentals","Understand servers and runtime concepts.",75,"Intermediate",[5],["web"]],["REST APIs","Design predictable endpoints.",70,"Intermediate",[6],["web"]],["SQL & Data Modeling","Store and query application data.",90,"Intermediate",[7],["data"]],["Authentication","Protect users and resources.",90,"Advanced",[8],["web"]]]],
      ["Deployment","Ship the whole product.",[["Docker","Package services consistently.",70,"Intermediate",[9],["cloud"]],["CI/CD","Automate testing and deployment.",70,"Intermediate",[10],["devops"]],["Cloud Deployment","Run the application for real users.",100,"Intermediate",[11],["cloud"]]]],
      ["Portfolio Projects","Build evidence that you can own a full product.",[["Project: SaaS MVP","Build a full-stack product from zero.",700,"Advanced",[12],["web"],"project"],["Project: E-commerce","Build catalog, auth, cart and checkout flows.",900,"Advanced",[13],["web"],"project"],["Portfolio Case Study","Document architecture and outcomes.",180,"Intermediate",[14],["web"],"project"]]]
    ],
    data_analyst: [
      ["Data Foundations","Learn the tools and thinking behind analysis.",[["Spreadsheet Fundamentals","Formulas, tables, cleaning and analysis workflows.",60,"Beginner",[],["data"]],["SQL Foundations","Select, filter, group and join data.",75,"Beginner",[0],["data"]],["Data Types & Quality","Understand missing values, duplicates and consistency.",55,"Beginner",[1],["data"]]]],
      ["Analysis","Turn questions into defensible analysis.",[["Descriptive Statistics","Summaries, distributions and variability.",75,"Intermediate",[2],["data"]],["Exploratory Analysis","Find patterns, outliers and relationships.",90,"Intermediate",[3],["data"]],["Business Metrics","Define KPIs such as conversion, retention and revenue.",70,"Intermediate",[4],["data"]]]],
      ["Visualization & BI","Communicate what the data means.",[["Data Visualization","Choose effective charts and encodings.",65,"Intermediate",[5],["data"]],["Power BI / Tableau","Build interactive dashboards.",100,"Intermediate",[6],["data"]],["Storytelling with Data","Present insights with a clear narrative.",60,"Intermediate",[7],["data"]]]],
      ["Projects & Career","Prove that your analysis drives decisions.",[["Project: Sales Analysis","Analyze a realistic sales dataset and recommendations.",300,"Intermediate",[8],["data"],"project"],["Project: Executive Dashboard","Build a decision-ready dashboard.",360,"Intermediate",[9],["data"],"project"],["Portfolio Case Study","Write the business question, method and impact.",180,"Intermediate",[10],["data"],"project"]]]
    ],
    ml: [
      ["Python & Math","Build the foundations for model work.",[["Python for ML","Write clean, testable Python data workflows.",70,"Beginner",[],["python"]],["NumPy & Pandas","Manipulate numerical and tabular data.",80,"Beginner",[0],["data"]],["Statistics","Reason about variation and uncertainty.",100,"Intermediate",[1],["data"]],["Linear Algebra","Understand vectors, matrices and transformations.",110,"Intermediate",[2],["data"]]]],
      ["Classical Machine Learning","Learn the core supervised and unsupervised workflow.",[["Data Preparation","Split, clean and transform datasets.",80,"Intermediate",[3],["data"]],["Regression","Build and evaluate predictive models.",90,"Intermediate",[4],["ai"]],["Classification","Handle categories and class imbalance.",90,"Intermediate",[5],["ai"]],["Model Evaluation","Use metrics, validation and error analysis.",80,"Intermediate",[6],["ai"]]]],
      ["Advanced ML","Go beyond baselines.",[["Feature Engineering","Create useful model representations.",90,"Intermediate",[7],["ai"]],["Ensembles","Use trees and ensemble techniques.",90,"Intermediate",[8],["ai"]],["Unsupervised Learning","Cluster and reduce dimensions.",90,"Intermediate",[9],["ai"]],["Experiment Tracking","Compare experiments reproducibly.",60,"Advanced",[10],["ai"]]]],
      ["Production ML","Turn models into systems.",[["Model Serving","Expose inference through an API.",100,"Advanced",[11],["web"]],["Pipelines","Automate training and data workflows.",110,"Advanced",[12],["cloud"]],["Monitoring","Track model and system health.",80,"Advanced",[13],["cloud"]],["Project: Production ML System","Build an end-to-end ML service.",600,"Advanced",[14],["ai"],"project"]]]
    ],
  };
  Object.assign(PHASE_TEMPLATES, EXTRA_TEMPLATES);

  function ensureAllTemplates(){
    const generic = {
      backend: [["Programming Foundations","Learn the core programming concepts required on the server.",[["Language Fundamentals","Syntax, data structures and control flow.",70,"Beginner",[],["python"]],["Functions & Modules","Organize reusable application logic.",55,"Beginner",[0],["python"]],["HTTP Fundamentals","Understand requests, responses and status codes.",55,"Beginner",[1],["web"]]]],["Backend Core","Build useful and reliable services.",[["REST APIs","Design predictable endpoints.",70,"Intermediate",[2],["web"]],["SQL & Databases","Model and query relational data.",90,"Intermediate",[3],["data"]],["Authentication","Protect users and resources.",90,"Intermediate",[4],["web"]],["Testing","Verify behavior automatically.",75,"Intermediate",[5],["web"]]]],["Production","Ship software confidently.",[["Docker","Containerize applications.",70,"Intermediate",[6],["cloud"]],["CI/CD","Automate checks and deployment.",70,"Intermediate",[7],["devops"]],["Deployment","Run the API in production.",100,"Intermediate",[8],["cloud"]]]],["Projects", "Build production-style backend systems.",[["Project: REST API","Build a documented CRUD service.",300,"Intermediate",[9],["web"],"project"],["Project: Auth Service","Build secure authentication and authorization.",360,"Advanced",[10],["web"],"project"]]]],
      cloud: [["Cloud Foundations","Understand networking, compute, storage and IAM.",[["Cloud Concepts","Regions, availability, elasticity and shared responsibility.",60,"Beginner",[],["cloud"]],["Networking","VPCs, subnets, DNS and routing.",90,"Intermediate",[0],["cloud"]],["Identity & Access","Principle of least privilege and IAM.",75,"Intermediate",[1],["cloud"]]]],["Cloud Services","Build on managed infrastructure.",[["Compute","Run workloads using virtual machines and containers.",80,"Intermediate",[2],["cloud"]],["Storage & Databases","Choose managed storage and data services.",80,"Intermediate",[3],["cloud"]],["Serverless","Build event-driven cloud functions.",75,"Intermediate",[4],["cloud"]]]],["Infrastructure as Code","Automate infrastructure.",[["Terraform","Declare and manage infrastructure as code.",90,"Intermediate",[5],["cloud"]],["Observability","Logs, metrics and alerts.",75,"Intermediate",[6],["cloud"]],["Cost & Reliability","Design for efficient, resilient systems.",70,"Advanced",[7],["cloud"]]]],["Projects", "Prove you can design and ship cloud workloads.",[["Project: Cloud App","Deploy a secure application with monitoring.",480,"Advanced",[8],["cloud"],"project"],["Project: Infrastructure","Provision a repeatable environment as code.",360,"Advanced",[9],["cloud"],"project"]]]],
      devops: [["Foundations","Learn Linux, Git, networking and delivery concepts.",[["Linux & CLI","Work comfortably in shells and filesystems.",70,"Beginner",[],["devops"]],["Git","Branch, merge and review code.",50,"Beginner",[0],["web"]],["Networking Basics","DNS, HTTP, ports and troubleshooting.",70,"Intermediate",[1],["cloud"]]]],["Containers & CI/CD","Automate consistent software delivery.",[["Docker","Package applications as containers.",70,"Intermediate",[2],["devops"]],["CI/CD","Automate builds, tests and releases.",80,"Intermediate",[3],["devops"]],["GitHub Actions","Create practical deployment workflows.",70,"Intermediate",[4],["devops"]]]],["Infrastructure & Orchestration","Operate workloads reliably.",[["Terraform","Manage infrastructure as code.",90,"Intermediate",[5],["devops"]],["Kubernetes","Deploy and operate containerized workloads.",120,"Advanced",[6],["devops"]],["Monitoring & Logging","Observe systems and respond to failures.",90,"Advanced",[7],["devops"]]]],["Projects","Build an operations portfolio.",[["Project: CI/CD Pipeline","Automate test and deployment for an application.",300,"Intermediate",[8],["devops"],"project"],["Project: Container Platform","Deploy an application to Kubernetes.",500,"Advanced",[9],["devops"],"project"]]]],
      cybersecurity: [["Security Foundations","Learn how systems fail and how to reason about risk.",[["Networking Fundamentals","Understand packets, protocols and common services.",90,"Beginner",[],["security"]],["Linux Fundamentals","Use the command line for investigation.",80,"Beginner",[0],["security"]],["Threat Modeling","Identify assets, threats and attack paths.",70,"Intermediate",[1],["security"]]]],["Web & Application Security","Learn common vulnerabilities and testing.",[["OWASP Top 10","Understand major web application risk categories.",80,"Intermediate",[2],["security"]],["Authentication Security","Sessions, access control and common failures.",80,"Intermediate",[3],["security"]],["Web Testing","Practice structured security testing.",120,"Intermediate",[4],["security"]]]],["Blue Team & Detection","Learn to monitor and respond.",[["Logs & Monitoring","Recognize useful security signals.",80,"Intermediate",[5],["security"]],["Incident Response","Contain, investigate and learn from incidents.",90,"Intermediate",[6],["security"]],["Security Automation","Use scripts and repeatable workflows.",90,"Intermediate",[7],["python"]]]],["Projects","Turn security skills into evidence.",[["Project: Web Security Lab","Document findings from a safe training lab.",360,"Intermediate",[8],["security"],"project"],["Project: Detection Lab","Build a small monitoring and alerting environment.",420,"Advanced",[9],["security"],"project"]]]],
      data_analyst: [],
      data_science: PHASE_TEMPLATES.data_science,
      ux: PHASE_TEMPLATES.ux,
      ai: PHASE_TEMPLATES.ai,
      python: [["Python Foundations","Learn a professional Python baseline.",[["Syntax & Data","Variables, collections and expressions.",50,"Beginner",[],["python"]],["Control Flow","Conditions and loops.",45,"Beginner",[0],["python"]],["Functions","Parameters, scope and reuse.",55,"Beginner",[1],["python"]]]],["Python Fluency","Build maintainable programs.",[["Modules & Packages","Structure code and use the ecosystem.",60,"Beginner",[2],["python"]],["OOP","Model behavior with classes when appropriate.",70,"Intermediate",[3],["python"]],["Files & APIs","Read data and consume services.",70,"Intermediate",[4],["python"]]]],["Quality & Tooling","Work like a professional.",[["Testing","Write useful automated tests.",65,"Intermediate",[5],["python"]],["Typing & Tooling","Improve readability and developer experience.",60,"Intermediate",[6],["python"]],["Packaging & Environments","Manage dependencies and reproducibility.",70,"Intermediate",[7],["python"]]]],["Projects","Build real Python applications.",[["Project: CLI Tool","Build and package a useful command-line app.",240,"Intermediate",[8],["python"],"project"],["Project: API App","Build a Python service with persistence.",420,"Advanced",[9],["web"],"project"]]]],
      javascript: PHASE_TEMPLATES.javascript,
      react: PHASE_TEMPLATES.react,
      fullstack: PHASE_TEMPLATES.fullstack
    };
    for(const [id,temp] of Object.entries(generic)) if(!PHASE_TEMPLATES[id] || PHASE_TEMPLATES[id].length===0) PHASE_TEMPLATES[id]=temp;
  }
  ensureAllTemplates();

  function buildRoadmap(pathId, goalText){
    const meta = PATH_META[pathId];
    const template = PHASE_TEMPLATES[pathId];
    if(!meta || !template) throw new Error(`No roadmap template configured for path: ${pathId}`);
    let idx = 0;
    const phases = template.map(([title,description,nodes]) => ({
      id:`${pathId}-phase-${slug(title)}-${Math.random().toString(36).slice(2,6)}`,
      title,description,nodes:nodes.map((n) => ({
        id:`${pathId}-node-${idx++}-${slug(n[0])}`,
        title:n[0],description:n[1],duration:n[2],difficulty:n[3],
        prerequisites:n[4].map(i=>i), resourceTheme:n[5][0],
        type:n[6]||"lesson"
      }))
    }));
    // Convert template-local prerequisite indexes into globally valid node ids.
    const flat=[]; phases.forEach(p=>p.nodes.forEach(n=>flat.push(n)));
    phases.forEach(p=>p.nodes.forEach(n=>{
      n.prerequisites = n.prerequisites.map(i => flat[i]?.id).filter(Boolean);
    }));
    return {
      id:pathId,title:meta.title,description:meta.desc,goal:goalText || meta.title,
      phases,createdAt:new Date().toISOString()
    };
  }

  function ensureInitialJourney(){
    if(!state.roadmap){
      state.roadmap = buildRoadmap(defaultPath,"Frontend Developer");
      state.user.goal="Frontend Developer";
      state.progress.currentLesson = firstAvailableNodeId(state.roadmap) || "";
      state.progress.lastActiveDate=todayKey();
      state.progress.streak=1;
      state.progress.roadmapCreationDate=state.roadmap.createdAt;
      saveState();
    }
  }

  function nodeById(id){
    return state.roadmap?.phases.flatMap(p=>p.nodes).find(n=>n.id===id) || null;
  }
  function isComplete(node){
    return node?.type==="project" ? state.progress.completedProjects.includes(node.id) : state.progress.completedLessons.includes(node.id);
  }
  function prerequisitesMet(node){
    return (node?.prerequisites||[]).every(id=>isComplete(nodeById(id)));
  }
  function statusFor(node){
    if(isComplete(node)) return "completed";
    if(!prerequisitesMet(node)) return "locked";
    if(state.progress.currentLesson===node.id) return "current";
    return "upcoming";
  }
  function firstAvailableNodeId(roadmap=state.roadmap){
    const flat=roadmap?.phases.flatMap(p=>p.nodes)||[];
    const current = flat.find(n=>n.id===state.progress.currentLesson && !isComplete(n) && prerequisitesMet(n));
    if(current) return current.id;
    return flat.find(n=>!isComplete(n) && prerequisitesMet(n))?.id || "";
  }

  function ensureCurrent(){
    const next=firstAvailableNodeId();
    state.progress.currentLesson=next;
    saveState();
  }

  function totals(){
    const nodes = state.roadmap?.phases.flatMap(p=>p.nodes)||[];
    const lessons=nodes.filter(n=>n.type!=="project"), projects=nodes.filter(n=>n.type==="project");
    const completedLessons=lessons.filter(isComplete).length, completedProjects=projects.filter(isComplete).length;
    const overall=nodes.length ? Math.round(((completedLessons+completedProjects)/nodes.length)*100) : 0;
    return {nodes,lessons,projects,completedLessons,completedProjects,overall};
  }

  function phaseProgress(phase){
    const total=phase.nodes.length, done=phase.nodes.filter(isComplete).length;
    return {done,total,pct:total?Math.round(done/total*100):0};
  }

  function hoursFromNode(node){ return (Number(node.duration)||30)/60; }

  function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}

  function createGoal(goal){
    const inferred=inferPath(goal);
    if(inferred){
      selectedPath=inferred;
      state.roadmap=buildRoadmap(inferred,goal);
      state.user.goal=goal;
      state.progress={completedLessons:[],completedProjects:[],projectChecks:{},currentLesson:"",totalHours:0,streak:state.progress.streak||1,lastActiveDate:state.progress.lastActiveDate||"",roadmapCreationDate:state.roadmap.createdAt};
      ensureCurrent(); touchActivity(); saveState();
      renderAll();
      showToast(`${state.roadmap.title} roadmap created. Start with "${nodeById(state.progress.currentLesson)?.title}".`,"success");
      scrollToSection("roadmaps");
    } else {
      showPathChooser(goal);
    }
  }

  function showPathChooser(goal){
    const picks = starterCandidates(goal);
    const choices = picks.length ? picks : Object.entries(PATH_META).filter(([id])=>["frontend","backend","fullstack","ai"].includes(id));
    const canvas=$("#roadmapCanvas");
    $("#roadmapTitle").textContent="Choose your direction";
    $("#roadmapSubtitle").textContent=`We couldn't map "${goal}" to one path yet. Pick the closest starting point.`;
    canvas.innerHTML = `<div class="panel" style="padding:28px"><div class="path-grid">${choices.map(([id,m])=>`
      <button class="path-card" data-pick-path="${id}" style="text-align:left">
        <div class="path-icon">${m.icon}</div><h3>${m.title}</h3><p>${m.desc}</p><span class="text-btn">Use this path →</span>
      </button>`).join("")}</div></div>`;
    $$("#roadmapCanvas [data-pick-path]").forEach(b=>b.addEventListener("click",()=>{
      const id=b.dataset.pickPath;
      selectedPath=id;
      state.roadmap=buildRoadmap(id,goal); state.user.goal=goal;
      state.progress={completedLessons:[],completedProjects:[],projectChecks:{},currentLesson:"",totalHours:0,streak:state.progress.streak||1,lastActiveDate:state.progress.lastActiveDate||"",roadmapCreationDate:state.roadmap.createdAt};
      ensureCurrent(); touchActivity(); renderAll(); scrollToSection("roadmaps");
    }));
    scrollToSection("roadmaps");
  }

  function renderJourney(){
    const empty=!state.roadmap;
    $("#journeyEmpty").classList.toggle("hidden",!empty);
    $("#journeyContent").classList.toggle("hidden",empty);
    if(empty) return;
    const t=totals(); const current=nodeById(state.progress.currentLesson) || nodeById(firstAvailableNodeId());
    $("#continueTitle").textContent=current?.title || "Roadmap complete";
    $("#continuePhase").textContent=state.roadmap.phases.find(p=>p.nodes.some(n=>n.id===current?.id))?.title || "Completed";
    $("#continueDesc").textContent=current?.description || "You've completed the available path. Nice work.";
    $("#continueDuration").textContent=current ? durationText(current.duration) : "—";
    $("#continueBadge").textContent=initials(current?.title||"Done");
    $("#continueProgressBar").style.width=t.overall+"%";
    $("#continueProgressText").textContent=`${t.overall}% overall`;
    $("#statOverall").textContent=t.overall+"%";
    $("#statCompleted").textContent=`${t.completedLessons+t.completedProjects} / ${t.nodes.length}`;
    $("#statProjects").textContent=`${t.completedProjects} / ${t.projects.length}`;
    $("#statHours").textContent=formatHours(state.progress.totalHours);
    $("#journeyRoadmapTitle").textContent=state.roadmap.title;
    $("#journeyGoalPill").textContent=state.user.goal || state.roadmap.title;
    $("#phaseBars").innerHTML=state.roadmap.phases.map(p=>{
      const pr=phaseProgress(p); return `<div class="phase-bar-row"><span>${escapeHtml(p.title)}</span><div class="phase-fill"><span style="width:${pr.pct}%"></span></div><span>${pr.pct}%</span></div>`;
    }).join("");
  }

  function renderRoadmap(){
    if(!state.roadmap) return;
    const t=totals(), meta=PATH_META[state.roadmap.id]||PATH_META.frontend;
    $("#roadmapTitle").textContent=state.roadmap.title+" Roadmap";
    $("#roadmapSubtitle").textContent=state.roadmap.description;
    $("#sidebarGoal").textContent=state.roadmap.title;
    $("#sidebarGoalDescription").textContent=state.roadmap.description;
    $("#roadmapOverall").textContent=t.overall+"%";
    $("#roadmapOverallBar").style.width=t.overall+"%";
    const next=nodeById(firstAvailableNodeId());
    $("#sidebarNext").textContent=next?.title || "Roadmap complete";
    $("#roadmapCanvas").innerHTML=state.roadmap.phases.map((phase,pi)=>{
      const pr=phaseProgress(phase);
      return `<section class="phase-block">
        <span class="phase-dot"></span>
        <div class="phase-header"><div class="phase-header-row"><div><div class="panel-kicker">Phase ${pi+1}</div><h3>${escapeHtml(phase.title)}</h3><p>${escapeHtml(phase.description)}</p></div><div class="phase-progress"><div>${pr.pct}%</div><div class="progress-line"><span style="width:${pr.pct}%"></span></div></div></div></div>
        <div class="node-list">${phase.nodes.map(nodeHtml).join("")}</div>
      </section>`;
    }).join("");
    bindNodeActions();
  }

  function nodeHtml(node){
    const st=statusFor(node), icon=node.type==="project"?"◆":st==="completed"?"✓":st==="locked"?"🔒":"•";
    const action=st==="locked" ? `<button class="node-action" disabled>Locked</button>` : `<button class="node-action" data-open-node="${node.id}">${st==="completed"?"Review":"Open"} →</button>`;
    return `<article class="road-node ${st} ${node.type==="project"?"project-node":""}">
      <div class="node-icon">${icon}</div>
      <div><h4>${escapeHtml(node.title)}</h4><p>${escapeHtml(node.description)}</p></div>
      <div class="node-meta"><span>${durationText(node.duration)}</span><span>${escapeHtml(node.difficulty)}</span></div>
      ${action}
    </article>`;
  }

  function bindNodeActions(){
    $$("[data-open-node]").forEach(btn=>btn.addEventListener("click",()=>openNode(btn.dataset.openNode)));
  }

  function openNode(id){
    const node=nodeById(id); if(!node) return;
    if(statusFor(node)==="locked"){showToast("Complete the prerequisites first.");return;}
    currentNodeId=id;
    touchActivity();
    if(node.type==="project") openProject(node); else openLesson(node);
  }

  function openLesson(node){
    $("#lessonType").textContent=node.type==="project"?"PROJECT":"LESSON";
    $("#lessonDifficulty").textContent=node.difficulty;
    $("#lessonTitle").textContent=node.title;
    $("#lessonDescription").textContent=node.description;
    $("#lessonDuration").textContent=durationText(node.duration);
    $("#lessonPrereqs").textContent=(node.prerequisites||[]).map(x=>nodeById(x)?.title).filter(Boolean).join(", ")||"None";
    const topics=lessonTopics(node);
    $("#lessonLearn").innerHTML=topics.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
    const resources=resourceForNode(node);
    $("#lessonResources").innerHTML=resources.map(r=>`<div class="mini-resource"><a href="${r.url}" target="_blank" rel="noreferrer">${escapeHtml(r.title)} ↗</a><small>${escapeHtml(r.type)} · ${escapeHtml(r.provider)}</small></div>`).join("");
    const primary=resources[0];
    $("#lessonResourceLink").href=primary?.url||"#";
    const completed=isComplete(node);
    $("#completeLessonBtn").textContent=completed?"Completed ✓":"Mark as Complete ✓";
    $("#completeLessonBtn").disabled=completed;
    $("#completeLessonBtn").style.opacity=completed?".65":"1";
    $("#lessonModal").showModal();
  }

  function openProject(node){
    currentProjectId=node.id;
    $("#projectDifficulty").textContent=node.difficulty;
    $("#projectTitle").textContent=node.title.replace(/^Project:\s*/,"");
    $("#projectDescription").textContent=node.description;
    $("#projectDuration").textContent=durationText(node.duration);
    $("#projectSkills").textContent=projectSkills(node).join(", ");
    const checks=state.progress.projectChecks[node.id] || [];
    const checklist=projectChecklist(node);
    $("#projectChecklist").innerHTML=checklist.map((item,i)=>`<div class="check-item"><input type="checkbox" id="check-${i}" data-project-check="${i}" ${checks.includes(i)?"checked":""}><label for="check-${i}">${escapeHtml(item)}</label></div>`).join("");
    updateProjectProgress();
    $("#completeProjectBtn").textContent=isComplete(node)?"Project Complete ✓":"Mark Project Complete ✓";
    $("#projectModal").showModal();
    $$("[data-project-check]").forEach(c=>c.addEventListener("change",()=>{
      const active=$$("[data-project-check]").filter(x=>x.checked).map(x=>Number(x.dataset.projectCheck));
      state.progress.projectChecks[node.id]=active; saveState(); updateProjectProgress();
    }));
  }

  function updateProjectProgress(){
    const node=nodeById(currentProjectId); if(!node) return;
    const total=projectChecklist(node).length, done=(state.progress.projectChecks[node.id]||[]).length;
    $("#projectProgress").textContent=`${done} / ${total} complete`;
  }

  function completeLesson(){
    const node=nodeById(currentNodeId); if(!node || node.type==="project") return;
    if(!state.progress.completedLessons.includes(node.id)){
      state.progress.completedLessons.push(node.id);
      state.progress.totalHours += hoursFromNode(node);
    }
    advanceCurrent(); touchActivity(); saveState(); renderAll(); $("#lessonModal").close();
    showToast(`✓ ${node.title} completed. Next: ${nodeById(state.progress.currentLesson)?.title || "Roadmap complete"}`,"success");
  }

  function completeProject(){
    const node=nodeById(currentProjectId); if(!node) return;
    if(!state.progress.completedProjects.includes(node.id)){
      state.progress.completedProjects.push(node.id); state.progress.totalHours += hoursFromNode(node);
    }
    advanceCurrent(); touchActivity(); saveState(); renderAll(); $("#projectModal").close();
    showToast(`◆ Project completed. Next: ${nodeById(state.progress.currentLesson)?.title || "Roadmap complete"}`,"success");
  }

  function advanceCurrent(){
    state.progress.currentLesson=firstAvailableNodeId();
    saveState();
  }

  function renderPaths(filter=""){
    const q=filter.toLowerCase();
    const cards=Object.entries(PATH_META).filter(([id,m]) => `${id} ${m.title} ${m.desc}`.toLowerCase().includes(q));
    $("#pathGrid").innerHTML=cards.map(([id,m])=>`<article class="path-card"><div class="path-icon">${m.icon}</div><h3>${m.title}</h3><p>${m.desc}</p><button class="text-btn" data-path="${id}">View roadmap →</button></article>`).join("");
    $$("[data-path]").forEach(b=>b.addEventListener("click",()=>{
      selectedPath=b.dataset.path;
      if(state.roadmap?.id!==selectedPath || !state.roadmap){
        state.roadmap=buildRoadmap(selectedPath,PATH_META[selectedPath].title);
        state.user.goal=PATH_META[selectedPath].title;
        state.progress={completedLessons:[],completedProjects:[],projectChecks:{},currentLesson:"",totalHours:0,streak:state.progress.streak||1,lastActiveDate:state.progress.lastActiveDate||"",roadmapCreationDate:state.roadmap.createdAt};
        ensureCurrent(); saveState();
      }
      renderAll(); scrollToSection("roadmaps");
      showToast(`${PATH_META[selectedPath].title} roadmap loaded.`,"success");
    }));
  }

  function renderResources(){
    const theme=PATH_META[state.roadmap?.id || defaultPath]?.theme || "web";
    const items=(RESOURCES[theme] || RESOURCES.web).slice(0,6);
    $("#resourceGrid").innerHTML=items.map(r=>`<article class="resource-card"><div class="resource-top"><span class="resource-type">${escapeHtml(r.type)}</span><span class="resource-free">${r.type==="Book"?"Free/paid":"Free"}</span></div><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.provider)} · ${escapeHtml(r.duration)} · ${escapeHtml(r.difficulty)}</p><a href="${r.url}" target="_blank" rel="noreferrer">Open resource ↗</a></article>`).join("");
    $("#resourceSectionCopy").textContent=`Recommended resources for your ${state.roadmap?.title || "learning"} path.`;
  }

  function renderAIPreview(goal="I want to become an AI engineer and get a remote job."){
    const path=inferPath(goal)||"ai";
    const roadmap=buildRoadmap(path,goal);
    const steps=roadmap.phases.slice(0,9).map((p,i)=>({i,title:p.title,desc:p.description}));
    $("#aiRoadmapPreview").innerHTML=steps.map(s=>`<div class="ai-step"><div class="ai-step-num">${s.i+1}</div><div><strong>${escapeHtml(s.title)}</strong><span>${escapeHtml(s.desc)}</span></div><span>PHASE</span></div>`).join("");
    $("#aiPreviewHint").textContent=`Mapped to ${roadmap.title}`;
  }

  function renderAll(){
    ensureInitialJourney(); ensureCurrent();
    renderJourney(); renderRoadmap(); renderPaths($("#pathSearch")?.value||""); renderResources();
    const activeGoal=state.user.goal||state.roadmap.title;
    $("#goalInput").value="";
    if(location.hash==="#journey") scrollToSection("journey");
  }

  function durationText(minutes){
    const m=Number(minutes)||0;
    if(m<60) return `${m} min`;
    const h=m/60; return h%1===0?`${h}h`:`${h.toFixed(1)}h`;
  }
  function formatHours(h){ return `${Math.round((h||0)*10)/10}h`; }
  function initials(title){
    return title.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  }
  function lessonTopics(node){
    const t=node.title.toLowerCase();
    const map=[
      [/function/,"What functions are; parameters, arguments and return values."],
      [/html/,"Semantic structure, nesting and accessible markup."],
      [/css/,"Selectors, cascade, specificity and reusable styles."],
      [/flexbox/,"Axes, alignment, distribution and common layout patterns."],
      [/grid/,"Tracks, columns, areas and responsive layout."],
      [/async|promise/,"Promises, async/await, errors and execution order."],
      [/api|http/,"Requests, responses, status codes and data exchange."],
      [/sql|database/,"Tables, relationships, queries and data modeling."],
      [/react/,"Components, rendering, state and one-way data flow."],
      [/statistics/,"Distributions, summary statistics and uncertainty."],
      [/research/,"Questions, evidence, interviews and synthesis."],
    ];
    const hits=map.filter(([re])=>re.test(t)).map(([,v])=>v);
    return (hits.length?hits:["Core concepts and vocabulary.","How the idea fits into the wider roadmap.","A small practice task to verify understanding.","How this skill connects to the next step."]).slice(0,4);
  }
  function resourceForNode(node){
    return (RESOURCES[node.resourceTheme]||RESOURCES.web).slice(0,3);
  }
  function projectSkills(node){
    const t=node.title.toLowerCase();
    if(t.includes("weather")) return ["HTML","CSS","JavaScript","Fetch API"];
    if(t.includes("dashboard")) return ["UI","Data","JavaScript","APIs"];
    if(t.includes("e-commerce")) return ["React","State","Routing","APIs"];
    if(t.includes("portfolio")) return ["HTML","CSS","Accessibility","Deployment"];
    if(state.roadmap.id==="ai") return ["Python","ML","APIs","Deployment"];
    if(state.roadmap.id==="data_science") return ["Python","SQL","Statistics","ML"];
    if(state.roadmap.id==="ux") return ["Research","Figma","Prototyping","Testing"];
    return ["Core skills","APIs","Testing","Deployment"];
  }
  function projectChecklist(node){
    const t=node.title.toLowerCase();
    if(t.includes("weather")) return ["Create layout","Build search form","Connect weather API","Handle loading state","Handle errors","Make responsive","Deploy","Add GitHub repository"];
    if(t.includes("e-commerce")) return ["Product listing","Filters/search","Product details","Cart flow","Responsive layout","Accessible interactions","Deploy","Document project"];
    if(t.includes("portfolio")) return ["Hero / positioning","Projects section","About section","Contact","Responsive design","Accessibility pass","Deploy","Add GitHub repository"];
    if(state.roadmap.id==="ai") return ["Define problem","Prepare dataset or source","Build baseline","Evaluate results","Create API/UI","Handle errors","Deploy","Document tradeoffs"];
    if(state.roadmap.id==="data_science") return ["Define question","Clean data","Explore patterns","Build analysis/model","Explain findings","Create visualizations","Write README","Publish"];
    if(state.roadmap.id==="ux") return ["Research","Synthesize insights","Wireframe","Prototype","Test","Iterate","Write case study","Present outcome"];
    return ["Define scope","Set up project","Build core feature","Handle errors","Test","Make responsive","Deploy","Document"];
  }
  function showToast(message,type=""){
    const el=document.createElement("div"); el.className=`toast ${type}`; el.textContent=message; $("#toastRegion").appendChild(el);
    setTimeout(()=>el.remove(),3600);
  }
  function scrollToSection(id){ document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}); }
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));}

  function navInit(){
    $$("[data-nav]").forEach(el=>el.addEventListener("click",e=>{ e.preventDefault(); scrollToSection(el.dataset.nav==="home"?"home":el.dataset.nav); $("#mobileMenu").classList.remove("open"); }));
    $$("[data-scroll]").forEach(el=>el.addEventListener("click",()=>scrollToSection(el.dataset.scroll)));
    $("#menuBtn").addEventListener("click",()=>$("#mobileMenu").classList.toggle("open"));
    $("#themeToggle").addEventListener("click",()=>{
      document.body.classList.toggle("light");
      localStorage.setItem(THEME_KEY,document.body.classList.contains("light")?"light":"dark");
      $("#themeToggle").textContent=document.body.classList.contains("light")?"☀":"☾";
    });
  }

  function bindForms(){
    $("#heroForm").addEventListener("submit",e=>{e.preventDefault();const v=$("#goalInput").value.trim();if(v)createGoal(v);else showToast("Tell me what you want to learn first.");});
    $$(".suggestions [data-goal]").forEach(b=>b.addEventListener("click",()=>{createGoal(b.dataset.goal);}));
    $("#aiForm").addEventListener("submit",e=>{e.preventDefault();renderAIPreview($("#aiInput").value.trim()||"AI engineer");showToast("Demo roadmap generated.");});
    $("#pathSearch").addEventListener("input",e=>renderPaths(e.target.value));
    $("#continueBtn").addEventListener("click",()=>{const id=firstAvailableNodeId();if(id)openNode(id);else showToast("You've completed this roadmap 🎉","success");});
    $("#sidebarContinue").addEventListener("click",()=>{const id=firstAvailableNodeId();if(id)openNode(id);});
    $("#resetBtn").addEventListener("click",()=>{
      if(confirm("Reset your Skillio journey? This removes saved progress on this device.")){
        localStorage.removeItem(STORAGE_KEY); state=loadState(); ensureInitialJourney(); renderAll(); showToast("Journey reset.");
      }
    });
    $("#completeLessonBtn").addEventListener("click",completeLesson);
    $("#completeProjectBtn").addEventListener("click",completeProject);
    $("#lessonClose").addEventListener("click",()=>$("#lessonModal").close());
    $("#projectClose").addEventListener("click",()=>$("#projectModal").close());
  }

  function init(){
    try{ if(localStorage.getItem(THEME_KEY)==="light") document.body.classList.add("light"); }catch(e){}
    $("#themeToggle").textContent=document.body.classList.contains("light")?"☀":"☾";
    ensureInitialJourney(); navInit(); bindForms(); renderAIPreview(); renderAll();
  }
  init();
})();