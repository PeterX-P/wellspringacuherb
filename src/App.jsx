import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Menu, 
  X, 
  Lock, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Leaf, 
  Activity, 
  Heart, 
  MapPin, 
  ArrowRight, 
  MessageCircle, 
  Printer,
  Settings,
  Grid,
  List,
  Ban,
  Mail,
  HelpingHand,
  CheckCircle2,
  XCircle 
} from 'lucide-react';

// --- CONFIGURATION ---

// OPTION 1: SECURE VERSION (For GitHub Secrets)
// If you want to use the secrets defined in your deploy.yml, 
// UNCOMMENT this block and DELETE the "OPTION 2" block below.
/*
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
*/

// OPTION 2: COMPATIBLE VERSION (Hardcoded)
// Use this to fix the "import.meta" error in this editor. 
// It works perfectly on GitHub/Live Site as well.
const firebaseConfig = {
  apiKey: "AIzaSyBAx0Dle1zLqGvsfnoJNZMWtDOGf_HEDVE",
  authDomain: "website-project-6287f.firebaseapp.com",
  projectId: "website-project-6287f",
  storageBucket: "website-project-6287f.firebasestorage.app",
  messagingSenderId: "112814688225",
  appId: "1:112814688225:web:81db3f11d32f312fae74a0",
  measurementId: "G-FHC2KH9NH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Translations & Content ---
const TRANSLATIONS = {
  en: {
    menu: {
      home: "Home",
      appointments: "Appointments",
      services: "Services",
      whatWeTreat: "What We Treat",
      about: "About",
      testimonials: "Testimonials"
    },
    title: "Wellspring Acupuncture and Herbs",
    subtitle: "Integrative Medicine & Wellness",
    login: "Staff Login",
    logout: "Logout",
    heroTitle: "Restore Your Vitality",
    heroSubtitle: "Experience the profound benefits of traditional acupuncture in a modern, serene setting.",
    bookNow: "Book an Appointment",
    learnMore: "Learn More",
    welcomeTitle: "Welcome to Wellspring Acupuncture and Herbs",
    welcomeText: "We are dedicated to providing personalized care that addresses the root cause of your health concerns. Our clinic offers a sanctuary for healing, combining ancient wisdom with modern medical understanding.",
    bookingTitle: "Schedule Your Visit",
    bookingSubtitle: "Select a time that works for you. Private treatment sessions available every 30 minutes.",
    selectDate: "Select Date",
    full: "Booked",
    blocked: "Blocked",
    bookSlot: "Request Appointment",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    email: "Email Address",
    enterDetails: "Patient Details",
    requiredFields: "*All fields are required",
    confirm: "Confirm Request",
    cancel: "Cancel",
    adminMode: "Admin Portal",
    adminPass: "Access Code",
    bookingSuccess: "Appointment Requested",
    viewBookings: "Scheduled Patients",
    noBookings: "No appointments scheduled.",
    myBookings: "My Appointments",
    findBooking: "Manage My Appointments",
    enterPhoneToFind: "Enter your phone number to find existing appointments.",
    search: "Find Appointments",
    cancelAppt: "Cancel",
    confirmCancel: "Cancel this appointment?",
    past: "Past",
    footer: "© 2025 Wellspring Acupuncture and Herbs. All rights reserved.",
    settings: "Settings",
    daysAheadLabel: "Booking Window (Weeks)",
    daysAheadDesc: "How many weeks ahead can patients book?",
    save: "Save Settings",
    saved: "Settings Saved!",
    weekView: "Week View",
    dayView: "Day View",
    blockRange: "Block Time Range",
    blockRangeTitle: "Block Multiple Slots",
    startTime: "Start Time",
    endTime: "End Time",
    blockConfirm: "Block Selected Range",
    apptDetails: "Appointment Details",
    unblock: "Unblock",
    servicesPage: {
      title: "Our Specialties",
      subtitle: "Comprehensive care for your well-being",
      list: [
        { title: "Acupuncture", desc: "Stimulate your body's natural healing abilities to reduce pain and inflammation." },
        { title: "Cupping", desc: "Improve blood flow and relaxation with traditional vacuum therapy." },
        { title: "Herbal Medicine", desc: "Custom herbal formulas tailored to your specific constitution." },
        { title: "Tuina (Chinese Therapeutic Massage)", desc: "Restore balance through hands-on techniques that relax muscles, improve circulation, and support the body’s natural healing process." }
      ]
    },
    whatWeTreatPage: {
      title: "What We Treat",
      subtitle: "Holistic solutions for a wide range of conditions",
      list: [
        "Women’s health and reproductive concerns, including infertility support, menstrual irregularities, dysmenorrhea, polycystic ovary syndrome (PCOS), and menopausal symptoms etc.",
        "Stress-related conditions, including anxiety, depression, and sleep disturbance etc.",
        "Pelvic floor and urinary dysfunction, including postnatal or post-surgical incontinence, neurogenic bladder, urgency-frequency syndrome, and sexual dysfunction etc.",
        "Neurological conditions, including migraine, neuropathic pain, facial paralysis, and post-herpetic pain etc.",
        "Musculoskeletal pain, including neck, shoulder, lower back, and knee pain etc.",
        "Metabolic and endocrine conditions, including obesity, thyroid dysfunction, metabolic syndrome, hypertension, diabetes, and hyperlipidemia etc.",
        "Digestive disorders, including indigestion, irritable bowel syndrome, inflammatory bowel disease etc.",
        "Eye, ear, and nasal conditions, including allergies, sinus, ear ringing, dry eyes, youth pseudomyopia, glaucoma etc.",
        "Dermatological conditions, including acne, eczema, herpes zoster, hives, sebaceous cyst, folliculitis etc..",
        "Cosmetic acupuncture for facial rejuvenation and skin health, weight loss etc.."
      ]
    },
    aboutPage: {
      title: "Ruthy (Xiaoming) Feng, PhD, Lic.Ac, Lic.Herb",
      p1: "Ruthy (Xiaoming) Feng, is a Massachusetts-licensed Acupuncturist and Herbalist in the United States. She also serves as an attending physician and assistant professor of Traditional Chinese Medicine in Shanghai, China, with extensive experience in both clinical practice and research.",
      p2: "Dr. Feng entered Shandong University of Traditional Chinese Medicine’s first seven-year combined bachelor’s and master’s program. Her master tutor was Professor Yuanqing Ding, a nationally recognized master of Chinese medicine and a leading scholar of Shang Han Lun. She received her Bachelor’s Degree in Traditional Chinese Medicine and her Master’s Degree in Neurology in 2007. Her formal training focused on internal medicine, with an emphasis on treating complex neurological conditions through Chinese medicine.",
      p3: "Through years of clinical training, she witnessed firsthand the effectiveness of Chinese medicine in conditions such as stroke, facial paralysis, neurodegenerative disorders, autoimmune neurological diseases, and chronic neuropathic pain. These experiences transformed her initial interest into a lifelong commitment.",
      p4: "She later received rigorous training in biomedical research at Fudan University in Integrative Chinese and Western Medicine. Although this period strengthened her scientific foundation, her heart remained in clinical practice. After graduation, she joined the Shanghai Institute of Acupuncture and Meridians, one of the leading acupuncture research and clinical institutions in China, where she continued both research and clinical practice.",
      p5: "During this time, she studied with several highly respected masters in acupuncture. She trained with Professor Jinsen He, China’s first doctoral graduate in Acupuncture, focusing on acupuncture treatment for thyroid disorders, eye diseases, and endocrine conditions. Under Professor Mingzhu Ye’s guidance, a renowned scholar of acupuncture classics, she learned comprehensive approaches to complex internal and surgical conditions—often exploring multiple treatment strategies for a single diagnosis. She also trained with Professor Siyou Wang, a leading authority in urology, where she developed a systematic approach to treating pelvic floor disorders and gained a deeper understanding of clinically grounded research.",
      p6: "Through experiences with Dr Mingguang Xu, a second-generation lineage holder of Yang-style acupuncuture, she became a third-generation lineage holder of Yang-style acupuncture. She also received advanced mentorship through multiple international and domestic academic transmission programs, including training with Professor Guanyuan Jin in clinical acupuncture reflexology; specialized training in reproductive health and infertility with Dr Dongyun Yang,an international renowned infertility expert.",
      p7: "Medicine is a lifelong path of learning and humility. Since 2021 she has been practicing acupuncture and herbal medicine, providing patient-centered, diagnosis-informed care within the U.S. healthcare setting. Dr. Feng is committed to delivering safe, thoughtful, and integrative acupuncture care, with an emphasis on functional improvement, long-term regulation, and collaboration with other healthcare providers when appropriate. She believes that Chinese medicine, at its best, restores balance not only to the body, but also to the person as a whole, offering a renewed sense of stability, dignity, and hope.",
      stats: ["15+ Years", "5k+ Patients", "Licensed Pros"]
    },
    testimonialsPage: {
      title: "Patient Stories",
      list: [
        { name: "Sarah J.", text: "The most relaxing medical experience I've ever had." },
        { name: "Michael C.", text: "Professional, clean, and incredibly effective." },
        { name: "Emily R.", text: "Dr. Wei really listens. I felt heard and cared for." }
      ]
    }
  },
  zh: {
    menu: {
      home: "首頁",
      appointments: "線上預約",
      services: "服務項目",
      whatWeTreat: "治疗范围",
      about: "關於我們",
      testimonials: "見證"
    },
    title: "活泉中医针灸诊所",
    subtitle: "中西醫結合 • 全人健康",
    login: "員工登入",
    logout: "登出",
    heroTitle: "調理身心，恢復平衡",
    heroSubtitle: "在現代舒適的環境中，體驗傳統針灸的深層療效。",
    bookNow: "立即預約",
    learnMore: "了解更多",
    welcomeTitle: "歡迎來到活泉中医针灸诊所",
    welcomeText: "我們致力於提供個性化的護理，解決您健康問題的根源。",
    bookingTitle: "預約您的診療",
    bookingSubtitle: "選擇適合您的時間。每30分鐘提供一個私人治療時段。",
    selectDate: "選擇日期",
    full: "已預約",
    blocked: "保留",
    bookSlot: "預約時段",
    firstName: "名字",
    lastName: "姓氏",
    phone: "電話號碼",
    email: "電子郵件",
    enterDetails: "患者資料",
    requiredFields: "*所有欄位皆為必填",
    confirm: "確認預約",
    cancel: "取消",
    adminMode: "管理後台",
    adminPass: "訪問代碼",
    bookingSuccess: "預約已送出",
    viewBookings: "已預約患者",
    noBookings: "此時段無預約",
    myBookings: "我的預約",
    findBooking: "管理我的預約",
    enterPhoneToFind: "輸入電話號碼以查詢預約",
    search: "搜尋",
    cancelAppt: "取消",
    confirmCancel: "確定要取消此預約嗎？",
    past: "已過",
    footer: "© 2025 活泉中医针灸诊所 版權所有",
    settings: "設置",
    daysAheadLabel: "開放預約週數",
    daysAheadDesc: "允許患者提前多少週預約？",
    save: "保存設置",
    saved: "設置已保存！",
    weekView: "週視圖",
    dayView: "日視圖",
    blockRange: "批量封鎖時段",
    blockRangeTitle: "封鎖時段範圍",
    startTime: "開始時間",
    endTime: "結束時間",
    blockConfirm: "封鎖選定範圍",
    apptDetails: "預約詳情",
    unblock: "解除封鎖",
    servicesPage: {
      title: "專業服務",
      subtitle: "為您量身定制的整體療法",
      list: [
        { title: "傳統針灸", desc: "激發身體的自然癒合能力，減少疼痛和炎症。" },
        { title: "拔罐療法", desc: "利用真空療法促進血液循環和肌肉放鬆。" },
        { title: "中藥調理", desc: "根據您的體質定制的草本配方。" },
        { title: "中医推拿疗法", desc: "通過手法操作放鬆肌肉、促進血液循環，幫助恢復身體平衡，支持身體的自然修復過程。" }
      ]
    },
    whatWeTreatPage: {
      title: "治疗范围",
      subtitle: "針對多種疾病的整體治療方案",
      list: [
        "女性健康與生殖相關問題，包括不孕症支持、月經不調、痛經、多囊卵巢綜合徵（PCOS）及更年期綜合徵等",
        "壓力相關問題，包括焦慮、抑鬱及睡眠障礙等",
        "盆底及泌尿功能障礙，包括產後或術後尿失禁、神經源性膀胱、尿頻尿急綜合徵及性功能障礙等",
        "神經系統相關疾病，包括偏頭痛、神經性疼痛、面癱及帶狀皰疹後神經痛",
        "肌肉骨骼疼痛，包括頸部、肩部、腰部及膝關節疼痛",
        "代謝與內分泌相關問題，包括肥胖、甲狀腺功能異常、代謝綜合徵（高血壓、糖尿病及高血脂）",
        "消化系統疾病，包括消化不良，腸易激綜合徵、炎症性腸病等",
        "眼、耳、鼻相關問題，包括過敏、鼻竇炎、耳鳴、乾眼症、青光眼等",
        "皮膚相關問題，包括痤瘡、濕疹、帶狀皰疹、蕁麻疹、皮下囊腫、皮脂腺炎等",
        "美容針灸（面部年輕化及皮膚狀態改善），針灸減肥"
      ]
    },
    aboutPage: {
      title: "丰晓溟 哲学博士（PhD）、执业针灸师（LAc）",
      p1: "丰晓溟博士是美国马萨诸塞州注册执业针灸师及中药师，中国上海市针灸经络研究所的中医和针灸主治医师及上海中医药大学助理教授，兼具丰富的临床实践与科研经验。",
      p2: "她于2000年进入山东中医药大学首届中医学本硕连读七年制就读，2007年获得中医学学士学位及中医内科学医学硕士学位；硕士期间师从全国名中医、《伤寒论》大家丁元庆教授，主修中医内科学，专注于中医治疗神经系统疑难疾病。",
      p3: "在跟师学习的过程中，她系统研习了中医药在中风、面瘫、糖尿病神经系统并发症、运动神经元病、多发性硬化、视神经脊髓炎、三叉神经痛、重症肌无力等疾病中的临床应用。正是在那段时间，她亲眼见证了许多疑难病症在中医辨证施治下的转机，也逐渐让她从“对中医有兴趣”，走向“真正热爱中医”。",
      p4: "此后，她考入复旦大学中西医结合系，转入基础研究领域。虽然科研训练让她获益良多，但对中医临床的思念始终未曾淡去。毕业后，她进入上海市针灸经络研究所，从事科研与临床工作，也再次回到了她所热爱的治疗一线。",
      p5: "在针研所期间，她先后跟随多位名师学习：师从中国第一位针灸学博士何金森教授，系统掌握甲状腺疾病、眼病及内分泌疾病的针灸治疗；跟随针灸文献大家叶明柱教授，研习内外科各类杂病的针灸证治——叶老师知识渊博，同一疾病常能提出十余种治疗思路，令她深受启发；又师从泌尿科权威汪司右教授，系统掌握盆底疾病的针灸治疗方法，并由此刷新了她对中医临床科研路径的理解。",
      p6: "随后因缘际会，师从杨氏针灸第二代传人徐明光医生，成为杨氏针灸第三代传人。同时，她也成为美国金观源教授学术传承堂的一员，并在第二届国际师承班跟随不孕症专家梁东云老师系统研习不孕症的针药证治。",
      p7: "学无止境，道亦无涯。一路走来，她的临床视野与技术不断更新、沉淀与提升， 2021年起开始在美国医疗体系内执业，提供以病人为中心、基于诊断与评估的针灸与中药治疗服务。丰博士始终秉持安全、审慎与整合性的医疗理念，注重功能改善与长期调理，并在必要时与其他医疗专业人员协作，为患者提供规范、可靠的针灸医疗服务。愿所学之术，能成为真正的医治之器，为每一位前来求助的人，带去希望、安慰与福音。",
      stats: ["15+ Years", "5k+ Patients", "Licensed Pros"]
    },
    testimonialsPage: {
      title: "患者心聲",
      list: [
        { name: "Sarah J.", text: "這是我經歷過最放鬆的醫療體驗。" },
        { name: "Michael C.", text: "專業、乾淨，而且非常有效。" },
        { name: "Emily R.", text: "魏醫生真的很用心聽。" }
      ]
    }
  }
};

const MAX_SLOTS = 1;

// --- Helper Functions ---

const parseLocal = (dateStr) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Convert 24h format (14:30) to 12h format (2:30 PM)
const formatTime12 = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
};

