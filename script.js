let data = JSON.parse(localStorage.getItem("diary")) || [];
let selectedMonth = "ALL";

/* generate tahun 2020 - sekarang */
const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();

for(let y=2020; y<=currentYear; y++){
  yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

/* bulan */
const months = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

/* sidebar bulan */
function renderMonths(){
  const list = document.getElementById("monthList");
  list.innerHTML = `<li onclick="filterMonth('ALL')">🌈 Semua</li>`;

  months.forEach(m=>{
    list.innerHTML += `<li onclick="filterMonth('${m}')">${m}</li>`;
  });
}
function filterMonth(m){
  selectedMonth = m;
  render();

  // 💖 particle effect
  createAuroraParticles(m);

  // 🌌 ganti background aurora
  document.body.style.background = auroraThemes[m] || auroraThemes["ALL"];

  // 🌈 sidebar glow ikut berubah
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.background = "rgba(255,255,255,0.6)";
}

/* save */
function saveData(){
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const file = document.getElementById("image").files[0];

  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  if(!title || !desc){
    alert("Isi dulu 💕");
    return;
  }

  if(file){
    const reader = new FileReader();
    reader.onload = e=>{
      addData(title,desc,e.target.result,month,year);
    }
    reader.readAsDataURL(file);
  }else{
    addData(title,desc,null,month,year);
  }
}

function addData(title,desc,img,month,year){
  data.push({title,desc,image:img,month,year});

  localStorage.setItem("diary",JSON.stringify(data));

  clearForm();
  render();
}

/* SORT OTOMATIS (TAHUN + BULAN) */
function getMonthIndex(m){
  return months.indexOf(m);
}

/* render */
function render(){
  const list = document.getElementById("list");
  list.innerHTML = "";

  let sorted = [...data].sort((a,b)=>{
    if(b.year !== a.year){
      return b.year - a.year;
    }
    return months.indexOf(b.month) - months.indexOf(a.month);
  });

  let delay = 0;

  sorted.forEach(item=>{

    if(selectedMonth !== "ALL" && item.month !== selectedMonth) return;

    setTimeout(()=>{
      list.innerHTML += `
        <div class="card">
          <small>📅 ${item.month} ${item.year}</small>
          <h3>💖 ${item.title}</h3>
          <p>${item.desc}</p>
          ${item.image ? `<img src="${item.image}">` : ""}
        </div>
      `;
    }, delay);

    delay += 80; // efek satu-satu muncul seperti album
  });
}
/* clear */
function clearForm(){
  document.getElementById("title").value="";
  document.getElementById("desc").value="";
  document.getElementById("image").value="";
}

/* init */
renderMonths();
render();

function createLoveBurst(){
  const sidebar = document.querySelector(".sidebar");

  for(let i=0;i<18;i++){
    const heart = document.createElement("div");
    heart.classList.add("heart-burst");
    heart.innerHTML = "💖";

    // posisi random di area sidebar (kiri)
    const x = Math.random() * 180; 
    const y = Math.random() * window.innerHeight;

    heart.style.left = x + "px";
    heart.style.top = y + "px";

    heart.style.fontSize = (10 + Math.random()*12) + "px";

    sidebar.appendChild(heart);

    setTimeout(()=>{
      heart.remove();
    },1000);
  }
}

const sidebar = document.querySelector(".sidebar");

document.addEventListener("mousemove", (e)=>{
  const heart = document.createElement("div");
  heart.classList.add("global-heart");
  heart.innerHTML = "💖";

  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";

  document.body.appendChild(heart);

  setTimeout(()=>{
    heart.remove();
  }, 1000);
});

const auroraThemes = {
  "Januari": "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "Februari": "linear-gradient(135deg,#ff9a9e,#fad0c4)",
  "Maret": "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "April": "linear-gradient(135deg,#fbc2eb,#a6c1ee)",
  "Mei": "linear-gradient(135deg,#84fab0,#8fd3f4)",
  "Juni": "linear-gradient(135deg,#d4fc79,#96e6a1)",
  "Juli": "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "Agustus": "linear-gradient(135deg,#ff9a9e,#fecfef)",
  "September": "linear-gradient(135deg,#cfd9df,#e2ebf0)",
  "Oktober": "linear-gradient(135deg,#f6d365,#fda085)",
  "November": "linear-gradient(135deg,#667eea,#764ba2)",
  "Desember": "linear-gradient(135deg,#89f7fe,#66a6ff)",
  "ALL": "linear-gradient(135deg,#ffd6e8,#d6f5ff)"
};

function createAuroraParticles(m){
  const items = document.querySelectorAll(".sidebar li");

  items.forEach(li=>{
    if(li.innerText.includes(m) || (m === "ALL" && li.innerText.includes("Semua"))){

      const rect = li.getBoundingClientRect();
      const emojis = ["💖","🌸","✨"];

      for(let i=0;i<30;i++){
        const p = document.createElement("div");
        p.classList.add("particle");
        p.innerHTML = emojis[Math.floor(Math.random()*emojis.length)];

        p.style.left = (rect.left + rect.width/2) + "px";
        p.style.top = (rect.top + rect.height/2) + "px";

        const x = (Math.random()*300 - 150) + "px";
        const y = (Math.random()*-250 - 50) + "px";

        p.style.setProperty("--x", x);
        p.style.setProperty("--y", y);

        document.body.appendChild(p);

        setTimeout(()=>p.remove(),1200);
      }
    }
  });
}

const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let meteors = [];

/* STAR STATIC BACKGROUND */
function createStar(){
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5
  };
}

for(let i=0;i<220;i++){
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.2 + 0.8,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random()
  });
}
/* SHOOTING STAR */
function createMeteor(){
  meteors.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.3,
    vx: 8 + Math.random() * 6,
    vy: 4 + Math.random() * 3,
    len: 160 + Math.random() * 100,
    alpha: 1,
    hue: Math.random() * 360 // 🌈 warna aurora
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // bintang biasa
ctx.fillStyle = "rgba(255,255,255,0.9)"; // lebih terang

stars.forEach(s=>{
  s.x += s.dx;
  s.y += s.dy;

  // wrap layar
  if(s.x < 0) s.x = canvas.width;
  if(s.x > canvas.width) s.x = 0;
  if(s.y < 0) s.y = canvas.height;
  if(s.y > canvas.height) s.y = 0;

  s.alpha += (Math.random() - 0.5) * 0.05;
  s.alpha = Math.max(0.2, Math.min(1, s.alpha));

  ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;

  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
  ctx.fill();
});

  // meteor / bintang jatuh
for(let i=0;i<meteors.length;i++){
  let m = meteors[i];

  const gradient = ctx.createLinearGradient(
    m.x, m.y,
    m.x - m.len, m.y - m.len/2
  );

  gradient.addColorStop(0, `hsla(${m.hue},100%,70%,${m.alpha})`);
  gradient.addColorStop(1, "transparent");

  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(m.x - m.len, m.y - m.len/2);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.stroke();

  m.x += m.vx;
  m.y += m.vy;
  m.alpha -= 0.012;

  if(m.alpha <= 0){
    meteors.splice(i,1);
    i--;
  }
}

  requestAnimationFrame(draw);
}

/* spawn meteor real-time */
setInterval(createMeteor, 900);
/* resize */
window.addEventListener("resize",()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

draw();