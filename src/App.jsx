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
  serverTimestamp
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle, 
  XCircle, 
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
  ArrowRight
} from 'lucide-react';

// --- Step 5: You will update this section with your keys ---
// For now, these are placeholders. The app will load but data won't save 
// until you replace this with your actual config from Firebase Console.

const firebaseConfig = {
  apiKey: "AIzaSyDJosQQhRGcebaxJQ37gNTnqXawsYHO9oI",
  authDomain: "harmony-acupuncture.firebaseapp.com",
  projectId: "harmony-acupuncture",
  storageBucket: "harmony-acupuncture.firebasestorage.app",
  messagingSenderId: "78608558880",
  appId: "1:78608558880:web:adbb1fe3596d2b88c58545"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Translations ---
const TRANSLATIONS = {
  en: {
    menu: {
      home: "Home",
      appointments: "Appointments",
      services: "Services",
      about: "About",
      testimonials: "Testimonials"
    },
    title: "Harmony Acupuncture",
    subtitle: "Integrative Medicine & Wellness",
    login: "Staff Login",
    logout: "Logout",
    heroTitle: "Balance Your Body, Heal Your Mind",
    heroSubtitle: "Experience the profound benefits of traditional acupuncture in a modern, serene setting.",
    bookNow: "Book an Appointment",
    learnMore: "Learn More",
    welcomeTitle: "Welcome to Harmony",
    welcomeText: "We are dedicated to providing personalized care that addresses the root cause of your health concerns. Our clinic offers a sanctuary for healing, combining ancient wisdom with modern medical understanding.",
    bookingTitle: "Schedule Your Visit",
    bookingSubtitle: "Select a time that works for you. 5 private treatment suites available hourly.",
    selectDate: "Select Date",
    slotsAvailable: "suites left",
    full: "Full",
    blocked: "Reserved",
    bookSlot: "Request Appointment",
    name: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    enterDetails: "Patient Details",
    confirm: "Confirm Request",
    cancel: "Cancel",
    adminMode: "Admin Portal",
    adminPass: "Access Code",
    bookingSuccess: "Appointment Requested",
    viewBookings: "Scheduled Patients",
    noBookings: "No appointments scheduled for this slot.",
    myBookings: "My Appointments",
    findBooking: "Manage My Appointments",
    enterPhoneToFind: "Enter your phone number to find existing appointments.",
    search: "Find Appointments",
    cancelAppt: "Cancel",
    confirmCancel: "Cancel this appointment?",
    past: "Past",
    footer: "© 2024 Harmony Acupuncture. All rights reserved.",
    servicesPage: {
      title: "Our Specialties",
      subtitle: "Comprehensive care for your well-being",
      list: [
        { title: "Acupuncture", desc: "Stimulate your body's natural healing abilities to reduce pain and inflammation." },
        { title: "Cupping", desc: "Improve blood flow and relaxation with traditional vacuum therapy." },
        { title: "Herbal Medicine", desc: "Custom herbal formulas tailored to your specific constitution." },
        { title: "Fertility Support", desc: "Specialized treatments to support reproductive health and wellness." }
      ]
    },
    aboutPage: {
      title: "Our Philosophy",
      p1: "Founded on the principles of compassion and integrity, Harmony Acupuncture has served the community for over 15 years. We strive to create a partnership with every patient.",
      p2: "Our practitioners are licensed and board-certified, bringing decades of combined experience to your treatment plan.",
      stats: ["15+ Years", "5k+ Patients", "Licensed Pros"]
    },
    testimonialsPage: {
      title: "Patient Stories",
      list: [
        { name: "Sarah J.", text: "The most relaxing medical experience I've ever had. My back pain is finally manageable without medication." },
        { name: "Michael C.", text: "Professional, clean, and incredibly effective. I recommend Harmony to everyone I know." },
        { name: "Emily R.", text: "Dr. Wei really listens. I felt heard and cared for from the moment I walked in." }
      ]
    }
  },
  zh: {
    menu: {
      home: "首頁",
      appointments: "線上預約",
      services: "服務項目",
      about: "關於我們",
      testimonials: "見證"
    },
    title: "和諧針灸中心",
    subtitle: "中西醫結合 • 全人健康",
    login: "員工登入",
    logout: "登出",
    heroTitle: "調理身心，恢復平衡",
    heroSubtitle: "在現代舒適的環境中，體驗傳統針灸的深層療效。",
    bookNow: "立即預約",
    learnMore: "了解更多",
    welcomeTitle: "歡迎來到和諧",
    welcomeText: "我們致力於提供個性化的護理，解決您健康問題的根源。我們的診所結合了古老的智慧與現代醫學，為您提供一個療癒的避風港。",
    bookingTitle: "預約您的診療",
    bookingSubtitle: "選擇適合您的時間。每日提供5間私人治療室。",
    selectDate: "選擇日期",
    slotsAvailable: "個名額",
    full: "已滿",
    blocked: "保留",
    bookSlot: "預約時段",
    name: "姓名",
    phone: "電話號碼",
    email: "電子郵件",
    enterDetails: "患者資料",
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
    footer: "© 2024 和諧針灸中心 版權所有",
    servicesPage: {
      title: "專業服務",
      subtitle: "為您量身定制的整體療法",
      list: [
        { title: "傳統針灸", desc: "激發身體的自然癒合能力，減少疼痛和炎症。" },
        { title: "拔罐療法", desc: "利用真空療法促進血液循環和肌肉放鬆。" },
        { title: "中藥調理", desc: "根據您的體質定制的草本配方。" },
        { title: "助孕調理", desc: "支持生殖健康和福祉的專業治療。" }
      ]
    },
    aboutPage: {
      title: "我們的理念",
      p1: "和諧針灸中心建立在同情和誠信的原則之上，服務社區已超過15年。我們致力於與每一位患者建立夥伴關係。",
      p2: "我們的醫師均持有執照和委員會認證，為您的治療計劃帶來數十年的綜合經驗。",
      stats: ["15年+ 經驗", "5000+ 患者", "認證專家"]
    },
    testimonialsPage: {
      title: "患者心聲",
      list: [
        { name: "Sarah J.", text: "這是我經歷過最放鬆的醫療體驗。我的背痛終於在不吃藥的情況下得到了控制。" },
        { name: "Michael C.", text: "專業、乾淨，而且非常有效。我向所有認識的人推薦和諧針灸。" },
        { name: "Emily R.", text: "魏醫生真的很用心聽。從我走進來的那一刻起，我就感到了被關心。" }
      ]
    }
  }
};

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const MAX_SLOTS = 5;

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
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [viewMonth, setViewMonth] = useState(new Date());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [formError, setFormError] = useState('');

  const [cancelPhone, setCancelPhone] = useState('');
  const [foundBookings, setFoundBookings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // Basic anonymous auth
    signInAnonymously(auth).catch(err => console.error("Auth error:", err));
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) return;
    
    // Using a simpler collection path for your local project
    const q = collection(db, 'appointments');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    }, (error) => console.error("Error fetching appointments:", error));
    
    return () => unsubscribe();
  }, [user]);

  const getSlotData = (hour) => {
    const slotAppointments = appointments.filter(
      app => app.date === selectedDate && app.hour === hour
    );
    const isBlocked = slotAppointments.some(app => app.type === 'blocked');
    const bookings = slotAppointments.filter(app => app.type === 'booking');
    const remaining = MAX_SLOTS - bookings.length;
    return { isBlocked, bookings, remaining: isBlocked ? 0 : remaining };
  };

  const handleBookClick = (hour) => {
    setSelectedSlot(hour);
    setIsBookingModalOpen(true);
    setFormError('');
    setEmail('');
    setName('');
    setPhone('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setFormError(lang === 'en' ? 'Name and Phone are required' : '姓名和電話為必填');
      return;
    }
    try {
      await addDoc(collection(db, 'appointments'), {
        date: selectedDate,
        hour: selectedSlot,
        type: 'booking',
        name,
        phone,
        email,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setIsBookingModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Booking failed. Please try again.');
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

  const toggleBlockSlot = async (hour, isCurrentlyBlocked) => {
    if (!isAdmin) return;
    try {
      if (isCurrentlyBlocked) {
        const blockDoc = appointments.find(
          app => app.date === selectedDate && app.hour === hour && app.type === 'blocked'
        );
        if (blockDoc) {
          await deleteDoc(doc(db, 'appointments', blockDoc.id));
        }
      } else {
        await addDoc(collection(db, 'appointments'), {
          date: selectedDate,
          hour: hour,
          type: 'blocked',
          blockedBy: user.uid,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Error toggling block:", err);
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
    results.sort((a, b) => new Date(a.date) - new Date(b.date) || a.hour - b.hour);
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

  // Safe icon renderer
  const getServiceIcon = (index) => {
    // Return the component directly, not in an array
    if (index % 4 === 0) return <Leaf size={32} />;
    if (index % 4 === 1) return <Activity size={32} />;
    if (index % 4 === 2) return <Heart size={32} />;
    return <Star size={32} />;
  };

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

      <div className="bg-stone-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title={t.servicesPage.title} />
          <div className="grid md:grid-cols-3 gap-8">
            {t.servicesPage.list.slice(0, 3).map((s, i) => (
              <div key={i} className="bg-white p-8 shadow-sm border-t-4 border-emerald-800 hover:shadow-md transition-shadow">
                <div className="mb-4 text-emerald-700">
                  {getServiceIcon(i)}
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">{s.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-4">{s.desc}</p>
                <button onClick={() => setCurrentPage('services')} className="text-emerald-700 text-sm font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <div className="bg-emerald-900 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t.bookingTitle}</h2>
        <p className="text-emerald-100 max-w-2xl mx-auto">{t.bookingSubtitle}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="bg-white p-6 shadow-lg border border-stone-100 sticky top-24">
              <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2 uppercase tracking-wide text-sm border-b border-stone-100 pb-2">
                <Calendar size={16} /> {t.selectDate}
              </h3>
              
              <div className="mb-6">
                 <div className="flex justify-between items-center mb-4">
                   <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500"><ChevronLeft size={20}/></button>
                   <span className="font-bold text-stone-700">
                     {viewMonth.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: 'long' })}
                   </span>
                   <button onClick={() => changeMonth(1)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500"><ChevronRight size={20}/></button>
                 </div>
                 
                 <div className="grid grid-cols-7 text-center mb-2">
                   {(lang === 'en' ? ['S','M','T','W','T','F','S'] : ['日','一','二','三','四','五','六']).map(d => (
                     <div key={d} className="text-xs font-bold text-stone-400">{d}</div>
                   ))}
                 </div>
                 
                 <div className="grid grid-cols-7 gap-1">
                   {(() => {
                     const year = viewMonth.getFullYear();
                     const month = viewMonth.getMonth();
                     const firstDay = new Date(year, month, 1);
                     const lastDay = new Date(year, month + 1, 0);
                     const startDay = firstDay.getDay();
                     const slots = [];
                     for(let i=0; i<startDay; i++) slots.push(<div key={`empty-${i}`} />);
                     for(let i=1; i<=lastDay.getDate(); i++) {
                       const date = new Date(year, month, i);
                       const dateStr = formatDate(date);
                       const isSelected = dateStr === selectedDate;
                       const isPast = date < new Date(new Date().setHours(0,0,0,0));
                       slots.push(
                         <button
                           key={dateStr}
                           onClick={() => !isPast && setSelectedDate(dateStr)}
                           disabled={isPast}
                           className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                             isSelected ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-50 text-stone-600'
                           } ${isPast ? 'text-stone-300 cursor-not-allowed opacity-50 hover:bg-transparent' : ''}`}
                         >
                           {i}
                         </button>
                       );
                     }
                     return slots;
                   })()}
                 </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-lg font-bold text-emerald-900 mb-6 uppercase tracking-wide text-sm border-b border-stone-200 pb-2 flex justify-between items-center">
              <span>Available Times</span>
              <span className="text-xs normal-case text-stone-500 font-normal">Eastern Standard Time</span>
            </h3>
            <div className="space-y-4">
              {HOURS.map((hour) => {
                const { isBlocked, remaining, bookings } = getSlotData(hour);
                const now = new Date();
                const isToday = selectedDate === formatDate(now);
                const isPastTime = isToday && hour <= now.getHours();
                const isFull = remaining === 0;
                
                return (
                  <div key={hour} className="bg-white border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-emerald-200 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Clock size={18} className="text-emerald-700" />
                        <span className="text-xl font-serif font-bold text-stone-800">{hour}:00 - {hour + 1}:00</span>
                      </div>
                      <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                         {isBlocked ? (
                           <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{t.blocked}</span>
                         ) : isPastTime ? (
                           <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{t.past}</span>
                         ) : isFull ? (
                           <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded">{t.full}</span>
                         ) : (
                           <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{remaining} {t.slotsAvailable}</span>
                         )}
                      </div>
                    </div>

                    {!isAdmin ? (
                      <button
                        onClick={() => handleBookClick(hour)}
                        disabled={isFull || isBlocked || isPastTime}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all min-w-[140px] ${
                          isFull || isBlocked || isPastTime
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm'
                        }`}
                      >
                        {isBlocked || isFull || isPastTime ? 'Unavailable' : 'Select'}
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => toggleBlockSlot(hour, isBlocked)} className="text-xs bg-stone-200 hover:bg-stone-300 px-3 py-2 font-bold uppercase">{isBlocked ? t.unblock : t.blockHour}</button>
                      </div>
                    )}
                    
                    {isAdmin && bookings.length > 0 && (
                      <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 sm:border-l sm:border-stone-100 sm:pl-4">
                        {bookings.map(b => (
                          <div key={b.id} className="text-xs mb-1 flex items-center justify-between gap-2 bg-stone-50 p-1.5 rounded">
                             <div className="overflow-hidden">
                               <div className="font-bold truncate">{b.name}</div>
                               <div className="text-stone-500">{b.phone}</div>
                             </div>
                             <div className="flex gap-1">
                               <a href={`tel:${b.phone}`} className="p-1 bg-white border hover:bg-emerald-50"><Phone size={10}/></a>
                               <button onClick={() => handleDeleteBooking(b.id)} className="p-1 bg-white border hover:bg-red-50 text-red-600"><Trash2 size={10}/></button>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="animate-in fade-in duration-500 py-16 px-6">
      <SectionHeader title={t.servicesPage.title} subtitle={t.servicesPage.subtitle} />
      <div className="max-w-4xl mx-auto grid gap-8">
        {t.servicesPage.list.map((s, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 border-b border-stone-100 last:border-0">
             <div className="w-16 h-16 bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0 rounded-sm">
                {getServiceIcon(i)}
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

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
             <span className="flex items-center gap-1"><Phone size={12}/> 617-555-0123</span>
             <span className="hidden sm:flex items-center gap-1"><MapPin size={12}/> 123 Wellness Ave, Boston, MA</span>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="hover:text-white transition-colors">
               {lang === 'en' ? '中文' : 'English'}
             </button>
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
              <span className="font-serif italic font-bold text-2xl">H</span>
            </div>
            <div className="text-left">
              <h1 className="font-serif font-bold text-2xl text-emerald-950 tracking-tight">
                {t.title}
              </h1>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {['home', 'services', 'about', 'appointments'].map(page => (
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
            {['home', 'services', 'about', 'appointments'].map(page => (
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
             <p>123 Wellness Ave, Boston, MA 02116</p>
             <p>info@harmonyacupuncture.com</p>
             <p>617-555-0123</p>
           </div>
           <div>
             <h4 className="text-white font-bold uppercase tracking-widest mb-4">Hours</h4>
             <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
             <p>Sat: 10:00 AM - 4:00 PM</p>
             <p>Sun: Closed</p>
           </div>
        </div>
      </footer>

      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title={`${t.bookSlot}: ${selectedSlot}:00`}>
        <form onSubmit={submitBooking} className="space-y-5">
          <div className="p-4 bg-stone-50 text-stone-600 text-sm border-l-4 border-emerald-600">
             <p>{t.enterDetails}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.name}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder={lang === 'en' ? "Jane Doe" : "陳大文"} />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.phone}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder="555-123-4567" />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder="jane@example.com" />
          </div>
          {formError && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 flex items-center gap-2"><XCircle size={16}/> {formError}</div>}
          <div className="flex gap-4 pt-2">
            <button type="submit" className="flex-1 py-3 bg-emerald-900 text-white font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shadow-lg">{t.confirm}</button>
          </div>
        </form>
      </Modal>

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
                       <div><div className="font-bold text-emerald-900 font-serif text-lg">{app.date}</div><div className="text-sm text-stone-500">{app.hour}:00 - {app.name}</div></div>
                       <button onClick={() => handleDeleteBooking(app.id, t.confirmCancel)} className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 font-bold uppercase tracking-wider transition-colors">{t.cancel}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

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

    </div>
  );
}