// Generate 30-minute intervals for the day
const getDailySlots = (dateStr) => {
  const date = parseLocal(dateStr);
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  
  if (day === 0) return []; // Sunday closed

  const slots = [];
  
  // Logic for different days
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  
  // Default Hours (Just in case, though all weekdays are covered now)
  let startHour = 9;
  let startMinute = 0;
  let endHour = 16;
  let endMinute = 0;

  // Monday (1) & Thursday (4): 9:30 AM - 1:00 PM (Last slot at 1:00 PM)
  if (day === 1 || day === 4) {
    startHour = 9;
    startMinute = 30;
    endHour = 13;
    endMinute = 0;
  }
  // Tuesday (2), Wednesday (3), Friday (5): 9:30 AM - 4:00 PM (Last slot at 4:00 PM)
  else if (day === 2 || day === 3 || day === 5) {
    startHour = 9;
    startMinute = 30;
    endHour = 16;
    endMinute = 0;
  }
  // Saturday (6): 9:00 AM - 3:00 PM (Last slot at 3:00 PM)
  else if (day === 6) {
    startHour = 9;
    startMinute = 0;
    endHour = 15;
    endMinute = 0;
  }

  // Generate slots
  let currentHour = startHour;
  let currentMinute = startMinute;

  // Simple loop to generate slots until we hit the end time
  while (true) {
    // Check if we've passed the end time
    if (currentHour > endHour || (currentHour === endHour && currentMinute > endMinute)) {
      break;
    }
    
    // Add slot
    slots.push(`${currentHour}:${currentMinute === 0 ? '00' : currentMinute}`);

    // Increment by 30 mins
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour += 1;
    }
    
    // Safety break to prevent infinite loops if logic fails
    if (currentHour > 23) break;
  }

  return slots;
};

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-emerald-800">
        <div className="p-4 flex justify-between items-center border-b border-stone-100">
          <h3 className="text-emerald-900 font-serif font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-emerald-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-900 mb-3">{title}</h2>
    {subtitle && <p className="text-stone-500 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="h-0.5 w-16 bg-emerald-600 mx-auto mt-4"></div>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [appointments, setAppointments] = useState([]);
  const [settings, setSettings] = useState({ bookingWindowWeeks: 4 }); 
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [viewMonth, setViewMonth] = useState(new Date());
  
  const [viewMode, setViewMode] = useState('day'); 
  const [weekStartDate, setWeekStartDate] = useState(new Date());

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBlockRangeOpen, setIsBlockRangeOpen] = useState(false); 
  // New state for viewing specific booking details in week view
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [adminPass, setAdminPass] = useState('');
  const [formError, setFormError] = useState('');

  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('12:00');

  const [cancelPhone, setCancelPhone] = useState('');
  const [foundBookings, setFoundBookings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error("Auth failed:", err));
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Fetch Appointments
  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'appointments');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    }, (error) => {
       console.error("Error fetching appointments:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch Settings
  useEffect(() => {
    if (!user) return;
    const settingsDoc = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(settingsDoc, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [user]);

  // --- Logic ---

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'config'), settings, { merge: true });
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Error saving settings:", err);
      setFormError(`Save failed: ${err.message}`);
    }
  };

  const getSlotData = (dateStr, slotTime) => {
    const slotAppointments = appointments.filter(
      app => app.date === dateStr && app.hour === slotTime
    );
    const isBlocked = slotAppointments.some(app => app.type === 'blocked');
    const bookings = slotAppointments.filter(app => app.type === 'booking');
    const remaining = MAX_SLOTS - bookings.length;
    return { isBlocked, bookings, remaining: isBlocked ? 0 : remaining };
  };

  const isDateAllowed = (dateStr) => {
    if (isAdmin) return true;
    const weeks = parseInt(settings.bookingWindowWeeks || 4);
    const days = weeks * 7;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + days);
    
    const selected = parseLocal(dateStr);
    
    return selected <= maxDate && selected >= today;
  };

  const handleBookClick = (slotTime) => {
    setSelectedSlot(slotTime);
    setIsBookingModalOpen(true);
    setFormError('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    // Validate all fields
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
      setFormError(t.requiredFields);
      return;
    }
    
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const appointmentTime12 = formatTime12(selectedSlot);

    try {
      // 1. Save to appointments collection
      await addDoc(collection(db, 'appointments'), {
        date: selectedDate,
        hour: selectedSlot,
        type: 'booking',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName, 
        phone,
        email,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      // 2. Trigger Email Notification (Requires "Trigger Email" Firebase Extension)
      try {
        // Email 1: To Patient
        await addDoc(collection(db, 'mail'), {
          to: [email],
          message: {
            subject: `Appointment Confirmation: ${fullName} on ${selectedDate}`,
            text: `Hi ${firstName},\n\nWe look forward to seeing you on ${selectedDate} at ${appointmentTime12} at 655 Concord St, Framingham, MA 01702.\n\nTo cancel or reschedule, please call 508-628-1888 at least 24 hours in advance.\n\nWarmly, Wellspring Acupuncture and Herbs`,
            html: `
              <div style="font-family: sans-serif; font-size: 14px; color: #333;">
                <p>Hi ${firstName},</p>
                <p>We look forward to seeing you on <strong>${selectedDate}</strong> at <strong>${appointmentTime12}</strong> at 655 Concord St, Framingham, MA 01702.</p>
                <p>To cancel or reschedule, please call <strong>508-628-1888</strong> at least 24 hours in advance.</p>
                <p>Warmly,<br/>Wellspring Acupuncture and Herbs</p>
              </div>
            `
          }
        });

        // Email 2: To Practitioner
        await addDoc(collection(db, 'mail'), {
          to: ['wellspringacuherb@gmail.com'],
          message: {
            subject: `New Appointment Alert: ${fullName}`,
            text: `Hi, ${fullName} has made an appointment on ${selectedDate} at ${selectedSlot}`,
            html: `
              <div style="font-family: sans-serif; font-size: 14px; color: #333;">
                <p>Hi,</p>
                <p><strong>${fullName}</strong> has made an appointment on <strong>${selectedDate}</strong> at <strong>${selectedSlot}</strong>.</p>
              </div>
            `
          }
        });

      } catch (emailErr) {
          console.error("Email trigger failed:", emailErr);
      }
      
      setIsBookingModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(`Booking failed: ${err.message}`);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === '8888') {
      setIsAdmin(true);
      setIsAdminLoginOpen(false);
      setAdminPass('');
    } else {
      setFormError(lang === 'en' ? 'Invalid Code' : '代碼錯誤');
    }
  };

  const toggleBlockSlot = async (dateStr, slotTime, isCurrentlyBlocked) => {
    if (!isAdmin) return;
    try {
      if (isCurrentlyBlocked) {
        const blockDoc = appointments.find(
          app => app.date === dateStr && app.hour === slotTime && app.type === 'blocked'
        );
        if (blockDoc) {
          await deleteDoc(doc(db, 'appointments', blockDoc.id));
        }
      } else {
        await addDoc(collection(db, 'appointments'), {
          date: dateStr,
          hour: slotTime,
          type: 'blocked',
          blockedBy: user.uid,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  // Batch Block Function
  const handleRangeBlockSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const startMins = timeToMinutes(blockStartTime);
    const endMins = timeToMinutes(blockEndTime);
    const dailySlots = getDailySlots(selectedDate);
    const slotsToBlock = dailySlots.filter(slot => {
      const slotMins = timeToMinutes(slot);
      return slotMins >= startMins && slotMins < endMins;
    });

    try {
      const batch = writeBatch(db);
      
      slotsToBlock.forEach(slot => {
        // Check if already blocked or booked to avoid duplicates/errors
        const existing = appointments.find(
          app => app.date === selectedDate && app.hour === slot
        );
        
        if (!existing) {
          const docRef = doc(collection(db, 'appointments'));
          batch.set(docRef, {
            date: selectedDate,
            hour: slot,
            type: 'blocked',
            blockedBy: user.uid,
            createdAt: serverTimestamp()
          });
        }
      });

      await batch.commit();
      setIsBlockRangeOpen(false);
    } catch (err) {
      console.error("Error batch blocking:", err);
    }
  };

  const handleDeleteBooking = async (id, confirmMsg) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setFoundBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleSearchBookings = (e) => {
    e.preventDefault();
    const results = appointments.filter(
      app => app.phone === cancelPhone && app.type === 'booking'
    );
    results.sort((a, b) => new Date(a.date) - new Date(b.date) || a.hour.localeCompare(b.hour));
    setFoundBookings(results);
    setHasSearched(true);
  };

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
    setCancelPhone('');
    setFoundBookings([]);
    setHasSearched(false);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(viewMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewMonth(newDate);
  };

  const changeWeek = (offset) => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setWeekStartDate(newDate);
  };

  // --- Renderers ---

  const renderWeekView = () => {
    // Generate dates for the week (Start from Sunday or Monday? Let's do Sunday for standard calendar view)
    const dates = [];
    const start = new Date(weekStartDate);
    // Adjust to Sunday of the current week
    start.setDate(start.getDate() - start.getDay()); 
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(formatDate(d));
    }

    // Determine all possible time slots for the week view (union of all daily slots)
    // We know max range is 9am-5pm
    const allSlots = [];
    for (let h = 9; h <= 16; h++) {
        for (let m = 0; m < 60; m += 30) { // Changed from 15 to 30
            // Cap at 16:00 to keep grid clean
            if (h === 16 && m > 0) break;
            allSlots.push(`${h}:${m === 0 ? '00' : m}`);
        }
    }

    return (
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
           <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-stone-100 rounded-full"><ChevronLeft size={20}/></button>
           <div className="font-bold text-lg text-emerald-900">
             {new Date(dates[0]).toLocaleDateString()} - {new Date(dates[6]).toLocaleDateString()}
           </div>
           <button onClick={() => changeWeek(1)} className="p-2 hover:bg-stone-100 rounded-full"><ChevronRight size={20}/></button>
        </div>

        <div className="min-w-[800px] bg-white border border-stone-200 text-xs">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-stone-200 bg-stone-50">
            <div className="p-2 font-bold text-stone-400 text-center border-r">Time</div>
            {dates.map(dateStr => {
               const d = parseLocal(dateStr);
               return (
                 <div key={dateStr} className={`p-2 text-center border-r font-bold ${d.getDay() === 0 ? 'bg-stone-100 text-stone-400' : 'text-emerald-900'}`}>
                   {d.toLocaleDateString(lang === 'en'?'en-US':'zh-TW', {weekday:'short'})} <br/>
                   {d.getDate()}
                 </div>
               );
            })}
          </div>

          {/* Time Rows */}
          {allSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b border-stone-100 h-10 hover:bg-stone-50">
              <div className="p-2 text-center border-r font-mono text-stone-500 flex items-center justify-center bg-stone-50">
                {time}
              </div>
              {dates.map(dateStr => {
                const day = parseLocal(dateStr).getDay();
                if (day === 0) return <div key={dateStr} className="bg-stone-100 border-r"></div>;
                
                const [h, m] = time.split(':').map(Number);
                // M-F ends at 16:00
                if (day >= 1 && day <= 5) {
                    if (h > 16 || (h === 16 && m > 0)) return <div key={dateStr} className="bg-stone-100 border-r"></div>;
                }
                // Sat ends at 15:00
                if (day === 6) {
                    if (h > 15 || (h === 15 && m > 0)) return <div key={dateStr} className="bg-stone-100 border-r"></div>;
                }

                const { isBlocked, bookings } = getSlotData(dateStr, time);
                const isBooked = bookings.length > 0;

                return (
                  <div 
                    key={dateStr} 
                    className={`border-r p-1 transition-colors cursor-pointer flex items-center justify-center
                      ${isBlocked ? 'bg-stone-200' : isBooked ? 'bg-emerald-100' : 'hover:bg-emerald-50'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isBooked) {
                        setSelectedBookingDetails(bookings[0]);
                      } else {
                        toggleBlockSlot(dateStr, time, isBlocked);
                      }
                    }}
                    title={isBooked ? `${bookings[0].name}\n${bookings[0].phone}\n${bookings[0].email}` : isBlocked ? 'Blocked' : 'Available'}
                  >
                    {isBlocked && <X size={12} className="text-stone-400"/>}
                    {isBooked && (
                      <div className="text-[10px] leading-tight text-emerald-900 font-bold truncate w-full text-center">
                        {bookings[0].firstName || bookings[0].name} 
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointments = () => (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <div className="bg-emerald-900 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t.bookingTitle}</h2>
        <p className="text-emerald-100 max-w-2xl mx-auto">{t.bookingSubtitle}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {isAdmin && viewMode === 'week' ? (
           <>
             <div className="mb-6 flex justify-end">
               <button 
                 onClick={() => setViewMode('day')} 
                 className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold transition-colors"
               >
                 <List size={14}/> {t.dayView}
               </button>
             </div>
             {renderWeekView()}
           </>
        ) : renderDailyView()}
      </div>
    </div>
  );

  const renderWhatWeTreat = () => (
    <div className="animate-in fade-in duration-500 py-16 px-6">
      <SectionHeader title={t.whatWeTreatPage.title} subtitle={t.whatWeTreatPage.subtitle} />
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-4">
            {t.whatWeTreatPage.list.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100 hover:border-emerald-200 transition-colors">
                    <div className="mt-1 text-emerald-600 shrink-0">
                        <CheckCircle2 size={20} />
                    </div>
                    <p className="text-stone-700 leading-relaxed">{item}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const getServiceIcon = (index) => {
    if (index % 4 === 0) return <Leaf size={32} />;
    if (index % 4 === 1) return <Activity size={32} />;
    if (index % 4 === 2) return <Heart size={32} />;
    return <Star size={32} />;
  };

  const renderServices = () => (
    <div className="animate-in fade-in duration-500 py-16 px-6">
      <SectionHeader title={t.servicesPage.title} subtitle={t.servicesPage.subtitle} />
      <div className="max-w-4xl mx-auto grid gap-8">
        {t.servicesPage.list.map((s, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 border-b border-stone-100 last:border-0">
             <div className="w-16 h-16 bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0 rounded-sm">
                {s.title.includes('Tuina') ? <HelpingHand size={32} /> : getServiceIcon(i)}
             </div>
             <div>
               <h3 className="text-xl font-serif font-bold text-emerald-900 mb-2">{s.title}</h3>
               <p className="text-stone-600 leading-relaxed">{s.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in duration-500 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title={t.aboutPage.title} />
        <div className="flex flex-col md:flex-row gap-12 items-center">
           <div className="md:w-1/2">
              <div className="aspect-square bg-stone-200 relative overflow-hidden">
                 <div className="absolute inset-0 bg-emerald-900/10"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-emerald-900/20">
                    <MapPin size={64} />
                 </div>
              </div>
           </div>
           <div className="md:w-1/2 space-y-6 text-stone-600 text-lg leading-relaxed">
             <p>{t.aboutPage.p1}</p>
             <p>{t.aboutPage.p2}</p>
             <p>{t.aboutPage.p3}</p>
             <p>{t.aboutPage.p4}</p>
             <p>{t.aboutPage.p5}</p>
             <p>{t.aboutPage.p6}</p>
             <p>{t.aboutPage.p7}</p>
             <div className="flex gap-6 mt-8 pt-8 border-t border-stone-200">
               {t.aboutPage.stats.map((stat, i) => (
                 <div key={i}>
                   <div className="text-2xl font-bold text-emerald-800 font-serif">{stat}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500">
      <div className="relative bg-stone-100 h-[500px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80"></div>
         <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
           <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight tracking-wide">
             {t.heroTitle}
           </h1>
           <p className="text-emerald-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
             {t.heroSubtitle}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button onClick={() => setCurrentPage('appointments')} className="bg-white text-emerald-900 px-8 py-4 rounded-sm font-semibold tracking-widest hover:bg-emerald-50 transition-all uppercase text-sm">
               {t.bookNow}
             </button>
             <button onClick={() => setCurrentPage('about')} className="border border-white text-white px-8 py-4 rounded-sm font-semibold tracking-widest hover:bg-white/10 transition-all uppercase text-sm">
               {t.learnMore}
             </button>
           </div>
         </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">{t.welcomeTitle}</h2>
        <div className="h-0.5 w-20 bg-emerald-600 mx-auto mb-8"></div>
        <p className="text-stone-600 text-lg leading-loose">{t.welcomeText}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
             <span className="flex items-center gap-1"><Phone size={12}/> 508-628-1888</span>
             <span className="flex items-center gap-1"><Printer size={12}/> Fax: 508-628-1889</span>
             <span className="hidden sm:flex items-center gap-1"><MapPin size={12}/> 655 Concord St, Framingham 01702</span>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="hover:text-white transition-colors">
               {lang === 'en' ? '中文' : 'English'}
             </button>
             {isAdmin && (
               <button onClick={() => setIsSettingsOpen(true)} className="hover:text-white transition-colors"><Settings size={14}/></button>
             )}
             {!isAdmin ? (
               <button onClick={() => setIsAdminLoginOpen(true)} className="hover:text-white transition-colors">{t.login}</button>
             ) : (
               <button onClick={() => setIsAdmin(false)} className="text-red-300 hover:text-red-200">{t.logout}</button>
             )}
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-900 flex items-center justify-center text-white">
              <span className="font-serif italic font-bold text-2xl">W</span>
            </div>
            <div className="text-left">
              <h1 className="font-serif font-bold text-xl md:text-2xl text-emerald-950 tracking-tight">
                {t.title}
              </h1>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {['home', 'services', 'whatWeTreat', 'about', 'appointments'].map(page => (
               <button 
                 key={page}
                 onClick={() => setCurrentPage(page)} 
                 className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-emerald-800 ${
                   currentPage === page ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500'
                 }`}
               >
                 {t.menu[page]}
               </button>
            ))}
            {!isAdmin && (
               <button onClick={openCancelModal} className="text-stone-400 hover:text-emerald-800">
                 <Search size={18} />
               </button>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-stone-600 p-1">
             {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-stone-50 border-t border-stone-200 p-6 space-y-4">
            {['home', 'services', 'whatWeTreat', 'about', 'appointments'].map(page => (
              <button 
                key={page}
                onClick={() => { setCurrentPage(page); setIsMobileMenuOpen(false); }} 
                className="block w-full text-left font-bold text-emerald-900 uppercase tracking-widest"
              >
                {t.menu[page]}
              </button>
            ))}
            <button onClick={() => { openCancelModal(); setIsMobileMenuOpen(false); }} className="block w-full text-left font-bold text-stone-500 uppercase tracking-widest text-sm pt-4 border-t border-stone-200">
              {t.myBookings}
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'services' && renderServices()}
        {currentPage === 'whatWeTreat' && renderWhatWeTreat()}
        {currentPage === 'appointments' && renderAppointments()}
        {currentPage === 'testimonials' && (
           <div className="animate-in fade-in duration-500 py-16 px-6">
             <SectionHeader title={t.testimonialsPage.title} />
             <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
               {t.testimonialsPage.list.map((item, i) => (
                 <div key={i} className="bg-stone-50 p-8 border border-stone-100">
                   <div className="text-emerald-800 mb-4 flex"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                   <p className="text-stone-700 italic mb-4 font-serif text-lg">"{item.text}"</p>
                   <div className="font-bold text-emerald-900 uppercase tracking-wide text-sm">- {item.name}</div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
           <div>
             <h4 className="text-white font-serif font-bold text-lg mb-4">{t.title}</h4>
             <p className="mb-4">Integrative wellness solutions for modern life.</p>
             <p>{t.footer}</p>
           </div>
           <div>
             <h4 className="text-white font-bold uppercase tracking-widest mb-4">Contact</h4>
             <p>655 Concord Street, Framingham 01702</p>
             <p>508-628-1888</p>
             <p>Fax: 508-628-1889</p>
           </div>
           <div>
             <h4 className="text-white font-bold uppercase tracking-widest mb-4">Hours</h4>
             <p>Mon - Fri: 9:00 AM - 4:00 PM</p>
             <p>Sat: 9:00 AM - 3:00 PM</p>
             <p>Sun: Closed</p>
           </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title={`${t.bookSlot}: ${selectedSlot}`}>
        <form onSubmit={submitBooking} className="space-y-5">
          <div className="p-4 bg-stone-600 text-stone-600 text-sm border-l-4 border-emerald-600">
             <p>{t.enterDetails}</p>
             <p className="mt-1 font-bold text-red-500 text-xs">{t.requiredFields}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.firstName} *</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder={lang === 'en' ? "Jane" : "大文"} />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.lastName} *</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder={lang === 'en' ? "Doe" : "陳"} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.phone} *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder="555-123-4567" />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.email} *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder="jane@example.com" />
          </div>
          {formError && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 flex items-center gap-2"><XCircle size={16}/> {formError}</div>}
          <div className="flex gap-4 pt-2">
            <button 
              type="submit" 
              disabled={!(firstName.trim() && lastName.trim() && phone.trim() && email.trim())}
              className={`flex-1 py-3 font-bold uppercase tracking-widest transition-colors shadow-lg ${
                (firstName.trim() && lastName.trim() && phone.trim() && email.trim())
                  ? 'bg-emerald-900 text-white hover:bg-emerald-800'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {t.confirm}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title={t.findBooking}>
        <div className="space-y-5">
          <p className="text-sm text-stone-500">{t.enterPhoneToFind}</p>
          <form onSubmit={handleSearchBookings} className="flex gap-2">
            <input type="tel" value={cancelPhone} onChange={(e) => setCancelPhone(e.target.value)} className="flex-1 px-4 py-3 border border-stone-200 bg-stone-50 focus:border-emerald-500 outline-none" placeholder={t.phone} required />
            <button type="submit" className="px-6 py-3 bg-stone-800 text-white font-bold uppercase tracking-widest hover:bg-stone-900 transition-colors">{t.search}</button>
          </form>
          {hasSearched && (
            <div className="mt-4 animate-in fade-in">
              {foundBookings.length === 0 ? (
                <div className="text-center py-8 text-stone-400 border border-stone-100 bg-stone-50"><p>{t.noBookings}</p></div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {foundBookings.map(app => (
                    <div key={app.id} className="bg-white border border-stone-200 p-4 flex justify-between items-center group shadow-sm hover:border-emerald-200 transition-colors">
                       <div><div className="font-bold text-emerald-900 font-serif text-lg">{app.date}</div><div className="text-sm text-stone-500">{app.hour} - {app.name}</div></div>
                       <button onClick={() => handleDeleteBooking(app.id, t.confirmCancel)} className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 font-bold uppercase tracking-wider transition-colors">{t.cancel}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Admin Login Modal */}
      <Modal isOpen={isAdminLoginOpen} onClose={() => { setIsAdminLoginOpen(false); setFormError(''); }} title={t.adminMode}>
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div className="text-center mb-4">
             <div className="inline-block p-3 bg-stone-100 rounded-full mb-2"><Lock size={24} className="text-stone-400"/></div>
             <p className="text-sm text-stone-500">Authorized personnel only.</p>
          </div>
          <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none text-center tracking-widest" placeholder="• • • •" autoFocus />
          {formError && <div className="text-red-600 text-sm font-medium text-center">{formError}</div>}
          <button type="submit" className="w-full py-3 bg-stone-800 text-white font-bold uppercase tracking-widest hover:bg-stone-900 transition-colors">{t.login}</button>
        </form>
      </Modal>

      {/* Admin Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t.settings}>
        <form onSubmit={saveSettings} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.daysAheadLabel}</label>
            <input 
              type="number" 
              value={settings.bookingWindowWeeks || ''} 
              onChange={(e) => setSettings({...settings, bookingWindowWeeks: e.target.value})} 
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none" 
              placeholder="e.g. 4"
            />
            <p className="text-xs text-stone-500 mt-2">{t.daysAheadDesc}</p>
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-900 text-white font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shadow-lg">{t.save}</button>
        </form>
      </Modal>

      {/* Admin Block Range Modal */}
      <Modal isOpen={isBlockRangeOpen} onClose={() => setIsBlockRangeOpen(false)} title={t.blockRangeTitle}>
        <form onSubmit={handleRangeBlockSubmit} className="space-y-5">
          <div className="p-3 bg-red-50 text-red-700 text-xs border-l-4 border-red-500 rounded">
             <p>This will block all slots between the selected times for <strong>{selectedDate}</strong>.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.startTime}</label>
              <select 
                value={blockStartTime} 
                onChange={(e) => setBlockStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none"
              >
                {/* Dynamically get slots for current date to populate dropdown */}
                {getDailySlots(selectedDate).length > 0 
                  ? getDailySlots(selectedDate).map(t => <option key={t} value={t}>{t}</option>)
                  : <option disabled>No slots</option>
                }
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.endTime}</label>
              <select 
                value={blockEndTime} 
                onChange={(e) => setBlockEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none"
              >
                {getDailySlots(selectedDate).length > 0 
                  ? getDailySlots(selectedDate).map(t => <option key={t} value={t}>{t}</option>)
                  : <option disabled>No slots</option>
                }
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-red-700 text-white font-bold uppercase tracking-widest hover:bg-red-800 transition-colors shadow-lg">{t.blockConfirm}</button>
        </form>
      </Modal>

      {/* Booking Details Modal (Week View) */}
      <Modal 
        isOpen={!!selectedBookingDetails} 
        onClose={() => setSelectedBookingDetails(null)} 
        title={t.apptDetails}
      >
        {selectedBookingDetails && (
          <div className="space-y-4">
             <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
               {/* Handles both new 'firstName' and legacy 'name' formats */}
               <p className="font-bold text-emerald-900 text-lg">{selectedBookingDetails.firstName ? `${selectedBookingDetails.firstName} ${selectedBookingDetails.lastName}` : selectedBookingDetails.name}</p>
               <p className="text-sm text-stone-600">{selectedBookingDetails.date} at {selectedBookingDetails.hour}</p>
             </div>
             <div className="space-y-2">
               <div className="flex items-center gap-3 text-stone-600">
                 <Phone size={16} />
                 <a href={`tel:${selectedBookingDetails.phone}`} className="hover:text-emerald-800 underline">{selectedBookingDetails.phone}</a>
               </div>
               <div className="flex items-center gap-3 text-stone-600">
                 <Mail size={16} />
                 <a href={`mailto:${selectedBookingDetails.email}`} className="hover:text-emerald-800 underline">{selectedBookingDetails.email}</a>
               </div>
             </div>
             <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button 
                  onClick={() => {
                    handleDeleteBooking(selectedBookingDetails.id, t.confirmCancel);
                    setSelectedBookingDetails(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-bold"
                >
                  <Trash2 size={16}/> Cancel Appointment
                </button>
             </div>
          </div>
        )}
      </Modal>

    </div>
  );
}